using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using saga.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;

namespace saga.Tests;

public class StudentServiceTests : TestBase
{
    [Fact]
    public async Task CreateAndRetrieveStudent()
    {
        var userService = new Mock<IUserService>();
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Email = "student@example.com",
            Cpf = "12345678901",
            Role = RolesEnum.Student,
            CreatedAt = DateTime.UtcNow
        };
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync(user);

        var logger = new Mock<ILogger<StudentService>>();
        var service = new StudentService(Repository, logger.Object, userService.Object);
        var dto = new StudentDto
        {
            Email = "student@example.com",
            Cpf = "12345678901",
            Registration = "2023",
            Role = RolesEnum.Student
        };

        var created = await service.CreateStudentAsync(dto);
        Assert.Equal(user.Id, created.Id);

        var retrieved = await service.GetStudentAsync(created.Id);
        Assert.Equal("2023", retrieved.Registration);
        Assert.Equal("student@example.com", retrieved.Email);
    }
}
