---
tags: [CSharp, WinForms, 窗体控件]
status: evergreen
area: CSharp
aliases: [Label, Button, TextBox, 窗体, 控件事件]
related: [C# 登录系统（窗体跳转与密码隐藏）, C# 音效与图片（SoundPlayer 与 PictureBox）, C# 事件（Event）]
---
# C# 窗体控件基础

WinForms 就是拖控件做界面的。要用的**三个基础控件**：**Label**（文字）、**Button**（按钮）、**TextBox**（输入框）。先看窗体和控件的属性，再看事件怎么创建、怎么删除。

## 🧩 窗体的属性（Form1）

在右下角属性栏里改：

| 属性 | 干嘛的 |
|---|---|
| `Text` | 窗体的**左上角标题文字** |
| `BackColor` | 窗体的**背景颜色** |
| `BackgroundImage` | 加一张图片当背景 |
| `BackgroundImageLayout` | 背景图怎么摆：居中 / 拉伸填满（Zoom、Stretch） |
| `MaximizeBox` | 最大值按钮能不能用（填 True / False） |
| `MinimizeBox` | 最小化按钮能不能用（填 True / False） |
| `FormBorderStyle` | 窗体**边框样式**（如 `FixedSingle` 不能手动拖边框） |

## 🧩 窗体的事件：Form1_Load

**事件** = 通过某种机制（点击、页面加载、控件样式变化、鼠标放上去……）触发的逻辑。

窗体最常用的一个事件：

```csharp
private void Form1_Load(object sender, EventArgs e)
{
    // 窗体一加载运行时就执行这里的代码
}
```

## 🧩 控件一：Label（显示文字）

只能显示文字，不能输入。一般**没有点击事件**——要点击的话用按钮。

| 属性 | 干嘛的 |
|---|---|
| `Text` | 显示的文字内容 |
| `Font` | 文字字体和大小 |
| `ForeColor` | 文字**颜色** |
| `BackColor` | 文字背景颜色 |

## 🧩 控件二：Button（按钮）

最常用的控件，靠**点击事件**干活。

| 属性 | 干嘛的 |
|---|---|
| `Text` | 按钮上显示的文字 |
| `Font` | 按钮文字字体大小 |
| `ForeColor` | 按钮文字颜色 |
| `BackColor` | 按钮背景颜色 |
| `Enabled` | 控件能不能用（True 能用 / False 变灰点不了） |

点击事件：

```csharp
private void button1_Click(object sender, EventArgs e)
{
    // 用户一点这个按钮就执行这里
}
```

## 🧩 控件三：TextBox（输入框）

让用户**输入文本**（也能展示文本）。

| 属性 | 干嘛的 |
|---|---|
| `Text` | 文本框里的内容 |
| `Font` | 字体大小（字大了框也会变大） |
| `Multiline` | 默认一行 → 改成 True 就能显示多行 |
| `ScrollBars` | 多行基础上右边加滑块，拖动看不同行的内容 |

TextBox 的**事件一般不自己用**——你不能一输入就触发逻辑，得让用户输完点按钮再判断。所以它的逻辑通常**交给 Button 来触发**。

## 🧩 事件怎么创建（四步）

1. **选中**要做事件的控件
2. 看右下角属性栏，切到**事件页**（图标是个**小闪电 ⚡**）
3. 找到要的事件（比如「点击 Click」）
4. **输入事件名**（比如 `button1_Click`）按**回车** → 自动跳转到代码页生成方法

## ⚠️ 事件怎么删除（重点是断连接线）

1. 选中控件，属性栏切到事件页
2. 找到这个事件的内容，**把事件名删掉**（Backspace 删掉）
3. **按回车** → 事件和代码之间的**连接线断掉**，代码方法删掉

> ⚠️ **最重要的一步就是「按回车断连接线」**——光删代码不按回车，事件还连着那个方法，运行会报错。

## 🧠 一句话总结

**控件看属性（Text / Font / 颜色 / Enabled），行为看事件（Click / Load）。** 文字用 Label，点击用 Button，输入用 TextBox——登录系统就靠它们三个。

## 📚 作业

用 Label + Button + TextBox 做一个**登录系统**：
1. Label 显示提示文字（「用户名」「密码」）
2. 两个 TextBox 让用户输入
3. 一个 Button，点它的时候读取输入的内容判断能不能登录

---

**相关笔记：** [[C# 事件]] | [[C# 委托]] | [[C# 文件与文件夹操作]] | [[C#编程入门_视频笔记]]
