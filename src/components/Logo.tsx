export default function Logo({ light = false, href = '#top' }: { light?: boolean; href?: string }) {
  return (
    <a href={href} className={`logo${light ? ' logo--light' : ''}`}>
      <img
        src={light ? '/logo-horizontal-light.svg' : '/logo-horizontal.svg'}
        alt="Valance home"
        width={430}
        height={110}
      />
    </a>
  );
}
