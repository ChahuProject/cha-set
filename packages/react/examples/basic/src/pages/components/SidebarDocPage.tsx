import React, { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  Badge,
  SegmentedControl,
} from "@chahu/cha-set";
import { DocLayout } from "../../layout/DocLayout";
import { ComponentPreview } from "../../components/ComponentPreview";
import { CodeBlock } from "../../components/CodeBlock";
import { PropsTable } from "../../components/PropsTable";
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function SidebarDocPage() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [collapsibleMode, setCollapsibleMode] = useState<"icon" | "offcanvas" | "none">("icon");

  const basicUsageCode = `<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader className="border-b p-2">
      <span className="font-semibold px-2">Application</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>Settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter className="border-t p-2">
      <SidebarTrigger />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset className="p-4">
    <SidebarTrigger />
    <main>Content Area</main>
  </SidebarInset>
</SidebarProvider>`;

  return (
    <DocLayout
      title="Sidebar"
      description="Composable, responsive and resizable desktop-grade sidebar navigation system supporting icon-collapse, offcanvas drawers, and custom rem sizing."
    >
      <h2 className="text-xl font-semibold mt-8 mb-4">Interactive Preview</h2>
      <ComponentPreview reactCode={basicUsageCode}>
        <div className="h-[22.5rem] w-full border rounded-lg overflow-hidden flex bg-background">
          <SidebarProvider defaultOpen={true}>
            <Sidebar collapsible={collapsibleMode} className="border-r">
              <SidebarHeader className="border-b border-border/50 p-2">
                <div className="flex items-center justify-between px-2">
                  <span className="font-semibold text-sm truncate">Chahu Studio</span>
                  <SidebarTrigger tooltip={false} />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Overview</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeItem === "dashboard"}
                          onClick={() => setActiveItem("dashboard")}
                        >
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeItem === "projects"}
                          onClick={() => setActiveItem("projects")}
                        >
                          <span>Projects</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeItem === "diagnostics"}
                          onClick={() => setActiveItem("diagnostics")}
                        >
                          <span>Diagnostics</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                  <SidebarGroupLabel>Configuration</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeItem === "settings"}
                          onClick={() => setActiveItem("settings")}
                        >
                          <span>Preferences</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
              <SidebarFooter className="border-t border-border/50 p-2">
                <Badge variant="outline" className="text-[0.625rem]">v0.2.0 Desktop</Badge>
              </SidebarFooter>
              <SidebarRail />
            </Sidebar>
            <SidebarInset className="p-4 flex-1 flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <span className="text-sm font-medium flex items-center gap-1.5">
                  Selected View: <Badge variant="outline">{activeItem}</Badge>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Drag the rail on the right edge of the sidebar to resize, or click the trigger to collapse/expand.
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <span className="text-xs text-muted-foreground font-medium">Collapsible Mode:</span>
                <SegmentedControl
                  size="sm"
                  value={collapsibleMode}
                  onValueChange={(val) => setCollapsibleMode(val as "icon" | "offcanvas" | "none")}
                  options={[
                    { label: "Icon", value: "icon" },
                    { label: "Offcanvas", value: "offcanvas" },
                    { label: "None", value: "none" },
                  ]}
                />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </ComponentPreview>

      <h2 className="text-xl font-semibold mt-8 mb-4">Props Reference</h2>
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="sidebar" />
      </section>

      <PropsTable
        props={[
          {
            name: "collapsible",
            type: "'offcanvas' | 'icon' | 'none'",
            default: "'offcanvas'",
            description: "Collapsing behavior mode when closed on desktop.",
          },
          {
            name: "variant",
            type: "'sidebar' | 'floating' | 'inset'",
            default: "'sidebar'",
            description: "Visual container styling variant.",
          },
          {
            name: "side",
            type: "'left' | 'right'",
            default: "'left'",
            description: "Docking side for the sidebar layout.",
          },
          {
            name: "defaultOpen",
            type: "boolean",
            default: "true",
            description: "Initial expanded state on SidebarProvider.",
          },
        ]}
      />
    </DocLayout>
  );
}
