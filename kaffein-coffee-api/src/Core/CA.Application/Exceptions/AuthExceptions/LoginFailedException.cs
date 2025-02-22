using System;
using CA.Application.Exceptions;
using System.Net;

namespace CA.Application.Exceptions.AuthExceptions
{
	public class LoginFailedException : Exception, IServiceException
    {
        public HttpStatusCode StatusCode => HttpStatusCode.Unauthorized;

        public string ErrorMessage { get; }
        public string? ErrorDetail { get; }

        public LoginFailedException()
        {
            ErrorMessage = "User Information or Password is invalid";
        }

        public LoginFailedException(string message) : base(message)
        {
            ErrorMessage = message;
        }

        public LoginFailedException(string message, Exception? innerException) : base(message, innerException)
        {
            ErrorMessage = message;
        }
    }
}

