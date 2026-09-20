---
title: 'C# 登录系统（窗体跳转与密码隐藏）'
tags: [CSharp, WinForms, 登录系统]
status: budding
area: CSharp
aliases: [ShowDialog, PasswordChar, 窗体跳转, 密码隐藏, CheckBox]
related: [CSharp 窗体控件基础, CSharp 猜拳游戏, CSharp 音效与图片（SoundPlayer 与 PictureBox）]
---
# C# 登录系统（窗体跳转与密码隐藏）

把 [[CSharp 窗体控件基础|C# 窗体控件基础]] 的三个控件（Label / Button / TextBox）串成一个**登录系统**，再加上**跳转新窗体**和**密码隐藏**两个进阶功能。

## 🧩 界面搭建

- 一个 Label 当标题（登录系统）
- 两个 Label 提示（账号 / 密码）
- 两个 TextBox 让用户输入账号和密码
- 一个 Button（登录）

**小技巧：**
- **控件可以复制粘贴**——想做一个属性一模一样的控件，复制一个出来改名字就行（控件名字不一样，属性一样）
- **对齐一排控件**：按住 Ctrl 选中多个控件，用工具栏的对齐按钮——左对齐/居中/右对齐/顶端/底端/宽度相同/高度相同/大小相同/水平间距相等/垂直间距相等，排得整整齐齐

## 🧩 登录逻辑

```csharp
private void button1_Click(object sender, EventArgs e)
{
    // 第一步：判断账号
    if (textBox1.Text != "123456")
    {
        MessageBox.Show("该账号不存在，请重新输入");
        textBox1.Text = "";   // 账号输错自动清空，不用手动删
    }
    else if (textBox2.Text != "666666")
    {
        // 账号对了，再判断密码
        MessageBox.Show("密码输入错误，请重新输入");
        textBox2.Text = "";   // 密码输错自动清空
    }
    else
    {
        MessageBox.Show("登录成功！");
    }
}
```

账号、密码都对了才提示「登录成功」。

## 🧩 跳转新窗体

先添加一个新窗体：右键**解决方案里的项目** → 添加 → 窗体 → 添加。每个窗体其实都是一个**类**（Form2），所以要先用 `new` 实例化才能跳过去：

```csharp
private void button1_Click(object sender, EventArgs e)
{
    // ...判断登录成功后：
    Form2 f2 = new Form2();
    f2.Show();
}
```

两种跳转方式：

| 方法 | 效果 |
|---|---|
| `f2.Show()` | **非模态**：新窗体弹出后，旧窗体还能继续操作（两个都能点） |
| `f2.ShowDialog()` | **模态**：新窗体弹出后，旧窗体**被锁定**，必须把新窗体关掉才能操作旧窗体 |

## 🧩 密码隐藏

TextBox 自带隐藏密码的属性，两种写法：

```csharp
// 方式一：系统自带的小黑点
textBox2.UseSystemPasswordChar = true;

// 方式二：自己指定显示什么字符（星号、圆点都行）
textBox2.PasswordChar = '*';
```

`UseSystemPasswordChar` 只能用系统的小黑点；`PasswordChar` 更自由，你想密码显示成什么字符就填什么字符。

## 🧩 CheckBox 显示密码

密码藏起来太死了——加个 CheckBox（勾选框），勾上显示明文、取消又藏起来：

```csharp
// CheckBox 的事件是 CheckedChanged：勾选/取消勾选都会触发
private void checkBox1_CheckedChanged(object sender, EventArgs e)
{
    if (checkBox1.Checked)   // 判断框是否被勾选（返回 bool）
    {
        textBox2.PasswordChar = '\0';   // '\0' 空字符 = 不隐藏，显示原始密码
    }
    else
    {
        textBox2.PasswordChar = '*';    // 取消勾选，改回隐藏
    }
}
```

- `checkBox1.Checked`：判断勾选框是不是被选中了
- `PasswordChar = '\0'`：`\0` 是空字符，意思就是**不隐藏**

## 🧠 一句话总结

**登录系统 = 判断账号 → 判断密码 → 提示结果；跳转窗体用 `Show()`（都能点）或 `ShowDialog()`（锁旧窗体）；密码隐藏用 `PasswordChar`，加个 CheckBox 就能显示/隐藏密码。**

## 📚 作业

1. 搭一个登录系统：账号 `123456`、密码 `666666`，输错自动清空并提示
2. 登录成功跳转到一个新窗体，先试试 `Show()`，再换成 `ShowDialog()`，感受区别
3. 给密码框加隐藏（小黑点或星号），再加一个 CheckBox「显示密码」，勾上显明文、取消又藏起来

---

**相关笔记：** [[CSharp 窗体控件基础|C# 窗体控件基础]] | [[CSharp 音效与图片（SoundPlayer 与 PictureBox）|C# 音效与图片（SoundPlayer 与 PictureBox）]] | [[CSharp 猜拳游戏|C# 猜拳游戏]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

