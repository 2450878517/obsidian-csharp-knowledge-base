---
title: '14班8.18下午 — 视频笔记'
tags: [CSharp, 正则表达式, Regex, WinForms, 车牌摇号器]
status: seedling
area: CSharp
aliases: [正则进阶, Matches, 贪婪匹配, 车牌摇号器, Regex替换]
related: [14班8.18上午_视频笔记, C# 正则表达式入门]
---

# 14班8.18下午 — 视频笔记

**视频文件**: 14班8.18下午.mp4
**生成时间**: 2026-08-19
**来源**: AI 转录 + 总结

---

## 📝 Match 和 Matches 方法

### Match — 匹配第一个

- `Match()` 用于提取第一个匹配结果
- 返回 `Match` 类型，包含匹配到的内容

```csharp
Match m1 = regex.Match(textBox1.Text);
textBox2.Text = m1.Value;  // 显示匹配结果
```

### Matches — 匹配所有

- `Matches()` 用于提取所有匹配结果
- 返回 `MatchCollection` 集合类型
- 需要用 `foreach` 遍历

```csharp
MatchCollection ms = regex.Matches(textBox1.Text);
foreach (Match m in ms)
{
    textBox2.Text += m.Value + "、";
}
```

---

## 🐍 正则的贪婪匹配

### 什么是贪婪匹配

当匹配模式像套娃结构时（如 `<div>...<div>...<div>`），正则会**尽可能匹配更多内容**。

**示例**：
```csharp
// 模式：<div>.*</div>
// 输入：<div>张三</div><div>李四</div>
// 结果：匹配整个字符串（贪婪）
```

### 如何阻止贪婪

在量词后加 `?`，改为**非贪婪模式**：

```csharp
// 模式：<div>.*?</div>
// 结果：分别匹配 "张三" 和 "李四"
```

| 量词 | 贪婪 | 非贪婪 |
|------|------|--------|
| `*` | 匹配 0 次或多次，尽可能多 | `*?` 尽可能少 |
| `+` | 匹配 1 次或多次，尽可能多 | `+?` 尽可能少 |
| `?` | 匹配 0 次或 1 次 | `??` 尽可能少 |

---

## 🔄 Replace 替换方法

用于敏感词屏蔽、内容替换：

```csharp
string result = regex.Replace(input, replacement);
```

**敏感词屏蔽示例**：
```csharp
Regex regex = new Regex(@"傻.*?瓜");  // 匹配中间任意字符
string result = regex.Replace(textBox1.Text, "**");
```

**处理换行**：
```csharp
// 使用 [\s\S] 匹配所有字符（包括换行）
Regex regex = new Regex(@"傻[\s\S]*?瓜");
```

---

## 🚗 车牌摇号器项目

### 界面布局

- **选择地区**：两个 ComboBox（省份 + 城市）
- **摇号按钮**：点击开始/停止
- **选择区域**：15 个 Button 用于展示号码
- **结果展示**：TextBox + 确认按钮

### 核心逻辑

#### 1. 按钮状态切换

```csharp
private void btnStart_Click(object sender, EventArgs e)
{
    if (btnStart.Text == "开始摇号")
    {
        btnStart.Text = "停止摇号";
        timer1.Start();
    }
    else
    {
        btnStart.Text = "开始摇号";
        timer1.Stop();
    }
}
```

#### 2. 按钮数组批量控制

```csharp
Button[] btns = { btn1, btn2, btn3, ... };  // 15个按钮

// 禁用所有按钮
foreach (Button btn in btns)
{
    btn.Enabled = false;
}
```

#### 3. 随机生成车牌号

```csharp
// 素材：字母 + 数字
string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
Random rnd = new Random();

// 生成5位车牌
char[] plate = new char[5];
for (int i = 0; i < plate.Length; i++)
{
    plate[i] = chars[rnd.Next(0, 36)];
}
string result = new string(plate);
```

#### 4. Timer 定时刷新

```csharp
private void timer1_Tick(object sender, EventArgs e)
{
    // 每次生成新的随机车牌
    char[] plate = new char[5];
    for (int i = 0; i < 5; i++)
    {
        plate[i] = chars[rnd.Next(0, 36)];
    }
    string s = new string(plate);

    // 更新所有按钮
    foreach (Button btn in btns)
    {
        btn.Text = s;
    }
}
```

#### 5. 多按钮共用事件

```csharp
// 所有按钮绑定同一个 Click 事件
private void btnSelect_Click(object sender, EventArgs e)
{
    Button btn = (Button)sender;  // 获取被点击的按钮
    txtResult.Text = btn.Text;    // 显示选择的车牌
}
```

### 完整流程

1. 用户选择省份和城市
2. 点击「开始摇号」→ Timer 启动 → 15 个按钮数字跳动
3. 点击「停止摇号」→ Timer 停止 → 按钮显示最终号码
4. 用户点击其中一个按钮 → 显示选择结果
5. 点击「确认选择」→ 弹出确认对话框

---

## 💡 技巧总结

| 技巧 | 说明 |
|------|------|
| `Match` | 提取第一个匹配结果 |
| `Matches` | 提取所有匹配结果，返回集合 |
| `.*?` | 非贪婪匹配，避免套娃问题 |
| `[\s\S]` | 匹配所有字符（包括换行） |
| 按钮数组 | 批量控制多个按钮 |
| `(Button)sender` | 获取被点击的按钮 |

---

> —— 视频：14班8.18下午.mp4 | AI 转录 + 总结

