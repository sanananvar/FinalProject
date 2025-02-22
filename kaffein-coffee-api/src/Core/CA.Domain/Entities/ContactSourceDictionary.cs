using System;
namespace CA.Domain.Entities;

public class ContactSourceDictionary : BaseEntity
{
    public string Name { get; set; }

    public int LanguageId { get; set; }
    public Language Language { get; set; }

    public int ContactSourceId { get; set; }
    public ContactSource ContactSource { get; set; }
}

