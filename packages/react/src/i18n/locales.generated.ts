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
    "showcase"
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
    "close": "关闭",
    "copy": "复制",
    "copied": "已复制"
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
    "categories": {
      "Get Started": "起步与主题",
      "Base Primitives": "通用与原子",
      "Forms & Inputs": "表单与输入",
      "Surfaces & Layout": "表面与布局",
      "Overlays & Feedback": "浮层与反馈",
      "Desktop & Virtualization": "桌面与虚拟化",
      "Composite Engines": "复合套件与系统"
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
    "close": "Close",
    "copy": "Copy",
    "copied": "Copied"
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
    "categories": {
      "Get Started": "Get Started",
      "Base Primitives": "Base Primitives",
      "Forms & Inputs": "Forms & Inputs",
      "Surfaces & Layout": "Surfaces & Layout",
      "Overlays & Feedback": "Overlays & Feedback",
      "Desktop & Virtualization": "Desktop & Virtualization",
      "Composite Engines": "Composite Engines"
    }
  }
},
};
