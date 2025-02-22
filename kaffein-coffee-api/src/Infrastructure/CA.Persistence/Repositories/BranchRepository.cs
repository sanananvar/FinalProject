using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;

namespace CA.Persistence.Repositories;

public class BranchRepository : Repository<Branch>, IBranchRepository
{
    public BranchRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}
