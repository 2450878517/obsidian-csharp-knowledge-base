---
title: 'C# VisionPro 脚本控制工具（ToolBlock 高级脚本）'
category: '脚本与ToolBlock'
tags: [CSharp, 视觉, VisionPro, Cognex, 脚本, ToolBlock, 高级脚本, CogGraphicLabel, AddGraphicToRunRecord, 模板匹配, 结果输出]
status: seedling
area: 机器视觉
aliases: [VisionPro 脚本, ToolBlock 脚本, 高级脚本, 写代码操控工具, CogGraphicLabel 文字, AddGraphicToRunRecord]
related: [CSharp VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）, CSharp VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）]
---
# C# VisionPro 脚本控制工具（ToolBlock 高级脚本）

8.31 下午的课，正式用 **C# 脚本操控 VisionPro 工具**：在 **ToolBlock 的高级脚本**里写代码，把模板匹配的结果（数量、坐标、总金额）用文字显示到图片上。

> 📌 视觉课从「拖工具」跨到「写代码操控工具」的一步。**三处代码位置 + 自动/手动加引用 + AddGraphicToRunRecord 画文字**是核心；以后只要用脚本输出结果，都是这套。

## 🏗️ 为什么用脚本（ToolBlock）

- 要写脚本 → 用 **ToolBlock（图布莱克）** 工具，在 ToolBlock 里写脚本最方便
- 流程：**连接图片 → 放模板匹配工具 → 挑特征训练 → 运行看效果 → 创建脚本**
- 目的：手动拖转 100 次齿轮太累，用**代码循环**一次跑完；并可以把结果用**文字**直接画在图上
- ⚠️ 软件待机久了会报「安全性冲突」掉线，重开软件就行

## ✍️ 写脚本三部曲（三处代码位置，核心！）

写脚本前**先把三处代码位置标记好**，再往里面写逻辑：

### 第一处：private 成员变量区 —— 创建文字工具控件
```csharp
private CogGraphicLabel label = new CogGraphicLabel();
```
- 要用到哪个「显示控件」就**在这个区声明 + 实例化**（本课用的是文字 label）

### 第二处：GroupRun 里被折叠起来的方法中间 —— 取结果 + 配文字
```csharp
// 1. 获取工具，转成模板匹配类型
CogPMAlignTool pma1 = mToolBlock.Tools["CogPMAlignTool1"] as CogPMAlignTool;

// 2. 取它的结果数量
int c1 = pma1.Results.Count;          // 有几个匹配结果

// 3. 拼文字内容
label.Text = "工件数量是" + c1.ToString();

// 4. 配文字样式（颜色/坐标/字体）
label.Color = CognacColor.Green;      // 颜色（看不清就换 Green/Red）
label.X = 110; label.Y = 110;         // 像素坐标
label.Font = new Font("楷体", 24);    // 字体 + 字号
```

### 第三处：ModifyLastRunRecord 里 —— 把文字画到图片上
```csharp
mToolBlock.AddGraphicToRunRecord(label, lastRecord, "图片名", "");
```
- `AddGraphicToRunRecord` **四个参数**：① 展示谁(label)  ② 固定值 lastRecord  ③ 展示到哪张图片  ④ 空字符串
- ⚠️ **图片名要看图的实际输出名**，把前面的 `LastRun` 前缀去掉再抄过来
- 写完全部（生成编译）→ 零错误零警告 → 退出脚本 → 点运行

> 💡 运行后没结果、显示一串 `text`：多半是**工具名写错了**（比如忘了加数字 1），回去补上再编译。

## ⚠️ 大坑：先做工具，还是先创建脚本？（丢引用）

- ✅ **正确**：先把工具全部做完、效果跑出来 → **再创建脚本** → 脚本自动分析用了哪些工具 → **自动加好 using 引用**
- ❌ **错误**：先创建脚本、再去实现工具 → 工具**不会**自动加引用 → 编译报错
- 报错样子：第一句获取工具就报「**未能找到类型或命名空间**」——缺少程序集引用
- 对照代码：错误脚本少了 `using Cognex.VisionPro.PMAlign;`（模板匹配工具的程序集）
- 原因：先做工具再建脚本，系统能自动分析工具类型；先建脚本就分析不了

## 🔧 手动添加引用（补救，必会）

- 脚本上边一横排按钮里，有**双齿轮图标「添加或移除引用」**
- 点进去 → 看有没有要用到的程序集 → 没有就左上角「**新增**」→ 点**浏览**
- 找 VisionPro 安装目录（老师装 H 盘，大家默认 C 盘）：
  **VisionPro 目录 → Cortexa.VisionPro（VisionPro 主目录）→ Reference → Assemblies**
- `Assemblies` 文件夹里的 **.dll 全部是 VisionPro 程序集文件**
- 找 **`CogPMAlign.dll`**（还有带 `Ctrl4` 后缀的，不用管，就用基础的）
- 选中 → 打开 → 确定 ×2 → 引用添加成功
- 然后在代码最上边 `using` 区手动写：`using Cognex.VisionPro.PMAlign;`
- 再点编译就不再报错

> 🎯 结论：**怕丢引用就别偷懒** —— 写脚本前先把该做的工具操作做完，再创建脚本。

## 🎲 案例 1：骰子（头子）点数

- 骰子图是**彩色图**：先加**彩色转灰度工具**（CogImageConvertTool），转灰后再模板匹配
- 匹配其中一个点当模板 → 设数量 → 旋转角不用调 → 运行能看到红点都被匹配
- 匹配红点不够 → 适当把**阈值调低** → 再运行
- 点数匹配完 → 创建高级脚本（这次先做了工具，using 自动加好）
- 三处照旧：
  - 第一处：`private CogGraphicLabel label = new CogGraphicLabel();`
  - 第二处：`int res1 = pma1.Results.Count;` + `label.Text = "骰子的点数" + res1.ToString();`（红字看不清改绿，坐标 200,200，24 号字）
  - 第三处：`AddGraphicToRunRecord(label, lastRecord, "CogImageConvertTool1.OutputImage", "")`
- ⚠️ **图片名要点**：文字放转灰的图 → 抄转灰图输出名 **`CogImageConvertTool1.OutputImage`**，别死记模板匹配的图名（转灰图和彩色图是两张不同名字的图）
- 结果：各图点数 34 / 18 / 34 / 24 / 32 / 18 / 28 / 34（改绿色才看清）

## 💰 案例 2：硬币（三个模板匹配算总金额）

- 匹配 **一元 / 五角 / 一角** 三种硬币，用**三个模板匹配工具**
- **获取工具**：每个都 `mToolBlock.Tools["CogPMAlignTool1/2/3"] as CogPMAlignTool`（名字逐个加数字）
  ```csharp
  CogPMAlignTool pma1 = mToolBlock.Tools["CogPMAlignTool1"] as CogPMAlignTool; // 1元
  CogPMAlignTool pma2 = mToolBlock.Tools["CogPMAlignTool2"] as CogPMAlignTool; // 5角
  CogPMAlignTool pma3 = mToolBlock.Tools["CogPMAlignTool3"] as CogPMAlignTool; // 1角
  ```
- **各自数量**：`int c1 = pma1.Results.Count; int c2 = pma2.Results.Count; int c3 = pma3.Results.Count;`
- **总金额**（**统一 double 防类型改变**）：
  ```csharp
  double total = c1 * 1.0 + c2 * 0.5 + c3 * 0.1;
  ```
- **显示**：`label.Text = "总金额是" + total.ToString();`（黄色、坐标 150,150、楷体 24 号）
- **输出**：`AddGraphicToRunRecord(label, lastRecord, "CogImageConvertTool1.OutputImage", "")`
- 运行 → 总金额显示出来 → 老师把 **vpp 案例**发到群里，没看懂拿案例比对

## 🧠 一句话总结

1. **三处代码**：第一处 private 建控件 → 第二处取结果配文字 → 第三处画到图上
2. **AddGraphicToRunRecord 四参数**：控件 / lastRecord / 图片名 / 空字符串
3. **先做完工具再创建脚本**（自动加引用）；急着建脚本就得**手动加引用**（双齿轮图标 → 新增 → 浏览 → Assemblies 里选 .dll → using）
4. **图片名一定看图的实际输出名**，别写死某张图（转灰图 = `CogImageConvertTool1.OutputImage`）
5. 每步写完点**生成编译**查语法，零错误再运行

---

**相关笔记：** [[CSharp VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）|C# VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）]] | [[CSharp VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）|C# VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）]]

> 课程：8.31 下午 | 主题：VisionPro ToolBlock 高级脚本（写代码操控工具 + 结果文字输出） | 工具链：康耐视 VisionPro（CogPMAlign + CogGraphicLabel + AddGraphicToRunRecord）

## 对应案例

- [[CSharp VisionPro 脚本绘图与Blob结果标注（9.2上午）|C# VisionPro 脚本绘图与Blob结果标注（9.2上午）]]
- [[CSharp VisionPro 脚本批量测量与结果标注（9.2下午）|C# VisionPro 脚本批量测量与结果标注（9.2下午）]]
- [[CSharp VisionPro 液面高度批量测量与图像处理（9.3上午）|C# VisionPro 液面高度批量测量与图像处理（9.3上午）]]
- [[CSharp VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）|C# VisionPro 轴承滚珠缺陷检测与坐标回写（9.4下午）]]

