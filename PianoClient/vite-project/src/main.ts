import './style.css'

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────
interface PianoNote    { key: string; freq: number; type: 'white'|'black'; name: string }
interface RecordedNote { key: string; freq: number; time: number }
interface SavedMelodia { id: string; nombre: string; fecha: string; notas: RecordedNote[] }
interface ScoreEntry   { usuario: string; puntos: number }
type SoundType = 'piano'|'organ'|'synth'|'marimba'
type SongKey   = 'mary'|'oda'|'cumpleanos'|'estrellita'|'canon'
type PianoMode = 'main'|'practice'|'reto'

// ─────────────────────────────────────────────
// NOTAS DEL PIANO (teclas correctas A-Ñ)
// ─────────────────────────────────────────────
const NOTES: PianoNote[] = [
  { key:'A', freq:261.63, type:'white', name:'Do'   },
  { key:'W', freq:277.18, type:'black', name:'Do#'  },
  { key:'S', freq:293.66, type:'white', name:'Re'   },
  { key:'E', freq:311.13, type:'black', name:'Re#'  },
  { key:'D', freq:329.63, type:'white', name:'Mi'   },
  { key:'F', freq:349.23, type:'white', name:'Fa'   },
  { key:'T', freq:369.99, type:'black', name:'Fa#'  },
  { key:'G', freq:392.00, type:'white', name:'Sol'  },
  { key:'Y', freq:415.30, type:'black', name:'Sol#' },
  { key:'H', freq:440.00, type:'white', name:'La'   },
  { key:'U', freq:466.16, type:'black', name:'La#'  },
  { key:'J', freq:493.88, type:'white', name:'Si'   },
  { key:'K', freq:523.25, type:'white', name:'Do2'  },
  { key:'O', freq:554.37, type:'black', name:'Do2#' },
  { key:'L', freq:587.33, type:'white', name:'Re2'  },
  { key:'P', freq:622.25, type:'black', name:'Re2#' },
  { key:'Ñ', freq:659.25, type:'white', name:'Mi2'  },
]

// Notas blancas en orden — necesario para posicionar las negras
const WHITE_NOTES = NOTES.filter(n => n.type === 'white')
const BLACK_NOTES = NOTES.filter(n => n.type === 'black')

// ─────────────────────────────────────────────
// CANCIONES (5 canciones con distintos niveles)
// ─────────────────────────────────────────────
const SONGS: Record<SongKey, { nombre: string; nivel: string; notas: RecordedNote[] }> = {
  mary: {
    nombre: 'Mary Had a Little Lamb',
    nivel: '⭐ Básico',
    notas: [
      {key:'D',freq:329.63,time:0},   {key:'S',freq:293.66,time:400},
      {key:'A',freq:261.63,time:800}, {key:'S',freq:293.66,time:1200},
      {key:'D',freq:329.63,time:1600},{key:'D',freq:329.63,time:2000},
      {key:'D',freq:329.63,time:2400},{key:'S',freq:293.66,time:3000},
      {key:'S',freq:293.66,time:3400},{key:'S',freq:293.66,time:3800},
      {key:'D',freq:329.63,time:4400},{key:'G',freq:392.00,time:4800},
      {key:'G',freq:392.00,time:5200},
    ]
  },
  estrellita: {
    nombre: 'Estrellita ¿Dónde Estás?',
    nivel: '⭐ Básico',
    notas: [
      {key:'A',freq:261.63,time:0},   {key:'A',freq:261.63,time:400},
      {key:'G',freq:392.00,time:800}, {key:'G',freq:392.00,time:1200},
      {key:'H',freq:440.00,time:1600},{key:'H',freq:440.00,time:2000},
      {key:'G',freq:392.00,time:2400},{key:'F',freq:349.23,time:3200},
      {key:'F',freq:349.23,time:3600},{key:'D',freq:329.63,time:4000},
      {key:'D',freq:329.63,time:4400},{key:'S',freq:293.66,time:4800},
      {key:'S',freq:293.66,time:5200},{key:'A',freq:261.63,time:5600},
    ]
  },
  cumpleanos: {
    nombre: 'Cumpleaños Feliz',
    nivel: '⭐⭐ Medio',
    notas: [
      {key:'A',freq:261.63,time:0},   {key:'A',freq:261.63,time:300},
      {key:'S',freq:293.66,time:600}, {key:'A',freq:261.63,time:1100},
      {key:'F',freq:349.23,time:1500},{key:'D',freq:329.63,time:1900},
      {key:'A',freq:261.63,time:2600},{key:'A',freq:261.63,time:2900},
      {key:'S',freq:293.66,time:3200},{key:'A',freq:261.63,time:3700},
      {key:'G',freq:392.00,time:4100},{key:'F',freq:349.23,time:4500},
      {key:'A',freq:261.63,time:5200},{key:'A',freq:261.63,time:5500},
      {key:'K',freq:523.25,time:5800},{key:'H',freq:440.00,time:6300},
      {key:'F',freq:349.23,time:6700},{key:'D',freq:329.63,time:7100},
      {key:'S',freq:293.66,time:7500},
    ]
  },
  oda: {
    nombre: 'Oda a la Alegría',
    nivel: '⭐⭐ Medio',
    notas: [
      {key:'D',freq:329.63,time:0},   {key:'D',freq:329.63,time:400},
      {key:'F',freq:349.23,time:800}, {key:'G',freq:392.00,time:1200},
      {key:'G',freq:392.00,time:1600},{key:'F',freq:349.23,time:2000},
      {key:'D',freq:329.63,time:2400},{key:'S',freq:293.66,time:2800},
      {key:'A',freq:261.63,time:3200},{key:'A',freq:261.63,time:3600},
      {key:'S',freq:293.66,time:4000},{key:'D',freq:329.63,time:4400},
      {key:'D',freq:329.63,time:4800},{key:'S',freq:293.66,time:5400},
      {key:'S',freq:293.66,time:5800},{key:'D',freq:329.63,time:6200},
      {key:'F',freq:349.23,time:6600},{key:'G',freq:392.00,time:7000},
    ]
  },
  canon: {
    nombre: 'Cañón de Pachelbel',
    nivel: '⭐⭐⭐ Difícil',
    notas: [
      {key:'K',freq:523.25,time:0},   {key:'H',freq:440.00,time:400},
      {key:'J',freq:493.88,time:800}, {key:'D',freq:329.63,time:1200},
      {key:'F',freq:349.23,time:1600},{key:'A',freq:261.63,time:2000},
      {key:'F',freq:349.23,time:2400},{key:'G',freq:392.00,time:2800},
      {key:'K',freq:523.25,time:3200},{key:'H',freq:440.00,time:3600},
      {key:'J',freq:493.88,time:4000},{key:'D',freq:329.63,time:4400},
      {key:'F',freq:349.23,time:4800},{key:'A',freq:261.63,time:5200},
      {key:'S',freq:293.66,time:5600},{key:'D',freq:329.63,time:6000},
      {key:'F',freq:349.23,time:6400},{key:'G',freq:392.00,time:6800},
      {key:'H',freq:440.00,time:7200},{key:'G',freq:392.00,time:7600},
      {key:'F',freq:349.23,time:8000},{key:'D',freq:329.63,time:8400},
      {key:'K',freq:523.25,time:8800},{key:'L',freq:587.33,time:9200},
    ]
  }
}

// ─────────────────────────────────────────────
// AUDIO
// ─────────────────────────────────────────────
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
let currentSound: SoundType = 'piano'

function playNote(freq: number, sound: SoundType = currentSound): void {
  if (audioCtx.state === 'suspended') audioCtx.resume()
  const now = audioCtx.currentTime

  if (sound === 'organ') {
    ;[1, 2, 3].forEach((h, i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain()
      o.type = 'sine'; o.frequency.value = freq * h
      g.gain.setValueAtTime(0.28 / (i + 1), now)
      g.gain.linearRampToValueAtTime(0, now + 1.8)
      o.connect(g); g.connect(audioCtx.destination)
      o.start(now); o.stop(now + 1.8)
    })
    return
  }

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain); gain.connect(audioCtx.destination)
  osc.frequency.value = freq

  if (sound === 'piano') {
    osc.type = 'triangle'
    gain.gain.setValueAtTime(0.5, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5)
    osc.start(now); osc.stop(now + 1.5)
  } else if (sound === 'synth') {
    osc.type = 'sawtooth'
    gain.gain.setValueAtTime(0.3, now)
    gain.gain.linearRampToValueAtTime(0, now + 0.7)
    osc.start(now); osc.stop(now + 0.7)
  } else if (sound === 'marimba') {
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.6, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55)
    osc.start(now); osc.stop(now + 0.55)
  }
}

// ─────────────────────────────────────────────
// USUARIO
// ─────────────────────────────────────────────
function loadUser(): void {
  const nombre = localStorage.getItem('usuario') || 'Usuario'
  const letra  = nombre.charAt(0).toUpperCase()
  document.querySelectorAll<HTMLElement>('[id^="avatar"]').forEach(el => { el.textContent = letra })
  const dn = document.getElementById('display-name')
  if (dn) dn.textContent = nombre
}

function logout(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  window.location.href = '/login.html'
}

// ─────────────────────────────────────────────
// NAVEGACIÓN
// ─────────────────────────────────────────────
function showScreen(id: string): void {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  const el = document.getElementById(id)
  if (el) el.classList.add('active')
  if (id === 'screen-melodias') loadMelodias()
  if (id === 'screen-puntajes') loadPuntajes()
}

// ─────────────────────────────────────────────
// ESTADÍSTICAS
// ─────────────────────────────────────────────
function getStat(key: string): number { return parseInt(localStorage.getItem(key) || '0') }
function setStat(key: string, val: number): void { localStorage.setItem(key, String(val)) }
function incStat(key: string, by = 1): void { setStat(key, getStat(key) + by) }

// ─────────────────────────────────────────────
// CONSTRUIR PIANO
// ─────────────────────────────────────────────
// Calcula el left en px de una tecla negra dado su índice entre las blancas
// keyWhiteWidth: ancho de cada tecla blanca, keyBlackWidth: ancho de tecla negra
// blackInsertAfterWhite: índice de la tecla blanca DESPUÉS de la cual va esta negra
const BLACK_AFTER_WHITE: Record<string, number> = {
  // índice 0-based de la tecla blanca a la derecha de cada negra
  W: 0,  // después de A (blanca 0)
  E: 1,  // después de S (blanca 1)
  T: 3,  // después de F (blanca 3)
  Y: 4,  // después de G (blanca 4)
  U: 5,  // después de H (blanca 5)
  O: 7,  // después de K (blanca 7)
  P: 8,  // después de L (blanca 8)
}

function buildPiano(containerId: string, mode: PianoMode): void {
  const container = document.getElementById(containerId)
  if (!container) return
  container.innerHTML = ''

  const isMini = mode !== 'main'
  // Para mini-pianos usamos solo las notas que aparecen en las canciones (más intuitivo)
  // pero mostramos el mismo layout completo centrado
  const W = isMini ? 44 : 54   // ancho tecla blanca
  const B = isMini ? 27 : 33   // ancho tecla negra
  const HW = isMini ? 110 : 200 // alto blanca
  const HB = isMini ? 68  : 128 // alto negra
  const PAD = isMini ? 10 : 14  // padding lateral del contenedor

  const prefix = mode === 'main' ? '' : `${mode}-`

  // Calcular el ancho total necesario
  const totalW = WHITE_NOTES.length * W + PAD * 2
  container.style.width = totalW + 'px'
  container.style.minWidth = totalW + 'px'

  // Crear teclas blancas
  WHITE_NOTES.forEach((n) => {
    const div = document.createElement('div')
    div.className = `key white`
    div.id = `${prefix}key-${n.key}`
    div.style.width  = W + 'px'
    div.style.height = HW + 'px'
    div.innerHTML = `<span class="key-label">${n.key}</span>`
    attachKeyEvents(div, n, mode)
    container.appendChild(div)
  })

  // Crear teclas negras con posición exacta
  BLACK_NOTES.forEach(n => {
    const afterIdx = BLACK_AFTER_WHITE[n.key]
    if (afterIdx === undefined) return
    const div = document.createElement('div')
    div.className = `key black`
    div.id = `${prefix}key-${n.key}`
    div.style.width  = B + 'px'
    div.style.height = HB + 'px'
    // left = padding + (afterIdx + 1) * W - B/2
    const leftPx = PAD + (afterIdx + 1) * W - B / 2
    div.style.left = leftPx + 'px'
    div.style.top  = (isMini ? PAD : PAD) + 'px'
    div.innerHTML = `<span class="key-label">${n.key}</span>`
    attachKeyEvents(div, n, mode)
    container.appendChild(div)
  })
}

function attachKeyEvents(div: HTMLElement, n: PianoNote, mode: PianoMode): void {
  if (mode === 'main') {
    const onPress = () => {
      playNote(n.freq); div.classList.add('active')
      showNoteLabel(n.name)
      if (isRecording) recordedNotes.push({ key: n.key, freq: n.freq, time: Date.now() - recordStart })
      incStat('notes_played'); checkLogros()
    }
    const onRelease = () => div.classList.remove('active')
    div.addEventListener('mousedown', onPress)
    div.addEventListener('mouseup',   onRelease)
    div.addEventListener('mouseleave', onRelease)
    div.addEventListener('touchstart', e => { e.preventDefault(); onPress() }, { passive: false })
    div.addEventListener('touchend', onRelease)
  }

  if (mode === 'reto') {
    div.addEventListener('mousedown', () => handleRetoKey(n.key, n.freq))
    div.addEventListener('touchstart', e => { e.preventDefault(); handleRetoKey(n.key, n.freq) }, { passive: false })
  }

  if (mode === 'practice') {
    div.addEventListener('mousedown', () => {
      playNote(n.freq)
      div.classList.add('active')
      setTimeout(() => div.classList.remove('active'), 200)
      if (practiceActive) checkPracticeKey(n.key)
    })
    div.addEventListener('touchstart', e => {
      e.preventDefault()
      playNote(n.freq)
      div.classList.add('active')
      setTimeout(() => div.classList.remove('active'), 200)
      if (practiceActive) checkPracticeKey(n.key)
    }, { passive: false })
  }
}

// ─────────────────────────────────────────────
// GRABACIÓN
// ─────────────────────────────────────────────
let isRecording   = false
let recordStart   = 0
let recordedNotes: RecordedNote[] = []
let playbackTimers: ReturnType<typeof setTimeout>[] = []

function startRecording(): void {
  isRecording = true; recordStart = Date.now(); recordedNotes = []
  document.getElementById('btn-grabar')?.classList.add('recording')
  showStatus('🔴 Grabando... (clic para detener)')
}

function stopRecording(): void {
  isRecording = false
  document.getElementById('btn-grabar')?.classList.remove('recording')
  if (!recordedNotes.length) { showStatus('Sin notas grabadas'); return }
  showStatus(`✅ ${recordedNotes.length} notas — pulsa 💾 para guardar`)
}

function playRecording(notas: RecordedNote[]): void {
  playbackTimers.forEach(clearTimeout); playbackTimers = []
  if (!notas.length) { showStatus('Nada que reproducir'); return }
  showStatus('▶ Reproduciendo...')
  notas.forEach(n => {
    const t = setTimeout(() => {
      playNote(n.freq)
      const el = document.getElementById(`key-${n.key}`)
      if (el) { el.classList.add('active'); setTimeout(() => el.classList.remove('active'), 180) }
    }, n.time)
    playbackTimers.push(t)
  })
  const end = setTimeout(() => showStatus(''), notas[notas.length - 1].time + 600)
  playbackTimers.push(end)
}

// ─────────────────────────────────────────────
// MELODÍAS
// ─────────────────────────────────────────────
function saveMelodia(notas: RecordedNote[]): void {
  const nombre = prompt('Nombre de la melodía:', `Melodía ${new Date().toLocaleTimeString()}`)
  if (!nombre) return
  const lista: SavedMelodia[] = JSON.parse(localStorage.getItem('melodias') || '[]')
  lista.push({ id: Date.now().toString(), nombre, fecha: new Date().toLocaleDateString(), notas })
  localStorage.setItem('melodias', JSON.stringify(lista))
  showStatus('✅ Guardada: ' + nombre)
  incStat('melodias_count'); checkLogros()
}

function loadMelodias(): void {
  const lista: SavedMelodia[] = JSON.parse(localStorage.getItem('melodias') || '[]')
  const container = document.getElementById('melodias-list')
  if (!container) return
  if (!lista.length) {
    container.innerHTML = '<p class="empty-msg">Aún no hay melodías. ¡Graba una en el piano!</p>'
    return
  }
  container.innerHTML = [...lista].reverse().map(m => `
    <div class="mel-item">
      <div class="mel-icon">🎵</div>
      <div class="mel-info">
        <div class="mel-name">${m.nombre}</div>
        <div class="mel-meta">${m.notas.length} notas · ${m.fecha}</div>
      </div>
      <div class="mel-actions">
        <button class="mel-btn" onclick="playMelodia('${m.id}')">▶</button>
        <button class="mel-btn del" onclick="deleteMelodia('${m.id}')">✕</button>
      </div>
    </div>
  `).join('')
}

function playMelodia(id: string): void {
  const lista: SavedMelodia[] = JSON.parse(localStorage.getItem('melodias') || '[]')
  const m = lista.find(x => x.id === id)
  if (m) { showScreen('screen-piano'); setTimeout(() => playRecording(m.notas), 300) }
}

function deleteMelodia(id: string): void {
  if (!confirm('¿Eliminar esta melodía?')) return
  const lista: SavedMelodia[] = JSON.parse(localStorage.getItem('melodias') || '[]')
  localStorage.setItem('melodias', JSON.stringify(lista.filter(m => m.id !== id)))
  loadMelodias()
}

// ─────────────────────────────────────────────
// PUNTAJES Y LOGROS
// ─────────────────────────────────────────────
function loadPuntajes(): void {
  const miPuntaje = getStat('total_score')
  const notas     = getStat('notes_played')
  const melodias  = getStat('melodias_count')

  const setEl = (id: string, val: string | number) => {
    const el = document.getElementById(id); if (el) el.textContent = String(val)
  }
  setEl('my-score',          miPuntaje.toLocaleString())
  setEl('my-notes-count',    notas.toLocaleString())
  setEl('my-melodias-count', melodias.toString())

  const usuario = localStorage.getItem('usuario') || 'Tú'
  const scores: ScoreEntry[] = JSON.parse(localStorage.getItem('scores') || JSON.stringify([
    { usuario:'CarlosP',    puntos:3210 },
    { usuario:'MusicLover', puntos:2800 },
    { usuario:'PianoKing',  puntos:2450 },
    { usuario:'Sonatina',   puntos:980  },
  ]))

  const myIdx = scores.findIndex(s => s.usuario === usuario)
  if (myIdx >= 0) scores[myIdx].puntos = Math.max(scores[myIdx].puntos, miPuntaje)
  else scores.push({ usuario, puntos: miPuntaje })
  scores.sort((a, b) => b.puntos - a.puntos)
  localStorage.setItem('scores', JSON.stringify(scores))

  const rl = document.getElementById('ranking-list')
  if (rl) {
    rl.innerHTML = scores.slice(0, 8).map((s, i) => {
      const medal = (['🥇','🥈','🥉'][i]) ?? String(i + 1)
      const isMe  = s.usuario === usuario
      return `<div class="rank-row ${isMe ? 'me' : ''}">
        <span class="rank-num">${medal}</span>
        <span class="rank-name" style="${isMe ? 'color:#ffe000' : ''}">${isMe ? `[${s.usuario}]` : s.usuario}</span>
        <span class="rank-pts">${s.puntos.toLocaleString()}</span>
      </div>`
    }).join('')
  }
  renderLogros()
}

const LOGROS = [
  { id:'primera_nota', label:'Primera nota',   check: () => getStat('notes_played')   >= 1   },
  { id:'diez_notas',   label:'10 notas',        check: () => getStat('notes_played')   >= 10  },
  { id:'cien_notas',   label:'100 notas',       check: () => getStat('notes_played')   >= 100 },
  { id:'primera_mel',  label:'Primera melodía', check: () => getStat('melodias_count') >= 1   },
  { id:'reto_ganar',   label:'Ganar un reto',   check: () => getStat('retos_ganados')  >= 1   },
  { id:'canon',        label:'Tocar el Cañón',  check: () => getStat('canon_played')   >= 1   },
]

function checkLogros(): void {
  const ganados: string[] = JSON.parse(localStorage.getItem('logros') || '[]')
  let changed = false
  LOGROS.forEach(l => {
    if (!ganados.includes(l.id) && l.check()) {
      ganados.push(l.id); changed = true
      showStatus(`🏆 Logro: ${l.label}!`)
    }
  })
  if (changed) localStorage.setItem('logros', JSON.stringify(ganados))
}

function renderLogros(): void {
  const ganados: string[] = JSON.parse(localStorage.getItem('logros') || '[]')
  const el = document.getElementById('logros-list')
  if (!el) return
  el.innerHTML = LOGROS.map(l => {
    const earned = ganados.includes(l.id)
    return `<span class="logro-badge ${earned ? 'earned' : ''}">${earned ? '✓ ' : ''}${l.label}</span>`
  }).join('')
}

// ─────────────────────────────────────────────
// MODO PRÁCTICA
// ─────────────────────────────────────────────
let practiceSong: SongKey = 'mary'
let practiceIdx    = 0
let practiceScore  = 0
let practiceActive = false

function selectPracticeSong(key: SongKey, btn: HTMLElement): void {
  practiceSong = key
  document.querySelectorAll('.song-chip').forEach(b => b.classList.remove('active-chip'))
  btn.classList.add('active-chip')
  const nameEl = document.getElementById('practice-song-name')
  if (nameEl) nameEl.textContent = SONGS[key].nombre
  resetPractice()
}

function startPractice(): void {
  practiceActive = true; practiceIdx = 0; practiceScore = 0
  renderNoteSequence(); updatePracticeHint()
  if (practiceSong === 'canon') incStat('canon_played')
  checkLogros()
}

function resetPractice(): void {
  practiceActive = false; practiceIdx = 0; practiceScore = 0
  const pf = document.getElementById('progress-fill');   if (pf) pf.style.width = '0%'
  const pp = document.getElementById('progress-pct');    if (pp) pp.textContent = 'Progreso: 0%'
  const ps = document.getElementById('practice-score');  if (ps) ps.textContent = 'Puntos: 0'
  const hb = document.getElementById('hint-box');        if (hb) hb.textContent = 'Presiona Iniciar'
  const ns = document.getElementById('note-sequence');   if (ns) ns.innerHTML = ''
  document.querySelectorAll('#practice-piano .key').forEach(k => k.classList.remove('hint-key'))
}

function checkPracticeKey(key: string): void {
  const notas = SONGS[practiceSong].notas
  const expected = notas[practiceIdx]
  if (!expected) return
  if (expected.key === key) {
    practiceScore += 10 * (practiceIdx + 1)
    practiceIdx++
    renderNoteSequence()
    const pct = Math.round((practiceIdx / notas.length) * 100)
    const pf = document.getElementById('progress-fill');  if (pf) pf.style.width = pct + '%'
    const pp = document.getElementById('progress-pct');   if (pp) pp.textContent = `Progreso: ${pct}%`
    const ps = document.getElementById('practice-score'); if (ps) ps.textContent = `Puntos: ${practiceScore}`
    updatePracticeHint()
  } else {
    // Tecla incorrecta: feedback visual en rojo
    const wrongEl = document.getElementById(`practice-key-${key}`)
    if (wrongEl) {
      wrongEl.style.background = '#ff3131'
      setTimeout(() => { wrongEl.style.background = '' }, 300)
    }
  }
}

function renderNoteSequence(): void {
  const seq = document.getElementById('note-sequence')
  if (!seq) return
  const notas = SONGS[practiceSong].notas
  seq.innerHTML = notas.map((n, i) => {
    const cls = i < practiceIdx ? 'nc-done' : i === practiceIdx ? 'nc-current' : 'nc-pending'
    return `<div class="note-chip ${cls}">${n.key}</div>`
  }).join('')
  const cur = seq.querySelector('.nc-current') as HTMLElement|null
  if (cur) cur.scrollIntoView({ inline:'center', block:'nearest' })
}

function updatePracticeHint(): void {
  const notas = SONGS[practiceSong].notas
  const hb = document.getElementById('hint-box')
  if (!hb) return
  if (practiceIdx >= notas.length) {
    hb.innerHTML = '🎉 ¡Canción completada!'
    practiceActive = false
    setStat('total_score', getStat('total_score') + practiceScore)
    incStat('retos_ganados'); checkLogros()
    return
  }
  const n = notas[practiceIdx]
  const noteObj = NOTES.find(x => x.key === n.key)
  hb.innerHTML = `Toca la tecla <strong style="color:#ffe000">${n.key}</strong> — nota <strong style="color:#ffe000">${noteObj?.name ?? n.key}</strong>`
  highlightMiniKey(n.key, 'practice')
}

function highlightMiniKey(key: string, mode: 'practice'|'reto'): void {
  document.querySelectorAll(`#${mode}-piano .key`).forEach(k => k.classList.remove('hint-key'))
  const el = document.getElementById(`${mode}-key-${key}`)
  if (el) el.classList.add('hint-key')
}

// ─────────────────────────────────────────────
// MODO RETO (Piano Tiles)
// ─────────────────────────────────────────────
let retoSong: SongKey = 'mary'
let retoScore  = 0
let retoCombo  = 1
let retoLives  = 3
let retoActive = false
let retoTiles: { key: string; el: HTMLElement; caught: boolean }[] = []

const TILE_COLORS: Record<string, string> = {
  A:'#e74c3c', S:'#e67e22', D:'#f1c40f', F:'#2ecc71',
  G:'#1abc9c', H:'#3498db', J:'#9b59b6', K:'#e91e63',
  L:'#ff5722', Ñ:'#607d8b', W:'#c0392b', E:'#d35400',
  T:'#27ae60', Y:'#16a085', U:'#2980b9', O:'#8e44ad', P:'#ad1457'
}

function prepareReto(key: SongKey): void { retoSong = key }

function startReto(): void {
  retoScore = 0; retoCombo = 1; retoLives = 3
  retoActive = true; retoTiles = []

  const overlay = document.getElementById('tiles-overlay')
  if (overlay) overlay.style.display = 'none'
  updateRetoUI()

  const arena = document.getElementById('tiles-arena')
  if (!arena) return
  arena.querySelectorAll('.tile-block').forEach(t => t.remove())

  const arenaW = arena.clientWidth
  // Columnas basadas en las teclas blancas
  const colW   = arenaW / WHITE_NOTES.length
  const FALL_MS = 2200
  const notes = [...SONGS[retoSong].notas]

  function dropNext(): void {
    if (!retoActive || !notes.length) return
    const n = notes.shift()!
    const wIdx = WHITE_NOTES.findIndex(w => w.key === n.key)
    // Si es tecla negra, la ponemos entre sus blancas vecinas
    const note = NOTES.find(x => x.key === n.key)!
    let x = 0, w = colW - 4
    if (note.type === 'white' && wIdx >= 0) {
      x = wIdx * colW + 2
    } else {
      // Tecla negra: posición intermedia
      const bIdx = BLACK_AFTER_WHITE[n.key]
      x = bIdx !== undefined ? (bIdx + 0.5) * colW + 2 : 2
      w = colW * 0.7
    }

    const tile = document.createElement('div')
    tile.className = 'tile-block'
    tile.textContent = n.key
    tile.style.cssText = `left:${x}px;width:${w}px;height:46px;
      background:${TILE_COLORS[n.key] ?? '#888'};
      animation-duration:${FALL_MS}ms;`
    if (arena) arena.appendChild(tile)

    const entry = { key: n.key, el: tile, caught: false }
    retoTiles.push(entry)

    setTimeout(() => {
      if (retoActive && !entry.caught) {
        tile.remove()
        retoTiles = retoTiles.filter(t => t !== entry)
        retoLives--; retoCombo = 1
        updateRetoUI()
        if (retoLives <= 0) endReto(false)
      }
    }, FALL_MS)

    if (notes.length) setTimeout(dropNext, 350 + Math.random() * 200)
    else setTimeout(() => { if (retoActive) endReto(true) }, FALL_MS + 400)
  }

  dropNext()
}

function handleRetoKey(key: string, freq: number): void {
  if (!retoActive) return
  playNote(freq)
  const idx = retoTiles.findIndex(t => t.key === key && !t.caught)
  if (idx >= 0) {
    const t = retoTiles[idx]
    t.caught = true
    t.el.style.background = '#27ae60'
    t.el.style.opacity = '0'
    t.el.style.transition = 'opacity 0.15s'
    setTimeout(() => t.el.remove(), 150)
    retoTiles.splice(idx, 1)
    retoScore += 100 * retoCombo
    retoCombo  = Math.min(retoCombo + 1, 8)
    setStat('total_score', getStat('total_score') + 100)
    incStat('notes_played'); checkLogros()
  } else {
    retoCombo = 1
  }
  updateRetoUI()
}

function updateRetoUI(): void {
  const s = document.getElementById('reto-score'); if (s) s.textContent = retoScore.toString()
  const c = document.getElementById('reto-combo'); if (c) c.textContent = `x${retoCombo}`
  const l = document.getElementById('reto-lives'); if (l) l.textContent = '❤️'.repeat(Math.max(0, retoLives))
}

function endReto(win: boolean): void {
  retoActive = false
  const overlay = document.getElementById('tiles-overlay')
  if (!overlay) return
  overlay.style.display = 'flex'
  const label = win ? `🎉 ¡Reto completado! ${retoScore} pts` : `💀 Game Over — ${retoScore} pts`
  overlay.innerHTML = `
    <div style="font-size:22px;font-weight:700;margin-bottom:16px;text-align:center">${label}</div>
    <button class="pill-btn" onclick="startReto()">▶ Jugar de nuevo</button>
  `
  if (win) { incStat('retos_ganados'); checkLogros() }
}

// ─────────────────────────────────────────────
// HELPERS UI
// ─────────────────────────────────────────────
function showNoteLabel(name: string): void {
  const el = document.getElementById('note-label')
  if (!el) return
  el.textContent = name; el.style.opacity = '1'
  setTimeout(() => { el.style.opacity = '0' }, 600)
}

function showStatus(msg: string): void {
  const el = document.getElementById('status-bar')
  if (el) el.textContent = msg
}

// ─────────────────────────────────────────────
// EXPONER FUNCIONES AL HTML
// ─────────────────────────────────────────────
declare global { interface Window {
  showScreen:         (id: string) => void
  logout:             () => void
  loadMelodias:       () => void
  loadPuntajes:       () => void
  playMelodia:        (id: string) => void
  deleteMelodia:      (id: string) => void
  selectPracticeSong: (key: SongKey, btn: HTMLElement) => void
  startPractice:      () => void
  resetPractice:      () => void
  prepareReto:        (key: SongKey) => void
  startReto:          () => void
}}

window.showScreen         = showScreen
window.logout             = logout
window.loadMelodias       = loadMelodias
window.loadPuntajes       = loadPuntajes
window.playMelodia        = playMelodia
window.deleteMelodia      = deleteMelodia
window.selectPracticeSong = selectPracticeSong
window.startPractice      = startPractice
window.resetPractice      = resetPractice
window.prepareReto        = prepareReto
window.startReto          = startReto

// ─────────────────────────────────────────────
// TECLADO FÍSICO (solo actúa en pantalla activa)
// ─────────────────────────────────────────────
const pressed = new Set<string>()

window.addEventListener('keydown', e => {
  const k = e.key === 'ñ' ? 'Ñ' : e.key.toUpperCase()
  if (e.repeat || pressed.has(k)) return
  const note = NOTES.find(n => n.key === k)
  if (!note) return
  pressed.add(k)

  const activeScreen = document.querySelector('.screen.active')?.id

  if (activeScreen === 'screen-piano') {
    playNote(note.freq)
    document.getElementById(`key-${k}`)?.classList.add('active')
    showNoteLabel(note.name)
    if (isRecording) recordedNotes.push({ key: note.key, freq: note.freq, time: Date.now() - recordStart })
    incStat('notes_played'); checkLogros()
  }

  if (activeScreen === 'screen-practice' && practiceActive) {
    playNote(note.freq)
    const el = document.getElementById(`practice-key-${k}`)
    if (el) { el.classList.add('active'); setTimeout(() => el.classList.remove('active'), 180) }
    checkPracticeKey(k)
  }

  if (activeScreen === 'screen-reto' && retoActive) {
    handleRetoKey(k, note.freq)
    const el = document.getElementById(`reto-key-${k}`)
    if (el) { el.classList.add('active'); setTimeout(() => el.classList.remove('active'), 120) }
  }
})

window.addEventListener('keyup', e => {
  const k = e.key === 'ñ' ? 'Ñ' : e.key.toUpperCase()
  pressed.delete(k)
  document.getElementById(`key-${k}`)?.classList.remove('active')
})

// ─────────────────────────────────────────────
// BOTONES PIANO PRINCIPAL
// ─────────────────────────────────────────────
document.getElementById('btn-grabar')?.addEventListener('click', () => {
  isRecording ? stopRecording() : startRecording()
})
document.getElementById('btn-reproducir')?.addEventListener('click', () => {
  playRecording(recordedNotes)
})
document.getElementById('btn-guardar')?.addEventListener('click', () => {
  if (!recordedNotes.length) { showStatus('Primero graba algo'); return }
  saveMelodia(recordedNotes)
})
document.getElementById('sound-select')?.addEventListener('change', e => {
  currentSound = (e.target as HTMLSelectElement).value as SoundType
})
document.querySelectorAll('.song-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = (btn as HTMLElement).dataset.song as SongKey
    if (SONGS[key]) playRecording(SONGS[key].notas)
  })
})

// ─────────────────────────────────────────────
// ARRANQUE
// ─────────────────────────────────────────────
loadUser()
buildPiano('piano-keys',    'main')
buildPiano('practice-piano', 'practice')
buildPiano('reto-piano',     'reto')