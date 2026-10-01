import { fishBow } from "./bow";
import { createScript, type Crew } from "./script";
import { AHEAD, haul, shoot, trawlRun } from "./stern";

/** World units a second, astern back to the start of a run. */
const ASTERN = 0.75;
/** Catch the pound holds before the trawl waits for the crew (crew.ts) to clear it. */
const POUND_ROOM = 8;

/*
 * The vessel steams across the frame and back. At one end it shoots the trawl and sweeps a shoal;
 * at the other it stops, hauls the net over the pound while the bow crane fishes, then heads back,
 * stowing on the way.
 */
export function createVoyage(crew: Crew) {
  const script = createScript(crew);
  const { wait, steam } = script;
  let running = true;

  async function voyage() {
    let bow: Promise<void> = Promise.resolve();
    let stern: Promise<void> = Promise.resolve();
    await wait(0.4);
    while (running) {
      const r = crew.roam();
      await steam(r, ASTERN);
      await stern;
      const room = Math.max(0, Math.min(5, POUND_ROOM - crew.landed.length));
      if (room > 1) {
        await shoot(crew, script);
        const caught = await trawlRun(crew, script, -r, room);
        stern = haul(crew, script, caught);
      } else {
        await steam(-r, AHEAD);
      }
      // Stopped: the trawl comes in while the crane fishes.
      await bow;
      const box = crew.cargo.pick("crane");
      if (box) {
        box.busy = true;
        const stow = await fishBow(crew, script, box);
        bow = stow();
      } else {
        await wait(2);
      }
    }
  }

  return {
    start() {
      voyage();
    },
    dispose() {
      running = false;
      script.ctx.revert();
    },
  };
}
