using System;
namespace CA.Domain.Entities;

public class SettingDictionary : BaseEntity
{
    public string Key { get; set; }
    public string Value { get; set; }

    public int LanguageId { get; set; }
    public Language Language { get; set; }

    public int SettingId { get; set; }
    public Setting Setting { get; set; }
}

