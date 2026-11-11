export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`logo${light ? ' logo--light' : ''}`} aria-label="Valance home">
      <img src="/logo.svg" alt="Valance" width={420} height={190} />
    </a>
  );
}
