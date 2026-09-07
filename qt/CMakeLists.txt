cmake_minimum_required(VERSION 3.21)

project(ChaSet VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 6.5 REQUIRED COMPONENTS Quick QuickControls2)

qt_policy(SET QTP0001 NEW)
qt_policy(SET QTP0004 NEW)

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
    QML_FILES
        src/ChaSetScrollBar.qml
        src/ChaSetScrollArea.qml
        src/ChaSetButton.qml
        src/ChaSetTabs.qml
        src/ChaSetTabsList.qml
        src/ChaSetTabsTrigger.qml
        src/ChaSetTabsContent.qml
        src/ChaSetBadge.qml
        src/ChaSetLabel.qml
        src/ChaSetCard.qml
        src/ChaSetCardHeader.qml
        src/ChaSetCardTitle.qml
        src/ChaSetCardDescription.qml
        src/ChaSetCardContent.qml
        src/ChaSetCardFooter.qml
        src/ChaSetInput.qml
        src/ChaSetCheckbox.qml
        src/ChaSetSwitch.qml
        src/ChaSetSeparator.qml
        src/ChaSetSlider.qml
        src/ChaSetDialog.qml
        src/ChaSetTooltip.qml
        src/ChaSetTable.qml
        src/ChaSetColorPicker.qml
        src/ChaSetDropdownMenu.qml
        src/ChaSetSelect.qml
        src/ChaSetPopover.qml
        src/ChaSetContextMenu.qml
        src/ChaSetAlertDialog.qml
        src/ChaSetSheet.qml
        src/ChaSetSkeleton.qml
        src/ChaSetCopyButton.qml
        src/ChaSetPanelCard.qml
        src/ChaSetSplitButton.qml
        src/ChaSetInlineEditableText.qml
        src/ChaSetRangeSlider.qml
        src/ChaSetReadOnlyInput.qml
        src/ChaSetKeybindingRecorder.qml
        src/ChaSetVirtualList.qml
        src/ChaSetVirtualTree.qml
        src/ChaSetVirtualGrid.qml
        src/ChaSetDraggableModal.qml
        src/ChaSetSplitter.qml
        src/ChaSetWindowTitleBar.qml
        src/ChaSetGenericDataTable.qml
        src/ChaSetQueryBuilder.qml
        src/ThemeTokens.generated.qml
        src/ShowcaseData.generated.qml
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
            src/CodeBlock.qml
            src/PropsTable.qml
            src/ComponentPreview.qml
            src/IntroductionPage.qml
            src/TokensPage.qml
            src/ThemeTunerPage.qml
            src/ButtonDocPage.qml
            src/ScrollAreaDocPage.qml
            src/TabsDocPage.qml
            src/BadgeDocPage.qml
            src/LabelDocPage.qml
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
            src/AlertDialogDocPage.qml
            src/SheetDocPage.qml
            src/SkeletonDocPage.qml
            src/CopyButtonDocPage.qml
            src/PanelCardDocPage.qml
            src/SplitButtonDocPage.qml
            src/InlineEditableTextDocPage.qml
            src/RangeSliderDocPage.qml
            src/ReadOnlyInputDocPage.qml
            src/KeybindingRecorderDocPage.qml
            src/VirtualListDocPage.qml
            src/VirtualTreeDocPage.qml
            src/VirtualGridDocPage.qml
            src/DraggableModalDocPage.qml
            src/SplitterDocPage.qml
            src/WindowTitleBarDocPage.qml
            src/GenericDataTableDocPage.qml
            src/QueryBuilderDocPage.qml
            src/CommandSearchModal.qml
            src/ExportModal.qml
        NO_RESOURCE_TARGET_PATH
        NO_GENERATE_EXTRA_QMLDIRS
    )

    target_link_libraries(QtChaSetDemo PRIVATE
        ChaSet
        Qt6::Test
    )
endif()