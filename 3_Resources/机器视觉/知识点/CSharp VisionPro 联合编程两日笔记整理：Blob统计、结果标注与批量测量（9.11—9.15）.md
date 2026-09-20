---
title: "C# VisionPro 联合编程两日笔记整理：Blob统计、结果标注与批量测量（9.11—9.15）"
category: '学习路线'
date: "2026-09-15"
processed_date: "2026-09-16"
tags: [机器视觉, CSharp, VisionPro, 联合编程, ToolBlock, Blob, PMAlign, FindCircle, 结果显示, 批量测量, 学习路线]
area: 机器视觉
status: budding
aliases: [VisionPro两日笔记, 联合编程学习路线, Blob到批量测量]
related: ["[[CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）|CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）]]", "[[CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）|CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）]]", "[[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]]", "[[CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）|CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）]]"]
---

# C# VisionPro 联合编程两日笔记整理：Blob统计、结果标注与批量测量（9.11—9.15）

> 范围说明：本篇按最近完成的两天课程整理，包含 9.11 上午、9.11 下午和 9.15 上午三篇案例笔记。9.11 下午依赖上午的 Blob 统计，9.15 上午则把“代码获取工具并控制工具”的方法推进到批量圆测量。

## 一、先看主线

这几节课都在练同一种联合编程思路：

~~~text
导入图像
   ↓
VisionPro ToolBlock 完成基础视觉处理
   ↓
C# 通过 ctb.Tools 获取内部工具
   ↓
循环读取或修改工具结果
   ↓
把结果变成统计数据、图像标注或后续测量
~~~

课程演进可以记成：

~~~text
CogColorSegmenterTool + CogBlobTool
        ↓
读取数量、面积和质心
        ↓
统计合格 / 不合格 / 漏装
        ↓
CogGraphicLabel + CogPolygon 画回结果图
        ↓
CogPMAlignTool 找多个工件位置
        ↓
代码移动 CogFindCircleTool
        ↓
逐个测量半径并求平均值
~~~

一句话总结：

> VisionPro 负责视觉处理，C# 负责取结果、改参数、做循环和输出业务结论。

## 二、9.11：从 Blob 结果到可视化结果

### 1. 上午：先把结果变成业务数据

[[CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）|C# VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）]] 的核心是从 ToolBlock 内部取得 CogBlobTool：

~~~csharp
if (ctb.Tools.Contains("CogBlobTool1") &&
    ctb.Tools["CogBlobTool1"] is CogBlobTool blob1)
{
    int count = blob1.Results.GetBlobs().Count;

    for (int i = 0; i < count; i++)
    {
        double area =
            blob1.Results.GetBlobs()[i].Area;

        // 根据面积判断合格或不合格
    }
}
~~~

这节建立了几个基础动作：

- 用 Process 或 ProcessStartInfo 打开素材文件夹和 CSV。
- 用 CogColorSegmenterTool 分割目标。
- 用 CogBlobTool 提取多个 Blob。
- 读取 Count、Area 和 CenterOfMassX/Y。
- 根据面积阈值统计合格、不合格。
- 用预期数量减去实际数量计算漏装。

课堂药板示例使用 15 个目标和约 3000 的面积阈值。它们属于当前素材参数，换图像后必须重新确认。

### 2. 下午：把统计结果画回图像

[[CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）|C# VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）]] 把“只显示数量”推进成“每个目标都能看见判断结果”：

~~~csharp
CogGraphicLabel label = new CogGraphicLabel();
label.X = blob.CenterOfMassX;
label.Y = blob.CenterOfMassY;
label.Text = "合格";
label.Color = CogColorConstants.Blue;

cogRecordDisplay2.StaticGraphics.Add(label, "");
cogRecordDisplay2.Invalidate();
~~~

还可以把 Blob 边界转成 CogPolygon，叠加到结果图上。

这里有一个必须记住的显示顺序：

~~~text
先设置 Image / Record
        ↓
再 StaticGraphics.Add 文字或轮廓
        ↓
最后 Invalidate 刷新
~~~

如果先添加静态图形、后设置 Record，Record 可能覆盖刚刚添加的文字和轮廓。

### 3. IDB 多图读取

同一节还讲了 IDB 多图读取：

~~~text
CogImageFileTool.Operator.Open：只打开一次
CogImageFileTool.Run：连续读取下一张
CogImageFileTool.OutputImage：显示当前图片
~~~

最容易犯的错误是每次点击切换都重新 Open。重新 Open 会让文件回到第一张，因此正确结构是：

~~~csharp
private CogImageFileTool cift =
    new CogImageFileTool();

// 加载按钮：Operator.Open 一次
// 切换按钮：cift.Run()，显示 cift.OutputImage
~~~

## 三、9.15：从读取结果到操控工具

[[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]] 进一步解决了“一个工具如何服务多个目标”。

### 1. PMAlign 定位，FindCircle 测量

ToolBlock 中放置：

~~~text
CogPMAlignTool1
    找到每个工件的位置，输出多个 Pose

CogFindCircleTool1
    在当前圆心附近寻找轴承内圈
~~~

C# 的循环逻辑是：

~~~text
遍历 pma1.Results
        ↓
读取当前结果的 TranslationX / TranslationY
        ↓
写入 fct1.RunParams.ExpectedCircularArc.CenterX/Y
        ↓
fct1.Run()
        ↓
读取 fct1.Results.GetCircle().Radius
~~~

关键代码：

~~~csharp
for (int i = 0; i < pma1.Results.Count; i++)
{
    double x1 = pma1.Results[i]
        .GetPose().TranslationX;
    double y1 = pma1.Results[i]
        .GetPose().TranslationY;

    fct1.RunParams.ExpectedCircularArc.CenterX = x1;
    fct1.RunParams.ExpectedCircularArc.CenterY = y1;
    fct1.Run();

    double radius =
        fct1.Results.GetCircle().Radius;
}
~~~

这体现了“一个定位工具 + 一个可移动测量工具 + 一个循环”的模式。目标数量增加时，不需要复制很多个找圆工具。

### 2. 结果输出

每次测量得到半径后，可以使用 CogGraphicLabel 标注到对应工件：

~~~csharp
CogGraphicLabel label = new CogGraphicLabel();
label.Text = radius.ToString("F2");
label.X = x1;
label.Y = y1;
label.Color = CogColorConstants.Green;

cogRecordDisplay2.StaticGraphics.Add(label, "");
~~~

循环结束后：

~~~csharp
label1.Text = "工件数量：" + pma1.Results.Count;
label2.Text = "平均半径：" +
    (total / validCount).ToString("F2");
~~~

这里要区分半径和内径：

~~~csharp
double diameter = radius * 2;
~~~

课堂代码读取的是 Radius，所以标签写“半径”是正确的；如果项目要求内径，必须乘以 2 后再显示和统计。

### 3. 参数放在 VPP 还是 C#

固定不变的参数可以在 VPP 中提前设置，例如卡尺数量、搜索长度和边缘极性。需要随产品或目标变化的参数，可以在 C# 中修改：

~~~csharp
fct1.RunParams.ExpectedCircularArc.CenterX = x1;
fct1.RunParams.ExpectedCircularArc.CenterY = y1;
fct1.RunParams.NumCalipers = 30;
fct1.RunParams.NumToIgnore = 3;
~~~

调参原则是：先在 VPP 中把工具调通，再把真正需要动态变化的参数交给 C#。

## 四、三篇笔记放在一起怎么理解

| 阶段 | VisionPro 负责 | C# 负责 | 结果 |
|---|---|---|---|
| 9.11 上午 | 颜色分割、Blob 提取 | 读取 Area 和 Count | 合格、不合格、漏装 |
| 9.11 下午 | 提供 Blob 边界和 IDB 图像 | 创建标签、画轮廓、切换 IDB | 图像上的可视化结果 |
| 9.15 上午 | PMAlign 定位、FindCircle 测量能力 | 移动圆心、循环测量、求平均 | 多工件半径结果 |

## 五、最容易混淆的地方

### Record 和 StaticGraphics

- Record 是 ToolBlock 的运行记录和工具结果。
- StaticGraphics 是额外添加到显示控件上的文字、圆和多边形。
- 通常要先设置 Record，再添加 StaticGraphics，最后 Invalidate。

### Open 和 Run

- 普通 PNG、JPG：可以每次打开一个新文件再 Run。
- IDB 多图：文件 Open 一次，后面重复 Run 读取不同图像。

### 半径和内径

- Radius 是半径。
- Diameter 是直径，等于半径乘 2。
- 课堂代码用 Radius，所以结果标签写“平均半径”。
- 项目要求内径时，必须先换算。

### 定位数量和有效测量数量

PMAlign 找到 5 个目标，不代表 5 个找圆都成功。建议分别记录：

~~~text
pma1.Results.Count：定位到的目标数
validCount：测量成功的目标数
total：成功测量结果的总和
~~~

平均值优先使用 total / validCount，避免一个失败结果导致整个检测按钮报错。

### 工具名称和类型

不要只判断工具名字，还要判断类型：

~~~csharp
if (ctb.Tools.Contains("CogFindCircleTool1") &&
    ctb.Tools["CogFindCircleTool1"] is CogFindCircleTool fct1)
{
    // 安全使用 fct1
}
~~~

## 六、推荐练习顺序

### 练习一：合并 Blob 统计和图像标注

在药板案例中同时显示：

~~~text
每个 Blob 的合格 / 不合格
每个 Blob 的轮廓
窗体上的合格、不合格、漏装数量
~~~

重点检查 StaticGraphics.Clear 的位置，避免重复点击后图形叠加。

### 练习二：保存批量测量结果

把 9.15 上午的工件数量、每个半径、平均半径写入 CSV，关联：

[[CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）|C# VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）]]

### 练习三：使用 IDB 做批量测试

把 IDB 作为输入，再运行批量找圆逻辑：

~~~text
IDB 多图输入
    ↓
PMAlign 批量定位
    ↓
FindCircle 批量测量
    ↓
结果标注与 CSV 保存
~~~

## 七、最终记忆卡片

~~~text
Blob：读数量、面积和质心
GraphicLabel：把文字写回图像
Polygon：把轮廓画回图像
IDB：Open 一次，Run 多次
PMAlign：给出多个目标位置
FindCircle：在指定位置测圆
C#：循环、移动工具、统计和保存结果
~~~

## 关联笔记

- [[CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）|C# VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）]]
- [[CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）|C# VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）]]
- [[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]]
- [[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|C# VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]
- [[CSharp VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）|C# VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）]]
- [[CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）|C# VisionPro 轴承滚珠批量测量与极性展开（9.4上午）]]
- [[CSharp VisionPro 工具总览（功能与介绍笔记）|C# VisionPro 工具总览（功能与介绍笔记）]]

## 收尾

这两天的内容可以连成一条完整路线：先从 ToolBlock 中拿到 Blob 结果，再把判断结果画回图像，接着让代码移动测量工具去处理多个目标。以后写 VisionPro 项目时，就按“VisionPro 做视觉处理，C# 做流程和业务”的方式搭起来。
