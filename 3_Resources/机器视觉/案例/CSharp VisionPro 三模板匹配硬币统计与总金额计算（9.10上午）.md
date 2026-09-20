---
title: "C# VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）"
category: 'VisionPro联合编程'
date: "2026-09-10"
processed_date: "2026-09-15"
tags: [机器视觉, CSharp, VisionPro, WinForms, 联合编程, CogToolBlock, CogPMAlign, CogRecordDisplay, CogImageFileTool, CogSerializer, TableLayoutPanel, 硬币识别]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.10上午.mp4'
duration: "00:26:20"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；三种硬币模板、ToolBlock 输入输出、WinForms 布局、金额计算和结果图显示按课堂逻辑整理，未在 VisionPro 中重新编译运行"
transcript: "5_System/Attachments/video-20260910-am/转录原文.txt"
aliases: [9.10上午视频笔记, 硬币联合编程, 三模板匹配统计, VisionPro硬币金额计算]
related: ["[[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]", "[[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]", "[[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|CSharp VisionPro 多模板匹配与标定板工具（9.7上午）]]", "[[CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）|CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）]]"]
---

# C# VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）

本节把前面学过的单个模板匹配扩展成三个 `CogPMAlignTool`：分别识别一元、五角和一角硬币，统计三种硬币的数量，再计算画面中的总金额。随后把 VisionPro 检测流程接入 C# WinForms，并用两个 `CogRecordDisplay` 对比原图和带检测框的结果图。

核心流程：

```text
VisionPro：三个 CogPMAlignTool 分别训练硬币模板
        ↓
将三个 Results.Count 暴露为 ToolBlock 输出
        ↓
保存不带图像、不带结果的硬币.vpp
        ↓
C# 加载图片和硬币.vpp
        ↓
把图片传给 ctb.Inputs["Image"]
        ↓
ctb.Run()
        ↓
读取一元、五角、一角数量
        ↓
计算总金额并显示
        ↓
显示 ToolBlock 运行后的检测框
```

## 一、在 VisionPro 中制作硬币 ToolBlock

### 1. 三个 PMAlign 分别匹配三种硬币

在 `CogToolBlock` 中放入三个 `CogPMAlignTool`，分别训练：

| 工具 | 训练目标 | 输出结果 |
|---|---|---|
| `CogPMAlignTool1` | 一元硬币 | 一元数量 |
| `CogPMAlignTool2` | 五角硬币 | 五角数量 |
| `CogPMAlignTool3` | 一角硬币 | 一角数量 |

课堂中还演示了把硬币正面、反面需要识别的情况分别纳入模板。每个 PMAlign 都要先运行测试，确认没有明显误匹配，再继续连接输出。

### 2. 给 ToolBlock 设置输入输出

输入端连接到三个 PMAlign 的 `InputImage`。课堂把输入端命名为 `Image`：

```text
[Inputs]
    Image ─────→ CogPMAlignTool1.InputImage
            ├──→ CogPMAlignTool2.InputImage
            └──→ CogPMAlignTool3.InputImage
```

把三个工具的 `Results.Count` 连接到 ToolBlock 的输出端。输出名称不要一直使用默认的 `Readout Counter`、`Readout Counter1`、`Readout Counter2`，建议直接改成业务含义：

```text
CogPMAlignTool1.Results.Count ─→ 一元
CogPMAlignTool2.Results.Count ─→ 五角
CogPMAlignTool3.Results.Count ─→ 一角
```

代码读取输出时，字符串必须和 VPP 中的名称完全一致。上面的中文名称可以使用；如果项目使用英文，也可以改为 `OneYuan`、`FiveJiao`、`OneJiao`，但 C# 和 VPP 必须同步。

### 3. 保存 VPP 的注意点

最后把 ToolBlock 保存为不带图像、不带运行结果的 `硬币.vpp`。这样 C# 程序每次运行时传入当前图片，不会把课堂测试图片和旧结果一起保存进去。

ToolBlock VPP 和 QuickBuild/Job Editor 的项目 VPP 不是同一个东西：

- ToolBlock VPP：保存一个可被 C# `CogSerializer.LoadObjectFromFile()` 读取的工具块。
- 项目 VPP：保存完整作业，通常要在 Job Editor 中打开。

如果把 ToolBlock 文件直接当作完整项目打开，可能会报文件类型或结构错误。应新建项目，在 Job Editor 中打开项目文件，再把 ToolBlock 作为工具使用。

## 二、用 TableLayoutPanel 整理 WinForms 界面

课堂把窗体划分为四个区域，避免控件越来越多后互相遮挡：

```text
┌──────────────────────┬──────────────────────┐
│ cogRecordDisplay1    │ cogRecordDisplay2    │
│ 原始图像              │ 检测结果图            │
├──────────────────────┼──────────────────────┤
│ cogToolBlockEditV21  │ 按钮 + Label 结果     │
│ ToolBlock 调试界面    │ 切换图片/加载VPP/检测  │
└──────────────────────┴──────────────────────┘
```

`TableLayoutPanel` 可以把窗体分成 2×2、2×3 或更多单元格。将它的 `Dock` 设置为 `Fill`，使其充满 `Form1`。每个单元格默认只能放一个控件；如果一个格子中要放多个按钮和 Label，就先放一个普通 `Panel`，再把多个控件放入这个 Panel。

建议设置：

```text
TableLayoutPanel.Dock = Fill
cogRecordDisplay1.Dock = Fill
cogRecordDisplay2.Dock = Fill
cogToolBlockEditV21.Dock = Fill
```

右下角可放三个按钮：切换图片、加载 VPP、检测目标；再用四个 Label 显示一元数量、五角数量、一角数量和总金额。

## 三、图片切换代码

下面是课堂使用的扫描文件夹方式。它支持图片文件名不连续，程序会把 `素材` 文件夹中的 `.jpg`、`.png`、`.bmp` 路径加入列表。

```csharp
private int n = 0;

private void Next_Click(object sender, EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() + "/素材";

    string[] names =
    {
        "*.jpg",
        "*.png",
        "*.bmp"
    };

    List<string> pictures = new List<string>();

    foreach (string name in names)
    {
        string[] ps = Directory.GetFiles(path, name);
        pictures.AddRange(ps);
    }

    if (pictures.Count == 0)
    {
        MessageBox.Show("素材文件夹中没有图片");
        return;
    }

    if (n >= pictures.Count)
    {
        n = 0;
    }

    CogImageFileTool cift1 = new CogImageFileTool();
    cift1.Operator.Open(
        pictures[n],
        CogImageFileModeConstants.Read);
    cift1.Run();

    cogRecordDisplay1.Image = cift1.OutputImage;
    cogRecordDisplay1.Fit();

    n++;
}
```

实际项目中还应检查目录是否存在，并保证图片被复制到程序运行目录的 `Debug/素材` 文件夹。

## 四、加载硬币 VPP

`CogToolBlock` 要定义成窗体字段，因为加载按钮和检测按钮都要访问同一个对象：

```csharp
private CogToolBlock ctb = new CogToolBlock();

private void LoadVpp_Click(object sender, EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() +
        "/Vpp/硬币.vpp";

    if (!File.Exists(path))
    {
        MessageBox.Show("找不到 VPP 文件：" + path);
        return;
    }

    ctb = CogSerializer.LoadObjectFromFile(path)
        as CogToolBlock;

    if (ctb == null)
    {
        MessageBox.Show("VPP 加载失败");
        return;
    }

    cogToolBlockEditV21.Subject = ctb;
}
```

程序目录建议整理成：

```text
Debug
├─ 素材
│  ├─ 硬币图片1.jpg
│  ├─ 硬币图片2.jpg
│  └─ 硬币图片3.jpg
└─ Vpp
   └─ 硬币.vpp
```

## 五、运行检测、读取数量和计算金额

检测按钮需要完成四件事：传入当前图片、运行 ToolBlock、读取三个输出、更新 Label。

```csharp
private void Check_Click(object sender, EventArgs e)
{
    if (ctb == null)
    {
        MessageBox.Show("请先加载 VPP 文件");
        return;
    }

    if (cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先加载图片");
        return;
    }

    ctb.Inputs["Image"].Value =
        cogRecordDisplay1.Image;

    ctb.Run();

    double oneYuan = Convert.ToDouble(
        ctb.Outputs["一元"].Value);
    double fiveJiao = Convert.ToDouble(
        ctb.Outputs["五角"].Value);
    double oneJiao = Convert.ToDouble(
        ctb.Outputs["一角"].Value);

    double money =
        oneYuan + fiveJiao * 0.5 + oneJiao * 0.1;

    label1.Text = "一元数量：" + oneYuan;
    label2.Text = "五角数量：" + fiveJiao;
    label3.Text = "一角数量：" + oneJiao;
    label4.Text = "总金额：" + money.ToString("F1");
}
```

如果你在 VPP 中使用的是英文输出名，代码对应改成：

```csharp
ctb.Outputs["OneYuan"].Value
ctb.Outputs["FiveJiao"].Value
ctb.Outputs["OneJiao"].Value
```

计算公式是：

```text
总金额 = 一元数量 × 1.0
       + 五角数量 × 0.5
       + 一角数量 × 0.1
```

## 六、显示带检测框的运行结果

原图和检测结果图分别放到两个 `CogRecordDisplay` 中。关键顺序是：先给第二个显示控件复制原图，再把 ToolBlock 的运行记录赋给 `Record`，最后 `Fit()`。

```csharp
cogRecordDisplay2.Image = cogRecordDisplay1.Image;

// 课堂代码使用当前运行记录。
// 某些 VisionPro 版本也提供 CreateLastRunRecord()，
// 以本机 SDK 中实际存在的方法为准。
cogRecordDisplay2.Record = ctb.CreateCurrentRecord();

cogRecordDisplay2.Fit();
cogRecordDisplay2.Invalidate();
```

运行记录中包含 PMAlign 画出的匹配框、中心点和结果图形。只设置 `Image` 只能看到原图，只有把 `Record` 也赋值后，第二个显示控件才会显示运行后的图形。

![[5_System/Attachments/video-20260910-am/课堂1560.jpg]]

## 七、容易出错的地方

| 现象 | 常见原因 | 检查方式 |
|---|---|---|
| `VPP` 打不开 | 把 ToolBlock VPP 当成完整项目 VPP | 在正确的 ToolBlock 或 Job Editor 中打开 |
| 输出取不到 | 输出端名称和代码字符串不一致 | 对照 `ctb.Outputs` 中的名称 |
| 检测没有结果 | 没有给 ToolBlock 输入图像 | 检查 `ctb.Inputs["Image"].Value` |
| 点击检测报错 | 还没有加载 VPP 或图片 | 按“切换图片 → 加载 VPP → 检测目标”运行 |
| 结果图没有框 | 只设置了 `Image`，没有设置 `Record` | 复制原图后再赋运行记录 |
| 程序找不到素材 | 运行目录没有 `素材`、`Vpp` 文件夹 | 检查 `Directory.GetCurrentDirectory()` 实际路径 |
| 硬币数量混淆 | 默认 `Readout Counter` 名称太相似 | 用一元、五角、一角或英文业务名重命名 |

## 八、课堂资料

- 原始转录：[[5_System/Attachments/video-20260910-am/转录原文.txt]]
- 原始字幕：[[5_System/Attachments/video-20260910-am/原始字幕.srt]]
- 课堂画面总览：[[5_System/Attachments/video-20260910-am/contact.jpg]]
- 运行结果画面：[[5_System/Attachments/video-20260910-am/课堂1560.jpg]]
- 代码画面：[[5_System/Attachments/video-20260910-am/课堂900.jpg]]、[[5_System/Attachments/video-20260910-am/课堂1080.jpg]]

## 关联笔记

- [[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|C# VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]：WinForms 控件、图片读取和 `CogRecordDisplay` 基础。
- [[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|C# VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]：ToolBlock VPP 加载、输入输出端口和结果数量读取。
- [[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|C# VisionPro 多模板匹配与标定板工具（9.7上午）]]：多模板匹配和多目标结果处理。
- [[CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）|C# VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）]]：结果图形、Blob 统计和缺陷标注。

> 本节结论：把多个 PMAlign 放进一个 ToolBlock 后，重点不在于重新发明检测流程，而在于给每个工具设置清晰的输入输出名称，再由 C# 统一读取和显示。这样换图片、换硬币数量、换界面布局，都不会破坏核心检测逻辑。
