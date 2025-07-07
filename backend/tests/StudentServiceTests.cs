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
            .ReturnsAsync((UserDto _) =>
            {
                Repository.User.AddAsync(user).Wait();
                return user;
            });

        var logger = new Mock<ILogger<StudentService>>();
        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var service = new StudentService(Repository, logger.Object, userService.Object, validations);
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
        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var service = new StudentService(Repository, logger.Object, Mock.Of<IUserService>(), validations);

        var csv = await service.ExportToCsvAsync(null);
        var content = System.Text.Encoding.UTF8.GetString(csv);
        var header = content.Split('\n')[0];

        Assert.Contains("Registration", header);
        Assert.Contains("Email", header);
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
        userService.Setup(s => s.CreateUserAsync(It.IsAny<UserDto>()))
            .ReturnsAsync((UserDto _) =>
            {
                Repository.User.AddAsync(user).Wait();
                return user;
            });

        var logger = new Mock<ILogger<StudentService>>();
        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var service = new StudentService(Repository, logger.Object, userService.Object, validations);
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

    [Fact]
    public async Task GetStudentsPaged()
    {
        var user1 = await Repository.User.AddAsync(new UserEntity
        {
            Email = "p1@example.com",
            Cpf = "11111111111",
            Role = RolesEnum.Student,
            CreatedAt = DateTime.UtcNow
        });
        await Repository.Student.AddAsync(new StudentEntity
        {
            UserId = user1.Id,
            Registration = "R1"
        });

        var user2 = await Repository.User.AddAsync(new UserEntity
        {
            Email = "p2@example.com",
            Cpf = "22222222222",
            Role = RolesEnum.Student,
            CreatedAt = DateTime.UtcNow
        });
        await Repository.Student.AddAsync(new StudentEntity
        {
            UserId = user2.Id,
            Registration = "R2"
        });

        var service = new StudentService(Repository, Mock.Of<ILogger<StudentService>>(), Mock.Of<IUserService>(), new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext()));

        var page = await service.GetStudentsPagedAsync(1, 1);

        Assert.Equal(2, page.TotalCount);
        Assert.Single(page.Items);
    }
}
