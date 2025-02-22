using System;
using System.ComponentModel.DataAnnotations;
using CA.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace CA.Application.DTOs.IdentityDTOs
{
	public class LoginDto
	{
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }

    public class UpdateUserDto
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string? OldPassword { get; set; } = string.Empty;
        public string? Password { get; set; } = string.Empty;
        public string? ConfirmedPassword { get; set; } = string.Empty;
        public IFormFile? File { get; set; }
    }

    public class UserGetDto
    {
        public string? Id { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Image { get; set; }
        public UserType UserType { get; set; }
    }

    public class RegisterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        [Compare("ConfirmedPassword")]
        public string Password { get; set; } = string.Empty;
        public string ConfirmedPassword { get; set; } = string.Empty;
    }
}

