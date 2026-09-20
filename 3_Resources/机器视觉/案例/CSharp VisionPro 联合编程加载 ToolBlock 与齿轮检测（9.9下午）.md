---
title: "C# VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）"
category: 'VisionPro联合编程'
date: "2026-09-09"
processed_date: "2026-09-15"
tags: [机器视觉, CSharp, VisionPro, WinForms, 联合编程, CogToolBlock, CogToolBlockEditV2, CogSerializer, CogPMAlign, 齿轮检测, VPP]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.9下午.mp4'
duration: "01:13:57"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；ToolBlock 保存、VPP 加载、图像输入和 Results_Count 输出按课堂逻辑整理，未在 VisionPro 中重新编译运行"
transcript: "5_System/Attachments/video-20260909-pm/转录原文.txt"
aliases: [9.9下午视频笔记, 联合编程检测功能, WinForms加载VPP, CogToolBlock齿轮检测]
related: ["[[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]", "[[CSharp VisionPro 工具总览（功能与介绍笔记）|CSharp VisionPro 工具总览（功能与介绍笔记）]]", "[[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]]", "[[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）]]", "[[CSharp VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）|CSharp VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）]]"]
---

# C# VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）

本节接着上午的联合编程基础，完成一个真正可以运行的检测程序：先在 VisionPro 中做好齿轮模板匹配，将整个 `CogToolBlock` 保存为 `.vpp` 文件；再在 C# WinForms 中加载这个 VPP，把图片传给 ToolBlock，运行检测，并把模板匹配数量显示在窗体上。

核心流程是：

```text
VisionPro：搭建齿轮检测 ToolBlock
        ↓
设置 ToolBlock 输入和输出端口
        ↓
保存“无图像、无结果”的 ToolBlock VPP
        ↓
C# WinForms 加载 VPP
        ↓
CogImageFileTool 读取图片
        ↓
ToolBlock.Inputs["OutputImage"].Value = 图像
        ↓
ctb.Run()
        ↓
读取 ToolBlock.Outputs["Results_Count"].Value
        ↓
Label 显示匹配数量
```

## 一、窗体布局

课堂把窗体分成上下两块：

```text
上方 Panel
    ├─ CogRecordDisplay：显示当前图片
    ├─ 切换图片按钮
    ├─ 加载 VPP 文件按钮
    └─ 检测目标按钮

下方 Panel
    └─ CogToolBlockEditV2：查看当前加载的 ToolBlock
```

### 1. 为什么要用 Panel

VisionPro 控件是外部引入的 WinForms 控件，设计器中的大小和程序运行后的大小可能不一致，容易出现控件错位。把控件放进 `Panel`，再设置控件的 `Dock` 属性为 `Fill`，就能让它始终限制在 Panel 范围内。

推荐结构：

```text
Panel
    └─ CogRecordDisplay
       Dock = Fill
```

`CogToolBlockEditV2` 也可以放入单独的 Panel，并设置 `Dock = Fill`。

### 2. CogToolBlock 和 CogToolBlockEditV2 的区别

这两个名字很像，但用途不同：

| 控件 | 作用 |
|---|---|
| `CogToolBlock` | 真正执行视觉检测的工具对象，不一定显示在窗体上 |
| `CogToolBlockEditV2` | 用来查看、编辑和显示 ToolBlock 内容的界面控件 |

可以理解为：

```text
CogToolBlock：发动机，负责运行
CogToolBlockEditV2：仪表盘，负责查看和编辑
```

实际检测使用 `CogToolBlock.Run()`；想让操作者看到 VPP 中有哪些工具，把同一个 `CogToolBlock` 赋给：

```csharp
cogToolBlockEditV21.Subject = ctb;
```

## 二、先在 VisionPro 中制作齿轮 ToolBlock

### 1. 不要保存普通案例 VPP

联合编程要加载的是 `CogToolBlock` 保存出来的 VPP，而不是 QuickBuild 中包含完整采集流程的普通作业文件。

在 VisionPro 中：

1. 新建或打开 `CogToolBlock`。
2. 放入 `CogPMAlignTool`。
3. 训练齿轮模板。
4. 配置搜索区域、角度范围和分数阈值。
5. 用三张以上图片测试，确认匹配数量正确。
6. 设置 ToolBlock 的输入端口和输出端口。
7. 使用“另存为”保存 ToolBlock VPP。
8. 选择不带图像或结果的方式保存。

课堂示例将文件保存为 `齿轮.vpp`，之后放到 C# 项目的 `Debug/Vpp` 文件夹中。

保存时不带图像或结果，是为了让 VPP 更像一个可重复调用的检测模板：模板参数和工具配置保留，运行时的图像和旧结果由 C# 程序重新传入。

### 2. 设置 ToolBlock 输入端口

在 ToolBlock 的输入输出界面中添加一个输入端口，并把它连接到 PMAlign 的 `InputImage`：

```text
[Inputs]
    OutputImage ─────→ CogPMAlignTool1.InputImage
```

课堂示例把输入端口命名为 `OutputImage`。这个名字看起来有点反直觉，但代码必须完全按照 ToolBlock 端口名称书写：

```csharp
ctb.Inputs["OutputImage"].Value =
    cogRecordDisplay1.Image;
```

正式项目中也可以把它命名为 `InputImage`，但 C# 代码和 VPP 端口必须保持一致。

### 3. 设置 ToolBlock 输出端口

PMAlign 有一个结果属性：

```text
CogPMAlignTool1.Results.Count
```

把它连接到 ToolBlock 的输出端口，并命名为：

```text
Results_Count
```

最终结构类似：

```text
[Inputs]
    OutputImage ─────→ CogPMAlignTool1.InputImage

CogPMAlignTool1.Results.Count ─────→ [Outputs] Results_Count
```

`Results_Count` 是整数，表示当前图片中匹配到的齿轮数量。C# 中不用直接访问 ToolBlock 内部 PMAlign，而是从输出端口取得这个结果。

## 三、图片导入方式

本节复习了上午讲过的两种图片导入方式。

### 1. 按固定名称读取

这种方式相当于“偷懒法”：提前把图片改成 `0.jpg`、`1.jpg`、`2.jpg` 等连续名字，然后根据索引拼接路径。

```csharp
int n = 0;

private CogImageFileTool cift1 =
    new CogImageFileTool();

private void Next_Click(
    object sender,
    EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() +
        "/素材/" + n.ToString() + ".jpg";

    cift1.Operator.Open(
        path,
        CogImageFileModeConstants.Read);

    cift1.Run();

    cogRecordDisplay1.Image =
        cift1.OutputImage;

    cogRecordDisplay1.Fit();

    n++;

    // 示例中最后一张索引为 14
    if (n >= 15)
    {
        n = 0;
    }
}
```

这种方法代码短，但要求文件名和编号连续。中间少一张图，路径就可能读取失败。

### 2. 扫描文件夹读取

更推荐扫描法。它不要求文件名连续，只要扩展名符合，就把文件路径加入集合：

```csharp
int n = 0;

private CogImageFileTool cift1 =
    new CogImageFileTool();

private void Next_Click(
    object sender,
    EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() +
        "/素材";

    string[] names =
    {
        "*.jpg",
        "*.png",
        "*.bmp"
    };

    List<string> pictures =
        new List<string>();

    foreach (string name in names)
    {
        string[] ps =
            Directory.GetFiles(path, name);

        pictures.AddRange(ps);
    }

    if (pictures.Count == 0)
    {
        MessageBox.Show("素材文件夹中没有图片");
        return;
    }

    if (n >= pictures.Count)
    {
        n = 0;
    }

    cift1.Operator.Open(
        pictures[n],
        CogImageFileModeConstants.Read);

    cift1.Run();

    cogRecordDisplay1.Image =
        cift1.OutputImage;

    cogRecordDisplay1.Fit();

    n++;
}
```

扫描法的关键是：先扫描路径，再用列表索引读取。每次按钮只读取一张图片，不要在按钮事件中用循环一次性读完所有图片。

## 四、在 C# 中加载 VPP

### 1. ToolBlock 字段

`CogToolBlock` 必须放在窗体字段中，而不是只在加载按钮的方法内部创建。因为加载按钮和检测按钮是两个不同的方法，检测按钮也要访问同一个 ToolBlock。

```csharp
private CogToolBlock ctb =
    new CogToolBlock();
```

如果在 `Load_Click()` 中使用局部变量：

```csharp
CogToolBlock ctb = new CogToolBlock();
```

检测按钮就访问不到这个对象，容易出现变量不存在或对象没有加载的情况。

### 2. 加载 VPP 代码

```csharp
private void Load_Click(
    object sender,
    EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() +
        "/Vpp/齿轮.vpp";

    if (!File.Exists(path))
    {
        MessageBox.Show("找不到 VPP 文件：" + path);
        return;
    }

    // 从文件反序列化出 CogToolBlock
    ctb = CogSerializer.LoadObjectFromFile(path)
        as CogToolBlock;

    if (ctb == null)
    {
        MessageBox.Show("VPP 加载失败");
        return;
    }

    // 将 ToolBlock 显示在编辑控件中
    cogToolBlockEditV21.Subject = ctb;
}
```

这里使用了 `CogSerializer.LoadObjectFromFile()`。VPP 是序列化保存的 VisionPro 对象，读取时需要反序列化为 `CogToolBlock`。

### 3. 每次加载前是否清空

如果程序支持加载多个 VPP，可以在替换旧对象前释放或清空旧引用。核心是保证检测按钮使用的是刚刚加载的新 `ctb`，不要让旧 ToolBlock 和新 ToolBlock 混在一起。

## 五、运行 ToolBlock 检测目标

检测按钮必须在两个条件都满足后运行：

```text
已经加载 VPP
已经加载图片
```

推荐代码：

```csharp
private void Check_Click(
    object sender,
    EventArgs e)
{
    if (ctb == null)
    {
        MessageBox.Show("请先加载 VPP 文件");
        return;
    }

    if (cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先加载图片");
        return;
    }

    // 将当前图片传入 ToolBlock
    ctb.Inputs["OutputImage"].Value =
        cogRecordDisplay1.Image;

    // 运行视觉工具
    ctb.Run();

    // 获取 ToolBlock 输出端口的匹配数量
    int number = Convert.ToInt32(
        ctb.Outputs["Results_Count"].Value);

    // 显示在 Label 上
    label1.Text =
        "结果：" + number.ToString();
}
```

完整运行关系：

```text
CogRecordDisplay1.Image
        ↓
ctb.Inputs["OutputImage"].Value
        ↓
ctb.Run()
        ↓
ctb.Outputs["Results_Count"].Value
        ↓
label1.Text
```

### 1. 为什么不能先点击检测

如果没有加载 VPP，`ctb` 还没有真正的工具流程；如果没有导入图片，ToolBlock 没有输入图像。两种情况都会导致运行异常或没有结果。

正确顺序是：

```text
切换图片
    ↓
加载 VPP
    ↓
检测目标
```

换一张图片后，可以继续点击检测按钮，复用已经加载好的 ToolBlock。

### 2. 为什么要从 Outputs 取结果

ToolBlock 内部的 PMAlign 结果属于工具内部数据。为了让 C# 窗体能读取，必须先在 ToolBlock 中把需要的属性连接到 `[Outputs]`。

所以不能凭空写：

```csharp
ctb.Outputs["Results_Count"]
```

必须先确认 VisionPro 里确实存在名为 `Results_Count` 的输出端口，并且它连接的是 `CogPMAlignTool1.Results.Count`。

## 六、用 CogToolBlockEditV2 查看检测过程

给 `cogToolBlockEditV21.Subject` 赋值后，窗体下方可以看到：

- ToolBlock 中有哪些工具。
- 输入端口和输出端口名称。
- PMAlign 的模板匹配结果。
- 当前运行记录和图像。
- `Results.Count` 等输出数据。

它适合调试和教学查看。正式软件如果不希望操作者修改视觉参数，可以只保留 `CogToolBlock` 运行，把 `CogToolBlockEditV2` 设置为不可见或不允许编辑。

## 七、项目文件夹准备

课堂在程序的 `Debug` 目录下创建：

```text
Debug
├─ 素材
│  ├─ 齿轮图片1
│  ├─ 齿轮图片2
│  └─ 齿轮图片3
└─ Vpp
   └─ 齿轮.vpp
```

使用 `Directory.GetCurrentDirectory()` 时，程序运行目录必须确实包含这两个文件夹。也可以把文件设置为复制到输出目录，避免编译后 `bin/Debug` 中找不到资源。

如果 VisionPro 是 64 位安装，项目平台目标也要和 VisionPro 运行环境匹配。课堂提醒关闭“首选 32 位”；实际目标平台要以本机 VisionPro 版本和项目引用为准。

## 八、常见坏人

- 把 QuickBuild 的普通 VPP 当成 ToolBlock VPP：联合编程这里需要加载 `CogToolBlock`。
- 只在加载按钮方法里声明 `ctb`：检测按钮访问不到真正加载的对象，应该把它声明为窗体字段。
- ToolBlock 输入端口名字抄错：`Inputs["OutputImage"]` 必须和 VPP 中的实际名称一致。
- 没有把 `Results.Count` 接到 Outputs：C# 只能拿到已经暴露出来的输出端口。
- 先点检测再加载 VPP：先加载 ToolBlock，再传图和运行。
- 只设置 `Subject` 不传图片：`CogToolBlockEditV2` 能看到工具，但 ToolBlock 没有输入图像，运行不会得到有效结果。
- 没有执行 `ctb.Run()` 就读取 Outputs：输出仍然是旧值或空值。
- 把 `CogToolBlockEditV2` 当成检测工具：它是查看和编辑控件，真正运行的是 `CogToolBlock`。
- 图片路径写死且文件名不连续：优先使用扫描法，读取 `List<string>` 中的路径。
- 切图后不调用 `Fit()`：不同尺寸图片可能显示不完整。
- 保存 VPP 时带入旧图像和旧结果：联合编程时建议保存不带图像或结果的 ToolBlock。
- 32 位和 64 位平台不匹配：可能出现程序集加载失败、控件不能创建或运行时异常。

## 九、课程代码骨架

下面是把图片、加载 VPP 和检测串起来的简化结构。端口名称必须和自己的 VPP 一致：

```csharp
private CogToolBlock ctb =
    new CogToolBlock();

private CogImageFileTool cift1 =
    new CogImageFileTool();

private int n = 0;

private void Next_Click(
    object sender,
    EventArgs e)
{
    // 扫描素材目录，得到 pictures
    // 读取 pictures[n]
    // cogRecordDisplay1.Image = cift1.OutputImage
    // cogRecordDisplay1.Fit()
}

private void Load_Click(
    object sender,
    EventArgs e)
{
    string path =
        Directory.GetCurrentDirectory() +
        "/Vpp/齿轮.vpp";

    ctb = CogSerializer.LoadObjectFromFile(path)
        as CogToolBlock;

    cogToolBlockEditV21.Subject = ctb;
}

private void Check_Click(
    object sender,
    EventArgs e)
{
    ctb.Inputs["OutputImage"].Value =
        cogRecordDisplay1.Image;

    ctb.Run();

    int number = Convert.ToInt32(
        ctb.Outputs["Results_Count"].Value);

    label1.Text =
        "结果：" + number.ToString();
}
```

## 十、本节收尾

本节完成了联合编程的第一个完整闭环：

```text
VisionPro 做工具
        ↓
ToolBlock 封装流程
        ↓
Outputs 暴露结果
        ↓
VPP 保存模型
        ↓
C# 读取 VPP
        ↓
传入图片并运行
        ↓
读取结果并显示
```

以后把齿轮匹配换成 Blob、尺寸测量、瓶口缺陷检测或轴承滚珠检测，联合编程的主结构仍然不变：**加载工具、传入图像、运行工具、取出结果、显示结果**。

## 原始资料与课堂截图

- 视频：`D:\BaiduNetdiskDownload\14班9.9下午.mp4`
- 时长：73 分 57 秒
- [[5_System/Attachments/video-20260909-pm/转录原文.txt|转录原文]]
- [[5_System/Attachments/video-20260909-pm/原始字幕.srt|原始字幕]]

课堂截图：

- ![[5_System/Attachments/video-20260909-pm/课堂300.jpg]]
- ![[5_System/Attachments/video-20260909-pm/课堂900.jpg]]
- ![[5_System/Attachments/video-20260909-pm/课堂1500.jpg]]
- ![[5_System/Attachments/video-20260909-pm/课堂2100.jpg]]
- ![[5_System/Attachments/video-20260909-pm/课堂2700.jpg]]
- ![[5_System/Attachments/video-20260909-pm/课堂3300.jpg]]
- ![[5_System/Attachments/video-20260909-pm/课堂3900.jpg]]
- ![[5_System/Attachments/video-20260909-pm/课堂4400.jpg]]

## 关联链接

- [[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|C# VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]
- [[CSharp VisionPro 工具总览（功能与介绍笔记）|C# VisionPro 工具总览（功能与介绍笔记）]]
- [[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|C# VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]]
- [[CSharp VisionPro 脚本控制工具（ToolBlock 高级脚本）|C# VisionPro 脚本控制工具（ToolBlock 高级脚本）]]
- [[CSharp VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）|C# VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）]]
