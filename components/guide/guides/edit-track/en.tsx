import { guideById, guidePath } from "@/lib/guide";

import { H2, Lead, Pull } from "@/components/reading/Prose";

/*
 * Editing a track's metadata, in English. Its French counterpart is in
 * ./fr.tsx — the two say the same things and are not word-for-word
 * translations of each other.
 *
 * No screenshots, by decision. The quoted labels are those of Sonarche 2.0.0
 * and are to be re-checked against each new version before bumping
 * `appVersion`.
 *
 * Spaces around inline tags: see the comment at the top of
 * components/blog/posts/wrong-tags/fr.tsx — both rules, and why.
 */

export function EditTrackEn() {
  return (
    <>
      <Lead>
        A track is edited in a drawer, the Track drawer, and what you save there is written into the file itself:
        Sonarche has no side database, the library and the tags are the same thing. That is what the panel&apos;s
        caution is about, and this guide takes it from top to bottom.
      </Lead>

      <H2>Opening the drawer</H2>

      <p>Five paths lead to the same place:</p>

      <ul>
        <li>
          On the <strong>Tracks</strong>&#32;shelf, hover the row and click the pencil, “Edit metadata”. The row actions
          are always visible, slightly faded, and come to full opacity on hover: no sweeping the row to discover them.
        </li>
        <li>On an album&apos;s page, the same pencil, on the track&apos;s row.</li>
        <li>On a playlist&apos;s page, likewise.</li>
        <li>In Inspecting mode, a quieter pencil at the very end of the row.</li>
        <li>On the Downloads page, from a finished download&apos;s card.</li>
      </ul>

      <p>The drawer opens on the right, and the rest of the page stays visible behind it.</p>

      <H2>What the drawer shows</H2>

      <p>
        The header first: the album&apos;s cover, the “Track” eyebrow, the title, then “Artist — Album”. The cover is
        clickable when the track belongs to an album, and opens{" "}
        <a href={guidePath(guideById("edit-album"), "en")}>“Replace the cover”</a>; on a singleton it is not. On its
        corner, the artist&apos;s disc opens “Replace the artist image”. The header is also where the “N changes” badge
        appears from your first keystroke: it lives there, and not next to the buttons, so nothing moves under your
        cursor while you type.
      </p>

      <p>
        Then the completion band: “X of 7 fields”, the named list of what is absent (“Year, Genre missing”), and a “View
        album ›” link that closes the drawer and opens the album&apos;s page. The dot is green when everything is in,
        amber otherwise. The seven counted fields are Title, Artist, Album artist, Album, Year, Track no. and Genre.
        Category and Genre family do not count, and the interface says so right next to them: “doesn&apos;t count toward
        completion”, “computed, not counted”.
      </p>

      <p>The fields, in order:</p>

      <ul>
        <li>
          <strong>Track no.</strong>&#32;and <strong>Title</strong>, on one line.
        </li>
        <li>
          <strong>Artist</strong>, with autocompletion and a help note titled “One files it, the other describes it”.
          Right under it, small and read-only: “album filed under X”. We come back to this; it is the most misunderstood
          spot in the panel.
        </li>
        <li>
          <strong>Album</strong>, with autocompletion: the suggestions carry their covers. If the track is an adopted
          bonus, a note says so: “Bonus track from ‘…’, filed with the main album.”
        </li>
        <li>
          <strong>Year</strong>&#32;and <strong>Genre</strong>, on one line, Genre with autocompletion and its help.
        </li>
        <li>
          <strong>Genre family</strong>: a flat gray field you cannot type into. It is computed from the genre, not
          entered.
        </li>
        <li>
          <strong>Category</strong>: not a text field, a row of chips: Music, Video Games, Films, Series, Anime,
          Cartoons, Musicals. One click selects, a second click on the active chip deselects. If MusicBrainz typed the
          release as a soundtrack and no category is set, a line nudges you: “MusicBrainz marks this release a
          soundtrack — pick a category.”
        </li>
      </ul>

      <p>
        At the foot of the panel: “Re-match” on the left, “Cancel” (only shown when there are changes) and “Save” on the
        right. Above the buttons, a feedback line appears after an action: green for a successful save, red for a
        failure, gray for “No match found.”
      </p>

      <H2>Artist and Album artist</H2>

      <Pull>One files it, the other describes it.</Pull>

      <p>
        That is the title of the Artist field&apos;s help, and it is the one notion to take away from this guide. The{" "}
        <strong>Album artist</strong>&#32;is the name the album is filed under: it groups the tracks together and puts
        the album on that artist&apos;s page. It gets the main artist, even when some tracks have guests. The{" "}
        <strong>Artist</strong>&#32;says who plays this particular track, guests included: it is what playback shows and
        what search looks at. The album stays filed under “X” even when one track is played by “X feat. …”.
      </p>

      <p>
        And that is why “album filed under X” cannot be edited from a track&apos;s drawer. Not an oversight: an album is
        grouped by the pair of album artist and album title. Writing that field from a single track would spin the track
        off into an album of its own, silently cutting the record in two. To rename an album&apos;s artist, go through{" "}
        <a href={guidePath(guideById("edit-album"), "en")}>the album&apos;s modal</a>, where the field applies to every
        track at once.
      </p>

      <H2>Autocompletion</H2>

      <p>
        Artist, Album and Genre suggest as you type, and the vocabulary is your library: every artist, album title and
        genre already stored. Nothing is asked of the network. The list shows at most eight entries, each with a detail
        (the artist for an album, the family for a genre) and the number of tracks carrying it; albums show their cover.
        When what you typed matches no existing entry, a final row says so in as many words: “New value”. The list
        always answers the question that matters: what is this going to write?
      </p>

      <p>
        On the keyboard: ↓ and ↑ to browse, Enter to pick, Esc to close the list. Nothing is highlighted by default, so
        Enter will never silently replace what you just typed. And this list is what keeps “AC/DC” and “ACDC” from
        becoming two artists: pick the existing entry instead of retyping the name.
      </p>

      <H2>While you edit</H2>

      <p>
        A modified field takes an indigo edge on its left, and its label gains a “↺” chip carrying the old value: one
        click restores it. That is the only mark a change leaves. A counted field that is empty sits amber, with a
        dashed border and a placeholder. The “N changes” counter lives in the header.
      </p>

      <p>
        What counts as a change is computed exactly the way saving is: surrounding spaces are ignored, a non-numeric
        year is ignored, a fully emptied field means “absent”. So the counter can never announce a change that saving
        would not write.
      </p>

      <H2>Saving</H2>

      <p>
        The “Save” button, or <strong>⌘S / Ctrl+S</strong>&#32;to save without closing. Only the modified fields go out:
        the rest is not rewritten. On disk, this is what happens:
      </p>

      <ul>
        <li>The tags are written into the file.</li>
        <li>
          If you changed the Album, the file is moved within the tree (Album artist / Album / No. Title): the index and
          the disk are never allowed to disagree. The archived high-definition cover moves along with it.
        </li>
        <li>
          The “Match to review” flag is cleared if you corrected Title, Artist, Album artist or Album: you have ruled,
          the question is answered.
        </li>
        <li>The app notes that this field was edited by hand, which it will use to avoid overwriting it later.</li>
      </ul>

      <p>
        One trick the interface writes nowhere: the genre accepts several values separated by a semicolon, “Rock;
        Metal”.
      </p>

      <p>
        On failure, the message is a guarantee: “No file was touched — your changes are kept.” Nothing is half-written,
        and you can try again.
      </p>

      <H2>Closing with pending changes</H2>

      <p>
        The three closing gestures (the cross, a click on the backdrop, Esc) trigger the same guard: “Discard your
        changes?”, with the count of what would be lost. Three ways out: “Keep editing”, “Discard” in red, and “Save” as
        the primary button, because it is almost always the real answer.
      </p>

      <H2>Re-matching</H2>

      <p>
        “Re-match” re-runs the identification: Sonarche queries MusicBrainz again from the file&apos;s acoustic
        fingerprint, the audio itself rather than its name, then rewrites every tag it recognises. The right moment is
        before your manual corrections, never after: a re-match running behind you also rewrites what you just fixed,
        and the app&apos;s help says exactly that.
      </p>

      <p>
        By default a confirmation shows up (“Re-run the identification?”), with a “Don&apos;t ask me again” switch, the
        same preference as Settings → Metadata → “Ask before a re-match”. The button is off in two cases, and the
        tooltip says which: changes are pending (a re-match would overwrite them), or the track sits in a collection
        (re-identifying it would send it back to its original record).
      </p>

      <p>
        The result lands in the feedback line: “Metadata updated.” or “No match found.”, and the drawer refreshes itself
        with the new values. One prerequisite: an AcoustID key configured in Settings → API keys, free at acoustid.org.{" "}
        <a href={guidePath(guideById("getting-started"), "en")}>The getting-started guide</a>&#32;explains why it is
        worth the minute it takes.
      </p>

      <H2>The neighbouring actions, in the ⋯ menu</H2>

      <ul>
        <li>
          <strong>Add to a playlist.</strong>
        </li>
        <li>
          <strong>Move to an album</strong>: refiles the track elsewhere. The file follows on disk, but the track&apos;s
          artist, genre and year stay as they are. You can aim at an existing album or create a collection, and a toast
          offers “Undo” right after.
        </li>
        <li>
          <strong>Delete track</strong>: removes it from the library and deletes the file from disk. Irreversible, which
          is why the dialog is red.
        </li>
      </ul>

      <H2>When something jams</H2>

      <ul>
        <li>
          <strong>“I typed a year, nothing gets saved.”</strong>&#32;The value is not a number: enter four digits,
          anything else is ignored as a precaution.
        </li>
        <li>
          <strong>“I empty the year or the track number, it comes back as zero.”</strong>&#32;A fully emptied field
          means “absent”, which beets stores as 0. Normal behaviour.
        </li>
        <li>
          <strong>“My album split in two.”</strong>&#32;The album artist differs from one track to the next. Open{" "}
          <a href={guidePath(guideById("edit-album"), "en")}>the album&apos;s modal</a>&#32;and unify “Album artist”.
        </li>
        <li>
          <strong>“I have the same artist twice, AC/DC and ACDC.”</strong>&#32;Two spellings. Go through the suggestion
          list instead of retyping, and fix the wrong spelling on every affected track.
        </li>
        <li>
          <strong>“My genre falls under Other.”</strong>&#32;The genre is valid but the tree does not know it. Write a
          known genre, or visit the Genres page and “File under…” to give it a family.
        </li>
        <li>
          <strong>“The family will not change.”</strong>&#32;It is computed from the genre: you edit the genre, never
          the family.
        </li>
        <li>
          <strong>“My corrections vanished.”</strong>&#32;A re-match ran after them. Redo the fix, and re-match before
          your touch-ups next time.
        </li>
        <li>
          <strong>“The Re-match button is gray.”</strong>&#32;Changes are pending, or the track is in a collection. The
          tooltip says which of the two.
        </li>
        <li>
          <strong>“Nothing got saved.”</strong>&#32;Writing the tag failed, a locked or read-only file for instance. The
          message guarantees no file was touched: try again.
        </li>
        <li>
          <strong>“The track wears the no audio badge.”</strong>&#32;Its tags are still editable; only playback is off
          the table.
        </li>
      </ul>
    </>
  );
}
