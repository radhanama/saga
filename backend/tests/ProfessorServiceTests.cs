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
        await Repository.User.AddAsync(user);
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

    [Fact]
    public async Task UpdateProfessor()
    {
        var userService = new Mock<IUserService>();
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Email = "prof2@example.com",
            Cpf = "77777777777",
            Role = RolesEnum.Professor,
            CreatedAt = DateTime.UtcNow
        };
        await Repository.User.AddAsync(user);
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync(user);

        var logger = new Mock<ILogger<ProfessorService>>();
        var service = new ProfessorService(Repository, logger.Object, userService.Object);
        var dto = new ProfessorDto
        {
            Email = "prof2@example.com",
            Cpf = "77777777777",
            Siape = "54321",
            Role = RolesEnum.Professor,
            ProjectIds = new List<string>()
        };

        var created = await service.CreateProfessorAsync(dto);

        var updateDto = new ProfessorDto
        {
            Email = "prof2@example.com",
            Cpf = "77777777777",
            Siape = "54321-upd",
            Role = RolesEnum.Professor,
            ProjectIds = new List<string>()
        };

        var updated = await service.UpdateProfessorAsync(created.Id, updateDto);

        Assert.Equal("54321-upd", updated.Siape);
    }

    [Fact]
    public async Task ExportProfessorsToCsv()
    {
        var userService = new Mock<IUserService>();
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Email = "exportprof@example.com",
            Cpf = "88888888888",
            Role = RolesEnum.Professor,
            CreatedAt = DateTime.UtcNow
        };
        await Repository.User.AddAsync(user);
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync(user);

        var logger = new Mock<ILogger<ProfessorService>>();
        var service = new ProfessorService(Repository, logger.Object, userService.Object);
        var dto = new ProfessorDto
        {
            Email = "exportprof@example.com",
            Cpf = "88888888888",
            Siape = "9999",
            Role = RolesEnum.Professor,
            ProjectIds = new List<string>()
        };

        await service.CreateProfessorAsync(dto);

        var csv = await service.ExportToCsvAsync(null);
        var content = System.Text.Encoding.UTF8.GetString(csv);
        var header = content.Split('\n')[0];

        Assert.Contains("Siape", header);
        Assert.Contains("exportprof@example.com", content);
    }
}
