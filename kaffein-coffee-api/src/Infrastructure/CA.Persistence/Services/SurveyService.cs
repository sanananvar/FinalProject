using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.SurveyDTOs;
using CA.Application.Exceptions.Common;
using CA.Application.Repositories;
using CA.Application.Services;
using CA.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Services;

public class SurveyService : ISurveyService
{
    private readonly ISurveyRepository _surveyRepository;
    private readonly IWebHostEnvironment _environment;
    private readonly ILanguageRepository _languageRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    readonly string culture = string.Empty;

    public SurveyService(
                    ISurveyRepository surveyRepository,
                    IWebHostEnvironment environment,
                    ILanguageRepository languageRepository,
                    IHttpContextAccessor httpContextAccessor)
    {
        _surveyRepository = surveyRepository;
        _environment = environment;
        _languageRepository = languageRepository;
        _httpContextAccessor = httpContextAccessor;
        culture = _httpContextAccessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.Culture.Name ?? "en-US";
    }

    public async Task CreateAsync(SurveyPostDto dto)
    {
        if (dto is null)
        {
            throw new NullReferenceException(nameof(SurveyPostDto));
        }

        Survey entity = new Survey()
        {
            Age = dto.Age,
            QualityPoint = dto.QualityPoint,
            Comment = dto.Comment,
            ContactSourceId = dto.ContactSourceId,
            Gender = dto.Gender,
            Statisfactions = dto.Statisfactions.Select(stat => new Statisfaction
            {
                CreatedAt = DateTime.UtcNow.AddHours(4),
                StatisfactionDictionaries = stat.StatisfactionDictionaries.Select(statDic => new StatisfactionDictionary
                {
                    Key = statDic.Key,
                    Value = statDic.Value,
                    CreatedAt = DateTime.UtcNow.AddHours(4),
                    LanguageId = statDic.LanguageId,
                }).ToHashSet(),
            }).ToList(),
            CreatedAt = DateTime.UtcNow.AddHours(4),
        };


        await _surveyRepository.AddAsync(entity);
        await _surveyRepository.SaveAsync();
    }

    public async Task<PaginatedResponse<SurveyGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true)
    {
        IEnumerable<Survey> allSurveys = !isAdmin
            ? await _surveyRepository
                .GetQuery(x => !x.IsDeleted, false, true, "ContactSource.ContactSourceDictionaries", "Statisfactions.StatisfactionDictionaries")
                .ToListAsync()
            : await _surveyRepository
                .GetQuery(null, false, true, "ContactSource.ContactSourceDictionaries", "Statisfactions.StatisfactionDictionaries")
                .ToListAsync();

        int totalItems = allSurveys.Count();
        if (isPagination)
        {
            allSurveys = allSurveys.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        var countriGetDtos = allSurveys.Select(x => new SurveyGetAllDto
        {
            Id = x.Id,
            QualityPoint = x.QualityPoint,
            Age = x.Age,
            Comment = x.Comment,
            Gender = x.Gender,
            ContactSource = new Application.DTOs.ContactSourceDTOs.ContactSourceGetDto
            {
                ContactSourceDictionaries = x.ContactSource.ContactSourceDictionaries.Select(cs => new Application.DTOs.ContactSourceDTOs.ContactSourceDictionaryGetAllDto
                {
                    LanguageId = cs.LanguageId,
                    Id = cs.Id,
                    Name = cs.Name,
                }).ToList(),
                Id = x.Id,
            },
            Statisfactions = x.Statisfactions.Select(s => new StatisfactionGetDto
            {
                StatisfactionDictionaries = s.StatisfactionDictionaries.Select(sd => new StatisfactionDictionaryGetDto
                {
                    Id = sd.Id,
                    Key = sd.Key,
                    LanguageId = sd.LanguageId,
                    Value = sd.Value,
                }).ToHashSet()
            }).ToList(),
            IsDeleted = x.IsDeleted,
        }).ToList();

        int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var paginatedResponse = new PaginatedResponse<SurveyGetAllDto>
        {
            Items = countriGetDtos,
            TotalItems = totalItems,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };

        return paginatedResponse;
    }

    public async Task<SurveyGetDto> GetAsync(int id, bool isAdmin = true)
    {
        var query = _surveyRepository.GetQuery(x => x.Id == id, false, true, "ContactSource.ContactSourceDictionaries", "Statisfactions.StatisfactionDictionaries");

        query = !isAdmin
            ? query.Where(x => !x.IsDeleted)
            : query;

        SurveyGetDto? surveyGetDto = await query.Select(x => new SurveyGetDto
        {
            Id = x.Id,
            QualityPoint = x.QualityPoint,
            Age = x.Age,
            Comment = x.Comment,
            Gender = x.Gender,
            ContactSource = new Application.DTOs.ContactSourceDTOs.ContactSourceGetDto
            {
                ContactSourceDictionaries = x.ContactSource.ContactSourceDictionaries.Select(cs => new Application.DTOs.ContactSourceDTOs.ContactSourceDictionaryGetAllDto
                {
                    LanguageId = cs.LanguageId,
                    Id = cs.Id,
                    Name = cs.Name,
                }).ToList(),
                Id = x.Id,
            },
            Statisfactions = x.Statisfactions.Select(s => new StatisfactionGetDto
            {
                StatisfactionDictionaries = s.StatisfactionDictionaries.Select(sd => new StatisfactionDictionaryGetDto
                {
                    Id = sd.Id,
                    Key = sd.Key,
                    LanguageId = sd.LanguageId,
                    Value = sd.Value,
                }).ToHashSet()
            }).ToList(),
            IsDeleted = x.IsDeleted,
        }).FirstOrDefaultAsync();

        if (surveyGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }

        return surveyGetDto;
    }

    public async Task RemoveAsync(int id)
    {
        var entity = await _surveyRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false, "Statisfactions.StatisfactionDictionaries", "ContactSource.ContactSourceDictionaries").FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _surveyRepository.UpdateAsync(entity);
        await _surveyRepository.SaveAsync();
    }

    public async Task RevertAsync(int id)
    {
        var entity = await _surveyRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false, "Statisfactions.StatisfactionDictionaries", "ContactSource.ContactSourceDictionaries").FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = false;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _surveyRepository.UpdateAsync(entity);
        await _surveyRepository.SaveAsync();
    }
}
