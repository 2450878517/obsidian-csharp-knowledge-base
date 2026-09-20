---
title: "VisionPro Blob脚本与胶囊豆类识别"
category: '脚本与ToolBlock'
date: "2026-09-01"
processed_date: "2026-09-04"
tags: [机器视觉, CSharp, VisionPro, Blob, ToolBlock, CogGraphicCollection, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.1下午.mp4'
duration: "00:56:09"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对，非逐帧校对"
transcript: "5_System/Attachments/video-20260901-pm/转录原文.txt"
aliases: [9.1下午视频笔记, 胶囊逐个标注, 豆类识别]
related: ["[[CSharp VisionPro Blob脚本与胶囊检测（9.1上午）|CSharp VisionPro Blob脚本与胶囊检测（9.1上午）]]", "[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]", "[[CSharp VisionPro Blob 斑点工具与颜色分割|CSharp VisionPro Blob 斑点工具与颜色分割]]"]
---

# VisionPro Blob脚本与胶囊豆类识别

本节把上一课的“统计数量”推进成“逐个对象标注”。Blob 得到每个斑点后，在循环里为每个斑点创建一个 `CogGraphicLabel`，按面积写入“合格”或“不合格”，再把文字放到该斑点的中心坐标。后半段把同样的模式用于豆类识别：先用 ROI 和最小面积清掉干扰，再按面积区间标注小豆、中豆和大豆。

原文保留在 [[5_System/Attachments/video-20260901-pm/转录原文.txt|转录原文]]，字幕保留在 [[5_System/Attachments/video-20260901-pm/原始字幕.srt|原始字幕]]。正文按知识点整理，尽量不放时间节点；代码和阈值是课堂素材的示例，换图像、分辨率或前处理参数后要重新核验。

## 小划块：从总数统计到逐个标注

前处理仍放在 ToolBlock 中：用 Blob 把前景物块提取出来，课堂示例选择黑底白点，并过滤物块内部不需要的孔洞。小划块的合格面积示例为 `114`；面积不等于这个值就判为不合格。这个精确值只适用于课堂素材，实际工程应根据面积分布设置容差或区间。

```csharp
CogBlobTool blob1 =
    mToolBlock.Tools["CogBlobTool1"] as CogBlobTool;
int res1 = blob1.Results.GetBlobs().Count;
int hege = 0;
int buhege = 0;

for (int i = 0; i < res1; i++)
{
    double area = blob1.Results.GetBlobs()[i].Area;
    if (area == 114)
        hege++;
    else
        buhege++;
}
```

如果只显示总数，一个固定的 `CogGraphicLabel` 就够用；如果要让其他人员直接看出每个物块的状态，就必须在循环中创建多个文字对象，并为每个对象设置自己的位置。

## 胶囊：每个 Blob 对应一个文字对象

课堂把完整胶囊和不完整胶囊按面积区分，示例分界是 `3000`：面积大于等于 `3000` 写“合格”，否则写“不合格”。文字统一使用蓝色、宋体 24 号；位置取当前 Blob 的 `CenterOfMassX` 和 `CenterOfMassY`，这样切换图片后文字仍跟着对象移动。

```csharp
CogBlobTool blob1 =
    mToolBlock.Tools["CogBlobTool1"] as CogBlobTool;
int res1 = blob1.Results.GetBlobs().Count;

// 每次运行前清理上一张图的文字，避免标签累积
box.Clear();

for (int i = 0; i < res1; i++)
{
    CogGraphicLabel label = new CogGraphicLabel();
    if (blob1.Results.GetBlobs()[i].Area >= 3000)
        label.Text = "合格";
    else
        label.Text = "不合格";

    label.Font = new Font("宋体", 24);
    label.Color = CogColorConstants.Blue;
    label.X = blob1.Results.GetBlobs()[i].CenterOfMassX;
    label.Y = blob1.Results.GetBlobs()[i].CenterOfMassY;
    box.Add(label);
}
```

循环上限用 `res1`，不要把检测数写死为 15，也不要用 `i <= res1`。每次取结果的路径是 `GetBlobs()[i].Area`；索引访问的是当前循环的 Blob。

![胶囊逐个标注代码](../../5_System/Attachments/video-20260901-pm/胶囊逐个标注代码.png)

## 为什么要用 CogGraphicCollection

`GroupRun` 和 `ModifyLastRunRecord` 是不同的方法。循环里创建的局部 `label` 不能直接在第三处逐个取出；把它们放进类字段集合，就能跨方法传递。课堂把集合当作“盒子”：第一处创建，第二处添加，第三处遍历输出。

```csharp
// 第一处：脚本类成员区
private CogGraphicCollection box =
    new CogGraphicCollection();

// 第二处：每次运行先清空，再在循环中 box.Add(label)
box.Clear();
box.Add(label);

// 第三处：ModifyLastRunRecord 中统一输出
foreach (ICogGraphic it in box)
{
    mToolBlock.AddGraphicToRunRecord(
        it, lastRecord, "CogBlobTool1.InputImage", "");
}
```

实际目标记录路径要以 ToolBlock 的运行记录为准；如果标签叠加到了错误图像，先检查 `AddGraphicToRunRecord` 的图像路径。切换素材后文字越来越多，原因通常是集合保存了上次运行的对象，修复点就是在生成新标签前调用 `box.Clear()`。

![集合输出与清空](../../5_System/Attachments/video-20260901-pm/集合输出与清空.png)

## 豆类识别：ROI、最小面积与面积区间

豆类案例先用 Blob 提取轮廓。画面左上角的干扰会影响结果，因此把检测区域从整幅图改成多边形 ROI，刻意避开干扰区；再用最小面积去掉很小的噪点，课堂画面示例使用约 `1000`。

![豆类 Blob 结果](../../5_System/Attachments/video-20260901-pm/豆类Blob结果.png)

课堂根据 Blob 面积把对象分成三个区间：小豆不超过 `15000`，中豆大于 `15000` 且小于 `50000`，剩余的大面积对象归为大豆。截图中的注释和代码都围绕这两个分界值；边界值 `15000`、`50000` 在实际项目中要统一采用 `<=` 或 `<`，并用真实样本复核。

```csharp
for (int i = 0; i < res1; i++)
{
    CogGraphicLabel label = new CogGraphicLabel();
    double area = blob1.Results.GetBlobs()[i].Area;

    if (area <= 15000)
        label.Text = "小豆";
    else if (area < 50000)
        label.Text = "中豆";
    else
        label.Text = "大豆";

    label.Font = new Font("宋体", 24);
    label.Color = CogColorConstants.Blue;
    label.X = blob1.Results.GetBlobs()[i].CenterOfMassX;
    label.Y = blob1.Results.GetBlobs()[i].CenterOfMassY;
    box.Add(label);
}
```

课堂演示曾把 `15000` 误写成 `150000`，结果几乎全部被判成小豆。遇到分类全同的现象，先检查分支常量和比较方向，再检查 Blob 前处理是否改变了面积。

![豆类阈值代码](../../5_System/Attachments/video-20260901-pm/豆类阈值代码.png)

## 可迁移的脚本模式

胶囊逐个标注、豆类识别和后续线缆颜色标注使用同一套结构：前处理工具得到 Blob；`GetBlobs()` 得到结果集合；循环中按属性生成文字；用中心坐标定位；用 `CogGraphicCollection` 跨方法保存；在 `ModifyLastRunRecord` 统一输出。线缆颜色案例只需把前面的颜色分割分别配置成黑、红、灰，再复用这套逐对象标注逻辑。

### 复习检查

- 为什么每次运行前要 `box.Clear()`？
- `CenterOfMassX/Y` 解决了固定坐标文字的什么问题？
- 为什么最小面积不能直接拿来当合格面积分界？
- 如果一个对象被分割成两个 Blob，数量和面积分类会出现什么偏差？

## 前后衔接

上一课：[[CSharp VisionPro Blob脚本与胶囊检测（9.1上午）|C# VisionPro Blob脚本与胶囊检测（9.1上午）]]。前置知识：[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]、[[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]]。

返回 [[机器视觉知识地图]] 或 [[5_System/课程视频索引]]。视频文件和带时间戳的原始转录保留；本文完成的是全段转录、结构化笔记与关键画面核验，自动转录仍可能把英文类名听成近音词。

