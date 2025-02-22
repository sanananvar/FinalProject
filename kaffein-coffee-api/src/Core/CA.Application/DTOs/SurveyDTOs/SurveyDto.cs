using CA.Application.DTOs.ContactSourceDTOs;
using CA.Domain.Enums;

namespace CA.Application.DTOs.SurveyDTOs;

public class SurveyPostDto
{
    public bool Gender { get; set; }
    public SurveyAge Age { get; set; }
    public SurveyQualityPoint QualityPoint { get; set; }
    public int ContactSourceId { get; set; }
    public string Comment { get; set; }
    public ICollection<StatisfactionPostDto> Statisfactions { get; set; }
}

public class StatisfactionPostDto
{
    public ICollection<StatisfactionDictionaryPostDto> StatisfactionDictionaries { get; set; }
}

public class StatisfactionGetDto
{
    public ICollection<StatisfactionDictionaryGetDto> StatisfactionDictionaries { get; set; }
    public bool IsDeleted { get; set; }
}

public class StatisfactionDictionaryGetDto
{
    public int Id { get; set; }
    public string Key { get; set; }
    public StatisfactionQualityPoint Value { get; set; }
    public int LanguageId { get; set; }
    public bool IsDeleted { get; set; }

}


public class StatisfactionDictionaryPostDto
{
    public string Key { get; set; }
    public StatisfactionQualityPoint Value { get; set; }
    public int LanguageId { get; set; }
}



public class SurveyGetAllDto
{
    public int Id { get; set; }
    public bool Gender { get; set; }
    public SurveyAge Age { get; set; }
    public SurveyQualityPoint QualityPoint { get; set; }
    public ContactSourceGetDto ContactSource { get; set; }
    public string Comment { get; set; }
    public bool IsDeleted { get; set; }
    public ICollection<StatisfactionGetDto> Statisfactions { get; set; }
}

public class SurveyGetDto
{
    public int Id { get; set; }
    public bool Gender { get; set; }
    public SurveyAge Age { get; set; }
    public SurveyQualityPoint QualityPoint { get; set; }
    public ContactSourceGetDto ContactSource { get; set; }
    public string Comment { get; set; }
    public bool IsDeleted { get; set; }
    public ICollection<StatisfactionGetDto> Statisfactions { get; set; }
}