import { z } from "zod";

/**
 * Zod schema for validating public parent inquiry submissions.
 */
export const inquirySubmissionSchema = z.object({
  parentName: z
    .string()
    .trim()
    .min(2, "Parent or guardian name must be at least 2 characters.")
    .max(100, "Name cannot exceed 100 characters.")
    .regex(/^[\p{L}\s.'-]+$/u, "Name contains invalid characters."),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(120, "Email cannot exceed 120 characters.")
    .toLowerCase(),

  phone: z
    .string()
    .trim()
    .min(8, "Phone number must be at least 8 digits.")
    .max(20, "Phone number cannot exceed 20 characters.")
    .regex(/^[+0-9\s\-()]+$/, "Phone number contains invalid characters."),

  preferredBranch: z
    .enum(["rathinapuri", "kuniyamuthur", "undecided"])
    .default("undecided"),

  serviceCategory: z
    .string()
    .trim()
    .min(2, "Please select or specify a program of interest.")
    .max(100, "Service category cannot exceed 100 characters."),

  childAge: z
    .string()
    .trim()
    .max(30, "Age text cannot exceed 30 characters.")
    .optional()
    .default(""),

  message: z
    .string()
    .trim()
    .min(15, "Please provide a little more detail (at least 15 characters).")
    .max(2000, "Message cannot exceed 2000 characters."),

  // Anti-spam honeypot field: must be empty when submitted by legitimate humans
  botCheck: z.string().max(0, "Automated submission detected.").optional().default(""),
});

export type InquirySubmissionInput = z.infer<typeof inquirySubmissionSchema>;

/**
 * Sanitizes input text to prevent XSS injection in emails or database fields.
 */
export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, "") // Strip raw HTML tags
    .trim();
}
