using System;
using CA.Application.DTOs.MailDTOs;

namespace CA.Application.Services.MailServices
{
	public interface IMailService
	{
        Task SendEmailAsync(MailRequestDto mailRequest);
    }
}

