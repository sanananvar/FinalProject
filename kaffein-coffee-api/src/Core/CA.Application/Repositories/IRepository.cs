using CA.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace CA.Application.Repositories
{
    public interface IRepository<T> where T : BaseEntity, new()
    {
        DbSet<T> Table { get; }
        public Task<IQueryable<T>> GetAllAsync(Expression<Func<T, bool>> expression, bool isTracking, bool isRelation, params string[] Includes);
        public Task<T> GetAsync(Expression<Func<T, bool>> expression, bool IsTracking, bool isRelation, params string[] Includes);
        public T Get(Expression<Func<T, bool>> expression, bool IsTracking, bool isRelation, params string[] Includes);
        public IQueryable<T> GetQuery(Expression<Func<T, bool>>? expression, bool IsTracking, bool isRelation, params string[] Includes);
        public bool IsExsist(Expression<Func<T, bool>> expression);
        public Task AddAsync(T entity);
        public Task AddRangeAsync(IEnumerable<T> entities);
        public Task UpdateAsync(T entity);
        public Task<int> SaveAsync();
        public int Save();
    }
}

