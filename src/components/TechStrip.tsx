const TECH = ['React', 'Next.js', 'Node.js', 'TypeScript', 'React Native', 'Flutter', 'Python', 'AWS', 'OpenAI', 'Claude', 'n8n', 'PostgreSQL'];

export default function TechStrip() {
  return (
    <section className="logos" aria-label="Technologies we work with">
      <p className="logos__label">Technologies we work with</p>
      <div className="marquee">
        <div className="marquee__track">
          {[...TECH, ...TECH].map((n, i) => (
            <span key={i} aria-hidden={i >= TECH.length || undefined}>{n}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
