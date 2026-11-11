export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className={`logo${light ? ' logo--light' : ''}`}>
      <img
        src={light ? '/logo-horizontal-light.svg' : '/logo-horizontal.svg'}
        alt="Valance home"
        width={430}
        height={110}
      />
    </a>
  );
}
