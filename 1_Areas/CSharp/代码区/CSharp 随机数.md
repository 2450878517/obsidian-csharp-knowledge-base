---
title: 'C# 随机数'
tags: [CSharp, 方法, 随机数]
status: seedling
area: CSharp
aliases: [Random, 随机数生成]
related: [CSharp 方法, CSharp 猜拳游戏, CSharp 分支语句]
---
# C# 随机数

用 `Random` 类生成随机数。

## 基本用法

```csharp
Random rnd = new Random();
int num = rnd.Next();  // 生成一个随机整数
```

## 指定范围

区间是**左闭右开**（包含最小值，不包含最大值）：

```csharp
int dice = rnd.Next(1, 7);      // 模拟骰子：1 到 6
int lotto = rnd.Next(1, 101);   // 1 到 100，模拟百分之几的概率
```

## 应用场景

- 游戏概率逻辑
- 抽奖模拟
- 随机测试数据

---

**相关笔记：** [[CSharp 方法|C# 方法]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

