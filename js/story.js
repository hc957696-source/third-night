// 《第三夜》全部剧情数据。game.js 只读不改。
// 时间格式：d = 'MM-DD'，t = 'HH:MM'。带 ev 的条目在对应事件触发后才出现，时间取触发时刻。
var STORY = {
  title: '第三夜',
  death: '11-10 21:40', // 这之后小满发的消息一律发送失败（真结局前）
  start: { d: '11-13', t: '23:12', battery: 31 },

  notice: '本游戏涉及丧葬、死亡题材，无血腥画面。建议戴耳机，在安静的地方玩。',
  intro: [
    '十一月十三日，夜里十一点多。',
    '你在县道边“青石镇路口”大巴站等车。',
    '长椅后面的草丛里，有一块屏幕亮了一下。',
    '是一部手机。还有电。',
    '屏幕上，消息一条接一条地弹出来。'
  ],

  people: {
    me:    { name: '林小满', av: '满', c: '#8a6b6b' },
    nai:   { name: '奶奶',   av: '奶', c: '#6b6f80' },
    ma:    { name: '妈妈',   av: '妈', c: '#7a7466' },
    ba:    { name: '爸爸',   av: '爸', c: '#5f6b66' },
    erh:   { name: '二婶',   av: '婶', c: '#806b5f' },
    erhs:  { name: '二叔',   av: '叔', c: '#66705f' },
    dabo:  { name: '大伯',   av: '伯', c: '#5f6670' },
    dabom: { name: '大伯母', av: '母', c: '#706066' },
    gu:    { name: '小姑',   av: '姑', c: '#6b6080' },
    jie:   { name: '阿杰',   av: '杰', c: '#5f7078' },
    yu:    { name: '小雨',   av: '雨', c: '#7a6670' }
  },

  chats: [
    {
      id: 'family', name: '林家大院（11）', av: '林', c: '#5a5f66',
      msgs: [
        { d: '11-10', t: '15:20', from: 'erh', text: '妈今天又没吃东西，医生说就这几天了。能回来的都回来吧。' },
        { d: '11-10', t: '15:26', from: 'dabo', text: '我明天一早到。' },
        { d: '11-10', t: '15:31', from: 'gu', text: '我订了明天中午的票。' },
        { d: '11-10', t: '15:41', from: 'me', text: '我请好假了，今晚的车。' },
        { d: '11-10', t: '15:43', from: 'jie', text: '姐，你到镇上说一声，我骑车去接你。' },
        { d: '11-10', t: '19:26', from: 'me', text: '上车了，大概九点半到镇上。' },
        { d: '11-10', t: '21:52', from: 'erh', text: '小满怎么还没到？电话打不通。' },
        { d: '11-10', t: '22:05', from: 'jie', text: '我在镇上车站，站里说那班车还没到。' },
        { d: '11-10', t: '22:31', from: 'ma', text: '满满，看到了回个话。' },
        { d: '11-10', t: '23:40', from: 'dabo', text: '我们现在去县医院。家里留人陪着妈。' },
        { d: '11-11', t: '00:12', from: 'me', text: '我到了！路上手机一直没信号，大家别担心。' },
        { d: '11-11', t: '07:30', from: 'me', text: '奶奶呢？' },
        { d: '11-11', t: '09:10', from: 'erh', text: '灵堂搭在堂屋，下午村里人来帮忙。' },
        { d: '11-11', t: '09:14', from: 'dabom', text: '妈那边谁陪着？' },
        { d: '11-11', t: '09:15', from: 'erh', text: '阿杰陪着。她不肯躺下，非要坐着。' },
        { d: '11-11', t: '10:02', from: 'me', text: '奶奶……是什么时候走的？怎么没人告诉我。' },
        { d: '11-11', t: '13:47', from: 'gu', text: '遗像用哪张？' },
        { d: '11-11', t: '14:20', from: 'ma', text: '用她去年毕业那张吧，她自己最喜欢。' },
        { d: '11-11', t: '14:21', from: 'me', text: '奶奶哪有毕业照，你们是不是弄错了' },
        { d: '11-11', t: '20:08', from: 'erh', text: '她那个手机找到没有？' },
        { d: '11-11', t: '20:15', from: 'jie', text: '没有。车上的东西都清点过了，就是没找到。' },
        { d: '11-12', t: '08:40', from: 'erh', photo: 'wake2', text: '' },
        { d: '11-12', t: '08:41', from: 'erh', text: '妈非要守着，劝不走。' },
        { d: '11-12', t: '09:02', from: 'me', text: '大家吃早饭了吗，我在厨房' },
        { d: '11-12', t: '11:30', from: 'erh', text: '她房间的东西先别动，等她妈缓缓再收。' },
        { d: '11-12', t: '16:22', from: 'yu', text: '我想姐姐了。' },
        { d: '11-12', t: '16:25', from: 'me', text: '小雨，姐姐就在院子里呀' },
        { d: '11-12', t: '19:10', from: 'dabo', text: '后天出殡，车定好了。' },
        { d: '11-13', t: '20:30', from: 'jie', text: '奶奶说今晚是第三夜，要喊一喊。' },
        { d: '11-13', t: '20:33', from: 'erh', text: '按老规矩来。路口那边也去烧点纸。' },
        { d: '11-13', t: '21:00', from: 'nai', voice: '满满，回家了，别在路上了。', sec: 6 },
        { d: '11-13', t: '22:10', from: 'nai', voice: '满满，回家了，别在路上了。', sec: 6 },
        { d: '11-13', t: '22:47', from: 'me', text: '你们去路口干什么？我也去' },
        { ev: 'e1', from: 'erh', text: '路口那边纸烧过了。回来的路上，都别回头。' },
        { ev: 'e3', from: 'jie', text: '奶奶还坐在门口，说刚才听见满满回来了。' },
        { ev: 'home', from: 'nai', voice: '满满回来了。', sec: 3 },
        { ev: 'home2', from: 'erh', photo: 'family', text: '' },
        { ev: 'home2', from: 'erh', text: '全家人都在了。' }
      ]
    },
    {
      id: 'nai', name: '奶奶', av: '奶', c: '#6b6f80',
      msgs: [
        { d: '11-03', t: '18:20', from: 'nai', voice: '满满，天冷了，多穿点。', sec: 4 },
        { d: '11-03', t: '18:31', from: 'me', text: '知道啦奶奶，你也是！' },
        { d: '11-10', t: '15:45', from: 'me', text: '奶奶你等我，我今晚就回来。' },
        { d: '11-11', t: '21:00', from: 'nai', voice: '满满，回家了，别在路上了。', sec: 6 },
        { d: '11-11', t: '21:20', from: 'me', text: '奶奶我就在家啊' },
        { d: '11-12', t: '21:00', from: 'nai', voice: '满满，回家了，别在路上了。', sec: 6 },
        { d: '11-12', t: '21:06', from: 'me', text: '奶奶你在哪儿？我找不到你' },
        { d: '11-13', t: '21:00', from: 'nai', voice: '满满，回家了，别在路上了。', sec: 6 },
        { ev: 'e2', from: 'nai', voice: '满满，回家了，别在路上了。', sec: 6 }
      ]
    },
    {
      id: 'ma', name: '妈妈', av: '妈', c: '#7a7466',
      msgs: [
        { d: '11-10', t: '19:00', from: 'ma', text: '上车了说一声。' },
        { d: '11-10', t: '19:25', from: 'me', text: '上车了，别等我吃饭。' },
        { d: '11-10', t: '21:45', from: 'ma', text: '到哪了？' },
        { d: '11-10', t: '21:50', from: 'ma', text: '怎么不接电话？' },
        { d: '11-10', t: '22:20', from: 'ma', text: '满满？' },
        { d: '11-11', t: '01:30', from: 'me', text: '妈，我到家了，你怎么一直在哭' },
        { d: '11-12', t: '07:10', from: 'me', text: '妈，你瘦了。' },
        { d: '11-12', t: '23:58', from: 'me', text: '你别坐在我床边了，去睡一会儿吧' }
      ]
    },
    {
      id: 'jie', name: '阿杰', av: '杰', c: '#5f7078',
      msgs: [
        { d: '11-10', t: '16:02', from: 'me', text: '我的车九点半到镇上，你来接我吗？' },
        { d: '11-10', t: '16:05', from: 'jie', text: '好，我骑车去，给你带件厚衣服。' },
        { d: '11-10', t: '21:30', from: 'jie', text: '到站了没？' },
        { d: '11-10', t: '21:35', from: 'me', text: '快了，在县道上了，雨好大。' },
        { d: '11-11', t: '01:00', from: 'me', text: '你怎么没来接我？我自己走回来的，走了好久' },
        { d: '11-12', t: '14:40', from: 'me', text: '你怎么也不理我' }
      ]
    }
  ],

  photos: [
    { id: 'bday', d: '03-17', t: '12:08', album: 'main', caption: '奶奶八十大寿', cake: '八十大寿 3.17' },
    { id: 'station', d: '11-10', t: '19:22', album: 'main', caption: '城北客运站' },
    { id: 'bus', d: '11-10', t: '21:18', album: 'main', caption: '' },
    { id: 'gate', d: '11-11', t: '00:20', album: 'main', caption: '' },
    { id: 'wake1', d: '11-11', t: '15:02', album: 'main', caption: '' },
    { id: 'yard', d: '11-12', t: '06:50', album: 'main', caption: '' },
    { id: 'wake2', d: '11-12', t: '08:40', album: 'main', caption: '来自“林家大院”' },
    { id: 'wake3', d: '11-13', t: '19:44', album: 'deleted', caption: '' },
    { id: 'family', ev: 'home2', album: 'main', caption: '来自“林家大院”' }
  ],

  notes: [
    { id: 'shop', title: '给奶奶买', d: '11-09', body: '护膝（加绒的）\n桃酥两盒\n老花镜，要比上次那副轻一点的\n\n她说不用买，买了她会偷偷高兴。' },
    { id: 'pwd', title: '备忘', d: '06-02', body: '隐私相册的密码提示设成“奶奶叫我什么”，这样我永远不会忘。' },
    {
      id: 'diary', title: '回村记', d: '11-13', lock: 'diary',
      entries: [
        { d: '11-11', t: '00:30', text: '终于到了。下车的地方离家好远，走了很久，路上一辆车都没有。家里灯都亮着，堂屋搭了灵堂，门口挂着白灯笼。\n\n我来晚了，奶奶已经走了。\n\n阿杰没来接我，估计是忙忘了。' },
        { d: '11-11', t: '16:00', text: '二婶看见我就哭了。我想抱抱她，她转身走开了。\n\n大家都很忙。我给大家倒茶，没人接。' },
        { d: '11-12', t: '22:10', text: '我睡的那间屋子被锁上了，门口摆着一双我的鞋。妈一直坐在我床边，我叫她，她不应。\n\n群里的消息总是发不出去，这里信号太差了。' },
        { d: '11-12', t: '23:40', text: '夜里听见奶奶在院子里喊我的小名。我出去看，院子里什么也没有。' },
        { d: '11-13', t: '20:05', text: '今天在灵堂拍了张照，想给奶奶留个念想。拍出来怪怪的，我没敢细看，删了。\n\n晚上他们说要去路口。我也想去。' }
      ]
    }
  ],

  calls: [
    { who: '妈妈', d: '11-10', t: '21:43', n: 23, missed: true },
    { who: '阿杰', d: '11-10', t: '21:50', n: 6, missed: true },
    { who: '二婶', d: '11-10', t: '22:10', n: 4, missed: true },
    { who: '妈妈', d: '11-10', t: '19:01', n: 1, missed: false, out: false },
    { who: '奶奶', d: '11-07', t: '20:14', n: 1, missed: false, out: true },
    { who: '公司 前台', d: '11-06', t: '10:32', n: 1, missed: false, out: false }
  ],

  sms: [
    {
      id: 'ticket', name: '城北客运站',
      msgs: [{ d: '11-10', t: '12:03', text: '【城北客运站】您已购买 11月10日 19:30 城北客运站—青石镇 车票1张，座位号14。请提前20分钟检票。' }]
    },
    {
      id: 'town', name: '青石镇便民通知',
      msgs: [
        { d: '11-10', t: '23:05', text: '【青石镇便民通知】今晚县道发生一起客车事故，相关部门正在处置。请家属保持电话畅通，市民注意出行安全。' },
        { d: '11-12', t: '08:00', text: '【青石镇便民通知】受降雨影响，县道部分路段临时管制，请绕行。' }
      ]
    },
    {
      id: 'bill', name: '话费提醒',
      msgs: [{ d: '11-12', t: '09:00', text: '【话费提醒】您的账户余额不足10元，为避免停机，请及时充值。' }]
    }
  ],

  locks: {
    screen:  { level: 1, kind: 'pin', prompt: '输入密码', hint: '提示：最重要的人的生日', help: '壁纸上的蛋糕写着什么？', answer: '0317', clue: { in: 'photo:bday', text: '3.17' } },
    diary:   { level: 2, kind: 'text', prompt: '这条笔记已加锁', hint: '提示：我出发的那天（4位数字）', help: '看看短信里的车票。', answer: '1110', clue: { in: 'sms:ticket', text: '11月10日' } },
    deleted: { level: 3, kind: 'text', prompt: '隐私相册已加锁', hint: '提示：奶奶叫我什么', help: '听听奶奶发来的语音。', answer: '满满', clue: { in: 'chat:nai', text: '满满' } }
  },

  // on：触发条件；delay：秒。同一事件只触发一次，先到先得。
  events: [
    { id: 'e1', on: ['unlock:screen'], delay: 25, notify: 'chat:family' },
    { id: 'e2', on: ['unlock:screen'], delay: 100, notify: 'chat:nai' },
    { id: 'e3', on: ['unlock:diary'], delay: 40, notify: 'chat:family' },
    { id: 'finale', on: ['read:diary', 'unlock:deleted'], delay: 60, fast: { 'unlock:deleted': 5 }, notify: 'sms:stranger' },
    { id: 'home', on: ['ending:home'], delay: 6, notify: 'chat:family' },
    { id: 'home2', on: ['ending:home'], delay: 12, notify: 'chat:family' }
  ],

  finale: {
    name: '未知号码',
    text: '你好，这是我的手机。你在哪捡到的？我找不到回家的路了。',
    replies: [
      { ending: 'home', text: '你已经回不去了。奶奶在叫你，回家吧。', needs: 'unlock:deleted', locked: '（你还没想好该怎么告诉她）' },
      { ending: 'bus', text: '你在哪？我把手机给你送过去。' },
      { ending: 'road', text: '你打错了。' }
    ]
  },

  endings: {
    home: {
      no: 1, title: '回家',
      replies: ['……', '我知道了。', '帮我跟奶奶说，我到家了。'],
      card: '她终于到家了。',
      after: '家族群里，好像有新消息。'
    },
    bus: {
      no: 2, title: '末班车',
      replies: ['我在路口站等你。', '末班车，九点四十。'],
      card: '远处，有车灯亮了。'
    },
    road: {
      no: 3, title: '还在路上',
      replies: [],
      card: '她还在路上。'
    }
  }
};

if (typeof module !== 'undefined') module.exports = STORY;
