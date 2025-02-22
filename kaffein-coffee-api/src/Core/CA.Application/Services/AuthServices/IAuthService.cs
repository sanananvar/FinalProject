using System;
using CA.Application.DTOs.AuthDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.TokenDTOs;
using CA.Domain.Entities;

namespace CA.Application.Services.AuthServices
{
	public interface IAuthService
	{
        public Task<BaseReponse> UpdatePasswordAsync(UpdatePasswordDto updatePasswordDto);
        public Task UpdateRefreshToken(AppUser user, string RefreshToken, DateTime accessTokenLifeTime, int addMinuteToLifeTime);
        public Task<TokenResponseDto> RefreshTokenLoginAsync(string refreshToken);
        public Task<GeneralResponse<ResetTokenEmailResponseDto>> ResetPassword(string email);
        public Task<BaseReponse> VerifyPasswordResetToken(ResetResponseDto resetResponseDto);
    }
}

