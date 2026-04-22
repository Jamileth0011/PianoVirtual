// ─────────────────────────────────────────────────────────
// api.ts — Capa de comunicación con el servidor .NET
// Importa y usa estas funciones desde main.ts
// ─────────────────────────────────────────────────────────

const BASE = 'http://localhost:5000/api'

// ── Helper: devuelve los headers con el JWT si existe ────
function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  }
}

// ── Helper: hace fetch y devuelve JSON, o null si falla ──
async function req<T>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: authHeaders(),
      ...options
    })
    if (!res.ok) return null
    return await res.json() as T
  } catch {
    // Sin servidor activo → modo offline (localStorage)
    return null
  }
}

// ══════════════════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════════════════

export async function apiLogin(
  usuario: string,
  password: string
): Promise<{ token: string; usuario: string } | null> {
  return req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ usuario, password })
  })
}

export async function apiRegister(
  usuario: string,
  password: string,
  email: string
): Promise<{ message: string } | null> {
  return req('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ usuario, password, email })
  })
}

// ══════════════════════════════════════════════════════════
// MELODÍAS
// ══════════════════════════════════════════════════════════

export interface ApiMelodia {
  id:         number
  nombre:     string
  notas:      string   // JSON string
  totalNotas: number
  fecha:      string
}

// Traer mis melodías del servidor
export async function apiGetMelodias(): Promise<ApiMelodia[]> {
  const data = await req<ApiMelodia[]>('/melodias')
  return data ?? []
}

// Guardar melodía en el servidor
export async function apiSaveMelodia(
  nombre: string,
  notas: object[],
): Promise<boolean> {
  const res = await req('/melodias', {
    method: 'POST',
    body: JSON.stringify({
      nombre,
      notas:      JSON.stringify(notas),
      totalNotas: notas.length
    })
  })
  return res !== null
}

// Eliminar melodía del servidor
export async function apiDeleteMelodia(id: number): Promise<boolean> {
  const res = await req(`/melodias/${id}`, { method: 'DELETE' })
  return res !== null
}

// ══════════════════════════════════════════════════════════
// PUNTAJES
// ══════════════════════════════════════════════════════════

export interface RankingEntry {
  usuario:  string
  total:    number
  partidas: number
  retos:    number
}

// Ranking global (no requiere login)
export async function apiGetRanking(): Promise<RankingEntry[]> {
  const data = await req<RankingEntry[]>('/puntajes/ranking')
  return data ?? []
}

// Guardar puntaje de una partida
export async function apiSavePuntaje(
  puntos:     number,
  cancion:    string,
  modo:       'libre' | 'practica' | 'reto',
  completado: boolean
): Promise<void> {
  await req('/puntajes', {
    method: 'POST',
    body: JSON.stringify({ puntos, cancion, modo, completado })
  })
}