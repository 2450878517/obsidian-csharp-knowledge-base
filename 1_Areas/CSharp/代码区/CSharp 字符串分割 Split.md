---
title: 'C# 字符串分割 Split'
tags: [CSharp, 字符串, Split, 字符串操作]
status: budding
area: CSharp
aliases: [Split, 分割字符串, 字符串切割, 按分隔符切]
related: [CSharp 字符串操作, CSharp 数组, CSharp 列表 List, CSharp 抽卡模拟器（概率充值保底）, CSharp 字典 Dictionary]
---
# C# 字符串分割 Split

之前学过 `ToCharArray()` 把字符串拆成**每个字符**；这次学 **`Split`**——按**特定的分隔符**把一串文字切成**好几段**，返回一个**字符串数组**。跟宝宝之前学的「按逗号切开一长串」是同一件事，正好这课补全。

## 🧩 需求：按逗号切三份

有一串 `"Apple,香蕉,Orange"`，想按中间的逗号切，得到三段：`Apple` / `香蕉` / `Orange`。

`ToCharArray()` 会把它拆成一个个字符（A、p、p、l、e、，、香、蕉……），不是我们要的。要用 **`Split`**：

```csharp
private void btnSplit_Click(object sender, EventArgs e)
{
    // 按逗号切，返回字符串数组
    string[] arr = textBox1.Text.Split(',');

    // 遍历，把切出来的内容一个个显示
    foreach (string s in arr)
    {
        textBox2.AppendText(s + "\r\n");
    }
}
```

- **`Split(分隔符)`**：返回 `string[]`（字符串数组），用 foreach 或下标 `arr[0]` 拿
- 分隔符写在括号里（这里是逗号字符 `','`）
- **只要出现分隔符就切一刀**，切完的每段是一个元素

界面演示：上面一个 TextBox 输入内容 → 中间「分割」按钮 → 下面一个 TextBox 显示切出来的每段。

## 🧩 四种常用切法

### ① 按单个字符切

```csharp
string[] arr = textBox1.Text.Split(',');    // 按逗号
```

### ② 按多个字符切（好几种符号都要切）

一段话里又有逗号、句号、分号、感叹号、问号，想全拆开：

```csharp
string[] arr = textBox1.Text.Split(new char[] { ',', '。', ';', '!', '?' });
```

把要切的符号**装进 `char[]` 数组**，出现**任何一个**就切一刀。

### ③ 去掉空白（连续两个分隔符会切出空段）

`"你,我,,他"` 中间两个逗号连在一起 → 切完有一段是**空的**（逗号之间没东西）：

```csharp
// 不加第二参数：切出空段 "你" "我" "" "他"
string[] arr = textBox1.Text.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
```

第二个参数 **`StringSplitOptions.RemoveEmptyEntries`** = 把切出来的**空段丢掉**。代码比较长，记住是固定搭配。

### ④ 限制切几份

只想切前 3 份，后面的不切了：

```csharp
string[] arr = textBox1.Text.Split(',', 3);   // 最多 3 份，剩下的不切
```

第三个参数（或第二参数）写数字，就是**最多切几份**。比如 `"你,我,他,足球,篮球"` 传 3 → 只出 `你` / `我` / `他,足球,篮球`（第三份是剩下的整段）。

## 🧩 实战：按标点把一段话切成一句句

上课演示：把「龟兔赛跑」那段文字，按标点符号一句一句切出来（每句话一行）。

```csharp
string[] arr = textBox1.Text.Split(new char[] { '。', '，', '！', '？' }, StringSplitOptions.RemoveEmptyEntries);
```

多符号切 + 去空段一起用，正好是最常见的组合。

## 🧠 一句话总结

**`Split` = 按分隔符把字符串切成数组：单字符 `Split(',')`、多符号 `Split(new char[]{...})`、去空段加 `StringSplitOptions.RemoveEmptyEntries`、限制份数传数字；切完用 foreach 遍历。**

## 📚 作业

1. 做分割小工具：输入 `"你好,今天天气很好,阳光明媚,再见"`，按逗号切，每段一行显示
2. 换成按多个符号（逗号、句号、分号、感叹号、问号）切一段话
3. 试试 `"你,我,,他"` 不丢空段和丢空段的效果差在哪
4. 找一段文章按标点切成一句句（去掉空段）

---

**相关笔记：** [[CSharp 字符串操作|C# 字符串操作]] | [[CSharp 数组|C# 数组]] | [[CSharp 列表 List|C# 列表 List]] | [[CSharp 抽卡模拟器（概率充值保底）|C# 抽卡模拟器（概率充值保底）]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

