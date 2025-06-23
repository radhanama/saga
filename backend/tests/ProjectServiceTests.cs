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
        var researchLine = await Repository.ResearchLine.AddAsync(new ResearchLineEntity { Name = "Eng" });
        var logger = new Mock<ILogger<ProjectService>>();
        var service = new ProjectService(Repository, logger.Object);
        var dto = new ProjectDto
        {
            ResearchLineId = researchLine.Id,
            Name = "Proj1",
            Status = ProjectStatusEnum.Active,
            ProfessorIds = new List<string>()
        };

        var created = await service.CreateProjectAsync(dto);

        var updateDto = new ProjectDto
        {
            ResearchLineId = researchLine.Id,
            Name = "Proj1Updated",
            Status = ProjectStatusEnum.Active,
            ProfessorIds = new List<string>()
        };

        var updated = await service.UpdateProjectAsync(created.Id!.Value, updateDto);
        Assert.Equal("Proj1Updated", updated.Name);
    }
}
