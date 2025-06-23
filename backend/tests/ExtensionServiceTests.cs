using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using Microsoft.Extensions.Logging;
using Moq;

namespace saga.Tests;

public class ExtensionServiceTests : TestBase
{
    [Fact]
    public async Task CreateAndRetrieveExtension()
    {
        var user = await Repository.User.AddAsync(new UserEntity
        {
            Email = "stud2@example.com",
            Cpf = "22222222222",
            Role = RolesEnum.Student,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("pwd"),
            CreatedAt = DateTime.UtcNow
        });

        var student = await Repository.Student.AddAsync(new StudentEntity
        {
            Id = user.Id,
            UserId = user.Id,
            Registration = "R2"
        });

        var logger = new Mock<ILogger<ExtensionService>>();
        var service = new ExtensionService(Repository, logger.Object);
        var dto = new ExtensionDto
        {
            StudentId = student.Id,
            NumberOfDays = 15,
            Type = ExtensionTypeEnum.Defence
        };

        var created = await service.CreateExtensionAsync(dto);
        Assert.NotNull(created.Id);

        var retrieved = await service.GetExtensionAsync(created.Id!.Value);
        Assert.Equal(15, retrieved.NumberOfDays);
        Assert.Equal(student.Id, retrieved.StudentId);
    }

    [Fact]
    public async Task CreateExtension_WithNullProjectDate_KeepsDateNull()
    {
        var user = await Repository.User.AddAsync(new UserEntity
        {
            Email = "stud3@example.com",
            Cpf = "33333333333",
            Role = RolesEnum.Student,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("pwd"),
            CreatedAt = DateTime.UtcNow
        });

        var student = await Repository.Student.AddAsync(new StudentEntity
        {
            Id = user.Id,
            UserId = user.Id,
            Registration = "R3"
        });

        var logger = new Mock<ILogger<ExtensionService>>();
        var service = new ExtensionService(Repository, logger.Object);

        var dto = new ExtensionDto
        {
            StudentId = student.Id,
            NumberOfDays = 5,
            Type = ExtensionTypeEnum.Defence
        };

        await service.CreateExtensionAsync(dto);
        var updatedStudent = await Repository.Student.GetByIdAsync(student.Id);
        Assert.Null(updatedStudent!.ProjectDefenceDate);
    }
}
