using System;
namespace CA.Domain.Entities;

public class CarouselDictionary : BaseEntity
{
    public string Content { get; set; }

    public int LanguageId { get; set; }
    public Language Language { get; set; }

    public int CarouselId { get; set; }
    public Carousel Carousel { get; set; }
}

