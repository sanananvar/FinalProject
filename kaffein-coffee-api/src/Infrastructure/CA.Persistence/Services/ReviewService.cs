using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.ReviewDTOs;
using CA.Application.Exceptions.Common;
using CA.Application.Repositories;
using CA.Application.Services;
using CA.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CA.Persistence.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IProductRepository _productRepository;

        public ReviewService(IReviewRepository reviewRepository, IProductRepository productRepository)
        {
            _reviewRepository = reviewRepository;
            _productRepository = productRepository;
        }

        public async Task CreateAsync(ReviewPostDto dto, int productId)
        {
            var product = await _productRepository.GetQuery(x => x.Id == productId && !x.IsDeleted, false, false).FirstOrDefaultAsync();
            if (product is null) throw new NotFoundException("Product not found");

            var entity = new Reviews
            {
                Name = dto.Name,
                Surname = dto.Surname,
                Email = dto.Email,
                Feedback = dto.Feedback,
                IsDeleted = false,
                ProductId = productId,
                ReviewStatus = Domain.Enums.ReviewStatus.Pending,
                Product = product,
                CreatedAt = DateTime.UtcNow.AddHours(4),
                UpdatedAt = DateTime.UtcNow.AddHours(4)
            };

            await _reviewRepository.AddAsync(entity);
            await _reviewRepository.SaveAsync();
        }

        public async Task<PaginatedResponse<ReviewGetDto>> GetAllAsync(int productId, int pageNumber = 1, int pageSize = 10, bool isPagination = true, bool isAdmin = true)
        {
            var productExists = await _productRepository.GetQuery(x => x.Id == productId && !x.IsDeleted, false, false).AnyAsync();
            if (!productExists) throw new NotFoundException("Product not found");

            var query = _reviewRepository.GetQuery(x => x.ProductId == productId, false, false, "Product");

            IEnumerable<Reviews> entities = !isAdmin
                    ? await query.Where(x => !x.IsDeleted && x.ReviewStatus == Domain.Enums.ReviewStatus.Accepted).ToListAsync()
                    : await query.ToListAsync();

            int totalItems = entities.Count();
            if (isPagination)
            {
                entities = entities.Skip((pageNumber - 1) * pageSize).Take(pageSize);
            }

            var countriGetDtos = entities.Select(x => new ReviewGetDto
            {
                Id = x.Id,
                Name = x.Name,
                Surname = x.Surname,
                Email = x.Email,
                Feedback = x.Feedback,
                IsDeleted = x.IsDeleted,
            }).ToList();

            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var paginatedResponse = new PaginatedResponse<ReviewGetDto>
            {
                Items = countriGetDtos,
                TotalItems = totalItems,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = totalPages
            };

            return paginatedResponse;
        }

        public async Task<ReviewGetDto> GetAsync(int id, bool isAdmin = true)
        {
            var query = _reviewRepository.GetQuery(x => x.Id == id, false, false);

            var entity = !isAdmin
                    ? await query.Where(x => !x.IsDeleted && x.ReviewStatus == Domain.Enums.ReviewStatus.Accepted).FirstOrDefaultAsync()
                    : await query.FirstOrDefaultAsync();

            if (entity is null) throw new NotFoundException("Entity not found");

            var dto = new ReviewGetDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Surname = entity.Surname,
                Email = entity.Email,
                Feedback = entity.Feedback,
                IsDeleted = entity.IsDeleted,
            };

            return dto;
        }

        public async Task ConfirmAsync(int id)
        {
            var entity = await _reviewRepository.GetQuery(x => x.Id == id, true, false).FirstOrDefaultAsync();

            if (entity is null) throw new NotFoundException("Entity not found");

            entity.ReviewStatus = Domain.Enums.ReviewStatus.Accepted;
            entity.IsDeleted = false;
            entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

            await _reviewRepository.SaveAsync();
        }

        public async Task RejectAsync(int id)
        {
            var entity = await _reviewRepository.GetQuery(x => x.Id == id, true, false).FirstOrDefaultAsync();

            if (entity is null) throw new NotFoundException("Entity not found");

            entity.ReviewStatus = Domain.Enums.ReviewStatus.Rejected;
            entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

            await _reviewRepository.SaveAsync();
        }

        public async Task RemoveAsync(int id)
        {
            var entity = await _reviewRepository.GetQuery(x => x.Id == id, true, false).FirstOrDefaultAsync();

            if (entity is null) throw new NotFoundException("Entity not found");

            entity.IsDeleted = true;
            await _reviewRepository.UpdateAsync(entity);
            await _reviewRepository.SaveAsync();
        }

        public async Task UpdateAsync(ReviewUpdateDto dto, int id)
        {
            var entity = await _reviewRepository.GetQuery(x => x.Id == id, true, false).FirstOrDefaultAsync();

            if (entity is null) throw new NotFoundException("Entity not found");

            entity.Feedback = dto.Feedback;
            entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

            await _reviewRepository.UpdateAsync(entity);
            await _reviewRepository.SaveAsync();
        }

        public async Task RevertAsync(int id)
        {
            var entity = await _reviewRepository.GetQuery(x => x.Id == id, true, false).FirstOrDefaultAsync();

            if (entity is null) throw new NotFoundException("Entity not found");

            entity.IsDeleted = false;
            entity.UpdatedAt = DateTime.UtcNow.AddHours(4);

            await _reviewRepository.UpdateAsync(entity);
            await _reviewRepository.SaveAsync();
        }
    }
}

