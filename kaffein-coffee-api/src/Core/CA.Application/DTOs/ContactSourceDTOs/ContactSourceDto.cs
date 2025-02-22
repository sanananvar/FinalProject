namespace CA.Application.DTOs.ContactSourceDTOs;

public class ContactSourcePostDto
{
    public List<ContactSourceDictionaryPostDto> ContactSourceDictionaries { get; set; }
}

public class ContactSourceUpdateDto
{
    public List<ContactSourceDictionaryUpdateDto> ContactSourceDictionaries { get; set; }
}

public class ContactSourceGetAllDto
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; }
    public List<ContactSourceDictionaryGetAllDto> ContactSourceDictionaries { get; set; }
}

public class ContactSourceGetDto
{
    public int Id { get; set; }
    public bool IsDeleted { get; set; }
    public List<ContactSourceDictionaryGetAllDto> ContactSourceDictionaries { get; set; }
}

public class ContactSourceDictionaryPostDto
{
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class ContactSourceDictionaryUpdateDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}

public class ContactSourceDictionaryGetAllDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int LanguageId { get; set; }
}
