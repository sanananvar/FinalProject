using Microsoft.AspNetCore.Http;

namespace CA.Application.DTOs.BranchDTOs;

public class BranchPostDto
{
    public ICollection<IFormFile> ImageFiles { get; set; }
    public List<BranchDictionaryPostDto> BranchDictionaries { get; set; }
}

public class BranchUpdateDto
{
    public HashSet<BranchImageUpdateDto>? Images { get; set; }
    public List<BranchDictionaryUpdateDto> BranchDictionaries { get; set; }
}

public class BranchImageUpdateDto
{
    public int? ExistingImageId { get; set; }
    public IFormFile? Image { get; set; } = null!;

}

public class BranchGetAllDto
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; }

    public List<BranchImageGetDto> BranchImages { get; set; }
    public List<BranchDictionaryGetAllDto> BranchDictionaries { get; set; }
}

public class BranchGetDto
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; }
    public List<BranchImageGetDto>? BranchImages { get; set; }
    public List<BranchDictionaryGetAllDto> BranchDictionaries { get; set; }
}

public class BranchImageGetDto
{
    public int Id { get; set; }
    public string ImageUrl { get; set; }
}

public class BranchDictionaryPostDto
{
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class BranchDictionaryUpdateDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class BranchDictionaryGetAllDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}
