using System;
using System.Net;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.IdentityDTOs;
using CA.Application.DTOs.TokenDTOs;
using CA.Application.Exceptions.AuthExceptions;
using CA.Application.Exceptions.Common;
using CA.Application.Exceptions.IdentityExceptions;
using CA.Application.Services;
using CA.Application.Services.AuthServices;
using CA.Application.Services.Tokens;
using CA.Domain.Entities;
using CA.Domain.Enums;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static System.Net.WebRequestMethods;

namespace CA.Persistence.Services;

public class IdentityService : IIdentityService
	{
    readonly UserManager<AppUser> _userManager;
    readonly IAuthService _authService;
    readonly SignInManager<AppUser> _signInManager;
    readonly ITokenHandler _tokenHandler;
    readonly IConfiguration _configuration;
    readonly IHttpContextAccessor _httpContextAccessor;
    private readonly int _addExtraMinutesforRefreshToken;
    public IdentityService(
                UserManager<AppUser> userManager,
                SignInManager<AppUser> signInManager,
                IAuthService authService,
                ITokenHandler tokenHandler,
                IConfiguration configuration,
                IHttpContextAccessor httpContextAccessor)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _authService = authService;
        _tokenHandler = tokenHandler;
        _configuration = configuration;
        _addExtraMinutesforRefreshToken = configuration.GetValue<int>("JwtTokenSettings:AddExtraMinutesforRefreshToken");
        _httpContextAccessor = httpContextAccessor;
    }


    public Task<BaseReponse> AssignRole(string email, string role)
    {
        throw new NotImplementedException();
    }

    public Task<BaseReponse> ChangeUserStatus(string id)
    {
        throw new NotImplementedException();
    }

    public async Task<object> GetCurrentUser()
    {
        var userName = _httpContextAccessor.HttpContext?.User.Identity.Name;
        AppUser? appUser = default;
        var request = _httpContextAccessor.HttpContext.Request;
        var hostUrl = $"{request.Scheme}://{request.Host.Value}";
        if (!string.IsNullOrWhiteSpace(userName))
        {
            appUser = await _userManager.FindByNameAsync(userName);

            if (appUser is null)
            {
                return new BaseReponse { StatusCode = 404 };
            }
            UserGetDto userGetDto = new UserGetDto
            {
                Id = appUser.Id,
                Email = appUser.Email ?? "",
                Surname = appUser.Surname ?? "",
                Name = appUser.Name ?? "",
                PhoneNumber = appUser.PhoneNumber ?? "",
                Image = $"{hostUrl}/users/{appUser.Image}",
            };

            return new { status = 200, user = userGetDto };
        }

        return new BaseReponse { StatusCode = 403 };
    }

    public async Task<TokenResponseDto> Login(LoginDto loginDto, int accessTokenLifeTime, string? role = null)
    {
        var user = await _userManager.FindByEmailAsync(loginDto.Email);
        if (user is null || user.IsDeleted)
        {
            throw new LoginFailedException();
        }

        if (role != null)
        {
            var roles = await _userManager.GetRolesAsync(user);
            if (!roles.Contains("admin") && !roles.Contains("SuperAdmin"))
            {
                throw new LoginFailedException();
            }
        }

        SignInResult result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, true);
        if (!result.Succeeded)
        {
            throw new LoginFailedException();
        }
        TokenResponseDto tokenResponseDto = await _tokenHandler.CreateAccessTokenAsync(user, accessTokenLifeTime);
        await _authService.UpdateRefreshToken(user, tokenResponseDto.RefreshToken, tokenResponseDto.Expiration, _addExtraMinutesforRefreshToken);
        return tokenResponseDto;
    }

    public async Task<BaseReponse> Logout()
    {
        try
        {

            await _signInManager.SignOutAsync();
        }
        catch (Exception ex)
        {

        }

        return new()
        {
            StatusCode = (int)HttpStatusCode.OK,
            Message = "User Succesfully Logout",
        };
    }

    public async Task<BaseReponse> Register(RegisterDto registerDto, string? role = null)
    {
        var user = await _userManager.FindByEmailAsync(registerDto.Email);
        if (user is not null)
        {
            throw new AlreadyExistException(nameof(user));
        }

        if (await _userManager.Users.AnyAsync(x => x.PhoneNumber == registerDto.PhoneNumber))
        {
            throw new AlreadyExistException("Phone number is already associated with another account.");
        }

        user = new AppUser()
        {
            Id = Guid.NewGuid().ToString(),
            Email = registerDto.Email,
            UserName = registerDto.Email,
            Name = registerDto.Name,
            Surname = registerDto.Surname,
            PhoneNumber = registerDto.PhoneNumber,
        };

        IdentityResult result = await _userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded)
        {
            throw new CreateUserFailedException(result.Errors);
        }
        await _userManager.AddToRoleAsync(user, role);

        return new()
        {
            StatusCode = (int)HttpStatusCode.OK,
            Message = "User Succesfully Registered",
            Id2 = user.Id
        };
    }

    public async Task<BaseReponse> RemoveAdmin(string id)
    {
        var user = await _userManager.Users.Where(x => x.Id == id && !x.IsDeleted).FirstOrDefaultAsync();

        if (user == null)
            throw new NotFoundException("User is not found");

        user.IsDeleted = true;

        await _userManager.UpdateAsync(user);

        return new()
        {
            StatusCode = (int)HttpStatusCode.OK,
            Message = "Admin Succesfully Removed",
            Id2 = user.Id
        };
    }

    public Task<BaseReponse> RemoveRole(string email, string role)
    {
        throw new NotImplementedException();
    }

    public Task<BaseReponse> RemoveUser(string id)
    {
        throw new NotImplementedException();
    }

    public Task<BaseReponse> UpdateAdmin(UpdateUserDto dto, string id)
    {
        throw new NotImplementedException();
    }
}

