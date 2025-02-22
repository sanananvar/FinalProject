using System;
using CA.Application.DTOs.AuthDTOs;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.TokenDTOs;
using CA.Application.Exceptions.AuthExceptions;
using CA.Application.Services.AuthServices;
using CA.Application.Services.Tokens;
using CA.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Net;
using CA.Application.Services.MailServices;
using CA.Application.Helpers.CustomCoders;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Services.AuthServices
{
	public class AuthService : IAuthService
    {
        readonly UserManager<AppUser> _userManager;
        readonly ITokenHandler _tokenHandler;
        readonly IMailService _mailService;
        private readonly int _accessTokenLifeTime;
        private readonly int _addExtraMinutesforRefreshToken;

        public AuthService(UserManager<AppUser> userManager, ITokenHandler tokenHandler, IMailService mailService, IConfiguration configuration)
        {
            _userManager = userManager;
            _tokenHandler = tokenHandler;
            _mailService = mailService;
            _addExtraMinutesforRefreshToken = int.Parse(configuration.GetSection("JwtTokenSettings:AddExtraMinutesforRefreshToken").Value);
            _accessTokenLifeTime = int.Parse(configuration.GetSection("JwtTokenSettings:AccessTokenLifeTime").Value);
        }

        public async Task<GeneralResponse<ResetTokenEmailResponseDto>> ResetPassword(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            ResetTokenEmailResponseDto emailResponseDto = new();
            if (user is not null)
            {
                var resetTokenResponse = await _userManager.GeneratePasswordResetTokenAsync(user);
                var newResetToken = resetTokenResponse.EncodeToken();
                emailResponseDto.Email = email;
                emailResponseDto.Token = newResetToken;
                emailResponseDto.UserId = user.Id;
                string resetLink = $"change here"; // Todo: change resetLink

                await _mailService.SendEmailAsync(new Application.DTOs.MailDTOs.MailRequestDto
                {
                    Attachments = null,
                    Subject = "ResetPassword",
                    Body = GetResetPasswordEmailBody(resetLink),
                    ToEmails = new List<string> { user.Email }
                });
                return new()
                {
                    Data = emailResponseDto,
                    StatusCode = (int)HttpStatusCode.OK,
                    Message = " Reset Token Generated"
                };
            }
            return new()
            {
                Data = null,
                StatusCode = (int)HttpStatusCode.NotFound,
                Message = " Reset not generated"
            };
        }
        public async Task<BaseReponse> VerifyPasswordResetToken(ResetResponseDto resetResponseDto)
        {
            var user = await _userManager.FindByIdAsync(resetResponseDto.UserId);
            bool isValidToken = false;
            if (user is not null)
            {
                var decodedResetToken = resetResponseDto.ResetToken.DecodeToken();
                isValidToken = await _userManager.VerifyUserTokenAsync(user, _userManager.Options.Tokens.PasswordResetTokenProvider, "ResetPassword", decodedResetToken);
            }
            return new()
            {
                StatusCode = (int)(isValidToken ? HttpStatusCode.OK : HttpStatusCode.BadRequest),
                Message = $"{(isValidToken ? "Token is valid." : "Invalid token.")}"
            };
        }

        public async Task<BaseReponse> UpdatePasswordAsync(UpdatePasswordDto updatePasswordDto)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == updatePasswordDto.UserId);
            bool isUpdated = false;
            if (user is not null)
            {
                var decodedResetToken = updatePasswordDto.ResetToken.DecodeToken();
                IdentityResult resetPassword = await _userManager.ResetPasswordAsync(user, decodedResetToken, updatePasswordDto.NewPassword);
                if (resetPassword.Succeeded)
                {
                    IdentityResult result = await _userManager.UpdateSecurityStampAsync(user);
                    isUpdated = result.Succeeded;
                }
            }

            return new BaseReponse()
            {
                Message = $"{isUpdated}",
                StatusCode = (int)(isUpdated ? HttpStatusCode.OK : HttpStatusCode.BadRequest),
            };
        }

        public async Task UpdateRefreshToken(AppUser user, string refreshToken, DateTime accessTokenLifeTime, int addMinuteToLifeTime)
        {
            user.RefreshToken = refreshToken;
            user.RefreshTokenExpirationDate = accessTokenLifeTime.AddMinutes(addMinuteToLifeTime);
            await _userManager.UpdateAsync(user);
        }

        public async Task<TokenResponseDto> RefreshTokenLoginAsync(string refreshToken)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);
            if (user is not null && user.RefreshTokenExpirationDate > DateTime.Now)
            {
                TokenResponseDto tokenResponse = await _tokenHandler.CreateAccessTokenAsync(user, _accessTokenLifeTime);
                await UpdateRefreshToken(user, tokenResponse.RefreshToken, tokenResponse.Expiration, _addExtraMinutesforRefreshToken);
                return tokenResponse;
            }
            throw new TokenFailedException();
        }

        public string GetResetPasswordEmailBody(string resetLink)
        {
            string emailBody = $@"
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Password Reset</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                color: #333;
            }}
            .email-container {{
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }}
            .email-header {{
                background-color: #4CAF50;
                padding: 10px;
                border-radius: 8px 8px 0 0;
                text-align: center;
                color: #ffffff;
            }}
            .email-body {{
                padding: 20px;
                text-align: center;
            }}
            .email-body h1 {{
                color: #4CAF50;
            }}
            .email-body p {{
                font-size: 16px;
                line-height: 1.6;
                margin: 20px 0;
            }}
            .reset-button {{
                display: inline-block;
                background-color: #4CAF50;
                color: #ffffff;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                transition: background-color 0.3s ease;
            }}
            .reset-button:hover {{
                background-color: #45a049;
            }}
            .email-footer {{
                margin-top: 20px;
                text-align: center;
                font-size: 12px;
                color: #777;
            }}
        </style>
    </head>
    <body>
        <div class='email-container'>
            <div class='email-header'>
                <h2>Password Reset Request</h2>
            </div>
            <div class='email-body'>
                <h1>Hello,</h1>
                <p>You recently requested to reset your password for your account. Click the button below to reset it:</p>
                <a href='{resetLink}' class='reset-button'>Reset Password</a>
                <p>If you did not request a password reset, please ignore this email or contact support.</p>
            </div>
            <div class='email-footer'>
                <p>© 2024 Your Company Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>";

            return emailBody;
        }


    }
}