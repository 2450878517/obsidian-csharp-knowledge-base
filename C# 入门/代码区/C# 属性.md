---
tags: [CSharp, 面向对象, 属性]
status: budding
area: CSharp
aliases: [Property, get, set, 自动属性]
related: [C# 面向对象, C# 访问修饰符, C# 方法]
---
# C# 属性（Property）

通过 `get` 和 `set` 访问器控制字段的读写。

## 基本写法

```csharp
class Student
{
    private int age;        // 字段（私有）

    public int Age          // 属性（公开）
    {
        get { return age; }
        set { age = value; }
    }
}
```

## 自动属性

如果不需要额外逻辑，可以简写：

```csharp
class Student
{
    public string Name { get; set; }
}
```

## 加入限制条件

可在 `set` 中加入限制条件，防止非法数据：

```csharp
private int age;

public int Age
{
    get { return age; }
    set
    {
        if (value > 0)
            age = value;
        else
            Console.WriteLine("年龄必须大于0！");
    }
}
```

---

**相关笔记：** [[C# 面向对象]] | [[C# 方法]] | [[C# 编程入门_视频笔记]]
