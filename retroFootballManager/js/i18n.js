// ==================== 简体中文本地化 ====================

// 采用独立翻译层，后续修改英文源码时不需要到处改界面文字。
const ZH_PHRASES = [
    ['Manchester City', '曼彻斯特城'],
    ['Liverpool', '利物浦'],
    ['Arsenal', '阿森纳'],
    ['Chelsea', '切尔西'],
    ['Manchester United', '曼彻斯特联'],
    ['Tottenham Hotspur', '托特纳姆热刺'],
    ['Real Madrid', '皇家马德里'],
    ['Barcelona', '巴塞罗那'],
    ['Atlético de Madrid', '马德里竞技'],
    ['Bayern München', '拜仁慕尼黑'],
    ['Borussia Dortmund', '多特蒙德'],
    ['Bayer Leverkusen', '勒沃库森'],
    ['Paris Saint-Germain', '巴黎圣日耳曼'],
    ['Inter Milan', '国际米兰'],
    ['AC Milan', 'AC米兰'],
    ['Juventus', '尤文图斯'],
    ['Napoli', '那不勒斯'],
    ['Benfica', '本菲卡'],
    ['Newcastle United', '纽卡斯尔联'],
    ['Aston Villa', '阿斯顿维拉'],
    ['West Ham United', '西汉姆联'],
    ['Brighton', '布莱顿'],
    ['Crystal Palace', '水晶宫'],
    ['Sevilla', '塞维利亚'],
    ['Valencia', '瓦伦西亚'],
    ['AS Roma', '罗马'],
    ['Lazio', '拉齐奥'],
    ['AS Monaco', '摩纳哥'],
    ['Marseille', '马赛'],
    ['RB Leipzig', 'RB莱比锡'],
    ['Eintracht Frankfurt', '法兰克福'],
    ['Ajax', '阿贾克斯'],
    ['PSV Eindhoven', '埃因霍温'],
    ['FC Porto', '波尔图'],
    ['Sporting CP', '葡萄牙体育'],
    ['Galatasaray', '加拉塔萨雷'],
    ['Celtic', '凯尔特人'],
    ['Feyenoord', '费耶诺德'],
    ['Select your team and kit colors', '选择球队和球衣颜色'],
    ['Primary Kit Color', '主场球衣颜色'],
    ['Secondary Kit Color', '客场球衣颜色'],
    ['No offers available. Check back next round!', '暂无赞助报价，请下一轮再来看看！'],
    ['No players available', '暂无可签约球员'],
    ['No messages yet...', '暂时没有消息……'],
    ['No Shirt Sponsor', '暂无球衣赞助商'],
    ['Accept an offer below', '请在下方接受一份报价'],
    ['No sponsor', '暂无赞助商'],
    ['You need 11 players in the lineup!', '首发阵容必须有11名球员！'],
    ['Maximum 11 players in lineup!', '首发阵容最多只能有11名球员！'],
    ['Best XI selected based on overall rating!', '已按综合评分选择最佳首发！'],
    ['Freshest XI selected to conserve energy!', '已选择体能最充沛的首发阵容！'],
    ['Cannot sell - minimum squad size is 14!', '无法出售：球队至少要保留14名球员！'],
    ['Not enough budget to refresh market!', '预算不足，无法刷新转会市场！'],
    ['Transfer market refreshed!', '转会市场已刷新！'],
    ['Player already scheduled for training!', '这名球员已经安排了训练！'],
    ['Please select a training type!', '请先选择训练类型！'],
    ['No players selected for training!', '尚未选择训练球员！'],
    ['Game saved successfully!', '游戏保存成功！'],
    ['Game loaded successfully!', '游戏读取成功！'],
    ['Error loading save file!', '读取存档失败！'],
    ['Invalid training type!', '训练类型无效！'],
    ['Not enough budget!', '预算不足！'],
    ['Player not found!', '找不到这名球员！'],
    ['Invalid expansion option!', '扩建选项无效！'],
    ['Not enough budget for stadium expansion!', '预算不足，无法扩建球场！'],
    ['Ticket price must be between €10 and €100!', '票价必须在10至100欧元之间！'],
    ['No messages yet...', '暂时没有消息……'],
    ['No players available', '暂无可用球员'],
    ['Match Day (home)', '比赛日（主场）'],
    ['Avg per Round', '每轮平均收入'],
    ['Total Income', '总收入'],
    ['New League Position:', '新的联赛排名：'],
    ['Other Results', '其他比赛结果'],
    ['Round Summary', '本轮总结'],
    ['MATCH DAY - ', '比赛日 - '],
    ['BEST XI', '最佳首发'],
    ['FRESHEST XI', '体能最佳首发'],
    ['SEASON ', '第'],
    ['ROUND ', '第 '],
    [' COMPLETE!', '赛季结束！'],
    ['Final Position:', '最终排名：'],
    ['Prize Money', '联赛奖金'],
    ['Relegated Teams', '降级球队'],
    ['New teams have been promoted to replace them!', '新球队已经升级并取代它们！'],
    ['Season Updates', '赛季更新'],
    ['All players aged +1 year', '所有球员年龄增加1岁'],
    ['Energy & condition refreshed', '体能与状态已恢复'],
    ['New fixtures generated', '新赛程已生成'],
    ['Transfer market refreshed', '转会市场已刷新'],
    ['START SEASON ', '开始第'],
    [' has begun! Good luck!', '赛季！祝你好运！'],
    ['picked up an injury!', '受伤了！'],
    ['Youth prospect ', '青训新星 '],
    [' has joined from the academy!', '已从青训学院加入一线队！'],
    ['Academy graduate ', '青训毕业生 '],
    [' is ready for the first team!', '已经准备好进入一线队！'],
    ['has retired from football. Thanks for the memories!', '已从职业足坛退役，感谢他留下的回忆！'],
    ['slot already filled!', '名额已经被占用！'],
    ['Not enough budget to refresh market!', '预算不足，无法刷新转会市场！'],
    ['Stadium expanded by ', '球场扩建了 '],
    [' seats!', '个座位！'],
    ['players sent to ', '名球员已送去'],
    [' training!', '训练！'],
    ['Signed ', '签下'],
    ['Sold ', '出售'],
    [' for €', '，费用 €'],
    ['! Signing bonus: €', '！签约奖金：€'],
    ['🎫 Match Day', '🎫 比赛日'],
    ['Season ', '赛季 '],
    ['Round ', '第 '],
    ['NEXT', '下一轮'],
    ['No sponsor', '暂无赞助商'],
    ['Signing bonus:', '签约奖金：'],
    ['rounds remaining', '轮后到期'],
    ['Available', '可用'],
    ['Scheduled', '已安排'],
    ['Training', '训练中'],
    ['Starting', '首发'],
    ['Bench', '替补'],
    ['BUY', '购买'],
    ['SELL', '出售'],
    ['ACCEPT', '接受'],
    ['SLOT FILLED', '名额已满'],
    ['REFRESH', '刷新'],
    ['BUILD', '扩建'],
    ['CONTINUE', '继续'],
    ['NEW GAME', '新游戏'],
    ['LOAD SAVE', '读取存档'],
    ['SAVE', '保存'],
    ['LOAD', '读取'],
    ['END ROUND', '结束本轮'],
    ['OVERVIEW', '总览'],
    ['SQUAD', '阵容'],
    ['LINEUP', '首发'],
    ['TRANSFERS', '转会'],
    ['TRAINING', '训练'],
    ['SPONSORS', '赞助'],
    ['STADIUM', '球场'],
    ['LEAGUE', '联赛'],
    ['FIXTURES', '赛程'],
    ['CLUB OVERVIEW', '俱乐部总览'],
    ['SQUAD OVERVIEW', '球队阵容'],
    ['MATCH LINEUP (11 Players)', '比赛首发（11名球员）'],
    ['TRANSFER MARKET', '转会市场'],
    ['TRAINING CAMP', '训练营'],
    ['SPONSORSHIP DEALS', '赞助合同'],
    ['STADIUM MANAGEMENT', '球场管理'],
    ['LEAGUE TABLE', '联赛积分榜'],
    ['SEASON FIXTURES', '赛季赛程'],
    ['Available Players', '可签约球员'],
    ['Sell Players', '出售球员'],
    ['Shirt Sponsor', '球衣赞助商'],
    ['Stadium Hoardings', '球场广告牌'],
    ['Available Offers', '可用报价'],
    ['Ticket Pricing', '票价设置'],
    ['Expand Stadium', '扩建球场'],
    ['Match Day Projection', '比赛日收入预估'],
    ['Expected Attendance:', '预计上座人数：'],
    ['Projected Revenue:', '预计收入：'],
    ['Select Players for Training', '选择训练球员'],
    ['SEND TO TRAINING', '送去训练'],
    ['BASIC TRAINING', '基础训练'],
    ['INTENSIVE CAMP', '强化训练'],
    ['ELITE ACADEMY', '精英训练'],
    ['Sponsorship Deals', '赞助合同'],
    ['Each stand can have its own sponsor!', '每个看台都可以单独签约赞助商！'],
    ['Higher prices = more revenue but lower attendance', '票价越高收入越多，但上座率会下降'],
    ['Stadium View', '球场视图'],
    ['Income per Round', '每轮收入'],
    ['News Ticker', '新闻动态'],
    ['Players recover 25 energy when rested. Rotate your squad to keep everyone fresh!', '轮休球员可恢复25点体能。合理轮换，让球队保持活力！'],
    ['Select 11 players. Low energy/condition = underperformance + injury risk.', '选择11名球员。体能或状态过低会导致发挥失常并增加受伤风险。'],
    ['Training improves strength but costs energy. Effects apply after the round.', '训练可以提升能力，但会消耗体能，效果在本轮结束后生效。'],
    ['Cost:', '费用：'],
    ['Current:', '当前：'],
    ['seats', '个座位'],
    ['NORTH', '北看台'],
    ['SOUTH', '南看台'],
    ['EAST', '东看台'],
    ['WEST', '西看台'],
    ['HOME KIT', '主场球衣'],
    ['AWAY KIT', '客场球衣'],
    ['BUDGET', '预算'],
    ['LAST INCOME', '最近收入'],
    ['LEAGUE POS', '联赛排名'],
    ['NAME', '姓名'],
    ['POS', '位置'],
    ['AGE', '年龄'],
    ['ENERGY', '体能'],
    ['COND', '状态'],
    ['STR', '能力'],
    ['VALUE', '身价'],
    ['STATUS', '状态'],
    ['RATING', '评分'],
    ['TEAM', '球队'],
    ['PTS', '积分'],
    ['GF', '进球'],
    ['GA', '失球'],
    ['GD', '净胜球'],
    ['Home Team', '主队'],
    ['Away Team', '客队'],
    ['SIMULATING MATCH...', '正在模拟比赛……'],
    ['SEASON COMPLETE!', '赛季结束！'],
    ['🏆 CHAMPIONS! Incredible season!', '🏆 冠军！不可思议的赛季！'],
    ['🌟 Qualified for Europe! Great job!', '🌟 获得欧战资格！干得漂亮！'],
    ['👍 Solid mid-table finish.', '👍 稳定的中游排名。'],
    ['😅 Survived! Room for improvement.', '😅 保级成功！还有提升空间。'],
    ['😰 Narrowly avoided the drop!', '😰 惊险保级成功！'],
    ['Prize Money', '奖金'],
    ['No messages yet...', '暂时没有消息……'],
    ['Lottery wins and mysterious benefactors', '彩票中奖和神秘赞助人'],
    ['Lucky Lottery', '幸运彩票'],
    ['TV Deal Bonus', '电视转播奖金'],
    ['Pizza Party', '披萨聚会'],
    ['Award Winner', '球员获奖'],
    ['Circus in Town', '马戏团进城'],
    ['Coffee Machine', '更衣室咖啡机'],
    ['Superhero Film', '超级英雄电影'],
    ['Mysterious Benefactor', '神秘赞助人'],
    ['Skunk Invasion', '臭鼬入侵'],
    ['Flooded Pitch', '球场积水'],
    ['Food Poisoning', '食物中毒'],
    ['Noise Complaint', '噪音投诉'],
    ['Bird Attack', '海鸥袭击'],
    ['Social Media Scandal', '社交媒体丑闻'],
    ['Plumbing Disaster', '管道事故'],
    ['Gaming Addiction', '沉迷游戏'],
    ['UFO Sighting', '发现不明飞行物'],
    ['Pitch Invader', '山羊闯入球场'],
    ['Mistaken Identity', '认错人了'],
    ['Missing Socks', '袜子失踪'],
    ['Duck Adoption', '领养鸭子'],
    ['Clown Visit', '小丑来访'],
    ['Pasta Debate', '意大利面之争'],
    ['Cat in Stadium', '球场里的猫']
];

const ZH_TOKENS = {
    'Season': '赛季', 'Round': '轮次', 'season': '赛季', 'seasons': '赛季', 'round': '轮', 'rounds': '轮',
    'Player': '球员', 'Players': '球员', 'player': '球员', 'players': '球员',
    'Team': '球队', 'Home': '主队', 'Away': '客队', 'Position': '位置', 'Age': '年龄',
    'Strength': '能力', 'Energy': '体能', 'Condition': '状态', 'Value': '身价',
    'Shirt': '球衣', 'Sponsor': '赞助商', 'Stadium': '球场', 'League': '联赛',
    'Training': '训练', 'Market': '市场', 'Current': '当前', 'Income': '收入',
    'Available': '可用', 'Selected': '已选择', 'Total': '总计', 'Average': '平均',
    'position': '位置', 'season': '赛季', 'yo': '岁', 'P': '赛', 'W': '胜', 'D': '平', 'L': '负',
    'GK': '门将', 'DEF': '后卫', 'MID': '中场', 'FWD': '前锋'
};

const ZH_PHRASE_ENTRIES = [...ZH_PHRASES].sort((a, b) => b[0].length - a[0].length);
const ZH_TOKEN_ENTRIES = Object.entries(ZH_TOKENS).sort((a, b) => b[0].length - a[0].length);

function translateText(text) {
    let translated = text;

    // data.js 在本文件之后加载，所以在函数真正执行时读取中文球员名映射。
    if (typeof PLAYER_NAME_ZH !== 'undefined') {
        Object.entries(PLAYER_NAME_ZH)
            .sort((a, b) => b[0].length - a[0].length)
            .forEach(([from, to]) => {
                translated = translated.split(from).join(to);
            });
    }

    ZH_PHRASE_ENTRIES.forEach(([from, to]) => {
        translated = translated.split(from).join(to);
    });

    ZH_TOKEN_ENTRIES.forEach(([from, to]) => {
        const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        translated = translated.replace(new RegExp(`\\b${escaped}\\b`, 'g'), to);
    });

    // 动态创建的“开始第X赛季”按钮需要把赛季补回去。
    translated = translated.replace(/开始第(\d+)(?!赛季)/g, '开始第$1赛季');

    return translated;
}

function localizePage(root) {
    if (!root || typeof document === 'undefined') return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
        if (!node.parentElement?.closest('script, style')) {
            textNodes.push(node);
        }
    }

    textNodes.forEach(textNode => {
        const translated = translateText(textNode.nodeValue);
        if (translated !== textNode.nodeValue) {
            textNode.nodeValue = translated;
        }
    });
}

function startChineseLocalization() {
    if (!document.body) return;
    localizePage(document.body);

    let localizing = false;
    const observer = new MutationObserver(records => {
        if (localizing) return;
        localizing = true;
        records.forEach(record => {
            if (record.type === 'characterData') {
                const translated = translateText(record.target.nodeValue);
                if (translated !== record.target.nodeValue) record.target.nodeValue = translated;
            } else {
                record.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.TEXT_NODE) {
                        const translated = translateText(addedNode.nodeValue);
                        if (translated !== addedNode.nodeValue) addedNode.nodeValue = translated;
                    } else if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        localizePage(addedNode);
                    }
                });
            }
        });
        localizing = false;
    });

    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', startChineseLocalization);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translateText, localizePage };
}
