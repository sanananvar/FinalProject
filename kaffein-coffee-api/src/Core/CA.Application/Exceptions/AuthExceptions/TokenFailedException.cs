using System;
using CA.Application.Exceptions;
using System.Net;

namespace CA.Application.Exceptions.AuthExceptions
{
	public class TokenFailedException : Exception, IServiceException
    {
        public HttpStatusCode StatusCode => HttpStatusCode.Unauthorized;

        public string ErrorMessage { get; }
        public string? ErrorDetail { get; }

        public TokenFailedException()
        {
            ErrorMessage = "User didn't found with this Token or Token expired";
        }

        public TokenFailedException(string message) : base(message)
        {
            ErrorMessage = message;
        }

        public TokenFailedException(string message, Exception? innerException) : base(message, innerException)
        {
            ErrorMessage = message;
        }
    }
}

