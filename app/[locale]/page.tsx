import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionDivider } from "@/components/layout/SectionDivider";
import { Hero } from "@/components/sections/Hero";
import { StackStrip } from "@/components/sections/StackStrip";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";
import { DictionaryProvider } from "@/components/i18n/DictionaryProvider";
import enDict from "@/lib/i18n/dictionaries/en";
import ptDict from "@/lib/i18n/dictionaries/pt";
import { isLocale, locales } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();

  return (
    <DictionaryProvider
      initialLocale={rawLocale}
      dictionaries={{ en: enDict, pt: ptDict }}
    >
      <Navbar />

      <main className="relative flex flex-1 flex-col">
        <Hero />
        <StackStrip />
        <About />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Experience />
        <SectionDivider />
        <Contact />
      </main>

      <Footer />
    </DictionaryProvider>
  );
}
