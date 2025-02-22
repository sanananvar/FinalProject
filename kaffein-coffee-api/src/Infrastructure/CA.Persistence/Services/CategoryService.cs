using CA.Application.DTOs.CategoryDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ProductDTOs;
using CA.Application.Exceptions.Common;
using CA.Application.Repositories;
using CA.Application.Services;
using CA.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IWebHostEnvironment _environment;
    private readonly ILanguageRepository _languageRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    readonly string culture = string.Empty;

    public CategoryService(
                    ICategoryRepository categoryRepository,
                    IWebHostEnvironment environment,
                    ILanguageRepository languageRepository,
                    IHttpContextAccessor httpContextAccessor)
    {
        _categoryRepository = categoryRepository;
        _environment = environment;
        _languageRepository = languageRepository;
        _httpContextAccessor = httpContextAccessor;
        culture = _httpContextAccessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.Culture.Name ?? "en-US";
    }

    public async Task CreateAsync(CategoryPostDto dto)
    {
        if (dto is null)
        {
            throw new NullReferenceException(nameof(CategoryPostDto));
        }

        Category entity = new()
        {
            CreatedAt = DateTime.UtcNow.AddHours(4),
            ParentCategoryId = dto.ParentCategoryId,
        };

        foreach (var dictionaryDto in dto.CategoryDictionaries)
        {
            // Fetch the language entity based on the provided LanguageId
            var language = await _languageRepository.GetAsync(x => x.Id == dictionaryDto.LanguageId, false, false);
            if (language == null)
            {
                throw new NotFoundException($"Language with Id {dictionaryDto.LanguageId} not found.");
            }

            // Create the CountryDictionary and set the Language
            var categoryDictionary = new CategoryDictionary
            {
                LanguageId = dictionaryDto.LanguageId,
                Name = dictionaryDto.Name,
                Language = language, // Automatically set the Language entity
                CreatedAt = DateTime.UtcNow.AddHours(4),
            };

            entity.CategoryDictionaries.Add(categoryDictionary);
        }

        await _categoryRepository.AddAsync(entity);
        await _categoryRepository.SaveAsync();
    }

    public async Task<PaginatedResponse<CategoryGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true)
    {
        // Fetch categories
        var allCategories = !isAdmin
            ? await _categoryRepository
                .GetQuery(x => !x.IsDeleted && x.CategoryDictionaries.Any(cd => cd.Language.Code == culture),
                    false, true, "CategoryDictionaries.Language", "SubCategories", "ParentCategory")
                .ToListAsync()
            : await _categoryRepository
                .GetQuery(x => x.CategoryDictionaries.Any(cd => cd.Language.Code == culture),
                    false, true, "CategoryDictionaries.Language", "SubCategories", "ParentCategory")
                .ToListAsync();

        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        // Fetch root categories (categories with no parent)
        var rootCategories = allCategories.Where(x => x.ParentCategoryId == null).ToList();

        // Convert to DTO recursively
        var categoryGetDtos = rootCategories.Select(cat => new CategoryGetAllDto
        {
            Id = cat.Id,
            SubCategories = cat.SubCategories.Select(MapCategoryToDto).ToList(),
            CategoryDictionaries = cat.CategoryDictionaries.Select(cd => new CategoryDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToList(),
            IsDeleted = cat.IsDeleted
        }).ToList();

        // Pagination logic
        int totalItems = categoryGetDtos.Count;
        if (isPagination)
        {
            categoryGetDtos = categoryGetDtos.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
        }

        int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        // Construct response
        return new PaginatedResponse<CategoryGetAllDto>
        {
            Items = categoryGetDtos,
            TotalItems = totalItems,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };
    }

    public async Task<CategoryGetDto> GetAsync(int id, bool isAdmin = true)
    {
        var query = _categoryRepository.GetQuery(x => x.Id == id, false, true, "CategoryDictionaries.Language", "SubCategories.SubCategories", "SubCategories.CategoryDictionaries.Language", "ParentCategory", "Products.ProductDictionaries");
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        var category = !isAdmin
             ? await query.Where(x => !x.IsDeleted).FirstOrDefaultAsync()
             : await query.FirstOrDefaultAsync();

        CategoryGetDto categoryGetDto = MapCategoryToDto(category);

        if (categoryGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }

        return categoryGetDto;
    }

    public async Task<CategoryGetDto> GetWithAllLanguagesAsync(int id)
    {
        var query = _categoryRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "CategoryDictionaries.Language", "SubCategories.SubCategories", "ParentCategory", "Products.ProductDictionaries");
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        CategoryGetDto? categoryGetDto = await query.Select(c => new CategoryGetDto
        {
            Id = c.Id,
            SubCategories = c.SubCategories.Select(x => MapCategoryToDto(x)).ToList(),
            Products = c.Products.Select(p => new ProductGetAllDto
            {
                Id = p.Id,
                ImageSrc = $"{hostUrl}/uploads/products/{p.ImageSrc}",
                ProductDictionaries = p.ProductDictionaries.Select(cd => new ProductDictionaryGetAllDto
                {
                    Id = cd.Id,
                    Name = cd.Name,
                    LanguageId = cd.LanguageId
                }).ToHashSet(),

                Price = p.Price,
                CategoryId = p.CategoryId
            }).ToList(),
            CategoryDictionaries = c.CategoryDictionaries.Select(cd => new CategoryDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToList(),
        }).FirstOrDefaultAsync();

        if (categoryGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }

        return categoryGetDto;
    }

    public async Task RemoveAsync(int id)
    {
        var entity = await _categoryRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _categoryRepository.UpdateAsync(entity);
        await _categoryRepository.SaveAsync();
    }

    public async Task RevertAsync(int id)
    {
        var entity = await _categoryRepository.GetQuery(x => x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = false;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _categoryRepository.UpdateAsync(entity);
        await _categoryRepository.SaveAsync();
    }

    public async Task UpdateAsync(CategoryUpdateDto dto, int id)
    {
        var category = await _categoryRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "CategoryDictionaries.Language").FirstOrDefaultAsync();

        if (category == null)
        {
            throw new NotFoundException("Not found Service");
        }

        if (dto.ParentCategoryId is not null) category.ParentCategoryId = dto.ParentCategoryId;
        else category.ParentCategoryId = null;

        var existingLanguageIds = category.CategoryDictionaries.Where(x => !x.IsDeleted).Select(sd => sd.LanguageId).ToHashSet();

        foreach (var dtoDict in dto.CategoryDictionaries)
        {
            var dict = category.CategoryDictionaries.FirstOrDefault(sd => sd.LanguageId == dtoDict.LanguageId);
            dict.Name = dtoDict.Name;
            dict.UpdatedAt = DateTime.UtcNow.AddHours(4);

        }

        await _categoryRepository.UpdateAsync(category);
        await _categoryRepository.SaveAsync();
    }

    private CategoryGetDto MapCategoryToDto(Category category)
    {
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        return new CategoryGetDto
        {
            Id = category.Id,
            SubCategories = category.SubCategories?.Select(MapCategoryToDto).ToList(),
            Products = category.Products.Select(p => new ProductGetAllDto
            {
                Id = p.Id,
                ImageSrc = $"{hostUrl}/uploads/products/{p.ImageSrc}",
                ProductDictionaries = p.ProductDictionaries.Select(cd => new ProductDictionaryGetAllDto
                {
                    Id = cd.Id,
                    Name = cd.Name,
                    LanguageId = cd.LanguageId
                }).ToHashSet(),

                Price = p.Price,
                CategoryId = p.CategoryId
            }).ToList(),
            CategoryDictionaries = category.CategoryDictionaries.Select(cd => new CategoryDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToList(),
            IsDeleted = category.IsDeleted,
        };
    }

}
