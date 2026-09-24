// ChaSetIcon.qml — Specification-driven vector icon primitive for ChaSet.
//
// Geometry, grid and stroke width all come from the active icon specification
// (spec/icons/registry.json, code-generated into ChaSetIcons.generated.qml), so this
// component contains no per-icon branching and no hand-drawn artwork of its own.
//
// Two consequences worth stating explicitly, because they are the reason the component
// was rewritten:
//
//  1. Weight can no longer drift. A control that renders three icons renders three
//     strokes of the same width, because width is a property of the specification rather
//     than of the caller.
//  2. Centering is geometry, not typography. The old implementation centred text glyphs
//     (+, U+2212, U+27F3) inside a box, which inherits the font's asymmetric ascent and
//     descent and pushes the symbol visually low. Every icon is now a path drawn on a
//     declared grid, and the gate proves the painted bounding box is symmetric about the
//     grid centre (see scripts/check-icon-spec.mjs).
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
    readonly property var shapes: ChaSetIcons.shapesFor(root.name)

    implicitWidth: effectiveSize
    implicitHeight: effectiveSize
    width: implicitWidth
    height: implicitHeight

    Repeater {
        model: root.shapes

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
