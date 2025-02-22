using CA.Domain.Enums;

namespace CA.Domain.Entities;

public class Reviews : BaseEntity
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string Feedback { get; set; }
    public ReviewStatus ReviewStatus { get; set; }
    public int ProductId { get; set; }
    public Product Product { get; set; }
}
