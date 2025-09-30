import { z } from 'zod';

export const PredictParametersSchema = z.object({
  infectionRate: z.number().min(0).max(100).optional(),
  protestIndex: z.number().min(0).max(100).optional(),
  economicIndex: z.number().min(0).max(100).optional(),
  temperature: z.number().optional()
});

export const PredictRequestSchema = z.object({
  country: z.string(),
  parameters: PredictParametersSchema
});

export const PredictResponseSchema = z.object({
  predictionId: z.string(),
  country: z.string(),
  risk: z.union([z.literal('low'), z.literal('medium'), z.literal('high')]),
  confidence: z.number(),
  factors: z.array(z.object({ name: z.string(), weight: z.number(), value: z.number().optional() })),
  generatedAt: z.string(),
  score: z.number()
});

export type PredictRequest = z.infer<typeof PredictRequestSchema>;
export type PredictResponse = z.infer<typeof PredictResponseSchema>;
