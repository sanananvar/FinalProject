namespace CA.Domain.Entities;

public class Candidate : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string Number { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string ResumePath { get; set; } = null!;
}
