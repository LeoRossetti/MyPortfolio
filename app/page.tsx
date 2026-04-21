import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative flex flex-1 flex-col">
        <div className="bg-radial-glow pointer-events-none absolute inset-0 -z-10" />
        <div className="bg-grid pointer-events-none absolute inset-0 -z-20 opacity-40" />

        <section
          id="home"
          className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 pt-32 pb-20 lg:px-10"
        >
          <p className="text-fg-muted font-mono text-xs tracking-[0.2em] uppercase">
            Portfolio · Phase 1 scaffold
          </p>
          <h1 className="font-display mt-6 text-5xl leading-[1.05] font-semibold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="from-fg-primary via-fg-primary bg-gradient-to-br to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Leo Rossetti
            </span>
          </h1>
          <p className="text-fg-muted mt-6 max-w-2xl text-lg leading-relaxed sm:text-xl">
            Full-stack dev. Ships products, not prototypes.
          </p>

          <div className="text-fg-muted mt-10 flex flex-wrap gap-3 font-mono text-xs">
            {[
              "TypeScript",
              "React",
              "Next.js",
              "React Native",
              "Node.js",
              "Python",
              "C#",
            ].map((tech) => (
              <span
                key={tech}
                className="border-border-subtle rounded-full border px-3 py-1.5 backdrop-blur"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-16 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--accent-primary)]/40 bg-[var(--accent-primary)]/10 px-4 py-2 font-mono text-xs">
            <span className="bg-accent-secondary size-1.5 animate-pulse rounded-full" />
            Foundations deployed · Hero &amp; sections coming next
          </div>
        </section>

        <Placeholder id="about" label="About" />
        <Placeholder id="services" label="Services" />
        <Placeholder id="projects" label="Projects" />
        <Placeholder id="experience" label="Experience" />
        <Placeholder id="contact" label="Contact" />
      </main>

      <Footer />
    </>
  );
}

function Placeholder({ id, label }: { id: string; label: string }) {
  return (
    <section
      id={id}
      className="mx-auto flex min-h-[60vh] w-full max-w-6xl flex-col justify-center px-6 py-20 lg:px-10"
    >
      <p className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase">
        {`// section`}
      </p>
      <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">
        {label}
      </h2>
      <p className="text-fg-muted mt-3 text-sm">
        Placeholder — built in a later phase.
      </p>
    </section>
  );
}
