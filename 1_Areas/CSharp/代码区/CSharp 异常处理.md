---
title: 'C# 异常处理（try-catch）'
tags: [CSharp, 流程控制, 异常处理]
status: budding
area: CSharp
aliases: [try-catch, 异常处理, 捕获异常]
related: [CSharp 异常处理进阶, CSharp 用户输入, CSharp 调试]
---

# C# 异常处理（try-catch）

## 为什么需要异常处理？

有些代码可能会**爆错**（比如用户输入了不合法的内容），如果不处理，程序就会直接崩溃。用 `try-catch` 可以**抓住错误**，让程序继续运行。

### ❌ 没有异常处理

```csharp
Console.Write("请输入年龄：");
int age = int.Parse(Console.ReadLine());  // 用户输入 "ABC" → 程序崩溃 💥
```

### ✅ 有异常处理

```csharp
Console.Write("请输入年龄：");
try
{
    // 尝试运行这段代码
    int age = int.Parse(Console.ReadLine());
    Console.WriteLine($"你的年龄是：{age}");
}
catch
{
    // 如果上面的代码爆错了，就跑到这里来
    Console.WriteLine("您输入的年龄不符合数字要求！");
}
```

---

## 基础结构

```
try
{
    // 尝试运行的代码——可能会爆错
}
catch
{
    // 如果 try 里爆错了，就执行这里的代码
}

// 没爆错 → 跳过 catch，继续往下走
// 爆错了 → 立即跳到 catch，不会崩溃
```

---

## 使用场景

- **用户输入**：用户可能输入文字而不是数字，`int.Parse()` 会爆错
- **文件操作**：文件可能不存在、被占用
- **网络请求**：网络可能断开
- **数组/列表**：索引可能越界
- **任何不确定会不会出错的代码**

---

## 完整示例

```csharp
Console.Write("请输入年龄：");
string input = Console.ReadLine();

try
{
    int age = int.Parse(input);
    
    if (age >= 18)
        Console.WriteLine("可以进入 ✅");
    else
        Console.WriteLine("不可以进入 ❌");
}
catch
{
    Console.WriteLine("输入的年龄不符合数字要求！请重新运行程序。");
}
```

> 运行效果：
> ```
> 请输入年龄：20
> 可以进入 ✅
> ```
> ```
> 请输入年龄：ABC
> 输入的年龄不符合数字要求！请重新运行程序。
> ```

---

## 注意事项

- ⚠️ `try-catch` 会**降低性能**，不要用它来控制正常的程序流程
- ✅ 只在**确实可能爆错**的地方用
- 💡 跟 `if` 不一样——`if` 是判断条件，`try-catch` 是**捕捉异常**

**相关笔记：** [[CSharp 用户输入|C# 用户输入]] | [[CSharp 数据类型|C# 数据类型]]

