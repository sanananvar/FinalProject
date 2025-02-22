using System;
using Microsoft.AspNetCore.Identity;
using System.Net;

namespace CA.Application.Exceptions.IdentityExceptions
{
	public class CreateUserFailedException : Exception, IServiceException
    {
        public HttpStatusCode StatusCode => HttpStatusCode.BadRequest;

        public string ErrorMessage { get; }
        public string? ErrorDetail { get; }

        public CreateUserFailedException()
        {
            ErrorMessage = "Registration Process failed.";
        }
        public CreateUserFailedException(IEnumerable<IdentityError> errors)
        {
            ErrorMessage = "Register Failed ";
            ErrorDetail = string.Join(',', errors.Select(e => e.Description));

        }
        public CreateUserFailedException(string message) : base(message)
        {
            ErrorMessage = message;
        }
        public CreateUserFailedException(string message, Exception? innerException) : base(message, innerException)
        {
            ErrorMessage = message;
        }
    }
}

