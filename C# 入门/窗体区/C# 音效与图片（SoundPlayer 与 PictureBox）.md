---
tags: [CSharp, WinForms, 音效与图片]
status: budding
area: CSharp
aliases: [SoundPlayer, PictureBox, 音效播放, 图片显示]
related: [C# 窗体控件基础, C# 登录系统（窗体跳转与密码隐藏）, C# 垃圾回收 GC]
---
# C# 音效与图片（SoundPlayer / PictureBox）

WinForms 里两个好玩的东西：**SoundPlayer** 播放音效（wav），**PictureBox** 显示图片。机器视觉里「把图片倒进窗口里」靠的就是 PictureBox，所以它很重要。

## 🧩 SoundPlayer：播放音效

电脑自带的一个类，专门**播放 wav 音效**。代码特别短：

```csharp
SoundPlayer player = new SoundPlayer("音效文件路径.wav");
player.Play();
```

做个「音效不放弃」小项目：放几个按钮（音效1、音效2……），每个按钮点击就播放一个音效：

```csharp
private void button1_Click(object sender, EventArgs e)
{
    SoundPlayer player = new SoundPlayer("音效文件路径.wav");
    player.Play();
}
```

⚠️ **注意三点：**

1. **只支持 WAV 文件**——mp3 播不了
2. **路径必须带扩展名** `.wav`，漏了会报错「请确保指定的位置存在声音文件」
3. **用绝对路径别人用不了**——你的 `C:\Users\...` 在别人电脑上不存在

### 相对路径优化（素材放 Debug 目录）

把音效素材复制到项目的 **Debug 输出目录**（exe 旁边），然后用昨天学的**获取当前位置**的代码拼路径：

```csharp
// Application.StartupPath = exe 所在目录
SoundPlayer player = new SoundPlayer(Application.StartupPath + "\\sound.wav");
player.Play();
```

这样不管程序拷到哪台电脑，只要素材跟着 exe 走，就能播。

## 🧩 PictureBox：显示图片

专门用来**表示/展示图片**的控件。

### 设计器导入

1. 拖一个 **PictureBox** 到窗体
2. 点它**右上角的小三角** → 「选择图像」→ 在本地选一张图
3. 图片显示不完整？把 `SizeMode` 改成 **`StretchImage`**（拉伸）→ 图片会随控件大小自动填满

### 代码导入

```csharp
pictureBox1.Image = Image.FromFile("图片路径.jpg");
```

`Image.FromFile("路径")` 就是从文件加载图片。

### 按钮切换图片

素材图片按序号改名（1~25），每次点按钮切下一张：

```csharp
pictureBox1.Image = Image.FromFile(Application.StartupPath + "\\1.jpg");
```

图片的**绝对路径问题**和音效一样——素材放进 Debug 目录，用 `Application.StartupPath` 拼相对路径，发给别人也能用。

## 🧠 一句话总结

- **SoundPlayer** 播放 wav 音效：`new SoundPlayer(路径).Play()`，只认 wav、路径别漏扩展名
- **PictureBox** 显示图片：`Image.FromFile(路径)`，`SizeMode=StretchImage` 自适应大小
- 素材一律放 **Debug 目录**，用 `Application.StartupPath` 拼路径——否则换台电脑就找不到文件

## 📚 作业

1. 做一个「音效不放弃」：3 个按钮播 3 个不同的 wav 音效，记得用相对路径
2. 拖一个 PictureBox，设计器导入一张图，把 SizeMode 调成 StretchImage 试试
3. 用代码 `Image.FromFile` 导入一张图，再做一个按钮每次点击切下一张图

---

**相关笔记：** [[C# 窗体控件基础]] | [[C# 文件与文件夹操作]] | [[C# 垃圾回收 GC]] | [[C#编程入门_视频笔记]]
