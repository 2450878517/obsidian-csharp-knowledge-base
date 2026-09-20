---
title: 'C# 数组'
tags: [CSharp, 数据结构, 数组]
status: budding
area: CSharp
aliases: [Array, 二维数组, 数组遍历]
related: [CSharp 列表 List, CSharp 循环, CSharp 泛型]
---

# C# 数组

## 基础

- **索引从 0 开始**
- 通过 `array[index]` 访问和修改元素
- `array.Length` 获取数组长度

```csharp
int[] numbers = new int[5];           // 声明长度为5的数组
int[] scores = { 90, 80, 70, 60 };    // 声明并初始化
```

## 遍历

### for 循环

适合需要索引位置的场景：

```csharp
for (int i = 0; i < scores.Length; i++)
{
    Console.WriteLine(scores[i]);
}
```

### foreach 循环

更简洁，不需关心索引：

```csharp
foreach (int score in scores)
{
    Console.WriteLine(score);
}
```

## 排序

```csharp
Array.Sort(array);                    // 默认升序（从小到大）
Array.Sort(array);
Array.Reverse(array);                 // 降序（从大到小）
```

## 元素查找

```csharp
Array.IndexOf(array, 值);             // 查找第一次出现的索引，不存在返回 -1
Array.LastIndexOf(array, 值);         // 查找最后一次出现的索引
array.Contains(值);                   // 判断是否存在
```

## 二维数组

```csharp
int[,] matrix = new int[行数, 列数];
// matrix[行, 列]
```

嵌套循环遍历（外层行，内层列）：

```csharp
for (int i = 0; i < matrix.GetLength(0); i++)
{
    for (int j = 0; j < matrix.GetLength(1); j++)
    {
        Console.Write(matrix[i, j] + " ");
    }
    Console.WriteLine();
}
```

## 易错点

- **索引越界**：会报 `IndexOutOfRangeException`
- 索引从 **0** 开始，别和从 1 计数的习惯搞混
- **未初始化**的数组（`null`）不能直接使用

---

**相关笔记：** [[CSharp 列表 List|C# 列表 List]] | [[CSharp 循环|C# 循环]] | [[CSharp 数据类型|C# 数据类型]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

