using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using saga.Infrastructure.Providers;
using saga.Infrastructure.Repositories;
using saga.Models.Enums;

namespace saga.Tests;

public abstract class TestBase : IDisposable
{
    private readonly SqliteConnection _connection;
    protected ContexRepository Context { get; }
    protected Repository Repository { get; }

    protected TestBase()
    {
        _connection = new SqliteConnection("DataSource=:memory:");
        _connection.Open();

        var options = new DbContextOptionsBuilder<ContexRepository>()
            .UseSqlite(_connection)
            .Options;

        var userContext = new FakeUserContext();
        Context = new ContexRepository(options);
        Context.Database.EnsureCreated();
        Repository = new Repository(Context, userContext);
    }

    public void Dispose()
    {
        Context.Dispose();
        _connection.Close();
    }

    private class FakeUserContext : IUserContext
    {
        public Guid? UserId { get; set; }
        public RolesEnum? Role { get; set; }
    }
}
