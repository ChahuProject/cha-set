# ChaSet Internationalization (i18n) Architecture Specification

> **Authoritative Specification**: Defines ChaSet's cross-stack internationalization subsystem, Single Source of Truth (SoT) dictionary topologies, dynamic runtime reactivity models, and open downstream extensibility protocols across React (Web) and Qt Quick (Desktop).

---

## 1. Role & System Boundaries

- **Core Role**: Provides a unified, cross-stack internationalization framework for ChaSet UI components and showcases, serving built-in Simplified Chinese (`zh-CN`) and English (`en-US`) locales while empowering host applications to dynamically register custom languages and override translation dictionaries without modifying library source code.
- **Scope Delineation**:
  - **In-Scope (Handled by ChaSet i18n)**:
    - Single-source-of-truth language metadata, namespaces, and dictionary bundles in `spec/i18n/`.
    - Automated code generation emitting typed TypeScript modules (`locales.generated.ts`) and QML singletons (`ChaSetI18nData.generated.qml`).
    - Key parity and interpolation variable validation (`{{var}}` consistency) during generation and build gates.
    - React runtime singleton registry (`registry.ts`), context provider (`ChaSetI18nProvider`), and reactive hook (`useChaSetI18n`).
    - Qt QML singleton (`ChaSetI18n.qml`) tracking reactive revision counters to trigger zero-reload dynamic binding re-evaluations.
    - System OS locale detection and BCP-47 normalization across browser environments and Qt desktop runtimes.
    - Reusable cross-stack UI component `LanguageSettings` (React `<LanguageSettings>` and Qt `ChaSetLanguageSettings.qml`) featuring system detection, language selection cards, and cultural quotes.
    - Dynamic localization of Showcase navigation categories, search placeholders, and controls.
  - **Out-of-Scope (Delegated Externally)**:
    - Host-application-specific business translation catalogs (e.g. host business entities, remote API error strings).
    - Machine translation or runtime network fetching of remote translation bundles (hosts fetch and supply bundles via `registerLocale()`).
    - Direct modification of host application settings files outside ChaSet components.

---

## 2. Core Data Flow & Lifecycle

```
[spec/i18n/meta.json + locales/*.json]
               │
               ▼ (pnpm gen:all / generate-i18n.mjs)
   ┌───────────┴───────────┐
   ▼                       ▼
[locales.generated.ts]  [ChaSetI18nData.generated.qml]
   │                       │
   ▼ (React Runtime)       ▼ (Qt QML Runtime)
[I18nRegistry singleton] [ChaSetI18n singleton]
   │                       │
   ├── useChaSetI18n()     ├── ChaSetI18n.tr()
   ├── <LanguageSettings>  ├── ChaSetLanguageSettings
   └── <ThemeSettings>     └── ChaSetThemeSettings
```

### 2.1 Specification & Parity Verification
1. All language definitions originate in `spec/i18n/meta.json` (declaring `defaultLocale`, `fallbackLocale`, language match rules, and cultural preview quotes) and `spec/i18n/locales/<locale>.json` (divided into namespaces: `common`, `theme`, `language`, `showcase`).
2. `spec/generators/generate-i18n.mjs` verifies 100% key parity and interpolation variable symmetry between `zh-CN.json` and `en-US.json`. Any missing key or mismatched `{{var}}` throws an error and fails `pnpm gate`.
3. The generator produces statically-typed artifacts:
   - React: `packages/react/src/i18n/locales.generated.ts`
   - Qt: `qt/src/ChaSetI18nData.generated.qml`

### 2.2 Three-Tier Extensibility Model
To prevent ChaSet from bloating with hundreds of localized strings while allowing downstream applications (such as `dunting-qt` and `chahu-render-debugger`) to support any language:
1. **Tier 1 (Registry Extension - `registerLocale`)**:
   - React: `registerLocale(metadata, messages)`
   - Qt: `ChaSetI18n.registerLocale(metadata, messages)`
   - Dynamically adds a new language (e.g., `ja-JP`, `de-DE`, `fr-FR`). The new language instantly renders in `LanguageSettings` cards and translates ChaSet components.
2. **Tier 2 (Dictionary Patch - `extendLocale`)**:
   - React: `extendLocale(code, messages)`
   - Qt: `ChaSetI18n.extendLocale(code, messages)`
   - Deep-merges custom strings into existing locales without overwriting unmodified keys.
3. **Tier 3 (Host Engine Redirection - `customResolver` / `textProvider`)**:
   - Component prop: `<ThemeSettings textProvider={...} />` / `ChaSetThemeSettings { textProvider: ... }`.
   - Global redirection: `registry.setCustomResolver(...)` / `ChaSetI18n.setCustomResolver(...)`.
   - Allows hosts with native `react-i18next` or Qt `QTranslator` + `qsTr()` to delegate all lookups directly to their existing infrastructure.

### 2.3 Dynamic Reactivity Model
- **React**: Preference updates via `setLocalePreference()` notify subscribers and trigger React re-renders through `useChaSetI18n()`. Preference is persisted to `localStorage` under `chaset.locale`.
- **Qt Quick**: `ChaSetI18n.tr()` reads properties `revision` and `locale`. In Qt Quick's binding engine, reading a property inside a bound function creates an automatic reactive dependency. When `ChaSetI18n.setPreference()` updates `revision`, Qt marks all dependent bindings dirty and recalculates them immediately without reloading the QML window or recreating visual components.

---

## 3. Code Module Mapping Table

| Logical Role / Layer | Corresponding File / Directory Path | Responsibilities & Key Interfaces / Types |
| :--- | :--- | :--- |
| **Spec & Metadata (SSOT)** | `spec/i18n/meta.json` | Master catalog of supported locales, BCP-47 match rules, and cultural quotes |
| **Spec Dictionaries** | `spec/i18n/locales/zh-CN.json`<br/>`spec/i18n/locales/en-US.json` | Authoritative translation catalogs divided by namespace (`common`, `theme`, `language`, `showcase`) |
| **Generator & Linter** | `spec/generators/generate-i18n.mjs` | Key parity verification, interpolation validator, TypeScript and QML code emission |
| **React Generated Artifact** | `packages/react/src/i18n/locales.generated.ts` | Static TypeScript bundle and types (`I18N_META`, `BUILTIN_LOCALES`) |
| **React Core Registry** | `packages/react/src/i18n/registry.ts` | Process singleton managing dictionaries, preference persistence, system language detection, and `t()` interpolation |
| **React Hooks & Context** | `packages/react/src/i18n/useChaSetI18n.ts`<br/>`packages/react/src/i18n/ChaSetI18nProvider.tsx` | React context provider and hook exposing `{ locale, preference, setPreference, t, supportedLocales, systemLocale }` |
| **React UI Component** | `packages/react/src/language-settings/LanguageSettings.tsx` | Cross-stack `<LanguageSettings>` component with Follow System tile and cultural quote cards |
| **Qt Generated Artifact** | `qt/src/ChaSetI18nData.generated.qml` | QML singleton catalog containing metadata and built-in dictionaries |
| **Qt Core Singleton** | `qt/src/ChaSetI18n.qml` | QML singleton `pragma Singleton` tracking `revision`, `locale`, `preference`, and `tr()` |
| **Qt UI Component** | `qt/src/ChaSetLanguageSettings.qml` | Desktop QML `ChaSetLanguageSettings` implementation |
| **React Living Showcase** | `packages/react/examples/basic/src/pages/components/LanguageSettingsDocPage.tsx` | Interactive living showcase doc page with playground, code snippets, and token references |
| **Qt Living Showcase** | `qt/src/LanguageSettingsDocPage.qml` | Desktop living showcase doc page conforming 1:1 with React doc page |

---

## 4. Invariants & Forbidden Anti-Patterns

- **Invariant 1 (Strict Key & Interpolation Parity)**: Every key in `zh-CN.json` MUST exist in `en-US.json` and all future locale bundles. Any `{{var}}` interpolation placeholder MUST be identical across translations. Hardcoding raw Chinese or English strings inside ChaSet composite components is strictly forbidden.
- **Invariant 2 (Fallback Ladder Integrity)**: Translation lookup strictly adheres to: `Active Locale -> Default Locale (zh-CN) -> Fallback Locale (en-US) -> Provided defaultText -> Key String`. A missing translation must never crash the UI or return empty whitespace.
- **Invariant 3 (Decoupled Host Persistence)**: ChaSet components provide reactive state but never mandate proprietary database or file schemes. Web saves to `localStorage` (when available); Qt allows host applications to seed and persist preference through standard properties.
- **Invariant 4 (Dual-Stack Showcase 1:1 Parity)**: The `LanguageSettings` component and all showcase localization must satisfy the Showcase Parity Assurance System (SPAS 2.0) and Golden Red Line 1.
- **Forbidden Anti-Pattern (String Splitting & Concatenation)**: Translators must never concatenate fragments like `t("hello") + " " + user + " " + t("world")`. Sentences with variables must be written as cohesive phrases with named interpolation tokens: `t("greeting", "Hello {{name}}", { name })`.
- **Forbidden Anti-Pattern (Hardcoded UI Language Enums)**: Never hardcode `['zh-CN', 'en-US']` as a closed enum in UI components. Always query `supportedLocales` dynamically so user-registered languages display automatically.
