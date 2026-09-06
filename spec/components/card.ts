import { z } from 'zod';

export const cardVariantSchema = z.enum([
  'default',
  'secondary',
  'outline',
]);

export const cardSizeSchema = z.enum(['default', 'sm']);

export const cardSchema = z.object({
  variant: cardVariantSchema.default('default'),
  size: cardSizeSchema.default('default'),
});

export const cardHeaderSchema = z.object({});
export const cardTitleSchema = z.object({});
export const cardDescriptionSchema = z.object({});
export const cardActionSchema = z.object({});
export const cardContentSchema = z.object({});
export const cardFooterSchema = z.object({});

export type CardApi = z.infer<typeof cardSchema>;
export type CardVariant = z.infer<typeof cardVariantSchema>;
