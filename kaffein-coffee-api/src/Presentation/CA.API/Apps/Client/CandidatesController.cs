using CA.Application.DTOs.CandidatDTOs;
using CA.Application.DTOs.CarouselDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CA.API.Apps.Client;

[ApiExplorerSettings(GroupName = "client_v1")]
[Route("api/v1/client/[controller]")]
[ApiController]
public class CandidatesController(ICandidateService service) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(CandidatePostDTO))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromForm] CandidatePostDTO postDTO)
    {
        await service.CreateAsync(postDTO);
        return StatusCode(201);
    }
}
