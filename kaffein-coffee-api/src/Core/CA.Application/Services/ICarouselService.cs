using CA.Application.DTOs.CarouselDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;

namespace CA.Application.Services;

public interface ICarouselService
{
    public Task CreateAsync(CarouselPostDto dto);
    public Task UpdateAsync(CarouselUpdateDto dto, int id);
    public Task<PaginatedResponse<CarouselGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true);
    public Task<CarouselGetDto> GetAsync(int id, bool isAdmin = true);
    public Task<CarouselGetDto> GetWithAllLanguagesAsync(int id);
    public Task RemoveAsync(int id);
    public Task RevertAsync(int id);
}

