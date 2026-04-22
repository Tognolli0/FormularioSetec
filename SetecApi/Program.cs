using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

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
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Formulario Setec API",
        Version = "v1",
        Description = "API para registro e acompanhamento de solicitacoes logisticas."
    });
});

var app = builder.Build();

app.UseCors(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

app.UseSwagger();
app.UseSwaggerUI();

app.MapGet("/healthz", () => Results.Ok(new
{
    status = "healthy",
    time = DateTime.UtcNow
}));

app.MapPost("/api/viagens", async (SetecContext db, Solicitacao s) =>
{
    var validationResults = new List<ValidationResult>();
    var validationContext = new ValidationContext(s);

    if (!Validator.TryValidateObject(s, validationContext, validationResults, validateAllProperties: true))
    {
        return Results.ValidationProblem(validationResults
            .GroupBy(result => result.MemberNames.FirstOrDefault() ?? string.Empty)
            .ToDictionary(
                group => string.IsNullOrWhiteSpace(group.Key) ? "solicitacao" : group.Key,
                group => group.Select(result => result.ErrorMessage ?? "Campo invalido.").ToArray()));
    }

    db.Solicitacoes.Add(s);
    await db.SaveChangesAsync();
    return Results.Created($"/api/viagens/{s.Id}", s);
});

app.MapGet("/api/viagens", async (SetecContext db) =>
    await db.Solicitacoes
        .OrderByDescending(item => item.Id)
        .ToListAsync());

app.Run();

public class Solicitacao
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Hospital ou evento e obrigatorio.")]
    [MaxLength(200)]
    public string HospitalEvento { get; set; } = "";

    [Required(ErrorMessage = "Projeto e obrigatorio.")]
    [MaxLength(200)]
    public string Projeto { get; set; } = "";

    [Required(ErrorMessage = "Data da visita e obrigatoria.")]
    [MaxLength(50)]
    public string DataVisita { get; set; } = "";

    [MaxLength(150)]
    public string EspecialistaNome { get; set; } = "";
    [MaxLength(500)]
    public string EspAereo { get; set; } = "";
    [MaxLength(500)]
    public string EspCarro { get; set; } = "";
    [MaxLength(500)]
    public string EspOnibus { get; set; } = "";
    [MaxLength(500)]
    public string EspTaxiTransfer { get; set; } = "";
    [MaxLength(500)]
    public string EspHotel { get; set; } = "";
    [MaxLength(100)]
    public string EspStatus { get; set; } = "";
    [MaxLength(1000)]
    public string EspObs { get; set; } = "";

    [MaxLength(150)]
    public string MedicoNome { get; set; } = "";
    [MaxLength(500)]
    public string MedAereo { get; set; } = "";
    [MaxLength(500)]
    public string MedCarro { get; set; } = "";
    [MaxLength(500)]
    public string MedOnibus { get; set; } = "";
    [MaxLength(500)]
    public string MedTaxiTransfer { get; set; } = "";
    [MaxLength(500)]
    public string MedHotel { get; set; } = "";
    [MaxLength(100)]
    public string MedStatus { get; set; } = "";
    [MaxLength(1000)]
    public string MedObs { get; set; } = "";
}

class SetecContext : DbContext
{
    public SetecContext(DbContextOptions<SetecContext> options) : base(options) { }

    public DbSet<Solicitacao> Solicitacoes => Set<Solicitacao>();
}
