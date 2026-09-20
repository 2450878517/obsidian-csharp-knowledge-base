---
title: 'C# Equals 和 GetHashCode'
tags: [CSharp, 面向对象, 相等比较]
status: evergreen
area: CSharp
aliases: [Equals, GetHashCode, 值相等]
related: [CSharp 面向对象, CSharp 属性, CSharp 构造函数]
---
# C# Equals 和 GetHashCode

判断「两个东西一样不一样」，C# 里有两个家伙：**`==` 运算符**和 **`Equals` 方法**。平时它俩长得一样，但「类」这种引用类型会偷偷搞事情。

## 🧩 判断相等：`==` 运算符

```csharp
string s1 = "你好";
string s2 = "你好";
Console.WriteLine(s1 == s2);   // True
```

- 对**值类型**（int、string）：`==` 比较的是**内容**，内容一样就是 `True`
- 对**类**（引用类型）：`==` 比较的是**地址**！

```csharp
Person p1 = new Person();
Person p2 = new Person();
p1.Name = "张三"; p1.Age = 24;
p2.Name = "张三"; p2.Age = 24;

Console.WriteLine(p1 == p2);   // False！
```

为什么是 `False`？p1 和 p2 表面上一样，但它们是**两个对象，存的内存地址不一样**。`==` 对类比较的是地址，地址不同 → `False`。

> ⚠️ **string 是特例**：它本质是引用类型，但行为像值类型，所以 `s1 == s2` 会比较内容。

## 🧩 `Equals` 方法

`Equals` 是 **object 自带的方法**，所以任何类型的变量都能 `.Equals()`：

```csharp
string s1 = "你好";
string s2 = "你好";
Console.WriteLine(s1.Equals(s2));   // True
```

- `==` 是**运算符**，逻辑写死不能改
- `Equals` 是**方法**，方法就能被**重写（override）**

它俩默认结果一模一样，那 `Equals` 有什么用？——**想比类的内容、不比地址的时候**，就得靠重写 `Equals`。

## 🧩 重写 Equals：让类比内容

在要比较的**类里面**重写：

```csharp
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }

    public override bool Equals(object obj)
    {
        // 第一步：先判断传进来的是不是 Person 类型，不是就直接 false
        if (obj is Person p)
        {
            // 第二步：比内容（名字、年龄都一样的才算相等）
            return this.Name == p.Name && this.Age == p.Age;
        }
        return false;
    }
}
```

写完之后，`p1.Equals(p2)` 就会比**内容**而不是地址了。就算类里有 100 个字段，也只在方法里写一次比较，不用到处拿字段比来比去。

- `obj is Person p`：判断参数是不是 Person 类型，是的话顺便把它转成 `p`（老式写法是 `as` + 判空）
- 参数类型必须是 `object`，这是框架定死的签名，不能改

## ⚠️ 重写 Equals 必须一起重写 GetHashCode

重写完 `Equals`，编译器会警告：「你重写了 Equals 但没重写 GetHashCode」。这是**固定规律**：

> 两个对象用 `Equals` 判断为相等时，它们的 `GetHashCode` **必须返回相同的值**。

（`GetHashCode` 是底层用来给对象快速分组的编号，现在不用深究它干嘛，记住要配套重写就行。）

```csharp
public override int GetHashCode()
{
    return Name.GetHashCode();
}
```

一般把关键字段（比如名字）的哈希返回出去就够了。

## 🧠 一句话总结

| 场景 | 用什么 |
|---|---|
| 判断数字、字符串等值相等 | `==` |
| 判断两个类**内容**相等（不想比地址） | 重写 `Equals` |
| 重写了 `Equals` 之后 | 必须一起重写 `GetHashCode` |

**`==` 是运算符（写死），`Equals` 是方法（能重写）。** 想比较类的内容而不是地址，就重写 `Equals`，别忘了带上 `GetHashCode`。

## 📚 作业

1. 创建一个 `Person` 类，建两个内容一样的对象，先看看 `p1 == p2` 的结果
2. 在类里重写 `Equals`（先判断类型、再比名字和年龄），再看看 `p1.Equals(p2)` 的结果
3. 故意只重写 `Equals` 不重写 `GetHashCode`，观察编译器的警告

---

**相关笔记：** [[CSharp 面向对象|C# 面向对象]] | [[CSharp 属性|C# 属性]] | [[CSharp 构造函数|C# 构造函数]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

