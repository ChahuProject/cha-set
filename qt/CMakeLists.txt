cmake_minimum_required(VERSION 3.21)

project(ChaSet VERSION 0.1.0 LANGUAGES CXX)

# Guard against GCC/MinGW toolchain pollution on Windows when linking MSVC Qt.
if(WIN32 AND CMAKE_CXX_COMPILER_ID STREQUAL "GNU" AND NOT CHASE_ALLOW_GCC)
    message(FATAL_ERROR
        "MinGW / GCC compiler detected (${CMAKE_CXX_COMPILER})! "
        "ChaSet on Windows requires MSVC (cl.exe) or Clang-CL to link against MSVC Qt binaries. "
        "CMake cache has NOT been written with GCC. "
        "Please build from Visual Studio Developer PowerShell / Command Prompt, "
        "or pass -DCMAKE_C_COMPILER=cl -DCMAKE_CXX_COMPILER=cl."
    )
endif()


set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(MSVC)
    add_compile_options(/bigobj)
endif()

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 6.5 REQUIRED COMPONENTS Quick QuickControls2)

qt_policy(SET QTP0001 NEW)
qt_policy(SET QTP0004 NEW)

# -------------------------------------------------------------
# QML Hot Reload Option (Dev Only)
# -------------------------------------------------------------
# CHASET_QML_HOT_RELOAD=ON injects QT_QML_DEBUG into the demo and component
# library, disables ahead-of-time bytecode compilation (QT_QML_NO_CACHEGEN=ON),
# and wires all QRC resource mappings so the official qmlpreview live-reload
# tooling can attach and hot-swap QML in place (see `just qt --hot`).
# Dev-only: never enable for release/CI builds.
option(CHASET_QML_HOT_RELOAD "Enable QML debugging infrastructure for qmlpreview live reload (dev only)" OFF)

if(CHASET_QML_HOT_RELOAD)
    set(QT_QML_NO_CACHEGEN ON)
    message(STATUS "ChaSet: QML hot reload enabled (QT_QML_DEBUG + NO_CACHEGEN)")
endif()

# -------------------------------------------------------------
# Singletons & Resources for the Reusable Component Library
# -------------------------------------------------------------
set_source_files_properties(src/ThemeTokens.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME ThemeTokens
)

set_source_files_properties(src/ShowcaseData.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME ShowcaseData
    QT_QML_SKIP_CACHEGEN TRUE
)

# Icon specification contract and compiled artwork (emitted from
# spec/icons/registry.json by just gen-icons). QT_QML_SINGLETON_TYPE is what makes
# ChaSetIcons.resolveIcon() / shapesFor() callable from other components; the pragma
# inside the generated file is not enough on its own — without this property the type is
# registered as an ordinary component and those methods are not reachable at all.
set_source_files_properties(src/ChaSetIcons.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME ChaSetIcons
    QT_QML_SKIP_CACHEGEN TRUE
)

# Shared syntax lexer + its palette (emitted from spec/highlight/* and
# spec/tokens/semantic/core.json by just gen-highlight / just gen-qt).
set_source_files_properties(src/Highlighter.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME Highlighter
)

set_source_files_properties(src/CodeTokens.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME CodeTokens
)

# Cross-platform typography contract (emitted from
# spec/tokens/primitives.json -> primitives.typography by just gen-qt).
# Separate from ThemeTokens.generated.qml because that struct mirrors
# dt-a's ThemeManager::Tokens and is frozen downstream.
set_source_files_properties(src/Typography.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME Typography
)

set_source_files_properties(src/SelectionHub.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME SelectionHub
)

# Doc-typography role table (emitted from spec/doc-roles.json by just gen-roles).
# Pure data: DocText.qml is the only consumer. Roles live here — not as one QML
# file per heading level — so the scale stays in one place on both stacks.
set_source_files_properties(src/DocRoles.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME DocRoles
)

# Process-wide overlay registry: the single source of truth for "which floating layers
# are open right now". Hosts read `count` to suppress product-level key bindings, and
# every ChaSet overlay registers itself so Escape always dismisses exactly the topmost
# layer — never leaking through to a host action. Registration is explicit because
# overlays that do not take focus are invisible to focus-chain sniffing.
set_source_files_properties(src/ChaSetOverlayHub.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME ChaSetOverlayHub
)

set_source_files_properties(src/ChaSetI18nData.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME ChaSetI18nData
    QT_QML_SKIP_CACHEGEN TRUE
)

set_source_files_properties(src/ChaSetI18n.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME ChaSetI18n
)

# -------------------------------------------------------------
# 1. Main Reusable Component Library (Target: ChaSet / ChaSet::ChaSet)
# -------------------------------------------------------------
add_library(ChaSet STATIC)
add_library(ChaSet::ChaSet ALIAS ChaSet)

qt_add_qml_module(ChaSet
    URI ChaSet
    VERSION 1.0
    OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/ChaSet"
    SOURCES
        src/ChaSetClipboard.h
        src/ChaSetClipboard.cpp
        src/ChaSetDocSource.h
        src/ChaSetDocSource.cpp
        src/ChaSetTextFragments.h
        src/ChaSetTextFragments.cpp
        src/ChaSetFontSystem.h
        src/ChaSetFontSystem.cpp
        src/ChaSetPathUtil.h
        src/ChaSetPathHistoryStore.h
        src/ChaSetPathHistoryStore.cpp
        src/ChaSetAddressBarController.h
        src/ChaSetAddressBarController.cpp
        src/ChaSetSystemTheme.h
        src/ChaSetSystemTheme.cpp
        src/ChaSetSquircle.h
        src/ChaSetSquircle.cpp
    RESOURCES
        resources/fonts/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].ttf
    QML_FILES
        src/ChaSetScrollBar.qml
        src/ChaSetScrollArea.qml
        src/ChaSetAdaptivePopup.qml
        src/ChaSetButton.qml
        src/ChaSetCircularProgress.qml
        src/ChaSetTabs.qml
        src/ChaSetTabsList.qml
        src/ChaSetTabsTrigger.qml
        src/ChaSetTabsContent.qml
        src/ChaSetBadge.qml
        src/ChaSetLabel.qml
        src/ChaSetCollapsible.qml
        src/ChaSetCard.qml
        src/ChaSetCardHeader.qml
        src/ChaSetCardTitle.qml
        src/ChaSetCardDescription.qml
        src/ChaSetCardContent.qml
        src/ChaSetCardFooter.qml
        src/ChaSetInput.qml
        src/ChaSetHistoryInput.qml
        src/ChaSetCheckbox.qml
        src/ChaSetSwitch.qml
        src/ChaSetSeparator.qml
        src/ChaSetSlider.qml
        src/ChaSetMediaProgressBar.qml
        src/ChaSetDialog.qml
        src/ChaSetTooltip.qml
        src/ChaSetTooltipBubble.qml
        src/ChaSetTable.qml
        src/ChaSetColorPicker.qml
        src/ChaSetDropdownMenu.qml
        src/ChaSetSelect.qml
        src/ChaSetPopover.qml
        src/ChaSetHoverPopover.qml
        src/ChaSetContextMenu.qml
        src/ChaSetAlertDialog.qml
        src/ChaSetSheet.qml
        src/ChaSetSkeleton.qml
        src/ChaSetCopyButton.qml
        src/ChaSetCopyableBadge.qml
        src/ChaSetHoverCopy.qml
        src/ChaSetPanelCard.qml
        src/ChaSetSplitButton.qml
        src/ChaSetInlineEditableText.qml
        src/ChaSetRangeSlider.qml
        src/ChaSetSnapSlider.qml
        src/ChaSetScaleOsd.qml
        src/ChaSetTaskHud.qml
        src/ChaSetActivityCard.qml
        src/ChaSetActivityStack.qml
        src/ChaSetNotificationStack.qml
        src/ChaSetFloatingNotice.qml
        src/ChaSetReadOnlyInput.qml
        src/ChaSetPresetNumberInput.qml
        src/ChaSetKeybindingRecorder.qml
        src/ChaSetKeybindingManager.qml
        src/ChaSetKeybindingConflictPopup.qml
        src/ChaSetVirtualList.qml
        src/ChaSetReorderableList.qml
        src/ChaSetVirtualTree.qml
        src/ChaSetVirtualGrid.qml
        src/ChaSetDraggableModal.qml
        src/ChaSetSplitter.qml
        src/ChaSetResizable.qml
        src/ChaSetWindowTitleBar.qml
        src/ChaSetGenericDataTable.qml
        src/ChaSetQueryBuilder.qml
        src/ChaSetViewportConstrainedContainer.qml
        src/ChaSetSidebar.qml
        src/ChaSetSegmentedControl.qml
        src/ChaSetSmoothWheelHandler.qml
        src/ChaSetSettingRow.qml
        src/ChaSetElidedText.qml
        src/ChaSetSquircle.qml
        src/ChaSetSplitterHandle.qml
        src/ChaSetDurationInput.qml
        src/ChaSetHighlightedCode.qml
        src/ChaSetCodeBlock.qml
        src/ChaSetStepTimeline.qml
        src/ChaSetLogConsole.qml
        src/ChaSetStatusIcon.qml
        src/ChaSetIcon.qml
        src/ChaSetPipelineView.qml
        src/ChaSetBreadcrumb.qml
        src/ChaSetAddressBarSuggestPopup.qml
        src/ChaSetAddressBarOverflowPopup.qml
        src/ChaSetAddressBar.qml
        src/ChaSetThemeSettings.qml
        src/ChaSetLanguageSettings.qml
        src/ChaSetTableOfContents.qml
        src/ChaSetKbd.qml
        src/ChaSetShortcut.qml
        src/ChaSetShortcutBar.qml
        src/ThemeTokens.generated.qml
        src/ChaSetIcons.generated.qml

        src/ShowcaseData.generated.qml
        src/ChaSetI18nData.generated.qml
        src/ChaSetI18n.qml

        src/Highlighter.generated.qml

        src/CodeTokens.generated.qml
        src/Typography.generated.qml
        src/DocRoles.generated.qml

        src/SelectionHub.qml
        src/ChaSetOverlayHub.qml
        src/ChaSetOverlayEscapeFilter.qml
    NO_GENERATE_EXTRA_QMLDIRS
)

target_link_libraries(ChaSet PUBLIC
    Qt6::Quick
    Qt6::QuickControls2
)

target_link_libraries(ChaSet INTERFACE ChaSetplugin)

target_include_directories(ChaSet PUBLIC
    "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>"
    "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/src>"
    "$<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}>"
)

if(CHASET_QML_HOT_RELOAD)
    target_compile_definitions(ChaSet PRIVATE QT_QML_DEBUG)
endif()

# -------------------------------------------------------------
# 2. Standalone Demo & Test Harness (only built if top-level)
# -------------------------------------------------------------
if(CMAKE_CURRENT_SOURCE_DIR STREQUAL CMAKE_SOURCE_DIR OR CHASET_BUILD_DEMO)
    find_package(Qt6 6.5 REQUIRED COMPONENTS Test)

    qt_add_executable(QtChaSetDemo
        src/main.cpp
    )

    qt_add_qml_module(QtChaSetDemo
        URI chaSetDemo
        VERSION 1.0
        OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/chaSetDemo"
        QML_FILES
            src/Main.qml
            src/DocLayout.qml
            src/DocText.qml
            src/DocSectionHeader.qml
            src/DocChipLayer.qml
            src/DocChipOverlay.qml
            src/DocMarkdown.qml
            src/DocAnatomy.qml
            src/ComponentPreview.qml
            src/IntroductionPage.qml
            src/TokensPage.qml
            src/ThemeTunerPage.qml
            src/TypographyPage.qml
            src/IconsPage.qml
            src/ButtonDocPage.qml
            src/ScrollAreaDocPage.qml
            src/TabsDocPage.qml
            src/BadgeDocPage.qml
            src/LabelDocPage.qml
            src/CollapsibleDocPage.qml
            src/CardDocPage.qml
            src/InputDocPage.qml
            src/CheckboxDocPage.qml
            src/SwitchDocPage.qml
            src/SeparatorDocPage.qml
            src/SliderDocPage.qml
            src/DialogDocPage.qml
            src/TooltipDocPage.qml
            src/TableDocPage.qml
            src/ColorPickerDocPage.qml
            src/DropdownMenuDocPage.qml
            src/SelectDocPage.qml
            src/PopoverDocPage.qml
            src/ContextMenuDocPage.qml
            src/SheetDocPage.qml
            src/SkeletonDocPage.qml
            src/CopyButtonDocPage.qml
            src/HoverCopyDocPage.qml
            src/PanelCardDocPage.qml
            src/SplitButtonDocPage.qml
            src/InlineEditableTextDocPage.qml
            src/RangeSliderDocPage.qml
            src/SnapSliderDocPage.qml
            src/ScaleOsdDocPage.qml
            src/TaskHudDocPage.qml
            src/NotificationStackDocPage.qml
            src/FloatingNoticeDocPage.qml
            src/ReadOnlyInputDocPage.qml
            src/PresetNumberInputDocPage.qml
            src/KeybindingRecorderDocPage.qml
            src/KeybindingManagerDocPage.qml
            src/VirtualListDocPage.qml
            src/VirtualTreeDocPage.qml
            src/VirtualGridDocPage.qml
            src/DraggableModalDocPage.qml
            src/SplitterDocPage.qml
            src/ResizableDocPage.qml
            src/WindowTitleBarDocPage.qml
            src/GenericDataTableDocPage.qml
            src/QueryBuilderDocPage.qml
            src/ViewportConstrainedContainerDocPage.qml
            src/SidebarDocPage.qml
            src/SegmentedControlDocPage.qml
            src/SmoothWheelHandlerDocPage.qml
            src/SettingRowDocPage.qml
            src/ElidedTextDocPage.qml
            src/SplitterHandleDocPage.qml
            src/DurationInputDocPage.qml
            src/CodeBlockDocPage.qml
            src/PipelineViewDocPage.qml
            src/AddressBarDocPage.qml
            src/ThemeSettingsDocPage.qml
            src/LanguageSettingsDocPage.qml
            src/TableOfContentsDocPage.qml
            src/KbdDocPage.qml
            src/SquircleDocPage.qml
            src/MediaProgressBarDocPage.qml
            src/CommandSearchModal.qml

            src/ExportModal.qml
        NO_RESOURCE_TARGET_PATH
        NO_GENERATE_EXTRA_QMLDIRS
    )

    target_link_libraries(QtChaSetDemo PRIVATE
        ChaSet
        Qt6::Test
    )

    # Living-doc prose is parsed AT RUNTIME (see docs/architecture/markdown-doc-content.md):
    #   - spec/content/**.md is embedded as-is, so editing prose needs no code generation,
    #   - spec/shared/docAst.mjs is the single parser shared verbatim with the React bundle,
    #     placed inside the module directory so `import "vendor/docAst.mjs"` resolves.
    file(GLOB_RECURSE CHASET_DOC_MD CONFIGURE_DEPENDS
        "${CMAKE_CURRENT_SOURCE_DIR}/../spec/content/*.md"
    )
    qt_add_resources(QtChaSetDemo "chaset_doc_content"
        PREFIX "/"
        BASE "${CMAKE_CURRENT_SOURCE_DIR}/.."
        FILES ${CHASET_DOC_MD}
    )
    qt_add_resources(QtChaSetDemo "chaset_doc_parser"
        PREFIX "/src/vendor"
        BASE "${CMAKE_CURRENT_SOURCE_DIR}/../spec/shared"
        FILES "${CMAKE_CURRENT_SOURCE_DIR}/../spec/shared/docAst.mjs"
    )

    if(CHASET_QML_HOT_RELOAD)
        target_compile_definitions(QtChaSetDemo PRIVATE QT_QML_DEBUG)
        get_target_property(_chaset_qrcs ChaSet _qt_generated_qrc_files)
        if(_chaset_qrcs)
            set_property(TARGET QtChaSetDemo APPEND PROPERTY _qt_generated_qrc_files ${_chaset_qrcs})
        endif()
        message(STATUS "ChaSet: QML hot reload enabled (QT_QML_DEBUG on ChaSet and QtChaSetDemo)")
    endif()
endif()