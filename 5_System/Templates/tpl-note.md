---
title: "{{title}}"
date: "{{date:YYYY-MM-DD}}"
tags:
  - 
status: seedling
area: ""
aliases: []
related: []
source: ""
---

# {{title}}

## 一句话总结

> <!-- 用一句话说清楚这个知识点的核心 -->

## 核心概念



## 代码示例

```csharp

```

## 常见误区



## 相关笔记

> 手动添加最相关的 1-3 篇笔记链接

- 

---

## 🔗 自动关联

> 以下由 Dataview 自动生成，无需手动维护

```dataview
TABLE WITHOUT ID
  file.link AS "反向关联",
  status AS "状态"
FROM "1_Areas"
WHERE contains(related, this.file.name)
SORT file.name ASC
```

```dataview
TABLE WITHOUT ID
  file.link AS "同标签笔记",
  area AS "领域"
FROM "1_Areas"
WHERE contains(file.tags, this.file.tags[0])
  AND file.name != this.file.name
LIMIT 8
```
