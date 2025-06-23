using CsvHelper.Configuration.Attributes;

namespace saga.Models.Enums
{
    public enum GenderEnum
    {
        Default,
        [Name("Masculino")]
        Male,
        [Name("Feminino")]
        Female,
        [Name("Outro")]
        Other
    }
}
