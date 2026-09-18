import popularityData from './spotify-popularity.json' with { type: 'json' };

export type Song = {
  title: string;
  artist: string;
  length: string; // mm:ss
  bpm: number;
  key: string; // Camelot notation, e.g. "8A"
};

export type Section = {
  id: string;
  title: string;
  subtitle: string;
  accent: 'pink' | 'periwinkle' | 'lime' | 'sky';
  songs: Song[];
};

type PopularityEntry = { url: string };
const popularityMap = popularityData as Record<string, PopularityEntry>;

function spotifySearchUrl(title: string, artist: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`;
}

export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function songSlug(song: Pick<Song, 'title' | 'artist'>): string {
  return slugify(`${song.artist}-${song.title}`);
}

export function toSeconds(length: string): number {
  const [min, sec] = length.split(':').map(Number);
  return min * 60 + sec;
}

// Camelot key (e.g. "8A") to a sortable number: wheel position first, A before B.
export function keySortValue(key: string): number {
  const match = key.match(/^(\d+)([AB])$/);
  if (!match) return 0;
  const [, num, letter] = match;
  return Number(num) * 2 + (letter === 'A' ? 0 : 1);
}

const CAMELOT_KEY_NAMES: Record<string, string> = {
  '1A': 'Ab minor',
  '1B': 'B major',
  '2A': 'Eb minor',
  '2B': 'F# major',
  '3A': 'Bb minor',
  '3B': 'Db major',
  '4A': 'F minor',
  '4B': 'Ab major',
  '5A': 'C minor',
  '5B': 'Eb major',
  '6A': 'G minor',
  '6B': 'Bb major',
  '7A': 'D minor',
  '7B': 'F major',
  '8A': 'A minor',
  '8B': 'C major',
  '9A': 'E minor',
  '9B': 'G major',
  '10A': 'B minor',
  '10B': 'D major',
  '11A': 'F# minor',
  '11B': 'A major',
  '12A': 'Db minor',
  '12B': 'E major',
};

// e.g. "F# minor (11A)"
export function keyName(key: string): string {
  const name = CAMELOT_KEY_NAMES[key];
  return name ? `${name} (${key})` : key;
}

export function totalLength(songs: Song[]): string {
  const totalSeconds = songs.reduce((sum, s) => sum + toSeconds(s.length), 0);
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${min}min ${sec}s`;
}

export function spotifyLink(song: Song): string {
  return popularityMap[songSlug(song)]?.url ?? spotifySearchUrl(song.title, song.artist);
}

export function allSongs(): Song[] {
  return sections.flatMap((s) => s.songs);
}

export function uniqueSongs(): Song[] {
  const seen = new Set<string>();
  const result: Song[] = [];
  for (const song of allSongs()) {
    const key = songSlug(song);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(song);
    }
  }
  return result.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
}

export function artistCounts(): { artist: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const song of allSongs()) {
    counts.set(song.artist, (counts.get(song.artist) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([artist, count]) => ({ artist, count }))
    .sort((a, b) => b.count - a.count);
}

// Bands with more than one song get their own bar; everyone else gets
// bundled into a single "Outras bandas" bar, always placed last.
export function artistChartData(): { artist: string; count: number }[] {
  const counts = artistCounts();
  const main = counts.filter((c) => c.count > 1);
  const rest = counts.filter((c) => c.count === 1);
  const restTotal = rest.reduce((sum, c) => sum + c.count, 0);
  const result = [...main];
  if (rest.length > 0) {
    result.push({ artist: `Outras bandas (${rest.length})`, count: restTotal });
  }
  return result;
}

export function totalRuntimeLabel(): string {
  const totalSeconds = allSongs().reduce((sum, s) => sum + toSeconds(s.length), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}min` : `${minutes}min`;
}

export const sections: Section[] = [
  {
    id: 'ensaio-1',
    title: 'Ensaio 1',
    subtitle: 'Aquele em que todo mundo chega transpirando e a gente toca RHCP e Foo Fighters até as mãos caírem.',
    accent: 'pink',
    songs: [
      { title: 'Californication', artist: 'Red Hot Chili Peppers', length: '5:21', bpm: 97, key: '8A' },
      { title: 'Universally Speaking', artist: 'Red Hot Chili Peppers', length: '4:21', bpm: 117, key: '10B' },
      { title: 'Easily', artist: 'Red Hot Chili Peppers', length: '4:15', bpm: 124, key: '8A' },
      { title: 'Otherside', artist: 'Red Hot Chili Peppers', length: '4:15', bpm: 123, key: '8A' },
      { title: 'Scar Tissue', artist: 'Red Hot Chili Peppers', length: '3:37', bpm: 89, key: '7A' },
      { title: 'The Zephyr Song', artist: 'Red Hot Chili Peppers', length: '4:05', bpm: 117, key: '10B' },
      { title: 'By the Way', artist: 'Red Hot Chili Peppers', length: '3:37', bpm: 123, key: '8A' },
      { title: 'Suck My Kiss', artist: 'Red Hot Chili Peppers', length: '3:23', bpm: 102, key: '7A' },
      { title: 'Soul to Squeeze', artist: 'Red Hot Chili Peppers', length: '4:52', bpm: 88, key: '7B' },
      { title: 'Dani California', artist: 'Red Hot Chili Peppers', length: '4:41', bpm: 96, key: '10B' },
      { title: "Can't Stop", artist: 'Red Hot Chili Peppers', length: '4:29', bpm: 183, key: '9A' },
      { title: 'Subterranean Homesick Blues', artist: 'Red Hot Chili Peppers', length: '2:32', bpm: 110, key: '8A' },
      { title: "Don't Forget Me", artist: 'Red Hot Chili Peppers', length: '4:35', bpm: 124, key: '8A' },
      { title: 'Under the Bridge', artist: 'Red Hot Chili Peppers', length: '4:24', bpm: 83, key: '12B' },
      { title: 'Minor Thing', artist: 'Red Hot Chili Peppers', length: '3:01', bpm: 122, key: '11A' },
      { title: 'Times Like These', artist: 'Foo Fighters', length: '4:38', bpm: 145, key: '9B' },
      { title: 'Learn to Fly', artist: 'Foo Fighters', length: '3:54', bpm: 136, key: '1B' },
      { title: 'These Days', artist: 'Foo Fighters', length: '5:26', bpm: 136, key: '1B' },
      { title: 'Rescued', artist: 'Foo Fighters', length: '3:26', bpm: 151, key: '12B' },
      { title: 'Dear Rosemary', artist: 'Foo Fighters', length: '3:57', bpm: 124, key: '10A' },
      { title: 'Arlandria', artist: 'Foo Fighters', length: '4:20', bpm: 141, key: '12B' },
      { title: 'Everlong', artist: 'Foo Fighters', length: '4:10', bpm: 158, key: '10B' },
      { title: 'Rope', artist: 'Foo Fighters', length: '4:19', bpm: 139, key: '10B' },
      { title: 'My Hero', artist: 'Foo Fighters', length: '4:20', bpm: 154, key: '12B' },
    ],
  },
  {
    id: 'ensaio-2',
    title: 'Ensaio 2',
    subtitle: 'Indie, post-punk, um pouco de grunge e uns clássicos brasileiros de respeito pra ninguém sentir saudade de casa.',
    accent: 'periwinkle',
    songs: [
      { title: 'Last Nite', artist: 'The Strokes', length: '3:17', bpm: 208, key: '8B' },
      { title: 'You Only Live Once', artist: 'The Strokes', length: '3:54', bpm: 121, key: '1B' },
      { title: 'Nice to Know You', artist: 'Incubus', length: '3:23', bpm: 154, key: '11A' },
      { title: 'Fake Tales of San Francisco', artist: 'Arctic Monkeys', length: '2:22', bpm: 129, key: '10A' },
      { title: 'Fluorescent Adolescent', artist: 'Arctic Monkeys', length: '3:09', bpm: 112, key: '12A' },
      { title: 'R U Mine?', artist: 'Arctic Monkeys', length: '3:24', bpm: 97, key: '11A' },
      { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', length: '4:32', bpm: 85, key: '6A' },
      { title: 'American Idiot', artist: 'Green Day', length: '2:54', bpm: 186, key: '4B' },
      { title: 'Take Me Out', artist: 'Franz Ferdinand', length: '3:57', bpm: 113, key: '9A' },
      { title: 'Valerie', artist: 'The Zutons', length: '3:41', bpm: 83, key: '6B' },
      { title: 'Come Together', artist: 'The Beatles', length: '4:19', bpm: 83, key: '7A' },
      { title: 'Plush', artist: 'Stone Temple Pilots', length: '5:13', bpm: 101, key: '6A' },
      { title: 'O Calibre', artist: 'Os Paralamas do Sucesso', length: '3:22', bpm: 90, key: '12B' },
      { title: 'Meu Erro', artist: 'Os Paralamas do Sucesso', length: '3:28', bpm: 208, key: '11B' },
      { title: 'Perfeição', artist: 'Legião Urbana', length: '4:36', bpm: 100, key: '8B' },
      { title: 'O Tempo Não Pára', artist: 'Cazuza', length: '4:37', bpm: 77, key: '9B' },
      { title: 'Fire', artist: 'The Jimi Hendrix Experience', length: '2:34', bpm: 155, key: '7A' },
      { title: 'Alive', artist: 'Pearl Jam', length: '5:41', bpm: 99, key: '1B' },
      { title: 'Black', artist: 'Pearl Jam', length: '5:43', bpm: 86, key: '9A' },
      { title: 'Anna Molly', artist: 'Incubus', length: '3:46', bpm: 152, key: '5A' },
    ],
  },
  {
    id: 'ensaio-3',
    title: 'Ensaio 3',
    subtitle: 'Afinações alternativas — drop tunings, capotraste pra todo lado, e todo mundo fingindo que lembrou de afinar de novo.',
    accent: 'lime',
    songs: [
      { title: 'Somebody Told Me', artist: 'The Killers', length: '3:17', bpm: 138, key: '3A' },
      { title: 'Mr. Brightside', artist: 'The Killers', length: '3:42', bpm: 148, key: '3B' },
      { title: 'Sex on Fire', artist: 'Kings of Leon', length: '3:23', bpm: 153, key: '12B' },
      { title: 'Use Somebody', artist: 'Kings of Leon', length: '3:52', bpm: 137, key: '8B' },
      { title: 'Like a Stone', artist: 'Audioslave', length: '4:53', bpm: 108, key: '6A' },
      { title: 'I Am the Highway', artist: 'Audioslave', length: '5:22', bpm: 87, key: '8B' },
      { title: 'Só Por Uma Noite', artist: 'Charlie Brown Jr.', length: '3:23', bpm: 109, key: '12B' },
      { title: 'Papo Reto', artist: 'Charlie Brown Jr.', length: '3:28', bpm: 101, key: '2B' },
      { title: 'Zóio de Lula', artist: 'Charlie Brown Jr.', length: '4:12', bpm: 76, key: '12A' },
      { title: 'Lugar ao Sol', artist: 'Charlie Brown Jr.', length: '3:31', bpm: 143, key: '6B' },
      { title: 'Song 2', artist: 'Blur', length: '2:02', bpm: 130, key: '5A' },
      { title: 'Nice to Know You', artist: 'Incubus', length: '3:23', bpm: 154, key: '11A' },
      { title: 'No One Knows', artist: 'Queens of the Stone Age', length: '4:14', bpm: 169, key: '8B' },
      { title: 'Aerials', artist: 'System of a Down', length: '4:01', bpm: 161, key: '5A' },
      { title: 'Heart-Shaped Box', artist: 'Nirvana', length: '4:41', bpm: 101, key: '1A' },
      { title: 'Sunday Bloody Sunday', artist: 'U2', length: '4:39', bpm: 201, key: '3B' },
      { title: 'Are You Gonna Be My Girl', artist: 'Jet', length: '3:32', bpm: 210, key: '11B' },
      { title: "Ain't No Rest for the Wicked", artist: 'Cage the Elephant', length: '3:07', bpm: 159, key: '9B' },
      { title: 'Notion', artist: 'The Rare Occasions', length: '2:52', bpm: 159, key: '11B' },
      { title: 'Creep', artist: 'Radiohead', length: '3:56', bpm: 92, key: '9B' },
      { title: 'Killing in the Name', artist: 'Rage Against the Machine', length: '5:14', bpm: 129, key: '10B' },
    ],
  },
];
