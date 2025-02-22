using CA.Application.DTOs.CarouselDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CA.API.Apps.Admin;

[ApiExplorerSettings(GroupName = "admin_v1")]
[Route("api/v1/admin/[controller]")]
[ApiController]
public class CandidatesController(ICandidateService service) : ControllerBase
{
    [Authorize(Roles = "SuperAdmin")]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResponse<CarouselGetAllDto>))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll(int pageNumber = 1, int pageSize = 10, bool isPaginated = true)
    {
        var result = await service.GetAllAsync(pageNumber, pageSize, isPaginated, true);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CarouselGetDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(int id)
    {
        var result = await service.GetAsync(id, true);
        return Ok(result);
    }
}
