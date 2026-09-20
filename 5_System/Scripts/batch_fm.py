import re
import argparse
import shutil
from datetime import datetime
from pathlib import Path

# 第二批 20 篇笔记的新 frontmatter (文件 23-42)
files = {
    r"1_Areas\CSharp\代码区\C# ref 和 out.md": """---
tags: [CSharp, 方法, 参数传递]
status: budding
area: CSharp
aliases: [ref, out, 引用参数, 输出参数]
related: [C# 方法, C# 泛型, C# 静态成员]
---""",
    r"1_Areas\CSharp\代码区\C# 随机数.md": """---
tags: [CSharp, 方法, 随机数]
status: seedling
area: CSharp
aliases: [Random, 随机数生成]
related: [C# 方法, C# 猜拳游戏, C# 分支语句]
---""",
    r"1_Areas\CSharp\代码区\C# 递归.md": """---
tags: [CSharp, 方法, 递归]
status: budding
area: CSharp
aliases: [递归, Recursion, 栈溢出]
related: [C# 方法, C# 调试, C# 循环]
---""",
    r"1_Areas\CSharp\代码区\C# 委托.md": """---
tags: [CSharp, 方法, 委托]
status: evergreen
area: CSharp
aliases: [delegate, 多播委托, ?.Invoke]
related: [C# 委托进阶, C# 事件（Event）, C# 方法]
---""",
    r"1_Areas\CSharp\代码区\C# 委托进阶.md": """---
tags: [CSharp, 方法, 委托, Lambda]
status: evergreen
area: CSharp
aliases: [Action, Func, Lambda, 匿名函数]
related: [C# 委托, C# 事件（Event）, C# 数组]
---""",
    r"1_Areas\CSharp\代码区\C# 事件（Event）.md": """---
tags: [CSharp, 方法, 事件]
status: evergreen
area: CSharp
aliases: [event, 事件机制, 事件与委托]
related: [C# 委托, C# 委托进阶, C# 面向对象]
---""",
    r"1_Areas\CSharp\代码区\C# 面向对象.md": """---
tags: [CSharp, 面向对象, 类与对象]
status: budding
area: CSharp
aliases: [class, OOP, 类, 对象, 封装继承多态]
related: [C# 构造函数, C# 属性, C# 方法]
---""",
    r"1_Areas\CSharp\代码区\C# 属性.md": """---
tags: [CSharp, 面向对象, 属性]
status: budding
area: CSharp
aliases: [Property, get, set, 自动属性]
related: [C# 面向对象, C# 访问修饰符, C# 方法]
---""",
    r"1_Areas\CSharp\代码区\C# 构造函数.md": """---
tags: [CSharp, 面向对象, 构造函数]
status: evergreen
area: CSharp
aliases: [构造方法, Constructor, base, 静态构造函数]
related: [C# 面向对象, C# this 关键字, C# 静态成员]
---""",
    r"1_Areas\CSharp\代码区\C# this 关键字.md": """---
tags: [CSharp, 面向对象, this]
status: budding
area: CSharp
aliases: [this, 构造函数链]
related: [C# 构造函数, C# 面向对象, C# 静态成员]
---""",
    r"1_Areas\CSharp\代码区\C# 调试.md": """---
tags: [CSharp, 面向对象, 调试]
status: budding
area: CSharp
aliases: [Debug, 断点, 逐语句, 调试模式]
related: [C# 异常处理, C# 异常处理进阶, C# 构造函数]
---""",
    r"1_Areas\CSharp\代码区\C# 访问修饰符.md": """---
tags: [CSharp, 面向对象, 访问修饰符]
status: budding
area: CSharp
aliases: [public, private, protected, internal]
related: [C# 面向对象, C# 属性, C# 静态成员]
---""",
    r"1_Areas\CSharp\代码区\C# 静态成员.md": """---
tags: [CSharp, 面向对象, 静态成员]
status: budding
area: CSharp
aliases: [static, 静态类, 静态方法, 静态字段]
related: [C# 构造函数, C# 面向对象, C# 访问修饰符]
---""",
    r"1_Areas\CSharp\代码区\C# Equals 和 GetHashCode.md": """---
tags: [CSharp, 面向对象, 相等比较]
status: evergreen
area: CSharp
aliases: [Equals, GetHashCode, 值相等]
related: [C# 面向对象, C# 属性, C# 构造函数]
---""",
    r"1_Areas\CSharp\代码区\C# 虚方法 virtual 与 重写 override.md": """---
tags: [CSharp, 面向对象, 虚方法, 多态]
status: evergreen
area: CSharp
aliases: [virtual, override, 重写, 多态]
related: [C# 抽象方法 abstract, C# 面向对象, C# 构造函数]
---""",
    r"1_Areas\CSharp\代码区\C# 抽象方法 abstract.md": """---
tags: [CSharp, 面向对象, 抽象方法]
status: evergreen
area: CSharp
aliases: [abstract, 抽象类, 抽象方法]
related: [C# 虚方法 virtual 与 重写 override, C# 面向对象, C# 构造函数]
---""",
    r"1_Areas\CSharp\窗体区\C# 窗体控件基础.md": """---
tags: [CSharp, WinForms, 窗体控件]
status: evergreen
area: CSharp
aliases: [Label, Button, TextBox, 窗体, 控件事件]
related: [C# 登录系统（窗体跳转与密码隐藏）, C# 音效与图片（SoundPlayer 与 PictureBox）, C# 事件（Event）]
---""",
    r"1_Areas\CSharp\窗体区\C# 音效与图片（SoundPlayer 与 PictureBox）.md": """---
tags: [CSharp, WinForms, 音效与图片]
status: budding
area: CSharp
aliases: [SoundPlayer, PictureBox, 音效播放, 图片显示]
related: [C# 窗体控件基础, C# 登录系统（窗体跳转与密码隐藏）, C# 垃圾回收 GC]
---""",
    r"1_Areas\CSharp\窗体区\C# 登录系统（窗体跳转与密码隐藏）.md": """---
tags: [CSharp, WinForms, 登录系统]
status: budding
area: CSharp
aliases: [ShowDialog, PasswordChar, 窗体跳转, 密码隐藏, CheckBox]
related: [C# 窗体控件基础, C# 猜拳游戏, C# 音效与图片（SoundPlayer 与 PictureBox）]
---""",
    r"1_Areas\CSharp\窗体区\C# 猜拳游戏.md": """---
tags: [CSharp, WinForms, 猜拳游戏]
status: budding
area: CSharp
aliases: [石头剪刀布, 人机对战, 按钮互斥]
related: [C# 登录系统（窗体跳转与密码隐藏）, C# 窗体控件基础, C# 随机数]
---""",
}

def main():
    parser = argparse.ArgumentParser(description="预览旧笔记 frontmatter 补齐；--apply 才写入并备份")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    base = Path(__file__).resolve().parents[2]
    backup = base / ".claudian" / ("frontmatter-backup-" + datetime.now().strftime("%Y%m%d-%H%M%S-%f"))
    changed = skipped = 0
    for relpath, new_fm in files.items():
        path = base / Path(relpath.replace("\\", "/"))
        if not path.is_file():
            print("缺少文件:", relpath)
            skipped += 1
            continue
        content = path.read_text(encoding="utf-8-sig")
        pattern = r"\A---[ \t]*\ntags:[ \t]*\[[^\n]*\][ \t]*\n---[ \t]*\n"
        updated = re.sub(pattern, lambda _: new_fm + "\n", content, count=1)
        if content == updated:
            skipped += 1
            continue
        if args.apply:
            saved = backup / path.relative_to(base)
            saved.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, saved)
            path.write_text(updated, encoding="utf-8")
        print("已更新:" if args.apply else "将更新:", relpath)
        changed += 1
    print("更新候选:", changed, "跳过:", skipped, "模式:", "写入" if args.apply else "预览")


if __name__ == "__main__":
    main()
