using CA.Application.DTOs.CarouselDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.Exceptions.Common;
using CA.Application.Extensions.FileUploadExtensions;
using CA.Application.Repositories;
using CA.Application.Services;
using CA.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Services;

public class CarouselService : ICarouselService
{
    private readonly ICarouselRepository _carouselRepository;
    private readonly IWebHostEnvironment _environment;
    private readonly ILanguageRepository _languageRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    readonly string culture = string.Empty;

    public CarouselService(
                    ICarouselRepository carouselRepository,
                    IWebHostEnvironment environment,
                    ILanguageRepository languageRepository,
                    IHttpContextAccessor httpContextAccessor)
    {
        _carouselRepository = carouselRepository;
        _environment = environment;
        _languageRepository = languageRepository;
        _httpContextAccessor = httpContextAccessor;
        culture = _httpContextAccessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.Culture.Name ?? "en-US";
    }

    public async Task CreateAsync(CarouselPostDto dto)
    {
        if (dto is null)
        {
            throw new NullReferenceException(nameof(CarouselPostDto));
        }

        string path = Path.Combine(_environment.WebRootPath, "uploads/carousels");

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        Carousel entity = new Carousel()
        {
            CreatedAt = DateTime.UtcNow.AddHours(4),
            Order = dto.Order,
            ImageSrc = dto.ImageFile.CreateImage(_environment.WebRootPath, "uploads/carousels")
        };

        foreach (var dictionaryDto in dto.CarouselDictionaries)
        {
            // Fetch the language entity based on the provided LanguageId
            var language = await _languageRepository.GetAsync(x => x.Id == dictionaryDto.LanguageId, false, false);
            if (language == null)
            {
                throw new NotFoundException($"Language with Id {dictionaryDto.LanguageId} not found.");
            }

            // Create the CountryDictionary and set the Language
            var carouselDictionary = new CarouselDictionary
            {
                LanguageId = dictionaryDto.LanguageId,
                Content = dictionaryDto.Content,
                Language = language, // Automatically set the Language entity
                CreatedAt = DateTime.UtcNow.AddHours(4),
            };

            entity.CarouselDictionaries.Add(carouselDictionary);
        }

        await _carouselRepository.AddAsync(entity);
        await _carouselRepository.SaveAsync();
    }

    public async Task<PaginatedResponse<CarouselGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true)
    {
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        IEnumerable<Carousel> allCarousels = !isAdmin
                ? await _carouselRepository
                    .GetQuery(x => !x.IsDeleted && x.CarouselDictionaries
                    .Any(x => x.Language.Code == culture), false, true, "CarouselDictionaries.Language")
                    .ToListAsync()
                : await _carouselRepository
                    .GetQuery(x => x.CarouselDictionaries
                    .Any(x => x.Language.Code == culture), false, true, "CarouselDictionaries.Language")
                    .ToListAsync();

        int totalItems = allCarousels.Count();
        if (isPagination)
        {
            allCarousels = allCarousels.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        var countriGetDtos = allCarousels.Select(x => new CarouselGetAllDto
        {
            Id = x.Id,
            ImageUrl = $"{hostUrl}/uploads/carousels/{x.ImageSrc}",
            CarouselDictionaries = x.CarouselDictionaries.Select(cd => new CarouselDictionaryGetAllDto
            {
                Id = cd.Id,
                Content = cd.Content,
                LanguageId = cd.LanguageId
            }).ToList(),
            Order = x.Order,
            IsDeleted = x.IsDeleted,
        }).ToList();

        int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var paginatedResponse = new PaginatedResponse<CarouselGetAllDto>
        {
            Items = countriGetDtos,
            TotalItems = totalItems,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };

        return paginatedResponse;
    }

    public async Task<CarouselGetDto> GetAsync(int id, bool isAdmin = true)
    {
        var query = _carouselRepository.GetQuery(x => x.Id == id, false, true, "CarouselDictionaries.Language");
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        query = !isAdmin
             ? query.Where(x => !x.IsDeleted)
             : query;

        CarouselGetDto? carouselGetDto = await query.Select(x => new CarouselGetDto
        {
            Id = x.Id,
            ImageUrl = $"{hostUrl}/uploads/carousels/{x.ImageSrc}",
            Order = x.Order,
            CarouselDictionaries = x.CarouselDictionaries.OrderBy(x => x.LanguageId).Select(d => new CarouselDictionaryGetAllDto
            {
                Id = d.Id,
                LanguageId = d.LanguageId,
                Content = d.Content
            }).ToList(),
            IsDeleted = x.IsDeleted,
        }).FirstOrDefaultAsync();

        if (carouselGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }

        return carouselGetDto;
    }

    public async Task<CarouselGetDto> GetWithAllLanguagesAsync(int id)
    {
        var query = _carouselRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "CarouselDictionaries.Language");
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        CarouselGetDto? carouselGetDto = await query.Select(x => new CarouselGetDto
        {
            Id = x.Id,
            ImageUrl = $"{hostUrl}/uploads/carousels/{x.ImageSrc}",
            Order = x.Order,
            CarouselDictionaries = x.CarouselDictionaries.OrderBy(x => x.LanguageId).Select(d => new CarouselDictionaryGetAllDto
            {
                Id = d.Id,
                LanguageId = d.LanguageId,
                Content = d.Content
            }).ToList()
        }).FirstOrDefaultAsync();

        if (carouselGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }

        return carouselGetDto;
    }

    public async Task RemoveAsync(int id)
    {
        var entity = await _carouselRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _carouselRepository.UpdateAsync(entity);
        await _carouselRepository.SaveAsync();
    }

    public async Task RevertAsync(int id)
    {
        var entity = await _carouselRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = false;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _carouselRepository.UpdateAsync(entity);
        await _carouselRepository.SaveAsync();
    }

    public async Task UpdateAsync(CarouselUpdateDto dto, int id)
    {
        var carousel = await _carouselRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "CarouselDictionaries.Language").FirstOrDefaultAsync();

        if (carousel == null)
        {
            throw new NotFoundException("Not found Service");
        }
        if (dto.ImageFile != null)
        {
            carousel.ImageSrc = dto.ImageFile.CreateImage(_environment.WebRootPath, "uploads/carousels");
            carousel.UpdatedAt = DateTime.Now;

        }
        var existingLanguageIds = carousel.CarouselDictionaries.Where(x => !x.IsDeleted).Select(sd => sd.LanguageId).ToHashSet();

        foreach (var dtoDict in dto.CarouselDictionaries)
        {
            var dict = carousel.CarouselDictionaries.FirstOrDefault(sd => sd.LanguageId == dtoDict.LanguageId);
            dict.Content = dtoDict.Content;
            dict.UpdatedAt = DateTime.UtcNow.AddHours(4);

        }

        carousel.Order = dto.Order;
        await _carouselRepository.UpdateAsync(carousel);
        await _carouselRepository.SaveAsync();
    }
}

