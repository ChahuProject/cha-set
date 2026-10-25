// PanelCardDocPage.qml — Living Documentation for ChaSetPanelCard
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Panel Card"
    description: ChaSetI18n.tr("components.panelCard.description", "Structured card container with a distinguished tinted header bar, optional badge indicators, and collapsible content toggling.")

    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.panelCard.overviewHeading", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.panelCard.collapseHint", "Click the chevron icon or title to collapse and expand the card panel body.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.panelCard.sandboxTitle", "Panel Card Sandbox")
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
                title: ChaSetI18n.tr("surfaces.panelCard.clusterTitle", "Production Cluster #01")
                badgeText: ChaSetI18n.tr("common.active", "Active")
                collapsible: true

                Column {
                    width: parent.width - ThemeTokens.dp(32)
                    x: ThemeTokens.dp(16)
                    y: ThemeTokens.dp(12)
                    spacing: ThemeTokens.dp(10)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText { text: ChaSetI18n.tr("surfaces.panelCard.nodeCount", "Node Count:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                        DocText { text: ChaSetI18n.tr("surfaces.panelCard.nodeCountVal", "16 Dedicated Replicas"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    }

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText { text: ChaSetI18n.tr("surfaces.panelCard.avgLatency", "Avg Latency:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                        DocText { text: ChaSetI18n.tr("surfaces.panelCard.avgLatencyVal", "12ms (p99: 45ms)"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                    }

                    Row {
                        spacing: 8
                        ChaSetButton { text: ChaSetI18n.tr("surfaces.panelCard.restart", "Restart"); variant: "outline"; size: "xs" }
                        ChaSetButton { text: ChaSetI18n.tr("surfaces.panelCard.scaleOut", "Scale Out"); variant: "secondary"; size: "xs" }
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

    
    DocMarkdown {
        width: parent.width
        docId: "panel-card"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "panel-card"
        section: "props"
    }
}
