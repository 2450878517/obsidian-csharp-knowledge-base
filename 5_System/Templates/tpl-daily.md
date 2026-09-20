---
date: "{{date:YYYY-MM-DD}}"
tags:
  - daily
---

# {{date:YYYY-MM-DD}} ({{date:dddd}})

## 今日学习

- 

## 今日新建笔记

```dataview
LIST
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE date(file.cday) = date("{{date:YYYY-MM-DD}}")
  AND !contains(tags, "daily")
SORT file.name ASC
```

## 今日修改笔记

```dataview
LIST
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE date(file.mtime) = date("{{date:YYYY-MM-DD}}")
  AND date(file.cday) != date("{{date:YYYY-MM-DD}}")
  AND !contains(tags, "daily")
SORT file.mtime DESC
```

## 待办

- [ ] 

## 随手记
