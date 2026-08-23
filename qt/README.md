# ChaSet Qt (QML) implementation

Qt 6 (QtQuick / QML) implementation of ChaSet. It is generated from and
checked against the same single source of truth as the React implementation:

- Design tokens come from `spec/tokens.json` (React consumes the generated
  CSS; Qt consumes the same values directly here).
- Component API contracts live in `spec/components/button.ts`.
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

Requires a Qt 6 install with QtQuick and a compiler that CMake can find
(MSVC via a Visual Studio developer prompt, or Ninja + cl).