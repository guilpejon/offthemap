export type Song = {
  title: string;
  artist: string;
  length: string; // mm:ss
};

export type Section = {
  id: string;
  title: string;
  subtitle: string;
  accent: 'pink' | 'periwinkle' | 'lime' | 'sky';
  songs: Song[];
};

function spotifySearchUrl(title: string, artist: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(`${title} ${artist}`)}`;
}

export function toSeconds(length: string): number {
  const [min, sec] = length.split(':').map(Number);
  return min * 60 + sec;
}

export function totalLength(songs: Song[]): string {
  const totalSeconds = songs.reduce((sum, s) => sum + toSeconds(s.length), 0);
  const min = Math.floor(totalSeconds / 60);
  const sec = totalSeconds % 60;
  return `${min}min ${sec}s`;
}

export function spotifyLink(song: Song): string {
  return spotifySearchUrl(song.title, song.artist);
}

export const sections: Section[] = [
  {
    id: 'ensaio-1',
    title: 'Ensaio 1',
    subtitle: 'The one where everyone shows up sweaty and we play RHCP and Foo Fighters until our hands fall off.',
    accent: 'pink',
    songs: [
      { title: 'Californication', artist: 'Red Hot Chili Peppers', length: '5:21' },
      { title: 'Universally Speaking', artist: 'Red Hot Chili Peppers', length: '4:21' },
      { title: 'Easily', artist: 'Red Hot Chili Peppers', length: '4:15' },
      { title: 'Otherside', artist: 'Red Hot Chili Peppers', length: '4:15' },
      { title: 'Scar Tissue', artist: 'Red Hot Chili Peppers', length: '3:37' },
      { title: 'The Zephyr Song', artist: 'Red Hot Chili Peppers', length: '4:05' },
      { title: 'By the Way', artist: 'Red Hot Chili Peppers', length: '3:37' },
      { title: 'Suck My Kiss', artist: 'Red Hot Chili Peppers', length: '3:23' },
      { title: 'Soul to Squeeze', artist: 'Red Hot Chili Peppers', length: '4:52' },
      { title: 'Dani California', artist: 'Red Hot Chili Peppers', length: '4:41' },
      { title: "Can't Stop", artist: 'Red Hot Chili Peppers', length: '4:29' },
      { title: 'Subterranean Homesick Blues', artist: 'Red Hot Chili Peppers', length: '2:32' },
      { title: "Don't Forget Me", artist: 'Red Hot Chili Peppers', length: '4:35' },
      { title: 'Under the Bridge', artist: 'Red Hot Chili Peppers', length: '4:24' },
      { title: 'Times Like These', artist: 'Foo Fighters', length: '4:38' },
      { title: 'Learn to Fly', artist: 'Foo Fighters', length: '3:54' },
      { title: 'These Days', artist: 'Foo Fighters', length: '5:26' },
      { title: 'Rescued', artist: 'Foo Fighters', length: '3:26' },
      { title: 'Dear Rosemary', artist: 'Foo Fighters', length: '3:57' },
      { title: 'Arlandria', artist: 'Foo Fighters', length: '4:20' },
      { title: 'Everlong', artist: 'Foo Fighters', length: '4:10' },
      { title: 'Rope', artist: 'Foo Fighters', length: '4:19' },
    ],
  },
  {
    id: 'ensaio-2',
    title: 'Ensaio 2',
    subtitle: "Indie, post-punk, a bit of grunge, and some proper Brazilian classics thrown in so nobody's homesick.",
    accent: 'periwinkle',
    songs: [
      { title: 'Last Nite', artist: 'The Strokes', length: '3:17' },
      { title: 'You Only Live Once', artist: 'The Strokes', length: '3:54' },
      { title: 'Nice to Know You', artist: 'Incubus', length: '3:23' },
      { title: 'Fake Tales of San Francisco', artist: 'Arctic Monkeys', length: '2:22' },
      { title: 'Fluorescent Adolescent', artist: 'Arctic Monkeys', length: '3:09' },
      { title: 'R U Mine?', artist: 'Arctic Monkeys', length: '3:24' },
      { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', length: '4:32' },
      { title: 'American Idiot', artist: 'Green Day', length: '2:54' },
      { title: 'Take Me Out', artist: 'Franz Ferdinand', length: '3:57' },
      { title: 'Valerie', artist: 'The Zutons', length: '3:41' },
      { title: 'Come Together', artist: 'The Beatles', length: '4:19' },
      { title: 'Plush', artist: 'Stone Temple Pilots', length: '5:13' },
      { title: 'O Calibre', artist: 'Os Paralamas do Sucesso', length: '3:22' },
      { title: 'Meu Erro', artist: 'Os Paralamas do Sucesso', length: '3:28' },
      { title: 'Perfeição', artist: 'Legião Urbana', length: '4:36' },
      { title: 'O Tempo Não Pára', artist: 'Cazuza', length: '4:37' },
      { title: 'Fire', artist: 'The Jimi Hendrix Experience', length: '2:34' },
      { title: 'Alive', artist: 'Pearl Jam', length: '5:41' },
      { title: 'Black', artist: 'Pearl Jam', length: '5:43' },
      { title: 'Anna Molly', artist: 'Incubus', length: '3:46' },
      { title: 'Echo', artist: 'Incubus', length: '3:34' },
    ],
  },
  {
    id: 'ensaio-3',
    title: 'Ensaio 3',
    subtitle: 'Afinações alternativas — drop tunings, capos everywhere, and everyone pretending they remembered to retune.',
    accent: 'lime',
    songs: [
      { title: 'Somebody Told Me', artist: 'The Killers', length: '3:17' },
      { title: 'Mr. Brightside', artist: 'The Killers', length: '3:42' },
      { title: 'Sex on Fire', artist: 'Kings of Leon', length: '3:23' },
      { title: 'Use Somebody', artist: 'Kings of Leon', length: '3:52' },
      { title: 'Like a Stone', artist: 'Audioslave', length: '4:53' },
      { title: 'I Am the Highway', artist: 'Audioslave', length: '5:22' },
      { title: 'Só Por Uma Noite', artist: 'Charlie Brown Jr.', length: '3:23' },
      { title: 'Papo Reto', artist: 'Charlie Brown Jr.', length: '3:28' },
      { title: 'Zóio de Lula', artist: 'Charlie Brown Jr.', length: '4:12' },
      { title: 'Lugar ao Sol', artist: 'Charlie Brown Jr.', length: '3:31' },
      { title: 'Song 2', artist: 'Blur', length: '2:02' },
      { title: 'Nice to Know You', artist: 'Incubus', length: '3:23' },
      { title: 'No One Knows', artist: 'Queens of the Stone Age', length: '4:14' },
      { title: 'Aerials', artist: 'System of a Down', length: '4:01' },
      { title: 'Heart-Shaped Box', artist: 'Nirvana', length: '4:41' },
      { title: 'Sunday Bloody Sunday', artist: 'U2', length: '4:39' },
      { title: 'Are You Gonna Be My Girl', artist: 'Jet', length: '3:32' },
      { title: "Ain't No Rest for the Wicked", artist: 'Cage the Elephant', length: '3:07' },
      { title: 'Notion', artist: 'The Rare Occasions', length: '2:52' },
      { title: 'Creep', artist: 'Radiohead', length: '3:56' },
      { title: 'Killing in the Name', artist: 'Rage Against the Machine', length: '5:14' },
    ],
  },
];
