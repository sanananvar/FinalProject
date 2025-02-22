using System;
using Microsoft.AspNetCore.Identity;

namespace CA.Domain.Entities
{
	public class AppUser : IdentityUser
	{
		public string Name { get; set; } = null!;
		public string Surname { get; set; } = null!;
        public string RefreshToken { get; set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public string? Image { get; set; }
        public DateTime? RefreshTokenExpirationDate { get; set; }
    }
}

