# Landing copy — EN (source of truth)

Final copy, validated 2026-07-30 from "Sonarche Landing v7" (Claude Design).
This deck is the reference: the FR deck (`fr.md`) mirrors it section by section.
Any copy change lands here first, then in `fr.md`, then in the components.

Micro-copy (cards, table rows, chips, captions) completed 2026-07-30 by
extraction from `Sonarche Landing v7.dc.html` — in the app repo, under
`docs/designs/landing/`. The reference mockup is that file only: `v7 - export`
and the 8 MB `Sonarche Landing.html` beside it are stale v6 builds that still
name platforms, and copy must never be read from them.

## Hero

- Badge: `FREE · OPEN SOURCE · OFFLINE`
- Wordmark: `SONARCHE`
- Tagline (BRAND — never reworded): `From the stream into the Ark.`
- Subline: A music library that's truly yours — every track identified by its
  own audio, named in plain files, played on a native engine.
- CTA primary: the download button — see § Download
- CTA secondary: `See how it works ↓`
- Scroll hint: `SCROLL ↓`

## Why it exists

- Kicker: `WHY IT EXISTS`
- Heading: Your music should outlive every app.
- Body, four lines. The italics are the mockup's: three runs, not four — the
  third line carries none, and only the noun of the second is set in the serif.
  - Give it _true names_,
  - a home in _plain files_,
  - and a player worthy of it —
  - _forever, offline, yours_.
- Chips: `plain files` · `no cloud` · `no account` · `no re-encode`

## The flow

- Kicker: `THE FLOW`
- Heading: A link goes in. A library comes out.
- Sub: Four moves, one uninterrupted pipeline — and nothing to click after the
  first paste.

### Step 01 — Paste a link

A track, an album, a whole playlist. Drop it in the composer and the voyage
lines up — one row per track, before anything is brought in.
Chips: `single track` · `album` · `playlist`
Note: Already in the hold? It's skipped, silently.

### Step 02 — Watch it come aboard

Circles turn green one by one as the native audio is hauled in — untouched,
never re-encoded — and lands in the hold.
Chips: `yt-dlp` · `native audio` · `no re-encode`
Note: Close the window mid-haul — the queue picks up where it stopped.

### Step 03 — Fingerprint & identify

ffmpeg and Chromaprint distill the audio itself into an acoustic fingerprint.
AcoustID answers with exactly which recording this is — no title-guessing
involved.
Chips: `ffmpeg` · `Chromaprint` · `AcoustID`
Note: No confident match? It says so and asks — instead of inventing an artist.

### Step 04 — It gets its name

Title, artist, album, genre, track, year — and the real cover. All of it
written into the file's own tags, and into the folder it now lives in.
Chips: `MusicBrainz` · `cover art` · `genre family`
Note: Into the files themselves — not into a database only Sonarche can read.

## The old way

- Kicker: `THE OLD WAY`
- Heading: You already know the old way.
- Sub: Five tools, four tabs, and a download folder that looks like a crime
  scene. Every step loses something on the way.

### The five links of the chain

Each card: step label — tool — gripe — cost.

1. `TAB 1` — **A converter site** — One link at a time, converted on somebody
   else's server. You wait in a queue, then the browser drops the file wherever
   it feels like. — _Slow, one track, re-encoded._
2. `APP 1` — **A bulk downloader** — Handles the playlist, at least. But it
   fills the tags from the file name — so your artist is « Unknown » and your
   album is blank. — _Tags are a guess._
3. `APP 2` — **A tag editor** — Open every file. Retype the title, the artist,
   the year, the track number. Multiply by 80. — _Hours of typing._
4. `TAB 2` — **An image search** — Hunt for a square cover that isn't a
   watermarked thumbnail, crop it, hope it matches the right pressing. —
   _Wrong artwork forever._
5. `APP 3` — **Your music player** — Move the files in, re-scan the folder,
   then discover three duplicates and one album split in two. — _A messy
   library anyway._

### The punch

- Punch heading: Sonarche does all five. In one window.
- Punch body: Point it at a link and walk away. The audio lands in the hold,
  gets listened to, identified, tagged, given its real cover, filed in the
  right folder — and then it plays, on a native Rust audio engine. No hand-off,
  no re-import, no second app.
- Chips: `one link in` · `no re-encode` · `fingerprint` · `real metadata` ·
  `proper artwork` · `filed folders` · `native playback`

## True names

- Kicker: `TRUE NAMES`
- Heading: It doesn't read the title. It listens to the song.
- Body: Most tools just copy whatever text happened to come with the file.
  That's how you end up with an artist called « Official Audio ». Sonarche
  never guesses: ffmpeg and Chromaprint turn the waveform itself into a
  fingerprint, AcoustID matches that fingerprint to one exact recording, and
  MusicBrainz — twenty years of community-verified discography — hands back
  the real facts.
- Compare labels: `SCRAPED FROM THE PAGE` / _best guess_ —
  `FINGERPRINT → ACOUSTID → MUSICBRAINZ` — `IDENTIFIED BY THE AUDIO` / _verified_

### The comparison, row by row

| Field   | Scraped (best guess)                            | Identified (verified)           |
| ------- | ----------------------------------------------- | ------------------------------- |
| Title   | `Ghost - Mary On A Cross (Official Audio) [HQ]` | Mary on a Cross                 |
| Artist  | unknown — read off the file name                | Ghost                           |
| Album   | —                                               | Seven Inches of Satanic Panic   |
| Year    | 2022 (file date)                                | 2019                            |
| Artwork | embedded thumbnail, 16:9, letterboxed           | official front cover, 1400×1400 |

- Cover line: And the cover comes with it — the real square artwork, not the
  fourth result on Google Images.

## No expertise needed

- Kicker: `NO EXPERTISE NEEDED`
- Heading: You don't need to know what a tag is.
- Body 1: Everything that can be automated already is — you get a tidy library
  without ever opening a metadata editor. What's left, the app explains in
  plain words instead of empty fields.
- Body 2: And when it disagrees with you, you win. Convinced your favourite
  record is Thrash, not Heavy Metal? Change it. One click, no friction — and
  Sonarche tells you exactly what it wrote, into which files, in words you
  don't need a wiki for.
- Guides (3 bullets):
  - Sensible defaults on import — most albums need nothing from you at all.
  - Anything uncertain is flagged in plain language, with the choice spelled out.
  - Every edit tells you which files it touched, before and after.
- Widget: `Genre — Ride the Lightning` · Heavy Metal → Thrash Metal ·
  "What just happened" — Thrash Metal sits under the Metal family, so the
  album stays where it is in your library. The new genre is written into all
  8 files' tags — nothing else changes. · `Genre family: Metal ↳ derived`

## The hold is yours

- Kicker: `THE HOLD IS YOURS`
- Heading: Nothing here is locked. It's only files.
- Body: Everything lands in `Music/Sonarche/` — right beside the folder your
  current app already uses. The names live in the files themselves, in the
  same tag standards every player has read for twenty years. Sonarche
  organises your music and hands it straight back; it never holds it hostage.

### The file tree

```
▾ Music
  ▾ Sonarche
    ▾ Ghost
      ▾ Seven Inches of Satanic Panic (2019)
        ♫ 01 Kiss the Go-Goat.opus
        ♫ 02 Mary on a Cross.opus
        ▣ cover.jpg
  ▸ YourOtherMusicApp
```

- Note: Drag the folder anywhere and it still works.

### Where it goes

- **A phone** — plug it in, drop the folder, done
- **A hard drive** — your backup is a copy-paste
- **Another player** — the tags are standard — it reads them
- **Another machine** — no account, no re-import, no sync service

- Closer: If you decide you don't like Sonarche, your library leaves with you
  — fully tagged.

## Under the deck

- Kicker: `UNDER THE DECK`
- Heading: No magic. Proven tools, conducted well.
- Body: You don't have to care about any of this — but here it is, in plain
  words, because you deserve to know what's running on your machine.

### Three cards

- `THE SHELL` — **Tauri, not a browser tab** — The interface is built with
  modern web tooling, so it can be genuinely nice to look at and to use — but
  it ships as a real desktop app, a few megabytes, not a bundled browser
  eating your RAM.
- `THE ENGINE` — **Rust underneath** — Everything heavy — fetching, file
  writes, audio playback — runs in Rust. That's the difference between a
  player that stutters and one that just starts.
- `THE TOOLBOX` — **A sealed sidecar** — beets and its Python tools live
  inside the app, in their own bundled runtime. Nothing to install, nothing to
  update, and nothing that can clash with whatever is already on your machine.

### Diagram nodes

- The stream — A URL out there — a track, an album, a playlist. (_the open web_)
- Your folders — What you already have — a home port, not just a loading dock.
  Copied in, never moved. (_no network_)
- `EMBEDDED PYTHON · SEALED, SHIPPED WITH THE APP`
- yt-dlp — Hauls the native audio in — no re-encode, ever.
- ffmpeg + Chromaprint — Distills each track into an acoustic fingerprint.
- beets (_the conductor_) — Directs every call, checks every tag, and files
  each track into its right place in the library.
- 📁 /sonarche — After all that — it's just a folder of music. Yours. Open
  it, move it, back it up.

#### The services, grouped by what they answer

- `IDENTIFY`
  - AcoustID — matches the acoustic fingerprint to the exact recording.
  - MusicBrainz — the open encyclopedia: titles, albums, years.
- `DRESS`
  - Cover Art Archive — the covers.
  - Last.fm — the genres.
- `ACCOMPANY`
  - LRCLIB — synced lyrics, the ones that follow the music.
  - lyrics.ovh — backup lyrics, plain text, when LRCLIB has nothing.
- Note under the column: These services are queried on demand, never required.
  You have no account to create and no key to paste: the app introduces itself
  politely and spaces out its calls.

## The deck

- Kicker: `THE DECK`
- Heading: Your library, your rules.
- Body: Albums, artists, genre families — organized by verified metadata,
  browsable like a real collection. Every single field stays editable, and one
  click re-runs the fingerprint if a match was wrong.
- Bullets:
  - Change once — written to every file.
  - Completeness at a glance: 7/7 fields, 100% badges.
  - Genres form families — Metal, Electronic, Jazz — each with its own tone.
- Widget (`Metadata — Oath`): Title `Oath` · Artist `The Algorithm` ·
  Year `2021` · Genre `Progressive Metal` · Genre family `Metal · derived` ·
  buttons `✦ Re-match` and `Edit`.
  (The v7 mockup left this widget's labels in French — these are the EN
  equivalents, to be read over.)

## The ship's sound

- Kicker: `THE SHIP'S SOUND`
- Heading: Not just the harbor — the ship's own sound.
- Body: The last step of the old way was moving files into some other player.
  Sonarche is the player too — a native Rust audio engine, so tracks start on
  the beat and gapless albums stay gapless.
- Player: `Oath` · `The Algorithm` · `1:12` / `2:54`

## The real thing (screenshots)

- Kicker: `THE REAL THING`
- Heading: This is what the deck looks like.
- Counter: `01 / 05`
- Theme toggle: `Light` · `Dark` — group label: Screenshot theme

### The five shots

1. `Album` — **An album, whole** — Fourteen tracks, fourteen complete tag
   sets, the right cover — and it plays from the very same window.
2. `Genres` — **Genres as a tree** — Metal holds Metalcore, Heavy Metal,
   Progressive Metal, Power Metal — and knows it accounts for 32% of the
   shelf.
3. `Metadata` — **Nothing written behind your back** — Rename one artist and
   Sonarche asks which of the other thirteen tracks should follow. You decide
   before anything touches a file.
4. `Inspector` — **Seven fields out of seven** — The inspector slides in over
   the list, so you can fix one track without ever losing your place.
5. `Upkeep` — **It keeps its own to-do list** — Missing years, genres off the
   tree, tracklists with holes — twenty things to correct, gathered in one
   screen.

## First launch

- Kicker: `FIRST LAUNCH`
- Heading: Your system will hesitate. Once.
- Body: Sonarche isn't signed by Apple or Microsoft — those are yearly
  certificate fees, not security audits, and this project chose the
  code-is-public route instead. So the very first launch costs you one extra
  click, on either platform.
- macOS: Gatekeeper says « Apple could not verify that this app is free of
  malware ». → `right-click the app → Open → Open` — Or once it's blocked:
  System Settings → Privacy & Security → Open Anyway.
- Windows: SmartScreen says « Windows protected your PC » and hides the
  button. → `More info → Run anyway` — Or before opening: right-click the
  file → Properties → Unblock.
- Closer: After that, it's just your app.

## Final CTA & footer

- Heading: Free. Open source. Yours.
- Body: No subscription, no cloud, no lock-in. The code is on GitHub — read
  it, fork it, board it.
- CTA: the download button — see § Download. The colophon's `GitHub ↗` below
  it keeps the repository one click away, so the body still lands.
- Footer: `License: MIT` · For personal use. Respect the terms of the services
  you use, and your local law. · `SONARCHE` · by Romain Pierucci (@Norudah) ·
  _From the stream into the Ark._ · `GitHub ↗`
- Both colophon links that lead to GitHub — the profile and the repository —
  carry the GitHub mark, small and at the text's own opacity. It marks where a
  link goes; it is not a button.
- The signature is an attribution, not a biography: one line, at the bottom, at
  the colophon's own size, and the name links to the GitHub profile. The
  product is the subject; the author is the signature. It stays off the share
  card.

## Download

One component, rendered as the primary CTA in the hero and again in the final
CTA. It reads the visitor's system and offers the matching build.

macOS shows **both** chips side by side rather than picking one. That is not
indecision: every browser on macOS reports `Intel Mac OS X` in its user agent
whatever the chip, and the one API that tells the truth exists only on
Chromium. Guessing would hand a silent, unexplained failure to whoever we get
wrong, so the page asks instead — and the note below tells them where to look.

Every button and every panel row carries its platform's mark — the Apple logo,
the Windows flag. The mark is what names the platform, which is why the macOS
pair needs no heading over it: the logo says `macOS` and the label says which
chip. That heading existed and was cut for exactly this reason.

- Neutral CTA, before the system is known and when JavaScript never lands:
  `Download Sonarche ↓`
- macOS, the two buttons, each under an Apple mark: `Apple Silicon` · `Intel`
- Windows, one button, under the Windows mark: `Download for Windows ↓`
- Meta line under the buttons, one line, the two halves separated by `·`:
  - Which Mac: Not sure? Apple menu → About This Mac: `Chip` means Apple silicon.
  - All-versions toggle: `All versions` / `Hide versions`
- Panel rows: `macOS · Apple Silicon` · `macOS · Intel` · `Windows`
- Per-row detail, once the release is known: `{size} MB`
- Version line under the panel: `Version {n}` — omitted until the release
  answers, never invented.
- Panel fallback link, always present: `See all releases on GitHub ↗`

## Metadata (never rendered on the page)

Read only by a search engine or by the preview card of a shared link. It shows
up nowhere on the page, but it is what people see before they click, so it is
copy.

- Search title (`<title>`): `Sonarche — open-source, offline music library`
  — no tagline: nobody types it into a search box. Brand first, then what the
  thing is.
- Brand title (`og:title`, share card): `Sonarche — From the stream into the Ark.`
- Description (`meta description`, `og:description`): the hero subline plus
  "Free and open source." — 148 characters, inside the ~155 a snippet shows.
