namespace CA.Domain.Entities;

public class ContactSource : BaseEntity
{
    public ICollection<Survey> Surveys { get; set; }

    public HashSet<ContactSourceDictionary> ContactSourceDictionaries { get; set; }

    public ContactSource()
    {
        ContactSourceDictionaries = new HashSet<ContactSourceDictionary>();
        Surveys = new HashSet<Survey>();
    }
}
