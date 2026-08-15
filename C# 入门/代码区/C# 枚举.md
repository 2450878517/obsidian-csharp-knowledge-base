---
tags: [CSharp, 数据结构, 枚举]
status: seedling
area: CSharp
aliases: [enum, 枚举类型]
related: [C# 数据类型, C# 分支语句, C# 面向对象]
---

# C# 枚举（enum）

用枚举代替纯整数，让代码更具**可读性**和**类型安全**。

## 定义枚举

```csharp
enum Week
{
    Monday,     // 默认 0
    Tuesday,    // 默认 1
    Wednesday,  // 默认 2
    Thursday,   // 默认 3
    Friday,     // 默认 4
    Saturday,   // 默认 5
    Sunday      // 默认 6
}
```

成员默认从 **0** 开始递增。

## 手动指定值

```csharp
enum Week
{
    Monday = 1,
    Tuesday = 2,
    // ...
}
```

## 使用枚举

```csharp
Week today = Week.Monday;
Console.WriteLine(today);       // 输出：Monday
Console.WriteLine((int)today);  // 输出：0（底层整数值）
```

---

**相关笔记：** [[C# 数据类型]] | [[C# 分支语句]] | [[C# 编程入门_视频笔记]]
