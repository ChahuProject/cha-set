import { Badge, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { TYPOGRAPHY_RAMP_DATA } from '../../data/showcaseData.generated';

const CMAKE_SNIPPET = `target_link_libraries(YourApp PRIVATE ChaSet)`;

const CPP_SNIPPET = `#include <ChaSet/ChaSetFontSystem.h>

int main(int argc, char* argv[]) {
    // 1. Must precede QGuiApplication: resolves CHASET_TEXT_RENDER policy
    ChaSet::FontSystem::applyTextRenderType();

    QGuiApplication app(argc, argv);

    // 2. Injects CJK fallback substitution tables and configures grayscale antialiasing
    ChaSet::FontSystem::initialize(&app);

    QQmlApplicationEngine engine;
    // ...
    return app.exec();
}`;

const ENV_SNIPPET = `# Default: Qt's own outline rasterizer (smooth vector AA, curves scale smoothly)
export CHASET_TEXT_RENDER=qt
./YourApp

# Native: DirectWrite (Windows) / CoreText (macOS) (crisp grid-fitting for small upright text)
export CHASET_TEXT_RENDER=native
./YourApp

# Curve: Hardware GPU curve rasterizer (Qt 6.7+, scale-invariant GPU curve rendering)
export CHASET_TEXT_RENDER=curve
./YourApp`;

const WEB_CSS_SNIPPET = `@import "@chahu/cha-set/theme.css";

:root {
  /* Override primary font family while retaining prioritized CJK fallback */
  --font-sans: 'Inter', var(--cs-font-sans);
  --font-mono: 'JetBrains Mono', var(--cs-font-mono);
}`;

/**
 * Tailwind can only generate classes it can see literally, so the token step
 * names from spec/showcase/typography-ramp.json are mapped to their utility
 * here instead of being assembled at runtime.
 */
const STEP_UTILITY: Record<string, string> = {
  nano: 'text-nano',
  micro: 'text-micro',
  caption: 'text-caption',
  small: 'text-small',
  body: 'text-body',
  heading: 'text-heading',
  subheading: 'text-subheading',
  'title-sm': 'text-title-sm',
  'title-md': 'text-title-md',
  title: 'text-title',
  display: 'text-display',
};

export function TypographyPage() {
  const { t } = useChaSetI18n();
  const { scaleSteps, quotes } = TYPOGRAPHY_RAMP_DATA;

  const webInvariants = [
    { id: 'rasterizer', label: t('getStarted.typography.rasterizer.labelRasterizer', 'Rasterizer'), value: t('getStarted.typography.rasterizer.webValRasterizer', 'Grayscale alpha antialiasing') },
    { id: 'smoothing', label: t('getStarted.typography.rasterizer.labelSmoothing', 'Font smoothing'), value: t('getStarted.typography.rasterizer.webValSmoothing', 'antialiased · grayscale') },
    { id: 'hinting', label: t('getStarted.typography.rasterizer.labelFitting', 'Outline fitting'), value: t('getStarted.typography.rasterizer.webValFitting', 'None — text shaper follows the outline') },
    { id: 'scale', label: t('getStarted.typography.rasterizer.labelScale', 'Interface scale'), value: t('getStarted.typography.rasterizer.webValScale', 'Root font size multiplier') },
  ];

  const qtInvariants = [
    { id: 'rasterizer', label: t('getStarted.typography.rasterizer.labelRasterizer', 'Rasterizer'), value: t('getStarted.typography.rasterizer.qtValRasterizer', 'Selected by CHASET_TEXT_RENDER') },
    { id: 'policies', label: t('getStarted.typography.rasterizer.labelPolicies', 'Policies'), value: t('getStarted.typography.rasterizer.qtValPolicies', 'qt (default) · native · curve') },
    { id: 'subpixel', label: t('getStarted.typography.rasterizer.labelSubpixel', 'Subpixel AA'), value: t('getStarted.typography.rasterizer.qtValSubpixel', 'Disabled — grayscale only') },
    { id: 'hinting', label: t('getStarted.typography.rasterizer.labelHinting', 'Hinting'), value: t('getStarted.typography.rasterizer.qtValHinting', 'Vertical only') },
    { id: 'scale', label: t('getStarted.typography.rasterizer.labelScale', 'Interface scale'), value: t('getStarted.typography.rasterizer.qtValScale', 'uiScale multiplier on every size token') },
  ];

  return (
    <DocLayout
      category="Get Started"
      title="Typography Rendering"
      description="Global text rasterizer policy and a five-script size ramp previewing every type scale step."
      tocItems={[
        { id: 'rasterizer', title: 'Rasterization Path' },
        { id: 'ramp', title: 'Cross-Script Size Ramp' },
        { id: 'integration', title: 'Host Integration' },
      ]}
    >
      <div className="space-y-12">
        <section className="block" id="rasterizer">
          <h2>{t('getStarted.typography.rasterizer.title', 'Rasterization Path')}</h2>
          <p className="desc">
            {t('getStarted.typography.rasterizer.desc', 'The two stacks reach the same glyph outlines through different rasterizers. Web asks Chromium for grayscale antialiasing with no grid fitting; Desktop resolves one policy for the whole process before the first window exists.')}
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-body font-semibold text-foreground">
                  {t('getStarted.typography.rasterizer.webCardTitle', 'Web · Chromium')}
                </span>
                <Badge variant="secondary">React</Badge>
              </div>
              <dl className="space-y-2">
                {webInvariants.map((row) => (
                  <div key={row.id} className="flex items-baseline gap-4">
                    <dt className="w-32 shrink-0 text-micro text-muted-foreground">{row.label}</dt>
                    <dd className="min-w-0 flex-1 text-small text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-body font-semibold text-foreground">
                  {t('getStarted.typography.rasterizer.desktopCardTitle', 'Desktop · Qt Quick')}
                </span>
                <Badge variant="secondary">Qt</Badge>
              </div>
              <dl className="space-y-2">
                {qtInvariants.map((row) => (
                  <div key={row.id} className="flex items-baseline gap-4">
                    <dt className="w-32 shrink-0 text-micro text-muted-foreground">{row.label}</dt>
                    <dd className="min-w-0 flex-1 text-small text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="block" id="ramp">
          <h2>{t('getStarted.typography.ramp.title', 'Cross-Script Size Ramp')}</h2>
          <p className="desc">
            {t('getStarted.typography.ramp.desc', 'Five script portals, each rendered once per type scale step. The passage never changes inside a block, so strokes can be compared across the whole ramp — including the rounded CJK and Hangul curves that reveal grid fitting first. Sizes follow the type scale and the interface scale, so they are named by token instead of by unit.')}
          </p>

          <div className="space-y-6">
            {quotes.map((quote) => (
              <div
                key={quote.id}
                className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5"
              >
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-body font-semibold text-foreground">{quote.label}</span>
                    <span className="text-caption text-muted-foreground">{quote.native}</span>
                  </div>
                  <span className="text-caption font-mono text-muted-foreground">
                    {quote.attribution}
                  </span>
                </div>

                <div className="space-y-3">
                  {scaleSteps.map((step) => (
                    <div key={step} className="flex items-baseline gap-4">
                      <span className="w-24 shrink-0 font-mono text-micro text-muted-foreground">
                        {step}
                      </span>
                      <p
                        className={`min-w-0 flex-1 text-foreground ${STEP_UTILITY[step] ?? 'text-body'}`}
                      >
                        {quote.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="block" id="integration">
          <h2>{t('getStarted.typography.integration.title', 'Host Integration')}</h2>
          <p className="desc">
            {t('getStarted.typography.integration.desc', "How host applications configure and initialize ChaSet's typography subsystem across desktop and web runtimes.")}
          </p>

          <div className="space-y-6">
            {/* Desktop · Qt Card */}
            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <span className="text-body font-semibold text-foreground">
                  {t('getStarted.typography.integration.desktopTitle', 'Desktop · Qt Quick (C++ / QML)')}
                </span>
                <Badge variant="secondary">Qt</Badge>
              </div>
              <p className="mb-4 text-small text-muted-foreground">
                {t('getStarted.typography.integration.desktopDesc', 'Desktop applications initialize the typography system via ChaSet::FontSystem. Two calls in main.cpp configure DirectWrite pure alpha grayscale antialiasing, vertical hinting, and inject CJK fallback tables into QFontDatabase to eliminate bitmap SimSun degradation.')}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-caption font-medium text-foreground">
                    {t('getStarted.typography.integration.cmakeTitle', '1. CMake Target Linkage')}
                  </h4>
                  <CodeBlock code={CMAKE_SNIPPET} language="bash" filename="CMakeLists.txt" />
                </div>

                <div>
                  <h4 className="mb-2 text-caption font-medium text-foreground">
                    {t('getStarted.typography.integration.cppTitle', '2. C++ Initialization (main.cpp)')}
                  </h4>
                  <CodeBlock code={CPP_SNIPPET} language="ts" filename="main.cpp" />
                </div>

                <div>
                  <h4 className="mb-2 text-caption font-medium text-foreground">
                    {t('getStarted.typography.integration.envTitle', '3. Environment Variable Control (CHASET_TEXT_RENDER)')}
                  </h4>
                  <p className="mb-2 text-small text-muted-foreground">
                    {t('getStarted.typography.integration.envDesc', 'The window-level text rasterization policy is controlled dynamically before startup via the CHASET_TEXT_RENDER environment variable:')}
                  </p>
                  <ul className="mb-3 list-disc space-y-1 pl-5 text-small text-muted-foreground">
                    <li>
                      {t('getStarted.typography.integration.envQt', 'qt (default): Qt glyph outline rasterizer (QtTextRendering). Smooth grayscale outline coverage without OS pixel grid-fitting; curves remain smooth when scaled.')}
                    </li>
                    <li>
                      {t('getStarted.typography.integration.envNative', 'native: Operating-system rasterizer (DirectWrite / CoreText, NativeTextRendering). Crisp pixel-grid fitting for small upright text; staircasing on curves when scaled.')}
                    </li>
                    <li>
                      {t('getStarted.typography.integration.envCurve', 'curve: Hardware GPU curve rasterizer (CurveTextRendering, Qt 6.7+). Scale-invariant GPU curve rendering; automatically degrades to qt when a software rasterizer is active.')}
                    </li>
                  </ul>
                  <CodeBlock code={ENV_SNIPPET} language="bash" filename="Terminal" />
                </div>
              </div>
            </div>

            {/* Web · React Card */}
            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <span className="text-body font-semibold text-foreground">
                  {t('getStarted.typography.integration.webTitle', 'Web · Chromium (React / CSS)')}
                </span>
                <Badge variant="secondary">React</Badge>
              </div>
              <p className="mb-4 text-small text-muted-foreground">
                {t('getStarted.typography.integration.webDesc', 'Web applications in Chromium / browsers automatically inherit grayscale antialiasing (-webkit-font-smoothing: antialiased) and CJK fallback chains through CSS variables. Environment variables and C++ initialization do not apply to the Web stack.')}
              </p>

              <div>
                <h4 className="mb-2 text-caption font-medium text-foreground">
                  {t('getStarted.typography.integration.cssTokensTitle', 'CSS Tokens & Font Family Overrides')}
                </h4>
                <p className="mb-2 text-small text-muted-foreground">
                  {t('getStarted.typography.integration.cssTokensDesc', 'Reference var(--cs-font-sans) and var(--cs-font-mono) when customizing font stacks to preserve the prioritized Chinese fallback chain:')}
                </p>
                <CodeBlock code={WEB_CSS_SNIPPET} language="css" filename="styles.css" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocLayout>
  );
}