using System;
namespace CA.Application.DTOs.AuthDTOs
{
	public class ResetTokenEmailResponseDto
	{
        public string Token { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string UserId { get; set; } = null!;
    }
}

