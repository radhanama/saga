using CsvHelper.Configuration.Attributes;
using saga.Models.Enums;

namespace saga.Models.DTOs
{
    public class StudentCourseCsvDto
    {
        [Name("MATR_ALUNO")]
        public string StudentRegistration { get; set; } = string.Empty;

        [Name("NOME_DISCIPLINA")]
        public string CourseName { get; set; } = string.Empty;

        [Name("CONCEITO")]
        public char Grade { get; set; }

        [Name("ANO")]
        public int Year { get; set; }

        [Name("PERIODO")]
        public string Trimester { get; set; } = string.Empty;

        [Name("DISC")]
        public string CourseUnique { get; set; } = string.Empty;

        [Name("SITUACAO")]
        public CourseStatusEnum Status { get; set; }
    }
}
