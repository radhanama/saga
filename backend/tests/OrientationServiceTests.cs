using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using Microsoft.Extensions.Logging;
using Moq;
using backend.Infrastructure.Validations;
using saga.Infrastructure.Providers;
using saga.Infrastructure.Validations;

namespace saga.Tests;

public class OrientationServiceTests : TestBase
{
    private class DummyUserContext : IUserContext
    {
        public Guid? UserId { get; set; }
        public RolesEnum? Role { get; set; }
    }

    [Fact]
    public async Task CreateAndRetrieveOrientation()
    {
        var researchLine = await Repository.ResearchLine.AddAsync(new ResearchLineEntity { Name = "AI" });
        var project = await Repository.Project.AddAsync(new ProjectEntity { ResearchLineId = researchLine.Id, Name = "Proj", Status = ProjectStatusEnum.Active });

        var user = await Repository.User.AddAsync(new UserEntity
        {
            Email = "stu3@example.com",
            Cpf = "33333333333",
            Role = RolesEnum.Student,
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        });

        var student = await Repository.Student.AddAsync(new StudentEntity
        {
            Id = user.Id,
            UserId = user.Id,
            Registration = "R3",
            ProjectId = project.Id
        });

        var profUser = await Repository.User.AddAsync(new UserEntity
        {
            Email = "prof@example.com",
            Cpf = "11111111111",
            Role = RolesEnum.Professor,
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        });

        var professor = await Repository.Professor.AddAsync(new ProfessorEntity
        {
            Id = profUser.Id,
            UserId = profUser.Id,
            Siape = "12345"
        });

        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var logger = new Mock<ILogger<OrientationService>>();
        var service = new OrientationService(Repository, logger.Object, validations);
        var dto = new OrientationDto
        {
            StudentId = student.Id,
            ProjectId = project.Id,
            ProfessorId = professor.Id,
            Dissertation = "Dissertation"
        };

        var created = await service.CreateOrientationAsync(dto);

        var retrieved = await service.GetOrientationAsync(created.Id);
        Assert.Equal(project.Id, retrieved.ProjectId);
        Assert.Equal(student.Id, retrieved.StudentId);
    }

    [Fact]
    public async Task DeleteOrientation_RemovesEntity()
    {
        var researchLine = await Repository.ResearchLine.AddAsync(new ResearchLineEntity { Name = "Sys" });
        var project = await Repository.Project.AddAsync(new ProjectEntity { ResearchLineId = researchLine.Id, Name = "Proj", Status = ProjectStatusEnum.Active });
        var user = await Repository.User.AddAsync(new UserEntity
        {
            Email = "stu4@example.com",
            Cpf = "44444444444",
            Role = RolesEnum.Student,
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        });
        var student = await Repository.Student.AddAsync(new StudentEntity
        {
            Id = user.Id,
            UserId = user.Id,
            Registration = "R4",
            ProjectId = project.Id
        });
        var profUser = await Repository.User.AddAsync(new UserEntity
        {
            Email = "prof2@example.com",
            Cpf = "55555555555",
            Role = RolesEnum.Professor,
            PasswordHash = "hash",
            CreatedAt = DateTime.UtcNow
        });
        var professor = await Repository.Professor.AddAsync(new ProfessorEntity
        {
            Id = profUser.Id,
            UserId = profUser.Id,
            Siape = "56789"
        });
        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var logger = new Mock<ILogger<OrientationService>>();
        var service = new OrientationService(Repository, logger.Object, validations);
        var dto = new OrientationDto
        {
            StudentId = student.Id,
            ProjectId = project.Id,
            ProfessorId = professor.Id,
            Dissertation = "Disc"
        };

        var created = await service.CreateOrientationAsync(dto);

        await service.DeleteOrientationAsync(created.Id);

        var deleted = await Repository.Orientation.GetByIdAsync(created.Id);
        Assert.Null(deleted);
    }
}
