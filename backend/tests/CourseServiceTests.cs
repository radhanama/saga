using saga.Models.DTOs;
using saga.Services;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading.Tasks;

namespace saga.Tests;

public class CourseServiceTests : TestBase
{
    [Fact]
    public async Task CreateAndRetrieveCourse()
    {
        var logger = new Mock<ILogger<CourseService>>();
        var service = new CourseService(Repository, logger.Object);
        var courseDto = new CourseDto
        {
            Name = "Algorithms",
            CourseUnique = "CS101",
            Credits = 4
        };

        var created = await service.CreateCourseAsync(courseDto);
        Assert.NotNull(created.Id);

        var retrieved = await service.GetCourseAsync(created.Id!.Value);
        Assert.Equal("Algorithms", retrieved.Name);
        Assert.Equal("CS101", retrieved.CourseUnique);
    }
}
