export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      <div className="bg-radial-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="bg-grid pointer-events-none absolute inset-0 -z-20 opacity-40" />

      <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-32 lg:px-10">
        <p className="font-mono text-xs tracking-[0.2em] text-fg-muted uppercase">
          Portfolio · In development
        </p>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] font-semibold tracking-tight text-fg-primary sm:text-7xl lg:text-8xl">
          Leo Rossetti
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl">
          Full-stack developer. Ships products, not prototypes.
          <br />
          <span className="text-accent-secondary">TypeScript</span> ·{" "}
          <span className="text-accent-secondary">React</span> ·{" "}
          <span className="text-accent-secondary">Next.js</span> ·{" "}
          <span className="text-accent-secondary">React Native</span>
        </p>

        <div className="mt-12 flex flex-wrap gap-3">
          <span className="border-border-subtle bg-bg-elevated text-fg-muted inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs">
            <span className="bg-accent-primary size-1.5 animate-pulse rounded-full" />
            Phase 1 · Foundations
          </span>
        </div>
      </section>
    </main>
  );
}
