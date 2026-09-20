---
title: '14班8.18上午 — 视频笔记'
tags: [CSharp, 正则表达式, Regex, 基础语法]
status: seedling
area: CSharp
aliases: [正则入门, Regex入门, 正则表达式]
related: [14班8.18下午_视频笔记, CSharp 字符串操作]
---

# 14班8.18上午 — 视频笔记

**视频文件**: 14班8.18上午.mp4
**生成时间**: 2026-08-19
**来源**: AI 转录 + 总结

---

## 📝 正则表达式概述

- 正则表达式（Regex）是处理字符串的强大工具
- 在 C# 中使用 `Regex` 类，位于 `System.Text.RegularExpressions` 命名空间
- 应用场景：手机号验证、邮箱格式判断、敏感词过滤
- 使用步骤：① 创建正则表达式 ② 调用合适的方法

---

## 🏗️ 创建正则表达式

```csharp
Regex regex = new Regex(@"模式");
```

- 使用 `@` 符号避免转义字符问题
- 常用方法：
  - `IsMatch()` — 判断是否匹配，返回 bool
  - `Match()` — 查找第一个匹配结果
  - `Matches()` — 查找所有匹配结果

---

## 🔢 匹配数字

| 表达式 | 说明 |
|--------|------|
| `\d` | 匹配任意数字（等价于 `[0-9]`） |
| `[0-9]` | 匹配 0 到 9 的数字 |
| `[0-5]` | 匹配特定范围的数字 |
| `[123]` | 匹配特定的数字 1、2、3 |
| `{n}` | 匹配 n 位数字，如 `\d{3}` 匹配三位数 |
| `\D` | 匹配非数字（只要有非数字字符就成功） |

**示例**：
```csharp
Regex regex = new Regex(@"\d{3}");  // 匹配三位数字
bool result = regex.IsMatch("abc123def");  // true
```

---

## 🔤 匹配字母

| 表达式 | 说明 |
|--------|------|
| `[a-z]` | 匹配小写字母 |
| `[A-Z]` | 匹配大写字母 |
| `[a-zA-Z]` | 同时匹配大小写字母 |
| `[FKZ]` | 匹配特定字母 F、K、Z |
| `[a-z]{4}` | 匹配连续 4 个小写字母 |

**示例**：
```csharp
Regex regex = new Regex(@"[A-Z]{2}");  // 匹配连续两个大写字母
bool result = regex.IsMatch("Hello World");  // true (匹配到 "HW" 中的部分)
```

---

## ⚠️ 注意事项

- 方括号内不要用逗号分隔，直接写即可（如 `[123]` 而非 `[1,2,3]`）
- 反斜杠需要转义，使用 `\\` 或 `@` 前缀
- `IsMatch` 返回 `bool`，用于判断是否匹配
- `Match` 返回单个匹配结果，`Matches` 返回所有匹配

---

## 📌 课堂练习

创建一个简单的正则验证窗体：
1. 一个 TextBox 供用户输入
2. 一个按钮「正则判断」
3. 一个 Label 显示结果（默认红色 False）

```csharp
private void btnJudge_Click(object sender, EventArgs e)
{
    Regex regex = new Regex(@"\d");  // 判断是否包含数字
    bool isMatch = regex.IsMatch(txtInput.Text);

    lblResult.Text = isMatch.ToString();
    lblResult.ForeColor = isMatch ? Color.Green : Color.Red;
}
```

---

> —— 视频：14班8.18上午.mp4 | AI 转录 + 总结

