// Shared rendering for /jam. Runs at build time (from src/data/jam.ts) and in
// the browser (from the Google Sheet), so both produce identical markup.

import { DEFAULT_INSTRUMENTS, INSTRUMENTS, type Instrument, type JamSong } from '../data/jam';
import { songSlug } from '../data/songs';

// Per-song links, keyed by song slug. Built at compile time from the songbook.
export type SongLinks = Record<string, { lyrics?: string; spotify?: string }>;

const GUITAR =
  '<path d="m11.9 12.1 4.51-4.51"/><path d="M20.1 2.3a1 1 0 0 0-1.4 0l-1.11 1.11A2 2 0 0 0 17 4.83v1.34a2 2 0 0 1-.59 1.42A2 2 0 0 1 17.83 7h1.34a2 2 0 0 0 1.42-.59L21.7 5.3a1 1 0 0 0 0-1.4z"/><path d="m6 16 2 2"/><path d="M8.2 9.9C8.7 8.8 9.8 8 11 8c2.8 0 5 2.2 5 5 0 1.2-.8 2.3-1.9 2.8l-.9.4A2 2 0 0 0 12 18a4 4 0 0 1-4 4c-3.3 0-6-2.7-6-6a4 4 0 0 1 4-4 2 2 0 0 0 1.8-1.2z"/>';

// Inline SVG bodies (24x24, stroke-based) for each instrument.
export const ICONS: Record<Instrument, string> = {
  vocal:
    '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v1a7 7 0 0 1-14 0v-1"/><path d="M12 18v4"/><path d="M8 22h8"/>',
  guitar: GUITAR,
  guitar2: GUITAR,
  guitar3: GUITAR,
  // Bass clef: reads as "bass" at a glance and doesn't look like the guitar.
  bass:
    '<path d="M5 9c0-3.4 2.4-5.5 5.3-5.5 3 0 5 2.2 5 5.3 0 5.6-4.6 10.2-11 12.2"/><circle cx="5.6" cy="9" r="2" fill="currentColor" stroke="none"/><circle cx="19.5" cy="6.5" r="1.4" fill="currentColor" stroke="none"/><circle cx="19.5" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
  drums:
    '<path d="m2 2 8 8"/><path d="m22 2-8 8"/><ellipse cx="12" cy="9" rx="10" ry="5"/><path d="M7 13.4v7.9"/><path d="M12 14v8"/><path d="M17 13.4v7.9"/><path d="M2 9v8a10 5 0 0 0 20 0V9"/>',
};

export const icon = (i: Instrument) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[i]}</svg>`;

// One color per person, assigned in alphabetical order so it stays stable
// as long as the people list doesn't change.
const PERSON_COLORS = [
  '#ff8787', '#ffa94d', '#ffe066', '#c0eb75', '#63e6be', '#66d9e8',
  '#74c0fc', '#91a7ff', '#b197fc', '#e599f7', '#faa2c1', '#d8b48a',
];

export function personColors(names: string[]): Record<string, string> {
  const sorted = [...new Set(names)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  return Object.fromEntries(sorted.map((n, i) => [n, PERSON_COLORS[i % PERSON_COLORS.length]]));
}

const OPEN = '?';
const isOpen = (v: string | undefined) => !v || v === OPEN;

export function slotsFor(song: JamSong): Instrument[] {
  if (song.everyone) return [];
  const listed = Object.keys(song.lineup) as Instrument[];
  return (Object.keys(INSTRUMENTS) as Instrument[]).filter(
    (i) => DEFAULT_INSTRUMENTS.includes(i) || listed.includes(i)
  );
}

const openCount = (song: JamSong) => slotsFor(song).filter((i) => isOpen(song.lineup[i])).length;

export function allNames(songs: JamSong[], people: string[]): string[] {
  const names = new Set(people);
  for (const s of songs) for (const p of Object.values(s.lineup)) if (!isOpen(p)) names.add(p!);
  return [...names];
}

export function stats(songs: JamSong[], people: string[]) {
  return {
    songs: songs.length,
    complete: songs.filter((s) => openCount(s) === 0).length,
    open: songs.reduce((sum, s) => sum + openCount(s), 0),
    people: allNames(songs, people).length,
  };
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const plural = (n: number, one: string, many: string) => `${n === 1 ? one : many}`;

export function renderStats(songs: JamSong[], people: string[]): string {
  const s = stats(songs, people);
  return [
    `<span><strong>${s.songs}</strong> ${plural(s.songs, 'música', 'músicas')}</span>`,
    `<span><strong>${s.complete}</strong> ${plural(s.complete, 'completa', 'completas')}</span>`,
    `<span><strong>${s.open}</strong> ${plural(s.open, 'vaga aberta', 'vagas abertas')}</span>`,
    `<span><strong>${s.people}</strong> pessoas</span>`,
  ].join('');
}

export function renderSetlist(songs: JamSong[], people: string[], links: SongLinks): string {
  const colors = personColors(allNames(songs, people));
  return songs
    .map((song, i) => {
      const slug = songSlug(song);
      const link = links[slug] ?? {};
      const spotify =
        link.spotify ?? `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
      const open = openCount(song);
      const title = link.lyrics
        ? `<a class="title" href="${esc(link.lyrics)}">${esc(song.title)}</a>`
        : `<span class="title">${esc(song.title)}</span>`;
      const status = song.everyone ? 'Todo mundo' : open === 0 ? 'Completa' : `Faltam ${open}`;

      const slots = slotsFor(song)
        .map((instrument) => {
          const raw = song.lineup[instrument];
          const player = isOpen(raw) ? undefined : raw!;
          const label = INSTRUMENTS[instrument].label;
          const style = `--c: ${INSTRUMENTS[instrument].color};${player ? ` --p: ${colors[player]};` : ''}`;
          return `<li class="slot${player ? '' : ' open'}" style="${style}"${
            player ? ` data-person="${esc(player)}"` : ''
          } title="${esc(`${label}: ${player ?? 'vaga aberta'}`)}">
            <span class="slot-icon">${icon(instrument)}</span>
            <span class="slot-text">
              <span class="slot-label">${esc(label)}</span>
              <span class="slot-player">${esc(player ?? 'Vaga')}</span>
            </span>
          </li>`;
        })
        .join('');

      return `<li class="song${open === 0 ? ' full' : ''}">
        <div class="song-head">
          ${
            link.lyrics
              ? `<a class="num hard-sm" href="${esc(link.lyrics)}" aria-label="${esc(`Ver letra de ${song.title}`)}">${i + 1}</a>`
              : `<span class="num hard-sm">${i + 1}</span>`
          }
          <span class="info">
            ${title}
            <span class="artist">${esc(song.artist)} · <a href="${esc(spotify)}" target="_blank" rel="noopener noreferrer">ouvir</a></span>
            ${song.note ? `<span class="note">${esc(song.note)}</span>` : ''}
          </span>
          <span class="status badge hard-sm${open === 0 ? ' ok' : ''}">${status}</span>
        </div>
        ${song.everyone ? '<p class="everyone">Todo mundo junto, no final</p>' : ''}
        ${slots ? `<ul class="slots">${slots}</ul>` : ''}
      </li>`;
    })
    .join('');
}

export function renderRoster(songs: JamSong[], people: string[]): string {
  const names = allNames(songs, people);
  const colors = personColors(names);
  const parts = new Map<string, { song: string; instrument: Instrument }[]>(names.map((n) => [n, []]));
  for (const song of songs) {
    for (const instrument of slotsFor(song)) {
      const p = song.lineup[instrument];
      if (!isOpen(p)) parts.get(p!)!.push({ song: song.title, instrument });
    }
  }
  return [...parts.entries()]
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], 'pt-BR'))
    .map(([name, list]) => {
      if (list.length === 0) {
        return `<li class="person hard-sm idle"><span class="person-name">${esc(name)}</span><span class="person-empty">Ainda sem música</span></li>`;
      }
      const items = list
        .map(
          (p) =>
            `<li style="--c: ${INSTRUMENTS[p.instrument].color};"><span class="part-icon">${icon(p.instrument)}</span>${esc(p.song)}</li>`
        )
        .join('');
      return `<li class="person hard-sm" style="--p: ${colors[name]};" data-person="${esc(name)}" role="button" tabindex="0" aria-pressed="false">
        <span class="person-name"><span class="person-dot"></span>${esc(name)}<span class="person-count">${list.length}</span></span>
        <ul class="parts">${items}</ul>
      </li>`;
    })
    .join('');
}

// --- Google Sheet ---------------------------------------------------------

// Minimal RFC 4180 CSV parser (handles quotes, escaped quotes, newlines).
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += ch;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

const norm = (s: string) => s.trim().toLowerCase();

// Sheet layout: one row per song. Columns are matched by header name:
// Música, Artista, one column per instrument label (Voz, Guitarra, ...),
// Nota, and a separate Pessoas column listing everyone who's coming.
// A "?" in an instrument cell shows an open spot even for optional
// instruments (Guitarra 2, Guitarra 3). "Todo mundo" in Nota marks a
// whole-group song.
export function fromSheet(csv: string): { songs: JamSong[]; people: string[] } {
  const [header = [], ...rows] = parseCsv(csv);
  const col = (name: string) => header.findIndex((h) => norm(h) === norm(name));
  const titleCol = col('Música');
  const artistCol = col('Artista');
  const noteCol = col('Nota');
  const peopleCol = col('Pessoas');
  const instrumentCols = (Object.keys(INSTRUMENTS) as Instrument[])
    .map((i) => [i, col(INSTRUMENTS[i].label)] as const)
    .filter(([, c]) => c >= 0);

  if (titleCol < 0) throw new Error('Planilha sem coluna "Música"');

  const songs: JamSong[] = [];
  const people: string[] = [];
  for (const r of rows) {
    const cell = (c: number) => (c >= 0 ? (r[c] ?? '').trim() : '');
    if (cell(peopleCol)) people.push(cell(peopleCol));
    const title = cell(titleCol);
    if (!title) continue;
    const note = cell(noteCol);
    const everyone = norm(note) === 'todo mundo';
    const lineup: JamSong['lineup'] = {};
    for (const [instrument, c] of instrumentCols) if (cell(c)) lineup[instrument] = cell(c);
    songs.push({
      title,
      artist: cell(artistCol),
      lineup,
      note: everyone ? undefined : note || undefined,
      everyone: everyone || undefined,
    });
  }
  return { songs, people };
}
