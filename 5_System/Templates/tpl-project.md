---
title: "{{title}}"
date: "{{date:YYYY-MM-DD}}"
tags:
  - project
status: active
deadline: ""
area: ""
related: []
related: []
related: []
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
FROM "0_Inbox" OR "1_Areas" OR "2_Projects" OR "3_Resources"
WHERE file.path != this.file.path AND (contains(default(related, []), this.file.link) OR contains(default(related, []), this.file.name) OR contains(this.file.outlinks, file.link))
SORT file.name ASC
```

## 日志

| 日期 | 进展 |
|------|------|
| {{date:YYYY-MM-DD}} | 创建项目 |
