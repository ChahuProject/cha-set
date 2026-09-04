cmake_minimum_required(VERSION 3.21)

project(ChaSet VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 6.5 REQUIRED COMPONENTS Quick QuickControls2)

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
        src/ChaSetScrollView.qml
        src/ChaSetButton.qml
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