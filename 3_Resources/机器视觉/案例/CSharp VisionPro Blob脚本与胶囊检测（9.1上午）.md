---
title: "VisionPro Blob脚本与胶囊检测"
category: '脚本与ToolBlock'
date: "2026-09-01"
processed_date: "2026-09-04"
tags: [机器视觉, CSharp, VisionPro, Blob, ToolBlock, 课程视频]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.1上午.mp4'
duration: "00:39:49"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对，非逐帧校对"
transcript: "5_System/Attachments/video-20260901-am/转录原文.txt"
aliases: [9.1上午视频笔记, Blob脚本, 胶囊漏装检测]
related: ["[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]", "[[CSharp VisionPro Blob 斑点工具与颜色分割|CSharp VisionPro Blob 斑点工具与颜色分割]]", "[[CSharp VisionPro 图像形态学处理（腐蚀膨胀开闭运算）|CSharp VisionPro 图像形态学处理（腐蚀膨胀开闭运算）]]"]
---

# VisionPro Blob脚本与胶囊检测

本节承接 ToolBlock 高级脚本：先读取 Blob 的检测结果，再用 C# 判断数量与面积，最后把统计结果叠加到原图。

学完应能做出两个案例：划痕数量显示；一板胶囊的漏装数、合格数和不合格数显示。核心是读懂工具结果的访问路径，以及分清“数量不足”和“已有胶囊质量不合格”。

## 学习路线

先通过划痕案例熟悉工具结果的读取和文字显示，再完成胶囊的颜色分割与形态处理。得到稳定的 Blob 结果后，分别判断数量和面积，最后用不同素材验证统计结果。

原文保留在 [[5_System/Attachments/video-20260901-am/转录原文.txt|转录原文]]；英文类名和关键数值已结合画面核对。本文代码是按课堂逻辑整理的脚本片段，不是独立运行的控制台工程。

<!-- page -->

## 划痕案例与结果路径

先在 ToolBlock 中配置 Blob 工具，调整极性和最小面积，让划痕形成可分辨的斑点。脚本不是替代前面的图像处理，而是读取工具已经算出的结果。

课堂中的 Blob 命名空间是 `Cognex.VisionPro.Blob`。工具名必须与 ToolBlock 中的实际名称一致；课堂使用 `CogBlobTool1`。

```csharp
CogBlobTool blob1 =
    mToolBlock.Tools["CogBlobTool1"] as CogBlobTool;
int res1 = blob1.Results.GetBlobs().Count;
```

模板匹配示例可直接使用 `Results.Count`，Blob 则先调用 `GetBlobs()`，再读取集合的 `Count`。不要凭记忆给所有工具套同一种写法；在输出终端或成员浏览器中查看路径。

## 文字对象为什么放在第一处

“第一处”指脚本类的成员字段区，在方法外；“第二处”指 GroupRun 中工具运行之后；“第三处”指 ModifyLastRunRecord 方法。

```csharp
// 第一处：放在脚本类中，所有方法之外
private CogGraphicLabel label = new CogGraphicLabel();

// 第二处：放在 GroupRun 内，工具运行完成后
label.Text = "划痕数量：" + res1.ToString();
label.Color = CogColorConstants.Green;
label.X = 200;
label.Y = 200;
label.Font = new Font("楷体", 24);
```

如果把 `label` 声明成 GroupRun 内的局部变量，另一个方法 ModifyLastRunRecord 就不能直接访问它。放在类里的 `private` 字段仍可由这个类的不同方法使用；private 不等于“只能在某一个方法里用”。

<!-- page -->

## 胶囊案例先把图像处理好

处理顺序是：原始彩图进入颜色分割工具，分割结果进入 Blob，在 Blob 的图像形态处理设置中填洞、去除干扰，再分析结果。

老师选择胶囊的目标颜色，使完整胶囊形成较完整的椭圆区域；半边颜色不符合的胶囊只留下较小区域。此时比较的是“分割后被检测区域的面积”，不能直接等同于胶囊的真实体积或所有质量指标。

内部有孔洞时，课堂采用先多次膨胀、再腐蚀回去的方式，体现闭运算先膨胀后腐蚀的思路。膨胀到孔洞消失后再收回，观察是否把相邻胶囊连在一起。

课堂设置最小面积 500，用于去除小干扰；选择 3000 作为完整与不完整胶囊的面积分界。

| 设置或结果 | 课堂素材中的数值 | 用途 |
|---|---|---|
| Blob 最小面积 | 500 | 去除小干扰，保留需要分类的胶囊 |
| 完整胶囊面积 | 约 3800–4000 | 观察正常样本分布 |
| 不完整胶囊面积 | 约 2000 | 观察异常样本分布 |
| 合格判断条件 | Area 大于等于 3000 | 在脚本中进行分类 |

不能把最小面积直接设成 3000：这样约 2000 的不合格胶囊会先被过滤掉，脚本可能将它误算成“漏装”。500 和 3000 的目的不同。

![Blob检测结果与面积列表](../../5_System/Attachments/video-20260901-am/blob-results.png)

图中 15 个 Blob 的面积列可用于选择阈值。数值仅对应课堂图像和处理参数；换分辨率、缩放、光照或分割参数后要重新核验。

<!-- page -->

## 用数量判断漏装 用面积判断合格

以下代码放在 GroupRun 中，保留模板原有的工具运行循环，并在其后、`return false;` 之前加入。每次运行重新把计数置零。

```csharp
CogBlobTool blob1 =
    mToolBlock.Tools["CogBlobTool1"] as CogBlobTool;
int res1 = blob1.Results.GetBlobs().Count;

// 一板预期有15个，课堂假设检测数不会超过15
int result1 = 0;
if (res1 == 15)
{
    // 没有漏装，result1保持0
}
else
{
    result1 = 15 - res1;
}

int hege = 0;
int buhege = 0;
for (int i = 0; i < res1; i++)
{
    double a1 = blob1.Results.GetBlobs()[i].Area;
    if (a1 >= 3000)
    {
        hege = hege + 1;
    }
    else
    {
        buhege = buhege + 1;
    }
}
```

`res1` 是检测到的总数，`result1` 是漏装数，`hege` 和 `buhege` 分别累计合格与不合格数。这里保留课堂变量名，便于对照视频。

循环上限必须是实际检测数 `res1`。只有 13 个结果时，如果仍循环 15 次，会访问不存在的第 14 或第 15 个元素，导致索引越界。

`GetBlobs()` 调用方法取得结果集合；`[i]` 取得其中一个结果；`.Area` 读取它的面积。输出终端中看到的 Item 条目在这里用索引器 `[i]` 访问，不要照抄成 `.Item(i)`。

<!-- page -->

## 把检测统计显示到原图

第一处仍使用前面声明的 `label` 字段。第二处在统计循环结束后设置显示内容，课堂胶囊案例使用蓝色、坐标 100 和 100、宋体 24 号。

```csharp
// 第二处：接在统计代码之后
label.Text = "漏装数：" + result1.ToString()
    + " 合格数：" + hege.ToString()
    + " 不合格：" + buhege.ToString();
label.Color = CogColorConstants.Blue;
label.X = 100;
label.Y = 100;
label.Font = new Font("宋体", 24);
```

第三处在已有的 ModifyLastRunRecord 方法里输出文字。不要在类中再添加一个同名重复方法；把调用放进模板生成的方法体。

```csharp
public override void ModifyLastRunRecord(
    Cognex.VisionPro.ICogRecord lastRecord)
{
    mToolBlock.AddGraphicToRunRecord(
        label,
        lastRecord,
        "CogColorSegmenterTool1.InputImage",
        "");
}
```

四个参数依次是文字图形对象、本次方法收到的运行记录、目标图像记录路径、课堂留空的标识字符串。`lastRecord` 是方法参数名，不是特殊固定常量；拼写必须与方法声明完全一致。

胶囊案例的目标路径已由画面核对为 `CogColorSegmenterTool1.InputImage`。划痕案例使用 Blob 的输入图，具体工具编号按实际工程核对。这里填运行记录中的图像路径，不是磁盘上的图片文件路径。

类名、方法名和大小写必须准确。若 `Font` 未识别，检查 `System.Drawing` 引用及 using；Blob 类型未识别则检查 Blob 程序集引用及 `Cognex.VisionPro.Blob`。

<!-- page -->

## 切换素材验证结果

老师连续换图运行，展示不同结果。其中一张图可清楚看到“漏装数 1，合格数 13，不合格 1”。

![胶囊漏装与合格检测结果](../../5_System/Attachments/video-20260901-am/capsule-result.png)

| 素材情况 | 检测数 | 合格数 | 不合格数 | 漏装数 |
|---|---|---|---|---|
| 装满，有两个不合格 | 15 | 13 | 2 | 0 |
| 装满，有三个不合格 | 15 | 12 | 3 | 0 |
| 全部合格且无漏装 | 15 | 15 | 0 | 0 |
| 漏装一个，另有一个不合格 | 14 | 13 | 1 | 1 |

前几行依据课堂讲解，最后一行另经画面核对。它们是老师的演示结果，不代表已在本机重新运行 VisionPro 工程。

在“一枚胶囊对应一个 Blob，且没有多检”的条件下，可以用 `合格数 + 不合格数 = 检测数`、`检测数 + 漏装数 = 15` 检查计数是否自洽。

实际使用补充：如果检测出 16 个，课堂的 `15 - res1` 会得到负数，应单独报告多检或分割异常。若两个胶囊粘成一个 Blob，或一个胶囊被分成多个 Blob，单纯数斑点也会失真。先解决分割问题，再做质量判断。

<!-- page -->

## 常见错误与复习练习

找不到 Count：先检查是否漏写 `GetBlobs()`。工具没有结果时，也要检查前面的工具是否成功运行，而不是直接继续读取属性。

索引越界：循环使用 `i < res1`，不能把 15 写死，也不能写成 `i <= res1`。计数器放在循环外、GroupRun 内，每张图从零开始。

文字变量不存在：检查是否把 label 声明在另一个方法内部。运行记录参数报错则对照 `lastRecord` 的拼写；课堂演示中也出现过拼写错误，修正后恢复正常。

编译成功但运行失败：课堂中出现的问题来自残留的模板匹配工具。检查 ToolBlock 的工具列表、连线和输入，不要一看到红色状态就认定统计代码错了。

分类不准：先看颜色分割与 Blob 图，再检查最小面积、形态处理和面积阈值。参数 500、3000 不能脱离当前素材解释。

### 自己做一遍

先不用看代码，写出 `Tools["CogBlobTool1"]`、`GetBlobs()`、`[i]`、`Area` 各自取得的是什么。再解释为什么 label 要作为类字段，而 hege 可以是方法里的变量。

练习数据：预期 15 个，检测到的 4 个 Blob 面积分别为 4000、3000、2999、2000。算出漏装、合格、不合格各是多少，并说明面积恰好 3000 时走哪个分支。

参考结果：漏装 11 个，合格 2 个，不合格 2 个；3000 满足 `>= 3000`，属于合格。该练习只检验课堂计数逻辑，不模拟真实图像。

进阶练习：额外出现一个噪点而检测到 16 个时，怎样显示“检测异常”而不是负数漏装？把它作为课堂逻辑的补充，不混入老师原始演示结论。

## 前后衔接

上一课：[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]。前置知识：[[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]]、[[CSharp VisionPro 图像形态学处理（腐蚀膨胀开闭运算）|C# VisionPro 图像形态学处理（腐蚀膨胀开闭运算）]]、[[CSharp 循环|C# 循环]]、[[CSharp 访问修饰符|C# 访问修饰符]]。

返回 [[机器视觉知识地图]] 或 [[5_System/课程视频索引]]。视频文件和原始转录保留；本文完成的是全段转录、结构化笔记与关键画面核验，自动转录原文仍可能存在错词。

