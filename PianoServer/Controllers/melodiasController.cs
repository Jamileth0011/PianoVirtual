using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PianoServer.Data;
using System.Security.Claims;

namespace PianoServer.Controllers;

[ApiController]
[Route("api/melodias")]
[Authorize]   // ← todos los endpoints requieren login
public class MelodiasController(AppDbContext db) : ControllerBase
{
    // Helper: obtiene el ID del usuario logueado desde el token JWT
    private int UserId =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // ──────────────────────────────────────
    // GET /api/melodias
    // Devuelve todas las melodías del usuario logueado
    // ──────────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> GetMias()
    {
        var lista = await db.Melodias
            .Where(m => m.UsuarioId == UserId)
            .OrderByDescending(m => m.CreadaEn)
            .Select(m => new
            {
                m.Id,
                m.Nombre,
                m.Notas,
                m.TotalNotas,
                Fecha = m.CreadaEn.ToString("dd/MM/yyyy")
            })
            .ToListAsync();

        return Ok(lista);
    }

    // ──────────────────────────────────────
    // POST /api/melodias
    // Body: { "nombre": "Mi canción", "notas": "[...]" }
    // ──────────────────────────────────────
    [HttpPost]
    public async Task<IActionResult> Guardar([FromBody] MelodiaDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Nombre))
            return BadRequest(new { error = "El nombre es requerido" });

        var melodia = new Melodia
        {
            Nombre     = dto.Nombre.Trim(),
            Notas      = dto.Notas,
            TotalNotas = dto.TotalNotas,
            UsuarioId  = UserId
        };

        db.Melodias.Add(melodia);
        await db.SaveChangesAsync();

        return Ok(new { melodia.Id, message = "Melodía guardada" });
    }

    // ──────────────────────────────────────
    // DELETE /api/melodias/{id}
    // ──────────────────────────────────────
    [HttpDelete("{id}")]
    public async Task<IActionResult> Eliminar(int id)
    {
        // Solo puede eliminar sus propias melodías
        var melodia = await db.Melodias
            .FirstOrDefaultAsync(m => m.Id == id && m.UsuarioId == UserId);

        if (melodia == null)
            return NotFound(new { error = "Melodía no encontrada" });

        db.Melodias.Remove(melodia);
        await db.SaveChangesAsync();

        return Ok(new { message = "Eliminada" });
    }
}

// DTO para crear melodía
public class MelodiaDto
{
    public string Nombre     { get; set; } = "";
    public string Notas      { get; set; } = "[]";
    public int    TotalNotas { get; set; } = 0;
}