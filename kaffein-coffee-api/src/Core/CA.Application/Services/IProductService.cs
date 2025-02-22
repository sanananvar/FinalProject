using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ProductDTOs;

namespace CA.Application.Services;

public interface IProductService
{
    public Task CreateAsync(ProductPostDto dto);
    public Task UpdateAsync(ProductUpdateDto dto, int id);
    public Task<PaginatedResponse<ProductGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true);
    public Task<ProductGetDto> GetAsync(int id, bool isAdmin = true);
    public Task<ProductGetDto> GetWithAllLanguagesAsync(int id);
    public Task RemoveAsync(int id);
    public Task RevertAsync(int id);
}
