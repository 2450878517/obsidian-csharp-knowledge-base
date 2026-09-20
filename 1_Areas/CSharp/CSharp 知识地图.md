---
title: '🗺️ C# 知识地图'
tags: [CSharp, moc, 知识地图]
status: evergreen
area: CSharp
aliases: [知识地图, MOC, C# 学习路线, C# 知识导航]
related: [CSharp编程入门_视频笔记, CSharp 面向对象, CSharp 数组]
---

# 🗺️ C# 知识地图

> 把所有知识点串起来，从入门到面向对象，一条路走到底～
>
> 📖 **课程总纲** [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]（按上课日期整理的完整笔记），卡住了回地图找单篇笔记。

---

## 🟢 第一阶段：基础入门

```
开发环境 → 注释 → 输出语句 → 数据类型 → 类型转换 → 运算符 → 用户输入 → 字符串操作
```

| 步骤 | 笔记 | 学什么 |
|---|---|---|
| ① | [[CSharp 开发环境|C# 开发环境]] | VS 安装、项目创建 |
| ② | [[CSharp 注释|C# 注释]] | 代码里写说明 |
| ③ | [[CSharp 输出语句|C# 输出语句]] | 让程序说话 |
| ④ | [[CSharp 数据类型|C# 数据类型]] | 数字、文字、真假 |
| ⑤ | [[CSharp 类型转换|C# 类型转换]] | 把一种类型变另一种 |
| ⑥ | [[CSharp 运算符|C# 运算符]] | 加减乘除比大小 |
| ⑦ | [[CSharp 用户输入|C# 用户输入]] | 让用户跟程序聊天 |
| ⑧ | [[CSharp 字符串操作|C# 字符串操作]] | 处理文字信息 |
| ⑨ | [[CSharp 值类型与引用类型|C# 值类型与引用类型]] | 栈和堆、装箱拆箱、类 vs 结构体 |
| ⑩ | [[CSharp var 隐式类型|C# var 隐式类型]] | 不确定类型用 var，编译器推断 |
| ⑪ | [[CSharp 垃圾回收 GC|C# 垃圾回收 GC]] | 堆上垃圾自动回收、using 释放资源 |
| ⑫ | [[CSharp 字符串分割 Split|C# 字符串分割 Split]] | 按分隔符把字符串切成数组 |

---

## 🟡 第二阶段：流程控制

```
分支语句 → 循环 → 异常处理
```

让程序学会**判断**和**重复**，以及**出错了怎么办**。

| 笔记 | 学什么 |
|---|---|
| [[CSharp 分支语句|C# 分支语句]] | if / else / switch 做选择 |
| [[CSharp 循环|C# 循环]] | for / foreach 重复干一件事 |
| [[CSharp 异常处理|C# 异常处理]] | try-catch 抓住错误不崩溃 |
| [[CSharp 异常处理进阶|C# 异常处理进阶]] | 多 catch / finally / throw / 异常子类 |

---

## 🟠 第三阶段：数据结构

```
数组 → 列表List → 泛型 → 字典 → char类型 → 枚举
```

学会**存一堆数据**。

| 笔记 | 学什么 |
|---|---|
| [[CSharp 数组|C# 数组]] | 固定大小的同类型集合 |
| [[CSharp 列表 List|C# 列表 List]] | 可以动态增删的集合 |
| [[CSharp 泛型|C# 泛型]] | 一个方法/类适用所有类型（泛型方法/泛型类） |
| [[CSharp 字典 Dictionary|C# 字典 Dictionary]] | 键值对存储，通过键快速查找 |
| [[CSharp char 类型|C# char 类型]] | 单个字符 & 编码 |
| [[CSharp 枚举|C# 枚举]] | 用名字代替数字 |

---

## 🔵 第四阶段：方法

```
方法 → ref和out → 随机数
```

把代码**打包成功能块**，随时调用。

| 笔记 | 学什么 |
|---|---|
| [[CSharp 方法|C# 方法]] | 定义、调用、重载、static |
| [[CSharp ref 和 out|C# ref 和 out]] | 让方法修改原始变量 |
| [[CSharp 随机数|C# 随机数]] | 生成随机数 & 模拟概率 |
| [[CSharp 递归|C# 递归]] | 方法自己调用自己，注意终止条件 |
| [[CSharp 委托|C# 委托]] | 方法当参数传递、装方法的容器（多播 / ?.Invoke） |
| [[CSharp 委托进阶|C# 委托进阶]] | Action / Func / 匿名函数 / Lambda，委托的简化写法 |
| [[CSharp 事件（Event）|C# 事件]] | event 给委托加锁：只能 +=/-=，只能类内触发（电视台案例） |

---

## 🟣 第五阶段：面向对象

```
面向对象 → 属性 → 构造函数 → this关键字 → 调试
```

用**类**和**对象**来组织代码，这才是 C# 的核心！

| 笔记 | 学什么 |
|---|---|
| [[CSharp 面向对象|C# 面向对象]] | 类、对象、四大特征 |
| [[CSharp 属性|C# 属性]] | get/set 保护字段 |
| [[CSharp 构造函数|C# 构造函数]] | 对象创建时自动执行 |
| [[CSharp this 关键字|C# this 关键字]] | 区分参数/字段、构造函数链 |
| [[CSharp 调试|C# 调试]] | 断点、F11/F10 找 bug |
| [[CSharp 访问修饰符|C# 访问修饰符]] | public/private/protected 谁能用 |
| [[CSharp 静态成员|C# 静态成员]] | static 字段/属性/构造函数，类共享 |
| [[CSharp Equals 和 GetHashCode|C# Equals 和 GetHashCode]] | 比较相等：== 比地址、Equals 可重写比内容 |
| [[CSharp 虚方法 virtual 与 重写 override|C# 虚方法 virtual 与 重写 override]] | 父类方法加 virtual，子类 override 重写 → 多态 |
| [[CSharp 抽象方法 abstract|C# 抽象方法 abstract]] | 没有方法体的虚方法，子类必须重写 |

---

## 🟤 补充：文件与文件夹操作（IO）

存完数据、要落到硬盘上，就是这块。

| 笔记 | 学什么 |
|---|---|
| C# 文件与文件夹操作（待建立） | 路径、创建/删除/重命名文件夹、读写 txt 文件 |

---

## 🎨 补充：窗体应用（WinForms）

拖控件做界面，WinForms 的基础三件套。

| 笔记 | 学什么 |
|---|---|
| [[CSharp 窗体控件基础|C# 窗体控件基础]] | Label / Button / TextBox 的属性与 Click / Load 事件 |
| [[CSharp 音效与图片（SoundPlayer 与 PictureBox）|C# 音效与图片（SoundPlayer 与 PictureBox）]] | SoundPlayer 播 wav、PictureBox 显图片 |
| [[CSharp 登录系统（窗体跳转与密码隐藏）|C# 登录系统（窗体跳转与密码隐藏）]] | 登录流程、Show/ShowDialog、密码隐藏 |
| [[CSharp 猜拳游戏|C# 猜拳游戏]] | 随机数 + 按钮互斥的综合练习 |
| [[CSharp 登录系统进阶（注册与JSON存储）|C# 登录系统进阶（注册与JSON存储）]] | 注册=序列化、登录=反序列化、多对象 JSON 存储 |
| [[CSharp 抽卡模拟器（概率充值保底）|C# 抽卡模拟器（概率充值保底）]] | 随机数概率、充值进度条、保底机制的综合应用 |
| [[CSharp 高级控件（菜单、选项卡、分割、表格、文件对话框）|C# 高级控件（菜单、选项卡、分割、表格、文件对话框）]] | ListView 进阶 / ImageList / TabControl / 分割控件 / 菜单栏 / DataGridView / OpenFileDialog |
| [[CSharp 跨窗体传值（构造函数、方法、委托、事件）|C# 跨窗体传值（构造函数、方法、委托、事件）]] | 跨窗体传值一传二/二传一、文件对话框、资源导入、对话框 |

---

## ⚡ 补充：多线程

让程序同时做多件事，不再卡死界面。

| 笔记 | 学什么 |
|---|---|
| [[CSharp 线程池 ThreadPool|C# 线程池 ThreadPool]] | 线程池概念、Thread vs ThreadPool、手动挡 vs 自动挡比喻 |
| [[CSharp 多线程入门（Task与async await）|C# 多线程入门（Task与async await）]] | Task.Run、async/await 异步编程、WhenAll/WhenAny、做菜比喻 |
| [[CSharp 子线程更新主线程UI（Invoke与BeginInvoke）|C# 子线程更新主线程UI（Invoke与BeginInvoke）]] | 子线程不能直接改 UI、Timer 方案、Invoke 同步/BeginInvoke 异步 |

---

## 🌐 补充：网络通信

让程序通过 IP 和端口收发数据，把 Socket、多线程和 WinForms UI 串起来。

| 笔记 | 学什么 |
|---|---|
| [[CSharp WinForms TCP服务端模板解析|C# WinForms TCP服务端模板解析]] | TCP 服务端的 Bind/Listen/Accept/Receive/Send、每客户端一线程、广播、停止清理、粘包拆包与模板常见坑 |

---

## 🛠️ 补充：机器视觉 / VisionPro

奔着**机器视觉行业**走的一条线——工业视觉软件（VisionPro）的图形化工具操作，思路跟写视觉算法一脉相承。

| 笔记 | 学什么 |
|---|---|
| [[CSharp VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）|C# VisionPro 入门与模板匹配基本操作（连接件、回形针、套环）]] | VisionPro破解/高DPI、界面布局、图片导入、工具连接、模板匹配五步（切TrainImage/抓取/框模板/中心圆点/训练）、旋转角/覆盖数/阈值三参数、分数与红框 |
| [[CSharp VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）|C# VisionPro 模板匹配实战（齿轮检测、文字工具、彩转灰）]] | 模板匹配三步走、数齿/数工件（Count结果）、图上动态显示数字（文字工具+`{D}`占位符）、变通匹配独特特征、彩转灰/模板匹配只支持灰度图 |
| [[CSharp VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）|C# VisionPro 模板匹配进阶（掩膜Mask与结果分析工具）]] | 模板匹配原理（小绿线描特征）、旋转不变目标可不设旋转角、掩膜Mask只留共同特征一个匹配找正反面、结果分析工具计算（数量×面值=金额）、object连文字工具要手动改double |
| [[CSharp VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）|C# VisionPro 测量工具全家桶（找线、角度、卡尺、拟合）]] | IDB图像数据库、找线Find Line（卡线数量/忽略点/极性）、找角Corner只找不测、角-线工具测夹角（弧度vs角度）、Measurement测量全家桶（点到线做垂线/点到线段算最近）、Fit拟合最小二乘（三点定圆）、Creation创建（中垂/平行/垂线）、Intersection相交、卡尺Caliper测宽四步 |
| [[CSharp VisionPro 综合测量案例（钻头、火花塞）|C# VisionPro 综合测量案例（钻头、火花塞）]] | 综合实战案例（钻头+火花塞）：模板匹配→坐标定位→找线/找点→测角度/垂线/交点/点到线距离整套流程；**最大错误点**=模板匹配连原图其他工具连定位图（点线坐标不同源测错）；找角靠脚本才精确 |
| [[CSharp VisionPro Blob 斑点工具与颜色分割|C# VisionPro Blob 斑点工具与颜色分割]] | 卡尺补充（折线图投影数据看懂边缘、对比度阈值/过滤一半像素/最大结果数、扫描方向定测宽还是测高）、**Blob斑点工具两步法**（设极性→运行，最小面积/高尾巴低尾巴/孔connectivity level）、颜色分割CogColorSegmenter2（选择点取像素色/选择区域取平均色，配Blob数胶囊数量） |
| [[CSharp VisionPro 工具大整理（全工具清单）|C# VisionPro 工具大整理（全工具清单）]] | VisionPro是康耐视公司软件（cog开头=康耐视）、全工具总清单：**Find查找**（找圆/找角/找椭圆/找线/Fit拟合）/ **Create创建**（圆/线/线段/文字/中垂线/平行线/垂线/等分线段）/ **Intersection相交**（圆圆/线圆/线线）/ **Measurement测量**（角-线和角-点测角、各种点到线/圆/点距离——你有啥给啥） |
| [[CSharp VisionPro 图像形态学处理（腐蚀膨胀开闭运算）|C# VisionPro 图像形态学处理（腐蚀膨胀开闭运算）]] | **图像形态学处理**：腐蚀（削四周/断桥）、膨胀（填孔洞/裂缝）；**开运算=先腐蚀后膨胀**（去外部毛刺碎斑）、**闭运算=先膨胀后腐蚀**（填内部孔洞）；**大孔洞一倍填不掉→多倍=先多次扩大再多次腐蚀**（糖果扩大7腐蚀7）、**电子模式小闪电**（改参数自动运行）；糖果/胶囊案例：颜色分割提深浅色、Blob黑底白点、最小面积排碎斑/只留合格件（2500卡掉半只2000） |
| [[CSharp VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）|C# VisionPro 图像形态学实战与颜色工具与条码读取（8.27下午）]] | **形态学实战**（柱状图测高）：Blob白底黑点当斑点→腐蚀一次削掉坐标轴干扰线（当毛刺）→膨胀复原→卡尺测高（275）；**Blob输出图默认没有**→添加终端切"所有"找`Carita Blob Image`；**颜色四兄弟**：分割（单点/平均色纯色割）、提取（原版整片不平均）、匹配（训练纯色打分，0.673=相似度非面积）、复合匹配（训练整片复合色打分）；**CogID2条码解码**：彩转灰→一维码勾Code128/二维码勾QR→读出解码字符串 |

---

## 🔗 快速连线

不知道怎么走？看这里——

**新手路线：**
[[CSharp 开发环境|C# 开发环境]] → [[CSharp 输出语句|C# 输出语句]] → [[CSharp 数据类型|C# 数据类型]] → [[CSharp 运算符|C# 运算符]] → [[CSharp 分支语句|C# 分支语句]] → [[CSharp 循环|C# 循环]] → [[CSharp 方法|C# 方法]] → [[CSharp 面向对象|C# 面向对象]]

**遇到报错了？**
→ [[CSharp 调试|C# 调试]] 或 [[CSharp 异常处理|C# 异常处理]]

**想存一堆数据？**
→ [[CSharp 数组|C# 数组]] → [[CSharp 列表 List|C# 列表 List]] → [[CSharp 泛型|C# 泛型]] → [[CSharp 字典 Dictionary|C# 字典 Dictionary]]

**想把数据落到硬盘上？**
→ C# 文件与文件夹操作（待建立：读写文件、建文件夹、日志留痕）

**想理解面向对象？**
→ [[CSharp 面向对象|C# 面向对象]] → [[CSharp 属性|C# 属性]] → [[CSharp 构造函数|C# 构造函数]] → [[CSharp this 关键字|C# this 关键字]]

---

> 💡 **总纲入口：** [[CSharp编程入门_视频笔记|C#编程入门_视频笔记]]

---

## 🧭 总复习（学完所有阶段来这）

### ⚠️ 常见坑速查表

| 坑 | 原因 | 解法 |
|---|---|---|
| `Name = Name` 赋值失败 | 参数把字段"挡住"了 | `this.Name = Name` |
| 数组越界 | 索引从 0 起，`<= Length` 多跑一次 | 用 `< Length` |
| `int.Parse("ABC")` 崩 | 字符串转数字失败 | try-catch 兜住 |
| 循环里 `new Random()` 值一样 | 同一种子 | 只创建一个实例复用 |
| 字段初始化引用另一个字段编译失败 | 实例字段初始化顺序不确定 | 用 static 或移到构造函数 |
| 两个接口有同名方法 | 一个类实现两个同名签名 | 显式接口实现 `I1.Method()` |
| 忘记 `ref` | 默认复制副本 | 要改原件就加 `ref` |
| 静态方法里用 `this` | this 指具体对象，静态不依赖对象 | 去掉 this 或改实例方法 |
| 重写 `Equals` 没重写 `GetHashCode` | 相等对象哈希必须一致，否则警告 | 两个方法配套一起重写 |

### 🏋️ 练习总清单（全库作业汇总）

1. 用 `Console.WriteLine` 拼一面旗子 / 圣诞树
2. 求平均数 / BMI / 每平米价格：输入数字算完输出（记得防呆）
3. 成绩评级：90-100→A，70-89→B，60-69→C，0-60→D，超范围提示
4. for 嵌套输出 100×10 的 `*` 号矩阵
5. 凯撒加密：每个字母 ASCII +3，X/Y/Z 绕回，大小写分开处理
6. 字典统计水果出现次数：遍历时"没有就新增，有就 +1"
7. 《木兰诗》每个字出现频率（`ToCharArray()` 拆字，套水果案例）
8. 造飞机：构造函数重载——无参 / 指定轮胎数 / 轮胎数+代级
9. 造学生：属性（姓名/年龄/学号）+ 构造函数自动"报到"
10. QQ 群权限：四个接口（聊天/表情包/管成员/建群）→ 普通成员/管理员/群主
11. 委托多播：一个无参委托 `+=` 挂 ADD/SUB/MUL 三个方法，一次调用全跑
12. Lambda：`Func<int,int,int>` 写加法 `(a,b) => a+b`；把 `Array.Exists` 的 Lambda 还原成普通方法对比
13. 事件：用 event 重写电视台案例，故意写 `wT = ...` 和 `wT("假新闻")`，观察报错理解保护

---

## 🤖 自动发现区

> 以下由 Dataview 自动生成，帮你发现遗漏的笔记或新加的知识点。

### 📊 C# 笔记统计

```dataview
TABLE WITHOUT ID
  "📝 " + length(rows) + " 篇" AS "笔记总数",
  "🌱 " + length(filter(rows, (p) => p.status = "seedling")) + " 篇" AS "待完善",
  "🌿 " + length(filter(rows, (p) => p.status = "budding")) + " 篇" AS "成长中",
  "🌳 " + length(filter(rows, (p) => p.status = "evergreen")) + " 篇" AS "成熟"
FROM "1_Areas/CSharp"
WHERE !contains(tags, "moc") AND !contains(tags, "daily")
GROUP BY true
```

### 🆕 最近新增的笔记

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  dateformat(file.cday, "MM-dd") AS "创建日期",
  status AS "状态"
FROM "1_Areas/CSharp"
WHERE !contains(tags, "moc") AND !contains(tags, "daily")
SORT file.cday DESC
LIMIT 10
```

### ⚠️ 未在地图中列出的笔记

> 下面这些笔记没出现在上面的阶段表格里——可能有遗漏，或者是你新写的还没分类

```dataview
LIST
FROM "1_Areas/CSharp"
WHERE !contains(tags, "moc") AND !contains(tags, "daily")
  AND file.path != this.file.path
  AND !contains(this.file.outlinks, file.link)
SORT file.name ASC
```

### 🏷️ 按照标签浏览

```dataview
LIST
FROM "1_Areas/CSharp/代码区"
FLATTEN file.tags AS tag
WHERE tag != "#CSharp" AND tag != "#moc"
GROUP BY tag
SORT length(rows) DESC
```
