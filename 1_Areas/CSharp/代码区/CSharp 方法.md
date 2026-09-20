---
title: 'C# 方法'
tags: [CSharp, 方法, 函数]
status: budding
area: CSharp
aliases: [方法, Method, 方法重载, params]
related: [CSharp ref 和 out, CSharp 面向对象, CSharp 泛型]
---

# C# 方法

方法将一段完成特定功能的代码打包，方便重复使用。

## 定义方法

方法通常写在 `class` 内部：

```
访问修饰符 返回值类型 方法名(参数列表)
{
    // 方法体
    return 结果;  // 有返回值时
}
```

```csharp
public int Add(int a, int b)
{
    return a + b;
}
```

- 无返回值用 `void`
- 有返回值用 `return`

## 调用方法

```csharp
int result = Add(3, 5);  // result = 8
```

参数数量和类型必须与方法定义一致。

## 访问修饰符

| 修饰符 | 说明 |
|---|---|
| `public` | 公开的，谁都能用 |
| `private` | 私有的，只有类内部能用（默认） |
| `internal` | 当前程序集内可用 |

## 方法重载（Overload）

同一个类中定义多个同名方法，参数列表不同：

```csharp
public int Add(int a, int b) { return a + b; }
public int Add(int a, int b, int c) { return a + b + c; }
```

## static 关键字

- 加上 `static` 后成员属于**类本身**
- 无需实例化即可通过类名调用
- 所有实例共享同一个静态成员

```csharp
public static void SayHello() { ... }
// 直接调用：ClassName.SayHello()
```

## params 关键字

允许方法接受**可变数量**的参数：

```csharp
public int Sum(params int[] numbers)
{
    int total = 0;
    foreach (int n in numbers) total += n;
    return total;
}

Sum(1, 2, 3);        // 6
Sum(1, 2, 3, 4, 5);  // 15
```

---

**相关笔记：** [[CSharp ref 和 out|C# ref 和 out]] | [[CSharp 面向对象|C# 面向对象]] | [[CSharp char 类型|C# char 类型]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

