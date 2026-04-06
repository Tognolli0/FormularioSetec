using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSqlite<SetecContext>("Data Source=setec_logistica_v8.db");
builder.Services.AddCors();

var app = builder.Build();
app.UseCors(p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); 

app.MapPost("/api/viagens", async (SetecContext db, Solicitacao s) => {
    await db.Database.EnsureCreatedAsync(); 
    db.Solicitacoes.Add(s);
    await db.SaveChangesAsync();
    return Results.Created($"/api/viagens/{s.Id}", s);
});

app.MapGet("/api/viagens", async (SetecContext db) => await db.Solicitacoes.ToListAsync());

app.Run();

public class Solicitacao {
    public int Id { get; set; }
    public string HospitalEvento { get; set; } = "";
    public string Projeto { get; set; } = "";
    public string DataVisita { get; set; } = "";

    // SEÇÃO ESPECIALISTA
    public string EspecialistaNome { get; set; } = "";
    public string EspAereo { get; set; } = "";
    public string EspCarro { get; set; } = "";
    public string EspOnibus { get; set; } = "";
    public string EspTaxiTransfer { get; set; } = "";
    public string EspHotel { get; set; } = "";
    public string EspStatus { get; set; } = "";
    public string EspObs { get; set; } = "";

    // SEÇÃO MÉDICO (CAMPOS DISTINTOS)
    public string MedicoNome { get; set; } = "";
    public string MedAereo { get; set; } = "";
    public string MedCarro { get; set; } = "";
    public string MedOnibus { get; set; } = "";
    public string MedTaxiTransfer { get; set; } = "";
    public string MedHotel { get; set; } = "";
    public string MedStatus { get; set; } = "";
    public string MedObs { get; set; } = "";
}

class SetecContext : DbContext {
    public SetecContext(DbContextOptions<SetecContext> options) : base(options) {}
    public DbSet<Solicitacao> Solicitacoes => Set<Solicitacao>();
}