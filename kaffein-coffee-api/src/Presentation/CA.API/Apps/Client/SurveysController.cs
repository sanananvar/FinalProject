using CA.Application.DTOs.SurveyDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CA.API.Apps.Client;

[ApiExplorerSettings(GroupName = "client_v1")]
[Route("api/v1/client/[controller]")]
[ApiController]
public class SurveysController : ControllerBase
{
    private readonly ISurveyService _service;

    public SurveysController(ISurveyService service)
    {
        _service = service;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] SurveyPostDto surveyPostDto)
    {
        await _service.CreateAsync(surveyPostDto);
        return StatusCode(201);
    }
}
