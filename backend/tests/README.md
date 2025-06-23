# Integration Tests

This folder contains integration tests for the Saga backend.

Tests run against an in-memory SQLite database. Each test project derives from
`TestBase`, which configures a `ContexRepository` with an in-memory connection
and exposes a `Repository` instance used by the services.

Run tests with:

```bash
dotnet test tests/saga.Tests.csproj
```

## Services to cover

The backend exposes several services that should be tested through integration
tests:

- `CourseService`
- `StudentService`
- `ProjectService`
- `ResearchLineService`
- `ProfessorService`
- `ExternalResearcherService`
- `ExtensionService`
- `OrientationService`
- `UserService`

Each service provides basic CRUD operations that should be tested using the
in-memory database setup. Additional validation logic or business rules for each
service can also be verified using this structure.
