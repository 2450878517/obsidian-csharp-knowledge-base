---
title: "C# VisionPro 表盘指针识别与时间读取（9.7下午）"
category: '表盘识别案例'
date: "2026-09-07"
processed_date: "2026-09-07"
tags: [机器视觉, CSharp, VisionPro, ToolBlock, CogPMAlign, CogCreateSegment, CogAngleLineLine, CogPolarUnwrap, 表盘识别, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.7下午.mp4'
duration: "00:41:09"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；示例代码按课堂逻辑整理，未在 VisionPro 中重新编译运行"
transcript: "5_System/Attachments/video-20260907-pm/转录原文.txt"
aliases: [9.7下午视频笔记, 钟表识别, 表盘读时]
related: ["[[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|CSharp VisionPro 多模板匹配与标定板工具（9.7上午）]]", "[[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]", "[[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]]", "[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]"]
---

# C# VisionPro 表盘指针识别与时间读取（9.7下午）

本节用 VisionPro 识别钟表表盘中的时针、分针和秒针，并把指针位置换算成时间。课堂讲了两条路线：

学习路线：本节承接上午的模板匹配和标定基础，把 PMAlign、几何线段、极性展开和 ToolBlock 脚本组合成一个完整测量案例。

上一节：[[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|C# VisionPro 多模板匹配与标定板工具（9.7上午）]]

- 用两条有方向的线段配合 `CogAngleLineLineTool` 测量夹角，再根据正负号和角度换算时间。
- 用 `CogPolarUnwrapTool` 把圆形表盘展开成平面，让三个指针沿 X 轴排列，再用模板匹配结果的 `TranslationX` 换算时间。

第二条路线更简单，也是本节最后重点完善的方案。关键不是把模板匹配结果“框出来”就结束，而是要先把坐标关系、12 点边界和单位换算想清楚。

## 一、先确定表盘位置

### 1. 彩色图先转灰度

表盘素材是彩色图，直接训练模板时会出现图像类型不支持。先加入 `CogImageConvertTool`，把彩色图转换为灰度图，再把灰度图接给 `CogPMAlignTool`。

### 2. 模板匹配整个表盘

用一个 `CogPMAlignTool` 匹配整个钟表表盘，得到表盘中心位置。训练区域应尽量保留稳定的表盘外观，指针等会变化的内容可以用掩膜遮掉，减少它们对匹配结果的干扰。

表盘整体是圆形，课堂中没有把旋转范围作为重点；中心原点要尽量放在表盘真正的中心，因为后面创建基准线、极性展开都依赖这个点。

```csharp
CogPMAlignTool pma1 =
    mToolBlock.Tools["CogPMAlignTool1"] as CogPMAlignTool;

double centerX = pma1.Results[0]
    .GetPose().TranslationX;
double centerY = pma1.Results[0]
    .GetPose().TranslationY;
```

实际工具名和输入输出路径必须以当前 ToolBlock 为准。没有匹配结果时不能直接访问 `Results[0]`，应先判断 `Results.Count`。

## 二、方法一：用有方向的线段测角

### 1. 创建固定的垂直基准线

找线工具得到的线段方向不一定稳定，即使找到了同一条线，也可能出现方向相反的问题。方向一变，后面的角度可能从正角变成负角，或者变成补角。

因此课堂使用 `CogCreateSegmentTool` 创建线段，而不是直接用找线工具。线段有起点和终点，方向明确。

基准线从表盘中心出发，设置终点的 X 坐标与起点相同，Y 坐标使用固定值，就能保证它是一条垂直线：

```csharp
// 示意代码：Inputs 下的属性路径以 VisionPro 版本为准
CogCreateSegmentTool baseLine =
    mToolBlock.Tools["CogCreateSegmentTool1"]
    as CogCreateSegmentTool;

baseLine.Inputs.Segment.StartX = centerX;
baseLine.Inputs.Segment.StartY = centerY;
baseLine.Inputs.Segment.EndX = centerX;
baseLine.Inputs.Segment.EndY = 50;
```

这里的 `50` 只是课堂示例。实际项目中应根据图像坐标和表盘方向设置终点，重点是 `StartX` 与 `EndX` 相同。

### 2. 用第二个模板匹配找指针端点

以秒针为例，再用一个 `CogPMAlignTool` 匹配秒针。模板匹配结果带有一个中心点，可以把表盘中心点和秒针匹配点连接成第二条有方向的线段。

模板训练时要注意：

- 旋转范围可以设置为 `±180°`，使指针转到不同方向仍能匹配。
- 如果其他指针或刻度造成干扰，可以使用掩膜遮挡不稳定区域。
- 发现结果重合或误匹配时，要重新调整模板区域和运行参数。

```csharp
CogPMAlignTool pma2 =
    mToolBlock.Tools["CogPMAlignTool2"] as CogPMAlignTool;

double handX = pma2.Results[0]
    .GetPose().TranslationX;
double handY = pma2.Results[0]
    .GetPose().TranslationY;
```

再用另一个 `CogCreateSegmentTool`，把 `centerX/centerY` 作为起点，把 `handX/handY` 作为终点。这样得到的指针线段也有稳定方向。

### 3. 用 Angle 工具读夹角

将垂直基准线接到 `CogAngleLineLineTool` 的一条输入，将指针线段接到另一条输入。工具输出两条线之间的角度。

角度正负表示指针位于基准线的哪一侧：

- 右半边通常得到正角。
- 左半边通常得到负角。

根据角度正负，再结合秒针、分针、时针各自的一圈单位进行换算，就能得到时间。秒针、分针和时针都要分别匹配、分别创建线段、分别测角，因此这套方法步骤多，换算也更容易写错。

### 4. 这条路线的核心坑

- 不能只拿“找出来的线”测角而不确认方向。
- 一定要用有起点和终点的 `CogCreateSegmentTool`，固定线段方向。
- 左右两侧角度的正负要分别处理，不能把负角直接当成正角使用。
- 三根指针要分别处理，最后还要把角度换成秒、分、小时。

## 三、方法二：极性展开后按 X 坐标读时

### 1. 把表盘展开成平面

`CogPolarUnwrapTool` 可以把圆形表盘的环形区域展开成一条平面图。表盘上的角度位置会变成展开图中的 X 坐标，原本绕圆周分布的指针就能按从左到右的顺序处理。

设置要点：

- 展开角度范围设置为 `360°`，覆盖完整表盘。
- 展开中心使用前面表盘模板匹配得到的中心点；如果中心不够准确，可以在 PMAlign 后再接找圆工具修正。
- 起始角度可调整为 `-90°`，让展开图从 12 点附近开始，X 坐标和钟表刻度更容易对应。
- 内外半径要覆盖指针所在的环形区域，不能只展开到表盘中心。

展开后，12 个刻度大致把 X 方向分成 12 个区间。接下来只要找到三根指针在展开图中的位置，就可以用 X 坐标换算时间。

### 2. 在展开图上匹配三根指针

在 `CogPolarUnwrapTool` 的输出图像上，分别训练三个 `CogPMAlignTool`：

- 一个匹配秒针。
- 一个匹配分针。
- 一个匹配时针。

模板区域不要只框住指针尖端。课堂中特别演示了把模板框拉长，让模板包含更多稳定的空白区域，这样可减少把其他指针误认为目标的情况。

同时可以用掩膜去掉会变化或容易干扰匹配的部分。三个模板匹配工具的编号要和脚本变量一一对应，课堂示例使用 `pma2`、`pma3`、`pma4` 表示秒针、分针和时针。

### 3. 12 点要单独判断

如果一根指针正好指向 12 点，它可能落在展开图的首尾边界，模板匹配不到。此时“没有结果”不一定是工具坏了，可能恰好说明指针在 12 点。

课堂采用的判断方式是：

```csharp
if (pma2.Results.Count == 0)
{
    // 秒针在 12 点，按课堂示例记为 60 秒
}
```

同理，分针匹配不到时按 60 分处理，时针匹配不到时按 12 点处理。生产项目中也可以把 60 秒/60 分规范化为 0，但必须统一显示和后续计算规则，不能一会儿用 60、一会儿用 0。

### 4. 用 X 坐标换算单位

课堂素材中相邻钟点在展开图上的 X 坐标差约为 `78`，观察到的范围约为 `70~85`。这个数值只适用于当前素材；换图像尺寸、展开区域或起始角度后必须重新测量。

如果某根指针有匹配结果，先读取 `TranslationX`，再除以每个钟点的像素间隔。秒针和分针一圈分别对应 60 个单位，所以每个钟点要乘以 5；时针一圈对应 12 个单位，不需要再乘 5。

```csharp
int s = 0;
int m = 0;
int h = 0;
double hourGap = 78.0; // 课堂素材值，实际项目要重新标定

// 秒针：pma2
if (pma2.Results.Count != 0)
{
    double x = pma2.Results[0]
        .GetPose().TranslationX;
    double slot = x / hourGap;
    s = Convert.ToInt32(slot) * 5;
}
else
{
    s = 60;
}

// 分针：pma3
if (pma3.Results.Count != 0)
{
    double x = pma3.Results[0]
        .GetPose().TranslationX;
    double slot = x / hourGap;
    m = Convert.ToInt32(slot) * 5;
}
else
{
    m = 60;
}

// 时针：pma4
if (pma4.Results.Count != 0)
{
    double x = pma4.Results[0]
        .GetPose().TranslationX;
    double slot = x / hourGap;
    h = Convert.ToInt32(slot);
}
else
{
    h = 12;
}
```

这里的 `Convert.ToInt32` 会把连续坐标转换为整数刻度。更精细的项目可以根据指针在两个刻度之间的比例做插值，不必照搬课堂中的整数取法。

### 5. 用标签显示结果

把时、分、秒拼成文本，用 `CogGraphicLabel` 显示到图像上：

```csharp
CogGraphicLabel label = new CogGraphicLabel();
label.Text = h.ToString() + ":"
    + m.ToString() + ":"
    + s.ToString();
label.X = 200;
label.Y = 200;
label.Color = CogColorConstants.Green;
label.Font = new Font("宋体", 24);
```

课堂中将结果通过 `ModifyLastRunRecord` 输出到图像记录。实际输出的图像节点要从当前 Last Run Record 中确认，不能死记某个路径：

```csharp
public override void ModifyLastRunRecord(
    Cognex.VisionPro.ICogRecord lastRecord)
{
    mToolBlock.AddGraphicToRunRecord(
        label,
        lastRecord,
        "实际图像记录路径",
        "");
}
```

课堂素材中显示的结果包括 `6:40:45`、`10:20:30`、`12:30:15` 和 `2:45:30` 等，说明三根指针已经按坐标换算并输出到图像上。

## 四、推荐的 ToolBlock 结构

```text
输入图像
   ↓
CogImageConvertTool        （彩色转灰度）
   ↓
CogPMAlignTool1            （匹配整个表盘，得到中心）
   ├─ 方法一：CogCreateSegmentTool1/2 → CogAngleLineLineTool
   └─ 方法二：CogPolarUnwrapTool（360°，起始角度可设 -90°）
                         ↓
                 CogPMAlignTool2/3/4
                 （秒针、分针、时针）
                         ↓
                 TranslationX 换算时间
                         ↓
                 CogGraphicLabel 输出结果
```

## 五、常见坏人

- 彩色图直接训练 PMAlign：先用 `CogImageConvertTool` 转灰度。
- 把指针会变化的区域全部放进表盘模板：用掩膜遮掉不稳定内容。
- 中心原点没有放在真正的表盘中心：后面的线段和极性展开都会偏。
- 用找线工具直接测角：线段方向可能反向，导致角度正负或补角错误。
- `CogPolarUnwrapTool` 角度范围不是 360°：表盘会被截断，坐标换算不完整。
- 模板只框住指针尖端：容易把其他指针误匹配；可以适当拉长模板，加入稳定空白区。
- 把没有匹配结果一律当成工具失败：指针在 12 点时可能正好位于展开图边界。
- 把 `78` 当成通用常量：这是课堂素材的像素间隔，换图必须重新标定。
- 只写 `Results[0]` 不判断数量：没有结果时会报错，先判断 `Results.Count`。
- 直接照抄记录路径或 API 名称：先看当前版本的 ToolBlock 和 Last Run Record。

## 六、复习练习

- 先只完成第二种方法：表盘 PMAlign → 极性展开 → 三个指针 PMAlign → X 坐标换算。
- 把表盘模板中的指针区域加掩膜，比较掩膜前后的匹配结果。
- 修改极性展开起始角度，观察展开图 X 坐标如何变化，并重新标定 `hourGap`。
- 专门测试一根指针位于 12 点的图片，确认“无匹配结果”的分支。
- 再回头完成第一种测角方法，分别验证右侧正角和左侧负角。

## 原始资料与课堂截图

- 视频：`D:\BaiduNetdiskDownload\14班9.7下午.mp4`
- 时长：41 分 09 秒
- [[5_System/Attachments/video-20260907-pm/转录原文.txt|转录原文]]
- [[5_System/Attachments/video-20260907-pm/原始字幕.srt|原始字幕]]

课堂截图：

- ![[5_System/Attachments/video-20260907-pm/课堂120.jpg]]
- ![[5_System/Attachments/video-20260907-pm/课堂600.jpg]]
- ![[5_System/Attachments/video-20260907-pm/课堂1000.jpg]]
- ![[5_System/Attachments/video-20260907-pm/课堂1500.jpg]]
- ![[5_System/Attachments/video-20260907-pm/课堂2000.jpg]]
- ![[5_System/Attachments/video-20260907-pm/课堂2350.jpg]]

## 关联链接

- [[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|C# VisionPro 多模板匹配与标定板工具（9.7上午）]]
- [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]
- [[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|C# VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]]
- [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]
