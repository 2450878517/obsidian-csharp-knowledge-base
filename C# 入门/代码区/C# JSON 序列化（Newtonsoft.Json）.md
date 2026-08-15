---
tags: [CSharp, JSON, 序列化, Newtonsoft.Json, 数据格式]
status: budding
area: CSharp
aliases: [JSON, 序列化, 反序列化, Newtonsoft.Json, SerializeObject, DeserializeObject, JSON与XML对比]
related: [C# 文件与文件夹操作, C# 面向对象, C# 泛型, C# 列表 List, C# 选择控件补充（ListView 与 ComboBox）]
---
# C# JSON 序列化与反序列化（Newtonsoft.Json）

程序要保存数据，光往文件里写一串「张三24男羽毛球」这种没结构的文字，回头根本没法读。**JSON** 就是给数据加上结构的标准格式——存起来、读回来都方便。这课讲：JSON 长什么样、为啥要它、怎么用 **Newtonsoft.Json** 工具包把对象**序列化**保存、再**反序列化**读回来。

## 🧩 JSON 是什么

**JSON 是一种数据格式**（专门用来保存数据）。看格式就能认出来——**最外层是花括号 `{}` 或方括号 `[]` 的数据，大概率就是 JSON**：

- 保存的是**对象 / 字典** → 最外层是**花括号** `{}`
- 保存的是**数组 / 列表** → 最外层是**方括号** `[]`

```json
{ "Name": "张三", "Age": 24, "Like": ["羽毛球", "篮球"] }
```

C# 是**面向对象**的语言，绝大多数情况保存的是对象，所以**花括号 `{}` 的 JSON 用得多**。

## 🧩 JSON 和 XML 对比

除了 JSON，还有一种老格式叫 **XML**——用**标签对**表示结构（做过网页就眼熟，网页元素就是用这种结构存的）：

```xml
<student>
  <Name>张三</Name>
  <Age>24</Age>
  <Like><item>羽毛球</item><item>篮球</item></Like>
</student>
```

| | JSON | XML |
|---|---|---|
| 数据体积 | 更小 | 更大 |
| 传输速度 | 更快 | 更慢 |
| 代码处理 | 更方便 | 更麻烦 |
| 直观程度 | 一眼看懂 | 看半天 |

**为什么 XML 还没被消灭？**
- XML 是上世纪 90 年代发明的，JSON 是近几十年才出来的，**JSON 是为了替代 XML 的麻烦而被发明**的
- 老项目早年用 XML 存了一堆历史数据，现在**旧数据还得用 XML 读**；新数据、新项目才用 JSON
- 结论：**新项目用 JSON，老项目可能还在用 XML**，两种技术都很成熟

> 去京东按 F12「检查」，看「元素」标签是 XML 类的结构（网页的条条框框），看「网络」里加载的数据接口就是 JSON 格式——现在的网页数据基本都是 JSON 了。

## 🧩 序列化 / 反序列化（概念）

- **序列化**：把 C# 对象转成 JSON 字符串（准备保存的过程）
- **反序列化**：把 JSON 字符串转回 C# 对象（读取的过程）

序列化是个**泛指的过程**——「把什么东西转成文件」都叫序列化：图片保存成文件、工业相机采集图像存盘、网页保存图片当桌面……都算。**JSON 只是序列化的其中一种格式。**

> 💼 **面试题**：「把什么东西存成文件，用什么技术？」→ 答：**序列化技术**。追问具体怎么转 → 答：序列化过程一般有对应的工具包（比如 Newtonsoft.Json），直接调用工具包的代码就行。思路说出来，比硬背代码强。

## 🧩 装工具包（NuGet）

C# 里用 JSON 要装一个工具包，叫 **Newtonsoft.Json**（老师念"牛胖 素胖 接省"）：

1. **工具** 菜单 → **NuGet 包管理器** → **管理解决方案的 NuGet 程序包**
2. 切到「**浏览**」页 → 搜索 `json`
3. 选**下载数最多**的那个 **Newtonsoft.Json**（下载量最大说明最常用）
4. 右边勾上**你的项目** → 点「**安装**」，等底部输出显示完成
5. 代码里加引用：`using Newtonsoft.Json;`

> 网上下载的工具包，它的命名空间一般是**工具包的全名**（去掉版本号），这就是你 `using` 要写的名字。

## 🧩 序列化实操（对象 → JSON → 文件）

**目标**：用户填一个表单（姓名/年龄/性别/爱好），点「序列化」按钮，把这份信息保存成 `person.json` 文件。

### 1. 建一个 Person 类

```csharp
class Person
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string Sex { get; set; }
    public string Like { get; set; }
}
```

### 2. 序列化按钮的代码

```csharp
private void btnSerialize_Click(object sender, EventArgs e)
{
    // 把用户填的内容装进 Person 对象
    Person p = new Person();
    p.Name = textBox1.Text;
    p.Age = Convert.ToInt32(textBox2.Text);
    p.Sex = textBox3.Text;
    p.Like = textBox4.Text;

    // 序列化：对象 → JSON 字符串（紧凑一行）
    string json = JsonConvert.SerializeObject(p);
    // 想要展开好看一点：加第二个参数
    // string json = JsonConvert.SerializeObject(p, Formatting.Indented);

    // 保存成文件
    File.WriteAllText(Application.StartupPath + "\\person.json", json);
}
```

要点：
- **序列化**用 `JsonConvert.SerializeObject(对象)`，返回 JSON 字符串
- **保存文件**用之前学的 `File.WriteAllText`（[[C# 文件与文件夹操作]]），文件后缀 `.json`
- 想展开成一行一列好看的形式，加第二个参数 `Formatting.Indented`（触发重载）

### 3. 紧凑还是展开？

| 写法 | 效果 | 用途 |
|---|---|---|
| `SerializeObject(p)` | 紧凑**一行**，数据保存更省空间 | **推荐**——存储优先考虑体积 |
| `SerializeObject(p, Formatting.Indented)` | **展开**成多行，肉眼看得清 | 内部协作调试看数据 |

**为什么推荐第一种**：做软件的最终目的是给用户用，存储越省越好。紧凑的数据计算机照样读得开；要看效果就用自己的工具（记事本/插件）美化查看，不用把文件存成大块头。

### 4. 防止存空数据

序列化前**先判断**，字段有空就不让存：

```csharp
if (textBox1.Text == "" || textBox2.Text == "" || textBox3.Text == "" || textBox4.Text == "")
{
    MessageBox.Show("请把信息填完整！");
    return;
}
```

多个条件判断用 `||`（或）——只要有一个是空的，就不允许序列化。

## 🧩 反序列化实操（文件 → JSON → 对象）

**目标**：点「反序列化」按钮，把 `person.json` 里的内容读出来，显示到界面上。

```csharp
private void btnDeserialize_Click(object sender, EventArgs e)
{
    string path = Application.StartupPath + "\\person.json";
    string json = File.ReadAllText(path);                 // ① 读文件 → JSON 字符串
    Person p = JsonConvert.DeserializeObject<Person>(json); // ② JSON → Person 对象
    textBox1.Text = p.Name;                                // ③ 读对象的内容
    textBox2.Text = p.Age.ToString();
    textBox3.Text = p.Sex;
    textBox4.Text = p.Like;
}
```

**⚠️ 三个必踩的坑：**

1. **必须写泛型类型** `DeserializeObject<Person>`——**as 转换、强制转换、`Convert` 都不行**，都会报类型错。因为读回来的东西不知道是哪个类型，得用泛型告诉它「我要 Person」
2. **注意顺序正好相反**：序列化是 对象→JSON→文件；反序列化是 **文件→JSON→对象**。好多同学在这栽跟头，先读文件、再转对象，别搞反
3. **文件里有多个数据时**：读出来不止一个对象，得用**列表**接收再循环：

```csharp
List<Person> persons = JsonConvert.DeserializeObject<List<Person>>(json);
foreach (Person p in persons)
{
    // 把每个 p 的信息读出来
}
```

一个文件塞了多个人（多次序列化追加），就用 `List<Person>` 把所有人装一起遍历。

## 🧠 一句话总结

- **JSON** 是带结构的数据格式，对象用 `{}`、数组用 `[]`；比 XML 小、快、直观，新项目都用它
- **序列化** = 对象转 JSON 存文件：`JsonConvert.SerializeObject(p)` + `File.WriteAllText`
- **反序列化** = 从文件读回对象：`File.ReadAllText` + `JsonConvert.DeserializeObject<类型>(json)`
- **泛型 `<类型>` 必须写**，as / 强转 / Convert 都不行
- 数据多就用 `List<Person>` 接住再循环遍历

## 📚 作业

1. 装 Newtonsoft.Json 包，建一个 Person 类，做表单（姓名/年龄/性别/爱好），点按钮序列化保存成 `person.json`
2. 再做反序列化按钮，把文件读回界面显示
3. 试试 `Formatting.Indented` 和紧凑两种写法，对比文件内容差在哪
4. 多次序列化存进一个人数多几个数据，用 `List<Person>` 读出来遍历

---

**相关笔记：** [[C# 文件与文件夹操作]] | [[C# 面向对象]] | [[C# 泛型]] | [[C# 列表 List]] | [[C# 选择控件补充（ListView 与 ComboBox）]] | [[C#编程入门_视频笔记]]
