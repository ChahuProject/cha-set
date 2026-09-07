import { z } from "zod";

/**
 * Neutral API contract for Sidebar component group.
 */
export const sidebarSchema = z.object({
  side: z.enum(["left", "right"]).default("left"),
  variant: z.enum(["sidebar", "floating", "inset"]).default("sidebar"),
  collapsible: z.enum(["offcanvas", "icon", "none"]).default("offcanvas"),
  className: z.string().optional(),
});

export const sidebarProviderSchema = z.object({
  defaultOpen: z.boolean().default(true),
  open: z.boolean().optional(),
  className: z.string().optional(),
});

export const sidebarTriggerSchema = z.object({
  tooltip: z.union([z.string(), z.boolean()]).optional(),
  className: z.string().optional(),
});

export const sidebarRailSchema = z.object({
  className: z.string().optional(),
});

export const sidebarMenuButtonSchema = z.object({
  isActive: z.boolean().default(false),
  variant: z.enum(["default", "outline"]).default("default"),
  size: z.enum(["default", "sm", "lg"]).default("default"),
  tooltip: z.string().optional(),
  className: z.string().optional(),
});

export type SidebarApi = z.infer<typeof sidebarSchema>;
export type SidebarProviderApi = z.infer<typeof sidebarProviderSchema>;
export type SidebarTriggerApi = z.infer<typeof sidebarTriggerSchema>;
export type SidebarRailApi = z.infer<typeof sidebarRailSchema>;
export type SidebarMenuButtonApi = z.infer<typeof sidebarMenuButtonSchema>;
