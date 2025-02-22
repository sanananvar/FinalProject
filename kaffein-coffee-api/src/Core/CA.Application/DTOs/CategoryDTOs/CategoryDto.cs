using CA.Application.DTOs.ProductDTOs;

namespace CA.Application.DTOs.CategoryDTOs;

public class CategoryPostDto
{
    public int? ParentCategoryId { get; set; }
    public List<CategoryDictionaryPostDto> CategoryDictionaries { get; set; }
}

public class CategoryUpdateDto
{
    public int? ParentCategoryId { get; set; }
    public List<CategoryDictionaryUpdateDto> CategoryDictionaries { get; set; }
}

public class CategoryGetAllDto
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; }
    public CategoryGetDto? ParentCategory { get; set; }
    public ICollection<CategoryGetDto>? SubCategories { get; set; }
    public List<CategoryDictionaryGetAllDto> CategoryDictionaries { get; set; }
}

public class CategoryGetDto
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; }
    public CategoryGetDto? ParentCategory { get; set; }
    public ICollection<CategoryGetDto>? SubCategories { get; set; }
    public ICollection<ProductGetAllDto> Products { get; set; }
    public List<CategoryDictionaryGetAllDto> CategoryDictionaries { get; set; }
}

public class CategoryDictionaryPostDto
{
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class CategoryDictionaryUpdateDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class CategoryDictionaryGetAllDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

