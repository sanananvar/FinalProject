using CA.Application.DTOs.CandidatDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.Exceptions.Common;
using CA.Application.Extensions.FileUploadExtensions;
using CA.Application.Repositories;
using CA.Application.Services;
using CA.Domain.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Services;

public class CandidateService(ICandidateRepository candidateRepository,
                              IHttpContextAccessor httpContextAccessor,
                              IWebHostEnvironment environment) : ICandidateService
{
    public async Task CreateAsync(CandidatePostDTO dto)
    {
        if (dto is null) throw new NullReferenceException("Entity is null!");

        if (!dto.ResumeFile.IsDocument())
        {
            throw new FileLoadException("File must be pdf or word file");
        }

        string path = Path.Combine(environment.WebRootPath, "uploads/resumes");

        if (!Directory.Exists(path))
        {
            Directory.CreateDirectory(path);
        }


        Candidate candidate = new()
        {
            Name = dto.Name,
            Email = dto.Email,
            Number = dto.Number,
            Surname = dto.Surname,
            CreatedAt = DateTime.UtcNow.AddHours(4),
            ResumePath = dto.ResumeFile.SaveDocument(environment.WebRootPath, "uploads/resumes")
        };

        await candidateRepository.AddAsync(candidate);
        await candidateRepository.SaveAsync();
    }

    public async Task<PaginatedResponse<CandidateGetDTO>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true)
    {
        var allItems = candidateRepository.GetQuery(null, false, true);

        allItems = !isAdmin
                ? allItems.Where(x => !x.IsDeleted)
                : allItems;

        var request = httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        int totalItems = allItems.Count();
        if (isPagination)
        {
            allItems = allItems.Skip((pageNumber - 1) * pageSize).Take(pageSize);
        }

        var itemsGetDto = allItems.Select(x => new CandidateGetDTO
        {
            Id = x.Id,
            Name = x.Name,
            Email = x.Email,
            Number = x.Number,
            Surname = x.Surname,
            ResumePath = $"{hostUrl}/uploads/resumes/{x.ResumePath}",
            IsDeleted = x.IsDeleted,
        }).ToList();

        int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

        var paginatedResponse = new PaginatedResponse<CandidateGetDTO>
        {
            Items = itemsGetDto,
            TotalItems = totalItems,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalPages = totalPages
        };
        return paginatedResponse;
    }

    public async Task<CandidateGetDTO> GetAsync(int id, bool isAdmin = true)
    {
        var query = candidateRepository.GetQuery(x => x.Id == id, false, true);

        query = !isAdmin
             ? query.Where(x => !x.IsDeleted)
             : query;

        var request = httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";

        CandidateGetDTO? getDto = await query.Select(x => new CandidateGetDTO
        {
            Id = x.Id,
            Name = x.Name,
            Email = x.Email,
            Number = x.Number,
            Surname = x.Surname,
            ResumePath = $"{hostUrl}/uploads/resumes/{x.ResumePath}",
            IsDeleted = x.IsDeleted,
        }).FirstOrDefaultAsync();

        if (getDto is null)
        {
            throw new NotFoundException("Not found Service");
        }

        return getDto;
    }
}
