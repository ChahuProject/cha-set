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
  CodeBlock,
  useChaSetI18n,
} from "@chahu/cha-set";
import { DocLayout } from "../../layout/DocLayout";
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from "../../components/ComponentPreview";
import { DocAnatomy } from '../../components/DocAnatomy';

export function SidebarDocPage() {
  const { t } = useChaSetI18n();
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
      category="Surfaces & Layout"
      title="Sidebar"
      description={t('components.sidebar.description', 'Composable, responsive and resizable desktop-grade sidebar navigation system supporting icon-collapse, offcanvas drawers, and custom rem sizing.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.sidebar.overviewHeading', 'Interactive Overview')}
        </h2>
      <ComponentPreview
          qtCode={`ChaSetSidebar {
    id: sidebar
    collapsed: false
    variant: "sidebar"
    collapsible: "icon"
    sidebarWidth: 240

    Column {
        anchors.fill: parent
        anchors.margins: 12
        spacing: 12

        Row {
            spacing: 8
            ChaSetIcon { name: "logo"; size: 16 }
            Text {
                visible: !sidebar.collapsed
                text: "ChaSet Studio"
                color: ThemeTokens.text
                font.weight: Font.Bold
            }
        }

        ChaSetButton {
            width: parent.width
            icon: "chart"
            text: sidebar.collapsed ? "" : "Dashboard"
            variant: "default"
        }
    }
}`} title={t('desktopComposite.sidebar.sandboxTitle', 'Sidebar Sandbox')} reactCode={basicUsageCode}>
        <div className="relative h-[22.5rem] w-full border rounded-lg overflow-hidden flex bg-background">
          <SidebarProvider defaultOpen={true} container>
            <Sidebar collapsible={collapsibleMode} className="border-r">
              <SidebarHeader className="border-b border-border/50 p-2">
                <div className="flex items-center justify-between px-2">
                  <span className="font-semibold text-sm truncate">Chahu Studio</span>
                  <SidebarTrigger tooltip={false} />
                </div>
              </SidebarHeader>
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>{t('surfaces.sidebar.overview')}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeItem === "dashboard"}
                          onClick={() => setActiveItem("dashboard")}
                        >
                          <span>{t('surfaces.sidebar.dashboard')}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeItem === "projects"}
                          onClick={() => setActiveItem("projects")}
                        >
                          <span>{t('surfaces.sidebar.projects')}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeItem === "diagnostics"}
                          onClick={() => setActiveItem("diagnostics")}
                        >
                          <span>{t('surfaces.sidebar.diagnostics')}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                  <SidebarGroupLabel>{t('surfaces.sidebar.configuration')}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={activeItem === "settings"}
                          onClick={() => setActiveItem("settings")}
                        >
                          <span>{t('surfaces.sidebar.preferences')}</span>
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
                  {t('surfaces.sidebar.selectedView')} <Badge variant="outline">{activeItem}</Badge>
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('surfaces.sidebar.dragHint')}
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <span className="text-xs text-muted-foreground font-medium">{t('surfaces.sidebar.collapsibleMode')}</span>
                <SegmentedControl
                  size="sm"
                  value={collapsibleMode}
                  onValueChange={(val) => setCollapsibleMode(val as "icon" | "offcanvas" | "none")}
                  options={[
                    { label: t('surfaces.sidebar.icon'), value: "icon" },
                    { label: t('surfaces.sidebar.offcanvas'), value: "offcanvas" },
                    { label: t('surfaces.sidebar.none'), value: "none" },
                  ]}
                />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@chahu/cha-set';

<Sidebar>
  <SidebarHeader>App Name</SidebarHeader>
  <SidebarContent>Navigation items...</SidebarContent>
  <SidebarFooter>User Profile</SidebarFooter>
</Sidebar>`}
        qtCode={`import ChaSet

ChaSetSidebar {
    width: 240
}`}
      />



            <ComponentReference
        name="Sidebar"
        componentId="sidebar"
        props={[
          {
            name: "collapsible",
            type: "'offcanvas' | 'icon' | 'none'",
            default: "'offcanvas'",
            description: t('components.sidebar.collapsibleDesc', 'Collapsing behavior mode when closed on desktop.'),
          },
          {
            name: "variant",
            type: "'sidebar' | 'floating' | 'inset'",
            default: "'sidebar'",
            description: t('components.sidebar.variantDesc', 'Visual container styling variant.'),
          },
          {
            name: "side",
            type: "'left' | 'right'",
            default: "'left'",
            description: t('components.sidebar.sideDesc', 'Docking side for the sidebar layout.'),
          },
          {
            name: "defaultOpen",
            type: "boolean",
            default: "true",
            description: t('components.sidebar.defaultOpenDesc', 'Initial expanded state on SidebarProvider.'),
          },
        ]}
      />
    </DocLayout>
  );
}
