using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PianoServer.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── 1. Base de datos SQLite ───────────────────────────────
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite("Data Source=piano.db"));

// ── 2. JWT Autenticación ──────────────────────────────────
var jwtKey = builder.Configuration["Jwt:Key"]
             ?? "PianoVirtualSecretKey2024!XyZ_Cambiame";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer   = false,
            ValidateAudience = false
        };
    });

builder.Services.AddAuthorization();

// ── 3. CORS — permite conexión desde Vite (puerto 5173) ───
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:4173",
                "http://127.0.0.1:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()));

// ── 4. Controllers + Swagger ──────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "Piano Virtual API", Version = "v1" });

    // Permite enviar JWT desde Swagger para probar endpoints protegidos
    c.AddSecurityDefinition("Bearer", new()
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Escribe tu token JWT aquí"
    });
    c.AddSecurityRequirement(new()
    {
        {
            new() { Reference = new() { Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme, Id = "Bearer" } },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// ── 5. Crear tablas automáticamente al iniciar ────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ── 6. Middleware en orden correcto ───────────────────────
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();