using Microsoft.AspNetCore.Http;

namespace CA.Application.DTOs.CarouselDTOs;

public class CarouselPostDto
{
    public IFormFile ImageFile { get; set; }
    public int Order { get; set; }
    public List<CarouselDictionaryPostDto> CarouselDictionaries { get; set; }
}

public class CarouselUpdateDto
{
    public int Order { get; set; }
    public IFormFile? ImageFile { get; set; }
    public List<CarouselDictionaryUpdateDto> CarouselDictionaries { get; set; }
}

public class CarouselGetAllDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; }
    public int Order { get; set; }
    public bool IsDeleted { get; set; }
    public List<CarouselDictionaryGetAllDto> CarouselDictionaries { get; set; }
}

public class CarouselGetDto
{
    public int Id { get; set; }
    public string? ImageUrl { get; set; }
    public int Order { get; set; }
    public bool IsDeleted { get; set; }
    public List<CarouselDictionaryGetAllDto> CarouselDictionaries { get; set; }
}

public class CarouselDictionaryPostDto
{
    public string Content { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class CarouselDictionaryUpdateDto
{
    public int Id { get; set; }
    public string Content { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class CarouselDictionaryGetAllDto
{
    public int Id { get; set; }
    public string Content { get; set; } = null!;
    public int LanguageId { get; set; }
}
