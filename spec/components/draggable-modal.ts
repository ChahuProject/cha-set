import { z } from 'zod';

export const draggableModalSizeOptionSchema = z.object({
  name: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  widthRem: z.number().optional(),
  heightRem: z.number().optional(),
  special: z.enum(['fullscreen', 'default', '全窗口', '默认']).optional(),
});

export type DraggableModalSizeOptionApi = z.infer<typeof draggableModalSizeOptionSchema>;

/**
 * Neutral API contract for DraggableModal component.
 */
export const draggableModalSchema = z.object({
  defaultWidth: z.number().default(500),
  defaultHeight: z.number().default(400),
  minWidth: z.number().default(300),
  minHeight: z.number().default(200),
  showEscBadge: z.boolean().default(false),
  autoFitHeight: z.boolean().default(true),
  initialPositionMode: z.enum(['center', 'top']).default('center'),
  topMargin: z.number().default(72),
  sizeOptions: z.array(draggableModalSizeOptionSchema).optional(),
  sizeMenuTooltip: z.string().optional(),
  remBase: z.number().default(16),
});

export type DraggableModalApi = z.infer<typeof draggableModalSchema>;
