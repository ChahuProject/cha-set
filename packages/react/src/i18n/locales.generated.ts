// GENERATED FILE - DO NOT EDIT.
// Source: spec/i18n/* via spec/generators/generate-i18n.mjs

export interface LocaleQuote {
  text: string;
  author: string;
}

export interface LocaleMetadata {
  code: string;
  nativeName: string;
  englishName: string;
  matches: string[];
  quote: LocaleQuote;
}

export interface LocaleMetaConfig {
  defaultLocale: string;
  fallbackLocale: string;
  storageKey: string;
  locales: Record<string, LocaleMetadata>;
  namespaces: string[];
}

export const I18N_META: LocaleMetaConfig = {
  "defaultLocale": "zh-CN",
  "fallbackLocale": "en-US",
  "storageKey": "chaset.locale",
  "locales": {
    "zh-CN": {
      "code": "zh-CN",
      "nativeName": "简体中文",
      "englishName": "Simplified Chinese",
      "matches": [
        "zh",
        "zh-CN",
        "zh-Hans"
      ],
      "quote": {
        "text": "床前明月光，疑是地上霜。",
        "author": "李白"
      }
    },
    "en-US": {
      "code": "en-US",
      "nativeName": "English",
      "englishName": "English (US)",
      "matches": [
        "en",
        "en-US",
        "en-GB"
      ],
      "quote": {
        "text": "Shall I compare thee to a summer's day?",
        "author": "William Shakespeare"
      }
    }
  },
  "namespaces": [
    "common",
    "theme",
    "language",
    "showcase",
    "components",
    "desktopComposite"
  ]
};

export const BUILTIN_LOCALES: Record<string, any> = {
  'zh-CN': {
  "common": {
    "reset": "重置",
    "export": "导出",
    "import": "导入",
    "cancel": "取消",
    "apply": "应用",
    "save": "保存",
    "saveChanges": "保存更改",
    "saving": "正在保存...",
    "delete": "删除",
    "close": "关闭",
    "copy": "复制",
    "copied": "已复制",
    "copyLink": "复制链接",
    "copyAllCode": "复制代码全部内容",
    "selectAll": "全选",
    "default": "默认",
    "and": "与",
    "or": "或",
    "secondary": "次要",
    "outline": "线框",
    "ghost": "幽灵",
    "destructive": "破坏性",
    "link": "链接",
    "overlay": "浮层遮罩",
    "back": "返回",
    "next": "下一步",
    "preview": "预览",
    "status": "状态",
    "value": "数值",
    "active": "激活",
    "disabled": "禁用",
    "enabled": "启用",
    "loading": "加载中",
    "open": "打开",
    "searchPlaceholder": "搜索组件与文档...",
    "noMatches": "未找到匹配页面",
    "navigate": "导航",
    "copyToClipboard": "复制到剪贴板",
    "tip": "提示",
    "resultCount": "{{count}} 个结果",
    "variant": "变体:",
    "size": "尺寸:",
    "fullWidth": "全宽",
    "pressed": "按下态",
    "label": "文案:",
    "required": "必填",
    "optional": "选填",
    "invalid": "无效",
    "orientation": "方向:",
    "style": "样式:",
    "position": "位置:",
    "animation": "动画:",
    "horizontal": "水平",
    "vertical": "垂直",
    "solid": "实线",
    "dashed": "虚线",
    "dotted": "点线",
    "left": "居左",
    "center": "居中",
    "right": "居右",
    "test": "测试",
    "keyUp": "↑",
    "keyDown": "↓",
    "opened": "已打开",
    "settings": "设置",
    "dark": "深色",
    "light": "浅色",
    "small": "小型",
    "system": "系统"
  },
  "theme": {
    "settings": {
      "title": "主题配置",
      "reset": "重置",
      "export": "导出 JSON",
      "import": "导入",
      "importHint": "粘贴 JSON 主题配置：",
      "cancel": "取消",
      "apply": "应用",
      "mode": {
        "title": "外观模式",
        "desc": "切换浅色、深色或跟随系统外观"
      },
      "palette": {
        "title": "强调色调色板",
        "desc": "从 10 档规范色板中选取或自定义强调色"
      },
      "style": {
        "title": "界面风格",
        "desc": "极简扁平呈现或富表现力分层质感"
      },
      "decoration": {
        "title": "装饰程度",
        "desc": "控制圆角、阴影与动效强度的全局滑块 (0-100)"
      },
      "uiscale": {
        "title": "界面缩放",
        "desc": "全局显示密度与界面缩放系数"
      }
    },
    "mode": {
      "light": "浅色",
      "dark": "深色",
      "system": "跟随系统"
    },
    "palette": {
      "neutral": "中性蓝",
      "slate": "板岩灰",
      "red": "绯红",
      "orange": "活力橙",
      "yellow": "明黄",
      "green": "翡翠绿",
      "blue": "极客蓝",
      "violet": "紫罗兰",
      "rose": "玫瑰红",
      "custom": "自定义"
    },
    "style": {
      "simple": "极简",
      "expressive": "表现力"
    },
    "overrides": {
      "custom": "微调",
      "hide": "收起",
      "radius": "圆角强度",
      "shadow": "阴影层级",
      "motion": "动效时长"
    }
  },
  "language": {
    "title": "语言偏好",
    "desc": "切换界面显示语言，支持即时生效与系统语言检测",
    "current": "当前",
    "label": "显示语言",
    "followSystem": "跟随系统",
    "systemDetected": "系统检测",
    "followSystemDesc": "当系统语言在受支持列表中时自动跟随，否则默认使用英语",
    "fixedNotice": "固定语言选项",
    "systemHint": "当前已设置为跟随系统，正在以 {{language}} 呈现界面",
    "fixedHint": "当前已固定为 {{language}}，不受系统语言变化影响"
  },
  "showcase": {
    "searchPlaceholder": "搜索组件与文档...",
    "studioTuner": "调色工作台",
    "exportTheme": "导出配置",
    "jumpTo": "快速跳转",
    "switchLanguage": "切换语言",
    "docs": "文档",
    "onThisPage": "本页导览",
    "outline": "大纲",
    "featuredEngines": "精选核心套件",
    "preview": "预览",
    "telemetryFps": "FPS",
    "telemetryDom": "DOM 节点",
    "telemetryHeap": "堆内存",
    "telemetryClose": "关闭 (Ctrl+Alt+P 重新打开)",
    "telemetryQtSceneGraph": "Qt SceneGraph (批处理激活)",
    "reactCode": "React 代码",
    "qtQml": "Qt QML 代码",
    "animations": "动效规范",
    "keyboardNavigation": "键盘导航",
    "propsReference": "属性参考",
    "anatomy": "结构分析",
    "anatomyDesc": "面向 React (TSX) 与 Qt Quick (QML) 的导入与基本结构定义。",
    "examplesAndStates": "示例与状态",
    "variantsAndOptions": "变体与选项",
    "multiFileTabs": "多文件标签页",
    "variant": "变体:",
    "size": "尺寸:",
    "categories": {
      "Get Started": "起步与主题",
      "Base Primitives": "通用与原子",
      "Forms & Inputs": "表单与输入",
      "Surfaces & Layout": "表面与布局",
      "Overlays & Feedback": "浮层与反馈",
      "Desktop & Virtualization": "桌面与虚拟化",
      "Composite Engines": "复合套件与系统"
    },
    "previewTitles": {
      "Interactive Button Sandbox": "按钮交互沙盒",
      "Hover to reveal": "悬停以浮现",
      "CopyableBadge preset": "CopyableBadge 预设",
      "Timing & Dim Controls": "时间与变暗控制",
      "Truncated display, full copy": "截断显示，完整复制",
      "Badge Sandbox": "徽章沙盒",
      "Label Sandbox": "标签沙盒",
      "Separator Sandbox": "分隔线沙盒",
      "Skeleton Sandbox": "骨架屏沙盒",
      "Copy Button Sandbox": "复制按钮沙盒",
      "Split Button Sandbox": "拆分按钮沙盒",
      "Elided Text Sandbox": "省略文本沙盒",
      "Kbd Sandbox": "按键指示沙盒",
      "Squircle Sandbox & Curvature Comparison": "超椭圆沙盒与曲率对比",
      "Truncated display full copy": "截断显示，完整复制",
      "ColorPicker Sandbox": "拾色器交互沙盒",
      "Duration Input Sandbox": "时长输入框交互沙盒",
      "Inline Editable Text Sandbox": "行内编辑文本交互沙盒",
      "Keybinding Recorder Sandbox": "快捷键录制器交互沙盒",
      "MediaProgressBar Sandbox": "媒体播放进度条交互沙盒",
      "Preset Number Input Sandbox": "预设数值输入框交互沙盒",
      "Read-Only Input Sandbox": "只读输入框交互沙盒",
      "Sizes & Interaction Triggers": "尺寸与交互触发方式沙盒",
      "Sizes & States": "尺寸与状态沙盒",
      "Sizes & Status Variants": "尺寸与状态变体沙盒"
    },
    "toc": {
      "overview": "交互式概览",
      "installation": "安装方式",
      "animations": "动画规范",
      "keyboard": "键盘导航",
      "props": "属性参考",
      "anatomy": "组件结构",
      "states": "状态与交互",
      "examples": "示例展示",
      "variants": "变体展示",
      "levels": "层级划分",
      "colors": "颜色调色板",
      "type": "排版与圆角",
      "tuner": "主题控制",
      "playground": "实时沙盒",
      "philosophy": "设计理念",
      "architecture": "架构原理",
      "quickstart": "快速起步",
      "packages": "包与结构",
      "task-1": "任务 1",
      "task-2": "任务 2",
      "queue-1": "队列 1",
      "queue-2": "队列 2",
      "queue-3": "队列 3",
      "queue-4": "队列 4",
      "queue-5": "队列 5",
      "centering": "视觉居中",
      "configuration": "外部配置",
      "extensibility": "扩展规范",
      "gallery": "图标画廊",
      "grids": "网格、粗细与尺寸",
      "integration": "宿主集成",
      "ramp": "跨文字体系字阶",
      "rasterizer": "光栅化管线",
      "rules": "治理规则",
      "specification": "激活规范"
    },
    "reactTsx": "React (TSX) 代码",
    "qtQuickQml": "Qt Quick (QML) 代码",
    "collapseOverflow": "折叠与溢出",
    "examplesVariants": "示例与变体",
    "installation": "安装",
    "interactiveOverview": "交互式概览",
    "navigation": "导航",
    "shortcuts": {
      "scopes": {
        "global": {
          "name": "全局应用",
          "desc": "在所有演示视图中生效的全局快捷键"
        },
        "preview": {
          "name": "组件沙盒",
          "desc": "仅在交互式沙盒画布中生效的快捷键"
        }
      },
      "sections": {
        "navigation": "导航与搜索",
        "view": "视图与缩放",
        "system": "系统与偏好"
      },
      "actions": {
        "search": {
          "name": "全局命令搜索",
          "desc": "打开居中聚焦的命令与组件快速搜索面板。"
        },
        "navBack": {
          "name": "后退导航",
          "desc": "返回前一个访问过的演示文档页面。"
        },
        "navForward": {
          "name": "前进导航",
          "desc": "在页面历史记录栈中前进至下一页。"
        },
        "toggleSidebar": {
          "name": "切换侧边栏",
          "desc": "展开或折叠主组件导航侧边栏。"
        },
        "zoomIn": {
          "name": "放大界面",
          "desc": "增大全局界面显示缩放比例并触发屏幕 OSD 提示。"
        },
        "zoomOut": {
          "name": "缩小界面",
          "desc": "减小全局界面显示缩放比例并触发屏幕 OSD 提示。"
        },
        "zoomReset": {
          "name": "重置界面缩放",
          "desc": "将界面显示缩放比例恢复至默认 100% (1.0x)。"
        },
        "toggleTelemetry": {
          "name": "切换性能监视 HUD",
          "desc": "开启或关闭实时 60fps 帧率、渲染耗时与堆内存浮动监视面板。"
        },
        "toggleTheme": {
          "name": "轮换外观模式",
          "desc": "在浅色、深色与跟随系统三种外观模式之间循环切换。"
        },
        "copySelection": {
          "name": "复制当前选中内容",
          "desc": "将当前高亮选中的代码片段或文本划选复制到操作系统剪贴板。"
        }
      },
      "tags": {
        "essential": "基础常用"
      }
    }
  },
  "categories": {
    "Get Started": "起步与主题",
    "Base Primitives": "通用与原子",
    "Forms & Inputs": "表单与输入",
    "Surfaces & Layout": "表面与布局",
    "Overlays & Feedback": "浮层与反馈",
    "Desktop & Virtualization": "桌面与虚拟化",
    "Composite Engines": "复合套件与系统"
  },
  "navigation": {
    "introduction": "起步与介绍",
    "tokens": "主题与令牌",
    "themetuner": "主题工作台",
    "typography": "排版与字体渲染",
    "icons": "图标系统",
    "intro": "起步与介绍",
    "theme-tuner": "主题工作台",
    "button": "按钮",
    "badge": "徽标",
    "label": "标签",
    "separator": "分隔线",
    "skeleton": "骨架屏",
    "copy-button": "复制按钮",
    "hover-copy": "悬浮复制",
    "split-button": "拆分按钮",
    "elided-text": "文本省略",
    "kbd": "按键指示",
    "squircle": "超椭圆圆角",
    "input": "输入框",
    "checkbox": "复选框",
    "switch": "开关",
    "select": "选择器",
    "slider": "滑动条",
    "range-slider": "范围滑动条",
    "snap-slider": "吸附滑动条",
    "segmented-control": "分段控制器",
    "color-picker": "颜色选择器",
    "duration-input": "时长输入框",
    "preset-number-input": "预设数值输入框",
    "read-only-input": "只读输入框",
    "inline-editable-text": "内联可编辑文本",
    "keybinding-recorder": "快捷键录制器",
    "media-progress-bar": "媒体进度条",
    "card": "卡片",
    "panel-card": "面板卡片",
    "tabs": "标签页",
    "scroll-area": "滚动区域",
    "collapsible": "折叠面板",
    "setting-row": "设置行",
    "viewport-constrained-container": "视口约束容器",
    "sidebar": "侧边栏",
    "splitter": "分割器",
    "splitter-handle": "分割手柄",
    "resizable": "可调整大小容器",
    "table-of-contents": "目录导航",
    "dialog": "对话框",
    "alert-dialog": "警告对话框",
    "sheet": "抽屉侧栏",
    "popover": "气泡卡片",
    "tooltip": "文字提示",
    "dropdown-menu": "下拉菜单",
    "context-menu": "右键上下文菜单",
    "draggable-modal": "可拖拽模态框",
    "scale-osd": "缩放屏幕指示器",
    "task-hud": "任务浮窗",
    "notification-stack": "通知堆叠",
    "floating-notice": "浮动提示",
    "window-title-bar": "窗口标题栏",
    "smooth-wheel-handler": "平滑滚轮处理器",
    "virtual-list": "虚拟列表",
    "virtual-tree": "虚拟树形控件",
    "virtual-grid": "虚拟网格",
    "generic-data-table": "通用数据表格",
    "table": "基础表格",
    "query-builder": "查询构建器",
    "code-block": "代码块",
    "pipeline-view": "流水线视图",
    "address-bar": "地址栏",
    "theme-settings": "主题设置",
    "language-settings": "语言设置",
    "keybinding-manager": "快捷键管理器"
  },
  "exportTheme": {
    "title": "导出主题配置",
    "description": "一键复制适用于目标框架的定制化样式与组件代码。",
    "tip": "提示：将此配置直接置入项目的样式表或主题管理器中即可生效。",
    "cssVariables": "CSS 变量",
    "tailwindV4": "Tailwind v4 配置",
    "reactCode": "React 代码",
    "qtQml": "Qt / QML 代码",
    "jsonSpec": "JSON 规范"
  },
  "components": {
    "componentPreview": {
      "thisComponent": "当前组件"
    },
    "errorBoundary": {
      "fallbackTitle": "组件渲染错误",
      "reloadPage": "重新加载页面",
      "tryAgain": "重试",
      "unexpectedError": "渲染过程中发生了意外错误。"
    },
    "icon-system": {
      "description": "面向双端的统一图标规范：单一几何源、统一描边字重、内在视觉光学居中，以及规范切换指南。"
    },
    "icons": {
      "description": "面向双端的统一图标规范：单一几何源、统一描边字重、内在视觉光学居中，以及规范切换指南。"
    },
    "intro": {
      "description": "单一真理源架构与多端总览。"
    },
    "introduction": {
      "description": "ChaSet（茶具套件）是一个跨端 UI 组件库，由单一真理源同时驱动 React (Web) 与 Qt/QML (桌面端) 两套实现。"
    },
    "theme-studio": {
      "description": "实时交互式主题微调器。微调颜色、圆角与强调色，提供即时反馈并支持一键导出配置。"
    },
    "theme-tokens": {
      "description": "驱动 Tailwind 自定义 CSS 属性与 Qt Quick C++ / QML 单例的中立令牌系统。"
    },
    "theme-tuner": {
      "description": "交互式主题定制器与配置导出器。"
    },
    "tokens": {
      "description": "色彩体系、语义映射、圆角与排版。"
    },
    "typography": {
      "description": "全局文本光栅化策略与跨越五种文字体系的字阶梯度展示。"
    },
    "typography-rendering": {
      "description": "全局文本光栅化策略与跨越五种文字体系的字阶梯度展示。"
    },
    "badge": {
      "away": "离开",
      "badgeDefault": "默认徽章",
      "badgeNew": "最新",
      "defaultLabel": "默认:",
      "description": "展示徽章或具有徽章外观的组件，用于高亮状态、标签和计数。",
      "error": "错误",
      "online": "在线",
      "overviewDesc": "实时调整变体、尺寸和交互状态选项，Web 与桌面端保持同步预览。",
      "qtQuick": "Qt Quick 标签",
      "reactTag": "React 标签",
      "removable": "可移除",
      "resetRemoved": "重置已移除徽章",
      "sizesDesc": "在标准胶囊尺寸 (default) 与紧凑微型徽章 (sm) 之间选择。",
      "sizesTitle": "尺寸",
      "smallLabel": "小号:",
      "statusDesc": "徽章支持实时状态指示圆点和用于过滤标签的可关闭操作按钮。",
      "statusDot": "状态圆点",
      "statusTitle": "状态指示与可移除标签",
      "variantsDesc": "全部六种对齐 ChaSet 设计令牌系统的标准语义变体。",
      "variantsTitle": "变体"
    },
    "button": {
      "activeToggle": "激活切换",
      "description": "展示一个按钮或具有按钮外观的组件，提供多种变体、尺寸和状态。",
      "disabledButton": "禁用按钮",
      "extraSmall": "极小",
      "groupDesc": "使用 ButtonGroup 聚合相关联的按钮，并为按钮添加前置或后置图标。",
      "groupTitle": "按钮组与图标",
      "large": "大号",
      "left": "左侧",
      "middle": "中间",
      "right": "右侧",
      "sizesDesc": "提供标准化尺寸：xs、sm、default、lg 及图标变体。",
      "sizesTitle": "尺寸",
      "small": "小号",
      "statesDesc": "按钮自动处理加载中、按下和禁用状态，保持固有宽度并阻止指针事件。",
      "statesTitle": "状态与加载",
      "variantsDesc": "使用 variant 属性切换视觉层级。",
      "variantsTitle": "变体"
    },
    "copy-button": {
      "clickToTest": "点击复制按钮以测试",
      "copiedSuccess": "已成功复制: {{text}}",
      "copyLink": "复制链接",
      "copySecret": "复制私钥",
      "description": "一键剪贴板复制按钮，带有短暂的成功对勾反馈和可自定义的超时时长。",
      "overviewDesc": "点击下方复制按钮将目标文本复制到系统剪贴板。"
    },
    "elided-text": {
      "alwaysShow": "常驻显示气泡: {{status}}",
      "copyable": "点击复制: {{status}}",
      "description": "智能文本省略截断，具备自动溢出检测、点击复制以及悬浮气泡提示功能。",
      "multiLineDesc": "使用 maxLines={2}，文本最多折行两行，超出部分截断并显示省略号。",
      "multiLineTitle": "多行截断 (Multi-Line Clamping)",
      "off": "关闭",
      "on": "开启",
      "overviewDesc": "使用滑块调整下方容器宽度。当文本被省略号截断时，悬浮即可在气泡中查看完整路径；开启复制功能后点击即可复制完整内容。",
      "sampleParagraph": "ChaSet 提供跨端设计系统原子原语，在 React Web 与 Qt Quick 桌面应用间具备像素级一致性。",
      "widthLabel": "宽度: {{width}}"
    },
    "hover-copy": {
      "copiedStatus": "已复制",
      "copiedSuccess": "已成功复制：{{text}}",
      "description": "为任意内容提供悬浮变暗遮罩与居中复制按钮，点击遮罩任意位置即可复制，成功显示勾选图标。",
      "dimAmount": "变暗程度",
      "disabled": "禁用",
      "hoverHint": "将鼠标悬停到卡片上，然后点击遮罩任意位置进行复制。",
      "installationDesc": "从共享包中导入 HoverCopy 或 CopyableBadge 预设。",
      "overviewDesc": "将鼠标悬停到卡片上会浮现变暗遮罩与居中复制按钮，点击遮罩任意位置即可把隐藏的载荷复制到剪贴板。",
      "playgroundDesc": "调节遮罩圆角、恢复时间、遮罩浓度与禁用状态，下方沙盒与桌面端布局完全一致。",
      "playgroundTitle": "时间与变暗控制",
      "presetDesc": "CopyableBadge 是一个薄预设：将次要徽标包裹在 HoverCopy 中并使用 pill 遮罩，不引入任何自身状态与计时。",
      "presetHint": "将鼠标悬停到徽标上以浮现复制遮罩，点击任意位置即可复制。",
      "presetText": "ORDER-1024",
      "presetTitle": "CopyableBadge 预设",
      "radius": "圆角",
      "radiusFull": "完整",
      "radiusLg": "lg",
      "radiusMd": "md",
      "radiusNone": "无",
      "radiusSm": "sm",
      "restoreInterval": "恢复时间",
      "truncateDesc": "可见标签可能被截断，而复制的载荷始终保持完整字符串。",
      "truncateHint": "屏幕上仅能显示开头部分；复制将获取完整标识符。",
      "truncateText": "ORDER-2026-0417-PROD-HOTFIX",
      "truncateTitle": "截断显示，完整复制"
    },
    "kbd": {
      "always": "始终紧凑",
      "auto": "自动",
      "clickLabel": "点击",
      "compact": "紧凑模式:",
      "description": "显示键盘快捷键、组合键及键帽徽章，具备智能紧凑截断功能。",
      "never": "从不紧凑",
      "orDivider": "或",
      "overviewDesc": "实时调整变体、尺寸和紧凑符号模式，Web 与桌面端保持同步预览。",
      "variantsDesc": "专为菜单、搜索输入框、对话框和反相气泡提示设计的四种视觉样式。",
      "variantsTitle": "变体"
    },
    "label": {
      "acceptTerms": "我同意并接受服务条款与隐私政策",
      "accountPassword": "账户密码",
      "altPhone": "备用电话",
      "archivedRecordId": "归档记录 ID",
      "defaultLabel": "默认标签",
      "description": "渲染与表单控件相关联的可访问性文本标签。",
      "descriptionDesc": "直接显示在标签下方的辅助说明副标题",
      "descriptionTitle": "带辅助描述",
      "disabledDesc": "非交互表单元素的半透明淡化效果",
      "disabledTitle": "禁用状态",
      "emailAddress": "电子邮箱地址",
      "emailPlaceholder": "请输入邮箱 (如 name@example.com)",
      "formControlDesc": "点击标签可通过 htmlFor 自动激活或切换关联的输入控件。",
      "formControlTitle": "表单控件绑定",
      "invalidDesc": "红色破坏性文字高亮显示校验错误的字段",
      "invalidTitle": "校验错误 (Invalid)",
      "legalEntityHelper": "输入在工商和税务机关登记的企业法定全称",
      "legalEntityName": "法定企业名称",
      "optionalDesc": "浅灰色标记表示非必填项",
      "optionalIndicator": "（选填）",
      "optionalTitle": "选填指示器",
      "overviewDesc": "实时调整尺寸、必填标记、选填指示符、校验状态及禁用外观。",
      "recoveryEmail": "备用恢复邮箱",
      "recoveryTooltip": "用于双重验证身份恢复代码接收",
      "requiredDesc": "红色星号表示必填输入字段",
      "requiredTitle": "必填指示器",
      "sizesDesc": "在标准文本尺寸与用于工具栏或高密度表单的紧凑高密度尺寸之间选择。",
      "sizesTitle": "尺寸",
      "smallLabel": "小号标签",
      "statesDesc": "标签状态视觉矩阵，包括必填星号、选填标识、校验错误、辅助说明和工具提示。",
      "statesTitle": "状态与变体",
      "termsSubtitle": "点击下方文字可切换复选框勾选状态",
      "termsTitle": "条款与条件",
      "tooltipDesc": "悬浮帮助图标展示上下文解释信息",
      "tooltipTitle": "带提示气泡",
      "workEmail": "工作邮箱"
    },
    "separator": {
      "accountDesc": "管理工作区配置与个人资料。",
      "accountOverview": "账户概览",
      "active": "生效中",
      "borderStyles": "边框线条样式",
      "borderStylesDesc": "在实线、虚线或点线分隔线之间选择以区分层次结构。",
      "changelog": "更新日志",
      "chasetUi": "ChaSet UI",
      "components": "组件",
      "continueWith": "或通过以下方式继续",
      "dashed": "虚线",
      "decorative": "装饰性",
      "description": "在列表、表单或区域中在视觉或语义上分隔内容。",
      "docs": "文档",
      "dotted": "点线",
      "endOfCategory": "分类结束",
      "enterprise": "企业版",
      "examplesDesc": "水平、垂直、虚线、点线以及带文案分隔线的常见布局模式。",
      "examplesTitle": "示例与状态",
      "labeledDividers": "带文案分隔线",
      "labeledDividersDesc": "嵌入清晰的区域标题或认证分流，支持左、中、右对齐。",
      "manage": "管理",
      "navDivider": "行内导航分隔",
      "navDividerDesc": "行内列表项或元数据标签之间的垂直分隔线。",
      "orContinueWith": "或者通过以下方式继续",
      "overviewDesc": "在 Web 和桌面端测试水平/垂直方向、虚线/点线样式以及带文案的分隔线。",
      "plan": "订阅计划",
      "sectionStart": "小节开始",
      "showcase": "组件演练",
      "signInEmail": "使用邮箱登录",
      "signInSso": "使用 SSO 登录",
      "solidDefault": "实线 (默认)",
      "source": "源码",
      "status": "状态",
      "systemDesc": "跨端 React 与 Qt Quick 设计系统。",
      "tokens": "设计令牌"
    },
    "skeleton": {
      "description": "在内容加载期间显示占位骨架屏，具有平滑的 CSS 脉冲与波纹闪烁动画。",
      "none": "无动画",
      "overviewDesc": "用于渐进式加载状态的视觉占位骨架卡片。可在脉冲、波纹扫光或静态模式间切换。",
      "pulse": "脉冲",
      "wave": "波纹扫光"
    },
    "split-button": {
      "abortPipeline": "终止流水线",
      "archiveArtifact": "归档构建产物",
      "deploy": "部署",
      "deployBuild": "部署构建版本 #142",
      "deployCanary": "部署灰度版本",
      "deployStaging": "部署到预发环境",
      "description": "双操作按钮，结合主要直接点击操作与次要附属下拉菜单。",
      "eventMsg": "事件: {{event}}",
      "exportToDisk": "导出到磁盘",
      "lastAction": "最近触发操作: {{action}}",
      "none": "无",
      "overviewDesc": "点击主按钮触发主要操作，或点击下拉箭头展开菜单。",
      "saveAll": "保存全部",
      "saveAs": "另存为...",
      "saveProject": "保存项目",
      "tagRelease": "创建发布标签 v1.2.0"
    },
    "splitButton": {
      "defaultAction": "操作"
    },
    "squircle": {
      "adoptionPreview": "全局默认接入预览",
      "classicArc": "传统圆弧角 (平滑度: 0%)",
      "cornerRadius": "圆角半径",
      "cornerSmoothing": "圆角平滑度",
      "description": "iOS 连续曲率超椭圆圆角（G2 连续律）。消除了传统圆弧角在直线与切点处曲率突变导致的生硬折痕，为整个项目提供平滑、有机的现代圆角设计。",
      "g1Label": "标准圆弧切角 (G1)",
      "g2Label": "iOS 连续曲率 (G2)",
      "radiusLabel": "圆角半径: {{radius}}",
      "squircleLabel": "连续超椭圆 (平滑度: {{smoothing}}%)"
    },
    "range-slider": {
      "description": "支持最小-最大区间选择的双拇指滑块，具备碰撞防交叉保护。"
    },
    "snap-slider": {
      "description": "按预设档位吸附的离散步进滑块，支持刻度标记与标签行。"
    },
    "segmented-control": {
      "description": "面向工具栏、菜单与视图切换的紧凑胶囊分段开关。"
    },
    "color-picker": {
      "description": "交互式颜色选择器，支持饱和度/明度选区与色板。"
    },
    "duration-input": {
      "description": "分段时长输入框，支持步进按钮、方向键跳转与预设菜单。"
    },
    "preset-number-input": {
      "description": "带快捷预设下拉面板与清空操作的数值输入框。"
    },
    "read-only-input": {
      "description": "面向令牌与 ID 的受保护只读输入框，集成复制到剪贴板操作。"
    },
    "inline-editable-text": {
      "description": "双击或触发编辑态即可无缝切换为输入框的文本元素。"
    },
    "keybinding-recorder": {
      "description": "面向桌面应用的交互式录制器，用于捕获加速键键盘序列。"
    },
    "media-progress-bar": {
      "description": "通用媒体播放进度条，支持拖拽擦洗、点击定位、悬停预览、左下方位置/总长时间显示、点击翻转正/倒计时与右键格式菜单。"
    },
    "checkbox": {
      "description": "允许用户在选中和未选中状态之间切换的控件，支持半选状态、多尺寸、辅助说明文本与配套标签。",
      "fallbackLabel": "复选框"
    },
    "colorPicker": {
      "compactDesc": "更小的尺寸与字体规格，适合密集的工具栏或侧边栏面板。",
      "compactTitle": "紧凑尺寸 (sm)",
      "customPresetsDesc": "通过 presetColors 属性传入专属的项目色板。",
      "customPresetsTitle": "自定义预设色板",
      "defaultTitle": "颜色",
      "description": "支持 4 种选择器面板（HueRing 方形、圆形色轮、HueRing 三角形与色板）、实时十六进制输入与复制按钮，以及独立多通道滑块（RGB、HSV、CMYK、LAB）的交互式颜色选择组件。",
      "disabledDesc": "只读展示，50% 透明度且禁用交互事件。",
      "disabledTitle": "禁用状态",
      "examplesDesc": "颜色选择器常见配置、模式与尺寸的矩阵示例。",
      "examplesTitle": "示例与状态",
      "hexInput": "HEX 输入",
      "mode": "模式:",
      "modeInline": "内嵌面板",
      "modePopover": "气泡弹窗",
      "movable": "允许拖拽",
      "panelCircle": "圆形",
      "panelSquare": "方形",
      "panelSwatches": "色板",
      "panelTriangle": "三角形",
      "popoverDesc": "紧凑型触发按钮，显示当前颜色与十六进制数值，点击展开浮动面板。",
      "popoverTitle": "气泡下拉模式",
      "preview": "预览区",
      "selectedColor": "已选颜色:",
      "size": "尺寸:",
      "sizeSm": "紧凑 (sm)",
      "swatches": "预设色板"
    },
    "durationInput": {
      "compactSizeColon": "紧凑尺寸 (sm):",
      "compactTitle": "紧凑尺寸 (sm)",
      "description": "分段式时长输入控件，支持时、分、秒独立编辑，带有步进按钮、鼠标滚轮调节、键盘方向键切换与快速预设菜单。",
      "disabledStateColon": "禁用状态:",
      "disabledTitle": "禁用状态",
      "formatted": "格式化展示:",
      "formattedSummary": "{{h}}小时 {{m}}分钟 {{sec}}秒 (共 {{total}} 秒)",
      "hours": "时",
      "largeTitle": "较大尺寸 (lg)",
      "minutes": "分",
      "presets": "预设",
      "seconds": "秒",
      "timerDuration": "定时器时长",
      "timerDurationDefault": "定时器时长 (默认):",
      "variantsDesc": "支持紧凑与宽敞尺寸档位，支持关闭预设菜单或单位标签，以及禁用状态。",
      "variantsTitle": "变体与配置"
    },
    "inlineEditableText": {
      "clickToEdit": "单击或双击下方文本以就地编辑:",
      "compactSm": "紧凑 sm 尺寸",
      "currentStateValue": "当前状态数值:",
      "demoCompact": "迭代评审-42",
      "demoDisabled": "系统受保护文件",
      "demoDoubleClick": "数据库连接配置串",
      "demoSingleClick": "项目架构设计文档",
      "description": "就地编辑文本控件，双击或点击触发器即可无缝切换为输入框，支持回车键确认保存与 Esc 键取消编辑。",
      "disabledTitle": "禁用状态",
      "doubleClickActivation": "双击激活",
      "placeholder": "输入标题...",
      "singleClickActivation": "单击激活 (默认)",
      "sizesAndTriggers": "尺寸与触发交互方式",
      "sizesAndTriggersDesc": "配置单击或双击触发编辑，以及紧凑尺寸规格。"
    },
    "input": {
      "description": "显示表单文本输入框或具备输入框外观与行为的组件。"
    },
    "keybindingRecorder": {
      "clearShortcut": "清除快捷键",
      "clickToRecord": "点击录制框并按下快捷键组合:",
      "clickToRecordHint": "点击录制快捷键",
      "compactSm": "紧凑 sm 尺寸",
      "currentBinding": "当前快捷键：",
      "defaultWithClear": "默认尺寸 (带清除按钮)",
      "description": "交互式快捷键录制控件，支持捕获桌面应用修饰键组合 (Ctrl, Shift, Alt, Meta/Cmd) 与热键序列。",
      "disabledTitle": "禁用状态",
      "noBinding": "未设置快捷键",
      "none": "无",
      "placeholder": "按下快捷键...",
      "recordedAccelerator": "已录制快捷键:",
      "recordingPrompt": "请按下按键组合 (Esc 取消)...",
      "sizesAndStates": "尺寸与状态",
      "sizesAndStatesDesc": "提供默认与 sm 两种尺寸规格，支持可选清除按钮与禁用状态。",
      "withoutClear": "无清除按钮"
    },
    "mediaProgressBar": {
      "currentElapsedTooltip": "当前：正计时 (已播放时间)",
      "currentRemainingTooltip": "当前：倒计时 (剩余时间)",
      "description": "通用媒体播放进度条组件，支持拖拽擦洗、点击 seek、悬停预览、左下方「位置 / 总长」时间显示、点击翻转正/倒计时与右键格式菜单。",
      "elapsedMode": "正计时 (已播放)",
      "formatFrames": "按帧率显示 (0 帧)",
      "formatHms": "时分秒 (00:00)",
      "formatSeconds": "按秒显示 (0.0s)",
      "framesUnit": "{{f}} 帧",
      "playbackStatus": "播放进度",
      "remainingMode": "倒计时 (剩余)",
      "timeFormatMenuTitle": "时间格式",
      "timingModeLabel": "计时模式",
      "timingModeMenuTitle": "计时方式",
      "toggleTooltip": "点击切换 · 右键打开菜单"
    },
    "presetNumberInput": {
      "auto": "自动",
      "currentValue": "当前数值:",
      "customPresetsSmall": "自定义预设 (小尺寸)",
      "customPresetsSmallColon": "自定义预设 (小尺寸):",
      "description": "高密度数值输入控件，内置快速选择下拉面板，提供常用尺寸规格预设、单位标签与可选的清空操作。",
      "disabledTitle": "禁用状态",
      "disallowClear": "禁止清空 (必填项)",
      "empty": "(空)",
      "placeholder": "宽 / 高",
      "textureDimension": "纹理尺寸",
      "textureDimensionColon": "纹理尺寸:",
      "variantsDesc": "配置自定义数值预设，关闭清空选项，或置于禁用状态。",
      "variantsTitle": "变体与配置"
    },
    "rangeSlider": {
      "description": "用于选择数值最小—最大区间的双滑块，具备防碰撞与键盘无障碍支持。"
    },
    "readOnlyInput": {
      "apiSecretKey": "API 密钥 (掩码与复制):",
      "description": "受保护的输入框，专为 API 密钥、令牌与 ID 设计，内置复制到剪贴板与掩码切换。",
      "personalAccessToken": "GitHub 访问令牌 (掩码):"
    },
    "segmentedControl": {
      "description": "紧凑胶囊式分段切换控件，适用于工具栏、菜单与视图切换，支持图标与徽标。"
    },
    "select": {
      "description": "显示供用户挑选的下拉选项列表，由带箭头与选中指示器的触发按钮呼出。",
      "placeholder": "请选择选项……"
    },
    "slider": {
      "description": "允许用户沿滑动轨道选取数值的交互控件。"
    },
    "snapSlider": {
      "description": "具备刻度与标签行的阶梯式吸附滑块，可精准对齐离散分档。"
    },
    "switch": {
      "description": "允许用户在开与关状态之间切换的控制开关，支持异步加载、只读模式及辅助说明描述。"
    },
    "panel-card": {
      "description": "带集成可折叠分区与头部操作槽位的卡片容器。"
    },
    "scroll-area": {
      "description": "支持热区扩展与步进按钮的自定义滚动容器。"
    },
    "setting-row": {
      "description": "设置表单项布局，包含标题、描述、控件槽位与锚点闪烁定位。"
    },
    "viewport-constrained-container": {
      "description": "根据锚点下方可用视口空间动态约束最大高度的容器。"
    },
    "splitter-handle": {
      "description": "边缘拖拽调整手柄，具备参考项坐标防抖与最小/最大尺寸钳制。"
    },
    "table-of-contents": {
      "description": "层级大纲导航树，支持引导线、激活指示器与横幅偏移适配。"
    },
    "card": {
      "description": "展示包含页眉、标题、描述、正文与底部操作区的卡片容器。"
    },
    "collapsible": {
      "description": "可展开与折叠内容面板的交互式组件。"
    },
    "panelCard": {
      "defaultTitle": "面板标题",
      "description": "带集成可折叠分区与头部操作槽的卡片表面，适用于桌面侧边栏与检查器。"
    },
    "resizable": {
      "description": "无障碍可调面板分组与布局分隔器。"
    },
    "scrollArea": {
      "description": "为原生滚动能力注入跨端统一视觉样式、动态双盒热区扩展及交互式步进导航按钮的高性能滚动容器。"
    },
    "settingRow": {
      "description": "标准化偏好设置项行布局，含标题、描述、内嵌控件区与锚点闪烁高亮。"
    },
    "sidebar": {
      "description": "可组合、响应式、可调尺寸的桌面级侧边栏导航系统，支持图标折叠、抽屉模式与自定义 rem 尺寸。"
    },
    "splitter": {
      "description": "面向 IDE 与桌面工具包的带可拖拽分隔条与折叠限制的多窗格可调布局容器。"
    },
    "splitterHandle": {
      "description": "具备基准坐标防抖、最小／最大钳制与键盘导航的边缘缩放手柄。"
    },
    "tableOfContents": {
      "description": "带导轨线、激活指示器与横幅偏移适配的层级大纲导航树。"
    },
    "tabs": {
      "description": "一组层叠内容区（称为选项卡面板），一次显示其中之一。"
    },
    "viewportConstrainedContainer": {
      "description": "根据锚点矩形下方可用视口空间动态约束最大高度的容器，支持自定义上限覆盖与平滑垂直滚动。"
    },
    "alert-dialog": {
      "description": "打断用户并需要确认的重要模态确认弹窗。"
    },
    "dropdown-menu": {
      "description": "由按钮触发的下拉菜单，支持分组项与快捷键提示。"
    },
    "context-menu": {
      "description": "在右键或上下文手势的指针坐标处弹出的菜单。"
    },
    "draggable-modal": {
      "description": "桌面级浮动窗口，支持标题栏拖拽移动与视口边界约束。"
    },
    "scale-osd": {
      "description": "用于画布缩放调节的浮动屏幕显示条，支持自动隐藏。"
    },
    "task-hud": {
      "description": "后台任务浮动执行栈，支持进度展示、溢出收纳与折叠摘要。"
    },
    "notification-stack": {
      "description": "浮动分级通知消息栈，支持单项存活时长与行内操作。"
    },
    "floating-notice": {
      "description": "悬浮在视口顶上或底下的紧凑提示胶囊，支持优先级排序、卡片轮播排队与内容插槽扩展。"
    },
    "alertDialog": {
      "confirmText": "继续",
      "description": "此操作不可撤销。这将永久删除您的账户并移除您的全部数据。",
      "title": "您确定要执行此操作吗？"
    },
    "contextMenu": {
      "description": "在右键或桌面端手势位置显示位于指针坐标处的菜单。"
    },
    "dialog": {
      "confirmText": "继续",
      "description": "以关键内容打断用户并提示用户操作的中断式模态窗口。"
    },
    "draggableModal": {
      "description": "带拖拽标题栏与边界视口约束的桌面浮动窗口。",
      "sizeMenuTooltipDefault": "调整尺寸",
      "titleDefault": "检查器窗口"
    },
    "dropdownMenu": {
      "description": "显示由按钮触发的菜单，支持菜单项、标签、分隔线、快捷键与破坏性操作。"
    },
    "floatingNotice": {
      "description": "悬浮在窗口顶部或底部的规范化提示胶囊组件，支持优先级排队、多项卡片轮换与扩展槽位。"
    },
    "notificationStack": {
      "defaultLabel": "通知",
      "description": "浮动分级通知堆栈，支持按条目独立生命周期与行内操作。"
    },
    "popover": {
      "description": "在锚定于触发器的浮动 Portal 中展示富交互内容，具备无障碍焦点管理。"
    },
    "scaleOsd": {
      "description": "用于画布缩放调节的浮动屏幕显示胶囊，支持自动隐藏。"
    },
    "sheet": {
      "description": "扩展对话框组件，用于展示从任意屏幕边缘（顶部、右侧、底部、左侧）滑入的内容。"
    },
    "taskHud": {
      "description": "带进度、溢出与折叠汇总的后台执行浮动堆栈。",
      "dismissPrefix": "关闭",
      "label": "任务进度浮层"
    },
    "tooltip": {
      "description": "当元素获得键盘焦点或鼠标悬停时展示与之相关信息的浮层。"
    },
    "window-title-bar": {
      "description": "桌面端无边框窗口标题栏组件，包含应用标识、标题、拖拽移动区域以及最小化/最大化/关闭系统控制按钮。"
    },
    "smooth-wheel-handler": {
      "description": "桌面端平滑滚轮运动学辅助组件，提供连续物理动量阻尼累加、Shift+滚轮水平转置及触控拖拽解耦互斥。"
    },
    "virtual-list": {
      "description": "基于 TanStack Virtual 构建的高性能视口虚拟化长列表，支持 10 万+ 行数据流畅滚动与 DOM 动态回收。"
    },
    "virtual-tree": {
      "description": "虚拟化层级树视图组件，支持节点动态折叠展开、多选/单选、剪切复制粘贴及键盘空间导航。"
    },
    "virtual-grid": {
      "description": "二维自适应响应式虚拟化网格视图，支持海量卡片、图像矩阵与动态单元格布局渲染。"
    },
    "smoothWheelHandler": {
      "description": "提供连续物理动量阻尼、Shift＋滚轮横向转换与手势互斥的桌面端运动学滚动辅助。"
    },
    "virtualGrid": {
      "description": "二维自适应窗口化网格虚拟器，面向海量卡片、矩阵数据与动态布局。"
    },
    "virtualList": {
      "description": "基于 TanStack Virtual 构建的高性能视口虚拟化长列表，支持 10 万+ 行数据流畅滚动与 DOM 动态回收。"
    },
    "virtualTree": {
      "description": "虚拟化层级树视图组件，支持节点动态折叠展开、多选/单选、剪切复制粘贴及键盘空间导航。"
    },
    "windowTitleBar": {
      "description": "面向无边框原生窗口的桌面窗口框架头，含标题、拖拽区与最小化／最大化／关闭控制按钮。"
    },
    "generic-data-table": {
      "description": "基于 TanStack Table 构建的企业级通用数据表格，提供列头排序、实时筛选、行选择与分页控制。"
    },
    "query-builder": {
      "description": "可视化条件查询构建器，支持嵌套逻辑分组 (AND/OR)、字段选择、运算符谓词筛选及 JSON 结构序列化。"
    },
    "code-block": {
      "description": "规范驱动的代码语法高亮查看器，基于统一零依赖词法分析器与滚动、复制、标签组件构建，双端色彩与分词完全一致。"
    },
    "pipeline-view": {
      "description": "多阶段任务流水线执行视图，整合任务追踪队列、步骤时间线及虚拟化自动滚动日志控制台。"
    },
    "address-bar": {
      "description": "资源管理器与浏览器风格的地址导航栏，具备可交互的面包屑路径分段与行内路径即时编辑功能。"
    },
    "theme-settings": {
      "description": "跨端主题配置面板，统一管控外观模式、强调色调色板、装饰圆角阴影级别与界面缩放密度。"
    },
    "language-settings": {
      "description": "跨端语言偏好设置卡片，提供系统语言自动检测、即时生效切换与文化诗词意境引语。"
    },
    "keybinding-manager": {
      "description": "跨端快捷键与热键管理组件，支持反向按键搜索、多作用域过滤、冲突检测与速查表导出。"
    },
    "keybindingManager": {
      "activeResolver": "当前冲突解决",
      "addAlternative": "添加备用快捷键",
      "allScopes": "所有作用域",
      "clearSameChord": "清除相同按键筛选",
      "conflict": "冲突",
      "conflictExplanation": "该快捷键在同一作用域内被分配给了多个操作。请选择要保留或重新分配的操作。",
      "conflictTitle": "快捷键冲突",
      "conflictTooltip": "存在快捷键冲突，点击打开冲突解决器",
      "defaultSection": "常用操作",
      "export": "导出速查表",
      "exportTitle": "导出 Markdown 格式快捷键速查表",
      "noMatches": "未找到匹配的快捷键操作",
      "noMatchesHint": "请尝试调整搜索关键词或切换作用域筛选条件。",
      "resetAction": "还原为出厂默认快捷键",
      "resetAll": "重置全部",
      "resetAllTitle": "将全部快捷键还原为出厂默认设置",
      "sameChord": "相同快捷键：",
      "sandboxTitle": "交互式快捷键管理器",
      "scopeBadgeTooltip": "操作所属作用域",
      "scopeFilterTooltip": "按活动作用域过滤快捷键操作",
      "searchPlaceholder": "搜索操作名称或快捷键（如 Ctrl+）...",
      "searchTooltip": "搜索操作名称或输入按键（如 Ctrl+）进行反向查询",
      "unassigned": "未分配",
      "userModified": "用户自定义",
      "userModifiedTooltip": "此快捷键已被用户自定义修改"
    },
    "addressBar": {
      "description": "资源管理器与浏览器风格的地址导航栏，具备可交互的面包屑路径分段与行内路径即时编辑功能。"
    },
    "codeBlock": {
      "description": "基于 ChaSet 滚动条、复制、选项卡与卡片原语构建的规范驱动语法高亮代码查看器，底层依赖零第三方词法解析器，在 React 与 Qt Quick 上提供完全一致的词法标记与高亮配色。"
    },
    "genericDataTable": {
      "description": "由 TanStack Table 驱动的桌面级全功能数据表，支持列排序、过滤、选择与分页。",
      "filterPlaceholder": "过滤记录……",
      "next": "下一页",
      "pageOf": "第 {{current}} 页，共 {{total}} 页",
      "previous": "上一页"
    },
    "languageSettings": {
      "description": "跨端语言偏好设置卡片，提供系统语言自动检测、即时生效切换与文化诗词意境引语。"
    },
    "logConsole": {
      "empty": "暂无日志"
    },
    "pipelineView": {
      "description": "带任务追踪、步骤时间线与虚拟化自动滚动日志控制台的多阶段执行视图与流水线中心。"
    },
    "queryBuilder": {
      "description": "可视化条件查询构建器，支持嵌套逻辑分组 (AND/OR)、字段选择、运算符谓词筛选及 JSON 结构序列化。"
    },
    "stepTimeline": {
      "emptyText": "暂无步骤"
    },
    "table": {
      "description": "响应式语义化基础数据表格组件，具备行悬停高亮、精致分割边框与表头/表尾语义结构。",
      "emptyState": "暂无数据"
    },
    "themeSettings": {
      "description": "跨端主题配置面板，统一管控外观模式、强调色调色板、装饰圆角阴影级别与界面缩放密度。"
    }
  },
  "desktopComposite": {
    "app": {
      "docsTitle": "ChaSet 文档",
      "navLabel": "导航"
    },
    "buttonSection": {
      "asChildLink": "asChild 链接（<a>）",
      "asyncBlock": "异步与块级",
      "clear": "清空",
      "deleteItem": "删除项",
      "disabledButton": "禁用按钮",
      "emptyLog": "点击上方按钮查看点击事件……",
      "fullWidthAction": "全宽块级操作",
      "logTitle": "交互日志（点击事件）",
      "statesLabel": "状态",
      "title": "组件 · 按钮矩阵",
      "desc": "基于 @base-ui/react 实现的中立契约 (spec/components/button.ts)。包含完整的变体 × 尺寸矩阵、多态链接渲染和异步加载状态。"
    },
    "header": {
      "draggableModal": "可拖拽弹窗",
      "genericDataTable": "通用数据表",
      "githubRepo": "GitHub 仓库",
      "openNavSidebar": "打开导航侧边栏",
      "queryBuilder": "查询构建器",
      "splitter": "分栏",
      "toggleTheme": "切换主题外观",
      "virtualList": "虚拟列表"
    },
    "badge": {
      "overviewHeading": "交互式概览",
      "sizeSmall": "小号（sm）"
    },
    "button": {
      "iconLabel": "图标",
      "iconLgLabel": "图标-LG",
      "iconSmLabel": "图标-SM",
      "iconXsLabel": "图标-XS",
      "sandboxTitle": "按钮交互沙盒",
      "settingsAriaLabel": "设置"
    },
    "copyButton": {
      "sandboxTitle": "复制按钮沙盒"
    },
    "elidedText": {
      "overviewHeading": "交互式概览"
    },
    "kbd": {
      "altChoices": "备选按键：",
      "combinationsDesc": "支持多键组合、备选按键与紧凑修饰符符号。",
      "combinationsTitle": "组合键与符号",
      "commandPalette": "命令面板",
      "compactSymbols": "紧凑修饰符符号：",
      "completeLabel": "自动补全",
      "copyPathLabel": "复制路径",
      "dragHandleTooltip": "拖动右侧手柄以调整容器宽度。",
      "exportProject": "将项目导出为归档",
      "invertedTooltip": "反白（文字提示）",
      "menuDesc": "专用 Shortcut 组件，内置右对齐与防收缩行为，适用于菜单项。",
      "menuTitle": "菜单尾随快捷键",
      "multiModifier": "多修饰符序列：",
      "narrowDesc": "当父容器被压缩时，标签文本将被截断，而快捷键保持完整或压缩为符号。",
      "narrowTitle": "窄容器自适应",
      "newFile": "新建文件",
      "outlineDefault": "线框（默认）",
      "overviewHeading": "交互概览",
      "playgroundDesc": "拖动右侧手柄或调节滑块，观察快捷键栏如何历经 4 个自适应阶段：完整尺寸 → 挤压微缩 → 紧凑符号 → +N 折叠徽标与浮动气泡。",
      "playgroundTitle": "交互式多阶段响应式演练场",
      "presetCompact": "紧凑版（{{value}}）",
      "presetFolded": "折叠版（{{value}}）",
      "presetFull": "完整版（{{value}}）",
      "presetSqueezed": "挤压版（{{value}}）",
      "presetsLabel": "预设：",
      "sandboxTitle": "键位徽标沙盒",
      "saveDocument": "保存文档",
      "sizeSm": "小尺寸（sm）",
      "sizeXs": "超小尺寸（xs）",
      "stageCompact": "第 3 阶段：紧凑版（图标符号）",
      "stageFolded": "第 4 阶段：折叠版（+N 折叠）",
      "stageFull": "第 1 阶段：完整版（完整文字）",
      "stageSqueezed": "第 2 阶段：挤压版（等比微缩）",
      "variantInverted": "反白样式",
      "variantOutline": "线框样式",
      "variantSolid": "实心样式",
      "variantSubtle": "淡化样式",
      "veryLongAction": "超长操作名称将被截断",
      "widthBadge": "宽度：{{value}}",
      "widthLabel": "宽度："
    },
    "label": {
      "overviewHeading": "交互式概览",
      "sandboxTitle": "标签沙盒"
    },
    "separator": {
      "mitLicense": "MIT 许可证",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "分隔线沙盒",
      "stackBadge": "React 19 与 Qt 6"
    },
    "shortcutBar": {
      "cancel": "取消",
      "close": "关闭",
      "confirm": "确认",
      "moreShortcuts": "更多快捷键",
      "move": "移动",
      "nav": "导航",
      "open": "打开",
      "select": "选择",
      "selected": "选中",
      "toggle": "折叠/展开"
    },
    "skeleton": {
      "sandboxTitle": "骨架屏沙盒"
    },
    "splitButton": {
      "overviewHeading": "交互式概览",
      "sandboxTitle": "分体按钮沙盒"
    },
    "squircle": {
      "borderNote": "传统 CSS 边框在超椭圆剪裁下会出现宽度不均或硬直角。传入 borderWidth 与 borderColor 时，将自动渲染自适应连续曲率矢量描边，保证外轮廓厚度均匀。",
      "borderSupportLabel": "连续曲率描边支持：",
      "demoBadge": "次要徽标",
      "demoButton": "超椭圆按钮",
      "demoInput": "超椭圆输入框……",
      "demoOutline": "线框按钮",
      "demoPill": "状态胶囊",
      "guideDesc": "外部项目经由两层渐进增强策略接入 ChaSet iOS 连续曲率体系：底层经由现代浏览器 CSS 特性，以零成本加速全量 Tailwind 工具类；老旧环境或高精度带边框几何，则经由原语组件获得保真渲染。",
      "guideTitle": "外部项目全局接入指南（Global Adoption Guide for External Projects）",
      "installDesc": "包安装与 CMake／QML 模块链接。",
      "installHeading": "安装指南",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "超椭圆沙盒与曲率对比",
      "strategy1Desc": "在宿主项目的全局样式表（如 globals.css 或 index.css）中加入 CSS 特性查询。所有基于 Tailwind rounded-* 工具类的元素将即刻提升为 iOS 连续曲率超椭圆，平滑消除边缘生硬折痕。",
      "strategy1Title": "全局 CSS 加速（Universal CSS Acceleration）",
      "strategy2Desc": "对于弹窗（Dialog／Sheet）、高光卡片或不支持 CSS corner-shape 的浏览器内核，使用 ChaSet 组件进行包裹。内部经由 SVG clipPath 裁剪与 ResizeObserver 驱动的几何计算，保证 100％ 跨平台像素级平滑。",
      "strategy2Title": "保底渐进增强（Guaranteed Progressive Enhancement）",
      "strategy3Desc": "ChaSet 核心设计令牌内置曲率控制变量。宿主工程可在根层级定义 --cs-corner-shape 与 --cs-corner-smoothing，全库组件将自动继承对应曲率平滑度。",
      "strategy3Title": "设计令牌配置（Design Tokens Configuration）",
      "strategyBadge1": "策略一",
      "strategyBadge2": "策略二",
      "strategyBadge3": "策略三",
      "tailwindNote": "无需修改业务代码中的 rounded-md、rounded-lg、rounded-xl。浏览器匹配 corner-shape: squircle 后将直接应用超椭圆连续曲率，并由 .rounded-full 规则保护圆形头像与状态点不发生几何形变。",
      "tailwindSyncLabel": "Tailwind 协同机制："
    },
    "checkbox": {
      "overviewHeading": "交互式概览",
      "sandboxTitle": "复选框沙盒"
    },
    "colorPicker": {
      "overviewDesc": "在 Web（React）与桌面端（Qt Quick）体验模式、尺寸、色板与状态。",
      "sandboxTitle": "ColorPicker 沙盒"
    },
    "durationInput": {
      "overviewDesc": "直接在任意分段中键入，或使用上／下步进按钮。按左／右方向键在分段间跳转，或从分组快捷预设中选取。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "时长输入框沙盒"
    },
    "inlineEditableText": {
      "overviewDesc": "点击或双击下方文本进行修改，按 Enter确认，按 Esc取消。",
      "sandboxTitle": "行内编辑文本沙盒"
    },
    "input": {
      "overviewHeading": "交互概览",
      "sandboxTitle": "输入框沙盒"
    },
    "keybindingRecorder": {
      "overviewDesc": "点击下方录制框并按下任意按键组合（例如{{example}}）。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "快捷键录制器沙盒"
    },
    "mediaProgressBar": {
      "overviewHeading": "交互概览",
      "sandboxTitle": "媒体播放进度条沙盒"
    },
    "presetNumberInput": {
      "overviewDesc": "聚焦或点击输入框打开预设数值列表，点击条目填充字段，亦可自由输入自定义数值。",
      "sandboxTitle": "预设数值输入框沙盒"
    },
    "rangeSlider": {
      "overviewHeading": "交互式概览",
      "sandboxTitle": "区间滑块沙盒",
      "sizesStatesTitle": "尺寸与状态"
    },
    "readOnlyInput": {
      "overviewDesc": "通过可选掩码、显隐切换与一键复制，安全展示敏感凭据。",
      "overviewHeading": "交互概览",
      "sandboxTitle": "只读输入框沙盒",
      "variantsDesc": "提供默认与 sm 两种尺寸规格，以及语义化状态色彩配置。",
      "variantsTitle": "尺寸与状态变体"
    },
    "segmentedControl": {
      "annualTip": "年度归档（需要 Pro 方案）",
      "autoLabel": "自动",
      "dailyTip": "每日摘要视图",
      "darkLabel": "深色",
      "dayLabel": "日",
      "fixedWidthTitle": "固定宽度与截断",
      "galleryTip": "画廊视图",
      "globalFormatterTitle": "全局 tooltipFormatter 定制",
      "globalRenderTooltipTitle": "全局 renderTooltip 定制",
      "gridTip": "网格布局",
      "lightLabel": "浅色",
      "listTip": "列表布局",
      "menuInlineTitle": "菜单与行内标题",
      "monthLabel": "月",
      "monthlyTip": "每月概览日历",
      "overviewHeading": "交互式概览",
      "perOptionTitle": "带快捷键与箭头的逐项工具提示",
      "sandboxTitle": "分段控制器沙盒",
      "sizesBadgesTitle": "尺寸与徽标",
      "switchScheme": "切换应用配色方案",
      "themeTooltipFormat": "主题：{{label}} — 切换应用配色方案",
      "tooltipsHintsTitle": "工具提示与自定义提示",
      "tooltipsHintsDesc": "选项支持丰富的交互式提示框。您可以提供纯文本、快捷键徽章、自定义位置、富文本自定义内容或全局",
      "functionSuffix": "函数。",
      "weekLabel": "周",
      "weeklyTip": "每周时间线视图",
      "yearLabel": "年"
    },
    "select": {
      "overviewHeading": "交互式概览",
      "sandboxTitle": "选择器沙盒"
    },
    "slider": {
      "examplesTitle": "示例与状态",
      "sandboxTitle": "Slider 沙盒",
      "valueLabel": "数值"
    },
    "snapSlider": {
      "sandboxTitle": "离散吸附滑块沙盒"
    },
    "switch": {
      "overviewHeading": "交互式概览",
      "sandboxTitle": "开关沙盒"
    },
    "card": {
      "overviewDesc": "通过跨 Web 与桌面端同步的交互式子组件，测试卡片变体。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "卡片沙盒"
    },
    "collapsible": {
      "advancedOptionsQt": "高级系统选项",
      "advancedSettings": "高级项目设置",
      "defaultOpenDesc": "通过 defaultOpen 以初始展开态渲染非受控折叠面板。",
      "defaultOpenDescQt": "使用 defaultOpen 将折叠面板初始化为展开状态。",
      "defaultOpenHeading": "默认展开",
      "disabledDesc": "禁用触发器交互并降低不透明度，以阻止用户展开。",
      "disabledDescQt": "以半透明外观阻止点击与交互。",
      "disabledHeading": "禁用状态",
      "falseLabel": "关闭",
      "lockedSettings": "已锁定的高级设置",
      "overviewDesc": "通过实时控件切换折叠面板的展开／收起状态，或禁用用户交互。",
      "overviewHeading": "交互式概览",
      "protectedSettings": "受保护的开发者设置",
      "sandboxTitle": "折叠面板沙盒",
      "toggleLabel": "切换",
      "trueLabel": "开启",
      "vulkanBadge": "Vulkan 验证层：已启用",
      "buildFlags": "构建参数：--release --target=x86_64-pc-windows-msvc",
      "renderPipeline": "渲染管线：Vulkan 1.3 / D3D12 Ultimate"
    },
    "panelCard": {
      "collapseHint": "点击 chevron 图标或标题以折叠／展开卡片面板主体。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "面板卡片沙盒"
    },
    "resizable": {
      "horizontalDesc": "面板自动适应可用宽度，并提供带边界限制的交互式拖拽手柄。",
      "horizontalSandboxTitle": "水平可调分组",
      "horizontalTitle": "水平拆分",
      "nestedDesc": "在水平面板内嵌入垂直面板分组，构建多窗格 IDE 工作台与停靠面。",
      "nestedTitle": "嵌套可调布局",
      "playgroundDesc": "在水平与垂直方向间切换，动态测试可视抓握手柄样式。",
      "playgroundTitle": "交互式演练场"
    },
    "scrollArea": {
      "cellLabel": "单元格",
      "colCategory": "分类",
      "colCommit": "提交",
      "colFeatureName": "功能名称",
      "colStatus": "状态",
      "colTargetStack": "目标端",
      "dualAxisDesc": "当内容同时超出宽度与高度时，双滚动条将渲染同步转角。",
      "dualAxisTitle": "双向滚动",
      "horizontalClusterTitle": "水平集群",
      "horizontalDesc": "悬停底部滚动条以显示左右步进按钮。",
      "horizontalLeft": "左侧：回到起点（Home）与向左翻页",
      "horizontalRight": "右侧：向右翻页与到达末尾（End）",
      "horizontalSmooth": "支持平滑动画插值。",
      "horizontalTitle": "水平示例",
      "hotZoneDesc": "传统窄滚动条难以用鼠标精准命中。ChaSet 引入紧凑的 0.5rem 透明交互热区，配合从 0.25rem（静息）扩展至 0.5rem（悬停）的动画视觉指示器，采用 150ms 三次方缓动。",
      "hotZoneHit": "命中区：0.5rem 紧凑触发盒，防止误捕获光标。",
      "hotZoneHover": "悬停态：扩展至 0.5rem，具备高视觉可供性。",
      "hotZoneIdle": "静息态：0.25rem 纤细指示条，低打扰。",
      "hotZoneTitle": "双盒热区",
      "overviewDesc": "交互式演练场，演示跨端滚动条样式、步进分页与动态热区扩展。",
      "sandboxTitle": "滚动区域展示",
      "stepperDesc": "悬停滚动条将显示两端步进操作按钮：",
      "stepperTitle": "步进按钮",
      "verticalAuto": "到达边界时自动禁用。",
      "verticalBottom": "底部：向下翻页与回到底部（End）",
      "verticalClusterTitle": "垂直集群",
      "verticalTop": "顶部：回到顶部（Home）与向上翻页（85% 视口步进）"
    },
    "scrollBar": {
      "pageDown": "向下翻一页",
      "pageLeft": "向左翻一页",
      "pageRight": "向右翻一页",
      "pageUp": "向上翻一页",
      "toBottom": "到底",
      "toEnd": "到最右",
      "toLeft": "到最左",
      "toTop": "到顶"
    },
    "settingRow": {
      "overviewHeading": "交互概览",
      "sandboxTitle": "设置行沙盒"
    },
    "sidebar": {
      "docsNav": "文档导航",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "侧边栏沙盒"
    },
    "splitter": {
      "fileComponents": "▸ 组件",
      "fileLayout": "▸ 布局",
      "fileSrc": "▾ 源码",
      "horizontalDesc": "悬停于窗格间分隔条并横向拖拽以调整面板，双击重置。",
      "horizontalSandboxTitle": "水平分栏沙盒",
      "overviewHeading": "水平分栏",
      "verticalDesc": "上下窗格以水平分隔线划分，纵向拖拽以调整控制台输出。",
      "verticalSandboxTitle": "垂直分栏",
      "verticalTitle": "垂直分栏"
    },
    "splitterHandle": {
      "horizontalPrefix": "手柄亦可吸附于水平边缘（",
      "horizontalSuffix": "），用于底部控制台或抽屉调参。",
      "overviewDesc": "拖动右侧边缘手柄调整侧边栏宽度。双击或按 Enter 可重置为 200。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "分栏手柄沙盒",
      "verticalTitle": "垂直边缘手柄"
    },
    "tableOfContents": {
      "overviewHeading": "交互式概览",
      "readingPanePara": "注意大纲树如何映射嵌套标题结构，并随顶部横幅高度偏移平滑对齐。",
      "sandboxTitle": "大纲导航沙盒"
    },
    "tabs": {
      "examplesDesc": "选项卡变体、尺寸、徽章与禁用状态的视觉矩阵。",
      "overviewDesc": "测试交互式选项卡切换、胶囊与下划线样式、尺寸缩放及键盘方向键导航。",
      "sandboxTitle": "Tabs 沙盒"
    },
    "viewport": {
      "overviewDesc": "容器动态测量锚点至窗口底部的距离（window.innerHeight - rect.top - margin），并钳制内容高度以防溢出视口之外。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "视口约束容器沙盒",
      "variantsDesc": "配置自定义数值覆盖、字符串边界或自定义边距偏移。",
      "variantsTitle": "变体与边界"
    },
    "activityStack": {
      "accessibleLabel": "活动堆栈",
      "overflowLabel": "还有 {{count}} 项",
      "summaryText": "{{count}} 项{{label}}"
    },
    "contextMenu": {
      "overviewDesc": "在下方虚线容器内右键（或长按）以唤出右键菜单。",
      "sandboxTitle": "右键菜单沙盒"
    },
    "dialog": {
      "demoName": "亚历克斯",
      "examplesDesc": "常见模态对话框模式：桌面可拖拽窗口、确认对话框与提示公告。",
      "overviewDesc": "在 Web 与桌面端体验完整的模态行为，包含背景模糊、键盘 ESC 关闭与焦点收纳。",
      "sandboxTitle": "对话框沙盒"
    },
    "draggableModal": {
      "allocBadge": "128 个分配",
      "overviewDesc": "点击下方按钮打开可拖拽弹窗，支持尺寸预设、拖拽移位与高度自适应。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "可拖拽弹窗沙盒"
    },
    "dropdownMenu": {
      "overviewDesc": "点击下方触发器打开下拉菜单，完整支持键盘导航与快捷键。",
      "sandboxTitle": "下拉菜单沙盒"
    },
    "notificationStack": {
      "levelsTitle": "级别与操作",
      "overviewHeading": "交互概览",
      "sandboxTitle": "通知堆栈沙盒"
    },
    "popover": {
      "arrowButton": "箭头气泡弹窗",
      "arrowContent": "此气泡弹窗渲染锚定指针三角。",
      "arrowDesc": "直指触发器的锚定三角指示器",
      "arrowTitle": "带指向箭头",
      "examplesDesc": "常见交互配置，包括指向箭头与可拖拽位移。",
      "movableButton": "可移动气泡弹窗",
      "movableContent": "拖动顶部抓握条可将此气泡弹窗移至任意位置。",
      "movableDesc": "可自由位移气泡图层的交互式拖拽头",
      "movableTitle": "可移动拖拽手柄",
      "overviewDesc": "点击下方按钮切换锚定气泡卡片，测试方位对齐、指向箭头与可拖拽移动手柄。",
      "overviewHeading": "交互概览",
      "sandboxTitle": "气泡弹窗沙盒"
    },
    "scaleOsd": {
      "overviewHeading": "交互概览",
      "percentFormat": "{{percent}}%",
      "reset": "重置",
      "sandboxTitle": "缩放 OSD 沙盒",
      "uiScaleFormat": "界面缩放 {{percent}}%",
      "zoomIn": "放大",
      "zoomOut": "缩小"
    },
    "sheet": {
      "demoName": "亚历克斯",
      "demoRole": "资深基础架构师",
      "overviewDesc": "选择滑入边缘与尺寸预设，然后触发抽屉弹窗。",
      "sandboxTitle": "抽屉沙盒"
    },
    "taskHud": {
      "anchorLabel": "锚点：{{placement}}",
      "overflowSandboxTitle": "折叠与溢出",
      "sandboxTitle": "Task HUD 沙盒"
    },
    "tooltip": {
      "examplesDesc": "覆盖全部 4 个方向放置与交互状态的常见 Tooltip 配置视觉矩阵。",
      "examplesDescQt": "Qt Quick 桌面端 Tooltip 方向放置视觉矩阵。",
      "overviewDesc": "测试交互式悬停延迟、方位放置、键盘快捷键角标、方向箭头与禁用行为，覆盖 Web 与 Qt Quick 桌面端。方位策略：纵向密集列表（菜单项、下拉选项、侧边导航、虚拟列表行）默认朝右，气泡不会遮挡上/下相邻的同级项；顶部停靠栏默认朝下；底部停靠栏朝上；弹窗关闭按钮朝下；其余场景朝上。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "文字提示沙盒"
    },
    "smoothWheelHandler": {
      "bullet1": "• 动量累加：连续滚轮步进线性累加至目标位置，绝不打断或阻滞当前的运动过渡。",
      "bullet2": "• 手势解耦：自动监听 targetItem.moving 与 flicking 状态。当用户触碰或拖动视图时，平滑动画立即中止以消除动作对抗。",
      "bullet3": "• 即插即用：可直接无缝附加至任意 Flickable / ListView / GridView 或 ChaSetScrollArea，无需重构现有视觉层级。",
      "card1Desc": "当滚轮发生快速连续触发时，增量位移会平滑累加至当前目标位置，而不会产生向后回弹或跳动卡顿。",
      "card1Title": "连续动量累加",
      "card2Desc": "在水平滚动视口或横向走马灯中，自动拦截按住 Shift 时的垂直滚轮动作，并将其无缝映射为水平平移位移。",
      "card2Title": "Shift+滚轮水平转置",
      "card3Desc": "当用户触碰滑块手柄或使用触控板扫动时，立即中断平滑滚动插值，保证零物理冲突与摩擦。",
      "card3Title": "手势与拖拽解耦",
      "dampingDuration": "阻尼减速时长:",
      "itemBadge": "项 #{{index}}",
      "itemLabel": "平滑滚动项 #{{index}}",
      "kinematicsTitle": "运动学物理架构",
      "sandboxTitle": "平滑滚轮沙盒",
      "speedMultiplier": "滚动速率倍率:"
    },
    "virtualGrid": {
      "assetLabel": "资源 #{{index}}",
      "btn20": "卡片 #20",
      "btn40": "卡片 #40",
      "btn500": "卡片 #500",
      "btnBottom": "底部 (#60)",
      "btnBottom1000": "底部 (#1,000)",
      "btnTop": "顶部 (#1)",
      "hint": "以响应式复用池渲染 1,000 张网格卡片:",
      "itemDesc": "虚拟视口卡片单元资源 {{index}}",
      "itemTitle": "模块 #{{index}}",
      "overviewDesc": "虚拟化自适应卡片列，自动计算宽度并按行回收 DOM。使用下方控件进行编程式导航。",
      "overviewHeading": "交互概览",
      "pending": "待处理",
      "sandboxTitle": "虚拟网格沙盒"
    },
    "virtualList": {
      "btn2500": "索引 #2,500",
      "btn500": "索引 #500",
      "btnBottom": "底部 (#10,000)",
      "btnTop": "顶部 (#1)",
      "hint": "以原生滚轮惯性流畅渲染 10,000 条虚拟数据项:",
      "itemTitle": "数据集项目 #{{index}}",
      "overviewHeading": "交互式概览",
      "production": "生产环境",
      "renderingHint": "以 60fps 流畅渲染 {{count}} 个虚拟项。使用下方控件触发编程式滚动，或快速滚动观察即时窗口化。",
      "sandboxTitle": "虚拟列表沙盒",
      "searchPlaceholder": "搜索...",
      "emptyFiltered": "无匹配项目",
      "emptyDefault": "列表为空",
      "staging": "预发布"
    },
    "virtualTree": {
      "clipboardCleared": "剪贴板已清空。",
      "clipboardEmpty": "剪贴板为空。请先按 Ctrl+C 复制或 Ctrl+X 剪切项目。",
      "collapseAll": "全部折叠",
      "copiedBadge": "{{count}} 项已复制（呼吸态）",
      "copyBtn": "复制 (Ctrl+C)",
      "copyStatus": "已复制 {{count}} 项（呼吸态）。请选择目标项并按 Ctrl+V 粘贴，或按 Esc 取消。",
      "cutBadge": "{{count}} 项已剪切（半透明）",
      "cutBtn": "剪切 (Ctrl+X)",
      "cutStatus": "已剪切 {{count}} 项（半透明）。请选择目标项并按 Ctrl+V 粘贴，或按 Esc 取消。",
      "deleteBtn": "删除 (Del)",
      "deletedStatus": "已删除 {{count}} 项。",
      "dirBadge": "目录",
      "droppedCopied": "已复制 {{source}} -> {{pos}} \"{{target}}\"。",
      "droppedMoved": "已移动 {{source}} -> {{pos}} \"{{target}}\"。",
      "expandAll": "全部展开",
      "hudCancel": "取消",
      "hudCopyToTarget": "复制到目标",
      "hudCopyVerb": "复制到",
      "hudCountPrefix": "{{count}} 项 · ",
      "hudDragging": "拖拽中 ({{count}} 项)",
      "hudHold": "按住",
      "hudHoldCtrl": "按住 Ctrl",
      "hudInside": "{{prefix}}{{verb}}: {{target}}",
      "hudMoveToTarget": "移动到目标",
      "hudMoveVerb": "移入",
      "hudPressEsc": "按 Esc",
      "hudRelease": "松开",
      "hudReleaseLeft": "松开左键",
      "hudSibling": "{{prefix}}放置在同级: {{target}}",
      "mode": "模式: {{mode}}",
      "multi": "多选",
      "noTarget": "未选择粘贴目标。",
      "none": "无",
      "overviewDesc": "支持多选（Ctrl／Shift＋点击）、外部半透明剪切态（Ctrl+X／V）、复制态（Ctrl+C／V）、Ctrl＋拖拽复制与键盘导航的层级树。",
      "overviewHeading": "交互式概览",
      "pasteBtn": "粘贴 (Ctrl+V)",
      "pastedCopied": "已将 {{count}} 项复制至 \"{{target}}\"。",
      "pastedMoved": "已将 {{count}} 项移动至 \"{{target}}\"。",
      "readyStatus": "就绪。请尝试选择文件或拖拽重排（按住 Ctrl 拖拽可复制）。",
      "resetStatus": "已重置树结构为默认值。",
      "sandboxTitle": "虚拟树沙盒",
      "selectedLabel": "已选:",
      "single": "单选"
    },
    "windowTitleBar": {
      "appTitle": "ChaSet 桌面工作室",
      "captionEvent": "窗口标题栏操作事件:",
      "clientArea": "无边框原生客户端窗口区域",
      "closeClicked": "点击关闭",
      "idle": "空闲",
      "maximizeClicked": "点击最大化 / 还原",
      "minimizeClicked": "点击最小化",
      "overviewDesc": "带原生风格操作按钮的无边框窗口标题栏。",
      "sandboxTitle": "窗口标题栏沙盒"
    },
    "addressBar": {
      "activePath": "当前路径:",
      "activePathFormat": "当前路径: {{path}}",
      "backTooltip": "后退",
      "forwardTooltip": "前进",
      "locProjectRoot": "项目根目录",
      "locSystem32": "系统目录 (System32)",
      "locPosixLog": "POSIX 日志 (/var/log)",
      "quickLocations": "快捷位置:",
      "refreshes": "刷新次数: {{count}}",
      "refreshTooltip": "刷新",
      "sandboxTitle": "Address Bar 沙盒",
      "searchPlaceholder": "搜索...",
      "searchTooltip": "搜索",
      "upTooltip": "上一级"
    },
    "breadcrumb": {
      "allLocations": "所有位置",
      "emptyFolder": "（空文件夹）",
      "expandSubfolders": "展开 %1 的子文件夹",
      "noMatch": "未找到匹配文件夹",
      "searchPlaceholder": "搜索文件夹...",
      "showHiddenAncestors": "显示隐藏的祖先文件夹"
    },
    "reorderableList": {
      "toggleTooltip": "显示/隐藏"
    },
    "codeBlock": {
      "embeddedBadge": "嵌入",
      "embeddedDesc": "去除卡片边框、背景与顶部栏，适用于行内嵌入",
      "gutterDesc": "带有右对齐行号的左侧指示槽",
      "monochromeDesc": "使用相同布局结构的单色基础渲染回退",
      "multiFileDesc": "传入 files 数组渲染多文件选项卡组。每个标签页独立携带其语言类型，且复制按钮始终作用于当前激活的文件。",
      "multiFileTitle": "多文件标签组",
      "overviewDesc": "带语言标签与一键复制的语法高亮源码查看器，高亮由共享规范词法器生成，双端均不内置第三方高亮器。",
      "sandboxTitle": "代码块沙盒",
      "variantsDesc": "行号指示槽、软换行、带垂直滚动的高度边界、单色回退模式，以及面向行内正文的无边框内嵌模式。",
      "variantsTitle": "变体与配置",
      "wrapBadge": "换行",
      "wrapDesc": "长代码行软换行展示，避免水平滚动"
    },
    "genericDataTable": {
      "colId": "ID",
      "colName": "用户名",
      "colRole": "职位",
      "overviewDesc": "点击列头以升序与降序排序。",
      "roleArchitect": "首席架构师",
      "roleDevOps": "DevOps 运维工程师",
      "roleFrontend": "前端工程师",
      "roleProduct": "产品经理",
      "roleQt": "Qt 专家",
      "sandboxTitle": "通用数据表沙盒",
      "statusOffline": "离线",
      "statusPending": "待审核"
    },
    "languageSettings": {
      "sandboxTitle": "交互式语言设置"
    },
    "pipelineView": {
      "jobBenchmark": "性能基准测试集",
      "jobPackage": "打包构建产物",
      "jobShaderComp": "着色器编译",
      "overviewDesc": "组装任务追踪、纵向步骤时间线与虚拟化自动滚动日志控制台的高性能执行检查器，所有子组件亦可独立消费。",
      "overviewHeading": "交互式概览",
      "sandboxTitle": "流水线视图沙盒",
      "stepCompileFragment": "编译片段着色阶段",
      "stepCompileVertex": "编译顶点着色阶段",
      "stepDeadCode": "消除死代码",
      "stepEmitBinary": "生成目标二进制",
      "stepParseSpirv": "解析 SPIR-V 字节码",
      "stepRegAlloc": "硬件寄存器分配"
    },
    "queryBuilder": {
      "addCondition": "+ 添加条件",
      "addGroup": "+ 添加分组",
      "combinatorLabel": "逻辑连接符: {{combinator}}",
      "contains": "包含",
      "deleteGroup": "删除分组",
      "equals": "等于",
      "fieldAge": "年龄",
      "fieldIsActive": "是否激活",
      "fieldPlaceholder": "选择字段",
      "fieldRole": "职位",
      "fieldStatus": "状态",
      "fieldUserName": "用户名",
      "operatorPlaceholder": "运算符",
      "overviewDesc": "动态添加规则与嵌套分组，构建复杂查询谓词。",
      "removeCondition": "移除条件",
      "rulesCount": "规则数: {{count}}",
      "sandboxTitle": "Query Builder 沙盒",
      "serializedModel": "序列化 JSON 查询模型:",
      "valuePlaceholder": "输入数值..."
    },
    "table": {
      "caption": "您最近的发票明细列表。",
      "colAmount": "金额",
      "colInvoice": "发票编号",
      "colMethod": "支付方式",
      "colRole": "角色",
      "colState": "执行状态",
      "colTask": "任务项",
      "colUser": "用户",
      "examplesDesc": "常见表格模式与交互配置。",
      "examplesDescQt": "Qt Quick 中的常见配置与视觉状态。",
      "filterPlaceholder": "过滤发票...",
      "methodBankTransfer": "银行转账",
      "methodCreditCard": "信用卡",
      "noResults": "未找到匹配数据。",
      "overviewDesc": "通过实时筛选、行选中与同步的 React／Qt Quick代码测试交互式数据表格控件。",
      "roleAdmin": "管理员",
      "roleDesigner": "设计师",
      "roleDev": "开发人员",
      "sandboxTitle": "表格沙盒",
      "showCaption": "显示表尾说明",
      "simpleTableDesc": "无表头底色或表尾摘要的轻量展示表格。",
      "simpleTableTitle": "极简数据表格",
      "stateComplete": "已完成",
      "stateInReview": "审核中",
      "statePlanned": "规划中",
      "statusAll": "全部",
      "statusCardDesc": "内嵌状态指示徽标与支持交互式行选中的表格形态。",
      "statusCardTitle": "状态徽标与行选中",
      "statusPaid": "已支付",
      "statusPending": "待处理",
      "statusUnpaid": "未支付",
      "taskApiIntegration": "接口联调",
      "taskDocumentation": "文档编写",
      "taskUnitTesting": "单元测试",
      "total": "总计",
      "userAlice": "爱丽丝",
      "userBob": "鲍勃",
      "userCarol": "卡罗尔"
    },
    "themeSettings": {
      "sandboxTitle": "交互式主题设置"
    }
  },
  "getStarted": {
    "icons": {
      "centering": {
        "desc": "居中是图形几何本身的内在属性，绝非外层组件事后打补丁修正。门禁测量绘制包围盒（矢量形状加上半描边），当其中心偏离网格中心超过 {{tolerance}} 单位时直接判错。锚点偏移和内边距并非被允许的修复方案：它们居中的只是矩形框，而不是真正的油墨图形。",
        "measuredOffsetsTitle": "实测偏移量 — 绘制中心减去网格中心 (网格单位)",
        "osdTrioDesc": "这三个控件曾经使用普通文本字符：粗体加号、粗体减号和常规重置箭头。不仅字重混乱，字体的升部与降部不对称更导致箭头在胶囊按钮内严重下偏。现在它们全部重构为本规范中的纯矢量图标——相同描边、相同网格、几何内在居中。",
        "osdTrioTitle": "缩放 HUD 控制三元组",
        "title": "视觉光学居中"
      },
      "configuration": {
        "consumingIcons": "消费与调用图标",
        "currentlyResolved": "当前解析来源：{{source}}。",
        "desc": "宿主若需将 ChaSet 整体锁定为特定图标规范，无需修改库代码。只需在外部声明规范 ID；生成器会将解析后的 ID 编译入双端产物中，运行时可通过 ICON_SPEC_ID (Web) 和 ChaSetIcons.specId (桌面端) 实时读取。",
        "envOverride": "环境变量覆盖",
        "envOverrideDesc": "适用于在多个图标规范下并行构建相同源码的 CI 矩阵。",
        "firstMatchWins": "首个匹配胜出",
        "projectConfigDesc": "将此配置提交至包清单同级目录下，为所有构建该工程的人员统一固定图标规范。",
        "projectConfigFile": "项目配置文件",
        "resolutionOrder": "解析优先级顺序",
        "stepConfigLabel": "项目配置 chaset.config.json → icons.spec",
        "stepConfigVal": "项目级配置；提交至版本库，跟随代码库一同生效。",
        "stepEnvLabel": "环境变量 CHASET_ICON_SPEC",
        "stepEnvVal": "最高优先级 — 支持单 Shell、CI 任务单独注入，无需修改代码文件。",
        "stepFallbackLabel": "首个已实现规范",
        "stepFallbackVal": "终极兜底方案，确保缺少配置时绝不中断构建。",
        "stepRegistryLabel": "规范注册表 spec/icons/registry.json → activeSpec",
        "stepRegistryVal": "库级默认规范，在宿主未做声明时生效。",
        "title": "外部配置"
      },
      "extensibility": {
        "adoptionRatchet": "采纳收敛棘轮",
        "adoptionRatchetDesc": "在 {{budget}} 个配额预算中，现有迁移积压中剩余 {{total}} 处手写 <svg> 图形。若此数值上升门禁将直接报错，确保积压只会持续减少。",
        "desc": "注册表维护着一份规范清单，而非单一硬编码。引入新规范只需新增具有独立网格、描边和图形的条目；两端代码无需任何修改，均能自动消费配置所选中的规范。",
        "excusedFootnote": "参数化矢量图无 24 网格描边表示，因此计入预算会导致预算永久不可达。此类图形被显式排除——且仅能通过携带原因说明的标记进行标注，该标记必须直接位于被豁免图形正上方。任何未说明原因、悬空或未附加至其后 <svg> 的标记均将导致门禁报错。",
        "excusedNone": "无。仓库中所有内联图形均需完成迁移。",
        "excusedTitle": "豁免非图标图形 ({{total}})",
        "textGlyphsDesc": "剩余 {{count}} 处。加号、减号和重置箭头等字符本质上是排版文字：它们会直接继承周围正文的字重、字号与基线——这也是本规范旨在彻底根除的两大缺陷根源。",
        "textGlyphsTitle": "充当图标的文本字符",
        "title": "扩展规范",
        "workflow": "开发工作流"
      },
      "gallery": {
        "desc": "激活规范下的所有图标，依据生成注册表按名称渲染。向注册表新增图标即可同时在双端呈现，门禁将拒收任何无几何图形支撑的虚假名称。",
        "title": "图标画廊"
      },
      "grids": {
        "desc": "网格将绘制区域与其期望的描边宽度相匹配，并明确声明其目标渲染尺寸。ChaSet 声明了两种网格：用于常规 UI 图标、专为 16px 渲染绘制的默认 24 单位网格，以及 1 单位描边在窗口标题栏上保持极细而不糊成亚像素模糊的密集 10 单位界面网格。",
        "desktopLabel": "桌面端 · {{size}}",
        "drawnFor": "目标尺寸 {{renderSize}}px → {{stroke}}px 描边",
        "familiesDeclared": "{{count}} 组已声明",
        "familiesDesc": "控件家族将同一控件中同时呈现的图标聚合命名。网格是对整个控件而非单个图标的一致性承诺。门禁断言严格保障同一家族绝不能横跨两种不同网格。",
        "familiesTitle": "控件家族",
        "floor": "底限 {{size}} / {{strokeWidth}} = {{floor}}px",
        "gridBadge": "{{size}} 单位 · 描边 {{strokeWidth}}",
        "gridDesc": "{{renderSize}}px 是该网格的设计目标渲染尺寸，在此尺寸下描边宽度恰好为 {{stroke}}px——这也是图形比例所承载的标准字重。低于 {{floor}}px 时描边不足 1 像素，图标视觉会显得轻于预期，因此该网格精准呈现的字阶为 {{sizes}}。不在列表中的尺寸不是更小的图标，而是变淡的图标——由于高分屏 (2x) 视觉宽容度较高，门禁并未直接报错，而是列出所有低于底限的引用以促成审慎决策。",
        "safeMargin": "安全边距 {{margin}}",
        "sizeRampTitle": "尺寸梯度 — 同一图标全梯度自适应呈现，无需人工缩放",
        "title": "网格、字重与尺寸",
        "unitGridBadge": "{{size}} 单位网格",
        "webLabel": "Web 端 · {{size}}",
        "weightPermitted": "{{count}} 种允许",
        "weightStrokePrefix": "描边 {{strokeWidth}} — ",
        "weightTitle": "粗细分级"
      },
      "rules": {
        "desc": "以下每条规则均由 pnpm check:icons 严格检验（该指令同样运行于 pnpm gate 中）。未经机器检验的规则只是口号，因此检验列明确标注了断言失败的具体项。",
        "title": "治理规则"
      },
      "specification": {
        "desc": "图标仅在 spec/icons/registry.json 中声明一次，并通过代码生成器分发至双端。React 原生渲染元素标签；Qt 接收编译为路径数据的相同形状。两端均不私自拥有独立图形，从源头上保障双端一致性而非依赖人工走查。",
        "iconsCount": "{{count}} 个图标",
        "rowColour": "颜色规范",
        "rowFill": "填充策略",
        "rowGrid": "网格尺寸",
        "rowLive": "活动区域",
        "rowResolved": "解析来源",
        "rowStroke": "描边属性",
        "rowTolerance": "居中容差",
        "title": "激活规范",
        "valGrid": "{{grid}} 单位",
        "valLive": "{{liveArea}} 单位 (安全边距 {{margin}})",
        "valStroke": "{{strokeWidth}} 单位, {{linecap}} 端点, {{linejoin}} 连接",
        "valTolerance": "{{tolerance}} 单位"
      }
    },
    "intro": {
      "architecture": {
        "title": "工作机制与架构"
      },
      "packages": {
        "colDesc": "描述",
        "colPackage": "工程包",
        "colTarget": "目标平台",
        "pkgQtDesc": "内置原生 QML 组件的 Qt 参考实现。",
        "pkgReactDesc": "发布到 npm 的 React 组件库。",
        "pkgSpecDesc": "中立令牌生成器与契约规范模型。",
        "title": "工程包结构"
      },
      "philosophy": {
        "desc": "ChaSet 是 ChahuProject 生态系统的一部分。在传统多平台应用中，Web 与桌面端设计系统容易迅速分化漂移。ChaSet 通过建立中立、机器可读的设计规范与令牌分片层，同时驱动 React 与 Qt 实现像素级与行为级对齐。",
        "nativeErgonomicsDesc": "React 端采用 Tailwind CSS v4 与 Base UI；Qt 端采用纯 QML Quick Controls——绝无 Electron 臃肿或生硬的异构包装。",
        "nativeErgonomicsTitle": "原生体验与人体工学",
        "oneSourceDesc": "设计令牌与 API 契约均驻留在 spec/ 中，为 Web 与 Qt 生成完全同步的代码与资源。",
        "oneSourceTitle": "单一真理源",
        "parityGateDesc": "持续集成严格校验所有必需能力规范与视觉渲染，保障双端 100% 契合。",
        "parityGateTitle": "自动化对齐门禁",
        "title": "设计理念"
      },
      "quickstart": {
        "buttonText": "启动工作区",
        "installDesc": "安装包及对等依赖：",
        "title": "快速上手",
        "titleReact": "快速上手 (React)",
        "useAppDesc": "在应用中使用：",
        "useReactDesc": "在 React 项目中使用："
      }
    },
    "themeTuner": {
      "playground": {
        "buttonLabel": "按钮文案",
        "buttonPlaceholder": "按钮文本",
        "buttons": "按钮集合",
        "clicks": "点击次数: {{count}}",
        "copyJsx": "复制 JSX",
        "danger": "危险",
        "defaultActionLabel": "默认操作",
        "defaultProjectLabel": "创建项目",
        "desc": "实时调整属性、与组件交互，并直接复制可用的代码到项目中。",
        "descQml": "直接与在当前样式配置下渲染的组件进行交互：",
        "disabled": "禁用",
        "fullWidth": "占满宽度",
        "ghostAction": "幽灵按钮",
        "jsxUsage": "React JSX 使用方式",
        "linkAction": "链接按钮",
        "loadingSpinnerActive": "加载中转轮激活",
        "loadingState": "加载状态",
        "miniScrollViewport": "微型滚动视口",
        "outline": "轮廓",
        "renderAsLink": "多态渲染 (Base UI <a> 链接)",
        "saving": "保存中...",
        "secondary": "次要",
        "size": "尺寸",
        "title": "交互式组件沙盒",
        "titleQml": "实时组件沙盒",
        "variant": "变体样式",
        "viewportItem": "列表项 #{{index}}"
      },
      "tuner": {
        "accentPreset": "强调色预设",
        "animSpeedFactor": "动画时长倍率",
        "appearance": "外观与模式",
        "cardPanel": "卡片面板",
        "copyConfig": "复制配置",
        "copyConfigTooltip": "将主题配置导出为 CSS、Tailwind 或 JSON",
        "cornerRadius": "圆角半径 (--RADIUS)",
        "destructive": "危险操作",
        "focusRing": "聚焦轮廓",
        "liveColorOverrides": "实时颜色覆盖",
        "motionTitle": "动效与过渡",
        "pageBackground": "页面底色",
        "primaryAction": "主操作背景",
        "primaryText": "主操作文字",
        "radiusDefault": "0.5rem (默认)",
        "radiusPill": "24px (胶囊)",
        "radiusSharp": "0px (直角)",
        "resetTooltip": "重置所有自定义颜色覆盖",
        "secondaryBg": "次要背景",
        "speedDefault": "0.20s (默认)",
        "speedFast": "0.05s (快速)",
        "speedSlow": "0.80s (缓慢)",
        "title": "主题与样式微调器"
      }
    },
    "tokens": {
      "palette": {
        "copySwatchTitle": "点击复制 CSS 变量",
        "desc": "全部衍生自 spec/tokens.json。点击色块即可复制对应的 CSS 变量表达式。",
        "title": "调色板 · 核心语义令牌"
      },
      "typographyRadius": {
        "chartPaletteTitle": "图表调色板 (跟随强调色)",
        "codeComment1": "const fontSystem = ChaSet.FontSystem; // 自动处理中文字体回退，消除宋体锯齿",
        "codeComment2": "console.log(`[ChaSet] CJK glyphs: 字体平滑清晰, zero raster artifacts`);",
        "desc": "圆角衍生自 --radius（遵循与 shadcn 相同的 sm/md/lg/xl 规则）；字重映射到 tokens.json 基元（500/600）；图表五色跟随强调色。",
        "fontSystemTitle": "字体系统 · 中日韩回退与排版梯度",
        "monoFallback": "回退字体栈 (Mono): ",
        "radiusDefault": "0.5rem (默认)",
        "sampleBold": "Bold 700 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)",
        "sampleMedium": "Medium 500 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)",
        "sampleRegular": "Regular 400 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)",
        "sampleSemibold": "Semibold 600 — ChaSet 组件库 · 跨端统一字体系统 (The quick brown fox jumps over the lazy dog 0123456789)",
        "sansFallback": "回退字体栈 (Sans): ",
        "title": "排版 / 圆角 / 图表",
        "zeroSimSunBadge": "零宋体劣化保障"
      }
    },
    "typography": {
      "integration": {
        "cmakeTitle": "1. CMake 目标链接",
        "cppTitle": "2. C++ 初始化流程 (main.cpp)",
        "cssTokensDesc": "自定义字体栈时请引用 var(--cs-font-sans) 与 var(--cs-font-mono)，以保留高优先级的中文字体回退链：",
        "cssTokensTitle": "CSS 令牌与字体族覆盖",
        "desc": "宿主应用程序在桌面端与 Web 运行时如何配置并初始化 ChaSet 排版子系统。",
        "desktopDesc": "桌面应用通过 ChaSet::FontSystem 初始化排版系统。在 main.cpp 中配置 DirectWrite 原生光栅化与纵向微调，并向 QFontDatabase 注入中日韩回退字表以杜绝小字号点阵断裂劣化。",
        "desktopTitle": "桌面端 · Qt Quick (C++ / QML)",
        "envCurve": "curve: 硬件 GPU 曲线光栅化器 (CurveTextRendering, Qt 6.7+)。覆盖率由轮廓逐像素积分得出，高分屏下具备无级缩放优势。软件光栅化激活时自动降级到 qt。",
        "envDesc": "窗口级文本光栅化策略在启动前可通过 CHASET_TEXT_RENDER 环境变量动态控制：",
        "envNative": "native (默认): 操作系统光栅化器 (DirectWrite / CoreText, NativeTextRendering)。小字号正文字符紧贴像素网格极致清晰，保证 100% 缩放下笔画连续完整。",
        "envQt": "qt: Qt 字形轮廓光栅化器 (QtTextRendering)。采样自平台字形位图的灰度轮廓光栅化。",
        "envTitle": "3. 环境变量控制 (CHASET_TEXT_RENDER)",
        "title": "宿主接入集成",
        "webDesc": "Chromium 与现代浏览器中的 Web 应用通过 CSS 变量自动继承灰度抗锯齿 (-webkit-font-smoothing: antialiased) 及中日韩回退字体链。环境变量和 C++ 初始化不适用于 Web 栈。",
        "webTitle": "Web 端 · Chromium (React / CSS)"
      },
      "ramp": {
        "desc": "五种文字体系展示区，每个字阶梯度完整渲染一次。每个展示块中文段固定不变，以便横跨整个字阶比对笔画细节——尤其是最容易暴露网格微调失真的中日韩与韩文字形弧线。字号严格遵循字阶与界面缩放比，使用语义令牌而非具体单位命名。",
        "title": "跨文字体系字阶梯度"
      },
      "rasterizer": {
        "desc": "双端通过不同的光栅化引擎实现一致的字形轮廓。Web 端把平滑交给 Chromium，从不把轮廓贴合到像素网格；桌面端在首个窗口创建前为整个进程确定唯一策略，并在 GPU 上逐像素对轮廓积分——这正是笔画既能抗锯齿、又能保持锐利的原因。",
        "desktopCardTitle": "桌面端 · Qt Quick",
        "labelFitting": "轮廓贴合",
        "labelHinting": "微调微指令",
        "labelPolicies": "可选策略",
        "labelRasterizer": "光栅化引擎",
        "labelScale": "界面缩放",
        "labelSmoothing": "字体平滑",
        "labelSubpixel": "次像素抗锯齿",
        "qtValHinting": "纵向微调 (PreferVerticalHinting)",
        "qtValPolicies": "native (默认) · curve · qt",
        "qtValRasterizer": "由 CHASET_TEXT_RENDER 选定",
        "qtValScale": "在每个字号令牌上应用 uiScale 倍率",
        "qtValSubpixel": "已禁用 — 仅灰度渲染",
        "title": "光栅化管线",
        "webCardTitle": "Web 端 · Chromium",
        "webValFitting": "无 — 排版塑形紧贴数学轮廓",
        "webValRasterizer": "灰度 Alpha 抗锯齿",
        "webValScale": "根节点字体尺寸倍率",
        "webValSmoothing": "抗锯齿 · 灰度"
      }
    }
  },
  "formsA": {
    "checkbox": {
      "autoSyncDesc": "空闲时每 5 分钟与远程服务器同步数据。",
      "autoSyncLabel": "后台自动同步",
      "checked": "已选中",
      "checkedByDefault": "默认选中",
      "defaultSizeLabel": "默认尺寸 (text-sm)",
      "descriptionLabel": "辅助描述",
      "disabledReadOnlyDesc": "半透明不可交互与锁定呈现对比",
      "disabledReadOnlyTitle": "禁用与只读状态",
      "disabledUnchecked": "禁用未选中",
      "examplesSubtitle": "常见复选框配置、尺寸、辅助描述与状态的视觉矩阵。",
      "helperDescSubtitle": "多行主标签与详细辅助说明文本",
      "helperDescTitle": "带辅助说明文本",
      "indeterminate": "半选状态",
      "indeterminateDesc": "表示部分子项已被选中的中间状态",
      "indeterminateTitle": "半选状态",
      "invalid": "错误高亮",
      "invalidDesc": "高亮显示未勾选的必选确认项",
      "invalidTitle": "错误 / 非法状态",
      "mandatoryDesc": "必须同意合规条款后方可继续安装配置。",
      "mandatoryLabel": "合规强制确认",
      "overviewDesc": "测试复选框的交互切换、半选状态、辅助说明文本、错误状态以及跨 Web 和 Qt 桌面的多尺寸规格。",
      "readOnly": "只读",
      "readOnlyChecked": "只读已选中",
      "sandboxDescription": "您同意自动扣费政策与隐私指引规范。",
      "sandboxLabel": "同意服务条款与隐私政策",
      "selectAllSubtasks": "全选所有子任务",
      "sizeSm": "紧凑 (sm)",
      "sizeVariantsDesc": "默认尺寸与紧凑尺寸对比",
      "sizeVariantsTitle": "尺寸规格",
      "smSizeLabel": "紧凑尺寸 (sm, text-xs)",
      "task1": "任务 1：需求评审",
      "task2": "任务 2：功能实现",
      "uncheckedByDefault": "默认未选中",
      "uncheckedCheckedDesc": "标准交互切换状态",
      "uncheckedCheckedTitle": "未选中与选中"
    },
    "input": {
      "bordered": "带边框",
      "charsCount": "{{count}} 个字符",
      "clearable": "可清除",
      "clearableInputDesc": "支持点击清除按钮或按下 Escape 键清空",
      "clearableInputTitle": "可清除输入框",
      "clearableInputVal": "点击叉号清除文本",
      "defaultInputDesc": "带占位提示的标准文本输入框",
      "defaultInputPlaceholder": "请输入用户名...",
      "defaultInputTitle": "默认输入框",
      "disabledInputDesc": "半透明且不可交互",
      "disabledInputPlaceholder": "已禁用输入框",
      "disabledInputTitle": "禁用状态",
      "disabledInputVal": "预设内容",
      "emailAddress": "邮箱地址",
      "emailError": "请输入有效的企业邮箱地址。",
      "emailHint": "我们绝不会将您的邮箱分享给任何人。",
      "emailPlaceholder": "请输入您的邮箱...",
      "examplesSubtitle": "常见输入框配置与状态的视觉矩阵。",
      "invalid": "错误高亮",
      "invalidInputDesc": "破坏性错误高亮与校验反馈",
      "invalidInputTitle": "错误 / 非法状态",
      "overviewDesc": "探索交互式输入框的行为、尺寸、状态、一键清除、密码显示切换以及跨 Web 与 Qt 桌面的响应式设计令牌样式。",
      "passwordInputDesc": "交互式密码显隐眼睛按钮",
      "passwordInputTitle": "支持显隐切换的密码框",
      "passwordToggle": "密码显隐切换",
      "showIcon": "显示图标",
      "sizeSm": "紧凑 (sm)",
      "smInputDesc": "适用于紧凑工具栏的较小高度",
      "smInputPlaceholder": "紧凑输入框...",
      "smInputTitle": "紧凑尺寸 (sm)",
      "typeLabel": "类型:",
      "typePassword": "密码",
      "typeText": "文本"
    },
    "rangeSlider": {
      "compactSm": "紧凑尺寸 (sm)",
      "defaultWithTooltips": "默认尺寸带气泡提示",
      "disabled": "禁用状态",
      "maxLabel": "最大值: {{value}}",
      "minLabel": "最小值: {{value}}",
      "overviewDesc": "拖拽任一把手以调节区间的最小值与最大值边界。",
      "readOnly": "只读状态",
      "sizesAndStatesSubtitle": "提供默认与紧凑 sm 两档尺寸，并支持气泡提示、只读及禁用状态。"
    },
    "segmentedControl": {
      "autoAdaptiveTitle": "自动自适应内容宽度 (默认自适应)",
      "currentSelection": "当前选中：{{value}}",
      "defaultDesc": "默认尺寸 - 标准控件",
      "dot": "点状",
      "fixedWidthTitle": "固定单项宽度并自动省略截断",
      "gallery": "画廊视图",
      "grid": "网格视图",
      "gridPatternTitle": "网格图案:",
      "gridStyleTitle": "网格样式:",
      "lgDesc": "大尺寸 (lg) - 醒目分段标签风格",
      "line": "线条",
      "list": "列表视图",
      "menuTitleSubtitle": "支持前置内联标题，便于无缝嵌入右键上下文菜单或属性设置面板行中。",
      "off": "关闭",
      "optCompact": "紧凑",
      "optFitComfortably": "超长且舒适呈现的选项文本",
      "optLong": "长文本描述标签",
      "optSettings": "偏好设置",
      "optShort": "简短",
      "optTruncate": "超长选项文本自动截断展示",
      "optVar": "不定长选项标题",
      "selectedValue": "选中的值：{{value}}",
      "smDesc": "紧凑尺寸 (sm) - 适用于菜单与密集工具栏",
      "truncationSubtitle": "默认情况下，分段项自动自适应内容长度。当配置 equalWidth、fullWidth 或 itemWidth 时，分段项将强制采用等宽或固定宽度，并在文本溢出时使用省略号截断。"
    },
    "select": {
      "apple": "苹果",
      "appleTooltip": "红富士脆苹果",
      "banana": "香蕉",
      "bananaTooltip": "香甜香蕉",
      "blueberry": "蓝莓",
      "blueberryTooltip": "富含花青素",
      "cherry": "樱桃",
      "cherryTooltip": "新鲜甜樱桃",
      "dragonfruitDisabled": "火龙果 (已禁用)",
      "dragonfruitTooltip": "暂时缺货",
      "fruitsGroup": "水果列表",
      "grapes": "葡萄",
      "overviewDesc": "从下拉菜单中选择一个项目。当前选中值：{{value}}",
      "pineapple": "菠萝",
      "placeholder": "选择一种水果...",
      "selectedLabel": "选中值：{{value}}"
    },
    "slider": {
      "compactDesc": "更细的轨道厚度与更小的滑块把手，适合工具栏",
      "compactTitle": "紧凑尺寸 (sm)",
      "customRangeDesc": "限制自定义最小与最大边界，步长为 5",
      "customRangeTitle": "自定义范围 (20 至 80)",
      "disabledDesc": "半透明变暗呈现，阻止用户滑动交互",
      "disabledTitle": "禁用状态",
      "examplesSubtitle": "常见滑块配置、尺寸规格、气泡提示与交互状态的视觉矩阵。",
      "floatingTooltipDesc": "在拖拽或悬停把手时显示格式化数值提示",
      "floatingTooltipTitle": "浮动数值气泡提示",
      "horizontal": "水平",
      "orientationLabel": "方向:",
      "overviewDesc": "探索滑块控件的交互行为、多尺寸、步长、水平/垂直方向、气泡提示及状态规格。",
      "readOnly": "只读",
      "readOnlyDesc": "数值锁定且保持正常不透明度清晰呈现",
      "readOnlyTitle": "只读状态",
      "sizeDefault": "默认",
      "sizeSm": "紧凑 (sm)",
      "stepLabel": "步长:",
      "ticks": "刻度线",
      "ticksDesc": "具备离散吸附档位、刻度线与分档标签指示",
      "ticksTitle": "带刻度线的离散档位",
      "tooltip": "气泡提示",
      "valueLabel": "数值:",
      "vertical": "垂直"
    },
    "snapSlider": {
      "fast": "快速",
      "presetLabel": "预设档位:",
      "presetMax": "3.0x (最大)",
      "presetMin": "0.5x (最小)",
      "presetNormal": "1.0x (标准)",
      "slow": "慢速"
    },
    "switch": {
      "airplaneMode": "飞行模式",
      "airplaneModeDesc": "禁用移动网络、Wi-Fi 与蓝牙无线连接。",
      "asyncLoadingDesc": "等待服务器确认时呈现旋转加载指示器",
      "asyncLoadingTitle": "异步加载状态",
      "checked": "已开启",
      "cloudSyncDesc": "有可用网络时实时上传更改。",
      "cloudSyncLabel": "自动云端同步",
      "compactOff": "紧凑关闭",
      "compactOn": "紧凑开启",
      "connecting": "连接中...",
      "defaultSize": "默认尺寸",
      "descriptionLabel": "辅助描述",
      "disabledOff": "禁用关闭",
      "disabledOn": "禁用开启",
      "disabledReadOnlyDesc": "半透明不可交互与锁定只读呈现对比",
      "disabledReadOnlyTitle": "禁用与只读状态",
      "examplesSubtitle": "常见开关配置与交互状态的视觉矩阵。",
      "helperDescSubtitle": "多行标题与说明性辅助文本",
      "helperDescTitle": "带辅助说明文本",
      "offLabel": "已关闭",
      "onLabel": "已开启",
      "overviewDesc": "探索开关控件的交互行为、异步加载、只读状态、辅助说明描述及跨 Web 与 Qt 桌面的多尺寸规格。",
      "readOnly": "只读",
      "readOnlyOff": "只读锁定关闭",
      "readOnlyOn": "只读锁定开启",
      "sizeSm": "紧凑 (sm)",
      "sizeVariantsDesc": "默认尺寸与紧凑工具栏密度对比",
      "sizeVariantsTitle": "尺寸规格",
      "smallSize": "紧凑尺寸 (sm)",
      "standardToggleDesc": "具有平滑弹簧动效的标准轨道",
      "standardToggleTitle": "标准开关",
      "syncing": "同步中..."
    }
  },
  "surfaces": {
    "card": {
      "compact": "紧凑 (sm)",
      "compactCardContent": "更紧凑内边距的高密度布局。",
      "compactCardDesc": "为紧凑侧边栏与抽屉面板缩减内边距",
      "compactCardTitle": "紧凑卡片 (sm)",
      "defaultCardDesc": "带有面板背景的高层级表面",
      "defaultCardTitle": "默认卡片",
      "deploy": "部署",
      "feedbackDensityDesc": "启用悬停与按下时的交互反馈，或在紧凑空间中使用高密度排版。",
      "feedbackDensityTitle": "交互反馈与密度",
      "heroBadge": "专业版",
      "heroContent": "你的项目将自动即时部署至边缘加速网络。",
      "heroDescription": "一键快速部署你的新项目。",
      "heroTitle": "创建项目",
      "interactive": "可交互",
      "interactiveCardContent": "适用于仪表盘和可选卡片的可点击表面。",
      "interactiveCardDesc": "悬停以观察光标与阴影层级变化",
      "interactiveCardTitle": "可交互卡片",
      "interactiveFeedback": "交互反馈",
      "outlineCardDesc": "透明背景与清晰边框",
      "outlineCardTitle": "线框卡片",
      "secondaryCardDesc": "为成组的次要项提供微弱对比",
      "secondaryCardTitle": "次要卡片",
      "variantsDesc": "使用设计令牌构建的三种语义化变体，确保层级与对比度一致。",
      "variantsTitle": "样式变体"
    },
    "collapsible": {
      "card": "卡片",
      "collapsed": "已折叠",
      "expanded": "已展开",
      "starredRepos": "@peduarte 标星了 3 个仓库",
      "state": "展开状态:"
    },
    "panelCard": {
      "avgLatency": "平均延迟:",
      "avgLatencyVal": "12 毫秒 (p99: 45 毫秒)",
      "clusterTitle": "生产集群 #01",
      "directXActive": "DirectX 11 激活",
      "fragmentOk": "正常 (4 附件)",
      "fragmentShader": "片元着色器:",
      "nodeCount": "节点数量:",
      "nodeCountVal": "16 专用副本",
      "recompile": "重新编译",
      "restart": "重启",
      "scaleOut": "扩容",
      "shaderTitle": "着色器流水线状态",
      "vertexOk": "正常 (12 阶段)",
      "vertexShader": "顶点着色器:",
      "warpDriver": "WARP 驱动:"
    },
    "resizable": {
      "direction": "方向:",
      "editorViewport": "编辑器视口",
      "explorerTree": "资源管理器树",
      "handleHidden": "手柄: 隐藏",
      "handleVisible": "手柄: 显示",
      "horizontal": "水平",
      "integratedTerminal": "集成终端",
      "panelAlpha": "面板 Alpha",
      "panelBeta": "面板 Beta",
      "percentHeight": "{{height}}% 高度",
      "percentWidth": "{{width}}% 宽度",
      "sidebar": "侧边栏",
      "sourceCodeEditor": "源代码编辑器",
      "vertical": "垂直"
    },
    "scrollArea": {
      "compact": "紧凑 (sm)",
      "dualAxis": "双向 2D 滚动",
      "entriesCount": "{{count}} 条记录",
      "floating": "悬浮滚动条",
      "horizontal": "水平滚动",
      "itemsCount": "{{count}} 项",
      "matrixHeader": "双向矩阵 (100 行 × 6 列)",
      "mode": "模式:",
      "releaseChangelog": "版本更新日志与标签 (120 项)",
      "showSteppers": "显示步进按钮",
      "smoothScroll": "平滑滚动",
      "vertical": "垂直滚动"
    },
    "settingRow": {
      "anchorJumpDesc": "支持从弹窗或快捷键直接深层链接至指定设置项。当 highlightTarget === highlightId 时，通过 3 周期脉冲闪烁吸引注意力。",
      "anchorJumpTitle": "锚点跳转与高亮闪烁",
      "autoUpdateDesc": "在后台定期验证语义化版本发布并下载补丁。",
      "autoUpdateName": "自动检查更新",
      "flashAutoUpdate": "闪烁自动检查更新",
      "flashHwAccel": "闪烁硬件加速",
      "hwAccelDesc": "启用 GPU 加速光栅化与流畅视口渲染。",
      "hwAccelName": "硬件加速",
      "jumpAutoUpdate": "跳转至自动更新",
      "jumpHwAccel": "跳转至硬件加速",
      "recommended": "推荐",
      "triggerFlash": "触发锚点高亮"
    },
    "sidebar": {
      "collapse": "折叠",
      "collapseSidebar": "折叠侧边栏",
      "collapsed": "已折叠",
      "collapsibleMode": "折叠模式:",
      "configuration": "配置",
      "dashboard": "控制台",
      "diagnostics": "诊断",
      "dragHint": "拖拽侧边栏右边缘把手调整尺寸，或点击触发器折叠/展开。",
      "expand": "展开",
      "expandSidebar": "展开侧边栏",
      "expanded": "已展开",
      "icon": "图标",
      "mainViewportInset": "主视口内容区",
      "none": "无",
      "offcanvas": "抽屉",
      "overview": "概览",
      "preferences": "偏好设置",
      "projects": "项目",
      "resetWidth220": "重置宽度 (220)",
      "selectedView": "当前视图:",
      "sidebarWidth": "侧边栏宽度:"
    },
    "splitter": {
      "dragHint": "拖拽分栏手柄调整面板尺寸",
      "dragVerticalHint": "垂直拖拽分栏手柄调整尺寸",
      "editorCanvas": "编辑器画布",
      "editorWorkspace": "编辑器工作区",
      "navTree": "导航树",
      "reset35": "重置 (35%)",
      "reset65": "重置 (65%)",
      "terminalConsole": "终端控制台"
    },
    "splitterHandle": {
      "currentWidth": "当前宽度:",
      "editorCanvasArea": "编辑器 / 日志画布区",
      "focusHint": "聚焦手柄后使用方向键进行微调调整",
      "mainContent": "主内容视口",
      "reset200": "重置为 200",
      "sidebar": "侧边栏",
      "terminalConsole": "终端 / 输出控制台"
    },
    "tableOfContents": {
      "activeOutlineTarget": "当前激活大纲目标: {{target}}",
      "bannerHeight": "横幅高度:",
      "bannerOffsetChip": "偏移: {{offset}}",
      "bannerText": "全局系统通知：系统将于 UTC 02:00 进行例行维护",
      "flat": "扁平",
      "items": {
        "architecture": "系统架构",
        "bannerOffset": "顶部横幅偏移适配",
        "batching": "批量更新机制",
        "boundary": "跨端平台边界",
        "changelog": "版本发布变更",
        "dataFlow": "核心数据流",
        "designPrinciples": "设计原则",
        "implementation": "实现要点",
        "introduction": "起步与介绍",
        "motivation": "动机与目标",
        "signals": "响应式信号",
        "treeRendering": "树形大纲与导轨渲染"
      },
      "readingPaneTitle": "文档阅读窗格",
      "showTrack": "显示轨道:",
      "small": "紧凑 (sm)",
      "topBanner": "顶部横幅:",
      "track": "带轨道"
    },
    "tabs": {
      "account": "账户",
      "accountDesc": "在此修改你的账户设置。完成后请保存更改。",
      "accountTitle": "账户信息",
      "activeTab": "激活标签",
      "allItems": "全部项目",
      "archived": "已归档",
      "badgesCountsDesc": "集成状态计数器与未读提醒标签",
      "badgesCountsTitle": "带徽标与计数",
      "code": "代码",
      "compactDesc": "适用于紧凑顶栏与工具栏的高密度标签触发项",
      "compactTitle": "紧凑尺寸 (sm)",
      "completed": "已完成",
      "disabledTab": "禁用标签",
      "disabledTriggerDesc": "独立禁用的标签项以半透明状态呈现",
      "disabledTriggerTitle": "禁用触发项",
      "horizontal": "水平",
      "inbox": "收件箱",
      "issues": "议题",
      "line": "下划线",
      "lineVariantDesc": "适用于导航顶栏的全宽底部强调线条",
      "lineVariantTitle": "下划线样式 (Line)",
      "orientation": "布局方向:",
      "password": "密码",
      "passwordDesc": "在此修改你的密码。保存后系统将注销重新登录。",
      "passwordTitle": "安全凭据",
      "pending": "待处理",
      "pill": "胶囊 (默认)",
      "pulls": "合并请求",
      "settings": "设置",
      "settingsDesc": "管理通知提醒频率及界面显示偏好。",
      "settingsTitle": "应用设置",
      "small": "紧凑 (sm)",
      "unread": "未读",
      "vertical": "垂直"
    },
    "viewportConstrainedContainer": {
      "activeFramebuffers": "活动帧缓冲区 ({{count}})",
      "alwaysScrollOverflow": "始终滚动溢出",
      "autoViewport": "自动视口",
      "constrainedItem": "受限项目 #{{index}}",
      "highMargin48": "大外边距 (48)",
      "limit180": "180 限制",
      "limit260": "260 限制",
      "strict150": "严格 150 限制"
    }
  },
  "overlays": {
    "contextMenu": {
      "back": "返回",
      "backTooltip": "返回上一页",
      "forward": "前进",
      "forwardTooltip": "没有可前进的历史记录",
      "inspect": "检查",
      "inspectElement": "检查元素",
      "reload": "重新加载",
      "reloadTooltip": "重新加载当前页面",
      "rightClickAreaDesc": "将在指针坐标处弹出原生上下文菜单。",
      "rightClickAreaTitle": "在此区域内点击右键",
      "rightClickHere": "在此处右键点击",
      "saveAs": "另存为...",
      "statusIdle": "在下方目标区域右键点击",
      "statusSelected": "已选操作：{{id}}"
    },
    "dialog": {
      "adjustSize": "调整窗口大小",
      "advancedDesktopDesc": "拖动标题栏或窗口主体即可移动位置，通过右上角按钮可切换尺寸预设。",
      "advancedDesktopTitle": "高级桌面工具",
      "areYouSure": "您确定要执行此操作吗？",
      "confirm": "确认",
      "currentProfile": "当前资料：{{name}} ({{username}})",
      "deleteAccount": "删除账户",
      "deleteAccountDesc": "此操作不可撤销。这将永久删除您的账户并从服务器中移除您的所有数据。",
      "desktopDraggableDesc": "支持尺寸档位切换、高度自适应、固定底栏的可拖拽弹窗。",
      "desktopDraggableTitle": "桌面可拖拽弹窗",
      "destructiveConfirmationDesc": "用于需要明确确认的破坏性操作的对话框。",
      "destructiveConfirmationTitle": "破坏性确认",
      "downtimeDesc": "预计停机时间少于 10 分钟。所有数据均保持加密与安全。",
      "editProfileDesc": "在此修改您的个人资料，完成后点击保存。",
      "editProfileTitle": "编辑个人资料",
      "fixedFooterDesc": "底部操作区域作为固定底栏抽出，在垂直滚动过程中保持贴底固定。",
      "informationalNoticeDesc": "用于系统通知与维护公告的轻量提示弹窗。",
      "informationalNoticeTitle": "系统通知公告",
      "maintenanceDesc": "云服务将于今晚 UTC 时间 02:00 进行基础设施例行升级。",
      "name": "姓名",
      "notice": "公告",
      "openDraggableWindow": "打开可拖拽窗口",
      "openProfile": "打开个人资料对话框",
      "presetCompact": "紧凑",
      "presetFullscreen": "全视口",
      "scheduledMaintenance": "计划系统维护",
      "systemUpdateNotice": "系统更新通知",
      "understood": "我知道了",
      "username": "用户名",
      "yesDeleteAccount": "确认删除账户"
    },
    "draggableModal": {
      "activeTextures": "活跃纹理:",
      "adjustSize": "调整弹窗尺寸",
      "canvasHint": "在此限定画布范围内自由拖拽弹窗",
      "diagnosticsDesc": "拖动弹窗任意未被交互元素占用的区域即可移动位置；也可拉伸窗口边框调整尺寸。",
      "diagnosticsTitle": "内存与着色器诊断",
      "floatingTools": "浮动工具",
      "heapUsed": "堆内存已用:",
      "modalOpen": "弹窗已打开",
      "openModal": "打开可拖拽诊断弹窗",
      "presetCompact": "紧凑 (24rem x 18rem)",
      "presetDefault": "默认",
      "presetFullscreen": "全窗口",
      "presetWidescreen": "宽屏 (40rem x 24rem)"
    },
    "dropdownMenu": {
      "accountSettings": "账户设置",
      "actionNone": "操作：无",
      "actionSelected": "操作：已选择 {{id}}",
      "billing": "账单与订阅",
      "billingTooltip": "管理账单与发票",
      "logout": "退出登录",
      "logoutTooltip": "退出当前账户",
      "options": "选项 ▾",
      "profile": "个人资料",
      "profileTooltip": "查看个人资料",
      "settings": "系统设置",
      "shortcuts": "快捷键说明",
      "shortcutsTooltip": "查看键盘导航快捷键"
    },
    "floatingNotice": {
      "addCopy": "+ 复制提示",
      "addError": "+ 错误告警",
      "addRating": "+ 评分提示",
      "copiedTitle": "文件路径已复制到剪贴板",
      "demoFileDesc": "图片 001.png",
      "demoStorageDesc": "剩余空间不足 10%",
      "gap": "间距:",
      "gapAuto": "自适应",
      "gapCompact": "紧凑 (7dp)",
      "gapRelaxed": "舒适 (12dp)",
      "gapSpacious": "宽松 (16dp)",
      "overviewLead": "浮动提示堆叠多个临时消息，前排显示最高优先级卡片，后排卡片依次探出排队。悬停暂停过期并平滑放大以提高可见性。",
      "placementBottom": "底部",
      "placementTop": "顶部",
      "previewTitle": "浮动提示堆叠",
      "ratingTitle": "已评 5 星",
      "reset": "重置",
      "sandboxHint": "悬停在提示上可暂停倒计时并放大整个堆叠，悬停后方探出的卡片可将其原位提到最上层查看。",
      "warningTitle": "磁盘空间不足"
    },
    "notificationStack": {
      "actionLogs": "查看日志",
      "actionManage": "管理配额",
      "actionRetry": "重试",
      "actionUpgrade": "立即升级",
      "buildPassedDesc": "全部 318 项契约校验均已通过。",
      "buildPassedTitle": "构建通过",
      "clearAll": "清空全部",
      "headsUpDesc": "有新的主版本可用。",
      "headsUpTitle": "重要提示",
      "jobFailedDesc": "编译异常退出 (退出码 1)。",
      "jobFailedTitle": "作业失败",
      "lastAction": "最后操作：{{receipt}}",
      "levelError": "错误",
      "levelInfo": "提示",
      "levelSuccess": "成功",
      "levelWarning": "警告",
      "noActionPressed": "(暂无操作触发)",
      "noNotifications": "当前队列中无通知。点击上方按钮发送一条通知以查看其生命周期倒计时；悬停在通知栈上可同时暂停所有倒计时。",
      "placement": "显示方位:",
      "presetErrorDesc": "构建产物超出 50 MB 限制。",
      "presetErrorTitle": "上传被拒绝",
      "presetInfoDesc": "工作区代码符号已在 2.1 秒内刷新完成。",
      "presetInfoTitle": "索引已重建",
      "presetSuccessDesc": "版本 0.2.0 已在预发环境就绪。",
      "presetSuccessTitle": "部署已完成",
      "presetWarningDesc": "访问凭据将在 3 天后失效。",
      "presetWarningTitle": "令牌即将过期",
      "pushNotification": "发送通知:",
      "quotaDesc": "存储空间使用量正在接近套餐上限。",
      "quotaTitle": "配额已达 84%",
      "resetActionLog": "重置操作记录",
      "syncStartedDesc": "正在拉取 128 项远端更改。",
      "syncStartedTitle": "同步已开始"
    },
    "popover": {
      "align": "对齐:",
      "alignCenter": "居中对齐",
      "alignEnd": "末尾对齐",
      "alignStart": "起始对齐",
      "arrow": "箭头",
      "dimensionsDesc": "设置图层的宽度与高度尺寸。",
      "dimensionsTitle": "图层尺寸",
      "height": "高度",
      "movable": "可移动",
      "openPopover": "打开气泡弹窗",
      "side": "方位:",
      "sideBottom": "底部",
      "sideLeft": "左侧",
      "sideRight": "右侧",
      "sideTop": "顶部",
      "width": "宽度"
    },
    "scaleOsd": {
      "appliedStatus": "已生效: {{percent}}%",
      "autoHideLabel": "自动隐藏 (2s)",
      "delayedCommitLabel": "延迟生效 (1.5s)",
      "hideOsd": "隐藏 OSD",
      "hoverPauseHint": "将鼠标悬停在下方浮动 OSD 上可暂停自动隐藏倒计时。",
      "pendingStatus": "防抖生效中... (待生效: {{percent}}%)",
      "previewBox": "缩放预览盒",
      "quickZoom": "快速缩放:",
      "showOsd": "显示 OSD"
    },
    "sheet": {
      "closeOnOverlay": "点击遮罩关闭",
      "displayName": "显示名称",
      "editAccountProfileDesc": "更新您的账户标识与工作区配置。",
      "editAccountProfileTitle": "编辑账户资料",
      "editProfileDesc": "在此修改您的个人资料，完成后点击保存。",
      "editProfileTitle": "编辑个人资料",
      "name": "姓名",
      "openSheet": "打开{{side}}抽屉 ({{size}})",
      "openSheetQt": "打开{{side}}抽屉 ({{size}})",
      "organizationRole": "组织角色",
      "side": "方位:",
      "sideBottom": "底部",
      "sideLeft": "左侧",
      "sideRight": "右侧",
      "sideTop": "顶部",
      "username": "用户名"
    },
    "taskHud": {
      "addIndeterminate": "添加不确定进度任务",
      "addRunning": "添加运行中任务",
      "analyzingAst": "AST 语法分析 #{{num}}",
      "buildJob": "构建作业 #{{num}}",
      "cancelledByUser": "用户已取消",
      "clearAll": "清空全部",
      "collapseStack": "折叠任务栈",
      "compilationError": "编译失败 (退出码 1)",
      "completedSuccessfully": "已成功完成",
      "expandStack": "展开任务栈",
      "failTask": "标记任务失败",
      "idleHidden": "任务 HUD 处于空闲并隐藏。点击“添加运行中任务”模拟后台作业。",
      "indexingSymbols": "正在为符号建立索引",
      "maxVisible": "最大显示数:",
      "placement": "显示方位:",
      "placementBottomCenter": "底部居中",
      "placementBottomLeft": "左下角",
      "placementBottomRight": "右下角",
      "placementTopLeft": "左上角",
      "placementTopRight": "右上角",
      "processingDependencies": "正在处理项目依赖",
      "simulateTasks": "模拟任务:",
      "succeedTask": "成功完成任务",
      "taskDatabaseMigration": "数据库迁移",
      "taskDatabaseMigrationDetail": "已应用 12 个架构补丁",
      "taskGeneratingReport": "生成覆盖率报告",
      "taskGeneratingReportDetail": "测试覆盖率汇总",
      "taskIndexingSymbols": "符号索引中",
      "taskIndexingSymbolsDetail": "正在扫描 4,182 个文件",
      "taskOptimizingImages": "优化图像资源",
      "taskOptimizingImagesDetail": "正在重新编码 38 个静态资源",
      "taskPackagingBundle": "打包代码资源",
      "taskPackagingBundleDetail": "正在编译资源与模块",
      "taskRunningUnitTests": "执行单元测试",
      "taskRunningUnitTestsDetail": "第 7 组测试套件（共 12 组）",
      "taskUploadingArtifacts": "上传构建产物",
      "taskUploadingArtifactsDetail": "正在等待认证凭据"
    },
    "tooltip": {
      "arrow": "箭头",
      "bottomPlacementButton": "下方提示",
      "bottomPlacementContent": "目标下方提示",
      "bottomPlacementDesc": "在目标元素水平居中正下方显示",
      "bottomPlacementTitle": "下方对齐",
      "delay": "延迟:",
      "delay0ms": "0ms",
      "delay200ms": "200ms",
      "delay500": "500ms",
      "delayDefault": "默认 (200ms)",
      "delayInstant": "即时 (0ms)",
      "directionalArrowButton": "带箭头提示",
      "directionalArrowContent": "锚定指针",
      "directionalArrowDesc": "直接指向触发目标的三角指示箭头",
      "directionalArrowTitle": "指向性箭头",
      "disabled": "禁用",
      "hoverOrFocus": "悬停或聚焦我",
      "leftPlacementButton": "左侧提示",
      "leftPlacementContent": "目标左侧提示",
      "leftPlacementDesc": "在目标元素垂直居中左侧显示",
      "leftPlacementTitle": "左侧对齐",
      "menuItemsRightDeleteButton": "删除",
      "menuItemsRightDeleteContent": "永久移除",
      "menuItemsRightDesc": "纵向密集列表一律使用右侧方位，气泡不会遮挡上/下相邻的同级项",
      "menuItemsRightDuplicateButton": "复制",
      "menuItemsRightDuplicateContent": "复制此行",
      "menuItemsRightPinButton": "固定标签页",
      "menuItemsRightPinContent": "已固定 —— 同级项全程可见",
      "menuItemsRightTitle": "菜单项（默认朝右）",
      "rightPlacementButton": "右侧提示",
      "rightPlacementContent": "目标右侧提示",
      "rightPlacementDesc": "在目标元素垂直居中右侧显示",
      "rightPlacementTitle": "右侧对齐",
      "shortcut": "快捷键:",
      "shortcutHintButton": "保存操作",
      "shortcutHintContent": "保存文档",
      "shortcutHintDesc": "用于帮助高级用户发现快捷操作的效率提示徽标",
      "shortcutHintTitle": "快捷键提示徽标",
      "side": "方位:",
      "text": "文本:",
      "topPlacementButton": "上方提示",
      "topPlacementContent": "目标上方提示",
      "topPlacementDesc": "在目标元素水平居中正上方显示",
      "topPlacementTitle": "上方对齐（默认）"
    }
  }
},
  'en-US': {
  "common": {
    "reset": "Reset",
    "export": "Export",
    "import": "Import",
    "cancel": "Cancel",
    "apply": "Apply",
    "save": "Save",
    "saveChanges": "Save Changes",
    "saving": "Saving...",
    "delete": "Delete",
    "close": "Close",
    "copy": "Copy",
    "copied": "Copied",
    "copyLink": "Copy Link",
    "copyAllCode": "Copy Entire Code",
    "selectAll": "Select All",
    "default": "Default",
    "and": "and",
    "or": "or",
    "secondary": "Secondary",
    "outline": "Outline",
    "ghost": "Ghost",
    "destructive": "Destructive",
    "link": "Link",
    "overlay": "Overlay",
    "back": "Back",
    "next": "Next",
    "preview": "Preview",
    "status": "Status",
    "value": "Value",
    "active": "Active",
    "disabled": "Disabled",
    "enabled": "Enabled",
    "loading": "Loading",
    "open": "Open",
    "searchPlaceholder": "Search components & docs...",
    "noMatches": "No matching pages found",
    "navigate": "Navigate",
    "copyToClipboard": "Copy to Clipboard",
    "tip": "Tip",
    "resultCount": "{{count}} results",
    "variant": "Variant:",
    "size": "Size:",
    "fullWidth": "Full Width",
    "pressed": "Pressed",
    "label": "Label:",
    "required": "Required",
    "optional": "Optional",
    "invalid": "Invalid",
    "orientation": "Orientation:",
    "style": "Style:",
    "position": "Position:",
    "animation": "Animation:",
    "horizontal": "Horizontal",
    "vertical": "Vertical",
    "solid": "Solid",
    "dashed": "Dashed",
    "dotted": "Dotted",
    "left": "Left",
    "center": "Center",
    "right": "Right",
    "test": "Test",
    "keyUp": "↑",
    "keyDown": "↓",
    "opened": "Opened",
    "settings": "Settings",
    "dark": "Dark",
    "light": "Light",
    "small": "Small",
    "system": "System"
  },
  "theme": {
    "settings": {
      "title": "Theme Configuration",
      "reset": "Reset",
      "export": "Export JSON",
      "import": "Import",
      "importHint": "Paste JSON configuration:",
      "cancel": "Cancel",
      "apply": "Apply",
      "mode": {
        "title": "Appearance Mode",
        "desc": "Switch between Light, Dark, or System OS appearance"
      },
      "palette": {
        "title": "Accent Palette",
        "desc": "Choose from 10 canonical theme palettes or custom accent"
      },
      "style": {
        "title": "Interface Style",
        "desc": "Simple flat presentation or expressive rich layered styling"
      },
      "decoration": {
        "title": "Decoration Level",
        "desc": "Master slider (0-100) driving corner radii, shadows, and motion"
      },
      "uiscale": {
        "title": "Interface Scale",
        "desc": "Global display density and UI scaling factor"
      }
    },
    "mode": {
      "light": "Light",
      "dark": "Dark",
      "system": "System"
    },
    "palette": {
      "neutral": "Neutral",
      "slate": "Slate",
      "red": "Red",
      "orange": "Orange",
      "yellow": "Yellow",
      "green": "Green",
      "blue": "Blue",
      "violet": "Violet",
      "rose": "Rose",
      "custom": "Custom"
    },
    "style": {
      "simple": "Simple",
      "expressive": "Expressive"
    },
    "overrides": {
      "custom": "Tune",
      "hide": "Details",
      "radius": "Corner Radius",
      "shadow": "Shadow Elevation",
      "motion": "Motion Duration"
    }
  },
  "language": {
    "title": "Language Preference",
    "desc": "Switch UI display language with instant effect and system language detection.",
    "current": "Current",
    "label": "Display Language",
    "followSystem": "Follow System",
    "systemDetected": "System detected",
    "followSystemDesc": "Automatically matches your system language if supported, otherwise defaults to English",
    "fixedNotice": "Fixed Languages",
    "systemHint": "Currently following system, rendering UI in {{language}}",
    "fixedHint": "Currently fixed to {{language}}, ignoring system language changes"
  },
  "showcase": {
    "searchPlaceholder": "Search components & docs...",
    "studioTuner": "Studio Tuner",
    "exportTheme": "Export",
    "jumpTo": "Jump to",
    "switchLanguage": "Switch Language",
    "docs": "Docs",
    "onThisPage": "On this page",
    "outline": "Outline",
    "featuredEngines": "Featured Engines",
    "preview": "Preview",
    "telemetryFps": "FPS",
    "telemetryDom": "DOM",
    "telemetryHeap": "Heap",
    "telemetryClose": "Close (Ctrl+Alt+P to reopen)",
    "telemetryQtSceneGraph": "Qt SceneGraph (Batching Active)",
    "reactCode": "React Code",
    "qtQml": "Qt QML",
    "animations": "Animations",
    "keyboardNavigation": "Keyboard Navigation",
    "propsReference": "Props Reference",
    "anatomy": "Anatomy",
    "anatomyDesc": "Import and structure definition for React and Qt Quick.",
    "examplesAndStates": "Examples & States",
    "variantsAndOptions": "Variants & Options",
    "multiFileTabs": "Multi-File Tabs",
    "variant": "Variant:",
    "size": "Size:",
    "categories": {
      "Get Started": "Get Started",
      "Base Primitives": "Base Primitives",
      "Forms & Inputs": "Forms & Inputs",
      "Surfaces & Layout": "Surfaces & Layout",
      "Overlays & Feedback": "Overlays & Feedback",
      "Desktop & Virtualization": "Desktop & Virtualization",
      "Composite Engines": "Composite Engines"
    },
    "previewTitles": {
      "Interactive Button Sandbox": "Interactive Button Sandbox",
      "Hover to reveal": "Hover to reveal",
      "CopyableBadge preset": "CopyableBadge preset",
      "Timing & Dim Controls": "Timing & Dim Controls",
      "Truncated display, full copy": "Truncated display, full copy",
      "Badge Sandbox": "Badge Sandbox",
      "Label Sandbox": "Label Sandbox",
      "Separator Sandbox": "Separator Sandbox",
      "Skeleton Sandbox": "Skeleton Sandbox",
      "Copy Button Sandbox": "Copy Button Sandbox",
      "Split Button Sandbox": "Split Button Sandbox",
      "Elided Text Sandbox": "Elided Text Sandbox",
      "Kbd Sandbox": "Kbd Sandbox",
      "Squircle Sandbox & Curvature Comparison": "Squircle Sandbox & Curvature Comparison",
      "Truncated display full copy": "Truncated display, full copy",
      "ColorPicker Sandbox": "ColorPicker Sandbox",
      "Duration Input Sandbox": "Duration Input Sandbox",
      "Inline Editable Text Sandbox": "Inline Editable Text Sandbox",
      "Keybinding Recorder Sandbox": "Keybinding Recorder Sandbox",
      "MediaProgressBar Sandbox": "MediaProgressBar Sandbox",
      "Preset Number Input Sandbox": "Preset Number Input Sandbox",
      "Read-Only Input Sandbox": "Read-Only Input Sandbox",
      "Sizes & Interaction Triggers": "Sizes & Interaction Triggers",
      "Sizes & States": "Sizes & States",
      "Sizes & Status Variants": "Sizes & Status Variants"
    },
    "toc": {
      "overview": "Interactive Overview",
      "installation": "Installation",
      "animations": "Animations",
      "keyboard": "Keyboard Navigation",
      "props": "Props Reference",
      "anatomy": "Component Anatomy",
      "states": "States & Interactions",
      "examples": "Examples",
      "variants": "Variants",
      "levels": "Levels",
      "colors": "Color Palette",
      "type": "Typography & Radius",
      "tuner": "Theme Controls",
      "playground": "Live Sandbox",
      "philosophy": "Design Philosophy",
      "architecture": "How It Works",
      "quickstart": "Quick Start",
      "packages": "Packages & Structure",
      "task-1": "Task 1",
      "task-2": "Task 2",
      "queue-1": "Queue 1",
      "queue-2": "Queue 2",
      "queue-3": "Queue 3",
      "queue-4": "Queue 4",
      "queue-5": "Queue 5",
      "centering": "Optical Centring",
      "configuration": "External Configuration",
      "extensibility": "Extending the Specification",
      "gallery": "Icon Gallery",
      "grids": "Grids, Weight & Size",
      "integration": "Host Integration",
      "ramp": "Cross-Script Size Ramp",
      "rasterizer": "Rasterization Path",
      "rules": "Governance Rules",
      "specification": "Active Specification"
    },
    "reactTsx": "React (TSX)",
    "qtQuickQml": "Qt Quick (QML)",
    "collapseOverflow": "Collapse & Overflow",
    "examplesVariants": "Examples & Variants",
    "installation": "Installation",
    "interactiveOverview": "Interactive Overview",
    "navigation": "Navigation",
    "shortcuts": {
      "scopes": {
        "global": {
          "name": "Global Application",
          "desc": "Global application-wide hotkeys active across all showcase views"
        },
        "preview": {
          "name": "Component Sandbox",
          "desc": "Hotkeys scoped specifically to the interactive sandbox canvas"
        }
      },
      "sections": {
        "navigation": "Navigation & Search",
        "view": "View & UI Scaling",
        "system": "System & Preferences"
      },
      "actions": {
        "search": {
          "name": "Global Command Search",
          "desc": "Opens the spotlight-style command and component search palette."
        },
        "navBack": {
          "name": "Navigate Back",
          "desc": "Returns to previously visited living showcase documentation page."
        },
        "navForward": {
          "name": "Navigate Forward",
          "desc": "Navigates forward in the showcase page navigation history stack."
        },
        "toggleSidebar": {
          "name": "Toggle Sidebar",
          "desc": "Collapses or expands the primary showcase component navigation sidebar."
        },
        "zoomIn": {
          "name": "Zoom In UI",
          "desc": "Increases global UI scale density step with on-screen OSD feedback."
        },
        "zoomOut": {
          "name": "Zoom Out UI",
          "desc": "Decreases global UI scale density step with on-screen OSD feedback."
        },
        "zoomReset": {
          "name": "Reset UI Zoom",
          "desc": "Restores display scaling factor to default 100% (1.0x)."
        },
        "toggleTelemetry": {
          "name": "Toggle Performance Telemetry HUD",
          "desc": "Toggles floating real-time 60fps frame rate, render time, and heap memory monitor."
        },
        "toggleTheme": {
          "name": "Cycle Theme Mode",
          "desc": "Cycles interface color appearance between Light, Dark, and System modes."
        },
        "copySelection": {
          "name": "Copy Active Selection",
          "desc": "Copies currently highlighted code block snippet or text selection to OS clipboard."
        }
      },
      "tags": {
        "essential": "Essential"
      }
    }
  },
  "categories": {
    "Get Started": "Get Started",
    "Base Primitives": "Base Primitives",
    "Forms & Inputs": "Forms & Inputs",
    "Surfaces & Layout": "Surfaces & Layout",
    "Overlays & Feedback": "Overlays & Feedback",
    "Desktop & Virtualization": "Desktop & Virtualization",
    "Composite Engines": "Composite Engines"
  },
  "navigation": {
    "introduction": "Introduction",
    "tokens": "Theme & Tokens",
    "themetuner": "Theme Studio",
    "typography": "Typography Rendering",
    "icons": "Icon System",
    "intro": "Introduction",
    "theme-tuner": "Theme Studio",
    "button": "Button",
    "badge": "Badge",
    "label": "Label",
    "separator": "Separator",
    "skeleton": "Skeleton",
    "copy-button": "Copy Button",
    "hover-copy": "Hover Copy",
    "split-button": "Split Button",
    "elided-text": "Elided Text",
    "kbd": "Kbd",
    "squircle": "Squircle",
    "input": "Input",
    "checkbox": "Checkbox",
    "switch": "Switch",
    "select": "Select",
    "slider": "Slider",
    "range-slider": "Range Slider",
    "snap-slider": "Snap Slider",
    "segmented-control": "Segmented Control",
    "color-picker": "ColorPicker",
    "duration-input": "Duration Input",
    "preset-number-input": "Preset Number Input",
    "read-only-input": "Read-Only Input",
    "inline-editable-text": "Inline Editable Text",
    "keybinding-recorder": "Keybinding Recorder",
    "media-progress-bar": "MediaProgressBar",
    "card": "Card",
    "panel-card": "Panel Card",
    "tabs": "Tabs",
    "scroll-area": "Scroll Area",
    "collapsible": "Collapsible",
    "setting-row": "Setting Row",
    "viewport-constrained-container": "Viewport Constrained Container",
    "sidebar": "Sidebar",
    "splitter": "Splitter",
    "splitter-handle": "Splitter Handle",
    "resizable": "Resizable",
    "table-of-contents": "Table of Contents",
    "dialog": "Dialog",
    "alert-dialog": "Alert Dialog",
    "sheet": "Sheet",
    "popover": "Popover",
    "tooltip": "Tooltip",
    "dropdown-menu": "Dropdown Menu",
    "context-menu": "Context Menu",
    "draggable-modal": "Draggable Modal",
    "scale-osd": "Scale OSD",
    "task-hud": "Task HUD",
    "notification-stack": "Notification Stack",
    "floating-notice": "Floating Notice",
    "window-title-bar": "Window Title Bar",
    "smooth-wheel-handler": "Smooth Wheel Handler",
    "virtual-list": "Virtual List",
    "virtual-tree": "Virtual Tree",
    "virtual-grid": "Virtual Grid",
    "generic-data-table": "Generic Data Table",
    "table": "Table",
    "query-builder": "Query Builder",
    "code-block": "Code Block",
    "pipeline-view": "Pipeline View",
    "address-bar": "Address Bar",
    "theme-settings": "Theme Settings",
    "language-settings": "Language Settings",
    "keybinding-manager": "Keybinding Manager"
  },
  "exportTheme": {
    "title": "Export & Copy Theme Configuration",
    "description": "One-click copy tailored styles and component code for your target framework.",
    "tip": "Tip: Drop this configuration directly into your project's stylesheet or theme manager.",
    "cssVariables": "CSS Variables",
    "tailwindV4": "Tailwind v4",
    "reactCode": "React Code",
    "qtQml": "Qt / QML",
    "jsonSpec": "JSON Spec"
  },
  "components": {
    "componentPreview": {
      "thisComponent": "this component"
    },
    "errorBoundary": {
      "fallbackTitle": "Component Rendering Error",
      "reloadPage": "Reload Page",
      "tryAgain": "Try Again",
      "unexpectedError": "An unexpected error occurred during rendering."
    },
    "icon-system": {
      "description": "One icon specification for both stacks: single geometry source, one stroke weight, optical centring by construction, and how to switch specifications."
    },
    "icons": {
      "description": "One icon specification for both stacks: single geometry source, one stroke weight, optical centring by construction, and how to switch specifications."
    },
    "intro": {
      "description": "Single source of truth architecture and multi-stack overview."
    },
    "introduction": {
      "description": "ChaSet (Tea Set) is a cross-stack UI component library where a single source of truth powers both React (Web) and Qt/QML (Desktop) implementations."
    },
    "theme-studio": {
      "description": "Live interactive theme tuner. Fine-tune colors, radiuses, and accents with real-time feedback and one-click config export."
    },
    "theme-tokens": {
      "description": "Neutral token system driving both Tailwind custom CSS properties and Qt Quick C++ / QML singletons."
    },
    "theme-tuner": {
      "description": "Interactive theme customizer and config exporter."
    },
    "tokens": {
      "description": "Color palette, semantic mappings, radius and typography."
    },
    "typography": {
      "description": "Global text rasterizer policy and a five-script size ramp previewing every type scale step."
    },
    "typography-rendering": {
      "description": "Global text rasterizer policy and a five-script size ramp previewing every type scale step."
    },
    "badge": {
      "away": "Away",
      "badgeDefault": "Badge Default",
      "badgeNew": "NEW",
      "defaultLabel": "Default:",
      "description": "Displays a badge or a component that looks like a badge to highlight status, tags, and counts.",
      "error": "Error",
      "online": "Online",
      "overviewDesc": "Adjust variant, size, and interactive status options in real time with synchronized previews for Web and Desktop.",
      "qtQuick": "Qt Quick",
      "reactTag": "React Tag",
      "removable": "Removable",
      "resetRemoved": "Reset Removed Badge",
      "sizesDesc": "Choose between standard pill scale (default) and compact micro badge (sm).",
      "sizesTitle": "Sizes",
      "smallLabel": "Small:",
      "statusDesc": "Badges support live status indicator dots and dismissible action buttons for filter tags.",
      "statusDot": "Status Dot",
      "statusTitle": "Status & Removable Tags",
      "variantsDesc": "All six standard semantic variants aligned with the ChaSet design token system.",
      "variantsTitle": "Variants"
    },
    "button": {
      "activeToggle": "Active Toggle",
      "description": "Displays a button or a component that looks like a button with multiple variants, sizes, and states.",
      "disabledButton": "Disabled Button",
      "extraSmall": "Extra Small",
      "groupDesc": "Group related buttons cohesively with ButtonGroup, and enrich buttons with leading or trailing icons.",
      "groupTitle": "Button Group & Icons",
      "large": "Large",
      "left": "Left",
      "middle": "Middle",
      "right": "Right",
      "sizesDesc": "Available in standardized sizes: xs, sm, default, lg, and icon variants.",
      "sizesTitle": "Sizes",
      "small": "Small",
      "statesDesc": "Buttons handle loading, pressed, and disabled states automatically, preserving width and blocking pointer events.",
      "statesTitle": "States & Loading",
      "variantsDesc": "Use the variant prop to change the visual hierarchy.",
      "variantsTitle": "Variants"
    },
    "copy-button": {
      "clickToTest": "Click the copy button to test",
      "copiedSuccess": "Successfully copied: {{text}}",
      "copyLink": "Copy Link",
      "copySecret": "Copy Secret",
      "description": "One-click clipboard copy button with transient success checkmark feedback and customizable timeout.",
      "overviewDesc": "Click either copy button below to copy the target string to your system clipboard."
    },
    "elided-text": {
      "alwaysShow": "Always Show: {{status}}",
      "copyable": "Copyable: {{status}}",
      "description": "Smart text truncation with automatic overflow detection, click-to-copy, and contextual tooltip reveal.",
      "multiLineDesc": "Using maxLines={2}, text wraps up to two lines before truncating with an ellipsis.",
      "multiLineTitle": "Multi-Line Clamping",
      "off": "Off",
      "on": "On",
      "overviewDesc": "Resize the container below using the slider. When the text is clipped with an ellipsis, hovering reveals the full path in a tooltip. Click to copy the full path when copyable is enabled.",
      "sampleParagraph": "ChaSet provides cross-stack design system primitives with pixel-level parity across React Web and Qt Quick desktop applications.",
      "widthLabel": "Width: {{width}}"
    },
    "hover-copy": {
      "copiedStatus": "Copied",
      "copiedSuccess": "Successfully copied: {{text}}",
      "description": "Hover-dim overlay with centered copy button; clicking anywhere on the overlay copies arbitrary content.",
      "dimAmount": "Dim amount",
      "disabled": "Disabled",
      "hoverHint": "Hover the card, then click anywhere on the overlay to copy.",
      "installationDesc": "Import HoverCopy or the CopyableBadge preset from the shared package.",
      "overviewDesc": "Hover the card to reveal a dimmed scrim with a centered copy button. Click anywhere on the overlay to copy the hidden payload to the clipboard.",
      "playgroundDesc": "Tune the overlay radius, restore interval, scrim density, and disabled state. The sandbox below mirrors the desktop layout exactly.",
      "playgroundTitle": "Timing & Dim Controls",
      "presetDesc": "CopyableBadge is a thin preset that wraps a secondary Badge in HoverCopy with a pill overlay. It adds no state or timing of its own.",
      "presetHint": "Hover the badge to reveal its copy overlay; click anywhere to copy.",
      "presetText": "ORDER-1024",
      "presetTitle": "CopyableBadge Preset",
      "radius": "Radius",
      "radiusFull": "full",
      "radiusLg": "lg",
      "radiusMd": "md",
      "radiusNone": "none",
      "radiusSm": "sm",
      "restoreInterval": "Restore interval",
      "truncateDesc": "The visible label may be truncated while the copied payload stays the full string.",
      "truncateHint": "Only the start fits on screen; copying grabs the complete identifier.",
      "truncateText": "ORDER-2026-0417-PROD-HOTFIX",
      "truncateTitle": "Truncated display, full copy"
    },
    "kbd": {
      "always": "Always",
      "auto": "Auto",
      "clickLabel": "Click",
      "compact": "Compact:",
      "description": "Displays keyboard shortcuts, key combinations, and keycap badges with smart compact truncation.",
      "never": "Never",
      "orDivider": "or",
      "overviewDesc": "Adjust variant, size, and compact symbol mode in real time with synchronized previews for Web and Desktop.",
      "variantsDesc": "Four distinct visual styles designed for menus, search fields, dialogs, and inverted tooltips.",
      "variantsTitle": "Variants"
    },
    "label": {
      "acceptTerms": "I accept the terms and conditions",
      "accountPassword": "Account Password",
      "altPhone": "Alternative Phone",
      "archivedRecordId": "Archived Record ID",
      "defaultLabel": "Default Label",
      "description": "Renders an accessible label associated with form controls.",
      "descriptionDesc": "Supporting guidance subtitle directly below label",
      "descriptionTitle": "With Helper Description",
      "disabledDesc": "Dimmed opacity for non-interactive form elements",
      "disabledTitle": "Disabled State",
      "emailAddress": "Email address",
      "emailPlaceholder": "name@example.com",
      "formControlDesc": "Clicking the label activates or toggles the linked input element via htmlFor.",
      "formControlTitle": "Form Association",
      "invalidDesc": "Destructive text color highlighting validation error",
      "invalidTitle": "Validation Error (Invalid)",
      "legalEntityHelper": "Enter your official company legal name",
      "legalEntityName": "Legal Entity Name",
      "optionalDesc": "Muted tag denoting non-mandatory optional fields",
      "optionalIndicator": "(optional)",
      "optionalTitle": "Optional Indicator",
      "overviewDesc": "Adjust size, required markers, optional indicators, validation states, and disabled appearance in real time.",
      "recoveryEmail": "Recovery Email",
      "recoveryTooltip": "Used for two-factor authentication recovery codes",
      "requiredDesc": "Destructive asterisk denoting mandatory input fields",
      "requiredTitle": "Required Indicator",
      "sizesDesc": "Choose between standard text size and compact high-density size for dense layouts.",
      "sizesTitle": "Sizes",
      "smallLabel": "Small Label",
      "statesDesc": "Visual matrix of label states including required asterisk, optional tag, validation error, helper description, and tooltips.",
      "statesTitle": "States & Variants",
      "termsSubtitle": "Click the text below to toggle the checkbox",
      "termsTitle": "Terms and Conditions",
      "tooltipDesc": "Help icon with contextual explanation on hover",
      "tooltipTitle": "With Info Tooltip",
      "workEmail": "Work Email"
    },
    "separator": {
      "accountDesc": "Manage your workspace settings and profile.",
      "accountOverview": "Account Overview",
      "active": "Active",
      "borderStyles": "Border Styles",
      "borderStylesDesc": "Choose between solid, dashed, or dotted dividers to distinguish hierarchy.",
      "changelog": "Changelog",
      "chasetUi": "ChaSet UI",
      "components": "Components",
      "continueWith": "Continue with",
      "dashed": "Dashed",
      "decorative": "Decorative",
      "description": "Visually or semantically separates content in a list, form, or section.",
      "docs": "Docs",
      "dotted": "Dotted",
      "endOfCategory": "End of Category",
      "enterprise": "Enterprise",
      "examplesDesc": "Common layout patterns using horizontal, vertical, dashed, dotted, and labeled separators.",
      "examplesTitle": "Examples & States",
      "labeledDividers": "Labeled Dividers",
      "labeledDividersDesc": "Embed clear section titles or auth splits with left, center, or right alignment.",
      "manage": "Manage",
      "navDivider": "Navigation Divider",
      "navDividerDesc": "Vertical dividers between inline list items or metadata tags.",
      "orContinueWith": "OR CONTINUE WITH",
      "overviewDesc": "Test orientation, dashed/dotted line styles, and labeled section dividers across Web and Desktop.",
      "plan": "Plan",
      "sectionStart": "Section Start",
      "showcase": "Showcase",
      "signInEmail": "Sign in with Email",
      "signInSso": "Sign in with SSO",
      "solidDefault": "Solid (Default)",
      "source": "Source",
      "status": "Status",
      "systemDesc": "Cross-stack React & Qt Quick Design System.",
      "tokens": "Tokens"
    },
    "skeleton": {
      "description": "Used to show a placeholder while content is loading, with smooth CSS pulse and wave shimmer animations.",
      "none": "none",
      "overviewDesc": "Visual placeholder skeleton cards for progressive loading states. Switch between pulse, wave shimmer, or static modes.",
      "pulse": "pulse",
      "wave": "wave"
    },
    "split-button": {
      "abortPipeline": "Abort Pipeline",
      "archiveArtifact": "Archive Artifact",
      "deploy": "Deploy",
      "deployBuild": "Deploy Build #142",
      "deployCanary": "Deploy Canary",
      "deployStaging": "Deploy to Staging",
      "description": "Dual-action button with primary direct click and secondary attached dropdown menu.",
      "eventMsg": "Event: {{event}}",
      "exportToDisk": "Export to Disk",
      "lastAction": "Last Action Dispatched: {{action}}",
      "none": "None",
      "overviewDesc": "Click the main button to trigger the primary action, or click the chevron to open the dropdown menu.",
      "saveAll": "Save All",
      "saveAs": "Save As...",
      "saveProject": "Save Project",
      "tagRelease": "Tag Release v1.2.0"
    },
    "splitButton": {
      "defaultAction": "Action"
    },
    "squircle": {
      "adoptionPreview": "Full-Project Default Adoption Preview",
      "classicArc": "Classic Arc (Smoothing: 0%)",
      "cornerRadius": "Corner Radius",
      "cornerSmoothing": "Corner Smoothing",
      "description": "iOS continuous curvature superellipse rounded corners (G2 continuity). Eliminates harsh creases caused by abrupt curvature transitions in classic circular arcs, providing smooth, organic modern corners across the design system.",
      "g1Label": "Standard Circular Arc (G1)",
      "g2Label": "iOS Continuous Curvature (G2)",
      "radiusLabel": "Radius: {{radius}}",
      "squircleLabel": "Squircle (Smoothing: {{smoothing}}%)"
    },
    "range-slider": {
      "description": "Dual-thumb slider for selecting numeric min-max intervals with collision prevention."
    },
    "snap-slider": {
      "description": "Stepped discrete slider that snaps to defined stops with ticks and label row."
    },
    "segmented-control": {
      "description": "Compact pill segmented switch for toolbars, menus, and view toggles."
    },
    "color-picker": {
      "description": "Interactive color selection with saturation/brightness field and swatches."
    },
    "duration-input": {
      "description": "Segmented duration input with step buttons, keyboard arrow jumping, and preset menu."
    },
    "preset-number-input": {
      "description": "Numeric input field with quick-select preset dropdown panel and clear actions."
    },
    "read-only-input": {
      "description": "Protected input field for tokens and IDs with integrated copy-to-clipboard action."
    },
    "inline-editable-text": {
      "description": "Text element that switches seamlessly to an input field on double-click or edit trigger."
    },
    "keybinding-recorder": {
      "description": "Interactive recorder that captures accelerator keyboard sequences for desktop apps."
    },
    "media-progress-bar": {
      "description": "Universal media playback progress bar with drag scrubbing, click-to-seek, hover preview, position/total time readout, click-to-toggle elapsed/countdown and right-click format menu."
    },
    "checkbox": {
      "description": "A control that allows the user to toggle between checked and not-checked states, with support for indeterminate states, sizes, helper descriptions, and companion labels.",
      "fallbackLabel": "Checkbox"
    },
    "colorPicker": {
      "compactDesc": "Smaller dimensions and font size designed for tight sidebar panels.",
      "compactTitle": "Compact Size (sm)",
      "customPresetsDesc": "Specific project palette supplied via the presetColors prop.",
      "customPresetsTitle": "Custom Preset Swatches",
      "defaultTitle": "Color",
      "description": "An interactive color selection component featuring 4 selector panels (Square in HueRing, Circle Color Wheel, Triangle in HueRing, and Swatches), live hex input with copy button, and independent multi-channel sliders (RGB, HSV, CMYK, LAB).",
      "disabledDesc": "Readonly display with 50% opacity and disabled pointer events.",
      "disabledTitle": "Disabled State",
      "examplesDesc": "Matrix of common color picker configurations, modes, and sizes.",
      "examplesTitle": "Examples & States",
      "hexInput": "Hex Input",
      "mode": "Mode:",
      "modeInline": "Inline",
      "modePopover": "Popover",
      "movable": "Movable",
      "panelCircle": "Circle",
      "panelSquare": "Square",
      "panelSwatches": "Swatches",
      "panelTriangle": "Triangle",
      "popoverDesc": "Compact trigger button showing current color and hex code with floating panel.",
      "popoverTitle": "Popover Dropdown Mode",
      "preview": "Preview",
      "selectedColor": "Selected Color:",
      "size": "Size:",
      "sizeSm": "SM",
      "swatches": "Swatches"
    },
    "durationInput": {
      "compactSizeColon": "Compact Size (sm):",
      "compactTitle": "Compact Size (sm)",
      "description": "Segmented duration input control for hours, minutes, and seconds with stepper buttons, mouse wheel adjustments, keyboard arrow jumping, and preset menu.",
      "disabledStateColon": "Disabled State:",
      "disabledTitle": "Disabled State",
      "formatted": "Formatted:",
      "formattedSummary": "{{h}}h {{m}}m {{sec}}s ({{total}}s total)",
      "hours": "Hours",
      "largeTitle": "Large Size (lg)",
      "minutes": "Minutes",
      "presets": "Presets",
      "seconds": "Seconds",
      "timerDuration": "Timer Duration",
      "timerDurationDefault": "Timer Duration (Default):",
      "variantsDesc": "Supports compact and comfortable sizes, disabling presets or labels, and disabled states.",
      "variantsTitle": "Variants & Configurations"
    },
    "inlineEditableText": {
      "clickToEdit": "Click or double-click the label below to edit in place:",
      "compactSm": "Compact sm Size",
      "currentStateValue": "Current state value:",
      "demoCompact": "Sprint-42-Review",
      "demoDisabled": "System Protected File",
      "demoDoubleClick": "Database Connection URI",
      "demoSingleClick": "Project Architecture Doc",
      "description": "Text element that switches seamlessly to an input field on double-click or edit trigger, supporting Enter to save and Escape to cancel.",
      "disabledTitle": "Disabled State",
      "doubleClickActivation": "Double Click Activation",
      "placeholder": "Type a title...",
      "singleClickActivation": "Single Click Activation (Default)",
      "sizesAndTriggers": "Sizes & Interaction Triggers",
      "sizesAndTriggersDesc": "Configure single-click vs double-click activations and high-density sizing tiers."
    },
    "input": {
      "description": "Displays a form text input field or a component that looks like an input field."
    },
    "keybindingRecorder": {
      "clearShortcut": "Clear keybinding",
      "clickToRecord": "Click recorder box and press shortcut combination:",
      "clickToRecordHint": "Click to record shortcut",
      "compactSm": "Compact sm Tier",
      "currentBinding": "Current shortcut: ",
      "defaultWithClear": "Default Size (with Clear)",
      "description": "Interactive keyboard sequence recorder that captures desktop accelerator combinations (Ctrl, Alt, Shift, Meta).",
      "disabledTitle": "Disabled State",
      "noBinding": "No keybinding set",
      "none": "None",
      "placeholder": "Press shortcut keys...",
      "recordedAccelerator": "Recorded accelerator:",
      "recordingPrompt": "Press desired key combination (Esc to cancel)...",
      "sizesAndStates": "Sizes & States",
      "sizesAndStatesDesc": "Available in default and sm sizing tiers, with optional clearing and disabled states.",
      "withoutClear": "Without Clear Button"
    },
    "mediaProgressBar": {
      "currentElapsedTooltip": "Current: Elapsed (Played Time)",
      "currentRemainingTooltip": "Current: Countdown (Remaining Time)",
      "description": "Universal media playback progress bar supporting drag-scrubbing, click-to-seek, hover preview, elapsed/remaining time display, click to toggle countdown, and context format menu.",
      "elapsedMode": "Elapsed (Played)",
      "formatFrames": "Frame Rate (0 frames)",
      "formatHms": "Hours/Min/Sec (00:00)",
      "formatSeconds": "Seconds (0.0s)",
      "framesUnit": "{{f}} frames",
      "playbackStatus": "Playback Progress",
      "remainingMode": "Countdown (Remaining)",
      "timeFormatMenuTitle": "Time Format",
      "timingModeLabel": "Timing Mode",
      "timingModeMenuTitle": "Timing Mode",
      "toggleTooltip": "Click to toggle · Right click for menu"
    },
    "presetNumberInput": {
      "auto": "Auto",
      "currentValue": "Current value:",
      "customPresetsSmall": "Custom Presets (Small)",
      "customPresetsSmallColon": "Custom Presets (Small):",
      "description": "High-density numeric input field with a quick-select dropdown panel for common dimension presets, unit tags, and optional clear action.",
      "disabledTitle": "Disabled State",
      "disallowClear": "Disallow Clear (Mandatory)",
      "empty": "(empty)",
      "placeholder": "Width / Height",
      "textureDimension": "Texture Dimension",
      "textureDimensionColon": "Texture Dimension:",
      "variantsDesc": "Configure custom numeric presets, disable the clear option, or place the control in disabled state.",
      "variantsTitle": "Variants & Configurations"
    },
    "rangeSlider": {
      "description": "Dual-thumb slider for selecting numeric min-max intervals with collision prevention and keyboard accessibility."
    },
    "readOnlyInput": {
      "apiSecretKey": "API Secret Key (Masked with Copy):",
      "description": "Protected input field for API keys, tokens, and IDs with built-in copy-to-clipboard action and masking toggle.",
      "personalAccessToken": "GitHub Personal Access Token (Masked):"
    },
    "segmentedControl": {
      "description": "A compact pill-style segmented switch for toolbars, menus, and view toggles with icon and badge support."
    },
    "select": {
      "description": "Displays a list of options for the user to pick from, triggered by a button with item indicators and scroll buttons.",
      "placeholder": "Select an option..."
    },
    "slider": {
      "description": "An interactive control that allows the user to select a numeric value along a track."
    },
    "snapSlider": {
      "description": "Stepped discrete slider that snaps to defined stops with ticks and label row."
    },
    "switch": {
      "description": "A control that allows the user to toggle between checked and not checked states, with support for async loading, read-only mode, and helper descriptions."
    },
    "panel-card": {
      "description": "Card surface with integrated collapsible sections and header action slots."
    },
    "scroll-area": {
      "description": "Custom scrollable container with hot-zone expansion and stepper buttons."
    },
    "setting-row": {
      "description": "Settings form item layout with title, description, control slot, and anchor flash."
    },
    "viewport-constrained-container": {
      "description": "Container that dynamically bounds max-height based on available viewport space below the anchor."
    },
    "splitter-handle": {
      "description": "Edge resize handle with reference item coordinate stabilization and min/max clamping."
    },
    "table-of-contents": {
      "description": "Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support."
    },
    "card": {
      "description": "Displays a card with header, title, description, content, and footer actions."
    },
    "collapsible": {
      "description": "An interactive component which expands and collapses a panel of content."
    },
    "panelCard": {
      "defaultTitle": "Panel Title",
      "description": "Card surface with integrated collapsible sections and header action slots for desktop sidebars and inspectors."
    },
    "resizable": {
      "description": "Accessible resizable panel groups and layout splitters."
    },
    "scrollArea": {
      "description": "Augments native scroll functionality with custom cross-browser styling, dynamic hot-zone expansion, and interactive stepper navigation buttons."
    },
    "settingRow": {
      "description": "Standardized preferences and settings item row layout with title, description, embedded control zone, and anchor flash highlight."
    },
    "sidebar": {
      "description": "Composable, responsive and resizable desktop-grade sidebar navigation system supporting icon-collapse, offcanvas drawers, and custom rem sizing."
    },
    "splitter": {
      "description": "Multi-pane resizable layout container with draggable gutters and collapse limits for IDEs and desktop toolkits."
    },
    "splitterHandle": {
      "description": "Edge resize handle with reference item coordinate stabilization, min/max clamping, and keyboard navigation."
    },
    "tableOfContents": {
      "description": "Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support."
    },
    "tabs": {
      "description": "A set of layered content sections known as tab panels, displayed one at a time."
    },
    "viewportConstrainedContainer": {
      "description": "Container that dynamically bounds max-height based on available viewport space below the anchor rect, supporting custom upper limit overrides and smooth vertical scrolling."
    },
    "alert-dialog": {
      "description": "A modal dialog that interrupts the user with important content and requires confirmation."
    },
    "dropdown-menu": {
      "description": "Displays a menu to the user triggered by a button with item groups and shortcuts."
    },
    "context-menu": {
      "description": "Displays a menu located at the pointer coordinates on right-click or context gesture."
    },
    "draggable-modal": {
      "description": "Desktop floating window with dragging title bar and bound viewport constraints."
    },
    "scale-osd": {
      "description": "Floating on-screen display pill for canvas zoom and scale adjustments with auto-hide."
    },
    "task-hud": {
      "description": "Floating stack of background executions with progress, overflow and collapse-to-summary."
    },
    "notification-stack": {
      "description": "Floating, severity-coded notification stack with per-item lifetimes and inline actions."
    },
    "floating-notice": {
      "description": "Floating stacked notice pill anchored to top or bottom with priority queueing, card-stack cycling, and extensible content."
    },
    "alertDialog": {
      "confirmText": "Continue",
      "description": "This action cannot be undone. This will permanently delete your account and remove your data.",
      "title": "Are you absolutely sure?"
    },
    "contextMenu": {
      "description": "Displays a menu located at the pointer coordinates on right-click or desktop context gesture."
    },
    "dialog": {
      "confirmText": "Continue",
      "description": "A modal window that interrupts the user with critical content and prompts for user action."
    },
    "draggableModal": {
      "description": "Desktop floating window with dragging title bar and bound viewport constraints.",
      "sizeMenuTooltipDefault": "Adjust Size",
      "titleDefault": "Inspector Window"
    },
    "dropdownMenu": {
      "description": "Displays a menu to the user triggered by a button, supporting items, labels, separators, shortcuts, and destructive actions."
    },
    "floatingNotice": {
      "description": "Floating stacked notice pill anchored to top or bottom with priority queueing, card-stack cycling, and extensible content."
    },
    "notificationStack": {
      "defaultLabel": "Notifications",
      "description": "Floating, severity-coded notification stack with per-item lifetimes and inline actions."
    },
    "popover": {
      "description": "Displays rich interactive content in a floating portal anchored to a trigger, with accessible focus management."
    },
    "scaleOsd": {
      "description": "Floating on-screen display pill for canvas zoom and scale adjustments with auto-hide."
    },
    "sheet": {
      "description": "Extends the dialog component to display content that slides in from any screen edge (top, right, bottom, left)."
    },
    "taskHud": {
      "description": "Floating stack of background executions with progress, overflow and collapse-to-summary.",
      "dismissPrefix": "Dismiss ",
      "label": "Task Progress HUD"
    },
    "tooltip": {
      "description": "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it."
    },
    "window-title-bar": {
      "description": "Desktop window frame header with title, drag region, and minimize/maximize/close buttons."
    },
    "smooth-wheel-handler": {
      "description": "Desktop kinematic scrolling helper with continuous damping, Shift-horizontal conversion, and gesture mutex."
    },
    "virtual-list": {
      "description": "High-performance windowed 100k+ row list with dynamic or fixed item measurements."
    },
    "virtual-tree": {
      "description": "Virtualized hierarchical tree view with node expansion, selection, and keyboard navigation."
    },
    "virtual-grid": {
      "description": "2D windowed grid virtualizer for massive dataset visualization."
    },
    "smoothWheelHandler": {
      "description": "Desktop kinematic scrolling helper providing continuous physical momentum damping, Shift+wheel horizontal conversion, and gesture mutex."
    },
    "virtualGrid": {
      "description": "2D responsive windowed grid virtualizer for massive cards, matrix data, and dynamic layouts."
    },
    "virtualList": {
      "description": "High-performance windowed 100k+ row list powered by TanStack Virtual, rendering only DOM nodes visible in the active viewport."
    },
    "virtualTree": {
      "description": "Virtualized hierarchical tree view with node expansion, selection, and keyboard navigation."
    },
    "windowTitleBar": {
      "description": "Desktop window frame header with title, drag region, and minimize/maximize/close control buttons for frameless native windows."
    },
    "generic-data-table": {
      "description": "Full-featured data table with column sorting, filtering, selection, and pagination."
    },
    "query-builder": {
      "description": "Visual rule tree builder for structured query generation with nested logic groups."
    },
    "code-block": {
      "description": "Spec-driven syntax-highlighted code viewer composed from scroll, copy, and tab primitives."
    },
    "pipeline-view": {
      "description": "Multi-stage execution view and pipeline center with job tracking, step timelines, and virtualized auto-scrolling log console."
    },
    "address-bar": {
      "description": "Explorer and browser-style navigation bar with interactive breadcrumbs and inline path editing."
    },
    "theme-settings": {
      "description": "Cross-stack theme settings controller managing mode, accent palette, decoration level, and UI density."
    },
    "language-settings": {
      "description": "Cross-stack language configuration card with system detection and cultural poetry quotes."
    },
    "keybinding-manager": {
      "description": "Cross-stack keybinding and shortcut manager with reverse key search, multi-scope filtering, conflict detection, and reference cheat sheet export."
    },
    "keybindingManager": {
      "activeResolver": "Active Resolver",
      "addAlternative": "Add alternative shortcut",
      "allScopes": "All Scopes",
      "clearSameChord": "Clear chord filter",
      "conflict": "Conflict",
      "conflictExplanation": "The shortcut key is assigned to multiple actions in the same active scope. Choose an action to keep or reassign.",
      "conflictTitle": "Shortcut Key Conflict",
      "conflictTooltip": "Shortcut key conflict detected; click to resolve",
      "defaultSection": "General Actions",
      "export": "Export Sheet",
      "exportTitle": "Export Markdown reference cheat sheet",
      "noMatches": "No matching actions found",
      "noMatchesHint": "Try adjusting your search query or scope filter.",
      "resetAction": "Reset to factory default",
      "resetAll": "Reset All",
      "resetAllTitle": "Revert all shortcuts to factory defaults",
      "sameChord": "Same Chord:",
      "sandboxTitle": "Interactive Keybinding Manager",
      "scopeBadgeTooltip": "Active scope for this action",
      "scopeFilterTooltip": "Filter keybinding actions by active scope",
      "searchPlaceholder": "Search actions or keys (e.g. Ctrl+)...",
      "searchTooltip": "Search action names or type keys (e.g. Ctrl+) for reverse lookup",
      "unassigned": "Unassigned",
      "userModified": "User",
      "userModifiedTooltip": "This keybinding has been modified by the user"
    },
    "addressBar": {
      "description": "Explorer and browser-style navigation bar with interactive breadcrumbs and inline path editing."
    },
    "codeBlock": {
      "description": "Spec-driven syntax-highlighted code viewer composed from ChaSet scroll, copy, tab, and card primitives over a shared zero-dependency lexer — identical tokenization and colors on React and Qt."
    },
    "genericDataTable": {
      "description": "Full-featured desktop-grade data table powered by TanStack Table, with column sorting, filtering, selection, and pagination.",
      "filterPlaceholder": "Filter records...",
      "next": "Next",
      "pageOf": "Page {{current}} of {{total}}",
      "previous": "Previous"
    },
    "languageSettings": {
      "description": "Cross-stack language configuration card with system detection and cultural poetry quotes."
    },
    "logConsole": {
      "empty": "No logs"
    },
    "pipelineView": {
      "description": "Multi-stage execution view and pipeline center with job tracking, step timelines, and virtualized auto-scrolling log console."
    },
    "queryBuilder": {
      "description": "Visual rule tree builder for structured search query generation with nested logic groups (AND/OR), operator filters, and JSON serialization."
    },
    "stepTimeline": {
      "emptyText": "No steps"
    },
    "table": {
      "description": "A responsive, accessible table component with row hover highlights, clean borders, and header/caption semantics.",
      "emptyState": "No data available"
    },
    "themeSettings": {
      "description": "Cross-stack theme settings controller managing mode, accent palette, decoration level, and UI density."
    }
  },
  "desktopComposite": {
    "app": {
      "docsTitle": "ChaSet Docs",
      "navLabel": "Navigation"
    },
    "buttonSection": {
      "asChildLink": "asChild Link (<a>)",
      "asyncBlock": "async & block",
      "clear": "Clear",
      "deleteItem": "Delete Item",
      "disabledButton": "Disabled Button",
      "emptyLog": "Click buttons above to see click events…",
      "fullWidthAction": "Full Width Block Action",
      "logTitle": "Interaction Log (Click events)",
      "statesLabel": "states",
      "title": "Components · Button Matrix",
      "desc": "Neutral contract (spec/components/button.ts) implemented via @base-ui/react. Full variant × size matrix, polymorphic link rendering, and asynchronous loading states."
    },
    "header": {
      "draggableModal": "Draggable Modal",
      "genericDataTable": "Generic Data Table",
      "githubRepo": "GitHub Repository",
      "openNavSidebar": "Open navigation sidebar",
      "queryBuilder": "Query Builder",
      "splitter": "Splitter",
      "toggleTheme": "Toggle theme appearance",
      "virtualList": "Virtual List"
    },
    "badge": {
      "overviewHeading": "Interactive Overview",
      "sizeSmall": "Small (sm)"
    },
    "button": {
      "iconLabel": "Icon",
      "iconLgLabel": "Icon-LG",
      "iconSmLabel": "Icon-SM",
      "iconXsLabel": "Icon-XS",
      "sandboxTitle": "Interactive Button Sandbox",
      "settingsAriaLabel": "Settings"
    },
    "copyButton": {
      "sandboxTitle": "Copy Button Sandbox"
    },
    "elidedText": {
      "overviewHeading": "Interactive Overview"
    },
    "kbd": {
      "altChoices": "Alternative Key Choices:",
      "combinationsDesc": "Support for multi-key combinations, alternative choices, and compact modifier symbols.",
      "combinationsTitle": "Key Combinations & Symbols",
      "commandPalette": "Command Palette",
      "compactSymbols": "Compact Modifier Symbols:",
      "completeLabel": "Autocomplete",
      "copyPathLabel": "Copy Path",
      "dragHandleTooltip": "Drag right handle to resize container width",
      "exportProject": "Export Project as Archive",
      "invertedTooltip": "Inverted (Tooltip)",
      "menuDesc": "Dedicated Shortcut component with built-in right-alignment and non-shrinking behavior for menu items.",
      "menuTitle": "Menu Trailing Shortcuts",
      "multiModifier": "Multi-Modifier Sequence:",
      "narrowDesc": "When the parent container is squeezed, the label is truncated while the shortcut stays intact or compresses into symbols.",
      "narrowTitle": "Narrow Container Adaptation",
      "newFile": "New File",
      "outlineDefault": "Outline (Default)",
      "overviewHeading": "Interactive Overview",
      "playgroundDesc": "Drag the right handle or adjust the slider to observe how the shortcut bar progresses through 4 adaptive stages: Full scale → Squeezed micro-scale → Compact symbols → +N folded badge with floating popover.",
      "playgroundTitle": "Interactive Multi-Stage Responsive Playground",
      "presetCompact": "Compact ({{value}})",
      "presetFolded": "Folded ({{value}})",
      "presetFull": "Full ({{value}})",
      "presetSqueezed": "Squeezed ({{value}})",
      "presetsLabel": "Presets:",
      "sandboxTitle": "Kbd Sandbox",
      "saveDocument": "Save Document",
      "sizeSm": "Small (sm)",
      "sizeXs": "Extra Small (xs)",
      "stageCompact": "Stage 3: Compact (Symbols)",
      "stageFolded": "Stage 4: Folded (+N Collapsed)",
      "stageFull": "Stage 1: Full (Full Text)",
      "stageSqueezed": "Stage 2: Squeezed (Scaled)",
      "variantInverted": "Inverted",
      "variantOutline": "Outline",
      "variantSolid": "Solid",
      "variantSubtle": "Subtle",
      "veryLongAction": "Very Long Action Name That Truncates",
      "widthBadge": "Width: {{value}}",
      "widthLabel": "Width:"
    },
    "label": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Label Sandbox"
    },
    "separator": {
      "mitLicense": "MIT License",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Separator Sandbox",
      "stackBadge": "React 19 & Qt 6"
    },
    "shortcutBar": {
      "cancel": "Cancel",
      "close": "Close",
      "confirm": "Confirm",
      "moreShortcuts": "More shortcuts",
      "move": "Move",
      "nav": "Navigate",
      "open": "Open",
      "select": "Select",
      "selected": "Selected",
      "toggle": "Collapse/Expand"
    },
    "skeleton": {
      "sandboxTitle": "Skeleton Sandbox"
    },
    "splitButton": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Split Button Sandbox"
    },
    "squircle": {
      "borderNote": "Traditional CSS borders render uneven widths or hard corners under superellipse clipping. Passing borderWidth and borderColor renders an adaptive continuous-curvature vector stroke with uniform outline thickness.",
      "borderSupportLabel": "Continuous-Curvature Stroke Support:",
      "demoBadge": "Secondary Badge",
      "demoButton": "Squircle Button",
      "demoInput": "Squircle Input...",
      "demoOutline": "Outline Button",
      "demoPill": "Status Pill",
      "guideDesc": "External projects adopt the ChaSet iOS continuous-curvature system via two progressive enhancement strategies: the base layer accelerates all Tailwind utilities at zero cost through modern browser CSS features; legacy environments or high-precision bordered geometry fall back to guaranteed rendering through the primitive component.",
      "guideTitle": "Global Adoption Guide for External Projects",
      "installDesc": "Package installation and CMake / QML module linkage.",
      "installHeading": "Installation",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Squircle Sandbox & Curvature Comparison",
      "strategy1Desc": "Add a CSS feature query in the host project's global stylesheet (e.g. globals.css or index.css). Every element based on Tailwind rounded-* utilities is instantly promoted to iOS continuous-curvature superellipses, smoothly eliminating harsh edge creases.",
      "strategy1Title": "Universal CSS Acceleration (Global CSS Continuous-Curvature Acceleration)",
      "strategy2Desc": "For dialogs (Dialog/Sheet), highlight cards, or browser engines without CSS corner-shape support, wrap content with the ChaSet component. Internally it clips via SVG clipPath with ResizeObserver-driven geometry, guaranteeing 100% cross-platform pixel-smooth rendering.",
      "strategy2Title": "Guaranteed Progressive Enhancement (Container Progressive Enhancement)",
      "strategy3Desc": "ChaSet core design tokens ship built-in curvature variables. Host projects may define --cs-corner-shape and --cs-corner-smoothing at the root level, and the full component library automatically inherits the matching curvature.",
      "strategy3Title": "Design Tokens Configuration (Global Design-Token Setup)",
      "strategyBadge1": "Strategy 1",
      "strategyBadge2": "Strategy 2",
      "strategyBadge3": "Strategy 3",
      "tailwindNote": "No business-code changes to rounded-md, rounded-lg, or rounded-xl are needed. After the browser matches corner-shape: squircle, continuous-curvature superellipses apply directly, while the .rounded-full rule protects circular avatars and status dots from geometric distortion.",
      "tailwindSyncLabel": "Tailwind Synergy:"
    },
    "checkbox": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Checkbox Sandbox"
    },
    "colorPicker": {
      "overviewDesc": "Experiment with modes, sizes, swatches, and states across Web (React) and Desktop (Qt Quick).",
      "sandboxTitle": "ColorPicker Sandbox"
    },
    "durationInput": {
      "overviewDesc": "Directly type into any segment or use the up/down stepper buttons. Press Left/Right arrow keys to jump between segments, or pick from grouped quick-select presets.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Duration Input Sandbox"
    },
    "inlineEditableText": {
      "overviewDesc": "Click or double-click on the text below to modify it. Press Enter to confirm or Esc to cancel.",
      "sandboxTitle": "Inline Editable Text Sandbox"
    },
    "input": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Input Sandbox"
    },
    "keybindingRecorder": {
      "overviewDesc": "Click the recorder box below and press any key combination (e.g. {{example}}).",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Keybinding Recorder Sandbox"
    },
    "mediaProgressBar": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "MediaProgressBar Sandbox"
    },
    "presetNumberInput": {
      "overviewDesc": "Focus or click the input field to open the preset numbers list. Click an item to populate the field, or type custom numbers freely.",
      "sandboxTitle": "Preset Number Input Sandbox"
    },
    "rangeSlider": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Range Slider Sandbox",
      "sizesStatesTitle": "Sizes & States"
    },
    "readOnlyInput": {
      "overviewDesc": "Safely expose secret credentials with optional masking, reveal toggle, and one-click copy.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Read-Only Input Sandbox",
      "variantsDesc": "Available in default and sm sizing tiers with semantic status color schemes.",
      "variantsTitle": "Sizes & Status Variants"
    },
    "segmentedControl": {
      "annualTip": "Annual archive (Requires Pro plan)",
      "autoLabel": "Auto",
      "dailyTip": "Daily summary view",
      "darkLabel": "Dark",
      "dayLabel": "Day",
      "fixedWidthTitle": "Fixed Width & Truncation",
      "galleryTip": "Gallery view",
      "globalFormatterTitle": "Global tooltipFormatter Customization",
      "globalRenderTooltipTitle": "Global renderTooltip Customization",
      "gridTip": "Grid layout",
      "lightLabel": "Light",
      "listTip": "List layout",
      "menuInlineTitle": "Menu & Inline Title",
      "monthLabel": "Month",
      "monthlyTip": "Monthly overview calendar",
      "overviewHeading": "Interactive Overview",
      "perOptionTitle": "Per-Option Tooltips with Shortcuts & Arrows",
      "sandboxTitle": "Segmented Control Sandbox",
      "sizesBadgesTitle": "Sizes & Badges",
      "switchScheme": "Switch application color scheme",
      "themeTooltipFormat": "Theme: {{label}} — Switch application color scheme",
      "tooltipsHintsTitle": "Tooltips & Custom Hints",
      "tooltipsHintsDesc": "Options support rich interactive tooltips. You can provide plain text, keyboard shortcut badges, custom placement, rich custom content, or a global",
      "functionSuffix": "function.",
      "weekLabel": "Week",
      "weeklyTip": "Weekly timeline view",
      "yearLabel": "Year"
    },
    "select": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Select Sandbox"
    },
    "slider": {
      "examplesTitle": "Examples & States",
      "sandboxTitle": "Slider Sandbox",
      "valueLabel": "Value"
    },
    "snapSlider": {
      "sandboxTitle": "Snap Slider Sandbox"
    },
    "switch": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Switch Sandbox"
    },
    "card": {
      "overviewDesc": "Test card variants with interactive subcomponents synchronized across Web and Desktop.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Card Sandbox"
    },
    "collapsible": {
      "advancedOptionsQt": "Advanced System Options",
      "advancedSettings": "Advanced Project Settings",
      "defaultOpenDesc": "Render an uncontrolled collapsible with initial expanded state via",
      "defaultOpenDescQt": "Use defaultOpen to initialize the collapsible in an expanded state.",
      "defaultOpenHeading": "Default Open",
      "disabledDesc": "Disables trigger interaction and dims opacity to prevent user expansion.",
      "disabledDescQt": "Prevents clicking and interaction with a dimmed appearance.",
      "disabledHeading": "Disabled State",
      "falseLabel": "False",
      "lockedSettings": "Locked Premium Settings",
      "overviewDesc": "Toggle the collapsible open/closed state or disable user interaction with live controls.",
      "overviewHeading": "Interactive Overview",
      "protectedSettings": "Protected Developer Settings",
      "sandboxTitle": "Collapsible Sandbox",
      "toggleLabel": "Toggle",
      "trueLabel": "True",
      "vulkanBadge": "Vulkan Validation Layers: Enabled",
      "buildFlags": "Build flags: --release --target=x86_64-pc-windows-msvc",
      "renderPipeline": "Render pipeline: Vulkan 1.3 / D3D12 Ultimate"
    },
    "panelCard": {
      "collapseHint": "Click the chevron icon or title to collapse and expand the card panel body.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Panel Card Sandbox"
    },
    "resizable": {
      "horizontalDesc": "Panels automatically adapt to available width and provide interactive drag handles with boundary limits.",
      "horizontalSandboxTitle": "Horizontal Resizable Group",
      "horizontalTitle": "Horizontal Split",
      "nestedDesc": "Embed vertical panel groups inside horizontal panels to construct multi-pane IDE workbenches and docking surfaces.",
      "nestedTitle": "Nested Resizable Layout",
      "playgroundDesc": "Toggle between horizontal and vertical orientations and test visual grip handle styles dynamically.",
      "playgroundTitle": "Interactive Playground"
    },
    "scrollArea": {
      "cellLabel": "Cell",
      "colCategory": "Category",
      "colCommit": "Commit",
      "colFeatureName": "Feature Name",
      "colStatus": "Status",
      "colTargetStack": "Target Stack",
      "dualAxisDesc": "When content exceeds both width and height, both scrollbars render with a synchronized corner piece.",
      "dualAxisTitle": "Dual-Axis",
      "horizontalClusterTitle": "Horizontal Cluster",
      "horizontalDesc": "Hover over the bottom scrollbar to reveal the left and right stepper buttons.",
      "horizontalLeft": "Left: To Start (Home) & Page Left",
      "horizontalRight": "Right: Page Right & To End (End)",
      "horizontalSmooth": "Supports smooth animated interpolation.",
      "horizontalTitle": "Horizontal Example",
      "hotZoneDesc": "Traditional narrow scrollbars are difficult to target with a mouse pointer. ChaSet introduces a compact 0.5rem transparent interaction hot-zone paired with an animated visual indicator that expands from 0.25rem (idle) to 0.5rem (hover) with 150ms cubic easing.",
      "hotZoneHit": "Hit Area: 0.5rem compact trigger box prevents accidental cursor capture.",
      "hotZoneHover": "Hover State: Expands to 0.5rem with high visual affordance.",
      "hotZoneIdle": "Idle State: 0.25rem slim indicator bar, non-intrusive.",
      "hotZoneTitle": "Dual-Box Hot Zone",
      "overviewDesc": "Interactive playground demonstrating cross-stack scrollbar styling, stepper pagination, and dynamic hot-zone expansion.",
      "sandboxTitle": "ScrollArea Showcase",
      "stepperDesc": "Hovering the scrollbar reveals two-end stepper action buttons:",
      "stepperTitle": "Stepper Buttons",
      "verticalAuto": "Auto-disabled when at boundary limits.",
      "verticalBottom": "Bottom: Page Down & To Bottom (End)",
      "verticalClusterTitle": "Vertical Cluster",
      "verticalTop": "Top: To Top (Home) & Page Up (85% viewport step)"
    },
    "scrollBar": {
      "pageDown": "Page down",
      "pageLeft": "Page left",
      "pageRight": "Page right",
      "pageUp": "Page up",
      "toBottom": "To bottom",
      "toEnd": "To end",
      "toLeft": "To left",
      "toTop": "To top"
    },
    "settingRow": {
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Setting Row Sandbox"
    },
    "sidebar": {
      "docsNav": "Documentation Navigation",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Sidebar Sandbox"
    },
    "splitter": {
      "fileComponents": "▸ components",
      "fileLayout": "▸ layout",
      "fileSrc": "▾ src",
      "horizontalDesc": "Hover over the gutter between panes and drag horizontally to resize panels. Double-click to reset.",
      "horizontalSandboxTitle": "Horizontal Splitter Sandbox",
      "overviewHeading": "Horizontal Splitter",
      "verticalDesc": "Top and bottom pane split with horizontal divider line. Drag vertically to resize console output.",
      "verticalSandboxTitle": "Vertical Splitter",
      "verticalTitle": "Vertical Splitter"
    },
    "splitterHandle": {
      "horizontalPrefix": "Handles can also be attached to horizontal edges (",
      "horizontalSuffix": ") for bottom console or drawer resizing.",
      "overviewDesc": "Drag the right edge handle to resize the sidebar. Double click or press Enter to reset to 200.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Splitter Handle Sandbox",
      "verticalTitle": "Vertical Edge Handle"
    },
    "tableOfContents": {
      "overviewHeading": "Interactive Overview",
      "readingPanePara": "Notice how the table of contents tree reflects the nested heading structure, and smoothly aligns with the top banner height offset.",
      "sandboxTitle": "Table of Contents Sandbox"
    },
    "tabs": {
      "examplesDesc": "Visual matrix of tab variants, sizes, badges, and disabled states.",
      "overviewDesc": "Test interactive tab switching, pill vs line underline styles, size scaling, and keyboard arrow navigation.",
      "sandboxTitle": "Tabs Sandbox"
    },
    "viewport": {
      "overviewDesc": "The container dynamically measures the distance from its anchor to the bottom of the window (window.innerHeight - rect.top - margin) and clamps content height to prevent overflowing outside the viewport.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Viewport Constrained Container Sandbox",
      "variantsDesc": "Configure custom numeric overrides, string-based bounds, or custom margin offsets.",
      "variantsTitle": "Variants & Limits"
    },
    "activityStack": {
      "accessibleLabel": "Activity stack",
      "overflowLabel": "{{count}} more items",
      "summaryText": "{{count}} items {{label}}"
    },
    "contextMenu": {
      "overviewDesc": "Right-click (or long press) inside the dashed container below to reveal the context menu.",
      "sandboxTitle": "Context Menu Sandbox"
    },
    "dialog": {
      "demoName": "Alex Rivera",
      "examplesDesc": "Common modal dialog patterns: desktop draggable windows, confirmation dialogs, and alert notices.",
      "overviewDesc": "Experience full modal behavior with backdrop blur, keyboard ESC dismissal, and focus containment across Web and Desktop.",
      "sandboxTitle": "Dialog Sandbox"
    },
    "draggableModal": {
      "allocBadge": "128 alloc",
      "overviewDesc": "Click the button below to open the draggable modal window, supporting size presets, drag repositioning, and auto-fitting height.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Draggable Modal Sandbox"
    },
    "dropdownMenu": {
      "overviewDesc": "Click the trigger below to open the dropdown menu. Keyboard navigation and shortcuts are fully supported.",
      "sandboxTitle": "Dropdown Menu Sandbox"
    },
    "notificationStack": {
      "levelsTitle": "Levels & Actions",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Notification Stack Sandbox"
    },
    "popover": {
      "arrowButton": "Arrow Popover",
      "arrowContent": "This popover renders an anchored pointer triangle.",
      "arrowDesc": "Anchored triangle indicator pointed directly at the trigger",
      "arrowTitle": "With Directional Arrow",
      "examplesDesc": "Common interactive configurations including directional arrows and draggable repositioning.",
      "movableButton": "Movable Popover",
      "movableContent": "Drag the top grip bar to move this popover anywhere.",
      "movableDesc": "Interactive drag header to freely reposition the popover layer",
      "movableTitle": "Movable Drag Handle",
      "overviewDesc": "Click the button below to toggle the anchored popover card, test side alignment, directional arrows, and draggable move handles.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Popover Sandbox"
    },
    "scaleOsd": {
      "overviewHeading": "Interactive Overview",
      "percentFormat": "{{percent}}%",
      "reset": "Reset",
      "sandboxTitle": "Scale OSD Sandbox",
      "uiScaleFormat": "UI scale {{percent}}%",
      "zoomIn": "Zoom in",
      "zoomOut": "Zoom out"
    },
    "sheet": {
      "demoName": "Alex Developer",
      "demoRole": "Staff Infrastructure Architect",
      "overviewDesc": "Choose a slide edge and size preset, then trigger the drawer modal.",
      "sandboxTitle": "Sheet Sandbox"
    },
    "taskHud": {
      "anchorLabel": "anchor: {{placement}}",
      "overflowSandboxTitle": "Collapsed & Overflow",
      "sandboxTitle": "Task HUD Sandbox"
    },
    "tooltip": {
      "examplesDesc": "Visual matrix of common Tooltip configurations across all 4 directional placements and interaction states.",
      "examplesDescQt": "Visual matrix of Tooltip directional placements in Qt Quick Desktop.",
      "overviewDesc": "Test interactive hover delays, side positioning, keyboard shortcut badges, directional arrows, and disabled behavior across Web and Qt Quick Desktop. Placement policy: dense vertical lists (menu items, select options, sidebar nav, virtual rows) default to right so bubbles never cover the prev/next sibling; top-docked chrome defaults to bottom; bottom-docked chrome to top; modal close buttons to bottom; everything else to top.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Tooltip Sandbox"
    },
    "smoothWheelHandler": {
      "bullet1": "• Momentum Accumulation: Consecutive wheel clicks accumulate linearly to targetPos rather than interrupting or jerking the active transition.",
      "bullet2": "• Gesture Decoupling: Automatically listens to targetItem.moving and targetItem.flicking. When the user touches or drags the view, smooth animations abort instantly to prevent motion fight.",
      "bullet3": "• Universal Drop-In: Targets any Flickable / ListView / GridView or ChaSetScrollArea without modifying existing visual hierarchies.",
      "card1Desc": "When rapid successive wheel ticks occur, delta offsets are accumulated onto the existing target position rather than jerking backwards or stuttering.",
      "card1Title": "Continuous Momentum Accumulation",
      "card2Desc": "In horizontal viewports or long-scroll carousels, automatically intercepts vertical wheel actions while holding Shift and maps them to horizontal translation.",
      "card2Title": "Shift+Wheel Horizontal Translation",
      "card3Desc": "Instantly terminates smooth scroll interpolation when the user touches the thumb handle or flicks with touchpads, ensuring zero physical friction.",
      "card3Title": "Gesture & Drag Decoupling",
      "dampingDuration": "Damping Duration:",
      "itemBadge": "Item #{{index}}",
      "itemLabel": "Smooth Scroll Item #{{index}}",
      "kinematicsTitle": "Kinematic Architecture",
      "sandboxTitle": "Smooth Wheel Handler Sandbox",
      "speedMultiplier": "Speed Multiplier:"
    },
    "virtualGrid": {
      "assetLabel": "Asset #{{index}}",
      "btn20": "Card #20",
      "btn40": "Card #40",
      "btn500": "Card #500",
      "btnBottom": "Bottom (#60)",
      "btnBottom1000": "Bottom (#1,000)",
      "btnTop": "Top (#1)",
      "hint": "Rendering 1,000 Grid Cards with Responsive Recycling:",
      "itemDesc": "Virtual windowed card unit asset {{index}}",
      "itemTitle": "Module #{{index}}",
      "overviewDesc": "Virtualizing responsive card columns with automatic width calculation and row-based DOM recycling. Use controls below for programmatic navigation.",
      "overviewHeading": "Interactive Overview",
      "pending": "Pending",
      "sandboxTitle": "Virtual Grid Sandbox"
    },
    "virtualList": {
      "btn2500": "Index #2,500",
      "btn500": "Index #500",
      "btnBottom": "Bottom (#10,000)",
      "btnTop": "Top (#1)",
      "hint": "Rendering 10,000 Virtual Items with Native Wheel Flicking:",
      "itemTitle": "Dataset Item #{{index}}",
      "overviewHeading": "Interactive Overview",
      "production": "Production",
      "renderingHint": "Rendering {{count}} virtual items smoothly at 60fps. Use the controls below to trigger programmatic scrolling or scroll rapidly to observe instant windowing.",
      "sandboxTitle": "Virtual List Sandbox",
      "searchPlaceholder": "Search...",
      "emptyFiltered": "No matching items",
      "emptyDefault": "List is empty",
      "staging": "Staging"
    },
    "virtualTree": {
      "clipboardCleared": "Clipboard cleared.",
      "clipboardEmpty": "Clipboard is empty. Press Ctrl+C to copy or Ctrl+X to cut items first.",
      "collapseAll": "Collapse All",
      "copiedBadge": "{{count}} copied (pulsing)",
      "copyBtn": "Copy (Ctrl+C)",
      "copyStatus": "Copied {{count}} item(s) (pulsing). Select a target and press Ctrl+V to paste or Esc to cancel.",
      "cutBadge": "{{count}} cut (dimmed)",
      "cutBtn": "Cut (Ctrl+X)",
      "cutStatus": "Cut {{count}} item(s) (dimmed). Select a target and press Ctrl+V to paste or Esc to cancel.",
      "deleteBtn": "Delete (Del)",
      "deletedStatus": "Deleted {{count}} item(s).",
      "dirBadge": "dir",
      "droppedCopied": "Copied {{source}} -> {{pos}} \"{{target}}\".",
      "droppedMoved": "Moved {{source}} -> {{pos}} \"{{target}}\".",
      "expandAll": "Expand All",
      "hudCancel": "Cancel",
      "hudCopyToTarget": "Copy to target",
      "hudCopyVerb": "Copy to",
      "hudCountPrefix": "{{count}} items · ",
      "hudDragging": "Dragging ({{count}} items)",
      "hudHold": "Hold",
      "hudHoldCtrl": "Hold Ctrl",
      "hudInside": "{{prefix}}{{verb}}: {{target}}",
      "hudMoveToTarget": "Move to target",
      "hudMoveVerb": "Move into",
      "hudPressEsc": "Press Esc",
      "hudRelease": "Release",
      "hudReleaseLeft": "Release left button",
      "hudSibling": "{{prefix}}Place alongside: {{target}}",
      "mode": "Mode: {{mode}}",
      "multi": "Multi",
      "noTarget": "No target selected for paste.",
      "none": "None",
      "overviewDesc": "Hierarchical tree with multi-selection (Ctrl/Shift+Click), external dimmed cut state (Ctrl+X/V), copied state (Ctrl+C/V), Ctrl+Drag copy, and keyboard navigation.",
      "overviewHeading": "Interactive Overview",
      "pasteBtn": "Paste (Ctrl+V)",
      "pastedCopied": "Pasted (copied) {{count}} item(s) into/after \"{{target}}\".",
      "pastedMoved": "Pasted (moved) {{count}} item(s) into/after \"{{target}}\".",
      "readyStatus": "Ready. Try selecting files or dragging to reorder (hold Ctrl to copy).",
      "resetStatus": "Reset tree to default.",
      "sandboxTitle": "Virtual Tree Sandbox",
      "selectedLabel": "Selected:",
      "single": "Single"
    },
    "windowTitleBar": {
      "appTitle": "ChaSet Desktop Studio",
      "captionEvent": "Caption Event:",
      "clientArea": "Frameless Client Window Area",
      "closeClicked": "Close clicked",
      "idle": "Idle",
      "maximizeClicked": "Maximize / Restore clicked",
      "minimizeClicked": "Minimize clicked",
      "overviewDesc": "Frameless window title bar with native-style action buttons.",
      "sandboxTitle": "Window Title Bar Sandbox"
    },
    "addressBar": {
      "activePath": "Active Path:",
      "activePathFormat": "Active Path: {{path}}",
      "backTooltip": "Back",
      "forwardTooltip": "Forward",
      "locProjectRoot": "Project Root",
      "locSystem32": "System32",
      "locPosixLog": "POSIX /var/log",
      "quickLocations": "Quick Locations:",
      "refreshes": "Refreshes: {{count}}",
      "refreshTooltip": "Refresh",
      "sandboxTitle": "Address Bar Sandbox",
      "searchPlaceholder": "Search...",
      "searchTooltip": "Search",
      "upTooltip": "Up one level"
    },
    "breadcrumb": {
      "allLocations": "All locations",
      "emptyFolder": "(Empty folder)",
      "expandSubfolders": "Expand subfolders of %1",
      "noMatch": "No matching folders found",
      "searchPlaceholder": "Search folders...",
      "showHiddenAncestors": "Show hidden ancestor folders"
    },
    "reorderableList": {
      "toggleTooltip": "Show/Hide"
    },
    "codeBlock": {
      "embeddedBadge": "embedded",
      "embeddedDesc": "Drop the card chrome and header for inline embedding",
      "gutterDesc": "Gutter with right-aligned line numbers",
      "monochromeDesc": "Monochrome fallback using the same layout",
      "multiFileDesc": "Pass a files array to render a tabbed group. Each tab carries its own language, and the copy button always targets the active file.",
      "multiFileTitle": "Multi-File Tabs",
      "overviewDesc": "A syntax-highlighted source viewer with a language label and one-click copy. Highlighting is produced by the shared spec lexer — no third-party highlighter is shipped on either stack.",
      "sandboxTitle": "Code Block Sandbox",
      "variantsDesc": "Line numbers, soft wrapping, bounded height with vertical scrolling, monochrome mode, and chrome-less embedding for inline prose.",
      "variantsTitle": "Variants & Options",
      "wrapBadge": "wrap",
      "wrapDesc": "Soft-wrap long lines instead of horizontal scroll"
    },
    "genericDataTable": {
      "colId": "ID",
      "colName": "User Name",
      "colRole": "Role",
      "overviewDesc": "Click column headers to sort ascending and descending.",
      "roleArchitect": "Lead Architect",
      "roleDevOps": "DevOps Engineer",
      "roleFrontend": "Frontend Engineer",
      "roleProduct": "Product Manager",
      "roleQt": "Qt Specialist",
      "sandboxTitle": "Generic Data Table Sandbox",
      "statusOffline": "Offline",
      "statusPending": "Pending"
    },
    "languageSettings": {
      "sandboxTitle": "Interactive Language Settings"
    },
    "pipelineView": {
      "jobBenchmark": "Benchmark Suite",
      "jobPackage": "Package Artifacts",
      "jobShaderComp": "Shader Compilation",
      "overviewDesc": "A high-performance execution inspector assembling job tracking, vertical step timelines, and virtualized auto-scrolling log consoles. All subcomponents can also be consumed independently.",
      "overviewHeading": "Interactive Overview",
      "sandboxTitle": "Pipeline View Sandbox",
      "stepCompileFragment": "Compile Fragment Stage",
      "stepCompileVertex": "Compile Vertex Stage",
      "stepDeadCode": "Dead Code Elimination",
      "stepEmitBinary": "Emit Target Binary",
      "stepParseSpirv": "Parse SPIR-V Bytecode",
      "stepRegAlloc": "Hardware Register Allocation"
    },
    "queryBuilder": {
      "addCondition": "+ Add condition",
      "addGroup": "+ Add Group",
      "combinatorLabel": "Combinator: {{combinator}}",
      "contains": "Contains",
      "deleteGroup": "Delete group",
      "equals": "Equals",
      "fieldAge": "Age",
      "fieldIsActive": "Is Active",
      "fieldPlaceholder": "Field",
      "fieldRole": "Role",
      "fieldStatus": "Status",
      "fieldUserName": "User Name",
      "operatorPlaceholder": "Operator",
      "overviewDesc": "Add rules and nested groups dynamically to construct complex query predicates.",
      "removeCondition": "Remove condition",
      "rulesCount": "Rules: {{count}}",
      "sandboxTitle": "Query Builder Sandbox",
      "serializedModel": "Serialized JSON Query Model:",
      "valuePlaceholder": "Value..."
    },
    "table": {
      "caption": "A list of your recent invoices.",
      "colAmount": "Amount",
      "colInvoice": "Invoice",
      "colMethod": "Method",
      "colRole": "Role",
      "colState": "State",
      "colTask": "Task",
      "colUser": "User",
      "examplesDesc": "Common table patterns and interactive configurations.",
      "examplesDescQt": "Common configurations and visual states in Qt Quick.",
      "filterPlaceholder": "Filter invoices...",
      "methodBankTransfer": "Bank Transfer",
      "methodCreditCard": "Credit Card",
      "noResults": "No results found.",
      "overviewDesc": "Test interactive data table controls with live filtering, row selection, and synchronized React and Qt Quick code.",
      "roleAdmin": "Administrator",
      "roleDesigner": "Designer",
      "roleDev": "Developer",
      "sandboxTitle": "Table Sandbox",
      "showCaption": "Show Caption",
      "simpleTableDesc": "Minimal table without header background or footer.",
      "simpleTableTitle": "Simple Data Table",
      "stateComplete": "Complete",
      "stateInReview": "In Review",
      "statePlanned": "Planned",
      "statusAll": "All",
      "statusCardDesc": "Tables embedding status indicator badges and interactive row states.",
      "statusCardTitle": "Status Badges & Selection",
      "statusPaid": "Paid",
      "statusPending": "Pending",
      "statusUnpaid": "Unpaid",
      "taskApiIntegration": "API Integration",
      "taskDocumentation": "Documentation",
      "taskUnitTesting": "Unit Testing",
      "total": "Total",
      "userAlice": "Alice",
      "userBob": "Bob",
      "userCarol": "Carol"
    },
    "themeSettings": {
      "sandboxTitle": "Interactive Theme Settings"
    }
  },
  "getStarted": {
    "icons": {
      "centering": {
        "desc": "Centring is a property of the geometry, not something a component fixes afterwards. The gate measures the painted bounding box (artwork plus half the stroke) and fails when its centre drifts more than {{tolerance}} units from the grid centre. Anchors offsets and padding are deliberately not an accepted fix: they centre a box, not the ink inside it.",
        "measuredOffsetsTitle": "Measured offsets — painted centre minus grid centre, in grid units",
        "osdTrioDesc": "These three controls used to be typography: a bold plus, a bold minus sign and a regular reset arrow. Besides the mixed weight, a font's ascent and descent are not symmetric, so the arrow inherited a baseline that pushed it visibly low inside its pill. They are now three icons from this specification — same stroke, same grid, centred by geometry.",
        "osdTrioTitle": "The Scale OSD control trio",
        "title": "Optical Centring"
      },
      "configuration": {
        "consumingIcons": "Consuming icons",
        "currentlyResolved": "Currently resolved through {{source}}.",
        "desc": "A host that wants the whole of ChaSet pinned to one specification does not edit the library. It declares the id externally; the generator bakes the resolved id into both artifacts, so the choice is observable at runtime through ICON_SPEC_ID (web) and ChaSetIcons.specId (desktop).",
        "envOverride": "Environment override",
        "envOverrideDesc": "Useful for CI matrices that build the same sources under several specifications.",
        "firstMatchWins": "first match wins",
        "projectConfigDesc": "Commit this next to your package manifest to pin the specification for everyone building the project.",
        "projectConfigFile": "Project configuration file",
        "resolutionOrder": "Resolution order",
        "stepConfigLabel": "chaset.config.json → icons.spec",
        "stepConfigVal": "Project-level switch; committed, so the choice travels with the repository.",
        "stepEnvLabel": "Environment variable CHASET_ICON_SPEC",
        "stepEnvVal": "Highest priority — per shell, per CI job, no file edit.",
        "stepFallbackLabel": "First implemented specification",
        "stepFallbackVal": "Last resort, so a missing switch never breaks a build.",
        "stepRegistryLabel": "spec/icons/registry.json → activeSpec",
        "stepRegistryVal": "Library-level default when the host declares nothing.",
        "title": "External Configuration"
      },
      "extensibility": {
        "adoptionRatchet": "Adoption ratchet",
        "adoptionRatchetDesc": "{{total}} hand-authored <svg> site(s) remain in the frozen migration backlog against a budget of {{budget}}. The gate fails when that number grows, so the backlog can only shrink.",
        "desc": "The registry holds a list of specifications, not a single hard-coded one. A new specification is a new entry with its own grid, stroke and artwork; nothing in either stack needs to change, because both consume whichever entry the configuration selects.",
        "excusedFootnote": "Parametric vector art has no 24-grid stroke representation, so leaving it inside the budget would make the budget permanently unreachable. It is excluded instead — visibly, and only through a marker that carries a reason and must sit directly above the artwork it excuses. A marker that is unreasoned, dangling, or not attached to a following <svg> fails the gate.",
        "excusedNone": "None. Every inline artwork site in the repository owes a migration.",
        "excusedTitle": "Excused as non-iconography ({{total}})",
        "textGlyphsDesc": "{{count}} remaining. Characters such as plus, minus sign and the reset arrow are typography: they inherit weight, size and baseline from surrounding copy — the mechanism behind both defects this specification was written to remove.",
        "textGlyphsTitle": "Text glyphs used as icons",
        "title": "Extending the Specification",
        "workflow": "Workflow"
      },
      "gallery": {
        "desc": "Every icon of the active specification, rendered by name from the generated registry. Adding an icon to the registry makes it appear here on both stacks at once, and the gate refuses a name that has no geometry behind it.",
        "title": "Icon Gallery"
      },
      "grids": {
        "desc": "A grid pairs a drawing box with the stroke width that box expects, and states the render size it was drawn for. Two grids are declared: the default 24-unit grid for UI icons, drawn for a 16px render, and a dense 10-unit chrome grid whose 1-unit stroke stays hairline on window captions instead of collapsing to a sub-pixel smear.",
        "desktopLabel": "Desktop · {{size}}",
        "drawnFor": "drawn for {{renderSize}}px → {{stroke}}px stroke",
        "familiesDeclared": "{{count}} declared",
        "familiesDesc": "A family names icons that render together inside one control. Their grid is then a promise about the control rather than about any single icon, which is what the caption close button broke: every icon involved was individually valid, and the row was still wrong. The gate asserts that no family spans two grids.",
        "familiesTitle": "Control families",
        "floor": "floor {{size}} / {{strokeWidth}} = {{floor}}px",
        "gridBadge": "{{size}} units · stroke {{strokeWidth}}",
        "gridDesc": "{{renderSize}}px is the size this grid was drawn for, where its stroke paints {{stroke}}px — the weight the artwork was proportioned to carry. Under {{floor}}px that stroke is under a pixel and the glyph ships lighter than its artwork declares, so the steps this grid is honest at are {{sizes}}. A size outside that list is not a smaller icon, it is a lighter one — measured rather than banned, because a 2x display forgives it, so the gate lists every reference below its floor and each one is a decision instead of an accident.",
        "safeMargin": "safe margin {{margin}}",
        "sizeRampTitle": "Size ramp — one icon, every step of the scale, no hand scaling",
        "title": "Grids, Weight & Size",
        "unitGridBadge": "{{size}} unit grid",
        "webLabel": "Web · {{size}}",
        "weightPermitted": "{{count}} permitted",
        "weightStrokePrefix": "stroke {{strokeWidth}} — ",
        "weightTitle": "Weight"
      },
      "rules": {
        "desc": "Each rule below is enforced by pnpm check:icons, which also runs inside pnpm gate. A rule that is not machine-checked would only be a slogan, so the enforcement column names the assertion that fails.",
        "title": "Governance Rules"
      },
      "specification": {
        "desc": "Icons are declared once in spec/icons/registry.json and code-generated into both stacks. React renders the element vocabulary natively; Qt receives the same shapes compiled to path data. Neither stack owns artwork of its own, which is what makes the two platforms agree by construction rather than by review.",
        "iconsCount": "{{count}} icons",
        "rowColour": "Colour",
        "rowFill": "Fill policy",
        "rowGrid": "Grid",
        "rowLive": "Live area",
        "rowResolved": "Resolved through",
        "rowStroke": "Stroke",
        "rowTolerance": "Centring tolerance",
        "title": "Active Specification",
        "valGrid": "{{grid}} units",
        "valLive": "{{liveArea}} units (safe margin {{margin}})",
        "valStroke": "{{strokeWidth}} units, {{linecap}} caps, {{linejoin}} joins",
        "valTolerance": "{{tolerance}} units"
      }
    },
    "intro": {
      "architecture": {
        "title": "How It Works"
      },
      "packages": {
        "colDesc": "Description",
        "colPackage": "Package",
        "colTarget": "Target",
        "pkgQtDesc": "Qt reference implementation with native QML components.",
        "pkgReactDesc": "React component library published to npm.",
        "pkgSpecDesc": "Neutral token generator and contract schemas.",
        "title": "Packages"
      },
      "philosophy": {
        "desc": "ChaSet is part of the ChahuProject ecosystem. In traditional multi-platform apps, Web and Desktop design systems drift apart quickly. ChaSet solves this by establishing a neutral, machine-readable specification and token shard layer that drives both React and Qt simultaneously with pixel-perfect and behavioral parity.",
        "nativeErgonomicsDesc": "Tailwind CSS v4 & Base UI on React; pure QML Quick Controls on Qt — no electron bloat or foreign wrappers.",
        "nativeErgonomicsTitle": "Native Ergonomics",
        "oneSourceDesc": "Design tokens and API contracts reside in spec/ and emit synchronized tokens for Web & Qt.",
        "oneSourceTitle": "One Source of Truth",
        "parityGateDesc": "CI enforces that all required capabilities and visual rendering match 100% across stacks.",
        "parityGateTitle": "Automated Parity Gate",
        "title": "Design Philosophy"
      },
      "quickstart": {
        "buttonText": "Launch Workspace",
        "installDesc": "Install the package and peer dependencies:",
        "title": "Quick Start",
        "titleReact": "Quick Start (React)",
        "useAppDesc": "Use in your application:",
        "useReactDesc": "Use in your React project:"
      }
    },
    "themeTuner": {
      "playground": {
        "buttonLabel": "Button Label",
        "buttonPlaceholder": "Button text",
        "buttons": "BUTTONS",
        "clicks": "Clicks: {{count}}",
        "copyJsx": "Copy JSX",
        "danger": "Danger",
        "defaultActionLabel": "Default Action",
        "defaultProjectLabel": "Create Project",
        "desc": "Adjust props live, interact with the component, and copy ready-to-use code directly into your app.",
        "descQml": "Interact with components rendering live under your current style settings:",
        "disabled": "Disabled",
        "fullWidth": "Full Width",
        "ghostAction": "Ghost Action",
        "jsxUsage": "React JSX Usage",
        "linkAction": "Link Action",
        "loadingSpinnerActive": "Loading spinner active",
        "loadingState": "Loading State",
        "miniScrollViewport": "MINI SCROLL VIEWPORT",
        "outline": "Outline",
        "renderAsLink": "Polymorphic (<a> link via Base UI)",
        "saving": "Saving...",
        "secondary": "Secondary",
        "size": "Size",
        "title": "Interactive Component Sandbox",
        "titleQml": "Live Component Sandbox",
        "variant": "Variant",
        "viewportItem": "Item #{{index}}"
      },
      "tuner": {
        "accentPreset": "ACCENT THEME PRESET",
        "animSpeedFactor": "ANIMATION SPEED DURATION FACTOR",
        "appearance": "APPEARANCE & MODE",
        "cardPanel": "Card / Panel",
        "copyConfig": "Copy Config",
        "copyConfigTooltip": "Export theme configuration as CSS, Tailwind, or JSON",
        "cornerRadius": "CORNER RADIUS (--RADIUS)",
        "destructive": "Destructive",
        "focusRing": "Focus Ring",
        "liveColorOverrides": "LIVE COLOR OVERRIDES",
        "motionTitle": "MOTION & ANIMATIONS",
        "pageBackground": "Page Background",
        "primaryAction": "Primary Action",
        "primaryText": "Primary Text",
        "radiusDefault": "0.5rem (Default)",
        "radiusPill": "24px (Pill)",
        "radiusSharp": "0px (Sharp)",
        "resetTooltip": "Reset all custom color overrides",
        "secondaryBg": "Secondary Bg",
        "speedDefault": "0.20s (Default)",
        "speedFast": "0.05s (Fast)",
        "speedSlow": "0.80s (Slow)",
        "title": "Theme & Style Tuner"
      }
    },
    "tokens": {
      "palette": {
        "copySwatchTitle": "Click to copy CSS variable",
        "desc": "All derived from spec/tokens.json. Click any swatch to copy its CSS variable expression.",
        "title": "Palette · Semantic Core Tokens"
      },
      "typographyRadius": {
        "chartPaletteTitle": "CHART PALETTE (FOLLOWS ACCENT)",
        "codeComment1": "const fontSystem = ChaSet.FontSystem; // Automatically handles Chinese font fallback, eliminating SimSun aliasing",
        "codeComment2": "console.log(`[ChaSet] CJK glyphs: Smooth and sharp glyphs, zero raster artifacts`);",
        "desc": "Radii derived from --radius (same sm/md/lg/xl derivation as shadcn); font weights map to tokens.json primitives (500/600); chart five colors follow the accent.",
        "fontSystemTitle": "Font System · CJK Fallback & Typography Scale",
        "monoFallback": "Fallback Stack (Mono): ",
        "radiusDefault": "0.5rem (Default)",
        "sampleBold": "Bold 700 — ChaSet Component Library · Unified Cross-Stack Typography System (The quick brown fox jumps over the lazy dog 0123456789)",
        "sampleMedium": "Medium 500 — ChaSet Component Library · Unified Cross-Stack Typography System (The quick brown fox jumps over the lazy dog 0123456789)",
        "sampleRegular": "Regular 400 — ChaSet Component Library · Unified Cross-Stack Typography System (The quick brown fox jumps over the lazy dog 0123456789)",
        "sampleSemibold": "Semibold 600 — ChaSet Component Library · Unified Cross-Stack Typography System (The quick brown fox jumps over the lazy dog 0123456789)",
        "sansFallback": "Fallback Stack (Sans): ",
        "title": "Typography / Radius / Charts",
        "zeroSimSunBadge": "Zero-SimSun Guarantee"
      }
    },
    "typography": {
      "integration": {
        "cmakeTitle": "1. CMake Target Linkage",
        "cppTitle": "2. C++ Initialization (main.cpp)",
        "cssTokensDesc": "Reference var(--cs-font-sans) and var(--cs-font-mono) when customizing font stacks to preserve the prioritized Chinese fallback chain:",
        "cssTokensTitle": "CSS Tokens & Font Family Overrides",
        "desc": "How host applications configure and initialize ChaSet's typography subsystem across desktop and web runtimes.",
        "desktopDesc": "Desktop applications initialize the typography system via ChaSet::FontSystem. main.cpp configures DirectWrite native rasterization with vertical hinting and injects CJK fallback tables into QFontDatabase to guarantee hairline stroke continuity.",
        "desktopTitle": "Desktop · Qt Quick (C++ / QML)",
        "envCurve": "curve: Hardware GPU curve rasterizer (CurveTextRendering, Qt 6.7+). Resolution-independent GPU outline integration, optimized for high-DPI scaling. Automatically degrades to qt when a software rasterizer is active.",
        "envDesc": "The window-level text rasterization policy is controlled dynamically before startup via the CHASET_TEXT_RENDER environment variable:",
        "envNative": "native (default): Operating-system rasterizer (DirectWrite / CoreText, NativeTextRendering). Outlines are grid-fitted for pixel-level clarity and hairline stroke continuity at 100% scale.",
        "envQt": "qt: Qt glyph outline rasterizer (QtTextRendering). Grayscale outline rasterizer sampled from platform glyph bitmaps.",
        "envTitle": "3. Environment Variable Control (CHASET_TEXT_RENDER)",
        "title": "Host Integration",
        "webDesc": "Web applications in Chromium / browsers automatically inherit grayscale antialiasing (-webkit-font-smoothing: antialiased) and CJK fallback chains through CSS variables. Environment variables and C++ initialization do not apply to the Web stack.",
        "webTitle": "Web · Chromium (React / CSS)"
      },
      "ramp": {
        "desc": "Five script portals, each rendered once per type scale step. The passage never changes inside a block, so strokes can be compared across the whole ramp — including the rounded CJK and Hangul curves that reveal grid fitting first. Sizes follow the type scale and the interface scale, so they are named by token instead of by unit.",
        "title": "Cross-Script Size Ramp"
      },
      "rasterizer": {
        "desc": "The two stacks reach the same glyph outlines through different rasterizers. Web hands smoothing to Chromium and never fits outlines to the grid; Desktop resolves one policy for the whole process before the first window exists and integrates the outline per pixel on the GPU, which is what keeps strokes anti-aliased and sharp at the same time.",
        "desktopCardTitle": "Desktop · Qt Quick",
        "labelFitting": "Outline fitting",
        "labelHinting": "Hinting",
        "labelPolicies": "Policies",
        "labelRasterizer": "Rasterizer",
        "labelScale": "Interface scale",
        "labelSmoothing": "Font smoothing",
        "labelSubpixel": "Subpixel AA",
        "qtValHinting": "Vertical hinting (PreferVerticalHinting)",
        "qtValPolicies": "native (default) · curve · qt",
        "qtValRasterizer": "Selected by CHASET_TEXT_RENDER",
        "qtValScale": "uiScale multiplier on every size token",
        "qtValSubpixel": "Disabled — grayscale only",
        "title": "Rasterization Path",
        "webCardTitle": "Web · Chromium",
        "webValFitting": "None — text shaper follows the outline",
        "webValRasterizer": "Grayscale alpha antialiasing",
        "webValScale": "Root font size multiplier",
        "webValSmoothing": "antialiased · grayscale"
      }
    }
  },
  "formsA": {
    "checkbox": {
      "autoSyncDesc": "Sync data with remote servers every 5 minutes when idle.",
      "autoSyncLabel": "Automatic background syncing",
      "checked": "Checked",
      "checkedByDefault": "Checked by default",
      "defaultSizeLabel": "Default size (text-sm)",
      "descriptionLabel": "Description",
      "disabledReadOnlyDesc": "Dimmed non-interactive vs locked presentation",
      "disabledReadOnlyTitle": "Disabled & Read-Only States",
      "disabledUnchecked": "Disabled unchecked",
      "examplesSubtitle": "Visual matrix of common checkbox configurations, sizes, descriptions, and states.",
      "helperDescSubtitle": "Detailed multi-line label and subtext",
      "helperDescTitle": "With Helper Description",
      "indeterminate": "Indeterminate",
      "indeterminateDesc": "Represents partially selected sub-options",
      "indeterminateTitle": "Indeterminate State",
      "invalid": "Invalid",
      "invalidDesc": "Highlights unchecked required confirmation",
      "invalidTitle": "Invalid / Error State",
      "mandatoryDesc": "Must be accepted before proceeding with setup.",
      "mandatoryLabel": "Mandatory compliance confirmation",
      "overviewDesc": "Test interactive checkbox toggling, indeterminate states, helper descriptions, error states, and sizes across Web and Qt Desktop.",
      "readOnly": "Read-Only",
      "readOnlyChecked": "Read-only checked",
      "sandboxDescription": "You agree to the automated billing policy and privacy guidelines.",
      "sandboxLabel": "Accept terms and conditions",
      "selectAllSubtasks": "Select all sub-tasks",
      "sizeSm": "Small (sm)",
      "sizeVariantsDesc": "Default vs Compact size",
      "sizeVariantsTitle": "Size Variants",
      "smSizeLabel": "Small size (sm, text-xs)",
      "task1": "Task 1: Requirements",
      "task2": "Task 2: Implementation",
      "uncheckedByDefault": "Unchecked by default",
      "uncheckedCheckedDesc": "Standard interactive states",
      "uncheckedCheckedTitle": "Unchecked & Checked"
    },
    "input": {
      "bordered": "Bordered",
      "charsCount": "{{count}} chars",
      "clearable": "Clearable",
      "clearableInputDesc": "Clickable clear action or Escape key",
      "clearableInputTitle": "Clearable Field",
      "clearableInputVal": "Click cross to clear",
      "defaultInputDesc": "Standard text input with placeholder",
      "defaultInputPlaceholder": "Enter username...",
      "defaultInputTitle": "Default Input",
      "disabledInputDesc": "Non-interactive with dimmed opacity",
      "disabledInputPlaceholder": "Disabled field",
      "disabledInputTitle": "Disabled State",
      "disabledInputVal": "preset value",
      "emailAddress": "Email address",
      "emailError": "Please enter a valid corporate email address.",
      "emailHint": "We will never share your email with anyone else.",
      "emailPlaceholder": "Enter your email...",
      "examplesSubtitle": "Visual matrix of common input configurations and states.",
      "invalid": "Invalid",
      "invalidInputDesc": "Destructive highlight with error feedback",
      "invalidInputTitle": "Invalid / Error State",
      "overviewDesc": "Explore interactive input behaviors, sizes, states, clearable action, password toggle, and responsive token styling across Web and Qt Desktop.",
      "passwordInputDesc": "Interactive visibility eye button",
      "passwordInputTitle": "Password with Toggle",
      "passwordToggle": "Password Toggle",
      "showIcon": "Show Icon",
      "sizeSm": "Small (sm)",
      "smInputDesc": "Compact height for tight toolbars",
      "smInputPlaceholder": "Compact input...",
      "smInputTitle": "Small Size (sm)",
      "typeLabel": "Type:",
      "typePassword": "Password",
      "typeText": "Text"
    },
    "rangeSlider": {
      "compactSm": "Compact sm Tier",
      "defaultWithTooltips": "Default with Tooltips",
      "disabled": "Disabled",
      "maxLabel": "Max: {{value}}",
      "minLabel": "Min: {{value}}",
      "overviewDesc": "Drag either thumb to adjust minimum and maximum bounds.",
      "readOnly": "Read Only",
      "sizesAndStatesSubtitle": "Available in default and sm sizing tiers, with tooltips, read-only, and disabled states."
    },
    "segmentedControl": {
      "autoAdaptiveTitle": "Auto-Adaptive Content Width (Default)",
      "currentSelection": "Current selection: {{value}}",
      "defaultDesc": "Default (Standard controls)",
      "dot": "Dot",
      "fixedWidthTitle": "Fixed Width per Item with Ellipsis (itemWidth=110)",
      "gallery": "Gallery",
      "grid": "Grid",
      "gridPatternTitle": "Grid Pattern:",
      "gridStyleTitle": "Grid Style:",
      "lgDesc": "Large (lg - Prominent tabs style)",
      "line": "Line",
      "list": "List",
      "menuTitleSubtitle": "Supports an optional prefix title to seamlessly embed within context menu rows and parameter settings panels.",
      "off": "Off",
      "optCompact": "Compact",
      "optFitComfortably": "Very Long Option Text That Fits Comfortably",
      "optLong": "Long Description Tab",
      "optSettings": "Settings",
      "optShort": "Short",
      "optTruncate": "Very Long Option Text That Truncates",
      "optVar": "Variable Length Title",
      "selectedValue": "Selected value: {{value}}",
      "smDesc": "Small (sm - Menu & Toolbar dense)",
      "truncationSubtitle": "By default, segments auto-adapt to their content length. When equalWidth, fullWidth, or itemWidth is configured, segments enforce equal or fixed dimensions and truncate overflowing text with an ellipsis."
    },
    "select": {
      "apple": "Apple",
      "appleTooltip": "Fuji crisp apples",
      "banana": "Banana",
      "bananaTooltip": "Cavendish sweet bananas",
      "blueberry": "Blueberry",
      "blueberryTooltip": "Rich in antioxidants",
      "cherry": "Cherry",
      "cherryTooltip": "Fresh sweet cherries",
      "dragonfruitDisabled": "Dragonfruit (Disabled)",
      "dragonfruitTooltip": "Currently out of stock",
      "fruitsGroup": "Fruits",
      "grapes": "Grapes",
      "overviewDesc": "Select an item from the menu. Selected value: {{value}}",
      "pineapple": "Pineapple",
      "placeholder": "Select a fruit",
      "selectedLabel": "Selected value: {{value}}"
    },
    "slider": {
      "compactDesc": "Reduced track thickness and thumb size for toolbars",
      "compactTitle": "Compact Size (sm)",
      "customRangeDesc": "Bounded custom minimum and maximum limits with step=5",
      "customRangeTitle": "Custom Range (20 to 80)",
      "disabledDesc": "Non-interactive with dimmed opacity for disabled controls",
      "disabledTitle": "Disabled State",
      "examplesSubtitle": "Visual matrix of common slider configurations, size scales, tooltips, and interactive states.",
      "floatingTooltipDesc": "Interactive formatted indicator on thumb drag and hover",
      "floatingTooltipTitle": "Floating Value Tooltip",
      "horizontal": "Horizontal",
      "orientationLabel": "Orientation:",
      "overviewDesc": "Explore interactive slider behaviors, sizes, steps, orientations, tooltips, and states across Web and Qt Desktop.",
      "readOnly": "Read-Only",
      "readOnlyDesc": "Locked value without dimmed 50% opacity",
      "readOnlyTitle": "Read-Only State",
      "sizeDefault": "Default",
      "sizeSm": "Small (sm)",
      "stepLabel": "Step:",
      "ticks": "Ticks",
      "ticksDesc": "Quantized stops with tick indicators and label marks",
      "ticksTitle": "Discrete Stops with Ticks",
      "tooltip": "Tooltip",
      "valueLabel": "Value:",
      "vertical": "Vertical"
    },
    "snapSlider": {
      "fast": "Fast",
      "presetLabel": "Preset:",
      "presetMax": "3.0x (Max)",
      "presetMin": "0.5x (Min)",
      "presetNormal": "1.0x (Normal)",
      "slow": "Slow"
    },
    "switch": {
      "airplaneMode": "Airplane Mode",
      "airplaneModeDesc": "Disable cellular, Wi-Fi, and Bluetooth radios.",
      "asyncLoadingDesc": "Busy indicator while awaiting server confirmation",
      "asyncLoadingTitle": "Async Loading State",
      "checked": "Checked",
      "cloudSyncDesc": "Upload changes in real time when network is available.",
      "cloudSyncLabel": "Automatic cloud synchronization",
      "compactOff": "Compact Off",
      "compactOn": "Compact On",
      "connecting": "Connecting...",
      "defaultSize": "Default size",
      "descriptionLabel": "Description",
      "disabledOff": "Disabled Off",
      "disabledOn": "Disabled On",
      "disabledReadOnlyDesc": "Dimmed non-interactive vs locked presentation",
      "disabledReadOnlyTitle": "Disabled & Read-Only States",
      "examplesSubtitle": "Visual matrix of common switch configurations and interactive states.",
      "helperDescSubtitle": "Multi-line title and descriptive subtext",
      "helperDescTitle": "With Helper Description",
      "offLabel": "Off",
      "onLabel": "On",
      "overviewDesc": "Explore interactive switch behaviors, async loading, read-only states, descriptions, and sizes across Web and Qt Desktop.",
      "readOnly": "Read-Only",
      "readOnlyOff": "Locked Off",
      "readOnlyOn": "Read-only On",
      "sizeSm": "Small (sm)",
      "sizeVariantsDesc": "Default size vs compact toolbar density",
      "sizeVariantsTitle": "Size Variants",
      "smallSize": "Small size (sm)",
      "standardToggleDesc": "Standard track with smooth spring animation",
      "standardToggleTitle": "Standard Toggle",
      "syncing": "Syncing..."
    }
  },
  "surfaces": {
    "card": {
      "compact": "Compact (sm)",
      "compactCardContent": "Streamlined layout with denser inner padding.",
      "compactCardDesc": "Reduced padding for tight sidebars and mobile sheets",
      "compactCardTitle": "Compact Card (sm)",
      "defaultCardDesc": "Elevated surface with panel background",
      "defaultCardTitle": "Default Card",
      "deploy": "Deploy",
      "feedbackDensityDesc": "Enable interactive hover/press elevation feedback, or use compact density for constrained spaces.",
      "feedbackDensityTitle": "Interactive Feedback & Density",
      "heroBadge": "Pro",
      "heroContent": "Your project will be deployed to the edge network automatically.",
      "heroDescription": "Deploy your new project in one-click.",
      "heroTitle": "Create project",
      "interactive": "Interactive",
      "interactiveCardContent": "Clickable surface for dashboards and selectable items.",
      "interactiveCardDesc": "Hover over me to see cursor and elevation changes",
      "interactiveCardTitle": "Interactive Card",
      "interactiveFeedback": "Interactive Feedback",
      "outlineCardDesc": "Transparent background with crisp border",
      "outlineCardTitle": "Outline Card",
      "secondaryCardDesc": "Subtle contrast for grouped secondary items",
      "secondaryCardTitle": "Secondary Card",
      "variantsDesc": "Three semantic variants styled with design tokens for consistent elevation and contrast.",
      "variantsTitle": "Variants"
    },
    "collapsible": {
      "card": "Card",
      "collapsed": "Collapsed",
      "expanded": "Expanded",
      "starredRepos": "@peduarte starred 3 repositories",
      "state": "State:"
    },
    "panelCard": {
      "avgLatency": "Avg Latency:",
      "avgLatencyVal": "12ms (p99: 45ms)",
      "clusterTitle": "Production Cluster #01",
      "directXActive": "DirectX 11 Active",
      "fragmentOk": "OK (4 attachments)",
      "fragmentShader": "Fragment Shader:",
      "nodeCount": "Node Count:",
      "nodeCountVal": "16 Dedicated Replicas",
      "recompile": "Recompile",
      "restart": "Restart",
      "scaleOut": "Scale Out",
      "shaderTitle": "Shader Pipeline Status",
      "vertexOk": "OK (12 stages)",
      "vertexShader": "Vertex Shader:",
      "warpDriver": "WARP Driver:"
    },
    "resizable": {
      "direction": "Direction:",
      "editorViewport": "Editor Viewport",
      "explorerTree": "Explorer Tree",
      "handleHidden": "Handle: Hidden",
      "handleVisible": "Handle: Visible",
      "horizontal": "Horizontal",
      "integratedTerminal": "Integrated Terminal",
      "panelAlpha": "Panel Alpha",
      "panelBeta": "Panel Beta",
      "percentHeight": "{{height}}% Height",
      "percentWidth": "{{width}}% Width",
      "sidebar": "Sidebar",
      "sourceCodeEditor": "Source Code Editor",
      "vertical": "Vertical"
    },
    "scrollArea": {
      "compact": "Compact (sm)",
      "dualAxis": "2D Dual-Axis",
      "entriesCount": "{{count}} entries",
      "floating": "Floating",
      "horizontal": "Horizontal",
      "itemsCount": "{{count}} items",
      "matrixHeader": "Dual-Axis Matrix (100 Rows × 6 Columns)",
      "mode": "Mode:",
      "releaseChangelog": "Release Changelog & Tags (120 Items)",
      "showSteppers": "Show Steppers",
      "smoothScroll": "Smooth Scroll",
      "vertical": "Vertical"
    },
    "settingRow": {
      "anchorJumpDesc": "Allows deep-linking or shortcut jumps from modal dialogs directly into a specific setting row. When highlightTarget === highlightId, a 3-cycle pulse flash draws attention to the targeted preference.",
      "anchorJumpTitle": "Anchor Jump & Flash",
      "autoUpdateDesc": "Periodically verify semantic releases and download patches in background.",
      "autoUpdateName": "Auto-Check Updates",
      "flashAutoUpdate": "Flash Auto-Update",
      "flashHwAccel": "Flash HW Accel",
      "hwAccelDesc": "Enable GPU-accelerated rasterization and smooth rendering.",
      "hwAccelName": "Hardware Acceleration",
      "jumpAutoUpdate": "Jump to Auto-Updates",
      "jumpHwAccel": "Jump to Hardware Accel",
      "recommended": "Recommended",
      "triggerFlash": "Trigger Anchor Flash"
    },
    "sidebar": {
      "collapse": "Collapse",
      "collapseSidebar": "Collapse Sidebar",
      "collapsed": "Collapsed",
      "collapsibleMode": "Collapsible Mode:",
      "configuration": "Configuration",
      "dashboard": "Dashboard",
      "diagnostics": "Diagnostics",
      "dragHint": "Drag the rail on the right edge of the sidebar to resize, or click the trigger to collapse/expand.",
      "expand": "Expand",
      "expandSidebar": "Expand Sidebar",
      "expanded": "Expanded",
      "icon": "Icon",
      "mainViewportInset": "Main Viewport Inset",
      "none": "None",
      "offcanvas": "Offcanvas",
      "overview": "Overview",
      "preferences": "Preferences",
      "projects": "Projects",
      "resetWidth220": "Reset Width (220)",
      "selectedView": "Selected View:",
      "sidebarWidth": "Sidebar Width:"
    },
    "splitter": {
      "dragHint": "Drag splitter handle to resize panes",
      "dragVerticalHint": "Drag splitter handle vertically to resize",
      "editorCanvas": "Editor Canvas",
      "editorWorkspace": "Editor Workspace",
      "navTree": "Navigation Tree",
      "reset35": "Reset (35%)",
      "reset65": "Reset (65%)",
      "terminalConsole": "Terminal Console"
    },
    "splitterHandle": {
      "currentWidth": "Current Width:",
      "editorCanvasArea": "Editor / Log Canvas Area",
      "focusHint": "Focus handle and use arrow keys to resize",
      "mainContent": "Main Content Viewport",
      "reset200": "Reset to 200",
      "sidebar": "Sidebar",
      "terminalConsole": "Terminal / Output Console"
    },
    "tableOfContents": {
      "activeOutlineTarget": "Active outline target: {{target}}",
      "bannerHeight": "Banner Height:",
      "bannerOffsetChip": "Offset: {{offset}}",
      "bannerText": "Global System Announcement: Scheduled maintenance at 02:00 UTC",
      "flat": "Flat",
      "items": {
        "architecture": "System Architecture",
        "bannerOffset": "Banner Offset Handling",
        "batching": "Update Batching",
        "boundary": "Platform Boundaries",
        "changelog": "Release Changelog",
        "dataFlow": "Core Data Flow",
        "designPrinciples": "Design Principles",
        "implementation": "Implementation Notes",
        "introduction": "Introduction",
        "motivation": "Motivation & Goals",
        "signals": "Reactive Signals",
        "treeRendering": "Tree & Track Rendering"
      },
      "readingPaneTitle": "Document Reading Pane",
      "showTrack": "Show Track:",
      "small": "Small (sm)",
      "topBanner": "Top Banner:",
      "track": "Track"
    },
    "tabs": {
      "account": "Account",
      "accountDesc": "Make changes to your account here. Click save when you're done.",
      "accountTitle": "Account Information",
      "activeTab": "Active Tab",
      "allItems": "All Items",
      "archived": "Archived",
      "badgesCountsDesc": "Integrated status counters and notification count tags",
      "badgesCountsTitle": "With Badges & Counts",
      "code": "Code",
      "compactDesc": "High-density tab triggers for compact headers and toolbars",
      "compactTitle": "Compact Size (sm)",
      "completed": "Completed",
      "disabledTab": "Disabled Tab",
      "disabledTriggerDesc": "Individual tab triggers blocked with 50% opacity",
      "disabledTriggerTitle": "Disabled Trigger",
      "horizontal": "Horizontal",
      "inbox": "Inbox",
      "issues": "Issues",
      "line": "Line",
      "lineVariantDesc": "Full-width bottom accent border for navigation headers",
      "lineVariantTitle": "Line Variant (Underline)",
      "orientation": "Orientation:",
      "password": "Password",
      "passwordDesc": "Change your password here. After saving, you'll be logged out.",
      "passwordTitle": "Security Credentials",
      "pending": "Pending",
      "pill": "Pill (default)",
      "pulls": "Pull Requests",
      "settings": "Settings",
      "settingsDesc": "Manage your notification frequency and display preferences.",
      "settingsTitle": "App Settings",
      "small": "Small (sm)",
      "unread": "Unread",
      "vertical": "Vertical"
    },
    "viewportConstrainedContainer": {
      "activeFramebuffers": "Active Framebuffers ({{count}})",
      "alwaysScrollOverflow": "Always Scroll Overflow",
      "autoViewport": "Auto Viewport",
      "constrainedItem": "Constrained Item #{{index}}",
      "highMargin48": "High Margin (48)",
      "limit180": "180 Limit",
      "limit260": "260 Limit",
      "strict150": "Strict 150 Limit"
    }
  },
  "overlays": {
    "contextMenu": {
      "back": "Back",
      "backTooltip": "Navigate back in history",
      "forward": "Forward",
      "forwardTooltip": "No forward history available",
      "inspect": "Inspect",
      "inspectElement": "Inspect Element",
      "reload": "Reload",
      "reloadTooltip": "Refresh current page content",
      "rightClickAreaDesc": "A native contextual popup will appear at pointer coordinates.",
      "rightClickAreaTitle": "Right Click Inside This Area",
      "rightClickHere": "Right click here",
      "saveAs": "Save As...",
      "statusIdle": "Right-click the target area below",
      "statusSelected": "Action selected: {{id}}"
    },
    "dialog": {
      "adjustSize": "Adjust window size",
      "advancedDesktopDesc": "Drag the title bar or window body to reposition. Switch size presets from the top-right button.",
      "advancedDesktopTitle": "Advanced Desktop Tool",
      "areYouSure": "Are you absolutely sure?",
      "confirm": "Confirm",
      "currentProfile": "Current profile: {{name}} ({{username}})",
      "deleteAccount": "Delete Account",
      "deleteAccountDesc": "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
      "desktopDraggableDesc": "Draggable modal with size presets, auto-fitting height, and fixed footer.",
      "desktopDraggableTitle": "Desktop Draggable Modal",
      "destructiveConfirmationDesc": "Dialog for destructive operations that require explicit confirmation.",
      "destructiveConfirmationTitle": "Destructive Confirmation",
      "downtimeDesc": "Expected downtime is under 10 minutes. All data remains encrypted and safe.",
      "editProfileDesc": "Make changes to your profile here. Click save when you're done.",
      "editProfileTitle": "Edit profile",
      "fixedFooterDesc": "The bottom actions area is extracted as a fixed footer that stays pinned during vertical scrolling.",
      "informationalNoticeDesc": "Lightweight alert modal for system notifications and messages.",
      "informationalNoticeTitle": "Informational Notice",
      "maintenanceDesc": "The cloud service will be undergoing scheduled infrastructure updates tonight at 02:00 UTC.",
      "name": "Name",
      "notice": "Notice",
      "openDraggableWindow": "Open Draggable Window",
      "openProfile": "Open Profile Dialog",
      "presetCompact": "Compact",
      "presetFullscreen": "Fullscreen",
      "scheduledMaintenance": "Scheduled Maintenance",
      "systemUpdateNotice": "System Update Notice",
      "understood": "Understood",
      "username": "Username",
      "yesDeleteAccount": "Yes, delete account"
    },
    "draggableModal": {
      "activeTextures": "Active Textures:",
      "adjustSize": "Adjust window size",
      "canvasHint": "Drag the modal around within this bounded canvas",
      "diagnosticsDesc": "Drag anywhere on the modal surface not occupied by controls to move; drag borders to resize.",
      "diagnosticsTitle": "Memory & Shader Diagnostics",
      "floatingTools": "Floating Tools",
      "heapUsed": "Heap Memory Used:",
      "modalOpen": "Modal is open",
      "openModal": "Open Draggable Diagnostic Window",
      "presetCompact": "Compact (24rem x 18rem)",
      "presetDefault": "Default",
      "presetFullscreen": "Fullscreen",
      "presetWidescreen": "Widescreen (40rem x 24rem)"
    },
    "dropdownMenu": {
      "accountSettings": "Account Settings",
      "actionNone": "Action: None",
      "actionSelected": "Action: Selected: {{id}}",
      "billing": "Billing",
      "billingTooltip": "Manage billing and invoices",
      "logout": "Log out",
      "logoutTooltip": "Sign out of current account",
      "options": "Options ▾",
      "profile": "Profile",
      "profileTooltip": "View account profile",
      "settings": "Settings",
      "shortcuts": "Keyboard shortcuts",
      "shortcutsTooltip": "View keyboard navigation shortcuts"
    },
    "floatingNotice": {
      "addCopy": "+ Copy Notice",
      "addError": "+ Error Alert",
      "addRating": "+ Rating Notice",
      "copiedTitle": "File path copied to clipboard",
      "demoFileDesc": "Image 001.png",
      "demoStorageDesc": "Under 10% remaining",
      "gap": "Spacing:",
      "gapAuto": "Auto",
      "gapCompact": "Compact (7dp)",
      "gapRelaxed": "Relaxed (12dp)",
      "gapSpacious": "Spacious (16dp)",
      "overviewLead": "Floating notice stacks multiple transient messages, showing highest-priority card in front with queued cards peeking behind. Hovering pauses expiry and smoothly zooms for enhanced visibility.",
      "placementBottom": "Bottom",
      "placementTop": "Top",
      "previewTitle": "Floating Notice Stack",
      "ratingTitle": "Rated 5 stars",
      "reset": "Reset",
      "sandboxHint": "Hover over the notice to pause expiry and zoom the stack, or hover a peeking card behind to raise it to the top in place.",
      "warningTitle": "Disk storage low"
    },
    "notificationStack": {
      "actionLogs": "View log",
      "actionManage": "Manage",
      "actionRetry": "Retry",
      "actionUpgrade": "Upgrade",
      "buildPassedDesc": "All 318 contract checks green.",
      "buildPassedTitle": "Build passed",
      "clearAll": "Clear All",
      "headsUpDesc": "A new major version is available.",
      "headsUpTitle": "Heads up",
      "jobFailedDesc": "Compilation exited with code 1.",
      "jobFailedTitle": "Job failed",
      "lastAction": "last action: {{receipt}}",
      "levelError": "Error",
      "levelInfo": "Info",
      "levelSuccess": "Success",
      "levelWarning": "Warning",
      "noActionPressed": "(no action pressed yet)",
      "noNotifications": "No notifications queued. Push one to watch its lifetime countdown; hover the stack to suspend every countdown at once.",
      "placement": "Placement:",
      "presetErrorDesc": "Artifact exceeds the 50 MB limit.",
      "presetErrorTitle": "Upload rejected",
      "presetInfoDesc": "Workspace symbols refreshed in 2.1s.",
      "presetInfoTitle": "Index rebuilt",
      "presetSuccessDesc": "Release 0.2.0 is live on staging.",
      "presetSuccessTitle": "Deployment finished",
      "presetWarningDesc": "Credentials expire in 3 days.",
      "presetWarningTitle": "Token expires soon",
      "pushNotification": "Push Notification:",
      "quotaDesc": "Storage usage is approaching the plan limit.",
      "quotaTitle": "Quota at 84%",
      "resetActionLog": "Reset Action Log",
      "syncStartedDesc": "Pulling 128 remote changes.",
      "syncStartedTitle": "Sync started"
    },
    "popover": {
      "align": "Align:",
      "alignCenter": "Center",
      "alignEnd": "End",
      "alignStart": "Start",
      "arrow": "Arrow",
      "dimensionsDesc": "Set the dimensions for the layer.",
      "dimensionsTitle": "Dimensions",
      "height": "Height",
      "movable": "Movable",
      "openPopover": "Open Popover",
      "side": "Side:",
      "sideBottom": "Bottom",
      "sideLeft": "Left",
      "sideRight": "Right",
      "sideTop": "Top",
      "width": "Width"
    },
    "scaleOsd": {
      "appliedStatus": "Applied: {{percent}}%",
      "autoHideLabel": "Auto-hide (2s)",
      "delayedCommitLabel": "Delayed Commit (1.5s)",
      "hideOsd": "Hide OSD",
      "hoverPauseHint": "Hover over the floating OSD below to pause auto-hide countdown.",
      "pendingStatus": "Debouncing commit... (Pending: {{percent}}%)",
      "previewBox": "Preview Box",
      "quickZoom": "Quick Zoom:",
      "showOsd": "Show OSD"
    },
    "sheet": {
      "closeOnOverlay": "Close on overlay",
      "displayName": "Display Name",
      "editAccountProfileDesc": "Update your account handle and workspace configuration.",
      "editAccountProfileTitle": "Edit Account Profile",
      "editProfileDesc": "Make changes to your profile here. Click save when you're done.",
      "editProfileTitle": "Edit profile",
      "name": "Name",
      "openSheet": "Open {{side}} Drawer ({{size}})",
      "openSheetQt": "Open {{side}} Sheet ({{size}})",
      "organizationRole": "Organization Role",
      "side": "Side:",
      "sideBottom": "Bottom",
      "sideLeft": "Left",
      "sideRight": "Right",
      "sideTop": "Top",
      "username": "Username"
    },
    "taskHud": {
      "addIndeterminate": "Add Indeterminate",
      "addRunning": "Add Running",
      "analyzingAst": "Analyzing AST #{{num}}",
      "buildJob": "Build Job #{{num}}",
      "cancelledByUser": "Cancelled by user",
      "clearAll": "Clear All",
      "collapseStack": "Collapse Stack",
      "compilationError": "Compilation error (exit code 1)",
      "completedSuccessfully": "Completed successfully",
      "expandStack": "Expand Stack",
      "failTask": "Fail Task",
      "idleHidden": "Task HUD is idle and hidden. Press \"Add Running\" to simulate background jobs.",
      "indexingSymbols": "Indexing symbols",
      "maxVisible": "Max Visible:",
      "placement": "Placement:",
      "placementBottomCenter": "Bottom Center",
      "placementBottomLeft": "Bottom Left",
      "placementBottomRight": "Bottom Right",
      "placementTopLeft": "Top Left",
      "placementTopRight": "Top Right",
      "processingDependencies": "Processing dependencies",
      "simulateTasks": "Simulate Tasks:",
      "succeedTask": "Succeed Task",
      "taskDatabaseMigration": "Database Migration",
      "taskDatabaseMigrationDetail": "Applied 12 schema patches",
      "taskGeneratingReport": "Generating Report",
      "taskGeneratingReportDetail": "Coverage summary",
      "taskIndexingSymbols": "Indexing Symbols",
      "taskIndexingSymbolsDetail": "Scanning 4,182 files",
      "taskOptimizingImages": "Optimizing Images",
      "taskOptimizingImagesDetail": "Re-encoding 38 assets",
      "taskPackagingBundle": "Packaging Bundle",
      "taskPackagingBundleDetail": "Compiling assets and modules",
      "taskRunningUnitTests": "Running Unit Tests",
      "taskRunningUnitTestsDetail": "Suite 7 of 12",
      "taskUploadingArtifacts": "Uploading Artifacts",
      "taskUploadingArtifactsDetail": "Waiting for credentials"
    },
    "tooltip": {
      "arrow": "Arrow",
      "bottomPlacementButton": "Bottom Tooltip",
      "bottomPlacementContent": "Tooltip below target",
      "bottomPlacementDesc": "Centered horizontally below the target",
      "bottomPlacementTitle": "Bottom Placement",
      "delay": "Delay:",
      "delay0ms": "0ms",
      "delay200ms": "200ms",
      "delay500": "500ms",
      "delayDefault": "Default (200ms)",
      "delayInstant": "Instant (0ms)",
      "directionalArrowButton": "With Arrow",
      "directionalArrowContent": "Anchored Pointer",
      "directionalArrowDesc": "Pointer triangle anchored directly toward trigger",
      "directionalArrowTitle": "Directional Arrow",
      "disabled": "Disabled",
      "hoverOrFocus": "Hover or Focus Me",
      "leftPlacementButton": "Left Tooltip",
      "leftPlacementContent": "Tooltip on left",
      "leftPlacementDesc": "Centered vertically to the left of the target",
      "leftPlacementTitle": "Left Placement",
      "menuItemsRightDeleteButton": "Delete",
      "menuItemsRightDeleteContent": "Remove permanently",
      "menuItemsRightDesc": "Dense vertical lists use right so the bubble never covers the prev/next sibling item",
      "menuItemsRightDuplicateButton": "Duplicate",
      "menuItemsRightDuplicateContent": "Duplicate this row",
      "menuItemsRightPinButton": "Pin tab",
      "menuItemsRightPinContent": "Pinned — keeps siblings visible",
      "menuItemsRightTitle": "Menu Items (Right Default)",
      "rightPlacementButton": "Right Tooltip",
      "rightPlacementContent": "Tooltip on right",
      "rightPlacementDesc": "Centered vertically to the right of the target",
      "rightPlacementTitle": "Right Placement",
      "shortcut": "Shortcut:",
      "shortcutHintButton": "Save Action",
      "shortcutHintContent": "Save Document",
      "shortcutHintDesc": "Productivity hint badge for fast power-user discovery",
      "shortcutHintTitle": "Keyboard Shortcut Hint",
      "side": "Side:",
      "text": "Text:",
      "topPlacementButton": "Top Tooltip",
      "topPlacementContent": "Tooltip above target",
      "topPlacementDesc": "Centered horizontally above the target",
      "topPlacementTitle": "Top Placement (Default)"
    }
  }
},
};
