---
tags: [CSharp, 面向对象, 虚方法, 多态]
status: evergreen
area: CSharp
aliases: [virtual, override, 重写, 多态]
related: [C# 抽象方法 abstract, C# 面向对象, C# 构造函数]
---
# C# 虚方法（virtual）与重写（override）

**虚方法**是继承和多态的核心工具：让父类的某个方法，能被子类**重新修改实现**。这是实现**多态**的关键手段。

## 🧩 为什么需要虚方法

普通方法，子类只能**继承**，不能改。例子：动物类有个 `Shout()`，猫、狗继承了它：

```csharp
public class Animal
{
    public void Shout()
    {
        Console.WriteLine("动物发出叫声");
    }
}

public class Cat : Animal { }   // 猫啥都不用写，继承 Animal 的 Shout
public class Dog : Animal { }
```

运行结果：猫叫是「动物发出叫声」，狗叫也是「动物发出叫声」——**造了猫和狗，叫声却区分不出来**，怪怪的。

想让猫「喵」、狗「汪」，就得让父类的 `Shout` 变成**虚方法**，子类**重写**它。

## 🧩 虚方法怎么用：virtual + override

把父类的方法前加 `virtual`，子类写一个一模一样的方法、前面加 `override`：

```csharp
public class Animal
{
    public virtual void Shout()   // 加 virtual，变成虚方法
    {
        Console.WriteLine("动物发出叫声");
    }
}

public class Cat : Animal
{
    public override void Shout()   // 加 override，重写父类的虚方法
    {
        Console.WriteLine("喵喵喵");
    }
}

public class Dog : Animal
{
    public override void Shout()
    {
        Console.WriteLine("汪汪汪");
    }
}
```

调用的时候，同一个 `Shout()` 命令，猫执行猫的重写、狗执行狗的重写 → **这就是多态**。

## 🧩 重写规则（必须遵守）

- 方法**名字**必须一模一样
- 方法的**参数、返回值**必须和父类虚方法**一致**——只能改方法体里的逻辑，**不能改签名**
- 想改签名 → 编译器报「没有找到合适的方法来重写」

```csharp
public override void Shout(string msg)   // ❌ 参数变了，报错！
{
    Console.WriteLine(msg);
}
```

> ⚠️ 这种「同名但参数不同」不是重写，那是**重载（overload）**——和父类的虚方法没关系，是子类自己新加的方法。

## 🧩 带参数的虚方法

虚方法也可以带参数，父类有几个参数，子类重写也得有几个：

```csharp
public class Player
{
    public virtual void RushB(string name)   // 队长下令：进攻B点！
    {
        Console.WriteLine(name + " 进攻B点");
    }
}

public class PlayerOne : Player
{
    public override void RushB(string name)
    {
        Console.WriteLine(name + " 负责打A大");   // 只改内容，参数 name 不能变
    }
}
```

## 🧩 重载 overload vs 重写 override（面试常问！）

两个都叫「重」但完全不是一回事，**一定要分清**：

| | 重载 overload | 重写 override |
|---|---|---|
| 在哪 | **同一个类**里 | **子类**里 |
| 条件 | 方法名相同，**参数类型/数量不同** | 方法名、参数、返回值**全相同** |
| 关键字 | 不用加 | 父类 `virtual` + 子类 `override` |
| 谁管 | 编译时确定 | 运行时多态 |
| 目的 | 一个功能多种参数 | 替换父类的默认实现 |

共同点：方法**名字一样**。区别就看签名（参数）变没变——签名变了是重载，没变、又加了 virtual/override 是重写。

## 🧩 重写可以连续，也能用 sealed 密封

- **连续重写**：子类重写父类后，**孙子类还能继续重写**子类（黑猫继承猫，还能再重写一遍）
- 不想让后代再重写 → 在 `override` 前加 **`sealed`**（密封）：
  ```csharp
  public sealed override void Shout() { ... }   // 加了 sealed，孙子类不能再重写
  ```

## ⚠️ 使用虚方法/重写的注意事项

1. **非必要不要用虚方法**——会增加代码复杂度，能不用就不用
2. **慎重修改签名**——一旦标记 `virtual`，所有子类都要继承或重写它；改签名会破坏所有子类
3. 需要**强制**子类修改实现、父类给不出合理默认逻辑 → 用**抽象方法**（[[C# 抽象方法 abstract]]）
4. 子类重写完不想让孙子类继续改 → 加 **`sealed`** 密封

## 🧠 一句话总结

**父类方法加 `virtual` 解锁，子类同名方法加 `override` 重写——同一个命令，不同子类做出不同行为，这就是多态。**

## 📚 作业

1. 写动物类 `Shout()`（virtual），猫和狗各自 override，运行看效果
2. 造一个 CS RushB 案例：玩家父类虚方法，玩家一重写「打A大」、玩家二重写「扔道具」
3. 故意改一下重写的参数，看报什么错
4. 给猫的重写加 `sealed`，再让黑猫尝试重写，观察报错

---

**相关笔记：** [[C# 抽象方法 abstract]] | [[C# 面向对象]] | [[C# 构造函数]] | [[C#编程入门_视频笔记]]
