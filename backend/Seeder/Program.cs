using System.Globalization;
using CsvHelper;
using Microsoft.EntityFrameworkCore;
using saga.Infrastructure.Repositories;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Settings;

internal record UserRow(string first_name,string last_name,string email,string password,string cpf,int role);
internal record ResearchLineRow(string name,string status);
internal record ProjectRow(string name,string research_line,int status);
internal record CourseRow(string name,string course_unique,int credits,string code,bool is_elective,string concept);
internal record ProfessorRow(string user_email,string siape);
internal record ExternalResearcherRow(string user_email,string institution);
internal record StudentRow(string user_email,string registration,int status,int gender,string project_name);
internal record ProfessorProjectRow(string professor_email,string project_name);
internal record OrientationRow(string student_registration,string professor_email,string project_name,string dissertation,string? coorientator_email);
internal record StudentCourseRow(string student_registration,string course_unique,string grade,int year,int trimester,int status);
internal record ExtensionRow(string student_registration,int number_of_days,int type,string status);

class Program
{
    static void Main()
    {
        var settings = new AppSettings();
        if (!string.Equals(settings.TestMode, "local", StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine("Skipping seeding because TestMode is not 'local'.");
            return;
        }
        var connectionString = $"Host={settings.PostgresServer};Port={settings.postgresPort};Username={settings.PostgresUser};Password={settings.PostgresPassword};Database={settings.PostgresDb}";
        var options = new DbContextOptionsBuilder<ContexRepository>()
            .UseNpgsql(connectionString)
            .Options;

        using var context = new ContexRepository(options);

        string basePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "scripts", "data");

        var emailToId = new Dictionary<string, Guid>();
        var rlToId = new Dictionary<string, Guid>();
        var projToId = new Dictionary<string, Guid>();
        var courseToId = new Dictionary<string, Guid>();
        var profToId = new Dictionary<string, Guid>();
        var extToId = new Dictionary<string, Guid>();
        var studentToId = new Dictionary<string, Guid>();

        SeedUsers(context, Path.Combine(basePath, "users.csv"), emailToId);
        SeedResearchLines(context, Path.Combine(basePath, "research_lines.csv"), rlToId);
        SeedProjects(context, Path.Combine(basePath, "projects.csv"), rlToId, projToId);
        SeedCourses(context, Path.Combine(basePath, "courses.csv"), courseToId);
        SeedProfessors(context, Path.Combine(basePath, "professors.csv"), emailToId, profToId);
        SeedExternalResearchers(context, Path.Combine(basePath, "external_researchers.csv"), emailToId, extToId);
        SeedStudents(context, Path.Combine(basePath, "students.csv"), emailToId, projToId, studentToId);
        SeedProfessorProjects(context, Path.Combine(basePath, "professor_projects.csv"), profToId, projToId);
        SeedOrientations(context, Path.Combine(basePath, "orientations.csv"), studentToId, profToId, projToId, emailToId);
        SeedStudentCourses(context, Path.Combine(basePath, "student_courses.csv"), studentToId, courseToId);
        SeedExtensions(context, Path.Combine(basePath, "extensions.csv"), studentToId);

        context.SaveChanges();
        Console.WriteLine("Database populated with sample data.");
    }

    static IEnumerable<T> ReadCsv<T>(string path)
    {
        using var reader = new StreamReader(path);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        return csv.GetRecords<T>().ToList();
    }

    static void SeedUsers(ContexRepository ctx, string path, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<UserRow>(path))
        {
            var entity = new UserEntity
            {
                Id = Guid.NewGuid(),
                FirstName = r.first_name,
                LastName = r.last_name,
                Email = r.email.ToLower(),
                Cpf = r.cpf,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(r.password),
                Role = (RolesEnum)r.role,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false
            };
            ctx.Users.Add(entity);
            map[r.email.ToLower()] = entity.Id;
        }
    }

    static void SeedResearchLines(ContexRepository ctx, string path, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<ResearchLineRow>(path))
        {
            var e = new ResearchLineEntity
            {
                Id = Guid.NewGuid(),
                Name = r.name,
                Status = r.status,
                IsDeleted = false
            };
            ctx.ResearchLines.Add(e);
            map[r.name] = e.Id;
        }
    }

    static void SeedProjects(ContexRepository ctx, string path, IDictionary<string, Guid> rl, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<ProjectRow>(path))
        {
            if (!rl.TryGetValue(r.research_line, out var rlId)) continue;
            var e = new ProjectEntity
            {
                Id = Guid.NewGuid(),
                ResearchLineId = rlId,
                Name = r.name,
                Status = (ProjectStatusEnum)r.status,
                IsDeleted = false
            };
            ctx.Projects.Add(e);
            map[r.name] = e.Id;
        }
    }

    static void SeedCourses(ContexRepository ctx, string path, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<CourseRow>(path))
        {
            var e = new CourseEntity
            {
                Id = Guid.NewGuid(),
                Name = r.name,
                CourseUnique = r.course_unique,
                Credits = r.credits,
                Code = r.code,
                IsElective = r.is_elective,
                Concept = r.concept,
                IsDeleted = false
            };
            ctx.Courses.Add(e);
            map[r.course_unique] = e.Id;
        }
    }

    static void SeedProfessors(ContexRepository ctx, string path, IDictionary<string, Guid> userMap, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<ProfessorRow>(path))
        {
            if (!userMap.TryGetValue(r.user_email.ToLower(), out var uid)) continue;
            var e = new ProfessorEntity { Id = Guid.NewGuid(), UserId = uid, Siape = r.siape, IsDeleted = false };
            ctx.Professors.Add(e);
            map[r.user_email.ToLower()] = e.Id;
        }
    }

    static void SeedExternalResearchers(ContexRepository ctx, string path, IDictionary<string, Guid> userMap, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<ExternalResearcherRow>(path))
        {
            if (!userMap.TryGetValue(r.user_email.ToLower(), out var uid)) continue;
            var e = new ExternalResearcherEntity { Id = Guid.NewGuid(), UserId = uid, Institution = r.institution, IsDeleted = false };
            ctx.ExternalResearchers.Add(e);
            map[r.user_email.ToLower()] = e.Id;
        }
    }

    static void SeedStudents(ContexRepository ctx, string path, IDictionary<string, Guid> userMap, IDictionary<string, Guid> projMap, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<StudentRow>(path))
        {
            if (!userMap.TryGetValue(r.user_email.ToLower(), out var uid)) continue;
            if (!projMap.TryGetValue(r.project_name, out var pid)) continue;
            var e = new StudentEntity
            {
                Id = Guid.NewGuid(),
                UserId = uid,
                Registration = r.registration,
                RegistrationDate = null,
                ProjectId = pid,
                Status = (StatusEnum)r.status,
                EntryDate = DateTime.UtcNow,
                Proficiency = false,
                InstitutionType = InstitutionTypeEnum.Public,
                GraduationYear = DateTime.UtcNow.Year,
                UndergraduateArea = UndergraduateAreaEnum.ComputerScience,
                Scholarship = ScholarshipEnum.Funded,
                Gender = (GenderEnum)r.gender,
                IsDeleted = false
            };
            ctx.Students.Add(e);
            map[r.registration] = e.Id;
        }
    }

    static void SeedProfessorProjects(ContexRepository ctx, string path, IDictionary<string, Guid> profMap, IDictionary<string, Guid> projMap)
    {
        foreach (var r in ReadCsv<ProfessorProjectRow>(path))
        {
            if (!profMap.TryGetValue(r.professor_email.ToLower(), out var pid)) continue;
            if (!projMap.TryGetValue(r.project_name, out var proj)) continue;
            var e = new ProfessorProjectEntity { Id = Guid.NewGuid(), ProfessorId = pid, ProjectId = proj, IsDeleted = false };
            ctx.ProfessorProjects.Add(e);
        }
    }

    static void SeedOrientations(ContexRepository ctx, string path, IDictionary<string, Guid> studentMap, IDictionary<string, Guid> profMap, IDictionary<string, Guid> projMap, IDictionary<string, Guid> emailMap)
    {
        foreach (var r in ReadCsv<OrientationRow>(path))
        {
            if (!studentMap.TryGetValue(r.student_registration, out var sid)) continue;
            if (!profMap.TryGetValue(r.professor_email.ToLower(), out var pid)) continue;
            if (!projMap.TryGetValue(r.project_name, out var proj)) continue;
            Guid? coor = null;
            if (!string.IsNullOrWhiteSpace(r.coorientator_email) && emailMap.TryGetValue(r.coorientator_email.ToLower(), out var c))
                coor = c;
            var e = new OrientationEntity
            {
                Id = Guid.NewGuid(),
                CoorientatorId = coor,
                StudentId = sid,
                Dissertation = r.dissertation,
                ProjectId = proj,
                ProfessorId = pid,
                IsDeleted = false
            };
            ctx.Orientations.Add(e);
        }
    }

    static void SeedStudentCourses(ContexRepository ctx, string path, IDictionary<string, Guid> studentMap, IDictionary<string, Guid> courseMap)
    {
        foreach (var r in ReadCsv<StudentCourseRow>(path))
        {
            if (!studentMap.TryGetValue(r.student_registration, out var sid)) continue;
            if (!courseMap.TryGetValue(r.course_unique, out var cid)) continue;
            var e = new StudentCourseEntity
            {
                Id = Guid.NewGuid(),
                StudentId = sid,
                CourseId = cid,
                Grade = string.IsNullOrEmpty(r.grade) ? 'A' : r.grade[0],
                Year = r.year,
                Trimester = r.trimester,
                Status = (CourseStatusEnum)r.status,
                IsDeleted = false
            };
            ctx.StudentCourses.Add(e);
        }
    }

    static void SeedExtensions(ContexRepository ctx, string path, IDictionary<string, Guid> studentMap)
    {
        foreach (var r in ReadCsv<ExtensionRow>(path))
        {
            if (!studentMap.TryGetValue(r.student_registration, out var sid)) continue;
            var e = new ExtensionEntity
            {
                Id = Guid.NewGuid(),
                StudentId = sid,
                NumberOfDays = r.number_of_days,
                Status = r.status,
                Type = (ExtensionTypeEnum)r.type,
                IsDeleted = false
            };
            ctx.Extensions.Add(e);
        }
    }
}
