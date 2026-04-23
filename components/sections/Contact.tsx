"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Send, LoaderCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/BrandIcons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contactSchema, type ContactPayload } from "@/lib/contact-schema";
import { siteConfig } from "@/lib/data/nav";
import { fadeUp, staggerChildren } from "@/lib/motion";
import { cn } from "@/lib/utils";

const socials = [
  {
    label: "LinkedIn",
    href: siteConfig.socials.linkedin,
    icon: LinkedinIcon,
    external: true,
  },
  {
    label: "GitHub",
    href: siteConfig.socials.github,
    icon: GithubIcon,
    external: true,
  },
  {
    label: "Email",
    href: siteConfig.socials.gmail,
    icon: Mail,
    external: false,
  },
] as const;

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Headline holds full opacity while the section is in view, then dims
  // to 0.5 as it scrolls past the viewport.
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    [1, 1, 0.5],
  );

  const form = useForm<ContactPayload>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (values: ContactPayload) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        toast.success("Message sent. I'll get back to you soon.");
        reset();
        return;
      }

      if (res.status === 503) {
        // Email not wired up yet — fall back to mailto
        const subject = encodeURIComponent(`Portfolio inbox — ${values.name}`);
        const body = encodeURIComponent(
          `${values.message}\n\n— ${values.name} <${values.email}>`,
        );
        window.open(
          `${siteConfig.socials.gmail}?subject=${subject}&body=${body}`,
          "_self",
        );
        toast.info("Opening your mail client instead — inbox isn't wired yet.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      toast.error(data?.error ?? "Something went wrong. Try again?");
    } catch {
      toast.error("Network error. Try again?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative mx-auto w-full max-w-6xl px-6 py-24 lg:px-10 lg:py-32"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: headline + social links. Outer wrapper carries the
            scroll-linked opacity; inner stagger container handles entry. */}
        <motion.div
          style={{ opacity: headlineOpacity }}
          className="lg:col-span-5"
        >
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerChildren(0.1)}
          >
            <motion.p
              variants={fadeUp}
              className="text-fg-dim font-mono text-xs tracking-[0.2em] uppercase"
            >
              {`// contact`}
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="font-display mt-4 text-4xl leading-[1.05] font-semibold tracking-tight sm:text-5xl lg:text-6xl"
            >
              <span className="text-fg-primary">Say </span>
              <span className="from-fg-primary bg-gradient-to-br via-[var(--accent-primary)] to-[var(--accent-deep)] bg-clip-text text-transparent">
                hi.
              </span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-fg-muted mt-6 max-w-md text-base leading-relaxed sm:text-lg"
            >
              Questions, collaborations, or just want to chat about a stack? Drop a line — I read every message and usually reply within a day.
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              {socials.map(({ label, href, icon: Icon, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="border-border-subtle hover:border-accent-primary/60 text-fg-muted hover:text-fg-primary group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors"
                  >
                    <Icon className="size-3.5" />
                    {label}
                  </a>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>

        {/* Right: form. Container staggers its field groups individually
            (name+email row, message, footer) rather than fading as a
            single block. */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerChildren(0.1)}
          className="bg-bg-elevated/50 border-border-subtle relative isolate space-y-5 rounded-2xl border p-6 backdrop-blur-md sm:p-8 lg:col-span-7"
        >
          {/* honeypot */}
          <div aria-hidden className="hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <Field label="Name" htmlFor="name" error={errors.name?.message}>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                {...register("name")}
              />
            </Field>
            <Field label="Email" htmlFor="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                {...register("email")}
              />
            </Field>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Field
              label="Message"
              htmlFor="message"
              error={errors.message?.message}
            >
              <Textarea
                id="message"
                rows={6}
                placeholder="What are you building? Timeline, budget if relevant, links to go look at..."
                {...register("message")}
              />
            </Field>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between gap-4"
          >
            <p className="text-fg-dim text-xs tracking-wide">
              Goes straight to my inbox. No list, no spam.
            </p>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-fg-primary text-bg-base hover:bg-accent-primary rounded-full px-5 font-semibold transition-colors hover:text-white"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Sending
                </>
              ) : (
                <>
                  Send
                  <Send className="size-4" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-fg-muted font-mono text-xs tracking-wide uppercase"
      >
        {label}
      </Label>
      {children}
      {error && (
        <p
          role="alert"
          className={cn("text-xs", "text-[var(--accent-primary)]")}
        >
          {error}
        </p>
      )}
    </div>
  );
}
