using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace CA.Application.DTOs.CandidatDTOs;

public class CandidatePostDTO
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }
    [Required]
    [MaxLength(50)]
    public string Surname { get; set; }
    [Phone]
    [Required]
    [MaxLength(20)]
    public string Number { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public IFormFile ResumeFile { get; set; }
}

public class CandidateGetDTO
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Number { get; set; }
    public string Email { get; set; }
    public string ResumePath { get; set; }
    public bool IsDeleted { get; set; }

}

public class CandidateUpdateDTO
{
    [Required]
    [MaxLength(50)]
    public string Name { get; set; }
    [Required]
    [MaxLength(50)]
    public string Surname { get; set; }
    [Phone]
    [Required]
    [MaxLength(20)]
    public string Number { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
}