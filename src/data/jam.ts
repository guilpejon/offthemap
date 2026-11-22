// Jam session lineup: who plays what on which song.
//
// The live source is the Google Sheet below: /jam fetches it in the browser
// on every visit, so edits there show up without a deploy. The `setlist` and
// `people` here are the fallback, rendered at build time and shown if the
// sheet can't be reached (offline, sharing turned off...).
// Leave an instrument out and the page shows it as an open spot, grayed out.

export const SHEET_ID = '1kRcxAhW5S9aT0vGmWeDV2WqeuKEXcFCs458tj05fPJU';
export const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit`;
export const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1`;

export type Instrument = 'vocal' | 'vocal2' | 'guitar' | 'guitar2' | 'guitar3' | 'bass' | 'drums';

export const INSTRUMENTS: Record<Instrument, { label: string; color: string }> = {
  vocal: { label: 'Voz', color: 'var(--pink)' },
  vocal2: { label: 'Voz 2', color: 'var(--pink)' },
  guitar: { label: 'Guitarra', color: 'var(--periwinkle)' },
  guitar2: { label: 'Guitarra 2', color: 'var(--periwinkle)' },
  guitar3: { label: 'Guitarra 3', color: 'var(--periwinkle)' },
  bass: { label: 'Baixo', color: 'var(--lime)' },
  drums: { label: 'Bateria', color: 'var(--sky)' },
};

// Every song shows at least these slots. A song can add more (vocal2, guitar2, guitar3)
// just by listing them in its lineup.
export const DEFAULT_INSTRUMENTS: Instrument[] = ['vocal', 'guitar', 'bass', 'drums'];

export type JamSong = {
  title: string;
  artist: string;
  lineup: Partial<Record<Instrument, string>>;
  note?: string;
  // Whole-group song: no fixed slots, everyone jumps in.
  everyone?: boolean;
};

export const jam = {
  title: 'Jam OFTM and Friends',
  date: '2026-12-12',
  time: '14h',
  place: 'Green View Studio',
};

// Everyone confirmed in the group, so the page can show who's still
// without a song.
export const people: string[] = [
  'Augusto',
  'Felipe',
  'Gui',
  'Cabeça',
  'João',
  'Murilo',
  'Neo',
  'Rafael',
  'Victor',
  'Vini',
  'Zero',
];

export const setlist: JamSong[] = [
  {
    title: 'Meu Erro',
    artist: 'Os Paralamas do Sucesso',
    lineup: { vocal: 'Gui', guitar: 'Murilo', bass: 'Neo', drums: 'Felipe' },
  },
  {
    title: 'Substitute',
    artist: 'Ramones',
    lineup: { guitar: 'Murilo', bass: 'Neo' },
    note: 'Falta batera e vocal',
  },
  {
    title: 'Rotina',
    artist: 'Inocentes',
    lineup: { guitar: 'Murilo', bass: 'Neo' },
    note: 'Falta batera e vocal. Zero topou estudar',
  },
  // Same lineup as the July 2026 jam (minus Bruno).
  {
    title: 'Times Like These',
    artist: 'Foo Fighters',
    lineup: { guitar: 'Zero' },
  },
  {
    title: 'My Hero',
    artist: 'Foo Fighters',
    lineup: { guitar: 'Zero', guitar2: 'Neo' },
  },
  {
    title: 'Everlong',
    artist: 'Foo Fighters',
    lineup: { guitar: 'Zero', guitar2: 'Neo', guitar3: 'Victor' },
  },
  {
    title: 'Só Por Uma Noite',
    artist: 'Charlie Brown Jr.',
    lineup: { guitar: 'Zero' },
  },
  {
    title: 'Zóio de Lula',
    artist: 'Charlie Brown Jr.',
    lineup: { drums: 'Zero' },
  },
  {
    title: 'All the Small Things',
    artist: 'Blink-182',
    lineup: { guitar: 'Zero', guitar2: 'Murilo' },
  },
  {
    title: 'Alive',
    artist: 'Pearl Jam',
    lineup: { guitar: 'Neo' },
  },
  {
    title: 'Like a Stone',
    artist: 'Audioslave',
    lineup: { guitar: 'Victor', bass: 'Rafael' },
  },
  {
    title: 'Heart-Shaped Box',
    artist: 'Nirvana',
    lineup: { guitar: 'Victor' },
  },
  {
    title: 'In Bloom',
    artist: 'Nirvana',
    lineup: { vocal: 'Gui', guitar: 'Victor', bass: 'Rafael' },
  },
  {
    title: 'Black',
    artist: 'Pearl Jam',
    lineup: {},
  },
  {
    title: 'Californication',
    artist: 'Red Hot Chili Peppers',
    lineup: {},
  },
  {
    title: "Don't Bust My Chops",
    artist: 'Ramones',
    lineup: { vocal: 'Augusto', guitar: 'Murilo' },
  },
  {
    title: '21st Century (Digital Boy)',
    artist: 'Bad Religion',
    lineup: { vocal: 'Augusto', guitar: 'Murilo' },
  },
  {
    title: 'Killing in the Name',
    artist: 'Rage Against the Machine',
    lineup: { guitar: 'Cabeça', bass: 'Rafael', drums: 'Vini' },
  },
  {
    title: 'Fluorescent Adolescent',
    artist: 'Arctic Monkeys',
    lineup: { bass: 'Rafael' },
  },
  {
    title: 'Come Together',
    artist: 'The Beatles',
    lineup: {},
    everyone: true,
  },
];
