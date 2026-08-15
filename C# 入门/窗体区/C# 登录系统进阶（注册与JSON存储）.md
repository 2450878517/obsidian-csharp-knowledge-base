---
tags: [CSharp, WinForms, 登录系统, JSON, 序列化]
status: budding
area: CSharp
aliases: [注册登录, JSON多对象, 多对象序列化, AppendText覆盖, 账号重复校验]
related: [C# JSON 序列化（Newtonsoft.Json）, C# 登录系统（窗体跳转与密码隐藏）, C# 列表 List, C# 文件与文件夹操作, C# 选择控件（RadioButton 与 ListBox）]
---
# C# 登录系统进阶（注册与 JSON 存储）

[[C# JSON 序列化（Newtonsoft.Json）]] 讲了**单个对象**怎么序列化保存；[[C# 登录系统（窗体跳转与密码隐藏）]] 讲了账号密码**写死在代码里**的登录。这课把两件事合起来：**一次存多个对象（注册的账号一堆人）**，再把登录系统改成**注册的信息存本地 JSON 文件**，真的能加人、能登录。

## 🧩 昨天的坑：一口气存多个人怎么读

上一个 Demo 用 `AppendText` 追加保存，存了好几个人的信息——结果文件里是这样：

```json
{ "Name": "张三", "Age": 24 }
{ "Name": "李四", "Age": 25 }
```

每个 `{}` 是一个**独立的 JSON 对象**，读的时候不知道该读哪个 → **读不了**。

**为什么**：`AppendText` 是往文件末尾**追加**，每次序列化一个对象就新写一个独立的花括号，文件里攒了一堆互不相干的小对象。

**正确思路**：把所有对象装进一个**列表**，序列化**整个列表** → 文件里变成**一个大的方括号**，里面装一堆对象：

```json
[
  { "Name": "张三", "Age": 24 },
  { "Name": "李四", "Age": 25 }
]
```

最外层是方括号 `[]`（数组）了，就能用 `List<Person>` 整个读回来。**这就是多对象序列化。**

## 🧩 多对象序列化：用列表包住所有人

```csharp
// 建一个 Person 类的列表（对象列表）
List<Person> persons = new List<Person>();

// 把用户输的人一个接一个加进列表
persons.Add(p1);
persons.Add(p2);

// 序列化整个列表 → 最外层是方括号 []
string json = JsonConvert.SerializeObject(persons);
File.WriteAllText(path, json);
```

对象→列表→序列化列表，一个人都不漏。

## 🧩 追加 vs 覆盖（这课的难点）

有了列表，但有个新问题：**`File.WriteAllText` 是覆盖写**——每次保存都把你**以前存的数据全冲掉**，只剩最新一次。

**要追加（留住旧数据 + 加新数据）怎么办？** 三步走：

1. **先读旧数据**：文件里已有的 JSON 读出来，反序列化回列表
2. **再加新数据**：把新对象 `Add` 进这个列表（此时列表 = 旧 + 新）
3. **一起存回去**：整个列表序列化，`WriteAllText` 覆盖写（反正旧的已经装进去了）

```csharp
// ① 先建一个空列表
List<Person> persons = new List<Person>();

// ② 如果文件已经存在，把旧数据读出来放进列表（第一次存就没有这一步）
if (File.Exists(Application.StartupPath + "\\person.json"))
{
    string json = File.ReadAllText(Application.StartupPath + "\\person.json");
    persons = JsonConvert.DeserializeObject<List<Person>>(json);
}

// ③ 新对象加进列表（现在列表里旧的新的都有）
Person p = new Person();
p.Name = textBox1.Text;
persons.Add(p);

// ④ 整个列表序列化，一起写回去（旧的没丢，新的加上了）
string json2 = JsonConvert.SerializeObject(persons);
File.WriteAllText(Application.StartupPath + "\\person.json", json2);
```

**`File.Exists` 判断**：文件不存在说明是第一次存，不用读，直接写；文件存在就先读旧数据再写——这样第 2 次、第 3 次存，旧数据都在，形成**累加**的效果。

> 🧠 存多个对象 = **先读旧 → 加新 → 一起存**；`AppendText` 不行（每个对象独立花括号），`WriteAllText` 裸用会覆盖（旧数据没了），配合"先读旧数据"就是答案。

## 🧩 多对象反序列化（读一堆人）

和单个的差不多，只是用 `List` 接：

```csharp
string json = File.ReadAllText(path);                        // ① 读文件
List<Person> persons = JsonConvert.DeserializeObject<List<Person>>(json);  // ② 整个列表读回来
foreach (Person p in persons)                                // ③ 遍历，逐个显示
{
    textBox.AppendText(p.Name + "\r\n");
}
```

顺序和序列化正好相反：**文件 → JSON → 对象列表**。

## 🧩 综合实战：带注册的登录系统

把上面的东西全用上——**注册 = 序列化（存人），登录 = 反序列化（查人）**。信息存到本地的 `user.json`。

### 界面

- 标题 Label「登录系统」
- 账号 TextBox + 密码 TextBox（密码框 `PasswordChar = '*'` 隐藏）
- 「登录」按钮 + 「注册」按钮
- 一个 CheckBox「显示密码」，勾上显明文、取消又藏起来（和 [[C# 登录系统（窗体跳转与密码隐藏）]] 一样）

### User 类

```csharp
class User
{
    public string UserName { get; set; }
    public string Password { get; set; }
}
```

### 注册按钮（序列化 + 两个校验）

```csharp
private void btnReg_Click(object sender, EventArgs e)
{
    // ① 校验：账号密码都不能为空
    if (textBox1.Text == "" || textBox2.Text == "")
    {
        MessageBox.Show("账号或密码不能为空！");
        return;
    }

    // ② 先读旧数据放进列表（防止覆盖，保证累加）
    List<User> users = new List<User>();
    if (File.Exists(Application.StartupPath + "\\user.json"))
    {
        string json = File.ReadAllText(Application.StartupPath + "\\user.json");
        users = JsonConvert.DeserializeObject<List<User>>(json);
    }

    // ③ 校验：账号不能重复（遍历旧列表找有没有一样的）
    foreach (User u in users)
    {
        if (u.UserName == textBox1.Text)
        {
            MessageBox.Show("该账号已注册！");
            return;
        }
    }

    // ④ 新用户装进对象，加入列表
    User user1 = new User();
    user1.UserName = textBox1.Text;
    user1.Password = textBox2.Text;
    users.Add(user1);

    // ⑤ 整个列表序列化保存（旧账号 + 新账号一起）
    string json2 = JsonConvert.SerializeObject(users);
    File.WriteAllText(Application.StartupPath + "\\user.json", json2);

    MessageBox.Show("注册成功！");
}
```

### 登录按钮（反序列化 + 大坑）

```csharp
private void btnLogin_Click(object sender, EventArgs e)
{
    // ① 读所有已注册的用户
    string json = File.ReadAllText(Application.StartupPath + "\\user.json");
    List<User> users = JsonConvert.DeserializeObject<List<User>>(json);

    // ② 遍历找账号
    foreach (User u in users)
    {
        if (u.UserName == textBox1.Text)          // 账号找到了
        {
            if (u.Password == textBox2.Text)      // 密码也对
            {
                MessageBox.Show("登录成功！");
                return;   // 成功就跑
            }
            else                                  // 密码不对
            {
                MessageBox.Show("密码错误，请重新输入！");
                textBox2.Text = "";               // 密码框清空重输
                return;
            }
        }
    }

    // ⚠️ 关键：这句要放在循环【外面】！遍历完所有账号都没找到才提示
    MessageBox.Show("该账号不存在，请先注册！");
}
```

### ⚠️ 老师现场演示的大 Bug

- **症状**：明明注册了账号 `123123`，点登录却提示「该账号不存在」
- **原因**：把「该账号不存在」写进了 **foreach 循环里面**——遍历到**第一个**不匹配的账号就弹窗，后面的账号根本没机会看
- **解决**：循环里只做「找到账号→对密码」；「该账号不存在」放到**循环外面**，等**全部遍历完**都没找到才提示

这个 bug 就是「该不该退出循环」的位置问题——**判断结果在循环里，最后的兜底提示在循环外**。

## 🧠 一句话总结

**多对象存 JSON = 列表包住对象 + `先读旧数据`防覆盖；注册就是序列化（存账号）、登录就是反序列化（查账号）；校验两个：账号密码不能为空（`||`）、账号不能重复（foreach 查重）；「该账号不存在」必须放 foreach 外面，遍历完才提示。**

## 📚 作业

1. 做一个「带注册的登录系统」：注册把账号密码存进 `user.json`，登录读文件验证
2. 注册两个账号，验证文件里是**一个方括号**里装两个对象（不是两个独立花括号）
3. 给注册加校验：什么都不填不能注册；重复账号不能注册
4. 故意把「该账号不存在」写进 foreach 里，感受 bug，再改回循环外

---

**相关笔记：** [[C# JSON 序列化（Newtonsoft.Json）]] | [[C# 登录系统（窗体跳转与密码隐藏）]] | [[C# 列表 List]] | [[C# 文件与文件夹操作]] | [[C# 窗体控件基础]] | [[C#编程入门_视频笔记]]
