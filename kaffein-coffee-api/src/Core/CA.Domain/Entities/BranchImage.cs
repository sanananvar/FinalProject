namespace CA.Domain.Entities;

public class BranchImage : BaseEntity
{
    public string ImageSrc { get; set; }
    public int BranchId { get; set; }
    public Branch Branch { get; set; }
}
