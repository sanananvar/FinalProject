namespace CA.Domain.Entities;

public class Statisfaction : BaseEntity
{
    public int SurveyId { get; set; }
    public Survey Survey { get; set; }

    public HashSet<StatisfactionDictionary> StatisfactionDictionaries { get; set; }

    public Statisfaction()
    {
        StatisfactionDictionaries = new HashSet<StatisfactionDictionary>();
    }
}
