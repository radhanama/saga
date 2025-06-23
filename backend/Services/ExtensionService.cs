using saga.Infrastructure.Repositories;
using saga.Models.DTOs;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Models.Mapper;
using saga.Services.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace saga.Services
{
    public class ExtensionService : IExtensionService
    {
        private readonly IRepository _repository;
        private readonly ILogger<ExtensionService> _logger;

        public ExtensionService(
            IRepository repository,
            ILogger<ExtensionService> logger
        )
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <inheritdoc />
        public async Task<ExtensionInfoDto> CreateExtensionAsync(ExtensionDto extensionDto)
        {
            var extension = extensionDto.ToEntity();

            var student = await _repository.Student.GetByIdAsync(extension.StudentId);

            if (student is null)
            {
                throw new ArgumentException($"Student with id: {extension.StudentId} does not exist.");
            }

            extension = await _repository.Extension.AddAsync(extension);

            UpdateUserDates(student, extension);

            await _repository.Student.UpdateAsync(student);

            _logger.LogInformation($"Extension {extension.StudentId} created successfully.");
            return extension.ToDto();
        }

        /// <inheritdoc />
        public async Task<ExtensionInfoDto> GetExtensionAsync(Guid id)
        {
            var extensionEntity = await _repository.Extension.GetByIdAsync(id, x => x.Student);
            if (extensionEntity == null)
            {
                throw new ArgumentException("Extension not found.");
            }

            return extensionEntity.ToDto();
        }

        /// <inheritdoc />
        public async Task<IEnumerable<ExtensionInfoDto>> GetAllExtensionsAsync(
            int pageNumber = 1,
            int pageSize = 10,
            string? search = null)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;

            Expression<Func<ExtensionEntity, bool>> predicate = _ => true;
            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                predicate = e =>
                    (e.Student != null && (e.Student.User!.FirstName + " " + e.Student.User!.LastName).ToLower().Contains(search)) ||
                    e.Type.ToString().ToLower().Contains(search);
            }

            var extensions = await _repository.Extension.GetPagedAsync(
                predicate,
                pageNumber,
                pageSize,
                x => x.Student!, x => x.Student!.User!);

            return extensions.Select(e => e.ToDto());
        }

        /// <inheritdoc />
        public async Task<ExtensionInfoDto> UpdateExtensionAsync(Guid id, ExtensionDto extensionDto)
        {
            var existingExtension = await _repository.Extension.GetByIdAsync(id);
            var student = await _repository.Student.GetByIdAsync(extensionDto.StudentId);

            if (existingExtension == null || student is null)
            {
                throw new ArgumentException($"Extension with id {id} does not exist.");
            }

            var oldDays = existingExtension.NumberOfDays;

            existingExtension = extensionDto.ToEntity(existingExtension);

            await _repository.Extension.UpdateAsync(existingExtension);

            UpdateUserDates(student, existingExtension, oldDays);

            await _repository.Student.UpdateAsync(student);

            return existingExtension.ToDto();
        }

        /// <inheritdoc />
        public async Task DeleteExtensionAsync(Guid id)
        {
            var existingExtension = await _repository.Extension.GetByIdAsync(id);
            if (existingExtension == null)
            {
                throw new ArgumentException($"Extension with id {id} does not exist.");
            }

            await _repository.Extension.DeactiveAsync(existingExtension);
        }

        private void UpdateUserDates(StudentEntity student, ExtensionEntity extension, int oldDays = 0)
        {
            switch (extension.Type)
            {
                case ExtensionTypeEnum.Qualification:
                    if (student.ProjectQualificationDate.HasValue)
                    {
                        student.ProjectQualificationDate = student.ProjectQualificationDate.Value.AddDays(extension.NumberOfDays - oldDays);
                    }
                    break;
                case ExtensionTypeEnum.Defence:
                    if (student.ProjectDefenceDate.HasValue)
                    {
                        student.ProjectDefenceDate = student.ProjectDefenceDate.Value.AddDays(extension.NumberOfDays - oldDays);
                    }
                    break;
                default:
                    break;
            }
        }
    }
}
