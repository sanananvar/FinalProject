using CA.Application.DTOs.BranchDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;

namespace CA.Application.Services;

public interface IBranchService
{
    public Task CreateAsync(BranchPostDto dto);
    public Task UpdateAsync(BranchUpdateDto dto, int id);
    public Task<PaginatedResponse<BranchGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true);
    public Task<BranchGetDto> GetAsync(int id, bool isAdmin = true);
    public Task<BranchGetDto> GetWithAllLanguagesAsync(int id);
    public Task RemoveAsync(int id);
    public Task RevertAsync(int id);
}
