using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.IdentityDTOs;
using CA.Application.DTOs.TokenDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CA.API.Apps.Admin
{
    [ApiExplorerSettings(GroupName = "admin_v1")]
    [Route("api/v1/admin/[controller]/[action]")]
    [ApiController]
    public class IdentityController : Controller
    {
        readonly IIdentityService _identityService;
        private readonly int _accessTokenLifeTime;

        public IdentityController(IIdentityService identityService, IConfiguration configuration)
        {
            _identityService = identityService;
            _accessTokenLifeTime = configuration.GetValue<int>("JwtTokenSettings:AccessTokenLifeTime");
        }


        [HttpGet]
        [ActionName("GetCurrentUser")]
        [Authorize(Roles = "SuperAdmin, admin")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCurrentUser()
        {
            var currentUser = await _identityService.GetCurrentUser();
            if (currentUser == null)
            {
                return NotFound("Current user not found.");
            }
            return Ok(currentUser);
        }

        [HttpPost]
        [ActionName("Login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(TokenResponseDto))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var response = await _identityService.Login(dto, _accessTokenLifeTime, "admin");
            if (response == null)
            {
                return Unauthorized("Invalid credentials.");
            }
            return Ok(response);
        }

        [HttpGet]
        [ActionName("Remove")]
        [Authorize(Roles = "SuperAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseReponse))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Remove(string id)
        {
            var response = await _identityService.RemoveAdmin(id);
            if (response == null)
            {
                return Unauthorized("Invalid credentials.");
            }
            return Ok(response);
        }

        [HttpGet]
        [ActionName("Logout")]
        [Authorize(Roles = "SuperAdmin, admin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(object))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Logout()
        {
            var response = await _identityService.Logout();
            if (response == null)
            {
                return Unauthorized("Invalid credentials.");
            }
            return Ok(response);
        }
    }
}

