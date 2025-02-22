using System;
namespace CA.Domain.Entities;

public class CategoryDictionary : BaseEntity
{
    public string Name { get; set; }

    public int LanguageId { get; set; }
    public Language Language { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; }
}

