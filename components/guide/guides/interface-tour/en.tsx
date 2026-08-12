import { guideById, guidePath } from "@/lib/guide";

import { H2, Lead, Pull } from "@/components/reading/Prose";

/*
 * A tour of the interface, in English. Its French counterpart is in ./fr.tsx —
 * the two say the same things and are not word-for-word translations of each
 * other.
 *
 * No screenshots, by decision. The quoted labels are those of Sonarche 2.0.0
 * and are to be re-checked against each new version before bumping
 * `appVersion`.
 *
 * Spaces around inline tags: see the comment at the top of
 * components/blog/posts/wrong-tags/fr.tsx — both rules, and why.
 */

export function InterfaceTourEn() {
  return (
    <>
      <Lead>
        Sonarche lives in a window whose structure never changes: navigation on the left, three controls up top, the
        page in the middle, playback along the bottom. This guide walks through those four zones, explains the color
        code you will meet everywhere, and answers the questions the interface raises in the first few days.
      </Lead>

      <H2>Four zones, and only one scrolls</H2>

      <ul>
        <li>
          <strong>The sidebar</strong>, on the left, at a fixed width: the navigation.
        </li>
        <li>
          <strong>The top bar</strong>, above the content: three controls, never page content. On macOS it is also the
          strip you grab to move the window, since the app has no native title bar.
        </li>
        <li>
          <strong>The page</strong>, the only zone that scrolls.
        </li>
        <li>
          <strong>The player bar</strong>, full width at the bottom, present on every page, Settings included.
        </li>
      </ul>

      <p>
        The page being the only thing that scrolls has one useful consequence: as you move down a shelf, its work bar
        (the filters and the search) sticks to the top of the frame, and the column headers and the player never move.
        The list can be three thousand rows long; the controls stay within reach.
      </p>

      <H2>The sidebar</H2>

      <p>The logo and the name up top. Below them, three sections.</p>

      <p>
        <strong>Explore</strong>&#32;is how music gets in, and what happened to it:
      </p>

      <ul>
        <li>
          <strong>Downloads</strong>, the home page at launch: paste a link.
        </li>
        <li>
          <strong>Import</strong>: bring in music already on your disk.
        </li>
        <li>
          <strong>History</strong>: everything that ever came in, newest first, downloads and imports together.
        </li>
        <li>
          <strong>Metadata</strong>: the sorting desk, what is left to complete. The entry carries an amber badge with
          the number of tracks and albums to complete, capped at “99+” and switchable off in Settings → Metadata.
        </li>
      </ul>

      <p>
        <strong>Arche</strong>&#32;is the library itself, filed on five shelves: Tracks, Albums, Artists, Genres and
        Categories. Each gets its paragraph further down.
      </p>

      <p>
        <strong>Playlists</strong>, finally: the “All playlists” page always first, “Favorites” (the app&apos;s own
        list) always second, then the eight most recently touched playlists, each with its icon or its image. Past
        eight, they live on the index page: the sidebar stays a navigation, not a directory. The + in the section header
        creates a playlist and takes you into it.
      </p>

      <p>
        One special case: inside Settings, the whole sidebar swaps, and the navigation menu gives way to the settings
        categories. That is the only visual cue that you changed context.
      </p>

      <H2>The top bar</H2>

      <ul>
        <li>
          On the left, the <strong>Listening / Inspecting</strong>&#32;switch, which we call the magnifier. It gets its
          own section just below.
        </li>
        <li>
          On the right, the <strong>?</strong>&#32;opens this guide in your browser, in the app&apos;s language.
        </li>
        <li>
          Next to it, the <strong>gear</strong>&#32;enters Settings. Once inside, it becomes a cross, and it brings you
          back to exactly the page you came from.
        </li>
      </ul>

      <H2>The Listening / Inspecting switch</H2>

      <p>
        The magnifier only appears on pages whose body is a list of tracks: Tracks, an album&apos;s page, a playlist,
        and the artist, genre or category pages when they are in their “Tracks” view. On a wall of covers it would have
        nothing to change, so it disappears. If you are looking for it and it is not there, the current page is not a
        list.
      </p>

      <p>
        In Inspecting mode the pill turns amber: the button&apos;s color is a sample of the room it lets you into. Same
        list, different table:
      </p>

      <ul>
        <li>The cover thumbnails go, and the rows tighten: roughly three times as many tracks on screen.</li>
        <li>
          The columns grow from #, Title, Artist, Album, Genre, Duration to No., Title, Artist, Album,{" "}
          <strong>Year</strong>, Genre, <strong>Family</strong>, <strong>Category</strong>, Duration, plus an alerts
          column.
        </li>
        <li>The empty cells the Metadata page still watches light up in amber, with a tooltip saying why.</li>
        <li>
          A genre the tree does not know gets a dotted amber underline: the value is fine, it is the filing that has no
          slot. The tooltip spells it out: nothing is missing, but the track falls under “Other”.
        </li>
        <li>Two pictograms close the row: a triangle for a match to review, leaves for a duplicate track.</li>
        <li>
          On hover, a single pencil: the one that opens{" "}
          <a href={guidePath(guideById("edit-track"), "en")}>the track&apos;s edit drawer</a>.
        </li>
      </ul>

      <p>
        The switch is global and persistent: it survives opening an album and coming back. You turn it off when the
        sorting session is over, not on every page.
      </p>

      <H2>The color code</H2>

      <p>Four colors come back everywhere, and each carries exactly one meaning:</p>

      <ul>
        <li>
          <strong>Amber</strong>: a gap, something to complete. Never a mistake, never a score. It is the color of the
          empty cells in inspection, of the Metadata page&apos;s badges, of the tracklist dots, of the “To fix” filter.
        </li>
        <li>
          <strong>Indigo</strong>, the accent: navigation, selection, and a change waiting to be written. The edge along
          a modified field and the “N changes” badge are indigo.
        </li>
        <li>
          <strong>Green</strong>: complete, or saved.
        </li>
        <li>
          <strong>Red</strong>: destructive. Delete, and nothing else.
        </li>
      </ul>

      <p>
        And one deliberate absence: on a shelf of covers, nothing is graded. No “62 %” badge on the artwork. The
        judgement on your metadata only lives where you go to fix it: in inspection, in the edit panels, on the Metadata
        page. The rest of the time, the library is a library, not a report card.
      </p>

      <H2>The player bar</H2>

      <p>
        Left to right: the current track, the transport, the progress bar, then the heart, the lyrics, the queue and the
        volume. The whole current-track block is clickable: the cover and the title lead to the album&apos;s page, the
        subtitle to the artist&apos;s. During playback an animated equalizer sits over the cover; when nothing plays,
        the bar says “Nothing playing”.
      </p>

      <p>
        The transport lines up shuffle, previous, play, next and repeat. Repeat has three states: off, the whole queue,
        a single track (the icon then wears a “1”). Shuffle and repeat light up in the accent while they are on, and the
        progress bar is clickable to seek.
      </p>

      <Pull>The playback context is whatever you are looking at.</Pull>

      <p>
        Starting a track from a filtered list queues that filtered list, not the whole library. Filter a shelf down to
        one decade, start the first track: the queue is those tracks. The queue shows the order actually played, so the
        shuffled order when shuffle is on: the current track pinned under “Now playing”, the rest under “Up next”, and a
        click jumps to a track.
      </p>

      <p>
        Lyrics follow the playhead line by line when they are timed. Scroll them by hand and the panel stops following
        for six seconds, then picks the track back up.
      </p>

      <H2>The anatomy of a page</H2>

      <p>Every browsing page shares the same skeleton, from Tracks to a playlist&apos;s page.</p>

      <p>
        The hero first: breadcrumb, eyebrow (Album, Collection, Artist, Genre…), title, a meta line (year, track count,
        duration, formats), genre chips, then the actions. Two round buttons, <strong>Play</strong>&#32;and{" "}
        <strong>Shuffle</strong>; an <strong>Edit</strong>&#32;button; a <strong>⋯</strong>&#32;“More actions” menu. The
        shape rule never changes: round plays, rectangular manages.
      </p>

      <p>
        The work bar next, sticky at the top of the frame: up to two facet pills (Family, Category) that only show up
        when there are at least two values to pick from, a <strong>Filters</strong>&#32;button (decade, “To fix”…)
        tinted while filters are active inside it, the chips of the active filters (indigo for navigation, amber for
        correction; clicking a chip removes it), an “X of Y” counter when a filter narrows the list, and the search,
        pinned right.
      </p>

      <p>
        The body last: a table, or a grid of cards. Sorting is done by clicking a column header, and the third click
        returns to the list&apos;s original order. Double-click on a row: playback.
      </p>

      <p>
        On an artist&apos;s, a genre&apos;s or a category&apos;s page, a view switch flips between “Discography” or
        “Albums & artists” and “Tracks”. That mode lives in the URL, so it survives the round trip.
      </p>

      <H2>The five shelves</H2>

      <ul>
        <li>
          <strong>Tracks</strong>: the whole library, virtualized: a list of several thousand titles stays smooth. Two
          badges worth knowing: “no audio” when Sonarche cannot decode the format, “Guest” when the track is credited on
          someone else&apos;s album. A missing genre shows as an amber chip.
        </li>
        <li>
          <strong>Albums</strong>: the wall of covers. Hovering a card reveals a pencil that opens{" "}
          <a href={guidePath(guideById("edit-album"), "en")}>the album&apos;s metadata modal</a>&#32;and a play button;
          the rest of the card leads to the album&apos;s page.
        </li>
        <li>
          <strong>Artists</strong>: one round disc per artist. The image is yours, the one you choose, not an album
          cover.
        </li>
        <li>
          <strong>Genres</strong>: cards grouped by family, a family gathering close genres, with the share of the
          library, the subgenres, and “Other” for what the tree does not know. From a genre&apos;s page, “File under…”
          moves that genre into the family of your choice, and “Original placement” takes it back.
        </li>
        <li>
          <strong>Categories</strong>: the context, orthogonal to genre: Music, Video Games, Films, Series, Anime,
          Cartoons, Musicals. Empty at first: a category is set from a track&apos;s or an album&apos;s edit panel.
        </li>
      </ul>

      <p>
        Playlists are your own lists: reorderable by drag and drop, wearing an image or an icon of your choice.
        “Favorites” is the one the app keeps for you, fed by the heart.
      </p>

      <H2>The Explore side, briefly</H2>

      <ul>
        <li>
          <strong>Downloads</strong>: a field to paste a link into. Once it is recognized, a question (fetch the whole
          album, or just this track) and an Options panel: destination album (automatic, existing or new) and category.
          Below, the run-down of what is in flight: Fetching, Filing, Identification, with a verdict per line.
        </li>
        <li>
          <strong>Import</strong>: pick a folder. Sonarche scans it (track count, weight, unreadable files) and shows
          what is about to happen before doing anything. Importing copies, it does not move: your original files stay
          put, and existing tags are kept as they are, with no online lookup. At the end, the page offers the alignment:
          a MusicBrainz identification, album by album, from the tags themselves, which fills in missing years, genres
          and covers.
        </li>
        <li>
          <strong>History</strong>: the trace of everything that came in.
        </li>
        <li>
          <strong>Metadata</strong>: the sorting desk. A count of what is left to complete, then a queue of correction
          rows: Match to review, Duplicate tracks, Missing year… Each row opens the shelf filtered to exactly those
          tracks, magnifier already on. Each row also offers “That&apos;s on purpose”: the observation is accepted and
          leaves the count everywhere, reversibly. That page deserves its own guide; for now, remember it is the natural
          front door of a clean-up session.
        </li>
      </ul>

      <p>
        Settings, to finish, fit in seven categories: Appearance (light, night or system theme, language, the welcome at
        launch, replaying the guided tour), Adding, Metadata, API keys, API rate limits, Library and Updates.
      </p>

      <H2>Shortcuts and gestures</H2>

      <ul>
        <li>Double-click on a row: playback.</li>
        <li>
          <strong>⌘S / Ctrl+S</strong>&#32;in an edit panel: save without closing.
        </li>
        <li>
          <strong>Esc</strong>: close the panel, with a guard if changes are pending.
        </li>
        <li>
          <strong>⌘V / Ctrl+V</strong>&#32;in an image modal: paste an image, or an image address.
        </li>
        <li>Drag and drop an image file into an image modal.</li>
        <li>Drag a playlist row to reorder it.</li>
        <li>↑ and ↓ then Enter in a field with suggestions.</li>
      </ul>

      <H2>The questions that keep coming back</H2>

      <ul>
        <li>
          <strong>“Why is there no page for a track?”</strong>&#32;There is none: a track opens in a drawer, and every
          path converges on the album.
        </li>
        <li>
          <strong>“The Listening / Inspecting switch is gone.”</strong>&#32;Normal: the current page is not a list of
          tracks.
        </li>
        <li>
          <strong>“My cover is a video thumbnail.”</strong>&#32;That is a provisional cover, and{" "}
          <a href={guidePath(guideById("edit-album"), "en")}>the album guide</a>&#32;shows how to replace it.
        </li>
        <li>
          <strong>“A track is marked no audio.”</strong>&#32;The file is in the ark, with its tags and its place in the
          album; Sonarche just cannot decode that particular format. That is deliberate: nothing is turned away at
          import.
        </li>
      </ul>
    </>
  );
}
