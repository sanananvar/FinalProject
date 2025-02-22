using System;
namespace CA.Domain.Entities
{
	public class ProductDictionary : BaseEntity
	{
        public string Name { get; set; }

        public int LanguageId { get; set; }
        public Language Language { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; }
    }
}

