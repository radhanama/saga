using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Services;
using Microsoft.Extensions.Logging;
using Moq;

namespace saga.Tests;

public class ProjectServiceTests : TestBase
{
    [Fact]
    public async Task CreateAndRetrieveProject()
    {
        var researchLine = await Repository.ResearchLine.AddAsync(new ResearchLineEntity { Name = "AI" });
        var logger = new Mock<ILogger<ProjectService>>();
        var service = new ProjectService(Repository, logger.Object);
        var dto = new ProjectDto
        {
            ResearchLineId = researchLine.Id,
            Name = "ProjectX",
            Status = ProjectStatusEnum.Active,
            ProfessorIds = new List<string>()
        };

        var created = await service.CreateProjectAsync(dto);
        Assert.NotNull(created.Id);

        var retrieved = await service.GetProjectAsync(created.Id!.Value);
        Assert.Equal("ProjectX", retrieved.Name);
        Assert.Equal(researchLine.Id, retrieved.ResearchLineId);
    }

    [Fact]
    public async Task UpdateProject()
    {
        var researchLine = await Repository.ResearchLine.AddAsync(new ResearchLineEntity { Name = "AI" });
        var logger = new Mock<ILogger<ProjectService>>();
        var service = new ProjectService(Repository, logger.Object);

        var created = await service.CreateProjectAsync(new ProjectDto
        {
            ResearchLineId = researchLine.Id,
            Name = "ProjectX",
            Status = ProjectStatusEnum.Active,
            ProfessorIds = new List<string>()
        });

        var updated = await service.UpdateProjectAsync(created.Id!.Value, new ProjectDto
        {
            ResearchLineId = researchLine.Id,
            Name = "ProjectY",
            Status = ProjectStatusEnum.Closed,
            ProfessorIds = new List<string>()
        });

        Assert.Equal(ProjectStatusEnum.Closed, updated.Status);
        Assert.Equal("ProjectY", updated.Name);

        var retrieved = await service.GetProjectAsync(created.Id.Value);
        Assert.Equal(ProjectStatusEnum.Closed, retrieved.Status);
        Assert.Equal("ProjectY", retrieved.Name);
    }

    [Fact]
    public async Task DeleteProject()
    {
        var researchLine = await Repository.ResearchLine.AddAsync(new ResearchLineEntity { Name = "AI" });
        var logger = new Mock<ILogger<ProjectService>>();
        var service = new ProjectService(Repository, logger.Object);

        var created = await service.CreateProjectAsync(new ProjectDto
        {
            ResearchLineId = researchLine.Id,
            Name = "ProjectX",
            Status = ProjectStatusEnum.Active,
            ProfessorIds = new List<string>()
        });

        await service.DeleteProjectAsync(created.Id!.Value);

        await Assert.ThrowsAsync<ArgumentException>(async () =>
            await service.GetProjectAsync(created.Id.Value));
    }
}
