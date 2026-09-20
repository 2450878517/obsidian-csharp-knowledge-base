---
title: 'C# 子线程更新主线程 UI（Invoke / BeginInvoke）'
tags: [CSharp, 多线程, WinForms, Invoke, BeginInvoke, UI更新, 跨线程]
status: seedling
area: CSharp
aliases: [子线程更新UI, Invoke, BeginInvoke, 跨线程操作, C# Invoke]
related: [C# 多线程入门, CSharp 委托, C# Timer]
---
# C# 子线程更新主线程 UI（Invoke / BeginInvoke）

8.20 上午的课，讲**子线程怎么更新主线程的 UI**——这是多线程开发的核心问题，WinForms 里必考。

> ⚠️ UI 控件只能在主线程操作，子线程直接改会报错！必须用 Invoke/BeginInvoke 中转。

## 🤔 问题：为什么子线程不能直接改 UI？

### 错误示范

```csharp
private void button1_Click(object sender, EventArgs e)
{
    Task.Run(() =>
    {
        for (int i = 0; i < 100; i++)
        {
            label1.Text = i.ToString();  // ❌ 报错！
            Thread.Sleep(1000);
        }
    });
}
```

**报错原因**：UI 控件属于主线程，子线程没有权限直接操作。

### 为什么会卡住？

```csharp
private void button1_Click(object sender, EventArgs e)
{
    int i = 0;
    while (true)
    {
        label1.Text = i.ToString();
        i++;
        Thread.Sleep(1000);
    }
}
```

这个代码会**卡死界面**！因为：
- 按钮事件在主线程运行
- while 循环不结束，主线程就出不来
- UI 更新要等整个方法执行完才刷新
- 结果：界面卡死，数字不变

## ✅ 解决方案1：Timer 控件

Timer 是最简单的方案，它本身就是异步的：

```csharp
private int i = 0;

private void button1_Click(object sender, EventArgs e)
{
    timer1.Interval = 1000;  // 1秒一次
    timer1.Start();
}

private void timer1_Tick(object sender, EventArgs e)
{
    label1.Text = i.ToString();
    i++;
}
```

**原理**：Timer 的 Tick 事件每隔一段时间自动触发，每次触发都能更新 UI。

## ✅ 解决方案2：Invoke / BeginInvoke

如果不能用 Timer，就要用 Invoke 家族。

### Invoke — 同步更新

```csharp
private void button1_Click(object sender, EventArgs e)
{
    Task.Run(() =>
    {
        for (int i = 0; i < 100; i++)
        {
            // 用 Invoke 把更新操作"扔"到主线程执行
            label1.Invoke(new Action(() =>
            {
                label1.Text = i.ToString();
            }));
            Thread.Sleep(1000);
        }
    });
}
```

### BeginInvoke — 异步更新

```csharp
private void button1_Click(object sender, EventArgs e)
{
    Task.Run(() =>
    {
        for (int i = 0; i < 100; i++)
        {
            // BeginInvoke 不等待，直接继续
            label1.BeginInvoke(new Action(() =>
            {
                label1.Text = i.ToString();
            }));
            Thread.Sleep(1000);
        }
    });
}
```

## 📊 Invoke vs BeginInvoke 对比

| 特性 | Invoke | BeginInvoke |
|---|---|---|
| 阻塞 | **会阻塞**主线程 | **不会阻塞**主线程 |
| 等待 | 等更新完成才继续 | 不等待，直接继续 |
| 用途 | 需要确保更新完成 | 不关心什么时候更新完 |

### 在 Control 中的区别

| 场景 | Invoke | BeginInvoke |
|---|---|---|
| Control（控件） | 阻塞主线程 | 不阻塞主线程 |
| Delegate（委托） | 阻塞当前函数 | 不阻塞，开子线程运行 |

## 🎯 什么时候用哪个？

| 场景 | 推荐 |
|---|---|
| 简单定时更新 | **Timer** 最简单 |
| 子线程更新 UI | **Invoke** 或 **BeginInvoke** |
| 需要等更新完成 | **Invoke** |
| 不需要等 | **BeginInvoke** |
| 不确定 | 老老实实用 **BeginInvoke** |

## 💡 完整案例：倒计时

```csharp
private void btnStart_Click(object sender, EventArgs e)
{
    Task.Run(() =>
    {
        for (int i = 10; i >= 0; i--)
        {
            int current = i;  // 捕获变量
            label1.Invoke(new Action(() =>
            {
                label1.Text = current.ToString();
            }));
            Thread.Sleep(1000);
        }

        // 倒计时结束
        label1.Invoke(new Action(() =>
        {
            MessageBox.Show("时间到！");
        }));
    });
}
```

## ⚠️ 注意事项

1. **Invoke/BeginInvoke 只能在控件上调用**，不是随便哪都能用
2. **闭包问题**：循环里要用局部变量捕获当前值（`int current = i`）
3. **主线程被阻塞时 Invoke 也会卡住**——因为它是同步的
4. **BeginInvoke 更安全**，不会因为主线程忙而卡死

## 📝 总结

- UI 控件只能在主线程操作，子线程直接改会报错
- Timer 是最简单的异步更新方案
- Invoke = 同步更新，会阻塞
- BeginInvoke = 异步更新，不阻塞
- 实际开发：老老实实用 BeginInvoke 就对了

---
> 课程：8.20 上午 | 主题：子线程更新主线程UI、Invoke、BeginInvoke

