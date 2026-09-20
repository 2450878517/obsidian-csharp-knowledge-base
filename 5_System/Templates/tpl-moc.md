---
title: "{{title}}"
date: "{{date:YYYY-MM-DD}}"
tags:
  - moc
  - 
area: "" # 填领域，例如 CSharp 或 机器视觉
---

# 🗺️ {{title}}

> 这是 **{{title}}** 领域的地图，由笔记动态聚合而成。只管往里扔笔记，这页自己会长。

## 📝 最近更新的笔记

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  dateformat(file.mtime, "MM-dd HH:mm") AS "最后更新",
  status AS "状态"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE this.area AND area = this.area AND !contains(tags, "moc")
SORT file.mtime DESC
LIMIT 15
```

## 📂 按主题浏览

```dataview
LIST
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE this.area AND area = this.area AND !contains(tags, "moc")
SORT file.name ASC
```

## 🌱 待完善的笔记

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  dateformat(file.mtime, "MM-dd") AS "最后更新"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE this.area AND area = this.area AND status = "seedling"
SORT file.mtime ASC
```

## 🏷️ 标签分布

```dataview
LIST
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE this.area AND area = this.area AND !contains(file.tags, "#moc")
FLATTEN file.tags AS tag
WHERE tag != "#" + this.area AND tag != "#moc"
GROUP BY tag
SORT length(rows) DESC
```

## 🔗 孤立笔记（无任何链接）

```dataview
LIST
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE this.area AND area = this.area AND length(file.inlinks) = 0
  AND length(file.outlinks) = 0
  AND !contains(tags, "moc")
SORT file.name ASC
```
