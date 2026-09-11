# Off The Map

The band's setlist site — every song we currently rehearse, grouped by rehearsal set (Ensaio 1, 2, 3), with lengths and Spotify links.

Live at: https://guilpejon.github.io/offthemap

## Editing the setlist

All song data lives in [`src/data/songs.ts`](src/data/songs.ts) — add, remove, or reorder songs there and the site updates automatically.

## Local development

```sh
npm install
npm run dev
```

Pushing to `main` automatically rebuilds and deploys the site via GitHub Actions.
