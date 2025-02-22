using System;
using CA.Application.Exceptions;
using CA.Application.Exceptions.Common;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mime;
using System.Text.Json;

namespace CA.API.Middlewares
{
	public class GlobalExceptionHandler
    {
        private readonly RequestDelegate _next;
        private readonly IDictionary<Type, HttpStatusCode> _errorStatus;

        public GlobalExceptionHandler(RequestDelegate next)
        {
            _next = next;
            _errorStatus = new Dictionary<Type, HttpStatusCode>() {
                {typeof(ArgumentNullException),HttpStatusCode.BadRequest },
                {typeof(FileNotFoundException),HttpStatusCode.NotFound},
                {typeof(NotFoundException),HttpStatusCode.NotFound}

            };
        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                Type type = ex.GetType();
                var interfaces = type.GetInterfaces();
                if (interfaces.Contains(typeof(IServiceException)))
                {
                    await HandleCustomExceptionAsync(context, ex);
                }
                else
                {
                    await HandleBuildInExceptionAsync(context, ex, type);
                }
            }
        }

        private Task HandleCustomExceptionAsync(HttpContext context, Exception ex)
        {
            var exception = ex as IServiceException;
            var details = JsonSerializer.Serialize(new ProblemDetails()
            {
                Title = exception?.ErrorMessage,
                Detail = exception?.ErrorDetail,
                Status = (int)exception!.StatusCode
            });
            context.Response.ContentType = MediaTypeNames.Application.Json;
            context.Response.StatusCode = (int)exception.StatusCode;
            return context.Response.WriteAsync(details);
        }

        private Task HandleBuildInExceptionAsync(HttpContext context, Exception exception, Type exceptionType)
        {
            HttpStatusCode statusCode;
            bool check = _errorStatus.TryGetValue(exceptionType, out _);
            if (check)
            {
                statusCode = _errorStatus[exceptionType];
            }
            else
            {
                statusCode = HttpStatusCode.InternalServerError;
            }
            context.Response.ContentType = MediaTypeNames.Application.Json;
            context.Response.StatusCode = (int)statusCode;
            var dd = new ProblemDetails()
            {
                Title = "Error Has Occured",
                Detail = exception.Message,
                Status = context.Response.StatusCode
            };
            var details = JsonSerializer.Serialize(dd);
            return context.Response.WriteAsync(details);
        }
    }
}