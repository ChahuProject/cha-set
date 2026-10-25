pragma Singleton
import QtQuick 6.10

// GENERATED FILE - DO NOT EDIT.
// Source: spec/content/<docId>/<locale>.md via spec/generators/generate-doc-content.mjs
// Refresh: `pnpm gen:docs` regenerates this file in place.
QtObject {
    id: root

    readonly property var locales: ["en-US","zh-CN"]
    readonly property string defaultLocale: "zh-CN"
    readonly property var pages: ({"table-of-contents":{"en-US":{"id":"table-of-contents","component":"table-of-contents","category":"Surfaces & Layout","title":"Table of Contents","description":"Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support.","sections":[{"id":"animations","title":"Animations","blocks":[{"t":"heading","level":2,"id":"animations","inlines":[{"t":"text","v":"Animations"}]},{"t":"para","inlines":[{"t":"text","v":"Motion behavior and timing for interactive states, strictly following the ChaSet token system."}]},{"t":"list","ordered":false,"items":[[{"t":"text","v":"State changes (hover, press, focus) animate over "},{"t":"token","v":"duration-quick"},{"t":"text","v":" with the "},{"t":"token","v":"ease-standard"},{"t":"text","v":" curve."}],[{"t":"text","v":"Durations and easing resolve from theme tokens, so enabling the reduced-motion preference ("},{"t":"token","v":"prefers-reduced-motion"},{"t":"text","v":") zeroes them automatically; on Qt the switch is governed by "},{"t":"code","v":"ThemeTokens.animationsEnabled"},{"t":"text","v":"."}]]},{"t":"chips","tokens":["duration-quick","ease-standard","prefers-reduced-motion"]}]}]},"zh-CN":{"id":"table-of-contents","component":"table-of-contents","category":"Surfaces & Layout","title":"目录树","description":"带导轨线、激活指示器与横幅偏移适配的层级大纲导航树。","sections":[{"id":"animations","title":"动效规范","blocks":[{"t":"heading","level":2,"id":"animations","inlines":[{"t":"text","v":"动效规范"}]},{"t":"para","inlines":[{"t":"text","v":"交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。"}]},{"t":"list","ordered":false,"items":[[{"t":"text","v":"状态切换（悬停、按下、聚焦）在 "},{"t":"token","v":"duration-quick"},{"t":"text","v":" 时长内以 "},{"t":"token","v":"ease-standard"},{"t":"text","v":" 缓动曲线过渡。"}],[{"t":"text","v":"动效时长与缓动直接解析自主题令牌，启用减弱动效偏好（"},{"t":"token","v":"prefers-reduced-motion"},{"t":"text","v":"）时将自动置零；Qt 端由 "},{"t":"code","v":"ThemeTokens.animationsEnabled"},{"t":"text","v":" 集中管控该开关。"}]]},{"t":"chips","tokens":["duration-quick","ease-standard","prefers-reduced-motion"]}]}]}}})
}
