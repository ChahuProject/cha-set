import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

ApplicationWindow {
    id: win
    width: 560
    height: 420
    title: "ChaSet Qt (QML) Button example"
    visible: true
    color: "#FAFAFA"
    font.pixelSize: 14

    Column {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 18

        Text {
            text: "ChaSet Qt (QML) Button example"
            font.pixelSize: 20
            font.bold: true
            color: "#18181B"
        }
        Text {
            text: "Rendered from the Qt implementation, driven by spec/tokens.json."
            color: "#71717A"
            font.pixelSize: 12
            wrapMode: Text.Wrap
            width: parent === null ? 0 : parent.width
        }

        // Variants
        Row { spacing: 12
            ChaSetButton { text: "Primary";   variant: "primary" }
            ChaSetButton { text: "Secondary"; variant: "secondary" }
            ChaSetButton { text: "Ghost";     variant: "ghost" }
            ChaSetButton { text: "Danger";    variant: "danger" }
        }

        // Sizes
        Row { spacing: 12
            ChaSetButton { text: "Small";  size: "sm" }
            ChaSetButton { text: "Medium"; size: "md" }
            ChaSetButton { text: "Large";  size: "lg" }
        }

        // States
        Row { spacing: 12
            ChaSetButton {
                id: loadBtn
                text: loading ? "Saving…" : "Simulate save"
                loading: false
                onClicked: {
                    loadBtn.loading = true
                    timer.interval = 1500
                    timer.start()
                }
            }
            ChaSetButton { text: "Disabled"; disabled: true }
            ChaSetButton {
                text: "Full width"
                onClicked: loadBtn.loading = false
            }
        }

        // Full width demonstrates stretching
        ChaSetButton {
            width: parent === null ? 0 : (win.width - 48)
            implicitWidth: win.width - 48
            text: "Full width primary"
            fullWidth: true
            onClicked: { log.text = "Clicked at " + new Date().toLocaleTimeString() }
        }

        Rectangle {
            width: win.width - 48
            height: 1
            color: "#E4E4E7"
        }

        Text {
            id: log
            text: "Ready."
            color: "#3F3F46"
            font.pixelSize: 13
            width: win.width - 48
            wrapMode: Text.Wrap
        }
    }

    Timer {
        id: timer
        onTriggered: loadBtn.loading = false
    }
}