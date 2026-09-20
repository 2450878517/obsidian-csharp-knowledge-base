---
title: "C# LINQ 入门"
date: "2026-08-12"
tags:
  - CSharp
  - LINQ
  - 数据处理
status: seedling
area: CSharp
aliases: [LINQ, 语言集成查询]
related: [CSharp 列表 List, CSharp 数组, CSharp 泛型, CSharp 委托进阶]
source: ""
---

# C# LINQ 入门

## 一句话总结

> LINQ 是 C# 内置的查询语言，让你用写 SQL 的方式操作集合和数据库。

## 核心概念

- `from ... in ... where ... select` 查询表达式
- 方法语法：`.Where()`, `.Select()`, `.OrderBy()`
- 延迟执行：查询定义时不会立即执行，遍历时才跑

## 代码示例

```csharp
var scores = new List<int> { 85, 92, 78, 95, 60, 88 };

// 查询语法
var highScores = from s in scores
                 where s >= 85
                 orderby s descending
                 select s;

// 方法语法（等价）
var highScores2 = scores
    .Where(s => s >= 85)
    .OrderByDescending(s => s);
```

## 常见误区

- LINQ 不会修改原集合，它返回新集合
- `First()` 在空集合上会抛异常，用 `FirstOrDefault()` 更安全

## 相关笔记

> 手动添加最相关的 1-3 篇笔记链接

- [[CSharp 列表 List|C# 列表 List]]
- [[CSharp 委托进阶|C# 委托进阶]]

---

## 🔗 自动关联

> 以下由 Dataview 自动生成，无需手动维护

```dataview
TABLE WITHOUT ID
  file.link AS "反向关联",
  status AS "状态"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE (contains(default(related, []), this.file.name) OR contains(default(related, []), this.file.link))
  AND file.path != this.file.path
SORT file.name ASC
```

```dataview
TABLE WITHOUT ID
  file.link AS "同标签笔记",
  area AS "领域"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE length(this.file.tags) > 0 AND contains(file.tags, this.file.tags[0])
  AND file.path != this.file.path
LIMIT 8
```
