// ChaSetTabsContent.qml — Tab Panel Container
// Matching shadcn: mt-2 ring-offset-background focus-visible:outline-none
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string value: ""
    property Item tabs: null

    function findTabs() {
        if (tabs) return tabs;
        var p = root.parent;
        while (p) {
            if (p.currentValue !== undefined) return p;
            p = p.parent;
        }
        return null;
    }

    readonly property Item parentTabs: findTabs()
    readonly property bool isSelected: parentTabs && parentTabs.currentValue === root.value

    visible: isSelected
    implicitWidth: visible ? childrenRect.width : 0
    implicitHeight: visible ? childrenRect.height : 0
}
