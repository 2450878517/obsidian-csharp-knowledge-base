---
title: 'C# 输出语句'
tags: [CSharp, 基础语法, 控制台输出]
status: budding
area: CSharp
aliases: [Console.WriteLine, Console.Write, 控制台输出]
related: [CSharp 数据类型, CSharp 字符串操作, CSharp 用户输入]
---

# C# 输出语句

## Console.WriteLine()

输出内容后**自动换行**：

```csharp
Console.WriteLine("Hello World");
Console.WriteLine("第二行");
```
输出：
```
Hello World
第二行
```

## Console.Write()

输出内容后**不换行**，光标停留在同一行末尾：

```csharp
Console.Write("Hello ");
Console.Write("World");
```
输出：
```
Hello World
```

## 拼接字符图案

可以用输出语句拼接字符图案，例如构建旗子、圣诞树等：

```csharp
Console.WriteLine("  *");
Console.WriteLine(" ***");
Console.WriteLine("*****");
```

---

**相关笔记：** [[CSharp 数据类型|C# 数据类型]] | [[CSharp 字符串操作|C# 字符串操作]] | [[CSharp 用户输入|C# 用户输入]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

