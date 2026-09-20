---
title: 'C# VisionPro 工具总览（功能与介绍笔记）'
category: '工具参考'
tags: [CSharp, 视觉, VisionPro, Cognex, 工具整理, 工具清单, 汇总]
status: budding
area: 机器视觉
aliases: [VisionPro 工具总览, VisionPro 工具索引, VisionPro 工具地图]
related: ['CSharp VisionPro 工具大整理（全工具清单）', 'CSharp VisionPro 多模板匹配与标定板工具（9.7上午）', 'CSharp VisionPro 表盘指针识别与时间读取（9.7下午）']
---
# C# VisionPro 工具总览（功能与介绍笔记）

> 这是一张“工具 → 用途 → 介绍笔记”的索引。内容只整理当前知识库里已经提到的 VisionPro 工具；同一工具的不同课堂叫法合并在一起，具体参数和代码以链接笔记为准。

## 一、图像输入、预处理与坐标

| 工具 / 工具族 | 大致功能 | 介绍这个工具的笔记 |
|---|---|---|
| **Image Source / IDB 图像输入** | 导入本地图片、IDB 资源，或接收工业相机图像，给后续工具提供输入。 | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]；[[CSharp VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）|C# VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）]]；[[CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）|C# VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）]] |
| **`CogImageConvertTool` 彩转灰** | 把彩色图转换成灰度图，方便模板匹配、Blob 等灰度工具处理。 | [[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|C# VisionPro 多模板匹配与标定板工具（9.7上午）]]；[[CSharp VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）|C# VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）]] |
| **坐标定位 / Coordinate Setup** | 以模板匹配结果为基准重新建立坐标，让目标移动后，找线、找圆和测量仍然跟着目标走。 | [[CSharp VisionPro 综合测量案例（钻头、火花塞）|C# VisionPro 综合测量案例（钻头、火花塞）]]；[[CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）|C# VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）]] |
| **`CogCalibCheckerBoardTool` 标定板工具** | 用标定板建立像素与真实尺寸的关系，并校正镜头畸变，支持毫米等实际单位测量。 | [[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|C# VisionPro 多模板匹配与标定板工具（9.7上午）]] |
| **`CogIPOneImage` / 形态学处理** | 对图像做腐蚀、膨胀、开运算、闭运算等，去噪、连通或分离目标。 | [[CSharp VisionPro 图像形态学处理（腐蚀膨胀开闭运算）|C# VisionPro 图像形态学处理（腐蚀膨胀开闭运算）]]；[[CSharp VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）|C# VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）]] |
| **`CogCopyRegionTool` 复制区域** | 把图像中的空白区域复制到目标区域，覆盖齿轮内部，只保留齿尖，再交给 Blob 统计齿数。 | [[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]] |

## 二、定位、识别与图像检测

| 工具 / 工具族 | 大致功能 | 介绍这个工具的笔记 |
|---|---|---|
| **`CogPMAlignTool` 模板匹配** | 用训练好的模板寻找目标的位置、角度和匹配分数，也能统计目标数量；结果中的 Rotation 还可用于姿态倾斜判断。 | [[02-模板匹配工具TemplateMatch]]；[[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|C# VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]]；[[CSharp VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）|C# VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）]]；[[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]]；[[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]] |
| **`CogPMAlignMultiTool` 多模板匹配** | 一次管理多个模板，适合同时识别不同类型的目标或同类目标的多个姿态。 | [[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|C# VisionPro 多模板匹配与标定板工具（9.7上午）]] |
| **Mask 掩膜** | 在模板匹配中遮住不想参与匹配的区域，减少背景或干扰特征的影响。 | [[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|C# VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]] |
| **`CogPatInspectTool` PatternInspect 缺陷识别** | 用完整合格样本与实际图像做重合比对，输出 `Difference` 差异区域；常与 PMAlign、Blob 联用，定位并标记缺陷。 | [[CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）|C# VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）]] |
| **`CogBlobTool` Blob 斑点工具** | 按灰度或连通区域找出目标，统计数量、面积、中心、轴长等特征，常用于缺陷、引脚和齿轮检测。 | [[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]]；[[CSharp VisionPro Blob脚本与胶囊检测（9.1上午）|C# VisionPro Blob脚本与胶囊检测（9.1上午）]]；[[CSharp VisionPro Blob脚本与胶囊豆类识别（9.1下午）|C# VisionPro Blob脚本与胶囊豆类识别（9.1下午）]]；[[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]] |
| **`CogColorSegmenterTool` / `CogColorSegmenter2` 颜色分割** | 按颜色范围分割目标，把彩色区域变成可供 Blob 或测量工具处理的区域。 | [[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]]；[[CSharp VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）|C# VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）]] |
| **`CogColorMatchTool` / `CogColorMatch2` / `CogColorExtractor2` 颜色工具** | 比较颜色、提取颜色特征，或筛选指定颜色区域，用于颜色分类与检测。 | [[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]]；[[CSharp VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）|C# VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）]] |
| **`CogFindCircleTool` 找圆** | 通过边缘或卡尺扫描找到圆心、半径和圆轮廓，适合孔、圆柱、滚珠等目标。 | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]；[[CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）|C# VisionPro 轴承滚珠批量测量与极性展开（9.4上午）]]；[[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]] |
| **Find Line / Corner / Ellipse 与 Fit 拟合** | Find 系列负责从图像中找线、角、椭圆；Fit 系列把多个点拟合成线、圆或椭圆。 | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]；[[CSharp VisionPro 综合测量案例（钻头、火花塞）|C# VisionPro 综合测量案例（钻头、火花塞）]] |
| **`CogCaliperTool` 卡尺** | 沿指定方向扫描边缘，找到一对边并计算宽度、间距或位置，是测量边缘距离的常用工具。 | [[01-卡尺工具Caliper]]；[[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]] |
| **`CogPolarUnwrapTool` 极性展开** | 把圆环、轴承滚道或齿轮环形区域展开成平面图，便于连续检查缺陷或统计齿数。 | [[CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）|C# VisionPro 轴承滚珠批量测量与极性展开（9.4上午）]]；[[CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）|C# VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）]]；[[CSharp VisionPro 表盘指针识别与时间读取（9.7下午）|C# VisionPro 表盘指针识别与时间读取（9.7下午）]]；[[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]] |
| **`CogID` / `CogID2` ID 与条码读取** | 读取条码、二维码或其他 ID 信息，并输出识别结果。 | [[CSharp VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）|C# VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）]] |

## 三、几何创建、相交与测量

| 工具 / 工具族 | 大致功能 | 介绍这个工具的笔记 |
|---|---|---|
| **Create 创建工具** | 根据点、线或参数创建圆、线、线段、文字，以及中垂线、平行线、垂线和等分线段。 | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]；[[CSharp VisionPro 表盘指针识别与时间读取（9.7下午）|C# VisionPro 表盘指针识别与时间读取（9.7下午）]] |
| **Intersection 相交工具** | 计算圆-圆、线-圆、线-线等图形的交点，给后续距离和角度测量提供几何点。 | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]；[[CSharp VisionPro 综合测量案例（钻头、火花塞）|C# VisionPro 综合测量案例（钻头、火花塞）]] |
| **`CogAngleLineAngleTool` / `CogAngleLineLineTool` 角度** | 测量两条线的夹角；课堂里也会把同类工具简称为“角-线工具”。不同版本或课堂记录名称可能略有差异。 | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]；[[CSharp VisionPro 表盘指针识别与时间读取（9.7下午）|C# VisionPro 表盘指针识别与时间读取（9.7下午）]] |
| **Angle Point-Point 点点角度** | 用两个点确定方向，计算这条方向线相对水平线的角度。 | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]] |
| **`CogDistancePointLineTool` / `CogDistancePointPointTool` 距离** | 计算点到线、点到点等距离；同一组工具还扩展到点-圆、线-圆、圆-圆、线-椭圆、线段等组合。 | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]；[[CSharp VisionPro 脚本批量测量与结果标注（9.2下午）|C# VisionPro 脚本批量测量与结果标注（9.2下午）]]；[[CSharp VisionPro 综合测量案例（钻头、火花塞）|C# VisionPro 综合测量案例（钻头、火花塞）]] |

## 四、结果分析、显示与脚本辅助

| 工具 / 对象 | 大致功能 | 介绍这个工具的笔记 |
|---|---|---|
| **`CogResultsAnalysisTool` 结果分析** | 对前面工具的结果做表格运算、数量统计和组合计算，例如数量 × 单价。 | [[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|C# VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]] |
| **`CogGraphicLabel` 图形文字** | 在图像上显示固定文字或动态结果，例如 OK/NG、数量、角度、坐标和测量值。 | [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]；[[CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）|C# VisionPro 脚本绘图与Blob结果标注（9.2上午）]]；[[CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）|C# VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）]]；[[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]] |
| **`CogGraphicCollection` 图形集合** | 在脚本中收集、清空和输出多个图形对象，让检测结果统一显示在图像上。 | [[CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）|C# VisionPro 脚本绘图与Blob结果标注（9.2上午）]]；[[CSharp VisionPro 脚本批量测量与结果标注（9.2下午）|C# VisionPro 脚本批量测量与结果标注（9.2下午）]] |
| **ToolBlock / Advanced Script** | 把多个工具串成处理流程，并用 C# 脚本读取输入、控制工具、写结果和绘制标注。 | [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]；[[CSharp VisionPro 脚本批量测量与结果标注（9.2下午）|C# VisionPro 脚本批量测量与结果标注（9.2下午）]]；[[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|C# VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]；[[CSharp VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）|C# VisionPro 联合编程脚本获取 Blob 结果与药板缺陷统计（9.11上午）]]；[[CSharp VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）|C# VisionPro 联合编程代码操控 CogFindCircleTool 批量测量轴承内圈（9.15上午）]] |
| **Run Record / `CogRecord`** | 管理工具运行记录和显示记录，让输入图像、工具结果、标注图形能在运行结果中回看。 | [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]；[[CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）|C# VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）]]；[[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|C# VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]；[[CSharp VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）|C# VisionPro 联合编程图像文字标注、Blob轮廓绘制与IDB读取（9.11下午）]] |

## 五、3D Range Image 工具

| 工具 | 大致功能 | 介绍这个工具的笔记 |
|---|---|---|
| **`Cog3DRangeImagePlaneEstimatorTool` 找平面** | 用 3 个或更多不共线点估计 3D 基准平面，为高度和体积计算提供参考面。 | [[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]] |
| **`Cog3DRangeImageVolumeCalculatorTool` 体积** | 根据 3D 图像和基准平面，扫描并累加目标相对平面的高度，计算体积。 | [[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]] |
| **`Cog3DRangeImageHeightCalculatorTool` 高度** | 输出 3D 图像相对基准面的高度变化曲线，用来查看不同区域的高度。 | [[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]] |
| **`Cog3DRangeImageCrossSectionTool` 横截面** | 沿指定方向扫描 3D 图像，输出横截面轮廓和高度变化曲线。 | [[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]] |
| **VisionPro 3DWeaver** | 打开和拖拽查看 3D Range Image，帮助理解立体形状；它是查看器，不是 ToolBlock 测量工具。 | [[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]] |

## 六、按“想做什么”快速找工具

| 目标 | 优先看哪些工具 |
|---|---|
| 找到目标位置 | `CogPMAlignTool`、`CogPMAlignMultiTool`、坐标定位 |
| 找圆、找线、找边 | `CogFindCircleTool`、Find Line、`CogCaliperTool` |
| 测宽度、距离、角度 | Caliper、Distance 系列、Angle 系列 |
| 统计斑点或检测缺陷 | `CogPatInspectTool`、`CogBlobTool`、颜色分割、形态学处理 |
| 检查圆环或轴承 | `CogPolarUnwrapTool`、Blob、Find Circle |
| 识别条码/二维码 | `CogID` / `CogID2` |
| 做真实尺寸测量 | `CogCalibCheckerBoardTool`、坐标定位、测量工具 |
| 把结果画到图上 | `CogGraphicLabel`、`CogGraphicCollection`、ToolBlock 脚本 |

## 相关总表与入口

- 原始课堂总表：[[CSharp VisionPro 工具大整理（全工具清单）|C# VisionPro 工具大整理（全工具清单）]]
- 测量工具总笔记：[[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]]
- 模板匹配总笔记：[[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|C# VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]]
- 9.7 上午案例：[[CSharp VisionPro 多模板匹配与标定板工具（9.7上午）|C# VisionPro 多模板匹配与标定板工具（9.7上午）]]
- 9.7 下午案例：[[CSharp VisionPro 表盘指针识别与时间读取（9.7下午）|C# VisionPro 表盘指针识别与时间读取（9.7下午）]]
- 9.8 上午案例：[[CSharp VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）|C# VisionPro PatternInspect 缺陷检测与 Blob 标注（9.8上午）]]
- 9.8 下午案例：[[CSharp VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）|C# VisionPro 引脚缺陷检测、随机齿轮与 3D 工具（9.8下午）]]

> 整理来源：VisionPro 课程笔记与案例笔记。工具名按当前笔记中的写法保留；如果不同版本显示名略有变化，优先按功能和链接笔记交叉确认。
