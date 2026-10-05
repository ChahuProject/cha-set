import QtQuick 2.15
import ChaSet 1.0

ChaSetSquircleBase {
    id: root
    cornerSmoothing: ThemeTokens.cornerSmoothing !== undefined ? ThemeTokens.cornerSmoothing : 0.6
}
