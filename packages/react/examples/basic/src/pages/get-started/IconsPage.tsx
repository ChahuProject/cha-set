import {
  Badge,
  CodeBlock,
  Icon,
  ICON_ADOPTION,
  ICON_AUDIT,
  ICON_CATEGORIES,
  ICON_COLOR,
  ICON_FAMILIES,
  ICON_GRIDS,
  ICON_METRICS,
  ICON_NAMES,
  ICON_RULES,
  ICON_SIZES,
  ICON_SPEC_ID,
  ICON_SPEC_SOURCE,
  ICON_SPEC_TITLE,
  ICON_SPECS,
  ICON_WEIGHTS,
  useChaSetI18n,
  type IconGridId,
  type IconName,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';

const CONFIG_SNIPPET = `{
  "icons": {
    "spec": "stroke-monoline"
  }
}`;

const ENV_SNIPPET = `# Pin every ChaSet icon in this build to one specification
export CHASET_ICON_SPEC=stroke-monoline

# An id that is registered but not implemented fails loudly instead of silently
# falling back — that is the point of the switch.
export CHASET_ICON_SPEC=duotone-fill
#   -> unknown icon specification ... status "planned" and carries no geometry`;

const WORKFLOW_SNIPPET = `# 1. Change the specification or the artwork (one place, both stacks)
$EDITOR spec/icons/registry.json

# 2. Emit the web + desktop artifacts from that geometry
pnpm gen:icons

# 3. Prove the specification still holds
pnpm check:icons`;

const CONSUME_SNIPPET = `// Web
<Icon name="rotate-ccw" className="size-4" />
<Icon name="window-close" size={10} />   // dense chrome grid, hairline stroke

// Desktop (QML)
ChaSetIcon { name: "rotate-ccw"; size: 16; color: ThemeTokens.text }`;

/** The three Scale OSD controls whose glyph/weight drift motivated the whole rule set. */
const OSD_CONTROLS: IconName[] = ['minus', 'plus', 'rotate-ccw'];
/** Icons that are exactly centred on their grid, used as visible centring proofs. */
const CENTERING_PROOF: IconName[] = ['minus', 'plus', 'rotate-ccw', 'x', 'stop', 'window-close'];

function CenteringProof({ name, size = 32 }: { name: IconName; size?: number }) {
  const audit = ICON_AUDIT[name];
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative grid size-12 place-items-center rounded-md border border-border bg-card">
        {/* Grid centre guides: an icon is centred when both crosshairs pass through it. */}
        <div className="absolute inset-x-0 top-1/2 h-[0.0625rem] -translate-y-1/2 bg-primary/45" />
        <div className="absolute inset-y-0 left-1/2 w-[0.0625rem] -translate-x-1/2 bg-primary/45" />
        <Icon name={name} size={size} className="relative text-foreground" />
      </div>
      <span className="font-mono text-nano text-muted-foreground">{name}</span>
      <span className="font-mono text-nano text-muted-foreground">
        dx {audit ? audit.offsetX.toFixed(2) : 'n/a'} · dy {audit ? audit.offsetY.toFixed(2) : 'n/a'}
      </span>
    </div>
  );
}

export function IconsPage() {
  const { t } = useChaSetI18n();
  const metrics = ICON_METRICS;
  const grids = (Object.keys(ICON_GRIDS) as IconGridId[]).map(
    (id) => [id, ICON_GRIDS[id]] as const,
  );
  const textGlyphs = ICON_ADOPTION.textGlyphSites;
  const exemptSites = ICON_ADOPTION.inlineSvgSites.filter((site) => site.exempted > 0);
  const exemptTotal = exemptSites.reduce((sum, site) => sum + site.exempted, 0);
  const inlineTotal = ICON_ADOPTION.inlineSvgSites.reduce((sum, site) => sum + site.count, 0);

  const precedence = [
    {
      id: 'env',
      label: t('getStarted.icons.configuration.stepEnvLabel', 'Environment variable CHASET_ICON_SPEC'),
      value: t('getStarted.icons.configuration.stepEnvVal', 'Highest priority — per shell, per CI job, no file edit.'),
    },
    {
      id: 'config',
      label: t('getStarted.icons.configuration.stepConfigLabel', 'chaset.config.json → icons.spec'),
      value: t('getStarted.icons.configuration.stepConfigVal', 'Project-level switch; committed, so the choice travels with the repository.'),
    },
    {
      id: 'registry',
      label: t('getStarted.icons.configuration.stepRegistryLabel', 'spec/icons/registry.json → activeSpec'),
      value: t('getStarted.icons.configuration.stepRegistryVal', 'Library-level default when the host declares nothing.'),
    },
    {
      id: 'fallback',
      label: t('getStarted.icons.configuration.stepFallbackLabel', 'First implemented specification'),
      value: t('getStarted.icons.configuration.stepFallbackVal', 'Last resort, so a missing switch never breaks a build.'),
    },
  ];

  return (
    <DocLayout
      category="Get Started"
      title="Icon System"
      description={t('components.icon-system.description', 'One icon specification for both stacks: single geometry source, one stroke weight, optical centring by construction, and how to switch specifications.')}
      tocItems={[
        { id: 'specification', title: t('getStarted.icons.specification.title', 'Active Specification') },
        { id: 'rules', title: t('getStarted.icons.rules.title', 'Governance Rules') },
        { id: 'grids', title: t('getStarted.icons.grids.title', 'Grids, Weight & Size') },
        { id: 'centering', title: t('getStarted.icons.centering.title', 'Optical Centring') },
        { id: 'gallery', title: t('getStarted.icons.gallery.title', 'Icon Gallery') },
        { id: 'configuration', title: t('getStarted.icons.configuration.title', 'External Configuration') },
        { id: 'extensibility', title: t('getStarted.icons.extensibility.title', 'Extending the Specification') },
      ]}
    >
      <div className="space-y-12">
        {/* 1. Active specification */}
        <section className="block" id="specification">
          <h2>{t('getStarted.icons.specification.title', 'Active Specification')}</h2>
          <p className="desc">
            {t('getStarted.icons.specification.desc', 'Icons are declared once in spec/icons/registry.json and code-generated into both stacks. React renders the element vocabulary natively; Qt receives the same shapes compiled to path data. Neither stack owns artwork of its own, which is what makes the two platforms agree by construction rather than by review.')}
          </p>

          <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <span className="text-body font-semibold text-foreground">{ICON_SPEC_TITLE}</span>
              <Badge variant="secondary">{ICON_SPEC_ID}</Badge>
              <Badge variant="outline">
                {t('getStarted.icons.specification.iconsCount', '{{count}} icons', { count: ICON_NAMES.length })}
              </Badge>
            </div>
            <dl className="space-y-2">
              {[
                { id: 'grid', label: t('getStarted.icons.specification.rowGrid', 'Grid'), value: t('getStarted.icons.specification.valGrid', '{{grid}} units', { grid: metrics.grid }) },
                { id: 'live', label: t('getStarted.icons.specification.rowLive', 'Live area'), value: t('getStarted.icons.specification.valLive', '{{liveArea}} units (safe margin {{margin}})', { liveArea: metrics.liveArea, margin: (metrics.grid - metrics.liveArea) / 2 }) },
                { id: 'stroke', label: t('getStarted.icons.specification.rowStroke', 'Stroke'), value: t('getStarted.icons.specification.valStroke', '{{strokeWidth}} units, {{linecap}} caps, {{linejoin}} joins', { strokeWidth: metrics.strokeWidth, linecap: metrics.linecap, linejoin: metrics.linejoin }) },
                { id: 'fill', label: t('getStarted.icons.specification.rowFill', 'Fill policy'), value: metrics.fillPolicy },
                { id: 'tolerance', label: t('getStarted.icons.specification.rowTolerance', 'Centring tolerance'), value: t('getStarted.icons.specification.valTolerance', '{{tolerance}} units', { tolerance: metrics.opticalCenterTolerance }) },
                { id: 'colour', label: t('getStarted.icons.specification.rowColour', 'Colour'), value: ICON_COLOR.policy },
                { id: 'resolved', label: t('getStarted.icons.specification.rowResolved', 'Resolved through'), value: ICON_SPEC_SOURCE },
              ].map((row) => (
                <div key={row.id} className="flex items-baseline gap-4">
                  <dt className="w-40 shrink-0 text-micro text-muted-foreground">{row.label}</dt>
                  <dd className="min-w-0 flex-1 font-mono text-small text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 2. Rules */}
        <section className="block" id="rules">
          <h2>{t('getStarted.icons.rules.title', 'Governance Rules')}</h2>
          <p className="desc">
            {t('getStarted.icons.rules.desc', 'Each rule below is enforced by pnpm check:icons, which also runs inside pnpm gate. A rule that is not machine-checked would only be a slogan, so the enforcement column names the assertion that fails.')}
          </p>

          <div className="space-y-3">
            {ICON_RULES.map((rule, index) => (
              <div key={rule.id} className="rounded-lg border border-border bg-card p-4 text-card-foreground">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-nano text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-small font-semibold text-foreground">{rule.title}</span>
                  <span className="font-mono text-nano text-primary">{rule.enforcement}</span>
                </div>
                <p className="text-small text-muted-foreground">{rule.statement}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Grids, weight and size */}
        <section className="block" id="grids">
          <h2>{t('getStarted.icons.grids.title', 'Grids, Weight & Size')}</h2>
          <p className="desc">
            {t('getStarted.icons.grids.desc', 'A grid pairs a drawing box with the stroke width that box expects, and states the render size it was drawn for. Two grids are declared: the default 24-unit grid for UI icons, drawn for a 16px render, and a dense 10-unit chrome grid whose 1-unit stroke stays hairline on window captions instead of collapsing to a sub-pixel smear.')}
          </p>

          <div className="mb-6 space-y-3">
            {grids.map(([id, grid]) => (
              <div key={id} className="rounded-lg border border-border bg-card p-4 text-card-foreground">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-small font-semibold text-foreground">{id}</span>
                  <Badge variant="secondary">
                    {t('getStarted.icons.grids.gridBadge', '{{size}} units · stroke {{strokeWidth}}', { size: grid.size, strokeWidth: grid.strokeWidth })}
                  </Badge>
                  <span className="font-mono text-nano text-muted-foreground">
                    {t('getStarted.icons.grids.safeMargin', 'safe margin {{margin}}', { margin: grid.safeMargin })}
                  </span>
                  <span className="font-mono text-nano text-muted-foreground">
                    {t('getStarted.icons.grids.drawnFor', 'drawn for {{renderSize}}px → {{stroke}}px stroke', { renderSize: grid.renderSize, stroke: grid.strokeAtRenderSize })}
                  </span>
                  <span className="font-mono text-nano text-muted-foreground">
                    {t('getStarted.icons.grids.floor', 'floor {{size}} / {{strokeWidth}} = {{floor}}px', { size: grid.size, strokeWidth: grid.strokeWidth, floor: grid.strokeFloor })}
                  </span>
                </div>
                <p className="text-small text-muted-foreground">{grid.note}</p>
                <p className="mt-2 text-small text-muted-foreground">
                  {t('getStarted.icons.grids.gridDesc', '{{renderSize}}px is the size this grid was drawn for, where its stroke paints {{stroke}}px — the weight the artwork was proportioned to carry. Under {{floor}}px that stroke is under a pixel and the glyph ships lighter than its artwork declares, so the steps this grid is honest at are {{sizes}}. A size outside that list is not a smaller icon, it is a lighter one — measured rather than banned, because a 2x display forgives it, so the gate lists every reference below its floor and each one is a decision instead of an accident.', {
                    renderSize: grid.renderSize,
                    stroke: grid.strokeAtRenderSize,
                    floor: grid.strokeFloor,
                    sizes: grid.renderSizes.join(', '),
                  })}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
            <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <span className="text-body font-semibold text-foreground">{t('getStarted.icons.grids.familiesTitle', 'Control families')}</span>
              <Badge variant="outline">
                {t('getStarted.icons.grids.familiesDeclared', '{{count}} declared', { count: ICON_FAMILIES.length })}
              </Badge>
            </div>
            <p className="mb-4 text-small text-muted-foreground">
              {t('getStarted.icons.grids.familiesDesc', 'A family names icons that render together inside one control. Their grid is then a promise about the control rather than about any single icon, which is what the caption close button broke: every icon involved was individually valid, and the row was still wrong. The gate asserts that no family spans two grids.')}
            </p>
            <div className="space-y-4">
              {ICON_FAMILIES.map((family) => {
                const head = family.icons.at(0);
                const familyGrid: IconGridId = (head && ICON_AUDIT[head]?.grid) || 'default';
                return (
                  <div key={family.id} className="rounded-md border border-border bg-muted/30 p-3">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-micro text-foreground">{family.id}</span>
                      <span className="text-micro text-muted-foreground">{family.title}</span>
                      <Badge variant="secondary">
                        {t('getStarted.icons.grids.unitGridBadge', '{{size}} unit grid', { size: ICON_GRIDS[familyGrid].size })}
                      </Badge>
                    </div>
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      {family.icons.map((name) => {
                        const gridId: IconGridId = ICON_AUDIT[name]?.grid || 'default';
                        return (
                          <span key={name} className="flex items-center gap-1.5">
                            <Icon name={name} size={ICON_GRIDS[gridId].strokeFloor} className="text-foreground" />
                            <span className="font-mono text-nano text-muted-foreground">{name}</span>
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-micro text-muted-foreground">{family.note}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
              <span className="text-body font-semibold text-foreground">{t('getStarted.icons.grids.weightTitle', 'Weight')}</span>
              <Badge variant="outline">
                {t('getStarted.icons.grids.weightPermitted', '{{count}} permitted', { count: ICON_WEIGHTS.length })}
              </Badge>
            </div>
            {ICON_WEIGHTS.map((weight) => (
              <div key={weight.id} className="flex items-baseline gap-4">
                <dt className="w-24 shrink-0 font-mono text-micro text-muted-foreground">{weight.label}</dt>
                <dd className="min-w-0 flex-1 text-small text-muted-foreground">
                  <span className="text-foreground">
                    {t('getStarted.icons.grids.weightStrokePrefix', 'stroke {{strokeWidth}} — ', { strokeWidth: weight.strokeWidth })}
                  </span>
                  {weight.usage}
                </dd>
              </div>
            ))}

            <div className="mt-5 border-t border-border pt-4">
              <div className="mb-3 text-micro font-medium text-muted-foreground">
                {t('getStarted.icons.grids.sizeRampTitle', 'Size ramp — one icon, every step of the scale, no hand scaling')}
              </div>
              <div className="flex flex-wrap items-end gap-5">
                {ICON_SIZES.ramp.map((size) => (
                  <div key={size} className="flex flex-col items-center gap-1.5">
                    <Icon name="search" size={size} className="text-foreground" />
                    <span className="font-mono text-nano text-muted-foreground">{size}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid gap-1 text-micro text-muted-foreground sm:grid-cols-2">
                <span>
                  {t('getStarted.icons.grids.webLabel', 'Web · {{size}}', { size: ICON_SIZES.react })}
                </span>
                <span>
                  {t('getStarted.icons.grids.desktopLabel', 'Desktop · {{size}}', { size: ICON_SIZES.qt })}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Optical centring */}
        <section className="block" id="centering">
          <h2>{t('getStarted.icons.centering.title', 'Optical Centring')}</h2>
          <p className="desc">
            {t('getStarted.icons.centering.desc', 'Centring is a property of the geometry, not something a component fixes afterwards. The gate measures the painted bounding box (artwork plus half the stroke) and fails when its centre drifts more than {{tolerance}} units from the grid centre. Anchors offsets and padding are deliberately not an accepted fix: they centre a box, not the ink inside it.', { tolerance: metrics.opticalCenterTolerance })}
          </p>

          <div className="mb-6 rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
            <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-border pb-3">
              <span className="text-body font-semibold text-foreground">
                {t('getStarted.icons.centering.osdTrioTitle', 'The Scale OSD control trio')}
              </span>
              <Badge variant="secondary">ScaleOsd</Badge>
            </div>
            <p className="mb-5 text-small text-muted-foreground">
              {t('getStarted.icons.centering.osdTrioDesc', "These three controls used to be typography: a bold plus, a bold minus sign and a regular reset arrow. Besides the mixed weight, a font's ascent and descent are not symmetric, so the arrow inherited a baseline that pushed it visibly low inside its pill. They are now three icons from this specification — same stroke, same grid, centred by geometry.")}
            </p>
            <div className="flex flex-wrap items-start gap-6">
              {OSD_CONTROLS.map((name) => (
                <CenteringProof key={name} name={name} />
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
            <div className="mb-3 text-micro font-medium text-muted-foreground">
              {t('getStarted.icons.centering.measuredOffsetsTitle', 'Measured offsets — painted centre minus grid centre, in grid units')}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {CENTERING_PROOF.map((name) => {
                const audit = ICON_AUDIT[name];
                return (
                  <div key={name} className="rounded-md border border-border/70 p-3">
                    <div className="mb-2 flex items-center justify-center">
                      <Icon name={name} size={24} className="text-foreground" />
                    </div>
                    <div className="font-mono text-nano text-foreground">{name}</div>
                    <div className="font-mono text-nano text-muted-foreground">
                      dx {audit ? audit.offsetX.toFixed(2) : 'n/a'} · dy {audit ? audit.offsetY.toFixed(2) : 'n/a'}
                    </div>
                    <div className="font-mono text-nano text-muted-foreground">
                      grid {audit ? audit.gridSize : 'n/a'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Gallery */}
        <section className="block" id="gallery">
          <h2>{t('getStarted.icons.gallery.title', 'Icon Gallery')}</h2>
          <p className="desc">
            {t('getStarted.icons.gallery.desc', 'Every icon of the active specification, rendered by name from the generated registry. Adding an icon to the registry makes it appear here on both stacks at once, and the gate refuses a name that has no geometry behind it.')}
          </p>

          <div className="space-y-4">
            {ICON_CATEGORIES.map((category) => (
              <div key={category.id} className="rounded-lg border border-border bg-card p-4 text-card-foreground">
                <div className="mb-3 flex flex-wrap items-center gap-2 border-b border-border pb-3">
                  <span className="text-small font-semibold text-foreground">{category.title}</span>
                  <Badge variant="secondary">{category.icons.length}</Badge>
                  <span className="font-mono text-nano text-muted-foreground">{category.id}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-6">
                  {category.icons.map((name) => (
                    <div
                      key={name}
                      className="flex flex-col items-center gap-2 rounded-md border border-transparent px-1 py-3 transition-colors duration-quick ease-standard hover:border-border hover:bg-muted/40"
                    >
                      <Icon name={name as IconName} className="size-5 text-foreground" />
                      <span className="w-full truncate text-center font-mono text-nano text-muted-foreground" title={name}>
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Configuration */}
        <section className="block" id="configuration">
          <h2>{t('getStarted.icons.configuration.title', 'External Configuration')}</h2>
          <p className="desc">
            {t('getStarted.icons.configuration.desc', 'A host that wants the whole of ChaSet pinned to one specification does not edit the library. It declares the id externally; the generator bakes the resolved id into both artifacts, so the choice is observable at runtime through ICON_SPEC_ID (web) and ChaSetIcons.specId (desktop).')}
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
              <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
                <span className="text-body font-semibold text-foreground">
                  {t('getStarted.icons.configuration.resolutionOrder', 'Resolution order')}
                </span>
                <Badge variant="outline">
                  {t('getStarted.icons.configuration.firstMatchWins', 'first match wins')}
                </Badge>
              </div>
              <ol className="space-y-2">
                {precedence.map((step, index) => (
                  <li key={step.id} className="flex items-baseline gap-4">
                    <span className="w-6 shrink-0 font-mono text-micro text-muted-foreground">{index + 1}</span>
                    <span className="w-64 shrink-0 font-mono text-small text-foreground">{step.label}</span>
                    <span className="min-w-0 flex-1 text-small text-muted-foreground">{step.value}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-small text-muted-foreground">
                {t('getStarted.icons.configuration.currentlyResolved', 'Currently resolved through {{source}}.', { source: ICON_SPEC_SOURCE })}
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
                <h4 className="mb-2 text-caption font-medium text-foreground">
                  {t('getStarted.icons.configuration.projectConfigFile', 'Project configuration file')}
                </h4>
                <p className="mb-3 text-small text-muted-foreground">
                  {t('getStarted.icons.configuration.projectConfigDesc', 'Commit this next to your package manifest to pin the specification for everyone building the project.')}
                </p>
                <CodeBlock code={CONFIG_SNIPPET} language="json" filename="chaset.config.json" />
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
                <h4 className="mb-2 text-caption font-medium text-foreground">
                  {t('getStarted.icons.configuration.envOverride', 'Environment override')}
                </h4>
                <p className="mb-3 text-small text-muted-foreground">
                  {t('getStarted.icons.configuration.envOverrideDesc', 'Useful for CI matrices that build the same sources under several specifications.')}
                </p>
                <CodeBlock code={ENV_SNIPPET} language="bash" filename="Terminal" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
              <h4 className="mb-2 text-caption font-medium text-foreground">
                {t('getStarted.icons.configuration.consumingIcons', 'Consuming icons')}
              </h4>
              <CodeBlock code={CONSUME_SNIPPET} language="tsx" filename="usage.tsx" />
            </div>
          </div>
        </section>

        {/* 7. Extensibility */}
        <section className="block" id="extensibility">
          <h2>{t('getStarted.icons.extensibility.title', 'Extending the Specification')}</h2>
          <p className="desc">
            {t('getStarted.icons.extensibility.desc', 'The registry holds a list of specifications, not a single hard-coded one. A new specification is a new entry with its own grid, stroke and artwork; nothing in either stack needs to change, because both consume whichever entry the configuration selects.')}
          </p>

          <div className="mb-6 space-y-3">
            {ICON_SPECS.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border bg-card p-4 text-card-foreground">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-small font-semibold text-foreground">{entry.title}</span>
                  <Badge variant={entry.status === 'implemented' ? 'secondary' : 'outline'}>{entry.status}</Badge>
                  <span className="font-mono text-nano text-muted-foreground">{entry.id}</span>
                </div>
                <p className="text-small text-muted-foreground">{entry.summary}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
            <h4 className="mb-2 text-caption font-medium text-foreground">
              {t('getStarted.icons.extensibility.workflow', 'Workflow')}
            </h4>
            <CodeBlock code={WORKFLOW_SNIPPET} language="bash" filename="Terminal" />
            <div className="mt-4 grid gap-3 text-small text-muted-foreground sm:grid-cols-2">
              <div>
                <div className="mb-1 text-micro font-medium text-foreground">
                  {t('getStarted.icons.extensibility.adoptionRatchet', 'Adoption ratchet')}
                </div>
                <p>
                  {t('getStarted.icons.extensibility.adoptionRatchetDesc', '{{total}} hand-authored <svg> site(s) remain in the frozen migration backlog against a budget of {{budget}}. The gate fails when that number grows, so the backlog can only shrink.', {
                    total: inlineTotal,
                    budget: ICON_ADOPTION.maxInlineSvgSites,
                  })}
                </p>
              </div>
              <div>
                <div className="mb-1 text-micro font-medium text-foreground">
                  {t('getStarted.icons.extensibility.textGlyphsTitle', 'Text glyphs used as icons')}
                </div>
                <p>
                  {t('getStarted.icons.extensibility.textGlyphsDesc', '{{count}} remaining. Characters such as plus, minus sign and the reset arrow are typography: they inherit weight, size and baseline from surrounding copy — the mechanism behind both defects this specification was written to remove.', {
                    count: textGlyphs.length,
                  })}
                </p>
              </div>
              <div className="sm:col-span-2">
                <div className="mb-1 text-micro font-medium text-foreground">
                  {t('getStarted.icons.extensibility.excusedTitle', 'Excused as non-iconography ({{total}})', { total: exemptTotal })}
                </div>
                {exemptSites.length === 0 ? (
                  <p>{t('getStarted.icons.extensibility.excusedNone', 'None. Every inline artwork site in the repository owes a migration.')}</p>
                ) : (
                  <ul className="space-y-1">
                    {exemptSites.map((site) => (
                      <li key={site.file}>
                        <code className="font-mono text-micro text-foreground">{site.file}</code>
                        {' — '}
                        {site.reasons.join('; ')}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-1">
                  {t('getStarted.icons.extensibility.excusedFootnote', 'Parametric vector art has no 24-grid stroke representation, so leaving it inside the budget would make the budget permanently unreachable. It is excluded instead — visibly, and only through a marker that carries a reason and must sit directly above the artwork it excuses. A marker that is unreasoned, dangling, or not attached to a following <svg> fails the gate.')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}
