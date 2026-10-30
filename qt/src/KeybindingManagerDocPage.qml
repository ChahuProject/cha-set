// KeybindingManagerDocPage.qml — Living Documentation for ChaSetKeybindingManager
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Keybinding Manager"
    description: ChaSetI18n.tr("components.keybinding-manager.description", "Cross-stack keybinding and shortcut manager with reverse key search, conflict detection, and reset.")

    readonly property var showcaseScopes: (typeof ShowcaseData !== "undefined" && ShowcaseData.shortcuts) ? ShowcaseData.shortcuts.scopes : []
    readonly property var showcaseSections: (typeof ShowcaseData !== "undefined" && ShowcaseData.shortcuts) ? ShowcaseData.shortcuts.sections : []
    property var activeActions: (typeof ShowcaseData !== "undefined" && ShowcaseData.shortcuts) ? ShowcaseData.shortcuts.actions : []

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
                width: Math.min(parent.width - ThemeTokens.dp(32), ThemeTokens.dp(640))

                ChaSetKeybindingManager {
                    id: managerComp
                    width: parent.width
                    height: ThemeTokens.dp(480)
                    scopes: root.showcaseScopes
                    sections: root.showcaseSections
                    actions: root.activeActions

                    onBindingChanged: function(actionId, chordIndex, newKey) {
                        var acts = [];
                        for (var i = 0; i < root.activeActions.length; i++) {
                            var a = root.activeActions[i];
                            if (a.id === actionId) {
                                var chs = (a.chords || []).slice();
                                if (chordIndex >= chs.length) {
                                    if (newKey) chs.push({ keyString: newKey, isUserModified: true, isMasked: false });
                                } else if (!newKey) {
                                    chs.splice(chordIndex, 1);
                                } else {
                                    chs[chordIndex] = { keyString: newKey, isUserModified: true, isMasked: false };
                                }
                                var updated = {};
                                for (var k in a) updated[k] = a[k];
                                updated.chords = chs;
                                acts.push(updated);
                            } else {
                                acts.push(a);
                            }
                        }
                        root.activeActions = acts;
                    }

                    onActionResetRequested: function(actionId) {
                        var acts = [];
                        for (var i = 0; i < root.activeActions.length; i++) {
                            var a = root.activeActions[i];
                            if (a.id === actionId) {
                                var defChords = [];
                                for (var d = 0; d < (a.defaultChords || []).length; d++) {
                                    defChords.push({ keyString: a.defaultChords[d], isUserModified: false, isMasked: false });
                                }
                                var updated = {};
                                for (var k in a) updated[k] = a[k];
                                updated.chords = defChords;
                                acts.push(updated);
                            } else {
                                acts.push(a);
                            }
                        }
                        root.activeActions = acts;
                    }

                    onResetAllRequested: function() {
                        var acts = [];
                        for (var i = 0; i < root.activeActions.length; i++) {
                            var a = root.activeActions[i];
                            var defChords = [];
                            for (var d = 0; d < (a.defaultChords || []).length; d++) {
                                defChords.push({ keyString: a.defaultChords[d], isUserModified: false, isMasked: false });
                            }
                            var updated = {};
                            for (var k in a) updated[k] = a[k];
                            updated.chords = defChords;
                            acts.push(updated);
                        }
                        root.activeActions = acts;
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
