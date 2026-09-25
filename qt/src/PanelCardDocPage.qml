// PanelCardDocPage.qml — Living Documentation for ChaSetPanelCard
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Panel Card"
    description: "Structured card container with a distinguished tinted header bar, optional badge indicators, and collapsible content toggling."

    ComponentPreview {
        title: "Panel Card Sandbox"
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
                width: ThemeTokens.dp(360)
                title: "Production Cluster #01"
                badgeText: "Active"
                collapsible: true

                Column {
                    width: parent.width - ThemeTokens.dp(32)
                    x: ThemeTokens.dp(16)
                    y: ThemeTokens.dp(12)
                    spacing: ThemeTokens.dp(10)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText { text: "Node Count:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                        DocText { text: "16 Dedicated Replicas"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    }

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText { text: "Avg Latency:"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                        DocText { text: "12ms (p99: 45ms)"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
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

        DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetPanelCard {
    width: parent.width
    title: "Server Overview"
}`
        reactCode: `import { PanelCard } from '@chahu/cha-set';

<PanelCard title="Server Overview">
  <div className="p-4">Server telemetry and health status.</div>
</PanelCard>`
    }

    
    ComponentReference {
        name: "PanelCard"
        componentId: "panel-card"
        propsModel: [
            { name: "title", type: "string", default: "'Panel Title'", description: "Headline text in the tinted header." },
            { name: "badgeText", type: "string", default: "''", description: "Optional badge text displayed next to the title." },
            { name: "collapsible", type: "bool", default: "false", description: "Whether the panel card can be expanded and collapsed." },
            { name: "collapsed", type: "bool", default: "false", description: "Current collapsed state of the panel." },
            { name: "customRadius", type: "int", default: "8", description: "Corner radius of the card surface." }
        ]
    }
}
