using saga.Models.DTOs;
using saga.Services;
using Microsoft.Extensions.Logging;
using Moq;

namespace saga.Tests;

public class ResearchLineServiceTests : TestBase
{
    [Fact]
    public async Task CreateAndRetrieveResearchLine()
    {
        var logger = new Mock<ILogger<ResearchLineService>>();
        var service = new ResearchLineService(Repository, logger.Object);
        var dto = new ResearchLineDto { Name = "Machine Learning" };

        var created = await service.CreateResearchLineAsync(dto);
        Assert.NotNull(created.Id);

        var retrieved = await service.GetResearchLineAsync(created.Id!.Value);
        Assert.Equal("Machine Learning", retrieved.Name);
    }
}
