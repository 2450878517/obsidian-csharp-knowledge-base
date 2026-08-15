import re
import os

# 第二批 20 篇笔记的新 frontmatter (文件 23-42)
files = {
    r"C# 入门\代码区\C# ref 和 out.md": """---
tags: [CSharp, 方法, 参数传递]
status: budding
area: CSharp
aliases: [ref, out, 引用参数, 输出参数]
related: [C# 方法, C# 泛型, C# 静态成员]
---""",
    r"C# 入门\代码区\C# 随机数.md": """---
tags: [CSharp, 方法, 随机数]
status: seedling
area: CSharp
aliases: [Random, 随机数生成]
related: [C# 方法, C# 猜拳游戏, C# 分支语句]
---""",
    r"C# 入门\代码区\C# 递归.md": """---
tags: [CSharp, 方法, 递归]
status: budding
area: CSharp
aliases: [递归, Recursion, 栈溢出]
related: [C# 方法, C# 调试, C# 循环]
---""",
    r"C# 入门\代码区\C# 委托.md": """---
tags: [CSharp, 方法, 委托]
status: evergreen
area: CSharp
aliases: [delegate, 多播委托, ?.Invoke]
related: [C# 委托进阶, C# 事件（Event）, C# 方法]
---""",
    r"C# 入门\代码区\C# 委托进阶.md": """---
tags: [CSharp, 方法, 委托, Lambda]
status: evergreen
area: CSharp
aliases: [Action, Func, Lambda, 匿名函数]
related: [C# 委托, C# 事件（Event）, C# 数组]
---""",
    r"C# 入门\代码区\C# 事件（Event）.md": """---
tags: [CSharp, 方法, 事件]
status: evergreen
area: CSharp
aliases: [event, 事件机制, 事件与委托]
related: [C# 委托, C# 委托进阶, C# 面向对象]
---""",
    r"C# 入门\代码区\C# 面向对象.md": """---
tags: [CSharp, 面向对象, 类与对象]
status: budding
area: CSharp
aliases: [class, OOP, 类, 对象, 封装继承多态]
related: [C# 构造函数, C# 属性, C# 方法]
---""",
    r"C# 入门\代码区\C# 属性.md": """---
tags: [CSharp, 面向对象, 属性]
status: budding
area: CSharp
aliases: [Property, get, set, 自动属性]
related: [C# 面向对象, C# 访问修饰符, C# 方法]
---""",
    r"C# 入门\代码区\C# 构造函数.md": """---
tags: [CSharp, 面向对象, 构造函数]
status: evergreen
area: CSharp
aliases: [构造方法, Constructor, base, 静态构造函数]
related: [C# 面向对象, C# this 关键字, C# 静态成员]
---""",
    r"C# 入门\代码区\C# this 关键字.md": """---
tags: [CSharp, 面向对象, this]
status: budding
area: CSharp
aliases: [this, 构造函数链]
related: [C# 构造函数, C# 面向对象, C# 静态成员]
---""",
    r"C# 入门\代码区\C# 调试.md": """---
tags: [CSharp, 面向对象, 调试]
status: budding
area: CSharp
aliases: [Debug, 断点, 逐语句, 调试模式]
related: [C# 异常处理, C# 异常处理进阶, C# 构造函数]
---""",
    r"C# 入门\代码区\C# 访问修饰符.md": """---
tags: [CSharp, 面向对象, 访问修饰符]
status: budding
area: CSharp
aliases: [public, private, protected, internal]
related: [C# 面向对象, C# 属性, C# 静态成员]
---""",
    r"C# 入门\代码区\C# 静态成员.md": """---
tags: [CSharp, 面向对象, 静态成员]
status: budding
area: CSharp
aliases: [static, 静态类, 静态方法, 静态字段]
related: [C# 构造函数, C# 面向对象, C# 访问修饰符]
---""",
    r"C# 入门\代码区\C# Equals 和 GetHashCode.md": """---
tags: [CSharp, 面向对象, 相等比较]
status: evergreen
area: CSharp
aliases: [Equals, GetHashCode, 值相等]
related: [C# 面向对象, C# 属性, C# 构造函数]
---""",
    r"C# 入门\代码区\C# 虚方法 virtual 与 重写 override.md": """---
tags: [CSharp, 面向对象, 虚方法, 多态]
status: evergreen
area: CSharp
aliases: [virtual, override, 重写, 多态]
related: [C# 抽象方法 abstract, C# 面向对象, C# 构造函数]
---""",
    r"C# 入门\代码区\C# 抽象方法 abstract.md": """---
tags: [CSharp, 面向对象, 抽象方法]
status: evergreen
area: CSharp
aliases: [abstract, 抽象类, 抽象方法]
related: [C# 虚方法 virtual 与 重写 override, C# 面向对象, C# 构造函数]
---""",
    r"C# 入门\窗体区\C# 窗体控件基础.md": """---
tags: [CSharp, WinForms, 窗体控件]
status: evergreen
area: CSharp
aliases: [Label, Button, TextBox, 窗体, 控件事件]
related: [C# 登录系统（窗体跳转与密码隐藏）, C# 音效与图片（SoundPlayer 与 PictureBox）, C# 事件（Event）]
---""",
    r"C# 入门\窗体区\C# 音效与图片（SoundPlayer 与 PictureBox）.md": """---
tags: [CSharp, WinForms, 音效与图片]
status: budding
area: CSharp
aliases: [SoundPlayer, PictureBox, 音效播放, 图片显示]
related: [C# 窗体控件基础, C# 登录系统（窗体跳转与密码隐藏）, C# 垃圾回收 GC]
---""",
    r"C# 入门\窗体区\C# 登录系统（窗体跳转与密码隐藏）.md": """---
tags: [CSharp, WinForms, 登录系统]
status: budding
area: CSharp
aliases: [ShowDialog, PasswordChar, 窗体跳转, 密码隐藏, CheckBox]
related: [C# 窗体控件基础, C# 猜拳游戏, C# 音效与图片（SoundPlayer 与 PictureBox）]
---""",
    r"C# 入门\窗体区\C# 猜拳游戏.md": """---
tags: [CSharp, WinForms, 猜拳游戏]
status: budding
area: CSharp
aliases: [石头剪刀布, 人机对战, 按钮互斥]
related: [C# 登录系统（窗体跳转与密码隐藏）, C# 窗体控件基础, C# 随机数]
---""",
}

base = r"D:\新建文件夹\obsidian"
success = 0
fail = 0

for relpath, new_fm in files.items():
    fpath = os.path.join(base, relpath)
    with open(fpath, "r", encoding="utf-8") as f:
        content = f.read()

    # 匹配旧的 3 行 frontmatter: ---\ntags: [...]\n---
    old_fm_pattern = r"^---\s*\ntags:\s*\[.*?\]\s*\n---\s*\n"
    new_content = re.sub(old_fm_pattern, new_fm + "\n", content, count=1)

    if new_content != content:
        with open(fpath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"OK  {relpath}")
        success += 1
    else:
        print(f"??  {relpath}  (未匹配到旧 frontmatter，跳过)")
        fail += 1

print(f"\n成功: {success}, 失败/跳过: {fail}")
