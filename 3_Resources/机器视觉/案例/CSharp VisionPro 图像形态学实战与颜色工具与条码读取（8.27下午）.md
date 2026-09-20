---
title: 'C# VisionPro 图像形态学实战（柱状图）+ 颜色工具全系列 + 条码读取 CogID'
category: '图像处理与识别'
tags: [CSharp, 视觉, VisionPro, Cognex, IDB, 图像形态学处理, 腐蚀, 膨胀, 开运算, 闭运算, 卡尺Caliper, 颜色提取工具, 颜色匹配工具, 复合颜色匹配, CogID, 条形码, 二维码, 一维码, 柱状图高度测量]
status: seedling
area: 机器视觉
aliases: [柱状图形态学测量案例, 颜色提取工具, 颜色匹配工具, 复合颜色匹配工具, CogID读取条码, 二维码读取, 一维码读取, 形态学去干扰线]
related: [CSharp VisionPro 图像形态学处理（腐蚀膨胀开闭运算）, CSharp VisionPro Blob 斑点工具与颜色分割, CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）, CSharp VisionPro 工具大整理（全工具清单）, CSharp编程入门_视频笔记, CSharp 知识地图]
---
# C# VisionPro 图像形态学实战（柱状图）+ 颜色工具全系列 + 条码读取 CogID

8.27 下午的课，三连内容：① 用上午学的**图像形态学**做**柱状图高度测量**实战（干扰线当毛刺去掉再测）；② 把**颜色工具全家**讲完（提取、匹配、复合匹配——补齐分割工具以外的兄弟）；③ **CogID 工具**读一维码/二维码。都是机器视觉常用工具。

> 📌 核心：**上午的形态学不是白学的**——测带毛刺坐标轴的物体，先用 Blob+形态学把干扰线当毛刺去掉，再卡尺测量，比直接测准得多。颜色工具一锅端：**分割/提取 = 拿图去割**，**匹配/复合匹配 = 训练颜色然后打分**。ID 工具 = 条码解码器。

## 🧩 案例①：柱状图高度测量（形态学去干扰线 → 卡尺测高）

**场景**：要测柱子的高度，但图上**坐标轴横线、刻度线、文字**干扰。

- **不能直接卡尺测**：卡尺根据**极性**判断（黑白灰），彩色图要先**彩转灰**；但就算转了，坐标轴的**横线有厚度**，直接量会把厚度误算进高度 → 干扰精度（可能有几个�像素误差，高精度场合不能忍）
- 手动方案（麻烦）：先测出干扰厚度再减掉 → 还要多算一步，麻烦
- **好办法 = 形态学把干扰线当毛刺去掉**：
  1. 彩转灰 → 拿 **Blob 工具**，把柱子**当斑点**（设**白底黑点**）→ 运行
  2. 在 Blob 的**图像形态学操作**里，用**一次腐蚀正方形** → 运行 → **神奇！坐标轴/刻度线/文字这些小细线全被削没了（当毛刺腐蚀掉），只剩柱子**
  3. 但腐蚀把柱子**上边、侧边也削了一圈** → 再**膨胀正方形**复原回去 → **柱子回到原样，干扰线没了**
  4. 现在再测高度/宽度就干净了

> ⚠️ **手动加输出图像**：卡尺要连的是**削掉干扰线后的图**，但这个图 Blob **默认不输出**。操作：Blob 工具**右键 → 添加终端** → 终端里默认只显示**"典型"**常用输入输出 → 把类型切换成**"所有"**（未过滤）→ 展开 `Results`（Redox）→ 找第 3 项 **`Carita Blob Image`**（类型为八灰度/灰度图，**这就是测出来的图像**）→ 添加输出 → 连接给卡尺
- 然后**卡尺测高/测宽**都能测了（案例里高度 275 就出来了）
- **结论**：测量带**毛刺/干扰线**的物体，先形态学处理再去干扰，比直接测精确。不需要算横坐标厚度了

## ✅ 颜色工具全系列（Color 文件夹四兄弟）

颜色工具一共有 4 个，之前只学了第一个（分割），下午把剩下 3 个都补齐：

### 1. 颜色分割工具 CogColorSegmenter2（已学，复习对比用）

- **取色方式**：**选择点**（单个像素点颜色）/ **选择区域**（取区域**平均色**）
- 可分**多种**颜色，但每个颜色都是**平均色**（固定一个纯色）→ **重在"割"**：用平均色去把图中该色的部分**割出来**
- **查找未知颜色/自动分类**：图像色彩多样、要同时分割不同颜色的物体时用

### 2. 颜色提取工具 CogColorExtractor2（新学）

- 界面类似分割，也是**新增 → 框选 → 接受**
- **区别核心**：它不是取平均色，而是**提取原版的一整片颜色**（框选的整片色彩分布）→ 运行时**拿着这一整片颜色去做对比**（不平均）
- **重在"提取"**：已知这片的颜色分布，找图中**一片区域**的颜色（如糖果/胶囊的渐变颜色）
- 使用场景：提取一片颜色直接匹配渐变物体；配 Blob 也能做数量检测（同分割）

### 3. 颜色匹配工具 CogColorMatch2（新学，像"颜色版模板匹配"）

- 在图中**训练一个颜色**（选点或选区域）→ 运行时给**整张图**的匹配**分数**（0~1 的相似度，如 0.673 = 67.3%）
- **注意**：这里的分数是**匹配程度**（该颜色和整张图整体相似多少），**不是面积占比**
- **典型应用**：食品包装按口味区分——先训练黄瓜味薯片的颜色，其他口味包装图分低、同口味分高（案例：红色训练 → 红图 93.2%、蓝图 45.7%、黄图 51.4%）。类似**肤色例子**：黄种人肤色在上海匹配度高，放非洲/欧洲就低
- RGB 三原色理解：图里总有 R/G/B 成分，所以非目标色也会有部分匹配分

### 4. 复合颜色匹配工具（CogColorMatchTool？图标是多颜色）

- 跟颜色匹配**类似**，但匹配的是**一整片/复合颜色**（不是单一纯色）：训练时框选一片区域（只能新增一片区域 → 接受 → **训练**）→ 拿这片复合颜色和整图对比 → 给匹配分数
- 案例：识别胶囊（训练胶囊整片复合色 → 匹配度 0.92 很高）；逐步再加背景色会拉低分数
- 对比表（关键！）：

| 工具 | 训练的内容 | 匹配/对比方式 | 用途 |
|---|---|---|---|
| 颜色分割 | 单个点色 / 区域**平均色** | 用纯色**割**出来 | 未知颜色、多颜色同时分割 |
| 颜色提取 | **一整片**颜色 | 拿整片做**对比** | 已知颜色找区域（渐变糖果/胶囊） |
| 颜色匹配 | 单个**纯色** | 和整张图打分 | 按口味/类别区分（薯片、肤色） |
| 复合颜色匹配 | **一整片复合色** | 和整张图打分 | 匹配复杂目标（胶囊、包装） |

> 一般**分割最常用**（能点又能区域、最灵活）；提取/匹配了解即可，但要知道区别。

## ✅ CogID 工具：读一维码 / 二维码

- ID 工具（倒数第二个文件夹，`CogID2`）= **条码解码器**，读**条码/二维码**里加密的信息
- **首次运行报错"图像类型不受支持"** ← 彩图不行，**先彩转灰**再读
- 左边设置一堆**代码系统**，重要的就两个：
  - **读一维码（条形码）→ 勾选 `Code 128`**（一维码 = Code128）
  - **读二维码 → 勾选 `QR 代码`**（二维码 = QR）
  - ⚠️ 默认只勾了常用项，**没勾 QR 时读二维码会没结果**——先勾对再运行
- 运行后 `Results` 里有**解码的字符串**（如 `1314520`、`1234567890`；老师现场拍身边的士力架包装上条形码 → **6977644970768** 完美读出）
- 读出来用**文字工具**把字符串展示到图上
- **自己做素材**：浏览器搜"在线生成条形码"生成后下载导入即可练

## 🧠 一句话总结

1. **测带干扰线/毛刺的物体**：彩转灰 → Blob（白底黑点）当斑点 → **一次腐蚀去掉干扰线**（当毛刺）→ **膨胀复原**目标 → 再测高宽；Blob 输出图像**默认没有**，要在**添加终端里类型切"所有"**找 `Carita Blob Image`（八灰度）加出来
2. **颜色四兄弟**：分割=纯色/平均色**割出来**；提取=整片颜色**对比**；匹配=纯色**打分**；复合匹配=整片颜色**打分**——**匹配类都是"训练颜色→给整图相似度分数"**
3. **匹配分数**是相似度（0~1），不是面积占比；红训练色 对红图 93.2%、蓝图 45.7%
4. **ID 工具读条码**：彩图先**彩转灰**；**一维码勾 Code128，二维码勾 QR**；结果里出解码字符串，文字工具展示

## 条形码联合编程扩展：加入串口

完整流程：

~~~text
打开串口 → 运行 ToolBlock → 读取 CogIDTool1 结果
        → 取得 DecodedData.DecodedString
        → 按通信协议发送给 PLC 或其他设备
~~~

### 一、添加引用和串口对象

外部 WinForms 的 Form1.cs 顶部加入：

~~~csharp
using System.IO.Ports;
using System.Text;
using Cognex.VisionPro.ID;
~~~

Form1 类中加入：

~~~csharp
private SerialPort barcodeSerialPort =
    new SerialPort();

private CogToolBlock ctb =
    new CogToolBlock();
~~~

### 二、显示并打开 COM 口

假设窗体上有 comboBoxPort、buttonOpenSerial 和 labelSerial：

~~~csharp
private void Form1_Load(object sender, EventArgs e)
{
    string[] ports = SerialPort.GetPortNames();
    comboBoxPort.Items.Clear();
    comboBoxPort.Items.AddRange(ports);

    if (comboBoxPort.Items.Count > 0)
    {
        comboBoxPort.SelectedIndex = 0;
    }

    barcodeSerialPort.DataReceived +=
        BarcodeSerialPort_DataReceived;
}

private void buttonOpenSerial_Click(
    object sender,
    EventArgs e)
{
    try
    {
        if (barcodeSerialPort.IsOpen)
        {
            labelSerial.Text = "串口已经打开";
            return;
        }

        barcodeSerialPort.PortName =
            comboBoxPort.Text.Trim();
        barcodeSerialPort.BaudRate = 9600;
        barcodeSerialPort.DataBits = 8;
        barcodeSerialPort.Parity = Parity.None;
        barcodeSerialPort.StopBits = StopBits.One;
        barcodeSerialPort.Handshake = Handshake.None;
        barcodeSerialPort.Encoding = Encoding.ASCII;
        barcodeSerialPort.NewLine = "\r\n";

        barcodeSerialPort.Open();
        labelSerial.Text =
            barcodeSerialPort.PortName + " 已打开";
    }
    catch (Exception ex)
    {
        labelSerial.Text = "串口打开失败";
        MessageBox.Show(ex.Message);
    }
}
~~~

9600、8N1 只是示例，必须按 PLC 或设备说明书修改波特率、校验位、停止位和结束符。

### 三、读取 CogID 条码字符串

CogIDResult 先通过 DecodedData 得到解码结果，再从 DecodedString 读取字符串。工具名必须换成 VPP 中的真实名称。

~~~csharp
private string GetBarcodeText()
{
    if (ctb == null ||
        !ctb.Tools.Contains("CogIDTool1"))
    {
        return "";
    }

    CogIDTool idTool =
        ctb.Tools["CogIDTool1"] as CogIDTool;

    if (idTool == null ||
        idTool.Results == null ||
        idTool.Results.Count == 0)
    {
        return "";
    }

    for (int i = 0; i < idTool.Results.Count; i++)
    {
        if (idTool.Results[i].DecodedData == null)
        {
            continue;
        }

        string code =
            idTool.Results[i].DecodedData.DecodedString;

        if (!string.IsNullOrWhiteSpace(code))
        {
            return code.Trim();
        }
    }

    return "";
}
~~~

### 四、把检测和发送接到同一个按钮

这段代码接在原来的联合编程检测按钮中：先运行 ToolBlock，再读码，再发消息。

~~~csharp
private void buttonCheck_Click(
    object sender,
    EventArgs e)
{
    if (ctb == null ||
        cogRecordDisplay1.Image == null)
    {
        MessageBox.Show("请先加载 VPP 和输入图像");
        return;
    }

    if (!ctb.Inputs.Contains("OutputImage"))
    {
        MessageBox.Show("请核对 ToolBlock 图像输入终端");
        return;
    }

    ctb.Inputs["OutputImage"].Value =
        cogRecordDisplay1.Image;
    ctb.Run();

    cogRecordDisplay2.Image =
        cogRecordDisplay1.Image;
    cogRecordDisplay2.Record =
        ctb.CreateCurrentRecord();
    cogRecordDisplay2.Fit();

    string barcode = GetBarcodeText();

    if (string.IsNullOrWhiteSpace(barcode))
    {
        labelResult.Text = "读码失败";
        SendSerialMessage("NG|NO_READ");
        return;
    }

    labelResult.Text = "条码：" + barcode;
    SendSerialMessage("OK|" + barcode);
}
~~~

### 五、发送消息

下面约定每条消息使用回车换行结束：

~~~csharp
private void SendSerialMessage(string message)
{
    if (!barcodeSerialPort.IsOpen)
    {
        labelSerial.Text = "串口未打开，未发送";
        return;
    }

    try
    {
        barcodeSerialPort.WriteLine(message);
        labelSerial.Text = "已发送：" + message;
    }
    catch (Exception ex)
    {
        labelSerial.Text = "发送失败";
        MessageBox.Show(ex.Message);
    }
}
~~~

发送内容示例：

~~~text
OK|6977644970768\r\n
NG|NO_READ\r\n
~~~

如果设备规定使用 STX/ETX 控制字符，则改成：

~~~csharp
private void SendStxEtx(string barcode)
{
    if (!barcodeSerialPort.IsOpen)
    {
        return;
    }

    string frame = "\x02" + barcode + "\x03";
    barcodeSerialPort.Write(frame);
}
~~~

两种协议不要同时发送，严格按设备协议选择一种。

### 六、接收设备回复

串口事件在后台线程中触发，不能直接修改 WinForms 控件：

~~~csharp
// 把这一行放进前面的 Form1_Load 中，只注册一次
// barcodeSerialPort.DataReceived +=
//     BarcodeSerialPort_DataReceived;
 
private void BarcodeSerialPort_DataReceived(
    object sender,
    SerialDataReceivedEventArgs e)
{
    string receive =
        barcodeSerialPort.ReadExisting();

    if (IsDisposed)
    {
        return;
    }

    BeginInvoke(new Action(delegate
    {
        textBoxSerialReceive.AppendText(
            receive + Environment.NewLine);
    }));
}
~~~

如果设备会分包发送，要增加接收缓存，等收到约定的回车换行或 ETX 后再解析，不能把每次 ReadExisting 都当成完整消息。

### 七、关闭串口

~~~csharp
private void Form1_FormClosing(
    object sender,
    FormClosingEventArgs e)
{
    if (barcodeSerialPort.IsOpen)
    {
        barcodeSerialPort.Close();
    }

    barcodeSerialPort.Dispose();
}
~~~

推荐先约定如下协议：

| 内容 | 示例 |
|---|---|
| 读码成功 | OK\|6977644970768 + 回车换行 |
| 读码失败 | NG\|NO_READ + 回车换行 |
| 设备确认 | ACK + 回车换行 |
| 设备拒绝 | NACK + 回车换行 |

## 📚 作业 / 练习

1. **柱状图案例**：彩转灰 → Blob 白底黑点 → 腐蚀一次去坐标轴干扰线 → 膨胀复原 → 手动加 Blob 图像输出（终端切所有→`Carita Blob Image`）→ 卡尺测高（275）
2. **颜色提取**：拿糖果/胶囊图，用 **CogColorExtractor2** 提取一片颜色 → 配 Blob 数数量，对比和颜色分割的差异
3. **颜色匹配**：找几张不同颜色的图（红/蓝/黄），训练红色 → 运行到各图，看分数高低（93.2 vs 45.7 vs 51.4），理解"训练色 vs 整图相似度"
4. **复合颜色匹配**：训练胶囊整片颜色 → 运行 → 看 0.92 高匹配度，理解复合颜色打分
5. **读条码**：收集身边士力架等包装上的条码图 + 在线生成的二维码图 → CogID2 彩转灰 → 一维码勾 Code128、二维码勾 QR → 读出字符串 → 文字工具展示

---

**相关笔记：** [[CSharp VisionPro 图像形态学处理（腐蚀膨胀开闭运算）|C# VisionPro 图像形态学处理（腐蚀膨胀开闭运算）]] | [[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]] | [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]] | [[CSharp VisionPro 工具大整理（全工具清单）|C# VisionPro 工具大整理（全工具清单）]] | [[视觉测量工具箱]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]] | [[CSharp 知识地图|C# 知识地图]]

> 课程：8.27 下午 | 主题：形态学实战（柱状图）+ 颜色工具全系列（提取/匹配/复合匹配）+ 条码读取 CogID | 工具链：康耐视 VisionPro 图形化工具（形态学应用 + 颜色匹配 + 条码解码篇）
