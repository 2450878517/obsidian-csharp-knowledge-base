---
tags: [CSharp, 面向对象, 访问修饰符]
status: budding
area: CSharp
aliases: [public, private, protected, internal]
related: [C# 面向对象, C# 属性, C# 静态成员]
---
# C# 访问修饰符

控制类成员（字段、属性、方法）的**可见范围**——谁能用，谁不能用。

| 修饰符 | 谁能用 |
|---|---|
| `public` | 谁都能访问 |
| `private` | 只有本类内部能访问 |
| `protected` | 本类 + 子类能访问 |
| `internal` | 同一程序集（项目）内能访问 |

## 代码示例

```csharp
class BankAccount
{
    public string Owner;     // 谁都能看
    private double balance;  // 只有自己能动
    protected int bonus;     // 自己 + 子类能用
}
```

## 默认是 private

类成员默认就是 `private`，想给外面用才写 `public`。

- `public` —— 对外开放的入口
- `private` —— 藏起来的内部实现（配合属性保护数据，见 [[C# 属性]]）

## 案例：银行卡余额

- 余额用 `private` 字段存，外面改不了
- 通过 `public` 属性（get/set）控制谁能读、谁能改，set 里还能加校验

> 💡 权限最小化：能不开放就不开放，数据更安全。

---

**相关笔记：** [[C# 面向对象]] | [[C# 属性]] | [[C# 静态成员]] | [[C# 编程入门_视频笔记]]
