---
title: 'C# 类型转换'
tags: [CSharp, 基础语法, 类型转换]
status: budding
area: CSharp
aliases: [类型转换, Convert, 强制转换]
related: [CSharp 数据类型, CSharp 用户输入, CSharp 运算符]
---

# C# 类型转换

## 隐式转换（自动）

小范围 → 大范围，无风险：

```csharp
int a = 10;
double b = a;  // int 自动转 double，没问题
```

## 显式转换（手动）

大范围 → 小范围，需强制指定，可能丢精度：

### 方式一：`(目标类型)`

```csharp
int a = (int)3.14;  // 结果：3（直接截断，不四舍五入）
```

### 方式二：`Convert.ToInt32()`

```csharp
int b = Convert.ToInt32(3.6);  // 结果：4（四舍五入）
```

---

**相关笔记：** [[CSharp 数据类型|C# 数据类型]] | [[CSharp 用户输入|C# 用户输入]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

