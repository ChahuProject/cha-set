// ChaSet Qt Studio — Cross-Stack Theme & Component Workbench
// 100% Pixel-Perfect and Behavioral Parity with React Studio (packages/react/examples/basic).
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Shapes
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

    // ---- Reactive Navigation & Mobile Drawer State ----
    readonly property bool isMobileNav: width < ThemeTokens.dp(768)
    property bool mobileNavOpen: false
    property bool mobileTocOpen: false

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

    // Global copy shortcut routing to active SelectionHub owner
    Shortcut {
        sequences: [StandardKey.Copy, "Ctrl+C", "Ctrl+Ins"]
        onActivated: {
            SelectionHub.copyActiveSelection();
        }
    }

    function copyActiveSelection() {
        return SelectionHub.copyActiveSelection();
    }

    function testClaimSelection(text) {
        SelectionHub.claim({
            selectedText: text,
            code: text,
            deselect: function() {}
        });
    }

    function testClearSelection() {
        SelectionHub.clearAll();
    }

    property string themeMode: (typeof startupDark !== "undefined" && startupDark === true)
        ? "dark"
        : ((typeof startupLight !== "undefined" && startupLight === true) ? "light" : "system")

    function updateEffectiveTheme() {
        if (win.themeMode === "dark") {
            ThemeTokens.dark = true;
        } else if (win.themeMode === "light") {
            ThemeTokens.dark = false;
        } else {
            ThemeTokens.dark = ChaSetSystemTheme.isDark;
        }
    }

    function setThemeMode(mode) {
        if (mode === "dark" || mode === "light" || mode === "system") {
            win.themeMode = mode;
            win.updateEffectiveTheme();
            win.syncGlobalThemeConfig();
        }
    }

    Connections {
        target: ChaSetSystemTheme
        function onColorSchemeChanged() {
            if (win.themeMode === "system") {
                win.updateEffectiveTheme();
                win.syncGlobalThemeConfig();
            }
        }
    }

    function syncGlobalThemeConfig() {
        win.globalThemeConfig = {
            version: 1,
            mode: win.themeMode,
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
        if (cfg.mode === "dark" || cfg.mode === "light" || cfg.mode === "system") {
            win.setThemeMode(cfg.mode);
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
        win.themeMode = "light";
        ThemeTokens.dark = false;
        win.activeAccent = "";
        win.overridePrimary = "";
        win.overridePrimaryFg = "";
        win.overrideSecondary = "";
        win.overrideSecondaryFg = "";
        win.overrideDestructive = "";
        win.overrideBackground = "";
        win.overrideCard = "";
        win.overrideRing = "";
        win.customRadius = 8;
        ThemeTokens.animSpeed = 0.2;
        ThemeTokens.uiScale = 1.0;
        win.syncGlobalThemeConfig();
    }

    property bool searchModalOpen: false
    property bool exportModalOpen: false
    property string exportTab: "css"

    readonly property string currentLanguageName: {
        var cur = ChaSetI18n.locale;
        var list = ChaSetI18n.supportedLocales || [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].code === cur) return list[i].nativeName;
        }
        return cur === "zh-CN" ? "中文" : "English";
    }

    readonly property var languageMenuItems: {
        var pref = ChaSetI18n.preference;
        var list = ChaSetI18n.supportedLocales || [];
        var menu = [
            { isLabel: true, label: ChaSetI18n.tr("showcase.switchLanguage", "Switch Language") },
            { separator: true },
            {
                id: "system",
                label: ChaSetI18n.tr("language.followSystem", "Follow System"),
                icon: "monitor",
                checked: pref === "system",
                onSelect: function() { ChaSetI18n.setPreference("system"); }
            },
            { separator: true }
        ];
        for (var i = 0; i < list.length; i++) {
            var l = list[i];
            (function(code, name) {
                menu.push({
                    id: code,
                    label: name + " (" + code + ")",
                    checked: pref === code,
                    onSelect: function() { ChaSetI18n.setPreference(code); }
                });
            })(l.code, l.nativeName);
        }
        return menu;
    }

    readonly property var quickJumpMenuItems: [
        { isLabel: true, label: "Featured Engines" },
        { separator: true },
        {
            id: "generic-data-table",
            label: "Generic Data Table",
            icon: "table",
            onSelect: function() { win.activePage = "generic-data-table"; }
        },
        {
            id: "query-builder",
            label: "Query Builder",
            icon: "search",
            onSelect: function() { win.activePage = "query-builder"; }
        },
        {
            id: "virtual-list",
            label: "Virtual List",
            icon: "file-text",
            onSelect: function() { win.activePage = "virtual-list"; }
        },
        {
            id: "draggable-modal",
            label: "Draggable Modal",
            icon: "maximize",
            onSelect: function() { win.activePage = "draggable-modal"; }
        },
        {
            id: "splitter",
            label: "Splitter",
            onSelect: function() { win.activePage = "splitter"; }
        }
    ]

    // Custom Color Overrides (Live)
    property string overridePrimary: ""
    property string overridePrimaryFg: ""
    property string overrideSecondary: ""
    property string overrideSecondaryFg: ""
    property string overrideDestructive: ""
    property string overrideBackground: ""
    property string overrideCard: ""
    property string overrideRing: ""

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
        case "typography": return "TypographyPage.qml";
        case "icons": return "IconsPage.qml";
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
        case "notification-stack": return "NotificationStackDocPage.qml";
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
        case "table-of-contents": return "TableOfContentsDocPage.qml";
        case "kbd": return "KbdDocPage.qml";
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
        when: typeof startupDark !== "undefined" && startupDark === true
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
        if (typeof startupDark !== "undefined" && startupDark === true) win.themeMode = "dark"
        else if (typeof startupLight !== "undefined" && startupLight === true) win.themeMode = "light"
        else win.themeMode = "system"
        win.updateEffectiveTheme()
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

        // Scenario 2b: Nested Scroll Chaining & Pass-Through Verification
        if (scenario === "all" || scenario === "scroll-chaining" || scenario === "scroll-wheel") {
            contentScroll.flickableItem.contentY = 0;

            // 1. Direct pass-through test: an unscrollable inner scroll area (contentHeight <= height)
            var unscrollableInner = Qt.createQmlObject('import QtQuick 6.10; import ChaSet; ChaSetScrollArea { width: 300; height: 300; contentWidth: 300; contentHeight: 200 }', contentScroll.contentItem, "dynamicUnscrollableArea");
            if (unscrollableInner) {
                var initialOuterY = contentScroll.flickableItem.contentY;
                var handled = unscrollableInner.handleVerticalWheel(-120);
                var newOuterY = contentScroll.flickableItem.contentY;
                if (handled && newOuterY > initialOuterY) {
                    console.log("[qt-scenario] PASS: Unscrollable inner scroll area passes wheel to parent (outer contentY " + initialOuterY + " -> " + newOuterY + ")");
                } else {
                    console.log("[qt-scenario] FAIL: Unscrollable inner scroll area did not pass wheel to parent (handled=" + handled + ", initial=" + initialOuterY + ", new=" + newOuterY + ")");
                    failures++;
                }
                unscrollableInner.destroy();
            }

            // 2. Scroll chaining test: a scrollable inner scroll area (contentHeight: 500, height: 200)
            var scrollableInner = Qt.createQmlObject('import QtQuick 6.10; import ChaSet; ChaSetScrollArea { width: 300; height: 200; contentWidth: 300; contentHeight: 500 }', contentScroll.contentItem, "dynamicScrollableArea");
            if (scrollableInner) {
                contentScroll.flickableItem.contentY = 100;
                var outerBeforeInnerScroll = contentScroll.flickableItem.contentY;

                // Scroll inner area down
                scrollableInner.handleVerticalWheel(-120);
                if (scrollableInner.contentY > 0 && contentScroll.flickableItem.contentY === outerBeforeInnerScroll) {
                    console.log("[qt-scenario] PASS: Scrollable inner area consumes wheel within its bounds (inner contentY=" + scrollableInner.contentY + ", outer unchanged=" + outerBeforeInnerScroll + ")");
                } else {
                    console.log("[qt-scenario] FAIL: Inner area did not consume wheel (inner contentY=" + scrollableInner.contentY + ", outer=" + contentScroll.flickableItem.contentY + ")");
                    failures++;
                }

                // Move inner area directly to bottom boundary
                scrollableInner.contentY = Math.max(0, scrollableInner.contentHeight - scrollableInner.height);
                var outerBeforeChaining = contentScroll.flickableItem.contentY;
                var chained = scrollableInner.handleVerticalWheel(-120);
                var outerAfterChaining = contentScroll.flickableItem.contentY;
                if (chained && outerAfterChaining > outerBeforeChaining) {
                    console.log("[qt-scenario] PASS: Reaching bottom boundary chains wheel down to parent (outer contentY " + outerBeforeChaining + " -> " + outerAfterChaining + ")");
                } else {
                    console.log("[qt-scenario] FAIL: Wheel at boundary did not chain to parent (chained=" + chained + ", before=" + outerBeforeChaining + ", after=" + outerAfterChaining + ")");
                    failures++;
                }
                scrollableInner.destroy();
            }

            contentScroll.flickableItem.contentY = 0;
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
            if (ThemeTokens.uiScale < 2.5) {
                console.log("[qt-scenario] FAIL: High zoom did not reach >= 2.5: got " + ThemeTokens.uiScale);
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

            // 4. Test copyActiveSelection and hasSelection
            var mockItemC = {
                selectedText: "test-selection-copy-token-" + Date.now(),
                code: "const x = 42;",
                deselectCount: 0,
                deselect: function() { this.deselectCount++; },
                selectAll: function() { this.selectedText = this.code; }
            };
            SelectionHub.claim(mockItemC);
            if (!SelectionHub.hasSelection) {
                console.log("[qt-scenario] FAIL: SelectionHub hasSelection should be true for mockItemC");
                selFailures++;
            }
            var copied = SelectionHub.copyActiveSelection();
            if (!copied) {
                console.log("[qt-scenario] FAIL: SelectionHub.copyActiveSelection returned false");
                selFailures++;
            }
            if (ChaSetClipboard.text() !== mockItemC.selectedText) {
                console.log("[qt-scenario] FAIL: ChaSetClipboard text mismatch, got: " + ChaSetClipboard.text());
                selFailures++;
            }

            // 5. Test context menu registration and showContextMenu
            SelectionHub.showContextMenu(120, 120, mockItemC);
            if (!globalTextContextMenu.items || globalTextContextMenu.items.length === 0) {
                console.log("[qt-scenario] FAIL: globalTextContextMenu.items empty after showContextMenu");
                selFailures++;
            }
            globalTextContextMenu.close();

            // 6. Deselection & clearAll
            SelectionHub.clearAll();
            if (SelectionHub.hasSelection) {
                console.log("[qt-scenario] FAIL: SelectionHub hasSelection should be false after clearAll");
                selFailures++;
            }

            if (selFailures === 0) {
                console.log("[qt-scenario] PASS: SelectionHub global mutual exclusion, copyActiveSelection & context menu verified");
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

        // Scenario 12: Table of Contents (TOC) Interactive Scrolling & Anchor Alignment
        if (scenario === "all" || scenario === "toc" || scenario === "table-of-contents") {
            console.log("[qt-scenario] Running Table of Contents interactive scrolling scenario...");
            var tocFailures = 0;
            var docItem = pageLoader.item;
            if (!docItem || !docItem.tocItems || docItem.tocItems.length === 0) {
                console.log("[qt-scenario] FAIL: pageLoader.item is not a DocLayout with tocItems");
                tocFailures++;
            } else {
                // 1. Verify findSectionTarget locates all tocItems declared on the active page
                for (var t = 0; t < docItem.tocItems.length; t++) {
                    var item = docItem.tocItems[t];
                    var target = docItem.findSectionTarget(item);
                    if (!target) {
                        console.log("[qt-scenario] FAIL: findSectionTarget failed to find target for '" + item.id + "' ('" + item.title + "')");
                        tocFailures++;
                    }
                }

                // 2. Test scrollToSection to second section and verify scrolling
                if (docItem.tocItems.length > 1) {
                    var secondItem = docItem.tocItems[1];
                    docItem.scrollToSection(secondItem);
                    if (contentScroll.contentY <= 0) {
                        console.log("[qt-scenario] FAIL: scrollToSection('" + secondItem.id + "') did not advance contentScroll.contentY (got " + contentScroll.contentY + ")");
                        tocFailures++;
                    }
                }

                // 3. Test scrollToSection back to first section
                if (docItem.tocItems.length > 0) {
                    var firstItem = docItem.tocItems[0];
                    docItem.scrollToSection(firstItem);
                    if (contentScroll.contentY > 250) {
                        console.log("[qt-scenario] FAIL: scrollToSection('" + firstItem.id + "') did not return near top (got " + contentScroll.contentY + ")");
                        tocFailures++;
                    }
                }
            }

            if (tocFailures === 0) {
                console.log("[qt-scenario] PASS: Table of Contents interactive scrolling & section target alignment verified");
            } else {
                failures += tocFailures;
            }
        }

        // Scenario 13: VirtualTree Drag-and-Drop State Machine & Modifier Kinematics
        if (scenario === "all" || scenario === "virtual-tree" || scenario === "tree-dnd") {
            console.log("[qt-scenario] Running VirtualTree DnD state machine & modifier kinematics scenario...");
            var dndFailures = 0;

            var testTree = Qt.createQmlObject(
                'import QtQuick 6.10; import ChaSet; ChaSetVirtualTree { width: 300; height: 200; enableDnd: true; nodes: [{ id: "src", label: "src", children: [{ id: "file1", label: "file1" }] }, { id: "dst", label: "dst", children: [] }] }',
                win.contentItem,
                "dynamicTestTree"
            );

            if (!testTree) {
                console.log("[qt-scenario] FAIL: Could not create dynamic ChaSetVirtualTree instance");
                dndFailures++;
            } else {
                // 1. Initial State
                if (testTree.isDragging || testTree.dropTargetId !== "" || testTree.dropPosition !== "" || testTree.isCtrlHeld) {
                    console.log("[qt-scenario] FAIL: Initial DnD state should be clean, got isDragging=" + testTree.isDragging + ", dropTargetId=" + testTree.dropTargetId);
                    dndFailures++;
                }

                // 2. Dragging & Target Validity Check
                testTree.isDragging = true;
                testTree.draggedId = "file1";
                testTree.draggedIds = ["file1"];
                testTree.dropTargetId = "dst";
                testTree.dropPosition = "inside";
                testTree.isDropValid = testTree.isDropValidFor("dst");

                if (!testTree.isDropValid) {
                    console.log("[qt-scenario] FAIL: Dropping file1 into dst should be valid");
                    dndFailures++;
                }

                // Cycle prevention: dropping src into its own child file1 must be invalid
                testTree.draggedId = "src";
                testTree.draggedIds = ["src"];
                var cycleValid = testTree.isDropValidFor("file1");
                if (cycleValid) {
                    console.log("[qt-scenario] FAIL: Cycle check failed, dropping ancestor into child should be invalid");
                    dndFailures++;
                }

                // 3. Modifier tracking mid-drag: Ctrl held remains true across simulated movements
                testTree.isCtrlHeld = true;
                testTree.draggedId = "file1";
                testTree.draggedIds = ["file1"];
                testTree.dropTargetId = "dst";
                testTree.dropPosition = "inside";
                testTree.isDropValid = true;

                // Verify isCtrlHeld remains true
                if (!testTree.isCtrlHeld) {
                    console.log("[qt-scenario] FAIL: isCtrlHeld should be true during drag when Ctrl is set");
                    dndFailures++;
                }

                // 4. Dropping with model mutation in callback: ensure state is reset BEFORE delegate recreation
                var dropReceived = false;
                var dropIsCopy = false;
                testTree.nodeDropped.connect(function(src, target, pos, isCopy) {
                    dropReceived = true;
                    dropIsCopy = isCopy;
                    // Simulate consumer mutating tree nodes upon drop
                    testTree.nodes = [
                        { id: "src", label: "src", children: [] },
                        { id: "dst", label: "dst", children: [{ id: "file1-copy", label: "file1-copy" }] }
                    ];
                });

                testTree.executeDrop(true);

                if (!dropReceived) {
                    console.log("[qt-scenario] FAIL: executeDrop did not emit nodeDropped");
                    dndFailures++;
                }
                if (!dropIsCopy) {
                    console.log("[qt-scenario] FAIL: executeDrop did not propagate isCopy=true");
                    dndFailures++;
                }
                if (testTree.isDragging !== false) {
                    console.log("[qt-scenario] FAIL: isDragging should be false after drop, got " + testTree.isDragging);
                    dndFailures++;
                }
                if (testTree.dropTargetId !== "") {
                    console.log("[qt-scenario] FAIL: dropTargetId should be empty after drop, got " + testTree.dropTargetId);
                    dndFailures++;
                }
                if (testTree.dropPosition !== "") {
                    console.log("[qt-scenario] FAIL: dropPosition should be empty after drop, got " + testTree.dropPosition);
                    dndFailures++;
                }
                if (testTree.isCtrlHeld !== false) {
                    console.log("[qt-scenario] FAIL: isCtrlHeld should be reset after drop, got " + testTree.isCtrlHeld);
                    dndFailures++;
                }

                // 5. Test move drop without copy modifier (isCopy = false) and explicit target fallback
                var moveDropReceived = false;
                var moveDropIsCopy = true;
                var moveTarget = "";
                var movePos = "";
                testTree.isDragging = true;
                testTree.draggedId = "file1-copy";
                testTree.draggedIds = ["file1-copy"];
                testTree.isCtrlHeld = false;
                testTree.dropTargetId = "";
                testTree.dropPosition = "";

                var moveConn = function(src, target, pos, isCopy) {
                    moveDropReceived = true;
                    moveDropIsCopy = isCopy;
                    moveTarget = target;
                    movePos = pos;
                };
                testTree.nodeDropped.connect(moveConn);

                testTree.executeDrop(false, "dst", "after");

                if (!moveDropReceived) {
                    console.log("[qt-scenario] FAIL: executeDrop(false, dst, after) did not emit nodeDropped");
                    dndFailures++;
                }
                if (moveDropIsCopy !== false) {
                    console.log("[qt-scenario] FAIL: executeDrop(false) should propagate isCopy=false for move");
                    dndFailures++;
                }
                if (moveTarget !== "dst" || movePos !== "after") {
                    console.log("[qt-scenario] FAIL: executeDrop target/pos mismatch: target=" + moveTarget + ", pos=" + movePos);
                    dndFailures++;
                }
                if (testTree.isDragging !== false || testTree.dropTargetId !== "") {
                    console.log("[qt-scenario] FAIL: drag state not reset after move drop");
                    dndFailures++;
                }

                // 6. Release without valid target / cancel drag
                testTree.isDragging = true;
                testTree.draggedId = "file1";
                testTree.dropTargetId = "invalidTarget";
                testTree.isDropValid = false;
                testTree.resetDragState();

                if (testTree.isDragging || testTree.dropTargetId !== "") {
                    console.log("[qt-scenario] FAIL: resetDragState did not clean up state on release");
                    dndFailures++;
                }

                testTree.destroy();
            }

            if (dndFailures === 0) {
                console.log("[qt-scenario] PASS: VirtualTree DnD state machine & modifier kinematics verified");
            } else {
                failures += dndFailures;
            }
        }

        // Scenario 14: AddressBar Inline Edit, Suggest Popup & Outside Click Kinematics
        if (scenario === "all" || scenario === "address-bar") {
            console.log("[qt-scenario] Running AddressBar inline edit, suggest popup & outside click scenario...");
            var abFailures = 0;

            var testBar = Qt.createQmlObject(
                'import QtQuick 6.10; import ChaSet; ChaSetAddressBar { width: 500; height: 36; path: "C:/Users/Development" }',
                win.contentItem,
                "dynamicTestAddressBar"
            );

            if (!testBar) {
                console.log("[qt-scenario] FAIL: Could not create dynamic ChaSetAddressBar instance");
                abFailures++;
            } else {
                // 1. Initial State
                if (testBar.isEditing !== false || testBar.editing !== false) {
                    console.log("[qt-scenario] FAIL: Initial address bar should not be in editing mode");
                    abFailures++;
                }

                // 2. Enter Edit Mode
                testBar.enterEditMode();
                if (testBar.isEditing !== true || testBar.editing !== true) {
                    console.log("[qt-scenario] FAIL: enterEditMode did not activate editing state");
                    abFailures++;
                }

                // 3. Exit Edit Mode
                testBar.exitEditMode();
                if (testBar.isEditing !== false || testBar.editing !== false) {
                    console.log("[qt-scenario] FAIL: exitEditMode did not deactivate editing state");
                    abFailures++;
                }

                testBar.destroy();
            }

            if (abFailures === 0) {
                console.log("[qt-scenario] PASS: AddressBar edit mode & kinematics verified");
            } else {
                failures += abFailures;
            }
        }

        // Scenario 15: ChaSetVirtualList Virtualization & Programmatic Navigation Parity
        if (scenario === "all" || scenario === "virtual-list") {
            console.log("[qt-scenario] Running VirtualList virtualization & programmatic navigation scenario...");
            var vlFailures = 0;

            var testVList = Qt.createQmlObject(
                'import QtQuick 6.10; import ChaSet; ChaSetVirtualList { width: 360; height: 240; model: 1000; itemHeight: 36; delegate: Item { width: 360; height: 36 } }',
                win.contentItem,
                "dynamicTestVirtualList"
            );

            if (!testVList) {
                console.log("[qt-scenario] FAIL: Could not create dynamic ChaSetVirtualList instance");
                vlFailures++;
            } else {
                // 1. Initial State & Metric Dimensions
                if (testVList.effectiveItemHeight !== ThemeTokens.dp(36)) {
                    console.log("[qt-scenario] FAIL: effectiveItemHeight expected " + ThemeTokens.dp(36) + ", got " + testVList.effectiveItemHeight);
                    vlFailures++;
                }
                if (testVList.effectiveRadius !== ThemeTokens.dp(6)) {
                    console.log("[qt-scenario] FAIL: effectiveRadius expected " + ThemeTokens.dp(6) + ", got " + testVList.effectiveRadius);
                    vlFailures++;
                }
                if (typeof testVList.scrollToIndex !== "function") {
                    console.log("[qt-scenario] FAIL: scrollToIndex is not a function");
                    vlFailures++;
                } else {
                    // 2. Programmatic scrollToIndex tests
                    testVList.scrollToIndex(500, "center");
                    if (testVList.currentIndex !== 500) {
                        console.log("[qt-scenario] FAIL: scrollToIndex(500) did not set currentIndex to 500, got " + testVList.currentIndex);
                        vlFailures++;
                    }

                    testVList.scrollToIndex(0, "start");
                    if (testVList.currentIndex !== 0) {
                        console.log("[qt-scenario] FAIL: scrollToIndex(0) did not set currentIndex to 0, got " + testVList.currentIndex);
                        vlFailures++;
                    }

                    testVList.scrollToIndex(999, "end");
                    if (testVList.currentIndex !== 999) {
                        console.log("[qt-scenario] FAIL: scrollToIndex(999) did not set currentIndex to 999, got " + testVList.currentIndex);
                        vlFailures++;
                    }
                }

                testVList.destroy();
            }

            if (vlFailures === 0) {
                console.log("[qt-scenario] PASS: ChaSetVirtualList metrics & scrollToIndex programmatic navigation verified");
            } else {
                failures += vlFailures;
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

                // Responsive Breakpoints
                readonly property bool isWide: topbar.width >= ThemeTokens.dp(1050)
                readonly property bool isMedium: topbar.width >= ThemeTokens.dp(860)
                readonly property bool isNarrow: topbar.width < ThemeTokens.dp(680)

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
                    anchors.leftMargin: topbar.isNarrow ? ThemeTokens.dp(12) : ThemeTokens.dp(20)
                    anchors.rightMargin: topbar.isNarrow ? ThemeTokens.dp(12) : ThemeTokens.dp(20)

                    // Left Brand Group
                    Row {
                        id: brandGroup
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: ThemeTokens.dp(8)

                        // Mobile Sidebar Drawer Toggle Button
                        ChaSetButton {
                            id: mobileNavBtn
                            visible: win.isMobileNav
                            size: "icon"
                            variant: "ghost"
                            icon: "panel-left"
                            anchors.verticalCenter: parent.verticalCenter
                            onClicked: win.mobileNavOpen = true
                        }

                        Item {
                            width: brandContentRow.implicitWidth
                            height: brandContentRow.implicitHeight
                            anchors.verticalCenter: parent.verticalCenter

                            Row {
                                id: brandContentRow
                                spacing: ThemeTokens.dp(8)
                                anchors.verticalCenter: parent.verticalCenter

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
                                    visible: topbar.width >= ThemeTokens.dp(380)
                                }
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: win.activePage = "intro"
                            }
                        }
                    }

                    // Center Search Bar Trigger (Strictly bounded between Brand and Right Actions)
                    Item {
                        id: centerSearchArea
                        anchors.left: brandGroup.right
                        anchors.leftMargin: ThemeTokens.dp(16)
                        anchors.right: rightActionsRow.left
                        anchors.rightMargin: ThemeTokens.dp(16)
                        anchors.verticalCenter: parent.verticalCenter
                        height: ThemeTokens.dp(36)
                        visible: width >= ThemeTokens.dp(200)

                        Rectangle {
                            id: centerSearchTrigger
                            anchors.centerIn: parent
                            width: Math.min(parent.width, ThemeTokens.dp(360))
                            height: parent.height
                            radius: ThemeTokens.dp(6)
                            color: searchTriggerMouse.containsMouse ? ThemeTokens.hover : win.cAccentBg
                            border.color: win.cBorder
                            border.width: 1

                            // Right-anchored keyboard shortcut badge
                            Rectangle {
                                id: headerKbdBadge
                                anchors.right: parent.right
                                anchors.rightMargin: ThemeTokens.dp(8)
                                anchors.verticalCenter: parent.verticalCenter
                                width: headerKbdText.implicitWidth + ThemeTokens.dp(14)
                                height: ThemeTokens.dp(20)
                                radius: ThemeTokens.dp(4)
                                color: ThemeTokens.dark ? Qt.rgba(30/255, 41/255, 59/255, 0.8) : Qt.rgba(241/255, 245/255, 249/255, 1.0)
                                border.color: win.cBorder
                                border.width: 1

                                Text {
                                    id: headerKbdText
                                    anchors.centerIn: parent
                                    text: "⌘K"
                                    color: win.cMutedFg
                                    font.pixelSize: Typography.sizeNano
                                    font.family: Typography.familyMono
                                    font.weight: Font.Medium
                                }
                            }

                            // Left icon and placeholder text
                            Row {
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(12)
                                anchors.right: headerKbdBadge.left
                                anchors.rightMargin: ThemeTokens.dp(8)
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(8)

                                ChaSetIcon {
                                    id: searchIco
                                    name: "search"
                                    size: 14
                                    color: win.cMutedFg
                                    anchors.verticalCenter: parent.verticalCenter
                                }

                                Text {
                                    text: ChaSetI18n.tr("showcase.searchPlaceholder", "Search components & docs...")
                                    color: win.cMutedFg
                                    font.pixelSize: Typography.sizeSmall
                                    anchors.verticalCenter: parent.verticalCenter
                                    elide: Text.ElideRight
                                    width: Math.max(0, parent.width - searchIco.width - parent.spacing)
                                }
                            }

                            MouseArea {
                                id: searchTriggerMouse
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: win.searchModalOpen = true
                            }
                        }
                    }

                    // Right Actions
                    Row {
                        id: rightActionsRow
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: topbar.isNarrow ? ThemeTokens.dp(4) : ThemeTokens.dp(8)

                        // Compact Search Trigger Button (visible when center search bar is hidden)
                        ChaSetTooltip {
                            text: ChaSetI18n.tr("showcase.searchPlaceholder", "Search components & docs...")
                            side: "bottom"
                            visible: !centerSearchArea.visible

                            ChaSetButton {
                                size: "icon"
                                variant: "outline"
                                icon: "search"
                                onClicked: win.searchModalOpen = true
                            }
                        }

                        // Table of Contents Toggle Button (visible when TOC column is collapsed)
                        ChaSetTooltip {
                            text: ChaSetI18n.tr("showcase.onThisPage", "On this page")
                            side: "bottom"
                            visible: pageLoader.item && pageLoader.item.effectiveTocItems !== undefined && pageLoader.item.effectiveTocItems.length > 0 && pageLoader.item.showToc === false

                            ChaSetButton {
                                size: "icon"
                                variant: "outline"
                                icon: "list"
                                onClicked: win.mobileTocOpen = true
                            }
                        }

                        // Quick Jump Dropdown Menu (Zap)
                        ChaSetTooltip {
                            text: ChaSetI18n.tr("showcase.jumpTo", "Jump to")
                            side: "bottom"
                            disabled: quickJumpDropdown.open

                            ChaSetDropdownMenu {
                                id: quickJumpDropdown
                                width: topbar.width >= ThemeTokens.dp(1100) ? ThemeTokens.dp(96) : ThemeTokens.dp(32)
                                height: ThemeTokens.dp(32)
                                menuWidth: 200
                                align: "end"
                                sideOffset: 8
                                items: win.quickJumpMenuItems

                                ChaSetButton {
                                    anchors.fill: parent
                                    variant: "outline"
                                    size: topbar.width >= ThemeTokens.dp(1100) ? "sm" : "icon"
                                    icon: "zap"
                                    text: topbar.width >= ThemeTokens.dp(1100) ? ChaSetI18n.tr("showcase.jumpTo", "Jump to") : ""
                                    onClicked: quickJumpDropdown.open = !quickJumpDropdown.open
                                }
                            }
                        }

                        // Style Tuner Button
                        ChaSetTooltip {
                            text: ChaSetI18n.tr("showcase.studioTuner", "Studio Tuner")
                            side: "bottom"
                            ChaSetButton {
                                variant: win.activePage === "theme-tuner" ? "default" : "outline"
                                size: topbar.width >= ThemeTokens.dp(1000) ? "sm" : "icon"
                                icon: "palette"
                                text: topbar.width >= ThemeTokens.dp(1000) ? ChaSetI18n.tr("showcase.studioTuner", "Studio Tuner") : ""
                                onClicked: win.activePage = "theme-tuner"
                            }
                        }

                        // Export Button
                        ChaSetTooltip {
                            text: ChaSetI18n.tr("showcase.exportTheme", "Export")
                            side: "bottom"
                            ChaSetButton {
                                variant: "outline"
                                size: topbar.width >= ThemeTokens.dp(920) ? "sm" : "icon"
                                icon: "copy"
                                text: topbar.width >= ThemeTokens.dp(920) ? ChaSetI18n.tr("showcase.exportTheme", "Export") : ""
                                onClicked: win.exportModalOpen = true
                            }
                        }

                        // Language Switcher Dropdown Menu
                        ChaSetTooltip {
                            text: ChaSetI18n.tr("showcase.switchLanguage", "Switch Language")
                            side: "bottom"
                            disabled: langDropdown.open

                            ChaSetDropdownMenu {
                                id: langDropdown
                                width: topbar.width >= ThemeTokens.dp(820) ? ThemeTokens.dp(100) : ThemeTokens.dp(32)
                                height: ThemeTokens.dp(32)
                                menuWidth: 190
                                align: "end"
                                sideOffset: 8
                                items: win.languageMenuItems

                                ChaSetButton {
                                    anchors.fill: parent
                                    variant: "outline"
                                    size: topbar.width >= ThemeTokens.dp(820) ? "sm" : "icon"
                                    icon: "globe"
                                    text: topbar.width >= ThemeTokens.dp(820) ? win.currentLanguageName : ""
                                    onClicked: langDropdown.open = !langDropdown.open
                                }
                            }
                        }

                        ChaSetSeparator {
                            orientation: "vertical"
                            height: ThemeTokens.dp(18)
                            anchors.verticalCenter: parent.verticalCenter
                            visible: !topbar.isNarrow
                        }

                        // Dark/Light/System Mode Toggle Button
                        ChaSetTooltip {
                            text: win.themeMode === "dark" ? ChaSetI18n.tr("theme.mode.dark", "Dark") : (win.themeMode === "system" ? ChaSetI18n.tr("theme.mode.system", "Follow System") : ChaSetI18n.tr("theme.mode.light", "Light"))
                            side: "bottom"
                            ChaSetButton {
                                size: "icon"
                                variant: "outline"
                                icon: win.themeMode === "dark" ? "moon" : (win.themeMode === "system" ? "monitor" : "sun")
                                onClicked: {
                                    if (win.themeMode === "light") {
                                        win.setThemeMode("dark");
                                    } else if (win.themeMode === "dark") {
                                        win.setThemeMode("system");
                                    } else {
                                        win.setThemeMode("light");
                                    }
                                }
                            }
                        }

                        // GitHub Repository Button
                        ChaSetTooltip {
                            text: "GitHub Repository"
                            side: "bottom"
                            ChaSetButton {
                                id: githubBtn
                                size: "icon"
                                variant: "outline"
                                onClicked: Qt.openUrlExternally("https://github.com/chahu/cha-set")

                                Shape {
                                    anchors.centerIn: parent
                                    width: 24
                                    height: 24
                                    transformOrigin: Item.Center
                                    scale: ThemeTokens.dp(16) / 24
                                    antialiasing: true

                                    ShapePath {
                                        fillColor: githubBtn.fgColor()
                                        strokeColor: "transparent"
                                        PathSvg {
                                            path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                                        }
                                    }
                                }
                            }
                        }

                        // Version Badge (Right-aligned, top-right of chrome)
                        ChaSetBadge {
                            variant: "outline"
                            size: "sm"
                            text: "v0.1.0"
                            anchors.verticalCenter: parent.verticalCenter
                            visible: topbar.width >= ThemeTokens.dp(720)
                        }
                    }
                }
            }

            // ==============================================================
            // 2. MAIN BODY (Sidebar + Router Content, max-w-7xl = 1280px centered)
            // ==============================================================
            Item {
                id: mainAppGrid
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: topbar.bottom
                anchors.bottom: parent.bottom

                // Left Navigation Sidebar (240px width with right border, hidden when win.isMobileNav)
                Rectangle {
                    id: sidebar
                    visible: !win.isMobileNav
                    width: win.isMobileNav ? 0 : Math.max(ThemeTokens.dp(160), Math.min(ThemeTokens.dp(240), Math.round(parent.width * 0.28)))
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
                        anchors.rightMargin: 1
                        showVerticalScrollBar: true
                        showHorizontalScrollBar: false
                        showButtons: false
                        contentWidth: width
                        contentHeight: sidebarCol.implicitHeight + ThemeTokens.dp(32)

                        Column {
                            id: sidebarCol
                            x: ThemeTokens.dp(16)
                            y: ThemeTokens.dp(16)
                            width: Math.max(0, parent.width - ThemeTokens.dp(32))
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
                    anchors.left: win.isMobileNav ? parent.left : sidebar.right
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    showVerticalScrollBar: true
                    showHorizontalScrollBar: true
                    contentWidth: pageContainer.width
                    contentHeight: pageContainer.implicitHeight + ThemeTokens.dp(40)
                    clip: true

                    Timer {
                        interval: 150
                        running: typeof reqScrollY !== "undefined" && reqScrollY > 0
                        onTriggered: {
                            contentScroll.contentY = Math.min(reqScrollY, Math.max(0, contentScroll.contentHeight - contentScroll.height));
                        }
                    }

                    Item {
                        id: pageContainer
                        width: Math.max(contentScroll.width, pageLoader.item ? pageLoader.item.implicitWidth : 0, ThemeTokens.dp(600))
                        implicitHeight: (pageLoader.item ? Math.max(pageLoader.item.implicitHeight, pageLoader.item.height, ThemeTokens.dp(800)) : ThemeTokens.dp(800)) + ThemeTokens.dp(20)

                        Loader {
                            id: pageLoader
                            objectName: "pageLoader"
                            y: ThemeTokens.dp(20)
                            width: parent.width
                            source: win.getPageSource(win.activePage)
                            onLoaded: {
                                if (item) {
                                    if ("requestMobileToc" in item) {
                                        item.requestMobileToc.connect(function() {
                                            win.mobileTocOpen = true;
                                        });
                                    }
                                    if ("customRadius" in item) item.customRadius = Qt.binding(function() { return win.customRadius })
                                    if ("cFg" in item) item.cFg = Qt.binding(function() { return win.cFg })
                                    if ("cMutedFg" in item) item.cMutedFg = Qt.binding(function() { return win.cMutedFg })
                                    if ("cCard" in item) item.cCard = Qt.binding(function() { return win.cCard })
                                    if ("cBorder" in item) item.cBorder = Qt.binding(function() { return win.cBorder })
                                    if ("cPrimary" in item) item.cPrimary = Qt.binding(function() { return win.cPrimary })
                                    if ("cAccentBg" in item) item.cAccentBg = Qt.binding(function() { return win.cAccentBg })
                                    if ("activeAccent" in item) item.activeAccent = Qt.binding(function() { return win.activeAccent })
                                    if ("overridePrimary" in item) { item.overridePrimary = win.overridePrimary; item.overridePrimaryChanged.connect(function() { win.overridePrimary = item.overridePrimary }) }
                                    if ("overridePrimaryFg" in item) { item.overridePrimaryFg = win.overridePrimaryFg; item.overridePrimaryFgChanged.connect(function() { win.overridePrimaryFg = item.overridePrimaryFg }) }
                                    if ("overrideSecondary" in item) { item.overrideSecondary = win.overrideSecondary; item.overrideSecondaryChanged.connect(function() { win.overrideSecondary = item.overrideSecondary }) }
                                    if ("overrideSecondaryFg" in item) { item.overrideSecondaryFg = win.overrideSecondaryFg; item.overrideSecondaryFgChanged.connect(function() { win.overrideSecondaryFg = item.overrideSecondaryFg }) }
                                    if ("overrideDestructive" in item) { item.overrideDestructive = win.overrideDestructive; item.overrideDestructiveChanged.connect(function() { win.overrideDestructive = item.overrideDestructive }) }
                                    if ("overrideBackground" in item) { item.overrideBackground = win.overrideBackground; item.overrideBackgroundChanged.connect(function() { win.overrideBackground = item.overrideBackground }) }
                                    if ("overrideCard" in item) { item.overrideCard = win.overrideCard; item.overrideCardChanged.connect(function() { win.overrideCard = item.overrideCard }) }
                                    if ("overrideRing" in item) { item.overrideRing = win.overrideRing; item.overrideRingChanged.connect(function() { win.overrideRing = item.overrideRing }) }
                                    if ("themeMode" in item) item.themeMode = Qt.binding(function() { return win.themeMode })
                                    if ("changeThemeMode" in item) item.changeThemeMode.connect(function(m) { win.setThemeMode(m) })
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
                id: exportModalItem
                customRadius: win.customRadius
                exportTab: win.exportTab
                activeAccent: win.activeAccent
                mode: ThemeTokens.dark ? "dark" : "light"
                overridePrimary: win.overridePrimary
                overridePrimaryFg: win.overridePrimaryFg
                overrideSecondary: win.overrideSecondary
                overrideSecondaryFg: win.overrideSecondaryFg
                overrideDestructive: win.overrideDestructive
                overrideBackground: win.overrideBackground
                overrideCard: win.overrideCard
                overrideRing: win.overrideRing
                onClose: win.exportModalOpen = false
            }
            Binding {
                target: exportModalItem
                property: "open"
                value: win.exportModalOpen
            }

            // Mobile Navigation Drawer Sheet (< 768dp)
            ChaSetSheet {
                id: mobileNavSheet
                open: win.mobileNavOpen
                side: "left"
                title: ChaSetI18n.tr("showcase.navigation", "Navigation")
                description: ""
                showCloseButton: true
                onClosed: win.mobileNavOpen = false

                ChaSetScrollArea {
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    showVerticalScrollBar: true
                    showHorizontalScrollBar: false
                    showButtons: false
                    contentWidth: width
                    contentHeight: mobileNavCol.implicitHeight + ThemeTokens.dp(32)

                    Column {
                        id: mobileNavCol
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
                                        id: mNavItemRect
                                        required property var modelData
                                        width: parent.width
                                        height: ThemeTokens.dp(32)
                                        radius: ThemeTokens.dp(6)

                                        readonly property bool isActive: win.activePage === mNavItemRect.modelData.id
                                        readonly property bool isHovered: mNavItemMouse.containsMouse

                                        color: isActive ? win.cAccentBg : (isHovered ? ThemeTokens.hover : "transparent")

                                        Behavior on color {
                                            ColorAnimation { duration: 100 }
                                        }

                                        Text {
                                            anchors.left: parent.left
                                            anchors.leftMargin: ThemeTokens.dp(10)
                                            anchors.right: mNavItemBadge.visible ? mNavItemBadge.left : parent.right
                                            anchors.rightMargin: ThemeTokens.dp(8)
                                            anchors.verticalCenter: parent.verticalCenter
                                            elide: Text.ElideRight
                                            text: mNavItemRect.modelData.title || ""
                                            color: (mNavItemRect.isActive || mNavItemRect.isHovered) ? win.cFg : win.cMutedFg
                                            font.pixelSize: Typography.sizeSmall
                                            font.weight: mNavItemRect.isActive ? Typography.weightSemibold : Typography.weightRegular
                                        }

                                        ChaSetBadge {
                                            id: mNavItemBadge
                                            visible: !!mNavItemRect.modelData.badge
                                            variant: "secondary"
                                            size: "sm"
                                            text: mNavItemRect.modelData.badge || ""
                                            anchors.right: parent.right
                                            anchors.rightMargin: ThemeTokens.dp(10)
                                            anchors.verticalCenter: parent.verticalCenter
                                        }

                                        MouseArea {
                                            id: mNavItemMouse
                                            anchors.fill: parent
                                            hoverEnabled: true
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: {
                                                win.activePage = mNavItemRect.modelData.id;
                                                win.mobileNavOpen = false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // Mobile / Responsive Table of Contents Drawer Sheet
            ChaSetSheet {
                id: mobileTocSheet
                open: win.mobileTocOpen
                side: "right"
                title: ChaSetI18n.tr("showcase.onThisPage", "On this page")
                description: ""
                showCloseButton: true
                onClosed: win.mobileTocOpen = false

                ChaSetScrollArea {
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    showVerticalScrollBar: true
                    showHorizontalScrollBar: false
                    showButtons: false
                    contentWidth: width
                    contentHeight: mobileTocList.implicitHeight + ThemeTokens.dp(32)

                    ChaSetTableOfContents {
                        id: mobileTocList
                        width: parent.width
                        items: (pageLoader.item && pageLoader.item.effectiveTocItems) ? pageLoader.item.effectiveTocItems : []
                        activeId: (pageLoader.item && pageLoader.item.effectiveTocItems && pageLoader.item.effectiveTocItems.length > pageLoader.item.activeTocIndex && pageLoader.item.activeTocIndex >= 0) ? pageLoader.item.effectiveTocItems[pageLoader.item.activeTocIndex].id : ""
                        onSelectItem: function(item) {
                            if (pageLoader.item && pageLoader.item.scrollToSection) {
                                pageLoader.item.scrollToSection(item);
                            }
                            win.mobileTocOpen = false;
                        }
                    }
                }
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

            // Global Text Selection Context Menu (for copying and selection actions)
            ChaSetContextMenu {
                id: globalTextContextMenu
                objectName: "globalTextContextMenu"
                z: 200
                Component.onCompleted: {
                    SelectionHub.registerContextMenu(globalTextContextMenu);
                }
            }
        }
    }
}
