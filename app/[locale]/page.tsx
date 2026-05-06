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
import { getDictionary } from "@/lib/i18n/get-dictionary";
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
  const dict = await getDictionary(rawLocale);

  return (
    <>
      <Navbar dict={dict} />

      <main className="relative flex flex-1 flex-col">
        <Hero dict={dict} />
        <StackStrip dict={dict} />
        <About dict={dict} />
        <SectionDivider />
        <Services dict={dict} />
        <SectionDivider />
        <Projects dict={dict} />
        <SectionDivider />
        <Experience dict={dict} />
        <SectionDivider />
        <Contact dict={dict} />
      </main>

      <Footer dict={dict} />
    </>
  );
}
