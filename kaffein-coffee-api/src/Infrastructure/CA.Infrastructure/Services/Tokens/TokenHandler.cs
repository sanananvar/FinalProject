using System;
using CA.Application.DTOs.TokenDTOs;
using CA.Application.Services.Tokens;
using CA.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace CA.Infrastructure.Services.Tokens
{
	public class TokenHandler : ITokenHandler
    {
        readonly UserManager<AppUser> _userManager;
        readonly IConfiguration _configuration;

        public TokenHandler(UserManager<AppUser> userManager, IConfiguration configuratixon)
        {
            _userManager = userManager;
            _configuration = configuratixon;
        }

        public async Task<TokenResponseDto> CreateAccessTokenAsync(AppUser user, int minute)
        {
            TokenResponseDto tokenResponseDto = new();
            tokenResponseDto.Expiration = DateTime.Now.AddMinutes(minute);
            List<Claim> myClaims = new() {
               new(ClaimTypes.Name,user.UserName),
               new(ClaimTypes.Email,user.Email),
               new(ClaimTypes.NameIdentifier,user.Id)
            };
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                myClaims.Add(new(ClaimTypes.Role, role));
            }
            SecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtTokenSettings:SignInKey"]));

            SigningCredentials signingCredentials = new(securityKey, SecurityAlgorithms.HmacSha256);

            JwtSecurityToken jwtSecurityToken = new(
                issuer: _configuration["JwtTokenSettings:Issuer"],
                audience: _configuration["JwtTokenSettings:Audience"],
                claims: myClaims,
                notBefore: DateTime.Now,
                expires: tokenResponseDto.Expiration,
                signingCredentials: signingCredentials
                );


            JwtSecurityTokenHandler tokenHandler = new();
            tokenResponseDto.AccessToken = tokenHandler.WriteToken(jwtSecurityToken);
            tokenResponseDto.RefreshToken = CreateRefreshToken();
            return tokenResponseDto;
        }

        public string CreateRefreshToken()
        {
            byte[] bytes = new byte[64];
            using RandomNumberGenerator randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(bytes);
            return Convert.ToBase64String(bytes);
        }
    }
}

