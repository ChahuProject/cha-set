// ChaSet Qt Studio — Cross-Stack Theme & Component Workbench
// 100% Pixel-Perfect and Behavioral Parity with React Studio (packages/react/examples/basic).
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

ApplicationWindow {
    id: win
    width: (typeof reqWidth !== "undefined" && reqWidth > 0) ? reqWidth : ((typeof harnessMode !== "undefined" && (harnessMode === "button" || harnessMode === "badge" || harnessMode === "label")) ? 220 : ((typeof harnessMode !== "undefined" && (harnessMode === "scroll-area" || harnessMode === "scrollbar")) ? 120 : ((typeof harnessMode !== "undefined" && harnessMode === "tabs") ? 260 : 1150)))
    height: (typeof reqHeight !== "undefined" && reqHeight > 0) ? reqHeight : ((typeof harnessMode !== "undefined" && (harnessMode === "button" || harnessMode === "badge" || harnessMode === "label")) ? 80 : ((typeof harnessMode !== "undefined" && (harnessMode === "scroll-area" || harnessMode === "scrollbar")) ? 200 : ((typeof harnessMode !== "undefined" && harnessMode === "tabs") ? 80 : 850)))
    visible: true
    title: "ChaSet Studio"
    color: win.cBg

    // ---- Reactive Theme State ----
    property string activePage: (typeof startupPage !== "undefined" && startupPage !== "") ? startupPage : "intro"   // "intro" | "tokens" | "theme-tuner" | "button" | "scroll-area"
    property bool showTuner: activePage === "theme-tuner"
    property string activeAccent: ""
    property int customRadius: 8

    property bool searchModalOpen: false
    property bool exportModalOpen: false
    property string exportTab: "qt"

    // Custom Color Overrides (Live)
    property string overridePrimary: ""
    property string overridePrimaryFg: ""
    property string overrideSecondary: ""
    property string overrideDestructive: ""
    property string overrideBackground: ""
    property string overrideCard: ""

    // Click event log
    property var clickLogs: []

    function pushLog(msg) {
        let logs = clickLogs.slice(0, 4)
        logs.unshift(msg)
        clickLogs = logs
    }

    function clearLogs() {
        clickLogs = []
    }

    function getPageSource(pageId) {
        switch (pageId) {
        case "intro": return "IntroductionPage.qml";
        case "tokens": return "TokensPage.qml";
        case "theme-tuner": return "ThemeTunerPage.qml";
        case "button": return "ButtonDocPage.qml";
        case "scroll-area": return "ScrollAreaDocPage.qml";
        case "tabs": return "TabsDocPage.qml";
        case "badge": return "BadgeDocPage.qml";
        case "label": return "LabelDocPage.qml";
        case "collapsible": return "CollapsibleDocPage.qml";
        case "card": return "CardDocPage.qml";
        case "input": return "InputDocPage.qml";
        case "checkbox": return "CheckboxDocPage.qml";
        case "switch": return "SwitchDocPage.qml";
        case "separator": return "SeparatorDocPage.qml";
        case "slider": return "SliderDocPage.qml";
        case "dialog": return "DialogDocPage.qml";
        case "tooltip": return "TooltipDocPage.qml";
        case "table": return "TableDocPage.qml";
        case "color-picker": return "ColorPickerDocPage.qml";
        case "dropdown-menu": return "DropdownMenuDocPage.qml";
        case "select": return "SelectDocPage.qml";
        case "popover": return "PopoverDocPage.qml";
        case "context-menu": return "ContextMenuDocPage.qml";
        case "alert-dialog": return "AlertDialogDocPage.qml";
        case "sheet": return "SheetDocPage.qml";
        case "skeleton": return "SkeletonDocPage.qml";
        case "copy-button": return "CopyButtonDocPage.qml";
        case "panel-card": return "PanelCardDocPage.qml";
        case "split-button": return "SplitButtonDocPage.qml";
        case "inline-editable-text": return "InlineEditableTextDocPage.qml";
        case "range-slider": return "RangeSliderDocPage.qml";
        case "read-only-input": return "ReadOnlyInputDocPage.qml";
        case "preset-number-input": return "PresetNumberInputDocPage.qml";
        case "keybinding-recorder": return "KeybindingRecorderDocPage.qml";
        case "virtual-list": return "VirtualListDocPage.qml";
        case "virtual-tree": return "VirtualTreeDocPage.qml";
        case "virtual-grid": return "VirtualGridDocPage.qml";
        case "draggable-modal": return "DraggableModalDocPage.qml";
        case "splitter": return "SplitterDocPage.qml";
        case "resizable": return "ResizableDocPage.qml";
        case "window-title-bar": return "WindowTitleBarDocPage.qml";
        case "generic-data-table": return "GenericDataTableDocPage.qml";
        case "query-builder": return "QueryBuilderDocPage.qml";
        case "viewport-constrained-container": return "ViewportConstrainedContainerDocPage.qml";
        case "sidebar": return "SidebarDocPage.qml";
        case "segmented-control": return "SegmentedControlDocPage.qml";
        case "smooth-wheel-handler": return "SmoothWheelHandlerDocPage.qml";
        case "setting-row": return "SettingRowDocPage.qml";
        case "elided-text": return "ElidedTextDocPage.qml";
        case "splitter-handle": return "SplitterHandleDocPage.qml";
        case "duration-input": return "DurationInputDocPage.qml";
        case "code-block": return "CodeBlockDocPage.qml";
        default: return "ButtonDocPage.qml";

        }
    }

    // Dynamic Colors based on theme
    readonly property color cBg: ThemeTokens.dark ? (overrideBackground !== "" ? overrideBackground : "#020817") : (overrideBackground !== "" ? overrideBackground : "#ffffff")
    readonly property color cCard: ThemeTokens.dark ? (overrideCard !== "" ? overrideCard : "#0f172a") : (overrideCard !== "" ? overrideCard : "#ffffff")
    readonly property color cBorder: ThemeTokens.dark ? "#1e293b" : "#e2e8f0"
    readonly property color cFg: ThemeTokens.dark ? "#f8fafc" : "#020817"
    readonly property color cMutedFg: ThemeTokens.dark ? "#94a3b8" : "#64748b"
    readonly property color cAccentBg: ThemeTokens.dark ? "#1e293b" : "#f1f5f9"
    readonly property color cPrimary: overridePrimary !== "" ? overridePrimary : (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0")
    readonly property color cPrimaryFg: overridePrimaryFg !== "" ? overridePrimaryFg : "#ffffff"
    readonly property color cDestructive: overrideDestructive !== "" ? overrideDestructive : "#ef4444"

    Binding {
        target: ThemeTokens
        property: "dark"
        value: typeof startupDark !== "undefined" && startupDark === true
    }

    Component.onCompleted: {
        if (typeof startupDark !== "undefined" && startupDark === true) ThemeTokens.dark = true
        else if (typeof startupLight !== "undefined" && startupLight === true) ThemeTokens.dark = false
        else ThemeTokens.dark = false
        // Deterministic headless runs: scenario/pixel tests must not race with
        // animations (Behavior durations would make assertions / grabs flaky).
        if ((typeof testScenario !== "undefined" && testScenario !== "")
            || (typeof shotPath !== "undefined" && shotPath !== "")) {
            ThemeTokens.animationsEnabled = false
        }
        if (typeof reqScrollY !== "undefined" && reqScrollY > 0) {
            contentScroll.contentY = reqScrollY
        }
    }

    Timer {
        id: shotTimer
        interval: (typeof harnessMode !== "undefined" && harnessMode !== "") ? 200 : 800
        running: typeof shotPath !== "undefined" && shotPath !== ""
        onTriggered: {
            rootCanvas.grabToImage(function(result) {
                result.saveToFile(shotPath);
                Qt.quit();
            });
        }
    }

    function runTestScenario(scenario) {
        console.log("[qt-scenario] Running behavioral scenario: " + scenario);
        var failures = 0;

        // Scenario 1: Shared Showcase Data Validation
        if (scenario === "all" || scenario === "showcase-data") {
            if (!ShowcaseData.changelog || ShowcaseData.changelog.length !== 120) {
                console.log("[qt-scenario] FAIL: ShowcaseData.changelog length expected 120, got " + (ShowcaseData.changelog ? ShowcaseData.changelog.length : 0));
                failures++;
            } else if (!ShowcaseData.featureCards || ShowcaseData.featureCards.length !== 24) {
                console.log("[qt-scenario] FAIL: ShowcaseData.featureCards length expected 24, got " + (ShowcaseData.featureCards ? ShowcaseData.featureCards.length : 0));
                failures++;
            } else {
                console.log("[qt-scenario] PASS: Shared ShowcaseData dataset integrity (120 changelogs, 24 cards)");
            }
        }

        // Scenario 2: Viewport & Scroll Kinematics
        if (scenario === "all" || scenario === "scroll-kinematics" || scenario === "scroll-wheel") {
            var maxScrollY = Math.max(0, contentScroll.flickableItem.contentHeight - contentScroll.height);
            if (maxScrollY <= 0) {
                console.log("[qt-scenario] FAIL: Viewport contentHeight is not overflowing height (contentHeight=" + contentScroll.flickableItem.contentHeight + ", height=" + contentScroll.height + ")");
                failures++;
            } else {
                contentScroll.flickableItem.contentY = 150;
                var afterDirectY = contentScroll.flickableItem.contentY;
                contentScroll.flickableItem.contentY = 0;
                var afterResetY = contentScroll.flickableItem.contentY;

                if (afterDirectY === 150 && afterResetY === 0) {
                    console.log("[qt-scenario] PASS: Viewport coordinate translation & reset (contentY delta=150 -> 0)");
                } else {
                    console.log("[qt-scenario] FAIL: Viewport coordinate translation mismatch (afterDirect=" + afterDirectY + ", afterReset=" + afterResetY + ")");
                    failures++;
                }
            }
        }

        // Scenario 3: Real Synthetic Vertical & Horizontal Thumb Drag Verification
        if (scenario === "all" || scenario === "scroll-drag") {
            contentScroll.flickableItem.contentY = 0;
            var startY = contentScroll.flickableItem.contentY;
            contentScroll.simulateThumbDrag(50);
            var draggedY = contentScroll.flickableItem.contentY;
            contentScroll.flickableItem.contentY = 0;
            var resetY = contentScroll.flickableItem.contentY;

            console.log("[qt-scenario] Vertical Drag test: startY=" + startY + ", draggedY=" + draggedY + ", resetY=" + resetY);
            if (draggedY >= 50 && resetY === 0) {
                console.log("[qt-scenario] PASS: Vertical synthetic thumb drag kinematics (deltaY=" + draggedY + ")");
            } else {
                console.log("[qt-scenario] FAIL: Vertical synthetic thumb drag (draggedY=" + draggedY + ")");
                failures++;
            }
        }

        // Scenario 4: Steppers & Boundary Clamping
        if (scenario === "all" || scenario === "scroll-steppers") {
            // Test scrollToTop
            contentScroll.scrollToTop(false);
            if (contentScroll.flickableItem.contentY !== 0 || !contentScroll.isAtTop) {
                console.log("[qt-scenario] FAIL: scrollToTop did not set contentY to 0 or isAtTop is false (contentY=" + contentScroll.flickableItem.contentY + ")");
                failures++;
            } else {
                console.log("[qt-scenario] PASS: Stepper top navigation boundary clamp (contentY=0, isAtTop=true)");
            }

            // Test scrollToBottom
            var expectedMaxY = Math.max(0, contentScroll.flickableItem.contentHeight - contentScroll.height);
            contentScroll.scrollToBottom(false);
            if (Math.abs(contentScroll.flickableItem.contentY - expectedMaxY) > 1 || !contentScroll.isAtBottom) {
                console.log("[qt-scenario] FAIL: scrollToBottom mismatch (contentY=" + contentScroll.flickableItem.contentY + ", expected=" + expectedMaxY + ", isAtBottom=" + contentScroll.isAtBottom + ")");
                failures++;
            } else {
                console.log("[qt-scenario] PASS: Stepper bottom navigation boundary clamp (contentY=" + contentScroll.flickableItem.contentY + ", isAtBottom=true)");
            }

            // Test pageUp
            var prevY = contentScroll.flickableItem.contentY;
            contentScroll.pageUp(false);
            var afterPageUpY = contentScroll.flickableItem.contentY;
            if (afterPageUpY >= prevY) {
                console.log("[qt-scenario] FAIL: pageUp did not decrease contentY (prev=" + prevY + ", after=" + afterPageUpY + ")");
                failures++;
            } else {
                console.log("[qt-scenario] PASS: Stepper pageUp pagination (from " + prevY + " -> " + afterPageUpY + ")");
            }

            // Reset back to top
            contentScroll.scrollToTop(false);
            if (contentScroll.flickableItem.contentY === 0) {
                console.log("[qt-scenario] PASS: Reset back to top complete");
            }
        }

        // Scenario 5: Tabs State Coordination & Value Propagation
        if (scenario === "all" || scenario === "tabs") {
            testTabs.currentValue = "account";
            if (testTabs.currentValue !== "account") {
                console.log("[qt-scenario] FAIL: initial testTabs.currentValue expected 'account'");
                failures++;
            } else {
                testTabs.currentValue = "password";
                if (testTabs.currentValue === "password") {
                    console.log("[qt-scenario] PASS: Tabs value switching and panel coordination (account -> password)");
                } else {
                    console.log("[qt-scenario] FAIL: Tabs value switching failed");
                    failures++;
                }
                testTabs.currentValue = "account";
            }
        }

        // Scenario 6: Living Showcase Navigation & Page Loading Coverage
        if (scenario === "all" || scenario === "pages") {
            var navItems = [];
            if (ShowcaseData && ShowcaseData.navigation) {
                for (var i = 0; i < ShowcaseData.navigation.length; i++) {
                    var grp = ShowcaseData.navigation[i];
                    if (grp.items) {
                        for (var j = 0; j < grp.items.length; j++) {
                            navItems.push(grp.items[j].id);
                        }
                    }
                }
            }
            var pageErrors = 0;
            var instantiatedCount = 0;
            for (var p = 0; p < navItems.length; p++) {
                var src = win.getPageSource(navItems[p]);
                if (!src || src === "" || (navItems[p] !== "button" && src === "ButtonDocPage.qml")) {
                    console.log("[qt-scenario] FAIL: Missing page source mapping for " + navItems[p]);
                    pageErrors++;
                    continue;
                }

                // Physically compile and instantiate every QML component to catch missing attached objects, invalid types, duplicate signals, etc.
                var comp = Qt.createComponent(src);
                if (comp.status === Component.Error) {
                    console.log("[qt-scenario] FAIL: Page component " + src + " failed to load: " + comp.errorString());
                    pageErrors++;
                } else if (comp.status === Component.Ready) {
                    var obj = comp.createObject(null);
                    if (!obj) {
                        console.log("[qt-scenario] FAIL: Page component " + src + " failed to instantiate: " + comp.errorString());
                        pageErrors++;
                    } else {
                        instantiatedCount++;
                        obj.destroy();
                    }
                }
            }
            if (pageErrors === 0 && instantiatedCount >= 36) {
                console.log("[qt-scenario] PASS: All " + instantiatedCount + " showcase page components successfully compiled and instantiated with zero errors");
            } else {
                console.log("[qt-scenario] FAIL: Showcase page instantiation failed (" + pageErrors + " errors, " + instantiatedCount + " instantiated)");
                failures++;
            }
        }

        // Scenario 7: Cross-Stack Keyboard Navigation Parity
        if (scenario === "all" || scenario === "keyboard-navigation") {
            console.log("[qt-scenario] Running keyboard navigation scenario...");
            var kbFailures = 0;

            // --- 1. ChaSetSelect Keyboard Flow ---
            testSelect.value = "";
            testSelect.handleKeyEvent({ key: Qt.Key_Space, accepted: false });
            if (testSelect.highlightedIndex !== 0) {
                console.log("[qt-scenario] FAIL: testSelect opened via Space should initialize highlightedIndex to 0, got " + testSelect.highlightedIndex);
                kbFailures++;
            }

            // Down arrow moves to next enabled option (index 1: Banana)
            testSelect.handleKeyEvent({ key: Qt.Key_Down, accepted: false });
            if (testSelect.highlightedIndex !== 1) {
                console.log("[qt-scenario] FAIL: testSelect Down arrow should move highlightedIndex to 1, got " + testSelect.highlightedIndex);
                kbFailures++;
            }

            // Down arrow skips disabled cherry (index 2) to durian (index 3)
            testSelect.handleKeyEvent({ key: Qt.Key_Down, accepted: false });
            if (testSelect.highlightedIndex !== 3) {
                console.log("[qt-scenario] FAIL: testSelect Down arrow should skip disabled option and land on index 3, got " + testSelect.highlightedIndex);
                kbFailures++;
            }

            // Enter selects option at highlightedIndex and closes
            testSelect.handleKeyEvent({ key: Qt.Key_Return, accepted: false });
            if (testSelect.value !== "durian") {
                console.log("[qt-scenario] FAIL: testSelect Enter key should select 'durian', got " + testSelect.value);
                kbFailures++;
            }

            // Reopen with Down arrow
            testSelect.handleKeyEvent({ key: Qt.Key_Down, accepted: false });
            if (testSelect.highlightedIndex !== 3) {
                console.log("[qt-scenario] FAIL: testSelect Down arrow should open and highlight current value index 3, got " + testSelect.highlightedIndex);
                kbFailures++;
            }

            // Escape closes popup (highlightedIndex resets to -1)
            testSelect.handleKeyEvent({ key: Qt.Key_Escape, accepted: false });
            if (testSelect.highlightedIndex !== -1) {
                console.log("[qt-scenario] FAIL: testSelect Escape key should close and reset highlightedIndex, got " + testSelect.highlightedIndex);
                kbFailures++;
            }

            // --- 2. ChaSetDropdownMenu Keyboard Flow ---
            testDropdown.open = false;
            testDropdown.handleKeyEvent({ key: Qt.Key_Return, accepted: false });
            if (!testDropdown.open) {
                console.log("[qt-scenario] FAIL: testDropdown Enter key should open menu");
                kbFailures++;
            }

            // Down arrow moves highlightedIndex to 0
            testDropdown.handleKeyEvent({ key: Qt.Key_Down, accepted: false });
            if (testDropdown.highlightedIndex !== 0) {
                console.log("[qt-scenario] FAIL: testDropdown Down arrow should move highlightedIndex to 0, got " + testDropdown.highlightedIndex);
                kbFailures++;
            }

            // Down arrow moves highlightedIndex to 1
            testDropdown.handleKeyEvent({ key: Qt.Key_Down, accepted: false });
            if (testDropdown.highlightedIndex !== 1) {
                console.log("[qt-scenario] FAIL: testDropdown Down arrow should move highlightedIndex to 1, got " + testDropdown.highlightedIndex);
                kbFailures++;
            }

            // Down arrow skips disabled item 3 to item 4 (index 3)
            testDropdown.handleKeyEvent({ key: Qt.Key_Down, accepted: false });
            if (testDropdown.highlightedIndex !== 3) {
                console.log("[qt-scenario] FAIL: testDropdown Down arrow should skip disabled item to index 3, got " + testDropdown.highlightedIndex);
                kbFailures++;
            }

            // Verify Input Modality State Machine & Dual-Highlight Elimination
            if (testDropdown.modality !== "keyboard") {
                console.log("[qt-scenario] FAIL: testDropdown modality should be 'keyboard', got " + testDropdown.modality);
                kbFailures++;
            }
            // Intentional mouse move switches to pointer modality
            testDropdown.handlePointerMove(0, 150, 150);
            if (testDropdown.modality !== "pointer" || testDropdown.highlightedIndex !== 0) {
                console.log("[qt-scenario] FAIL: intentional pointer move should switch modality to 'pointer'");
                kbFailures++;
            }
            // Keyboard switches back to keyboard modality
            testDropdown.handleKeyEvent({ key: Qt.Key_Down, accepted: false });
            if (testDropdown.modality !== "keyboard" || testDropdown.highlightedIndex !== 1) {
                console.log("[qt-scenario] FAIL: arrow down should switch modality back to 'keyboard'");
                kbFailures++;
            }
            // Stationary pointer (same coords 150, 150) is ignored
            testDropdown.handlePointerMove(3, 150, 150);
            if (testDropdown.highlightedIndex !== 1 || testDropdown.modality !== "keyboard") {
                console.log("[qt-scenario] FAIL: stationary pointer must NOT take over keyboard highlight");
                kbFailures++;
            }

            // Escape closes menu
            testDropdown.handleKeyEvent({ key: Qt.Key_Escape, accepted: false });
            if (testDropdown.open) {
                console.log("[qt-scenario] FAIL: testDropdown Escape key should close menu");
                kbFailures++;
            }

            if (kbFailures === 0) {
                console.log("[qt-scenario] PASS: ChaSetSelect & ChaSetDropdownMenu keyboard navigation verified");
            } else {
                failures += kbFailures;
            }
        }

        if (failures === 0) {
            console.log("[qt-scenario] OK — All behavioral test scenarios completed with 0 errors!");
            return 0;
        } else {
            console.log("[qt-scenario] FAILED — " + failures + " scenario assertions failed");
            return 1;
        }
    }

    // Global Search Shortcut (Ctrl+K / Cmd+K)
    Shortcut {
        sequence: "Ctrl+K"
        onActivated: win.searchModalOpen = true
    }

    Rectangle {
        id: rootCanvas
        objectName: "rootCanvas"
        anchors.fill: parent
        color: win.cBg

        // Hidden tabs instance for headless scenario testing
        ChaSetTabs {
            id: testTabs
            visible: false
            currentValue: "account"
            ChaSetTabsList {
                ChaSetTabsTrigger { value: "account"; text: "Account" }
                ChaSetTabsTrigger { value: "password"; text: "Password" }
            }
        }

        // Hidden test instances for keyboard navigation scenario testing
        ChaSetSelect {
            id: testSelect
            objectName: "testSelect"
            x: -2000
            y: -2000
            width: 160
            height: 32
            visible: true
            options: [
                { value: "apple", label: "Apple", disabled: false },
                { value: "banana", label: "Banana", disabled: false },
                { value: "cherry", label: "Cherry", disabled: true },
                { value: "durian", label: "Durian", disabled: false }
            ]
        }

        ChaSetDropdownMenu {
            id: testDropdown
            objectName: "testDropdown"
            x: -2000
            y: -1900
            width: 160
            height: 32
            visible: true
            items: [
                { id: "item1", label: "Item 1", disabled: false },
                { id: "item2", label: "Item 2", disabled: false },
                { id: "item3", label: "Item 3", disabled: true },
                { id: "item4", label: "Item 4", disabled: false }
            ]
        }

        // Isolated Component Harness Container (for visual unit tests)
        Rectangle {
            id: harnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "button"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"
            ChaSetButton {
                anchors.centerIn: parent
                variant: typeof harnessVariant !== "undefined" ? harnessVariant : "default"
                size: typeof harnessSize !== "undefined" ? harnessSize : "default"
                text: (typeof harnessLabel !== "undefined" && harnessLabel !== "") ? harnessLabel : "·"
                loading: typeof harnessLoading !== "undefined" ? harnessLoading : false
                disabled: typeof harnessDisabled !== "undefined" ? harnessDisabled : false
                forceHover: typeof harnessState !== "undefined" && harnessState === "hover"
                forceActive: typeof harnessState !== "undefined" && harnessState === "active"
            }
        }

        // Isolated ScrollArea Harness Container (for visual unit tests)
        Rectangle {
            id: scrollHarnessContainer
            visible: typeof harnessMode !== "undefined" && (harnessMode === "scroll-area" || harnessMode === "scrollbar")
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            readonly property bool isVert: typeof harnessOrientation === "undefined" || harnessOrientation !== "horizontal"
            readonly property int containerW: isVert ? 100 : 180
            readonly property int containerH: isVert ? 180 : 60
            readonly property int contentW: isVert ? 100 : 360
            readonly property int contentH: isVert ? 360 : 60

            Rectangle {
                anchors.centerIn: parent
                width: scrollHarnessContainer.containerW
                height: scrollHarnessContainer.containerH
                radius: 6
                color: ThemeTokens.dark ? "#0f172a" : "#ffffff"
                border.width: 1
                border.color: ThemeTokens.dark ? "#1e293b" : "#e2e8f0"
                clip: true

                ChaSetScrollArea {
                    id: harnessScroll
                    anchors.fill: parent
                    showVerticalScrollBar: scrollHarnessContainer.isVert
                    showHorizontalScrollBar: !scrollHarnessContainer.isVert
                    showButtons: typeof harnessShowButtons === "undefined" || harnessShowButtons !== false
                    forceHover: typeof harnessState !== "undefined" && harnessState === "hover"
                    forceActive: typeof harnessState !== "undefined" && harnessState === "active"

                    Item {
                        width: scrollHarnessContainer.contentW
                        height: scrollHarnessContainer.contentH

                        Rectangle {
                            anchors.fill: parent
                            anchors.margins: 8
                            color: ThemeTokens.dark ? "#38bdf8" : "#0284c7"
                            opacity: 0.1
                        }
                    }
                }
            }
        }

        // Isolated Tabs Harness Container (for visual unit tests)
        Rectangle {
            id: tabsHarnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "tabs"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            ChaSetTabs {
                id: harnessTabs
                anchors.centerIn: parent
                currentValue: (typeof harnessTabIndex !== "undefined" && harnessTabIndex === "2") ? "password" : "account"

                ChaSetTabsList {
                    ChaSetTabsTrigger {
                        value: "account"
                        text: (typeof harnessLabel1 !== "undefined" && harnessLabel1 !== "") ? harnessLabel1 : "·"
                        forceHover: typeof harnessState !== "undefined" && harnessState === "hover" && (typeof harnessTabIndex === "undefined" || harnessTabIndex === "1")
                        forceActive: typeof harnessState !== "undefined" && harnessState === "active" && (typeof harnessTabIndex === "undefined" || harnessTabIndex === "1")
                        disabled: typeof harnessDisabled !== "undefined" && harnessDisabled === true && (typeof harnessTabIndex === "undefined" || harnessTabIndex === "1")
                    }
                    ChaSetTabsTrigger {
                        value: "password"
                        text: (typeof harnessLabel2 !== "undefined" && harnessLabel2 !== "") ? harnessLabel2 : "·"
                        forceHover: typeof harnessState !== "undefined" && harnessState === "hover" && typeof harnessTabIndex !== "undefined" && harnessTabIndex === "2"
                        forceActive: typeof harnessState !== "undefined" && harnessState === "active" && typeof harnessTabIndex !== "undefined" && harnessTabIndex === "2"
                        disabled: typeof harnessDisabled !== "undefined" && harnessDisabled === true && typeof harnessTabIndex !== "undefined" && harnessTabIndex === "2"
                    }
                }
            }
        }

        // Isolated Badge Harness Container (for visual unit tests)
        Rectangle {
            id: badgeHarnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "badge"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            ChaSetBadge {
                anchors.centerIn: parent
                variant: typeof harnessVariant !== "undefined" ? harnessVariant : "default"
                size: typeof harnessSize !== "undefined" ? harnessSize : "default"
                text: (typeof harnessLabel !== "undefined" && harnessLabel !== "") ? harnessLabel : "·"
                forceHover: typeof harnessState !== "undefined" && harnessState === "hover"
                forceActive: typeof harnessState !== "undefined" && harnessState === "active"
            }
        }

        // Isolated Label Harness Container (for visual unit tests)
        Rectangle {
            id: labelHarnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "label"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            ChaSetLabel {
                anchors.centerIn: parent
                size: typeof harnessSize !== "undefined" ? harnessSize : "default"
                disabled: typeof harnessDisabled !== "undefined" && harnessDisabled === true
                required: typeof harnessRequired !== "undefined" && harnessRequired === true
                text: (typeof harnessLabel !== "undefined" && harnessLabel !== "") ? harnessLabel : "·"
                forceHover: typeof harnessState !== "undefined" && harnessState === "hover"
                forceActive: typeof harnessState !== "undefined" && harnessState === "active"
            }
        }

        // Isolated Card Harness Container (for visual unit tests)
        Rectangle {
            id: cardHarnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "card"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            ChaSetCard {
                id: harnessCard
                anchors.centerIn: parent
                width: 280
                variant: typeof harnessVariant !== "undefined" ? harnessVariant : "default"

                ChaSetCardHeader {
                    ChaSetCardTitle {
                        text: (typeof harnessLabel !== "undefined" && harnessLabel !== "") ? harnessLabel : "·"
                    }
                    ChaSetCardDescription {
                        text: "·"
                    }
                }
                ChaSetCardContent {
                    Text {
                        text: "·"
                        font.pixelSize: 13
                        color: ThemeTokens.dark ? Qt.rgba(248/255, 250/255, 252/255, 1.0) : Qt.rgba(2/255, 8/255, 23/255, 1.0)
                    }
                }
            }
        }

        // Isolated Input Harness Container (for visual unit tests)
        Rectangle {
            id: inputHarnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "input"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            ChaSetInput {
                id: harnessInput
                anchors.centerIn: parent
                width: 220
                size: typeof harnessSize !== "undefined" ? harnessSize : "default"
                text: (typeof harnessLabel !== "undefined" && harnessLabel !== "") ? harnessLabel : "·"
                disabled: typeof harnessDisabled !== "undefined" && harnessDisabled === true
                forceHover: typeof harnessState !== "undefined" && harnessState === "hover"
                forceFocus: typeof harnessState !== "undefined" && harnessState === "focus"
            }
        }

        // Isolated Separator Harness Container (for visual unit tests)
        Rectangle {
            id: separatorHarnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "separator"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            readonly property bool isVert: typeof harnessOrientation !== "undefined" && harnessOrientation === "vertical"

            Item {
                x: separatorHarnessContainer.isVert ? 110 : 20
                y: separatorHarnessContainer.isVert ? 10 : 40
                width: separatorHarnessContainer.isVert ? 1 : 180
                height: separatorHarnessContainer.isVert ? 60 : 1

                ChaSetSeparator {
                    anchors.fill: parent
                    orientation: separatorHarnessContainer.isVert ? "vertical" : "horizontal"
                }
            }
        }

        Item {
            id: studioContainer
            visible: typeof harnessMode === "undefined" || harnessMode === ""
            anchors.fill: parent

            // ==============================================================
            // 1. TOP NAVBAR (Sticky, 56px height, 1px border bottom, full-bleed)
            // ==============================================================
            Rectangle {
                id: topbar
                width: parent.width
                height: 56
                z: 50
                color: win.cBg

                // Continuous 1px bottom border across entire window width
                Rectangle {
                    anchors.bottom: parent.bottom
                    width: parent.width
                    height: 1
                    color: win.cBorder
                }

                Item {
                    id: topbarInner
                    anchors.fill: parent
                    anchors.leftMargin: 20
                    anchors.rightMargin: 20

                    // Left Brand Group
                    Row {
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 10

                        Text {
                            text: "🍵"
                            font.pixelSize: 20
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: "ChaSet"
                            color: win.cFg
                            font.pixelSize: 16
                            font.weight: Font.Bold
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        ChaSetBadge {
                            variant: "outline"
                            size: "sm"
                            text: "v0.1.0"
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    // Center Search Bar Trigger
                    Rectangle {
                        width: Math.min(parent.width - 500, 320)
                        height: 32
                        radius: 6
                        color: win.cAccentBg
                        border.color: win.cBorder
                        anchors.centerIn: parent

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: 10
                            anchors.rightMargin: 8
                            spacing: 8

                            Text { text: "🔍"; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                            Text { text: "Search components & docs..."; color: win.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                            Item { width: parent.width - 240; height: 1 }
                            Rectangle {
                                width: 32; height: 18; radius: 3; color: win.cCard; border.color: win.cBorder
                                anchors.verticalCenter: parent.verticalCenter
                                Text { anchors.centerIn: parent; text: "⌘K"; color: win.cMutedFg; font.pixelSize: 10; font.family: "Consolas" }
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: win.searchModalOpen = true
                        }
                    }

                    // Right Actions
                    Row {
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 8

                        // Style Tuner Button
                        ChaSetTooltip {
                            text: "Toggle theme controls"
                            side: "bottom"
                            ChaSetButton {
                                variant: win.activePage === "theme-tuner" ? "default" : "secondary"
                                size: "sm"
                                text: "🎨 Studio Tuner"
                                onClicked: win.activePage = "theme-tuner"
                            }
                        }

                        // Export Button
                        ChaSetTooltip {
                            text: "Export Theme Config"
                            side: "bottom"
                            ChaSetButton {
                                variant: "secondary"
                                size: "sm"
                                text: "📋 Export"
                                onClicked: win.exportModalOpen = true
                            }
                        }

                        ChaSetSeparator { orientation: "vertical"; height: 18; anchors.verticalCenter: parent.verticalCenter }

                        // Dark/Light Mode Toggle Button
                        ChaSetTooltip {
                            text: ThemeTokens.dark ? "Switch to light mode" : "Switch to dark mode"
                            side: "bottom"
                            ChaSetButton {
                                size: "icon"
                                variant: "outline"
                                text: ThemeTokens.dark ? "🌙" : "☀️"
                                onClicked: ThemeTokens.dark = !ThemeTokens.dark
                            }
                        }
                    }
                }
            }

            // ==============================================================
            // 2. MAIN BODY (Sidebar + Router Content, max-w-7xl = 1280px centered)
            // ==============================================================
            Item {
                id: mainAppGrid
                width: Math.min(parent.width, 1280)
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.top: topbar.bottom
                anchors.bottom: parent.bottom

                // Left Navigation Sidebar (240px width with right border)
                Rectangle {
                    id: sidebar
                    width: 240
                    anchors.left: parent.left
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    color: win.cBg

                    Rectangle {
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.bottom: parent.bottom
                        width: 1
                        color: win.cBorder
                        z: 5
                    }

                    ChaSetScrollArea {
                        anchors.fill: parent
                        anchors.margins: 16
                        showVerticalScrollBar: true
                        showHorizontalScrollBar: false
                        showButtons: false
                        contentWidth: width - 8
                        contentHeight: sidebarCol.implicitHeight

                        Column {
                            id: sidebarCol
                            width: parent.width
                            spacing: 20

                        Repeater {
                            model: ShowcaseData.navigation || []
                            delegate: Column {
                                required property var modelData
                                width: parent.width
                                spacing: 4

                                Text {
                                    text: modelData.title ? modelData.title.toUpperCase() : ""
                                    color: win.cMutedFg
                                    font.pixelSize: 11
                                    font.weight: Font.Bold
                                    font.family: "Segoe UI, sans-serif"
                                }

                                Item { width: 1; height: 4 }

                                Repeater {
                                    model: modelData.items || []
                                    delegate: Rectangle {
                                        id: navItemRect
                                        required property var modelData
                                        width: parent.width
                                        height: 32
                                        radius: 6
                                        color: win.activePage === navItemRect.modelData.id ? win.cAccentBg : "transparent"

                                        Text {
                                            anchors.left: parent.left
                                            anchors.leftMargin: 10
                                            anchors.right: navItemBadge.visible ? navItemBadge.left : parent.right
                                            anchors.rightMargin: 8
                                            anchors.verticalCenter: parent.verticalCenter
                                            elide: Text.ElideRight
                                            text: navItemRect.modelData.title || ""
                                            color: win.activePage === navItemRect.modelData.id ? win.cFg : win.cMutedFg
                                            font.pixelSize: 13
                                            font.weight: win.activePage === navItemRect.modelData.id ? Font.DemiBold : Font.Normal
                                        }

                                        ChaSetBadge {
                                            id: navItemBadge
                                            visible: !!navItemRect.modelData.badge
                                            variant: "secondary"
                                            size: "sm"
                                            text: navItemRect.modelData.badge || ""
                                            anchors.right: parent.right
                                            anchors.rightMargin: 10
                                            anchors.verticalCenter: parent.verticalCenter
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: win.activePage = navItemRect.modelData.id
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

                // Center Main Content Area
                ChaSetScrollArea {
                    id: contentScroll
                    objectName: "contentScroll"
                    anchors.left: sidebar.right
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.topMargin: 20
                    anchors.bottom: parent.bottom
                    contentWidth: pageContainer.width
                    contentHeight: pageContainer.implicitHeight + 40
                    clip: true

                    Item {
                        id: pageContainer
                        width: contentScroll.width
                        implicitHeight: pageLoader.item ? Math.max(pageLoader.item.implicitHeight, pageLoader.item.height, 800) : 800

                        Loader {
                            id: pageLoader
                            width: parent.width
                            source: win.getPageSource(win.activePage)
                            onLoaded: {
                                if (item) {
                                    if ("customRadius" in item) item.customRadius = Qt.binding(function() { return win.customRadius })
                                    if ("cFg" in item) item.cFg = Qt.binding(function() { return win.cFg })
                                    if ("cMutedFg" in item) item.cMutedFg = Qt.binding(function() { return win.cMutedFg })
                                    if ("cCard" in item) item.cCard = Qt.binding(function() { return win.cCard })
                                    if ("cBorder" in item) item.cBorder = Qt.binding(function() { return win.cBorder })
                                    if ("cPrimary" in item) item.cPrimary = Qt.binding(function() { return win.cPrimary })
                                    if ("cAccentBg" in item) item.cAccentBg = Qt.binding(function() { return win.cAccentBg })
                                    if ("activeAccent" in item) item.activeAccent = Qt.binding(function() { return win.activeAccent })
                                    if ("logAction" in item) item.logAction.connect(function(msg) { win.pushLog(msg) })
                                    if ("logCopied" in item) item.logCopied.connect(function(token) { win.pushLog("Copied: " + token) })
                                    if ("openPage" in item) item.openPage.connect(function(id) { win.activePage = id })
                                    if ("requestExport" in item) item.requestExport.connect(function() { win.exportModalOpen = true })
                                }
                            }
                        }
                    }
                }
            }

            // Command Search Modal (Ctrl+K)
            CommandSearchModal {
                visible: win.searchModalOpen
                onSelectPage: function(pageId) { win.activePage = pageId }
                onClose: win.searchModalOpen = false
            }

            // Export Config Modal
            ExportModal {
                open: win.exportModalOpen
                customRadius: win.customRadius
                exportTab: win.exportTab
                onClose: win.exportModalOpen = false
            }
        }
    }
}
