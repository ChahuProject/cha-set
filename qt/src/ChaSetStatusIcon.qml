// ChaSetStatusIcon.qml — Cross-stack vector status icon for pipeline states
import QtQuick 6.10
import QtQuick.Shapes
import ChaSet

Item {
  id: root

  property string status: "queued"
  property int size: 14
  property color overrideColor: "transparent"

  implicitWidth: size
  implicitHeight: size
  width: implicitWidth
  height: implicitHeight

  function normalize(s) {
    var str = (s || "").toLowerCase()
    if (str === "success" || str === "成功") return "success"
    if (str === "failure" || str === "failed" || str === "失败") return "failure"
    if (str === "running" || str === "运行中") return "running"
    if (str === "compiling" || str === "编译中") return "compiling"
    if (str === "retrying" || str === "重试中") return "retrying"
    if (str === "cancelled" || str === "已取消") return "cancelled"
    return "queued"
  }

  readonly property string normStatus: normalize(root.status)
  readonly property bool isSpinning: normStatus === "running" || normStatus === "compiling" || normStatus === "retrying"

  readonly property color statusColor: {
    if (root.overrideColor.a > 0) return root.overrideColor
    switch (normStatus) {
      case "success": return "#10b981"
      case "failure": return "#ef4444"
      case "running":
      case "compiling": return "#3b82f6"
      case "retrying": return "#f59e0b"
      default: return ThemeTokens.subduedText
    }
  }

  // Outer circle for success, failure, cancelled, queued
  Rectangle {
    id: outerCircle
    visible: !root.isSpinning
    anchors.fill: parent
    radius: width / 2
    color: "transparent"
    border.width: 1.4
    border.color: root.statusColor
    opacity: root.normStatus === "queued" ? 0.6 : 1.0
  }

  // Checkmark for success
  Shape {
    visible: root.normStatus === "success"
    anchors.fill: parent
    asynchronous: false
    antialiasing: true

    ShapePath {
      strokeColor: root.statusColor
      strokeWidth: 1.4
      fillColor: "transparent"
      capStyle: ShapePath.RoundCap
      joinStyle: ShapePath.RoundJoin
      startX: root.width * 0.28
      startY: root.height * 0.52
      PathLine { x: root.width * 0.44; y: root.height * 0.70 }
      PathLine { x: root.width * 0.72; y: root.height * 0.32 }
    }
  }

  // Cross X for failure
  Shape {
    visible: root.normStatus === "failure"
    anchors.fill: parent
    asynchronous: false
    antialiasing: true

    ShapePath {
      strokeColor: root.statusColor
      strokeWidth: 1.4
      fillColor: "transparent"
      capStyle: ShapePath.RoundCap
      startX: root.width * 0.32
      startY: root.height * 0.32
      PathLine { x: root.width * 0.68; y: root.height * 0.68 }
    }
    ShapePath {
      strokeColor: root.statusColor
      strokeWidth: 1.4
      fillColor: "transparent"
      capStyle: ShapePath.RoundCap
      startX: root.width * 0.68
      startY: root.height * 0.32
      PathLine { x: root.width * 0.32; y: root.height * 0.68 }
    }
  }

  // Minus bar for cancelled
  Rectangle {
    visible: root.normStatus === "cancelled"
    anchors.centerIn: parent
    width: root.width * 0.45
    height: 1.4
    radius: 0.7
    color: root.statusColor
  }

  // Spinning arc for running / compiling / retrying
  Item {
    id: spinnerContainer
    visible: root.isSpinning
    anchors.centerIn: parent
    width: root.width
    height: root.height
    transformOrigin: Item.Center

    Shape {
      anchors.fill: parent
      asynchronous: false
      antialiasing: true

      ShapePath {
        strokeColor: root.statusColor
        strokeWidth: 1.6
        fillColor: "transparent"
        capStyle: ShapePath.RoundCap
        startX: (root.width / 2) + ((root.width - 2.5) / 2)
        startY: root.height / 2

        PathAngleArc {
          centerX: root.width / 2
          centerY: root.height / 2
          radiusX: (root.width - 2.5) / 2
          radiusY: (root.height - 2.5) / 2
          startAngle: 0
          sweepAngle: 280
        }
      }
    }

    // motion-hygiene: ok continuous spinner rotation guarded by animationsEnabled
    RotationAnimation {
      target: spinnerContainer
      property: "rotation"
      loops: Animation.Infinite
      from: 0
      to: 360
      duration: 1000
      running: root.isSpinning && (typeof ThemeTokens !== "undefined" && ThemeTokens ? ThemeTokens.animationsEnabled : true)
    }
  }
}
