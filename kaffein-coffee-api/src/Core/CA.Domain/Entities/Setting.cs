namespace CA.Domain.Entities;

public class Setting : BaseEntity
{
    public HashSet<SettingDictionary> SettingDictionaries { get; set; }
}
