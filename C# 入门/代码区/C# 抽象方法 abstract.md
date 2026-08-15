---
tags: [CSharp, 面向对象, 抽象方法]
status: evergreen
area: CSharp
aliases: [abstract, 抽象类, 抽象方法]
related: [C# 虚方法 virtual 与 重写 override, C# 面向对象, C# 构造函数]
---
# C# 抽象方法（abstract）

抽象方法是虚方法的「**加强版**」：**没有方法体**的虚方法。它不给你默认实现，**子类必须自己重写**。

## 🧩 抽象方法 vs 虚方法

| | 虚方法 virtual | 抽象方法 abstract |
|---|---|---|
| 有没有方法体 | 有（有默认实现） | **没有**（空壳） |
| 子类不重写行不行 | 行，还能用父类默认实现 | **不行，必须重写** |
| 强制力 | 不强 | **强制**子类重写 |

- 虚方法：父类写了默认逻辑，子类想改就 override，不想改就用默认的
- 抽象方法：父类**没有默认逻辑**（连内容都不写），子类**必须**给一个实现，不重写不让你用

## 🧩 怎么写抽象方法

把虚方法的方法体去掉，`virtual` 改成 `abstract`：

```csharp
public abstract class Player   // 类里有抽象方法，类前面也必须加 abstract
{
    public abstract void RushB();   // 抽象方法：没有方法体，后面直接分号
}
```

子类继承后**必须重写**：

```csharp
public class PlayerOne : Player
{
    public override void RushB()
    {
        Console.WriteLine("我负责打A大");
    }
}

public class PlayerTwo : Player
{
    public override void RushB()
    {
        Console.WriteLine("我负责扔道具");
    }
}
```

- 抽象方法声明：`public abstract void 方法名();`，**没有花括号**，直接分号结尾
- **类里只要有抽象方法，这个类就必须是抽象类**（类前加 `abstract`）
- 子类继承抽象类，**必须把里面的抽象方法全部重写**，否则报错

## 🧩 什么时候用抽象方法

**父类给不出合理的默认实现时**——就是父类自己也不知道该方法该怎么写，那就别硬写，定义成抽象方法，强制每个子类自己实现。

生活例子：队长下令「RushB」，不同队员行动不一样（打A大、扔道具、架枪）。队长没法替每个队员写好动作，所以「RushB」这个方法是抽象的，每个队员必须自己重写自己的分工。

## 🧠 一句话总结

**抽象方法 = 没有方法体的虚方法 + 强制子类重写。** 父类不知道怎么做的事，就声明成抽象方法，让子类必须给出自己的答案。

## 📚 作业

1. 写一个抽象类 `Player`，里面一个抽象方法 `RushB()`，两个玩家类重写各自的分工
2. 故意让某个子类不重写抽象方法，观察编译器报错
3. 试试：普通类里能不能写抽象方法？（提示：不行，类也得是 abstract）

---

**相关笔记：** [[C# 虚方法 virtual 与 重写 override]] | [[C# 面向对象]] | [[C# 构造函数]] | [[C#编程入门_视频笔记]]
