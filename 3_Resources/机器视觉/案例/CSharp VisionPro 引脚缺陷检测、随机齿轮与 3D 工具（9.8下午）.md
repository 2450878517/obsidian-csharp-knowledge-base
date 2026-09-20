---
title: "C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）"
category: '综合缺陷与三维案例'
date: "2026-09-08"
processed_date: "2026-09-08"
tags: [机器视觉, CSharp, VisionPro, ToolBlock, CogBlob, CogPMAlign, CogPolarUnwrap, CogCopyRegion, Cog3D, 引脚检测, 齿轮检测, 3D测量, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.8下午.mp4'
duration: "01:23:13"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；引脚脚本和 3D 工具名称按课堂画面确认，代码与参数按课堂逻辑整理，未在 VisionPro 中重新编译运行"
transcript: "5_System/Attachments/video-20260908-pm/转录原文.txt"
aliases: [9.8下午视频笔记, 引脚缺陷检测, 随机齿轮检测, VisionPro 3D工具]
related: ["[[CSharp VisionPro 工具总览（功能与介绍笔记）|CSharp VisionPro 工具总览（功能与介绍笔记）]]", "[[CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）|CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）]]", "[[CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）|CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）]]", "[[CSharp VisionPro 表盘指针识别与时间读取（9.7下午）|CSharp VisionPro 表盘指针识别与时间读取（9.7下午）]]"]
---

# C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）

本节分成两大块：先做电子元件引脚检测，再介绍随机齿轮和 3D Range Image 工具。引脚案例要判断四种表现：缺少引脚、引脚倾斜、引脚偏高、引脚偏低。

## 一、引脚检测总流程

1. 用 CogBlobTool 提取上半部分引脚。
2. 读取每个 Blob 的 CenterOfMassX，排序后判断引脚间距。
3. 相邻 X 间距异常，标记缺少引脚。
4. 用 CogPMAlignTool 的 Rotation 判断引脚是否倾斜。
5. 用 Blob 的 Perimeter 或 Area 判断引脚偏高、偏低。
6. 用 CogGraphicLabel 写结果，用 CogGraphicCollection 收集图形，最后 AddGraphicToRunRecord 输出到图像。

课堂只检测上半部分引脚。下半部分会干扰 Blob 结构，所以先把 Blob 的区域限制在上半边。

## 二、CogBlobTool 提取引脚

### 1. 区域和极性

直接对整张图做 Blob，会把上下两排引脚混在一起，而且上半部分可能检测不完整。给 Blob 设置只覆盖上半部分的区域，让下半部分不进入当前检测。

课堂主要设置：

- 极性：黑底白点，让亮色引脚成为前景。
- 模式：固定阈值。
- 阈值：课堂示例约 80，把偏灰的引脚也纳入前景。
- 开运算：削掉毛刺和小噪声，避免引脚之间错误粘连。
- 最小面积：排除剩余干扰斑点。

80、面积和周长阈值都只对应课堂素材。换相机、光源、曝光或产品后，要重新观察灰度和 Blob 结果。

## 三、判断缺少引脚

### 1. 先排序 X 坐标

Blob 结果默认可能按面积顺序返回，不代表从左到右。要判断相邻引脚距离，先读取 CenterOfMassX，放进数组，再用 Array.Sort 排序。

课堂脚本结构：

    CogBlobTool blob1 =
        mToolBlock.Tools["CogBlobTool1"] as CogBlobTool;

    int res1 = blob1.Results.GetBlobs().Count;
    double[] xs = new double[res1];

    for (int i = 0; i < res1; i++)
    {
        xs[i] = blob1.Results.GetBlobs()[i].CenterOfMassX;
    }

    Array.Sort(xs);

### 2. 判断中间引脚

正常引脚的 X 间距约为 43~45。课堂先用 40~50，再考虑倾斜引脚造成的干扰，把上限调整到约 65。实际项目应通过正常样本重新统计。

相邻差值是 xs[i + 1] - xs[i]。如果差值超过阈值，说明两个引脚之间可能少了一个或多个引脚。课堂先标记“缺少引脚”，不强行判断到底少了几根。

缺陷文字的 X 坐标可以放在两个引脚的中点：

    (xs[i + 1] + xs[i]) / 2

### 3. 判断最前和最后的引脚

只检查相邻差值，会漏掉第一根或最后一根缺失，所以还要单独判断两端：

- 第一根引脚的 xs[0] 大于课堂样本起始阈值，约 50，认为最左侧缺少引脚。
- 最后一根引脚的 xs[res1 - 1] 小于课堂样本终止阈值，约 470，认为最右侧缺少引脚。

两端缺陷的标签 X 可以放在预估首端和末端位置，Y 取引脚中心高度。

最容易坏的是数组下标：如果有 5 个元素，合法下标是 0~4，最后一个必须用 res1 - 1，不能写成 xs[res1]。

## 四、判断引脚倾斜

### 1. 用 PMAlign 的 Rotation

选一根比较正的引脚训练 CogPMAlignTool，再让它寻找其他引脚。为了减少误匹配：

- 搜索区域只覆盖上半部分引脚。
- 旋转范围根据产品实际情况设置，课堂示例约为 ±80°。
- 必要时拉长模板，或更换亮度稳定的模板。
- 调整接受阈值和重叠参数，排除重复结果。

画面中的属性浏览器确认了结果路径类似：

    Results.Item[0].GetPose().Rotation

### 2. 弧度转角度

Rotation 通常以弧度表示。先乘 180 除以 Math.PI，再取绝对值：

    double radian = pma1.Results[i].GetPose().Rotation;
    double angle = radian * 180.0 / Math.PI;
    double absAngle = Math.Abs(angle);

课堂用绝对值大于 4° 作为倾斜判断线。这个阈值需要根据正常引脚的角度波动重新确定。

倾斜时用当前 PMAlign 结果的 TranslationX 和 TranslationY 放置“引脚倾斜”标签，正常引脚不添加缺陷文字。

## 五、判断引脚偏高或偏低

引脚变长、偏高时，Blob 的面积和周长通常会变大；引脚变短、偏低时，面积和周长会变小。

课堂先讨论面积，再在最终脚本中使用 Perimeter：

    double perimeter =
        blob1.Results.GetBlobs()[i].Perimeter;

    if (perimeter > 245)
    {
        // 引脚偏高
    }
    else if (perimeter < 150)
    {
        // 引脚偏低
    }

课堂观察到的参考范围：

- 正常周长约 200 多。
- 偏高可能超过 245。
- 偏低可能小于 150。
- 面积也讨论过约 1350 以上偏高、900~1000 以下偏低。

面积和周长不必同时使用，应选择对当前成像更稳定的指标。上述值全部是课堂素材参数。

## 六、用脚本统一输出

本节继续使用 CogGraphicLabel、CogGraphicCollection 和 AddGraphicToRunRecord：

- 每次运行前清空图形集合，避免上一张图的标签残留。
- 一个缺陷结果对应一个文字标签。
- 一次运行可能有多个缺陷，相关判断要放进循环。
- 最后遍历图形集合，把标签输出到原图或正确的 Last Run Record 图像节点。

课堂脚本的结构可以记成：

    private CogGraphicCollection box =
        new CogGraphicCollection();

    // 每次运行前
    box.Clear();

    // 发现缺陷后
    box.Add(label);

    // 最后遍历 box
    mToolBlock.AddGraphicToRunRecord(
        graphic, lastRecord, "正确的图像记录路径", "");

这里的工具名称、lastRecord 和图像记录路径要按当前 ToolBlock 实际结构调整。

## 七、随机齿轮：用 CogPolarUnwrapTool 动态数齿

随机齿轮的难点是大小、位置和齿数都可能不同，不能提前写死一个固定大小的极性展开区域。

推荐流程：

1. 用 Blob 找出每个齿轮，取得中心和面积。
2. 把 Blob 面积近似看成圆面积，反推出齿轮半径。
3. 必要时把半径放大约 1.1 倍，确保展开区域包住所有齿。
4. 根据每个齿轮的中心和半径，动态修改 CogPolarUnwrapTool 的环形区域。
5. 每次只展开一个齿轮，再用 Blob 统计展开图上的齿数。
6. 循环处理所有齿轮，得到各自的齿数。

基本关系：

    面积 ≈ π × 半径²
    半径 ≈ √(面积 / π)
    展开半径 ≈ 半径 × 1.1

极性展开工具是一个圆环区域。课堂示例中内半径约为外半径的 0.85 倍。具体属性名称、起始角度和方向要按当前版本确认。

这种方法适合不同大小的齿轮；缺点是展开边界或噪声可能让齿数多一个，需要调环形区域、过滤小 Blob 或单独判断异常结果。

## 八、随机齿轮：用 CogCopyRegionTool 覆盖内部

课堂画面确认的工具名是 CogCopyRegionTool，节点包括 InputImage、DestinationImage 和 OutputImage。

思路是：

- 从图像中选一块空白区域。
- 把空白内容复制到齿轮内部。
- 盖住齿轮主体，只留下外圈齿尖。
- 再用 Blob 统计剩余齿尖数量。

这种方式不需要完整展开每个齿轮，但区域和复制位置更难设计。连续运行时要清空上一轮结果，避免重复标注或重复统计。

## 九、3D Range Image 工具

### 1. 3D 图像

VisionPro 自带的 3D Range Image 素材从俯视角看像普通灰度图，但灰度 / 高度值还携带立体高度信息。课堂用类似金字塔的物体说明：表面看是矩形，结合高度变化才能理解它的 3D 形状。

### 2. Cog3DRangeImagePlaneEstimatorTool：找基准平面

画面确认的工具名是 Cog3DRangeImagePlaneEstimatorTool。它在 3D 图像中估计一个平面，作为后续高度和体积计算的基准。

- 两点只能确定一条直线。
- 三个不共线的点才能确定一个平面。
- 可以放置 3 个或更多点。
- 点应落在真正的基准面上，而不是目标物体顶部。

如果目标在不同图片中的位置会移动，先做模板匹配和坐标定位，再在定位后的图像上找平面。否则固定点可能落到错误位置。

### 3. Cog3DRangeImageVolumeCalculatorTool：求体积

画面确认的工具名是 Cog3DRangeImageVolumeCalculatorTool。它需要 3D Range Image、基准平面和计算区域。

工具从基准平面向上扫描目标高度差并累加，得到体积。课堂把区域设置为整个图像，得到约 12 万像素的示例结果；没有真实尺寸标定时，不能把它当成毫米立方。

### 4. Cog3DRangeImageHeightCalculatorTool：求高度

画面确认的工具名是 Cog3DRangeImageHeightCalculatorTool。它同样需要 3D 图像和基准平面，输出一条高度变化曲线，观察扫描区域内不同位置的高度。

曲线向上表示相对基准面更高，向下表示更低。它适合看高度分布，不等同于体积积分。

### 5. Cog3DRangeImageCrossSectionTool：看横截面

画面确认的工具名是 Cog3DRangeImageCrossSectionTool。它沿指定方向穿过 3D 图像，输出切线上的横截面曲线，用来观察目标轮廓、高度变化和截面形状。

课堂画面中扫描方向是从右向左。扫描方向和区域会改变输出曲线，要明确横轴对应的图像方向。

### 6. VisionPro 3DWeaver：查看 3D 图像

VisionPro 3DWeaver 是查看 3D 图像的工具，不是前面几个 ToolBlock 测量工具。可以从 VisionPro 安装目录或开始菜单打开，再导入 3D 图像，通过拖拽视角观察立体形状。

## 十、3D 工具连接思路

    3D Range Image
        ↓
    CogPMAlignTool + 坐标定位
        ↓
    Cog3DRangeImagePlaneEstimatorTool
        ↓
    基准平面
        ├─ Cog3DRangeImageVolumeCalculatorTool   （体积）
        ├─ Cog3DRangeImageHeightCalculatorTool    （高度曲线）
        └─ Cog3DRangeImageCrossSectionTool        （横截面曲线）

## 十一、常见坏人

- Blob 直接检测整张图：上下两排引脚混在一起，先限定上半区域。
- 动态阈值不稳定：尝试固定阈值，并根据样本调整。
- 开运算过强：可能把相邻引脚连接，或削掉有效部分。
- 直接按 Blob 返回顺序计算间距：先收集 CenterOfMassX，再排序。
- 循环访问最后一个元素写成 xs[res1]：最后一个合法下标是 res1 - 1。
- 只判断中间间距：还要单独判断第一根和最后一根缺失。
- 把 Rotation 当成角度：先按弧度换算成角度。
- 把 4°、65、245、150 当通用阈值：这些都是课堂素材参数。
- 模板匹配搜到下半排引脚：缩小搜索区域，并调整模板和接受阈值。
- 不清空 CogGraphicCollection：连续运行会叠加旧文字和图形。
- 极性展开区域太大或太小：齿轮可能少齿或多齿，按实际半径动态设置。
- 3D 平面只放两个点：两个点只能确定直线，至少需要三个不共线点。
- 目标移动后继续使用固定平面点：先做坐标定位。
- 只用体积工具不接基准面：没有参考平面，体积没有计算起点。
- 把像素体积当成真实尺寸：没有标定时只能当图像单位结果。

## 十二、复习练习

- 用正常引脚样本统计 CenterOfMassX 间距，推导自己的缺失阈值。
- 人为删除中间、最前和最后的引脚，分别验证三种缺失判断。
- 人为旋转一根引脚，观察 Rotation 的弧度值和角度换算结果。
- 比较 Perimeter 和 Area 哪一个对当前光照更稳定。
- 连续运行多张图片，确认图形集合会清空且没有旧标签。
- 对不同大小齿轮动态设置极性展开区域，检查齿数是否多算。
- 用 CogCopyRegionTool 覆盖齿轮内部，再比较两种数齿方法。
- 用 3 个、2 个和 6 个点分别建立 3D 平面，观察两点为什么报错。
- 在同一个基准平面上分别运行体积、高度和横截面工具。

## 十三、课程收尾：从图像提取到缺陷判断

这节课的主线可以记成一句话：**先用 Blob / PMAlign 把目标找出来，再用坐标、间距、角度、周长或面积判断异常，最后用脚本把结果标到图像上。**

随机齿轮是在这条主线上继续加了动态极性展开和区域复制；3D 工具则把“找平面”作为起点，再向上计算高度、体积和横截面。工具只是武器，真正要先想清楚的是：目标在哪里、正常值是多少、异常要怎么显示。

## 原始资料与课堂截图

- 视频：D:\BaiduNetdiskDownload\14班9.8下午.mp4
- 时长：1 小时 23 分 13 秒
- [[5_System/Attachments/video-20260908-pm/转录原文.txt|转录原文]]
- [[5_System/Attachments/video-20260908-pm/原始字幕.srt|原始字幕]]

课堂截图：

- ![[5_System/Attachments/video-20260908-pm/课堂90.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂720.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂1320.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂2040.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂2760.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂2940.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂3010.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂3040.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂3600.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂4300.jpg]]
- ![[5_System/Attachments/video-20260908-pm/课堂4800.jpg]]

## 关联链接

- [[CSharp VisionPro 工具总览（功能与介绍笔记）|C# VisionPro 工具总览（功能与介绍笔记）]]
- [[CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）|C# VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）]]
- [[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]]
- [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]
- [[CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）|C# VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）]]
- [[CSharp VisionPro 表盘指针识别与时间读取（9.7下午）|C# VisionPro 表盘指针识别与时间读取（9.7下午）]]
