using saga.Models.DTOs;
using saga.Models.Entities;

namespace saga.Services.Interfaces
{
    /// <summary>
    /// provides the contract for user-related operations in the application.
    /// It defines several methods for creating, retrieving, updating, and deleting user information.
    /// </summary>
    public interface IUserService
    {
        /// <summary>
        /// Creates a new user entity.
        /// </summary>
        /// <param name="userDto">The user entity to create.</param>
        /// <returns>The created user entity.</returns>
        Task<UserEntity> CreateUserAsync(UserDto userDto);

        /// <summary>
        /// Authenticate user with provided email and password
        /// </summary>
        /// <param name="loginDto">The LoginDto object containing email and password information</param>
        /// <returns>The generated JWT token</returns>
        Task<LoginResultDto> AuthenticateAsync(LoginDto loginDto);

        /// <summary>
        /// Requests a password reset for the user with the specified email.
        /// </summary>
        /// <param name="request">The request reset password data transfer object.</param>
        /// <returns>A task representing the asynchronous password reset request.</returns>
        /// <exception cref="ArgumentException">Thrown when the user with the specified email is not found.</exception>
        Task ResetPasswordRequestAsync(RequestResetPasswordDto loginDto);

        /// <summary>
        /// Resets the password for the user with the specified email.
        /// </summary>
        /// <param name="loginDto">The reset password data transfer object.</param>
        /// <returns>A task representing the asynchronous password reset operation.</returns>
        /// <exception cref="ArgumentException">Thrown when the user with the specified email is not found.</exception>
        Task<LoginResultDto> ResetPasswordAsync(ResetPasswordDto loginDto);

        /// <summary>
        /// Retrieves a paged list of users registered in the system.
        /// </summary>
        /// <param name="pageNumber">Page number starting at 1.</param>
        /// <param name="pageSize">Number of items per page.</param>
        /// <param name="search">Optional search string to filter users.</param>
        /// <returns>A collection of users.</returns>
        Task<IEnumerable<UserDto>> GetAllUsersAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null);

        /// <summary>
        /// Removes a user by its identifier.
        /// </summary>
        /// <param name="id">User identifier.</param>
        Task DeleteUserAsync(Guid id);
    }
}
