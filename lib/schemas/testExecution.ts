import { z } from "zod";

export const testExecutionInsertSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  test_case_name: z.string().trim().min(1, "Le nom du cas de test est requis"),
  status: z.string().optional().nullable(),
  campaign_id: z.string().uuid("Campagne requise"),
  executed_at: z.string().optional().nullable(),
});

export const testExecutionUpdateSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  test_case_name: z.string().trim().min(1).optional(),
  status: z.string().optional().nullable(),
  campaign_id: z.string().uuid().optional().nullable(),
  executed_at: z.string().optional().nullable(),
});

export const testExecutionRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid().nullable(),
  test_case_name: z.string().nullable(),
  status: z.string().nullable(),
  campaign_id: z.string().uuid().nullable(),
  executed_at: z.string().nullable(),
  created_at: z.string(),
});

export const testExecutionsArraySchema = z.array(testExecutionRowSchema);

export type InsertTestExecution = z.infer<typeof testExecutionInsertSchema>;
export type UpdateTestExecution = z.infer<typeof testExecutionUpdateSchema>;
