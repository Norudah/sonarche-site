import styles from "./iso-scene.module.css";

/*
 * The four isometric scenes of the flow, ported from the mockup's IsoScene
 * component (docs/designs/IsoScene.dc.html).
 *
 * The geometry is the design's, verbatim — these are drawings, and redrawing
 * them by hand would only introduce drift. Two things changed on the way in:
 * the one colour that has to agree with the buttons and kickers on the same
 * screen is now `var(--accent)` rather than the mockup's older indigo, and the
 * inline `animation:` shorthands became module classes, because a CSS module
 * hashes @keyframes names and an inline reference would resolve to nothing.
 *
 * Everything animates transform, opacity or stroke-dashoffset. The module's
 * last block stops all of it under `prefers-reduced-motion` — the scenes keep
 * their composition, they simply stand still.
 *
 * Drawn on a 560×420 stage and scaled to whatever slot they are given.
 */

type IsoSceneProps = {
  /** 0–3, matching the flow's four steps. */
  step: number;
  className?: string;
};

export function IsoScene({ step, className }: IsoSceneProps) {
  const Scene = SCENES[step] ?? SCENES[0];

  return (
    <div aria-hidden className={className}>
      <div className="relative aspect-[4/3] w-full">
        <Scene />
      </div>
    </div>
  );
}

/* Step 01 — a link dropped into the composer, and the queue lining up. */
function PasteScene() {
  return (
    <svg viewBox="0 0 560 420" fill="none" className="absolute inset-0 h-full w-full">
      <ellipse
        cx="280"
        cy="352"
        rx="210"
        ry="52"
        fill="oklch(0.35 0.06 277 / 0.07)"
        className={styles.a0}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></ellipse>
      <path d="M280,340 L470,245 L280,150 L90,245 Z" fill="oklch(0.965 0.012 277)"></path>
      <path d="M90,245 L280,340 L280,364 L90,269 Z" fill="oklch(0.89 0.03 277)"></path>
      <path d="M470,245 L280,340 L280,364 L470,269 Z" fill="oklch(0.83 0.05 277)"></path>
      <g className={styles.a1}>
        <path d="M300,165 L314,172 L314,62 L300,55 Z" fill="oklch(0.88 0.03 277)"></path>
        <path
          d="M150,240 L300,165 L300,55 L150,130 Z"
          fill="white"
          stroke="oklch(0.85 0.02 277)"
          strokeWidth="2"
        ></path>
        <path
          d="M168,135 L282,78 L282,100 L168,157 Z"
          fill="oklch(0.97 0.008 277)"
          stroke="oklch(0.9 0.01 277)"
          strokeWidth="1.5"
        ></path>
        <circle cx="181" cy="139" r="5" fill="oklch(0.52 0.21 27)"></circle>
        <path d="M194,127 L262,93" stroke="oklch(0.88 0.02 277)" strokeWidth="7" strokeLinecap="round"></path>
        <path
          d="M268,90 L268,102"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          className={styles.a2}
        ></path>
        <path d="M168,180 L282,123" stroke="oklch(0.93 0.01 277)" strokeWidth="6" strokeLinecap="round"></path>
        <path d="M168,200 L252,158" stroke="oklch(0.93 0.01 277)" strokeWidth="6" strokeLinecap="round"></path>
      </g>
      <path
        d="M310,118 C372,102 424,148 418,205"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="6 8"
        className={styles.a3}
      ></path>
      <path d="M418,205 L409,193 M418,205 L424,191" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"></path>
      <g className={styles.a4} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path d="M348,124 L390,103 L390,120 L348,141 Z" fill="white" stroke="var(--accent)" strokeWidth="2"></path>
        <circle cx="358" cy="126" r="4" fill="oklch(0.52 0.21 27)"></circle>
        <path d="M366,124 L382,116" stroke="oklch(0.86 0.03 277)" strokeWidth="3" strokeLinecap="round"></path>
      </g>
      <ellipse
        cx="415"
        cy="222"
        rx="38"
        ry="15"
        fill="oklch(0.58 0.21 277 / 0.14)"
        className={styles.a5}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></ellipse>
      <path
        d="M415,247 L465,222 L415,197 L365,222 Z"
        fill="oklch(0.95 0.03 277 / 0.6)"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeDasharray="8 6"
        className={styles.a6}
      ></path>
      <path
        d="M415,247 L465,222 L415,197 L365,222 Z"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        className={styles.a7}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></path>
      <g className={styles.a8} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="406" cy="222" r="4.5" fill="var(--accent)"></circle>
        <path
          d="M410.5,222 L410.5,208 L418,205"
          stroke="var(--accent)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        ></path>
      </g>
      <g className={styles.a9} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx="426" cy="228" r="3.5" fill="oklch(0.58 0.21 277 / 0.75)"></circle>
        <path
          d="M429.5,228 L429.5,217 L435,215"
          stroke="oklch(0.58 0.21 277 / 0.75)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        ></path>
      </g>
    </svg>
  );
}

/* Step 02 — crates hoisted aboard, one after another, into the hold. */
function AboardScene() {
  return (
    <svg viewBox="0 0 560 420" fill="none" className="absolute inset-0 h-full w-full">
      <defs>
        <clipPath id="iso-board-clip">
          <path d="M130,272 L370,152 L425,180 L185,300 Z"></path>
        </clipPath>
      </defs>
      <ellipse
        cx="280"
        cy="352"
        rx="210"
        ry="52"
        fill="oklch(0.35 0.06 277 / 0.07)"
        className={styles.a0}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></ellipse>
      <path d="M280,340 L470,245 L280,150 L90,245 Z" fill="oklch(0.965 0.012 277)"></path>
      <path d="M90,245 L280,340 L280,364 L90,269 Z" fill="oklch(0.89 0.03 277)"></path>
      <path d="M470,245 L280,340 L280,364 L470,269 Z" fill="oklch(0.83 0.05 277)"></path>
      <path d="M130,272 L370,152 L425,180 L185,300 Z" fill="white" stroke="oklch(0.87 0.02 277)" strokeWidth="2"></path>
      <path d="M130,272 L185,300 L185,318 L130,290 Z" fill="oklch(0.89 0.03 277)"></path>
      <path d="M185,300 L425,180 L425,198 L185,318 Z" fill="oklch(0.83 0.05 277)"></path>
      <g clipPath="url(#iso-board-clip)">
        <path d="M150,300 L250,250 L285,268 L185,318 Z" fill="oklch(0.58 0.21 277 / 0.1)" className={styles.a10}></path>
      </g>
      <g className={styles.a11}>
        <path d="M205,231 L231,244 L205,257 L179,244 Z" fill="oklch(0.78 0.1 277)"></path>
        <path d="M179,244 L205,257 L205,285 L179,272 Z" fill="oklch(0.55 0.17 277)"></path>
        <path d="M205,257 L231,244 L231,272 L205,285 Z" fill="oklch(0.48 0.15 277)"></path>
        <g className={styles.a12} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="205" cy="192" r="11" fill="oklch(0.52 0.15 157)"></circle>
          <path
            d="M199.5,192 L203.5,196 L211,188"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </g>
      <g className={styles.a13}>
        <path d="M275,196 L301,209 L275,222 L249,209 Z" fill="oklch(0.78 0.1 277)"></path>
        <path d="M249,209 L275,222 L275,250 L249,237 Z" fill="oklch(0.55 0.17 277)"></path>
        <path d="M275,222 L301,209 L301,237 L275,250 Z" fill="oklch(0.48 0.15 277)"></path>
        <g className={styles.a14} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="275" cy="157" r="11" fill="oklch(0.52 0.15 157)"></circle>
          <path
            d="M269.5,157 L273.5,161 L281,153"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></path>
        </g>
      </g>
      <g className={styles.a15}>
        <path d="M345,161 L371,174 L345,187 L319,174 Z" fill="oklch(0.93 0.008 277)"></path>
        <path d="M319,174 L345,187 L345,215 L319,202 Z" fill="oklch(0.85 0.015 277)"></path>
        <path d="M345,187 L371,174 L371,202 L345,215 Z" fill="oklch(0.8 0.02 277)"></path>
        <circle
          cx="345"
          cy="122"
          r="11"
          stroke="var(--accent)"
          strokeWidth="2.5"
          fill="white"
          strokeDasharray="38 14"
          strokeLinecap="round"
          className={styles.a16}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        ></circle>
      </g>
      <path
        d="M385,175 C420,180 435,192 442,206"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="5 7"
        className={styles.a3}
      ></path>
      <path d="M442,206 L430,201 M442,206 L440,193" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"></path>
      <g className={styles.a17} style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}>
        <path
          d="M455,222 L495,242 L455,262 L415,242 Z"
          fill="none"
          stroke="oklch(0.5 0.1 277)"
          strokeWidth="2.5"
        ></path>
        <path
          d="M415,242 L415,266 L455,286 L455,262"
          stroke="oklch(0.5 0.1 277)"
          strokeWidth="2.5"
          fill="oklch(0.94 0.03 277 / 0.7)"
        ></path>
        <path
          d="M455,286 L495,266 L495,242"
          stroke="oklch(0.5 0.1 277)"
          strokeWidth="2.5"
          fill="oklch(0.9 0.04 277 / 0.7)"
        ></path>
      </g>
    </svg>
  );
}

/* Step 03 — the waveform read, and the fingerprint answered. */
function FingerprintScene() {
  return (
    <svg viewBox="0 0 560 420" fill="none" className="absolute inset-0 h-full w-full">
      <ellipse
        cx="280"
        cy="352"
        rx="210"
        ry="52"
        fill="oklch(0.35 0.06 277 / 0.07)"
        className={styles.a0}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></ellipse>
      <path d="M280,340 L470,245 L280,150 L90,245 Z" fill="oklch(0.965 0.012 277)"></path>
      <path d="M90,245 L280,340 L280,364 L90,269 Z" fill="oklch(0.89 0.03 277)"></path>
      <path d="M470,245 L280,340 L280,364 L470,269 Z" fill="oklch(0.83 0.05 277)"></path>
      <path
        d="M202,235 L202,272 A78 30 0 0 0 358 272 L358,235"
        fill="oklch(0.9 0.02 277)"
        stroke="oklch(0.85 0.02 277)"
        strokeWidth="2"
      ></path>
      <ellipse cx="280" cy="233" rx="78" ry="30" fill="white" stroke="oklch(0.85 0.02 277)" strokeWidth="2"></ellipse>
      <ellipse
        cx="280"
        cy="230"
        rx="56"
        ry="21"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="26 10"
        fill="none"
        className={styles.a18}
      ></ellipse>
      <ellipse
        cx="280"
        cy="230"
        rx="38"
        ry="14"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="16 8"
        fill="none"
        className={styles.a19}
      ></ellipse>
      <ellipse
        cx="280"
        cy="230"
        rx="21"
        ry="8"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="9 6"
        fill="none"
        className={styles.a20}
      ></ellipse>
      <ellipse cx="280" cy="230" rx="5" ry="2.5" fill="var(--accent)"></ellipse>
      <g transform="translate(280,230) scale(1,0.375)">
        <g className={styles.a21}>
          <circle cx="66" cy="0" r="8" fill="oklch(0.58 0.21 277 / 0.55)"></circle>
        </g>
      </g>
      <ellipse
        cx="280"
        cy="230"
        rx="40"
        ry="15"
        stroke="oklch(0.58 0.21 277 / 0.55)"
        strokeWidth="2"
        fill="none"
        className={styles.a22}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></ellipse>
      <ellipse
        cx="280"
        cy="230"
        rx="40"
        ry="15"
        stroke="oklch(0.58 0.21 277 / 0.55)"
        strokeWidth="2"
        fill="none"
        className={styles.a23}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></ellipse>
      <ellipse
        cx="280"
        cy="230"
        rx="40"
        ry="15"
        stroke="oklch(0.58 0.21 277 / 0.55)"
        strokeWidth="2"
        fill="none"
        className={styles.a24}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></ellipse>
      <path
        d="M300,112 L428,72"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="6 8"
        className={styles.a3}
      ></path>
      <path d="M428,72 L414,72 M428,72 L419,82" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"></path>
      <circle r="4" fill="var(--accent)">
        <animateMotion dur="1.8s" repeatCount="indefinite" path="M300,112 L428,72"></animateMotion>
      </circle>
      <circle r="3" fill="oklch(0.58 0.21 277 / 0.6)">
        <animateMotion dur="1.8s" begin="0.9s" repeatCount="indefinite" path="M300,112 L428,72"></animateMotion>
      </circle>
      <g className={styles.a25} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <path
          d="M438,60 a16,16 0 0 1 31,-5 a13,13 0 0 1 5,25 l-42,0 a12,12 0 0 1 6,-20"
          stroke="oklch(0.7 0.08 277)"
          strokeWidth="2"
          fill="oklch(0.975 0.008 277)"
          strokeLinejoin="round"
        ></path>
      </g>
      <text
        x="460"
        y="104"
        textAnchor="middle"
        fontFamily="ui-monospace,Menlo,monospace"
        fontSize="11"
        fill="oklch(0.5 0.1 277)"
      >
        AcoustID
      </text>
    </svg>
  );
}

/* Step 04 — the tags written, stamped, and filed. */
function NamedScene() {
  return (
    <svg viewBox="0 0 560 420" fill="none" className="absolute inset-0 h-full w-full">
      <defs>
        <clipPath id="iso-card-clip">
          <path d="M195,255 L335,185 L335,40 L195,110 Z"></path>
        </clipPath>
      </defs>
      <ellipse
        cx="280"
        cy="352"
        rx="210"
        ry="52"
        fill="oklch(0.35 0.06 277 / 0.07)"
        className={styles.a26}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></ellipse>
      <path d="M280,340 L470,245 L280,150 L90,245 Z" fill="oklch(0.965 0.012 277)"></path>
      <path d="M90,245 L280,340 L280,364 L90,269 Z" fill="oklch(0.89 0.03 277)"></path>
      <path d="M470,245 L280,340 L280,364 L470,269 Z" fill="oklch(0.83 0.05 277)"></path>
      <g className={styles.a27}>
        <path d="M335,185 L349,192 L349,47 L335,40 Z" fill="oklch(0.88 0.03 277)"></path>
        <path
          d="M195,255 L335,185 L335,40 L195,110 Z"
          fill="white"
          stroke="oklch(0.85 0.02 277)"
          strokeWidth="2"
        ></path>
        <path d="M210,120 L320,65 L320,125 L210,180 Z" fill="oklch(0.93 0.04 277)"></path>
        <path
          d="M250,150 L250,112 L290,98 L290,134"
          stroke="var(--accent)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <circle cx="244" cy="150" r="5" fill="var(--accent)"></circle>
        <circle cx="284" cy="134" r="5" fill="var(--accent)"></circle>
        <path d="M210,198 L320,143" stroke="oklch(0.85 0.06 277)" strokeWidth="8" strokeLinecap="round"></path>
        <path d="M210,216 L290,176" stroke="oklch(0.92 0.015 277)" strokeWidth="6" strokeLinecap="round"></path>
        <path d="M210,232 L305,184.5" stroke="oklch(0.92 0.015 277)" strokeWidth="6" strokeLinecap="round"></path>
        <g clipPath="url(#iso-card-clip)">
          <path
            d="M180,110 L350,25 L350,45 L180,130 Z"
            fill="oklch(0.58 0.21 277 / 0.13)"
            className={styles.a28}
          ></path>
        </g>
      </g>
      <g className={styles.a29}>
        <circle cx="195" cy="150" r="4" fill="var(--accent)"></circle>
        <path
          d="M195,150 L118,120"
          stroke="oklch(0.78 0.05 277)"
          strokeWidth="1.5"
          strokeDasharray="210"
          className={styles.a30}
        ></path>
        <text
          x="110"
          y="116"
          textAnchor="end"
          fontFamily="ui-monospace,Menlo,monospace"
          fontSize="12"
          fill="oklch(0.4 0.1 277)"
        >
          Titre
        </text>
      </g>
      <g className={styles.a31}>
        <circle cx="195" cy="200" r="4" fill="var(--accent)"></circle>
        <path
          d="M195,200 L112,205"
          stroke="oklch(0.78 0.05 277)"
          strokeWidth="1.5"
          strokeDasharray="210"
          className={styles.a32}
        ></path>
        <text
          x="104"
          y="209"
          textAnchor="end"
          fontFamily="ui-monospace,Menlo,monospace"
          fontSize="12"
          fill="oklch(0.4 0.1 277)"
        >
          Artiste
        </text>
      </g>
      <g className={styles.a33}>
        <circle cx="195" cy="235" r="4" fill="var(--accent)"></circle>
        <path
          d="M195,235 L122,285"
          stroke="oklch(0.78 0.05 277)"
          strokeWidth="1.5"
          strokeDasharray="210"
          className={styles.a34}
        ></path>
        <text
          x="114"
          y="292"
          textAnchor="end"
          fontFamily="ui-monospace,Menlo,monospace"
          fontSize="12"
          fill="oklch(0.4 0.1 277)"
        >
          Tags
        </text>
      </g>
      <g className={styles.a35}>
        <circle cx="335" cy="90" r="4" fill="var(--accent)"></circle>
        <path
          d="M335,90 L420,62"
          stroke="oklch(0.78 0.05 277)"
          strokeWidth="1.5"
          strokeDasharray="210"
          className={styles.a36}
        ></path>
        <text x="428" y="60" fontFamily="ui-monospace,Menlo,monospace" fontSize="12" fill="oklch(0.4 0.1 277)">
          Album
        </text>
      </g>
      <g className={styles.a37}>
        <circle cx="342" cy="142" r="4" fill="var(--accent)"></circle>
        <path
          d="M342,142 L428,132"
          stroke="oklch(0.78 0.05 277)"
          strokeWidth="1.5"
          strokeDasharray="210"
          className={styles.a38}
        ></path>
        <text x="436" y="136" fontFamily="ui-monospace,Menlo,monospace" fontSize="12" fill="oklch(0.4 0.1 277)">
          Genre
        </text>
      </g>
      <g className={styles.a39}>
        <circle cx="349" cy="190" r="4" fill="var(--accent)"></circle>
        <path
          d="M349,190 L432,202"
          stroke="oklch(0.78 0.05 277)"
          strokeWidth="1.5"
          strokeDasharray="210"
          className={styles.a40}
        ></path>
        <text x="440" y="206" fontFamily="ui-monospace,Menlo,monospace" fontSize="12" fill="oklch(0.4 0.1 277)">
          Piste
        </text>
      </g>
      <g className={styles.a41}>
        <circle cx="300" cy="230" r="4" fill="var(--accent)"></circle>
        <path
          d="M300,230 L412,282"
          stroke="oklch(0.78 0.05 277)"
          strokeWidth="1.5"
          strokeDasharray="210"
          className={styles.a42}
        ></path>
        <text x="420" y="288" fontFamily="ui-monospace,Menlo,monospace" fontSize="12" fill="oklch(0.4 0.1 277)">
          Année
        </text>
      </g>
      <path
        d="M370,26 L370,42 M362,34 L378,34"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={styles.a43}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      ></path>
    </svg>
  );
}

const SCENES = [PasteScene, AboardScene, FingerprintScene, NamedScene];
