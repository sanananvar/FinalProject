using System;
using System.Net;

namespace CA.Application.Exceptions
{
	public interface IServiceException
	{
        HttpStatusCode StatusCode { get; }
        string ErrorMessage { get; }
        virtual string? ErrorDetail { get => "Not any error detail"; }
    }
}

