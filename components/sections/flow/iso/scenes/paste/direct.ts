import { shift } from "@/components/sections/flow/iso/iso";
import { animateSea } from "@/components/sections/flow/iso/sea";
import type { Cast } from "@/components/sections/flow/iso/useDiorama";

import { CELLS, CHIP, FISH, FLOTSAM, ROW_STEP, RUNG, swell, WIN } from "./layout";

/* The composer locks on to one link, draws it up a beam, plugs it in, lines up the voyage, folds
   away the track already aboard, and lets the link go back into the stream. */
export function directPaste({ q, intro, loop, start, onFrame }: Cast) {
  const [chip] = q("[data-chip]");
  const [bob] = q("[data-bob]");
  const [beam] = q("[data-beam]");
  const rungs = q("[data-rung]");
  const [lock] = q("[data-lock]");
  const burst = q("[data-burst]");
  const [halo] = q("[data-halo]");
  const [url] = q("[data-url]");
  const [caret] = q("[data-caret]");
  const [button] = q("[data-go]");
  const [focus] = q("[data-focus]");
  const rows = q("[data-row]");
  const dup = rows[2];
  const last = rows[3];
  const [badge] = q("[data-badge]");

  const sea = animateSea({
    bars: q("[data-sea] [data-bar-h]"),
    cells: CELLS,
    swell,
    intro,
    onFrame,
    floaters: q("[data-float]").map((el, i) => ({ el, x: FLOTSAM[i].x, y: FLOTSAM[i].y, lift: -6 })),
  });

  /* The first frame: an empty composer, the link riding the water. */
  const down = shift(FISH.x - (WIN.x + CHIP.d / 2), FISH.y - (CHIP.y + CHIP.w / 2), -CHIP.z + 4);
  start(chip, { x: down.x, y: down.y, scale: 0.8, transformOrigin: "50% 50%" });
  start(bob, { y: 0 });
  start(url, { scaleX: 0, transformOrigin: "0% 50%" });
  start([caret, focus, badge, beam, lock, halo], { opacity: 0 });
  start(burst, { opacity: 0, x: 0, y: 0 });
  start(rungs, { opacity: 0, x: 0, y: 0 });
  start(rows, { opacity: 0, x: -10 });
  start(dup, { scaleY: 1, transformOrigin: "50% 0%" });
  start(last, { y: ROW_STEP });

  /* Riding the swell until it is chosen. */
  loop.to(bob, { y: -3, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: 3 }, 0);

  /* Locked on: rings on the water, the beam comes down. */
  loop.fromTo(
    lock,
    { scale: 0.4, opacity: 0, transformOrigin: "50% 50%" },
    {
      keyframes: { opacity: [0, 1, 0], scale: [0.4, 1.3, 1.8] },
      duration: 0.8,
      repeat: 1,
      ease: "power1.out",
      immediateRender: false,
    },
    0.3,
  );
  loop.to(beam, { keyframes: { opacity: [0, 0.9, 0.3, 1] }, duration: 0.45, ease: "none" }, 0.8);
  rungs.forEach((rung, i) => {
    loop.to(
      rung,
      { keyframes: { opacity: [0, 0.9, 0] }, x: RUNG.x, y: RUNG.y, duration: 0.9, repeat: 1, ease: "none" },
      1.0 + i * 0.3,
    );
  });

  /* Taken: the water rings, pixels scatter, and it rides the beam up. */
  const lift = 1.9;
  loop.call(() => sea.splash(FISH.x, FISH.y, 18), [], lift);
  loop.to(
    burst,
    {
      keyframes: { opacity: [0, 1, 0] },
      x: (i) => Math.round(Math.cos(i * 1.3) * (26 + (i % 3) * 9)),
      y: (i) => -22 - (i % 4) * 11,
      duration: 0.9,
      ease: "power2.out",
    },
    lift,
  );
  loop.to(chip, { x: 0, duration: 1.15, ease: "power2.inOut" }, lift);
  loop.to(chip, { y: 0, scale: 1, duration: 1.15, ease: "power3.inOut" }, lift);
  loop.to(beam, { opacity: 0, duration: 0.4 }, lift + 1.0);
  loop.to(chip, { scaleX: 1.14, scaleY: 0.84, duration: 0.08, ease: "power1.out" }, lift + 1.15);
  loop.to(chip, { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.35)" }, lift + 1.23);
  loop.to(halo, { keyframes: { opacity: [0, 1, 0] }, duration: 0.9, ease: "power1.out" }, lift + 1.15);
  loop.to(focus, { opacity: 1, duration: 0.2 }, lift + 1.15);

  /* The address fills in, the caret settles at its end and blinks. */
  const typed = lift + 1.3;
  loop.to(url, { scaleX: 1, duration: 0.45, ease: "steps(9)" }, typed);
  loop.set(caret, { opacity: 1 }, typed + 0.45);
  loop.to(caret, { opacity: 0, duration: 0.01, repeat: 3, yoyo: true, repeatDelay: 0.24 }, typed + 0.7);

  /* Go. The voyage lines up, one row per track. */
  const go = typed + 1.35;
  loop.to(button, { scale: 0.84, duration: 0.1, ease: "power2.in", transformOrigin: "50% 50%" }, go);
  loop.to(button, { scale: 1, duration: 0.55, ease: "elastic.out(1.2, 0.4)" }, go + 0.1);
  loop.to([focus, caret], { opacity: 0, duration: 0.4 }, go + 0.1);
  loop.to(rows, { opacity: 1, x: 0, duration: 0.55, stagger: 0.14, ease: "power3.out" }, go + 0.15);

  /* Already aboard: marked, dimmed, folded away; the next row closes the gap. */
  const skip = go + 1.1;
  loop.fromTo(
    badge,
    { scale: 0.4, transformOrigin: "50% 50%" },
    { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)", immediateRender: false },
    skip,
  );
  loop.to(dup, { opacity: 0.35, duration: 0.3 }, skip + 0.35);
  loop.to(dup, { scaleY: 0, opacity: 0, duration: 0.45, ease: "power3.in" }, skip + 0.8);
  loop.to(last, { y: 0, duration: 0.55, ease: "power3.inOut" }, skip + 1.05);

  /* Held, then let go: the rows clear and the link drops back into the stream. */
  const out = skip + 3.6;
  loop.to(rows, { opacity: 0, x: 8, duration: 0.4, stagger: 0.06, ease: "power2.in" }, out);
  loop.to(url, { scaleX: 0, duration: 0.3, ease: "power2.in" }, out + 0.2);
  loop.to(chip, { x: down.x, duration: 0.75, ease: "power1.in" }, out + 0.4);
  loop.to(chip, { y: down.y, scale: 0.8, duration: 0.75, ease: "power3.in" }, out + 0.4);
  loop.call(() => sea.splash(FISH.x, FISH.y, 12), [], out + 1.15);
  loop.set({}, {}, out + 1.9);
}
