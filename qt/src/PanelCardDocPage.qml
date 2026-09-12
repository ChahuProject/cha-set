// PanelCardDocPage.qml — Living Documentation for ChaSetPanelCard
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Panel Card"
    description: "Structured card container with a distinguished tinted header bar, optional badge indicators, and collapsible content toggling."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Panel Card Preview"
        reactCode: `<PanelCard title="System Diagnostics" badgeText="Healthy" collapsible>
  <div className="p-4 space-y-2">
    <p>CPU Utilization: 24%</p>
    <p>Memory Usage: 4.2 GB / 16 GB</p>
  </div>
</PanelCard>`
        qtCode: `ChaSetPanelCard {
    title: "System Diagnostics"
    badgeText: "Healthy"
    collapsible: true

    Column {
        anchors.fill: parent
        anchors.margins: 14
        spacing: 8
        Text { text: "CPU Utilization: 24%"; color: ThemeTokens.text }
        Text { text: "Memory Usage: 4.2 GB / 16 GB"; color: ThemeTokens.subduedText }
    }
}`

        Item {
            anchors.fill: parent

            ChaSetPanelCard {
                anchors.centerIn: parent
                width: 360
                title: "Production Cluster #01"
                badgeText: "Active"
                collapsible: true

                Column {
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 10

                    Row {
                        spacing: 8
                        Text { text: "Node Count:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                        Text { text: "16 Dedicated Replicas"; color: ThemeTokens.text; font.pixelSize: 12; font.weight: Font.DemiBold }
                    }

                    Row {
                        spacing: 8
                        Text { text: "Avg Latency:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                        Text { text: "12ms (p99: 45ms)"; color: ThemeTokens.text; font.pixelSize: 12 }
                    }

                    Row {
                        spacing: 8
                        ChaSetButton { text: "Restart"; variant: "outline"; size: "xs" }
                        ChaSetButton { text: "Scale Out"; variant: "secondary"; size: "xs" }
                    }
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetPanelCard { title: \"Settings\"; collapsible: true }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "panel-card"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "title", type: "string", default: "'Panel Title'", description: "Headline text in the tinted header." },
            { name: "badgeText", type: "string", default: "''", description: "Optional badge text displayed next to the title." },
            { name: "collapsible", type: "bool", default: "false", description: "Whether the panel card can be expanded and collapsed." },
            { name: "collapsed", type: "bool", default: "false", description: "Current collapsed state of the panel." },
            { name: "customRadius", type: "int", default: "8", description: "Corner radius of the card surface." }
        ]
    }
}
