using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.SurveyDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CA.API.Apps.Admin;

[ApiExplorerSettings(GroupName = "admin_v1")]
[Route("api/v1/admin/[controller]")]
[ApiController]
public class SurveysController : ControllerBase
{
    private readonly ISurveyService _service;

    public SurveysController(ISurveyService service)
    {
        _service = service;
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResponse<SurveyGetAllDto>))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll(int pageNumber = 1, int pageSize = 10, bool isPaginated = true)
    {
        var result = await _service.GetAllAsync(pageNumber, pageSize, isPaginated, true);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(SurveyGetDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _service.GetAsync(id, true);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.RemoveAsync(id);
        return StatusCode(204);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPut("revert/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Revert(int id)
    {
        await _service.RevertAsync(id);
        return StatusCode(204);
    }
}
