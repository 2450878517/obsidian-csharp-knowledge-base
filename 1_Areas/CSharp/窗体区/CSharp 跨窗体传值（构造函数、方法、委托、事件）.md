---
title: 'C# 跨窗体传值（构造函数 / 方法 / 委托 / 事件）'
tags: [CSharp, WinForms, 跨窗体传值, 委托, 事件, 构造函数, 文件对话框, DialogResult]
status: seedling
area: CSharp
aliases: [跨窗体传值, 窗体间传值, 委托传值, 构造函数传值, 二传一]
related: [CSharp 事件（Event）, CSharp 委托, CSharp 委托进阶, CSharp 登录系统（窗体跳转与密码隐藏）, CSharp 高级控件（菜单、选项卡、分割、表格、文件对话框）, CSharp编程入门_视频笔记]
---
# C# 跨窗体传值（构造函数 / 方法 / 委托 / 事件）

8.17 下午的课，讲全了**两个窗体之间怎么传数据**——这是 WinForms 里最常用的需求，也是登录系统、管理系统的基础。另外还补了文件对话框三兄弟、资源导入、对话框。

> 一个窗体传数据给另一个，分两个方向：**一传二**（Form1 → Form2）和 **二传一**（Form2 → Form1）。两个方向的方法不一样，重点在二传一。

## 📂 文件对话框三兄弟

| 控件 | 干嘛的 | 拿地址的写法 |
|---|---|---|
| `OpenFileDialog` | 让用户选择要**打开**的文件 | `openFileDialog1.FileName` |
| `SaveFileDialog` | 让用户找位置**保存**文件 | `saveFileDialog1.FileName` |
| `FolderBrowserDialog` | 让用户选择**文件夹** | `folderBrowserDialog1.SelectedPath` |

- 都是不可见控件，先 `ShowDialog()` 弹窗，用户确定后再拿地址
- ⚠️ **文件夹没有 FileName**（那是文件路径），用 **SelectedPath** 拿当前选的文件夹路径
- 例子：Open 是"选哪个文件打开"，Save 是"存到哪个文件"

## 🎨 导入资源 Resources（素材库）

- 位置：解决方案资源管理器 → **Properties → Resources.resx**（双击打开）
- 添加：左上角「添加资源」→ 起名（如 PK1/PK2）→ 类型选文件 → 选图片 → 勾「复制到该项目的资源目录中」
- 使用——直接点出来，**不用写路径**：

```csharp
pictureBox1.Image = Properties.Resources.PK2;
```

- 素材存在项目 `Resources` 文件夹里，**打包时跟着走**，换电脑也不崩，更安全
- ⚠️ 不能手动往文件夹复制素材直接用（VS 不认，资源必须通过资源文件管理）
- 两种方式对比：**放 Debug 目录**（方便随时增删）+ **资源库**（更安全、不依赖路径）

## 💬 对话框 DialogResult（让用户确定/取消）

MessageBox 不只能提示，还能让用户做选择：

```csharp
DialogResult dr = MessageBox.Show("是否继续", "提示", MessageBoxButtons.OKCancel);
if (dr == DialogResult.OK)
    MessageBox.Show("您已确定");
else
    MessageBox.Show("请再考虑考虑");
```

- `Show` 三个参数：**内容、标题、按钮**（OKCancel = 确定+取消）
- 应用：登录密码错了，弹窗让用户确定继续 / 取消重写

---

## 🔄 跨窗体传值 · 一传二（Form1 → Form2）

### 方式1：构造函数传值

Form2 构造函数加参数：

```csharp
public Form2(string str)
{
    InitializeComponent();
    textBox2.Text = str;      // 收下并显示
}
```

Form1 里 new 的时候直接传：

```csharp
Form2 f2 = new Form2(textBox1.Text);
f2.Show();
```

- ✅ 优点：简单、快
- ⚠️ 缺点：**不灵活**——改内容要重新实例化一个 Form2，不能随时随传

### 方式2：创建方法传值

Form2 里写个普通方法接收：

```csharp
public void Send(string str)
{
    textBox2.Text = str;
}
```

Form1 里调用：

```csharp
f2.Send(textBox1.Text);
```

- ⚠️ **大坑**：Form2 关掉后再打开，旧引用已释放 → 报「**无法访问已释放的对象**」
- 解决：**重新实例化**——字段 `f2` 重新 `new Form2()` 赋值新对象，再 Send 就能继续传
- 记忆点：关了就释放，想再用必须重新造一个，且**引用要指向新对象**

---

## 🔄 跨窗体传值 · 二传一（Form2 → Form1）

### 方式3：带返回值的方法 Get

触发点在 Form1，直接在 Form1 里取 Form2 的值：

Form2 写带返回值的方法：

```csharp
public string Get()
{
    return textBox1.Text;
}
```

Form1 的接收按钮：

```csharp
textBox2.Text = f2.Get();
```

### 方式4：委托传值（重点难点）

**场景**：想在 Form2 里调用 Form1 的方法（反向传）。但直接 `new Form1()` 不行——Form1 已经在运行了。老师比喻：**老猫生了一窝小猫，小猫不能再生出一窝老猫**。

改静态也不行：静态方法里用不了非静态字段（`textBox2` 是非静态）。

最后手段：**委托**。三步：

```
① Form2 声明委托          ② Form1 打开 Form2 时绑定 +=     ③ Form2 发送按钮触发
```

```csharp
// ① Form2 里
public delegate void SendMsg(string str);   // 或直接用 Action<string>
public SendMsg sendMsg;

// 发送按钮
private void button1_Click(object sender, EventArgs e)
{
    if (sendMsg != null)
        sendMsg(textBox1.Text);        // ③ 触发，把值传出去
}
```

```csharp
// ② Form1 打开 Form2 时绑定
private void button1_Click(object sender, EventArgs e)
{
    f2.sendMsg += delegate (string str)
    {
        textBox2.Text = str;           // Form1 的方法，被 Form2 间接调用
    };
    f2.Show();
}
```

**理解**：委托就是替 Form2 间接调用 Form1 的方法——Form2 无法直接调，就把 Form1 的方法绑到委托上，让委托帮它调。

### 方式5：事件（给委托加锁）

⚠️ **委托不安全**：谁都能调用它、能被 `=` 赋值覆盖、能改内容。所以——

```csharp
public event Action<string> sendMsg;   // 委托前加 event
```

- 加了 event 只能 **`+=` / `-=` 订阅**，不能 `=` 覆盖
- 只能 **声明类内部触发**（Form2 的发送按钮），外面不能直接调
- 有返回值的方法：用 **Func 委托**（无参有返回值 → `Func<string>`），接收逻辑同理：创建 → 绑定 → 触发

---

## 🧠 一句话总结

- 传值两个方向：**一传二**（构造函数 / 方法）顺手，**二传一**（方法带返回值 / 委托 / 事件）要靠中间人
- **委托**让 Form2 能"打电话"给 Form1（间接调用）；**事件** = 委托 + 锁（只能 +=、只能内部触发）
- 文件对话框：Open 拿 FileName、Save 拿 FileName、文件夹用 SelectedPath；资源用 `Properties.Resources.xx` 不用路径

## 📚 作业

登录系统：登录成功后进入 Form2 主界面，显示「欢迎用户 xxx 登录成功」——把账号从 Form1 传到 Form2（用构造函数传值即可）

---

**相关笔记：** [[CSharp 委托|C# 委托]] | [[CSharp 委托进阶|C# 委托进阶]] | [[CSharp 事件（Event）|C# 事件]] | [[CSharp 登录系统（窗体跳转与密码隐藏）|C# 登录系统（窗体跳转与密码隐藏）]] | [[CSharp 高级控件（菜单、选项卡、分割、表格、文件对话框）|C# 高级控件（菜单、选项卡、分割、表格、文件对话框）]] | [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

