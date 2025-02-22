using System;
using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;

namespace CA.Persistence.Repositories;

public class CarouselRepository : Repository<Carousel>, ICarouselRepository
{
    public CarouselRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}

