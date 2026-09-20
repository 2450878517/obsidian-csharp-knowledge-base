---
title: "C# VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）"
category: 'VisionPro联合编程'
date: "2026-09-11"
processed_date: "2026-09-16"
tags: [机器视觉, CSharp, VisionPro, WinForms, 联合编程, CogToolBlock, CogBlobTool, CogGraphicLabel, CogPolygon, StaticGraphics, CogRecordDisplay, IDB, CogImageFileTool, 缺陷检测]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.11下午.mp4'
duration: "00:22:40"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；文字标注、Blob轮廓绘制、StaticGraphics输出顺序和IDB多图读取按课堂逻辑整理，未在VisionPro中重新编译运行"
transcript: "5_System/Attachments/video-20260911-pm/转录原文.txt"
aliases: [9.11下午视频笔记, VisionPro文字标注, Blob轮廓绘制, IDB图片读取, CogGraphicLabel]
related: ["[[CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）|CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）]]", "[[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]]", "[[CSharp VisionPro 联合编程两日笔记整理：Blob统计、结果标注与批量测量（9.11—9.15）|CSharp VisionPro 联合编程两日笔记整理：Blob统计、结果标注与批量测量（9.11—9.15）]]", "[[CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）|CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）]]", "[[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]", "[[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]"]
---

# C# VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）

本节接着 [[CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）|C# VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）]] 的药板检测案例继续完善结果显示：不仅统计合格、不合格和漏装数量，还把每个 Blob 的判断结果直接写到原图上，并画出 Blob 的多边形轮廓。后半节转到 `.idb` 图像文件，说明如何在联合编程中读取其中的多张图片。

## 一、本节要解决的问题

上午的程序已经能够完成下面的统计：

```text
CogColorSegmenterTool1 分割目标
        ↓
CogBlobTool1 提取 Blob
        ↓
C# 读取 Blob 数量与 Area
        ↓
Area >= 3000：合格
Area <  3000：不合格
Blob 总数不足 15：漏装
```

但是只在窗体标签上显示数量时，无法直接看出哪一个胶囊合格、哪一个胶囊不合格。本节使用 `CogGraphicLabel` 和 `CogPolygon`，把判断结果和目标轮廓叠加到 `CogRecordDisplay` 上。

`3000` 和 `15` 都是课堂素材的示例参数。更换相机、分辨率、ROI、产品或前处理参数后，要重新确定面积阈值和预期数量。

## 二、先把 ToolBlock 的检测结果显示出来

在添加文字或图形之前，先运行 ToolBlock，并把运行后的 Record 放到结果显示控件：

```csharp
ctb.Inputs["OutputImage"].Value = cogRecordDisplay1.Image;
ctb.Run();

// 先放原图，再放 ToolBlock 的运行结果
cogRecordDisplay2.Image = cogRecordDisplay1.Image;
cogRecordDisplay2.Fit();
cogRecordDisplay2.Record = ctb.CreateCurrentRecord();
```

课堂中使用 `cogRecordDisplay2` 作为结果窗口。后面创建的文字和轮廓通过它的 `StaticGraphics` 叠加显示。

## 三、使用 CogGraphicLabel 在每个 Blob 上写文字

### 1. CogGraphicLabel 的基本属性

`CogGraphicLabel` 是 VisionPro 中用于显示文字的图形对象。创建一个标签后，至少要设置：

```csharp
CogGraphicLabel label = new CogGraphicLabel();

label.X = blob1.Results.GetBlobs()[i].CenterOfMassX;
label.Y = blob1.Results.GetBlobs()[i].CenterOfMassY;
label.Color = CogColorConstants.Blue;
label.Font = new Font("楷体", 18);
```

`X`、`Y` 使用当前 Blob 的质心坐标，所以文字会跟着对应胶囊的位置走。`CogColorConstants.Blue` 是枚举值，其他颜色还可以使用 `Red`、`White`、`Black` 等。

### 2. 根据面积决定显示内容

下面是课堂案例中“统计数量 + 逐个标注”的核心代码：

```csharp
if (ctb.Tools.Contains("CogBlobTool1") &&
    ctb.Tools["CogBlobTool1"] is CogBlobTool blob1)
{
    int hege = 0;
    int buhege = 0;
    int c1 = blob1.Results.GetBlobs().Count;

    for (int i = 0; i < c1; i++)
    {
        CogGraphicLabel label = new CogGraphicLabel();

        label.X = blob1.Results.GetBlobs()[i].CenterOfMassX;
        label.Y = blob1.Results.GetBlobs()[i].CenterOfMassY;
        label.Color = CogColorConstants.Blue;
        label.Font = new Font("楷体", 18);

        double area = blob1.Results.GetBlobs()[i].Area;

        if (area >= 3000)
        {
            hege = hege + 1;
            label.Text = "合格";
        }
        else
        {
            buhege = buhege + 1;
            label.Text = "不合格";
        }

        // 第一个参数是要显示的图形，第二个参数是 Group Name。
        // 本节不分组，因此传入空字符串。
        cogRecordDisplay2.StaticGraphics.Add(label, "");
    }

    cogRecordDisplay2.Invalidate();

    label1.Text = "合格：" + hege;
    label2.Text = "不合格：" + buhege;
}
```

如果还要显示漏装数量，可以沿用上午的逻辑：

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

### 3. 把文字加入结果图

`StaticGraphics.Add` 会把图形加入 `CogRecordDisplay` 的静态图形集合，`Invalidate()` 用来刷新显示：

```csharp
cogRecordDisplay2.StaticGraphics.Add(label, "");
cogRecordDisplay2.Invalidate();
```

这是联合编程中添加文字的简化方式，不需要像脚本中那样分别创建集合、输出集合和绑定集合。

### 4. 最容易出现的顺序问题

必须先把 `ctb.CreateCurrentRecord()` 放入 `cogRecordDisplay2.Record`，再添加 `StaticGraphics`：

```text
错误顺序：先添加文字 → 再设置 Record
结果：Record 重新覆盖显示内容，文字可能消失

正确顺序：设置 Image/Record → Add 文字或轮廓 → Invalidate 刷新
```

如果每次重复检测，建议在开始新一轮显示前清理上一轮的静态图形，避免文字和轮廓越叠越多：

```csharp
cogRecordDisplay2.StaticGraphics.Clear();
```

具体是否清理、清理哪个显示控件，要根据程序是否需要保留上一轮标注来决定。

## 四、使用 CogPolygon 绘制 Blob 轮廓

除了显示“合格/不合格”，还可以把 Blob 的边界轮廓画出来。课堂中的写法是从 Blob 结果取得边界，放入 `CogPolygon`，再设置线宽和颜色：

```csharp
for (int i = 0; i < c1; i++)
{
    CogPolygon cp1 = new CogPolygon();

    // 从当前 Blob 结果取得边界多边形。
    cp1 = blob1.Results.GetBlobs()[i].GetBoundary();

    cp1.LineWidthInScreenPixels = 5;
    cp1.Color = CogColorConstants.Blue;

    cogRecordDisplay2.StaticGraphics.Add(cp1, "");
}

cogRecordDisplay2.Invalidate();
```

课堂演示中先使用了 3 像素线宽，后来改成 5 像素并换成蓝色，便于观察。线宽使用的是屏幕像素，不是图像坐标中的实际尺寸。

同样的思路还可以扩展到其他 VisionPro 图形：

```text
CogGraphicLabel：文字
CogPolygon：多边形或轮廓
CogCircle：圆
CogRectangle：矩形
```

它们都可以通过 `cogRecordDisplay2.StaticGraphics.Add(graphic, "")` 加到结果显示控件中。

## 五、读取 IDB 中的多张图像

### 1. IDB 的特点

`.idb` 不是只有一张图的普通 PNG/JPG 文件，而是可以保存多张图像的 Cognex 图像文件。使用 `CogImageFileTool` 读取时：

```text
Operator.Open：打开 IDB 文件，应该只做一次
Run：读取当前图像；再次 Run 通常会切换到下一张
OutputImage：当前读取出来的图像
```

如果每次点击“切换图片”都重新 `Open` 文件，文件会重新回到第一张，所以看起来就像切换失效。

### 2. 把 CogImageFileTool 放到窗体类级别

不能把 `CogImageFileTool` 只写在某个按钮事件内部，否则其他按钮无法继续使用同一个读取状态。建议在 `Form1` 类中声明：

```csharp
private CogImageFileTool cift = new CogImageFileTool();
private bool idbOpened = false;
```

### 3. 加载 IDB：只打开一次

示例把 IDB 放在程序运行目录的 `素材` 文件夹中：

```csharp
private void LoadIDB_Click(object sender, EventArgs e)
{
    string path = Path.Combine(
        Directory.GetCurrentDirectory(),
        "素材",
        "铜轴点.idb");

    if (!File.Exists(path))
    {
        MessageBox.Show("没有找到 IDB 文件：" + path);
        return;
    }

    cift.Operator.Open(
        path,
        CogImageFileModeConstants.Read);

    idbOpened = true;
}
```

文件名要换成素材文件夹里的真实 `.idb` 文件名。也可以使用文件选择框让用户选择 IDB，但核心原则不变：选择并 `Open` 一次。

### 4. 点击按钮切换 IDB 中的图片

切换按钮只负责 `Run` 和显示输出，不要再次调用 `Operator.Open`：

```csharp
private void Next_Click(object sender, EventArgs e)
{
    if (!idbOpened)
    {
        MessageBox.Show("请先加载 IDB 文件");
        return;
    }

    cift.Run();

    cogRecordDisplay1.Image = cift.OutputImage;
    cogRecordDisplay1.Fit();
}
```

如果需要把“加载”和“切换”合并成一个按钮，也要确保 `Operator.Open` 只在第一次执行，后续点击只调用 `Run()`。更清楚的窗体结构是：

```text
Panel
├─ CogRecordDisplay
├─ 加载 IDB 按钮：Operator.Open 一次
└─ 切换图片按钮：cift.Run()，显示 OutputImage
```

### 5. 普通图片与 IDB 的区别

普通 PNG、JPG 通常是“一次打开、一次显示”；IDB 是“一次打开、连续 Run 读取多张”。因此不能把普通图片切换代码原样套到 IDB 上：

```csharp
// 普通图片：每次打开一个新的文件
cift.Operator.Open(pictures[num1], CogImageFileModeConstants.Read);
cift.Run();

// IDB 多图：文件只打开一次，后续不断 Run
cift.Operator.Open(idbPath, CogImageFileModeConstants.Read);
cift.Run();
cift.Run();
cift.Run();
```

第二种写法复用的是同一个 `CogImageFileTool` 和同一个已经打开的文件状态。

## 六、可复用的完整检测按钮骨架

下面把本节的检测显示顺序合在一起，便于放回上午的药板项目中：

```csharp
private void Check_Click(object sender, EventArgs e)
{
    if (cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先导入图片");
        return;
    }

    ctb.Inputs["OutputImage"].Value = cogRecordDisplay1.Image;
    ctb.Run();

    // 先刷新检测 Record
    cogRecordDisplay2.Image = cogRecordDisplay1.Image;
    cogRecordDisplay2.Fit();
    cogRecordDisplay2.Record = ctb.CreateCurrentRecord();

    // 清除上一次的文字和轮廓，避免重复叠加
    cogRecordDisplay2.StaticGraphics.Clear();

    if (ctb.Tools.Contains("CogBlobTool1") &&
        ctb.Tools["CogBlobTool1"] is CogBlobTool blob1)
    {
        int hege = 0;
        int buhege = 0;
        int c1 = blob1.Results.GetBlobs().Count;

        for (int i = 0; i < c1; i++)
        {
            var blob = blob1.Results.GetBlobs()[i];

            CogGraphicLabel label = new CogGraphicLabel();
            label.X = blob.CenterOfMassX;
            label.Y = blob.CenterOfMassY;
            label.Color = CogColorConstants.Blue;
            label.Font = new Font("楷体", 18);

            if (blob.Area >= 3000)
            {
                hege = hege + 1;
                label.Text = "合格";
            }
            else
            {
                buhege = buhege + 1;
                label.Text = "不合格";
            }

            cogRecordDisplay2.StaticGraphics.Add(label, "");

            CogPolygon polygon = blob.GetBoundary();
            polygon.LineWidthInScreenPixels = 5;
            polygon.Color = CogColorConstants.Blue;
            cogRecordDisplay2.StaticGraphics.Add(polygon, "");
        }

        label1.Text = "合格：" + hege;
        label2.Text = "不合格：" + buhege;
        label3.Text = "漏装：" + Math.Max(0, 15 - c1);
    }

    // 所有静态图形添加完成后再刷新
    cogRecordDisplay2.Invalidate();
}
```

这段是按课堂逻辑整理的示例骨架。不同 VisionPro 版本中 `GetBoundary()` 的返回类型、Blob 结果集合类型或控件名称可能略有差异，应以当前项目 IntelliSense 为准。

## 七、常见问题

### 文字刚出现就消失

通常是先 `StaticGraphics.Add`，后设置 `Record`，后面的 Record 把前面的静态图形覆盖了。调整为“先 Record，后 Add，最后 Invalidate”。

### IDB 每次只能读到第一张

通常是每次点击都执行了 `Operator.Open`。把 `CogImageFileTool` 提升到类级别，加载按钮只 `Open` 一次，切换按钮重复执行 `Run()`。

### 文字位置偏移

确认 `CenterOfMassX/Y` 和当前 `CogRecordDisplay` 使用的是同一坐标系，并检查 ToolBlock 是否对图像做过坐标变换。文字过小或过细时，也要适当调大 `Font`。

### 重复检测后文字越来越多

这是因为 `StaticGraphics` 中保留了上一轮的图形。需要新一轮覆盖时，在添加前调用：

```csharp
cogRecordDisplay2.StaticGraphics.Clear();
```

## 八、课堂材料

- 原始转录：[[5_System/Attachments/video-20260911-pm/转录原文.txt|转录原文]]
- 原始字幕：[[5_System/Attachments/video-20260911-pm/原始字幕.srt|原始字幕]]
- 课堂画面总览：[[5_System/Attachments/video-20260911-pm/contact-sheet.jpg|画面总览]]
- 文字标注结果：[[5_System/Attachments/video-20260911-pm/文字标注结果.jpg|文字标注结果]]
- 多边形轮廓代码：[[5_System/Attachments/video-20260911-pm/多边形轮廓代码.jpg|多边形轮廓代码]]
- IDB 读取窗体：[[5_System/Attachments/video-20260911-pm/IDB读取窗体.jpg|IDB读取窗体]]
- IDB 切图代码：[[5_System/Attachments/video-20260911-pm/IDB切图代码.jpg|IDB切图代码]]

## 收尾

本节的核心是把“检测结果”变成“可直接观察的结果”：`CogGraphicLabel` 负责在目标上写判断文字，`CogPolygon` 负责画目标边界，`StaticGraphics.Add` 负责把图形加到 `CogRecordDisplay`，而 `Invalidate()` 负责刷新。读取 IDB 时记住一句话：文件打开一次，图片连续 `Run`，就能按顺序读取其中的多张图。
