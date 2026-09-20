---
title: 'C# 高级控件（菜单 / 选项卡 / 分割 / 表格 / 文件对话框）'
tags: [CSharp, WinForms, 高级控件, ListView, ImageList, MenuStrip, DataGridView, OpenFileDialog, TabControl]
status: seedling
area: CSharp
aliases: [高级控件, 菜单栏, 右键菜单, 选项卡, 分割控件, 文件对话框, DataGridView]
related: [CSharp 选择控件补充（ListView 与 ComboBox）, CSharp 选择控件（RadioButton 与 ListBox）, CSharp 登录系统（窗体跳转与密码隐藏）, CSharp编程入门_视频笔记, CSharp 音效与图片（SoundPlayer 与 PictureBox）]
---
# C# 高级控件（菜单 / 选项卡 / 分割 / 表格 / 文件对话框）

8.17 上午的课，把 WinForms 剩下的常用控件**一次性补齐**：ListView 进阶 + ImageList、TabControl、SplitContainer / Splitter、MenuStrip / ContextMenuStrip、DataGridView、OpenFileDialog。

> 老师原话：**菜单栏、右键菜单、分割控件这些是"加分项"，知道怎么用就行**；真正重点记的是 **ListView** 和 **DataGridView** 这俩表格控件。

## 🧩 ListView 进阶（表格模式）

上节课认识了 ListView 的五种视图模式，这节课把它**当表格用**（View = Details）。

### 两个关键属性

| 属性 | 作用 |
|---|---|
| `FullRowSelect = True` | **选中整行**。默认只选单个单元格，设置后点一下选中一整行 |
| `GridLines = True` | 显示**网格线**，方便看清表格结构 |

### 编辑列（加表头）

- 点控件右上角小三角 → 「编辑列」→ 添加列：**姓名 / 年龄 / 性别 / 爱好**
- 可调列宽；列头文字居中：编辑列里设 **TextAlign = MiddleCenter**
- ⚠️ **坑：第一列无法设置对齐**（WinForms 自己的规定）
- 💡 **小机灵**：既然第一列不让用，就把第一列宽度设为 **0**，从**第二列**开始放真实内容（第二列放姓名、第三列年龄、第四列性别、第五列爱好）——剩下的列就都能居中了

### 编辑项（加行数据）

- 点小三角 → 「编辑项」→ 添加项 → 在最上边「项」的集合编辑器里按列填内容
- 例：张三 / 24 / 男 / 足球；李四 / 26 / 女 / 舞蹈
- 点**确定**生效；点**取消**刚写的内容全丢

## 🧩 ImageList（图片集合，加头像）

- **不可见控件**，相当于一个图片集合，往里面存图供别的控件用
- 点小三角 → 「图像」→ 添加图片；可设置图片大小
- 把 ImageList 绑到 ListView 的 **SmallImageList** 属性 → 图片集合进表格
- 每行的「项」里设 **ImageIndex** 选一张图 → **头像**显示出来（一般显示在第一列）

## 🧩 TabControl（选项卡）

- 相当于一个**小型"切换页面"控件**：点选项卡来回切换里面的内容
- 点小三角 → **添加选项卡 / 移除选项卡**
- 每个选项卡放不同控件：TabPage1 放 Label1、TabPage2 放 Label2……运行时来回切
- **用途**：窗体地方小、又想装多个控件时，用 TabControl 收纳，实现"切换页面"效果

## 🧩 SplitContainer（分割控件）

- 作用：把窗体/区域分割成**用户可拖动调整大小**的一块块
- 中间的**分隔条**用户能手动拖；一般搭配 **Dock** 属性使用
- 可以**嵌套**：分割后再分割，用颜色区分
- 每块里放不同控件；应用场景较小，知道是干嘛的即可

## 🧩 Splitter（旧版分割控件）

- 也是用户可拖动的分隔条，同样搭配 Dock
- 特殊点：小三角里能**切换方向**，上下/左右都能分割
- ⚠️ 比 SplitContainer **旧**，效果差不多但**推荐用 SplitContainer**

## 🧩 MenuStrip（顶部菜单栏）

- **顶部菜单控件**，运行时出现在窗体顶部
- 添加菜单项：**文件**（打开文件 / 新建文件 / 保存文件）、**工具**（图片工具 / 代码工具）、**视图**（居中查看 / 查看代码）
- 每个菜单项都可以设置**点击事件**（相当于一个按钮）
- **Dock 属性改位置**：默认 Top（顶部），可设 Left（左边）/ Bottom（底部）

## 🧩 ContextMenuStrip（右键菜单）

- 和 MenuStrip 一样是菜单，但平时**看不见，要右键才弹出**
- 添加菜单项：打开 / 关闭 / 查看 / 保存
- ⚠️ **关键：要绑定到目标控件** —— 设置控件的 **ContextMenuStrip** 属性为它
- 绑定后，对目标控件（窗体、PictureBox 等）**右键就能弹出菜单**

## 🧩 DataGridView（更强大的表格）

- 比 ListView **更方便**：编辑列 → 添加列（名字 / 年龄 / 性别），用户**可以直接在表格里编辑数据**
- **列类型可以换**：
  - 默认文本框
  - **按钮列**：用户点表格里的按钮（如「呼叫」）
  - **复选框列**：用户勾选是否选择
  - **下拉框列**：用户从下拉里选
- 优点：吸取了 ListView + 文本框的功能，还内置更多交互控件，写数据很爽
- ⚠️ **代码触发较复杂**（点按钮、勾选、下拉都涉及**单元格事件**），知道它是更强的表格控件即可

## 🧩 OpenFileDialog（打开文件对话框）

- **不可见控件**，弹系统「打开文件」窗口让用户选文件
- 代码激活就三句：

```csharp
openFileDialog1.ShowDialog();          // ① 弹出选择窗口
string path = openFileDialog1.FileName; // ② 用户选中文件点确定后，拿到文件地址
```

- **应用**：配合 PictureBox——让用户打开自己电脑里的图片，`pictureBox1.Image = Image.FromFile(path)` 加载显示

## 🧠 一句话总结

- 表格：ListView（Details 模式 + FullRowSelect + 第一列宽度设 0 的技巧）和 **DataGridView**（更爽，能放按钮/勾选框/下拉框）
- 头像：ImageList 图片集合 + 行项 ImageIndex
- 布局：TabControl 切页面、SplitContainer / Splitter 分割条
- 菜单：MenuStrip 顶部菜单、ContextMenuStrip 右键菜单（要绑控件）
- 打开文件：OpenFileDialog 三句代码拿地址，配合 PictureBox 导图片

## 📚 作业

1. 拖一个 ListView，Details 模式，练习「第一列宽度设 0、从第二列起」的技巧，把姓名/年龄/性别/爱好都居中
2. 用 ImageList 给 ListView 的人加上头像
3. 拖一个 DataGridView，试试按钮列和下拉框列
4. 拖一个 MenuStrip 做「文件」菜单 + ContextMenuStrip 绑到 PictureBox，右键图片弹菜单

---

**相关笔记：** [[CSharp 选择控件补充（ListView 与 ComboBox）|C# 选择控件补充（ListView 与 ComboBox）]] | [[CSharp 选择控件（RadioButton 与 ListBox）|C# 选择控件（RadioButton 与 ListBox）]] | [[CSharp编程入门_视频笔记#🎬 8月11日下午 — 文件夹与文件操作（增删改查 & TXT读写 & 打包）|C# 文件与文件夹操作]] | [[CSharp 音效与图片（SoundPlayer 与 PictureBox）|C# 音效与图片（SoundPlayer 与 PictureBox）]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

