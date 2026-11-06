# cha-set 界面空间与留白设计规范 (Spacing & Information Density Standards)

> **面向桌面端（React + Qt Quick）的高质感空间美学与排版规范**  
> 核心原则：**消灭无效死黑/死白、坚持内容紧凑包裹（Hug-Content）、视线单轨高效扫读、保持秩序与呼吸感**。

---

## 1. 痛点诊断：为什么之前的界面会让人感觉“空荡荡、丑”？

在桌面软件设计中，“留白（Negative Space）”是组织信息层次、给予视线呼吸感的工具，**留白绝不等于空置（Dead Space）**。之前出现的“空旷荒凉感”源于以下 4 个典型反模式：

1. **容器高度脱离内容膨胀（Vertical Dead Void）**：
   - 弹窗/浮层预设了过大的固定高度（如 400px）或未开启自适应计算，而表单内容仅有两三行输入框（不足 100px），导致输入框与底部操作栏之间留下了整整 150px+ 的巨大真空，让人产生“内容漏加载”的落差感。
2. **百分比栅格导致横向不对称坍塌（Asymmetric Horizontal Gap）**：
   - 机械使用 `grid grid-cols-4`（Label 占 25% 靠右，Input 占 75%）。对于短标签（如“姓名”、“用户名”两个字），标签左侧荒废了近 100px 的空白，破坏了自然阅读流。
3. **分割线生硬悬空（Disconnected Cut-Off）**：
   - 在大面积空白之下直接划一道分割线，使底栏与正文完全断裂脱节，出现“头重、腰空、脚轻”的病态比例。
4. **错把移动端/宽屏响应式当桌面质感**：
   - 桌面端软件（Linear、VS Code、Raycast、Slack、Notion）的核心质感在于**紧致、精致（Compact & Crisp）**。过大的外边距（如盲目用 `p-8`、`p-6`）在桌面端会显得臃肿松散。

---

## 2. 空间美学四大军规

### 军规一：容器内容自适应包裹律 (Hug-Content First)
- **默认高度贴合**：弹窗（`Dialog` / `ChaSetDialog`）、抽屉（`Sheet`）、卡片（`Card`）垂直高度默认必须 `auto` 紧凑包裹内部元素，高度随内容自然增减。
- **严禁未填满时撑死高**：除非用户手动拖拽调整了尺寸，或者内容超出视口触发内滚，否则严禁预设固定大高度。
- **预设尺寸梯阶（Modal Sizing Tiers）**：
  - `sm`（宽度 400px ~ 430px / `26rem ~ 27rem`）：**轻量表单（2~3 字段）、确认提示框、快捷操作**。
  - `default / md`（宽度 480px ~ 500px / `30rem`）：**标准表单（4~6 字段）、基础设置卡片**。
  - `lg`（宽度 640px ~ 720px / `42rem`）：**复杂双列表单、详情检查面板**。
  - `xl`（宽度 840px ~ 900px / `54rem`）：**多栏工作台、代码比对、复杂表格**。

### 军规二：表单排版视线单轨律 (Top-Aligned Label Mandate)
- **弹窗与轻量表单强制推荐“顶部对齐标签（Top-Aligned Labels）”**：
  - 标签（Label）置于输入框正上方，垂直间距极紧凑（`gap-1.5`，即 6px）。
  - 输入框撑满容器宽度（`w-full`）。
  - 优点：消除 100% 的水平无效空白，视线单轨垂直向下流动，零阻滞，天然适应多语言长度变化。
- **行内水平标签（Inline Label）严禁百分比栅格**：
  - 仅在宽屏单行设置项（如 `SettingRow`）中使用行内标签。
  - 水平标签必须使用**紧凑固定宽度**（如 `w-16` / 64px 或 `w-20` / 80px），与输入框保持固定微距（`gap-3` 12px），绝不允许占据 25% 甚至更大栅格。

### 军规三：桌面端信息密度与间距阶梯 (Desktop Spacing Scale)
所有外边距（Padding）与内部间距（Gap）必须遵循以下节奏阶梯：

| 级别 | 间距值 (rem / dp) | 适用场景 |
| :--- | :--- | :--- |
| **Micro (微间距)** | `0.375rem` / `ThemeTokens.dp(6)` | Label 与 Input 之间、图标与文字之间、小徽章内嵌 |
| **Tight (紧密间距)** | `0.5rem` / `ThemeTokens.dp(8)` | 按钮组之间、标签栏 Tabs 之间、行内相邻操作控件 |
| **Normal (标准元素距)** | `0.875rem` / `ThemeTokens.dp(14)` | 表单字段与字段之间、列表行项之间 |
| **Section (区块间距)** | `1.0rem` / `ThemeTokens.dp(16)` | 表单与 Header / Footer 之间、卡片内不同功能段落 |
| **Container (容器内边距)** | `1.25rem` / `ThemeTokens.dp(20)` | 弹窗、卡片、浮层的核心内边距（告别臃肿的 24px+） |

### 军规四：底栏与表面层级律 (Single Divider & Elevation)
- **单一分割线准则**：底栏与正文之间只允许存在**一条**清晰微弱的分割线（`border-t border-border`），严禁嵌套容器导致的“双重边框（Double Borders）”。
- **底栏内边距收敛**：底部操作栏内边距统一为 `px-6 py-3.5`（或 `px-5 py-3`），使“取消”与“确认”按钮既稳当扎实，又不抢占垂直篇幅。
- **暗色对比度梯度**：背景（`background`）→ 弹窗卡片（`panel / popover`）→ 控件输入区（`control / input`）必须保持层次分明的明暗反差，避免一整片死黑。

---

## 3. 首个样板间：个人资料编辑弹窗 (Edit Profile Dialog)

### 改造前后结构对比

```
【改造前：松散、空洞、重心偏移】
- 弹窗宽度：512px（过宽）
- 弹窗高度：固定 400px（产生 150px 死黑空腔）
- 布局结构：grid-cols-4 水平标签（“姓名”左侧空出 100px 废白）
- 视觉感受：空荡、稀疏、比例失调

【改造后：紧凑、精致、重心稳健】
- 弹窗宽度：420px（`size="sm"`，精准黄金比例）
- 弹窗高度：Auto-Hug 约 280px（严丝合缝包裹内容，无多余死黑）
- 布局结构：顶部对齐标签（Top-Aligned），Input 满宽，垂直单轨视线流
- 视觉感受：扎实、优雅、现代桌面级质感
```

### 标准代码范式 (Dual-Stack)

#### React (TSX)
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="outline">Open Profile Dialog</Button>
  </DialogTrigger>
  <DialogContent size="sm">
    <DialogHeader>
      <DialogTitle>Edit profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>

    <div className="flex flex-col gap-3.5 py-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name" size="sm" className="text-muted-foreground font-medium">Name</Label>
        <Input id="name" defaultValue="Alex Rivera" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username" size="sm" className="text-muted-foreground font-medium">Username</Label>
        <Input id="username" defaultValue="@arivera" />
      </div>
    </div>

    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Qt Quick (QML)
```qml
ChaSetDialog {
    id: profileDialog
    title: "Edit profile"
    description: "Make changes to your profile here. Click save when you're done."
    dialogWidth: ThemeTokens.dp(420)
    showCloseButton: true

    Column {
        width: parent.width
        spacing: ThemeTokens.dp(14)

        Column {
            width: parent.width
            spacing: ThemeTokens.dp(6)
            DocText {
                text: "Name"
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
                font.weight: Font.Medium
            }
            ChaSetInput {
                width: parent.width
                text: "Alex Rivera"
            }
        }

        Column {
            width: parent.width
            spacing: ThemeTokens.dp(6)
            DocText {
                text: "Username"
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
                font.weight: Font.Medium
            }
            ChaSetInput {
                width: parent.width
                text: "@arivera"
            }
        }
    }

    footer: Row {
        anchors.right: parent.right
        spacing: ThemeTokens.dp(8)
        ChaSetButton {
            variant: "outline"
            text: "Cancel"
            onClicked: profileDialog.reject()
        }
        ChaSetButton {
            text: "Save changes"
            onClicked: profileDialog.accept()
        }
    }
}
```

---

## 4. 全库 60+ 组件全面排查自检清单 (Audit Checklist)

后续对全量组件进行排查时，逐一针对以下项目执行机械与视觉双重验收：

1. [ ] **容器空腔检查**：所有包含弹窗/浮层的组件（`Dialog`, `AlertDialog`, `Sheet`, `Popover`, `CommandSearchModal`, `ExportModal`），在内容未达到滚动阈值前，是否 100% 紧贴内容高度？是否存在多余死黑？
2. [ ] **表单标签对齐检查**：所有演示页和实际表单中，是否彻底杜绝了 `grid-cols-4` 导致的短标签左侧死白？是否优先采用规范的 Top-Aligned `<Label>` 搭配 `gap-1.5`？
3. [ ] **内边距密度收敛**：所有卡片与容器内边距是否从过大的 `p-6` / `p-8` 收敛至 `p-5`（20px）或 `px-5 py-4`？
4. [ ] **底栏与分割线**：操作栏是否只有一条柔和清晰的顶部分割线？按钮间距是否保持在 `gap-2`（8px）到 `gap-2.5`（10px）？
5. [ ] **组件自举（Dogfooding）**：展示页中的表单标签是否已完全替换为 ChaSet 原生的 `<Label>` / `DocText`，绝不留原生 `<label>` 或随意裸写的样式？
