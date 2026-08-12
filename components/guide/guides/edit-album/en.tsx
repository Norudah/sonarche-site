import { guideById, guidePath } from "@/lib/guide";

import { H2, Lead, Pull } from "@/components/reading/Prose";

/*
 * Editing a whole album, in English. Its French counterpart is in ./fr.tsx —
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

export function EditAlbumEn() {
  return (
    <>
      <Lead>
        Fixing a record track by track in the drawer is slow, and it is the wrong tool: most corrections hold for the
        whole album. The “Album · metadata” modal exists for that. It reads left to right, the record then its tracks,
        and everything leaves in a single “Save”.
      </Lead>

      <H2>Opening the modal</H2>

      <p>
        Two paths: the “Edit” button on the album&apos;s page, next to the play buttons, or the pencil that appears when
        you hover a cover, on the Albums shelf as well as in an artist&apos;s discography, a genre or a category. It is
        a near full-screen modal, not a drawer: it needs room for the record&apos;s card and the whole tracklist.
      </p>

      <p>
        The header follows the same codes as{" "}
        <a href={guidePath(guideById("edit-track"), "en")}>a track&apos;s drawer</a>: a clickable cover (to “Replace the
        cover”), the artist&apos;s disc (to “Replace the artist image”), the “Album · metadata” eyebrow, the title, and
        the changes badge.
      </p>

      <H2>A badge with two numbers</H2>

      <p>
        The badge reads, say, “3 changes on 2 tracks”, and the two numbers measure different things: three tags touched,
        two files that will be rewritten. Changing the genre of a twenty-nine-track album counts as one change, not
        twenty-nine. The badge answers “what did I change?” and “what is about to be written?” in the same breath.
      </p>

      <H2>The completion ring</H2>

      <p>
        At the top of the left column, a ring shows the raw ratio, “24/29”, green when full, amber otherwise, with the
        sentence spelled out: “24 of 29 tracks are complete”. No percentage.
      </p>

      <Pull>A ratio can be checked; a grade can only be taken.</Pull>

      <p>Below it, everything is clickable:</p>

      <ul>
        <li>“Show only the N incomplete tracks” filters the tracklist.</li>
        <li>
          One chip per gappy field, “Year · 5 to fill”, “Genre · 12 to fill”, the gappiest first. One click filters the
          tracklist down to exactly those tracks, a second click lifts the filter.
        </li>
        <li>A “Complete: Title, Artist, Album.” line: what you no longer have to check.</li>
      </ul>

      <p>
        While a filter is on, an amber banner above the tracklist keeps saying so, “Filter: … · 5 of 29”, with a “Clear
        filter” link.
      </p>

      <H2>Album or Collection</H2>

      <p>
        Under the ring, a two-segment switch, “What this record is”, decides what Sonarche should expect of this disc.{" "}
        <strong>Album</strong>: a release, with its tracklist; Sonarche flags the tracks it is missing and offers to
        identify it on MusicBrainz. <strong>Collection</strong>: your own gathering of tracks; no tracklist to live up
        to, no more missing-track flags, and the alignment leaves it alone.
      </p>

      <p>Three things to know about this switch, because nothing else in the modal behaves like it:</p>

      <ul>
        <li>
          It is the only control that applies immediately, without going through “Save”: it is not a tag written into
          the files, it is how Sonarche should read the record.
        </li>
        <li>
          It does not show up when the group of tracks has no real album record behind it: a pile of singletons is the
          “nature” of nothing.
        </li>
        <li>Switching to Collection turns re-match off, for the record and for its tracks.</li>
      </ul>

      <H2>The shared fields</H2>

      <p>
        The “What holds for the whole album” section announces its reach in its own header: “written to N tracks”. It
        holds Album, Album artist (with the same “One files it, the other describes it” help as the drawer, here
        illustrated with your own artist), Year, Genre, then Genre family, computed and gray, and Category, as chips.
      </p>

      <p>
        The technical point that matters: mixed values. When the tracks disagree on a field, the field shows a dashed
        border and a placeholder like “4 values”, and a sentence under Year and Genre states the rule: leave it empty to
        change nothing, or type a value to write it to all N tracks. In other words, inspecting a half-tagged album can
        never flatten it: a mixed field left empty writes nothing.
      </p>

      <p>
        Genre and Year have a particular status: they also exist as columns in the tracklist. The shared field is a
        reading of the rows. Type into it and it writes to every row; edit one row and the shared field updates, falling
        back to “mixed” when the rows diverge. The two can never contradict each other. And as in the drawer, every
        modified shared field wears its “↺” chip with the old value.
      </p>

      <H2>The tracklist</H2>

      <p>
        The right column opens on “29 tracks”, then a line that sums up the artist / album artist pair: “Filed under X —
        the Artist column says who plays each title.” The columns: No., Title, Artist, Year, Genre, and a status dot at
        the end of the row, green for a complete track, amber otherwise.
      </p>

      <ul>
        <li>
          Every cell is editable: at rest it is a button, on click or by keyboard it becomes a real field. The reason is
          technical and owned: an eighty-track tracklist cannot mount three hundred live inputs.
        </li>
        <li>An empty cell says what is missing, in amber: “to fill in”, “missing”. Never a mute blank.</li>
        <li>
          Artist and Genre have autocompletion, with the same rules as{" "}
          <a href={guidePath(guideById("edit-track"), "en")}>the drawer</a>: your library as the vocabulary, eight
          entries at most, the “New value” row when you are inventing.
        </li>
        <li>A modified cell takes the indigo edge, and its row gets a light tint.</li>
        <li>
          What is not editable here: the album, the album artist, the category. They are shared, so they live on the
          left.
        </li>
      </ul>

      <H2>The suggestions to answer</H2>

      <p>
        This is the mechanic that belongs to the modal, and the most useful one. When you change a genre or an artist on
        one row, the app notices that other rows carried the same old value, and offers, without writing anything, to
        extend the correction. The card appears against the row concerned and stays until you answer it; clicking
        elsewhere does not dismiss it. It comes in three forms:
      </p>

      <ul>
        <li>
          <strong>Genre.</strong>&#32;Eyebrow “Genre · track title”, the old-to-new transition, then “12 other tracks
          still carry ‘Pop’.” Three answers: “Apply to the 12 ‘Pop’ tracks” as the main button, “To all 29 tracks” when
          that goes further than the carriers of the old value, “This track only”.
        </li>
        <li>
          <strong>Artist.</strong>&#32;“You changed ‘X’ to ‘Y’. Which other tracks follow?”, then a ticklist of the
          candidate tracks, each with the artist it carries today: the reason to leave it alone. Everything is ticked by
          default, the typical case being a spelling fix. Buttons: “Apply to N tracks”, “Change nothing”.
        </li>
        <li>
          <strong>Filling the album artist.</strong>&#32;The same ticklist, but only the empty rows are ticked: copying
          the album artist over a real featuring is exactly what this action must never do.
        </li>
      </ul>

      <p>
        To find your way around: a row waiting on your answer carries an indigo dot in the left gutter, a click reopens
        its card, and an “N suggestions to answer” pill, top right of the tracklist, takes you back to the first one,
        useful when the row concerned is further down or filtered out. Esc closes the open suggestion first, and only
        then the modal. Finally, answering a suggestion writes nothing to disk: it feeds the same draft as everything
        else, and it all leaves with the same “Save”. Typing yet another value re-offers: a suggestion is identified by
        the move from one value to another, not by the row.
      </p>

      <H2>Renumbering, and copying the album artist</H2>

      <p>Two round buttons at the top right of the tracklist, icon only, label on hover:</p>

      <ul>
        <li>
          <strong>Renumber</strong>&#32;rewrites the track numbers 1 to N, in the order shown. It applies to the draft:
          you see it in the No. column, and it leaves with the save.
        </li>
        <li>
          <strong>Copy the album artist</strong>&#32;offers to write the album artist onto the tracks: you pick which,
          and featurings start unticked. This button never writes directly; it opens the ticklist described above. It is
          disabled when every track already carries the album artist, or when there is none.
        </li>
      </ul>

      <H2>Replacing the cover</H2>

      <p>
        The cover modal opens from the header&apos;s cover, from the amber provisional-cover notice, or from the drawer
        of any track on the album. It is built as a before / after: on the left “Current”, today&apos;s cover, its
        weight, and “Embedded in N tracks”; on the right “New”, with every source: browse for a file (JPEG, PNG or
        WebP), drag and drop, paste (⌘V / Ctrl+V) an image or an image address, a link typed into a foldout field, and
        the online proposals from the Cover Art Archive, via the album&apos;s MusicBrainz identification. Nothing is
        asked of the network until you click “Search for proposals”.
      </p>

      <p>
        A cover is square, so a crop follows: you move the frame and you zoom. If the frame runs past the picture, a
        warning blocks validation: the cover would not come out square, zoom back in until it fits inside.
      </p>

      <p>What replacing actually writes, the modal&apos;s help spells out:</p>

      <ul>
        <li>
          The image is embedded into every file of the album, capped at 500×500 px: that is how other players show it,
          and it is what keeps each track from gaining several MB.
        </li>
        <li>Your full image is not lost: it is archived once next to the album, as “cover-hq”.</li>
        <li>
          The resulting weight is estimated before anything is written, and an image under 500 px gets flagged: used
          as-is, but it may look soft.
        </li>
      </ul>

      <p>
        The provisional-cover notice, while we are here: when the cover is a video&apos;s thumbnail rather than real
        artwork, an amber note says so and offers “Replace the cover” directly. It is the typical case of a forced album
        with no MusicBrainz release behind it; start with the online proposals.
      </p>

      <H2>Saving</H2>

      <p>
        “Save”, or <strong>⌘S / Ctrl+S</strong>. One batch for everything: shared fields, rows, applied suggestions. A
        track nothing touches is not rewritten. The feedback matches the drawer&apos;s: “29 tracks updated.” in green,
        or the failure with “No file was touched — your changes are kept.” and a “Try again” button. The exit guard is
        the same too: Keep editing, Discard, Save.
      </p>

      <p>
        One side effect worth knowing: renaming the album or its artist moves the folders on disk, and if you rename the
        album artist, its image follows the rename. The album&apos;s page follows the new name on its own: it does not
        close, and it does not say the album cannot be found. The Back button, though, will not return to the old name.
      </p>

      <H2>Re-matching an album</H2>

      <p>
        Same principle as for a track, but track by track, sequentially. While it runs, a progress bar and its count,
        “12 / 29 tracks · 9 identified”, with a “Stop” button. Stopping is honest: the current track finishes, the next
        ones are not started, and the summary says so, “Re-match stopped — 12/29 tracks processed, 9 identified.”
      </p>

      <p>
        The button is off while changes are pending, or when the record is a Collection, and the modal&apos;s foot then
        writes the reason out in full. The default confirmation warns about what will be rewritten, every recognised
        tag, including the ones you fixed by hand, with the same “Don&apos;t ask me again” as the drawer. The result
        fits on one line: “27/29 tracks identified”.
      </p>

      <H2>The other actions, in the hero&apos;s ⋯ menu</H2>

      <ul>
        <li>
          <strong>Add to a playlist</strong>, the whole album.
        </li>
        <li>
          <strong>Add tracks</strong>: the “pull” half of filing. From your album, go fetch titles elsewhere in the
          library; picked tracks leave their record for this one.
        </li>
        <li>
          <strong>Move to an album</strong>: the “push” half. The whole album joins another one: this is how two albums
          become one, and how a collection absorbs a release.
        </li>
        <li>
          <strong>Delete album</strong>: removes the tracks and the files. Irreversible, and blocked while a download is
          on its way to this album: wait for it to finish, or stop it from Downloads, before deleting.
        </li>
      </ul>

      <H2>When something jams</H2>

      <ul>
        <li>
          <strong>“The Genre field is empty even though my tracks have one.”</strong>&#32;The tracks disagree: the field
          is mixed, its placeholder says “N values”. Leaving it empty touches nothing; typing a value writes it to the
          whole album.
        </li>
        <li>
          <strong>“I am afraid of crushing different genres.”</strong>&#32;A mixed field left empty writes nothing. That
          is the rule; you can inspect without risk.
        </li>
        <li>
          <strong>“The album is split across two records.”</strong>&#32;Album artist or album title differ from one
          track to the next. Open both records and unify, or merge with “Move to an album”.
        </li>
        <li>
          <strong>“The featurings got overwritten.”</strong>&#32;An “apply to all” taken too fast. Filling the album
          artist never ticks a row that already carries another artist; in a rename suggestion, unticking the rows that
          should not follow is on you. Repair row by row, or from{" "}
          <a href={guidePath(guideById("edit-track"), "en")}>the drawer</a>.
        </li>
        <li>
          <strong>“The album keeps asking for tracks I don&apos;t have, or don&apos;t want.”</strong>&#32;The record is
          an Album, so a tracklist is expected. Switch “What this record is” to Collection.
        </li>
        <li>
          <strong>“Re-match is gray.”</strong>&#32;Pending changes, or a Collection. The modal&apos;s foot writes the
          reason.
        </li>
        <li>
          <strong>“The cover is a video still.”</strong>&#32;A forced album with no MusicBrainz release. The amber
          notice leads to “Replace the cover”; look through the online proposals first.
        </li>
        <li>
          <strong>“The track numbers are out of order.”</strong>&#32;Absent or wrong tags. Check the displayed order,
          then Renumber.
        </li>
        <li>
          <strong>“After a rename, the page changed address.”</strong>&#32;The folder moved on disk. Normal: the page
          follows, and the Back button will not return to the old name.
        </li>
      </ul>
    </>
  );
}
