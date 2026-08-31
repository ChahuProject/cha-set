cmake_minimum_required(VERSION 3.21)

project(QtChaSetDemo VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 6.5 REQUIRED COMPONENTS Quick QuickControls2 Test)

qt_policy(SET QTP0004 NEW)

qt_add_executable(QtChaSetDemo
    src/main.cpp
)

set_source_files_properties(src/ThemeTokens.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME ThemeTokens
)

set_source_files_properties(src/ShowcaseData.generated.qml PROPERTIES
    QT_QML_SINGLETON_TYPE TRUE
    QT_QML_SOURCE_TYPENAME ShowcaseData
)

qt_add_qml_module(QtChaSetDemo
    URI chaSet
    VERSION 0.1
    QML_FILES
        src/Main.qml
        src/ChaSetButton.qml
        src/ChaSetScrollBar.qml
        src/ChaSetScrollView.qml
        src/DocLayout.qml
        src/ComponentPreview.qml
        src/ThemeTokens.generated.qml
        src/ShowcaseData.generated.qml
        src/IntroductionPage.qml
        src/TokensPage.qml
        src/ThemeTunerPage.qml
        src/ButtonDocPage.qml
        src/ScrollAreaDocPage.qml
        src/CommandSearchModal.qml
        src/ExportModal.qml
    NO_RESOURCE_TARGET_PATH
)



target_link_libraries(QtChaSetDemo PRIVATE
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Test
)