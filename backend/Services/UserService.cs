using backend.Infrastructure.Validations;
using Infrastructure.EmailTemplates;
using saga.Infrastructure.Providers;
using saga.Infrastructure.Providers.Interfaces;
using saga.Infrastructure.Repositories;
using saga.Infrastructure.Validations;
using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Mapper;
using System.Linq;
using saga.Properties;
using saga.Services.Interfaces;
using System.Linq;

namespace saga.Services
{
    public class UserService : IUserService
    {
        private readonly IRepository _repository;
        private readonly IEmailSender _emailSender;
        private readonly ITokenProvider _tokenProvider;
        private readonly IUserContext _userContext;
        private readonly ILogger<UserService> _logger;
        private readonly Validations _validations;
        public UserService(
            IRepository repository,
            ITokenProvider tokenProvider,
            ILogger<UserService> logger,
            IEmailSender emailSender,
            Validations validations,
            IUserContext userContext
        )
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _tokenProvider = tokenProvider ?? throw new ArgumentNullException(nameof(tokenProvider));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _emailSender = emailSender ?? throw new ArgumentNullException(nameof(emailSender));
            _validations = validations ?? throw new ArgumentNullException(nameof(validations));
            _userContext = userContext ?? throw new ArgumentNullException(nameof(userContext));
        }

        /// <inheritdoc />
        public async Task<UserEntity> CreateUserAsync(UserDto userDto)
        {
            (var isValid, var message) = await _validations.UserValidator.CanAddUser(userDto);
            _logger.LogInformation($"Creating user{userDto.Email}");
            if (!isValid)
            {
                throw new ArgumentException(message);
            }
            var user = await _repository.User.AddAsync(userDto.ToUserEntity());
            var token = _tokenProvider.GenerateResetPasswordJwt(user, TimeSpan.FromDays(7));
            var content = EmailTemplates.WelcomeEmailTemplate(userDto.ResetPasswordPath ?? string.Empty, token);
            await _emailSender.SendEmail(userDto.Email ?? string.Empty, content.Subject, content.Body).ConfigureAwait(false);
            return user;
        }

        /// <inheritdoc />
        public async Task ResetPasswordRequestAsync(RequestResetPasswordDto request)
        {
            var user = await _repository.User.GetUserByEmail(request.Email ?? string.Empty) ?? throw new ArgumentException($"User with email {request.Email} not found.");

            var token = _tokenProvider.GenerateResetPasswordJwt(user, TimeSpan.FromMinutes(30));
            var resetContent = EmailTemplates.ResetPasswordEmailTemplate(request.ResetPasswordPath ?? string.Empty, token);
            await _emailSender.SendEmail(request.Email ?? string.Empty, resetContent.Subject, resetContent.Body).ConfigureAwait(false);
        }

        /// <inheritdoc />
        public async Task<LoginResultDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            (var isValid, var message) = await _validations.UserValidator.CanResetPassword(resetPasswordDto);

            if (!isValid)
            {
                throw new ArgumentException(message);
            }
            var user = await _repository.User.GetByIdAsync(_userContext.UserId.Value) ?? throw new ArgumentException($"User with email {_userContext.UserId} not found.");

            _logger.LogInformation($"Changing password of user: {user.Email}");
            user.PasswordHash = HashPassword(resetPasswordDto.Password);

            await _repository.User.UpdateAsync(user);

            var jwtToken = _tokenProvider.GenerateJwtToken(user);

            return user.ToDto(jwtToken);
        }


        /// <inheritdoc />
        public async Task<LoginResultDto> AuthenticateAsync(LoginDto loginDto)
        {
            var user = await _repository.User.GetUserByEmail(loginDto.Email?.ToLower() ?? string.Empty);
            if (user == null)
            {
                throw new ArgumentException($"User with email {loginDto.Email} not found.");
            }

            if (!VerifyPassword(loginDto.Password ?? "", user.PasswordHash ?? ""))
            {
                throw new ArgumentException("Invalid password.");
            }

            return user.ToDto(_tokenProvider.GenerateJwtToken(user));
        }

        /// <inheritdoc />
        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            var users = await _repository.User.GetAllAsync();
            return users.Select(u => u.ToUserDto());
        }

        /// <inheritdoc />
        public async Task<UserDto> GetUserAsync(Guid id)
        {
            var user = await _repository.User.GetByIdAsync(id) ?? throw new ArgumentException($"User with id {id} not found.");
            return user.ToUserDto();
        }

        /// <inheritdoc />
        public async Task<UserDto> UpdateUserAsync(Guid id, UserDto userDto)
        {
            var existingUser = await _repository.User.GetByIdAsync(id) ?? throw new ArgumentException($"User with id {id} not found.");
            existingUser = userDto.ToUserEntity(existingUser);
            await _repository.User.UpdateAsync(existingUser);
            return existingUser.ToUserDto();
        }

        /// <inheritdoc />
        public async Task DeleteUserAsync(Guid id)
        {
            await _repository.User.DeactiveByIdAsync(id);
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        private bool VerifyPassword(string password, string passwordHash)
        {
            return BCrypt.Net.BCrypt.Verify(password, passwordHash);
        }
    }
}
