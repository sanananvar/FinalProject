using System;
namespace CA.Application.DTOs.AuthDTOs
{
	public class ResetResponseDto
	{
        public string UserId { get; set; } = null!;
        public string ResetToken { get; set; } = null!;
    }
}

