---
title: 'C# 构造函数'
tags: [CSharp, 面向对象, 构造函数]
status: evergreen
area: CSharp
aliases: [构造方法, Constructor, base, 静态构造函数]
related: [CSharp 面向对象, CSharp this 关键字, CSharp 静态成员]
---
# C# 构造函数

构造函数是类中的一种**特殊方法**，在创建对象时**自动执行**，用于把对象初始化到一个可用的起始状态。

---

## 四大特征

1. **名称必须与类名完全相同**
2. **不能有返回类型**（连 `void` 都不能写）
3. 在 `new` 实例化时**自动调用一次**
4. **每个类至少有一个构造函数**——如果没写，编译器会自动生成一个空的

---

## 为什么不用普通方法？

假设造车需要先检查许可证：

### ❌ 普通方法的问题

```csharp
class Car
{
    public string Name;
    public int Tires;
    public string Engine;

    public void CheckLicense() { /* 检查制造许可 */ }
    public void Drive() { /* 开车 */ }
    public void PlayMusic() { /* 放音乐 */ }
}

// 使用时
Car c = new Car();
c.CheckLicense();     // 容易忘记！
c.Name = "宝马";
c.Tires = 6;
c.Engine = "V8";
c.Drive();
```

**两个风险：**
1. **遗忘风险**——忘了调 `CheckLicense` 就把车造出来了
2. **多次调用风险**——可能不小心调了好几次 `CheckLicense`

### ✅ 构造函数解决

```csharp
class Car
{
    public string Name;
    public int Tires;
    public string Engine;

    // 构造函数：名称跟类一样，没有返回类型
    public Car()
    {
        Console.WriteLine("检查制造许可...✅");
    }

    public void Drive() { /* 开车 */ }
    public void PlayMusic() { /* 放音乐 */ }
}

// 使用时——构造函数自动运行！
Car c = new Car();  // 自动打印"检查制造许可...✅"
c.Name = "宝马";
c.Drive();
```

**构造函数的优势：**
- 🚀 **自动执行**——不会忘记
- 🔒 **只运行一次**——不会多次调用捣乱
- 🧬 **继承友好**——创建子类时自动先调用父类构造函数，保证初始化顺序

---

## 构造函数重载

跟普通方法一样，构造函数也可以重载（多个参数不同的版本）：

```csharp
class Airplane
{
    public int Tires;
    public int Generation;

    // 无参构造函数——默认造普通飞机
    public Airplane()
    {
        Console.WriteLine("🛩️ 制造了一架普通飞机");
    }

    // 带轮胎数的构造函数
    public Airplane(int tires)
    {
        Tires = tires;
        Console.WriteLine($"🛩️ 制造了 {tires} 个轮胎的飞机");
    }

    // 带轮胎数和代级的构造函数
    public Airplane(int tires, int generation)
    {
        Tires = tires;
        Generation = generation;
        Console.WriteLine($"🛩️ 制造了第 {generation} 代飞机，{tires} 个轮胎");
    }
}

// 使用
Airplane a1 = new Airplane();          // 普通飞机
Airplane a2 = new Airplane(4);         // 4个轮胎
Airplane a3 = new Airplane(6, 5);      // 第5代战机，6个轮胎
```

> 📌 构造函数重载：创建对象时传不同的参数，会自动匹配对应的构造函数，而且**只会运行其中一个**。

---

---

## 静态构造函数（static constructor）

比普通构造函数更特殊——**只在类第一次被使用时运行一次**，之后再也不运行。

```csharp
class Airplane
{
    // 静态构造函数——没有访问修饰符，直接 static
    static Airplane()
    {
        Console.WriteLine("🏭 飞机制造厂正式开业！");
    }

    public Airplane()
    {
        Console.WriteLine("🛩️ 制造了一架普通飞机");
    }
}

// 使用
Airplane a1 = new Airplane();  // 先打印"飞机制造厂正式开业！"，再打印"制造了一架普通飞机"
Airplane a2 = new Airplane();  // 只打印"制造了一架普通飞机"（静态构造函数不会再运行）
```

| 类型 | 运行时机 |
|---|---|
| 普通构造函数 | 每次 `new` 都运行一次 |
| 静态构造函数 | **该类第一次被使用时**运行一次，之后再也不运行 |

> 💡 **应用场景**：加载配置文件、初始化静态数据、游戏第一次加载资源等。
> 就像游戏第一次打开时加载资源慢，第二次就快了——因为静态构造函数只跑一次。

---

## 子类构造函数（继承中的构造函数）

当有继承关系时，创建子类对象会**先调用父类构造函数，再调用子类构造函数**。

### 为什么要继承？

假设要造人、猫、狗，它们都有大脑、会跑、会睡觉：

```csharp
// ❌ 每个类都写一遍——代码重复！
class Person { public void Think() { /* 大脑逻辑 */ } public void Run() { } public void Sleep() { } }
class Cat    { public void Think() { /* 大脑逻辑 */ } public void Run() { } public void Sleep() { } }
class Dog    { public void Think() { /* 大脑逻辑 */ } public void Run() { } public void Sleep() { } }
```

### ✅ 用继承解决

```csharp
// 先创建一个"大脑"基类，把共有的东西放进去
class Brain
{
    public string Think;
    public string Memory;

    public Brain()
    {
        Console.WriteLine("🧠 生成了一个大脑");
    }

    public void Rest()
    {
        Console.WriteLine("😴 大脑正在休息");
    }
}

// 人继承大脑
class Person : Brain
{
    public Person()
    {
        Think = "人的思考";
        Memory = "人的记忆";
    }
}

// 猫继承大脑
class Cat : Brain
{
    public Cat()
    {
        Think = "猫的思考";
        Memory = "只会哈气🐱";
    }
}

// 使用
Person p = new Person();  // 先输出"🧠 生成了一个大脑"，再执行人的构造函数
Cat c = new Cat();        // 先输出"🧠 生成了一个大脑"，再执行猫的构造函数
p.Rest();                 // 继承的方法也能用！
```

**规则：先造祖线，再造自己**——创建子类时，父类构造函数先执行。

---

## base 关键字——给父类构造函数传参

如果父类的构造函数**有参数**，子类必须通过 `base` 把参数传过去：

```csharp
class Brain
{
    public string Type;

    // 父类构造函数需要参数
    public Brain(string type)
    {
        Type = type;
        Console.WriteLine($"🧠 生成了一个{type}的大脑");
    }
}

// 子类通过 base 传参
class Person : Brain
{
    public Person() : base("聪明")  // ← base 把"聪明"传给父类构造函数
    {
        Console.WriteLine("👤 造了一个人");
    }
}

class Cat : Brain
{
    public Cat() : base("笨笨")     // ← base 把"笨笨"传给父类构造函数
    {
        Console.WriteLine("🐱 造了一只猫");
    }
}

// 使用
Person p = new Person();  // "🧠 生成了一个聪明的大脑" → "👤 造了一个人"
Cat c = new Cat();        // "🧠 生成了一个笨笨的大脑" → "🐱 造了一只猫"
```

### 父类构造函数重载时

如果父类有多个构造函数重载，`base` 可以根据参数自动匹配：

```csharp
class Brain
{
    public Brain(string type) { /* ... */ }
    public Brain(string type, int iq) { /* ... */ }  // 重载
}

class Person : Brain
{
    public Person() : base("聪明", 100) { }  // 匹配第二个构造函数
}
```

> 📌 `base` 的作用就是把子类构造函数的参数**传递给父类的构造函数**。

---

## 练习建议

创建一个 `Student` 类：
- 属性：姓名、年龄、学号
- 方法：写作业
- 用构造函数让学生**自动报到**（输出"XXX 已报到"）
- 创建几个学生对象试试看～

---

**相关笔记：** [[CSharp 面向对象|C# 面向对象]] | [[CSharp this 关键字|C# this 关键字]] | [[CSharp 调试|C# 调试]] | [[CSharp 知识地图|C# 知识地图]]

