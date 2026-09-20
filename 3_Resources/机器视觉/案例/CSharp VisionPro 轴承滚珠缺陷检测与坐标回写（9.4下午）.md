---
title: "VisionPro 轴承滚珠缺陷检测与坐标回写"
category: '轴承缺陷案例'
date: "2026-09-04"
processed_date: "2026-09-05"
tags: [机器视觉, CSharp, VisionPro, ToolBlock, CogPMAlign, CogPolarUnwrap, CogGraphicCollection, 缺陷检测, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.4下午.mp4'
duration: "00:50:03"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；示例代码按课堂讲解整理，未在 VisionPro 中编译运行"
transcript: "5_System/Attachments/video-20260904-pm/转录原文.txt"
aliases: [9.4下午视频笔记, 轴承滚珠缺陷检测, 极性展开缺陷标记]
related: [[CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）], [CSharp VisionPro 脚本批量测量与结果标注（9.2下午）], [CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）]]
---

# VisionPro 轴承滚珠缺陷检测与坐标回写

## 本节主线

本节接着上一节的轴承滚珠案例，重点从“数出滚珠”推进到“判断缺陷并标记”。流程是：用 `CogPMAlignTool` 找到滚珠中心，按 X 坐标排序，计算相邻滚珠间距，判断缺珠或歪珠；再把缺口位置标到极性展开图上，必要时通过坐标转换把标记回写到原始圆形图像。

课堂素材中出现了两种数量样例：前面的轴承样例按 10 颗滚珠判断，后面的示例按 19 颗滚珠判断。实际脚本不能盲目写死数量，应以当前产品规格或输入参数为准。

## 先处理极性展开

圆环图像直接判断角度不方便，所以用 `CogPolarUnwrapTool` 把圆环展开成一条平面图。展开工具的起始角度、旋转方向、内外半径和展开范围会影响结果。起始角度如果刚好把缺陷切在图像首尾边界，缺陷间距可能被分成两段，单纯查找中间的异常间距就会漏检。

因此判定逻辑要考虑边界情况：可以先判断数量是否缺少，再判断间距是否异常；也可以使用不同起始角度的两次展开结果互相补充。展开图的首尾位置要单独检查，不能只检查 `xs[i]` 和 `xs[i + 1]` 的中间间距。

![[5_System/Attachments/video-20260904-pm/课堂300.jpg]]

## PMAlign 结果必须先排序

`CogPMAlignTool.Results` 的顺序是按匹配相似度等结果顺序排列，不等于滚珠在图像中的从左到右顺序。计算间距前，要把每个结果的 X 坐标取出来，再排序：

```csharp
int res1 = pma1.Results.Count;
double[] xs = new double[res1];

for (int i = 0; i < res1; i++)
{
  xs[i] = pma1.Results[i].GetPose().TranslationX;
}

Array.Sort(xs);

// xs[i + 1] 会访问下一个元素，所以循环只能到 res1 - 2
for (int i = 0; i < res1 - 1; i++)
{
  double gap = xs[i + 1] - xs[i];
  // 根据当前产品的正常间距范围判断 gap
}
```

这个边界写法可以避免数组越界。`for (int i = 0; i < res1; i++)` 适合读取 `xs[i]`，但不适合读取 `xs[i + 1]`。

## 缺珠与歪珠的判断

如果检测数量少于产品规定数量，优先判定为缺珠。对于数量正确但间距异常的情况，可以把相邻 X 坐标的间距与正常范围比较，例如课堂中使用过约 `40~48` 或 `135~150` 的范围，具体阈值要按当前展开比例和产品重新标定。

要注意，缺珠会让相邻两颗滚珠的间距变大；歪珠可能造成局部间距变化。若只写“间距小于下限就是缺陷”，逻辑会把不同缺陷混在一起。生产脚本应先区分数量缺失，再用间距和位置判断歪珠；对于展开图首尾的异常，还要增加首尾间距或第二个起始角度的判断。

## 在展开图的缺口处画圆

检测到异常间距后，缺失滚珠的大致 X 坐标可以取两颗相邻滚珠坐标的中点：

```csharp
CogGraphicCollection box = new CogGraphicCollection();
box.Clear();

for (int i = 0; i < res1 - 1; i++)
{
  double gap = xs[i + 1] - xs[i];

  if (gap < minGap || gap > maxGap)
  {
    double missingX = (xs[i] + xs[i + 1]) / 2.0;
    CogCircle mark = new CogCircle();
    mark.CenterX = missingX;
    mark.CenterY = 5;       // 按展开图中滚珠所在的 Y 位置调整
    mark.Radius = 10;       // 按画面比例调整
    mark.LineWidthInScreenPixels = 3;
    box.Add(mark);
  }
}
```

`box.Clear()` 要放在每次运行开始处，否则上一次运行留下的图形会叠加。第一颗或最后一颗滚珠缺失时，中点逻辑无法直接覆盖，需要另外检查展开图两端与圆环首尾相接的位置。

![[5_System/Attachments/video-20260904-pm/课堂1000.jpg]]

## 把结果显示到 Run Record

画在展开图上的图形，要添加到对应的展开图记录；如果要显示在原始图像上，就要添加到原始图像记录。记录路径必须以当前 ToolBlock 的 Last Run Record 树为准，不能直接照抄别的工程路径。

```csharp
public override void ModifyLastRunRecord(ICogRecord lastRecord)
{
  // 这里的 recordPath 要替换成当前工程中展开图的实际记录路径
  mToolBlock.AddGraphicToRunRecord(
    box,
    lastRecord,
    "CogPolarUnwrapTool1.OutputImage",
    "");
}
```

不同 VisionPro 版本或记录树配置中，图像记录名称可能不同；先在 Last Run Record 中确认 `CogPolarUnwrapTool1` 的实际输出节点，再填写路径。

![[5_System/Attachments/video-20260904-pm/课堂1700.jpg]]

## 从展开图坐标回写到原图

展开图中的缺口坐标是平面坐标。若要在原始圆形图像上标记，需要使用 `CogPolarUnwrapTool` 提供的坐标映射功能，把展开图坐标 `(x2, y2)` 转成输入图像坐标 `(x3, y3)`，再创建第二个 `CogCircle` 显示到原图。

课堂里使用的是“由输出点映射回输入点”的坐标转换思路。具体方法名会随 VisionPro 版本和工具接口不同，编写时应在 `CogPolarUnwrapTool` 的成员列表中确认实际 API；不要把未确认的方法名直接复制到生产脚本。

```csharp
// 伪代码：请根据安装的 VisionPro 版本替换为实际坐标映射 API
PointF inputPoint = unwrap.MapOutputPointToInputPoint(
  new PointF((float)missingX, (float)missingY));

CogCircle originalMark = new CogCircle();
originalMark.CenterX = inputPoint.X;
originalMark.CenterY = inputPoint.Y;
originalMark.Radius = 10;
originalMark.LineWidthInScreenPixels = 3;
originalBox.Add(originalMark);
```

展开图标记和原图标记最好分成两个 `CogGraphicCollection`，分别添加到各自的图像记录，避免把展开图坐标误画到原图上。

![[5_System/Attachments/video-20260904-pm/课堂2300.jpg]]

## 脚本里的常见坏人

- `mToolBlock.Tools["工具名"]` 取工具时，名称必须和 ToolBlock 中的实际名称完全一致；工具不存在时要先判空。
- `CogPMAlignTool.Results` 的顺序不能当作空间顺序，计算相邻距离前先排序。
- 访问 `xs[i + 1]` 时，循环条件必须是 `i < res1 - 1`。
- `Results.Count`、正常滚珠数量、缺陷阈值要和当前产品规格对应，不能把不同案例的 10 和 19 混用。
- 每次运行前清空图形集合；需要同时显示展开图和原图时，分别维护图形集合和记录路径。
- `ModifyLastRunRecord` 只负责把图形放进记录；检测判定和图形生成应在 `GroupRun` 或辅助方法中完成。
- 示例中的 `CogPolarUnwrapTool1.OutputImage` 与坐标映射方法名是按课堂思路写的占位示例，最终以当前 VisionPro 版本的记录树和对象成员为准。

## 课堂截图

![[5_System/Attachments/video-20260904-pm/课堂2800.jpg]]

## 相关笔记

- [[CSharp VisionPro 轴承滚珠批量测量与极性展开（9.4上午）|C# VisionPro 轴承滚珠批量测量与极性展开（9.4上午）]]
- [[CSharp VisionPro 脚本批量测量与结果标注（9.2下午）|C# VisionPro 脚本批量测量与结果标注（9.2下午）]]
- [[CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）|C# VisionPro 脚本绘图与Blob结果标注（9.2上午）]]

## 原始资料

- 视频：`D:\BaiduNetdiskDownload\14班9.4下午.mp4`
- 时长：50 分 03 秒
- 完整转录：[[5_System/Attachments/video-20260904-pm/转录原文.txt]]
- 原始字幕：[[5_System/Attachments/video-20260904-pm/原始字幕.srt]]

