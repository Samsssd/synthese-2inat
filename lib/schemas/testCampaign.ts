import { z } from "zod";

export const testCampaignInsertSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis"),
  objective_total: z.coerce
    .number()
    .int("L'objectif doit être un entier")
    .nonnegative("L'objectif ne peut pas être négatif")
    .optional()
    .nullable(),
  status: z.string().optional().nullable(),
});

export const testCampaignUpdateSchema = z.object({
  name: z.string().trim().min(1).optional(),
  objective_total: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable(),
  status: z.string().optional().nullable(),
});

export const testCampaignRowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  objective_total: z.coerce.number().int().nullable(),
  status: z.string().nullable(),
  created_at: z.string(),
});

export const testCampaignsArraySchema = z.array(testCampaignRowSchema);

export type InsertTestCampaign = z.infer<typeof testCampaignInsertSchema>;
export type UpdateTestCampaign = z.infer<typeof testCampaignUpdateSchema>;
