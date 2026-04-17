using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connStr = Environment.GetEnvironmentVariable("DATABASE_URL")
              ?? builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connStr))
{
    throw new InvalidOperationException(
        "Configure DATABASE_URL ou ConnectionStrings:DefaultConnection antes de iniciar a API.");
}

builder.Services.AddDbContext<SetecContext>(opt => opt.UseNpgsql(connStr));
builder.Services.AddCors();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapGet("/healthz", () => Results.Ok(new
{
    status = "healthy",
    time = DateTime.UtcNow
}));

app.MapPost("/api/viagens", async (SetecContext db, Solicitacao s) =>
{
    db.Solicitacoes.Add(s);
    await db.SaveChangesAsync();
    return Results.Created($"/api/viagens/{s.Id}", s);
});

app.MapGet("/api/viagens", async (SetecContext db) =>
    await db.Solicitacoes.ToListAsync());

app.Run();

public class Solicitacao
{
    public int Id { get; set; }
    public string HospitalEvento { get; set; } = "";
    public string Projeto { get; set; } = "";
    public string DataVisita { get; set; } = "";

    public string EspecialistaNome { get; set; } = "";
    public string EspAereo { get; set; } = "";
    public string EspCarro { get; set; } = "";
    public string EspOnibus { get; set; } = "";
    public string EspTaxiTransfer { get; set; } = "";
    public string EspHotel { get; set; } = "";
    public string EspStatus { get; set; } = "";
    public string EspObs { get; set; } = "";

    public string MedicoNome { get; set; } = "";
    public string MedAereo { get; set; } = "";
    public string MedCarro { get; set; } = "";
    public string MedOnibus { get; set; } = "";
    public string MedTaxiTransfer { get; set; } = "";
    public string MedHotel { get; set; } = "";
    public string MedStatus { get; set; } = "";
    public string MedObs { get; set; } = "";
}

class SetecContext : DbContext
{
    public SetecContext(DbContextOptions<SetecContext> options) : base(options) { }

    public DbSet<Solicitacao> Solicitacoes => Set<Solicitacao>();
}
