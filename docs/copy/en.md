# Landing copy — EN (source of truth)

Final copy, validated 2026-07-30 from "Sonarche Landing v7" (Claude Design).
This deck is the reference: the FR deck (`fr.md`) mirrors it section by section.
Any copy change lands here first, then in `fr.md`, then in the components.

## Hero

- Badge: `FREE · OPEN SOURCE · OFFLINE`
- Wordmark: `SONARCHE`
- Tagline (BRAND — never reworded): `From the stream into the Ark.`
- Subline: A music library that's truly yours — every track identified by its
  own audio, named in plain files, played on a native engine.
- CTA primary: `Get Sonarche on GitHub ↗`
- CTA secondary: `See how it works ↓`
- Scroll hint: `SCROLL ↓`

## Why it exists

- Kicker: `WHY IT EXISTS`
- Heading: Your music should outlive every app.
- Body: Give it *true names*, *a home in plain files*, and a player worthy of
  it — *forever, offline, yours*. (italics = emphasis spans)

## The flow

- Kicker: `THE FLOW`
- Heading: A link goes in. A library comes out.
- Sub: Four moves, one uninterrupted pipeline — and nothing to click after the
  first paste.

### Step 01 — Paste a link
A track, an album, a whole playlist. Drop it in the composer and the voyage
lines up — one row per track, before anything is brought in.
Note: Already in the hold? It's skipped, silently.

### Step 02 — Watch it come aboard
Circles turn green one by one as the native audio is hauled in — untouched,
never re-encoded — and lands in the hold.
Note: Close the window mid-haul — the queue picks up where it stopped.

### Step 03 — Fingerprint & identify
ffmpeg and Chromaprint distill the audio itself into an acoustic fingerprint.
AcoustID answers with exactly which recording this is — no title-guessing
involved.
Note: No confident match? It says so and asks — instead of inventing an artist.

### Step 04 — It gets its name
Title, artist, album, genre, track, year — and the real cover. All of it
written into the file's own tags, and into the folder it now lives in.
Note: Into the files themselves — not into a database only Sonarche can read.

## The old way

- Kicker: `THE OLD WAY`
- Heading: You already know the old way.
- Sub: Five tools, four tabs, and a download folder that looks like a crime
  scene. Every step loses something on the way.
- Punch heading: Sonarche does all five. In one window.
- Punch body: Point it at a link and walk away. The audio lands in the hold,
  gets listened to, identified, tagged, given its real cover, filed in the
  right folder — and then it plays, on a native Rust audio engine. No hand-off,
  no re-import, no second app.

## True names

- Kicker: `TRUE NAMES`
- Heading: It doesn't read the title. It listens to the song.
- Body: Most tools just copy whatever text happened to come with the file.
  That's how you end up with an artist called « Official Audio ». Sonarche
  never guesses: ffmpeg and Chromaprint turn the waveform itself into a
  fingerprint, AcoustID matches that fingerprint to one exact recording, and
  MusicBrainz — twenty years of community-verified discography — hands back
  the real facts.
- Compare labels: `SCRAPED FROM THE PAGE` / *best guess* —
  `FINGERPRINT → ACOUSTID → MUSICBRAINZ` — `IDENTIFIED BY THE AUDIO` / *verified*
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
- Note: Drag the folder anywhere and it still works.
- Closer: If you decide you don't like Sonarche, your library leaves with you
  — fully tagged.

## Under the deck

- Kicker: `UNDER THE DECK`
- Heading: No magic. Proven tools, conducted well.
- Body: You don't have to care about any of this — but here it is, in plain
  words, because you deserve to know what's running on your machine.
- Diagram nodes:
  - The stream — A URL out there — a track, an album, a playlist. (*the open web*)
  - `EMBEDDED PYTHON · SEALED, SHIPPED WITH THE APP`
  - yt-dlp — Hauls the native audio in — no re-encode, ever.
  - ffmpeg + Chromaprint — Distills each track into an acoustic fingerprint.
  - beets (*the conductor*) — Directs every call, checks every tag, and files
    each track into its right place in the library.
  - MusicBrainz — The open encyclopedia of recorded music — titles, albums, years.
  - AcoustID — Matches the fingerprint to the exact recording.
  - 📁 /sonarche — After all that — it's just a folder of music. Yours. Open
    it, move it, back it up.

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

## The ship's sound

- Kicker: `THE SHIP'S SOUND`
- Heading: Not just the harbor — the ship's own sound.
- Body: The last step of the old way was moving files into some other player.
  Sonarche is the player too — a native Rust audio engine, so tracks start on
  the beat and gapless albums stay gapless.

## The real thing (screenshots)

- Kicker: `THE REAL THING`
- Heading: This is what the deck looks like.

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
- CTA: `Get Sonarche on GitHub ↗`
- Footer: `License: MIT` · For personal use. Respect the terms of the services
  you use, and your local law. · `SONARCHE` · *From the stream into the Ark.*
  · `GitHub ↗`
