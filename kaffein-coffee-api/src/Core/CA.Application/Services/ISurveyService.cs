using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.SurveyDTOs;

namespace CA.Application.Services;

public interface ISurveyService
{
    public Task CreateAsync(SurveyPostDto dto);
    public Task<PaginatedResponse<SurveyGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true);
    public Task<SurveyGetDto> GetAsync(int id, bool isAdmin = true);
    public Task RemoveAsync(int id);
    public Task RevertAsync(int id);
}
