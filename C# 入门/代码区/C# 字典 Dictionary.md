---
tags: [CSharp, 数据结构, 字典]
status: evergreen
area: CSharp
aliases: [Dictionary, 键值对, KeyValuePair, 字典]
related: [C# 列表 List, C# 泛型, C# 数组, C# 字符串操作]
---

# C# 字典（Dictionary）

字典（Dictionary）是 C# 里的一个**泛型集合类**，用来存"**键值对**"（KeyValuePair）——每一个"值"都有一个对应的"键"，通过键就能**快速**找到值。

## 为什么需要字典

之前学过数组和列表，都能存多个数据，但都是"同类型的一堆数据"。问题来了：**数据量一大，想从里面找某一个数据，非常费劲**——一万条数据里找一条，要么记位置，要么把整条遍历一遍。

字典不一样：给每条数据打一个**键**（相当于身份证号），找的时候**直接通过键定位**，不用挨个翻。

> 类比：现实生活中的字典——一个字不会读，查拼音就能找到它在哪一页，不用一页页翻。

## 创建字典

`Dictionary` 后面跟 `<键类型, 值类型>` 两个类型：

```csharp
Dictionary<string, string> stu = new Dictionary<string, string>();
```

- 第一个类型是**键**（key）——比如学号
- 第二个类型是**值**（value）——比如姓名
- 键和值的类型可以不一样，按实际情况自己设

## 字典的三个特点

1. **键是唯一的，不可以重复**（就像身份证号，不能有两个人同一个号）
2. **通过键来找对应的值**
3. **键和值是绑定关系**——不管顺序怎么变，一个键永远对应那个值，不会分开

## 添加：Add()

```csharp
stu.Add("2026001", "张三");   // 键 "2026001"，值 "张三"
```

⚠️ **键重复会报错**：`2026001` 已经存在，再 Add 同一个键，程序会抛异常。

## 查找：通过键拿值

```csharp
string name = stu["2026001"];   // 通过键访问对应的值
```

⚠️ 如果这个键**不存在**，会报错。防止报错用 try-catch：

```csharp
try
{
    string name = stu["2026009"];   // 这个键不存在
    Console.WriteLine(name);
}
catch
{
    Console.WriteLine("数据库中没有这位学生");
}
```

## 修改：两种方式

- 方式一：`Add()` —— 键已存在会**报错**，不会覆盖
- 方式二：下标赋值 `stu[key] = 值` —— 键已存在会**覆盖**旧值，不报错

```csharp
stu.Add("2026001", "张三");      // 添加
stu["2026001"] = "李四";         // 覆盖：张三 → 李四
```

## 删除：Remove()

```csharp
stu.Remove("2026001");   // 删掉键是 2026001 的那一条
```

## 判断：有没有这个键 / 值

```csharp
bool hasKey = stu.ContainsKey("2026003");   // 有没有这个键
bool hasValue = stu.ContainsValue("李四");   // 有没有这个值
```

有就返回 true，没有就返回 false。

## 遍历：foreach 拿键值对

字典的"单个单位"叫**键值对**（KeyValuePair）。一个字典就是由很多键值对组成的。foreach 每循环一次，就拿出一个键值对：

```csharp
foreach (KeyValuePair<string, string> kvp in stu)
{
    Console.WriteLine("键：" + kvp.Key + "，值：" + kvp.Value);
}
```

## 排序：OrderBy

字典没有数组的 `Sort()`，想排序要用 **OrderBy**（升序）和 **OrderByDescending**（降序）。它不知道你想按什么排，所以**要填一个方法告诉它**——按键排还是按值排：

```csharp
var sorted = stu.OrderBy(...);   // 里面填一个"按什么排"的方法
```

> 这是 LINQ 的写法（固定搭配），先把"按键排 / 按值排"这个套路记住，学 LINQ 的时候再深入。

## 🍎 案例：统计水果出现次数

给一串水果，用字典统计每种水果出现几次——**水果名当键，数量当值**：

```csharp
Dictionary<string, int> count = new Dictionary<string, int>();
string[] fruits = { "苹果", "香蕉", "西瓜", "苹果", "西瓜", "西瓜" };

foreach (string fruit in fruits)
{
    if (count.ContainsKey(fruit))
    {
        count[fruit]++;          // 已经有过 → 数量 +1
    }
    else
    {
        count.Add(fruit, 1);     // 第一次见 → 新增，数量 = 1
    }
}

foreach (KeyValuePair<string, int> kvp in count)
{
    Console.WriteLine(kvp.Key + " 出现 " + kvp.Value + " 次");
}
```

思路核心：遍历的时候**判断键有没有**——有就值 +1，没有就新增一条。

## 📝 案例：统计文字出现频率（升级版）

给一段文字，把每个字拆开，统计每个字出现几次。先把字符串拆成 char 数组，再套水果案例的写法：

```csharp
string text = "12345上山打老虎老虎打不到打到小松鼠";
char[] chars = text.ToCharArray();   // 拆成一个字一个字

Dictionary<char, int> stat = new Dictionary<char, int>();

foreach (char c in chars)
{
    if (stat.ContainsKey(c))
    {
        stat[c]++;          // 出现过的字 → +1
    }
    else
    {
        stat.Add(c, 1);     // 没出现过的字 → 新增
    }
}
```

## 📚 作业

用字典统计《木兰诗》里每个字的出现频率（"唧唧复唧唧…"），把整首诗每个字各出现几次统计出来。

---

**相关笔记：** [[C# 列表 List]] | [[C# 泛型]] | [[C# 数组]] | [[C# 字符串操作]] | [[C#编程入门_视频笔记]]
