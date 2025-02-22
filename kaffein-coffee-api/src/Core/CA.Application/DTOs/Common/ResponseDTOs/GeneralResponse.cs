using System;
namespace CA.Application.DTOs.Common.ResponseDTOs
{
	public class GeneralResponse<T> : BaseReponse
    {
        public T Data { get; set; }
        public string? Url { get; set; }
    }
}

