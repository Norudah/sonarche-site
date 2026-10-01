export function DraftBadge({ label }: { label: string }) {
  return (
    <span className="border-warning/40 text-warning rounded-full border px-2 py-0.5 text-[0.625rem]">{label}</span>
  );
}
