using CA.Domain.Enums;
using System;
namespace CA.Domain.Entities;

public class StatisfactionDictionary : BaseEntity
{
    public string Key { get; set; }
    public StatisfactionQualityPoint Value { get; set; }

    public int LanguageId { get; set; }
    public Language Language { get; set; }

    public int StatisfactionId { get; set; }
    public Statisfaction Statisfaction { get; set; }
}

