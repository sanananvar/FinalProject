using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ProductDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CA.API.Apps.Admin;

[ApiExplorerSettings(GroupName = "admin_v1")]
[Route("api/v1/admin/[controller]")]
[ApiController]
public class ProductsController(IProductService service) : ControllerBase
{
    [Authorize(Roles = "SuperAdmin")]
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResponse<ProductGetAllDto>))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAll(int pageNumber = 1, int pageSize = 10, bool isPaginated = true)
    {
        var result = await service.GetAllAsync(pageNumber, pageSize, isPaginated, true);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductGetDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Get(int id)
    {
        var result = await service.GetAsync(id, true);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpGet("/api/v1/admin/Products/GetWithAllLanguages/{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ProductGetDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetWithAllLanguages(int id)
    {
        var result = await service.GetWithAllLanguagesAsync(id);
        return Ok(result);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromForm] ProductPostDto ProductPostDto)
    {
        await service.CreateAsync(ProductPostDto);
        return StatusCode(201);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update([FromForm] ProductUpdateDto ProductUpdateDto, int id)
    {
        await service.UpdateAsync(ProductUpdateDto, id);
        return StatusCode(204);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        await service.RemoveAsync(id);
        return StatusCode(204);
    }

    [Authorize(Roles = "SuperAdmin")]
    [HttpPut("revert/{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Revert(int id)
    {
        await service.RevertAsync(id);
        return StatusCode(204);
    }
}
