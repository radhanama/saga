using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using saga.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;

namespace saga.Tests;

public class ExternalResearcherServiceTests : TestBase
{
    [Fact]
    public async Task CreateAndRetrieveExternalResearcher()
    {
        var userService = new Mock<IUserService>();
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Email = "ext@example.com",
            Cpf = "11111111111",
            Role = RolesEnum.ExternalResearcher,
            CreatedAt = DateTime.UtcNow
        };
        await Repository.User.AddAsync(user);
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync(user);

        var logger = new Mock<ILogger<ExternalResearcherService>>();
        var service = new ExternalResearcherService(Repository, logger.Object, userService.Object);
        var dto = new ExternalResearcherDto
        {
            Email = "ext@example.com",
            Cpf = "11111111111",
            Role = RolesEnum.ExternalResearcher
        };

        var created = await service.CreateExternalResearcherAsync(dto);
        Assert.Equal(user.Id, created.Id);

        var retrieved = await service.GetExternalResearcherAsync(created.Id);
        Assert.Equal("ext@example.com", retrieved.Email);
    }

    [Fact]
    public async Task UpdateExternalResearcher()
    {
        var userService = new Mock<IUserService>();
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Email = "ext2@example.com",
            Cpf = "22222222222",
            Role = RolesEnum.ExternalResearcher,
            CreatedAt = DateTime.UtcNow
        };
        await Repository.User.AddAsync(user);
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync(user);

        var logger = new Mock<ILogger<ExternalResearcherService>>();
        var service = new ExternalResearcherService(Repository, logger.Object, userService.Object);
        var dto = new ExternalResearcherDto
        {
            Email = "ext2@example.com",
            Cpf = "22222222222",
            Role = RolesEnum.ExternalResearcher
        };

        var created = await service.CreateExternalResearcherAsync(dto);

        var updateDto = new ExternalResearcherDto
        {
            Email = "ext2@example.com",
            Cpf = "22222222222",
            Institution = "New Inst",
            Role = RolesEnum.ExternalResearcher
        };

        var updated = await service.UpdateExternalResearcherAsync(created.Id, updateDto);

        Assert.Equal("New Inst", updated.Institution);
    }
}
