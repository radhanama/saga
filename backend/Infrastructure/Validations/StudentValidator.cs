using saga.Infrastructure.Repositories;
using saga.Models.DTOs;

namespace saga.Infrastructure.Validations
{
    /// <summary>
    /// Provides validation methods for students.
    /// </summary>
    public class StudentValidator
    {
        private readonly IRepository _repository;

        /// <summary>
        /// Initializes a new instance of the <see cref="StudentValidator"/> class.
        /// </summary>
        /// <param name="repository">The repository used for data access.</param>
        public StudentValidator(IRepository repository)
        {
            _repository = repository;
        }

        /// <summary>
        /// Determines whether a student can be added based on its CPF.
        /// </summary>
        /// <param name="studentDto">The student DTO to validate.</param>
        /// <returns>A tuple with a boolean indicating whether the student can be added and a message describing the result.</returns>
        public async Task<(bool, string)> CanAddStudent(StudentDto studentDto)
        {
            if (studentDto is null || string.IsNullOrEmpty(studentDto.Cpf))
            {
                return (false, "Invalid student DTO.");
            }

            var users = await _repository.User.GetAllAsync(u => u.Cpf == studentDto.Cpf);

            if (users.Any())
            {
                return (false, $"Student with CPF '{studentDto.Cpf}' already exists.");
            }

            return (true, "Success");
        }
    }
}
