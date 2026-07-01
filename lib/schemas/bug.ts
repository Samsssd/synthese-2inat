import { z } from "zod";

export const bugInsertSchema = z.object({
  title: z.string().trim().min(1, "Le titre est requis"),
  description: z.string().trim().optional().nullable(),
  status: z.string().optional().nullable(),
  severity: z.string().optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
});

export const bugUpdateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional().nullable(),
  status: z.string().optional().nullable(),
  severity: z.string().optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
});

// Lenient row schema for validating rows read back from the DB.
export const bugRowSchema = z.object({
  id: z.string().uuid(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  status: z.string().nullable(),
  severity: z.string().nullable(),
  assigned_to: z.string().uuid().nullable(),
  created_at: z.string(),
});

export const bugsArraySchema = z.array(bugRowSchema);

export type InsertBug = z.infer<typeof bugInsertSchema>;
export type UpdateBug = z.infer<typeof bugUpdateSchema>;
