---
tags: [CSharp, 流程控制, 异常处理]
status: evergreen
area: CSharp
aliases: [Exception, finally, throw, 异常类型]
related: [C# 异常处理, C# 调试, C# 值类型与引用类型]
---

# C# 异常处理进阶

基础版 [[C# 异常处理]] 讲了 try-catch 能「抓住错误不崩溃」。这一节是进阶玩法：**怎么分开处理不同类型的错、不管成功失败都要做的事（finally）、还有手动报错（throw）**。

## 🧩 try-catch 基本用法

程序出错时，不用 try-catch 会**直接停掉**；用了 try-catch 会把错误**兜住**，后面的代码还能继续跑：

```csharp
try
{
    int n = int.Parse("ABC");   // 这一句会报错（转不了数字）
    Console.WriteLine(n);
}
catch (Exception ex)
{
    Console.WriteLine("出错啦：" + ex.Message);   // 输出错误原因，程序不崩
}
Console.WriteLine("我还能继续跑");   // 这句话一定会执行
```

- `Exception`：**所有异常的基类**，抓它等于抓住一切错误
- `ex`：你自己起的变量名，装的就是**错误信息**
- `ex.Message`：错误的原因描述

## 🧩 常见的异常子类

`Exception` 下面有很多**具体种类的错误**，每种都能单独抓：

| 异常 | 表示啥错 | 例子 |
|---|---|---|
| `FormatException` | 格式不对 | `int.Parse("ABC")` 转不了数字 |
| `OverflowException` | 数字溢出、装不下 | `short` 最大 6 万多，塞个 10 万进去 |
| `NullReferenceException` | 用了没实例化的对象 | 对象是 null 还去点它的方法 |
| `IndexOutOfRangeException` | 索引越界 | 数组只有 0~4，非访问下标 9 |
| `FileNotFoundException` | 文件找不到 | 读一个不存在的文件 |

## 🧩 多个 catch：按错误类型分开处理

不同类型的错误想用不同的应对，就写**多个 catch**：

```csharp
try
{
    int[] arr = new int[5];
    Console.WriteLine(arr[9]);   // 索引越界
}
catch (IndexOutOfRangeException)
{
    Console.WriteLine("123：下标越界啦！");
}
catch (FormatException)
{
    Console.WriteLine("456：格式不对！");
}
```

它就像**分岔路口**——上面代码爆了什么错，就进对应的 catch。上面的 catch 都不匹配，就落到最下面的 `catch (Exception ex)`（全能王）。

> 💡 也可以一个 try 后面连写多个 catch，每个 catch 管一类错误。不想细分就直接 `catch (Exception ex)` 一把抓。

## 🧩 Exception 的其他信息

- `ex.Message`：错误**信息**（最常用）
- `ex.StackTrace`：错误发生的**方法调用链**，调试时候看运行逻辑用到哪一步崩的
- `ex.InnerException`：**内部异常**——一个异常套着另一个异常时（外层异常里藏着内层原因）用这个挖出来

## 🧩 finally：不管成败一定执行

`finally` 里的代码**无论 try 成没成功、catch 有没有触发，最后都会执行一次**：

```csharp
try
{
    // 打开文件、读东西...
}
catch (Exception ex)
{
    Console.WriteLine("文件损坏：" + ex.Message);
}
finally
{
    // 关闭文件、释放资源，一定执行
}
```

**典型用途：关闭文件、释放资源。** 你想：文件坏了报错，不 finally 的话文件还开着占资源，得手动关。用了 finally 就能保证「不管成功失败，最后都把文件关了」。这就像把临时工辞退前，不管活干没干完，得先把工位收拾干净。

## 🧩 throw：手动报错

代码明明能正常跑，但你觉得有风险，想**强行制造一个错误**：

```csharp
throw new Exception("我是手动报的错！");
```

`throw` 后面跟异常类型，可以指定具体的：

```csharp
throw new FormatException("这格式不对！");
```

抛出去之后，如果外面套了 try-catch，就会被那个 catch 接住；没有就程序崩溃。

## 🧠 一句话总结

| 想干嘛 | 用什么 |
|---|---|
| 出错不崩溃、给个信息 | `try-catch` + `ex.Message` |
| 不同错误不同处理 | 写**多个 catch**，各抓各的 |
| 不管成败都要做的事 | **`finally`**（关文件、释放资源） |
| 手动制造错误 | **`throw new 异常类型("原因")`** |

**Exception 是所有异常的老大，catch 住它 = 抓住一切错误。**

## 📚 作业

1. 写一个 try-catch，故意让数组下标越界，输出 `IndexOutOfRangeException`
2. 再写一个 `int.Parse("ABC")`，改成捕获 `FormatException`
3. 试试 `throw new Exception("测试")` 手动报错，看错误信息
4. 用 `finally` 保证「程序结束」四个字无论怎样都打印出来

---

**相关笔记：** [[C# 异常处理]] | [[C# 调试]] | [[C# 值类型与引用类型]] | [[C#编程入门_视频笔记]]
