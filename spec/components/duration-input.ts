import { z } from 'zod';

/**
 * Neutral API contract for DurationInput component.
 */
export const durationPresetItemSchema = z.object({
  label: z.string(),
  seconds: z.number(),
});

export const durationPresetGroupSchema = z.object({
  label: z.string(),
  items: z.array(durationPresetItemSchema),
});

export const durationInputSizeSchema = z.enum(['sm', 'default', 'lg']);

export const defaultDurationPresetGroups: z.infer<typeof durationPresetGroupSchema>[] = [
  {
    label: 'Seconds',
    items: [{ label: '30s', seconds: 30 }],
  },
  {
    label: 'Minutes',
    items: [
      { label: '1m', seconds: 60 },
      { label: '5m', seconds: 300 },
      { label: '15m', seconds: 900 },
      { label: '30m', seconds: 1800 },
    ],
  },
  {
    label: 'Hours',
    items: [
      { label: '1h', seconds: 3600 },
      { label: '2h', seconds: 7200 },
      { label: '6h', seconds: 21600 },
      { label: '12h', seconds: 43200 },
    ],
  },
];

export const durationInputSchema = z.object({
  value: z.number().default(0),
  defaultValue: z.number().optional(),
  maxHours: z.number().default(99),
  size: durationInputSizeSchema.default('default'),
  disabled: z.boolean().default(false),
  showPresets: z.boolean().default(true),
  showLabels: z.boolean().default(true),
  presets: z.array(durationPresetGroupSchema).default(defaultDurationPresetGroups),
  hoursLabel: z.string().default('Hours'),
  minutesLabel: z.string().default('Minutes'),
  secondsLabel: z.string().default('Seconds'),
  presetsLabel: z.string().default('Presets'),
});


export type DurationPresetItem = z.infer<typeof durationPresetItemSchema>;
export type DurationPresetGroup = z.infer<typeof durationPresetGroupSchema>;
export type DurationInputSize = z.infer<typeof durationInputSizeSchema>;
export type DurationInputApi = z.infer<typeof durationInputSchema>;
