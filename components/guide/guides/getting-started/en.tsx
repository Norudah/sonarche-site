import { postById, postPath } from "@/lib/blog";

import { Lead } from "@/components/reading/Prose";

/*
 * Getting started, in English. Its French counterpart is ./fr.tsx.
 *
 * DRAFT — see `draft: true` in lib/guide.ts. What it needs before it ships:
 *   1. SHOT — the macOS warning as it really appears (Romain took one on
 *      2026-07-28, in the app repo).
 *   2. SHOT — System Settings › Privacy & Security, the Sonarche line and its
 *      "Open Anyway" button.
 *   3. SHOT — the first-run panel, once the environment is built.
 *   4. Re-read against the version of the day and bump `appVersion`.
 * The places they go are marked SHOT below.
 *
 * Spaces around inline tags: see the comment at the head of
 * components/blog/posts/wrong-tags/en.tsx — both rules, and why.
 */

export function GettingStartedEn() {
  return (
    <>
      <Lead>
        Sonarche is signed but not notarised — that part needs a paid Apple developer account. So macOS and Windows both
        show a warning the first time you open it, and only the first time. Here is the whole path, from the download to
        your first library.
      </Lead>

      <h2>Picking the right file</h2>

      <p>
        Everything is on the releases page, and there is exactly one file to take per machine. The <code>.tar.gz</code>
        &#32;and <code>.sig</code>&#32;sitting beside it are the updater&apos;s plumbing — you do not need them.
      </p>

      <ul>
        <li>
          <strong>Mac, Apple Silicon (M1–M4)</strong>: <code>Sonarche_x.y.z_aarch64.dmg</code>
        </li>
        <li>
          <strong>Mac, Intel</strong>: <code>Sonarche_x.y.z_x64.dmg</code>
        </li>
        <li>
          <strong>Windows 10 or 11, 64-bit</strong>: <code>Sonarche_x.y.z_x64-setup.exe</code>
        </li>
      </ul>

      <p>
        Not sure which Mac you have? Apple menu → About This Mac: a line saying <em>Chip</em>&#32;means Apple Silicon.
        From a terminal, <code>uname -m</code>&#32;answers <code>arm64</code>&#32;or <code>x86_64</code>. Windows on ARM
        runs the x64 build under emulation.
      </p>

      <h2>Getting past the warning on macOS</h2>

      <p>
        On first launch macOS says it could not verify the app. <strong>Do not click the blue button</strong> — it
        offers to move it to the Trash.
      </p>

      {/* SHOT 1 — the macOS dialog, full column width. */}

      <ol>
        <li>Open Sonarche. At the dialog, click Done.</li>
        <li>
          Go to System Settings → Privacy &amp; Security and scroll to the bottom, to the Security section. A line about
          Sonarche is waiting there.
        </li>
        <li>Click Open Anyway, authenticate, then confirm with Open.</li>
      </ol>

      {/* SHOT 2 — System Settings, the Sonarche line and its button. */}

      <p>
        That line expires about an hour after the refused launch. If it is not there, open the app again and go back to
        Settings. You will not see this screen twice: later updates are written by the app&apos;s own updater, which
        does not mark files as quarantined.
      </p>

      <h2>Getting past the warning on Windows</h2>

      <p>
        SmartScreen shows &ldquo;Windows protected your PC&rdquo;, for the same reason: the installer is not signed by a
        paid certificate. Click More info, then Run anyway. The install is per-user, so nothing asks you to elevate —
        not at install, not at update.
      </p>

      <h2>The first run</h2>

      <p>
        The app opens on a short walkthrough that builds its environment: it unpacks the Python it carries, installs{" "}
        <code>yt-dlp</code>&#32;and <code>beets</code>&#32;into a virtual environment of its own, and asks you for an
        AcoustID key. Give it about fifteen seconds. No network access is needed — the packages travel inside the
        bundle.
      </p>

      <p>Your system Python is never touched, and nothing is installed outside the folder the app owns.</p>

      {/* SHOT 3 — the first-run panel, environment built. */}

      <h2>The AcoustID key, and why to bother</h2>

      <p>
        It is free, it takes a minute to request, and it is optional — but without it your tracks are tagged from
        whatever hints are available instead of being identified by their sound. That is the whole difference between a
        guessed name and a recognised one, and{" "}
        <a href={postPath(postById("wrong-tags"), "en")}>the journal has the long version</a>.
      </p>

      <p>
        Once entered, the key is kept in the OS keychain — never in a config file — and it never shows up in the
        interface again.
      </p>

      <h2>Where to go next</h2>

      <p>
        From here there are two ways in: point the app at folders you already own, or add tracks one at a time. Both run
        through the same chain — fingerprint, identify, tag, file — and end in the same tree of files.
      </p>
    </>
  );
}
