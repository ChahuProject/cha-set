# Qt 6 QML Module Packaging & Integration Specification

> **Authority Level**: [Authoritative Specification]  
> **Scope**: Qt 6 static QML module architecture, target exports, and standard CMake integration patterns for host applications.

---

## 1. Role & System Boundaries

- **Core Role**: Standardizes the packaging, export, and consumption of ChaSet's native Qt Quick / QML component library. Provides host applications with a zero-friction, modular integration workflow adhering to modern Qt 6 best practices.
- **Scope Delineation**:
  - **In-Scope**:
    - Declarative QML module registration via qt_add_qml_module.
    - Static library target generation (ChaSet and ChaSet::ChaSet).
    - Automatic static plugin linkage (	arget_link_libraries(ChaSet INTERFACE ChaSetplugin)).
    - Public C++ header export for typed token consumption (qt/include/ChaSet/theme_tokens.generated.h).
    - Standalone showcase separation (QtChaSetDemo only built when top-level).
    - Modern CMake consumer integration patterns (local checkout override with remote FetchContent fallback).
  - **Out-of-Scope**:
    - Host application window lifecycle and custom render loop management.

---

## 2. Module Architecture & Export Standards

`mermaid
flowchart TD
    subgraph ChaSetModule ["ChaSet Qt 6 Module (qt/CMakeLists.txt)"]
        ModuleTarget["add_library(ChaSet STATIC)\nadd_library(ChaSet::ChaSet ALIAS ChaSet)"]
        QmlModule["qt_add_qml_module(ChaSet\n  URI ChaSet VERSION 1.0\n  QML_FILES ChaSetScrollBar.qml ThemeTokens.generated.qml ...\n)"]
        PluginLink["target_link_libraries(ChaSet INTERFACE ChaSetplugin)\n(Auto static plugin registration)"]
        PublicHeaders["target_include_directories(ChaSet PUBLIC\n  $<BUILD_INTERFACE:include>\n)"]
        
        ModuleTarget --> QmlModule
        QmlModule --> PluginLink
        ModuleTarget --> PublicHeaders
    end

    subgraph HostApp ["Host Application (CMake Integration)"]
        DepChoice{"Local Checkout Exists?"}
        AddSub["add_subdirectory(../cha-set/qt)"]
        Fetch["FetchContent_Declare(ChaSet)"]
        LinkTarget["target_link_libraries(HostTarget PUBLIC ChaSet)"]
        QmlImport["QML: import ChaSet"]
        CppInclude["C++: #include <ChaSet/theme_tokens.generated.h>"]

        DepChoice -- Yes (0-copy dev) --> AddSub
        DepChoice -- No (Remote git) --> Fetch
        AddSub --> LinkTarget
        Fetch --> LinkTarget
        LinkTarget --> QmlImport
        LinkTarget --> CppInclude
    end
`

### 2.1 Standard QML Module Definition
- **Module URI**: ChaSet 1.0.
- **Target Name**: ChaSet (with alias ChaSet::ChaSet).
- **Static Plugin Interface Propagation**:
  `cmake
  # Ensures host applications automatically link and register the static plugin
  # without requiring manual Q_IMPORT_QML_PLUGIN in host C++ sources.
  target_link_libraries(ChaSet INTERFACE ChaSetplugin)
  `
- **Public Header Export**:
  `cmake
  target_include_directories(ChaSet PUBLIC
      "$<BUILD_INTERFACE:/include>"
      "$<BUILD_INTERFACE:/src>"
      "$<BUILD_INTERFACE:>"
  )
  `

### 2.2 Top-Level Demo Separation
To prevent target pollution and compilation overhead when consumed as a subproject:
`cmake
if(CMAKE_CURRENT_SOURCE_DIR STREQUAL CMAKE_SOURCE_DIR OR CHASET_BUILD_DEMO)
    qt_add_executable(QtChaSetDemo src/main.cpp)
    ...
endif()
`

---

## 3. Host Application Integration Idioms

Host applications integrating ChaSet should adopt the following canonical CMake integration idiom:

`cmake
# cmake/chaset.cmake
# ====================================================
# ChaSet Cross-Stack UI Module (Single Source of Truth)
# Supports local checkout override (0-copy live sync) and remote Git fallback
if(EXISTS "/../cha-set/qt/CMakeLists.txt")
    message(STATUS "[ChaSet] Using local checkout: /../cha-set/qt")
    add_subdirectory("/../cha-set/qt" "/_deps/chaset-build")
else()
    include(FetchContent)
    FetchContent_Declare(
        ChaSet
        GIT_REPOSITORY https://github.com/ChahuProject/cha-set.git
        GIT_TAG        main
        SOURCE_SUBDIR  qt
    )
    FetchContent_MakeAvailable(ChaSet)
endif()
`

### 3.1 QML Consumption
```qml
import QtQuick
import QtQuick.Controls
import ChaSet

ChaSetScrollArea {
    id: scrollArea
}

ChaSetScrollBar {
    id: scrollBar
}
```

**Versionless imports are mandatory.** Every import above is written without a version specifier and none of them may ever regain one. Qt 6 resolves `import QtQuick` to the newest version the running toolchain offers, so the same sources keep compiling across Qt upgrades (6.10 → 6.12 → …) instead of breaking on each one; pinning `6.x` in 340+ files turned a toolchain bump into a repo-wide edit. The same rule covers `import ChaSet` — the module version lives once, in `qt_add_qml_module(... VERSION 1.0)`.

Enforcement is mechanical, not a review convention:
- `just fix-qml-imports` (`scripts/strip-qml-import-versions.mjs`) rewrites versioned imports in `.qml` sources, generator templates, doc snippets and markdown examples in one pass.
- `just check-qml-imports` is the read-only form, and `just gate` runs it as step 5.7 — a version that creeps back in through a generator or a copy-pasted doc fails the gate.
- Tooling locates Qt through `scripts/lib/qt-install.mjs` (`QTDIR` / `CMAKE_PREFIX_PATH` first, then `<root>/current`, then the newest `<root>/<version>`), so build, pixel-sync and visual-diff scripts never hardcode a Qt version either.

### 3.2 C++ Typed Token Consumption
`cpp
#include <ChaSet/theme_tokens.generated.h>

// Directly initialize native theme manager tokens:
const auto darkTheme = cha_set_gen::kDark;
const auto lightTheme = cha_set_gen::kLight;
`

---

## 4. Invariants & Forbidden Anti-Patterns

1. **NO Manual File Copying**: Host projects must never copy QML components or generated headers manually into their source tree. All integration must flow through the CMake target ChaSet.
2. **NO Manual Q_IMPORT_QML_PLUGIN**: ChaSet must always link ChaSetplugin via INTERFACE, eliminating manual plugin boilerplate in consumer code.
3. **NO Global Namespace Pollution**: All QML components exported by the module must reside under URI ChaSet 1.0.
