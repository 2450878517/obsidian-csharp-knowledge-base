---
title: "{{title}}"
date: "{{date:YYYY-MM-DD}}"
tags:
  - project
status: active
deadline: ""
area: ""
---

# 🚀 {{title}}

## 目标

> 这个项目要达成什么？

## 关键结果

- [ ] 
- [ ] 
- [ ] 

## 笔记导航

```dataview
LIST
FROM "2_Projects/{{title}}"
WHERE !contains(tags, "project")
SORT file.name ASC
```

## 日志

| 日期 | 进展 |
|------|------|
| {{date:YYYY-MM-DD}} | 创建项目 |
