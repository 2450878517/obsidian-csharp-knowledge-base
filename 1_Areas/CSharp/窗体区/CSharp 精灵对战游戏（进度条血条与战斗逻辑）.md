---
title: 'C# 精灵对战游戏（进度条血条与战斗逻辑）'
tags: [CSharp, WinForms, 精灵对战, 游戏]
status: budding
area: CSharp
aliases: [ProgressBar, 进度条血条, 精灵对战, 游戏战斗逻辑]
related: [CSharp 窗体控件基础, CSharp 猜拳游戏, CSharp 音效与图片（SoundPlayer 与 PictureBox）, CSharp 随机数]
---
# C# 精灵对战游戏（进度条血条与战斗逻辑）

把前面学的控件**拼成一个小游戏**：两个精灵对战，**进度条当血条**，点进攻掉对方血、点回血补自己血，敌方有 90% 概率进攻、10% 概率回血。这课教两件大事：**用进度条模拟血条** + **把重复代码封装成方法**（Boss 逻辑）。

## 🧩 界面布局（先搭框架）

- 新建项目「精灵对战」
- **两个精灵**：用 `PictureBox` 图片表示，左右各一个
- **两个 Label**：放精灵名字/信息
- **中间一个 Label**：写「对战」
- **两个 ProgressBar**：放精灵上方，当血条
- **下方战斗盘**：一个 `GroupBox`（标题「战斗精灵」），里面放两个 `Button`——「进攻」「回血」，改颜色区分（比如进攻红色、回血绿色）
- **右下角一个 TextBox**：`Multiline = true`（多行），显示战斗信息（谁打了谁多少血）

> 老师强调：**先搭空框架，再往里填内容**。就算回血逻辑一时不会写，框架打好了也能写多少填多少，比卡在一处强。工作中也一样——先让老板看到进度，再补细节。

## 🧩 素材管理（图片导入）

运行过一次程序后，`bin\Debug` 里才有东西。在里面建一个**「素材」文件夹**，把要用的图片（比如猫、狗）放进去。

然后在 **Form1 的 Load 事件**里加载图片（`Image.FromFile` 读文件）：

```csharp
private void Form1_Load(object sender, EventArgs e)
{
    pictureBox1.Image = Image.FromFile(Application.StartupPath + "\\素材\\猫.jpg");
    pictureBox2.Image = Image.FromFile(Application.StartupPath + "\\素材\\狗.jpg");

    pictureBox1.SizeMode = PictureBoxSizeMode.StretchImage;
    pictureBox2.SizeMode = PictureBoxSizeMode.StretchImage;
}
```

- `SizeMode = StretchImage`：图片拉伸填满控件，不然图小填不满
- SizeMode 也可以在设计器属性面板手动设，但**用代码设更放心**——防止你忘记
- 用 `Application.StartupPath` 拼相对路径（素材跟 exe 一起走），别写死绝对路径（[[CSharp编程入门_视频笔记#🎬 8月11日下午 — 文件夹与文件操作（增删改查 & TXT读写 & 打包）|C# 文件与文件夹操作]] 里学过）

## 🧩 血条初始化

`ProgressBar` 有三个关键属性：`Maximum`（最大值）、`Minimum`（最小值）、`Value`（当前值）。开局两边血都是满的：

```csharp
progressBar1.Maximum = 100;
progressBar1.Minimum = 0;
progressBar1.Value = 100;   // 满血
progressBar2.Maximum = 100;
progressBar2.Minimum = 0;
progressBar2.Value = 100;
```

## 🧩 数值平衡（游戏设计）

| 数值 | 我方 | 敌方 |
|---|---|---|
| 攻击力 | 10 | 15 |
| 回血 | 20 | 5 |

老师调了半天平衡：敌方攻击力高一点（15 > 10），但回血弱（5 < 20）——**敌方很强，但续航不如你**。这个数值自己定，代码逻辑一样的。

## 🧩 进攻逻辑（点「进攻」按钮）

**核心：先判断血够不够扣，防止扣成负数报错。** 攻击力 10，所以：

```csharp
private void button1_Click(object sender, EventArgs e)
{
    if (progressBar2.Value > 10)   // 血还有富余
    {
        progressBar2.Value -= 10;  // 扣 10
    }
    else                            // 血不够扣 10 了
    {
        progressBar2.Value = 0;    // 直接归零
        MessageBox.Show("对方倒下了！你获得了胜利！");
    }
    Boss();  // 我方出招完，轮到对方
}
```

## 🧩 回血逻辑（点「回血」按钮）

**同样要判断，防止回超 100 报错。** 回血 20，所以当血量 ≤ 80 时加 20 没问题，否则直接设 100：

```csharp
private void button2_Click(object sender, EventArgs e)
{
    if (progressBar1.Value <= 80)   // 加上 20 不会超
    {
        progressBar1.Value += 20;
    }
    else                            // 再回就超过 100 了
    {
        progressBar1.Value = 100;   // 直接拉满
    }
    Boss();  // 我方回完血，轮到对方
}
```

## 🧩 敌方 Boss 逻辑（封装成方法）

无论点「进攻」还是「回血」，**对方都要出招，而且逻辑一样**。如果每个按钮里都抄一遍，代码就重复了。所以**封装成一个方法** `Boss()`，两边都调用它：

```csharp
private void Boss()
{
    Random r = new Random();
    int i = r.Next(1, 101);          // 随机 1~100，模拟概率

    if (i >= 1 && i <= 90)           // 90% 概率：进攻
    {
        if (progressBar1.Value > 15) // 我方血还够扣
        {
            progressBar1.Value -= 15; // 敌方攻击力 15
        }
        else                          // 我方血不够 15 了
        {
            progressBar1.Value = 0;
            MessageBox.Show("我方倒下了……");
            button1.Enabled = false;   // 游戏结束，按钮禁用
            button2.Enabled = false;
        }
    }
    else                              // 10% 概率：回血（加 5）
    {
        if (progressBar2.Value <= 95) // 加 5 不超
        {
            progressBar2.Value += 5;
        }
        else
        {
            progressBar2.Value = 100; // 拉满
        }
    }
}
```

**要点：**
- **概率靠随机数区间模拟**：`r.Next(1, 101)` 出 1~100，落在 1~90 就是 90% 概率
- **外层 if 是概率判断**（进不进攻），**里层 if 是数值判断**（血够不够扣）——两层别混，先判断概率、再判断血量
- 血量不够扣时的分支：**直接归零 + 弹窗 + 禁用按钮**，游戏结束不能再点
- 用 `Enabled = false` 禁掉「进攻」「回血」按钮，防游戏结束后还点

## 🧩 战斗信息（TextBox 记日志）

右下角的 TextBox（多行）记录战斗过程，用 `AppendText` 追加（把文本接在后面而不是覆盖）：

```csharp
textBox1.AppendText("我方进攻，敌方扣了 10 点血\r\n");
```

在进攻/回血/Boss 里分别 `AppendText` 一句，就能看到完整的出招记录。

## 🧠 一句话总结

- **进度条 = 血条**：`Value` 就是当前血量，扣血/回血就是改 `Value`
- **扣血防负数、回血防超上限**——操作前先 if 判断
- **概率 = 随机数区间**：`Random.Next` 落在哪个区间就是哪种行为
- **重复逻辑封装成方法**（Boss()），进攻回血都调用，不写重复代码
- **游戏结束用 `Enabled = false` 禁用按钮**

## 📚 作业

1. 把精灵对战整个游戏做出来，血条、图片、进攻/回血、敌方随机出招
2. 自己调一套战斗数值（我方/敌方攻击力和回血），逻辑不变
3. 在战斗信息里记录每次出招（我方攻击多少、敌方回血多少）

---

**相关笔记：** [[CSharp 窗体控件基础|C# 窗体控件基础]] | [[CSharp 猜拳游戏|C# 猜拳游戏]] | [[CSharp 音效与图片（SoundPlayer 与 PictureBox）|C# 音效与图片（SoundPlayer 与 PictureBox）]] | [[CSharp 随机数|C# 随机数]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

