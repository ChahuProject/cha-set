import QtQuick
import ChaSet

ChaSetSquircleBase {
    id: root
    cornerSmoothing: ThemeTokens.cornerSmoothing !== undefined ? ThemeTokens.cornerSmoothing : 0.6
}
