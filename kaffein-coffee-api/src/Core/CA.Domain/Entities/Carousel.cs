namespace CA.Domain.Entities;

public class Carousel : BaseEntity
{
    public string ImageSrc { get; set; }
    public int Order { get; set; }

    public HashSet<CarouselDictionary> CarouselDictionaries { get; set; }

    public Carousel()
    {
        CarouselDictionaries = new HashSet<CarouselDictionary>();
    }
}
