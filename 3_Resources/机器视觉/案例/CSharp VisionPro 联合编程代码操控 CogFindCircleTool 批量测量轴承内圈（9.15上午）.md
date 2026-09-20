---
title: "C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）"
category: 'VisionPro联合编程'
date: "2026-09-15"
processed_date: "2026-09-16"
tags: [机器视觉, CSharp, VisionPro, WinForms, 联合编程, CogToolBlock, CogPMAlignTool, CogFindCircleTool, CogGraphicLabel, 卡尺, 找圆, 半径测量, 轴承检测, MenuStrip, TableLayoutPanel]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.15上午.mp4'
duration: "00:43:43.60"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；ToolBlock准备、MenuStrip界面、PMAlign多目标定位、代码移动CogFindCircleTool测量轴承内圈、结果标注、平均半径和异常处理按课堂逻辑整理，未在VisionPro中重新编译运行"
transcript: "5_System/Attachments/video-20260915-am/转录原文.txt"
aliases: [9.15上午视频笔记, VisionPro批量测量轴承内圈, CogFindCircleTool联合编程, 代码操控测量工具]
related: ["[[CSharp VisionPro 联合编程两日笔记整理：Blob统计、结果标注与批量测量（9.11—9.15）|CSharp VisionPro 联合编程两日笔记整理：Blob统计、结果标注与批量测量（9.11—9.15）]]", "[[CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）|CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）]]", "[[CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）|CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）]]", "[[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]", "[[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]"]
---

# C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）

本节进入“代码操控 VisionPro 工具”的联合编程案例：一张图中有多个工件，每个工件中心都有一个轴承。程序先用 CogPMAlignTool 找出每个工件的位置，再把同一个 CogFindCircleTool 移到每个位置，逐个测量轴承内圈，最后在图像上标注每个结果，并显示工件数量和平均半径。

课堂视频窗口标题为“第九节代码操控工具测量的联合编程”。画面中的工件类似齿轮箱/轴承座，因此本文统一称为“工件”，不把它误写成齿轮本体。

## 一、整体检测逻辑

~~~text
导入包含多个工件的图片
        ↓
CogPMAlignTool1：匹配每个工件，得到多个 Pose
        ↓
读取每个结果的 TranslationX / TranslationY
        ↓
把 CogFindCircleTool1 的圆心移动到当前工件轴承中心
        ↓
运行 CogFindCircleTool1，得到当前圆的 Radius
        ↓
CogGraphicLabel 标注每个半径
        ↓
统计工件数量，计算平均半径
~~~

关键思想是“定位工具”和“测量工具”分工：

- CogPMAlignTool1 负责告诉程序每个工件在哪里。
- CogFindCircleTool1 负责在当前位置测圆。
- C# 循环负责把测量工具移动到每一个工件。

这比在 VPP 中为每一个工件放一个固定的找圆工具更灵活，工件数量变化时也可以由代码遍历结果。

## 二、准备 ToolBlock

### 1. ToolBlock 中放入两个工具

本节的基础 VPP 只需要两个主要工具：

~~~text
CogPMAlignTool1
    作用：匹配所有工件，输出多个匹配结果

CogFindCircleTool1
    作用：根据代码提供的圆心，测量当前工件的轴承内圈
~~~

给 ToolBlock 暴露一个 OutputImage 输入，用 C# 将 cogRecordDisplay1.Image 推给它。CogPMAlignTool1 要设置为能够找到多个目标，并检查运行后是否能把图中的所有工件匹配出来。

### 2. 预先设置找圆工具

CogFindCircleTool1 可以在 VPP 中先设置一部分固定参数，代码运行时只修改每个目标都不同的圆心：

- 圆心：后面由 CenterX、CenterY 动态设置。
- 预计圆半径：按照轴承内圈的大致尺寸设置。
- 搜索方向：本节画面使用向外搜索。
- 卡尺数量：课堂设置为 30 个。
- 忽略点数：课堂演示设置为 3；界面中也演示了忽略点数参数。
- 卡尺搜索长度、投影长度：先在 VPP 中调到能稳定扫到内圈的位置。
- 边缘极性：根据图像中由暗到亮或由亮到暗的边缘选择。

这些固定参数可以在 VPP 中设置好，减少联合编程代码；如果产品规格会变化，也可以全部放到 C# 中动态设置。

### 3. 保存 VPP

课堂中将准备好的 ToolBlock 保存为 工件.vpp。保存前应确认工具配置已经完成，并按项目习惯决定是否清除图像和运行结果。C# 中再使用 CogSerializer.LoadObjectFromFile 加载：

~~~csharp
string path = Directory.GetCurrentDirectory()
    + "/VPP/工件.vpp";

ctb = CogSerializer.LoadObjectFromFile(path)
    as CogToolBlock;

cogToolBlockEditV21.Subject = ctb;
~~~

## 三、WinForms 界面布局

### 1. 使用 TableLayoutPanel

课堂界面使用 TableLayoutPanel 将窗口分成两列三行：

~~~text
第 1 行：MenuStrip，横跨两列
第 2 行：原图 CogRecordDisplay + 结果 CogRecordDisplay
第 3 行：操作按钮/ToolBlock 编辑区域 + 结果文字
~~~

MenuStrip 放在第一行后，将 ColumnSpan 设置为 2，让菜单栏横跨整个窗口顶部。由于它占用了第一行，TableLayoutPanel 需要增加一行，再把显示区和操作区放到第二、第三行。

控件可以设置为 Dock = Fill，使两个显示区和操作区随窗体大小调整。

### 2. 使用 MenuStrip 放置操作入口

本节把导入图片、加载 VPP 等操作放到顶部菜单栏。菜单栏适合放置文件类操作，检测按钮仍可以保留在操作区：

~~~text
MenuStrip
├─ 导入图片
├─ 加载 VPP
└─ 其他文件或项目操作

操作区
└─ 检测目标
~~~

### 3. 结果显示内容

本节结果区至少显示：

~~~text
工件数量：5
平均半径：xx.xx
~~~

每个工件的半径则直接写到结果图中的对应位置。

## 四、加载 VPP 并先运行一次

检测按钮的前半段先把 ToolBlock 激活：

~~~csharp
private CogToolBlock ctb = new CogToolBlock();

private void Check_Click(object sender, EventArgs e)
{
    ctb.Inputs["OutputImage"].Value =
        cogRecordDisplay1.Image;

    // 先让 VPP 整体运行一次，激活其中的工具和结果
    ctb.Run();

    cogRecordDisplay2.Image =
        cogRecordDisplay1.Image;
    cogRecordDisplay2.Fit();
}
~~~

之后再从 ctb.Tools 中取出 CogPMAlignTool1 和 CogFindCircleTool1，由代码单独控制找圆工具。先运行一次的目的，是让 VPP 中的工具和输入关系准备好，不代表后面只测一个目标。

## 五、从 ToolBlock 中获取工具

### 1. 获取 PMAlign 工具

使用工具名称和类型双重判断，避免 VPP 中工具不存在或类型不匹配：

~~~csharp
if (ctb.Tools.Contains("CogPMAlignTool1") &&
    ctb.Tools["CogPMAlignTool1"] is CogPMAlignTool pma1)
{
    // pma1 就是 ToolBlock 中的模板匹配工具
}
~~~

如果 Visual Studio 提示找不到 CogPMAlignTool，检查项目引用并添加 PMAlign 对应程序集，然后加入对应的 using：

~~~csharp
using Cognex.VisionPro.PMAlign;
~~~

### 2. 获取 FindCircle 工具

在 PMAlign 工具判断内部继续获取找圆工具：

~~~csharp
if (ctb.Tools.Contains("CogFindCircleTool1") &&
    ctb.Tools["CogFindCircleTool1"] is CogFindCircleTool fct1)
{
    // fct1 就是 ToolBlock 中的找圆工具
}
~~~

如果找不到 CogFindCircleTool，要添加卡尺程序集引用，而不是只添加 PMAlign 程序集：

~~~csharp
using Cognex.VisionPro.Caliper;
~~~

课堂中通过 Visual Studio 的“添加引用”窗口进入 VisionPro 的 ReferencedAssemblies，添加了 Cognex.VisionPro.Caliper.dll。不同 VisionPro 安装位置可能不同，要以本机安装目录为准。

## 六、循环移动找圆工具并测量

### 1. 读取每个匹配结果的坐标

pma1.Results.Count 是匹配到的工件数量。每个结果的位姿中，TranslationX、TranslationY 是工件中心在当前图像坐标系中的位置：

~~~csharp
for (int i = 0; i < pma1.Results.Count; i++)
{
    double x1 = pma1.Results[i]
        .GetPose().TranslationX;
    double y1 = pma1.Results[i]
        .GetPose().TranslationY;

    // x1、y1 就是当前工件轴承中心的目标位置
}
~~~

模板训练位置要尽量落在轴承内圈附近，这样匹配结果的中心点才方便直接作为找圆工具的圆心。如果模板原点与轴承中心有偏移，就需要用坐标变换或固定偏移量修正，而不能直接把模板中心当成圆心。

### 2. 修改 ExpectedCircularArc 的圆心

CogFindCircleTool 的圆形预期区域位于 RunParams.ExpectedCircularArc 下：

~~~csharp
fct1.RunParams.ExpectedCircularArc.CenterX = x1;
fct1.RunParams.ExpectedCircularArc.CenterY = y1;
fct1.Run();
~~~

这三句是本案例最关键的代码：每次循环先把找圆工具的圆心移到当前 PMAlign 结果，再运行一次找圆。

### 3. 由结果获取半径

找圆成功后，使用 Results.GetCircle().Radius 取得半径：

~~~csharp
double radius = fct1.Results.GetCircle().Radius;
~~~

课堂代码累加每个结果的半径：

~~~csharp
double total = 0;

for (int i = 0; i < pma1.Results.Count; i++)
{
    double x1 = pma1.Results[i].GetPose().TranslationX;
    double y1 = pma1.Results[i].GetPose().TranslationY;

    fct1.RunParams.ExpectedCircularArc.CenterX = x1;
    fct1.RunParams.ExpectedCircularArc.CenterY = y1;
    fct1.Run();

    double radius = fct1.Results.GetCircle().Radius;
    total = total + radius;
}

double averageRadius = total / pma1.Results.Count;
~~~

注意：代码取得的是 Radius，所以显示“平均半径”是准确的。如果项目要求的是轴承内径，内径应换算为：

~~~csharp
double diameter = radius * 2;
~~~

不要把半径数值直接标成内径。

## 七、在结果图上标注每个半径

沿用前面课程的 CogGraphicLabel：标签坐标使用当前 PMAlign 结果的 x1、y1，文本使用找圆结果的半径：

~~~csharp
CogGraphicLabel label = new CogGraphicLabel();

label.Text = fct1.Results.GetCircle()
    .Radius.ToString("F2");
label.X = x1;
label.Y = y1;
label.Font = new Font("宋体", 20);
label.Color = CogColorConstants.Green;

cogRecordDisplay2.StaticGraphics.Add(label, "");
cogRecordDisplay2.Invalidate();
~~~

这里的 F2 表示保留两位小数。StaticGraphics.Add 把文字加入结果图，Invalidate 让显示控件刷新。

为了让画面稳定，实际项目中建议先设置 Record，再添加标签；如果每次检测都要覆盖上一轮结果，可以在本轮开始前清理旧图形：

~~~csharp
cogRecordDisplay2.StaticGraphics.Clear();
cogRecordDisplay2.Record = ctb.CreateCurrentRecord();
~~~

然后再进入循环添加新的标签。

## 八、显示工件数量和平均半径

数量直接取 PMAlign 结果数量：

~~~csharp
label1.Text = "工件数量：" + pma1.Results.Count;
~~~

平均值使用总半径除以结果数量：

~~~csharp
double averageRadius = total / pma1.Results.Count;
label2.Text = "平均半径：" +
    averageRadius.ToString("F2");
~~~

课堂代码的平均值逻辑是：在循环外声明 total，每次把当前半径加进去，循环结束后再除以 pma1.Results.Count。

如果允许某些工件找圆失败，工程代码不要直接除以 PMAlign 的总数量，而应只除以成功测量的数量：

~~~csharp
double total = 0;
int validCount = 0;

for (int i = 0; i < pma1.Results.Count; i++)
{
    double x1 = pma1.Results[i].GetPose().TranslationX;
    double y1 = pma1.Results[i].GetPose().TranslationY;

    fct1.RunParams.ExpectedCircularArc.CenterX = x1;
    fct1.RunParams.ExpectedCircularArc.CenterY = y1;
    fct1.Run();

    if (fct1.RunStatus.Result != CogToolResultConstants.Accept)
    {
        continue;
    }

    double radius = fct1.Results.GetCircle().Radius;
    total = total + radius;
    validCount = validCount + 1;
}

if (validCount > 0)
{
    label2.Text = "平均半径：" +
        (total / validCount).ToString("F2");
}
else
{
    label2.Text = "平均半径：无有效结果";
}
~~~

CogToolResultConstants.Accept 的命名或结果判断方式可能随 VisionPro 版本略有差异，以当前版本 IntelliSense 为准。核心原则是：找圆没有成功时，不要直接读取 GetCircle().Radius。

## 九、把卡尺参数放到代码中控制

如果不想在 VPP 中预先固定参数，也可以通过 RunParams 操控找圆卡尺。课堂后半段演示了这些常用属性：

~~~csharp
// 起始角度
fct1.RunParams.ExpectedCircularArc.AngleStart = 0;

// 角度范围：示例使用 360 度，实际按目标弧段设置
fct1.RunParams.ExpectedCircularArc.AngleSpan = 360;

// 预计圆半径：示例值，按图像比例调整
fct1.RunParams.ExpectedCircularArc.Radius = 10;

// 边缘极性：DarkToLight / LightToDark 要按图像选择
fct1.RunParams.CaliperRunParams.Edge0Polarity =
    CogCaliperPolarityConstants.DarkToLight;

// 卡尺数量
fct1.RunParams.NumCalipers = 30;

// 忽略的卡尺点数量
fct1.RunParams.NumToIgnore = 3;

// 卡尺搜索长度和投影长度
fct1.RunParams.CaliperSearchLength = 15;
fct1.RunParams.CaliperProjectionLength = 10;
~~~

上面是按课堂代码和界面演示整理的示例。AngleSpan、Radius、极性、搜索长度和投影长度不能机械照抄：目标大小、边缘方向、图像对比度变化后，需要重新调参。课堂画面中 AngleSpan 曾处于编辑状态，实际项目应在 VPP 里确认有效角度范围，不能把 0 当作通用设置。

## 十、两个常见问题

### 1. 结果图上出现一个多余的圆

现象：前几张图正常，第六张或某些图上出现一个不属于工件的圆。

原因是：点击检测时先执行了 ctb.Run()，ToolBlock 中的 CogFindCircleTool1 会按照 VPP 里保存的默认圆心自动运行一次。这个默认圆心没有随着 PMAlign 结果移动，所以它可能在第一张图的旧位置留下一个圆形结果。

解决方式：

- 把 VPP 中找圆工具的默认位置放到图像左上角等不会检测到目标的位置。
- 或者确认结果显示流程，只把后续代码移动并运行后的有效结果加入显示。
- 这个默认圆通常不影响后面五个工件的测量，但会干扰结果图时应处理掉。

### 2. 读取 Radius 时出现 NullReferenceException

现象：运行到下面这句时出错：

~~~csharp
double radius = fct1.Results.GetCircle().Radius;
~~~

原因是当前工件没有找到圆，GetCircle 没有有效结果，却继续读取 Radius。可能原因包括：

- 找圆工具本次运行失败。
- 圆心没有移动到正确的轴承位置。
- 卡尺半径、搜索长度、投影长度设置不合适。
- 边缘极性选择错误。
- 卡尺数量或忽略点数设置不适合当前图像。

处理顺序：

~~~text
先检查找圆工具是否运行成功
        ↓
再检查预计圆心是否正确
        ↓
检查卡尺是否覆盖内圈边缘
        ↓
检查极性、搜索长度、投影长度和忽略点数
        ↓
确认成功后再读取 GetCircle().Radius
~~~

不要用“捕获异常后继续累加”代替工具参数调整。检测失败本身应该被记录或标记出来。

## 十一、可复用的检测按钮骨架

下面是按照本节逻辑整理的完整骨架。工具名称必须和 VPP 中的实际名称一致：

~~~csharp
private void Check_Click(object sender, EventArgs e)
{
    if (cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先导入图片");
        return;
    }

    ctb.Inputs["OutputImage"].Value =
        cogRecordDisplay1.Image;
    ctb.Run();

    cogRecordDisplay2.Image =
        cogRecordDisplay1.Image;
    cogRecordDisplay2.Fit();
    cogRecordDisplay2.Record =
        ctb.CreateCurrentRecord();
    cogRecordDisplay2.StaticGraphics.Clear();

    if (ctb.Tools.Contains("CogPMAlignTool1") &&
        ctb.Tools["CogPMAlignTool1"] is CogPMAlignTool pma1 &&
        ctb.Tools.Contains("CogFindCircleTool1") &&
        ctb.Tools["CogFindCircleTool1"] is CogFindCircleTool fct1)
    {
        double total = 0;
        int validCount = 0;

        for (int i = 0; i < pma1.Results.Count; i++)
        {
            double x1 = pma1.Results[i]
                .GetPose().TranslationX;
            double y1 = pma1.Results[i]
                .GetPose().TranslationY;

            fct1.RunParams.ExpectedCircularArc.CenterX = x1;
            fct1.RunParams.ExpectedCircularArc.CenterY = y1;
            fct1.Run();

            if (fct1.RunStatus.Result !=
                CogToolResultConstants.Accept)
            {
                continue;
            }

            double radius =
                fct1.Results.GetCircle().Radius;
            total = total + radius;
            validCount = validCount + 1;

            CogGraphicLabel label =
                new CogGraphicLabel();
            label.Text = radius.ToString("F2");
            label.X = x1;
            label.Y = y1;
            label.Font = new Font("宋体", 20);
            label.Color = CogColorConstants.Green;

            cogRecordDisplay2.StaticGraphics.Add(
                label, "");
        }

        label1.Text = "工件数量：" + pma1.Results.Count;

        if (validCount > 0)
        {
            label2.Text = "平均半径：" +
                (total / validCount).ToString("F2");
        }
        else
        {
            label2.Text = "平均半径：无有效结果";
        }

        cogRecordDisplay2.Invalidate();
    }
}
~~~

如果要显示内径，把 radius 改成 radius * 2 后再进行标注和平均值计算；如果要保留课堂原样，则使用半径和“平均半径”标签。

## 十二、课堂材料

- 原始转录：[[5_System/Attachments/video-20260915-am/转录原文.txt|转录原文]]
- 原始字幕：[[5_System/Attachments/video-20260915-am/原始字幕.srt|原始字幕]]
- 课堂画面总览：[[5_System/Attachments/video-20260915-am/contact-sheet.jpg|画面总览]]
- ToolBlock 工具树：[[5_System/Attachments/video-20260915-am/ToolBlock工具树.jpg|ToolBlock工具树]]
- 界面布局：[[5_System/Attachments/video-20260915-am/界面布局.jpg|界面布局]]
- 批量测量结果：[[5_System/Attachments/video-20260915-am/批量测量结果.jpg|批量测量结果]]
- CogFindCircleTool 设置：[[5_System/Attachments/video-20260915-am/CogFindCircleTool设置.jpg|CogFindCircleTool设置]]
- 联合编程核心代码：[[5_System/Attachments/video-20260915-am/联合编程核心代码.jpg|联合编程核心代码]]
- 卡尺参数代码：[[5_System/Attachments/video-20260915-am/卡尺参数代码.jpg|卡尺参数代码]]

## 收尾

本节最重要的不是把五个找圆工具复制五份，而是让 CogPMAlignTool 负责定位，让 C# 循环控制同一个 CogFindCircleTool 逐个测量。记住顺序：先运行并获取工具，读取每个 PMAlign 的坐标，移动 ExpectedCircularArc.CenterX/Y，运行找圆，确认结果有效后再读取 Radius，最后标注和统计。这样，VisionPro 的工具就不再是固定流程，而是能被代码按目标逐个操控的测量武器，好耶！
