using CA.Domain.Enums;

namespace CA.Domain.Entities;

public class Survey : BaseEntity
{
    public bool Gender { get; set; }
    public SurveyAge Age { get; set; }
    public SurveyQualityPoint QualityPoint { get; set; }
    public int ContactSourceId { get; set; }
    public ContactSource ContactSource { get; set; }
    public ICollection<Statisfaction> Statisfactions { get; set; }
    public string Comment { get; set; }

    public Survey()
    {
        Statisfactions = new HashSet<Statisfaction>();
    }
}
