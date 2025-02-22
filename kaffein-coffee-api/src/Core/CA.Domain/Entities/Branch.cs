namespace CA.Domain.Entities;

public class Branch : BaseEntity
{
    public ICollection<BranchImage>? BranchImages { get; set; }

    public HashSet<BranchDictionary> BranchDictionaries { get; set; }

    public Branch()
    {
        BranchDictionaries = new HashSet<BranchDictionary>();
        BranchImages = new HashSet<BranchImage>();
    }
}
