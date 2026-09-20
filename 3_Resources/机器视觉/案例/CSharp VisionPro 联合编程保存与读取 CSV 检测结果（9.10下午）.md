---
title: "C# VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）"
category: 'VisionPro联合编程'
date: "2026-09-10"
processed_date: "2026-09-15"
tags: [机器视觉, CSharp, VisionPro, WinForms, 联合编程, CSV, StreamWriter, StreamReader, Encoding, GB2312, 数据保存, 数据读取, 硬币识别]
area: 机器视觉
status: budding
source: 'D:\BaiduNetdiskDownload\14班9.10下午.mp4'
duration: "00:56:29"
transcription_status: reviewed
review_scope: "全段语音转录与关键画面核对；CSV创建、表头写入、GB2312编码、追加检测数据、StreamReader读取和Form2显示按课堂逻辑整理，未在VisionPro中重新编译运行"
transcript: "5_System/Attachments/video-20260910-pm/转录原文.txt"
aliases: [9.10下午视频笔记, VisionPro CSV保存, 检测结果CSV记录, StreamWriter StreamReader]
related: ["[[CSharp VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）|CSharp VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）]]", "[[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]", "[[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]"]
---

# C# VisionPro 联合编程保存与读取 CSV 检测结果（9.10下午）

本节接着上午的三模板硬币识别案例，把一元、五角、一角硬币数量和总金额保存到 CSV 文件中，再在第二个窗体中读取并显示。

整体流程：

```text
CogToolBlock 检测硬币
        ↓
得到一元数量、五角数量、一角数量、总金额
        ↓
如果结果.csv 不存在：创建文件并写入表头
        ↓
使用追加模式写入本次检测结果
        ↓
Form2 使用 StreamReader 读取 CSV
        ↓
在多行 TextBox 中显示表头和数据
```

## 一、CSV 是什么

CSV 是一种用逗号分隔数据的文本格式。每一行通常表示一条记录，每个逗号分隔的内容表示一个字段。

本节的 `结果.csv` 可以整理成下面的形式：

```csv
一元的数量,五角的数量,一角的数量,总金额
3,2,5,4.5
2,1,8,3.3
```

CSV 的优点是结构简单、容易保存，也可以直接用 Excel 或记事本查看和修改。它适合保存检测记录、配置参数和小规模数据。如果数据量很大，或者需要多用户同时查询、修改和统计，则更适合使用数据库。

## 二、写入 CSV 的基本思路

写文件时要形成完整闭环：

```text
打开或创建文件
    ↓
写入表头或检测数据
    ↓
关闭文件
    ↓
释放资源
```

课堂中使用 `StreamWriter` 写入文本文件。直接写：

```csharp
StreamWriter sw1 = new StreamWriter("结果.csv");
```

文件会生成在程序的当前工作目录中。Visual Studio 调试时，通常就是项目的 `bin\Debug` 或 `bin\Debug\...` 目录，而不是源代码文件夹。

正式项目中，可以把路径写得更清楚：

```csharp
string csvPath = Path.Combine(
    Directory.GetCurrentDirectory(),
    "结果.csv");
```

## 三、创建文件并写入表头

表头只应该写一次。如果每次点击检测按钮都重新创建文件，之前的检测记录会被覆盖。因此要先用 `File.Exists` 判断文件是否存在：

```csharp
using System.IO;
using System.Text;

Encoding chinese = Encoding.GetEncoding("GB2312");

if (!File.Exists("结果.csv"))
{
    StreamWriter sw1 = new StreamWriter(
        "结果.csv",
        false,
        chinese);

    string[] headers =
    {
        "一元的数量",
        "五角的数量",
        "一角的数量",
        "总金额"
    };

    string res1 = string.Join(",", headers);
    sw1.WriteLine(res1);

    sw1.Close();
    sw1.Dispose();
}
```

这里的三个参数分别表示：

```csharp
new StreamWriter(文件路径, 是否追加, 使用的编码)
```

- `false`：不追加，创建表头时使用；如果文件已经存在，会覆盖原内容，所以必须配合 `!File.Exists`。
- `true`：追加到文件末尾，写入检测结果时使用。
- `chinese`：使用 GB2312，避免中文表头在部分 Excel 环境中乱码。

`string.Join(",", headers)` 会把数组中的字段用逗号连接起来：

```text
一元的数量,五角的数量,一角的数量,总金额
```

## 四、追加本次检测结果

上午案例中已经得到了几个变量，例如：

```csharp
int yiyuan;
int wujiao;
int yijiao;
double money;
```

检测完成后，用追加模式写一行：

```csharp
StreamWriter sw2 = new StreamWriter(
    "结果.csv",
    true,
    chinese);

string[] bodys =
{
    yiyuan.ToString(),
    wujiao.ToString(),
    yijiao.ToString(),
    money.ToString()
};

string res2 = string.Join(",", bodys);
sw2.WriteLine(res2);

sw2.Close();
sw2.Dispose();
```

每次检测都会在 CSV 最后一行增加一条记录。`true` 很重要；如果误写成 `false`，后一次检测可能会覆盖前面的内容。

如果检测结果来自 ToolBlock，完整位置通常是：

```csharp
ctb.Inputs["Image"].Value = cogRecordDisplay1.Image;
ctb.Run();

int yiyuan = Convert.ToInt32(
    ctb.Outputs["一元"].Value);
int wujiao = Convert.ToInt32(
    ctb.Outputs["五角"].Value);
int yijiao = Convert.ToInt32(
    ctb.Outputs["一角"].Value);

double money = yiyuan
             + wujiao * 0.5
             + yijiao * 0.1;
```

然后再执行表头检查和 `sw2` 追加代码。`ctb.Outputs[...]` 中的名称必须和 VisionPro ToolBlock 里定义的输出名称完全一致。

## 五、为什么要使用 GB2312

视频中专门讲了字符编码。常见编码的作用可以这样理解：

| 编码 | 课堂中的理解 | 注意点 |
|---|---|---|
| ASCII | 早期编码，主要覆盖英文字母、数字和符号 | 不能完整表示中文 |
| Unicode | 为世界各地文字提供统一编号 | 是字符集合和编码体系的基础概念 |
| UTF-8 | 常见的 Unicode 编码，兼容 ASCII | 适合网页和跨平台文本 |
| GB2312 | 早期中文编码 | 中文程序和旧版 Excel 中常见 |
| GBK | GB2312 的扩展 | 比 GB2312 覆盖更多汉字 |
| GB18030 | 中国国家标准编码 | 兼容范围更完整 |

如果写入文件时使用一种编码，读取或用 Excel 打开时按另一种编码解释，就可能出现中文乱码。本节写入和读取都使用：

```csharp
Encoding chinese = Encoding.GetEncoding("GB2312");
```

## 六、用 Form2 读取 CSV

课堂中新建了 `Form2`，放置一个按钮和一个多行 `TextBox`。`TextBox` 的 `Multiline` 要设置为 `true`，否则多行内容不能正常显示。

读取代码如下：

```csharp
private void Read_Click(object sender, EventArgs e)
{
    Encoding chinese = Encoding.GetEncoding("GB2312");

    StreamReader reader = new StreamReader(
        "结果.csv",
        chinese);

    // 先读取表头
    string header = reader.ReadLine();
    textBox1.Text = header + "\r\n";

    // 继续读取数据行，直到文件结束
    string line = "";
    while ((line = reader.ReadLine()) != null)
    {
        textBox1.Text += line + "\r\n";
    }

    reader.Close();
    reader.Dispose();
}
```

读取过程的关键是：`ReadLine()` 每次读一行，文件读完后返回 `null`，因此可以用 `while` 循环一直读取到文件末尾。

如果要防止文件不存在时报错，可以先加判断：

```csharp
if (!File.Exists("结果.csv"))
{
    MessageBox.Show("还没有检测记录");
    return;
}
```

## 七、把上午的检测和下午的保存合并

检测按钮可以按下面的顺序组织。这里保留课堂中容易理解的显式写法：

```csharp
private void Check_Click(object sender, EventArgs e)
{
    if (ctb == null || cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先加载 ToolBlock 和图片");
        return;
    }

    ctb.Inputs["Image"].Value =
        cogRecordDisplay1.Image;
    ctb.Run();

    int yiyuan = Convert.ToInt32(
        ctb.Outputs["一元"].Value);
    int wujiao = Convert.ToInt32(
        ctb.Outputs["五角"].Value);
    int yijiao = Convert.ToInt32(
        ctb.Outputs["一角"].Value);

    double money = yiyuan
                 + wujiao * 0.5
                 + yijiao * 0.1;

    Encoding chinese = Encoding.GetEncoding("GB2312");

    if (!File.Exists("结果.csv"))
    {
        StreamWriter sw1 = new StreamWriter(
            "结果.csv", false, chinese);

        string[] headers =
        {
            "一元的数量",
            "五角的数量",
            "一角的数量",
            "总金额"
        };

        sw1.WriteLine(string.Join(",", headers));
        sw1.Close();
        sw1.Dispose();
    }

    StreamWriter sw2 = new StreamWriter(
        "结果.csv", true, chinese);

    string[] bodys =
    {
        yiyuan.ToString(),
        wujiao.ToString(),
        yijiao.ToString(),
        money.ToString()
    };

    sw2.WriteLine(string.Join(",", bodys));
    sw2.Close();
    sw2.Dispose();
}
```

更稳妥的生产代码可以把 `StreamWriter` 和 `StreamReader` 放进 `using` 中，让程序自动关闭文件；但学习课堂代码时，先理解 `Close()` 和 `Dispose()` 的作用更重要。

## 八、容易出错的地方

| 现象 | 原因 | 修改方向 |
|---|---|---|
| `StreamWriter` 报错 | 没有传入文件路径 | 使用 `new StreamWriter("结果.csv", ...)` |
| 每次检测只剩一行 | 追加参数写成了 `false` | 写检测数据时使用 `true` |
| 表头重复很多次 | 每次检测都直接写表头 | 只有 `!File.Exists` 时创建表头 |
| 中文显示乱码 | 写入和读取编码不一致 | 两边都使用同一种 `Encoding` |
| 文件被占用 | CSV 正在被 Excel 或记事本打开 | 关闭外部程序后再写入 |
| 后续代码读不到记录 | 没有 `Close()` 或 `Dispose()` | 写完后及时释放文件资源 |
| 找不到 `结果.csv` | 当前工作目录和想象的不一致 | 用 `Directory.GetCurrentDirectory()` 检查实际目录 |
| `ReadLine()` 报空引用 | 文件为空，或第一行不存在 | 先判断文件存在并检查读取结果 |

## 九、课堂画面与原始资料

- 原始转录：[[5_System/Attachments/video-20260910-pm/转录原文.txt]]
- 原始字幕：[[5_System/Attachments/video-20260910-pm/原始字幕.srt]]
- 课堂画面总览：[[5_System/Attachments/video-20260910-pm/contact.jpg]]
- 创建 CSV：[[5_System/Attachments/video-20260910-pm/课堂代码-创建CSV.jpg]]
- 表头与 `string.Join`：[[5_System/Attachments/video-20260910-pm/课堂代码-表头.jpg]]
- GB2312 编码：[[5_System/Attachments/video-20260910-pm/课堂代码-GB2312编码.jpg]]
- 只创建一次表头：[[5_System/Attachments/video-20260910-pm/课堂代码-只创建一次表头.jpg]]
- 追加检测数据：[[5_System/Attachments/video-20260910-pm/课堂代码-追加检测数据.jpg]]
- 读取 CSV：[[5_System/Attachments/video-20260910-pm/课堂代码-读取CSV.jpg]]

## 关联笔记

- [[CSharp VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）|C# VisionPro 三模板匹配硬币统计与总金额计算（9.10上午）]]：上半节的三种硬币模板匹配、ToolBlock 输出和总金额计算。
- [[CSharp VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）|C# VisionPro 联合编程加载 ToolBlock 与齿轮检测（9.9下午）]]：加载 VPP、传入图像、运行 ToolBlock 和读取输出。
- [[CSharp VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）|C# VisionPro 联合编程环境搭建与 CogRecordDisplay 图像切换（9.9上午）]]：WinForms 控件、图片读取和 `CogRecordDisplay` 基础。
- [[CSharp VisionPro 工具总览（功能与介绍笔记）|C# VisionPro 工具总览（功能与介绍笔记）]]：机器视觉工具的总索引。

> 本节结论：检测程序不仅要得到结果，还要把结果可靠地留下来。用 `File.Exists` 控制表头只创建一次，用追加模式保存每次检测，再用统一编码读取，就能把一次性的 VisionPro 检测变成可追溯的记录。
