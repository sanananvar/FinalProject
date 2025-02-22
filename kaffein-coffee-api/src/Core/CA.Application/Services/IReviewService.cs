using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ReviewDTOs;

namespace CA.Application.Services;

public interface IReviewService
{
    Task CreateAsync(ReviewPostDto dto, int productId);
    Task UpdateAsync(ReviewUpdateDto dto, int id);
    Task<PaginatedResponse<ReviewGetDto>> GetAllAsync(int productId, int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true);
    Task<ReviewGetDto> GetAsync(int id, bool isAdmin = true);
    Task RemoveAsync(int id);
    Task RevertAsync(int id);
    Task ConfirmAsync(int id);
    Task RejectAsync(int id);
}

