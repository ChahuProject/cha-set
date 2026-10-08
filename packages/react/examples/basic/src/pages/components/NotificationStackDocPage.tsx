import React, { useState } from 'react';
import {
  NotificationStack,
  type NotificationItem,
  type NotificationLevel,
  type NotificationStackPlacement,
  Button,
  SegmentedControl,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';
import { PropsTable } from '../../components/PropsTable';

export function NotificationStackDocPage() {
  const { t } = useChaSetI18n();

  const LEVEL_PRESETS: { label: string; level: NotificationLevel; title: string; description: string }[] = [
    {
      label: t('overlays.notificationStack.levelInfo', 'Info'),
      level: 'info',
      title: t('overlays.notificationStack.presetInfoTitle', 'Index rebuilt'),
      description: t('overlays.notificationStack.presetInfoDesc', 'Workspace symbols refreshed in 2.1s.'),
    },
    {
      label: t('overlays.notificationStack.levelSuccess', 'Success'),
      level: 'success',
      title: t('overlays.notificationStack.presetSuccessTitle', 'Deployment finished'),
      description: t('overlays.notificationStack.presetSuccessDesc', 'Release 0.2.0 is live on staging.'),
    },
    {
      label: t('overlays.notificationStack.levelWarning', 'Warning'),
      level: 'warning',
      title: t('overlays.notificationStack.presetWarningTitle', 'Token expires soon'),
      description: t('overlays.notificationStack.presetWarningDesc', 'Credentials expire in 3 days.'),
    },
    {
      label: t('overlays.notificationStack.levelError', 'Error'),
      level: 'error',
      title: t('overlays.notificationStack.presetErrorTitle', 'Upload rejected'),
      description: t('overlays.notificationStack.presetErrorDesc', 'Artifact exceeds the 50 MB limit.'),
    },
  ];

  const PLACEMENT_OPTIONS: { label: string; value: NotificationStackPlacement }[] = [
    { label: t('overlays.taskHud.placementBottomRight', 'Bottom Right'), value: 'bottom-right' },
    { label: t('overlays.taskHud.placementTopRight', 'Top Right'), value: 'top-right' },
    { label: t('overlays.taskHud.placementBottomCenter', 'Bottom Center'), value: 'bottom-center' },
  ];

  // Preview 1 — live transient feed.
  const [live, setLive] = useState<NotificationItem[]>([
    {
      id: 'live-1',
      level: 'info',
      title: t('overlays.notificationStack.syncStartedTitle', 'Sync started'),
      description: t('overlays.notificationStack.syncStartedDesc', 'Pulling 128 remote changes.'),
      duration: 8000,
    },
  ]);

  // Preview 2 — severity levels, inline actions and placement.
  const [placement, setPlacement] = useState<NotificationStackPlacement>('bottom-right');
  const [receipt, setReceipt] = useState<string | null>(null);
  const levels: NotificationItem[] = [
    {
      id: 'level-info',
      level: 'info',
      title: t('overlays.notificationStack.headsUpTitle', 'Heads up'),
      description: t('overlays.notificationStack.headsUpDesc', 'A new major version is available.'),
      duration: 0,
    },
    {
      id: 'level-success',
      level: 'success',
      title: t('overlays.notificationStack.buildPassedTitle', 'Build passed'),
      description: t('overlays.notificationStack.buildPassedDesc', 'All 318 contract checks green.'),
      duration: 0,
    },
    {
      id: 'level-warning',
      level: 'warning',
      title: t('overlays.notificationStack.quotaTitle', 'Quota at 84%'),
      description: t('overlays.notificationStack.quotaDesc', 'Storage usage is approaching the plan limit.'),
      duration: 0,
      actions: [
        { id: 'manage', label: t('overlays.notificationStack.actionManage', 'Manage'), variant: 'outline' },
        { id: 'upgrade', label: t('overlays.notificationStack.actionUpgrade', 'Upgrade'), variant: 'default' },
      ],
    },
    {
      id: 'level-error',
      level: 'error',
      title: t('overlays.notificationStack.jobFailedTitle', 'Job failed'),
      description: t('overlays.notificationStack.jobFailedDesc', 'Compilation exited with code 1.'),
      duration: 0,
      actions: [
        { id: 'retry', label: t('overlays.notificationStack.actionRetry', 'Retry'), variant: 'outline' },
        { id: 'logs', label: t('overlays.notificationStack.actionLogs', 'View log'), variant: 'ghost' },
      ],
    },
  ];

  const nextId = React.useRef(0);
  const push = (preset: (typeof LEVEL_PRESETS)[number]) => {
    nextId.current += 1;
    setLive((prev) => [
      ...prev,
      {
        id: `live-${nextId.current}-${Date.now()}`,
        level: preset.level,
        title: preset.title,
        description: preset.description,
        duration: 6000,
      },
    ]);
  };

  const feedReactCode = `const [items, setItems] = useState<NotificationItem[]>([]);

<NotificationStack
  notifications={items}
  defaultDuration={5000}
  pauseOnHover
  onDismiss={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
/>`;

  const levelsReactCode = `<NotificationStack
  notifications={notifications}
  placement="bottom-right"
  maxVisible={4}
  collapsible
  onAction={(notificationId, actionId) => runAction(notificationId, actionId)}
/>`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Notification Stack"
      description={t('components.notificationStack.description', 'Floating, severity-coded notification stack with per-item lifetimes and inline actions.')}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{t('desktopComposite.notificationStack.overviewHeading', 'Interactive Overview')}</h2>
        <ComponentPreview
          title={t('desktopComposite.notificationStack.sandboxTitle', 'Notification Stack Sandbox')}
          reactCode={feedReactCode}
          qtCode={`ChaSetNotificationStack {
    notifications: demoNotifications
    defaultDuration: 5000
    pauseOnHover: true
    onDismissed: function(id) { removeNotification(id) }
}`}
          controls={
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="mr-1 text-muted-foreground">{t('overlays.notificationStack.pushNotification', 'Push Notification:')}</span>
              {LEVEL_PRESETS.map((preset) => (
                <Button key={preset.level} variant="outline" size="sm" onClick={() => push(preset)}>
                  {preset.label}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={() => setLive([])}>
                {t('overlays.notificationStack.clearAll', 'Clear All')}
              </Button>
            </div>
          }
        >
          <div className="relative flex min-h-80 w-full items-start justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6">
            {live.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t('overlays.notificationStack.noNotifications', 'No notifications queued. Push one to watch its lifetime countdown; hover the stack to suspend every countdown at once.')}
              </p>
            ) : null}
            <NotificationStack
              notifications={live}
              onDismiss={(id) => setLive((prev) => prev.filter((item) => item.id !== id))}
              className="!relative !right-0 !bottom-0 !w-full max-w-sm"
            />
          </div>
        </ComponentPreview>
      </section>

      <section id="levels" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('desktopComposite.notificationStack.levelsTitle', 'Levels & Actions')}</h2>
        <ComponentPreview
          title={t('desktopComposite.notificationStack.levelsTitle', 'Levels & Actions')}
          reactCode={levelsReactCode}
          qtCode={`ChaSetNotificationStack {
    notifications: levelNotifications
    placement: "bottom-right"
    maxVisible: 4
    collapsible: true
    onActionTriggered: function(notificationId, actionId) { runAction(notificationId, actionId) }
}`}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('overlays.notificationStack.placement', 'Placement:')}</span>
                <SegmentedControl
                  value={placement}
                  onValueChange={(value) => setPlacement(value as NotificationStackPlacement)}
                  options={PLACEMENT_OPTIONS.map((option) => ({ label: option.label, value: option.value }))}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setReceipt(null)}>
                {t('overlays.notificationStack.resetActionLog', 'Reset Action Log')}
              </Button>
              <span className="text-muted-foreground">
                {t('overlays.notificationStack.lastAction', 'last action: {{receipt}}', {
                  receipt: receipt ?? t('overlays.notificationStack.noActionPressed', '(no action pressed yet)'),
                })}
              </span>
            </div>
          }
        >
          <div className="relative flex min-h-80 w-full items-start justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6">
            <NotificationStack
              notifications={levels}
              placement={placement}
              defaultDuration={0}
              onDismiss={() => undefined}
              onAction={(notificationId, actionId) => setReceipt(`${notificationId} / ${actionId}`)}
              className="!relative !right-0 !bottom-0 !w-full max-w-sm"
            />
          </div>
        </ComponentPreview>
      </section>

      <DocAnatomy
        id="anatomy"
        reactCode={`import { NotificationStack } from '@chahu/cha-set';

<NotificationStack
  notifications={notifications}
  onDismiss={(id) => removeNotification(id)}
  onAction={(id, actionId) => runAction(id, actionId)}
/>`}
        qtCode={`import ChaSet

ChaSetNotificationStack {
    notifications: demoNotifications
    onDismissed: function(id) { removeNotification(id) }
    onActionTriggered: function(id, actionId) { runAction(id, actionId) }
}`}
      />

      <section id="animations" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.animations', 'Animations')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('desktopComposite.notificationStack.animationsDesc', 'Motion tokens and lifetime contracts shared with the activity stack.')}
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground">
          <li>
            {t('desktopComposite.notificationStack.animationsBullet1', 'Notifications enter and exit over duration-medium (180ms) with the ease-standard curve, sliding through the anchored edge (Qt: ThemeTokens.motionMedium / ThemeTokens.easeStandard).')}
          </li>
          <li>
            {t('desktopComposite.notificationStack.animationsBullet2', 'Expiry is a remaining-time budget, not a bare timer: hovering the stack freezes every countdown mid-flight and releases it from the same remainder when the pointer leaves.')}
          </li>
          <li>
            {t('desktopComposite.notificationStack.animationsBullet3', 'A duration of 0 pins a notification on screen until it is dismissed, which is what action-bearing messages use.')}
          </li>
          <li>
            {t('desktopComposite.notificationStack.animationsBullet4', 'Every transition respects prefers-reduced-motion on Web and ThemeTokens.animationsEnabled in Qt, resolving durations to zero when motion is disabled.')}
          </li>
        </ul>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.keyboardNavigation', 'Keyboard Navigation')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('desktopComposite.notificationStack.keyboardDesc', 'The stack is a single tab stop: notification cards are roving-focus entries inside it.')}
        </p>
        <KeyboardShortcutsTable componentId="notification-stack" />
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.propsReference', 'Props Reference')}</h2>
        <PropsTable
          items={[
            {
              name: 'notifications',
              type: 'NotificationItem[]',
              default: '[]',
              description: t('components.notificationStack.notificationsDesc', 'Notifications to surface, oldest first; the newest card sits nearest the anchor.'),
            },
            {
              name: 'onDismiss',
              type: '(id: string) => void',
              default: 'undefined',
              description: t('components.notificationStack.onDismissDesc', 'Renders the per-card dismiss control and receives every auto-expiry.'),
            },
            {
              name: 'onAction',
              type: '(notificationId: string, actionId: string) => void',
              default: 'undefined',
              description: t('components.notificationStack.onActionDesc', 'Fired when an inline action button is pressed; the card stays until dismissed.'),
            },
            {
              name: 'placement',
              type: '"top-left" | "top-center" | "top-right" | "left-center" | "right-center" | "bottom-left" | "bottom-center" | "bottom-right"',
              default: "'bottom-right'",
              description: t('components.notificationStack.placementDesc', 'Viewport anchor. Cards enter and exit through the anchored edge.'),
            },
            {
              name: 'offset',
              type: 'number',
              default: '16',
              description: t('components.notificationStack.offsetDesc', 'Inset from the anchored viewport edges, in logical units.'),
            },
            {
              name: 'maxVisible',
              type: 'number',
              default: '4',
              description: t('components.notificationStack.maxVisibleDesc', 'Cards rendered before the stack overflows into its "show all" pill.'),
            },
            {
              name: 'defaultDuration',
              type: 'number',
              default: '5000',
              description: t('components.notificationStack.defaultDurationDesc', 'Lifetime for items that do not state their own duration.'),
            },
            {
              name: 'pauseOnHover',
              type: 'boolean',
              default: 'true',
              description: t('components.notificationStack.pauseOnHoverDesc', 'Suspends every expiry countdown while the pointer rests on the stack.'),
            },
            {
              name: 'collapsible',
              type: 'boolean',
              default: 'true',
              description: t('components.notificationStack.collapsibleDesc', 'Offers the collapse-to-summary-row control.'),
            },
            {
              name: 'defaultCollapsed',
              type: 'boolean',
              default: 'false',
              description: t('components.notificationStack.defaultCollapsedDesc', 'Renders the stack collapsed on first paint.'),
            },
            {
              name: 'label',
              type: 'string',
              default: "'Notifications'",
              description: t('components.notificationStack.labelDesc', 'Accessible name of the live region.'),
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          {t('components.notificationStack.itemFooterDesc', 'Each notification carries id, title, an optional description, a level of info | success | warning | error, an optional duration, dismissible and a list of actions (id, label, variant).')}
        </p>
      </section>
    </DocLayout>
  );
}
