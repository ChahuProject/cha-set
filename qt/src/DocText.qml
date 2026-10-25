// DocText.qml — Selectable typography primitive for ChaSet Living Documentation.
//
// Roles are DATA, not components: qt/src/DocRoles.generated.qml is emitted from
// spec/doc-roles.json by `pnpm gen:roles`, and the React counterpart
// (packages/react/examples/basic/src/components/DocText.tsx) reads the SAME
// table. H1…H4 / p / code are deliberately NOT separate QML files — that would
// multiply files, DocPages, CMake entries and gate obligations while leaving the
// same role→style switch somewhere else, and Qt has no semantic tags to gain.
//
// What a role carries: size, weight, family, leading, tracking, capitalization,
// wrap and a default tone. What it does NOT carry: margins — Qt resolves block
// spacing through Column.spacing, the web through utilities, so a role with a
// built-in margin would drift between the stacks immediately.
import QtQuick
import ChaSet

TextEdit {
    id: root

    /// Typography role. "" keeps the legacy untyped style (= the `base` role).
    property string role: ""

    /// Explicit color (legacy). Leave undefined to inherit the role's tone.
    property var textColor

    /// Force the muted tone — legacy alias for `tone: "muted"`, which wins.
    property bool isMuted: false

    /// "default" | "muted" | "danger". "" = the role's declared tone.
    property string tone: ""

    /// Force the monospace family (identifiers, measured values, token chips).
    property bool isMono: false

    /// Wrap. Defaults to the role's flag, and stays assignable per call site.
    property bool wrap: root.style.wrap

    // Defensive compatibility properties matching QQuickText APIs.
    //
    // QQuickTextEdit has NO lineHeight / lineHeightMode / elide /
    // maximumLineCount (those belong to QQuickText), so a role's `leading`
    // ratio cannot be applied here — Qt keeps the font's natural leading and
    // `leading` stays a web-only field of the role table. The properties below
    // exist only so call sites that were written against the Text API keep
    // compiling instead of failing at load time.
    property real lineHeight: 1.0
    property int elide: 0
    property int maximumLineCount: -1

    readonly property var style: DocRoles.style(root.role === "" ? "base" : root.role)

    readonly property string effectiveTone: root.tone !== ""
        ? root.tone
        : (root.isMuted ? "muted" : root.style.tone)

    function toneColor(name) {
        switch (name) {
        case "muted": return ThemeTokens.subduedText;
        case "danger": return ThemeTokens.danger;
        default: return ThemeTokens.text;
        }
    }

    font.family: (root.isMono || root.style.mono) ? Typography.familyMono : Typography.familySans
    font.pixelSize: root.style.size
    font.weight: root.style.weight
    font.capitalization: (root.style.uppercase && !root.isMono) ? Font.AllUppercase : Font.MixedCase

    // The token scale stores tracking as an em ratio while Qt wants pixels, so
    // the product is taken here — a scaled UI keeps the same optical tracking.
    // `letterSpacing` lives on the font value type (QFont), not on TextEdit.
    font.letterSpacing: root.style.tracking * root.style.size

    readOnly: true
    selectByMouse: true
    selectByKeyboard: true
    cursorVisible: false
    activeFocusOnPress: true
    textMargin: 0
    padding: 0
    wrapMode: wrap ? TextEdit.WordWrap : TextEdit.NoWrap
    color: root.textColor !== undefined ? root.textColor : root.toneColor(root.effectiveTone)
    selectionColor: ThemeTokens.accent
    selectedTextColor: "#ffffff"

    width: wrap ? (parent ? parent.width : contentWidth) : contentWidth
    height: contentHeight

    HoverHandler {
        cursorShape: Qt.IBeamCursor
    }

    onSelectedTextChanged: {
        if (selectedText.length > 0) SelectionHub.claim(root);
        else if (SelectionHub.activeOwner === root) SelectionHub.clear(root);
    }

    Keys.onPressed: function(event) {
        if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
            SelectionHub.copyActiveSelection();
            event.accepted = true;
        }
    }

    TapHandler {
        acceptedButtons: Qt.RightButton
        onTapped: function(eventPoint) {
            var scenePos = eventPoint.scenePosition;
            SelectionHub.showContextMenu(scenePos.x, scenePos.y, root);
        }
    }
}
