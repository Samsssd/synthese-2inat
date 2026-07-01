import { z } from "zod";

export const incidentInsertSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(1, "Le titre est requis"),
  description: z.string().trim().optional().nullable(),
  occurred_at: z.string().optional().nullable(),
  severity: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  bug_id: z.string().uuid().optional().nullable(),
});

export const incidentUpdateSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  title: z.string().trim().min(1).optional(),
  description: z.string().trim().optional().nullable(),
  occurred_at: z.string().optional().nullable(),
  severity: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  bug_id: z.string().uuid().optional().nullable(),
});

export const incidentRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  title: z.string().nullable(),
  description: z.string().nullable(),
  occurred_at: z.string().nullable(),
  severity: z.string().nullable(),
  status: z.string().nullable(),
  bug_id: z.string().uuid().nullable(),
  created_at: z.string(),
});

export const incidentsArraySchema = z.array(incidentRowSchema);

export type InsertIncident = z.infer<typeof incidentInsertSchema>;
export type UpdateIncident = z.infer<typeof incidentUpdateSchema>;
