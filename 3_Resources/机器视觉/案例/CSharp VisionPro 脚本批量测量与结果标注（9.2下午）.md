---
title: "VisionPro 脚本批量测量与结果标注"
category: '脚本与ToolBlock'
date: "2026-09-02"
processed_date: "2026-09-05"
tags: [机器视觉, CSharp, VisionPro, ToolBlock, CogPMAlign, CogFindCircle, CogCaliper, Measurement, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.2下午.mp4'
duration: "01:07:03"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；示例代码按课堂讲解整理，未在 VisionPro 中编译运行"
transcript: "5_System/Attachments/video-20260902-pm/转录原文.txt"
aliases: [9.2下午视频笔记, VisionPro批量测量, 脚本操控测量工具]
related: ["[[CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）|CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）]]", "[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]", "[[CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）|CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）]]"]
---

# VisionPro 脚本批量测量与结果标注

本节把脚本从“显示 Blob 结果”推进到“批量操控测量工具”。课堂包含三个案例：用 CogPMAlign 判断电池正反面；用 FindCircle、CogPMAlign 和点到点距离工具测量齿轮每个齿间到圆心的距离；用 Blob 和 Caliper 循环测量多个柱子的高度。

核心套路是：先在 ToolBlock 里把图像、区域和工具准备好，再在高级脚本中获取工具；遍历模板匹配或 Blob 结果；把当前坐标写入测量工具输入；运行测量工具；读取结果；最后用 CogGraphicLabel 和 CogGraphicCollection 把结果显示到正确的图像记录。

## 先记住脚本的三处位置

VisionPro ToolBlock Advanced Script 通常把逻辑分成三处：

- private 成员区：保存工具字段和 `CogGraphicCollection` 集合。
- `GroupRun`：获取工具、循环结果、修改输入、运行工具、读取结果、创建文字。
- `ModifyLastRunRecord`：把集合中的文字或图形添加到 Last Run 的目标图像上。

每次运行前清空集合，例如 `box.Clear()`。否则切换到下一张图片时，上一张图的标签可能还留在集合里，结果会重复。

## 案例一：判断电池正面还是反面

电池整体两面可能都能被模板匹配到，直接匹配整体无法可靠区分正反。课堂改用正面独有的二维码作为模板：

- 训练正面二维码的 CogPMAlign 模板。
- 正面有二维码，能找到匹配结果。
- 反面没有二维码，结果数量为 0。
- `Results.Count == 0` 时判定为反面；大于 0 时判定为正面。

示意逻辑：

```csharp
CogPMAlignTool pma1 =
    mToolBlock.Tools["CogPMAlignTool1"] as CogPMAlignTool;
int count = pma1.Results.Count;

CogGraphicLabel label = new CogGraphicLabel();
label.Text = count == 0 ? "反面" : "正面";
label.X = 200;
label.Y = 200;
box.Add(label);
```

这类判断的关键是寻找只存在于目标状态中的特征。模板匹配本身只是“有没有找到这个特征”，正反面的业务含义由脚本条件决定。

## 案例二：齿轮齿间到圆心的距离

齿轮案例要求计算每个齿间点到齿轮圆心的距离。课堂先搭 ToolBlock，再进入脚本批量操作。

### ToolBlock 里的准备

先用 FindCircle 找到齿轮圆心。再用 CogPMAlign 找到每个齿或齿间特征，并把查找数量设得足够大、接受阈值调到能排除干扰结果。课堂示例最终得到约 62 个齿的匹配结果。

然后放入 Measurement 中的点到点距离工具，把圆心作为固定起点，把模板匹配的结果点作为可变终点。输入端和结果端的实际名称要在 ToolBlock 的终端或工具列表中查看，不要凭记忆猜属性名。

### 脚本获取两个工具

```csharp
CogPMAlignTool pma1 =
    mToolBlock.Tools["CogPMAlignTool1"] as CogPMAlignTool;
CogDistancePointPointTool distanceTool =
    mToolBlock.Tools["CogDistancePointPointTool1"]
    as CogDistancePointPointTool;
```

工具名称必须替换为你自己的实际名称。工具数量和结果数量是两件事：`Tools["..."]` 取的是工具；`pma1.Results[i]` 取的是这个工具产生的第 `i` 个结果。

### 遍历匹配结果并测量

课堂使用模板匹配结果中的 `TranslationX` 和 `TranslationY` 作为当前齿间点，把它们写入距离工具的输入，然后主动运行距离工具。

```csharp
int count = pma1.Results.Count;
for (int i = 0; i < count; i++)
{
    double x = pma1.Results[i].GetPose().TranslationX;
    double y = pma1.Results[i].GetPose().TranslationY;

    distanceTool.Inputs.EndX = x;
    distanceTool.Inputs.EndY = y;
    distanceTool.Run();

    double distance = distanceTool.Results.Distance;

    CogGraphicLabel label = new CogGraphicLabel();
    label.Text = distance.ToString("F2");
    label.Color = CogColorConstants.Green;
    label.Font = new Font("宋体", 12);
    label.X = x;
    label.Y = y;
    box.Add(label);
}
```

上面的属性名是课堂逻辑的整理示意。不同 VisionPro 版本或工具类型的输入、输出命名可能不同，最终以 ToolBlock 终端显示的可写输入和可读结果为准。

### 计算平均距离

把每次测得的距离累加到 `sum`，循环结束后再除以结果数量：

```csharp
double sum = 0;

for (int i = 0; i < count; i++)
{
    // 更新距离工具输入并运行，得到 distance
    sum += distance;
}

double average = count > 0 ? sum / count : 0;
```

平均值文字应在循环结束后创建一次，否则会为每个齿重复创建平均值标签。

## 案例三：用 Caliper 循环测量多个柱子高度

课堂把原本只能测一个数字高度的案例改成同时测量七个柱子。思路和齿轮案例相同：Blob 先找出每个柱子，脚本逐个把柱子的坐标写入 Caliper 区域，再运行 Caliper，读取边缘距离。

### ToolBlock 预处理

先把彩色图转换为灰度图，再用 Blob 和形态学开运算去掉干扰，让七个柱子独立出来。预处理能在工具界面完成的内容先完成，避免把不必要的区域变换交给脚本。

把处理后的图像通过终端连接给 Caliper。手动先调好 Caliper 的方向、旋转角、极性、边缘对宽度和扫描范围，确认一个工具位置能够测出柱子高度。

### 找到 Caliper 的可写坐标输入

课堂专门演示了查找工具输入的过程：工具界面显示的坐标值不等于每个同名属性都可写。`Region` 下面的某些 `Corner...` 属性可能是只读，不能直接赋值。最后通过逐项查看终端，找到可写的 `CenterX` 和 `CenterY`，用它们移动 Caliper 的中心位置。

遇到“属性是只读”的错误时：

- 先确认当前属性属于 Inputs，而不是 Results 或只读状态属性。
- 展开工具的终端列表，观察哪些字段有输入连接。
- 用工具界面里的坐标值和终端中的默认值对照。
- 找到可写属性后再在脚本中赋值，并重新生成检查。

### 循环移动 Caliper 并读取宽度

```csharp
CogBlobTool blob1 =
    mToolBlock.Tools["CogBlobTool1"] as CogBlobTool;
CogCaliperTool caliper1 =
    mToolBlock.Tools["CogCaliperTool1"] as CogCaliperTool;

int count = blob1.Results.GetBlobs().Count;
box.Clear();

for (int i = 0; i < count; i++)
{
    double x = blob1.Results.GetBlobs()[i].CenterOfMassX;

    caliper1.Region.CenterX = x;
    caliper1.Run();

    double height = caliper1.Results[0].Width;

    CogGraphicLabel label = new CogGraphicLabel();
    label.Text = height.ToString("F2");
    label.Color = CogColorConstants.Blue;
    label.Font = new Font("宋体", 24);
    label.X = x;
    label.Y = 200;
    box.Add(label);
}
```

这里的 `Results[0]` 是 Caliper 返回的第一组边缘结果，不是第一个工具。若 Caliper 配置了多个边缘对，应根据实际结果集合选择对应索引，并先检查结果数量。

### 结果显示

在 `ModifyLastRunRecord` 中遍历 `box`，把每个标签加到处理后的图像记录上。记录路径要从 Last Run 树中确认，例如可能是 Blob 或前处理工具的 `InputImage`，不能把示例路径原样套到所有项目。

```csharp
public override void ModifyLastRunRecord(ICogRecord lastRecord)
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

## 反复出现的坑

- `box` 没有 `Clear()`：切图后旧标签继续显示。
- `i <= count`：最后一次会访问不存在的结果，应该使用 `i < count`。
- 工具名写错：`mToolBlock.Tools["工具名"]` 可能直接抛索引异常，先核对 ToolBlock 中的实际名称。
- 读写方向搞反：Results 用来读，Inputs 用来写；只读属性不能赋值。
- 路径写错：`AddGraphicToRunRecord` 的第三个参数必须是当前 Last Run 中存在的图像记录路径。
- 把固定圆心也跟着循环移动：齿轮案例中圆心由 FindCircle 得到，通常作为固定起点，只有模板匹配的齿间点随循环变化。
- 没有检查结果数量：读取 `Results[0]` 前要确认集合中确实有结果。

## 这节课的通用流程

```text
ToolBlock 预处理与工具配置
        ↓
高级脚本获取工具
        ↓
遍历 Blob 或 PMAlign 结果
        ↓
把当前坐标写入测量工具 Inputs
        ↓
运行测量工具
        ↓
读取 Results
        ↓
创建标签并加入 CogGraphicCollection
        ↓
ModifyLastRunRecord 叠加到正确图像
```

## 原始资料与关联笔记

[[5_System/Attachments/video-20260902-pm/转录原文.txt|转录原文]] · [[5_System/Attachments/video-20260902-pm/原始字幕.srt|原始字幕]]

课堂截图：

- ![[5_System/Attachments/video-20260902-pm/课堂300.jpg]]
- ![[5_System/Attachments/video-20260902-pm/课堂800.jpg]]
- ![[5_System/Attachments/video-20260902-pm/课堂1800.jpg]]
- ![[5_System/Attachments/video-20260902-pm/课堂3000.jpg]]
- ![[5_System/Attachments/video-20260902-pm/课堂3800.jpg]]

- [[CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）|C# VisionPro 脚本绘图与Blob结果标注（9.2上午）]]
- [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]
- [[CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）|C# VisionPro Blob脚本与胶囊豆类识别（9.1下午）]]

