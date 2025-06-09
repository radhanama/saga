using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using Microsoft.Extensions.Logging;
using Moq;
using backend.Infrastructure.Validations;
using saga.Infrastructure.Providers;

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

        var validations = new Validations(Repository, new Mock<ILogger<UserValidator>>().Object, new DummyUserContext());
        var logger = new Mock<ILogger<OrientationService>>();
        var service = new OrientationService(Repository, logger.Object, validations);
        var dto = new OrientationDto
        {
            StudentId = student.Id,
            ProjectId = project.Id,
            ProfessorId = Guid.NewGuid(),
            Dissertation = "Dissertation"
        };

        var created = await service.CreateOrientationAsync(dto);
        Assert.NotNull(created.Id);

        var retrieved = await service.GetOrientationAsync(created.Id);
        Assert.Equal(project.Id, retrieved.ProjectId);
        Assert.Equal(student.Id, retrieved.StudentId);
    }
}
