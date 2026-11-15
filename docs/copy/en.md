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
- Subline: A music library that's truly yours: every track identified by its
  own audio, named in plain files, played on a native engine.
- CTA primary: the download button — see § Download
- CTA secondary: `See how it works ↓`
- Scroll hint: `SCROLL ↓`

## The flow

- Kicker: `THE FLOW`
- Heading: A link goes in. A library comes out.
- Sub: Four moves, one uninterrupted pipeline, and nothing to click after the
  first paste.

### Step 01 — Paste a link

A track, an album, a whole playlist. Drop it in the composer and the voyage
lines up: one row per track, before anything is brought in.
Note: Already in the hold? It's skipped, silently.

### Step 02 — Watch it come aboard

Circles turn green one by one as the native audio is hauled in and lands in
the hold, untouched, never re-encoded.
Note: Close the window mid-haul: the queue picks up where it stopped.

### Step 03 — Fingerprint & identify

ffmpeg and Chromaprint distill the audio itself into an acoustic fingerprint.
AcoustID answers with exactly which recording this is, with no title-guessing involved.
Note: No confident match? It says so and asks, instead of inventing an artist.

### Step 04 — It gets its name

Title, artist, album, genre, track, year. And the real cover. All of it
written into the file's own tags, and into the folder it now lives in.
Note: Into the files themselves, not into a database only Sonarche can read.
Scene tags (the labels flying into the file in the step's drawing): `Title` ·
`Artist` · `Album` · `Genre` · `Track` · `Year`

## The old way

- Kicker: `THE OLD WAY`
- Heading: You already know the old way.
- Sub: Five tools, four tabs, and a download folder that looks like a crime
  scene. Every step loses something on the way.

### The five links of the chain

Five columns: step label, tool (struck through), a small drawing of what it
leaves behind, cost. A tick under each, then the result band.

1. `TAB 1` · **A converter site** · _Slow, one track, re-encoded._
2. `APP 1` · **A bulk downloader** · _Tags are a guess._
3. `APP 2` · **A tag editor** · _Hours of typing._
4. `TAB 2` · **An image search** · _Wrong artwork forever._
5. `APP 3` · **Your music player** · _A messy library anyway._

Drawings (demo content, not claims): the file name
`Ghost - Mary On A Cross (Official Audio) [HQ].mp3` · guessed tags
`Artist: Unknown`, `Album:` (empty), `Year:` (empty) · `× 80` · duplicates
`Mary On A Cross`, `Mary On A Cross (1)`, `Mary On A Cross (2)`,
`Mary On A Cross (Official Audio)`.

### The punch

- Punch heading: Sonarche does all five. In one window.
- Result card: `Mary on a Cross` · `Ghost` · `Seven Inches of Satanic Panic · 2019`

## True names

- Kicker: `TRUE NAMES`
- Heading: It doesn't read the title. It listens to the song.
- Lead: Sonarche never guesses.
- Two inspectors side by side, static. Panel label `TRACK`.
  - `SCRAPED FROM THE PAGE` / _best guess_ · `1 of 7 fields`
  - `IDENTIFIED BY THE AUDIO` / _verified_ · `7 of 7 fields`

### The inspector fields

| Field     | Scraped (best guess)                            | Identified (verified)         |
| --------- | ----------------------------------------------- | ----------------------------- |
| Track no. | —                                               | 2                             |
| Title     | `Ghost - Mary On A Cross (Official Audio) [HQ]` | Mary on a Cross               |
| Artist    | unknown, read off the file name                 | Ghost                         |
| Album     | —                                               | Seven Inches of Satanic Panic |
| Year      | 2022 (file date)                                | 2019                          |
| Genre     | —                                               | Hard Rock                     |

- Cover line: And the cover comes with it. The real square artwork, not the
  fourth result on Google Images.

## No expertise needed

- Kicker: `NO EXPERTISE NEEDED`
- Heading: You don't need to know what a tag is.
- Lead: Everything that can be automated already is. The rest is your call.

### The cards

- Albums (fills to `100%`): Sensible defaults on import: most albums need
  nothing from you at all.
- Uncertain (tab `Metadata`, fields `Title` · `Artist` · `Year`, flag
  `Uncertain`): Anything uncertain is flagged in plain language, with the
  choice spelled out.
- Help: Little helpers all over the app explain the tricky words.
  - `Album artist` · _album filed under Daft Punk_ · tip: The one who signs
    the album. A guest on one track doesn't move it.
  - `Genre family · computed, not counted` · `Electronic` · tip: The broad
    genre yours belongs to: French House files the album under Electronic.
  - `Category · not counted in completion` · `Music` · `Video games` ·
    `Films` · `Anime` · tip: Music, video games, films… for sorting, without
    touching completion.
- Re-match: One click re-runs the fingerprint if a match was wrong.
  `Track 07` · `Unknown artist` · `Error` → `Creeping Death` ·
  `Metallica · Ride the Lightning` · `verified` · button `Re-match`.

### The editor

- Kicker: `MAKE IT YOUR OWN`
- Heading: And when it disagrees with you, you win.
- Window (app labels): `ALBUM · METADATA` · `13 tracks · 2013` ·
  `14 changes across 13 tracks` · `All 13 tracks are complete` ·
  `WHAT APPLIES TO THE WHOLE ALBUM` · `Album` · `Album artist` · `Year` ·
  `Genre` · `Category` · `Genre family · Electronic`
- Genre menu: `ELECTRONIC` · `House` · `French House` · `Nu-Disco` · `Synthpop`
- Categories: `Music` · `Video games` · `Films` · `Series`
- Columns: `NO.` · `TITLE` · `ARTIST` · `GENRE` · `TAGS`
- Popover: `ARTIST · GET LUCKY` · You changed « Daft Punk » to « Daft Punk
  feat. Pharrell Williams ». Which of the other tracks should follow? ·
  `Apply to 12 tracks` · `Change nothing`
- Actions: `Re-match` · `Cancel` · `Save`

## The real thing (screenshots)

- Kicker: `THE REAL THING`
- Heading: This is what the deck looks like.
- Counter: `01 / 05`
- Theme toggle: `Light` · `Dark` — group label: Screenshot theme

### The five shots

1. `Album` — **An album, whole** — Fourteen tracks, fourteen complete tag
   sets, the right cover, and it plays from the very same window.
2. `Genres` — **Genres as a tree** — Metal holds Metalcore, Heavy Metal,
   Progressive Metal, Power Metal, and knows it accounts for 32% of the shelf.
3. `Metadata` — **Nothing written behind your back** — Rename one artist and
   Sonarche asks which of the other thirteen tracks should follow. You decide
   before anything touches a file.
4. `Inspector` — **Seven fields out of seven** — The inspector slides in over
   the list, so you can fix one track without ever losing your place.
5. `Upkeep` — **It keeps its own to-do list** — Missing years, genres off the
   tree, tracklists with holes: twenty things to correct, gathered in one
   screen.

## The ship's sound

- Kicker: `THE SHIP'S SOUND`
- Heading: Not just the harbor: the ship's own sound.
- Body: Sonarche is the player too. A native Rust engine: tracks start on the
  beat, albums play without a gap, and the lyrics follow the music.
- Player (the app's own bar, over a capture of the Album view; alt: The app
  behind the player: the Album view.)
  - Controls: `Shuffle` · `Previous` · `Play` / `Pause` · `Next` · `Repeat` ·
    `Lyrics` · `Queue`
  - Queue panel: `Queue` · `11 tracks` · `NOW PLAYING` · `UP NEXT`
  - Lyrics panel: `Lyrics` · `SYNCED`
  - First track: `Drunken Sailor` · `Traditional` (public domain, so its
    lyrics can show), then `Carolina`, `Far and Away`, `Crazy Life`,
    `Apocalyptic Love`, `We Will Roam`, `Shots Fired` by Slash featuring
    Myles Kennedy and the Conspirators (the album in the capture).

## The hold is yours

- Kicker: `THE HOLD IS YOURS`
- Heading: Nothing here is locked. It's only files.
- Body (under the heading): Everything lands in `Music/Sonarche/`, next to
  your current app. The names live inside the files: any player can read them.

### The file manager

The visitor's own system, drawn generically: a Windows 11 Explorer or a macOS
Finder in column view. Path `Music › Sonarche › Ghost › Prequelle (2018)`,
tracks `01 Ashes.opus` … `10 Life Eternal.opus` and `cover.jpg`, beside
`Seven Inches of Satanic Panic (2019)` and `YourOtherMusicApp`.

- Windows labels: `This PC` · `Music` · `Home` · `Desktop` · `Downloads` ·
  `USB Drive (E:)` · columns `Name` · `#` · `Title` · `Contributing artists` ·
  details `Title` · `Contributing artists` · `Album` · `Year` · `Genre` ·
  status `11 items` · `1 item selected` · toolbar `New` · `Sort` · `View` ·
  `Details` · `Search Prequelle`
- macOS labels: `Favourites` · `Locations` · `Recents` · `Applications` ·
  `Desktop` · `Downloads` · `Music` · `USB Drive` · details `Title` ·
  `Artist` · `Album` · `Year` · `Genre` · `Search`
- Note: Drag the folder anywhere and it still works.

### Where it goes

- **A phone** — plug it in, drop the folder, done
- **A hard drive** — your backup is a copy-paste
- **Another player** — the tags are standard, so it reads them
- **Another machine** — no account, no re-import, no sync service

- Closer: If you decide you don't like Sonarche, your library leaves with you,
  fully tagged.

## Under the deck

- Kicker: `UNDER THE DECK`
- Heading: No magic. Proven tools, conducted well.
- Body: You don't have to care about any of this, but here it is, in plain
  words, because you deserve to know what's running on your machine.

### Three cards

- `THE SHELL` — **Tauri, not a browser tab** — The interface is built with
  modern web tooling, so it can be genuinely nice to look at and to use, but
  it ships as a real desktop app, a few megabytes, not a bundled browser
  eating your RAM.
- `THE ENGINE` — **Rust underneath** — Everything heavy runs in Rust: fetching, file
  writes, audio playback. That's the difference between a
  player that stutters and one that just starts.
- `THE TOOLBOX` — **A sealed sidecar** — beets and its Python tools live
  inside the app, in their own bundled runtime. Nothing to install, nothing to
  update, and nothing that can clash with whatever is already on your machine.

### Diagram nodes

- The stream — A URL out there: a track, an album, a playlist. (_the open web_)
- Your folders — What you already have: a home port, not just a loading dock.
  Copied in, never moved. (_no network_)
- `EMBEDDED PYTHON · SEALED, SHIPPED WITH THE APP`
- yt-dlp — Hauls the native audio in. No re-encode, ever.
- ffmpeg + Chromaprint — Distills each track into an acoustic fingerprint.
- beets (_the conductor_) — Directs every call, checks every tag, and files
  each track into its right place in the library.
- 📁 /sonarche — After all that, it's just a folder of music. Yours. Open
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

## Final CTA & footer

- Heading: Free. Open source. Yours.
- Body: No subscription, no cloud, no lock-in. The code is on GitHub: read
  it, fork it, board it.
- CTA: the download button — see § Download. The colophon's `GitHub ↗` below
  it keeps the repository one click away, so the body still lands.
- Help line (under the CTA, links to the getting-started guide): Need a hand
  with the first launch? `Read the guide →`
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

macOS gets one button, like Windows. The dmg is universal: the same file runs
on Apple Silicon and on Intel, so there is no chip to ask about. (The page used
to show both chips, because every browser on macOS reports `Intel Mac OS X`
whatever the chip; the universal build removed the question.)

Every button and every panel row carries its platform's mark — the Apple logo,
the Windows flag.

- Neutral CTA, before the system is known and when JavaScript never lands:
  `Download Sonarche ↓`
- macOS, one button, under the Apple mark: `Download for macOS ↓`
- Windows, one button, under the Windows mark: `Download for Windows ↓`
- Meta line under the button: the all-versions toggle, `All versions` /
  `Hide versions`
- Panel rows: `macOS · Apple Silicon & Intel` · `Windows`
- Per-row detail, once the release is known: `{size} MB`
- Version line under the panel: `Version {n}` — omitted until the release
  answers, never invented.
- Panel fallback link, always present: `See all releases on GitHub ↗`

## Metadata (never rendered on the page)

Read only by a search engine or by the preview card of a shared link. It shows
up nowhere on the page, but it is what people see before they click, so it is
copy.

- Search title (`<title>`): `Sonarche | open-source, offline music library`
  — no tagline: nobody types it into a search box. Brand first, then what the
  thing is.
- Brand title (`og:title`, share card): `Sonarche: From the stream into the Ark.`
- Description (`meta description`, `og:description`): the hero subline plus
  "Free and open source." — 147 characters, inside the ~155 a snippet shows.
- Card description (`og:image:alt`), one for the whole site because there is
  one card, and it describes the drawing rather than the page it was shared
  from: Sonarche: the ark afloat on a sea drawn as equalizer bars, under the
  word SONARCHE and the tagline "From the stream into the Ark."
- The separator in every `<title>` is a pipe, the plain web convention, and
  never a dash. `og:title` keeps its dash: a shared link is read as a sentence
  by a person, not matched against a query.

## The journal

The blog, entered from the footer's waterline and from nowhere else: the landing
is a scroll narrative, and a list of articles in the middle of it would cut the
narrative in half. The posts themselves do not live here — a post is a page
written by hand and its text stays with it
(`components/blog/posts/<id>/en.tsx`). What follows is the shared frame, and all
of it.

- Link in the landing's footer: `Journal`
- Breadcrumb at the head of the journal: `SONARCHE · Journal`
- Index title: `The ship's log`
- Line under the title: Notes on music you own: files, metadata, formats, and
  what it takes for a library to outlive the apps that read it.
- Index search title (`<title>`, never displayed):
  `Sonarche journal | music libraries, tags and metadata`
- Button on a row of the index: `Read the post →`
- A post's dateline: `{date} · {n} min read`, plus `Updated {date}` when the
  text has genuinely been revised.
- Closing card of a post:
  - Title: `Sonarche does all of this for you`
  - Body: A desktop app that identifies every track by its own audio, files it
    in plain folders you can read without it, and plays the lot on a native
    engine. Free, open source, offline.
  - Link: `Discover Sonarche →`
- Journal footer: `← Back to the site` · `From the stream into the Ark.` ·
  `GitHub ↗`

## The guide

The walkthroughs, at `/en/guide/`. Same reading layout as the journal, different
index: grouped by topic rather than by date. Each guide's text lives with it
(`components/guide/guides/<id>/en.tsx`); what follows is the shared frame. The
footer link only appears once a guide is published — see `draft` in lib/guide.ts.

- Link in the landing's footer: `Guide`
- Breadcrumb at the head: `SONARCHE · Guide`
- Index title: `Using Sonarche`
- Line under the title: How to get each part of the app to do what you want, one
  walkthrough at a time. Written against a numbered version, and revised when
  that version moves.
- Index search title (`<title>`, never displayed):
  `Sonarche guide | install, import, tag and play`
- The four topics, in this order: `Getting started` · `Your library` ·
  `Listening` · `Settings and upkeep`
- Line above a guide's title: `Checked against Sonarche {version}` ·
  `{n} min read`, plus the `Draft` badge until it ships.
- Button on a row of the index: `Read the guide →`
- Closing card of a guide: `All guides →` — never a download button: whoever is
  reading a guide already has the app.
- Empty index: `Nothing here yet` / The first walkthroughs are being written.
  The journal has something to read in the meantime.

## Reading pages

What the journal and the guide say identically. They share one frame
(`components/reading`): same header, same footer, same typography.

- Header: `SONARCHE` · `Journal` `Guide` — both sections always visible, the
  current one in ink. The guide only joins once it has something published.
- Table of contents heading, in the left card and folded on small screens:
  `On this page`
- Footer: `← Back to the site` · `From the stream into the Ark.` · `GitHub ↗`
- Length: `{n} min read` · Revision: `Updated {date}`
