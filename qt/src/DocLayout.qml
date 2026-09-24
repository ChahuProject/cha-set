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
    property var autoTocItems: []
    property var enrichedTocItems: []
    readonly property var effectiveTocItems: (root.tocItems && root.tocItems.length > 0)
        ? ((root.enrichedTocItems && root.enrichedTocItems.length > 0) ? root.enrichedTocItems : root.tocItems)
        : root.autoTocItems
    default property alias contentData: pageContentCol.data

    readonly property bool showToc: root.effectiveTocItems && root.effectiveTocItems.length > 0 && layoutRow.width >= ThemeTokens.dp(600)
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

    Connections {
        target: pageContentCol
        ignoreUnknownSignals: true
        function onChildrenChanged() {
            root.scanSections();
        }
    }

    Component.onCompleted: {
        root.scanSections();
        Qt.callLater(root.scanSections);
    }

    function slugify(text) {
        if (!text) return "";
        return String(text).toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    function isHeadingItem(item) {
        if (!item || !item.visible) return false;
        if (item.text !== undefined && typeof item.text === "string" && item.text.trim() !== "") {
            if (item.font !== undefined && item.font.pixelSize >= Typography.sizeHeading) {
                return true;
            }
        }
        return false;
    }

    function findFirstHeading(item) {
        if (!item || !item.visible) return null;
        if (isHeadingItem(item)) return item;
        if (item.children && item.children.length > 0) {
            for (var i = 0; i < item.children.length; i++) {
                var found = findFirstHeading(item.children[i]);
                if (found) return found;
            }
        }
        return null;
    }

    /** Outline depth for a detected heading, mirroring the React h2/h3 map:
     * section titles (sizeTitleSm / bold) are level 2 while sub-section
     * headings (sizeHeading / semibold) are level 3. */
    function headingLevel(item) {
        if (!item || item.font === undefined) return 2;
        if (item.font.pixelSize >= Typography.sizeTitleSm || item.font.weight >= Typography.weightBold) return 2;
        if (item.font.pixelSize >= Typography.sizeHeading || item.font.weight >= Typography.weightSemibold) return 3;
        return 2;
    }

    /** Rebase depths so the shallowest heading in the outline renders flush; a
     * page whose top-level headings are all level 2 must not indent every row. */
    function normalizeLevels(list) {
        if (!list || list.length === 0) return list;
        var min = 99;
        for (var i = 0; i < list.length; i++) {
            var lv = (list[i].level !== undefined && list[i].level > 0) ? list[i].level : 2;
            if (lv < min) min = lv;
        }
        var out = [];
        for (var j = 0; j < list.length; j++) {
            var src = list[j];
            out.push({
                id: src.id,
                title: src.title,
                level: ((src.level !== undefined && src.level > 0) ? src.level : 2) - min + 1,
                targetItem: src.targetItem !== undefined ? src.targetItem : null
            });
        }
        return out;
    }

    function findChildByType(parentItem, checkFn) {
        if (!parentItem || !parentItem.children) return null;
        for (var i = 0; i < parentItem.children.length; i++) {
            var c = parentItem.children[i];
            if (!c) continue;
            if (checkFn(c)) return c;
            var sub = findChildByType(c, checkFn);
            if (sub) return sub;
        }
        return null;
    }

    function scanSections() {
        if (!pageContentCol || !pageContentCol.children) return;
        var scanned = [];
        var seenIds = {};

        function addEntry(id, title, target, level) {
            if (!id || !title || !target) return;
            if (id === "interactive-overview" || id === "sandbox") {
                id = "overview";
                title = "Interactive Overview";
            } else if (id === "keyboard-navigation") {
                id = "keyboard";
                title = "Keyboard Navigation";
            } else if (id === "props-reference" || id === "api-reference") {
                id = "props";
                title = "Props Reference";
            } else if (id === "examples-states" || id === "examples" || id === "examples-variants") {
                id = "states";
                title = "Examples & States";
            } else if (id === "variants-options") {
                id = "variants";
                title = "Variants & Options";
            } else if (id === "multi-file-tabs") {
                id = "multi-file";
                title = "Multi-File Tabs";
            }

            if (!seenIds[id]) {
                seenIds[id] = true;
                scanned.push({
                    id: id,
                    title: title,
                    level: (level !== undefined && level > 0) ? level : 2,
                    targetItem: target
                });
            }
        }

        var children = pageContentCol.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (!child || !child.visible) continue;

            // 1. Direct ComponentPreview
            if (child.reactCode !== undefined || child.stageData !== undefined || child.controlsData !== undefined) {
                var prevId = child.sectionId ? String(child.sectionId) : "overview";
                var prevTitle = child.sectionTitle ? String(child.sectionTitle) : (prevId === "overview" ? "Interactive Overview" : (child.title || "Interactive Overview"));
                addEntry(prevId, prevTitle, child, 2);
                continue;
            }

            // 2. ComponentReference container (shortcuts on top, props on bottom)
            if (child.kbItem !== undefined && child.propsItem !== undefined) {
                if (child.hasShortcuts) {
                    addEntry(child.keyboardSectionId || "keyboard", child.kbTitle || "Keyboard Navigation", child.kbItem, 2);
                }
                addEntry(child.propsSectionId || "props", child.isSubComponent ? child.propTableTitle : "Props Reference", child.propsItem, 2);
                continue;
            }

            // 3. Direct KeyboardShortcutsTable
            if (child.componentId !== undefined) {
                addEntry(child.sectionId || "keyboard", child.sectionTitle || "Keyboard Navigation", child, 2);
                continue;
            }

            // 3. Direct PropsTable
            if (child.propsModel !== undefined) {
                addEntry(child.sectionId || "props", child.sectionTitle || "Props Reference", child, 2);
                continue;
            }

            // 4. Explicit sectionId/sectionTitle on container
            if (child.sectionId !== undefined && child.sectionId !== "") {
                var sTitle = child.sectionTitle ? String(child.sectionTitle) : "";
                var sHeading = null;
                if (!sTitle) {
                    sHeading = findFirstHeading(child);
                    if (sHeading) sTitle = String(sHeading.text).trim();
                }
                addEntry(String(child.sectionId), sTitle || String(child.sectionId), child, sHeading ? headingLevel(sHeading) : 2);
                continue;
            }

            // 5. Container with heading
            var heading = findFirstHeading(child);
            if (heading) {
                var hText = String(heading.text).trim();
                var sId = child.objectName || slugify(hText);

                var kb = findChildByType(child, function(it) { return it.componentId !== undefined; });
                var pt = findChildByType(child, function(it) { return it.propsModel !== undefined; });

                if (kb && pt && (sId === "props" || sId === "keyboard" || sId === "props-reference" || sId === "api-reference")) {
                    addEntry("keyboard", "Keyboard Navigation", kb, 2);
                    addEntry("props", "Props Reference", pt, 2);
                } else if (kb && !pt) {
                    addEntry(sId || "keyboard", hText || "Keyboard Navigation", child, 2);
                } else if (pt && !kb) {
                    addEntry(sId || "props", hText || "Props Reference", child, 2);
                } else {
                    addEntry(sId, hText, child, headingLevel(heading));

                    if (child.children && child.children.length > 1) {
                        for (var j = 0; j < child.children.length; j++) {
                            var subChild = child.children[j];
                            if (!subChild || subChild === heading) continue;
                            var subH = findFirstHeading(subChild);
                            if (subH && subH !== heading) {
                                var subText = String(subH.text).trim();
                                if (subText !== "" && subText !== hText) {
                                    var subId = subChild.sectionId || subChild.objectName || slugify(subText);
                                    addEntry(subId, subText, subChild, headingLevel(subH));
                                }
                            }
                        }
                    }
                }
            }
        }

        var levelById = {};
        for (var m = 0; m < scanned.length; m++) {
            levelById[scanned[m].id] = scanned[m].level;
        }

        root.autoTocItems = normalizeLevels(scanned);

        // Explicit `tocItems` keep their labels and order; depth is resolved from
        // the scanned headings so a flat hand-written list still renders as a tree.
        if (root.tocItems && root.tocItems.length > 0) {
            var enriched = [];
            for (var t = 0; t < root.tocItems.length; t++) {
                var src = root.tocItems[t];
                var lv = (src.level !== undefined && src.level > 0)
                    ? src.level
                    : (levelById[src.id] !== undefined ? levelById[src.id] : 2);
                enriched.push({ id: src.id, title: src.title, level: lv, targetItem: src.targetItem });
            }
            root.enrichedTocItems = normalizeLevels(enriched);
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
        if (!scrollArea || !tocItem) return;

        var target = (tocItem && tocItem.targetItem) ? tocItem.targetItem : findSectionTarget(tocItem);
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
        var items = root.effectiveTocItems;
        if (!scrollArea || !items || items.length === 0) return;
        var contentTarget = scrollArea.contentItem ? scrollArea.contentItem : scrollArea;
        var currentY = scrollArea.contentY + ThemeTokens.dp(60);

        var bestIndex = 0;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var target = (item && item.targetItem) ? item.targetItem : findSectionTarget(item);
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

    TapHandler {
        acceptedButtons: Qt.RightButton
        onTapped: function(eventPoint) {
            if (SelectionHub.hasSelection) {
                var scenePos = eventPoint.scenePosition;
                SelectionHub.showContextMenu(scenePos.x, scenePos.y, SelectionHub.activeOwner);
            }
        }
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
                activeFocusOnPress: true
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
                        SelectionHub.showContextMenu(scenePos.x, scenePos.y, breadcrumbText);
                    }
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
                                SelectionHub.showContextMenu(scenePos.x, scenePos.y, titleText);
                            }
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
                            SelectionHub.showContextMenu(scenePos.x, scenePos.y, descText);
                        }
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
        ChaSetTableOfContents {
            id: tocCol
            visible: root.showToc
            anchors.right: parent.right
            width: ThemeTokens.dp(180)
            items: root.effectiveTocItems
            activeId: (root.effectiveTocItems && root.effectiveTocItems.length > root.activeTocIndex && root.activeTocIndex >= 0) ? root.effectiveTocItems[root.activeTocIndex].id : ""
            y: {
                var sa = root.scrollAreaItem;
                if (!sa) return 0;
                var maxSticky = Math.max(0, mainCol.height - tocCol.implicitHeight);
                return Math.max(0, Math.min(maxSticky, sa.contentY));
            }
            onSelectItem: function(item) {
                root.scrollToSection(item);
            }
        }
    }
}
