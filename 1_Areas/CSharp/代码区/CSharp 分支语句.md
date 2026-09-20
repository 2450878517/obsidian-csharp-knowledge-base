---
title: 'C# 分支语句'
tags: [CSharp, 流程控制, 分支语句]
status: budding
area: CSharp
aliases: [if, switch, 三元运算符, 条件判断]
related: [CSharp 运算符, CSharp 循环, CSharp 用户输入]
---

# C# 分支语句

分支语句根据条件执行不同操作，打破线性执行。

## if / else 单分支

```csharp
if (条件)
{
    // 满足时执行
}
else
{
    // 不满足时执行
}
```

案例：

```csharp
if (age >= 18)
{
    Console.WriteLine("可以进入");
}
else
{
    Console.WriteLine("不可以进入");
}
```

## else if 多分支

```csharp
if (条件1)
{
    // ...
}
else if (条件2)
{
    // ...
}
else
{
    // 其他情况
}
```

案例（公交优惠）：

```csharp
if (age <= 12 || age >= 50)
{
    Console.WriteLine("免费");
}
else
{
    Console.WriteLine("支付 0.5 元");
}
```

## switch 分支

适合精确值匹配（如菜单选择）：

```csharp
switch (变量)
{
    case 值1:
        // ...
        break;
    case 值2:
        // ...
        break;
    default:
        // 其他情况（推荐加上）
        break;
}
```

## 三元运算符

可简化单分支判断：

```csharp
string result = (age >= 18) ? "成年" : "未成年";
```

## 总结

- `if` 适用广泛，是通用选择
- `switch` 在精确值匹配时更清晰
- 注意防呆处理，避免输入异常值导致程序崩溃

---

**相关笔记：** [[CSharp 运算符|C# 运算符]] | [[CSharp 用户输入|C# 用户输入]] | [[CSharp 循环|C# 循环]] | [[CSharp编程入门_视频笔记|C# 编程入门_视频笔记]]

