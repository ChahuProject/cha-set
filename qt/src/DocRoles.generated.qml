pragma Singleton
import QtQuick
import ChaSet

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/doc-roles.json + spec/tokens/primitives.json (schemaVersion 1)
//         via spec/generators/generate-doc-roles.mjs
// Refresh: `just gen-roles` regenerates this file in place.
//
// Doc roles are DATA, not components. A role names a slot in the typography
// scale plus a default tone; DocText.qml is the only consumer. The React
// counterpart (packages/react/src/typography/docRoles.generated.ts) is emitted
// from the SAME table, so both stacks resolve identical sizes, weights,
// leading, tracking and tones.
//
// Qt-specific encoding:
//   1. `size` is already multiplied by the global UI scale via ThemeTokens.sp(),
//      so DocText must assign it to font.pixelSize verbatim.
//   2. `leading` is emitted for completeness but is a WEB-ONLY field: QQuickTextEdit
//      has no lineHeight/lineHeightMode, so DocText keeps the font's natural
//      leading on the Qt side.
//   3. `tracking` is an em ratio; Text.letterSpacing is in px, so DocText
//      multiplies it by the scaled font size (trackingPx below).
QtObject {
    id: root

    readonly property string defaultRole: "p"

    readonly property var table: ({
        "base": ({ "tag": "span", "size": ThemeTokens.sp(12), "weight": 400, "leading": 1.3333333, "tracking": 0, "mono": false, "tone": "default", "wrap": false, "uppercase": false }),
        "display": ({ "tag": "h1", "size": ThemeTokens.sp(36), "weight": 700, "leading": 1.1111111, "tracking": -0.05, "mono": false, "tone": "default", "wrap": true, "uppercase": false }),
        "h1": ({ "tag": "h1", "size": ThemeTokens.sp(28), "weight": 700, "leading": 1.25, "tracking": -0.025, "mono": false, "tone": "default", "wrap": true, "uppercase": false }),
        "h2": ({ "tag": "h2", "size": ThemeTokens.sp(20), "weight": 600, "leading": 1.4, "tracking": -0.025, "mono": false, "tone": "default", "wrap": true, "uppercase": false }),
        "h3": ({ "tag": "h3", "size": ThemeTokens.sp(16), "weight": 600, "leading": 1.5, "tracking": -0.025, "mono": false, "tone": "default", "wrap": true, "uppercase": false }),
        "h4": ({ "tag": "h4", "size": ThemeTokens.sp(14), "weight": 600, "leading": 1.4285714, "tracking": 0, "mono": false, "tone": "default", "wrap": true, "uppercase": false }),
        "p": ({ "tag": "p", "size": ThemeTokens.sp(14), "weight": 400, "leading": 1.4285714, "tracking": 0, "mono": false, "tone": "muted", "wrap": true, "uppercase": false }),
        "lead": ({ "tag": "p", "size": ThemeTokens.sp(18), "weight": 400, "leading": 1.5555556, "tracking": 0, "mono": false, "tone": "muted", "wrap": true, "uppercase": false }),
        "overline": ({ "tag": "span", "size": ThemeTokens.sp(12), "weight": 600, "leading": 1.3333333, "tracking": 0.05, "mono": false, "tone": "muted", "wrap": false, "uppercase": true }),
        "caption": ({ "tag": "span", "size": ThemeTokens.sp(11), "weight": 400, "leading": 1.4545455, "tracking": 0, "mono": false, "tone": "muted", "wrap": true, "uppercase": false }),
        "micro": ({ "tag": "span", "size": ThemeTokens.sp(10), "weight": 500, "leading": 1.6, "tracking": 0, "mono": false, "tone": "muted", "wrap": false, "uppercase": false }),
        "code": ({ "tag": "code", "size": ThemeTokens.sp(12), "weight": 500, "leading": 1.4, "tracking": 0, "mono": true, "tone": "default", "wrap": false, "uppercase": false }),
        "quote": ({ "tag": "blockquote", "size": ThemeTokens.sp(14), "weight": 400, "leading": 1.625, "tracking": 0, "mono": false, "tone": "muted", "wrap": true, "uppercase": false }),
    })

    readonly property var roles: Object.keys(root.table)

    function has(role) {
        return role !== undefined && role !== null && root.table.hasOwnProperty(role);
    }

    /// Role definition, falling back to the declared default instead of throwing.
    function style(role) {
        return root.has(role) ? root.table[role] : root.table[root.defaultRole];
    }

    readonly property var fallback: root.table[root.defaultRole]

    function sizePx(role) { return root.style(role).size; }
    function weight(role) { return root.style(role).weight; }
    function leading(role) { return root.style(role).leading; }
    function tracking(role) { return root.style(role).tracking; }
    function trackingPx(role) { var s = root.style(role); return s.tracking * s.size; }
    function isMono(role) { return root.style(role).mono; }
    function tone(role) { return root.style(role).tone; }
    function wrap(role) { return root.style(role).wrap; }
    function uppercase(role) { return root.style(role).uppercase; }
}
