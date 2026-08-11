import { H2, Lead, Pull } from "@/components/reading/Prose";

/*
 * The body of the post, in English. Its French counterpart is ./fr.tsx — the
 * two make the same argument and are not word-for-word translations of each
 * other: they are two texts written for two readers.
 *
 * Two rules for the space around an inline tag, and they are not symmetric:
 *   - AFTER the tag, `&#32;` — JSX trims the leading space of a text node that
 *     wraps onto several lines, and Prettier rewrites `{" "}` back into a
 *     literal space the moment it fits.
 *   - BEFORE the tag, `{" "}` — the other way round: an entity at the end of a
 *     line is decoded and then trimmed along with the newline, while `{" "}`
 *     there is exactly what Prettier writes and keeps.
 * Either way the mistake is silent: the word glues itself to the tag, with no
 * compile error. The check is in docs/CONTEXT.md.
 */

export function WrongTagsEn() {
  return (
    <>
      <Lead>
        An audio file doesn&apos;t know what it holds. It carries a title, an artist and a cover because someone, once,
        typed them into it. And that someone could be wrong.
      </Lead>

      <p>
        Which is the thing worth knowing before you spend a weekend fixing a library by hand: a track&apos;s metadata is
        not a property of the sound. It is a note left beside it.
      </p>

      <H2>What is actually in the file</H2>

      <p>
        An MP3 is not only an audio stream. It drags a small block of text along with it: the <code>ID3</code>&#32;tag,
        stuck to the front or the back of the file. Other formats have their own: Vorbis comments for FLAC and Opus,{" "}
        <code>ilst</code>&#32;atoms for AAC in an MP4 container. The idea never changes: key-value pairs, plus a
        picture.
      </p>

      <pre>
        <code>{`TITLE=Nocturne
ARTIST=Ensemble Vireo
ALBUM=Low Tides
DATE=2019
TRACKNUMBER=4`}</code>
      </pre>

      <p>
        None of it is verified, and nothing ties that text to the sound that follows. You can write{" "}
        <em>Symphony No. 9</em>&#32;onto three minutes of silence: no player will object, no scanner will notice. The
        label is on the box, not in it.
      </p>

      <Pull>A music library is a wall of labels nobody has ever read back.</Pull>

      <H2>Where the labels come from</H2>

      <p>Almost always one of four places, and each has its own way of lying.</p>

      <ul>
        <li>
          <strong>A ripped CD.</strong>&#32;The software derives an id from the track lengths and asks a database:
          historically CDDB, now MusicBrainz. Two discs that happen to share a layout share an id, and the wrong album
          wins.
        </li>
        <li>
          <strong>The filename.</strong>&#32;Plenty of tools assume <code>Artist - Title.mp3</code>&#32;and split on the
          first dash. An artist whose name contains a dash, a title that contains one, a file called{" "}
          <code>01 - track 01.mp3</code>, and the rule produces garbage with exactly the same confidence.
        </li>
        <li>
          <strong>The page the file came from.</strong>&#32;A web page title is not a track title, it is a pitch. Hence
          the <code>(Official Video)</code>, <code>HD</code>, <code>[Lyrics]</code>&#32;and shouting capitals running
          through a whole collection.
        </li>
        <li>
          <strong>A human.</strong>&#32;The most reliable of the four, and the one that does not scale. Nobody tags
          three thousand files without giving up around fifty.
        </li>
      </ul>

      <H2>The five ways it breaks</H2>

      <p>
        The damage is always the same, whatever the source. Open your own collection now and you will find at least
        three of these.
      </p>

      <ul>
        <li>
          <strong>The album-artist field.</strong>&#32;On a compilation every track has its own artist, but the album
          has one. Tools that ignore <code>ALBUMARTIST</code>&#32;shatter it into eighteen one-track albums. That is the
          most common failure of all.
        </li>
        <li>
          <strong>Text encoding.</strong>&#32;ID3v2 allows several. A tag written as latin-1 and read back as UTF-8
          gives you <code>BjÃ¶rk</code>&#32;instead of <code>Björk</code>, and it stays broken until someone retypes it.
        </li>
        <li>
          <strong>Guests.</strong>&#32;<code>feat.</code>, <code>ft.</code>, <code>featuring</code>, in brackets, after
          a comma, in the title or in the artist field. Six spellings of one fact, six separate artists in your list.
        </li>
        <li>
          <strong>Reissues.</strong>&#32;Remaster, anniversary edition, reissue with two bonus tracks: same album,
          different dates and track numbers. Sort by year and the discography becomes fiction.
        </li>
        <li>
          <strong>Blanks.</strong>&#32;No date, no track number, no artwork. A player that groups by album then falls
          back to alphabetical order, which is nobody&apos;s running order.
        </li>
      </ul>

      <H2>Why searching the title fixes nothing</H2>

      <p>
        The instinct is to send the tag text to a database and take the first hit. That fails precisely where you need
        it to work: when the text you started from is wrong.
      </p>

      <p>
        A text search inherits the error it is meant to correct. It cannot separate two same-named songs by two
        different bands, a studio take from its live version, an original from a cover. Worse, it always answers
        something. Across a thousand files those plausible but wrong answers are invisible, until the day you go looking
        for a track and it is nowhere.
      </p>

      <H2>A fingerprint instead of a name</H2>

      <p>
        The other approach starts from the sound.{" "}
        <a href="https://acoustid.org/chromaprint" rel="noreferrer" target="_blank">
          Chromaprint
        </a>{" "}
        reads the first two minutes of a track, measures how its energy falls across the twelve pitch classes frame by
        frame, and compresses that sequence into a compact fingerprint.
      </p>

      <pre>
        <code>{`$ fpcalc -length 120 track.mp3
FILE=track.mp3
DURATION=241
FINGERPRINT=AQADtEmiKFKSJIeS5Hkg5X...`}</code>
      </pre>

      <p>
        It describes what you hear rather than what someone typed. It survives re-encoding, a bitrate change, volume
        normalisation, a few seconds of silence at the head. The same recording as FLAC and as AAC yields, near enough,
        the same signature.
      </p>

      <p>
        Then it has to be matched against something.{" "}
        <a href="https://acoustid.org/" rel="noreferrer" target="_blank">
          AcoustID
        </a>{" "}
        keeps that ledger: millions of fingerprints, each tied to a recording in{" "}
        <a href="https://musicbrainz.org/" rel="noreferrer" target="_blank">
          MusicBrainz
        </a>
        , the open music encyclopedia. Out of it comes a stable id, and with it the exact title, the credited artist,
        the release, the year, the position on the disc and the cover.
      </p>

      <Pull>
        It stops being a search and becomes a recognition: the file no longer gets a say in what it claims to be.
      </Pull>

      <H2>What a fingerprint will not do</H2>

      <p>Three limits, worth knowing before believing in magic.</p>

      <ul>
        <li>
          <strong>It identifies a recording, not a song.</strong>&#32;A live take, a remix, an acoustic session are
          different recordings and get different ids. That is the intent, and exactly what a title search cannot do.
        </li>
        <li>
          <strong>It only finds what has been submitted.</strong>&#32;A self-released EP, a recording of a local gig, a
          track that came out yesterday: no fingerprint in the database, no answer. The database is open, and it takes
          contributions.
        </li>
        <li>
          <strong>It has no opinions.</strong>&#32;Genre, mood, the rating you give a record are in no spectrum
          anywhere. Those fields stay yours, which is as it should be.
        </li>
      </ul>

      <H2>Doing it yourself</H2>

      <p>
        None of this is proprietary. <code>fpcalc</code>&#32;ships with Chromaprint, and{" "}
        <a href="https://beets.io/" rel="noreferrer" target="_blank">
          beets
        </a>{" "}
        is the library manager that wires the whole chain together: it fingerprints, queries AcoustID, proposes the
        match, writes the tags and files everything away.
      </p>

      <pre>
        <code>{`$ pip install "beets[chroma]"
$ beet config -e        # add chroma to the plugin list
$ beet import ~/Music/to-sort`}</code>
      </pre>

      <p>
        Budget an evening for the first setup, and some patience for the cases beets asks you to settle yourself. It is
        an excellent tool, written by people who thought of everything, but it lives in a terminal, and you have to want
        to live there too.
      </p>

      <H2>What you get out of it</H2>

      <p>
        Correct tags are not fussiness. They are what keeps a collection readable when it changes machine, software or
        decade. Files do not get lost; catalogues get lost. A track named and filed properly is one you find with{" "}
        <code>ls</code>, ten years later, without the application that imported it.
      </p>

      <p>
        Which is the only kind of ownership that matters for a music library: being able to open it without asking
        anyone.
      </p>
    </>
  );
}
