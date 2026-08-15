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
FROM ""
WHERE date(file.cday) = date("{{date:YYYY-MM-DD}}")
  AND !contains(tags, "daily")
SORT file.name ASC
```

## 今日修改笔记

```dataview
LIST
FROM ""
WHERE date(file.mtime) = date("{{date:YYYY-MM-DD}}")
  AND date(file.cday) != date("{{date:YYYY-MM-DD}}")
  AND !contains(tags, "daily")
SORT file.mtime DESC
```

## 待办

- [ ] 

## 随手记

```
