using System;
namespace CA.Application.DTOs.AuthDTOs
{
	public class UpdatePasswordDto
	{
        public string UserId { get; set; } = null!;
        public string ResetToken { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string ConfirmedNewPassword { get; set; } = null!;
    }
}

