---
title: "C# VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）"
category: 'VisionPro联合编程'
date: "2026-09-11"
processed_date: "2026-09-15"
tags: [机器视觉, CSharp, VisionPro, WinForms, 联合编程, CogToolBlock, CogColorSegmenterTool, CogBlobTool, Blob, Process, 文件打开, 缺陷检测, 药板检测]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.11上午.mp4'
duration: "00:35:25"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；Process打开文件夹/CSV、颜色分割、Blob结果获取、面积分类、合格不合格与漏装统计按课堂逻辑整理，未在VisionPro中重新编译运行"
transcript: "5_System/Attachments/video-20260911-am/转录原文.txt"
aliases: [9.11上午视频笔记, 药板缺陷统计, Blob联合编程, VisionPro脚本获取工具]
related: ["[[CSharp VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）|CSharp VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）]]", "[[CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）|CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）]]", "[[CSharp VisionPro Blob脚本与胶囊检测（9.1上午）|CSharp VisionPro Blob脚本与胶囊检测（9.1上午）]]", "[[CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）|CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）]]", "[[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]"]
---

# C# VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）

本节先演示 C# 如何直接打开素材文件夹和检测结果 CSV，然后进入一个更复杂的联合编程案例：检测一板胶囊药品中的合格、 不合格和漏装数量。

检测逻辑放在 VisionPro 的 `CogToolBlock` 中，统计逻辑放在 C# 中：

```text
CogColorSegmenterTool1：按颜色分割胶囊目标
                 ↓
CogBlobTool1：提取每个胶囊的 Blob 结果
                 ↓
C# 获取 Blob 数量和每个 Blob 的 Area
                 ↓
Area > 3000：合格
Area ≤ 3000：不合格
Blob 总数不足 15：漏装
                 ↓
Label 显示合格、不合格、漏装数量
```

课堂素材以一板 15 个胶囊为预期数量。`3000` 是本节素材下的示例面积阈值，换相机、分辨率、ROI 或产品后必须重新标定，不能直接当成通用标准。

## 一、用 Process 打开素材文件夹

如果想通过按钮打开程序运行目录下的 `素材` 文件夹，可以先拼出路径，再用 `Directory.Exists` 判断文件夹是否存在：

```csharp
using System.Diagnostics;
using System.IO;

private void OpenFolder_Click(object sender, EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() + "/素材";

    if (Directory.Exists(path))
    {
        Process.Start(path);
    }
    else
    {
        MessageBox.Show("该文件夹不存在！！");
    }
}
```

这里要区分两个判断：

```csharp
Directory.Exists(path); // 判断文件夹
File.Exists(path);      // 判断文件
```

在较新的 .NET 项目中，为了明确使用系统默认程序打开文件夹，也可以写成：

```csharp
Process.Start(new ProcessStartInfo
{
    FileName = path,
    UseShellExecute = true
});
```

课堂使用的是简短的 `Process.Start(path)`。如果当前项目提示找不到合适的重载，改用上面的 `ProcessStartInfo` 写法，并添加：

```csharp
using System.Diagnostics;
```

## 二、用 Process 打开结果 CSV

打开文件时仍然使用 `Process`，但要先用 `File.Exists` 判断目标文件：

```csharp
private void OpenCsv_Click(object sender, EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() + "/结果.csv";

    if (File.Exists(path))
    {
        Process.Start(new ProcessStartInfo
        {
            FileName = path,
            UseShellExecute = true
        });
    }
    else
    {
        MessageBox.Show("该文件不存在！！");
    }
}
```

`UseShellExecute = true` 表示交给 Windows Shell 处理。系统会按照 `.csv` 的默认关联程序打开它，通常是 Excel 或记事本。

## 三、在 VisionPro 中制作药板 ToolBlock

### 1. 颜色分割胶囊

本节使用 `CogColorSegmenterTool1` 对药板图像进行颜色分割。先把输入图像传入颜色分割工具，再设置目标颜色区域，使胶囊从背景中分离出来。

课堂画面中可以看到颜色分割结果：正常胶囊和异常胶囊都被提取成白色区域，空的药槽不产生目标。

### 2. 用 Blob 提取每个目标

将 `CogColorSegmenterTool1` 的结果连接给 `CogBlobTool1`：

```text
CogColorSegmenterTool1.Result
        ↓
CogBlobTool1.InputImage
```

`CogBlobTool1` 的结果中包含：

| 结果 | 用途 |
|---|---|
| `GetBlobs().Count` | 当前检测到的胶囊数量 |
| `GetBlobs()[i].Area` | 第 `i` 个胶囊的面积 |
| `GetBlobs()[i].CenterOfMassX` | 第 `i` 个 Blob 的重心 X 坐标 |
| `GetBlobs()[i].CenterOfMassY` | 第 `i` 个 Blob 的重心 Y 坐标 |

本节不把每一个 Blob 的面积、坐标都连接成 ToolBlock 输出。因为 Blob 数量会变化，输出端数量不好固定；更适合在 C# 中获取 `CogBlobTool`，再通过循环读取所有结果。

### 3. 保存 ToolBlock

课堂中把药板检测 ToolBlock 保存为类似下面的文件：

```text
Vpp/胶囊药品.vpp
```

保存后由 C# 使用 `CogSerializer.LoadObjectFromFile` 加载。VPP 中保留图像输入端，运行时由 C# 把 `CogRecordDisplay` 中的当前图像传进去。

## 四、WinForms 界面和基础代码

界面仍然沿用前几节的结构：使用 `TableLayoutPanel` 分区域，放置两个 `CogRecordDisplay`、一个 `CogToolBlockEditV2`、按钮和 Label。

程序先从 `素材` 文件夹切换图片：

```csharp
private int num1 = 0;

private void Next_Click(object sender, EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() + "/素材";

    string[] names =
    {
        "*.bmp",
        "*.png",
        "*.jpg"
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

    if (num1 >= pictures.Count)
    {
        num1 = 0;
    }

    CogImageFileTool cift = new CogImageFileTool();
    cift.Operator.Open(
        pictures[num1],
        CogImageFileModeConstants.Read);
    cift.Run();

    cogRecordDisplay1.Image = cift.OutputImage;
    cogRecordDisplay1.Fit();

    num1++;
}
```

加载 VPP：

```csharp
private CogToolBlock ctb = new CogToolBlock();

private void Load_Click(object sender, EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() +
        "/Vpp/胶囊药品.vpp";

    ctb = CogSerializer.LoadObjectFromFile(path)
        as CogToolBlock;

    cogToolBlockEditV21.Subject = ctb;
}
```

## 五、运行 ToolBlock 并获取内部 Blob 工具

检测按钮先传图、运行 ToolBlock，再从 `ctb.Tools` 中查找名为 `CogBlobTool1` 的工具：

```csharp
private void Check_Click(object sender, EventArgs e)
{
    if (ctb == null || cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先加载图片和 VPP");
        return;
    }

    ctb.Inputs["OutputImage"].Value =
        cogRecordDisplay1.Image;
    ctb.Run();

    if (ctb.Tools.Contains("CogBlobTool1") &&
        ctb.Tools["CogBlobTool1"] is CogBlobTool blob1)
    {
        // 在这里读取 blob1.Results 并进行统计
    }
}
```

这里用了两个判断：

```csharp
ctb.Tools.Contains("CogBlobTool1")
```

确认 ToolBlock 中确实有这个名字的工具；

```csharp
ctb.Tools["CogBlobTool1"] is CogBlobTool blob1
```

确认取出来的对象确实是 `CogBlobTool`。只判断名字还不够，因为后续有人可能把工具类型换掉但保留了原名字。

这种写法等价于“获取对象、检查类型、生成一个可用的小名”三个动作。只有判断通过后，`blob1` 才能安全地访问 Blob 的结果。

如果项目没有识别 `CogBlobTool`，检查是否引用并导入 Blob 程序集：

```csharp
using Cognex.VisionPro.Blob;
```

## 六、遍历 Blob，按面积统计合格与不合格

得到 `blob1` 后，先取出当前 Blob 总数，再逐个读取面积：

```csharp
int c1 = blob1.Results.GetBlobs().Count;

int hege = 0;
int buhege = 0;

for (int i = 0; i < c1; i++)
{
    double area =
        blob1.Results.GetBlobs()[i].Area;

    if (area > 3000)
    {
        hege = hege + 1;
    }
    else
    {
        buhege = buhege + 1;
    }
}

label1.Text = "合格：" + hege;
label2.Text = "不合格：" + buhege;
```

课堂语音说的是“大于等于 3000”，截图中的代码显示为 `area > 3000`。如果面积刚好等于 3000 时也应该判为合格，就把条件改为：

```csharp
if (area >= 3000)
```

这个边界必须和项目验收标准保持一致。

## 七、计算漏装数量

一板药品预期有 15 个胶囊。Blob 数量少于 15 时，可以用预期数量减去实际数量：

```csharp
if (c1 == 15)
{
    label3.Text = "漏装：0";
}
else
{
    int res = 15 - c1;
    label3.Text = "漏装：" + res;
}
```

也可以写成更稳妥的形式，防止数量异常大于预期时显示负数：

```csharp
int expected = 15;
int missing = expected - c1;

if (missing < 0)
{
    missing = 0;
}

label3.Text = "漏装：" + missing;
```

完整的 ToolBlock 内部结果统计可以整理为：

```csharp
if (ctb.Tools.Contains("CogBlobTool1") &&
    ctb.Tools["CogBlobTool1"] is CogBlobTool blob1)
{
    int count = blob1.Results.GetBlobs().Count;
    int qualified = 0;
    int unqualified = 0;

    for (int i = 0; i < count; i++)
    {
        double area =
            blob1.Results.GetBlobs()[i].Area;

        if (area >= 3000)
        {
            qualified++;
        }
        else
        {
            unqualified++;
        }
    }

    int missing = 15 - count;
    if (missing < 0)
    {
        missing = 0;
    }

    label1.Text = "合格：" + qualified;
    label2.Text = "不合格：" + unqualified;
    label3.Text = "漏装：" + missing;
}
```

## 八、这个案例为什么适合在 C# 中写脚本

如果把每个 Blob 的面积、坐标和分类结果都做成 ToolBlock 输出，Blob 数量变化时输出端会变得不方便维护。将 `CogBlobTool` 保留在 ToolBlock 内部，再由 C# 获取工具并循环处理，适合这种“结果数量不固定、需要业务统计”的情况。

需要记住的结构是：

```text
ctb.Tools
    ↓ 按名称查找
CogBlobTool
    ↓ 访问 Results
GetBlobs()
    ↓ 循环
Area、CenterOfMassX、CenterOfMassY
    ↓ 业务判断
Label、CSV、数据库或报警信号
```

这也是“联合编程中写脚本”的核心方法：VisionPro 负责稳定的图像处理，C# 负责流程控制、结果分类、界面显示和文件操作。

## 九、容易出错的地方

| 现象 | 常见原因 | 检查方式 |
|---|---|---|
| 文件夹打不开 | 路径不存在或未引用 `System.Diagnostics` | 检查 `Directory.Exists(path)` 和 `using` |
| CSV 打不开 | 文件还没有生成 | 先判断 `File.Exists(path)` |
| `Process.Start(path)` 报重载错误 | 当前 .NET 版本要求显式 Shell | 改用 `ProcessStartInfo` 和 `UseShellExecute = true` |
| ToolBlock 运行报输入错误 | VPP 输入名不是 `OutputImage` | 对照 `ctb.Inputs` 中的实际名称 |
| `CogBlobTool` 识别不了 | 缺少 Blob 引用或 using | 添加 `Cognex.VisionPro.Blob` 引用 |
| 工具取出来是空的 | ToolBlock 中工具名不叫 `CogBlobTool1` | 检查工具树中的真实名称 |
| 类型转换失败 | 同名工具不是 `CogBlobTool` | 使用 `is CogBlobTool blob1` 做类型判断 |
| 合格数和不合格数不对 | 面积阈值不适合当前图像 | 先查看 Blob 面积，再重新定阈值 |
| 漏装显示负数 | 实际 Blob 数大于预期数量 | 对 `15 - count` 做下限保护 |
| 重复点击后数量异常 | 计数器没有每次检测前清零 | 把 `qualified`、`unqualified` 放在本次检测内部初始化 |

## 十、课堂画面与原始资料

- 原始转录：[[5_System/Attachments/video-20260911-am/转录原文.txt]]
- 原始字幕：[[5_System/Attachments/video-20260911-am/原始字幕.srt]]
- 课堂画面总览：[[5_System/Attachments/video-20260911-am/contact.jpg]]
- `Process` 打开文件夹：[[5_System/Attachments/video-20260911-am/课堂代码-Process打开文件夹.jpg]]
- `Process` 打开 CSV：[[5_System/Attachments/video-20260911-am/课堂代码-Process打开CSV.jpg]]
- ToolBlock 中的颜色分割与 Blob：[[5_System/Attachments/video-20260911-am/课堂代码-ToolBlock与Blob.jpg]]
- 判断工具名称和类型：[[5_System/Attachments/video-20260911-am/课堂代码-判断工具类型.jpg]]
- 遍历 Blob 面积：[[5_System/Attachments/video-20260911-am/课堂代码-遍历Blob面积.jpg]]
- 合格、不合格、漏装统计：[[5_System/Attachments/video-20260911-am/课堂代码-合格不合格漏装.jpg]]

## 关联笔记

- [[CSharp VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）|C# VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）]]：ToolBlock 多模板匹配、输出结果和 C# 联合编程基础。
- [[CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）|C# VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）]]：检测结果保存为 CSV，以及用 `StreamReader` 读取。
- [[CSharp VisionPro Blob脚本与胶囊检测（9.1上午）|C# VisionPro Blob脚本与胶囊检测（9.1上午）]]：Blob 数量、面积、去噪和胶囊目标分类基础。
- [[CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）|C# VisionPro Blob脚本与胶囊豆类识别（9.1下午）]]：Blob 重心坐标、面积阈值和图形标注。
- [[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|C# VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]：加载 VPP、传入图像、运行 ToolBlock 和读取输出。

> 本节结论：当 Blob 数量和结果字段会变化时，不要把每个结果硬连成固定输出。先在 C# 中通过 `ctb.Tools.Contains(...)` 找到工具，再用 `is CogBlobTool blob1` 确认类型，最后循环读取 `Area`，就能把视觉结果变成合格、不合格和漏装等业务数据。
