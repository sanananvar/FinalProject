using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.IdentityDTOs;
using CA.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CA.API.Apps.Admin
{
    [ApiExplorerSettings(GroupName = "admin_v1")]
    [Route("api/v1/admin/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        readonly IIdentityService _identityService;

        public AdminsController(IIdentityService identityService)
        {
            _identityService = identityService;
        }

        [Authorize(Roles = "SuperAdmin")]
        [HttpPost]
        [ActionName("CreateAdmin")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(BaseReponse))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            return StatusCode(201, await _identityService.Register(dto, "admin"));
        }
    }
}

