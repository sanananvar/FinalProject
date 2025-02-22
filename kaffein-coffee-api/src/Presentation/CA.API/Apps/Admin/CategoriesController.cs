using CA.Application.DTOs.CarouselDTOs;
using CA.Application.DTOs.CategoryDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CA.API.Apps.Admin;

[ApiExplorerSettings(GroupName = "admin_v1")]
[Route("api/v1/admin/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    readonly ICategoryService _service;

    public CategoriesController(ICategoryService service)
    {
        _service = service;
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResponse<CarouselGetAllDto>))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll(int pageNumber = 1, int pageSize = 10, bool isPaginated = true)
    {
        var result = await _service.GetAllAsync(pageNumber, pageSize, isPaginated, true);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CategoryGetDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _service.GetAsync(id, true);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("/api/v1/admin/Categories/GetWithAllLanguages/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(CategoryGetDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetWithAllLanguages(int id)
    {
        var result = await _service.GetWithAllLanguagesAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CategoryPostDto categoryPostDto)
    {
        await _service.CreateAsync(categoryPostDto);
        return StatusCode(201);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromBody] CategoryUpdateDto categoryUpdateDto, int id)
    {
        await _service.UpdateAsync(categoryUpdateDto, id);
        return StatusCode(204);
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
