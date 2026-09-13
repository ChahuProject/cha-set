pragma Singleton
import QtQuick

// SelectionHub.qml — Global selection mutual exclusion manager for ChaSet
// Ensures only one text item retains an active selection across the window at any time.
QtObject {
    id: hub

    property var activeOwner: null

    function claim(item) {
        if (!item) return;
        if (activeOwner && activeOwner !== item) {
            try {
                if (typeof activeOwner.deselect === "function") {
                    activeOwner.deselect();
                }
            } catch (e) {
                // ignore
            }
        }
        activeOwner = item;
    }

    function clear(item) {
        if (activeOwner === item) {
            activeOwner = null;
        }
    }

    function clearAll() {
        if (activeOwner) {
            try {
                if (typeof activeOwner.deselect === "function") {
                    activeOwner.deselect();
                }
            } catch (e) {
                // ignore
            }
            activeOwner = null;
        }
    }
}
