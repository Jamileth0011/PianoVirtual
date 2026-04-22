using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PianoServer.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PianoServer.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(AppDbContext db, IConfiguration cfg) : ControllerBase
{
    // ──────────────────────────────────────
    // POST /api/auth/register
    // Body: { "usuario": "Daniella", "password": "123", "email": "d@email.com" }
    // ──────────────────────────────────────
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] AuthDto dto)
    {
        // Validación básica
        if (string.IsNullOrWhiteSpace(dto.Usuario) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Usuario y contraseña son requeridos" });

        // Verificar si ya existe
        if (await db.Usuarios.AnyAsync(u => u.NombreUsuario == dto.Usuario))
            return Conflict(new { error = "Ese nombre de usuario ya está en uso" });

        // Crear usuario
        var usuario = new Usuario
        {
            NombreUsuario = dto.Usuario.Trim(),
            Email         = dto.Email?.Trim() ?? "",
            PasswordHash  = HashPassword(dto.Password)
        };

        db.Usuarios.Add(usuario);
        await db.SaveChangesAsync();

        return Ok(new { message = "Cuenta creada correctamente", usuario = usuario.NombreUsuario });
    }

    // ──────────────────────────────────────
    // POST /api/auth/login
    // Body: { "usuario": "Daniella", "password": "123" }
    // ──────────────────────────────────────
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] AuthDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Usuario) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest(new { error = "Completa los campos" });

        var usuario = await db.Usuarios
            .FirstOrDefaultAsync(u => u.NombreUsuario == dto.Usuario.Trim());

        if (usuario == null || usuario.PasswordHash != HashPassword(dto.Password))
            return Unauthorized(new { error = "Usuario o contraseña incorrectos" });

        var token = GenerarJwt(usuario);

        return Ok(new
        {
            token,
            usuario   = usuario.NombreUsuario,
            email     = usuario.Email,
            id        = usuario.Id
        });
    }

    // ──────────────────────────────────────
    // GET /api/auth/me  (requiere token)
    // ──────────────────────────────────────
    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> Me()
    {
        var id = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var u  = await db.Usuarios.FindAsync(id);
        if (u == null) return NotFound();
        return Ok(new { u.Id, u.NombreUsuario, u.Email, u.CreadoEn });
    }

    // ── HELPERS PRIVADOS ──────────────────
    private string HashPassword(string password)
    {
        var bytes = SHA256.HashData(
            Encoding.UTF8.GetBytes(password + "_piano_salt_2024"));
        return Convert.ToBase64String(bytes);
    }

    private string GenerarJwt(Usuario usuario)
    {
        var key   = cfg["Jwt:Key"] ?? throw new Exception("JWT key no configurada");
        var secKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds  = new SigningCredentials(secKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name,           usuario.NombreUsuario),
            new Claim(ClaimTypes.Email,          usuario.Email)
        };

        var token = new JwtSecurityToken(
            claims:            claims,
            expires:           DateTime.UtcNow.AddDays(7),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// DTO (Data Transfer Object) para login/registro
public class AuthDto
{
    public string  Usuario  { get; set; } = "";
    public string  Password { get; set; } = "";
    public string? Email    { get; set; }
}