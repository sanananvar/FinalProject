using CA.Application.DTOs.CarouselDTOs;
using System.Data;
using CA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CA.Application.DTOs.ReviewDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;

namespace CA.API.Apps.Client
{
    [ApiExplorerSettings(GroupName = "client_v1")]
    [Route("api/v1/client/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        readonly IReviewService _service;

        public ReviewsController(IReviewService reviewService)
        {
            _service = reviewService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] ReviewPostDto dto, int productId)
        {
            await _service.CreateAsync(dto, productId);
            return StatusCode(201);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(PaginatedResponse<ReviewGetDto>))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAll(int productId,int pageNumber = 1, int pageSize = 10, bool isPaginated = true)
        {
            var result = await _service.GetAllAsync(productId,pageNumber, pageSize, isPaginated,false);
            return Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ReviewGetDto))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetAsync(id,false);
            return Ok(result);
        }
    }
}
