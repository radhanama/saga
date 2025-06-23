using saga.Models.DTOs;

namespace saga.Services.Interfaces
{
    /// <summary>
    /// Defines methods for managing projects.
    /// </summary>
    public interface IProjectService
    {
        /// <summary>
        /// Creates a new project.
        /// </summary>
        /// <param name="projectDto">The project DTO containing the project details.</param>
        /// <returns>The created project DTO.</returns>
        Task<ProjectInfoDto> CreateProjectAsync(ProjectDto projectDto);

        /// <summary>
        /// Retrieves a project by ID.
        /// </summary>
        /// <param name="id">The ID of the project to retrieve.</param>
        /// <returns>The project DTO with the specified ID.</returns>
        Task<ProjectInfoDto> GetProjectAsync(Guid id);

        /// <summary>
        /// Gets a paged list of project entities.
        /// </summary>
        /// <param name="pageNumber">Page number starting at 1.</param>
        /// <param name="pageSize">Number of items per page.</param>
        /// <param name="search">Optional search string to filter projects.</param>
        /// <returns>A list of project entities.</returns>
        Task<IEnumerable<ProjectInfoDto>> GetAllProjectsAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null);

        /// <summary>
        /// Updates a project.
        /// </summary>
        /// <param name="id">The ID of the project to update.</param>
        /// <param name="projectDto">The project DTO containing the updated project details.</param>
        /// <returns>The updated project DTO.</returns>
        Task<ProjectInfoDto> UpdateProjectAsync(Guid id, ProjectDto projectDto);

        /// <summary>
        /// Deletes a project.
        /// </summary>
        /// <param name="id">The ID of the project to delete.</param>
        Task DeleteProjectAsync(Guid id);
    }
}
