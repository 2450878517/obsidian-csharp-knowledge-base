---
title: 'C# 选择控件（RadioButton / ListBox）'
tags: [CSharp, WinForms, RadioButton, ListBox, 选择控件]
status: budding
area: CSharp
aliases: [单选框, 单选按钮, 列表框, RadioButton, ListBox, SelectionMode]
related: [CSharp 窗体控件基础, CSharp 精灵对战游戏（进度条血条与战斗逻辑）, CSharp 登录系统（窗体跳转与密码隐藏）, CSharp 猜拳游戏]
---
# C# 选择控件（RadioButton / ListBox）

之前学的按钮、文本框都是**用户自己输入**。要是内容多、想让用户**从几个选项里挑一个**怎么办？这课讲两个选择控件：**RadioButton**（单选）和 **ListBox**（列表选择）。都是做「让用户做选择」的界面——做登记系统、让用户选自己的 CT 类型这种场景就用它们。

## 🧩 RadioButton：单选按钮

拖几个 RadioButton 出来，长得像小圆圈。它的作用：**从一组选项里只能选一个**。

### 和 CheckBox 的区别

| | RadioButton（单选） | CheckBox（复选） |
|---|---|---|
| 效果 | 一组里**只能选一个**，选新就取消旧 | 每个**独立**，可勾可取消 |
| 例子 | 性别：男/女 | 爱好：打游戏/看番/运动 |

拖三个 RadioButton + 两个 CheckBox 对比一下就懂了：CheckBox 每个都能随便勾、能取消；RadioButton 选了 3 就自动取消 2 和 1。

### 「同一容器」互斥

RadioButton 的互斥范围是**同一个容器**：
- 都放在同一个窗体（或同一个 GroupBox）里 → 只能选一个
- 放进**不同的 GroupBox / Panel** 里 → 各自独立，可以同时各选一个（比如「性别」一组、「年级」一组，互不干扰）

所以想给多个互不相关的选项组，就给每组套一个 **GroupBox** 容器。

### 选中事件（CheckedChanged）

RadioButton 的事件是 `CheckedChanged`——**选中时触发一次，取消选中时又触发一次**。判断它当前是不是选中状态，用 `.Checked`：

```csharp
private void radioButton1_CheckedChanged(object sender, EventArgs e)
{
    if (radioButton1.Checked)   // 被选中了
    {
        MessageBox.Show("选择了第一个选项");
    }
}
```

- `radioButtonX.Checked` 返回 true/false，判断是否被选中
- 想处理「取消选中」的情况，用 else 分支就行
- ⚠️ 注意：运行时程序会**自动默认选中第一个**，所以刚启动时它的事件会先触发一次，正常现象

## 🧩 ListBox：列表框

放一个 ListBox 出来，是个**竖着的列表盒子**，里面装一行行的项目，用户点哪行选哪项。

### 添加项目

点 ListBox **右上角的小三角** → 「编辑项」（Items 集合）→ 一行一个输入项目（比如张三、李四、王五、赵六）→ 确定。运行后就能在列表里点选。

### 用途

适合「在多个固定选项里挑」的界面，比如**登记系统**里给一堆 CT 类型让你选自己拍的那种——列出来比输入框更直观、不容易写错。

### 选择模式：SelectionMode 属性（重点）

ListBox 默认**一次只能选一个**。能不能多选，看 `SelectionMode` 属性（在属性面板里找）：

| SelectionMode | 效果 |
|---|---|
| `None` | **不能选任何项**（只展示不给选） |
| `One`（默认） | 只能选一个 |
| `MultiSimple` | 可以直接用鼠标**点选多个**（点一下就选中，再点取消） |
| `MultiExtended` | 可以多选，但**必须配合键盘**：`Shift` 连续选一片，`Ctrl` 一个一个加 |

所以做「多选」需求时，想要简单点就 `MultiSimple`（鼠标点就行），想要标准的选择框体验就 `MultiExtended`（Shift 连选 + Ctrl 加选）。

## 🧠 一句话总结

- **RadioButton**：一组里单选一个，同一容器互斥（要分组建不同 GroupBox），事件用 `CheckedChanged`，判断用 `.Checked`
- **ListBox**：列表里选项目，项目在「编辑项」里加
- **ListBox 能不能多选看 `SelectionMode`**：None 不能选、One 单选、MultiSimple 鼠标多选、MultiExtended 配 Shift/Ctrl 多选

## 📚 作业

1. 拖三个 RadioButton，做三个选项，选中的弹出对应的 MessageBox
2. 再放一组 RadioButton 到另一个 GroupBox 里，验证「不同容器互不干扰」
3. 放一个 ListBox，填几个名字，把 SelectionMode 的四种模式都试一遍（None / One / MultiSimple / MultiExtended），体会多选的差别

---

**相关笔记：** [[CSharp 窗体控件基础|C# 窗体控件基础]] | [[CSharp 登录系统（窗体跳转与密码隐藏）|C# 登录系统（窗体跳转与密码隐藏）]] | [[CSharp 精灵对战游戏（进度条血条与战斗逻辑）|C# 精灵对战游戏（进度条血条与战斗逻辑）]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

