using saga.Models.DTOs;

namespace saga.Services.Interfaces
{
    /// <summary>
    /// Defines methods for managing researchLines.
    /// </summary>
    public interface IResearchLineService
    {
        /// <summary>
        /// Creates a new researchLine.
        /// </summary>
        /// <param name="researchLineDto">The researchLine DTO containing the researchLine details.</param>
        /// <returns>The created researchLine DTO.</returns>
        Task<ResearchLineInfoDto> CreateResearchLineAsync(ResearchLineDto researchLineDto);

        /// <summary>
        /// Retrieves a researchLine by ID.
        /// </summary>
        /// <param name="id">The ID of the researchLine to retrieve.</param>
        /// <returns>The researchLine DTO with the specified ID.</returns>
        Task<ResearchLineInfoDto> GetResearchLineAsync(Guid id);

        /// <summary>
        /// Gets a paged list of research line entities.
        /// </summary>
        /// <param name="pageNumber">Page number starting at 1.</param>
        /// <param name="pageSize">Number of items per page.</param>
        /// <param name="search">Optional search string to filter lines.</param>
        /// <returns>A list of research line entities.</returns>
        Task<IEnumerable<ResearchLineInfoDto>> GetAllResearchLinesAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null);

        /// <summary>
        /// Updates a researchLine.
        /// </summary>
        /// <param name="id">The ID of the researchLine to update.</param>
        /// <param name="researchLineDto">The researchLine DTO containing the updated researchLine details.</param>
        /// <returns>The updated researchLine DTO.</returns>
        Task<ResearchLineInfoDto> UpdateResearchLineAsync(Guid id, ResearchLineDto researchLineDto);

        /// <summary>
        /// Deletes a researchLine.
        /// </summary>
        /// <param name="id">The ID of the researchLine to delete.</param>
        Task DeleteResearchLineAsync(Guid id);
    }
}
