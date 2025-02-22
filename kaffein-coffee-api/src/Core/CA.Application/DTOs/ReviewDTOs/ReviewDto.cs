namespace CA.Application.DTOs.ReviewDTOs;

public class ReviewPostDto
{
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Feedback { get; set; } = null!;
}

public class ReviewUpdateDto
{
    public string Feedback { get; set; } = null!;
}

public class ReviewGetDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Surname { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Feedback { get; set; } = null!;
    public bool IsDeleted { get; set; }
}

