---
title: "C# VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）"
category: '缺陷检测案例'
date: "2026-09-08"
processed_date: "2026-09-08"
tags: [机器视觉, CSharp, VisionPro, ToolBlock, CogPatInspect, CogBlob, CogPMAlign, CogGraphicLabel, CogPolygon, 缺陷检测, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.8上午.mp4'
duration: "00:21:06"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；CogPatInspectTool 名称已按课堂画面确认；代码按课堂逻辑整理，未在 VisionPro 中重新编译运行"
transcript: "5_System/Attachments/video-20260908-am/转录原文.txt"
aliases: [9.8上午视频笔记, PatternInspect缺陷检测, Logo缺失检测]
related: ["[[CSharp VisionPro 工具总览（功能与介绍笔记）|CSharp VisionPro 工具总览（功能与介绍笔记）]]", "[[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]]", "[[CSharp VisionPro Blob 斑点工具与颜色分割|CSharp VisionPro Blob 斑点工具与颜色分割]]", "[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]"]
---

# C# VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）

本节案例解决的问题是：前一步只能判断产品是否合格，但如果 Logo 缺了一块，还要把**缺少的位置指出来**。

核心思路是：先用模板匹配找到 Logo 的位置，再用完整的合格 Logo 训练 `CogPatInspectTool`，将实际 Logo 和完整 Logo 做重合比对；差异区域交给 `CogBlobTool`，最后用 C# 脚本显示“合格 / 不合格”，并把缺陷轮廓画到图像上。

```text
原图
  ↓
灰度图
  ↓
CogPMAlignTool：找到 Logo 位置，输出 GuidePose
  ↓
CogPatInspectTool：用完整 Logo 训练，输出 Difference
  ↓
CogBlobTool：统计差异区域
  ↓
CogGraphicLabel + CogPolygon + CogGraphicCollection
  ↓
Run Record：显示合格结果或缺陷轮廓
```

## 一、CogPatInspectTool 解决什么问题

`CogPatInspectTool` 是本节的核心工具。课堂画面中工具箱显示的名称就是这个写法，语音里曾被识别成相近发音，不能按错听的名称记录。

它的基本工作方式是：

- 先准备一张完整、合格的 Logo 作为训练样本。
- 再把实际检测到的 Logo 与这个完整样本进行重合比对。
- 两张图相同的部分不会形成明显差异。
- 不同的部分会输出到 `Difference` 图像中。

在本节 T 恤 Logo 案例里，产品主要问题是 Logo 缺失，所以 Difference 中的差异区域可以作为缺陷候选。要注意：工具输出的是“不同区域”，并不天然等于“缺失区域”；光照变化、脏污、位置偏差和多余图案也可能产生差异，实际项目还要配合 ROI、阈值和面积过滤。

## 二、使用前提：先做模板匹配

### 1. 为什么要先做 PMAlign

多张产品图中，Logo 的位置可能发生变化。`CogPatInspectTool` 不能只拿一块固定坐标去比较，所以需要先用 `CogPMAlignTool` 找到当前图像中 Logo 的位置。

模板匹配的重点不是只框住 T 恤，而是把模板的中心原点放到**真正要检测的 Logo 中心**。这样输出的 `GuidePose` 才能代表 Logo 的位置和姿态。

### 2. 推荐连接

```text
Image Source
    ↓
CogImageConvertTool       （彩色转灰度）
    ├─→ CogPMAlignTool     （匹配 Logo，输出 GuidePose）
    └─→ CogPatInspectTool  （输入灰度图）

CogPMAlignTool.GuidePose
    └─→ CogPatInspectTool.Pose
```

本节课堂要求输入灰度图。彩色原图先经过 `CogImageConvertTool` 转换，再连接到模板匹配和 PatternInspect；不要把彩色图直接接给只接受灰度输入的工具。

## 三、训练 CogPatInspectTool

把工具拖入 ToolBlock 后，按下面的顺序训练：

1. 先确认灰度图已经接入，并且 PMAlign 能找到 Logo。
2. 将 PMAlign 的 `GuidePose` 连接到 PatternInspect 的 `Pose`。
3. 进入 `CogPatInspectTool` 的 Pattern / 训练页面。
4. 点击抓取训练图像，选择一张完整、合格的 Logo 图像。
5. 用训练区域框住需要检查的 Logo 部分。
6. 点击训练或训练新 Pattern，让工具记住完整 Logo 的外观。
7. 运行项目，在 `Last Run` 中查看 `Difference` 结果。

训练样本必须是合格的完整 Logo。用缺 Logo 的图片训练，工具就会把缺口也当成“正常样子”，后面的检测会失去意义。

## 四、Difference 结果怎么看

训练图像本身与完整模板一致，所以 Difference 中通常没有明显内容。切换到其他图片后：

- 如果实际 Logo 与完整 Logo 一致，Difference 基本为空。
- 如果 Logo 缺了一块，差异位置会被标出来。
- 缺了多处，就可能出现多个差异斑点。

因此，PatternInspect 更像“找不同”：它负责把不同区域提出来；是否判定为缺陷、缺陷有几个、缺陷轮廓如何显示，可以继续交给 Blob 和脚本处理。

## 五、保存和加载训练模式

PatternInspect 的训练图像 / Pattern 可以保存，也可以在下次使用时加载。这样在联合编程或反复调用工具时，不必每次重新抓图和训练。

推荐做法：

- 训练确认无误后，把当前 Pattern 保存成文件。
- 项目重新打开或程序初始化时，加载已保存的 Pattern。
- 如果发现模板丢失，先检查是否需要重新加载，不要立刻重复训练。

课堂中提到的是保存、加载训练模式文件；具体文件扩展名和保存按钮名称以本机 VisionPro 版本为准。相机、镜头、检测区域或产品发生变化时，旧 Pattern 仍需要重新评估，不能盲目复用。

## 六、用 CogBlobTool 判断是否有缺陷

### 1. Blob 的输入

把 PatternInspect 的 `Difference` 图像接到 `CogBlobTool`。课堂中把差异处理成**黑底白点**，让差异区域成为 Blob 可以识别的前景。

```text
CogPatInspectTool.Difference
    ↓
黑底白点的差异图
    ↓
CogBlobTool
```

### 2. 判断逻辑

判断重点是 Blob 结果数量：

- `GetBlobs().Count == 0`：没有差异区域，当前样本判为合格。
- `GetBlobs().Count > 0`：找到了差异区域，当前样本判为不合格。

课堂逻辑可以写成下面这样。工具名、输入名要按 ToolBlock 中的实际名称调整；这段是结构示意，未在本机 VisionPro 中重新编译运行：

```csharp
CogBlobTool blob1 =
    mToolBlock.Tools["CogBlobTool1"] as CogBlobTool;

int defectCount = blob1.Results.GetBlobs().Count;

if (defectCount == 0)
{
    // 合格：显示“合格”
}
else
{
    // 不合格：显示“不合格”，并绘制每个 Blob 的轮廓
}
```

如果实际图像有噪声，不能只依赖“数量不为零”。生产项目通常还要加 ROI、最小面积、灰度阈值或形态学处理，避免一个小噪点就把产品判成不合格。

## 七、用脚本显示文字和缺陷轮廓

### 1. `CogGraphicLabel` 显示结果

合格时显示“合格”，不合格时显示“不合格”。标签可以设置文字、位置、颜色和字体：

```csharp
CogGraphicLabel label = new CogGraphicLabel();
label.Text = "合格";       // 不合格分支改成“不合格”
label.X = 200;
label.Y = 200;
label.Color = CogColorConstants.Blue;
label.Font = new Font("宋体", 24);
```

标签坐标只是课堂素材中的示例值，换图像尺寸或显示区域后要重新调整。

### 2. `CogPolygon` 描出 Blob 边界

不合格时，除了文字，还要把缺陷位置圈出来。处理流程是：

1. 遍历 `blob1.Results.GetBlobs()` 中的所有 Blob。
2. 读取每个 Blob 的边界。
3. 创建对应的 `CogPolygon`。
4. 将边界点交给多边形对象。
5. 设置线条颜色和粗细，让缺陷轮廓更容易看见。

Blob 可能不止一个，所以这里必须用循环，不能只处理 `Results[0]`。

### 3. `CogGraphicCollection` 集中管理图形

课堂脚本用 `CogGraphicCollection` 收集文字和多边形：

```csharp
private CogGraphicCollection graphics =
    new CogGraphicCollection();
```

每次运行前先清空集合，避免连续运行时上一张图的标注残留：

```csharp
graphics.Clear();
```

然后按分支加入图形：

- 合格：加入“合格”标签。
- 不合格：加入“不合格”标签和所有缺陷多边形。

### 4. 输出到 Run Record

最后遍历 `CogGraphicCollection`，使用 `AddGraphicToRunRecord` 把每个图形写到运行记录。这样操作者在图像窗口中才能同时看到：

- 合格 / 不合格文字。
- 缺陷 Blob 的轮廓。
- 对应的运行图像。

实际输出要确认当前版本的 Last Run Record 图像节点。不要死记某一个记录路径；课堂里使用了转换工具的输入图像作为示例输出位置，换项目后要重新选择正确的图像记录。

## 八、完整案例逻辑

```text
1. Image Source 输入产品图
2. CogImageConvertTool 转灰度
3. CogPMAlignTool 匹配 T 恤 / Logo 位置
4. 将 GuidePose 连接到 CogPatInspectTool.Pose
5. 用完整 Logo 训练 CogPatInspectTool
6. 读取 Difference 差异图
7. CogBlobTool 找出差异斑点
8. Blob 数量为 0 → 合格
9. Blob 数量不为 0 → 不合格
10. CogGraphicLabel 显示判定文字
11. CogPolygon 绘制每个差异 Blob 的轮廓
12. CogGraphicCollection 统一收集
13. AddGraphicToRunRecord 输出到运行记录
```

本节案例的本质是：`CogPatInspectTool` 负责“找不同”，`CogBlobTool` 负责“把不同区域变成可统计的结果”，C# 脚本负责“判定、标注和显示”。

## 九、常见坏人

- 彩色图直接连接 PatternInspect：先用 `CogImageConvertTool` 转灰度。
- 没有先做 PMAlign：PatternInspect 没有稳定的 `Pose`，目标移动后就无法正确比对。
- PMAlign 的中心放在 T 恤而不是 Logo：定位基准错，差异区域会跟着偏。
- 用不合格 Logo 训练 Pattern：缺陷会被训练成正常特征。
- 只看原图，不看 `Difference`：真正交给 Blob 的是差异图。
- 训练后不保存 Pattern：重新打开项目或联合编程时可能需要重新训练，先尝试加载已保存模式。
- 只判断是否有结果，不做面积过滤：噪点也可能被判为缺陷。
- 只绘制第一个 Blob：缺陷可能有多个，必须遍历全部 Blob。
- 不清空 `CogGraphicCollection`：连续运行会出现旧标注叠加。
- 只创建标签和多边形，不调用 `AddGraphicToRunRecord`：脚本对象存在，但图像窗口看不到。
- 把 Difference 当成“只代表缺失”：它表示两张图的差异，光照、脏污和其他外观变化也可能触发。

## 十、复习练习

- 准备一张完整 Logo 和几张缺失不同位置的 Logo，观察 Difference 的变化。
- 把 PMAlign 的中心从 Logo 移开，再观察 PatternInspect 的差异结果为什么变乱。
- 保存训练 Pattern，关闭并重新打开项目，练习加载而不是重新训练。
- 给 Difference 增加最小面积过滤，比较过滤前后的 Blob 数量。
- 制造两个缺陷区域，确认脚本能循环绘制两个 `CogPolygon`。
- 连续运行多张图片，确认每次运行前清空图形集合，且 Run Record 中没有旧轮廓残留。

## 原始资料与课堂截图

- 视频：`D:\BaiduNetdiskDownload\14班9.8上午.mp4`
- 时长：21 分 06 秒
- [[5_System/Attachments/video-20260908-am/转录原文.txt|转录原文]]
- [[5_System/Attachments/video-20260908-am/原始字幕.srt|原始字幕]]

课堂截图：

- ![[5_System/Attachments/video-20260908-am/课堂90.jpg]]
- ![[5_System/Attachments/video-20260908-am/课堂300.jpg]]
- ![[5_System/Attachments/video-20260908-am/课堂540.jpg]]
- ![[5_System/Attachments/video-20260908-am/课堂780.jpg]]
- ![[5_System/Attachments/video-20260908-am/课堂1020.jpg]]
- ![[5_System/Attachments/video-20260908-am/课堂1200.jpg]]

## 关联链接

- [[CSharp VisionPro 工具总览（功能与介绍笔记）|C# VisionPro 工具总览（功能与介绍笔记）]]
- [[CSharp VisionPro 工具大整理（全工具清单）|C# VisionPro 工具大整理（全工具清单）]]
- [[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|C# VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]]
- [[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]]
- [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]
- [[CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）|C# VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）]]
