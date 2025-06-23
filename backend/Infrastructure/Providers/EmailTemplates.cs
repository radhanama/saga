using System.Text;
using saga.Models.Entities;

namespace Infrastructure.EmailTemplates
{
    public record EmailContent(string Subject, string Body);

    public enum EmailLanguage
    {
        Pt,
        En
    }

    public static class EmailTemplates
    {
        public static EmailContent WelcomeEmailTemplate(string resetPasswordPath, string token, string signature = "A Equipe Acadêmica", EmailLanguage language = EmailLanguage.Pt)
        {
            string subject = language == EmailLanguage.En ? "Account Created" : "Sua conta foi criada";
            string greeting = language == EmailLanguage.En ? "Welcome to the CEFET RJ Postgraduate Program!" : "Bem-vindo(a) à Pós-Graduação do CEFET RJ!";
            string instruction = language == EmailLanguage.En ? "To access your account, please set your password using the link below:" : "Para acessar sua conta, por favor, defina sua senha clicando no seguinte link:";
            string body = $"<html><body style='font-family: Arial, sans-serif;'>" +
                         $"<p>{greeting}</p>" +
                         $"<p>{instruction}</p>" +
                         $"<p><a href='{resetPasswordPath}?token={token}'>{resetPasswordPath}?token={token}</a></p>" +
                         "<br/>" +
                         $"<p>{signature}</p>" +
                         "</body></html>";
            return new EmailContent(subject, body);
        }

        public static EmailContent ResetPasswordEmailTemplate(string resetPasswordPath, string token, string signature = "A Equipe Acadêmica", EmailLanguage language = EmailLanguage.Pt)
        {
            string subject = language == EmailLanguage.En ? "Password Reset" : "Alteração de senha";
            string message = language == EmailLanguage.En ? "You requested a password reset. Click the link below:" : "Você solicitou a redefinição da sua senha. Por favor, clique no seguinte link para redefinir sua senha:";
            string body = $"<html><body style='font-family: Arial, sans-serif;'>" +
                         $"<p>{message}</p>" +
                         $"<p><a href='{resetPasswordPath}?token={token}'>{resetPasswordPath}?token={token}</a></p>" +
                         "<br/>" +
                         $"<p>{signature}</p>" +
                         "</body></html>";
            return new EmailContent(subject, body);
        }

        public static EmailContent UpcomingDefenseEmailTemplate(string? firstName, string defenseTypeText, DateTime? qualificationDate, DateTime? defenseDate, string signature = "A Equipe Acadêmica", EmailLanguage language = EmailLanguage.Pt)
        {
            string subject = language == EmailLanguage.En ? $"Upcoming {defenseTypeText} deadline" : $"Data limite de {defenseTypeText} se aproximando.";
            var body = new StringBuilder();
            body.Append("<html><body style='font-family: Arial, sans-serif;'>");
            if (language == EmailLanguage.En)
            {
                body.Append($"<p>Dear {firstName},</p>");
                body.Append($"<p>This is a reminder that your {defenseTypeText} date is approaching. Please be prepared for your presentation.</p>");
                body.Append("<p>If you have any questions or need help, contact your advisor.</p>");
                body.Append("<p>If you need more time, you can request an extension through your academic advisor.</p>");
                body.Append($"<p>Qualification Date: {qualificationDate}</p>");
                body.Append($"<p>Defense Date: {defenseDate}</p>");
            }
            else
            {
                body.Append($"<p>Prezado(a) {firstName},</p>");
                body.Append($"<p>Este é um lembrete de que a data da sua {defenseTypeText} está se aproximando. Por favor, certifique-se de se preparar e estar pronto(a) para a sua apresentação.</p>");
                body.Append("<p>Se tiver alguma dúvida ou precisar de ajuda, sinta-se à vontade para entrar em contato com o seu orientador.</p>");
                body.Append("<p>Se você precisar de mais tempo para se preparar adequadamente, pode solicitar uma prorrogação entrando em contato com o seu orientador acadêmico.</p>");
                body.Append($"<p>Data da sua Qualificação: {qualificationDate}</p>");
                body.Append($"<p>Data da sua Defesa: {defenseDate}</p>");
            }
            body.Append("<br/>");
            body.Append($"<p>{signature}</p>");
            body.Append("</body></html>");
            return new EmailContent(subject, body.ToString());
        }

        public static EmailContent StudentsFinishingFromProfessorEmailTemplate(IGrouping<Guid, OrientationEntity> orientations, Dictionary<Guid, StudentEntity> students, string signature = "A Equipe Acadêmica", EmailLanguage language = EmailLanguage.Pt)
        {
            string subject = language == EmailLanguage.En ? "Upcoming Student Defenses" : "Próximas Defesas de Alunos";
            var body = new StringBuilder();

            body.AppendLine("<html><body style='font-family: Arial, sans-serif;'>");
            body.AppendLine(language == EmailLanguage.En ? "<p>The following students are finishing the course:</p>" : "<p>Os seguintes estudantes estão concluindo o curso:</p>");
            body.AppendLine("<table style='border-collapse: collapse; width: 100%;'>");
            body.AppendLine("<tr>");
            body.AppendLine(language == EmailLanguage.En ? "<th>First Name</th>" : "<th>Nome</th>");
            body.AppendLine(language == EmailLanguage.En ? "<th>Last Name</th>" : "<th>Sobrenome</th>");
            body.AppendLine("<th>Email</th>");
            body.AppendLine(language == EmailLanguage.En ? "<th>Defense Date</th>" : "<th>Data de Defesa</th>");
            body.AppendLine(language == EmailLanguage.En ? "<th>Qualification Date</th>" : "<th>Data de Qualificação</th>");
            body.AppendLine("</tr>");

            foreach (var orientation in orientations)
            {
                if (students.TryGetValue(orientation.StudentId, out var student))
                {
                    body.AppendLine("<tr>");
                    body.AppendLine($"<td>{student.User?.FirstName}</td>");
                    body.AppendLine($"<td>{student.User?.LastName}</td>");
                    body.AppendLine($"<td>{student.User?.Email}</td>");
                    body.AppendLine($"<td>{student.ProjectDefenceDate}</td>");
                    body.AppendLine($"<td>{student.ProjectQualificationDate}</td>");
                    body.AppendLine("</tr>");
                }
            }

            body.AppendLine("</table>");
            body.AppendLine("<br/>");
            body.AppendLine($"<p>{signature}</p>");
            body.AppendLine("</body></html>");
            return new EmailContent(subject, body.ToString());
        }
    }
}

