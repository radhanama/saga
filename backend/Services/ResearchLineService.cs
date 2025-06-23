using saga.Infrastructure.Extensions;
using saga.Infrastructure.Repositories;
using saga.Models.DTOs;
using saga.Models.Mapper;
using saga.Services.Interfaces;
using saga.Models.Entities;
using System.Linq.Expressions;

namespace saga.Services
{
    public class ResearchLineService : IResearchLineService
    {
        private readonly IRepository _repository;
        private readonly ILogger<ResearchLineService> _logger;

        public ResearchLineService(
            IRepository repository,
            ILogger<ResearchLineService> logger
        )
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <inheritdoc />
        public async Task<ResearchLineInfoDto> CreateResearchLineAsync(ResearchLineDto researchLineDto)
        {
            try
            {
                var researchLine = researchLineDto.ToEntity();

                researchLine = await _repository.ResearchLine.AddAsync(researchLine);

                _logger.LogInformation($"ResearchLine {researchLine.Name} created successfully.");
                return researchLine.ToDto();
            }
            catch (Exception ex)
            {
                _logger.LogInformation($"ResearchLine {researchLineDto.Name} as {ex}");
                return researchLineDto.ToEntity().ToDto();
            };
        }

        /// <inheritdoc />
        public async Task<ResearchLineInfoDto> GetResearchLineAsync(Guid id)
        {
            var researchLineEntity = await _repository
                .ResearchLine
                .GetByIdAsync(id, x => x.Projects);
            if (researchLineEntity == null)
            {
                throw new ArgumentException("ResearchLine not found.");
            }

            return researchLineEntity.ToDto();
        }

        /// <inheritdoc />
        public async Task<IEnumerable<ResearchLineInfoDto>> GetAllResearchLinesAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;

            Expression<Func<ResearchLineEntity, bool>> predicate = _ => true;
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                predicate = r => r.Name.ToLower().Contains(search);
            }

            var researchLines = await _repository.ResearchLine.GetPagedAsync(
                predicate,
                pageNumber,
                pageSize,
                x => x.Projects);

            return researchLines.Select(r => r.ToDto());
        }

        /// <inheritdoc />
        public async Task<ResearchLineInfoDto> UpdateResearchLineAsync(Guid id, ResearchLineDto researchLineDto)
        {
            var existingResearchLine = await _repository.ResearchLine.GetByIdAsync(id);
            if (existingResearchLine == null)
            {
                throw new ArgumentException($"ResearchLine with id {id} does not exist.");
            }

            existingResearchLine = researchLineDto.ToEntity(existingResearchLine);
            await _repository.ResearchLine.UpdateAsync(existingResearchLine);

            return existingResearchLine.ToDto();
        }

        /// <inheritdoc />
        public async Task DeleteResearchLineAsync(Guid id)
        {
            var existingResearchLine = await _repository.ResearchLine.GetByIdAsync(id);
            if (existingResearchLine == null)
            {
                throw new ArgumentException($"ResearchLine with id {id} does not exist.");
            }

            await _repository.ResearchLine.DeactiveAsync(existingResearchLine);
        }
    }
}
