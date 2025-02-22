using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ContactSourceDTOs;

namespace CA.Application.Services;

public interface IContactSourceService
{
    public Task CreateAsync(ContactSourcePostDto dto);
    public Task UpdateAsync(ContactSourceUpdateDto dto, int id);
    public Task<PaginatedResponse<ContactSourceGetAllDto>> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true);
    public Task<ContactSourceGetDto> GetAsync(int id, bool isAdmin = true);
    public Task<ContactSourceGetDto> GetWithAllLanguagesAsync(int id);
    public Task RemoveAsync(int id);
    public Task RevertAsync(int id);
}