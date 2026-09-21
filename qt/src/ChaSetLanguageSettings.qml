// ChaSetLanguageSettings.qml — Cross-Stack Language Configuration Component
// 100% Feature & API Parity with React LanguageSettings.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property string preference: ChaSetI18n.preference
    property bool showFollowSystem: true
    property string variant: "card" // "card" | "embedded"
    property bool disabled: false
    property string title: ""
    property string description: ""
    property var textProvider: null

    signal preferenceModified(string nextPreference)

    readonly property bool isEmbedded: variant === "embedded"

    function trText(key, defaultText, params) {
        if (typeof textProvider === "function") {
            try {
                var res = textProvider(key, defaultText, params);
                if (res !== undefined && res !== null && res !== "") return res;
            } catch (e) {
                // fallback
            }
        }
        return ChaSetI18n.tr(key, defaultText, params);
    }

    implicitWidth: 540
    implicitHeight: cardContainer.implicitHeight

    function selectPreference(pref) {
        if (root.disabled) return;
        root.preference = pref;
        ChaSetI18n.setPreference(pref);
        root.preferenceModified(pref);
    }

    readonly property var activeLocaleMeta: {
        var list = ChaSetI18n.supportedLocales || [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].code === ChaSetI18n.locale) return list[i];
        }
        return { nativeName: ChaSetI18n.locale, code: ChaSetI18n.locale };
    }

    readonly property var systemLocaleMeta: {
        var list = ChaSetI18n.supportedLocales || [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].code === ChaSetI18n.systemLocale) return list[i];
        }
        return { nativeName: ChaSetI18n.systemLocale, code: ChaSetI18n.systemLocale };
    }

    readonly property string currentLabel: root.preference === "system"
        ? (root.trText("language.followSystem", "Follow System") + " (" + root.activeLocaleMeta.nativeName + ")")
        : root.activeLocaleMeta.nativeName

    readonly property string statusHint: root.preference === "system"
        ? root.trText("language.systemHint", "Currently following system, rendering UI in {{language}}", { language: root.activeLocaleMeta.nativeName })
        : root.trText("language.fixedHint", "Currently fixed to {{language}}, ignoring system language changes", { language: root.activeLocaleMeta.nativeName })

    ChaSetCard {
        id: cardContainer
        anchors.fill: parent
        visible: !root.isEmbedded

        ChaSetCardHeader {
            id: cardHeader

            Item {
                width: parent.width
                implicitHeight: Math.max(headerLeft.implicitHeight, headerBadge.implicitHeight)

                Rectangle {
                    id: globeIconBox
                    width: 36
                    height: 36
                    radius: 8
                    color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.1)
                    border.width: 1
                    border.color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.2)
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter

                    Text {
                        anchors.centerIn: parent
                        text: "🌐"
                        font.pixelSize: Typography.sizeBody
                    }
                }

                Column {
                    id: headerLeft
                    anchors.left: globeIconBox.right
                    anchors.leftMargin: 12
                    anchors.right: headerBadge.left
                    anchors.rightMargin: 12
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 4

                    ChaSetCardTitle {
                        text: root.title !== "" ? root.title : root.trText("language.title", "Language Preference")
                    }

                    ChaSetCardDescription {
                        text: root.description !== "" ? root.description : root.trText("language.desc", "Switch UI display language with instant effect and system language detection.")
                    }
                }

                ChaSetBadge {
                    id: headerBadge
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    variant: "secondary"
                    size: "sm"
                    text: root.currentLabel
                }
            }
        }

        ChaSetCardContent {
            id: cardContentSlot

            Column {
                width: parent.width
                spacing: 16

                // 1. Follow System Option Card
                Rectangle {
                    id: followSystemCard
                    visible: root.showFollowSystem
                    width: parent.width
                    implicitHeight: 76
                    radius: 8
                    color: root.preference === "system"
                           ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.08)
                           : (followHover.hovered ? ThemeTokens.hover : ThemeTokens.panel)
                    border.width: root.preference === "system" ? 2 : 1
                    border.color: root.preference === "system" ? ThemeTokens.accent : ThemeTokens.border

                    Behavior on color {
                        ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: Easing.OutQuad }
                    }

                    Item {
                        anchors.fill: parent
                        anchors.margins: 14

                        // Monitor Icon Badge
                        Rectangle {
                            id: monitorIconBox
                            width: 36
                            height: 36
                            radius: 8
                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12)
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter

                            Text {
                                anchors.centerIn: parent
                                text: "💻"
                                font.pixelSize: Typography.sizeBody
                            }
                        }

                        Column {
                            anchors.left: monitorIconBox.right
                            anchors.leftMargin: 12
                            anchors.right: followCheckmark.left
                            anchors.rightMargin: 12
                            spacing: 3
                            anchors.verticalCenter: parent.verticalCenter

                            Text {
                                text: root.trText("language.followSystem", "Follow System")
                                font.pixelSize: Typography.sizeBody
                                font.bold: true
                                color: ThemeTokens.text
                            }

                            Text {
                                text: root.trText("language.systemDetected", "System detected") + " · " + root.systemLocaleMeta.nativeName
                                font.pixelSize: Typography.sizeCaption
                                color: ThemeTokens.subduedText
                            }

                            Text {
                                text: root.trText("language.followSystemDesc", "Automatically matches your system language if supported, otherwise defaults to English")
                                font.pixelSize: Typography.sizeCaption
                                color: ThemeTokens.subduedText
                                elide: Text.ElideRight
                                width: parent.width
                            }
                        }

                        // Selection Checkmark Circle
                        Rectangle {
                            id: followCheckmark
                            width: 20
                            height: 20
                            radius: 10
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            color: root.preference === "system" ? ThemeTokens.accent : ThemeTokens.panel
                            border.width: 1
                            border.color: root.preference === "system" ? ThemeTokens.accent : ThemeTokens.border

                            Text {
                                anchors.centerIn: parent
                                text: "✓"
                                font.pixelSize: Typography.sizeCaption
                                font.bold: true
                                color: "#ffffff"
                                visible: root.preference === "system"
                            }
                        }
                    }

                    HoverHandler {
                        id: followHover
                        cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                    }

                    TapHandler {
                        enabled: !root.disabled
                        onTapped: root.selectPreference("system")
                    }
                }

                // Section Label
                Text {
                    text: root.trText("language.fixedNotice", "Fixed Languages")
                    font.pixelSize: Typography.sizeCaption
                    font.bold: true
                    color: ThemeTokens.subduedText
                }

                // 2. Fixed Languages Grid
                Grid {
                    width: parent.width
                    columns: parent.width > 500 ? (parent.width > 700 ? 3 : 2) : 1
                    spacing: 10

                    Repeater {
                        model: ChaSetI18n.supportedLocales

                        delegate: Rectangle {
                            id: langCard
                            required property int index
                            required property var modelData

                            readonly property bool isSelected: root.preference === modelData.code
                            width: (parent.width - (parent.columns - 1) * parent.spacing) / parent.columns
                            implicitHeight: 110
                            radius: 8
                            color: isSelected
                                   ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.08)
                                   : (cardHover.hovered ? ThemeTokens.hover : ThemeTokens.panel)
                            border.width: isSelected ? 2 : 1
                            border.color: isSelected ? ThemeTokens.accent : ThemeTokens.border

                            Behavior on color {
                                ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: Easing.OutQuad }
                            }

                            Column {
                                anchors.fill: parent
                                anchors.margins: 12
                                spacing: 6

                                // Card Header (Title + Checkmark)
                                Item {
                                    width: parent.width
                                    height: 28

                                    Column {
                                        anchors.left: parent.left
                                        anchors.verticalCenter: parent.verticalCenter
                                        spacing: 2

                                        Text {
                                            text: modelData.nativeName
                                            font.pixelSize: Typography.sizeBody
                                            font.bold: true
                                            color: ThemeTokens.text
                                        }

                                        Text {
                                            text: modelData.code
                                            font.pixelSize: Typography.sizeCaption - 1
                                            font.family: Typography.familyMono
                                            color: ThemeTokens.subduedText
                                        }
                                    }

                                    Rectangle {
                                        width: 18
                                        height: 18
                                        radius: 9
                                        anchors.right: parent.right
                                        anchors.verticalCenter: parent.verticalCenter
                                        color: langCard.isSelected ? ThemeTokens.accent : ThemeTokens.panel
                                        border.width: 1
                                        border.color: langCard.isSelected ? ThemeTokens.accent : ThemeTokens.border

                                        Text {
                                            anchors.centerIn: parent
                                            text: "✓"
                                            font.pixelSize: Typography.sizeCaption - 2
                                            font.bold: true
                                            color: "#ffffff"
                                            visible: langCard.isSelected
                                        }
                                    }
                                }

                                Item { width: 1; height: 4 }

                                // Cultural Quote / Preview
                                Column {
                                    width: parent.width
                                    spacing: 2
                                    visible: modelData.quote !== undefined && modelData.quote !== null

                                    Rectangle { width: parent.width; height: 1; color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.4) }

                                    Text {
                                        width: parent.width
                                        text: modelData.quote ? ("“" + modelData.quote.text + "”") : ""
                                        font.pixelSize: Typography.sizeCaption
                                        font.italic: true
                                        color: Qt.rgba(ThemeTokens.text.r, ThemeTokens.text.g, ThemeTokens.text.b, 0.8)
                                        elide: Text.ElideRight
                                    }

                                    Text {
                                        width: parent.width
                                        text: modelData.quote ? ("— " + modelData.quote.author) : ""
                                        font.pixelSize: Typography.sizeCaption - 2
                                        color: ThemeTokens.subduedText
                                        elide: Text.ElideRight
                                    }
                                }
                            }

                            HoverHandler {
                                id: cardHover
                                cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                            }

                            TapHandler {
                                enabled: !root.disabled
                                onTapped: root.selectPreference(modelData.code)
                            }
                        }
                    }
                }

                // 3. Status Hint
                Text {
                    width: parent.width
                    text: root.statusHint
                    font.pixelSize: Typography.sizeCaption
                    color: ThemeTokens.subduedText
                    wrapMode: Text.Wrap
                }
            }
        }
    }
}
