namespace CA.Domain.Entities;

public class Product : BaseEntity
{
    public string ImageSrc { get; set; }
    public double Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }

    public ICollection<Reviews>? Reviews { get; set; }
    public HashSet<ProductDictionary> ProductDictionaries { get; set; }

    public Product()
    {
        ProductDictionaries = new HashSet<ProductDictionary>();
        Reviews = new HashSet<Reviews>();
    }
}
