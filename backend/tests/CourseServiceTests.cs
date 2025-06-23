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
        var courseDto = new CourseDto
        {
            Name = "Data Structures",
            CourseUnique = "CS102",
            Credits = 3
        };

        var created = await service.CreateCourseAsync(courseDto);

        var updateDto = new CourseDto
        {
            Name = "Advanced Data Structures",
            CourseUnique = "CS102",
            Credits = 5
        };

        var updated = await service.UpdateCourseAsync(created.Id!.Value, updateDto);
        Assert.Equal("Advanced Data Structures", updated.Name);
        Assert.Equal(5, updated.Credits);

        var retrieved = await service.GetCourseAsync(created.Id!.Value);
        Assert.Equal("Advanced Data Structures", retrieved.Name);
    }
}
