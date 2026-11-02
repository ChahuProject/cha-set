import React, { useState } from "react";
import { DocMarkdown } from '../../components/DocMarkdown';
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
  Button,
  Card,
  CardContent,
  SegmentedControl,
  HomeIcon,
  FolderIcon,
  ChartIcon,
  SlidersIcon,
  SettingsIcon,
  ChaSetLogoIcon,
  RotateCcwIcon,
  CheckIcon,
  useChaSetI18n,
} from "@chahu/cha-set";
import { DocLayout } from "../../layout/DocLayout";
import { ComponentPreview } from "../../components/ComponentPreview";
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function SidebarDocPage() {
  const { t } = useChaSetI18n();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [collapsibleMode, setCollapsibleMode] = useState<"icon" | "offcanvas" | "none">("icon");

  const navItems = [
    { id: "dashboard", icon: HomeIcon, label: t('surfaces.sidebar.dashboard', '控制台'), group: "overview" },
    { id: "projects", icon: FolderIcon, label: t('surfaces.sidebar.projects', '项目'), badge: "12", group: "overview" },
    { id: "analytics", icon: ChartIcon, label: t('surfaces.sidebar.analytics', '分析'), group: "overview" },
    { id: "diagnostics", icon: SlidersIcon, label: t('surfaces.sidebar.diagnostics', '诊断'), badge: "OK", group: "configuration" },
    { id: "settings", icon: SettingsIcon, label: t('surfaces.sidebar.preferences', '偏好设置'), group: "configuration" },
  ];

  const currentItem = navItems.find((item) => item.id === activeItem) ?? navItems[0]!;
  const CurrentIcon = currentItem.icon;

  const basicUsageCode = `<SidebarProvider>
  <Sidebar collapsible="icon">
    <SidebarHeader className="border-b border-border/50 p-2">
      <div className="flex items-center justify-between px-2">
        <span className="font-semibold text-sm">ChaSet Studio</span>
        <SidebarTrigger tooltip={false} />
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FolderIcon />
                <span>Projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter className="border-t border-border/50 p-2">
      <Badge variant="outline">v0.2.0 Desktop</Badge>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset className="p-4">
    <SidebarTrigger />
    <main>Content Area</main>
  </SidebarInset>
</SidebarProvider>`;

  const qtSandboxCode = `ChaSetSidebar {
    id: sidebar
    sidebarWidth: 240
    collapsible: "${collapsibleMode}"
    collapsed: false

    // Brand Header
    Row {
        spacing: ThemeTokens.dp(8)
        ChaSetIcon { name: "chaset"; size: 18; color: ThemeTokens.accent }
        DocText { text: "ChaSet Studio"; font.weight: Font.Bold }
    }

    // Navigation Groups
    Column {
        spacing: ThemeTokens.dp(4)
        ChaSetButton { icon: "home"; text: "Dashboard"; variant: "ghost" }
        ChaSetButton { icon: "folder"; text: "Projects"; variant: "ghost" }
        ChaSetButton { icon: "chart"; text: "Analytics"; variant: "ghost" }
        ChaSetButton { icon: "settings"; text: "Preferences"; variant: "ghost" }
    }
}`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Sidebar"
      description={t('components.sidebar.description', 'Composable, responsive and resizable desktop-grade sidebar navigation system supporting icon-collapse, offcanvas drawers, and custom rem sizing.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.sidebar.overviewHeading', 'Interactive Overview')}
        </DocText>
        <ComponentPreview
          qtCode={qtSandboxCode}
          title={t('desktopComposite.sidebar.sandboxTitle', 'Sidebar Sandbox')}
          reactCode={basicUsageCode}
        >
          <div className="relative h-[28rem] w-full border border-border rounded-xl overflow-hidden flex bg-background text-foreground shadow-xs select-none">
            <SidebarProvider defaultOpen={true} container>
              <Sidebar collapsible={collapsibleMode} className="border-r border-sidebar-border/50">
                <SidebarHeader className="border-b border-sidebar-border/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <ChaSetLogoIcon className="size-4" />
                      </div>
                      <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold text-xs leading-none truncate text-sidebar-foreground">ChaSet Studio</span>
                        <span className="text-[0.625rem] text-sidebar-foreground/60 leading-tight truncate mt-0.5">{t('surfaces.sidebar.proWorkspace', '专业工作区')}</span>
                      </div>
                    </div>
                    <SidebarTrigger tooltip={false} className="size-7" />
                  </div>
                </SidebarHeader>

                <SidebarContent>
                  {/* Group 1: Overview / Platform */}
                  <SidebarGroup>
                    <SidebarGroupLabel className="text-[0.6875rem] font-semibold tracking-wider uppercase text-sidebar-foreground/60">
                      {t('surfaces.sidebar.overview', '概览')}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {navItems.filter((i) => i.group === "overview").map((item) => {
                          const IconComp = item.icon;
                          const isActive = activeItem === item.id;
                          return (
                            <SidebarMenuItem key={item.id}>
                              <SidebarMenuButton
                                isActive={isActive}
                                onClick={() => setActiveItem(item.id)}
                                tooltip={item.label}
                                className="h-8"
                              >
                                <IconComp className="size-4 shrink-0" />
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                  <Badge
                                    variant="secondary"
                                    className="ml-auto text-[0.625rem] px-1.5 py-0 h-4 font-mono group-data-[collapsible=icon]:hidden"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>

                  {/* Group 2: Configuration / System */}
                  <SidebarGroup>
                    <SidebarGroupLabel className="text-[0.6875rem] font-semibold tracking-wider uppercase text-sidebar-foreground/60">
                      {t('surfaces.sidebar.configuration', '配置')}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {navItems.filter((i) => i.group === "configuration").map((item) => {
                          const IconComp = item.icon;
                          const isActive = activeItem === item.id;
                          return (
                            <SidebarMenuItem key={item.id}>
                              <SidebarMenuButton
                                isActive={isActive}
                                onClick={() => setActiveItem(item.id)}
                                tooltip={item.label}
                                className="h-8"
                              >
                                <IconComp className="size-4 shrink-0" />
                                <span className="truncate">{item.label}</span>
                                {item.badge && (
                                  <Badge
                                    variant="outline"
                                    className="ml-auto text-[0.625rem] px-1.5 py-0 h-4 font-mono text-primary group-data-[collapsible=icon]:hidden"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>

                <SidebarFooter className="border-t border-sidebar-border/50 p-2.5">
                  <div className="flex items-center gap-2 px-1 py-0.5">
                    <div className="flex size-6 items-center justify-center rounded-full bg-muted text-[0.625rem] font-semibold text-muted-foreground shrink-0 border border-border/60">
                      CS
                    </div>
                    <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
                      <span className="text-xs font-medium truncate leading-tight text-sidebar-foreground">{t('surfaces.sidebar.desktopVersion', 'v0.2.0 Desktop')}</span>
                      <span className="text-[0.625rem] text-sidebar-foreground/60 leading-tight flex items-center gap-1 mt-0.5">
                        <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
                        {t('surfaces.sidebar.online', 'Online')}
                      </span>
                    </div>
                  </div>
                </SidebarFooter>
                <SidebarRail />
              </Sidebar>

              {/* Main Viewport Content Area */}
              <SidebarInset className="p-4 flex-1 flex flex-col gap-3 min-w-0 bg-background text-foreground overflow-y-auto">
                {/* Header Top Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-border/50 shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <SidebarTrigger />
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate font-medium">
                      <span>{t('surfaces.sidebar.studioBreadcrumb', 'ChaSet Studio /')}</span>
                      <span className="text-foreground font-semibold flex items-center gap-1">
                        <CurrentIcon className="size-3.5 text-primary" />
                        {currentItem.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="outline" className="text-xs font-mono">
                      {t('surfaces.sidebar.selectedView', '当前视图:')} {currentItem.id}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {t('surfaces.sidebar.expanded', '已展开')}
                    </Badge>
                  </div>
                </div>

                {/* Dynamic Content View */}
                {activeItem === "dashboard" && (
                  <div className="flex flex-col gap-3">
                    {/* Stat KPI Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <Card className="p-3 border border-border bg-card text-card-foreground shadow-2xs">
                        <CardContent className="p-0 flex flex-col gap-1">
                          <span className="text-[0.6875rem] text-muted-foreground font-medium">
                            {t('surfaces.sidebar.activeProjects', '活跃项目')}
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xl font-bold tracking-tight">12</span>
                            <Badge variant="secondary" className="text-[0.625rem] font-mono px-1 py-0">+2</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="p-3 border border-border bg-card text-card-foreground shadow-2xs">
                        <CardContent className="p-0 flex flex-col gap-1">
                          <span className="text-[0.6875rem] text-muted-foreground font-medium">
                            {t('surfaces.sidebar.buildTime', '构建耗时')}
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xl font-bold tracking-tight">1.2s</span>
                            <Badge variant="outline" className="text-[0.625rem] font-mono px-1 py-0">{t('surfaces.sidebar.cached', '缓存命中')}</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="p-3 border border-border bg-card text-card-foreground shadow-2xs">
                        <CardContent className="p-0 flex flex-col gap-1">
                          <span className="text-[0.6875rem] text-muted-foreground font-medium">
                            {t('surfaces.sidebar.memoryUsage', '内存占用')}
                          </span>
                          <div className="flex items-baseline justify-between">
                            <span className="text-xl font-bold tracking-tight">42 MB</span>
                            <Badge variant="secondary" className="text-[0.625rem] font-mono px-1 py-0 text-emerald-600 dark:text-emerald-400">{t('surfaces.sidebar.lightweight', '轻量高效')}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Interactive Sandbox Controls Card */}
                    <Card className="border border-border bg-card text-card-foreground p-3.5 shadow-2xs flex flex-col gap-3">
                      <div>
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <SlidersIcon className="size-3.5 text-primary" />
                          {t('desktopComposite.sidebar.sandboxTitle', '侧边栏沙盒')}
                        </h4>
                        <p className="text-[0.6875rem] text-muted-foreground mt-0.5 leading-relaxed">
                          {t('surfaces.sidebar.dragHint', '拖拽侧边栏右边缘把手调整尺寸，或点击触发器折叠/展开。')}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground font-medium">
                            {t('surfaces.sidebar.collapsibleMode', '折叠模式:')}
                          </span>
                          <SegmentedControl
                            size="sm"
                            value={collapsibleMode}
                            onValueChange={(val) => setCollapsibleMode(val as "icon" | "offcanvas" | "none")}
                            options={[
                              { label: t('surfaces.sidebar.icon', '图标'), value: "icon" },
                              { label: t('surfaces.sidebar.offcanvas', '抽屉'), value: "offcanvas" },
                              { label: t('surfaces.sidebar.none', '无'), value: "none" },
                            ]}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <SidebarTrigger variant="outline" size="sm" label={t('surfaces.sidebar.collapseSidebar', '折叠侧边栏')} />
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {activeItem === "projects" && (
                  <div className="flex flex-col gap-2">
                    <Card className="p-3 border border-border bg-card text-card-foreground shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center text-primary font-mono text-xs font-bold">
                          CS
                        </div>
                        <div>
                          <span className="text-xs font-semibold">cha-set-core</span>
                          <p className="text-[0.6875rem] text-muted-foreground">{t('surfaces.sidebar.coreDesc', 'TypeScript / QML 统一设计系统资产库')}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">{t('surfaces.sidebar.coreVersion', 'v1.4.0 版本')}</Badge>
                    </Card>

                    <Card className="p-3 border border-border bg-card text-card-foreground shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-md bg-accent/20 flex items-center justify-center text-accent-foreground font-mono text-xs font-bold">
                          QT
                        </div>
                        <div>
                          <span className="text-xs font-semibold">qt-desktop-shell</span>
                          <p className="text-[0.6875rem] text-muted-foreground">{t('surfaces.sidebar.qtShellDesc', 'Qt 6.8 高性能桌面客户端外壳与演示程序')}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs font-mono">{t('surfaces.sidebar.qtShellVersion', 'v0.2.0 版本')}</Badge>
                    </Card>
                  </div>
                )}

                {activeItem === "analytics" && (
                  <Card className="p-4 border border-border bg-card text-card-foreground shadow-2xs flex flex-col gap-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <ChartIcon className="size-3.5 text-primary" />
                      {t('surfaces.sidebar.analyticsTitle', '系统遥测与合规状态')}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t('surfaces.sidebar.analyticsDesc', '318 项规范契约通过率 100%，52 个双端演示页面零白屏加载，全量组件通过无闪烁与颜色对齐测试。')}
                    </p>
                  </Card>
                )}

                {activeItem === "diagnostics" && (
                  <Card className="p-4 border border-border bg-card text-card-foreground shadow-2xs flex flex-col gap-2">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <SlidersIcon className="size-3.5 text-primary" />
                      {t('surfaces.sidebar.diagTitle', '主题与布局健康诊断')}
                    </h4>
                    <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckIcon className="size-3.5" />
                        <span>{t('surfaces.sidebar.diagThemeGate', '主题自适应门禁：0 边框缺陷')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckIcon className="size-3.5" />
                        <span>{t('surfaces.sidebar.diagZeroPx', '零像素规则：100% rem 规范')}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {activeItem === "settings" && (
                  <Card className="p-4 border border-border bg-card text-card-foreground shadow-2xs flex flex-col gap-3">
                    <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                      <SettingsIcon className="size-3.5 text-primary" />
                      {t('surfaces.sidebar.prefsTitle', '工作区偏好设置')}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {t('surfaces.sidebar.prefsDesc', '侧边栏支持双向拖拽调整、Icon 折叠记忆以及快捷键 Ctrl+B 快速触发。')}
                    </p>
                  </Card>
                )}
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

      <DocMarkdown id="sidebar" section="keyboard" />
      <DocMarkdown id="sidebar" section="props" />
    </DocLayout>
  );
}
