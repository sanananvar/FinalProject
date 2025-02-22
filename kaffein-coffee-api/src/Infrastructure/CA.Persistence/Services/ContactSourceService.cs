using CA.Application.DTOs.CarouselDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ContactSourceDTOs;
using CA.Application.Exceptions.Common;
using CA.Application.Repositories;
using CA.Application.Services;
using CA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Services;

public class ContactSourceService(IContactSourceRepository contactSourceRepository,
                                  ILanguageRepository languageRepository) : IContactSourceService
{
    readonly string culture = string.Empty;

    public async Task CreateAsync(ContactSourcePostDto dto)
    {
        if (dto is null)
        {
            throw new NullReferenceException(nameof(CarouselPostDto));
        }

        ContactSource entity = new ContactSource()
        {
            CreatedAt = DateTime.UtcNow.AddHours(4),
        };

        foreach (var dictionaryDto in dto.ContactSourceDictionaries)
        {
            // Fetch the language entity based on the provided LanguageId
            var language = await languageRepository.GetAsync(x => x.Id == dictionaryDto.LanguageId, false, false);
            if (language == null)
            {
                throw new NotFoundException($"Language with Id {dictionaryDto.LanguageId} not found.");
            }

            // Create the CountryDictionary and set the Language
            var carouselDictionary = new ContactSourceDictionary
            {
                LanguageId = dictionaryDto.LanguageId,
                Name = dictionaryDto.Name,
                Language = language, // Automatically set the Language entity
                CreatedAt = DateTime.UtcNow.AddHours(4),
            };

            entity.ContactSourceDictionaries.Add(carouselDictionary);
        }

        await contactSourceRepository.AddAsync(entity);
        await contactSourceRepository.SaveAsync();
    }

    public async Task<PaginatedResponse<ContactSourceGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true)
    {
        var query = contactSourceRepository.GetQuery(null, false, true, "ContactSourceDictionaries.Language");

        query = !isAdmin
             ? query.Where(x => !x.IsDeleted)
             : query;

        if (isPagination)
        {
            query = query.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        var itemsGetDto = query.Select(x => new ContactSourceGetAllDto
        {
            Id = x.Id,
            ContactSourceDictionaries = x.ContactSourceDictionaries.Select(cd => new ContactSourceDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToList(),
            IsDeleted = x.IsDeleted,
        }).ToList();

        int totalPages = (int)Math.Ceiling(query.ToList().Count / (double)pageSize);

        var paginatedResponse = new PaginatedResponse<ContactSourceGetAllDto>
        {
            Items = itemsGetDto,
            TotalItems = query.ToList().Count,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };

        return paginatedResponse;
    }

    public async Task<ContactSourceGetDto> GetAsync(int id, bool isAdmin = true)
    {
        var query = contactSourceRepository.GetQuery(x => x.Id == id, false, true, "ContactSourceDictionaries.Language");

        query = !isAdmin
             ? query.Where(x => !x.IsDeleted)
             : query;

        ContactSourceGetDto? contactSourceGetDto = await query.Select(x => new ContactSourceGetDto
        {
            Id = x.Id,
            ContactSourceDictionaries = x.ContactSourceDictionaries.Select(cd => new ContactSourceDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToList(),
            IsDeleted = x.IsDeleted,
        }).FirstOrDefaultAsync();

        if (contactSourceGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }

        return contactSourceGetDto;
    }

    public async Task<ContactSourceGetDto> GetWithAllLanguagesAsync(int id)
    {
        var query = contactSourceRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "CarouselDictionaries.Language");

        ContactSourceGetDto? contactSourceGetDto = await query.Select(x => new ContactSourceGetDto
        {
            Id = x.Id,

            ContactSourceDictionaries = x.ContactSourceDictionaries.OrderBy(x => x.LanguageId).Select(d => new ContactSourceDictionaryGetAllDto
            {
                Id = d.Id,
                LanguageId = d.LanguageId,
                Name = d.Name
            }).ToList()
        }).FirstOrDefaultAsync();

        if (contactSourceGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }

        return contactSourceGetDto;
    }

    public async Task RemoveAsync(int id)
    {
        var entity = await contactSourceRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await contactSourceRepository.UpdateAsync(entity);
        await contactSourceRepository.SaveAsync();
    }

    public async Task RevertAsync(int id)
    {
        var entity = await contactSourceRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = false;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await contactSourceRepository.UpdateAsync(entity);
        await contactSourceRepository.SaveAsync();
    }

    public async Task UpdateAsync(ContactSourceUpdateDto dto, int id)
    {
        var contactSource = await contactSourceRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "ContactSourceDictionaries.Language").FirstOrDefaultAsync();

        if (contactSource == null)
        {
            throw new NotFoundException("Not found Service");
        }

        var existingLanguageIds = contactSource.ContactSourceDictionaries.Where(x => !x.IsDeleted).Select(sd => sd.LanguageId).ToHashSet();

        foreach (var dtoDict in dto.ContactSourceDictionaries)
        {
            var dict = contactSource.ContactSourceDictionaries.FirstOrDefault(sd => sd.LanguageId == dtoDict.LanguageId);
            dict.Name = dtoDict.Name;
            dict.UpdatedAt = DateTime.UtcNow.AddHours(4);

        }

        await contactSourceRepository.UpdateAsync(contactSource);
        await contactSourceRepository.SaveAsync();
    }
}
