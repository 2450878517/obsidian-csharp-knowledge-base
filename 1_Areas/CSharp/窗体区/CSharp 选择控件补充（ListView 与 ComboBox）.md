---
title: 'C# 选择控件补充（ListView / ComboBox）'
tags: [CSharp, WinForms, ListView, ComboBox, 选择控件]
status: budding
area: CSharp
aliases: [列表视图, 下拉框, ListView, ComboBox, 视图模式]
related: [CSharp 选择控件（RadioButton 与 ListBox）, CSharp 精灵对战游戏（进度条血条与战斗逻辑）, CSharp JSON 序列化（Newtonsoft.Json）, CSharp 列表 List]
---
# C# 选择控件补充（ListView / ComboBox）

接着上一课的选择控件。还有两个常用的：**ListView**（带图标和详细信息的列表）和 **ComboBox**（下拉框）。做管理系统、注册账号这类"让用户从一堆固定选项里挑"的界面，就靠它们。

## 🧩 ListView：列表视图（可视化的数据库）

跟 ListBox 有点像，但**更强**：不仅能让用户选择，还能塞**图标、多列详细信息**——可以理解成一个**可视化的数据库**。很多管理系统界面都是它做的。

### 五种视图模式（View 属性）

| 视图模式 | 样子 |
|---|---|
| `LargeIcon`（大图标） | 每个项显示一个**大图标**，下面带标签 |
| `SmallIcon`（小图标） | 每个项一个小图标，**右边带标签** |
| `List`（列表） | 小图标 + 标签，**竖向排列**，没有列表头 |
| `Details`（详细信息） | 显示**任意多列**：第一列可以含图标和标签，其他列只能文字，**有列表头** |
| `Tile`（平铺） | 每个项**完整大小图标**，右边带标签和信息 |

最常用的是 **Details**（详细信息）模式——像表格一样，有列表头，能列多个字段。

### 编辑列（Details 模式）

1. 把 ListView 的 `View` 设为 `Details`
2. 点控件**右上角小三角** → 「编辑列」（Columns）
3. 点「添加」创建列，改属性：第一个列名、第二个年龄、第三个性别……
4. 运行后就能看到**列表头**（表头列名）列出来了

### 往表格里塞数据

编辑好列之后，还要在「编辑项」（Items）里添加成员，才能显示到表格里。这课**先认识样子**，实际填充数据的操作等学完 JSON 再回来做（老师预告：会用 ListView 做一个**学生管理系统**）。

## 🧩 ComboBox：下拉框

拖一个 ComboBox 出来——就是个**下拉框**，点开能选一项。

### 作用

让用户**通过下拉框选择**，不用手动输入。比如注册账号填**出生日期**：展开选年份、选月份、选日期——总比自己手敲快、不容易错。

### 填内容（Items 编辑项）

点控件**右上角小三角** → 「编辑项」→ 一行一个输入内容（张三、李四、王五、赵六）→ 确定。运行后下拉框里就有这些选项了。

### 选中事件与获取选中值

```csharp
private void comboBox1_SelectedIndexChanged(object sender, EventArgs e)
{
    MessageBox.Show("你选择了：" + comboBox1.Text);
}
```

- **事件**：`SelectedIndexChanged`——用户选择发生改变（SelectedIndex 变了）时触发
- **获取选中的内容**：直接 `comboBox1.Text` 就能拿到当前选中的那一项

## 🧠 一句话总结

- **ListView**：可视化的数据库，`View=Details` 模式能做带表头的多列表格，适合管理系统；填充数据要配 JSON 用
- **ComboBox**：下拉框，`Items` 编辑项、`SelectedIndexChanged` 事件、`.Text` 拿选中值；适合「从固定选项里挑一个」（性别、日期）

## 📚 作业

1. 拖一个 ListView，切到 Details 模式，编辑列（名字/年龄/性别），看看列表头长啥样
2. 拖一个 ComboBox，编辑项填几个名字，用 `SelectedIndexChanged` 弹出 `comboBox1.Text`
3. 想想做学生管理系统时，性别/年级这些字段用哪个控件让用户选最合适

---

**相关笔记：** [[CSharp 选择控件（RadioButton 与 ListBox）|C# 选择控件（RadioButton 与 ListBox）]] | [[CSharp JSON 序列化（Newtonsoft.Json）|C# JSON 序列化（Newtonsoft.Json）]] | [[CSharp 列表 List|C# 列表 List]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

