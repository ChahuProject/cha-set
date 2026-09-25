// ChaSetIcon.qml — Cross-platform vector & typography icon primitive for ChaSet.
//
// Dual-rendering icon component:
// 1. Text-based glyph rendering via Google Material Symbols Outlined variable font
//    (with Segoe Fluent Icons fallback on Windows for window chrome).
//    Subpixel grayscale anti-aliasing eliminates all aliasing and jagged triangle edges.
// 2. Variable-axis support: fill (0..1), weight (100..700), grade (-25..200), opsz.
// 3. Vector Shape fallback (PathSvg) if a custom or unmapped icon is requested.
import QtQuick 6.10
import QtQuick.Shapes
import ChaSet

Item {
    id: root

    /** Registry icon name. Legacy desktop names resolve through ChaSetIcons.aliases. */
    property string name: ""
    /** Logical size in unscaled units; always multiplied by ThemeTokens.dp. */
    property int size: 16
    /** Paint colour. Defaults to the text token; consumers override per context. */
    property color color: ThemeTokens.text
    /**
     * Variable font axes for Material Symbols:
     * - fill: 0 (outlined) or 1 (filled)
     * - weight: 100..700 (default 400 regular)
     * - grade: -25..200 (default 0)
     */
    property real fill: 0
    property int weight: 400
    property int grade: 0

    /**
     * Keep a fixed physical size instead of following the interface scale.
     *
     * Only scale-invariant overlays use this (ChaSetScaleOsd draws in physical pixels so
     * the zoom indicator does not itself grow when the interface is zoomed). Everything
     * else must leave it false, so the icon scales with ThemeTokens.dp like the rest of
     * the component it sits in.
     */
    property bool ignoreUiScale: false

    readonly property int effectiveSize: root.ignoreUiScale ? root.size : ThemeTokens.dp(root.size)
    readonly property string resolvedName: ChaSetIcons.resolveIcon(root.name)
    readonly property var resolution: ChaSetIcons.resolve(root.name, root.effectiveSize)
    readonly property bool hasGlyph: resolution && resolution.hasGlyph
    readonly property var shapes: ChaSetIcons.shapesFor(root.name)

    implicitWidth: effectiveSize
    implicitHeight: effectiveSize
    width: implicitWidth
    height: implicitHeight

    // 1. Native Text glyph rendering (Anti-aliased Material Symbols / Segoe Fluent Icons)
    Text {
        id: glyphText
        anchors.centerIn: parent
        width: root.effectiveSize
        height: root.effectiveSize
        visible: root.hasGlyph
        text: root.hasGlyph ? root.resolution.glyph : ""
        color: root.color
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        font.family: root.hasGlyph ? root.resolution.family : ""
        font.pixelSize: root.hasGlyph && root.resolution.isWindows ? Math.round(root.effectiveSize * 0.6) : root.effectiveSize
        font.variableAxes: ({
            "FILL": root.fill,
            "wght": root.weight,
            "GRAD": root.grade,
            "opsz": root.effectiveSize
        })
    }

    // 2. Vector Shape fallback (when no glyph exists)
    Repeater {
        model: !root.hasGlyph ? root.shapes : 0

        delegate: Shape {
            id: shapeDelegate
            required property var modelData

            readonly property real gridFactor: root.effectiveSize / modelData.gridSize

            // The shape is laid out on its own grid and then scaled about its centre, so
            // the artwork stays centred no matter which grid the icon declares.
            width: modelData.gridSize
            height: modelData.gridSize
            anchors.centerIn: parent
            transformOrigin: Item.Center
            scale: gridFactor
            asynchronous: false
            antialiasing: true

            ShapePath {
                strokeColor: root.color
                fillColor: shapeDelegate.modelData.fill ? root.color : "transparent"
                strokeWidth: shapeDelegate.modelData.strokeWidth
                capStyle: shapeDelegate.modelData.linecap === "round" ? ShapePath.RoundCap : ShapePath.FlatCap
                joinStyle: shapeDelegate.modelData.linejoin === "round" ? ShapePath.RoundJoin : ShapePath.MiterJoin

                PathSvg {
                    path: shapeDelegate.modelData.d
                }
            }
        }
    }
}
