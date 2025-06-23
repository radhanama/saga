using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using saga.Infrastructure.Providers;
using backend.Infrastructure.Validations;
using saga.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using saga.Infrastructure.Providers.Interfaces;
using saga.Infrastructure.Validations;

namespace saga.Tests;

public class UserServiceTests : TestBase
{
    private class DummyUserContext : IUserContext
    {
        public Guid? UserId { get; set; }
        public RolesEnum? Role { get; set; }
    }

    [Fact]
    public async Task AuthenticateUser()
    {
        var password = "secret";
        var hashed = BCrypt.Net.BCrypt.HashPassword(password);
        var user = await Repository.User.AddAsync(new UserEntity
        {
            Email = "auth@example.com",
            Cpf = "44444444444",
            PasswordHash = hashed,
            Role = RolesEnum.Student,
            CreatedAt = DateTime.UtcNow
        });

        var tokenProvider = new Mock<ITokenProvider>();
        tokenProvider.Setup(t => t.GenerateJwtToken(It.IsAny<UserEntity>())).Returns("token");
        var emailSender = new Mock<IEmailSender>();
        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var logger = new Mock<ILogger<UserService>>();
        var userContext = new DummyUserContext();
        var service = new UserService(Repository, tokenProvider.Object, logger.Object, emailSender.Object, validations, userContext);

        var result = await service.AuthenticateAsync(new LoginDto { Email = user.Email, Password = password });

        Assert.Equal("token", result.Token);
        Assert.Equal(user.Email, result.User!.Email);
    }
}
