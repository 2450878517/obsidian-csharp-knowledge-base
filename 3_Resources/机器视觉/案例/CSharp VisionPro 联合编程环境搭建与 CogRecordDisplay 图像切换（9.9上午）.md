---
title: "C# VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）"
category: 'VisionPro联合编程'
date: "2026-09-09"
processed_date: "2026-09-15"
tags: [机器视觉, CSharp, VisionPro, WinForms, 联合编程, CogRecordDisplay, CogImageFileTool, 图像读取, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.9上午.mp4'
duration: "01:04:04"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；联合编程环境和图像切换代码按课堂逻辑整理，未在 VisionPro 中重新编译运行"
transcript: "5_System/Attachments/video-20260909-am/转录原文.txt"
aliases: [9.9上午视频笔记, VisionPro联合编程, CogRecordDisplay图像显示, CogImageFileTool读取图片]
related: ["[[CSharp VisionPro 工具总览（功能与介绍笔记）|CSharp VisionPro 工具总览（功能与介绍笔记）]]", "[[CSharp VisionPro 工具大整理（全工具清单）|CSharp VisionPro 工具大整理（全工具清单）]]", "[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]", "[[CSharp VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）|CSharp VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）]]", "[[CSharp VisionPro 表盘指针识别与时间读取（9.7下午）|CSharp VisionPro 表盘指针识别与时间读取（9.7下午）]]"]
---

# C# VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）

本节开始进入 **C# WinForms 与 VisionPro 联合编程**。目标不是只在 QuickBuild 中把视觉流程做出来，而是把 VisionPro 的视觉工具嵌入 C# 窗体，让操作者可以通过按钮、图像窗口和结果控件使用检测程序。

本节完成的第一个小案例是：扫描“素材”文件夹中的多种图片，点击按钮后逐张读取图片，并显示在 `CogRecordDisplay` 中。

```text
WinForms 界面
    ↓
CogRecordDisplay：显示图像
    ↓
CogImageFileTool：读取图片文件
    ↓
Directory.GetFiles：扫描素材路径
    ↓
按钮事件：每次点击切换下一张图片
```

## 一、什么是联合编程

联合编程是让不同系统、不同组件或不同工具协同工作，共同完成一个应用程序。

在机器视觉项目中，课堂将它具体解释为：

- 用 VisionPro 完成视觉算法、图像处理和检测工具配置。
- 用 Visual Studio 的 C# WinForms 完成界面、按钮、文件操作和结果交互。
- 通过代码调用 VisionPro 的工具和运行结果。
- 把视觉逻辑与用户界面组合成一个操作者可以直接使用的软件。

VisionPro 适合做视觉处理，但单独把 `.vpp` 文件交给客户，客户通常不知道如何打开、运行和修改。WinForms 可以把这些操作包装成“导入图片”“开始检测”“显示结果”等按钮，降低使用门槛。

## 二、为什么要使用联合编程

### 1. 视觉处理和用户交互互补

VisionPro 擅长：

- 图像采集与处理。
- 模板匹配、Blob、测量等视觉工具。
- ToolBlock 流程搭建。
- 运行记录和视觉结果输出。

C# WinForms 擅长：

- 搭建按钮、文本框、下拉框和图像窗口。
- 管理文件路径和图片列表。
- 处理用户点击、切换图片和保存结果。
- 根据检测结果设计更直观的操作界面。

二者结合后，视觉工程师负责算法，操作者通过窗体完成使用。

### 2. 提高开发效率

VisionPro 中已经配置好的工具和 `.vpp` 项目可以直接放入 C# 程序中调用，不需要在 C# 中重新实现模板匹配、Blob 或测量算法。WinForms 界面也能快速搭建，适合把现有视觉项目包装成可操作的软件。

### 3. 适合工业现场需求

工业软件通常需要同时完成：

- 显示当前图像。
- 显示参数和检测结果。
- 导入或切换产品图片。
- 保存结果和检测记录。
- 根据合格与不合格状态进行提示。

这些界面和数据操作由 C# 完成会更灵活。

### 4. 代码更容易维护和扩展

推荐把视觉逻辑放在 VisionPro 的 `.vpp` / `CogToolBlock` 中，把窗体逻辑放在 C# 中：

```text
VisionPro：图像处理、匹配、测量、判定
        ↕
C# WinForms：界面、按钮、路径、显示、交互
```

界面修改时不必重新制作视觉工具，视觉参数调整时也不必重写所有界面代码。这样可以降低耦合，后续还可以继续增加登录、权限、结果保存和数据库等功能。

## 三、联合编程环境搭建

### 1. 在 Visual Studio 中创建工具箱选项卡

在 WinForms 设计器中：

1. 打开工具箱。
2. 在空白区域右键，选择“添加选项卡”。
3. 命名为“VisionPro工具”或“VisionPro工具箱”。
4. 在新选项卡上右键，选择“选择项”。

选择项窗口可以加载计算机中的 .NET 程序集，并把 VisionPro 控件加入工具箱。搜索 `CogPM` 或 `CogRecordDisplay`，如果能看到 VisionPro 控件，说明工具已经加载成功。

### 2. 直接选择项可能卡住

VisionPro 的程序级程序集数量较多，Visual Studio 自动扫描时可能长时间不响应，甚至导致界面卡死。课堂给出的绕行方法是：

1. 找到 VisionPro 安装目录下的 `ReferenceAssemblies` 文件夹。
2. 在 Visual Studio 关闭或准备重新打开时，暂时把这个文件夹剪切到桌面。
3. 重新打开项目，在工具箱中新建 VisionPro 选项卡。
4. 进入“选择项”，让 Visual Studio 先完成扫描。
5. 通过“浏览”手动进入 VisionPro 的 `ReferenceAssemblies` 文件夹。
6. 使用 `Ctrl+A` 全选程序级程序集并打开。
7. 对不是目标 .NET 程序集的提示按确定处理。
8. 完成后，把临时剪切到桌面的文件夹放回原位置。

直接复制程序集到工具箱虽然可能暂时可用，但项目引用不完整时，代码中仍然可能无法创建控件。更稳妥的方式是：工具箱添加控件后，再在项目“引用”中通过“添加引用 → 浏览”补充 VisionPro 程序集。

### 3. 常见引用

本节使用的代码至少涉及：

```csharp
using Cognex.VisionPro;
using Cognex.VisionPro.Controls;
using Cognex.VisionPro.ImageFile;
```

不同 VisionPro 版本的程序集名称可能略有差异。以 Visual Studio 的“引用”节点和对象浏览器中实际安装的程序集为准。

## 四、CogRecordDisplay 的作用

`CogRecordDisplay` 是 VisionPro 的图像显示控件，主要负责把已经得到的图像显示出来，并提供适应窗口大小、缩放和运行记录显示等能力。

它本身不是图片读取工具：

```text
CogRecordDisplay：展示图片
CogImageFileTool：读取图片
```

把图片读取工具的 `OutputImage` 赋给显示控件的 `Image` 属性后，图像才会出现在窗口中：

```csharp
cogRecordDisplay1.Image = cift1.OutputImage;
cogRecordDisplay1.Fit();
```

`Fit()` 用来让图像自动适应显示控件，避免不同尺寸图片切换后出现显示不完整或需要手动缩放的问题。

## 五、用 CogImageFileTool 读取图片

`CogImageFileTool` 的作用是根据文件路径读取图片。基本流程是：

```text
创建 CogImageFileTool
        ↓
Operator.Open(图片路径, Read)
        ↓
Run()
        ↓
OutputImage
        ↓
CogRecordDisplay.Image
```

课堂中使用的读取代码如下：

```csharp
CogImageFileTool cift1 = new CogImageFileTool();

cift1.Operator.Open(
    pictures[n],
    CogImageFileModeConstants.Read);

cift1.Run();

cogRecordDisplay1.Image = cift1.OutputImage;
cogRecordDisplay1.Fit();
```

`Open()` 负责打开指定路径，`Run()` 负责执行读取，`OutputImage` 才是工具真正读取出来的结果。

## 六、扫描素材文件夹

课堂使用 `Directory.GetFiles()` 扫描图片文件夹，并用 `List<string>` 保存所有图片路径：

```csharp
string path =
    Directory.GetCurrentDirectory() + "/素材";

string[] names =
{
    "*.png",
    "*.jpg",
    "*.jpeg"
};

List<string> pictures =
    new List<string>();

foreach (string name in names)
{
    string[] ps =
        Directory.GetFiles(path, name);

    pictures.AddRange(ps);
}
```

这里的逻辑是：

1. 先得到素材文件夹路径。
2. 准备需要搜索的图片后缀。
3. 遍历每个后缀。
4. 用 `Directory.GetFiles()` 得到符合条件的文件路径。
5. 用 `AddRange()` 将路径批量加入图片列表。

课堂素材中扫描了 JPG、PNG、BMP 等图片格式。实际使用时，后缀数组要与素材文件夹中的文件类型对应。

## 七、按钮逐张切换图片

如果在按钮事件中直接使用循环，点击一次按钮就会把所有图片连续读完，用户看不到逐张切换的效果。因此要把图片索引保存为窗体字段，每点击一次按钮只读取一张。

```csharp
int n = 0;

private void button1_Click(
    object sender,
    EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() + "/素材";

    string[] names =
    {
        "*.png",
        "*.jpg",
        "*.jpeg"
    };

    List<string> pictures =
        new List<string>();

    foreach (string name in names)
    {
        string[] ps =
            Directory.GetFiles(path, name);

        pictures.AddRange(ps);
    }

    if (pictures.Count == 0)
    {
        MessageBox.Show("素材文件夹中没有图片");
        return;
    }

    // 读到最后一张后，从第一张重新开始
    if (n >= pictures.Count)
    {
        n = 0;
    }

    CogImageFileTool cift1 =
        new CogImageFileTool();

    cift1.Operator.Open(
        pictures[n],
        CogImageFileModeConstants.Read);

    cift1.Run();

    cogRecordDisplay1.Image =
        cift1.OutputImage;

    cogRecordDisplay1.Fit();

    // 为下一次点击准备下一张图片
    n++;
}
```

### 索引为什么使用 `>=`

假设列表中有 5 张图片，合法索引是 `0~4`。读取索引 4 后执行 `n++`，索引变成 5；下一次点击时，`n >= pictures.Count` 成立，需要把 `n` 重置为 0。

如果只写 `n > pictures.Count`，索引等于 5 时不会重置，访问 `pictures[5]` 就会出现越界异常。

### 更稳妥的路径写法

课堂用的是字符串拼接。正式项目中建议用 `Path.Combine()`，避免不同系统的路径分隔符问题：

```csharp
string path = Path.Combine(
    Directory.GetCurrentDirectory(),
    "素材");
```

## 八、和前面图片切换代码的区别

之前如果使用 `PictureBox`，可能会直接把文件路径赋给控件或调用图片加载方法。本节换成 `CogRecordDisplay` 后，读取链路变为：

```text
文件路径
    ↓
CogImageFileTool.Operator.Open()
    ↓
CogImageFileTool.Run()
    ↓
CogImageFileTool.OutputImage
    ↓
CogRecordDisplay.Image
    ↓
CogRecordDisplay.Fit()
```

变化的是“图片怎么显示”，扫描文件夹和索引循环的思路没有变化。

## 九、后续接入视觉检测

本节只是联合编程的第一步。读取出来的图像可以继续接入 VisionPro 工具或 ToolBlock：

```text
CogImageFileTool.OutputImage
        ↓
CogToolBlock.Inputs["InputImage"]
        ↓
ctb.Run()
        ↓
ctb.CreateCurrentRecord()
        ↓
CogRecordDisplay.Record
```

简单的显示可以使用：

```csharp
cogRecordDisplay2.Image =
    cift1.OutputImage;

cogRecordDisplay2.Fit();
```

如果需要显示 ToolBlock 的工具图形、匹配框和运行结果，可以把运行记录交给 `Record`：

```csharp
ctb.Inputs["InputImage"].Value =
    cift1.OutputImage;

ctb.Run();

cogRecordDisplay2.Record =
    ctb.CreateCurrentRecord();

cogRecordDisplay2.Fit();
```

输入端口名称必须以当前 `.vpp` 中的 ToolBlock 输入名称为准，不要直接照抄 `InputImage` 或 `OutputImage`。

## 十、常见坏人

- 工具箱里找不到 `CogRecordDisplay`：检查 VisionPro 控件是否添加到工具箱，或者项目引用是否缺少 `Cognex.VisionPro.Controls`。
- `CogImageFileTool` 不识别：检查 `Cognex.VisionPro.ImageFile` 引用和 `using`。
- `cift1.OutputImage` 为空：确认图片路径存在，并且已经执行 `Open()` 和 `Run()`。
- `pictures[n]` 越界：最后一张图片读取后要判断 `n >= pictures.Count`。
- 点击一次显示全部图片：不要在按钮事件中用循环连续读取；用字段索引，每次按钮只读取一张。
- 图片显示不完整：给 `CogRecordDisplay` 调用 `Fit()`。
- 文件夹没有图片：检查当前工作目录是否真的是程序运行目录，并确认“素材”文件夹位置正确。
- 只复制 VisionPro 程序集但没有添加引用：工具箱可能能看到控件，代码仍然无法创建对应类型；需要在项目引用中补充程序集。
- 不同图片尺寸切换后显示异常：每次赋值新图像后重新调用 `Fit()`。

## 十一、本节记忆

```text
联合编程 = VisionPro视觉处理 + C#界面交互

CogRecordDisplay：负责显示，不负责读取
CogImageFileTool：负责读取图片
Directory.GetFiles：扫描文件路径
List<string>：保存图片路径
按钮事件：每次读取一张
索引 >= 图片数量：回到第一张
Fit()：让图像适应显示区域
```

本节的核心不是记住某个控件名字，而是理解“读取”和“显示”是两个动作：先由读取工具得到 `OutputImage`，再把图像交给 `CogRecordDisplay` 展示。

## 原始资料与课堂截图

- 视频：`D:\BaiduNetdiskDownload\14班9.9上午.mp4`
- 时长：64 分 04 秒
- [[5_System/Attachments/video-20260909-am/转录原文.txt|转录原文]]
- [[5_System/Attachments/video-20260909-am/原始字幕.srt|原始字幕]]

课堂截图：

- ![[5_System/Attachments/video-20260909-am/课堂300.jpg]]
- ![[5_System/Attachments/video-20260909-am/课堂900.jpg]]
- ![[5_System/Attachments/video-20260909-am/课堂1500.jpg]]
- ![[5_System/Attachments/video-20260909-am/课堂2100.jpg]]
- ![[5_System/Attachments/video-20260909-am/课堂2700.jpg]]
- ![[5_System/Attachments/video-20260909-am/课堂3300.jpg]]
- ![[5_System/Attachments/video-20260909-am/课堂3800.jpg]]

## 关联链接

- [[CSharp VisionPro 工具总览（功能与介绍笔记）|C# VisionPro 工具总览（功能与介绍笔记）]]
- [[CSharp VisionPro 工具大整理（全工具清单）|C# VisionPro 工具大整理（全工具清单）]]
- [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]
- [[CSharp VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）|C# VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）]]
- [[CSharp VisionPro 表盘指针识别与时间读取（9.7下午）|C# VisionPro 表盘指针识别与时间读取（9.7下午）]]
- [[CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）|C# VisionPro 轴承滚珠批量测量与极性展开（9.4上午）]]
