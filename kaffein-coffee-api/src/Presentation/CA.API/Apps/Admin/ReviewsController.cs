using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ReviewDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CA.API.Apps.Admin
{
    [ApiExplorerSettings(GroupName = "admin_v1")]
    [Route("api/v1/admin/[controller]/[action]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        readonly IReviewService _service;

        public ReviewsController(IReviewService reviewService)
        {
            _service = reviewService;
        }

        [Authorize(Roles = "SuperAdmin, admin")]
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResponse<ReviewGetDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAll(int productId, int pageNumber = 1, int pageSize = 10, bool isPaginated = true)
        {
            var result = await _service.GetAllAsync(productId, pageNumber, pageSize, isPaginated, true);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin, admin")]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ReviewGetDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAll(int id)
        {
            var result = await _service.GetAsync(id, true);
            return Ok(result);
        }

        [Authorize(Roles = "SuperAdmin, admin")]
        [HttpPut("[action]/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update([FromBody] ReviewUpdateDto dto, int id)
        {
            await _service.UpdateAsync(dto, id);
            return StatusCode(204);
        }

        [Authorize(Roles = "SuperAdmin, admin")]
        [HttpDelete("[action]/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Remove(int id)
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

        [Authorize(Roles = "SuperAdmin, admin")]
        [HttpPatch("[action]/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Confirm(int id)
        {
            await _service.ConfirmAsync(id);
            return StatusCode(204);
        }

        [Authorize(Roles = "SuperAdmin, admin")]
        [HttpPatch("[action]/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Reject(int id)
        {
            await _service.RejectAsync(id);
            return StatusCode(204);
        }
    }
}
