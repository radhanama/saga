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

    [Fact]
    public async Task UpdateCourse()
    {
        var logger = new Mock<ILogger<CourseService>>();
        var service = new CourseService(Repository, logger.Object);

        var created = await service.CreateCourseAsync(new CourseDto
        {
            Name = "Algorithms",
            CourseUnique = "CS101",
            Credits = 4
        });

        var updated = await service.UpdateCourseAsync(created.Id!.Value, new CourseDto
        {
            Name = "Data Structures",
            CourseUnique = "CS102",
            Credits = 3
        });

        Assert.Equal("Data Structures", updated.Name);
        Assert.Equal("CS102", updated.CourseUnique);

        var retrieved = await service.GetCourseAsync(created.Id.Value);
        Assert.Equal("Data Structures", retrieved.Name);
        Assert.Equal("CS102", retrieved.CourseUnique);
    }

    [Fact]
    public async Task DeleteCourse()
    {
        var logger = new Mock<ILogger<CourseService>>();
        var service = new CourseService(Repository, logger.Object);

        var created = await service.CreateCourseAsync(new CourseDto
        {
            Name = "Algorithms",
            CourseUnique = "CS101",
            Credits = 4
        });

        await service.DeleteCourseAsync(created.Id!.Value);

        await Assert.ThrowsAsync<ArgumentException>(async () =>
            await service.GetCourseAsync(created.Id.Value));
    }
}
