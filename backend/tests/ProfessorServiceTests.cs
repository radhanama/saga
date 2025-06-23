using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using saga.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;

namespace saga.Tests;

public class ProfessorServiceTests : TestBase
{
    [Fact]
    public async Task CreateAndRetrieveProfessor()
    {
        var userService = new Mock<IUserService>();
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Email = "prof@example.com",
            Cpf = "99999999999",
            Role = RolesEnum.Professor,
            CreatedAt = DateTime.UtcNow
        };
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync(user);

        var logger = new Mock<ILogger<ProfessorService>>();
        var service = new ProfessorService(Repository, logger.Object, userService.Object);
        var dto = new ProfessorDto
        {
            Email = "prof@example.com",
            Cpf = "99999999999",
            Siape = "12345",
            Role = RolesEnum.Professor,
            ProjectIds = new List<string>()
        };

        var created = await service.CreateProfessorAsync(dto);
        Assert.Equal(user.Id, created.Id);

        var retrieved = await service.GetProfessorAsync(created.Id);
        Assert.Equal("prof@example.com", retrieved.Email);
        Assert.Equal("12345", retrieved.Siape);
    }
}
