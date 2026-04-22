using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PianoServer.Data;
using System.Security.Claims;

namespace PianoServer.Controllers;

[ApiController]
[Route("api/puntajes")]
public class PuntajesController(AppDbContext db) : ControllerBase
{
    // ──────────────────────────────────────
    // GET /api/puntajes/ranking
    // Top 10 global — NO requiere login
    // ──────────────────────────────────────
    [HttpGet("ranking")]
    public async Task<IActionResult> Ranking()
    {
        var top = await db.Puntajes
            .Include(p => p.Usuario)
            .GroupBy(p => new { p.UsuarioId, p.Usuario!.NombreUsuario })
            .Select(g => new
            {
                Usuario   = g.Key.NombreUsuario,
                Total     = g.Sum(p => p.Puntos),
                Partidas  = g.Count(),
                Retos     = g.Count(p => p.Modo == "reto" && p.Completado)
            })
            .OrderByDescending(x => x.Total)
            .Take(10)
            .ToListAsync();

        return Ok(top);
    }

    // ──────────────────────────────────────
    // GET /api/puntajes/mios
    // Historial personal — requiere login
    // ──────────────────────────────────────
    [HttpGet("mios")]
    [Authorize]
    public async Task<IActionResult> Mios()
    {
        var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var historial = await db.Puntajes
            .Where(p => p.UsuarioId == uid)
            .OrderByDescending(p => p.FechaEn)
            .Take(20)
            .Select(p => new
            {
                p.Puntos,
                p.Cancion,
                p.Modo,
                p.Completado,
                Fecha = p.FechaEn.ToString("dd/MM/yyyy HH:mm")
            })
            .ToListAsync();

        var total = await db.Puntajes
            .Where(p => p.UsuarioId == uid)
            .SumAsync(p => p.Puntos);

        return Ok(new { total, historial });
    }

    // ──────────────────────────────────────
    // POST /api/puntajes
    // Guardar resultado de una partida — requiere login
    // Body: { "puntos": 500, "cancion": "mary", "modo": "reto", "completado": true }
    // ──────────────────────────────────────
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Guardar([FromBody] PuntajeDto dto)
    {
        var uid = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        db.Puntajes.Add(new Puntaje
        {
            Puntos     = dto.Puntos,
            Cancion    = dto.Cancion,
            Modo       = dto.Modo,
            Completado = dto.Completado,
            UsuarioId  = uid
        });

        await db.SaveChangesAsync();
        return Ok(new { message = "Puntaje guardado" });
    }
}

// DTO para guardar puntaje
public class PuntajeDto
{
    public int    Puntos     { get; set; }
    public string Cancion    { get; set; } = "";
    public string Modo       { get; set; } = "libre";
    public bool   Completado { get; set; } = false;
}