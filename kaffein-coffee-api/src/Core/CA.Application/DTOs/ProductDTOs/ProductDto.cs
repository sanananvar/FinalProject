using CA.Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace CA.Application.DTOs.ProductDTOs;

public class ProductPostDto
{
    public IFormFile Image { get; set; }
    public double Price { get; set; }
    public int CategoryId { get; set; }
    public HashSet<ProductDictionaryPostDto> ProductDictionaries { get; set; }
}

public class ProductUpdateDto
{
    public IFormFile Image { get; set; }
    public double Price { get; set; }
    public int CategoryId { get; set; }
    public HashSet<ProductDictionaryUpdateDto> ProductDictionaries { get; set; }
}

public class ProductGetAllDto
{
    public int Id { get; set; }
    public string ImageSrc { get; set; }
    public double Price { get; set; }
    public int CategoryId { get; set; }
    public bool IsDeleted { get; set; }
    public ICollection<Reviews> Reviews { get; set; }
    public HashSet<ProductDictionaryGetAllDto> ProductDictionaries { get; set; }
}

public class ProductGetDto
{
    public int Id { get; set; }
    public string ImageSrc { get; set; }
    public double Price { get; set; }
    public int CategoryId { get; set; }
    public bool IsDeleted { get; set; }
    public ICollection<Reviews> Reviews { get; set; }
    public HashSet<ProductDictionaryGetAllDto> ProductDictionaries { get; set; }
}

public class ProductDictionaryPostDto
{
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class ProductDictionaryUpdateDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class ProductDictionaryGetAllDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}