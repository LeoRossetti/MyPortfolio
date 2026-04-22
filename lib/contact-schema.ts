import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell me your name.").max(80),
  email: z.string().trim().email("That email looks off."),
  message: z
    .string()
    .trim()
    .min(10, "Give me a bit more context — 10 chars minimum.")
    .max(2000),
  // honeypot: must stay empty — bots love to fill it in
  website: z.string().max(0).optional(),
});

export type ContactPayload = z.infer<typeof contactSchema>;
