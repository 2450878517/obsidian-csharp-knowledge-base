---
title: "C# WinForms TCP 服务端模板解析"
date: "2026-09-20"
tags: [CSharp, TCP, Socket, 网络通信, WinForms, 多线程, BeginInvoke]
status: budding
area: CSharp
aliases: [TCP服务端模板, Socket服务端, C# TCP Server, WinForms网络通信]
related: [CSharp 子线程更新主线程UI（Invoke与BeginInvoke）, CSharp 线程池 ThreadPool, CSharp 列表 List, CSharp 异常处理进阶]
source: "用户提供的 WinForms Socket 服务端代码"
---

# C# WinForms TCP 服务端模板解析

## 一句话总结

> 这份代码是一个“监听线程 + 每客户端一条接收线程”的 WinForms TCP 服务端：主线程管理按钮和界面，监听线程接受连接，接收线程读取数据，再用 `BeginInvoke` 把消息安全地送回 UI。

它适合作为理解 Socket、多线程和跨线程 UI 更新的课堂模板，但还不能直接当成稳定的生产模板。

## 一、整体结构

```text
WinForms 主线程
├─ 开启监听按钮：创建、绑定并监听 ServerSocket
├─ 发送按钮：遍历在线客户端并广播
└─ 停止按钮：关闭监听 Socket 和客户端 Socket

监听线程 T1
└─ Listens()
   └─ Accept() 阻塞等待客户端
      ├─ 把客户端 Socket 放进 People
      └─ 为它创建一条接收线程 T2

客户端接收线程 T2（每个连接一条）
└─ ReadMeg()
   └─ Receive() 阻塞等待数据
      ├─ UTF-8 解码
      └─ AddMsg() → BeginInvoke → 更新 textBox4
```

### 四类核心对象

| 对象 | 作用 | 好懂的名字 |
|---|---|---|
| `ServerSocket` | 绑定本机 IP 和端口，只负责监听、接受连接 | 门卫 Socket |
| `ClientSocket` | 表示一个已经连接的客户端，负责收发数据 | 客人 Socket |
| `T1` | 循环执行 `Accept()` | 接客线程 |
| `T2` / `Threads` | 每个客户端各有一条接收线程 | 听话线程 |

> `Listen(10)` 中的 `10` 是等待 `Accept` 的连接队列上限（backlog），不是“服务器最多只能连接 10 个客户端”。

## 二、从启动到通信的完整流程

### 1. 创建 TCP Socket

```csharp
ServerSocket = new Socket(
    AddressFamily.InterNetwork,
    SocketType.Stream,
    ProtocolType.Tcp);
```

三个参数分别表示：

- `InterNetwork`：IPv4。
- `Stream`：面向连接、连续字节流。
- `Tcp`：使用 TCP 协议。

### 2. 解析地址并绑定

```csharp
IPAddress ip = IPAddress.Parse(textBox3.Text);
int port = Convert.ToInt32(textBox2.Text);
IPEndPoint ippoint = new IPEndPoint(ip, port);

ServerSocket.Bind(ippoint);
```

- `127.0.0.1`：只有本机客户端能连接。
- `0.0.0.0`（`IPAddress.Any`）：监听本机所有网卡，局域网设备也可能连接。
- 端口必须是 `0～65535`；实际自定义服务一般选未被占用的非保留端口。

`Bind` 失败的常见原因：端口已占用、IP 不属于本机、端口格式错误，或者权限受限。

### 3. 开始监听

```csharp
ServerSocket.Listen(10);
```

执行后，门卫 Socket 才进入监听状态。它本身不直接接收业务消息。

### 4. 后台线程接受客户端

```csharp
T1 = new Thread(Listens);
T1.IsBackground = true;
T1.Start(ServerSocket);
```

如果把 `Accept()` 放在按钮事件中，WinForms 主线程会一直等客户端，界面就会卡住。因此模板把它放进后台线程。

```csharp
Socket clientSocket = ServerSocket.Accept();
```

`Accept()` 是阻塞调用：没有客户端时停在这里；有客户端完成 TCP 连接后，返回一只新的客户端 Socket。监听 Socket 还会继续站岗。

### 5. 每个客户端分配一条接收线程

```csharp
Thread receiveThread = new Thread(ReadMeg);
receiveThread.IsBackground = true;
receiveThread.Start(clientSocket);
```

这样一个客户端没发消息、卡在 `Receive()` 时，不会挡住别的客户端。

这种模型直观，适合少量连接。客户端很多时，一客户端一线程会消耗较多线程和内存，通常改成 `AcceptAsync`、`ReceiveAsync` 和 `CancellationToken`。

### 6. 接收数据

```csharp
byte[] bytes = new byte[1024 * 2];
int count = ClientSocket.Receive(bytes);

if (count == 0)
{
    break;
}

string msg = Encoding.UTF8.GetString(bytes, 0, count);
```

- `Receive()` 没数据时会阻塞。
- 返回值是本次实际收到的字节数，解码只能使用 `0～count`。
- 返回 `0` 表示对端正常关闭连接。
- 抛出异常通常表示断网、本地 Socket 已关闭或连接异常中断。

### 7. 子线程更新 WinForms 界面

```csharp
public void AddMsg(string text)
{
    Action<string> action = (string message) =>
    {
        textBox4.AppendText(message + "\r\n");
    };

    textBox4.BeginInvoke(action, text);
}
```

接收代码运行在子线程，不能直接操作 `textBox4`。`BeginInvoke` 的意思是：“把这个更新动作排进 UI 线程的队伍里，我先继续干活。”

这部分可联动阅读：[[CSharp 子线程更新主线程UI（Invoke与BeginInvoke）|C# 子线程更新主线程UI（Invoke与BeginInvoke）]]。

### 8. 广播消息

```csharp
foreach (Socket client in People)
{
    client.Send(bytes);
}
```

它不是发给“某一个客户端”，而是遍历连接列表，向所有客户端广播。发送失败的 Socket 会先记录到 `deadSockets`，循环结束后再删除，避免在 `foreach` 正在遍历时修改同一列表。

## 三、字段逐个解析

```csharp
private Socket ServerSocket;
private Socket socket;
Thread T1;
Thread T2;
private bool isok = true;
List<Socket> People = new List<Socket>();
List<Thread> Threads = new List<Thread>();
```

| 字段 | 原本用途 | 解析 |
|---|---|---|
| `ServerSocket` | 监听 Socket | 必需，但推荐命名 `serverSocket` |
| `socket` | 保存刚接受的客户端 | 没必要做字段，用 `Listens` 的局部变量更安全 |
| `T1` | 监听线程 | 一条即可 |
| `T2` | 刚创建的接收线程 | 没必要做字段；创建后放入集合即可 |
| `isok` | 控制循环退出 | 普通 `bool` 跨线程可见性不够稳，推荐取消令牌 |
| `People` | 所有客户端 Socket | 会被多个线程同时访问，必须同步保护 |
| `Threads` | 所有接收线程 | 用来停止时等待线程结束，也必须同步保护 |

## 四、这份模板里的关键问题

### 1. 停止后无法正常重新启动

停止时执行了：

```csharp
isok = false;
```

但再次点击开启时没有恢复 `isok = true`。新的监听线程进入 `while (isok)` 后会立即退出。

最小修复：在真正启动前设置 `isok = true`。更稳的写法是每次启动创建新的 `CancellationTokenSource`。

### 2. 开启失败后，按钮状态仍显示“已经启动”

原代码的按钮切换写在 `catch` 之后，所以即使 `Bind` 或 `Listen` 失败，也会执行：

```csharp
button1.Enabled = false;
button2.Enabled = true;
```

应该只在成功启动后切换按钮；失败时还要关闭刚创建的 Socket。

### 3. 发送和接收使用了不同编码

接收：

```csharp
Encoding.UTF8.GetString(...)
```

发送：

```csharp
Encoding.Default.GetBytes(...)
```

`Encoding.Default` 在不同系统和运行时上可能不同，中文很容易变成乱码。协议双方应明确统一，例如全部使用 UTF-8：

```csharp
byte[] bytes = Encoding.UTF8.GetBytes(str);
```

### 4. 时间文本算出来了，却没有显示

原代码：

```csharp
string text = DateTime.Now.ToString("HH:mm:ss")
    + "--客户端发送信息：" + msg;
AddMsg(msg);
```

这里传入的是 `msg`，所以时间和前缀被丢掉。应改为 `AddMsg(text)`。

### 5. 客户端断开后没有立刻清理

`ReadMeg` 跳出循环后没有：

- 从 `People` 删除对应 Socket；
- 执行 `Shutdown` / `Close`；
- 从线程集合清除当前线程。

因此在线列表会留下“死连接”，直到停止服务或下一次广播失败才有机会清理。

### 6. 多条线程同时操作 `List<T>`

监听线程在 `People.Add`，接收线程可能要删除，UI 线程同时 `foreach` 广播或停止清空。`List<T>` 不是线程安全集合，可能出现：

- “集合已修改，无法执行枚举操作”；
- Socket 被重复关闭；
- 刚连接的客户端没被正确处理。

可以用 `lock` 保护集合，并在锁内制作快照、锁外做网络操作；也可以使用 `ConcurrentDictionary<Socket, ...>`。

### 7. TCP 没有消息边界

TCP 是连续字节流，不会保留每次 `Send` 的边界：

```text
发送方：Send("ABC")，Send("DEF")
接收方可能收到："ABCDEF"
也可能分成："AB"、"CDE"、"F"
```

因此“一次 `Receive` 就是一条完整消息”只在演示中碰巧成立。实际协议必须自己划分消息，常用方法：

- 每条文本末尾加 `\n`，接收端累计到换行再取一条；
- 固定长度报文；
- 消息头写长度，后面跟指定长度正文。

如果正文允许任意二进制内容，长度前缀通常更稳。

### 8. `Socket.Send` 也可能只发送一部分

`Send` 的返回值是本次实际发送的字节数。数据较大或网络拥塞时，可能小于数组长度。稳定代码要循环发送剩余部分，或使用合适的异步 API。

### 9. 空 `catch` 把所有线索吃掉了

原模板多处：

```csharp
catch
{
}
```

停止服务时，由主动关闭 Socket 引发的异常可以按预期忽略；其他异常至少要记录 `ex.Message`。否则它坏了，却连坏在哪里都看不到。

### 10. 停止顺序会让接收线程多等一会儿

原代码先对接收线程 `Join(500)`，再关闭客户端 Socket。但接收线程可能正阻塞在 `Receive()`，所以前面的等待经常白等。

更合理的顺序是：

```text
发出停止信号
→ 关闭监听 Socket，解除 Accept 阻塞
→ 关闭所有客户端 Socket，解除 Receive 阻塞
→ 再 Join 等线程结束
→ 清空集合并恢复按钮
```

### 11. 缺少窗体关闭时的统一清理

如果用户直接点右上角关闭窗体，没有按“停止”，应该在 `FormClosing` 中调用同一套停止逻辑。后台线程不会阻止进程退出，但显式释放 Socket 会让状态更干净。

## 五、保留原思路的改良模板

下面仍使用 `Thread + 阻塞 Socket`，方便对照学习；它修复了重启、编码、死连接、集合并发、部分发送和停止顺序。

```csharp
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Windows.Forms;

public partial class Form1 : Form
{
    private Socket serverSocket;
    private Thread listenThread;
    private volatile bool isRunning;

    private readonly object clientsLock = new object();
    private readonly List<Socket> clients = new List<Socket>();
    private readonly List<Thread> receiveThreads = new List<Thread>();

    private void button1_Click(object sender, EventArgs e)
    {
        IPAddress ip;
        int port;

        if (!IPAddress.TryParse(textBox3.Text, out ip) ||
            !int.TryParse(textBox2.Text, out port) ||
            port < 1 || port > 65535)
        {
            MessageBox.Show("IP 或端口号格式不正确");
            return;
        }

        Socket newServerSocket = null;

        try
        {
            newServerSocket = new Socket(
                AddressFamily.InterNetwork,
                SocketType.Stream,
                ProtocolType.Tcp);

            newServerSocket.Bind(new IPEndPoint(ip, port));
            newServerSocket.Listen(10);

            serverSocket = newServerSocket;
            isRunning = true;

            listenThread = new Thread(ListenLoop);
            listenThread.IsBackground = true;
            listenThread.Start();

            button1.Enabled = false;
            button2.Enabled = true;
            AddMsg("服务端已启动：" + ip + ":" + port);
        }
        catch (Exception ex)
        {
            if (newServerSocket != null)
            {
                newServerSocket.Close();
            }

            MessageBox.Show("监听开启失败：" + ex.Message);
        }
    }

    private void ListenLoop()
    {
        while (isRunning)
        {
            try
            {
                Socket client = serverSocket.Accept();
                Thread thread = new Thread(ReceiveLoop);
                thread.IsBackground = true;

                lock (clientsLock)
                {
                    clients.Add(client);
                    receiveThreads.Add(thread);
                }

                thread.Start(client);
                AddMsg("客户端已连接：" + client.RemoteEndPoint);
            }
            catch (SocketException ex)
            {
                if (isRunning)
                {
                    AddMsg("接受连接失败：" + ex.Message);
                }
                break;
            }
            catch (ObjectDisposedException)
            {
                break;
            }
        }
    }

    private void ReceiveLoop(object state)
    {
        Socket client = state as Socket;
        if (client == null)
        {
            return;
        }

        try
        {
            byte[] buffer = new byte[2048];

            while (isRunning)
            {
                int count = client.Receive(buffer);
                if (count == 0)
                {
                    break;
                }

                // 注意：这里只展示收到的“数据块”，仍需按实际协议处理粘包/拆包。
                string message = Encoding.UTF8.GetString(buffer, 0, count);
                string line = DateTime.Now.ToString("HH:mm:ss")
                    + " [" + client.RemoteEndPoint + "] " + message;
                AddMsg(line);
            }
        }
        catch (SocketException ex)
        {
            if (isRunning)
            {
                AddMsg("客户端通信失败：" + ex.Message);
            }
        }
        catch (ObjectDisposedException)
        {
            // 停止服务时主动关闭 Socket，会走到这里。
        }
        finally
        {
            RemoveClient(client);
        }
    }

    private void button3_Click(object sender, EventArgs e)
    {
        byte[] data = Encoding.UTF8.GetBytes(textBox1.Text);
        List<Socket> snapshot;

        lock (clientsLock)
        {
            snapshot = new List<Socket>(clients);
        }

        foreach (Socket client in snapshot)
        {
            try
            {
                SendAll(client, data);
            }
            catch (SocketException)
            {
                RemoveClient(client);
            }
            catch (ObjectDisposedException)
            {
                RemoveClient(client);
            }
        }
    }

    private static void SendAll(Socket client, byte[] data)
    {
        int offset = 0;

        while (offset < data.Length)
        {
            int sent = client.Send(data, offset, data.Length - offset, SocketFlags.None);
            if (sent == 0)
            {
                throw new SocketException((int)SocketError.ConnectionReset);
            }
            offset += sent;
        }
    }

    private void RemoveClient(Socket client)
    {
        lock (clientsLock)
        {
            clients.Remove(client);
            receiveThreads.Remove(Thread.CurrentThread);
        }

        try { client.Shutdown(SocketShutdown.Both); } catch { }
        try { client.Close(); } catch { }
    }

    private void button2_Click(object sender, EventArgs e)
    {
        StopServer();
    }

    private void StopServer()
    {
        if (!isRunning)
        {
            return;
        }

        isRunning = false;

        try { serverSocket.Close(); } catch { }

        List<Socket> clientSnapshot;
        List<Thread> threadSnapshot;

        lock (clientsLock)
        {
            clientSnapshot = new List<Socket>(clients);
            threadSnapshot = new List<Thread>(receiveThreads);
        }

        foreach (Socket client in clientSnapshot)
        {
            try { client.Shutdown(SocketShutdown.Both); } catch { }
            try { client.Close(); } catch { }
        }

        if (listenThread != null && listenThread.IsAlive)
        {
            listenThread.Join(500);
        }

        foreach (Thread thread in threadSnapshot)
        {
            if (thread.IsAlive)
            {
                thread.Join(500);
            }
        }

        lock (clientsLock)
        {
            clients.Clear();
            receiveThreads.Clear();
        }

        button1.Enabled = true;
        button2.Enabled = false;
        AddMsg("服务端已停止");
    }

    private void AddMsg(string text)
    {
        if (textBox4.IsDisposed || !textBox4.IsHandleCreated)
        {
            return;
        }

        if (textBox4.InvokeRequired)
        {
            textBox4.BeginInvoke(new Action<string>(AddMsg), text);
            return;
        }

        textBox4.AppendText(text + Environment.NewLine);
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        StopServer();
        base.OnFormClosing(e);
    }
}
```

> 这个改良版仍只把一次 `Receive` 当作一个“数据块”。正式使用前，必须根据客户端协议加入换行符解析或长度前缀解析。

## 六、正式项目推荐的方向

### 少量设备、教学或简单局域网工具

可以继续使用这套阻塞式结构，但必须补上：

- 统一 UTF-8；
- 消息边界协议；
- `lock` 或线程安全集合；
- 客户端断开清理；
- 日志和窗体关闭清理；
- 必要的超时、心跳和重连策略。

### 连接数较多或需要长期运行

推荐换成：

```text
Socket/TcpListener 的异步 API
→ AcceptTcpClientAsync / AcceptAsync
→ ReadAsync / ReceiveAsync
→ CancellationToken 控制停止
→ 每连接一个异步任务，而不是占一条阻塞线程
```

异步不会消除粘包、拆包和共享状态问题，只是更省线程、停止流程更自然。

## 七、协议设计要先说清楚

TCP 只保证字节按顺序可靠到达，不知道“这一串字节代表什么”。服务端和客户端至少要共同约定：

| 项目 | 例子 |
|---|---|
| 编码 | UTF-8 |
| 消息边界 | `\n` 结尾，或 4 字节长度头 |
| 消息结构 | `命令|设备号|数据`，或 JSON |
| 超时 | 30 秒无数据是否断开 |
| 心跳 | `PING` / `PONG` |
| 异常响应 | `OK`、`ERROR|原因` |
| 安全 | 是否只限内网、是否认证、是否需要 TLS |

> 普通 TCP Socket 传输的是明文。涉及账号、控制指令或跨公网通信时，需要认证、权限校验、长度限制，并考虑 TLS，不能只靠“知道 IP 和端口”。

## 八、调试检查表

- [ ] 服务端绑定的是 `127.0.0.1`、局域网 IP，还是 `0.0.0.0`？
- [ ] 端口是否被占用、防火墙是否放行？
- [ ] 客户端连接的 IP 和端口是否一致？
- [ ] 双方是否统一 UTF-8？
- [ ] 是否定义了换行符或长度前缀？
- [ ] `Receive == 0` 后是否删除并关闭客户端？
- [ ] 发送失败后是否清理死连接？
- [ ] 是否能停止后再次启动？
- [ ] 窗体关闭时是否释放所有 Socket？
- [ ] 日志是否保留异常类型、消息和客户端地址？

## 九、记忆口诀

```text
Bind：门开在哪
Listen：开始守门
Accept：接进一个客人
Receive：听客人说话
Send：给客人回话
Shutdown + Close：把连接收干净
BeginInvoke：子线程请 UI 线程写字
```

## 相关笔记

- [[CSharp 子线程更新主线程UI（Invoke与BeginInvoke）|C# 子线程更新主线程UI（Invoke与BeginInvoke）]]：为什么接收线程不能直接改 TextBox。
- [[CSharp 线程池 ThreadPool|C# 线程池 ThreadPool]]：理解一客户端一线程的成本。
- [[CSharp 列表 List|C# 列表 List]]：理解客户端集合和遍历期间不能直接删除。
- [[CSharp 异常处理进阶|C# 异常处理进阶]]：不要让空 `catch` 吃掉真正的报错。

---

## 🔗 自动关联

```dataview
TABLE WITHOUT ID
  file.link AS "反向关联",
  status AS "状态"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE (contains(default(related, []), this.file.name) OR contains(default(related, []), this.file.link))
  AND file.path != this.file.path
SORT file.name ASC
```

```dataview
TABLE WITHOUT ID
  file.link AS "同标签笔记",
  area AS "领域"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE length(this.file.tags) > 0 AND contains(file.tags, this.file.tags[0])
  AND file.path != this.file.path
LIMIT 8
```
