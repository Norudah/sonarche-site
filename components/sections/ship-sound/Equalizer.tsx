import styles from "./ship-sound.module.css";

export function Equalizer({ playing, tone }: { playing: boolean; tone: string }) {
  return (
    <span aria-hidden className="flex h-3.5 items-end gap-0.5 xl:h-[9px] xl:gap-[1.5px]">
      {["-0.6s", "-0.3s", "0s", "-0.45s"].map((delay) => (
        <span
          key={delay}
          className={`${styles.eqBar} ${playing ? "" : styles.paused} ${tone} h-full w-0.75 origin-bottom rounded-[1px] xl:w-[2px]`}
          style={{ animationDelay: delay }}
        />
      ))}
    </span>
  );
}
