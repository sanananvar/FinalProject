using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ProductDTOs;
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

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;
    private readonly IWebHostEnvironment _environment;
    private readonly ILanguageRepository _languageRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    readonly string culture = string.Empty;

    public ProductService(IProductRepository productRepository, IWebHostEnvironment environment, ILanguageRepository languageRepository, IHttpContextAccessor httpContextAccessor)
    {
        _productRepository = productRepository;
        _environment = environment;
        _languageRepository = languageRepository;
        _httpContextAccessor = httpContextAccessor;
        culture = _httpContextAccessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.Culture.Name ?? "en-US";
    }

    public async Task CreateAsync(ProductPostDto dto)
    {
        if (dto == null) throw new NullReferenceException("Entity is null!");

        if (dto.Price < 0) throw new NullReferenceException("Price cannot be below zero");

        string path = Path.Combine(_environment.WebRootPath, "uploads/products");

        if (!Directory.Exists(path)) Directory.CreateDirectory(path);

        Product entity = new()
        {
            Price = dto.Price,
            CategoryId = dto.CategoryId,
            CreatedAt = DateTime.UtcNow.AddHours(4),
            ImageSrc = dto.Image.CreateImage(_environment.WebRootPath, "uploads/products")
        };

        foreach (var dictionaryDto in dto.ProductDictionaries)
        {
            //Fetch the language entity based on the provided LanguageId
            var language = await _languageRepository.GetAsync(x => x.Id == dictionaryDto.LanguageId, false, false) ?? throw new NotFoundException($"Language with Id {dictionaryDto.LanguageId} not found.");

            //Create the CountryDictionary and set the Language
            var dictionary = new ProductDictionary
            {
                LanguageId = dictionaryDto.LanguageId,
                Name = dictionaryDto.Name,
                Language = language, // Automatically set the Language entity
                CreatedAt = DateTime.UtcNow.AddHours(4),
            };

            entity.ProductDictionaries.Add(dictionary);
        }

        await _productRepository.AddAsync(entity);
        await _productRepository.SaveAsync();
    }

    public async Task<PaginatedResponse<ProductGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true)
    {
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        IEnumerable<Product> allItems = !isAdmin
            ? await _productRepository
                .GetQuery(x => !x.IsDeleted && x.ProductDictionaries
                .Any(x => x.Language.Code == culture), false, true, "ProductDictionaries.Language")
                .ToListAsync()
            : await _productRepository
                .GetQuery(x => x.ProductDictionaries
                .Any(x => x.Language.Code == culture), false, true, "ProductDictionaries.Language")
                .ToListAsync();

        int totalItems = allItems.Count();
        if (isPagination)
        {
            allItems = allItems.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        var itemsGetDto = allItems.Select(x => new ProductGetAllDto
        {
            Id = x.Id,
            ImageSrc = $"{hostUrl}/uploads/products/{x.ImageSrc}",
            ProductDictionaries = x.ProductDictionaries.Select(cd => new ProductDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToHashSet(),

            Price = x.Price,
            Reviews = x.Reviews,
            CategoryId = x.CategoryId,
            IsDeleted = x.IsDeleted,
        }).ToList();


        int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var paginatedResponse = new PaginatedResponse<ProductGetAllDto>
        {
            Items = itemsGetDto,
            TotalItems = totalItems,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };

        return paginatedResponse;
    }

    public async Task<ProductGetDto> GetAsync(int id, bool isAdmin = true)
    {
        var query = _productRepository.GetQuery(x => x.Id == id, false, true, "ProductDictionaries.Language");
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        query = !isAdmin
             ? query.Where(x => !x.IsDeleted)
             : query;

        var itemGetDto = await query.Select(x => new ProductGetDto
        {
            Id = x.Id,
            ImageSrc = $"{hostUrl}/uploads/products/{x.ImageSrc}",
            ProductDictionaries = x.ProductDictionaries.Select(cd => new ProductDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToHashSet(),

            Price = x.Price,
            Reviews = x.Reviews,
            CategoryId = x.CategoryId,
            IsDeleted = x.IsDeleted,
        }).FirstOrDefaultAsync();

        return itemGetDto is null ? throw new NotFoundException("Not found Service") : itemGetDto;
    }

    public async Task<ProductGetDto> GetWithAllLanguagesAsync(int id)
    {
        var query = _productRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "CarouselDictionaries.Language");
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        var itemGetDto = await query.Select(x => new ProductGetDto
        {
            Id = x.Id,
            ImageSrc = $"{hostUrl}/uploads/products/{x.ImageSrc}",
            ProductDictionaries = x.ProductDictionaries.Select(cd => new ProductDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToHashSet(),

            Price = x.Price,
            Reviews = x.Reviews,
            CategoryId = x.CategoryId
        }).FirstOrDefaultAsync();

        return itemGetDto is null ? throw new NotFoundException("Not found Service") : itemGetDto;
    }

    public async Task RemoveAsync(int id)
    {
        var entity = await _productRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync() ?? throw new NotFoundException("Not found Service");

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _productRepository.UpdateAsync(entity);
        await _productRepository.SaveAsync();
    }

    public async Task RevertAsync(int id)
    {
        var entity = await _productRepository.GetQuery(x => x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync() ?? throw new NotFoundException("Not found Service");

        entity.IsDeleted = false;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _productRepository.UpdateAsync(entity);
        await _productRepository.SaveAsync();
    }

    public async Task UpdateAsync(ProductUpdateDto dto, int id)
    {
        if (dto.Price < 0) throw new NullReferenceException("Price cannot be below zero");

        var product = await _productRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "ProductDictionaries.Language").FirstOrDefaultAsync() ?? throw new NotFoundException("Not found Service");

        if (dto.Image != null)
        {
            product.ImageSrc = dto.Image.CreateImage(_environment.WebRootPath, "uploads/products");
            product.UpdatedAt = DateTime.Now;
        }

        var existingLanguageIds = product.ProductDictionaries.Where(x => !x.IsDeleted).Select(sd => sd.LanguageId).ToHashSet();

        foreach (var dtoDict in dto.ProductDictionaries)
        {
            var dict = product.ProductDictionaries.FirstOrDefault(sd => sd.LanguageId == dtoDict.LanguageId);
            dict.Name = dtoDict.Name;
            dict.UpdatedAt = DateTime.UtcNow.AddHours(4);

        }

        product.Price = dto.Price;
        product.CategoryId = dto.CategoryId;
        product.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _productRepository.UpdateAsync(product);
        await _productRepository.SaveAsync();
    }
}
