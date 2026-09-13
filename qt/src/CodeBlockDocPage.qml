// CodeBlockDocPage.qml — Living Documentation for ChaSetCodeBlock
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Code Block"
    description: "Spec-driven syntax-highlighted code viewer composed from ChaSet scroll, copy, tab, and card primitives over a shared zero-dependency lexer — identical tokenization and colors on React and Qt."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "variants", title: "Variants & Options" },
        { id: "multi-file", title: "Multi-File Tabs" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property string sampleCode: "import { useState } from 'react';\n\ninterface CounterProps {\n  initial?: number;\n}\n\n/**\n * A tiny counter with a clamped floor.\n * Demonstrates the shared spec lexer across React and Qt.\n */\nexport function Counter({ initial = 0 }: CounterProps) {\n  const [count, setCount] = useState(initial);\n  const bump = () => setCount((c) => Math.max(0, c + 1));\n\n  return (\n    <button onClick={bump} data-testid=\"counter\">\n      Count: {count}\n    </button>\n  );\n}"

    property string longLineCode: "const message = \"A deliberately long single line that would otherwise require horizontal scrolling to read in full.\";"

    property string monochromeCode: "export const VERSION = '1.4.0';\n\n// Highlighting can be switched off without changing the layout.\nfunction resolve(key: string): boolean {\n  return key.length > 0;\n}"

    property var multiFileSample: [
        {
            name: "Button.tsx",
            language: "tsx",
            code: "export function Button({ children }: { children: React.ReactNode }) {\n  return (\n    <button className=\"rounded-md px-3 py-1.5 text-sm\">\n      {children}\n    </button>\n  );\n}"
        },
        {
            name: "theme.css",
            language: "css",
            code: ":root {\n  --primary: oklch(0.62 0.19 260);\n  --radius: 0.625rem;\n}\n\n.dark {\n  --primary: oklch(0.7 0.17 260);\n}"
        },
        {
            name: "setup.ts",
            language: "ts",
            code: "export const VERSION = '1.4.0';\nconst features = ['highlight', 'copy', 'tabs'];\n\n// Resolve the active feature set once at boot.\nexport function resolve(key: string): boolean {\n  return features.includes(key);\n}"
        }
    ]

    ComponentPreview {
        title: "Code Block Sandbox"
        reactCode: `<CodeBlock\n  code={source}\n  language="tsx"\n  showLineNumbers\n  showCopy\n/>`
        qtCode: `ChaSetCodeBlock {\n    language: "tsx"\n    showLineNumbers: true\n    code: source\n}`

        Item {
            anchors.fill: parent

            ChaSetCodeBlock {
                anchors.centerIn: parent
                width: Math.min(parent.width - 40, 560)
                language: "tsx"
                code: root.sampleCode
                showLineNumbers: true
                maxHeight: 240
            }
        }
    }

    // Section: Variants & Options
    Column {
        width: parent.width
        spacing: 16

        DocText {
            text: "Variants & Options"
            color: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.DemiBold
        }
        DocText {
            text: "Line numbers, soft wrapping, bounded height with vertical scrolling, monochrome mode, and chrome-less embedding for inline prose."
            color: ThemeTokens.subduedText
            font.pixelSize: 13
        }

        // Variant 1: showLineNumbers
        Column {
            width: parent.width
            spacing: 8
            Row {
                spacing: 8
                ChaSetBadge { variant: "secondary"; text: "showLineNumbers" }
                DocText { text: "Gutter with right-aligned line numbers"; color: ThemeTokens.subduedText; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
            }
            ChaSetCodeBlock {
                width: parent.width
                language: "tsx"
                code: root.sampleCode
                showLineNumbers: true
                maxHeight: 220
            }
        }

        // Variant 2: wrap
        Column {
            width: parent.width
            spacing: 8
            Row {
                spacing: 8
                ChaSetBadge { variant: "secondary"; text: "wrap" }
                DocText { text: "Soft-wrap long lines instead of horizontal scroll"; color: ThemeTokens.subduedText; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
            }
            ChaSetCodeBlock {
                width: parent.width
                language: "ts"
                code: root.longLineCode
                wrap: true
            }
        }

        // Variant 3: highlight={false}
        Column {
            width: parent.width
            spacing: 8
            Row {
                spacing: 8
                ChaSetBadge { variant: "secondary"; text: "highlight={false}" }
                DocText { text: "Monochrome fallback using the same layout"; color: ThemeTokens.subduedText; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
            }
            ChaSetCodeBlock {
                width: parent.width
                language: "tsx"
                code: root.sampleCode
                highlight: false
                showLineNumbers: true
            }
        }

        // Variant 4: embedded
        Column {
            width: parent.width
            spacing: 8
            Row {
                spacing: 8
                ChaSetBadge { variant: "secondary"; text: "embedded" }
                DocText { text: "Drop the card chrome and header for inline embedding"; color: ThemeTokens.subduedText; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
            }
            ChaSetCodeBlock {
                width: parent.width
                language: "ts"
                code: "export const VERSION = '1.4.0';"
                embedded: true
            }
        }
    }

    // Section: Multi-File Tabs
    Column {
        width: parent.width
        spacing: 12
        DocText {
            text: "Multi-File Tabs"
            color: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.DemiBold
        }
        DocText {
            text: "Pass a files array to render a tabbed group. Each tab carries its own language, and the copy button always targets the active file."
            color: ThemeTokens.subduedText
            font.pixelSize: 13
        }
        ChaSetCodeBlock {
            width: parent.width
            files: root.multiFileSample
            showLineNumbers: true
            maxHeight: 220
        }
    }

    // Section: Installation
    Column {
        width: parent.width
        spacing: 12
        DocText {
            text: "Installation"
            color: ThemeTokens.text
            font.pixelSize: 18
            font.weight: Font.DemiBold
        }
        ChaSetCodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }
    }

    // Animations
    Column {
        width: parent.width
        spacing: 12

        DocText { text: "Animations"; color: ThemeTokens.text; font.pixelSize: 18; font.weight: Font.Bold }

        DocText { text: "Motion behavior and timing driven by ThemeTokens for file switching and the header affordances."; color: ThemeTokens.subduedText; font.pixelSize: 13; wrapMode: TextEdit.WordWrap; width: parent.width }

        DocText { text: "• Switching the active file cross-fades the body over ThemeTokens.motionShort with the easeEntrance curve."; color: ThemeTokens.text; font.pixelSize: 13; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: "• The header affordances inherit token motion from their primitives: file tabs interpolate color and border over ThemeTokens.motionQuick with the easeStandard curve, as do the copy button and the scroll bars."; color: ThemeTokens.text; font.pixelSize: 13; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop."; color: ThemeTokens.text; font.pixelSize: 13; wrapMode: TextEdit.WordWrap; width: parent.width }
    }

    KeyboardShortcutsTable {
        componentId: "code-block"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "code", type: "string", default: "''", description: "Source text; ignored when `files` is provided." },
            { name: "language", type: "string", default: "'tsx'", description: "Language id or alias resolved by the shared lexer." },
            { name: "filename", type: "string", default: "''", description: "Header title override; defaults to the resolved language label (alias: title)." },
            { name: "files", type: "var", default: "[]", description: "Multi-file tab group of { name, code, language }; replaces the single-file body." },
            { name: "highlight", type: "bool", default: "true", description: "Enable spec-driven syntax highlighting." },
            { name: "showLineNumbers", type: "bool", default: "false", description: "Render a line-number gutter." },
            { name: "showLanguage", type: "bool", default: "true", description: "Render the language / filename label in the header." },
            { name: "showCopy", type: "bool", default: "true", description: "Render the built-in copy button in the header." },
            { name: "wrap", type: "bool", default: "false", description: "Wrap long lines instead of scrolling horizontally." },
            { name: "maxHeight", type: "real", default: "0", description: "Bound the body height; 0 means grow to fit the content." },
            { name: "embedded", type: "bool", default: "false", description: "Drop the card chrome and header for inline embedding." },
            { name: "copyLabel", type: "string", default: "''", description: "Optional visible label for the copy button." }
        ]
    }
}
