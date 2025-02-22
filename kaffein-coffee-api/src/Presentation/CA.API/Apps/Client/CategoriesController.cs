using CA.Application.DTOs.CarouselDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CA.API.Apps.Client;

[ApiExplorerSettings(GroupName = "client_v1")]
[Route("api/v1/client/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    readonly ICategoryService _service;

    public CategoriesController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResponse<CarouselGetAllDto>))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll(int pageNumber = 1, int pageSize = 10, bool isPaginated = true)
    {
        var result = await _service.GetAllAsync(pageNumber, pageSize, isPaginated, false);
        return Ok(result);
    }
}
