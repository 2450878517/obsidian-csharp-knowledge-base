---
title: "C# 单例模式与 WinForms 串口通信：SerialPort 打开、收发和跨线程更新（9.16下午）"
category: 'C#基础与串口通信'
date: "2026-09-16"
processed_date: "2026-09-16"
tags: [CSharp, 单例模式, 设计模式, 静态成员, SerialPort, 串口通信, WinForms, RS232, RS485, Modbus, SerialPort.DataReceived, 委托, BeginInvoke, 虚拟串口]
area: CSharp
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.16下午.mp4'
duration: "01:18:33.20"
transcription_status: reviewed
review_scope: "全段语音转录核对；将识别出的“单粒/单立”按上下文修正为“单例”，将 SerialPort API 按 C# 标准命名校正；未对课堂示例重新编译运行"
transcript: "5_System/Attachments/video-20260916-pm/转录原文.txt"
aliases: [9.16下午视频笔记, CSharp单例模式, WinForms串口通信, SerialPort收发, 串口跨线程更新]
related: ["[[CSharp编程入门_视频笔记|CSharp编程入门_视频笔记]]", "[[CSharp VisionPro 联合编程代码模板集|CSharp VisionPro 联合编程代码模板集]]", "[[CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）|CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）]]"]
---

# C# 单例模式与 WinForms 串口通信：SerialPort 打开、收发和跨线程更新（9.16下午）

本节前半段介绍 C# 单例模式，使用“公司只有一个老板”的案例说明如何限制一个类只能创建一个对象；后半段搭建 WinForms 串口通信案例，完成端口选择、串口参数设置、打开/关闭、发送和接收，并处理 `DataReceived` 线程不能直接更新界面的报错。

> 视频中的“单粒模式/单立模式”是语音识别误写，本文统一修正为“单例模式”。

## 一、课程主线

```text
普通类可以创建多个对象
        ↓ 加入私有构造函数和静态唯一实例
单例模式：全局只访问同一个对象
        ↓
WinForms 设计串口通信界面
        ↓
SerialPort 设置端口和 9600/None/8/1 参数
        ↓
打开、关闭、发送、DataReceived 接收
        ↓
用委托 + BeginInvoke 把接收数据安全地显示到 TextBox
```

## 二、单例模式

### 1. 是什么

单例模式的目标是：一个类在整个程序中只能有一个实例，并提供一个统一的访问入口。

普通类可以这样创建多个对象：

```csharp
Student s1 = new Student();
Student s2 = new Student();
```

单例类则不允许外部直接 `new`，所有调用者都拿到同一个对象。视频用公司老板举例：公司只能有一个老板，不论代码里用 `B1`、`B2` 还是 `B3` 称呼，背后都指向同一个老板实例。

### 2. 视频中的三步写法

```csharp
public class Boss
{
    // 1. 类内部保存唯一实例
    private static Boss _boss;

    // 2. 私有构造函数，外部不能 new Boss()
    private Boss()
    {
    }

    // 3. 对外提供静态访问方法
    public static Boss GetInstance()
    {
        if (_boss == null)
        {
            _boss = new Boss();
        }

        return _boss;
    }

    public void Sign()
    {
        // 老板签字
    }

    public void HoldMeeting()
    {
        // 老板开会
    }
}
```

调用方式：

```csharp
Boss b1 = Boss.GetInstance();
Boss b2 = Boss.GetInstance();

b1.Sign();
b2.HoldMeeting();

bool same = ReferenceEquals(b1, b2); // true
```

### 3. 代码为什么能保证唯一

- `private static Boss _boss`：静态字段属于类本身，而不是某一个对象，整个程序只维护这一份引用。
- `private Boss()`：构造函数私有化，外部无法通过 `new Boss()` 创建第二个对象。
- `public static Boss GetInstance()`：外部只能通过这个静态方法取得对象。
- 第一次调用时创建对象；后续调用直接返回已经创建的对象。

### 4. 常见使用场景

视频提到的应用方向包括：

- 全局设置或配置管理。
- 数据库连接、日志记录等共享资源。
- 只应该存在一份的系统管理对象。
- 多个窗体或模块需要访问同一份状态时。

工程上要注意：单例会带来全局状态，过度使用会让测试和依赖关系变复杂。多线程程序还要考虑首次创建时的线程安全；视频中的写法适合课堂演示和普通 WinForms 场景。

## 三、串口通信基础

### 1. 串口是什么

串口通信是一种设备之间按顺序、逐位传输数据的通信方式。常见应用包括：

- PLC 与上位机通信。
- 传感器、仪表、扫码器等设备通信。
- RS-232、RS-485 设备。
- USB 转串口模块和虚拟串口调试。

视频用“数据一位一位通过一条单行道”帮助理解串行传输。

### 2. 物理接口和通信协议不要混淆

课堂记忆点是 RS-232、RS-485 和 Modbus。更准确地说：

- RS-232、RS-485 更偏向物理层/电气接口与传输规范。
- Modbus 是通信协议，常见形式有 Modbus RTU、Modbus ASCII 和 Modbus TCP。
- `SerialPort` 只负责在串口上收发字节，具体数据帧格式必须按设备协议解析。

因此，不是所有串口通信都必然使用 Modbus，也不能把 USB、UART、RS-232、RS-485 当成完全相同的东西。视频中把鼠标、键盘和 USB 作为串行传输的类比，便于入门理解，但工程上应按具体接口和协议区分。

### 3. 常见串口参数

串口两端的参数必须一致，视频示例使用常见的 `9600/None/8/1`：

| 参数 | 示例值 | 含义 |
|---|---:|---|
| 端口名 | `COM1` / `COM2` | 当前连接的物理或虚拟串口 |
| 波特率 | `9600` | 数据传输速率，单位常写作 BPS |
| 校验位 | `None` | 示例中不启用奇偶校验 |
| 数据位 | `8` | 每个数据字符的有效数据位数 |
| 停止位 | `1` | 一帧数据结束的停止位 |

视频使用 Virtual Ports 创建成对的虚拟端口，例如 `COM1 ↔ COM2`，一端发送后，另一端可以接收，用来模拟真实设备通信。

## 四、WinForms 串口通信界面

### 1. 控件布局

视频搭建的界面包含：

- `ComboBox`：选择串口，例如 `COM1`、`COM2`、`COM3`、`COM4`。
- 端口显示 `TextBox`：显示当前选中的端口。
- “打开端口”按钮。
- “关闭端口”按钮。
- 发送内容 `TextBox`：输入要发送的数据。
- “发送”按钮。
- 接收显示 `TextBox`：多行显示接收到的数据。
- `SerialPort` 组件：设计器中显示为不可见组件。

接收显示框应设置为多行、只读；视频还演示了打开按钮和关闭按钮之间的可见/可用状态切换。

### 2. 端口选择事件

视频使用 `SelectedIndexChanged`，把下拉框当前选择的端口同步到端口显示框：

```csharp
private void comboBoxPort_SelectedIndexChanged(object sender, EventArgs e)
{
    txtPort.Text = comboBoxPort.Text;
}
```

也可以直接使用 `comboBoxPort.SelectedItem?.ToString()`，并对空值做判断。

### 3. 创建和配置 SerialPort

```csharp
using System.IO.Ports;

private readonly SerialPort sp = new SerialPort();

private void Form1_Load(object sender, EventArgs e)
{
    comboBoxPort.Items.AddRange(SerialPort.GetPortNames());

    if (comboBoxPort.Items.Count > 0)
    {
        comboBoxPort.SelectedIndex = 0;
        txtPort.Text = comboBoxPort.Text;
    }

    sp.DataReceived += Sp_DataReceived;
    btnClose.Enabled = false;
}
```

视频课堂用固定下拉项 `COM1`—`COM4` 演示；实际项目更推荐用 `SerialPort.GetPortNames()` 扫描当前电脑的可用端口。

### 4. 打开端口

```csharp
private void btnOpen_Click(object sender, EventArgs e)
{
    try
    {
        if (string.IsNullOrWhiteSpace(txtPort.Text))
        {
            MessageBox.Show("请先选择串口");
            return;
        }

        sp.PortName = txtPort.Text.Trim();
        sp.BaudRate = 9600;
        sp.Parity = Parity.None;
        sp.DataBits = 8;
        sp.StopBits = StopBits.One;

        sp.Open();

        btnOpen.Enabled = false;
        btnClose.Enabled = true;
        comboBoxPort.Enabled = false;
    }
    catch (UnauthorizedAccessException)
    {
        MessageBox.Show("当前串口已被其他程序占用");
    }
    catch (Exception ex)
    {
        MessageBox.Show("打开串口失败：" + ex.Message);
    }
}
```

关键检查：端口名必须存在；端口不能被串口助手或其他程序占用；波特率、校验位、数据位、停止位要与对端一致。

### 5. 关闭端口

```csharp
private void btnClose_Click(object sender, EventArgs e)
{
    try
    {
        if (sp.IsOpen)
        {
            sp.Close();
        }
    }
    finally
    {
        btnOpen.Enabled = true;
        btnClose.Enabled = false;
        comboBoxPort.Enabled = true;
    }
}
```

视频用“先在程序中打开 COM1，再用串口调试助手尝试打开 COM1”的方法验证占用状态；如果调试助手提示端口不存在或被占用，说明当前程序已经持有该端口。

### 6. 发送数据

```csharp
private void btnSend_Click(object sender, EventArgs e)
{
    if (!sp.IsOpen)
    {
        MessageBox.Show("串口未打开，无法发送");
        return;
    }

    string text = txtSend.Text;

    if (string.IsNullOrEmpty(text))
    {
        return;
    }

    // 是否追加换行，要按设备协议决定。
    sp.Write(text);
    // 如果设备要求 CRLF，可改为：sp.WriteLine(text);
}
```

发送前先判断 `sp.IsOpen`，避免程序在串口未打开时直接调用 `Write` 报错。

### 7. 接收数据：DataReceived

`DataReceived` 是 `SerialPort` 自带的接收事件。串口有数据到达后触发，事件处理通常不在 WinForms 主线程执行，因此不能直接修改 `TextBox`。

```csharp
private void Sp_DataReceived(object sender, SerialDataReceivedEventArgs e)
{
    string data = sp.ReadExisting();

    if (string.IsNullOrEmpty(data) || IsDisposed)
    {
        return;
    }

    BeginInvoke(new Action(() =>
    {
        txtReceive.AppendText(data + Environment.NewLine);
    }));
}
```

视频先尝试直接给接收框赋值，随后出现“不是创建控件的线程，不能访问 TextBox”的跨线程异常。解决思路是：

1. 接收事件中读取 `sp.ReadExisting()`。
2. 通过委托封装更新控件的动作。
3. 使用 `BeginInvoke` 把动作切回窗体 UI 线程。
4. 用 `AppendText` 追加内容，而不是覆盖已有接收记录。

如果项目使用较老的写法，也可以把委托单独声明为 `Action update = () => { ... };`，再调用 `BeginInvoke(update)`。

### 8. 关闭窗体时释放资源

```csharp
protected override void OnFormClosed(FormClosedEventArgs e)
{
    if (sp.IsOpen)
    {
        sp.Close();
    }

    sp.Dispose();
    base.OnFormClosed(e);
}
```

否则程序退出后端口可能仍被占用，下一次运行或串口调试助手连接时会出现“拒绝访问”。

## 五、调试验证流程

```text
创建虚拟端口对 COM1 ↔ COM2
        ↓
调试助手连接 COM1
        ↓
WinForms 程序连接 COM2
        ↓
两边都设置 9600、None、8、1
        ↓
一端发送 123 / 456
        ↓
另一端触发 DataReceived 并显示
```

排查顺序：

- 下拉框是否选到了真实存在的端口。
- 两端参数是否完全一致。
- 端口是否已经被其他程序打开。
- 是否在 `sp.Open()` 前设置了 `PortName` 和通信参数。
- 是否在发送前判断了 `sp.IsOpen`。
- 接收事件中是否使用 `ReadExisting()` 或按协议读取完整数据。
- 是否用 `BeginInvoke` 更新 WinForms 控件。
- 是否在关闭窗体时关闭并释放 `SerialPort`。

## 六、时间索引

| 时间 | 内容 |
|---|---|
| 00:00—06:38 | 单例模式定义、唯一实例、优点和适用场景 |
| 06:38—17:06 | `Boss` 案例：私有静态实例、私有构造函数、静态访问方法 |
| 17:06—25:33 | 全局设置、配置读取等单例使用思路，过渡到串口实践 |
| 25:33—36:57 | 虚拟串口、串口概念、RS-232/RS-485、Modbus、9600/None/8/1 |
| 36:57—41:39 | 点对点连接和串口参数含义 |
| 41:39—52:16 | WinForms 串口界面、ComboBox 端口选择和按钮布局 |
| 52:16—01:04:20 | `SerialPort` 创建、参数配置、打开关闭和端口占用异常 |
| 01:04:20—01:08:38 | 虚拟串口联调和发送前的 `IsOpen` 判断 |
| 01:08:38—01:14:49 | `DataReceived`、`ReadExisting` 和接收数据显示 |
| 01:14:49—01:18:33 | 跨线程控件异常、委托和 `BeginInvoke` 更新 UI |

## 七、关联笔记与附件

- [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]：C# 基础课程入口。
- [[CSharp VisionPro 联合编程代码模板集|C# VisionPro 联合编程代码模板集]]：联合编程案例模板，可把串口收发接到视觉检测结果输出。
- [[CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）|C# VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）]]：检测结果保存与窗体通信，可与本节串口发送组合。
- 原始字幕：[[5_System/Attachments/video-20260916-pm/原始字幕.srt]]
- 转录原文：[[5_System/Attachments/video-20260916-pm/转录原文.txt]]

## 收尾

这节课的核心不是把按钮摆出来，而是把“设备连接—参数一致—端口状态—数据收发—线程切换”这条链路跑通。记住：`SerialPort` 负责收发，设备协议负责解释数据，WinForms UI 更新必须回到主线程。把这几个位置接牢，后面给条码、VisionPro 或传感器加串口输出就不会乱了。
