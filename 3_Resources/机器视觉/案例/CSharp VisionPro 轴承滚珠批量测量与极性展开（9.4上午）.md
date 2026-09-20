---
title: "VisionPro 轴承滚珠批量测量与极性展开"
category: '轴承缺陷案例'
date: "2026-09-04"
processed_date: "2026-09-05"
tags: [机器视觉, CSharp, VisionPro, ToolBlock, CogPMAlign, CogFindCircle, CogPolarUnwrap, Blob, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.4上午.mp4'
duration: "00:45:15"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；示例代码按课堂讲解整理，未在 VisionPro 中编译运行"
transcript: "5_System/Attachments/video-20260904-am/转录原文.txt"
aliases: [9.4上午视频笔记, 轴承滚珠检测, 极性展开工具]
related: ["[[CSharp VisionPro 脚本批量测量与结果标注（9.2下午）|CSharp VisionPro 脚本批量测量与结果标注（9.2下午）]]", "[[CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）|CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）]]", "[[CSharp VisionPro 液面高度批量测量与图像处理（9.3上午）|CSharp VisionPro 液面高度批量测量与图像处理（9.3上午）]]"]
---

# VisionPro 轴承滚珠批量测量与极性展开

本节围绕轴承滚珠检测展开。先用模板匹配找到每个滚珠的位置，再用 FindCircle 循环测量每个滚珠的半径；随后引入 `CogPolarUnwrapTool`，把圆环区域展开为平面，用展开后的结果检测缺珠和滚珠间距；最后通过排序后的 X 坐标判断滚珠是否歪斜。

本节的关键经验是：模板匹配结果默认按相似度排序，不能直接把相邻结果当成空间相邻结果。要比较滚珠间距，必须先提取 X 坐标，再排序，再计算相邻差值。

## 案例一：批量测量轴承滚珠半径

### ToolBlock 准备

滚珠数量可能变化，所以先用 CogPMAlign 找到每一个滚珠的位置。课堂选择滚珠中间的轴心区域做模板，并设置：

- 中心原点放在滚珠中心。
- 旋转范围设置为 ±180°。
- 查找数量设置得足够大，例如 10，避免漏掉结果。
- 运行后确认所有滚珠都被匹配到。

再加入 CogFindCircle 工具，把它的圆形搜索区域放到滚珠内缘。先手动调好 FindCircle：

- 搜索角度覆盖 360°。
- 设置合适的内外半径和搜索范围。
- 调整圆环区域的长宽比例。
- 设置投影长度、忽略点数和边缘极性。
- 先让一个滚珠的半径测准，再交给脚本批量移动。

### 脚本获取工具

```csharp
CogPMAlignTool pma1 =
    mToolBlock.Tools["CogPMAlignTool1"] as CogPMAlignTool;
CogFindCircleTool circle1 =
    mToolBlock.Tools["CogFindCircleTool1"] as CogFindCircleTool;
CogGraphicCollection box = new CogGraphicCollection();
```

实际工具名称要以 ToolBlock 中的名称为准。

### 循环移动 FindCircle

模板匹配结果提供当前滚珠的中心坐标。脚本把坐标写入 FindCircle 的可写输入，让圆形搜索区域移动到当前滚珠，再运行工具并读取半径。

```csharp
int count = pma1.Results.Count;
box.Clear();

for (int i = 0; i < count; i++)
{
    double x = pma1.Results[i].GetPose().TranslationX;
    double y = pma1.Results[i].GetPose().TranslationY;

    circle1.Inputs.CaliperSearchRegion
        .CenterX = x;
    circle1.Inputs.CaliperSearchRegion
        .CenterY = y;
    circle1.Run();

    double radius = circle1.Results.GetCircle().Radius;

    CogGraphicLabel label = new CogGraphicLabel();
    label.Text = radius.ToString("F2");
    label.X = x;
    label.Y = y;
    label.Color = CogColorConstants.Green;
    label.Font = new Font("宋体", 18);
    box.Add(label);
}
```

上面用于表达课堂流程。FindCircle 的输入属性名称可能随版本和区域类型不同，实际写代码时要在工具终端中找到圆弧搜索区域的可写 `CenterX`、`CenterY` 或对应的坐标属性。

### 输入路径的查找方法

如果不知道 FindCircle 的输入路径，不要猜属性名。课堂采用了这个方法：

- 在工具界面记录圆弧区域当前的坐标值。
- 打开工具终端，展开 Inputs 或 Run Parameters。
- 找到和界面坐标相同的字段。
- 确认它不是 Results 或只读显示属性。
- 把模板匹配得到的 X、Y 写入这个可写输入。

FindCircle 的结果通过 `Results.GetCircle().Radius` 读取。读取结果前要确认工具运行成功并且确实找到了圆。

## 案例二：CogPolarUnwrapTool 极性展开

轴承滚珠有三类情况：滚珠数量不足、滚珠位置歪斜、滚珠间距不均匀。直接在圆环图像上逐个判断不方便，因此使用极性展开。

### 工具作用

`CogPolarUnwrapTool` 把图像中的圆环区域展开成一张长条形平面图。原来沿圆周分布的滚珠，会在平面图中变成从左到右排列的目标，之后可以用模板匹配、Blob 或其他工具检测。

### 使用步骤

- 将 CogPolarUnwrapTool 拖入 ToolBlock 并连接图像。
- 如果输入是彩色图，先转换为灰度图。课堂中工具提示该操作不支持彩色图像。
- 把区域角度从默认的四分之一范围调整为 360°。
- 设置内圆和外圆的半径，让目标滚珠位于圆环区域内。
- 运行查看展开结果。
- 对展开后的平面图做模板匹配或数量检测。

展开后的结果适合判断：

- 滚珠是否缺少。
- 滚珠之间的间距是否异常。
- 某一个滚珠是否偏离正常位置。

极性展开的核心是坐标变换。它把圆周方向的角度坐标转换为平面图上的横坐标，因此后续可以用普通的 X 坐标差值做判断。

## 案例三：用数量和间距判断滚珠是否合格

课堂样例中，完整轴承应有 10 个滚珠。检测分两层：先判断数量，再判断相邻滚珠的间距。

### 第一步：判断数量

```csharp
int count = pma1.Results.Count;

if (count != 10)
{
    // 显示“缺少珠子”或其他不合格信息
}
```

数量不足时，不需要继续把间距判定当成主要结论，因为目标集合本身已经不完整。

### 第二步：提取并排序 X 坐标

模板匹配结果通常按分数从高到低排列，不保证按图像中的左右位置排列。因此不能直接使用 `Results[i]` 和 `Results[i + 1]` 计算相邻距离。

```csharp
double[] xs = new double[count];

for (int i = 0; i < count; i++)
{
    xs[i] = pma1.Results[i].GetPose().TranslationX;
}

Array.Sort(xs);
```

`Array.Sort(xs)` 默认从小到大排列。排序后，`xs[i]` 和 `xs[i + 1]` 才代表展开图中相邻的两个滚珠。

### 第三步：检查相邻间距

课堂根据样例计算出正常间距大约为 142～143，并设置允许范围 135～150。这个区间只适用于课堂素材，换图像或分辨率后必须重新测量。

```csharp
bool tilted = false;

for (int i = 0; i < count - 1; i++)
{
    double gap = xs[i + 1] - xs[i];

    if (gap < 135 || gap > 150)
    {
        tilted = true;
        break;
    }
}

if (tilted)
{
    // 显示“珠子歪了”
}
```

循环必须写成 `i < count - 1`。如果写成 `i < count`，当 `i` 到最后一个索引时，`xs[i + 1]` 会越界。这正是课堂专门强调的错误。

## 输出检测结论

根据数量和间距结果创建标签：

- 数量不是 10：显示缺少珠子。
- 数量为 10，且所有间距在允许区间内：显示合格。
- 数量为 10，但任一间距超出范围：显示珠子歪了或位置异常。

多个标签统一放进 `CogGraphicCollection`，每轮运行前清空集合，在 `ModifyLastRunRecord` 中集中输出。

```csharp
private CogGraphicCollection box =
    new CogGraphicCollection();

public override void ModifyLastRunRecord(
    Cognex.VisionPro.ICogRecord lastRecord)
{
    foreach (ICogGraphic graphic in box)
    {
        mToolBlock.AddGraphicToRunRecord(
            graphic,
            lastRecord,
            "CogPMAlignTool1.InputImage",
            "");
    }
}
```

第三个参数必须改成实际 Last Run 中存在的图像记录路径。

## 这节课反复出现的坑

- 直接用 PMAlign 结果顺序判断相邻目标：结果按分数排序，必须先取坐标并排序。
- `for (int i = 0; i < count; i++)` 中访问 `xs[i + 1]`：最后一次会越界，应该循环到 `count - 1`。
- FindCircle 输入写错：先在终端中找到可写的圆弧区域坐标属性，不要把只读属性当输入。
- 极性展开输入彩色图：先转灰度，否则工具可能提示不支持图像类型。
- 角度范围仍是四分之一：把极性展开区域角度设为 360°，否则圆环会被截断。
- 未清空 `box`：切换图片后标签重复。
- 固定阈值照搬：135～150 和“10 个滚珠”只对应课堂素材，实际项目需要根据图像重新标定。

## 通用流程

```text
模板匹配找到每个目标
        ↓
获取结果数量与坐标
        ↓
数量判断：是否缺少目标
        ↓
坐标排序：恢复空间顺序
        ↓
计算相邻间距或驱动 FindCircle
        ↓
读取测量结果
        ↓
用标签显示合格、缺少或歪斜
        ↓
ModifyLastRunRecord 输出图形
```

## 原始资料与关联笔记

[[5_System/Attachments/video-20260904-am/转录原文.txt|转录原文]] · [[5_System/Attachments/video-20260904-am/原始字幕.srt|原始字幕]]

课堂截图：

- ![[5_System/Attachments/video-20260904-am/课堂300.jpg]]
- ![[5_System/Attachments/video-20260904-am/课堂1000.jpg]]
- ![[5_System/Attachments/video-20260904-am/课堂1700.jpg]]
- ![[5_System/Attachments/video-20260904-am/课堂2300.jpg]]
- ![[5_System/Attachments/video-20260904-am/课堂2600.jpg]]

- [[CSharp VisionPro 脚本批量测量与结果标注（9.2下午）|C# VisionPro 脚本批量测量与结果标注（9.2下午）]]
- [[CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）|C# VisionPro 脚本绘图与Blob结果标注（9.2上午）]]
- [[CSharp VisionPro 液面高度批量测量与图像处理（9.3上午）|C# VisionPro 液面高度批量测量与图像处理（9.3上午）]]

