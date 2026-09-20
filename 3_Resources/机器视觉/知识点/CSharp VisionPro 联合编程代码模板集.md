---
title: "C# VisionPro 联合编程代码模板集"
category: '代码模板'
tags: [机器视觉, CSharp, VisionPro, ToolBlock, 联合编程, 代码模板, Blob, PMAlign, FindCircle, PolarUnwrap, PatternInspect]
area: 机器视觉
status: budding
aliases: [VisionPro代码模板, C#视觉代码模板, VisionPro案例模板]
related: ["[[机器视觉知识地图]]", "[[CSharp VisionPro 工具总览（功能与介绍笔记）|CSharp VisionPro 工具总览（功能与介绍笔记）]]", "[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]"]
---

# C# VisionPro 联合编程代码模板集

这篇是根据课程笔记抽出来的“复制后改名字”的模板库，主要用于 C# WinForms + VisionPro ToolBlock。每个模板都保留课堂里的写法，并补上了判空、数量检查和重复运行清理。

先记住一件事：代码里的 项目.vpp、OutputImage、CogPMAlignTool1、CogBlobTool1、CogFindCircleTool1、Results_Count 和 CogImageConvertTool1.OutputImage 都只是示例名，必须和你自己的 VPP 终端、工具名、记录树路径完全一致。

## 复制前先准备

### 常用 using

按实际用到的工具添加引用。VisionPro 脚本编辑器里，先把工具配置好，再创建脚本，通常能自动带出程序集引用。

~~~csharp
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Text;
using System.Windows.Forms;

using Cognex.VisionPro;
using Cognex.VisionPro.Blob;
using Cognex.VisionPro.Caliper;
using Cognex.VisionPro.ImageFile;
using Cognex.VisionPro.PMAlign;
using Cognex.VisionPro.ToolBlock;
~~~

### 统一替换表

| 模板中的名字 | 你要替换成 |
|---|---|
| 项目.vpp | 实际 ToolBlock 文件 |
| OutputImage | ToolBlock 中接收图像的输入终端 |
| CogPMAlignTool1 | ToolBlock 中真实的模板匹配工具名 |
| CogBlobTool1 | ToolBlock 中真实的 Blob 工具名 |
| CogFindCircleTool1 | ToolBlock 中真实的找圆工具名 |
| CogImageConvertTool1.OutputImage | Last Run 中实际显示的图像记录路径 |
| expectedCount | 当前产品的正常数量 |
| minArea、minGap 等 | 用正常样本和缺陷样本重新统计的阈值 |

### 外部 WinForms 和 ToolBlock 脚本不是同一个位置

- 外部 WinForms：代码写在 Form1.cs 的按钮事件里，使用 ctb.Inputs、ctb.Outputs 和 cogRecordDisplay2。
- ToolBlock 高级脚本：代码写在 GroupRun、ModifyLastRunRecord 等自动生成的方法里，使用 mToolBlock.Tools、CogGraphicCollection 和 AddGraphicToRunRecord。

不要把两套代码的对象名混在一起：外部窗体一般叫 ctb，ToolBlock 脚本里一般叫 mToolBlock。

## 模板一：切换素材文件夹中的图片

适合 9.9 上午的图片切换案例。按钮每点一次读取下一张图片，读到末尾后回到第一张。

窗体成员变量：

~~~csharp
private int imageIndex = 0;
~~~

按钮事件：

~~~csharp
private void buttonNextImage_Click(object sender, EventArgs e)
{
    string folder = Path.Combine(Directory.GetCurrentDirectory(), "素材");

    if (!Directory.Exists(folder))
    {
        MessageBox.Show("找不到素材文件夹：" + folder);
        return;
    }

    string[] patterns = { "*.jpg", "*.jpeg", "*.png", "*.bmp" };
    List<string> pictures = new List<string>();

    foreach (string pattern in patterns)
    {
        string[] files = Directory.GetFiles(folder, pattern);
        pictures.AddRange(files);
    }

    if (pictures.Count == 0)
    {
        MessageBox.Show("素材文件夹中没有图片");
        return;
    }

    if (imageIndex >= pictures.Count)
    {
        imageIndex = 0;
    }

    CogImageFileTool imageTool = new CogImageFileTool();
    imageTool.Operator.Open(pictures[imageIndex], CogImageFileModeConstants.Read);
    imageTool.Run();

    cogRecordDisplay1.Image = imageTool.OutputImage;
    cogRecordDisplay1.Fit();
    cogRecordDisplay1.Invalidate();
    imageIndex++;
}
~~~

## 模板二：加载 VPP、传入图像、运行 ToolBlock

适合 9.9 下午以后所有 C# 外部调用案例。

窗体成员变量：

~~~csharp
private CogToolBlock ctb = new CogToolBlock();
~~~

加载按钮：

~~~csharp
private void buttonLoadVpp_Click(object sender, EventArgs e)
{
    string vppPath = Path.Combine(
        Directory.GetCurrentDirectory(), "Vpp", "项目.vpp");

    if (!File.Exists(vppPath))
    {
        MessageBox.Show("找不到 VPP：" + vppPath);
        return;
    }

    ctb = CogSerializer.LoadObjectFromFile(vppPath) as CogToolBlock;

    if (ctb == null)
    {
        MessageBox.Show("VPP 不是 CogToolBlock，或加载失败");
        return;
    }

    cogToolBlockEditV21.Subject = ctb;
    MessageBox.Show("VPP 加载完成");
}
~~~

运行按钮：

~~~csharp
private void buttonRun_Click(object sender, EventArgs e)
{
    if (ctb == null)
    {
        MessageBox.Show("请先加载 VPP");
        return;
    }

    if (cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先加载输入图像");
        return;
    }

    if (!ctb.Inputs.Contains("OutputImage"))
    {
        MessageBox.Show("VPP 中没有名为 OutputImage 的输入终端");
        return;
    }

    ctb.Inputs["OutputImage"].Value = cogRecordDisplay1.Image;
    ctb.Run();

    cogRecordDisplay2.Image = cogRecordDisplay1.Image;
    cogRecordDisplay2.Record = ctb.CreateCurrentRecord();
    cogRecordDisplay2.Fit();
    cogRecordDisplay2.Invalidate();
}
~~~

有些 VPP 的图像输入终端叫 Image、InputImage 或其他名字。出现“没有 OutputImage”时，先在 ToolBlock 的终端列表里核对。

## 模板三：安全获取 ToolBlock 内部工具

外部 WinForms 里可以先用这个通用方法，减少重复的 Contains 和类型判断。

~~~csharp
private bool TryGetTool<T>(
    CogToolBlock toolBlock,
    string toolName,
    out T tool) where T : class
{
    tool = null;

    if (toolBlock == null ||
        !toolBlock.Tools.Contains(toolName))
    {
        return false;
    }

    tool = toolBlock.Tools[toolName] as T;
    return tool != null;
}
~~~

使用：

~~~csharp
CogPMAlignTool pma1;
CogBlobTool blob1;

if (!TryGetTool(ctb, "CogPMAlignTool1", out pma1))
{
    MessageBox.Show("找不到 CogPMAlignTool1");
    return;
}

if (!TryGetTool(ctb, "CogBlobTool1", out blob1))
{
    MessageBox.Show("找不到 CogBlobTool1");
    return;
}
~~~

## 模板四：读取 PMAlign 结果数量和坐标

适合齿轮数量、硬币数量、轴承滚珠位置和引脚定位。

~~~csharp
CogPMAlignTool pma1;

if (!TryGetTool(ctb, "CogPMAlignTool1", out pma1))
{
    MessageBox.Show("找不到模板匹配工具");
    return;
}

int count = pma1.Results.Count;

for (int i = 0; i < count; i++)
{
    double x = pma1.Results[i].GetPose().TranslationX;
    double y = pma1.Results[i].GetPose().TranslationY;
    double rotation = pma1.Results[i].GetPose().Rotation;
    double angle = rotation * 180.0 / Math.PI;

    // 在这里使用 x、y、angle 做业务判断或移动测量工具
}
~~~

Results 的顺序通常是相似度顺序，不一定是从左到右。凡是要计算相邻距离的案例，先取坐标、排序，再计算。

## 模板五：Blob 数量、面积分类和漏装统计

适合胶囊、药板、豆类、引脚和 PatternInspect 的 Difference 结果。

~~~csharp
private void CountBlobs()
{
    CogBlobTool blob1;

    if (!TryGetTool(ctb, "CogBlobTool1", out blob1))
    {
        MessageBox.Show("找不到 Blob 工具");
        return;
    }

    var blobs = blob1.Results.GetBlobs();
    int totalCount = blobs.Count;
    int qualifiedCount = 0;
    int unqualifiedCount = 0;

    double minArea = 3000;       // 示例值，必须按当前素材调整
    int expectedCount = 15;      // 示例值，必须按当前产品调整

    for (int i = 0; i < totalCount; i++)
    {
        double area = blobs[i].Area;

        if (area >= minArea)
        {
            qualifiedCount++;
        }
        else
        {
            unqualifiedCount++;
        }
    }

    int missingCount = Math.Max(0, expectedCount - totalCount);

    labelQualified.Text = "合格：" + qualifiedCount;
    labelUnqualified.Text = "不合格：" + unqualifiedCount;
    labelMissing.Text = "漏装：" + missingCount;
}
~~~

如果漏装判断要排除小噪点，应使用有效 Blob 数量，而不是直接使用 totalCount。

## 模板六：Blob 逐个标文字和轮廓

适合 9.11 下午的标注案例。外部 WinForms 使用 StaticGraphics 时，先写入 Record，再清空旧图形，再添加新图形。

~~~csharp
private void ShowBlobGraphics()
{
    CogBlobTool blob1;

    if (!TryGetTool(ctb, "CogBlobTool1", out blob1))
    {
        MessageBox.Show("找不到 Blob 工具");
        return;
    }

    var blobs = blob1.Results.GetBlobs();

    cogRecordDisplay2.Image = cogRecordDisplay1.Image;
    cogRecordDisplay2.Record = ctb.CreateCurrentRecord();
    cogRecordDisplay2.StaticGraphics.Clear();

    double minArea = 3000;       // 示例阈值

    for (int i = 0; i < blobs.Count; i++)
    {
        var blob = blobs[i];

        CogGraphicLabel label = new CogGraphicLabel();
        label.X = blob.CenterOfMassX;
        label.Y = blob.CenterOfMassY;
        label.Font = new Font("楷体", 18);
        label.Color = blob.Area >= minArea
            ? CogColorConstants.Green
            : CogColorConstants.Red;
        label.Text = blob.Area >= minArea
            ? "合格"
            : "不合格";

        cogRecordDisplay2.StaticGraphics.Add(label, "");

        CogPolygon boundary = blob.GetBoundary();
        boundary.LineWidthInScreenPixels = 5;
        boundary.Color = label.Color;
        cogRecordDisplay2.StaticGraphics.Add(boundary, "");
    }

    cogRecordDisplay2.Fit();
    cogRecordDisplay2.Invalidate();
}
~~~

## 模板七：读取 IDB 多张图像

关键是 Open 只做一次，之后每次点击只调用 Run。否则常常会一直回到第一张图。

窗体成员变量：

~~~csharp
private CogImageFileTool idbTool = new CogImageFileTool();
private bool idbOpened = false;
~~~

打开 IDB：

~~~csharp
private void buttonOpenIdb_Click(object sender, EventArgs e)
{
    string idbPath = Path.Combine(
        Directory.GetCurrentDirectory(), "素材", "sample.idb");

    if (!File.Exists(idbPath))
    {
        MessageBox.Show("找不到 IDB：" + idbPath);
        return;
    }

    idbTool.Operator.Open(idbPath, CogImageFileModeConstants.Read);
    idbOpened = true;
}
~~~

读取下一张：

~~~csharp
private void buttonNextIdb_Click(object sender, EventArgs e)
{
    if (!idbOpened)
    {
        MessageBox.Show("请先打开 IDB");
        return;
    }

    idbTool.Run();
    cogRecordDisplay1.Image = idbTool.OutputImage;
    cogRecordDisplay1.Fit();
}
~~~

## 模板八：多个 PMAlign 统计硬币、金额或类别

适合三个模板分别匹配一元、五角和一角的案例。

~~~csharp
CogPMAlignTool yuanTool;
CogPMAlignTool fiveJiaoTool;
CogPMAlignTool oneJiaoTool;

if (!TryGetTool(ctb, "CogPMAlignTool1", out yuanTool) ||
    !TryGetTool(ctb, "CogPMAlignTool2", out fiveJiaoTool) ||
    !TryGetTool(ctb, "CogPMAlignTool3", out oneJiaoTool))
{
    MessageBox.Show("硬币模板工具不完整");
    return;
}

int yuanCount = yuanTool.Results.Count;
int fiveJiaoCount = fiveJiaoTool.Results.Count;
int oneJiaoCount = oneJiaoTool.Results.Count;

double totalMoney =
    yuanCount * 1.0 +
    fiveJiaoCount * 0.5 +
    oneJiaoCount * 0.1;

labelResult.Text =
    "一元：" + yuanCount +
    "，五角：" + fiveJiaoCount +
    "，一角：" + oneJiaoCount +
    "，总金额：" + totalMoney.ToString("F2");
~~~

如果 VPP 已经把数量暴露成输出终端，可以这样读取：

~~~csharp
double yuanCount =
    Convert.ToDouble(ctb.Outputs["YuanCount"].Value);
double fiveJiaoCount =
    Convert.ToDouble(ctb.Outputs["FiveJiaoCount"].Value);
double oneJiaoCount =
    Convert.ToDouble(ctb.Outputs["OneJiaoCount"].Value);

double totalMoney =
    yuanCount + fiveJiaoCount * 0.5 + oneJiaoCount * 0.1;
~~~

输出终端名称必须以 VPP 为准。

## 模板九：保存和读取 CSV 检测结果

追加写入：

~~~csharp
private void AppendCsv(
    int yuanCount,
    int fiveJiaoCount,
    int oneJiaoCount,
    double totalMoney)
{
    string csvPath = Path.Combine(
        Directory.GetCurrentDirectory(), "检测结果.csv");
    Encoding encoding = Encoding.GetEncoding(936);

    if (!File.Exists(csvPath))
    {
        using (StreamWriter writer =
            new StreamWriter(csvPath, false, encoding))
        {
            writer.WriteLine("时间,一元数量,五角数量,一角数量,总金额");
        }
    }

    using (StreamWriter writer =
        new StreamWriter(csvPath, true, encoding))
    {
        writer.WriteLine(
            DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "," +
            yuanCount + "," +
            fiveJiaoCount + "," +
            oneJiaoCount + "," +
            totalMoney.ToString("F2", CultureInfo.InvariantCulture));
    }
}
~~~

如果项目是 .NET Core / .NET 5 以上，Encoding.GetEncoding(936) 报错时，在程序启动处注册：

~~~csharp
Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
~~~

读取并显示：

~~~csharp
private void ReadCsvToTextBox()
{
    string csvPath = Path.Combine(
        Directory.GetCurrentDirectory(), "检测结果.csv");

    if (!File.Exists(csvPath))
    {
        MessageBox.Show("还没有检测结果文件");
        return;
    }

    Encoding encoding = Encoding.GetEncoding(936);
    textBoxResult.Clear();

    using (StreamReader reader =
        new StreamReader(csvPath, encoding))
    {
        string line;

        while ((line = reader.ReadLine()) != null)
        {
            textBoxResult.AppendText(line + Environment.NewLine);
        }
    }
}
~~~

## 模板十：PMAlign 定位后循环移动 FindCircle

适合 9.15 上午的轴承内圈、滚珠半径和批量找圆案例。

~~~csharp
private void MeasureCircles()
{
    CogPMAlignTool pma1;
    CogFindCircleTool circle1;

    if (!TryGetTool(ctb, "CogPMAlignTool1", out pma1) ||
        !TryGetTool(ctb, "CogFindCircleTool1", out circle1))
    {
        MessageBox.Show("PMAlign 或 FindCircle 工具不存在");
        return;
    }

    if (pma1.Results.Count == 0)
    {
        labelResult.Text = "没有找到目标";
        return;
    }

    double totalRadius = 0;
    int validCount = 0;

    cogRecordDisplay2.Image = cogRecordDisplay1.Image;
    cogRecordDisplay2.Record = ctb.CreateCurrentRecord();
    cogRecordDisplay2.StaticGraphics.Clear();

    for (int i = 0; i < pma1.Results.Count; i++)
    {
        double x = pma1.Results[i].GetPose().TranslationX;
        double y = pma1.Results[i].GetPose().TranslationY;

        // 版本 A：通过 ExpectedCircularArc 改变搜索中心
        circle1.RunParams.ExpectedCircularArc.CenterX = x;
        circle1.RunParams.ExpectedCircularArc.CenterY = y;
        circle1.Run();

        if (circle1.RunStatus.Result !=
            CogToolResultConstants.Accept)
        {
            continue;
        }

        double radius = circle1.Results.GetCircle().Radius;
        totalRadius += radius;
        validCount++;

        CogGraphicLabel label = new CogGraphicLabel();
        label.Text = "R=" + radius.ToString("F2");
        label.X = x;
        label.Y = y;
        label.Font = new Font("宋体", 20);
        label.Color = CogColorConstants.Green;
        cogRecordDisplay2.StaticGraphics.Add(label, "");
    }

    labelResult.Text = validCount == 0
        ? "没有有效圆结果"
        : "平均半径：" +
          (totalRadius / validCount).ToString("F2") +
          "，成功：" + validCount;

    cogRecordDisplay2.Fit();
    cogRecordDisplay2.Invalidate();
}
~~~

有些课程版本把可写中心放在下面这个输入上：

~~~csharp
// 版本 B：以当前工具终端中可写字段为准
circle1.Inputs.CaliperSearchRegion.CenterX = x;
circle1.Inputs.CaliperSearchRegion.CenterY = y;
~~~

这两个版本不能盲目同时写。属于 Inputs 或 RunParams 的字段才可能用于赋值，Results 只能读取。

FindCircle 参数骨架：

~~~csharp
circle1.RunParams.ExpectedCircularArc.AngleStart = 0;
circle1.RunParams.ExpectedCircularArc.AngleSpan = 360;
circle1.RunParams.ExpectedCircularArc.Radius = 10;
circle1.RunParams.CaliperRunParams.Edge0Polarity =
    CogCaliperPolarityConstants.DarkToLight;
circle1.RunParams.NumCalipers = 30;
circle1.RunParams.NumToIgnore = 3;
circle1.RunParams.CaliperSearchLength = 15;
circle1.RunParams.CaliperProjectionLength = 10;
~~~

这些数值只属于示例，必须按图像重新调整。

## 模板十一：排序后计算相邻距离

适合引脚缺失、轴承滚珠间距和齿轮齿间距离。

~~~csharp
private void CheckGaps()
{
    CogPMAlignTool pma1;

    if (!TryGetTool(ctb, "CogPMAlignTool1", out pma1))
    {
        MessageBox.Show("找不到模板匹配工具");
        return;
    }

    int count = pma1.Results.Count;

    if (count < 2)
    {
        labelResult.Text = "目标数量不足，无法计算间距";
        return;
    }

    double[] xs = new double[count];

    for (int i = 0; i < count; i++)
    {
        xs[i] = pma1.Results[i].GetPose().TranslationX;
    }

    Array.Sort(xs);

    double minGap = 40;      // 示例值
    double maxGap = 50;      // 示例值
    bool gapError = false;

    for (int i = 0; i < xs.Length - 1; i++)
    {
        double gap = xs[i + 1] - xs[i];

        if (gap < minGap || gap > maxGap)
        {
            gapError = true;
            break;
        }
    }

    labelResult.Text = gapError
        ? "间距异常，疑似缺珠/缺针"
        : "间距正常";
}
~~~

轴承是圆形排列时，直接排序原图 X 坐标只适合展开图或近似直线场景。圆形原图要先用 CogPolarUnwrapTool 展开，或者改用角度坐标。

轴承业务判定：

~~~csharp
int expectedCount = 10;     // 当前产品规格
int actualCount = pma1.Results.Count;

if (actualCount < expectedCount)
{
    labelResult.Text = "少珠";
}
else if (gapError)
{
    labelResult.Text = "珠子间距异常，疑似珠子歪了";
}
else
{
    labelResult.Text = "";
}
~~~

## 模板十二：引脚缺失、倾斜和高度异常

缺失引脚：Blob 中心排序。

~~~csharp
CogBlobTool blob1;

if (!TryGetTool(ctb, "CogBlobTool1", out blob1))
{
    MessageBox.Show("找不到引脚 Blob 工具");
    return;
}

var blobs = blob1.Results.GetBlobs();

if (blobs.Count == 0)
{
    labelResult.Text = "未找到引脚";
    return;
}

double[] xs = new double[blobs.Count];

for (int i = 0; i < blobs.Count; i++)
{
    xs[i] = blobs[i].CenterOfMassX;
}

Array.Sort(xs);

double normalGap = 45;       // 示例值
double gapTolerance = 20;    // 示例值
bool missingPin = false;

for (int i = 0; i < xs.Length - 1; i++)
{
    double gap = xs[i + 1] - xs[i];

    if (Math.Abs(gap - normalGap) > gapTolerance)
    {
        missingPin = true;
        break;
    }
}

labelResult.Text = missingPin ? "缺少引脚" : "引脚数量正常";
~~~

倾斜引脚：Rotation 弧度转角度。

~~~csharp
CogPMAlignTool pinAlign;

if (!TryGetTool(ctb, "CogPMAlignTool2", out pinAlign))
{
    MessageBox.Show("找不到引脚模板工具");
    return;
}

double angleLimit = 4.0;     // 示例值

for (int i = 0; i < pinAlign.Results.Count; i++)
{
    double x = pinAlign.Results[i].GetPose().TranslationX;
    double y = pinAlign.Results[i].GetPose().TranslationY;
    double radian = pinAlign.Results[i].GetPose().Rotation;
    double angle = Math.Abs(radian * 180.0 / Math.PI);

    if (angle > angleLimit)
    {
        // 在 x、y 位置创建“引脚倾斜”标签
    }
}
~~~

偏高、偏低可以先用面积或周长：

~~~csharp
double minPerimeter = 100;    // 示例值
double maxPerimeter = 160;    // 示例值

for (int i = 0; i < blobs.Count; i++)
{
    double perimeter = blobs[i].Perimeter;

    if (perimeter < minPerimeter)
    {
        // 偏低或过短
    }
    else if (perimeter > maxPerimeter)
    {
        // 偏高或过长
    }
}
~~~

## 模板十三：CogPatInspectTool 缺陷检测

ToolBlock 连接顺序：

~~~text
原图
  ↓
CogImageConvertTool       彩色转灰度
  ├─→ CogPMAlignTool      找到 Logo，输出 GuidePose
  └─→ CogPatInspectTool   输入灰度图

CogPMAlignTool.GuidePose
  └─→ CogPatInspectTool.Pose

CogPatInspectTool.Difference
  ↓
CogBlobTool
  ↓
CogGraphicLabel + CogPolygon
~~~

训练时必须使用完整、合格的 Logo。Difference 表示两张图的差异，不天然等于“缺失”，生产案例还应加 ROI、面积和噪声过滤。

外部 WinForms 读取差异 Blob：

~~~csharp
CogBlobTool defectBlob;

if (!TryGetTool(ctb, "CogBlobTool1", out defectBlob))
{
    MessageBox.Show("找不到 Difference 后面的 Blob 工具");
    return;
}

var defects = defectBlob.Results.GetBlobs();
double minDefectArea = 20;     // 示例值
int realDefectCount = 0;

for (int i = 0; i < defects.Count; i++)
{
    if (defects[i].Area >= minDefectArea)
    {
        realDefectCount++;
    }
}

labelResult.Text = realDefectCount == 0
    ? "合格"
    : "不合格，缺陷数：" + realDefectCount;
~~~

ToolBlock 脚本中收集图形：

~~~csharp
private CogGraphicCollection graphics =
    new CogGraphicCollection();

// 在 GroupRun 中，每次运行前清理
graphics.Clear();

CogGraphicLabel passLabel = new CogGraphicLabel();
passLabel.Text = "合格";
passLabel.X = 200;
passLabel.Y = 200;
passLabel.Color = CogColorConstants.Green;
passLabel.Font = new Font("宋体", 24);
graphics.Add(passLabel);
~~~

在 ModifyLastRunRecord 中输出：

~~~csharp
public override void ModifyLastRunRecord(
    Cognex.VisionPro.ICogRecord lastRecord)
{
    foreach (ICogGraphic graphic in graphics)
    {
        mToolBlock.AddGraphicToRunRecord(
            graphic,
            lastRecord,
            "CogImageConvertTool1.OutputImage",
            "");
    }
}
~~~

第三个参数必须从当前项目的 Last Run 记录树确认。

## 模板十四：ToolBlock 高级脚本批量操控工具

适合“Blob 找出多个柱子，再移动 Caliper”、“PMAlign 找出多个齿，再移动距离工具”。

GroupRun 中的通用结构：

~~~csharp
CogBlobTool blob1 =
    mToolBlock.Tools["CogBlobTool1"] as CogBlobTool;

CogCaliperTool caliper1 =
    mToolBlock.Tools["CogCaliperTool1"] as CogCaliperTool;

if (blob1 == null || caliper1 == null)
{
    message = "Blob 或 Caliper 工具不存在";
    return false;
}

box.Clear();
var blobs = blob1.Results.GetBlobs();

for (int i = 0; i < blobs.Count; i++)
{
    double x = blobs[i].CenterOfMassX;

    // 以当前版本中可写的输入字段为准
    caliper1.Region.CenterX = x;
    caliper1.Run();

    if (caliper1.Results.Count == 0)
    {
        continue;
    }

    double width = caliper1.Results[0].Width;

    CogGraphicLabel label = new CogGraphicLabel();
    label.Text = width.ToString("F2");
    label.X = x;
    label.Y = 200;
    label.Font = new Font("宋体", 24);
    label.Color = CogColorConstants.Blue;
    box.Add(label);
}
~~~

Region.CenterX 只是部分工具版本的示例。遇到“只读”时，去工具终端里找真正可写的 Inputs 或区域输入。

ModifyLastRunRecord 通用结构：

~~~csharp
public override void ModifyLastRunRecord(
    Cognex.VisionPro.ICogRecord lastRecord)
{
    foreach (ICogGraphic graphic in box)
    {
        mToolBlock.AddGraphicToRunRecord(
            graphic,
            lastRecord,
            "CogBlobTool1.InputImage",
            "");
    }
}
~~~

## 模板十五：点到点距离、角度和平均值

适合齿轮每个齿间点到圆心的距离。

~~~csharp
CogPMAlignTool pma1 =
    mToolBlock.Tools["CogPMAlignTool1"] as CogPMAlignTool;

CogDistancePointPointTool distanceTool =
    mToolBlock.Tools["CogDistancePointPointTool1"]
    as CogDistancePointPointTool;

if (pma1 == null || distanceTool == null)
{
    message = "距离测量工具不存在";
    return false;
}

double sum = 0;
int validCount = 0;

for (int i = 0; i < pma1.Results.Count; i++)
{
    double x = pma1.Results[i].GetPose().TranslationX;
    double y = pma1.Results[i].GetPose().TranslationY;

    // 输入名以当前工具版本的 Inputs 为准
    distanceTool.Inputs.EndX = x;
    distanceTool.Inputs.EndY = y;
    distanceTool.Run();

    double distance = distanceTool.Results.Distance;
    sum += distance;
    validCount++;

    CogGraphicLabel label = new CogGraphicLabel();
    label.Text = distance.ToString("F2");
    label.X = x;
    label.Y = y;
    label.Color = CogColorConstants.Green;
    label.Font = new Font("宋体", 12);
    box.Add(label);
}

double average = validCount > 0
    ? sum / validCount
    : 0;
~~~

课堂中的终端属性可能因 VisionPro 版本、工具类型或输入连接方式不同而变化。

## 模板十六：极性展开后的轴承、齿轮检测

ToolBlock 流程：

~~~text
原始圆环图像
  ↓
灰度转换
  ↓
CogPolarUnwrapTool
  ↓
展开后的长条图
  ↓
CogPMAlignTool / CogBlobTool
  ↓
数量、间距、缺陷判定
~~~

参数检查：

- 展开角度通常设置为 360°。
- 内半径和外半径要包住目标圆环。
- 输入彩色图时先转灰度。
- 正常数量可能是 10、19 或其他值，必须按当前产品设置。
- 在展开图上比较左右相邻目标前，按 X 坐标排序。

不同 VisionPro 版本的 CogPolarUnwrapTool 对象成员可能没有名为 OutputImage 的属性。外部 WinForms 中优先读取 ToolBlock 暴露出来的图像输出；ToolBlock 脚本中优先从 Last Run Record 取实际图像节点。

不要直接写下面这种未确认的成员：

~~~csharp
// 某些版本不存在这个属性
CogImage8Grey image = unwrap.OutputImage;
~~~

推荐在 ToolBlock 中把输出暴露成终端，再读取真实终端：

~~~csharp
CogImage8Grey unwrapImage =
    ctb.Outputs["UnwrapImage"].Value
    as CogImage8Grey;
~~~

UnwrapImage 必须换成你的真实输出终端名。只想显示记录时可以继续使用：

~~~csharp
cogRecordDisplay2.Record = ctb.CreateCurrentRecord();
~~~

展开后的间距判定：

~~~csharp
Array.Sort(xs);

bool spacingError = false;
double minGap = 20;       // 示例值
double maxGap = 80;       // 示例值

for (int i = 0; i < xs.Length - 1; i++)
{
    double gap = xs[i + 1] - xs[i];

    if (gap < minGap || gap > maxGap)
    {
        spacingError = true;
        break;
    }
}
~~~

展开图坐标回写到原图时，映射函数名称会随 VisionPro 版本和工具接口变化。要从当前版本成员列表确认，不能把课堂中的伪代码方法名直接放进生产脚本。

## 模板十七：三维 Range Image 工具的工程接线

3D 部分的代码接口强依赖 VisionPro 版本，建议先在 ToolBlock 内完成接线，再在 C# 读取暴露的输出。

~~~text
Range Image
  ↓
Cog3DRangeImagePlaneEstimatorTool    建立基准平面
  ↓
Cog3DRangeImageHeightCalculatorTool  计算高度
  ├─→ Cog3DRangeImageVolumeCalculatorTool  计算体积
  └─→ Cog3DRangeImageCrossSectionTool      计算截面
  ↓
ToolBlock Outputs
  ↓
C# 读取数值、判定、保存 CSV
~~~

建议对外只暴露稳定的数值输出：

~~~csharp
double height =
    Convert.ToDouble(ctb.Outputs["Height"].Value);

double volume =
    Convert.ToDouble(ctb.Outputs["Volume"].Value);

labelResult.Text =
    "高度：" + height.ToString("F2") +
    "，体积：" + volume.ToString("F2");
~~~

输出名、单位和坐标系必须在当前 3D VPP 中确认。

## 模板十八：统一的检测按钮骨架

新建案例时，先复制这个按钮，再替换“获取工具”和“判定逻辑”部分。

~~~csharp
private void buttonCheck_Click(object sender, EventArgs e)
{
    if (ctb == null || cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先加载 VPP 和输入图像");
        return;
    }

    if (!ctb.Inputs.Contains("OutputImage"))
    {
        MessageBox.Show("请核对 ToolBlock 图像输入终端");
        return;
    }

    ctb.Inputs["OutputImage"].Value =
        cogRecordDisplay1.Image;
    ctb.Run();

    cogRecordDisplay2.Image =
        cogRecordDisplay1.Image;
    cogRecordDisplay2.Record =
        ctb.CreateCurrentRecord();
    cogRecordDisplay2.StaticGraphics.Clear();

    // 在这里写当前案例的工具获取和业务判定
    // 读取 Results，修改 Inputs，运行工具，创建标注

    cogRecordDisplay2.Fit();
    cogRecordDisplay2.Invalidate();
}
~~~

## 模板十九：条形码读取后通过串口发送

适合 CogID 条码案例接 PLC、单片机、继电器或其他串口设备。流程是：

~~~text
运行 ToolBlock → CogIDTool 读码
        ↓
DecodedData.DecodedString
        ↓
OK|条码 或 NG|NO_READ
        ↓
SerialPort.WriteLine
~~~

### 1. 引用和串口字段

~~~csharp
using System.IO.Ports;
using System.Text;
using Cognex.VisionPro.ID;

private SerialPort serialPort =
    new SerialPort();
~~~

### 2. 打开串口

~~~csharp
private void buttonOpenSerial_Click(
    object sender,
    EventArgs e)
{
    try
    {
        serialPort.PortName = comboBoxPort.Text.Trim();
        serialPort.BaudRate = 9600;
        serialPort.DataBits = 8;
        serialPort.Parity = Parity.None;
        serialPort.StopBits = StopBits.One;
        serialPort.Handshake = Handshake.None;
        serialPort.Encoding = Encoding.ASCII;
        serialPort.NewLine = "\r\n";
        serialPort.Open();
    }
    catch (Exception ex)
    {
        MessageBox.Show(ex.Message);
    }
}
~~~

9600、8N1 只是常见示例，最终按设备协议配置。

### 3. 读取 CogID 结果

~~~csharp
private string GetBarcodeText()
{
    if (ctb == null ||
        !ctb.Tools.Contains("CogIDTool1"))
    {
        return "";
    }

    CogIDTool idTool =
        ctb.Tools["CogIDTool1"] as CogIDTool;

    if (idTool == null ||
        idTool.Results == null ||
        idTool.Results.Count == 0)
    {
        return "";
    }

    for (int i = 0; i < idTool.Results.Count; i++)
    {
        if (idTool.Results[i].DecodedData == null)
        {
            continue;
        }

        string code =
            idTool.Results[i].DecodedData.DecodedString;

        if (!string.IsNullOrWhiteSpace(code))
        {
            return code.Trim();
        }
    }

    return "";
}
~~~

### 4. 检测后发送

~~~csharp
private void SendBarcodeResult()
{
    string barcode = GetBarcodeText();
    string message = string.IsNullOrWhiteSpace(barcode)
        ? "NG|NO_READ"
        : "OK|" + barcode;

    if (serialPort.IsOpen)
    {
        serialPort.WriteLine(message);
    }
}
~~~

如果设备使用 STX/ETX：

~~~csharp
serialPort.Write("\x02" + barcode + "\x03");
~~~

### 5. 窗体关闭时释放

~~~csharp
private void Form1_FormClosing(
    object sender,
    FormClosingEventArgs e)
{
    if (serialPort.IsOpen)
    {
        serialPort.Close();
    }

    serialPort.Dispose();
}
~~~

通信协议至少要约定成功、失败、结束符和 ACK。不要直接发送没有结束符的一串数字。

## 案例到模板的对应关系

| 笔记案例 | 优先复制的模板 |
|---|---|
| 连接件、回形针、套环 | 模板一、模板二、模板四 |
| 齿轮数量和文字显示 | 模板四、模板十五 |
| 胶囊、豆类、药板 | 模板五、模板六 |
| 液面高度和多柱子测量 | 模板十四、模板十五 |
| 轴承滚珠半径 | 模板四、模板十 |
| 轴承少珠、歪珠、间距 | 模板十一、模板十六 |
| 表盘指针和角度 | 模板四、模板十五 |
| PatternInspect Logo 缺陷 | 模板十三、模板六 |
| 引脚缺失、倾斜、偏高偏低 | 模板五、模板十一、模板十二 |
| 三模板硬币和总金额 | 模板八、模板九 |
| IDB 多图检测 | 模板七、模板二 |
| 3D 高度、体积、截面 | 模板十七、模板九 |

## 调试顺序：坏人出现时这样查

### 报“未将对象引用设置到对象的实例”

先查 ctb、cogRecordDisplay1.Image、工具名、工具结果数量，以及 GetCircle 是否真的找到圆。不要在结果为空时读取 Radius、Results[0] 或 GetBlobs()[0]。

### 报“没有 OutputImage”

CogPolarUnwrapTool 的内部对象不一定有 OutputImage 属性；同时，ToolBlock 的输入终端也不一定叫 OutputImage。分别检查工具成员和 ToolBlock 终端。

### 图上没有文字或轮廓

外部窗体检查 Record 是否已经设置、StaticGraphics 是否被清空后重新添加，以及最后是否 Invalidate。高级脚本检查 ModifyLastRunRecord 是否调用 AddGraphicToRunRecord，并核对第三个参数的记录路径。

### 连续运行出现上一张图的标注

每次运行前清空 StaticGraphics 或 CogGraphicCollection。

### 间距判断总是错

先确认结果顺序。PMAlign 和 Blob 的结果顺序不能直接当成空间顺序；取出坐标后 Array.Sort，并确认循环是 i < length - 1。

### 阈值换个产品就失效

课堂中的面积、半径、间距、角度、灰度和数量都是素材参数。用合格样本统计正常范围，再用缺陷样本验证边界，最后把阈值集中放在配置区。

## 关联笔记

- [[机器视觉知识地图]]
- [[CSharp VisionPro 工具总览（功能与介绍笔记）|C# VisionPro 工具总览（功能与介绍笔记）]]
- [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]
- [[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|C# VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]
- [[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|C# VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]
- [[CSharp VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）|C# VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）]]
- [[CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）|C# VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）]]
- [[CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）|C# VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）]]
- [[CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）|C# VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）]]
- [[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]]
- [[CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）|C# VisionPro 轴承滚珠批量测量与极性展开（9.4上午）]]
- [[CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）|C# VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）]]
- [[CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）|C# VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）]]
- [[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]]

## 使用边界

这些模板是按课程代码和笔记整理的工程骨架，补充了常见判空和重复运行处理，但没有在当前机器的 VisionPro SDK 中重新编译。真正放进项目时，至少要核对工具名、输入输出名、Record 路径、程序集引用、VisionPro 版本和所有业务阈值。
