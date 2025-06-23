using saga.Infrastructure.Repositories;
using saga.Models.DTOs;
using saga.Models.Mapper;
using saga.Services.Interfaces;
using saga.Models.Entities;
using System.Linq.Expressions;

namespace saga.Services
{
    public class ExternalResearcherService : IExternalResearcherService
    {
        private readonly IRepository _repository;
        private readonly ILogger<ExternalResearcherService> _logger;
        private readonly IUserService _userService;

        public ExternalResearcherService(
            IRepository repository,
            ILogger<ExternalResearcherService> logger,
            IUserService userService
        )
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
        }

        /// <inheritdoc />
        public async Task<ExternalResearcherDto> CreateExternalResearcherAsync(ExternalResearcherDto externalResearcherDto)
        {
            var userId = (await _userService.CreateUserAsync(externalResearcherDto)).Id;
            var externalResearcher = externalResearcherDto.ToEntity(userId);
            externalResearcher = await _repository.ExternalResearcher.AddAsync(externalResearcher);

            _logger.LogInformation($"ExternalResearcher {externalResearcher.User?.Id} created successfully.");
            return externalResearcher.ToDto();
        }

        /// <inheritdoc />
        public async Task<ExternalResearcherDto> GetExternalResearcherAsync(Guid id)
        {
            var externalResearcherEntity = await _repository.ExternalResearcher.GetByIdAsync(id, x => x.User);
            if (externalResearcherEntity == null)
            {
                throw new ArgumentException("ExternalResearcher not found.");
            }

            return externalResearcherEntity.ToDto();
        }

        /// <inheritdoc />
        public async Task<IEnumerable<ExternalResearcherDto>> GetAllExternalResearchersAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;

            Expression<Func<ExternalResearcherEntity, bool>> predicate = _ => true;
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                predicate = r =>
                    (r.User!.FirstName + " " + r.User!.LastName).ToLower().Contains(search) ||
                    r.User!.Email!.ToLower().Contains(search) ||
                    (r.Institution ?? string.Empty).ToLower().Contains(search);
            }

            var externalResearchers = await _repository.ExternalResearcher.GetPagedAsync(
                predicate,
                pageNumber,
                pageSize,
                x => x.User);

            return externalResearchers.Select(r => r.ToDto());
        }

        /// <inheritdoc />
        public async Task<ExternalResearcherDto> UpdateExternalResearcherAsync(Guid id, ExternalResearcherDto externalResearcherDto)
        {
            var existingExternalResearcher = await _repository.ExternalResearcher.GetByIdAsync(id);
            if (existingExternalResearcher == null)
            {
                throw new ArgumentException($"ExternalResearcher with id {id} does not exist.");
            }

            existingExternalResearcher = externalResearcherDto.ToEntity(existingExternalResearcher);

            await _repository.ExternalResearcher.UpdateAsync(existingExternalResearcher);

            return existingExternalResearcher.ToDto();
        }

        /// <inheritdoc />
        public async Task DeleteExternalResearcherAsync(Guid id)
        {
            var existingExternalResearcher = await _repository.ExternalResearcher.GetByIdAsync(id);
            if (existingExternalResearcher == null)
            {
                throw new ArgumentException($"ExternalResearcher with id {id} does not exist.");
            }

            await _repository.ExternalResearcher.DeactiveAsync(existingExternalResearcher);
        }
    }
}
