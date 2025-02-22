namespace CA.Domain.Entities;

public class BranchDictionary : BaseEntity
{
    public string Name { get; set; }

    public int LanguageId { get; set; }
    public Language Language { get; set; }

    public int BranchId { get; set; }
    public Branch Branch { get; set; }
}

