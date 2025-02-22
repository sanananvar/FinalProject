using System;
using CA.Application.DTOs.Common.ResponseDTOs;
using CA.Application.DTOs.IdentityDTOs;
using CA.Application.DTOs.TokenDTOs;

namespace CA.Application.Services
{
	public interface IIdentityService
	{
        //public Task<PaginatedResponse<AllUserGetDto>> GetAllUsers(int pageNumber = 1, int pageSize = 10, bool isPagination = true);
        //public Task<PaginatedResponse<AllUserGetDto>> GetAllAdmins(int pageNumber = 1, int pageSize = 10, bool isPagination = true);
        //public Task<UserGetDto> GetUser(string id);
        //public Task<UserGetDto> GetAdmin(string id);
        public Task<BaseReponse> ChangeUserStatus(string id);
        public Task<BaseReponse> RemoveUser(string id);
        public Task<BaseReponse> RemoveAdmin(string id);
        public Task<BaseReponse> Register(RegisterDto registerDto, string? role = null);
        public Task<TokenResponseDto> Login(LoginDto loginDto, int accessTokenLifeTime, string? role = null);
        public Task<object> GetCurrentUser();
        //public Task<object> UpdateUser(UpdateDto dto);
        public Task<BaseReponse> UpdateAdmin(UpdateUserDto dto, string id);
        public Task<BaseReponse> Logout();
        public Task<BaseReponse> AssignRole(string email, string role);
        public Task<BaseReponse> RemoveRole(string email, string role);
    }
}

