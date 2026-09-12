pragma Singleton
import QtQuick
import ChaSet

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens/semantic/core.json (dunting preset) + tokenTypes from
//         spec/highlight/languages.json, via spec/generators/generate-qt.mjs
// Refresh: `pnpm gen:qt` regenerates this file in place.
// Syntax palette consumed by ChaSetHighlightedCode. Token type <X> maps to the
// semantic token `code-<X>`; `plain` is absent on purpose (plain text uses the
// host foreground). Theme mode is read live from ThemeTokens so every color
// follows the active theme without any extra wiring.
//
// Only `colorFor(type)` is exposed: per-type properties cannot be declared here
// because token types like `function`, `property` and `operator` are reserved
// QML identifiers.
QtObject {
    id: root

    // Bound (not copied) so the palette tracks ThemeTokens live at runtime.
    readonly property bool dark: ThemeTokens.dark

    function colorFor(type) {
        // qmlcachegen does not support object literals in property bindings; use switch-case direct returns.
        if (dark) {
            switch (type) {
            case "keyword":
                return Qt.rgba(198.0 / 255.0, 120.0 / 255.0, 221.0 / 255.0, 255.0 / 255.0) /* #C678DDff */
            case "constant":
                return Qt.rgba(209.0 / 255.0, 154.0 / 255.0, 102.0 / 255.0, 255.0 / 255.0) /* #D19A66ff */
            case "type":
                return Qt.rgba(229.0 / 255.0, 192.0 / 255.0, 123.0 / 255.0, 255.0 / 255.0) /* #E5C07Bff */
            case "string":
                return Qt.rgba(152.0 / 255.0, 195.0 / 255.0, 121.0 / 255.0, 255.0 / 255.0) /* #98C379ff */
            case "number":
                return Qt.rgba(209.0 / 255.0, 154.0 / 255.0, 102.0 / 255.0, 255.0 / 255.0) /* #D19A66ff */
            case "comment":
                return Qt.rgba(127.0 / 255.0, 132.0 / 255.0, 142.0 / 255.0, 255.0 / 255.0) /* #7F848Eff */
            case "function":
                return Qt.rgba(97.0 / 255.0, 175.0 / 255.0, 239.0 / 255.0, 255.0 / 255.0) /* #61AFEFff */
            case "property":
                return Qt.rgba(86.0 / 255.0, 182.0 / 255.0, 194.0 / 255.0, 255.0 / 255.0) /* #56B6C2ff */
            case "operator":
                return Qt.rgba(86.0 / 255.0, 182.0 / 255.0, 194.0 / 255.0, 255.0 / 255.0) /* #56B6C2ff */
            case "punctuation":
                return Qt.rgba(171.0 / 255.0, 178.0 / 255.0, 191.0 / 255.0, 255.0 / 255.0) /* #ABB2BFff */
            case "variable":
                return Qt.rgba(224.0 / 255.0, 108.0 / 255.0, 117.0 / 255.0, 255.0 / 255.0) /* #E06C75ff */
            case "tag":
                return Qt.rgba(224.0 / 255.0, 108.0 / 255.0, 117.0 / 255.0, 255.0 / 255.0) /* #E06C75ff */
            case "attribute":
                return Qt.rgba(209.0 / 255.0, 154.0 / 255.0, 102.0 / 255.0, 255.0 / 255.0) /* #D19A66ff */
            }
        } else {
            switch (type) {
            case "keyword":
                return Qt.rgba(166.0 / 255.0, 38.0 / 255.0, 164.0 / 255.0, 255.0 / 255.0) /* #A626A4ff */
            case "constant":
                return Qt.rgba(152.0 / 255.0, 104.0 / 255.0, 1.0 / 255.0, 255.0 / 255.0) /* #986801ff */
            case "type":
                return Qt.rgba(193.0 / 255.0, 132.0 / 255.0, 1.0 / 255.0, 255.0 / 255.0) /* #C18401ff */
            case "string":
                return Qt.rgba(80.0 / 255.0, 161.0 / 255.0, 79.0 / 255.0, 255.0 / 255.0) /* #50A14Fff */
            case "number":
                return Qt.rgba(152.0 / 255.0, 104.0 / 255.0, 1.0 / 255.0, 255.0 / 255.0) /* #986801ff */
            case "comment":
                return Qt.rgba(160.0 / 255.0, 161.0 / 255.0, 167.0 / 255.0, 255.0 / 255.0) /* #A0A1A7ff */
            case "function":
                return Qt.rgba(64.0 / 255.0, 120.0 / 255.0, 242.0 / 255.0, 255.0 / 255.0) /* #4078F2ff */
            case "property":
                return Qt.rgba(1.0 / 255.0, 132.0 / 255.0, 188.0 / 255.0, 255.0 / 255.0) /* #0184BCff */
            case "operator":
                return Qt.rgba(1.0 / 255.0, 132.0 / 255.0, 188.0 / 255.0, 255.0 / 255.0) /* #0184BCff */
            case "punctuation":
                return Qt.rgba(92.0 / 255.0, 103.0 / 255.0, 121.0 / 255.0, 255.0 / 255.0) /* #5C6779ff */
            case "variable":
                return Qt.rgba(228.0 / 255.0, 86.0 / 255.0, 73.0 / 255.0, 255.0 / 255.0) /* #E45649ff */
            case "tag":
                return Qt.rgba(228.0 / 255.0, 86.0 / 255.0, 73.0 / 255.0, 255.0 / 255.0) /* #E45649ff */
            case "attribute":
                return Qt.rgba(152.0 / 255.0, 104.0 / 255.0, 1.0 / 255.0, 255.0 / 255.0) /* #986801ff */
            }
        }
        return Qt.rgba(0, 0, 0, 1)
    }
}
