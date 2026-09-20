---
title: 'C# 静态成员'
tags: [CSharp, 面向对象, 静态成员]
status: budding
area: CSharp
aliases: [static, 静态类, 静态方法, 静态字段]
related: [CSharp 构造函数, CSharp 面向对象, CSharp 访问修饰符]
---
# C# 静态成员

用 `static` 修饰的成员属于**类本身**，不依赖对象。直接用**类名**调用，所有实例共享同一份。

## 静态字段

```csharp
class Counter
{
    public static int Count = 0;
}

Counter.Count++;   // 不需要 new 对象，直接用类名
```

## 静态属性

```csharp
class Config
{
    public static string ServerUrl { get; set; }
}

Config.ServerUrl = "https://api.example.com";
```

## 静态构造函数

- 写法：`static 类名()`，没有访问修饰符、没有参数
- 只在类**第一次被使用**时运行一次，之后再也不运行
- 应用场景：加载配置文件、游戏第一次加载资源

```csharp
class Game
{
    static Game()
    {
        // 第一次用 Game 时才执行一次
        LoadConfig();
    }
}
```

## 静态方法

`static` 方法直接用类名调用，如 `Math.Max(1, 2)`、`int.Parse("123")`。

## 实例成员 vs 静态成员

| | 实例成员 | 静态成员 |
|---|---|---|
| 归属 | 每个对象一份 | 类共享一份 |
| 调用 | 对象名访问 | 类名直接访问 |
| 内存 | 每个实例各存各的 | 全类共用同一份 |

> ⚠️ 静态方法里不能用 `this`，因为 `this` 指某个具体对象，而静态成员不依赖对象。

---

**相关笔记：** [[CSharp 面向对象|C# 面向对象]] | [[CSharp 构造函数|C# 构造函数]] | [[CSharp 访问修饰符|C# 访问修饰符]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

