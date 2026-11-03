import { z } from 'zod';
import { dialogSizeSchema, dialogSchema } from './dialog';

/**
 * Neutral API contract for AlertDialog component.
 * Specialized modal dialog for destructive or critical confirmations requiring deliberate user acknowledgement.
 */
export const alertDialogSchema = dialogSchema.extend({
  variant: z.literal('alert').default('alert'),
  destructive: z.boolean().default(true),
  confirmText: z.string().default('Continue'),
  cancelText: z.string().default('Cancel'),
});

export type AlertDialogApi = z.infer<typeof alertDialogSchema>;
export { dialogSizeSchema };
