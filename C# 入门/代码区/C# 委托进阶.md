---
tags: [CSharp, 方法, 委托, Lambda]
status: evergreen
area: CSharp
aliases: [Action, Func, Lambda, 匿名函数]
related: [C# 委托, C# 事件（Event）, C# 数组]
---
# C# 委托进阶（Action、Func 与 Lambda）

学完 [[C# 委托]] 的基础后，你会发现：每次用委托都要先**声明**（`delegate void WT();`），还得写参数、返回值，太麻烦了！

这节课就是给委托「减负」的——一路从 **Action/Func → 匿名函数 → Lambda**，越写越短。

## 为什么还要简化

用 `delegate` 声明委托，每次都要先定好返回值、参数的格式，很麻烦。C# 内置了两个**现成的委托类型**，帮我们省掉声明这一步：

- **`Action`**：专门用来装**没有返回值**的方法
- **`Func`**：专门用来装**有返回值**的方法

它俩都是 `delegate` 的一种，只是不用你自己声明了。

## Action：装「无返回值」的方法

```csharp
// 普通委托：先声明，再使用
delegate void WT();
WT wt = ADD;
wt();

// 用 Action：不用声明，直接挂方法
Action wt2 = ADD;    // Action 代表无参、无返回值
wt2();
```

方法有参数？直接在 Action 后面的尖括号里写**参数类型**：

```csharp
Action<string, int> wt = ADD2;   // 两个参数：string 和 int
wt("你好", 45);
```

参数有几个，尖括号里就写几个类型。

## Func：装「有返回值」的方法

`Func` 的尖括号里填的类型比较多，有个铁规矩：

> **最后一个类型是返回值类型，前面的全是参数类型。**

```csharp
// Func<int, int, int>：两个 int 参数，返回 int
Func<int, int, int> wt3 = ADD3;
int result = wt3(3, 5);
```

```csharp
// Func<string, string>：一个 string 参数，返回 string
Func<string, string> wt = ADD2;
string r = wt("你好");
```

⚠️ **返回值放最后**！`Func<int, string>` 是「int 参数，返回 string」，别填反了——这是 Func 最常踩的坑。

## 匿名函数：只用一次的方法

有些方法**只会用一次**，单独封装一个方法很浪费（方法名、方法体都要写）。这时候用**匿名函数**——直接塞给委托，连方法名都不起：

```csharp
// 之前：单独定义一个方法，再挂给委托
void 打招呼() { Console.WriteLine("只用一次的打招呼"); }
Action wt = 打招呼;

// 匿名函数：直接写逻辑，不创建方法
Action wt = delegate() { Console.WriteLine("只用一次的打招呼"); };
```

有参数的匿名函数，参数直接写在 `delegate()` 的括号里：

```csharp
Action<string> wt = delegate(string t) { Console.WriteLine(t); };
```

## Lambda 表达式：匿名函数的最简写法

匿名函数还是有点啰嗦（`delegate` 关键字、参数、花括号）。**Lambda** 就是把匿名函数再简化的写法——把 `delegate` 去掉，参数留在括号里，加上一个箭头 `=>`：

```csharp
// 匿名函数
Action wt = delegate() { Console.WriteLine("打招呼"); };

// Lambda：去掉 delegate，参数用箭头指向逻辑
Action wt = () => { Console.WriteLine("打招呼"); };
```

### 无参 Lambda

没有参数就要写空括号：

```csharp
Action wt = () => { Console.WriteLine("打招呼"); };
```

### 有参 Lambda

```csharp
Action<int, int> wt = (a, b) => { Console.WriteLine(a + b); };
```

**只有一个参数时，括号可以省**：

```csharp
Action<string> wt = t => { Console.WriteLine(t); };
```

多个参数必须带括号：`(a, b) => ...`。

### 参数类型可以省

编译器能根据委托类型自动推断，所以类型一般省略不写：

```csharp
Func<int, int, int> add = (a, b) => { return a + b; };
// 这里 (int a, int b) 可以写成 (a, b)
```

### 表达式 Lambda vs 语句 Lambda

- **语句 Lambda**：逻辑多、有多条语句，用花括号包起来：

```csharp
Func<int, int, int> add = (a, b) =>
{
    int sum = a + b;
    return sum;
};
```

- **表达式 Lambda**：逻辑只有一句话，可以**省掉花括号和 return**：

```csharp
Func<int, int, int> add = (a, b) => a + b;   // 直接写表达式，不用 return
```

单条输出语句也一样省：

```csharp
Action<int, int> wt = (a, b) => Console.WriteLine(a + b);
```

⚠️ 不敢确定能不能省的时候，**老老实实加花括号 + return**，不会错。

## 🔍 数组里的 Lambda（回顾）

之前学数组时用过的 `Exists`，其实已经用到 Lambda 了：

```csharp
string[] fruits = { "苹果", "香蕉", "西瓜" };
bool has = Array.Exists(fruits, x => x == "西瓜");
```

`Array.Exists` 的第二个参数就是一个**判断用的委托**，`x => x == "西瓜"` 意思是：「每个元素 x，判断是不是西瓜」。有就返回 true，没有返回 false。

> 理解诀窍：看不懂 Lambda 时，把它**还原成方法**再读——`x => x == "西瓜"` 就等于一个方法 `bool 判断(string x) { return x == "西瓜"; }`。`Array.Find` 等方法也是这个套路。

## ⚠️ ?.Invoke() 的坑：返回值是 int 时

`?.Invoke()` 虽然能防空，但当委托**有返回值**时会出问题：

```csharp
Func<int, int, int> f = null;
int result = f?.Invoke(3, 8);   // ❌ 报错：无法将 null 隐式转换到 int
```

原因：`?.` 在委托为空时会返回 `null`，而 `int` 这种值类型**不能是 null**，就崩了。

两种解决方式：

```csharp
// 方式一：双问号 ?? 给个默认值（委托为空就用 0）
int result = f?.Invoke(3, 8) ?? 0;

// 方式二：确保委托一定有内容，直接 Invoke
Func<int, int, int> f = (a, b) => a + b;   // 先绑定好
int result = f(3, 8);                       // 一定有结果
```

记住：**值类型（int）不能为 null**，所以返回 int 的委托要么保证非空，要么用 `??` 兜底。

## 📚 作业

1. 用 `Func<int, int, int>` 写一个加法 Lambda `(a, b) => a + b`，传入 3 和 8，输出 11。
2. 练习还原：把 `Array.Exists(fruits, x => x == "西瓜")` 里的 Lambda 还原成一个普通方法，再挂给委托，对比看效果一样。

---

**相关笔记：** [[C# 委托]] | [[C# 数组]] | [[C# 方法]] | [[C#编程入门_视频笔记]]
