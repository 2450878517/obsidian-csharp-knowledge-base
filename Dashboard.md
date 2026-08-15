---
cssclass: dashboard
---

# 📊 知识库仪表盘

> 最后刷新：`= date(today).toString("yyyy-MM-dd")`

## 📈 统计概览

| 指标 | 数值 |
|------|------|
| 📝 笔记总数 | `$= dv.pages().length` |
| 🌱 待完善 | `$= dv.pages().where(p => p.status == "seedling").length` |
| 🌿 成长中 | `$= dv.pages().where(p => p.status == "budding").length` |
| 🌳 成熟笔记 | `$= dv.pages().where(p => p.status == "evergreen").length` |
| 📅 今日新建 | `$= dv.pages().where(p => p.file.cday.ts === dv.date('today').ts).length` |

## 🔥 最近更新

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  dateformat(file.mtime, "MM-dd HH:mm") AS "更新时间",
  status AS "状态"
FROM "1_Areas" AND -#moc AND -#daily
SORT file.mtime DESC
LIMIT 10
```

## 🌱 待完善的笔记

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  area AS "领域",
  dateformat(file.mtime, "MM-dd") AS "最后更新"
FROM "1_Areas"
WHERE status = "seedling"
SORT file.mtime ASC
LIMIT 10
```

## 🕸️ 孤立笔记（无链接）

```dataview
TABLE WITHOUT ID
  file.link AS "笔记",
  area AS "领域"
FROM "1_Areas"
WHERE length(file.inlinks) = 0
  AND length(file.outlinks) = 0
  AND !contains(tags, "moc")
SORT file.name ASC
LIMIT 15
```

## 🏷️ 标签云

```dataview
LIST
FROM "1_Areas"
FLATTEN file.tags AS tag
WHERE tag != "moc" AND tag != "daily" AND tag != "project"
GROUP BY tag
SORT length(rows) DESC
LIMIT 20
```

## 📂 领域速览

```dataview
TABLE WITHOUT ID
  file.link AS "领域 MOC",
  length(rows) AS "笔记数"
FROM "1_Areas"
WHERE contains(tags, "moc")
FLATTEN file.folder AS folder
GROUP BY file.link
SORT file.name ASC
```
