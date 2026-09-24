// DocLayout.qml — Standard Documentation Page Template matching React DocLayout.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root
    width: parent ? parent.width : ThemeTokens.dp(1000)
    implicitHeight: layoutRow.implicitHeight + ThemeTokens.dp(60)

    property string category: "Components"
    property string pageTitle: "Button"
    property string description: ""
    property var tocItems: []
    default property alias contentData: pageContentCol.data

    readonly property bool showToc: root.tocItems && root.tocItems.length > 0 && layoutRow.width >= ThemeTokens.dp(600)
    property int activeTocIndex: 0

    readonly property var scrollAreaItem: {
        var p = root.parent;
        while (p) {
            if (p.scrollToY !== undefined) return p;
            if (p.flickableItem !== undefined && p.flickableItem.contentY !== undefined) return p.flickableItem;
            if (p.contentY !== undefined) return p;
            p = p.parent;
        }
        return null;
    }

    Connections {
        target: root.scrollAreaItem
        ignoreUnknownSignals: true
        function onContentYChanged() {
            root.updateActiveTocOnScroll();
        }
    }

    function matchesSectionText(rawText, targetId, targetTitle) {
        if (!rawText || typeof rawText !== "string") return false;
        var text = rawText.trim().toLowerCase();
        if (text === targetTitle || text === targetId) return true;
        if (targetTitle !== "" && (text.indexOf(targetTitle) === 0 || targetTitle.indexOf(text) === 0)) return true;
        var idWords = targetId.replace(/[-_]/g, " ");
        if (idWords !== "" && (text.indexOf(idWords) !== -1 || idWords.indexOf(text) !== -1)) return true;
        return false;
    }

    function findHeadingItem(item, targetId, targetTitle) {
        if (!item || !item.visible) return null;

        if (item.text !== undefined && matchesSectionText(String(item.text), targetId, targetTitle)) {
            return item;
        }

        if (item.children && item.children.length > 0) {
            for (var i = 0; i < item.children.length; i++) {
                var found = findHeadingItem(item.children[i], targetId, targetTitle);
                if (found) return found;
            }
        }
        return null;
    }

    function findSectionTarget(tocItem) {
        if (!tocItem || !pageContentCol) return null;
        var targetId = (tocItem.id || "").toLowerCase();
        var targetTitle = (tocItem.title || "").toLowerCase();

        // 1. Direct match on top-level children of pageContentCol
        for (var i = 0; i < pageContentCol.children.length; i++) {
            var child = pageContentCol.children[i];
            if (!child) continue;

            if (child.sectionId && String(child.sectionId).toLowerCase() === targetId) return child;
            if (child.objectName && String(child.objectName).toLowerCase() === targetId) return child;

            // Overview (ComponentPreview sandbox)
            if (targetId === "overview") {
                if (child.reactCode !== undefined || child.stageData !== undefined || child.controlsData !== undefined || (child.title && String(child.title).toLowerCase().indexOf("sandbox") !== -1)) {
                    return child;
                }
            }

            // Keyboard Navigation (KeyboardShortcutsTable)
            if (targetId === "keyboard") {
                if (child.componentId !== undefined || (child.title && String(child.title).toLowerCase().indexOf("keyboard") !== -1)) {
                    return child;
                }
            }

            // Props Reference (PropsTable)
            if (targetId === "props") {
                if (child.propsModel !== undefined || (child.title && String(child.title).toLowerCase().indexOf("props") !== -1)) {
                    return child;
                }
            }

            // Title match on child (e.g. ComponentPreview.title or PropsTable.title)
            if (child.title && matchesSectionText(String(child.title), targetId, targetTitle)) {
                return child;
            }
        }

        if (targetId === "overview") {
            return pageContentCol;
        }

        // 2. Search for heading text in child subtrees
        for (var j = 0; j < pageContentCol.children.length; j++) {
            var c = pageContentCol.children[j];
            if (!c) continue;
            var heading = findHeadingItem(c, targetId, targetTitle);
            if (heading) {
                return heading;
            }
        }

        return null;
    }

    function scrollToSection(tocItem) {
        var scrollArea = root.scrollAreaItem;
        if (!scrollArea) return;

        var target = findSectionTarget(tocItem);
        if (!target) return;

        var contentTarget = scrollArea.contentItem ? scrollArea.contentItem : scrollArea;
        var pt = target.mapToItem(contentTarget, 0, 0);
        if (pt) {
            var targetY = Math.max(0, pt.y - ThemeTokens.dp(16));
            if (scrollArea.scrollToY !== undefined) {
                scrollArea.scrollToY(targetY, true);
            } else {
                scrollArea.contentY = targetY;
            }
        }
    }

    function updateActiveTocOnScroll() {
        var scrollArea = root.scrollAreaItem;
        if (!scrollArea || !root.tocItems || root.tocItems.length === 0) return;
        var contentTarget = scrollArea.contentItem ? scrollArea.contentItem : scrollArea;
        var currentY = scrollArea.contentY + ThemeTokens.dp(60);

        var bestIndex = 0;
        for (var i = 0; i < root.tocItems.length; i++) {
            var target = findSectionTarget(root.tocItems[i]);
            if (!target) continue;
            var pt = target.mapToItem(contentTarget, 0, 0);
            if (pt && pt.y <= currentY) {
                bestIndex = i;
            }
        }
        root.activeTocIndex = bestIndex;
    }

    MouseArea {
        anchors.fill: parent
        z: -1
        onClicked: SelectionHub.clearAll()
    }

    Item {
        id: layoutRow
        anchors.horizontalCenter: parent.horizontalCenter
        width: Math.max(ThemeTokens.dp(320), Math.min(parent.width - ThemeTokens.dp(48), ThemeTokens.dp(1000)))
        implicitHeight: Math.max(mainCol.implicitHeight, tocCol.implicitHeight)

        // Main Center Content Column (max-w-4xl)
        Column {
            id: mainCol
            anchors.left: parent.left
            width: root.showToc
                ? Math.max(ThemeTokens.dp(280), layoutRow.width - ThemeTokens.dp(180) - ThemeTokens.dp(32))
                : Math.max(ThemeTokens.dp(280), layoutRow.width)
            spacing: ThemeTokens.dp(24)

            // Breadcrumb
            TextEdit {
                id: breadcrumbText
                text: "Docs / " + root.category + " / " + root.pageTitle
                color: ThemeTokens.subduedText
                font.family: Typography.familySans
                font.pixelSize: Typography.sizeSmall
                readOnly: true
                selectByMouse: true
                selectByKeyboard: true
                cursorVisible: false
                activeFocusOnPress: false
                textMargin: 0
                padding: 0
                selectionColor: ThemeTokens.accent
                selectedTextColor: "#ffffff"
                width: contentWidth
                height: contentHeight

                HoverHandler {
                    cursorShape: Qt.IBeamCursor
                }

                onSelectedTextChanged: {
                    if (selectedText.length > 0) SelectionHub.claim(breadcrumbText);
                    else if (SelectionHub.activeOwner === breadcrumbText) SelectionHub.clear(breadcrumbText);
                }
            }

            // Page Header with Copy Link (Single RichText flow allowing continuous drag-selection)
            Column {
                width: parent.width
                spacing: ThemeTokens.dp(8)

                Item {
                    width: parent.width
                    implicitHeight: Math.max(titleText.implicitHeight, copyBtn.height)

                    TextEdit {
                        id: titleText
                        anchors.left: parent.left
                        anchors.right: copyBtn.left
                        anchors.rightMargin: ThemeTokens.dp(16)
                        anchors.verticalCenter: copyBtn.verticalCenter
                        text: root.pageTitle
                        color: ThemeTokens.text
                        font.family: Typography.familySans
                        font.pixelSize: Typography.sizeDisplay
                        font.weight: Typography.weightBold
                        readOnly: true
                        selectByMouse: true
                        selectByKeyboard: true
                        cursorVisible: false
                        activeFocusOnPress: true
                        textMargin: 0
                        padding: 0
                        selectionColor: ThemeTokens.accent
                        selectedTextColor: "#ffffff"
                        height: contentHeight

                        HoverHandler {
                            cursorShape: Qt.IBeamCursor
                        }

                        onSelectedTextChanged: {
                            if (selectedText.length > 0) SelectionHub.claim(titleText);
                            else if (SelectionHub.activeOwner === titleText) SelectionHub.clear(titleText);
                        }
                    }

                    ChaSetCopyButton {
                        id: copyBtn
                        anchors.right: parent.right
                        anchors.top: parent.top
                        text: "qt-page://" + root.pageTitle.toLowerCase().replace(/\s+/g, '-')
                        label: "Copy Link"
                        variant: "outline"
                        size: "sm"
                    }
                }

                TextEdit {
                    id: descText
                    visible: root.description !== ""
                    width: parent.width
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.family: Typography.familySans
                    font.pixelSize: Typography.sizeHeading
                    wrapMode: TextEdit.WordWrap
                    readOnly: true
                    selectByMouse: true
                    selectByKeyboard: true
                    cursorVisible: false
                    activeFocusOnPress: true
                    textMargin: 0
                    padding: 0
                    selectionColor: ThemeTokens.accent
                    selectedTextColor: "#ffffff"

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }

                    onSelectedTextChanged: {
                        if (selectedText.length > 0) SelectionHub.claim(descText);
                        else if (SelectionHub.activeOwner === descText) SelectionHub.clear(descText);
                    }
                }
            }

            // Divider matching React's Separator mb-8
            ChaSetSeparator {
                width: parent.width
            }

            // Page Body Content Slot
            Column {
                id: pageContentCol
                width: parent.width
                spacing: ThemeTokens.dp(32)
            }
        }

        // Right Table of Contents (TOC, 180px width)
        Column {
            id: tocCol
            visible: root.showToc
            anchors.right: parent.right
            width: ThemeTokens.dp(180)
            spacing: ThemeTokens.dp(12)
            y: {
                var sa = root.scrollAreaItem;
                if (!sa) return 0;
                var maxSticky = Math.max(0, mainCol.height - tocCol.implicitHeight);
                return Math.max(0, Math.min(maxSticky, sa.contentY));
            }

            DocText {
                text: "ON THIS PAGE"
                textColor: ThemeTokens.subduedText
                font.family: Typography.familySans
                font.pixelSize: Typography.sizeCaption
                font.weight: Typography.weightSemibold
                font.letterSpacing: Typography.trackingPx(Typography.sizeCaption, "wider")
            }

            Repeater {
                model: root.tocItems
                delegate: Text {
                    id: tocText
                    required property var modelData
                    required property int index
                    text: modelData.title
                    color: root.activeTocIndex === index ? ThemeTokens.accent : (tocMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText)
                    font.family: Typography.familySans
                    font.pixelSize: Typography.sizeSmall
                    font.weight: root.activeTocIndex === index ? Typography.weightMedium : Typography.weightRegular
                    wrapMode: Text.WordWrap
                    width: tocCol.width

                    MouseArea {
                        id: tocMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            root.activeTocIndex = index;
                            root.scrollToSection(modelData);
                        }
                    }
                }
            }
        }
    }
}
