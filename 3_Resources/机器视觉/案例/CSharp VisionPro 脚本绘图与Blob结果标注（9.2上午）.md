---
title: "VisionPro 脚本绘图与 Blob 结果标注"
category: '脚本与ToolBlock'
date: "2026-09-02"
processed_date: "2026-09-05"
tags: [机器视觉, CSharp, VisionPro, Blob, ToolBlock, CogGraphicCollection, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.2上午(1).mp4'
duration: "00:36:01"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；示例代码未在 VisionPro 编译运行"
transcript: "5_System/Attachments/video-20260902-am1/转录原文.txt"
aliases: [9.2上午视频笔记, VisionPro脚本绘图, Blob轮廓标注]
related: ["[[CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）|CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）]]", "[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]", "[[CSharp VisionPro Blob 斑点工具与颜色分割|CSharp VisionPro Blob 斑点工具与颜色分割]]"]
---

# VisionPro 脚本绘图与 Blob 结果标注

14班9.2上午(1)  |  视频时长 36分01秒

本节承接豆类识别案例：Blob 工具已经获得检测结果，脚本为每个豆子叠加图形，让检测位置更容易辨认。核心流程是运行工具、遍历结果、创建图形、加入集合，再显示到运行记录。


## 先分清两种索引

mToolBlock.Tools["CogBlobTool1"] 按工具名称取工具，字符串必须与工具块中的实际名称一致。这里的 1 是名称的一部分。

blob1.Results.GetBlobs()[i] 按位置取第 i 个检测结果。结果索引从 0 开始，循环条件应为 i < 结果数量。一个 Blob 工具可以检测出许多个豆子，不需要为每个豆子创建一个工具。


## 资料范围

根据本视频完整语音转录与关键课堂画面整理。下文代码是学习用整理片段，不是完整逐字抄录，未在 VisionPro 中编译运行。


## 循环结构与画圆

在已有 GroupRun 中保留模板的工具运行代码。工具运行完后清空上一轮的图形，再遍历这次的 Blob 结果。以下假设工具名确实为 CogBlobTool1。

```csharp
// 成员区：所有本轮标注共用一个集合
private CogGraphicCollection box = new CogGraphicCollection();

// GroupRun 内，放在工具运行代码之后
box.Clear();
CogBlobTool blob1 = mToolBlock.Tools["CogBlobTool1"]
    as CogBlobTool;
if (blob1 == null || blob1.Results == null)
{
    message = "Blob 工具类型不符或没有结果";
    result = CogToolResultConstants.Error;
    return false;
}
CogBlobResultCollection blobs = blob1.Results.GetBlobs();
for (int i = 0; i < blobs.Count; i++)
{
    CogCircle circle = new CogCircle();
    circle.Radius = 30;
    circle.CenterX = blobs[i].CenterOfMassX;
    circle.CenterY = blobs[i].CenterOfMassY;
    circle.Color = CogColorConstants.Yellow;
    circle.LineWidthInScreenPixels = 3;
    circle.LineStyle = CogGraphicLineStyleConstants.Dot;
    box.Add(circle);
}
```

每次循环都 new 一个圆，所以每个结果有独立标记。CenterOfMassX/Y 是检测斑点的重心坐标；半径 30 是课堂示例值，应按目标大小调整。


## 线型对照

CogGraphicLineStyleConstants.Solid：实线；Dash：虚线；DashDot：一段虚线加一个点；DashDotDot：一段虚线加两个点；Dot：点线。

LineWidthInScreenPixels 控制屏幕上的线宽。课堂由 1 调到 3，并把圆半径临时调大来观察线型。


## 普通矩形的坐标与居中

课堂矩形宽度为 50，高度为 80。CogRectangle 的 X、Y 表示左上角；直接把重心赋给它们，矩形会向右下方偏。

```csharp
// 放在结果循环内；blobs 与 i 沿用上面的循环
CogRectangle rect = new CogRectangle();
rect.Width = 50;
rect.Height = 80;
rect.X = blobs[i].CenterOfMassX - rect.Width / 2;
rect.Y = blobs[i].CenterOfMassY - rect.Height / 2;
box.Add(rect);
```

居中关系：左上角 X = 中心 X − 宽度的一半；左上角 Y = 中心 Y − 高度的一半。因此课堂中 X 减 25，Y 减 40。用 Width / 2、Height / 2 可以避免改尺寸时忘记同步偏移。


## 只读属性报错

课堂演示给 CogRectangle.CenterX 赋值时出现只读属性错误。这里按课堂采用 X、Y 设置位置，不把圆的 CenterX、CenterY 写法直接套到普通矩形上。


## 圆和矩形承担什么作用

固定半径的圆、固定宽高的矩形主要用于标注位置。它们不会自动贴合不同尺寸的豆子，也不代表真实轮廓或测量尺寸。要描边，使用后面的 GetBoundary()。


## 画圆课堂代码

![[5_System/Attachments/video-20260902-am1/画圆代码.png]]

屏幕显示先取 CogBlobTool1，再按 res1 个检测结果循环绘制圆。


## 轮廓与外接矩形

轮廓图形不需要手工指定固定宽高，而是直接从当前检测斑点取得边界。课堂用蓝色、5 像素线宽让轮廓更显眼。

```csharp
// 轮廓：放在结果循环内
CogPolygon polygon = blobs[i].GetBoundary();
polygon.Color = CogColorConstants.Blue;
polygon.LineWidthInScreenPixels = 5;
box.Add(polygon);
```

课堂先 new CogPolygon() 再用 GetBoundary() 的返回值赋给它。这里合并为一行，避免创建一个马上被替换的空对象。


## 仿射矩形

CogRectangleAffine 可以表达旋转与倾斜。课堂调用 GetBoundingBox() 取得外接矩形，并比较不同轴向参数的显示效果。

```csharp
// 外接矩形：放在结果循环内
CogRectangleAffine bounds = blobs[i].GetBoundingBox(
    CogBlobAxisConstants.Principal);
bounds.Color = CogColorConstants.Blue;
bounds.LineWidthInScreenPixels = 5;
box.Add(bounds);
```

课堂还演示了 CogBlobAxisConstants.ExtremaAngle。老师把 Principal 称为“最小外接矩形”，但本次没有核实该版本 API 对最小面积的保证；不要仅凭这个课堂称呼把它当作严格的最小面积算法。具体含义应查安装版本的帮助。


## 外接矩形课堂代码

![[5_System/Attachments/video-20260902-am1/外接矩形代码.png]]

屏幕展示 GetBoundingBox(CogBlobAxisConstants.ExtremaAngle)。


## 将图形显示到运行记录

box.Add() 负责收集图形。实际叠加时，在 ModifyLastRunRecord 中逐个添加。下面是整理补充，记录路径必须对应你的项目。

```csharp
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
```

第三个参数是目标图像的记录路径。示例采用 CogBlobTool1.InputImage；应对照实际 Last Run 图像节点确认。如果经过彩转灰或工具重命名，路径可能不同。保留原模板 Initialize 中的 base.Initialize(host) 与 mToolBlock 赋值。


## 报错和显示异常怎么排查

- 名称索引越界：先确认 CogBlobTool1 存在。名称索引访问可能直接抛错，后面的 null 判断不能拦截发生在这一行的索引异常。

- 结果索引越界：使用 i < blobs.Count，不能写 i <= blobs.Count，也不要用工具数量代替结果数量。

- 图形越跑越多：确认 box.Clear() 每轮执行。图形不显示：确认已加入集合，并添加到了正确图像记录。

- 矩形偏右下：检查 X、Y 是否减去宽高的一半。未找到 CogBlobTool 类型：检查 using Cognex.VisionPro.Blob 与相应程序集引用。


## 练习方式

先只启用画圆片段确认每个结果都有标记，再分别切换为普通矩形、轮廓、外接矩形。课堂也通过注释其他画法减少遮挡。不要一次叠加所有图形后再判断哪段代码出了问题。

图形只是显示层；检测漏掉的豆子不会因为添加标记而被重新识别。识别问题仍需检查 Blob 的图像、阈值、区域与筛选设置。


## 原始资料与关联笔记

[[5_System/Attachments/video-20260902-am1/转录原文.txt|转录原文]] · [[5_System/Attachments/video-20260902-am1/原始字幕.srt|原始字幕]]

- [[CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）|C# VisionPro Blob脚本与胶囊豆类识别（9.1下午）]]
- [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]
- [[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]]

