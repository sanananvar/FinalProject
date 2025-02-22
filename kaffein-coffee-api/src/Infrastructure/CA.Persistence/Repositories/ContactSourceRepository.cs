using CA.Application.Repositories;
using CA.Domain.Entities;
using CA.Persistence.Contexts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CA.Persistence.Repositories;

public class ContactSourceRepository : Repository<ContactSource>, IContactSourceRepository
{
    public ContactSourceRepository(ApplicationDbContext dbContext) : base(dbContext) {}
}
