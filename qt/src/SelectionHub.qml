pragma Singleton
import QtQuick
import ChaSet

// SelectionHub.qml — Global selection mutual exclusion manager for ChaSet
// Ensures only one text item retains an active selection across the window at any time,
// and coordinates cross-stack copy shortcuts (Ctrl+C / ⌘C) and contextual menus.
QtObject {
    id: hub

    property var activeOwner: null
    property var activeCodeHost: null
    property var contextMenu: null

    readonly property bool hasSelection: activeOwner !== null && typeof activeOwner.selectedText === "string" && activeOwner.selectedText.length > 0

    signal textCopied(string text)

    function registerContextMenu(menu) {
        contextMenu = menu;
    }

    function claim(item, codeHost) {
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
        activeCodeHost = (typeof codeHost !== "undefined") ? codeHost : null;
    }

    function clear(item) {
        if (activeOwner === item) {
            activeOwner = null;
            activeCodeHost = null;
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
            activeCodeHost = null;
        }
    }

    function copyActiveSelection() {
        var textToCopy = "";
        if (activeOwner && typeof activeOwner.selectedText === "string" && activeOwner.selectedText.length > 0) {
            textToCopy = activeOwner.selectedText;
        }
        if (textToCopy && textToCopy.length > 0) {
            textToCopy = textToCopy.replace(/\u2029/g, "\n");
            if (typeof ChaSetClipboard !== "undefined" && ChaSetClipboard.setText) {
                ChaSetClipboard.setText(textToCopy);
                hub.textCopied(textToCopy);
                return true;
            }
        }
        return false;
    }

    function showContextMenu(sceneX, sceneY, targetItem, codeHost) {
        var effectiveItem = targetItem || activeOwner;
        var effectiveHost = codeHost || activeCodeHost;

        if (targetItem && targetItem !== activeOwner) {
            if (typeof targetItem.selectedText === "string" && targetItem.selectedText.length > 0) {
                claim(targetItem, effectiveHost);
                effectiveItem = targetItem;
            }
        }

        var hasSel = (effectiveItem && typeof effectiveItem.selectedText === "string" && effectiveItem.selectedText.length > 0);
        var fullCode = "";
        if (effectiveHost && typeof effectiveHost.code === "string") {
            fullCode = effectiveHost.code;
        } else if (effectiveItem && typeof effectiveItem.code === "string") {
            fullCode = effectiveItem.code;
        }

        var menuItems = [];

        if (hasSel) {
            menuItems.push({
                id: "copy",
                label: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("common.copy", "Copy") : "Copy",
                icon: "copy",
                shortcut: "Ctrl+C",
                disabled: false,
                onSelect: function() {
                    copyActiveSelection();
                }
            });
        }

        if (fullCode && fullCode.length > 0) {
            menuItems.push({
                id: "copy-all-code",
                label: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("common.copyAllCode", "Copy Entire Code") : "Copy Entire Code",
                icon: "copy",
                shortcut: "",
                disabled: false,
                onSelect: function() {
                    if (typeof ChaSetClipboard !== "undefined" && ChaSetClipboard.setText) {
                        ChaSetClipboard.setText(fullCode);
                        hub.textCopied(fullCode);
                    }
                }
            });
        }

        if (effectiveItem && typeof effectiveItem.selectAll === "function") {
            menuItems.push({
                id: "select-all",
                label: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("common.selectAll", "Select All") : "Select All",
                icon: "",
                shortcut: "Ctrl+A",
                disabled: false,
                onSelect: function() {
                    if (typeof effectiveItem.forceActiveFocus === "function") {
                        effectiveItem.forceActiveFocus();
                    }
                    effectiveItem.selectAll();
                    claim(effectiveItem, effectiveHost);
                }
            });
        }

        if (menuItems.length > 0 && contextMenu && typeof contextMenu.openAt === "function") {
            contextMenu.items = menuItems;
            contextMenu.openAt(sceneX, sceneY);
        }
    }
}
