using Microsoft.EntityFrameworkCore;

namespace PianoServer.Data;

// ══════════════════════════════════════════════
// MODELOS (tablas de la base de datos)
// ══════════════════════════════════════════════

/// <summary>Tabla de usuarios registrados</summary>
public class Usuario
{
    public int      Id             { get; set; }
    public string   NombreUsuario  { get; set; } = "";
    public string   Email          { get; set; } = "";
    public string   PasswordHash   { get; set; } = "";
    public DateTime CreadoEn       { get; set; } = DateTime.UtcNow;

    // Relaciones
    public List<Melodia> Melodias  { get; set; } = new();
    public List<Puntaje> Puntajes  { get; set; } = new();
}

/// <summary>Tabla de melodías grabadas por el usuario</summary>
public class Melodia
{
    public int      Id         { get; set; }
    public string   Nombre     { get; set; } = "";
    /// <summary>JSON con el array de notas grabadas</summary>
    public string   Notas      { get; set; } = "[]";
    public int      TotalNotas { get; set; } = 0;
    public DateTime CreadaEn   { get; set; } = DateTime.UtcNow;

    public int      UsuarioId  { get; set; }
    public Usuario? Usuario    { get; set; }
}

/// <summary>Tabla de puntajes por partida</summary>
public class Puntaje
{
    public int      Id         { get; set; }
    public int      Puntos     { get; set; }
    public string   Cancion    { get; set; } = "";
    /// <summary>libre | practica | reto</summary>
    public string   Modo       { get; set; } = "libre";
    public bool     Completado { get; set; } = false;
    public DateTime FechaEn    { get; set; } = DateTime.UtcNow;

    public int      UsuarioId  { get; set; }
    public Usuario? Usuario    { get; set; }
}

// ══════════════════════════════════════════════
// CONTEXTO DE BASE DE DATOS
// ══════════════════════════════════════════════
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Melodia> Melodias => Set<Melodia>();
    public DbSet<Puntaje> Puntajes => Set<Puntaje>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // Índice único: no puede haber dos usuarios con el mismo nombre
        mb.Entity<Usuario>()
          .HasIndex(u => u.NombreUsuario)
          .IsUnique();

        // Índice único por email
        mb.Entity<Usuario>()
          .HasIndex(u => u.Email)
          .IsUnique();
    }
}