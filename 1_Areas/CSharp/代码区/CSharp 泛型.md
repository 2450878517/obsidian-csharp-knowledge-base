---
title: 'C# 泛型'
tags: [CSharp, 数据结构, 泛型]
status: evergreen
area: CSharp
aliases: [Generic, 泛型方法, 泛型类, 类型安全]
related: [CSharp 列表 List, CSharp 字典 Dictionary, CSharp 方法]
---

# C# 泛型

泛型（Generic）是一种**与类型无关**的编程技术：先写一个「模板」，不指定具体类型，使用时再确定。一个方法 / 一个类，就能适用所有类型。

## 为什么需要泛型

场景：写一个「交换两个变量」的方法。

```csharp
// 交换两个 int —— 用临时变量 + ref
public static void Swap(ref int a, ref int b)
{
    int temp = a;
    a = b;
    b = temp;
}

// 调用
int x = 19, y = 7;
Swap(ref x, ref y);   // 结果：x=7, y=19
```

> ⚠️ 注意：要让方法**真正改变外部变量**，必须加 `ref` 关键字。默认传参只是复制一份，改的是副本。

问题来了：想交换 double、string、bool……每种类型都得重写一个方法：

```csharp
Swap(ref int a, ref int b);        // int 版
Swap(ref double a, ref double b);  // double 版
Swap(ref string a, ref string b);  // string 版
```

类型一多，方法写到手软 —— **代码大量冗余**。这就是泛型要解决的痛点。

## 泛型的概念

泛型可以让你编写**类型无关的代码**：

- 先定义一个模板，不指定具体是哪种类型
- 真正使用时，编译器自动生成针对该类型的版本

作用：

- 写一个方法就能适用于所有类型
- 编译时就能检查类型是否匹配
- 没有装箱拆箱，**类型安全、不损失性能**

## 泛型方法（Generic Method）

方法名后加 `<T>` 尖括号，`T` 就是**类型占位符**：

```csharp
public static void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}
```

调用时，T 自动变成你填的类型：

```csharp
int a = 19, b = 7;
Swap(ref a, ref b);        // T = int

double c = 5.6, d = 8.9;
Swap(ref c, ref d);        // T = double

string s1 = "你好", s2 = "再见";
Swap(ref s1, ref s2);      // T = string
```

**T 是什么类型，取决于用的时候填什么类型** —— 一个方法，通吃所有类型。

## 泛型类（Generic Class）

如果整个类（字段、方法、属性）都要处理多种类型，就把泛型定义在**类**上：

```csharp
public class Box<T>
{
    private T item;           // 字段用泛型

    public void Set(T value)  // 方法参数用泛型
    {
        item = value;
    }

    public T Get()            // 返回类型用泛型
    {
        return item;
    }
}
```

使用：实例化时必须指定类型：

```csharp
Box<int> box = new Box<int>();
box.Set(99);
int result = box.Get();      // 99

Box<string> box2 = new Box<string>();
box2.Set("你好");
string s = box2.Get();       // 你好
```

> **泛型方法 vs 泛型类**：只在方法里用泛型 → 泛型方法；字段、属性、多个方法都要用泛型 → 泛型类。

## 泛型 vs Object

`object` 也能存任意类型，但有两个坑：

```csharp
object o = 99;        // 装箱：int → object
int n = (int)o;       // 拆箱：object → int，强制转换可能丢数据
```

- **装箱拆箱**：值类型与 object 互转，涉及强制类型转换，可能**丢数据、影响性能**
- **类型不安全**：拆箱转错类型，运行时才报错
- 面试高频点，**尽量避免**

泛型**没有装箱拆箱**，类型安全、性能更好。

## 案例：能存任意类型的小盒子

写一个 `Box<T>`，能存一个任意类型的数据：

```csharp
public class Box<T>
{
    private T item;

    public void Set(T value)
    {
        item = value;
        Console.WriteLine("存入成功");
    }

    public T Get()
    {
        return item;
    }
}

// 用：存 int
Box<int> box = new Box<int>();
box.Set(99);                 // 存入成功
Console.WriteLine(box.Get()); // 99

// 用：存 string —— 同一个类，换类型就能用
Box<string> box2 = new Box<string>();
box2.Set("你好");
Console.WriteLine(box2.Get()); // 你好
```

## List\<T\> 就是泛型类

`List<T>` 底层就是一个泛型类：

```csharp
List<string> names = new List<string>();   // 只能装 string
List<int> numbers = new List<int>();       // 只能装 int
```

如果让你手写一个「列表」，也会用泛型类把增删改查封装出来。

---

**相关笔记：** [[CSharp 列表 List|C# 列表 List]] | [[CSharp 数据类型|C# 数据类型]] | [[CSharp 方法|C# 方法]] | [[CSharp 类型转换|C# 类型转换]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

