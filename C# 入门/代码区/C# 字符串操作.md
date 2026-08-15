---
tags: [CSharp, 基础语法, 字符串]
status: budding
area: CSharp
aliases: [String, 字符串拼接, 字符串插值, Substring]
related: [C# 数据类型, C# 输出语句, C# 数组]
---

# C# 字符串操作

## 字符串拼接

用 `+` 号直接连接：

```csharp
string s = "Hello" + " " + "World";  // "Hello World"
```

## 字符串插值（推荐）

用 `$` 符号，比 `+` 拼接更清晰：

```csharp
string name = "小刻";
string msg = $"大家好，我是{name}";  // "大家好，我是小刻"
```

## 字符串转字符数组

```csharp
char[] arr = "Hello".ToCharArray();
// arr = ['H', 'e', 'l', 'l', 'o']
```

## 提取子串

```csharp
string s = "Hello World";
string sub = s.Substring(0, 5);  // "Hello"
// Substring(起始索引, 长度)
```

## 遍历每个字符

```csharp
foreach (char c in "Hello")
{
    Console.WriteLine(c);
}
```

---

**相关笔记：** [[C# 数据类型]] | [[C# 输出语句]] | [[C# 用户输入]] | [[C# 数组]] | [[C# 编程入门_视频笔记]]
