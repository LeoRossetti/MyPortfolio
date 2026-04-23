import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { StackStrip } from "@/components/sections/StackStrip";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative flex flex-1 flex-col">
        <Hero />
        <StackStrip />
        <About />
        <Services />
        <Projects />
        <Experience />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
