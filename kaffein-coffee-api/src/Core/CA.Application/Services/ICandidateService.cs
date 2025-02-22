using CA.Application.DTOs.CandidatDTOs;
using CA.Application.DTOs.CarouselDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CA.Application.Services;

public interface ICandidateService
{
    Task<CandidateGetDTO> GetAsync(int id, bool isAdmin = true);
    Task CreateAsync(CandidatePostDTO dto);
    Task<PaginatedResponse<CandidateGetDTO>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true);
}
