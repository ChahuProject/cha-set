import { Badge, CodeBlock } from '@chahu/cha-set';
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

const WEB_INVARIANTS = [
  { id: 'rasterizer', label: 'Rasterizer', value: 'Grayscale alpha antialiasing' },
  { id: 'smoothing', label: 'Font smoothing', value: 'antialiased · grayscale' },
  { id: 'hinting', label: 'Outline fitting', value: 'None — text shaper follows the outline' },
  { id: 'scale', label: 'Interface scale', value: 'Root font size multiplier' },
];

const QT_INVARIANTS = [
  { id: 'rasterizer', label: 'Rasterizer', value: 'Selected by CHASET_TEXT_RENDER' },
  { id: 'policies', label: 'Policies', value: 'qt (default) · native · curve' },
  { id: 'subpixel', label: 'Subpixel AA', value: 'Disabled — grayscale only' },
  { id: 'hinting', label: 'Hinting', value: 'Vertical only' },
  { id: 'scale', label: 'Interface scale', value: 'uiScale multiplier on every size token' },
];

export function TypographyPage() {
  const { scaleSteps, quotes } = TYPOGRAPHY_RAMP_DATA;

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
          <h2>Rasterization Path</h2>
          <p className="desc">
            The two stacks reach the same glyph outlines through different rasterizers. Web asks
            Chromium for grayscale antialiasing with no grid fitting; Desktop resolves one policy
            for the whole process before the first window exists.
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-body font-semibold text-foreground">Web · Chromium</span>
                <Badge variant="secondary">React</Badge>
              </div>
              <dl className="space-y-2">
                {WEB_INVARIANTS.map((row) => (
                  <div key={row.id} className="flex items-baseline gap-4">
                    <dt className="w-32 shrink-0 text-micro text-muted-foreground">{row.label}</dt>
                    <dd className="min-w-0 flex-1 text-small text-foreground">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-body font-semibold text-foreground">Desktop · Qt Quick</span>
                <Badge variant="secondary">Qt</Badge>
              </div>
              <dl className="space-y-2">
                {QT_INVARIANTS.map((row) => (
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
          <h2>Cross-Script Size Ramp</h2>
          <p className="desc">
            Five script portals, each rendered once per type scale step. The passage never changes
            inside a block, so strokes can be compared across the whole ramp — including the
            rounded CJK and Hangul curves that reveal grid fitting first. Sizes follow the type
            scale and the interface scale, so they are named by token instead of by unit.
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
          <h2>Host Integration</h2>
          <p className="desc">
            How host applications configure and initialize ChaSet's typography subsystem across
            desktop and web runtimes.
          </p>

          <div className="space-y-6">
            {/* Desktop · Qt Card */}
            <div className="rounded-lg border border-border bg-card p-4 text-card-foreground md:p-5">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <span className="text-body font-semibold text-foreground">
                  Desktop · Qt Quick (C++ / QML)
                </span>
                <Badge variant="secondary">Qt</Badge>
              </div>
              <p className="mb-4 text-small text-muted-foreground">
                Desktop applications initialize the typography system via{' '}
                <code className="font-mono text-micro text-foreground">ChaSet::FontSystem</code>.
                Two calls in{' '}
                <code className="font-mono text-micro text-foreground">main.cpp</code> configure
                DirectWrite pure alpha grayscale antialiasing, vertical hinting, and inject CJK
                fallback tables into{' '}
                <code className="font-mono text-micro text-foreground">QFontDatabase</code> to
                eliminate bitmap SimSun degradation.
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-caption font-medium text-foreground">
                    1. CMake Target Linkage
                  </h4>
                  <CodeBlock code={CMAKE_SNIPPET} language="bash" filename="CMakeLists.txt" />
                </div>

                <div>
                  <h4 className="mb-2 text-caption font-medium text-foreground">
                    2. C++ Initialization (main.cpp)
                  </h4>
                  <CodeBlock code={CPP_SNIPPET} language="ts" filename="main.cpp" />
                </div>

                <div>
                  <h4 className="mb-2 text-caption font-medium text-foreground">
                    3. Environment Variable Control (CHASET_TEXT_RENDER)
                  </h4>
                  <p className="mb-2 text-small text-muted-foreground">
                    The window-level text rasterization policy is controlled dynamically before
                    startup via the{' '}
                    <code className="font-mono text-micro text-foreground">
                      CHASET_TEXT_RENDER
                    </code>{' '}
                    environment variable:
                  </p>
                  <ul className="mb-3 list-disc space-y-1 pl-5 text-small text-muted-foreground">
                    <li>
                      <strong className="text-foreground">qt (default)</strong>: Qt glyph outline
                      rasterizer (QtTextRendering). Smooth grayscale outline coverage without OS pixel
                      grid-fitting; curves remain smooth when scaled.
                    </li>
                    <li>
                      <strong className="text-foreground">native</strong>: Operating-system rasterizer
                      (DirectWrite / CoreText, NativeTextRendering). Crisp pixel-grid fitting for small
                      upright text; staircasing on curves when scaled.
                    </li>
                    <li>
                      <strong className="text-foreground">curve</strong>: Hardware GPU curve
                      rasterizer (CurveTextRendering, Qt 6.7+). Scale-invariant GPU curve rendering;
                      automatically degrades to qt when a software rasterizer is active.
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
                  Web · Chromium (React / CSS)
                </span>
                <Badge variant="secondary">React</Badge>
              </div>
              <p className="mb-4 text-small text-muted-foreground">
                Web applications in Chromium / browsers automatically inherit grayscale
                antialiasing (
                <code className="font-mono text-micro text-foreground">
                  -webkit-font-smoothing: antialiased
                </code>
                ) and CJK fallback chains through CSS variables. Environment variables and C++
                initialization do not apply to the Web stack.
              </p>

              <div>
                <h4 className="mb-2 text-caption font-medium text-foreground">
                  CSS Tokens & Font Family Overrides
                </h4>
                <p className="mb-2 text-small text-muted-foreground">
                  Reference{' '}
                  <code className="font-mono text-micro text-foreground">
                    var(--cs-font-sans)
                  </code>{' '}
                  and{' '}
                  <code className="font-mono text-micro text-foreground">
                    var(--cs-font-mono)
                  </code>{' '}
                  when customizing font stacks to preserve the prioritized Chinese fallback chain:
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