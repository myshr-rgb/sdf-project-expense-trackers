export default function Icon({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="material-symbols-outlined text-title-lg"
    >
      {name}
    </span>
  );
}
