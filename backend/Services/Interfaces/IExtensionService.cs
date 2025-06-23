using saga.Models.DTOs;

namespace saga.Services.Interfaces
{
    /// <summary>
    /// Defines methods for managing extensions.
    /// </summary>
    public interface IExtensionService
    {
        /// <summary>
        /// Creates a new extension.
        /// </summary>
        /// <param name="extensionDto">The extension DTO containing the extension details.</param>
        /// <returns>The created extension DTO.</returns>
        Task<ExtensionInfoDto> CreateExtensionAsync(ExtensionDto extensionDto);

        /// <summary>
        /// Retrieves a extension by ID.
        /// </summary>
        /// <param name="id">The ID of the extension to retrieve.</param>
        /// <returns>The extension DTO with the specified ID.</returns>
        Task<ExtensionInfoDto> GetExtensionAsync(Guid id);

        /// <summary>
        /// Gets a paged list of extension entities.
        /// </summary>
        /// <param name="pageNumber">Page number starting at 1.</param>
        /// <param name="pageSize">Number of items per page.</param>
        /// <param name="search">Optional search string to filter extensions.</param>
        /// <returns>A list of extension entities.</returns>
        Task<IEnumerable<ExtensionInfoDto>> GetAllExtensionsAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null);

        /// <summary>
        /// Updates a extension.
        /// </summary>
        /// <param name="id">The ID of the extension to update.</param>
        /// <param name="extensionDto">The extension DTO containing the updated extension details.</param>
        /// <returns>The updated extension DTO.</returns>
        Task<ExtensionInfoDto> UpdateExtensionAsync(Guid id, ExtensionDto extensionDto);

        /// <summary>
        /// Deletes a extension.
        /// </summary>
        /// <param name="id">The ID of the extension to delete.</param>
        Task DeleteExtensionAsync(Guid id);
    }
}
