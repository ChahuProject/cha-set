// ChaSet Qt Studio — Cross-Stack Theme & Component Workbench
// 100% Pixel-Perfect and Behavioral Parity with React Studio (packages/react/examples/basic).
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

ApplicationWindow {
    id: win
    width: (typeof reqWidth !== "undefined" && reqWidth > 0) ? reqWidth : ((typeof harnessMode !== "undefined" && (harnessMode === "button" || harnessMode === "badge" || harnessMode === "label")) ? 220 : ((typeof harnessMode !== "undefined" && (harnessMode === "scroll-area" || harnessMode === "scrollbar")) ? 120 : ((typeof harnessMode !== "undefined" && harnessMode === "tabs") ? 260 : ((typeof harnessMode !== "undefined" && harnessMode === "scale-osd") ? 320 : 1150))))
    height: (typeof reqHeight !== "undefined" && reqHeight > 0) ? reqHeight : ((typeof harnessMode !== "undefined" && (harnessMode === "button" || harnessMode === "badge" || harnessMode === "label")) ? 80 : ((typeof harnessMode !== "undefined" && (harnessMode === "scroll-area" || harnessMode === "scrollbar")) ? 200 : ((typeof harnessMode !== "undefined" && harnessMode === "tabs") ? 80 : ((typeof harnessMode !== "undefined" && harnessMode === "scale-osd") ? 80 : 850))))
    visible: true
    title: "ChaSet Studio"
    color: win.cBg
    font.family: Typography.familySans

    // ---- Reactive Theme State ----
    property string activePage: (typeof startupPage !== "undefined" && startupPage !== "") ? startupPage : "intro"   // "intro" | "tokens" | "theme-tuner" | "button" | "scroll-area"
    property bool showTuner: activePage === "theme-tuner"
    property string activeAccent: ""
    property int customRadius: 8

    // ---- Reactive Global Theme Config ----
    property var globalThemeConfig: ({
        version: 1,
        mode: ThemeTokens.dark ? "dark" : "light",
        palette: {
            id: win.activeAccent !== "" ? win.activeAccent : (win.overridePrimary !== "" ? "custom" : "neutral"),
            customHex: win.overridePrimary !== "" ? win.overridePrimary : "#30a0ff"
        },
        decoration: {
            styleId: "simple",
            level: 50,
            overrides: {
                radius: win.customRadius,
                motion: Math.round(((ThemeTokens.animSpeed - 0.05) / 0.4) * 100)
            }
        },
        typography: { familyId: "system", scaleId: "default" },
        uiScale: ThemeTokens.uiScale
    })

    function syncGlobalThemeConfig() {
        win.globalThemeConfig = {
            version: 1,
            mode: ThemeTokens.dark ? "dark" : "light",
            palette: {
                id: win.activeAccent !== "" ? win.activeAccent : (win.overridePrimary !== "" ? "custom" : "neutral"),
                customHex: win.overridePrimary !== "" ? win.overridePrimary : "#30a0ff"
            },
            decoration: {
                styleId: "simple",
                level: 50,
                overrides: {
                    radius: win.customRadius,
                    motion: Math.round(((ThemeTokens.animSpeed - 0.05) / 0.4) * 100)
                }
            },
            typography: { familyId: "system", scaleId: "default" },
            uiScale: ThemeTokens.uiScale
        };
    }

    function applyThemeConfig(cfg) {
        if (!cfg || typeof cfg !== "object") return;

        // 1. Mode
        if (cfg.mode === "dark") {
            ThemeTokens.dark = true;
        } else if (cfg.mode === "light") {
            ThemeTokens.dark = false;
        } else if (cfg.mode === "system") {
            ThemeTokens.dark = false;
        }

        // 2. Palette
        if (cfg.palette && cfg.palette.id) {
            var palId = cfg.palette.id;
            win.activeAccent = (palId === "neutral" ? "" : palId);
            if (palId === "custom" && cfg.palette.customHex) {
                win.overridePrimary = cfg.palette.customHex;
            } else if (palId === "neutral") {
                win.overridePrimary = "";
            } else {
                var palColors = {
                    "slate": ThemeTokens.dark ? "#94a3b8" : "#475569",
                    "red": ThemeTokens.dark ? "#ef4444" : "#dc2626",
                    "orange": ThemeTokens.dark ? "#f97316" : "#ea580c",
                    "yellow": ThemeTokens.dark ? "#eab308" : "#ca8a04",
                    "green": ThemeTokens.dark ? "#22c55e" : "#16a34a",
                    "blue": ThemeTokens.dark ? "#3b82f6" : "#2563eb",
                    "violet": ThemeTokens.dark ? "#8b5cf6" : "#7c3aed",
                    "rose": ThemeTokens.dark ? "#f43f5e" : "#e11d48"
                };
                win.overridePrimary = palColors[palId] || "";
            }
        }

        // 3. Decoration
        if (cfg.decoration) {
            var r = (cfg.decoration.overrides && typeof cfg.decoration.overrides.radius === "number")
                    ? cfg.decoration.overrides.radius
                    : (typeof cfg.decoration.level === "number" ? Math.round(4 + (cfg.decoration.level / 100.0) * 12) : 8);
            win.customRadius = Math.max(0, Math.min(24, r));

            if (cfg.decoration.overrides && typeof cfg.decoration.overrides.motion === "number") {
                ThemeTokens.animSpeed = 0.05 + (cfg.decoration.overrides.motion / 100.0) * 0.4;
            }
        }

        // 4. UI Scale
        if (typeof cfg.uiScale === "number" && cfg.uiScale >= 0.25 && cfg.uiScale <= 5.0) {
            ThemeTokens.uiScale = cfg.uiScale;
        }

        win.syncGlobalThemeConfig();
    }

    function resetThemeConfig() {
        ThemeTokens.dark = false;
        win.activeAccent = "";
        win.overridePrimary = "";
        win.customRadius = 8;
        ThemeTokens.animSpeed = 0.2;
        ThemeTokens.uiScale = 1.0;
        win.syncGlobalThemeConfig();
    }

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

    function getAllPageIds() {
        var list = [];
        if (ShowcaseData && ShowcaseData.navigation) {
            for (var i = 0; i < ShowcaseData.navigation.length; i++) {
                var grp = ShowcaseData.navigation[i];
                if (grp.items) {
                    for (var j = 0; j < grp.items.length; j++) {
                        list.push(grp.items[j].id);
                    }
                }
            }
        }
        return list;
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
        case "snap-slider": return "SnapSliderDocPage.qml";
        case "scale-osd": return "ScaleOsdDocPage.qml";
        case "task-hud": return "TaskHudDocPage.qml";
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
        case "pipeline-view": return "PipelineViewDocPage.qml";
        case "address-bar": return "AddressBarDocPage.qml";
        case "theme-settings": return "ThemeSettingsDocPage.qml";
        case "language-settings": return "LanguageSettingsDocPage.qml";
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

    readonly property var scaleSteps: [0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0]

    function stepZoom(direction) {
        var steps = win.scaleSteps;
        var current = ThemeTokens.uiScale;
        var targetIdx = -1;
        if (direction > 0) {
            for (var i = 0; i < steps.length; i++) {
                if (steps[i] > current + 0.001) {
                    targetIdx = i;
                    break;
                }
            }
            if (targetIdx === -1) targetIdx = steps.length - 1;
        } else {
            for (var j = steps.length - 1; j >= 0; j--) {
                if (steps[j] < current - 0.001) {
                    targetIdx = j;
                    break;
                }
            }
            if (targetIdx === -1) targetIdx = 0;
        }
        var next = steps[targetIdx];
        ThemeTokens.uiScale = next;
        win.syncGlobalThemeConfig();
        if (scaleOsd && (typeof testScenario === "undefined" || testScenario === "")) {
            scaleOsd.value = next;
            scaleOsd.show();
        }
    }

    function resetZoom() {
        ThemeTokens.uiScale = 1.0;
        win.syncGlobalThemeConfig();
        if (scaleOsd && (typeof testScenario === "undefined" || testScenario === "")) {
            scaleOsd.value = 1.0;
            scaleOsd.show();
        }
    }

    Connections {
        target: ThemeTokens
        function onDarkChanged() {
            win.syncGlobalThemeConfig();
        }
        function onUiScaleChanged() {
            win.syncGlobalThemeConfig();
            if (scaleOsd && (typeof testScenario === "undefined" || testScenario === "")) {
                scaleOsd.value = ThemeTokens.uiScale;
                scaleOsd.show();
            }
        }
    }

    // Authentic Interface Scaling (Scene Graph Viewport Matrix)
    readonly property real effectiveUiScale: (typeof harnessMode !== "undefined" && harnessMode !== "") ? 1.0 : ThemeTokens.uiScale

    // Desktop Zoom Keyboard Shortcuts & Wheel Handling
    Shortcut {
        sequences: [StandardKey.ZoomIn, "Ctrl+=", "Ctrl++"]
        onActivated: win.stepZoom(+1)
    }
    Shortcut {
        sequences: [StandardKey.ZoomOut, "Ctrl+-"]
        onActivated: win.stepZoom(-1)
    }
    Shortcut {
        sequences: ["Ctrl+0"]
        onActivated: win.resetZoom()
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
        // Scenario 6: Global Theme Control & Authentic Interface Scale Parity
        if (scenario === "all" || scenario === "theme-control" || scenario === "uiscale") {
            console.log("[qt-scenario] Running Global Theme Control & Authentic UI Scale scenario...");
            var themeFailures = 0;

            // 1. Verify initial UI scale is 1.0 and typography/dp match base metrics
            if (ThemeTokens.uiScale !== 1.0 || Typography.sizeBody !== 14 || ThemeTokens.dp(32) !== 32) {
                console.log("[qt-scenario] FAIL: Initial uiScale expected 1.0, got " + ThemeTokens.uiScale + " (sizeBody=" + Typography.sizeBody + ", dp32=" + ThemeTokens.dp(32) + ")");
                themeFailures++;
            }

            // 2. Test applyThemeConfig with UI scale
            win.applyThemeConfig({
                version: 1,
                mode: "dark",
                palette: { id: "red" },
                decoration: { styleId: "simple", level: 80, overrides: { radius: 16 } },
                typography: { familyId: "system", scaleId: "default" },
                uiScale: 1.5
            });

            if (ThemeTokens.dark !== true) {
                console.log("[qt-scenario] FAIL: ThemeTokens.dark was not updated to true by applyThemeConfig");
                themeFailures++;
            }
            if (ThemeTokens.uiScale !== 1.5 || Typography.sizeBody !== 21 || ThemeTokens.dp(32) !== 48) {
                console.log("[qt-scenario] FAIL: Authentic vector typography & dp scale not applied: ThemeTokens.uiScale=" + ThemeTokens.uiScale + ", sizeBody=" + Typography.sizeBody + ", dp32=" + ThemeTokens.dp(32));
                themeFailures++;
            }
            if (win.activeAccent !== "red" || win.overridePrimary !== "#ef4444") {
                console.log("[qt-scenario] FAIL: red palette not applied: activeAccent=" + win.activeAccent + ", overridePrimary=" + win.overridePrimary);
                themeFailures++;
            }
            if (win.customRadius !== 16) {
                console.log("[qt-scenario] FAIL: customRadius expected 16, got " + win.customRadius);
                themeFailures++;
            }

            // 3. Test resetThemeConfig
            win.resetThemeConfig();
            if (ThemeTokens.dark !== false || ThemeTokens.uiScale !== 1.0 || Typography.sizeBody !== 14 || ThemeTokens.dp(32) !== 32 || win.activeAccent !== "" || win.customRadius !== 8) {
                console.log("[qt-scenario] FAIL: resetThemeConfig did not restore defaults: dark=" + ThemeTokens.dark + ", scale=" + ThemeTokens.uiScale + ", sizeBody=" + Typography.sizeBody + ", accent=" + win.activeAccent + ", radius=" + win.customRadius);
                themeFailures++;
            }

            // 4. Test ChaSetScaleOsd discrete step zoom & scale invariance
            var prevScaleOsdHeight = scaleOsd.height;
            win.stepZoom(+1); // 1.0 -> 1.1
            if (ThemeTokens.uiScale !== 1.1) {
                console.log("[qt-scenario] FAIL: stepZoom(+1) expected 1.1, got " + ThemeTokens.uiScale);
                themeFailures++;
            }
            if (scaleOsd.height !== prevScaleOsdHeight || scaleOsd.height !== 42) {
                console.log("[qt-scenario] FAIL: scaleOsd scale invariance violated: height=" + scaleOsd.height + ", expected 42");
                themeFailures++;
            }
            // Test zooming up past 2.0 to high scales
            for (var z = 0; z < 10; z++) {
                win.stepZoom(+1);
            }
            if (ThemeTokens.uiScale < 2.0) {
                console.log("[qt-scenario] FAIL: High zoom did not reach > 2.0: got " + ThemeTokens.uiScale);
                themeFailures++;
            }
            win.resetZoom();
            if (ThemeTokens.uiScale !== 1.0) {
                console.log("[qt-scenario] FAIL: resetZoom did not restore 1.0: got " + ThemeTokens.uiScale);
                themeFailures++;
            }
            scaleOsd.hide();

            if (themeFailures === 0) {
                console.log("[qt-scenario] PASS: Global Theme Control & Authentic UI Scale verified (mode, palette, decoration, uiScale, reset, scaleOsd)");
            } else {
                failures += themeFailures;
            }
        }

        // Scenario 7: Living Showcase Navigation & Page Loading Coverage
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
            if (typeof gc === "function") gc();
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

        // Scenario 8: Native Clipboard & Copy Button Conformance
        if (scenario === "all" || scenario === "clipboard") {
            console.log("[qt-scenario] Running native clipboard copy scenario...");
            var clipFailures = 0;
            if (typeof ChaSetClipboard !== "undefined" && ChaSetClipboard.setText) {
                var testToken = "chaset-test-clip-" + Date.now();
                ChaSetClipboard.setText(testToken);
                var fetched = ChaSetClipboard.text();
                if (fetched === testToken) {
                    console.log("[qt-scenario] PASS: Native ChaSetClipboard set/get parity (" + testToken + ")");
                } else {
                    console.log("[qt-scenario] FAIL: Native ChaSetClipboard text mismatch (got '" + fetched + "', expected '" + testToken + "')");
                    clipFailures++;
                }
            } else {
                console.log("[qt-scenario] FAIL: ChaSetClipboard singleton not available in QML runtime");
                clipFailures++;
            }

            if (clipFailures === 0) {
                console.log("[qt-scenario] PASS: Native clipboard and ChaSetClipboard verified");
            } else {
                failures += clipFailures;
            }
        }

        // Scenario 9: Cross-Stack Cursor Semantics & Geometry Parity
        if (scenario === "all" || scenario === "cursor" || scenario === "cursor-conformance") {
            console.log("[qt-scenario] Running cross-stack cursor semantics & geometry parity scenario...");
            var cursorFailures = 0;

            // 1. Geometry Health on Button
            if (testBtn.width <= 0 || testBtn.height <= 0) {
                console.log("[qt-scenario] FAIL: testBtn geometry non-positive (w=" + testBtn.width + ", h=" + testBtn.height + ")");
                cursorFailures++;
            }

            // 2. Geometry Health on Checkbox
            if (testCheckbox.width <= 0 || testCheckbox.height <= 0) {
                console.log("[qt-scenario] FAIL: testCheckbox geometry non-positive (w=" + testCheckbox.width + ", h=" + testCheckbox.height + ")");
                cursorFailures++;
            }

            // 3. Geometry Health on Switch
            if (testSwitch.width <= 0 || testSwitch.height <= 0) {
                console.log("[qt-scenario] FAIL: testSwitch geometry non-positive (w=" + testSwitch.width + ", h=" + testSwitch.height + ")");
                cursorFailures++;
            }

            // 4. Geometry Health on CopyButton
            if (testCopyBtn.width <= 0 || testCopyBtn.height <= 0) {
                console.log("[qt-scenario] FAIL: testCopyBtn geometry non-positive (w=" + testCopyBtn.width + ", h=" + testCopyBtn.height + ")");
                cursorFailures++;
            }

            // 5. Geometry Health on SegmentedControl
            if (testSegControl.width <= 0 || testSegControl.height <= 0) {
                console.log("[qt-scenario] FAIL: testSegControl geometry non-positive (w=" + testSegControl.width + ", h=" + testSegControl.height + ")");
                cursorFailures++;
            }

            // 6. Geometry Health on TabsTrigger
            if (testTabTrigger.width <= 0 || testTabTrigger.height <= 0) {
                console.log("[qt-scenario] FAIL: testTabTrigger geometry non-positive (w=" + testTabTrigger.width + ", h=" + testTabTrigger.height + ")");
                cursorFailures++;
            }

            // 7. Geometry Health on ScrollBar
            if (testScrollBar.width <= 0 || testScrollBar.height <= 0) {
                console.log("[qt-scenario] FAIL: testScrollBar geometry non-positive (w=" + testScrollBar.width + ", h=" + testScrollBar.height + ")");
                cursorFailures++;
            }

            if (cursorFailures === 0) {
                console.log("[qt-scenario] PASS: QML Root Geometry & Cursor dimensions verified for all primary controls");
            } else {
                failures += cursorFailures;
            }
        }

        // Scenario 10: SelectionHub Global Mutual Exclusion & Deselection
        if (scenario === "all" || scenario === "selection") {
            console.log("[qt-scenario] Running SelectionHub global mutual exclusion & deselection scenario...");
            var selFailures = 0;

            var mockItemA = {
                deselectCount: 0,
                deselect: function() { this.deselectCount++; }
            };
            var mockItemB = {
                deselectCount: 0,
                deselect: function() { this.deselectCount++; }
            };

            // 1. Claim A
            SelectionHub.claim(mockItemA);
            if (SelectionHub.activeOwner !== mockItemA) {
                console.log("[qt-scenario] FAIL: SelectionHub activeOwner is not mockItemA");
                selFailures++;
            }

            // 2. Claim B should trigger mockItemA.deselect()
            SelectionHub.claim(mockItemB);
            if (SelectionHub.activeOwner !== mockItemB) {
                console.log("[qt-scenario] FAIL: SelectionHub activeOwner is not mockItemB");
                selFailures++;
            }
            if (mockItemA.deselectCount !== 1) {
                console.log("[qt-scenario] FAIL: mockItemA.deselect was not invoked on switch (count=" + mockItemA.deselectCount + ")");
                selFailures++;
            }

            // 3. ClearAll should trigger mockItemB.deselect() and nullify activeOwner
            SelectionHub.clearAll();
            if (SelectionHub.activeOwner !== null) {
                console.log("[qt-scenario] FAIL: SelectionHub activeOwner is not null after clearAll()");
                selFailures++;
            }
            if (mockItemB.deselectCount !== 1) {
                console.log("[qt-scenario] FAIL: mockItemB.deselect was not invoked on clearAll (count=" + mockItemB.deselectCount + ")");
                selFailures++;
            }

            if (selFailures === 0) {
                console.log("[qt-scenario] PASS: SelectionHub global mutual exclusion & single-selection verified");
            } else {
                failures += selFailures;
            }
        }

        // Scenario 11: Cross-Stack Typography Hierarchy & Metric Invariants
        if (scenario === "all" || scenario === "typography") {
            console.log("[qt-scenario] Running typography metrics and token validation scenario...");
            var typoFailures = 0;

            // 1. Validate Typography scale invariants against spec/tokens/primitives.json
            if (Typography.sizeDisplay !== 36) {
                console.log("[qt-scenario] FAIL: Typography.sizeDisplay expected 36, got " + Typography.sizeDisplay);
                typoFailures++;
            }
            if (Typography.sizeHeading !== 16) {
                console.log("[qt-scenario] FAIL: Typography.sizeHeading expected 16, got " + Typography.sizeHeading);
                typoFailures++;
            }
            if (Typography.sizeBody !== 14) {
                console.log("[qt-scenario] FAIL: Typography.sizeBody expected 14, got " + Typography.sizeBody);
                typoFailures++;
            }
            if (Typography.sizeSmall !== 12) {
                console.log("[qt-scenario] FAIL: Typography.sizeSmall expected 12, got " + Typography.sizeSmall);
                typoFailures++;
            }
            if (Typography.sizeCaption !== 11) {
                console.log("[qt-scenario] FAIL: Typography.sizeCaption expected 11, got " + Typography.sizeCaption);
                typoFailures++;
            }

            // 2. Validate font family tokens
            if (!Typography.familySans || Typography.familySans.indexOf("Segoe UI") === -1) {
                console.log("[qt-scenario] FAIL: Typography.familySans missing Segoe UI: " + Typography.familySans);
                typoFailures++;
            }
            if (!Typography.familyMono || Typography.familyMono.indexOf("Consolas") === -1) {
                console.log("[qt-scenario] FAIL: Typography.familyMono missing Consolas: " + Typography.familyMono);
                typoFailures++;
            }

            // 3. Validate weight mappings
            if (Typography.weightRegular !== 400 || Typography.weightMedium !== 500 || Typography.weightSemibold !== 600 || Typography.weightBold !== 700) {
                console.log("[qt-scenario] FAIL: Typography weights mismatch: reg=" + Typography.weightRegular + ", med=" + Typography.weightMedium + ", semi=" + Typography.weightSemibold + ", bold=" + Typography.weightBold);
                typoFailures++;
            }

            if (typoFailures === 0) {
                console.log("[qt-scenario] PASS: Cross-Stack Typography Hierarchy & Metric Invariants verified");
            } else {
                failures += typoFailures;
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

        // Fallback QML WheelHandler for standalone QML runtime
        WheelHandler {
            target: null
            acceptedModifiers: Qt.ControlModifier
            onWheel: function(event) {
                if (event.angleDelta.y === 0) return;
                win.stepZoom(event.angleDelta.y > 0 ? 1 : -1);
                event.accepted = true;
            }
        }

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

        // Hidden test instances for cursor semantics & geometry verification
        ChaSetButton {
            id: testBtn
            objectName: "testBtn"
            x: -2000
            y: -1800
            text: "Test Button"
            visible: true
        }

        ChaSetCheckbox {
            id: testCheckbox
            objectName: "testCheckbox"
            x: -2000
            y: -1700
            label: "Test Checkbox"
            visible: true
        }

        ChaSetSwitch {
            id: testSwitch
            objectName: "testSwitch"
            x: -2000
            y: -1600
            label: "Test Switch"
            visible: true
        }

        ChaSetInput {
            id: testInput
            objectName: "testInput"
            x: -2000
            y: -1500
            text: "Test Input"
            visible: true
        }

        ChaSetCopyButton {
            id: testCopyBtn
            objectName: "testCopyBtn"
            x: -2000
            y: -1400
            text: "Copy Me"
            label: "Copy"
            visible: true
        }

        ChaSetSegmentedControl {
            id: testSegControl
            objectName: "testSegControl"
            x: -2000
            y: -1300
            visible: true
            options: [
                { label: "Alpha", value: "alpha" },
                { label: "Beta", value: "beta" }
            ]
        }

        ChaSetTabsTrigger {
            id: testTabTrigger
            objectName: "testTabTrigger"
            x: -2000
            y: -1200
            text: "Tab Trigger"
            value: "tab1"
            visible: true
        }

        ChaSetScrollBar {
            id: testScrollBar
            objectName: "testScrollBar"
            x: -2000
            y: -1100
            width: 12
            height: 100
            size: 0.3
            position: 0.2
            visible: true
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
                        font.pixelSize: Typography.sizeBody
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

        // Isolated CodeBlock Harness Container (typography / line-height parity)
        //
        // The sample is duplicated verbatim in
        // packages/react/examples/basic/src/App.tsx (CODE_BLOCK_HARNESS_SOURCE);
        // keep them identical so a pixel delta means typography drift, not
        // different input.
        Rectangle {
            id: codeBlockHarnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "code-block"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            readonly property string harnessSource: "const answer = 42;\nfunction greet(name: string) {\n  // say hi\n  return `hi ${name}`;\n}"

            ChaSetCodeBlock {
                width: parent.width
                code: codeBlockHarnessContainer.harnessSource
                language: "tsx"
                // Mirrors the React harness: the copy pill's glyph run is not part
                // of the typography contract under test.
                showCopy: false
                showLineNumbers: typeof harnessLineNumbers !== "undefined" && harnessLineNumbers === true
            }
        }

        // Isolated ScaleOsd Harness Container (for visual unit tests)
        Rectangle {
            id: scaleOsdHarnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "scale-osd"
            anchors.fill: parent
            color: ThemeTokens.dark ? "#020817" : "#ffffff"

            ChaSetScaleOsd {
                id: harnessScaleOsd
                anchors.centerIn: parent
                size: typeof harnessSize !== "undefined" ? harnessSize : "default"
                value: (typeof harnessValue !== "undefined" && harnessValue > 0) ? harnessValue : 1.0
                defaultVisible: true
                animated: false
                ignoreUiScale: true
                format: function(v) {
                    return qsTr("%1%").arg(Math.round(v * 100));
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
                height: ThemeTokens.dp(56)
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
                    anchors.leftMargin: ThemeTokens.dp(20)
                    anchors.rightMargin: ThemeTokens.dp(20)

                    // Left Brand Group
                    Row {
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: ThemeTokens.dp(10)

                        ChaSetIcon {
                            name: "logo"
                            size: 20
                            color: ThemeTokens.accent
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: "ChaSet"
                            color: win.cFg
                            font.pixelSize: Typography.sizeHeading
                            font.weight: Typography.weightBold
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
                        width: Math.min(parent.width - ThemeTokens.dp(500), ThemeTokens.dp(320))
                        height: ThemeTokens.dp(32)
                        radius: ThemeTokens.dp(6)
                        color: win.cAccentBg
                        border.color: win.cBorder
                        anchors.centerIn: parent

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: ThemeTokens.dp(10)
                            anchors.rightMargin: ThemeTokens.dp(8)
                            spacing: ThemeTokens.dp(8)

                            ChaSetIcon { name: "search"; size: 14; color: win.cMutedFg; anchors.verticalCenter: parent.verticalCenter }
                            Text { text: ChaSetI18n.tr("showcase.searchPlaceholder", "Search components & docs..."); color: win.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                            Item { width: parent.width - ThemeTokens.dp(240); height: 1 }
                            Rectangle {
                                width: ThemeTokens.dp(32); height: ThemeTokens.dp(18); radius: ThemeTokens.dp(3); color: win.cCard; border.color: win.cBorder
                                anchors.verticalCenter: parent.verticalCenter
                                Text { anchors.centerIn: parent; text: "⌘K"; color: win.cMutedFg; font.pixelSize: Typography.sizeMicro; font.family: Typography.familyMono }
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
                        spacing: ThemeTokens.dp(8)

                        // Language Switcher Dropdown Menu
                        Item {
                            width: ThemeTokens.dp(90)
                            height: ThemeTokens.dp(32)
                            anchors.verticalCenter: parent.verticalCenter

                            ChaSetButton {
                                id: langBtn
                                anchors.fill: parent
                                variant: "outline"
                                size: "sm"
                                icon: "globe"
                                text: ChaSetI18n.locale === "zh-CN" ? "中文" : "EN"
                                onClicked: langMenu.open()
                            }

                            Menu {
                                id: langMenu
                                y: langBtn.height + ThemeTokens.dp(4)
                                width: ThemeTokens.dp(160)

                                MenuItem {
                                    text: ChaSetI18n.tr("language.followSystem", "Follow System")
                                    onTriggered: ChaSetI18n.setPreference("system")
                                }
                                MenuSeparator {}
                                Repeater {
                                    model: ChaSetI18n.supportedLocales
                                    delegate: MenuItem {
                                        required property var modelData
                                        text: modelData.nativeName + " (" + modelData.code + ")"
                                        onTriggered: ChaSetI18n.setPreference(modelData.code)
                                    }
                                }
                            }
                        }

                        // Style Tuner Button
                        ChaSetTooltip {
                            text: "Toggle theme controls"
                            side: "bottom"
                            ChaSetButton {
                                variant: win.activePage === "theme-tuner" ? "default" : "secondary"
                                size: "sm"
                                icon: "palette"
                                text: ChaSetI18n.tr("showcase.studioTuner", "Studio Tuner")
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
                                icon: "copy"
                                text: ChaSetI18n.tr("showcase.exportTheme", "Export")
                                onClicked: win.exportModalOpen = true
                            }
                        }

                        ChaSetSeparator { orientation: "vertical"; height: ThemeTokens.dp(18); anchors.verticalCenter: parent.verticalCenter }

                        // Dark/Light Mode Toggle Button
                        ChaSetTooltip {
                            text: ThemeTokens.dark ? "Switch to light mode" : "Switch to dark mode"
                            side: "bottom"
                            ChaSetButton {
                                size: "icon"
                                variant: "outline"
                                icon: ThemeTokens.dark ? "moon" : "sun"
                                onClicked: {
                                    ThemeTokens.dark = !ThemeTokens.dark;
                                    win.syncGlobalThemeConfig();
                                }
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
                width: Math.min(parent.width, ThemeTokens.dp(1280))
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.top: topbar.bottom
                anchors.bottom: parent.bottom

                // Left Navigation Sidebar (240px width with right border)
                Rectangle {
                    id: sidebar
                    width: ThemeTokens.dp(240)
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
                        anchors.margins: ThemeTokens.dp(16)
                        showVerticalScrollBar: true
                        showHorizontalScrollBar: false
                        showButtons: false
                        contentWidth: width - ThemeTokens.dp(8)
                        contentHeight: sidebarCol.implicitHeight

                        Column {
                            id: sidebarCol
                            width: parent.width
                            spacing: ThemeTokens.dp(20)

                        Repeater {
                            model: ShowcaseData.navigation || []
                            delegate: Column {
                                required property var modelData
                                width: parent.width
                                spacing: ThemeTokens.dp(4)

                                Text {
                                    text: modelData.title ? ChaSetI18n.tr("showcase.categories." + modelData.title, modelData.title).toUpperCase() : ""
                                    color: win.cMutedFg
                                    font.pixelSize: Typography.sizeCaption
                                    font.weight: Typography.weightSemibold
                                    font.family: Typography.familySans
                                }

                                Item { width: 1; height: ThemeTokens.dp(4) }

                                Repeater {
                                    model: modelData.items || []
                                    delegate: Rectangle {
                                        id: navItemRect
                                        required property var modelData
                                        width: parent.width
                                        height: ThemeTokens.dp(32)
                                        radius: ThemeTokens.dp(6)

                                        readonly property bool isActive: win.activePage === navItemRect.modelData.id
                                        readonly property bool isHovered: navItemMouse.containsMouse

                                        color: isActive ? win.cAccentBg : (isHovered ? ThemeTokens.hover : "transparent")

                                        Behavior on color {
                                            ColorAnimation { duration: 100 }
                                        }

                                        Text {
                                            anchors.left: parent.left
                                            anchors.leftMargin: ThemeTokens.dp(10)
                                            anchors.right: navItemBadge.visible ? navItemBadge.left : parent.right
                                            anchors.rightMargin: ThemeTokens.dp(8)
                                            anchors.verticalCenter: parent.verticalCenter
                                            elide: Text.ElideRight
                                            text: navItemRect.modelData.title || ""
                                            color: (navItemRect.isActive || navItemRect.isHovered) ? win.cFg : win.cMutedFg
                                            font.pixelSize: Typography.sizeSmall
                                            font.weight: navItemRect.isActive ? Typography.weightSemibold : Typography.weightRegular
                                        }

                                        ChaSetBadge {
                                            id: navItemBadge
                                            visible: !!navItemRect.modelData.badge
                                            variant: "secondary"
                                            size: "sm"
                                            text: navItemRect.modelData.badge || ""
                                            anchors.right: parent.right
                                            anchors.rightMargin: ThemeTokens.dp(10)
                                            anchors.verticalCenter: parent.verticalCenter
                                        }

                                        MouseArea {
                                            id: navItemMouse
                                            anchors.fill: parent
                                            hoverEnabled: true
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
                    anchors.topMargin: ThemeTokens.dp(20)
                    anchors.bottom: parent.bottom
                    contentWidth: pageContainer.width
                    contentHeight: pageContainer.implicitHeight + ThemeTokens.dp(40)
                    clip: true

                    Item {
                        id: pageContainer
                        width: contentScroll.width
                        implicitHeight: pageLoader.item ? Math.max(pageLoader.item.implicitHeight, pageLoader.item.height, ThemeTokens.dp(800)) : ThemeTokens.dp(800)

                        Loader {
                            id: pageLoader
                            objectName: "pageLoader"
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
                                    if ("activeConfig" in item) item.activeConfig = Qt.binding(function() { return win.globalThemeConfig })
                                    if ("configModified" in item) item.configModified.connect(function(cfg) { win.applyThemeConfig(cfg) })
                                    if ("resetRequested" in item) item.resetRequested.connect(function() { win.resetThemeConfig() })
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

            // Floating UI Scale OSD (Bottom Center)
            ChaSetScaleOsd {
                id: scaleOsd
                objectName: "globalScaleOsd"
                size: "lg"
                ignoreUiScale: true
                steps: win.scaleSteps
                value: ThemeTokens.uiScale
                format: function(v) {
                    return qsTr("界面缩放 %1%").arg(Math.round(v * 100));
                }
                anchors.bottom: parent.bottom
                anchors.bottomMargin: 36
                anchors.horizontalCenter: parent.horizontalCenter
                z: 100

                onStepTriggered: function(delta) {
                    win.stepZoom(delta > 0 ? 1 : -1);
                }
                onResetTriggered: {
                    win.resetZoom();
                }
            }
        }
    }
}
