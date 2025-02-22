using System;
namespace CA.Application.DTOs.Common.ResponseDTOs
{
	public class PaginatedResponse<T>
    {
        public IEnumerable<T> Items { get; set; } = null!;
        public int TotalItems { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }

        public Dictionary<string, object> AdditionalInfo { get; set; } = new Dictionary<string, object>();
    }
}

