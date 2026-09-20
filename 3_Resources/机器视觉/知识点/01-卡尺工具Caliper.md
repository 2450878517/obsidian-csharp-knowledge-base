---
title: "01-卡尺工具 Caliper"
category: '几何测量工具'
date: "2026-08-15"
tags:
  - 机器视觉
  - OpenCvSharp
  - 测量
  - 卡尺
status: seedling
area: 机器视觉
aliases: [Caliper, 卡尺, 边缘测量]
related: [视觉测量工具箱, 05-图像测量, 03-边缘检测]
source: ""
---

# 🔧 卡尺工具 Caliper

> 视觉测量工具箱的第一个工具。对标 **VisionPro 的 CogCaliperTool** / **Halcon 的 measure_pos**。
> 工程：`D:\claude\VisionMeasureToolkit`（C# WinForms + OpenCvSharp 4.13）

## 卡尺是啥

用户在图上画一条**扫描线**，工具沿线方向铺开 N 条垂直的**投影行**，每条投影行做**一维边缘扫描**，找到边缘点，相邻反向边缘配对 → 得到**宽度 / 直径 / 间隙**。

它是工业视觉里用得最多的测量工具——测宽、测高、测直径、测间距全靠它。

## 原理：一维边缘扫描

```
扫描线 P0 → P1
沿线方向 d          （单位向量）
垂直方向 n = (-dy, dx)

第 i 条投影行中心：S_i = P0 + d·L·t,   t = i/(Samples-1)
每条投影行从 S_i − n·HalfWidth 扫到 S_i + n·HalfWidth
```

每一步：

### ① 双线性采样灰度
沿投影方向逐点取灰度，坐标是小数所以做**双线性插值**。
坑：`gray.At<byte>(row, col)` 是**行优先**，参数顺序是 `(y, x)`。

### ② 一维梯度：前向差分
```
grad[k] = profile[k+1] - profile[k]
```
**用前向差分而不是中心差分**：硬边缘的灰度跳变落在一个差分间隔内，峰是"单点峰"；
中心差分会出现相邻两点幅值相等的"梯度平台"，导致峰值判定双双失败。
前向差分的峰位于 k 与 k+1 中点，**硬边界的几何位置正好落在这里**——合成图上能测出精确的 200.0px。

### ③ 峰值检测
`|grad[k]|` 是**局部极大** 且 ≥ 阈值 → 这是一个边缘点。

### ④ 亚像素插值
对梯度三点做抛物线拟合，峰偏移量：
```
frac = 0.5·(gL − gR) / (gL − 2·gC + gR)     （钳制到 ±0.5）
```
边缘位置 = `(k − HalfWidth) + 0.5 + frac`（前向差分峰在 k 与 k+1 之间）。

### ⑤ 极性
沿投影方向 n 看：**暗→明** = 上升沿（绿），**明→暗** = 下降沿（红）。

### ⑥ 配对
同一投影行内，按位置排序，**相邻且极性相反**的两个边缘 → 一个 EdgePair，距离 = 像素差。
**最大跨距**就是测量结果：矩形任意一行都测出宽/高；**圆只有过圆心的那行 = 直径**，取所有行最大跨距正好得直径。

## 代码结构

```
Caliper/
├── EdgePolarity.cs     # 极性枚举 DarkToLight=+1 / LightToDark=-1
├── EdgePoint.cs        # 边缘点：X,Y(亚像素), Position, Amplitude, Polarity
├── CaliperParams.cs    # 参数：Samples/HalfWidth/Threshold/SubPixel
├── CaliperResult.cs    # 结果：Edges, Pairs, MaxPairDistance
└── CaliperTool.cs      # 核心：Measure(gray, p0, p1, prm)
```

核心调用（Form1 里拖完线就调它）：
```csharp
using Mat gray = new();
Cv2.CvtColor(_bgr, gray, CvColorConversionCodes.BGR2GRAY);
var prm = new CaliperParams { Samples = 21, HalfWidth = 150, Threshold = 20 };
var r = _caliper.Measure(gray, p0, p1, prm);
double px = r.MaxPairDistance;      // 像素
double mm = px * ScaleMmPerPx;      // × 标定比例 = 毫米
```

## 参数怎么调

| 参数 | 作用 | 建议 |
|---|---|---|
| **HalfWidth 投影半宽** | 扫描线两侧的"视野"，必须**盖住被测宽度的一半以上** | 被测量 ÷ 2 再留余量。**测不出=多半这个太小** |
| **Samples 采样行数** | 沿线铺几条投影行 | 默认 21；**测圆想准设 41** |
| **Threshold 梯度阈值** | 边缘多陡才算 | 默认 20；图脏调大，浅色弱边调小 |

## 验证（measured_objects.png）

合成图，尺寸已知（标定 0.05 mm/px）。命令自检：`dotnet run -- --selftest`

| 扫描线 | 期望 | 实际 |
|---|---|---|
| 橙矩形宽（半宽≥110） | 200px → 10.00mm | 200.0px ✓ |
| 橙矩形高（半宽≥60） | 100px → 5.00mm | 100.0px ✓ |
| 黑圆直径（半宽≥60） | 直径 | 101.0px（OpenCV 画圆含端点像素） |
| 紫矩形宽（半宽≥160） | 300px → 15.00mm | 300.0px ✓ |
| 紫矩形高（半宽≥45） | 80px → 4.00mm | 80.0px ✓ |

> 黑圆 101px 不是误差：OpenCV 画圆填充 x∈[400,500] 共 101 个黑像素（几何直径 100px 的光栅化表现），卡尺测的就是图像真实像素边界。

## 跟教程的关系

- 测量思路承接桌面教程 `MachineVision\05-图像测量`：像素 × 标定比例 = 毫米
- 边缘检测承接 `MachineVision\03-边缘检测`：卡尺就是"沿着一条线做一维的 Canny"
- 比 BoundingRect 更精确：BoundingRect 只能量水平外接框，卡尺能沿任意角度测量
- 教程目录：`D:\claude\data\MachineVision`（桌面 MachineVision 是它的符号链接）

## 下一步

- [[视觉测量工具箱]] 路线：像素当量标定 → 圆/线测量 → 模板匹配 → Blob
- 对标 VisionPro：CogCaliperTool 的完整实现，懂了它背后就是这些数学

## 对应案例

- [[CSharp VisionPro 液面高度批量测量与图像处理（9.3上午）|C# VisionPro 液面高度批量测量与图像处理（9.3上午）]]
- [[CSharp VisionPro 综合测量案例（钻头、火花塞）|C# VisionPro 综合测量案例（钻头、火花塞）]]

