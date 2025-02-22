using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;

namespace CA.Persistence.Repositories;

public class ReviewRepository : Repository<Reviews>, IReviewRepository
{
    public ReviewRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}

