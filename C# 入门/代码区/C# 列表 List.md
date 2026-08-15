---
tags: [CSharp, 数据结构, 列表]
status: budding
area: CSharp
aliases: [List, 泛型集合, ArrayList]
related: [C# 数组, C# 泛型, C# 循环]
---

# C# 列表（List）

列表和数组类似，都是存储同类型内容的集合，但列表可以**自动调整大小**。

## 创建列表

```csharp
// 方式一：先创建空列表
List<int> numbers = new List<int>();

// 方式二：创建时直接加入初始元素
List<string> names = new List<string> { "小明", "小红", "小刻" };
```

## 添加元素

```csharp
list.Add(元素);              // 逐个追加
list.Insert(索引, 元素);      // 插入到指定位置
list.AddRange(集合);          // 批量加入另一个集合的所有元素
```

## 访问与修改

```csharp
Console.WriteLine(list[0]);  // 通过索引访问
list[0] = "新值";            // 通过索引赋值修改
```

## 删除元素

```csharp
list.Remove(值);             // 删除指定值（只删第一个匹配项）
list.RemoveAt(索引);         // 按索引删除
list.RemoveAll(条件);        // 删除所有匹配项
list.Clear();                // 清空整个列表
```

## 遍历与排序

```csharp
list.Count;                  // 获取列表大小
list.Sort();                 // 默认从小到大排序
list.Reverse();              // 反转成从大到小
```

## 列表与数组互转

```csharp
// 列表 → 数组
int[] arr = list.ToArray();

// 数组 → 列表
List<int> list2 = new List<int>(arr);
```

## ArrayList（不推荐）

- 可以存放**任何类型**的对象
- 类型不安全，容易引发运行时错误
- 涉及**装箱拆箱**（值类型 ↔ object），影响性能
- 一般**不推荐使用**，用 `List<T>` 替代

---

**相关笔记：** [[C# 数组]] | [[C# 循环]] | [[C# 编程入门_视频笔记]]
