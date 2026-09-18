// Each song's lyrics live in its own plain-text file under ./lyrics/<slug>.txt
// (real line breaks, easy to open and edit) rather than as a giant one-line
// string here. A handful retain minor PDF layout
// artifacts where two text columns overlapped — see slugs
// red-hot-chili-peppers-dani-california,
// red-hot-chili-peppers-subterranean-homesick-blues,
// arctic-monkeys-do-i-wanna-know, pearl-jam-alive,
// cage-the-elephant-ain-t-no-rest-for-the-wicked.
const files = import.meta.glob('./lyrics/*.txt', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

export const lyrics: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, content]) => {
    const slug = path.replace('./lyrics/', '').replace(/\.txt$/, '');
    return [slug, content.replace(/\n$/, '')];
  })
);
