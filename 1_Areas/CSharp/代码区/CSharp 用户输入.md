---
title: 'C# 用户输入'
tags: [CSharp, 基础语法, 用户交互]
status: budding
area: CSharp
aliases: [Console.ReadLine, 用户交互, 输入转换]
related: [CSharp 类型转换, CSharp 输出语句, CSharp 异常处理]
---

# C# 用户输入

## 读取输入

```csharp
string input = Console.ReadLine();  // 返回字符串
```

## 转成数值

`Console.ReadLine()` 返回的是字符串，需要转成数值：

```csharp
// 方式一：int.Parse()
int age = int.Parse(Console.ReadLine());

// 方式二：double.Parse()
double price = double.Parse(Console.ReadLine());

// 方式三：Convert.ToInt32()
int num = Convert.ToInt32(Console.ReadLine());
```

## 完整示例

```csharp
Console.Write("请输入你的年龄：");
int age = int.Parse(Console.ReadLine());
Console.WriteLine($"你{age}岁啦！");
```

---

**相关笔记：** [[CSharp 类型转换|C# 类型转换]] | [[CSharp 输出语句|C# 输出语句]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

