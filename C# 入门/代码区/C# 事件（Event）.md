---
tags: [CSharp, 方法, 事件]
status: evergreen
area: CSharp
aliases: [event, 事件机制, 事件与委托]
related: [C# 委托, C# 委托进阶, C# 面向对象]
---
# C# 事件（Event）

事件（event）是一种**语言级机制**，用来实现「**当某件事发生时，通知其他对象**」的行为。它是委托的「升级保护版」——先用一个经典案例把委托的问题暴露出来，再引出事件。

## 🎬 案例：电视台 + 路人

**要求**：制作一个电视台类，拥有发布新闻的方法；发布新闻后，让订阅新闻的路人收到消息。再制作一个路人类，每个路人都可以接收信息。

先写两个类：

```csharp
// 路人类
public class People
{
    public void ReceiveNews(string message)
    {
        Console.WriteLine("路人听到了新闻：" + message);
    }
}

// 电视台类（先不写实现）
public class Official
{
    public void SayNews(string text)
    {
        // 让订阅的路人收到消息
    }
}
```

### 普通做法：手动一个个调用

电视台发布新闻时，把每个路人**硬编码**进 `SayNews` 里：

```csharp
public void SayNews(string text)
{
    People p1 = new People();
    p1.ReceiveNews(text);
    People p2 = new People();
    p2.ReceiveNews(text);
    People p3 = new People();
    p3.ReceiveNews(text);
}
```

❌ 缺点：每来一个新路人，就要改电视台类的代码；少一个路人也得改。**发布新闻这件事和路人的数量绑死了**。

### 委托做法：订阅制

用委托让「订阅」和「发布」分开——谁订阅就 `+=` 挂进来，取消就 `-=`：

```csharp
// 委托声明在命名空间里（这样 Main 里才用得到）
public delegate void WT(string news);

// 电视台类：委托字段 + 发布新闻方法
public class Official
{
    public WT wT;   // 订阅名单

    public void SayNews(string text)
    {
        wT?.Invoke(text);   // 发布新闻，触发所有订阅者
    }
}
```

在 Main 里自由增删订阅：

```csharp
static void Main(string[] args)
{
    Official official = new Official();
    People p1 = new People();
    People p2 = new People();
    People p3 = new People();

    official.wT += p1.ReceiveNews;   // 订阅
    official.wT += p2.ReceiveNews;
    official.wT += p3.ReceiveNews;

    official.SayNews("某国领导开会");   // 三个路人都会收到
    // 后来的人也可以随时 += 订阅、-= 退订，不用改电视台类
}
```

✅ 好处：加人减人都在 Main 里操作，电视台类不用动；订阅先后顺序、退订效果都能灵活控制。

## ⚠️ 委托的两个漏洞

委托能干活了，但暴露了两个问题：

**漏洞一：谁都能直接调用委托。** 不走 `SayNews`，直接这样写也能「发新闻」：

```csharp
official.wT("假新闻");   // 绕过电视台，直接触发路人
```

**漏洞二：`=` 会把之前的订阅全部覆盖掉。**

```csharp
official.wT = p3.ReceiveNews;   // = 是赋值，前面订阅的 p1、p2 全没了！
```

这两个漏洞没有任何手段能防——除非用 **event**。

## 事件：给委托加一层保护

把委托声明前面加上 `event` 关键字：

```csharp
public event WT wT;   // 加上 event，委托就被保护起来了
```

加了 `event` 之后，之前能编译的写法**直接报错**（「事件只能出现在 += 或 -= 的左边」）：

```csharp
official.wT = p3.ReceiveNews;   // ❌ 报错：事件只能用 += / -=，不能用 =
official.wT("假新闻");           // ❌ 报错：事件只能在类内部触发
```

事件对委托做了两件事：
1. **只能 `+=` / `-=`** 增删订阅，不能 `=` 覆盖 → 解决了漏洞二
2. **只能通过封装好的方法触发**（`SayNews`），外部不能直接调用 → 解决了漏洞一

### 🕰️ 闹钟比喻

你设了早上 7 点的闹钟——**必须等闹钟响了才起床**，别人 6 点半来喊你「起床吧」，你是不愿意动的。闹钟就是「事件」：只有闹钟（特定方式）能触发起床这个行为，别人（外部）喊不动。

事件保护了委托内部的内容不被外部破坏，也让委托只能通过特定方式调用——变得很安全。

## 🧠 委托知识总结（三节课串起来）

| 情况 | 解法 |
|---|---|
| 自己**无法手动调用**方法时 | 用**委托**帮你去调用 |
| 委托每次声明很麻烦 | 用 **Action / Func**（内置委托）简化 |
| 方法**只用一次**，单独封装浪费 | 用**匿名函数** `delegate() { ... }` |
| 匿名函数还啰嗦 | 用 **Lambda** `() => ...` 简化 |
| 用委托实现「**当某事发生时通知其他对象**」 | 用 **event** 保护：只能 `+=`/`-=`，只能类内触发 |

**一句话：委托是「装方法的容器」，事件是「上了锁的委托」——锁住了等号和外部直接调用。**

## 📚 作业

用 event 重写电视台案例，然后**故意**在 Main 里写这两种错误用法，观察报错，理解事件的保护：
1. `official.wT = p3.ReceiveNews;`（用 `=` 覆盖 → 应该报错）
2. `official.wT("假新闻");`（直接调用 → 应该报错）

---

**相关笔记：** [[C# 委托]] | [[C# 委托进阶]] | [[C# 面向对象]] | [[C#编程入门_视频笔记]]
