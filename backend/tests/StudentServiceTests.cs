using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using saga.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using backend.Infrastructure.Validations;
using saga.Infrastructure.Providers;
using saga.Infrastructure.Validations;

namespace saga.Tests;

public class StudentServiceTests : TestBase
{
    private class DummyUserContext : IUserContext
    {
        public Guid? UserId { get; set; }
        public RolesEnum? Role { get; set; }
    }
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
        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var service = new StudentService(Repository, logger.Object, userService.Object, validations);
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

    [Fact]
    public async Task CannotCreateStudentWithDuplicateCpf()
    {
        var existingUser = await Repository.User.AddAsync(new UserEntity
        {
            Email = "old@example.com",
            Cpf = "99999999999",
            Role = RolesEnum.Student,
            CreatedAt = DateTime.UtcNow
        });

        await Repository.Student.AddAsync(new StudentEntity
        {
            Id = existingUser.Id,
            UserId = existingUser.Id,
            Registration = "R1"
        });

        var userService = new Mock<IUserService>();
        var logger = new Mock<ILogger<StudentService>>();
        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var service = new StudentService(Repository, logger.Object, userService.Object, validations);

        var dto = new StudentDto
        {
            Email = "new@example.com",
            Cpf = "99999999999",
            Registration = "2024",
            Role = RolesEnum.Student
        };

        await Assert.ThrowsAsync<ArgumentException>(() => service.CreateStudentAsync(dto));
        userService.Verify(s => s.CreateUserAsync(It.IsAny<UserDto>()), Times.Never);
    }
}
