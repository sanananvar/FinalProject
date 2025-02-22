using CA.Application.DTOs.CategoryDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;

namespace CA.Application.Services;

public interface ICategoryService
{
    public Task CreateAsync(CategoryPostDto dto);
    public Task UpdateAsync(CategoryUpdateDto dto, int id);
    public Task<PaginatedResponse<CategoryGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true);
    public Task<CategoryGetDto> GetAsync(int id, bool isAdmin = true);
    public Task<CategoryGetDto> GetWithAllLanguagesAsync(int id);
    public Task RemoveAsync(int id);
    public Task RevertAsync(int id);
}
