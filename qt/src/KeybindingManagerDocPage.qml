// KeybindingManagerDocPage.qml — Living Documentation for ChaSetKeybindingManager
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Keybinding Manager"
    description: ChaSetI18n.tr("components.keybinding-manager.description", "Cross-stack keybinding and shortcut manager with reverse key search, conflict detection, and reset.")

    // Multi-language reactive bindings
    readonly property string _activeLocale: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.currentLocale) ? ChaSetI18n.currentLocale : ""

    readonly property var showcaseScopes: {
        var raw = (typeof ShowcaseData !== "undefined" && ShowcaseData.shortcuts) ? ShowcaseData.shortcuts.scopes : [];
        var _loc = _activeLocale;
        return raw.map(function(sc) {
            return {
                id: sc.id,
                name: ChaSetI18n.tr("showcase.shortcuts.scopes." + sc.id + ".name", sc.name),
                description: ChaSetI18n.tr("showcase.shortcuts.scopes." + sc.id + ".desc", sc.description || "")
            };
        });
    }

    readonly property var showcaseSections: {
        var raw = (typeof ShowcaseData !== "undefined" && ShowcaseData.shortcuts) ? ShowcaseData.shortcuts.sections : [];
        var _loc = _activeLocale;
        return raw.map(function(sec) {
            return {
                id: sec.id,
                name: ChaSetI18n.tr("showcase.shortcuts.sections." + sec.id, sec.name),
                order: sec.order
            };
        });
    }

    property var customChordsMap: ({})

    readonly property var showcaseActions: {
        var raw = (typeof ShowcaseData !== "undefined" && ShowcaseData.shortcuts) ? ShowcaseData.shortcuts.actions : [];
        var _loc = _activeLocale;
        return raw.map(function(act) {
            var subId = act.id.replace(/^showcase\./, "");
            var copy = {};
            for (var k in act) copy[k] = act[k];
            copy.name = ChaSetI18n.tr("showcase.shortcuts.actions." + subId + ".name", act.name);
            copy.description = ChaSetI18n.tr("showcase.shortcuts.actions." + subId + ".desc", act.description || "");
            if (copy.tags && copy.tags.length > 0) {
                copy.tags = copy.tags.map(function(tg) {
                    return tg.toLowerCase() === "essential" ? ChaSetI18n.tr("showcase.shortcuts.tags.essential", tg) : tg;
                });
            }
            if (root.customChordsMap[act.id]) {
                copy.chords = root.customChordsMap[act.id];
            }
            return copy;
        });
    }

    // Section 1: Interactive Overview
    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("components.keybindingManager.sandboxTitle", "Interactive Keybinding Manager")
        stageHeight: Math.max(560, managerComp.implicitHeight / ThemeTokens.uiScale + 48)
        reactCode: `<KeybindingManager
  actions={actions}
  scopes={scopes}
  sections={sections}
  onBindingChange={(actionId, chordIndex, newKey) => {
    console.log('Binding changed:', actionId, chordIndex, newKey);
  }}
  onResetAction={(actionId) => console.log('Reset action:', actionId)}
  onResetAll={() => console.log('Reset all shortcuts')}
/>`
        qtCode: `ChaSetKeybindingManager {
    width: parent.width
    actions: root.showcaseActions
    scopes: root.showcaseScopes
    sections: root.showcaseSections
    onBindingChanged: function(actionId, chordIndex, newKey) {
        console.log("Binding changed:", actionId, chordIndex, newKey)
    }
    onActionResetRequested: function(actionId) {
        console.log("Reset action:", actionId)
    }
    onResetAllRequested: function() {
        console.log("Reset all shortcuts")
    }
}`

        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Column {
                anchors.top: parent.top
                anchors.topMargin: ThemeTokens.dp(20)
                anchors.horizontalCenter: parent.horizontalCenter
                width: Math.min(parent.width - ThemeTokens.dp(32), ThemeTokens.dp(720))

                ChaSetKeybindingManager {
                    id: managerComp
                    width: parent.width
                    height: ThemeTokens.dp(520)
                    scopes: root.showcaseScopes
                    sections: root.showcaseSections
                    actions: root.showcaseActions

                    onBindingChanged: function(actionId, chordIndex, newKey) {
                        var currentChs = [];
                        for (var i = 0; i < root.showcaseActions.length; i++) {
                            if (root.showcaseActions[i].id === actionId) {
                                currentChs = (root.showcaseActions[i].chords || []).slice();
                                break;
                            }
                        }
                        if (chordIndex >= currentChs.length) {
                            currentChs.push({ keyString: newKey || "", isUserModified: true, isMasked: false });
                        } else if (!newKey && chordIndex > 0) {
                            currentChs.splice(chordIndex, 1);
                        } else if (!newKey && chordIndex === 0) {
                            currentChs[0] = { keyString: "", isUserModified: true, isMasked: false };
                        } else {
                            currentChs[chordIndex] = { keyString: newKey, isUserModified: true, isMasked: false };
                        }
                        var m = Object.assign({}, root.customChordsMap);
                        m[actionId] = currentChs;
                        root.customChordsMap = m;
                    }

                    onActionResetRequested: function(actionId) {
                        var m = Object.assign({}, root.customChordsMap);
                        delete m[actionId];
                        root.customChordsMap = m;
                    }

                    onResetAllRequested: function() {
                        root.customChordsMap = ({});
                    }
                }
            }
        }
    }

    // Section 2: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetKeybindingManager {
    width: parent.width
    actions: myActions
    scopes: myScopes
    sections: mySections
    onBindingChanged: (id, idx, key) => handleUpdate(id, idx, key)
}`
        reactCode: `import { KeybindingManager } from '@chahu/cha-set';

<KeybindingManager
  actions={actions}
  scopes={scopes}
  sections={sections}
  onBindingChange={(id, idx, key) => handleUpdate(id, idx, key)}
/>`
    }

    // Section 3: Animations
    DocMarkdown {
        width: parent.width
        docId: "keybinding-manager"
        section: "animations"
    }

    // Section 4: Keyboard Navigation
    DocMarkdown {
        width: parent.width
        docId: "keybinding-manager"
        section: "keyboard"
    }

    // Section 5: Props Reference
    DocMarkdown {
        width: parent.width
        docId: "keybinding-manager"
        section: "props"
    }
}
