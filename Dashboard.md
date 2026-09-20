---
title: '知识库仪表盘'
cssclass: dashboard
tags: [moc]
---

# 知识库仪表盘

[[1_Areas/CSharp/CSharp 知识地图|C# 学习]] · [[1_Areas/机器视觉/机器视觉知识地图|机器视觉]] · [[5_System/课程视频索引|课程视频]] · [[5_System/知识库使用约定|归档与复习]]

## 统计概览

统计收件箱、领域、项目、资源中的内容笔记；排除地图、日记、系统文件和归档。

```dataview
TABLE WITHOUT ID
  length(rows) AS "内容笔记",
  length(filter(rows, (p) => p.status = "seedling")) AS "待完善",
  length(filter(rows, (p) => p.status = "budding")) AS "成长中",
  length(filter(rows, (p) => p.status = "evergreen")) AS "成熟"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE !contains(file.tags, "#moc") AND !contains(file.tags, "#daily")
GROUP BY true
```

## 收件箱

```dataview
TABLE file.mtime AS "更新时间"
FROM "0_Inbox"
SORT file.mtime DESC
```

## 最近更新

```dataview
TABLE area AS "领域", status AS "状态", dateformat(file.mtime, "MM-dd HH:mm") AS "更新时间"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE !contains(file.tags, "#moc") AND !contains(file.tags, "#daily")
SORT file.mtime DESC
LIMIT 12
```

## 待完善

```dataview
TABLE area AS "领域", file.mtime AS "最后更新"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE status = "seedling"
SORT file.mtime ASC
LIMIT 12
```

## 进行中的项目

```dataview
TABLE area AS "领域", deadline AS "截止日期"
FROM "2_Projects"
WHERE status = "active"
```

## 孤立笔记

```dataview
LIST
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE length(file.inlinks) = 0 AND length(file.outlinks) = 0
  AND length(default(related, [])) = 0
  AND !contains(file.tags, "#moc") AND !contains(file.tags, "#daily")
SORT file.name ASC
LIMIT 15
```

## 按领域统计

```dataview
TABLE WITHOUT ID key AS "领域", length(rows) AS "内容笔记数"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE area AND !contains(file.tags, "#moc") AND !contains(file.tags, "#daily")
GROUP BY area
SORT key ASC
```

## 标签分布

```dataview
TABLE WITHOUT ID key AS "标签", length(rows) AS "笔记数"
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
FLATTEN file.etags AS tag
WHERE tag != "#moc" AND tag != "#daily" AND tag != "#project"
GROUP BY tag
SORT length(rows) DESC
LIMIT 20
```

