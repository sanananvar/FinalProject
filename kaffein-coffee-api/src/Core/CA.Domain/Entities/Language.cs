namespace CA.Domain.Entities;

public class Language : BaseEntity
{
    public string Code { get; set; }
    public string Name { get; set; }

    public HashSet<BranchDictionary> BranchDictionaries { get; set; }
    public HashSet<ProductDictionary> ProductDictionaries { get; set; }
    public HashSet<CarouselDictionary> CarouselDictionaries { get; set; }
    public HashSet<CategoryDictionary> CategoryDictionaries { get; set; }
    public HashSet<ContactSourceDictionary> ContactSourceDictionaries { get; set; }
    public HashSet<SettingDictionary> SettingDictionaries { get; set; }
    public HashSet<StatisfactionDictionary> StatisfactionDictionaries { get; set; }

    public Language()
    {
        BranchDictionaries = new HashSet<BranchDictionary>();
        ProductDictionaries = new HashSet<ProductDictionary>();
        CarouselDictionaries = new HashSet<CarouselDictionary>();
        CategoryDictionaries = new HashSet<CategoryDictionary>();
        ContactSourceDictionaries = new HashSet<ContactSourceDictionary>();
        SettingDictionaries = new HashSet<SettingDictionary>();
        StatisfactionDictionaries = new HashSet<StatisfactionDictionary>();
    }
}

