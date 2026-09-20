---
title: 'C# 递归'
tags: [CSharp, 方法, 递归]
status: budding
area: CSharp
aliases: [递归, Recursion, 栈溢出]
related: [CSharp 方法, CSharp 调试, CSharp 循环]
---
# C# 递归

方法**自己调用自己**，把一个大的问题拆成更小的同类问题。

## 例子：阶乘

```csharp
int Factorial(int n)
{
    if (n <= 1) return 1;        // 终止条件
    return n * Factorial(n - 1); // 自己调用自己
}
```

## 递归的两个关键

- **终止条件**：必须有，否则不会停
- **越来越小**：每次调用都要朝终止条件靠近一步

## 递归 vs 循环

能用循环解决的很多也能用递归写，递归代码更**简洁**，但通常更慢、更占内存。

## ⚠️ 潜在风险

- 没有终止条件 → **无限递归**
- 调用层数太深 → **栈溢出（StackOverflowException）**，程序直接崩

> 💡 递归适合：目录树遍历、斐波那契数列、树的遍历等结构性问题。

---

**相关笔记：** [[CSharp 方法|C# 方法]] | [[CSharp 调试|C# 调试]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

