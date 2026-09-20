---
title: 'C# 循环'
tags: [CSharp, 流程控制, 循环]
status: budding
area: CSharp
aliases: [for, foreach, 循环语句]
related: [CSharp 分支语句, CSharp 数组, CSharp 列表 List]
---

# C# 循环

## for 循环

`for` 关键字用于创建循环结构，可重复执行代码多次。

```csharp
for (初始化; 判断条件; 迭代更新)
{
    // 循环体
}
```

三个部分：
- **初始化**：`int i = 0;`
- **判断条件**：`i < 100;`
- **迭代更新**：`i++`

## 案例：星号矩阵

输出 100 行 × 10 列的 `*` 号矩阵：

```csharp
for (int i = 0; i < 100; i++)
{
    for (int j = 0; j < 10; j++)
    {
        Console.Write("*");
    }
    Console.WriteLine();
}
```

## 案例：输出 1 到 100

```csharp
for (int i = 1; i <= 100; i++)
{
    Console.WriteLine(i);
}
```

---

**相关笔记：** [[CSharp 分支语句|C# 分支语句]] | [[CSharp 数组|C# 数组]] | [[CSharp 列表 List|C# 列表 List]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

