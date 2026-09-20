// ==================== GAME CONSTANTS & DATA ====================

// 18支真实俱乐部。球员名单和能力是面向游戏的近似值，不是官方数据库。
const TEAM_NAMES = [
    "Manchester City", "Liverpool", "Arsenal", "Chelsea",
    "Manchester United", "Tottenham Hotspur", "Real Madrid", "Barcelona",
    "Atlético de Madrid", "Bayern München", "Borussia Dortmund", "Bayer Leverkusen",
    "Paris Saint-Germain", "Inter Milan", "AC Milan", "Juventus",
    "Napoli", "Benfica"
];

// 球队整体强度，用来让联赛模拟的实力层次更接近现实。
const TEAM_STRENGTHS = {
    "Manchester City": 84,
    "Liverpool": 84,
    "Arsenal": 83,
    "Chelsea": 79,
    "Manchester United": 78,
    "Tottenham Hotspur": 79,
    "Real Madrid": 86,
    "Barcelona": 83,
    "Atlético de Madrid": 82,
    "Bayern München": 84,
    "Borussia Dortmund": 79,
    "Bayer Leverkusen": 82,
    "Paris Saint-Germain": 84,
    "Inter Milan": 84,
    "AC Milan": 79,
    "Juventus": 80,
    "Napoli": 79,
    "Benfica": 77
};

// 按门将、后卫、中场、前锋顺序排列，每队16人。
const REAL_SQUADS = {
    "Manchester City": [
        "Ederson", "Stefan Ortega", "Rúben Dias", "John Stones", "Joško Gvardiol", "Kyle Walker", "Nathan Aké",
        "Rodri", "Kevin De Bruyne", "Bernardo Silva", "Mateo Kovačić", "Phil Foden", "Erling Haaland", "Jack Grealish", "Jérémy Doku", "Savinho"
    ],
    "Liverpool": [
        "Alisson Becker", "Caoimhin Kelleher", "Virgil van Dijk", "Ibrahima Konaté", "Andy Robertson", "Trent Alexander-Arnold", "Joe Gomez",
        "Alexis Mac Allister", "Dominik Szoboszlai", "Ryan Gravenberch", "Curtis Jones", "Wataru Endo", "Mohamed Salah", "Luis Díaz", "Darwin Núñez", "Diogo Jota"
    ],
    "Arsenal": [
        "David Raya", "Neto", "William Saliba", "Gabriel Magalhães", "Ben White", "Jurriën Timber", "Oleksandr Zinchenko",
        "Declan Rice", "Martin Ødegaard", "Thomas Partey", "Kai Havertz", "Bukayo Saka", "Gabriel Jesus", "Gabriel Martinelli", "Leandro Trossard", "Raheem Sterling"
    ],
    "Chelsea": [
        "Robert Sánchez", "Djordje Petrović", "Levi Colwill", "Marc Cucurella", "Axel Disasi", "Wesley Fofana", "Reece James",
        "Moisés Caicedo", "Enzo Fernández", "Cole Palmer", "Roméo Lavia", "Christopher Nkunku", "Nicolas Jackson", "Noni Madueke", "Pedro Neto", "Mykhailo Mudryk"
    ],
    "Manchester United": [
        "André Onana", "Altay Bayındır", "Lisandro Martínez", "Matthijs de Ligt", "Harry Maguire", "Diogo Dalot", "Luke Shaw",
        "Casemiro", "Bruno Fernandes", "Kobbie Mainoo", "Mason Mount", "Alejandro Garnacho", "Marcus Rashford", "Rasmus Højlund", "Antony", "Amad Diallo"
    ],
    "Tottenham Hotspur": [
        "Guglielmo Vicario", "Fraser Forster", "Cristian Romero", "Micky van de Ven", "Destiny Udogie", "Pedro Porro", "Radu Drăgușin",
        "Rodrigo Bentancur", "James Maddison", "Dejan Kulusevski", "Yves Bissouma", "Pape Matar Sarr", "Son Heung-min", "Richarlison", "Brennan Johnson", "Timo Werner"
    ],
    "Real Madrid": [
        "Thibaut Courtois", "Andriy Lunin", "Éder Militão", "Antonio Rüdiger", "Dani Carvajal", "Ferland Mendy", "Lucas Vázquez",
        "Jude Bellingham", "Federico Valverde", "Luka Modrić", "Eduardo Camavinga", "Aurélien Tchouaméni", "Vinícius Júnior", "Kylian Mbappé", "Rodrygo", "Brahim Díaz"
    ],
    "Barcelona": [
        "Marc-André ter Stegen", "Iñaki Peña", "Ronald Araújo", "Jules Koundé", "Pau Cubarsí", "Alejandro Balde", "Andreas Christensen",
        "Pedri", "Gavi", "Frenkie de Jong", "Dani Olmo", "Fermín López", "Robert Lewandowski", "Raphinha", "Lamine Yamal", "Ferran Torres"
    ],
    "Atlético de Madrid": [
        "Jan Oblak", "Juan Musso", "José María Giménez", "Robin Le Normand", "Axel Witsel", "Nahuel Molina", "Reinildo Mandava",
        "Koke", "Rodrigo De Paul", "Marcos Llorente", "Pablo Barrios", "Conor Gallagher", "Antoine Griezmann", "Julián Álvarez", "Ángel Correa", "Samuel Lino"
    ],
    "Bayern München": [
        "Manuel Neuer", "Sven Ulreich", "Dayot Upamecano", "Matthijs de Ligt", "Kim Min-jae", "Alphonso Davies", "Raphaël Guerreiro",
        "Joshua Kimmich", "Jamal Musiala", "Leon Goretzka", "Aleksandar Pavlović", "Kingsley Coman", "Harry Kane", "Leroy Sané", "Serge Gnabry", "Michael Olise"
    ],
    "Borussia Dortmund": [
        "Gregor Kobel", "Alexander Meyer", "Nico Schlotterbeck", "Niklas Süle", "Julian Ryerson", "Ramy Bensebaini", "Mats Hummels",
        "Emre Can", "Julian Brandt", "Marcel Sabitzer", "Karim Adeyemi", "Giovanni Reyna", "Donyell Malen", "Niclas Füllkrug", "Serhou Guirassy", "Jamie Gittens"
    ],
    "Bayer Leverkusen": [
        "Lukáš Hrádecký", "Matej Kovář", "Jonathan Tah", "Edmond Tapsoba", "Piero Hincapié", "Jeremie Frimpong", "Álex Grimaldo",
        "Granit Xhaka", "Florian Wirtz", "Exequiel Palacios", "Jonas Hofmann", "Robert Andrich", "Patrik Schick", "Victor Boniface", "Amine Adli", "Martin Terrier"
    ],
    "Paris Saint-Germain": [
        "Gianluigi Donnarumma", "Matvei Safonov", "Marquinhos", "Willian Pacho", "Achraf Hakimi", "Nuno Mendes", "Lucas Beraldo",
        "Vitinha", "Fabián Ruiz", "Warren Zaïre-Emery", "Lee Kang-in", "João Neves", "Ousmane Dembélé", "Randal Kolo Muani", "Gonçalo Ramos", "Bradley Barcola"
    ],
    "Inter Milan": [
        "Yann Sommer", "Emil Audero", "Alessandro Bastoni", "Francesco Acerbi", "Benjamin Pavard", "Denzel Dumfries", "Carlos Augusto",
        "Nicolò Barella", "Hakan Çalhanoğlu", "Henrikh Mkhitaryan", "Davide Frattesi", "Piotr Zieliński", "Lautaro Martínez", "Marcus Thuram", "Mehdi Taremi", "Marko Arnautović"
    ],
    "AC Milan": [
        "Mike Maignan", "Marco Sportiello", "Fikayo Tomori", "Malick Thiaw", "Strahinja Pavlović", "Theo Hernández", "Davide Calabria",
        "Tijjani Reijnders", "Ruben Loftus-Cheek", "Ismaël Bennacer", "Christian Pulisic", "Yunus Musah", "Rafael Leão", "Álvaro Morata", "Samuel Chukwueze", "Noah Okafor"
    ],
    "Juventus": [
        "Michele Di Gregorio", "Mattia Perin", "Bremer", "Federico Gatti", "Danilo", "Andrea Cambiaso", "Pierre Kalulu",
        "Manuel Locatelli", "Teun Koopmeiners", "Khéphren Thuram", "Douglas Luiz", "Nicolò Fagioli", "Dušan Vlahović", "Kenan Yıldız", "Federico Chiesa", "Timothy Weah"
    ],
    "Napoli": [
        "Alex Meret", "Elia Caprile", "Giovanni Di Lorenzo", "Amir Rrahmani", "Alessandro Buongiorno", "Mathías Olivera", "Juan Jesus",
        "Stanislav Lobotka", "André-Frank Zambo Anguissa", "Scott McTominay", "Matteo Politano", "Khvicha Kvaratskhelia", "Romelu Lukaku", "Victor Osimhen", "Giacomo Raspadori", "Giovanni Simeone"
    ],
    "Benfica": [
        "Anatoliy Trubin", "Samuel Soares", "Nicolás Otamendi", "António Silva", "Alexander Bah", "Álvaro Carreras", "Morato",
        "Florentino Luís", "Orkun Kökçü", "Fredrik Aursnes", "João Mário", "Andreas Schjelderup", "Ángel Di María", "Vangelis Pavlidis", "Kerem Aktürkoğlu", "Arthur Cabral"
    ]
};

// 参考EA SPORTS FC公开评分的量级校准：91是顶级，80上下是强队主力。
const REAL_PLAYER_PROFILES = {
    "Rodri": { age: 29, strength: 91 }, "Erling Haaland": { age: 25, strength: 91 }, "Kevin De Bruyne": { age: 34, strength: 90 },
    "Mohamed Salah": { age: 33, strength: 91 }, "Virgil van Dijk": { age: 34, strength: 89 }, "Alisson Becker": { age: 32, strength: 89 },
    "Bukayo Saka": { age: 24, strength: 87 }, "Martin Ødegaard": { age: 26, strength: 89 }, "Cole Palmer": { age: 23, strength: 85 },
    "Bruno Fernandes": { age: 30, strength: 87 }, "Son Heung-min": { age: 33, strength: 87 }, "Jude Bellingham": { age: 22, strength: 90 },
    "Kylian Mbappé": { age: 27, strength: 91 }, "Vinícius Júnior": { age: 25, strength: 90 }, "Federico Valverde": { age: 27, strength: 88 },
    "Thibaut Courtois": { age: 33, strength: 89 }, "Robert Lewandowski": { age: 37, strength: 88 }, "Lamine Yamal": { age: 18, strength: 86 },
    "Raphinha": { age: 29, strength: 88 }, "Antoine Griezmann": { age: 34, strength: 88 }, "Julián Álvarez": { age: 26, strength: 87 },
    "Manuel Neuer": { age: 39, strength: 86 }, "Harry Kane": { age: 32, strength: 90 }, "Jamal Musiala": { age: 22, strength: 88 },
    "Florian Wirtz": { age: 23, strength: 88 }, "Gianluigi Donnarumma": { age: 27, strength: 89 }, "Ousmane Dembélé": { age: 29, strength: 88 },
    "Lautaro Martínez": { age: 28, strength: 89 }, "Marcus Thuram": { age: 29, strength: 85 }, "Mike Maignan": { age: 31, strength: 87 },
    "Rafael Leão": { age: 27, strength: 86 }, "Dušan Vlahović": { age: 26, strength: 84 }, "Khvicha Kvaratskhelia": { age: 25, strength: 86 }
};

// 真实球员的中文显示名。内部数据保留英文实名，界面显示中文译名。
const PLAYER_NAME_ZH = {
    "Ederson": "埃德森", "Stefan Ortega": "奥尔特加", "Rúben Dias": "鲁本·迪亚斯", "John Stones": "斯通斯", "Joško Gvardiol": "格瓦迪奥尔", "Kyle Walker": "沃克", "Nathan Aké": "阿克",
    "Rodri": "罗德里", "Kevin De Bruyne": "德布劳内", "Bernardo Silva": "贝尔纳多·席尔瓦", "Mateo Kovačić": "科瓦契奇", "Phil Foden": "福登", "Erling Haaland": "哈兰德", "Jack Grealish": "格拉利什", "Jérémy Doku": "多库", "Savinho": "萨维尼奥",
    "Alisson Becker": "阿利松", "Caoimhin Kelleher": "凯莱赫", "Virgil van Dijk": "范戴克", "Ibrahima Konaté": "科纳特", "Andy Robertson": "罗伯逊", "Trent Alexander-Arnold": "阿诺德", "Joe Gomez": "乔·戈麦斯",
    "Alexis Mac Allister": "麦卡利斯特", "Dominik Szoboszlai": "索博斯洛伊", "Ryan Gravenberch": "赫拉芬贝赫", "Curtis Jones": "柯蒂斯·琼斯", "Wataru Endo": "远藤航", "Mohamed Salah": "萨拉赫", "Luis Díaz": "路易斯·迪亚斯", "Darwin Núñez": "努涅斯", "Diogo Jota": "若塔",
    "David Raya": "拉亚", "Neto": "内托", "William Saliba": "萨利巴", "Gabriel Magalhães": "加布里埃尔", "Ben White": "本·怀特", "Jurriën Timber": "廷贝尔", "Oleksandr Zinchenko": "津琴科",
    "Declan Rice": "赖斯", "Martin Ødegaard": "厄德高", "Thomas Partey": "托马斯·帕尔特伊", "Kai Havertz": "哈弗茨", "Bukayo Saka": "萨卡", "Gabriel Jesus": "热苏斯", "Gabriel Martinelli": "马丁内利", "Leandro Trossard": "特罗萨德", "Raheem Sterling": "斯特林",
    "Robert Sánchez": "罗伯特·桑切斯", "Djordje Petrović": "彼得罗维奇", "Levi Colwill": "科尔维尔", "Marc Cucurella": "库库雷利亚", "Axel Disasi": "迪萨西", "Wesley Fofana": "福法纳", "Reece James": "里斯·詹姆斯",
    "Moisés Caicedo": "凯塞多", "Enzo Fernández": "恩佐·费尔南德斯", "Cole Palmer": "帕尔默", "Roméo Lavia": "拉维亚", "Christopher Nkunku": "恩昆库", "Nicolas Jackson": "尼古拉斯·杰克逊", "Noni Madueke": "马杜埃凯", "Pedro Neto": "佩德罗·内托", "Mykhailo Mudryk": "穆德里克",
    "André Onana": "奥纳纳", "Altay Bayındır": "巴因德尔", "Lisandro Martínez": "利桑德罗·马丁内斯", "Matthijs de Ligt": "德里赫特", "Harry Maguire": "马奎尔", "Diogo Dalot": "达洛特", "Luke Shaw": "卢克·肖",
    "Casemiro": "卡塞米罗", "Bruno Fernandes": "布鲁诺·费尔南德斯", "Kobbie Mainoo": "梅努", "Mason Mount": "芒特", "Alejandro Garnacho": "加纳乔", "Marcus Rashford": "拉什福德", "Rasmus Højlund": "霍伊伦", "Antony": "安东尼", "Amad Diallo": "阿玛德·迪亚洛",
    "Guglielmo Vicario": "维卡里奥", "Fraser Forster": "弗雷泽·福斯特", "Cristian Romero": "罗梅罗", "Micky van de Ven": "范德芬", "Destiny Udogie": "乌多吉", "Pedro Porro": "波罗", "Radu Drăgușin": "德拉古辛",
    "Rodrigo Bentancur": "本坦库尔", "James Maddison": "麦迪逊", "Dejan Kulusevski": "库卢塞夫斯基", "Yves Bissouma": "比苏马", "Pape Matar Sarr": "萨尔", "Son Heung-min": "孙兴慜", "Richarlison": "理查利松", "Brennan Johnson": "布伦南·约翰逊", "Timo Werner": "维尔纳",
    "Thibaut Courtois": "库尔图瓦", "Andriy Lunin": "卢宁", "Éder Militão": "米利唐", "Antonio Rüdiger": "吕迪格", "Dani Carvajal": "卡瓦哈尔", "Ferland Mendy": "门迪", "Lucas Vázquez": "卢卡斯·巴斯克斯",
    "Jude Bellingham": "贝林厄姆", "Federico Valverde": "巴尔韦德", "Luka Modrić": "莫德里奇", "Eduardo Camavinga": "卡马文加", "Aurélien Tchouaméni": "琼阿梅尼", "Vinícius Júnior": "维尼修斯", "Kylian Mbappé": "姆巴佩", "Rodrygo": "罗德里戈", "Brahim Díaz": "布拉欣·迪亚斯",
    "Marc-André ter Stegen": "特尔施特根", "Iñaki Peña": "佩尼亚", "Ronald Araújo": "阿劳霍", "Jules Koundé": "孔德", "Pau Cubarsí": "库巴西", "Alejandro Balde": "巴尔德", "Andreas Christensen": "克里斯滕森",
    "Pedri": "佩德里", "Gavi": "加维", "Frenkie de Jong": "德容", "Dani Olmo": "奥尔莫", "Fermín López": "费尔明·洛佩斯", "Robert Lewandowski": "莱万多夫斯基", "Raphinha": "拉菲尼亚", "Lamine Yamal": "亚马尔", "Ferran Torres": "费兰·托雷斯",
    "Jan Oblak": "奥布拉克", "Juan Musso": "穆索", "José María Giménez": "希门尼斯", "Robin Le Normand": "勒诺尔芒", "Axel Witsel": "维特塞尔", "Nahuel Molina": "莫利纳", "Reinildo Mandava": "雷尼尔多",
    "Koke": "科克", "Rodrigo De Paul": "德保罗", "Marcos Llorente": "略伦特", "Pablo Barrios": "巴里奥斯", "Conor Gallagher": "加拉格尔", "Antoine Griezmann": "格列兹曼", "Julián Álvarez": "阿尔瓦雷斯", "Ángel Correa": "科雷亚", "Samuel Lino": "利诺",
    "Manuel Neuer": "诺伊尔", "Sven Ulreich": "乌尔赖希", "Dayot Upamecano": "于帕梅卡诺", "Kim Min-jae": "金玟哉", "Alphonso Davies": "阿方索·戴维斯", "Raphaël Guerreiro": "格雷罗",
    "Joshua Kimmich": "基米希", "Jamal Musiala": "穆西亚拉", "Leon Goretzka": "格雷茨卡", "Aleksandar Pavlović": "帕夫洛维奇", "Kingsley Coman": "科曼", "Harry Kane": "凯恩", "Leroy Sané": "萨内", "Serge Gnabry": "格纳布里", "Michael Olise": "奥利塞",
    "Gregor Kobel": "科贝尔", "Alexander Meyer": "亚历山大·迈尔", "Nico Schlotterbeck": "施洛特贝克", "Niklas Süle": "聚勒", "Julian Ryerson": "莱尔森", "Ramy Bensebaini": "本塞拜尼", "Mats Hummels": "胡梅尔斯",
    "Emre Can": "埃姆雷·詹", "Julian Brandt": "布兰特", "Marcel Sabitzer": "萨比策", "Karim Adeyemi": "阿德耶米", "Giovanni Reyna": "雷纳", "Donyell Malen": "马伦", "Niclas Füllkrug": "菲尔克鲁格", "Serhou Guirassy": "吉拉西", "Jamie Gittens": "吉滕斯",
    "Lukáš Hrádecký": "赫拉德茨基", "Matej Kovář": "科瓦日", "Jonathan Tah": "塔", "Edmond Tapsoba": "塔普索巴", "Piero Hincapié": "因卡皮耶", "Jeremie Frimpong": "弗林蓬", "Álex Grimaldo": "格里马尔多",
    "Granit Xhaka": "扎卡", "Florian Wirtz": "维尔茨", "Exequiel Palacios": "帕拉西奥斯", "Jonas Hofmann": "霍夫曼", "Robert Andrich": "安德里希", "Patrik Schick": "希克", "Victor Boniface": "博尼费斯", "Amine Adli": "阿德利", "Martin Terrier": "特里耶",
    "Gianluigi Donnarumma": "多纳鲁马", "Matvei Safonov": "萨福诺夫", "Marquinhos": "马尔基尼奥斯", "Willian Pacho": "帕乔", "Achraf Hakimi": "阿什拉夫", "Nuno Mendes": "努诺·门德斯", "Lucas Beraldo": "贝拉尔多",
    "Vitinha": "维蒂尼亚", "Fabián Ruiz": "法比安·鲁伊斯", "Warren Zaïre-Emery": "扎伊尔-埃梅里", "Lee Kang-in": "李刚仁", "João Neves": "若昂·内维斯", "Ousmane Dembélé": "登贝莱", "Randal Kolo Muani": "穆阿尼", "Gonçalo Ramos": "贡萨洛·拉莫斯", "Bradley Barcola": "巴尔科拉",
    "Yann Sommer": "索默", "Emil Audero": "奥代罗", "Alessandro Bastoni": "巴斯托尼", "Francesco Acerbi": "阿切尔比", "Benjamin Pavard": "帕瓦尔", "Denzel Dumfries": "邓弗里斯", "Carlos Augusto": "卡洛斯·奥古斯托",
    "Nicolò Barella": "巴雷拉", "Hakan Çalhanoğlu": "恰尔汗奥卢", "Henrikh Mkhitaryan": "姆希塔良", "Davide Frattesi": "弗拉泰西", "Piotr Zieliński": "泽林斯基", "Lautaro Martínez": "劳塔罗·马丁内斯", "Marcus Thuram": "图拉姆", "Mehdi Taremi": "塔雷米", "Marko Arnautović": "阿瑙托维奇",
    "Mike Maignan": "迈尼昂", "Marco Sportiello": "斯波尔蒂耶洛", "Fikayo Tomori": "托莫里", "Malick Thiaw": "佳夫", "Strahinja Pavlović": "帕夫洛维奇", "Theo Hernández": "特奥·埃尔南德斯", "Davide Calabria": "卡拉布里亚",
    "Tijjani Reijnders": "赖因德斯", "Ruben Loftus-Cheek": "洛夫图斯-奇克", "Ismaël Bennacer": "本纳赛尔", "Christian Pulisic": "普利西奇", "Yunus Musah": "穆萨", "Rafael Leão": "莱奥", "Álvaro Morata": "莫拉塔", "Samuel Chukwueze": "丘库埃泽", "Noah Okafor": "奥卡福",
    "Michele Di Gregorio": "迪格雷戈里奥", "Mattia Perin": "佩林", "Bremer": "布雷默", "Federico Gatti": "加蒂", "Danilo": "达尼洛", "Andrea Cambiaso": "坎比亚索", "Pierre Kalulu": "卡卢卢",
    "Manuel Locatelli": "洛卡特利", "Teun Koopmeiners": "库普梅纳斯", "Khéphren Thuram": "小图拉姆", "Douglas Luiz": "道格拉斯·路易斯", "Nicolò Fagioli": "法乔利", "Dušan Vlahović": "弗拉霍维奇", "Kenan Yıldız": "伊尔迪兹", "Federico Chiesa": "基耶萨", "Timothy Weah": "蒂莫西·维阿",
    "Alex Meret": "梅雷特", "Elia Caprile": "卡普里莱", "Giovanni Di Lorenzo": "迪洛伦佐", "Amir Rrahmani": "拉赫马尼", "Alessandro Buongiorno": "布翁乔尔诺", "Mathías Olivera": "奥利维拉", "Juan Jesus": "胡安·热苏斯",
    "Stanislav Lobotka": "洛博特卡", "André-Frank Zambo Anguissa": "安古伊萨", "Scott McTominay": "麦克托米奈", "Matteo Politano": "波利塔诺", "Khvicha Kvaratskhelia": "克瓦拉茨赫利亚", "Romelu Lukaku": "卢卡库", "Victor Osimhen": "奥斯梅恩", "Giacomo Raspadori": "拉斯帕多里", "Giovanni Simeone": "西蒙尼",
    "Anatoliy Trubin": "特鲁宾", "Samuel Soares": "萨穆埃尔·苏亚雷斯", "Nicolás Otamendi": "奥塔门迪", "António Silva": "安东尼奥·席尔瓦", "Alexander Bah": "亚历山大·巴", "Álvaro Carreras": "卡雷拉斯", "Morato": "莫拉托",
    "Florentino Luís": "弗洛伦蒂诺", "Orkun Kökçü": "科克曲", "Fredrik Aursnes": "奥尔斯内斯", "João Mário": "若昂·马里奥", "Andreas Schjelderup": "舍尔德鲁普", "Ángel Di María": "迪马利亚", "Vangelis Pavlidis": "帕夫利季斯", "Kerem Aktürkoğlu": "阿克蒂尔科奥卢", "Arthur Cabral": "阿图尔·卡布拉尔"
};

const FIRST_NAMES = [
    "马尔科", "卢卡", "斯特凡", "安德烈亚斯", "迈克尔", "托马斯", "大卫",
    "凯文", "帕特里克", "丹尼尔", "托比亚斯", "克里斯蒂安", "塞巴斯蒂安",
    "亚历山大", "马库斯", "扬", "费利克斯", "朱利安", "弗洛里安", "马克西米利安",
    "卡洛斯", "胡安", "佩德罗", "米格尔", "罗伯托", "弗朗切斯科", "乔瓦尼",
    "皮埃尔", "让", "安托万", "詹姆斯", "奥利弗", "哈里", "乔治"
];

const LAST_NAMES = [
    "穆勒", "施密特", "施耐德", "菲舍尔", "韦伯", "迈耶",
    "瓦格纳", "贝克尔", "舒尔茨", "霍夫曼", "科赫", "里希特",
    "加西亚", "罗德里格斯", "马丁内斯", "罗西", "鲁索", "费拉里",
    "杜邦", "马丁", "贝尔纳", "史密斯", "约翰逊", "威廉姆斯",
    "布朗", "琼斯", "威尔逊", "泰勒", "戴维斯", "埃文斯"
];

const SPONSOR_NAMES = [
    "星河科技", "麦田汉堡", "闪电能源", "远航汽车", "环球航空", "绿茵食品",
    "像素游戏", "活力营养", "速达银行", "青叶农场", "运动之巅", "云端网络",
    "麦芽啤酒", "电光商城", "轻旅假期", "潮流服饰", "移动先锋", "安心保险",
    "未来支付", "流光传媒", "火箭燃料", "数字银行", "鲜选市场", "极速宽带"
];

// Sponsor types: shirt + 4 stadium stands
const SPONSOR_TYPES = ["shirt", "north", "south", "east", "west"];

// Base sponsor values per type (per season)
const SPONSOR_BASE_VALUES = {
    shirt: 400000,
    north: 150000,
    south: 150000,
    east: 120000,
    west: 120000
};

// Training configurations
const TRAINING_CONFIG = {
    basic: { cost: 20000, strengthGain: 3, energyCost: 10 },
    intensive: { cost: 60000, strengthGain: 6, energyCost: 20 },
    elite: { cost: 150000, strengthGain: 10, energyCost: 25 }
};

// Stadium expansion options
const STADIUM_EXPANSIONS = {
    1000: 500000,
    2500: 1100000,
    5000: 2000000,
    10000: 3500000
};

// Position distribution for squad generation
const POSITION_COUNTS = { GK: 2, DEF: 5, MID: 5, FWD: 4 };

// Relegated teams get replaced by these
const PROMOTION_TEAMS = [
    "Newcastle United", "Aston Villa", "West Ham United", "Brighton",
    "Crystal Palace", "Sevilla", "Valencia", "AS Roma",
    "Lazio", "AS Monaco", "Marseille", "RB Leipzig",
    "Eintracht Frankfurt", "Ajax", "PSV Eindhoven", "FC Porto",
    "Sporting CP", "Galatasaray", "Celtic", "Feyenoord"
];

// Random events - some good, some bad, some just funny
const RANDOM_EVENTS = [
    // Positive events
    { type: "positive", title: "🎰 幸运彩票", message: "装备管理员中了彩票，并把奖金捐给了俱乐部！", effect: { budget: 500000 } },
    { type: "positive", title: "📺 转播奖金", message: "上一场比赛太精彩，电视台送来了一笔额外奖金！", effect: { budget: 200000 } },
    { type: "positive", title: "🍕 披萨聚会", message: "球队举办了披萨聚会！所有人都精神焕发。", effect: { energyAll: 15 } },
    { type: "positive", title: "🏆 球员获奖", message: "你的核心球员赢得了“本月最佳胡子”奖，球队士气大振！", effect: { energyAll: 10 } },
    { type: "positive", title: "🎪 马戏团进城", message: "球员们观看了马戏表演，杂耍训练提升了他们的协调性！", effect: { strengthRandom: 3 } },
    { type: "positive", title: "☕ 更衣室咖啡机", message: "更衣室添置了新咖啡机，所有人都干劲十足！", effect: { energyAll: 20 } },
    { type: "positive", title: "🦸 超级英雄电影", message: "球队看了一部超级英雄电影，感觉自己无所不能！", effect: { conditionAll: 15 } },
    { type: "positive", title: "💰 神秘赞助人", message: "一位匿名球迷把一箱现金捐到了俱乐部前台！", effect: { budget: 750000 } },
    
    // Negative events
    { type: "negative", title: "🦨 臭鼬入侵", message: "一群臭鼬闯进了更衣室，训练被迫取消！", effect: { energyAll: -10 } },
    { type: "negative", title: "🌧️ 球场积水", message: "球场被淹了，需要进行昂贵的排水维修。", effect: { budget: -150000 } },
    { type: "negative", title: "🍔 食物中毒", message: "赛后汉堡不太新鲜，半支球队都病倒了！", effect: { conditionAll: -20 } },
    { type: "negative", title: "🎸 噪音投诉", message: "球员组了乐队，邻居投诉，俱乐部被罚款。", effect: { budget: -50000 } },
    { type: "negative", title: "🦅 海鸥袭击", message: "训练时遭到海鸥袭击！几名球员受到了惊吓。", effect: { energyAll: -15 } },
    { type: "negative", title: "📱 社交媒体丑闻", message: "一名球员的尴尬动态爆红，俱乐部需要进行公关补救。", effect: { budget: -100000 } },
    { type: "negative", title: "🚽 管道事故", message: "球场厕所爆裂，俱乐部需要维修并赔偿。", effect: { budget: -200000 } },
    { type: "negative", title: "🎮 沉迷游戏", message: "球员们发现了一款新游戏，结果都没睡好觉。", effect: { energyAll: -20 } },
    
    // Neutral/funny events
    { type: "neutral", title: "👽 发现不明飞行物", message: "球员声称训练时看到了不明飞行物，媒体彻底沸腾了！", effect: { budget: 50000 } },
    { type: "neutral", title: "🐐 山羊闯入球场", message: "一只山羊跑进球场吃掉了角旗，真是离谱！", effect: {} },
    { type: "neutral", title: "🎭 认错人了", message: "你的门将被误认为知名演员，意外获得了免费宣传！", effect: { budget: 25000 } },
    { type: "neutral", title: "🧦 袜子失踪", message: "所有左脚袜子都不见了，谜团至今没有解开。", effect: { budget: -10000 } },
    { type: "neutral", title: "🦆 领养鸭子", message: "球队领养了一只鸭子当吉祥物，球迷们非常喜欢！", effect: { budget: 30000 } },
    { type: "neutral", title: "🎪 小丑来访", message: "一名小丑声称自己是新助理教练，保安已经赶来处理。", effect: {} },
    { type: "neutral", title: "🍝 意大利面之争", message: "大家激烈讨论哪种意大利面形状最好，这成了团队团建活动！", effect: { energyAll: 5 } },
    { type: "neutral", title: "🐈 球场里的猫", message: "一只猫住在看台下面，球员们给它取名叫“喵爵士”。", effect: {} }
];

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TEAM_NAMES, TEAM_STRENGTHS, REAL_SQUADS, REAL_PLAYER_PROFILES, PLAYER_NAME_ZH,
        FIRST_NAMES, LAST_NAMES, SPONSOR_NAMES,
        SPONSOR_TYPES, SPONSOR_BASE_VALUES, TRAINING_CONFIG,
        STADIUM_EXPANSIONS, POSITION_COUNTS, PROMOTION_TEAMS
    };
}
