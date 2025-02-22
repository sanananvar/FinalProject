using System;
using Microsoft.AspNetCore.Http;

namespace CA.Application.DTOs.MailDTOs
{
	public class MailRequestDto
	{
        public List<string> ToEmails { get; set; } = null!;
        public string? Subject { get; set; }
        public string? Body { get; set; }
        public List<IFormFile>? Attachments { get; set; }
    }
}

