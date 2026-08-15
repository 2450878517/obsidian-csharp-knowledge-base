---
tags: [CSharp, WinForms, 猜拳游戏]
status: budding
area: CSharp
aliases: [石头剪刀布, 人机对战, 按钮互斥]
related: [C# 登录系统（窗体跳转与密码隐藏）, C# 窗体控件基础, C# 随机数]
---
# C# 猜拳游戏（石头剪刀布·人机对战）

把之前学的**随机数、分支判断、按钮的 Enabled** 串成一个完整的小游戏：你出招，电脑随机出招，比出胜负。

## 🧩 界面搭建

- 标题 Label（猜拳·人机对战）
- 「开始回合」按钮
- 三个出招按钮：**石头 / 剪刀 / 布**
- 一个 Label 显示**人机出招**
- 一个 Label 显示**赢家**

## 🧩 按钮互斥（Enabled 切换）

游戏的节奏：点「开始回合」→ 能出招；点完一招 → 回合结束，回到只能点「开始回合」。

所以三个出招按钮初始 `Enabled = false`（不能点）：

```csharp
// 点「开始回合」：出招按钮解锁
private void 开始回合_Click(object sender, EventArgs e)
{
    button石头.Enabled = true;
    button剪刀.Enabled = true;
    button布.Enabled = true;
    button开始回合.Enabled = false;   // 回合中，开始按钮锁住
}

// 点「石头」：回合结束，开始按钮恢复、出招按钮锁住
private void 石头_Click(object sender, EventArgs e)
{
    button石头.Enabled = false;
    button剪刀.Enabled = false;
    button布.Enabled = false;
    button开始回合.Enabled = true;
    // ...下面是出招判断逻辑
}
```

## 🧩 人机随机出招

用随机数模拟电脑：随机 1~3，对应石头/剪刀/布：

```csharp
Random r = new Random();
int n = r.Next(1, 4);   // 随机 1、2、3

if (n == 1) label人机出招.Text = "石头";
else if (n == 2) label人机出招.Text = "剪刀";
else label人机出招.Text = "布";
```

## 🧩 胜负判断

玩家的出招是固定的（点了哪个按钮就是哪个），所以只需要根据**电脑随机的结果**判断：

```csharp
// 玩家出「石头」的情况
if (n == 1)       // 电脑也出石头
{
    label赢家.Text = "平局！";
}
else if (n == 2)  // 电脑出剪刀，石头赢剪刀
{
    label赢家.Text = "玩家赢！";
}
else              // 电脑出布，布赢石头
{
    label赢家.Text = "人机赢！";
}
```

「剪刀」和「布」按钮的代码结构一样，只要把胜负关系改一改：
- 剪刀：剪刀赢布、输给石头、平剪刀
- 布：布赢石头、输给剪刀、平布

## 🧠 一句话总结

**猜拳 = 随机数模拟电脑出招 + 分支判断胜负 + 用 Enabled 控制回合节奏。** 三个按钮的代码结构一样，改改胜负关系就复制出一个。

## 📚 作业

1. 搭出猜拳界面：标题、开始回合、石头/剪刀/布、人机出招、赢家
2. 实现按钮互斥：开始回合后能出招，出完招回到开始
3. 用 `Random` 模拟人机出招，把石头/剪刀/布三种胜负判断都写出来
4. 想加难度的话，统计一下胜场数（用变量累加）

---

**相关笔记：** [[C# 登录系统（窗体跳转与密码隐藏）]] | [[C# 随机数]] | [[C# 分支语句]] | [[C# 窗体控件基础]] | [[C#编程入门_视频笔记]]
