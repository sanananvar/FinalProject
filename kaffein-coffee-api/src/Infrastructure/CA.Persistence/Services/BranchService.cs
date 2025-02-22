using CA.Application.DTOs.BranchDTOs;
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

public class BranchService : IBranchService
{
    private readonly IBranchRepository _branchRepository;
    private readonly IWebHostEnvironment _environment;
    private readonly ILanguageRepository _languageRepository;
    private readonly IHttpContextAccessor _httpContextAccessor;
    readonly string culture = string.Empty;

    public BranchService(
                    IBranchRepository branchRepository,
                    IWebHostEnvironment environment,
                    ILanguageRepository languageRepository,
                    IHttpContextAccessor httpContextAccessor)
    {
        _branchRepository = branchRepository;
        _environment = environment;
        _languageRepository = languageRepository;
        _httpContextAccessor = httpContextAccessor;
        culture = _httpContextAccessor.HttpContext?.Features.Get<IRequestCultureFeature>()?.RequestCulture.Culture.Name ?? "en-US";
    }

    public async Task CreateAsync(BranchPostDto dto)
    {
        if (dto is null)
        {
            throw new NullReferenceException(nameof(BranchPostDto));
        }

        string path = Path.Combine(_environment.WebRootPath, "uploads/branches");

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        Branch entity = new Branch()
        {
            CreatedAt = DateTime.UtcNow.AddHours(4),
        };

        if (dto.ImageFiles != null)
        {
            foreach (var image in dto.ImageFiles)
            {
                string fileName = image.CreateImage(_environment.WebRootPath, "uploads/branches");
                BranchImage branchImage = new()
                {
                    ImageSrc = fileName,
                    CreatedAt = DateTime.UtcNow.AddHours(4)
                };
                entity.BranchImages.Add(branchImage);
            }
        }

        foreach (var dictionaryDto in dto.BranchDictionaries)
        {
            // Fetch the language entity based on the provided LanguageId
            var language = await _languageRepository.GetAsync(x => x.Id == dictionaryDto.LanguageId, false, false);
            if (language == null)
            {
                throw new NotFoundException($"Language with Id {dictionaryDto.LanguageId} not found.");
            }

            // Create the CountryDictionary and set the Language
            var branchDictionary = new BranchDictionary
            {
                LanguageId = dictionaryDto.LanguageId,
                Name = dictionaryDto.Name,
                Language = language, // Automatically set the Language entity
                CreatedAt = DateTime.UtcNow.AddHours(4),
            };

            entity.BranchDictionaries.Add(branchDictionary);
        }

        await _branchRepository.AddAsync(entity);
        await _branchRepository.SaveAsync();
    }

    public async Task<PaginatedResponse<BranchGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true)
    {
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        IEnumerable<Branch> allBranches = !isAdmin
                ? await _branchRepository
                    .GetQuery(x => !x.IsDeleted && x.BranchDictionaries
                    .Any(x => x.Language.Code == culture), false, true, "BranchDictionaries.Language", "BranchImages")
                    .ToListAsync()
                : await _branchRepository
                    .GetQuery(x => x.BranchDictionaries
                    .Any(x => x.Language.Code == culture), false, true, "BranchDictionaries.Language", "BranchImages")
                    .ToListAsync();

        int totalItems = allBranches.Count();
        if (isPagination)
        {
            allBranches = allBranches.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        var branchGetDtos = allBranches.Select(x => new BranchGetAllDto
        {
            Id = x.Id,
            BranchImages = x.BranchImages.Select(c => new BranchImageGetDto
            {
                Id = c.Id,
                ImageUrl = $"{hostUrl}/uploads/branches/{c.ImageSrc}"
            }).ToList(),
            BranchDictionaries = x.BranchDictionaries.Select(cd => new BranchDictionaryGetAllDto
            {
                Id = cd.Id,
                Name = cd.Name,
                LanguageId = cd.LanguageId
            }).ToList(),
            IsDeleted = x.IsDeleted,
        }).ToList();

        int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var paginatedResponse = new PaginatedResponse<BranchGetAllDto>
        {
            Items = branchGetDtos,
            TotalItems = totalItems,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };
        return paginatedResponse;
    }

    public async Task<BranchGetDto> GetAsync(int id, bool isAdmin = true)
    {
        var query = _branchRepository.GetQuery(x => x.Id == id, false, true, "BranchDictionaries.Language", "BranchImages");
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        query = !isAdmin
            ? query.Where(x => !x.IsDeleted)
            : query;

        BranchGetDto? BranchGetDto = await query.Select(x => new BranchGetDto
        {
            Id = x.Id,
            BranchImages = x.BranchImages.Select(c => new BranchImageGetDto
            {
                Id = c.Id,
                ImageUrl = $"{hostUrl}/uploads/branches/{c.ImageSrc}"
            }).ToList(),
            BranchDictionaries = x.BranchDictionaries.OrderBy(x => x.LanguageId).Select(d => new BranchDictionaryGetAllDto
            {
                Id = d.Id,
                LanguageId = d.LanguageId,
                Name = d.Name
            }).ToList(),
            IsDeleted = x.IsDeleted,
        }).FirstOrDefaultAsync();

        if (BranchGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }
        return BranchGetDto;
    }

    public async Task<BranchGetDto> GetWithAllLanguagesAsync(int id)
    {
        var query = _branchRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "BranchDictionaries.Language", "BranchImages");
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        BranchGetDto? BranchGetDto = await query.Select(x => new BranchGetDto
        {
            Id = x.Id,
            BranchImages = x.BranchImages.Select(c => new BranchImageGetDto
            {
                Id = c.Id,
                ImageUrl = $"{hostUrl}/uploads/branches/{c.ImageSrc}"
            }).ToList(),
            BranchDictionaries = x.BranchDictionaries.OrderBy(x => x.LanguageId).Select(d => new BranchDictionaryGetAllDto
            {
                Id = d.Id,
                LanguageId = d.LanguageId,
                Name = d.Name
            }).ToList()
        }).FirstOrDefaultAsync();

        if (BranchGetDto is null)
        {
            throw new NotFoundException("Not found Service");
        }
        return BranchGetDto;
    }

    public async Task RemoveAsync(int id)
    {
        var entity = await _branchRepository.GetQuery(x => !x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = true;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _branchRepository.UpdateAsync(entity);
        await _branchRepository.SaveAsync();
    }

    public async Task RevertAsync(int id)
    {
        var entity = await _branchRepository.GetQuery(x => x.IsDeleted && x.Id == id, true, false).FirstOrDefaultAsync();

        if (entity is null)
        {
            throw new NotFoundException("Not found Service");
        }

        entity.IsDeleted = false;
        entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _branchRepository.UpdateAsync(entity);
        await _branchRepository.SaveAsync();
    }

    public async Task UpdateAsync(BranchUpdateDto dto, int id)
    {
        var branch = await _branchRepository.GetQuery(x => !x.IsDeleted && x.Id == id, false, true, "BranchDictionaries.Language", "BranchImages").FirstOrDefaultAsync();

        if (branch == null)
        {
            throw new NotFoundException("Not found Service");
        }

        string path = Path.Combine(_environment.WebRootPath, "uploads/branches");

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }

        if (dto.Images != null)
        {
            var existingImageIds = branch.BranchImages.Select(i => i.Id).ToHashSet();
            var incomingImageIds = dto.Images
                .Where(i => i.ExistingImageId.HasValue)
                .Select(i => i.ExistingImageId.Value)
                .ToHashSet();

            var imagesToDelete = existingImageIds.Except(incomingImageIds).ToList();

            foreach (var imageId in imagesToDelete)
            {
                var imageToDelete = branch.BranchImages.FirstOrDefault(i => i.Id == imageId);
                if (imageToDelete != null)
                {
                    var imagePath = Path.Combine(_environment.WebRootPath, "uploads/branches", imageToDelete.ImageSrc);
                    if (File.Exists(imagePath))
                    {
                        File.Delete(imagePath);
                    }

                    branch.BranchImages.Remove(imageToDelete);
                }
            }

            foreach (var imageDto in dto.Images)
            {
                if (imageDto.ExistingImageId.HasValue)
                {
                    var existingImage = branch.BranchImages.FirstOrDefault(i => i.Id == imageDto.ExistingImageId.Value);
                }
                else if (imageDto.Image != null)
                {
                    var newImage = new BranchImage
                    {
                        BranchId = branch.Id,
                        ImageSrc = imageDto.Image.CreateImage(_environment.WebRootPath, "uploads/branches"),
                    };
                    branch.BranchImages.Add(newImage);
                }
            }
        }

        var existingLanguageIds = branch.BranchDictionaries.Where(x => !x.IsDeleted).Select(sd => sd.LanguageId).ToHashSet();

        foreach (var dtoDict in dto.BranchDictionaries)
        {
            var dict = branch.BranchDictionaries.FirstOrDefault(sd => sd.LanguageId == dtoDict.LanguageId);
            if (dict != null)
            {
                dict.Name = dtoDict.Name;
                dict.UpdatedAt = DateTime.UtcNow.AddHours(4);
            }
        }
        branch.UpdatedAt = DateTime.UtcNow.AddHours(4);

        await _branchRepository.UpdateAsync(branch);
        await _branchRepository.SaveAsync();
    }
}
