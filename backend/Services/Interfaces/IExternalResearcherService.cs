using saga.Models.DTOs;

namespace saga.Services.Interfaces
{
    /// <summary>
    /// Defines methods for managing externalResearchers.
    /// </summary>
    public interface IExternalResearcherService
    {
        /// <summary>
        /// Creates a new externalResearcher.
        /// </summary>
        /// <param name="externalResearcherDto">The externalResearcher DTO containing the externalResearcher details.</param>
        /// <returns>The created externalResearcher DTO.</returns>
        Task<ExternalResearcherDto> CreateExternalResearcherAsync(ExternalResearcherDto externalResearcherDto);

        /// <summary>
        /// Retrieves a externalResearcher by ID.
        /// </summary>
        /// <param name="id">The ID of the externalResearcher to retrieve.</param>
        /// <returns>The externalResearcher DTO with the specified ID.</returns>
        Task<ExternalResearcherDto> GetExternalResearcherAsync(Guid id);

        /// <summary>
        /// Gets a paged list of external researcher entities.
        /// </summary>
        /// <param name="pageNumber">Page number starting at 1.</param>
        /// <param name="pageSize">Number of items per page.</param>
        /// <param name="search">Optional search string to filter researchers.</param>
        /// <returns>A list of external researcher entities.</returns>
        Task<IEnumerable<ExternalResearcherDto>> GetAllExternalResearchersAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null);

        /// <summary>
        /// Updates a externalResearcher.
        /// </summary>
        /// <param name="id">The ID of the externalResearcher to update.</param>
        /// <param name="externalResearcherDto">The externalResearcher DTO containing the updated externalResearcher details.</param>
        /// <returns>The updated externalResearcher DTO.</returns>
        Task<ExternalResearcherDto> UpdateExternalResearcherAsync(Guid id, ExternalResearcherDto externalResearcherDto);

        /// <summary>
        /// Deletes a externalResearcher.
        /// </summary>
        /// <param name="id">The ID of the externalResearcher to delete.</param>
        Task DeleteExternalResearcherAsync(Guid id);
    }
}
