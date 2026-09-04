// theme_tokens.generated.h
// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens.json (schemaVersion 1)
//         via spec/generators/generate-qt.mjs
// Refresh: run `pnpm gen:qt` in the cha-set checkout, copy this file into
//          <dt-a>/theme/generated/, commit alongside the consuming change.
// Field names/order mirror ThemeManager::Tokens (theme_manager.h).
// accentHover/accentPressed are runtime-derived (theme_manager.cpp) - never
// add them here.
#pragma once

#include <QColor>
#include <QString>

namespace cha_set_gen {

struct ThemeTokens {
  QColor chrome;
  QColor background;
  QColor panel;
  QColor panelRaised;
  QColor border;
  QColor accent;
  QColor nestAccent;
  QColor pendingAccent;
  QColor blocked;
  QColor text;
  QColor subduedText;
  QColor conflict;
  QColor onAccent;
  QColor selection;
  QColor hover;
  QColor pressed;
  QColor disabled;
  QColor disabledText;
  QColor focus;
  QColor overlayScrim;
  QColor danger;
  QColor dangerHover;
  QColor infoBar;
  QColor canvasMarquee;
  QColor canvasMarqueeBorder;
  QColor canvasLoadingBackdrop;
  QColor canvasLoadingBorder;
  QColor canvasLoadingText;
  QColor canvasGrid;
  QColor canvasGridMajor;
  QColor chromeIcon;
  QColor chromeHover;
  QColor chromeDown;
  int space0;
  int space1;
  int space2;
  int space3;
  int space4;
  int space5;
  int space6;
  int motionQuick;
  int motionShort;
  int motionMedium;
  int radiusSmall;
  int controlHeight;
  int gap;
  int pageInset;
  int dockInset;
  int dividerThickness;
  int minimumPaneExtent;
  int panelRadius;
  int rowRadius;
  int radiusLarge;
  int radiusXl;
  int separatorHeight;
  int separatorLine;
  int checkCol;
  int iconCol;
  int cascadeGap;
  int chevronW;
  int fontSizeTitle;
  int fontSizeHeading;
  int fontSizeBody;
  int fontSizeSmall;
};

inline const ThemeTokens kDark{
    QColor::fromRgbF(0.035, 0.055, 0.1, 0.9) /* #090E1AE6 */,
    QColor::fromRgbF(10.0 / 255.0, 12.0 / 255.0, 20.0 / 255.0, 255.0 / 255.0) /* #0a0c14ff */,
    QColor::fromRgbF(22.0 / 255.0, 27.0 / 255.0, 38.0 / 255.0, 255.0 / 255.0) /* #161b26ff */,
    QColor::fromRgbF(37.0 / 255.0, 45.0 / 255.0, 61.0 / 255.0, 255.0 / 255.0) /* #252d3dff */,
    QColor::fromRgbF(60.0 / 255.0, 72.0 / 255.0, 88.0 / 255.0, 255.0 / 255.0) /* #3c4858ff */,
    QColor::fromRgbF(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0) /* #30a0ffff */,
    QColor::fromRgbF(0.72, 0.42, 0.98, 0.95) /* #B86BAFF2 */,
    QColor::fromRgbF(255.0 / 255.0, 0.72, 0.22, 0.95) /* #FFB838F2 */,
    QColor::fromRgbF(0.55, 0.58, 0.62, 0.95) /* #8C949EF2 */,
    QColor::fromRgbF(230.0 / 255.0, 240.0 / 255.0, 250.0 / 255.0, 255.0 / 255.0) /* #e6f0faff */,
    QColor::fromRgbF(160.0 / 255.0, 178.0 / 255.0, 198.0 / 255.0, 255.0 / 255.0) /* #a0b2c6ff */,
    QColor::fromRgbF(240.0 / 255.0, 160.0 / 255.0, 58.0 / 255.0, 255.0 / 255.0) /* #f0a03aff */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0) /* #ffffffff */,
    QColor::fromRgbF(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 255.0 / 255.0) /* #1e293bff */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 0.09) /* #FFFFFF17 */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 0.14) /* #FFFFFF24 */,
    QColor::fromRgbF(0.5, 0.55, 0.62, 102.0 / 255.0) /* #808C9E66 */,
    QColor::fromRgbF(107.0 / 255.0, 120.0 / 255.0, 144.0 / 255.0, 255.0 / 255.0) /* #6b7890ff */,
    QColor::fromRgbF(48.0 / 255.0, 160.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0) /* #30a0ffff */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.5) /* #00000080 */,
    QColor::fromRgbF(255.0 / 255.0, 0.23, 0.19, 0.9) /* #FF3B30E6 */,
    QColor::fromRgbF(255.0 / 255.0, 0.23, 0.19, 0.5) /* #FF3B3080 */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 153.0 / 255.0) /* #99000000 */,
    QColor::fromRgbF(102.0 / 255.0, 170.0 / 255.0, 255.0 / 255.0, 51.0 / 255.0) /* #3366aaff */,
    QColor::fromRgbF(204.0 / 255.0, 238.0 / 255.0, 255.0 / 255.0, 153.0 / 255.0) /* #99cceeff */,
    QColor::fromRgbF(0.13, 0.16, 0.21, 0.85) /* #212936D9 */,
    QColor::fromRgbF(0.45, 0.52, 0.62, 153.0 / 255.0) /* #73859E99 */,
    QColor::fromRgbF(160.0 / 255.0, 178.0 / 255.0, 198.0 / 255.0, 255.0 / 255.0) /* #a0b2c6ff */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 26.0 / 255.0) /* #FFFFFF1A */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 41.0 / 255.0) /* #FFFFFF29 */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0) /* #FFFFFFFF */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 0.13) /* #FFFFFF21 */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 102.0 / 255.0) /* #FFFFFF66 */,
    0,
    2,
    4,
    8,
    12,
    16,
    24,
    90,
    120,
    180,
    2,
    28,
    8,
    24,
    12,
    6,
    160,
    6,
    4,
    10,
    14,
    9,
    1,
    18,
    18,
    2,
    14,
    28,
    16,
    13,
    12,
};

inline const ThemeTokens kLight{
    QColor::fromRgbF(0.94, 0.95, 0.97, 0.92) /* #F0F2F7EB */,
    QColor::fromRgbF(244.0 / 255.0, 246.0 / 255.0, 250.0 / 255.0, 255.0 / 255.0) /* #f4f6faff */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0) /* #ffffffff */,
    QColor::fromRgbF(232.0 / 255.0, 236.0 / 255.0, 243.0 / 255.0, 255.0 / 255.0) /* #e8ecf3ff */,
    QColor::fromRgbF(204.0 / 255.0, 212.0 / 255.0, 224.0 / 255.0, 255.0 / 255.0) /* #ccd4e0ff */,
    QColor::fromRgbF(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 255.0 / 255.0) /* #1d7ae0ff */,
    QColor::fromRgbF(0.62, 0.38, 0.94, 0.95) /* #9E61F0F2 */,
    QColor::fromRgbF(0.88, 153.0 / 255.0, 0.1, 0.95) /* #E0991AF2 */,
    QColor::fromRgbF(0.55, 0.58, 0.62, 0.95) /* #8C949EF2 */,
    QColor::fromRgbF(28.0 / 255.0, 36.0 / 255.0, 48.0 / 255.0, 255.0 / 255.0) /* #1c2430ff */,
    QColor::fromRgbF(92.0 / 255.0, 103.0 / 255.0, 121.0 / 255.0, 255.0 / 255.0) /* #5c6779ff */,
    QColor::fromRgbF(178.0 / 255.0, 106.0 / 255.0, 0.0 / 255.0, 255.0 / 255.0) /* #b26a00ff */,
    QColor::fromRgbF(255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0, 255.0 / 255.0) /* #ffffffff */,
    QColor::fromRgbF(219.0 / 255.0, 228.0 / 255.0, 245.0 / 255.0, 255.0 / 255.0) /* #dbe4f5ff */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.06) /* #0000000F */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.08) /* #00000014 */,
    QColor::fromRgbF(0.5, 0.55, 0.62, 102.0 / 255.0) /* #808C9E66 */,
    QColor::fromRgbF(154.0 / 255.0, 163.0 / 255.0, 179.0 / 255.0, 255.0 / 255.0) /* #9aa3b3ff */,
    QColor::fromRgbF(29.0 / 255.0, 122.0 / 255.0, 224.0 / 255.0, 255.0 / 255.0) /* #1d7ae0ff */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.35) /* #00000059 */,
    QColor::fromRgbF(0.82, 0.18, 0.15, 0.9) /* #D12E26E6 */,
    QColor::fromRgbF(0.82, 0.18, 0.15, 0.5) /* #D12E2680 */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 153.0 / 255.0) /* #99000000 */,
    QColor::fromRgbF(102.0 / 255.0, 170.0 / 255.0, 255.0 / 255.0, 51.0 / 255.0) /* #3366aaff */,
    QColor::fromRgbF(204.0 / 255.0, 238.0 / 255.0, 255.0 / 255.0, 153.0 / 255.0) /* #99cceeff */,
    QColor::fromRgbF(0.86, 0.89, 0.93, 0.85) /* #DBE3EDD9 */,
    QColor::fromRgbF(0.55, 0.62, 0.72, 153.0 / 255.0) /* #8C9EB899 */,
    QColor::fromRgbF(92.0 / 255.0, 103.0 / 255.0, 121.0 / 255.0, 255.0 / 255.0) /* #5c6779ff */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 26.0 / 255.0) /* #0000001A */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 41.0 / 255.0) /* #00000029 */,
    QColor::fromRgbF(0.11, 0.14, 0.19, 0.92) /* #1C2430EB */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.1) /* #0000001A */,
    QColor::fromRgbF(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0, 0.22) /* #00000038 */,
    0,
    2,
    4,
    8,
    12,
    16,
    24,
    90,
    120,
    180,
    2,
    28,
    8,
    24,
    12,
    6,
    160,
    6,
    4,
    10,
    14,
    9,
    1,
    18,
    18,
    2,
    14,
    28,
    16,
    13,
    12,
};

} // namespace cha_set_gen
