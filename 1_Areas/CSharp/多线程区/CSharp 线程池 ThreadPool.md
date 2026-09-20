---
title: 'C# 线程池 ThreadPool'
tags: [CSharp, 多线程, ThreadPool, 线程池, Thread]
status: seedling
area: CSharp
aliases: [线程池, ThreadPool, C# 线程池]
related: [C# 多线程入门, C# Task, C# 子线程更新UI]
---
# C# 线程池 ThreadPool

8.19 上午的课，讲**线程池**——传统 Thread 的简化版，像自动挡汽车，更方便但功能少一些。

> ⚠️ 实际开发中线程池用得不多，因为有更方便的 Task（下节课讲）。这个做了解即可。

## 🤔 为什么需要线程池？

传统 Thread 的问题：
- 每次都要 **创建 → Start → Join → 销毁**
- 频繁创建和销毁线程，**开销大**
- 代码写起来麻烦

线程池的解决方案：
- **事先准备好一批线程**，放在池子里
- 用的时候直接丢方法进去运行
- 用完自动归还，**避免重复创建**

## 📊 Thread vs ThreadPool 对比

| 特性 | Thread（传统） | ThreadPool（线程池） |
|---|---|---|
| 创建 | 手动 `new Thread()` | 自动从池子取 |
| 启动 | 手动 `.Start()` | 丢进去就跑 |
| 销毁 | 运行完自动销毁 | 用完归还池子 |
| 灵活性 | 高（可控制细节） | 低（自动管理） |
| 代码量 | 多 | 少 |
| 比喻 | **手动挡汽车** | **自动挡汽车** |

### 生活比喻

- **Thread = 手动挡汽车**
  - 更灵活，想挂几档挂几档
  - 但操作麻烦，来回换挡
  - 出问题好修（纯机械）

- **ThreadPool = 自动挡汽车**
  - 更方便，踩油门就走
  - 但功能相对少
  - 不用操心换挡

## 💻 基本用法

### 传统 Thread 写法

```csharp
Thread t = new Thread(方法名);
t.Start();      // 启动
t.Join();       // 等待完成
// 完成后自动销毁
```

### ThreadPool 写法

```csharp
ThreadPool.QueueUserWorkItem(方法名);
// 就这一句！方法丢进去就跑
```

方法签名要求：

```csharp
void 方法名(object state)
{
    // 要做的事
}
```

## ⚠️ 注意事项

1. **线程池做了解即可**——实际开发用得少
2. 更常用的是 **Task**（下一节课），比线程池更方便
3. 为了保险、防止代码出错，传统 Thread 用得更多
4. 线程池适合简单场景，复杂场景还是用 Thread 或 Task

## 📝 总结

- 线程池 = 预先准备好的线程集合
- 用法：`ThreadPool.QueueUserWorkItem(方法)`
- 优点：简单、不用手动管理
- 缺点：灵活性低、控制力弱
- 实际开发：了解即可，更多用 Task

---
> 课程：8.19 上午 | 主题：线程池 ThreadPool

