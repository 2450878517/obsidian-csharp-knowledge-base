---
title: "{{title}} MOC"
date: "{{date:YYYY-MM-DD}}"
tags:
  - moc
  - 
area: "{{title}}"
---

# 🗺️ {{title}} MOC

> 这是 **{{title}}** 领域的地图，由笔记动态聚合而成。只管往里扔笔记，这页自己会长。

## 📝 最近更新的笔记

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  dateformat(file.mtime, "MM-dd HH:mm") AS "最后更新",
  status AS "状态"
FROM "1_Areas/{{title}}"
WHERE !contains(tags, "moc")
SORT file.mtime DESC
LIMIT 15
```

## 📂 按主题浏览

```dataview
LIST
FROM "1_Areas/{{title}}"
WHERE !contains(tags, "moc")
SORT file.name ASC
```

## 🌱 待完善的笔记

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  dateformat(file.mtime, "MM-dd") AS "最后更新"
FROM "1_Areas/{{title}}"
WHERE status = "seedling"
SORT file.mtime ASC
```

## 🏷️ 标签分布

```dataview
LIST
FROM "1_Areas/{{title}}" AND -#moc
FLATTEN file.tags AS tag
WHERE tag != "{{title}}" AND tag != "moc"
GROUP BY tag
SORT length(rows) DESC
```

## 🔗 孤立笔记（无任何链接）

```dataview
LIST
FROM "1_Areas/{{title}}"
WHERE length(file.inlinks) = 0
  AND length(file.outlinks) = 0
  AND !contains(tags, "moc")
SORT file.name ASC
```
