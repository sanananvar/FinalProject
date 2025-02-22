using System;
using CA.Application.DTOs.TokenDTOs;
using CA.Domain.Entities;

namespace CA.Application.Services.Tokens
{
	public interface ITokenHandler
	{
        public Task<TokenResponseDto> CreateAccessTokenAsync(AppUser user, int minute);
        public string CreateRefreshToken();
    }
}

