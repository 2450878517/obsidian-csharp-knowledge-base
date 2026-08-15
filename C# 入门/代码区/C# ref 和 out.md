---
tags: [CSharp, 方法, 参数传递]
status: budding
area: CSharp
aliases: [ref, out, 引用参数, 输出参数]
related: [C# 方法, C# 泛型, C# 静态成员]
---
# C# ref 和 out 关键字

## ref — 传引用

让方法直接操作原始变量，修改会反映到原数据上，像是改原件而不是复印件：

```csharp
void Swap(ref int a, ref int b)
{
    int temp = a;
    a = b;
    b = temp;
}

int x = 5, y = 10;
Swap(ref x, ref y);
// x = 10, y = 5（原变量被修改了）
```

## out — 输出参数

传入没有初始值的空变量，方法内部赋值并传出，同样修改原始变量：

```csharp
void GetValues(out int a, out int b)
{
    a = 10;
    b = 20;
}

int x, y;
GetValues(out x, out y);
// x = 10, y = 20
```

## 不带关键字时

方法默认**复制一份数据**运算，不会改变原始变量：

```csharp
void AddTen(int a)
{
    a += 10;
}

int x = 5;
AddTen(x);
// x 还是 5，没变
```

## 应用场景

- 交换方法（`Swap`）
- 需要方法返回多个值时

---

**相关笔记：** [[C# 方法]] | [[C# 编程入门_视频笔记]]
 