using System.Globalization;
using CsvHelper;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using saga.Infrastructure.Repositories;
using saga.Models.Entities;
using saga.Models.Enums;
using saga.Settings;

namespace saga.Infrastructure.Seeding;

public static class DataSeeder
{
    /// <summary>
    /// Ensures that at least one administrator user exists in the database. If
    /// no users are found, a default administrator account is created.
    /// </summary>
    /// <param name="services">Service provider used to resolve the context.</param>
    public static void EnsureAdministrator(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var ctx = scope.ServiceProvider.GetRequiredService<ContexRepository>();

        if (!ctx.Users.Any())
        {
            var admin = new UserEntity
            {
                Id = Guid.NewGuid(),
                FirstName = "Admin",
                LastName = "User",
                Email = "admin@saga.local",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin"),
                Role = RolesEnum.Administrator,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
            };
            ctx.Users.Add(admin);
            ctx.SaveChanges();

            Console.WriteLine(
                "Default administrator created (admin@saga.local / admin). Please change the password after logging in.");
        }
    }

    public static void SeedDatabase(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var settings = scope.ServiceProvider.GetRequiredService<ISettings>();
        if (!string.Equals(settings.TestMode, "local", StringComparison.OrdinalIgnoreCase))
            return;

        var ctx = scope.ServiceProvider.GetRequiredService<ContexRepository>();
        string basePath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "scripts", "data");

        var emailToId = new Dictionary<string, Guid>();
        var rlToId = new Dictionary<string, Guid>();
        var projToId = new Dictionary<string, Guid>();
        var courseToId = new Dictionary<string, Guid>();
        var profToId = new Dictionary<string, Guid>();
        var extToId = new Dictionary<string, Guid>();
        var studentToId = new Dictionary<string, Guid>();
        var regToUserId = new Dictionary<string, Guid>();

        SeedUsers(ctx, Path.Combine(basePath, "users.csv"), emailToId);
        SeedResearchLines(ctx, Path.Combine(basePath, "research_lines.csv"), rlToId);
        SeedProjects(ctx, Path.Combine(basePath, "projects.csv"), rlToId, projToId);
        SeedCourses(ctx, Path.Combine(basePath, "courses.csv"), courseToId);
        SeedProfessors(ctx, Path.Combine(basePath, "professors.csv"), emailToId, profToId);
        SeedExternalResearchers(ctx, Path.Combine(basePath, "external_researchers.csv"), emailToId, extToId);
        SeedStudents(ctx, Path.Combine(basePath, "students.csv"), emailToId, projToId, studentToId, regToUserId);
        SeedProfessorProjects(ctx, Path.Combine(basePath, "professor_projects.csv"), emailToId, projToId);
        SeedOrientations(ctx, Path.Combine(basePath, "orientations.csv"), regToUserId, emailToId, projToId);
        SeedStudentCourses(ctx, Path.Combine(basePath, "student_courses.csv"), studentToId, courseToId);
        SeedExtensions(ctx, Path.Combine(basePath, "extensions.csv"), regToUserId);

        ctx.SaveChanges();
    }

    private static IEnumerable<T> ReadCsv<T>(string path)
    {
        using var reader = new StreamReader(path);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        return csv.GetRecords<T>().ToList();
    }

    private static void SeedUsers(ContexRepository ctx, string path, IDictionary<string, Guid> map)
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

    private static void SeedResearchLines(ContexRepository ctx, string path, IDictionary<string, Guid> map)
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

    private static void SeedProjects(ContexRepository ctx, string path, IDictionary<string, Guid> rl, IDictionary<string, Guid> map)
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

    private static void SeedCourses(ContexRepository ctx, string path, IDictionary<string, Guid> map)
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

    private static void SeedProfessors(ContexRepository ctx, string path, IDictionary<string, Guid> userMap, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<ProfessorRow>(path))
        {
            if (!userMap.TryGetValue(r.user_email.ToLower(), out var uid)) continue;
            var e = new ProfessorEntity { Id = Guid.NewGuid(), UserId = uid, Siape = r.siape, IsDeleted = false };
            ctx.Professors.Add(e);
            map[r.user_email.ToLower()] = e.Id;
        }
    }

    private static void SeedExternalResearchers(ContexRepository ctx, string path, IDictionary<string, Guid> userMap, IDictionary<string, Guid> map)
    {
        foreach (var r in ReadCsv<ExternalResearcherRow>(path))
        {
            if (!userMap.TryGetValue(r.user_email.ToLower(), out var uid)) continue;
            var e = new ExternalResearcherEntity { Id = Guid.NewGuid(), UserId = uid, Institution = r.institution, IsDeleted = false };
            ctx.ExternalResearchers.Add(e);
            map[r.user_email.ToLower()] = e.Id;
        }
    }

    private static void SeedStudents(ContexRepository ctx, string path, IDictionary<string, Guid> userMap, IDictionary<string, Guid> projMap, IDictionary<string, Guid> map, IDictionary<string, Guid> regToUser)
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
                InstitutionType = InstitutionTypeEnum.Publica,
                GraduationYear = DateTime.UtcNow.Year,
                UndergraduateArea = UndergraduateAreaEnum.COMPUTATION,
                Scholarship = ScholarshipEnum.Cefet,
                Gender = (GenderEnum)r.gender,
                IsDeleted = false
            };
            ctx.Students.Add(e);
            map[r.registration] = e.Id;
            regToUser[r.registration] = uid;
        }
    }

    private static void SeedProfessorProjects(ContexRepository ctx, string path, IDictionary<string, Guid> userMap, IDictionary<string, Guid> projMap)
    {
        foreach (var r in ReadCsv<ProfessorProjectRow>(path))
        {
            if (!userMap.TryGetValue(r.professor_email.ToLower(), out var pid)) continue;
            if (!projMap.TryGetValue(r.project_name, out var proj)) continue;
            var e = new ProfessorProjectEntity { Id = Guid.NewGuid(), ProfessorId = pid, ProjectId = proj, IsDeleted = false };
            ctx.ProfessorProjects.Add(e);
        }
    }

    private static void SeedOrientations(ContexRepository ctx, string path, IDictionary<string, Guid> regToUser, IDictionary<string, Guid> emailMap, IDictionary<string, Guid> projMap)
    {
        foreach (var r in ReadCsv<OrientationRow>(path))
        {
            if (!regToUser.TryGetValue(r.student_registration, out var sid)) continue;
            if (!emailMap.TryGetValue(r.professor_email.ToLower(), out var pid)) continue;
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

    private static void SeedStudentCourses(ContexRepository ctx, string path, IDictionary<string, Guid> studentMap, IDictionary<string, Guid> courseMap)
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

    private static void SeedExtensions(ContexRepository ctx, string path, IDictionary<string, Guid> regToUser)
    {
        foreach (var r in ReadCsv<ExtensionRow>(path))
        {
            if (!regToUser.TryGetValue(r.student_registration, out var sid)) continue;
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

    private record UserRow(string first_name,string last_name,string email,string password,string cpf,int role);
    private record ResearchLineRow(string name,string status);
    private record ProjectRow(string name,string research_line,int status);
    private record CourseRow(string name,string course_unique,int credits,string code,bool is_elective,string concept);
    private record ProfessorRow(string user_email,string siape);
    private record ExternalResearcherRow(string user_email,string institution);
    private record StudentRow(string user_email,string registration,int status,int gender,string project_name);
    private record ProfessorProjectRow(string professor_email,string project_name);
    private record OrientationRow(string student_registration,string professor_email,string project_name,string dissertation,string? coorientator_email);
    private record StudentCourseRow(string student_registration,string course_unique,string grade,int year,int trimester,int status);
    private record ExtensionRow(string student_registration,int number_of_days,int type,string status);
}
