using System;
namespace CA.Application.DTOs.Common.ResponseDTOs
{
	public class BaseReponse
	{
        public string? Message { get; set; }
        public int StatusCode { get; set; }
        public Guid Id { get; set; }
        public string Id2 { get; set; }
    }
}

