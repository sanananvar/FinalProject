using System;
using CA.Application.Exceptions;
using System.Net;

namespace CA.Application.Exceptions.Common
{
	public class AlreadyExistException : Exception, IServiceException
    {
        public HttpStatusCode StatusCode => HttpStatusCode.BadRequest;

        public string ErrorMessage { get; }

        public AlreadyExistException()
        {
            ErrorMessage = "This operation Already Exist";
        }
        public AlreadyExistException(string errorMessage) : base(errorMessage)
        {
            ErrorMessage = $"Already Exist : {errorMessage}";
        }

        public AlreadyExistException(string errorMessage, Exception? innerException) : base(errorMessage, innerException)
        {
            ErrorMessage = errorMessage;
        }
    }
}

