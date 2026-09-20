---
title: 'C# 多线程入门（Task / async / await）'
tags: [CSharp, 多线程, Task, async, await, 并行, 异步]
status: seedling
area: CSharp
aliases: [多线程, Task, async await, C# 多线程入门, 异步编程]
related: [CSharp 线程池 ThreadPool, C# 子线程更新UI, CSharp 委托]
---
# C# 多线程入门（Task / async / await）

8.19 下午的课，讲**多线程基础**——什么是多线程、为什么需要多线程、Task 的用法、async/await 异步编程。

> 多线程 = 把多件事分给多个人做，尽可能互不干扰。

## 🤔 什么是多线程？

### 单线程 vs 多线程

| 模式 | 解释 | 比喻 |
|---|---|---|
| 单线程 | 多件事让**一个人**按顺序一个一个做 | 一个人做菜 |
| 多线程 | 多件事让**多个人**同时做 | 多个人分工做菜 |

**谁更快？** 多线程！

### 生活比喻：做菜

做一道菜需要：
1. 洗菜（5分钟）
2. 切菜（3分钟）
3. 烧水（5分钟）
4. 炒菜（10分钟）

**单线程（一个人做）**：
- 洗菜 → 切菜 → 烧水 → 炒菜
- 总时间 = 5 + 3 + 5 + 10 = **23分钟**

**多线程（多个人分工）**：
- A 洗菜（5分钟）
- B 同时烧水（5分钟）
- 水开了、菜洗好了，C 开始炒菜
- 总时间 ≈ **15分钟**（省了8分钟！）

## 🛠️ Task — 多线程的核心工具

Task 比 Thread 和 ThreadPool 都好用，是现在的主流写法。

### 基本用法

```csharp
// 创建并启动一个任务
Task t = Task.Run(() =>
{
    // 这里写要并行做的事
    Thread.Sleep(3000);  // 模拟耗时操作
    Console.WriteLine("任务完成");
});

// 主线程继续做其他事
Console.WriteLine("主线程在跑...");

// 等待任务完成（可选）
t.Wait();
```

### Task.Run 的几种写法

```csharp
// 写法1：Lambda 表达式
Task.Run(() => 方法名());

// 写法2：直接写代码块
Task.Run(() =>
{
    // 多行代码
});

// 写法3：带返回值
Task<int> t = Task.Run(() =>
{
    return 100;
});
int result = t.Result;  // 获取返回值（会阻塞）
```

## ⚡ async / await — 异步编程神器

async/await 让多线程代码写起来像同步一样清晰。

### 为什么需要 async/await？

传统多线程的问题：
- 代码嵌套多，回调地狱
- 逻辑不清晰，难读难维护

async/await 的好处：
- 代码像同步一样写
- 自动处理线程切换
- 不会阻塞主线程

### 基本语法

```csharp
// 1. 方法标记 async
private async void button1_Click(object sender, EventArgs e)
{
    // 2. 耗时操作前加 await
    await Task.Run(() =>
    {
        Thread.Sleep(5000);  // 模拟耗时
    });

    // 3. await 后面的代码会等任务完成才执行
    MessageBox.Show("完成了！");
}
```

### async/await 的规则

| 规则 | 说明 |
|---|---|
| `async` 标记方法 | 表示这个方法里有异步操作 |
| `await` 等待任务 | 等待 Task 完成，但不阻塞主线程 |
| `await` 只能在 `async` 方法里用 | 否则报错 |
| `async` 方法返回值一般是 `Task` 或 `void` | 事件处理可以用 `void` |

## 🍳 案例：冲咖啡（异步流程）

用做咖啡理解 async/await：

```csharp
private async void btnMakeCoffee_Click(object sender, EventArgs e)
{
    DateTime start = DateTime.Now;

    // 准备异步操作
    Task boilWater = Task.Run(() =>
    {
        Thread.Sleep(5000);  // 烧水5秒
        Console.WriteLine("水烧开了");
    });

    Task grindBeans = Task.Run(() =>
    {
        Thread.Sleep(3000);  // 磨豆3秒
        Console.WriteLine("豆子磨好了");
    });

    // 等待两个任务都完成
    await Task.WhenAll(boilWater, grindBeans);

    // 都完成后才能冲泡
    Console.WriteLine("开始冲泡咖啡");

    TimeSpan elapsed = DateTime.Now - start;
    MessageBox.Show($"咖啡做好了！耗时 {elapsed.TotalSeconds:F1} 秒");
}
```

**效果**：烧水和磨豆同时进行，都完成才冲泡。

### Task.WhenAll vs Task.WhenAny

| 方法 | 作用 |
|---|---|
| `Task.WhenAll(t1, t2, ...)` | 等待**所有**任务完成 |
| `Task.WhenAny(t1, t2, ...)` | 等待**任意一个**完成即可 |

## 📊 同步 vs 异步 vs 并行

| 概念 | 解释 | 例子 |
|---|---|
| 同步 | 一件一件按顺序做 | 先洗菜，洗完才切菜 |
| 异步 | 发起任务后不等待，继续做别的 | 烧水时去切菜 |
| 并行 | 多个任务同时执行 | 两个人同时洗菜和烧水 |

## ⚠️ 注意事项

1. **UI 控件只能在主线程操作**——子线程不能直接改 UI
2. 需要更新 UI 要用 `Invoke` 或 `BeginInvoke`（下节课）
3. `await` 不会阻塞主线程，界面不会卡死
4. 多线程要注意**资源竞争**问题（多个线程同时改同一个变量）

## 📝 总结

- 多线程 = 多个人同时干活，效率更高
- `Task.Run()` 创建并启动任务
- `async` 标记异步方法，`await` 等待任务完成
- `Task.WhenAll()` 等所有任务，`Task.WhenAny()` 等任意一个
- 异步编程让代码清晰，避免回调地狱

---
> 课程：8.19 下午 | 主题：多线程入门、Task、async/await

