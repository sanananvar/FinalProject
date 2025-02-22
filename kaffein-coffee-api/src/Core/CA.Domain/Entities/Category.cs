namespace CA.Domain.Entities;

public class Category : BaseEntity
{
    public int? ParentCategoryId { get; set; }
    public virtual Category? ParentCategory { get; set; }

    public virtual ICollection<Category>? SubCategories { get; set; } = new List<Category>();

    public ICollection<Product>? Products { get; set; }

    public HashSet<CategoryDictionary> CategoryDictionaries { get; set; }

    public Category()
    {
        CategoryDictionaries = new HashSet<CategoryDictionary>();
        SubCategories = new HashSet<Category>();
        Products = new HashSet<Product>();
    }
}
