using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;

namespace CA.Persistence.Repositories;

public class SurveyRepository : Repository<Survey>, ISurveyRepository
{
    public SurveyRepository(ApplicationDbContext dbContext) : base(dbContext) { }
}