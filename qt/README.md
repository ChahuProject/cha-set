# ChaSet Qt (QML) implementation

Qt 6 (QtQuick / QML) implementation of ChaSet. It is generated from and
checked against the same single source of truth as the React implementation:

- Design tokens come from `spec/tokens.json` — `ThemeTokens.generated.qml`
  is a GENERATED singleton (dark/light live switching) refreshed by
  `pnpm gen:qt`; do not edit by hand.
- `src/ChaSetButton.qml` implements the Button contract;
  `src/Main.qml` is the component showcase gallery and theme studio (interactive
  light/dark switching, accent theme presets, radius tuners, full button matrix,
  and copyable QML/C++ configuration export).
- `spec/capabilities.json` lists every "must" capability; this package
  reports coverage through `conformance/coverage.json`, enforced by
  `gate/parity.mjs`.

## Build & run (Windows / Qt 6 MSVC)

```bat
set PATH=C:\pengj\qt\6.10.1\msvc2022_64\bin;%PATH%
cmake -S qt -B qt/build -G Ninja -DCMAKE_PREFIX_PATH=C:\pengj\qt\6.10.1\msvc2022_64
cmake --build qt/build
qt\build\QtChaSetDemo.exe
```

Screenshot mode (for CI/evidence):

```bat
set QT_QPA_PLATFORM=offscreen
set QT_QUICK_BACKEND=software
qt\build\QtChaSetDemo.exe --shot shot-dark.png
qt\build\QtChaSetDemo.exe --shot shot-light.png --light
```

Requires a Qt 6 install with QtQuick and a compiler that CMake can find
(MSVC via a Visual Studio developer prompt, or Ninja + cl).