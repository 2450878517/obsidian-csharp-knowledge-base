---
tags: [CSharp, 面向对象, this]
status: budding
area: CSharp
aliases: [this, 构造函数链]
related: [C# 构造函数, C# 面向对象, C# 静态成员]
---
# C# this 关键字

`this` 表示**当前正在使用的对象本身**，主要有两个作用。

---

## 作用一：区分字段和参数

当**参数名**和**字段名**同名时，计算机分不清哪个是哪个，需要用 `this` 来告诉它：

```csharp
class Student
{
    public string Name;   // 字段
    public int Id;        // 字段

    // 参数名也叫 Name 和 Id，跟字段名一样了
    public Student(string Name, int Id)
    {
        // ❌ 这样写计算机搞不懂——参数 Name 给了字段 Name？
        Name = Name;   // 这是把自己赋给自己，啥也没干！

        // ✅ 用 this 就清楚了——this.Name 是字段，Name 是参数
        this.Name = Name;   // 字段 = 参数
        this.Id = Id;       // 字段 = 参数
    }
}
```

> ⚠️ 不加 `this`，计算机只看得到参数，字段根本没被赋值！

### 什么时候会撞名？

最常见的就是写构造函数时，你想用的参数名很自然就和字段名一样了（比如都叫 `name`）：

```csharp
// 不好的写法——故意起不一样的名
public Student(string n, int id) 
{
    Name = n;
    Id = id;
}

// 好的写法——参数名直观，用 this 区分
public Student(string Name, int Id)
{
    this.Name = Name;
    this.Id = Id;
}
```

---

## 作用二：构造函数链（一个构造函数调用另一个）

在一个构造函数中**调用同一个类的另一个构造函数**，避免重复代码：

```csharp
class Car
{
    public string Brand;
    public int Tires;

    // 造车需要品牌和轮胎数
    public Car(string Brand, int Tires)
    {
        this.Brand = Brand;
        this.Tires = Tires;
        Console.WriteLine($"正在生产 {Tires} 轮的 {Brand} 牌汽车");
    }

    // 用户只说了品牌，没提轮胎数——默认造 4 轮的
    public Car(string Brand) : this(Brand, 4)  // ← this 调用了上面的构造函数
    {
        Console.WriteLine("（默认配置：4 轮）");
    }
}

// 使用
Car c1 = new Car("宝马", 6);   // 直接造 6 轮宝马
Car c2 = new Car("奔驰");      // 只说了品牌，默认 4 轮
```

**执行流程：**
1. `new Car("奔驰")` 调用只有一个参数的构造函数
2. 这个构造函数通过 `this(Brand, 4)` 先调用两个参数的构造函数
3. 两个参数的构造函数先执行完
4. 再回到一个参数的构造函数执行剩下的代码

> 📌 简单记：**`this(...)` 就像在本类里写了另一个 `new`**，把参数传过去先执行。

---

## 总结

| 作用 | 说明 |
|---|---|
| **区分字段和参数** | `this.字段 = 参数`，参数名和字段名相同时用 |
| **构造函数链** | `this(参数)` 在本构造函数中调用另一个构造函数 |

**相关笔记：** [[C# 构造函数]] | [[C# 面向对象]]
