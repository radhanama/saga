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
        await Repository.User.AddAsync(user);
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync(user);

        var logger = new Mock<ILogger<StudentService>>();
        var service = new StudentService(Repository, logger.Object, userService.Object);
        var dto = new StudentDto
        {
            Email = "student@example.com",
            Cpf = "12345678901",
            Registration = "2023",
            Role = RolesEnum.Student,
            Gender = GenderEnum.Male,
            Status = StatusEnum.Active,
            Proficiency = true
        };

        var created = await service.CreateStudentAsync(dto);
        Assert.Equal(user.Id, created.Id);

        var retrieved = await service.GetStudentAsync(created.Id);
        Assert.Equal("2023", retrieved.Registration);
        Assert.Equal("student@example.com", retrieved.Email);
        Assert.Equal(GenderEnum.Male, retrieved.Gender);
        Assert.Equal(StatusEnum.Active, retrieved.Status);
        Assert.True(retrieved.Proficiency);
    }

    [Fact]
    public async Task ExportStudentsToCsv()
    {
        var user = await Repository.User.AddAsync(new UserEntity
        {
            Email = "export@example.com",
            Cpf = "98765432100",
            Role = RolesEnum.Student,
            PasswordHash = "pwd",
            CreatedAt = DateTime.UtcNow
        });

        await Repository.Student.AddAsync(new StudentEntity
        {
            UserId = user.Id,
            Registration = "R1"
        });

        var logger = new Mock<ILogger<StudentService>>();
        var service = new StudentService(Repository, logger.Object, Mock.Of<IUserService>());

        var csv = await service.ExportToCsvAsync(new[] { "Registration", "Email" });
        var content = System.Text.Encoding.UTF8.GetString(csv);

        Assert.Contains("Registration,Email", content);
        Assert.Contains("R1", content);
        Assert.Contains("export@example.com", content);
    }

    [Fact]
    public async Task UpdateStudent()
    {
        var userService = new Mock<IUserService>();
        var user = new UserEntity
        {
            Id = Guid.NewGuid(),
            Email = "stud2@example.com",
            Cpf = "22222222222",
            Role = RolesEnum.Student,
            CreatedAt = DateTime.UtcNow
        };
        await Repository.User.AddAsync(user);
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync(user);

        var logger = new Mock<ILogger<StudentService>>();
        var service = new StudentService(Repository, logger.Object, userService.Object);
        var dto = new StudentDto
        {
            Email = "stud2@example.com",
            Cpf = "22222222222",
            Registration = "2024",
            Role = RolesEnum.Student
        };

        var created = await service.CreateStudentAsync(dto);

        var updateDto = new StudentDto
        {
            Email = "stud2@example.com",
            Cpf = "22222222222",
            Registration = "2024",
            Role = RolesEnum.Student,
            Proficiency = true
        };

        var updated = await service.UpdateStudentAsync(created.Id, updateDto);
        Assert.True(updated.Proficiency);
    }
}
