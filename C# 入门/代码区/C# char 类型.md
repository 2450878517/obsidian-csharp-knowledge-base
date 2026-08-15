---
tags: [CSharp, 数据结构, char]
status: seedling
area: CSharp
aliases: [char, 字符类型, Unicode]
related: [C# 数据类型, C# 字符串操作, C# 数组]
---

# C# char 类型

`char` 表示单个字符。

## 基本特点

- 占用 **2 个字节**（16 位）
- 基于 **Unicode** 编码，范围 0~65535
- 前 256 个字符对应 ASCII 表
- 每个字符内部都有对应的数字（如 `'A'` = 65，`'7'` = 55）

## 定义

```csharp
char c = 'A';        // 注意：必须用单引号，不能用双引号
```

## 常用方法

```csharp
char.ToUpper('a');   // 转大写 → 'A'
char.ToLower('A');   // 转小写 → 'a'
```

## 字符数组

```csharp
char[] arr = "Hello".ToCharArray();
// arr = ['H', 'e', 'l', 'l', 'o']
```

---

**相关笔记：** [[C# 数据类型]] | [[C# 字符串操作]] | [[C# 方法]] | [[C# 编程入门_视频笔记]]
