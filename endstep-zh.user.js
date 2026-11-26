// ==UserScript==
// @name         Endstep 汉化
// @name:en      Endstep Chinese Localization
// @namespace    https://endstep.cc/
// @version      1.4.1
// @description  把 endstep.cc 的界面与卡面文字汉化为简体中文
// @downloadURL  https://raw.githubusercontent.com/CounterSpel1/endstep-zh/main/endstep-zh.user.js
// @updateURL    https://raw.githubusercontent.com/CounterSpel1/endstep-zh/main/endstep-zh.user.js
// @match        https://endstep.cc/*
// @match        https://*.endstep.cc/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      mtgch.com
// @connect      api.scryfall.com
// @noframes
// ==/UserScript==

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   *  Endstep 汉化脚本
   *  词表 + 正则规则见下方 DICT / RULES；只替换文本节点与
   *  placeholder / title / aria-label / alt，不碰输入区、聊天正文与玩家名。
   * ------------------------------------------------------------------ */

  var STORE_KEY = 'eszh.enabled';
  var BTN_KEY = 'eszh.button';

  function readStore(k, d) {
    try {
      if (typeof GM_getValue === 'function') return GM_getValue(k, d);
      var v = localStorage.getItem(k);
      return v === null ? d : v;
    } catch (e) { return d; }
  }
  function writeStore(k, v) {
    try {
      if (typeof GM_setValue === 'function') GM_setValue(k, v);
      localStorage.setItem(k, String(v));
    } catch (e) {}
  }

  var enabled = String(readStore(STORE_KEY, '1')) !== '0';

  /* ============================ 词表 ================================ */

  var DICT = Object.create(null);

  /* 说明
   * 键：站点英文原文（整串、区分大小写优先；未命中会再试小写）
   * 值：简体中文；术语以万智牌官方中文为准
   * 专有名词（Endstep / Discord / Scryfall / Forge / 赛制品牌名）保留原文
   */
  /* ---------- 1. 通用动作 / 按钮 / 导航 / 账号 / 大厅 ---------- */

  Object.assign(DICT, {
    // ——— 顶层导航
    'Play': '对战',
    'Decks': '套牌',
    'Cubes': 'Cube',
    'Tables': '牌桌',
    'Table': '牌桌',
    'Metagame': '环境',
    'History': '战绩',
    'Settings': '设置',
    'Profile': '个人资料',
    'Friends': '好友',
    'Chats and friends': '私信与好友',
    'Events': '赛事',
    'Tournaments': '比赛',
    'Ladder': '天梯',
    'Ladders': '天梯',
    'Leaderboard': '排行榜',
    'Home': '首页',
    'Menu': '菜单',
    'More': '更多',
    'More actions': '更多操作',
    'About': '关于',
    'About these numbers': '关于这些数据',
    'Log': '日志',
    'Notices': '公告',
    'Announcements': '公告',
    'Support Endstep': '支持 Endstep',
    'Support on Patreon': '在 Patreon 上支持',
    'Dev log': '开发日志',
    'Changelog': '更新日志',
    'Terms of Service': '服务条款',
    'Privacy Policy': '隐私政策',
    'Privacy and terms': '隐私与条款',
    'Install Endstep': '安装 Endstep',
    'Add to Home Screen': '添加到主屏幕',
    'Add Endstep to your home screen for a full-screen, app-like table.':
      '把 Endstep 加到主屏幕，即可全屏、像原生应用一样开桌。',
    'Add it to your home screen for a full-screen table.':
      '把它加到主屏幕，即可全屏对战。',

    // ——— 通用按钮
    'OK': '好',
    'OK & remember': '好，并记住',
    'Yes': '是',
    'No': '否',
    'Cancel': '取消',
    'Confirm': '确认',
    'Accept': '接受',
    'Decline': '拒绝',
    'Agree': '同意',
    'Refuse': '拒绝',
    'Close': '关闭',
    'Done': '完成',
    'Done →': '完成 →',
    'Save': '保存',
    'Save changes': '保存修改',
    'Apply': '应用',
    'Apply filters': '应用筛选',
    'Apply update': '应用更新',
    'Reset': '重置',
    'Reset to defaults': '恢复默认',
    'Restore defaults': '恢复默认',
    'Restore': '恢复',
    'Delete': '删除',
    'Remove': '移除',
    'Remove it': '移除',
    'Edit': '编辑',
    'Rename': '重命名',
    'Duplicate': '复制一份',
    'Clone': '克隆',
    'Copy': '复制',
    'Copy text': '复制文本',
    'Copy as text': '复制为文本',
    'Copy as Markdown': '复制为 Markdown',
    'Copy link': '复制链接',
    'Copy decklist': '复制牌表',
    'Copy the list, or download it': '复制牌表，或下载它',
    'Copy or download it as a card list.': '复制或下载为牌表。',
    'Copy player id': '复制玩家 ID',
    'Paste': '粘贴',
    'Paste a list': '粘贴牌表',
    'Paste a list…': '粘贴牌表…',
    'Paste from the clipboard': '从剪贴板粘贴',
    'Paste the list instead': '改为粘贴牌表',
    'Undo': '撤销',
    'Undone': '已撤销',
    'Retry': '重试',
    'Try again': '重试',
    'Reload': '重新加载',
    'Refresh': '刷新',
    'Search': '搜索',
    'Clear': '清空',
    'Clear all': '全部清空',
    'Clear search': '清除搜索',
    'Clear selection': '取消选择',
    'Clear filters': '清除筛选',
    'Clear password': '清除密码',
    'Clear password…': '清除密码…',
    'Back': '返回',
    'Back to tables': '返回牌桌',
    'Back to Play': '返回对战',
    'Back to game': '返回对局',
    'Back to the draft': '返回轮抽',
    'Back to the event': '返回赛事',
    'Back to deck building': '返回构筑',
    'Back to replays': '返回回放',
    'Back to the metagame formats': '返回环境赛制',
    'Go back': '返回',
    'Go Home': '回首页',
    'Go to Play': '前往对战',
    'Go →': '前往 →',
    'Next': '下一个',
    'Previous': '上一个',
    'Next decision': '下一个决策',
    'Previous decision': '上一个决策',
    'Next decision (Shift+→)': '下一个决策（Shift+→）',
    'Previous decision (Shift+←)': '上一个决策（Shift+←）',
    'Show': '显示',
    'Hide': '隐藏',
    'Show more': '显示更多',
    'Show fewer': '收起',
    'Show all': '显示全部',
    'Read more': '阅读全文',
    'Loading': '加载中',
    'Loading…': '加载中…',
    'Loading.': '加载中。',
    'Saving…': '保存中…',
    'Sending…': '发送中…',
    'Searching': '搜索中',
    'Searching…': '搜索中…',
    'Working out what this would do…': '正在推算结果…',
    'Applying': '应用中',
    'Processing': '处理中',
    'Resolving': '结算中',
    'Connecting...': '连接中…',
    'Signing in': '登录中',
    'Signing you in with Discord': '正在通过 Discord 登录',
    'Validating session': '正在校验会话',
    'One moment': '稍等',

    // ——— 账号
    'Sign in': '登录',
    'Sign out': '退出登录',
    'Account': '账号',
    'Your account': '你的账号',
    'Username': '用户名',
    'Password': '密码',
    'Current password': '当前密码',
    'New password': '新密码',
    'New password again': '再次输入新密码',
    'Your password': '你的密码',
    'Display name': '显示名称',
    'Your picture': '你的头像',
    'Profile picture': '头像',
    'Upload a picture': '上传图片',
    'Remove avatar': '移除头像',
    'Remove picture': '移除图片',
    'Change cover': '更换封面',
    'Choose cover art': '选择封面图',
    'First visit': '首次访问',
    'Last seen': '最后在线',
    'Last visit': '上次访问',
    'Forgot your password?': '忘记密码？',
    'Forgot it? Confirm with Discord instead': '忘了？改用 Discord 确认',
    'Link Discord': '绑定 Discord',
    'Link Patreon': '绑定 Patreon',
    'Unlink': '解除绑定',
    'Linked.': '已绑定。',
    'Link cancelled.': '绑定已取消。',
    'Account & Patreon': '账号与 Patreon',
    'Discord and Patreon': 'Discord 与 Patreon',
    'Delete account': '注销账号',
    'Delete account…': '注销账号…',
    'Delete your account': '注销你的账号',
    'Delete your account?': '确定注销账号？',
    'Deleting your account': '正在注销账号',
    'Keep my account': '保留账号',
    'This device': '本设备',
    'Device': '设备',
    'Session expired': '登录已过期',
    'That account is no longer available. Sign in again.': '该账号已不可用，请重新登录。',

    // ——— 大厅 / 牌桌
    'Open a table': '开一桌',
    'Open tables': '开放的牌桌',
    'Browse tables': '浏览牌桌',
    'New table': '新建牌桌',
    'Your table': '你的牌桌',
    'Your table:': '你的牌桌：',
    'Table name': '牌桌名称',
    'Rename table': '重命名牌桌',
    'Close table': '关闭牌桌',
    'Close this table?': '关闭这张牌桌？',
    'Leave': '离开',
    'Leave seat': '离开座位',
    'Leave the pod': '离开多人桌',
    'Leave game': '离开对局',
    'Leave queue': '退出队列',
    'Take your seat': '入座',
    'Your seat keeps its place': '你的座位会保留',
    'Go to the table': '前往牌桌',
    'Join': '加入',
    'Join the draft': '加入轮抽',
    'Find a match': '寻找对局',
    'Find match': '寻找对局',
    'Find match…': '寻找对局…',
    'Find games': '找对局',
    'Find a game': '找一局',
    'Find players': '找玩家',
    'Find a player': '找玩家',
    'Find a player by name': '按昵称找玩家',
    'Find a friend or a conversation': '查找好友或会话',
    'Search players': '搜索玩家',
    'Search players, formats, tables': '搜索玩家、赛制、牌桌',
    'Live games': '进行中的对局',
    'Live': '进行中',
    'Waiting': '等待中',
    'Waiting for a pod': '等待多人桌凑满',
    'Waiting for an opponent': '等待对手',
    'Waiting for them': '等待对方',
    'Waiting for your opponent. The game starts as soon as they submit theirs.':
      '正在等待对手，对方提交套牌后立即开始。',
    'Waiting for the host to choose the bots\' decks': '等待房主选择 AI 的套牌',
    'Waiting for the host to choose the shared deck': '等待房主选择共享牌库',
    'Waiting for your opponents to accept…': '等待对手接受…',
    'Waiting for a pack': '等待补充包',
    'Waiting on staff': '等待工作人员处理',
    'Spectating': '观战中',
    'Watching': '观战中',
    'Watch': '观战',
    'Watch game': '观战',
    'Watch this game (hidden from the players)': '观战（对玩家隐藏）',
    'Watch from a side': '旁观',
    'Stop spectating': '停止观战',
    'Jump to me': '跳到我',
    'Held': '已留座',
    'Idle': '空闲',
    'Online': '在线',
    'Offline': '离线',
    'Disconnected': '已断线',
    'Host': '房主',
    'Guests': '访客',
    'Guest': '访客',
    'Players': '玩家',
    'Players:': '玩家：',
    'Player': '玩家',
    'Opponent': '对手',
    'Opp': '对手',
    'You': '你',
    'Your': '你的',
    'Yours': '你的',
    'Seats': '座位',
    'Seat': '座位',
    'Every seat is a player': '每个座位都是一名玩家',
    'Every seat is taken.': '座位已满。',
    'Open seats': '空座',
    'Nobody in the queue.': '队列里没有人。',
    'No table is waiting for a player.': '没有牌桌在等玩家。',
    'No table is being played.': '当前没有对局在进行。',
    'No games in progress.': '没有正在进行的对局。',
    'There are no cards to arrange.': '没有可排列的牌。',
    'This table is gone': '这张牌桌已不存在',
    'That table has already started': '该牌桌已开始',
    'That table is full': '该牌桌已满',
    'That is a practice table': '这是一张练习桌',
    'You\'re already at this table': '你已经在这张牌桌上了',
    'Could not join that table': '无法加入该牌桌',
    'Failed to leave the table': '离开牌桌失败',
    'Failed to close the table': '关闭牌桌失败',
    'Failed to open practice table': '打开练习桌失败',
    'Chat': '聊天',
    'Table talk': '桌聊',
    'Table talk messages': '桌聊消息',
    'Message the table': '给牌桌发消息',
    'Message the event': '给赛事发消息',
    'Open chat': '打开聊天',
    'Send': '发送',
    'Send and close': '发送并关闭',
    'Message': '消息',
    'Message…': '消息…',
    'Messages': '消息',
    'Messages:': '消息：',
    'New message': '新消息',
    'No messages yet.': '还没有消息。',
    'Delete conversation': '删除会话',
    'Conversation': '会话',
    'Quick replies only': '仅可快捷回复',
    'Send request': '发送请求',
    'Request sent': '请求已发送',
    'Add friend': '添加好友',
    'add a friend': '添加好友',
    'Remove friend': '删除好友',
    'Accept friend request': '接受好友请求',
    'Wants to be friends': '请求添加好友',
    'Friends only': '仅好友',
    'Your friend link': '你的好友链接',
    'Block': '屏蔽',
    'Unblock': '取消屏蔽',
    'Blocked': '已屏蔽',
    'Mute chat…': '禁言聊天…',
    'Unmute': '解除禁言',
    'Report': '举报',
    'Report…': '举报…',
    'Report a problem': '报告问题',
    'Report a problem with this table': '报告这张牌桌的问题',
    'Report a problem with the event': '报告该赛事的问题',
    'Report a broken link': '报告失效链接',
    'Reporter replied': '举报人已回复',
    'Warnings': '警告',
    'Warn…': '警告…',
    'Good game': '打得好',
    'Good luck, have fun': '祝你好运，玩得开心',
    'Rematch': '再战一局',
    'Offer a draw': '提议和局',
    'Conceding…': '正在认输…',
    'Return to lobby': '返回大厅',
    'Return to the match': '返回对局',
    'Up next': '接下来',
    'Recent': '最近',
    'Recent matches': '最近对局',
    'Recent connection': '最近连接',
    'Current wait': '当前等待',
    'Starting soonest': '最早开始',
    'Most players': '人数最多',
    'Fewest players to start': '开局人数最少',
    'Hosts change pack count, pack size and cards per pick': '房主可修改包数、每包张数与每次选牌张数',
    'Hosts turn a draft into a tournament': '房主可把轮抽转为比赛',
    'Everyone plays everyone once. Up to 10 players.': '每人互相对局一次，最多 10 名玩家。',
    'Round robin': '循环赛',
    'Swiss': '瑞士轮',
    'Swiss rounds': '瑞士轮',
    'Single elimination': '单败淘汰',
    'Bo1': '一局制',
    'Bo3': '三局两胜',
    'Bo5': '五局三胜',
    'Best of 1': '一局制',
    'Best of 3': '三局两胜',
    'Best of 5': '五局三胜',
    'Co-organizer': '协办人',
    'Organizer': '主办方',
    'Judge': '裁判',
    'Staff': '工作人员',
    'Admin': '管理员',
    'Administrator': '管理员',
    'Moderation': '版务',
    'Endstep Moderation': 'Endstep 版务',
    'Moderator': '版主',
    'Supporters': '支持者',
    'Supporter': '支持者',
    'Your supporter mark': '你的支持者标记',
    'Your supporter allowance has ended.': '你的支持者额度已结束。'
  });
  /* ---------- 2. 套牌 / 构筑 / 牌池 / 导入导出 ---------- */

  Object.assign(DICT, {
    // ——— 赛制
    'Standard': '标准',
    'Modern': '摩登',
    'Legacy': '薪传',
    'Vintage': '特选',
    'Pioneer': '先驱',
    'Pauper': '纯铁',
    'Commander': '指挥官',
    'Pauper Commander': '纯铁指挥官',
    'Duel Commander': '法禁',
    'duel-commander': '法禁',
    'Brawl': '争锋',
    'Constructed': '构筑',
    'Limited': '限制',
    'Sealed': '现开',
    'Draft': '轮抽',
    'Cube': 'Cube',
    'Premodern': '前摩登',
    'Historic': '史迹',
    'Explorer': '探险',
    'Alchemy': '炼金',
    'Timeless': '永恒',
    'Momir Basic': '莫秘维',
    'Winston': '温斯顿',
    'Winston draft': '温斯顿轮抽',
    'Rich Man\'s': '里奇曼',
    'Richman': '里奇曼',
    'Shared deck': '共享牌库',
    'Two duelists, one shared library.': '两名对决者共用一个牌库。',
    'Dandân mulligan': '丹丹调度',
    'Format': '赛制',
    'Formats': '赛制',
    'All formats': '全部赛制',
    'All formats…': '全部赛制…',
    'Find a format': '查找赛制',
    'Find format': '查找赛制',
    'Set format': '设置赛制',
    'Set format…': '设置赛制…',
    'Format ID': '赛制 ID',
    'Format\'s art': '赛制封面图',
    'No format': '无赛制',
    'No format matches.': '没有匹配的赛制。',
    'Choose a format': '选择一个赛制',
    'Choose a legal deck': '选择合法套牌',

    // ——— 套牌
    'Deck': '套牌',
    'decks': '套牌',
    'Decks': '套牌',
    'Your decks': '你的套牌',
    'My decks': '我的套牌',
    'Your deck': '你的套牌',
    'Your deck is submitted. The duel begins when your opponent picks theirs.':
      '你的套牌已提交，对手选好套牌后即开始对决。',
    'Deck name': '套牌名称',
    'Type a deck name': '输入套牌名称',
    'Decklist': '牌表',
    'Decklists': '牌表',
    'View decklist': '查看牌表',
    'Deck building': '构筑',
    'Build your deck': '构筑你的套牌',
    'Build a new deck': '新建套牌',
    'Build a different one': '换一套来构筑',
    'Add a deck': '添加套牌',
    'Add a deck to the graph': '把套牌加到图表',
    'Edit deck': '编辑套牌',
    'Open deck page': '打开套牌页面',
    'Rebuild deck': '重建套牌',
    'Sample list': '示例牌表',
    'Loading the deck': '正在加载套牌',
    'The deck could not be loaded.': '套牌加载失败。',
    'Failed to save deck': '保存套牌失败',
    'Deck saved': '套牌已保存',
    'Deck submitted': '套牌已提交',
    'Deckbuilding unlocked': '构筑已解锁',
    'Deckbuilding': '构筑',
    'Open Build & curate': '打开「构筑与整理」',
    'Build & curate': '构筑与整理',
    'Into a build': '加入构筑',
    'The decks could not be loaded. The graph is still current.': '套牌加载失败，图表仍是最新的。',

    // ——— 牌张 / 区域
    'Card': '牌',
    'Cards': '牌',
    'cards': '张牌',
    'Card type': '牌张类别',
    'Card name': '牌名',
    'Card name…': '牌名…',
    'The card\'s name': '这张牌的名称',
    'Card text unavailable': '牌面文字不可用',
    'Card eligibility': '牌张合法性',
    'Card size': '牌张大小',
    'Card layout': '牌面布局',
    'Card names over art': '画面上的牌名',
    'Card search is not answering. Try again in a moment.': '牌张检索无响应，请稍后再试。',
    'Cards in this deck\'s lists': '本套牌各列表中的牌',
    'Add card': '添加牌',
    'Add cards': '添加牌',
    'Add cards by name…': '按牌名添加…',
    'Add a card by name': '按牌名添加一张牌',
    'Add a card, e.g. 4 Lightning Bolt': '添加牌，例如 4 Lightning Bolt',
    'Choose a card': '选择一张牌',
    'Choose card name': '选择牌名',
    'Change card': '更换牌张',
    'Change printing': '更换版本',
    'Change printing…': '更换版本…',
    'Find a card': '查找牌张',
    'Find a card in this deck': '在本套牌中查找',
    'Find a card in this list': '在本牌表中查找',
    'Search a card by name': '按牌名搜索',
    'Search every card': '搜索全部牌张',
    'Search played cards': '搜索出过的牌',
    'Search decks or cards': '搜索套牌或牌张',
    'Search by name or type…': '按牌名或类别搜索…',
    'Type a card\'s name.': '输入牌名。',
    'Type a commander name…': '输入指挥官名称…',
    'Matching cards': '匹配的牌',
    'Any card': '任意牌',
    'Any card\'s art.': '任意牌的画。',
    'No card matches.': '没有匹配的牌。',
    'No cards': '无牌',
    'No cards match.': '没有匹配的牌。',
    'No cards yet. Add some, and any of them can be the cover.': '还没有牌。加几张，任意一张都能当封面。',
    'No printings found.': '没有找到可用版本。',
    'Printing': '版本',
    'Set': '系列',
    'Sets': '系列',
    'Set code': '系列代码',
    'Official set': '官方系列',
    'Random set': '随机系列',
    'Filter by set': '按系列筛选',
    'Filter by set name or code': '按系列名称或代码筛选',
    'Search sets': '搜索系列',
    'All sets A–Z': '全部系列 A–Z',
    'Rarity': '稀有度',
    'Common': '普通',
    'Uncommon': '非普通',
    'Rare': '稀有',
    'Mythic': '秘稀',
    'Mythic rare': '秘稀',
    'Other rarity': '其他稀有度',
    'Colour': '颜色',
    'Color': '颜色',
    'Colours': '颜色',
    'Black': '黑',
    'Blue': '蓝',
    'Green': '绿',
    'Red': '红',
    'White': '白',
    'Colorless': '无色',
    'Multicolor': '多色',
    'Land': '地',
    'Lands': '地',
    'Basic lands': '基本地',
    'Basic land in your deck': '你套牌中的基本地',
    'Creature': '生物',
    'Creatures': '生物',
    'Instant': '瞬间',
    'Instants': '瞬间',
    'Sorcery': '法术',
    'Sorceries': '法术',
    'Enchantment': '结界',
    'Enchantments': '结界',
    'Artifact': '神器',
    'Artifacts': '神器',
    'Planeswalker': '鹏洛客',
    'Planeswalkers': '鹏洛客',
    'Battle': '战役',
    'Battles': '战役',
    'Token': '衍生物',
    'Tokens': '衍生物',
    'Permanent': '永久物',
    'Spell': '咒语',
    'Spells': '咒语',
    'Ability': '异能',
    'Abilities': '异能',
    'Mana value': '法术力值',
    'Mana curve': '法术力曲线',
    'Mana value 0': '法术力值 0',
    'Mana value 1': '法术力值 1',
    'Mana value 2': '法术力值 2',
    'Mana value 3': '法术力值 3',
    'Mana value 4': '法术力值 4',
    'Mana value 5 or more': '法术力值 5 及以上',
    'Power and toughness': '力量与防御力',
    'Loyalty': '忠诚',
    'cmc': '法术力值',
    'CMC': '法术力值',

    // ——— 构筑细节
    'Main deck': '主牌',
    'Main': '主要阶段',
    'Maindeck': '主牌',
    'Sideboard': '备牌',
    'Side': '备牌',
    'Commander': '指挥官',
    'Commanders': '指挥官',
    'Companion': '行侣',
    'Make companion': '设为行侣',
    'No sideboard.': '没有备牌。',
    'Unknown': '未知',
    'Add to': '加入到',
    'Copies': '份数',
    'Copies in deck': '套牌中份数',
    'Copies:': '份数：',
    'Quantity': '数量',
    'Count': '数量',
    'Total': '合计',
    'cards in deck': '张牌在套牌中',
    'cards in hand': '张牌在手牌',
    'Deck size': '套牌张数',
    'Library (deck) size': '牌库张数',
    'Minimum': '最小值',
    'Maximum': '最大值',
    'Minimum mainboard': '主牌下限',
    'Maximum mainboard': '主牌上限',
    'Sideboard cap': '备牌上限',
    'Deck limits': '套牌限制',
    'Singleton deck': '单张套牌',
    'Deck from a draft': '来自轮抽的套牌',
    'A deck from a draft': '一套来自轮抽的套牌',
    'A deck from a sealed pool': '一套来自现开牌池的套牌',
    'Any cards, no deck rules': '任意牌，无套牌规则',
    'Any cards, no deck rules.': '任意牌，无套牌规则。',
    'Nothing in your deck yet. Move cards in from the sideboard.': '套牌里还没有牌。从备牌移入。',
    'Every card of your pool is in the deck.': '牌池里的每张牌都在套牌中。',
    'Restricted cards': '受限牌',
    'Restricted legendary cards': '受限传奇牌',
    'Legal': '合法',
    'Not legal': '不合法',
    'Choose a legal deck': '选择合法套牌',
    'Lands, then mana value': '先地，后按法术力值',
    'Alphabetical': '按字母',
    'Group by': '分组方式',
    'Group cards by': '牌张分组方式',
    'Sort': '排序',
    'Sort decks by': '套牌排序方式',
    'Sort pack': '整理补充包',
    'Sort gallery cards by': '画廊排序方式',
    'Your order': '你的顺序',
    'Last edited': '最近编辑',
    'Name': '名称',
    'Most cards': '牌张最多',
    'Played recently': '最近玩过',
    'Tile art': '卡图平铺',
    'Tiles': '平铺',
    'Grid': '网格',
    'List': '列表',
    'Gallery': '画廊',
    'Gallery order': '画廊顺序',
    'Graph': '图表',
    'Chart': '图表',

    // ——— 导入导出
    'Import': '导入',
    'Export': '导出',
    'Export…': '导出…',
    'Import / Export': '导入 / 导出',
    'Import and export': '导入与导出',
    'Import from link': '从链接导入',
    'Import from a link': '从链接导入',
    'Import from a link…': '从链接导入…',
    'Import from clipboard': '从剪贴板导入',
    'Import from Cube Cobra': '从 Cube Cobra 导入',
    'Import from Cube Cobra…': '从 Cube Cobra 导入…',
    'Cube Cobra link': 'Cube Cobra 链接',
    'Cube Cobra link or id': 'Cube Cobra 链接或 ID',
    'A cube link or its id.': 'Cube链接或其 ID。',
    'Moxfield, Archidekt, MTGGoldfish, TappedOut…': 'Moxfield、Archidekt、MTGGoldfish、TappedOut…',
    'A list, or a Moxfield, Archidekt, MTGGoldfish or TappedOut link':
      '一份牌表，或 Moxfield / Archidekt / MTGGoldfish / TappedOut 链接',
    'Plain text': '纯文本',
    'One card per line. A “Sideboard” line starts the sideboard; MTGA and MTGO exports work as they are.':
      '每行一张牌。遇到「Sideboard」行即进入备牌；MTGA 与 MTGO 的导出可直接使用。',
    'MTG Arena format: Deck / Sideboard headers and (SET) collector printings.':
      'MTG Arena 格式：Deck / Sideboard 标题行，以及 (SET) 收集编号。',
    'Magic Online text: names only, sideboard after a blank line. Carries no printings, and re-importing it into Endstep folds the sideboard into the maindeck.':
      'Magic Online 文本：只含牌名，空行之后为备牌。不含版本信息，重新导入 Endstep 时备牌会并入主牌。',
    'Card names with printings and section headers — reads back into Endstep, Moxfield, and Archidekt.':
      '带版本与分节标题的牌名，可重新导入 Endstep、Moxfield 与 Archidekt。',
    'Card names, text, images and mana symbols are © Wizards of the Coast.':
      '牌名、牌面文字、图像与法术力符号版权归 Wizards of the Coast 所有。',
    'Add by username': '按用户名添加',
    'Add someone': '添加玩家',
    'Pick a printing. Your choice shows in the deck and in-game — your opponent sees it too.':
      '选择一个版本。你的选择会显示在套牌与对局中——对手也能看到。',
    'Use this printing in new decks': '新套牌沿用此版本',
    'Use this printing in future decks': '以后的新套牌沿用此版本',
    'Stop preferring a printing': '取消该版本偏好',
    'Remove the preferred printing': '移除版本偏好',
    'Load more printings': '加载更多版本',
    'Couldn’t load printings — Scryfall may be temporarily unavailable.':
      '版本加载失败——Scryfall 可能暂时不可用。'
  });
  /* ---------- 3. 对战界面（战场 / 堆叠 / 优先权 / 步骤） ---------- */

  Object.assign(DICT, {
    // ——— 区域与牌张状态
    'Battlefield': '战场',
    'The battlefield is empty.': '战场是空的。',
    'Hand': '手牌',
    'Cards in hand': '手牌',
    'hand': '手牌',
    'Library': '牌库',
    'Graveyard': '坟墓场',
    'Exile': '放逐区',
    'Exiled': '已放逐',
    'Stack': '堆叠',
    'The Stack': '堆叠',
    'Zone': '区域',
    'Zones': '区域',
    'Permanents': '永久物',
    'Permanent dies': '永久物死亡',
    'Token created': '衍生物产生',
    'Transformed': '已转化',
    'Phased out': '已移相',
    'PHASED OUT': '已移相',
    'face down': '牌面朝下',
    'face down in exile': '放逐区牌面朝下',
    'face up in exile': '放逐区牌面朝上',
    'Revealed': '已展示',
    'Reveals': '展示',
    'Revealed cards tracker': '展示牌追踪',
    'Drawn': '已抓',
    'Discarded': '已弃',
    'Discard': '弃牌',
    'Exile card': '放逐牌',
    'Copy': '复制',
    'Replacement': '替代',
    'Effect': '效应',
    'Effects': '效应',
    'Active effects': '生效中的效应',
    'Active Effects': '生效中的效应',
    'Counters': '指示物',
    'COUNTERS': '指示物',
    'damage this turn': '本回合伤害',
    'Life': '生命',
    'Life total': '总生命',
    'Life gain': '获得生命',
    'Life total rises': '总生命增加',
    'Poison': '中毒',
    'Energy': '能量',
    'Monarch': '君主',
    'The Monarch': '君主',
    'Monarch — draw a card at your end step': '君主——在你的结束阶段抓一张牌',
    'The Ring': '魔戒',
    'Initiative': '先制',
    'Initiative — venture further into Undercity at your upkeep': '先制——在你的维持开始时深入地城更深处',
    'City\'s Blessing': '黄金城祝福',
    'City\'s Blessing — 10 or more permanents control the city': '黄金城祝福——操控十个或更多永久物即拥有黄金城',
    'Dungeon': '地城',
    'Companion': '行侣',
    'Ring': '魔戒',
    'The Ring tempts you': '魔戒引诱你',
    'Treasure': '珍宝',
    'Clue': '线索',
    'Food': '食物',

    // ——— 步骤与阶段
    'Turn': '回合',
    'Turns': '回合',
    'Turn order': '回合顺序',
    'Your turn': '你的回合',
    'your turn': '你的回合',
    'opponent\'s turn': '对手回合',
    'This turn': '本回合',
    'Turn 1': '第 1 回合',
    'Untap': '重置',
    'Untap all permanents.': '重置你所有横置的永久物。',
    'Upkeep': '维持',
    'Trigger upkeep effects.': '一些「在维持开始时」触发的异能在此时生效。',
    'Draw step': '抓牌',
    'Main 1': '主要阶段一',
    'Main 2': '主要阶段二',
    'Combat': '战斗阶段',
    'Beginning of combat': '战斗开始',
    'Combat begins.': '战斗开始。',
    'Declare attackers': '宣告攻击者',
    'Declare attackers.': '宣告攻击者。',
    'Declare blockers': '宣告阻挡者',
    'Declare blockers.': '宣告阻挡者。',
    'Attackers': '攻击者',
    'Blockers': '阻挡者',
    'ATTACKING': '攻击中',
    'BLOCKING': '阻挡中',
    'BLOCKED BY': '被阻挡',
    'Combat damage': '战斗伤害',
    'Combat damage.': '战斗伤害。',
    'First-strike damage': '先攻伤害',
    'First-strike damage.': '先攻伤害。',
    'End Combat': '结束战斗',
    'End of combat': '战斗结束',
    'End Step': '结束',
    'End step': '结束',
    'End of turn': '回合结束',
    'End-of-turn triggers.': '回合结束触发。',
    'End-of-turn abilities trigger.': '回合结束异能在触发。',
    'Cleanup': '清理',
    'Discard to hand size; damage wears off.': '弃牌至手牌上限；伤害消失。',
    'End step abilities trigger.': '结束阶段异能在触发。',
    'Phase': '阶段',
    'Phases': '阶段',
    'Phase stops': '阶段停止点',
    'Phase history': '阶段记录',
    'Step': '步骤',
    'Turn and mulligan summaries use completed game-seat records.':
      '回合与调度的统计只采用已完成的游戏席位记录。',
    'Turn capture': '回合记录',

    // ——— 优先权与行动
    'Priority': '优先权',
    'priority': '优先权',
    'You have priority': '你拥有优先权',
    'Hold Priority': '保留优先权',
    'Hold priority': '保留优先权',
    'Toggle hold priority': '切换保留优先权',
    'Retain priority on cast': '施放后保留优先权',
    'Keep priority after you cast, and pause auto-yields': '施放后保留优先权，并暂停自动让过',
    'Pass': '让过',
    'Pass / Confirm': '让过 / 确认',
    'Pass priority': '让过优先权',
    'Pass until end of turn': '让过至回合结束',
    'Pass until end of turn?': '让过至回合结束？',
    'Pass until combat': '让过至战斗',
    'Pass until my next turn': '让过至我的下个回合',
    'Pass until before my turn': '让过至我的回合前',
    'Pass until action or end step': '让过至有行动或结束',
    'To EOT': '至回合结束',
    'Auto-pass': '自动让过',
    'Auto-pass priority': '自动让过优先权',
    'Auto-pass priority until the end of this turn.': '自动让过优先权，直到本回合结束。',
    'Auto-pass priority until the start of your next turn.': '自动让过优先权，直到你的下个回合开始。',
    'Auto-pass priority until your next combat. Can be pre-queued while waiting.':
      '自动让过优先权，直到你的下个战斗。等待期间可以预先排队。',
    'Auto-pass priority to the end step of the turn right before yours (the last window before your untap). Works in 2/3/4-player games.':
      '自动让过优先权，直到你回合之前的那个结束阶段（你重置前的最后一个窗口）。2/3/4 人局均有效。',
    'Auto-pass priority until an opponent casts a spell, activates or triggers an ability, attacks, or the nearest end step arrives, whichever comes first.':
      '自动让过优先权，直到对手施放咒语、起动或触发异能、攻击，或最近的结束阶段到来，以先发生者为准。',
    'Yield this turn': '本回合让过',
    'Yield continuously': '持续让过',
    'Yield to stack': '让过给堆叠',
    'Auto-yield': '自动让过',
    'Auto-yielded — priority passes automatically': '已自动让过——优先权自动让过',
    'Auto-yielding': '自动让过中',
    'Auto-yields': '自动让过',
    'Auto-yields paused': '自动让过已暂停',
    'Disable auto-yields': '关闭自动让过',
    'Toggle auto-yield for the rest of the current turn.': '在本回合剩余时间里切换自动让过。',
    'Toggle continuous auto-yield until you cancel it.': '切换持续自动让过，直到你取消。',
    'Right-click an ability on the stack and choose Auto-yield to let it resolve without stopping for you.':
      '右键点击堆叠上的异能并选择「自动让过」，它结算时就不再询问你。',
    'Cast': '施放',
    'Cast or pass.': '施放或让过。',
    'Cast spells and activate abilities.': '施放咒语并起动异能。',
    'Act or pass.': '行动或让过。',
    'Activate': '起动',
    'Activated Ability': '起动式异能',
    'Triggered Ability': '触发式异能',
    'Mana Ability': '法术力异能',
    'Resolve': '结算',
    'Respond or pass.': '响应或让过。',
    'Respond or pass to the main phase.': '响应，或让过以进入主要阶段。',
    'Respond to declared attackers or pass.': '响应已宣告的攻击者，或让过。',
    'Respond to declared blockers or pass.': '响应已宣告的阻挡者，或让过。',
    'Respond before combat damage.': '在战斗伤害前响应。',
    'Abilities may trigger. Respond or pass.': '可能有异能触发，响应或让过。',
    'Abilities you\'ve told the engine to resolve without stopping for your priority.':
      '你已告知规则引擎不必询问你、直接结算的异能。',
    'Last chance to act before attackers are declared.': '在宣告攻击者之前，最后的机会。',
    'Last combat-scoped effects resolve.': '结算最后的战斗范围效应。',
    'Untap, draw, end.': '重置、抓牌、结束。',
    'Discard, untap, end.': '弃牌、重置、结束。',
    'Action / end step': '行动 / 结束',
    'Passes every turn · mirrors your deck': '每回合都让过 · 镜像你的套牌',
    'Stop on your turn': '在你的回合停下',
    'Stop on opponent\'s turn': '在对手回合停下',
    'Stop on your turn.': '在你的回合停下。',

    // ——— 战斗细则
    'Declare attackers.': '宣告攻击者。',
    'Declare every eligible attacker while declaring attackers.': '宣告攻击者时，把所有可攻击的生物都宣告为攻击。',
    'Clear all attackers': '清除所有攻击者',
    'Must attack': '必须攻击',
    'Must attack.': '必须攻击。',
    'Summoning sick — cannot attack': '召唤失调——不能攻击',
    'Damage assignment': '伤害分配',
    'Reset damage assignment': '重置伤害分配',
    'Combat · Divide Damage': '战斗 · 分配伤害',
    'Lethal': '致命',
    'Damage': '伤害',
    'Deathtouch · 1 is lethal': '死触 · 1 点即为致命',
    'Trample · every blocker must be lethal to spill over': '践踏 · 每个阻挡者都必须致命，伤害才能溢出',
    'First strike': '先攻',
    'Double strike': '连击',
    'Flying': '飞行',
    'Reach': '延势',
    'Vigilance': '警戒',
    'Haste': '敏捷',
    'Menace': '威慑',
    'Lifelink': '系命',
    'Hexproof': '辟邪',
    'Indestructible': '不灭',
    'Flash': '闪现',
    'Ward': '守护',
    'Protection': '保护',
    'Sacrifice': '牺牲',
    'Destroy': '消灭',
    'Counter target spell': '反击目标咒语',
    'Scry': '占卜',
    'Surveil': '刺探',
    'Mill': '磨牌',
    'Shuffle': '洗牌',
    'Library shuffle': '洗牌',
    'Tap': '横置',
    'Untap': '重置',
    'Tap all': '全部横置',
    'Choose ability': '选择异能',
    'Choose one': '选择一项',
    'Choose mode': '选择模式',
    'Choose type': '选择类别',
    'Choose what happened.': '选择发生了什么。',
    'Choose a card': '选择一张牌',
    'Pick this card': '选择这张牌',
    'Pick a printing': '选择版本',
    'Pick mana color': '选择法术力颜色',
    'Pick listed option / hand card': '从列表选项中选 / 选一张手牌',
    'Tap a highlighted target': '点击一个高亮的目标',
    'Target': '目标',
    'Targeting': '指定目标',
    'TARGETING': '指定目标中',
    'Choose target': '选择目标',
    'Add mana': '添加法术力',
    'Auto': '自动',
    'Auto-pay mana': '自动支付法术力',
    'Auto-pay': '自动支付',
    'Forced cast — must pay': '强制施放——必须支付',
    'Let the engine pick a legal payment for the cost being paid.': '由规则引擎为要支付的费用选择合法支付方式。',
    '(Mana will be lost!)': '（法术力将流失！）',

    // ——— 开局 / 调度
    'Mulligan': '调度',
    'Mulligans': '调度',
    'Mulligan rate': '调度率',
    'Take a mulligan': '调度',
    'Keep': '保留',
    'Keep it': '保留',
    'Keep this hand': '保留这手牌',
    'Opening hand': '起手牌',
    'The hand turn 1 began with — not what it mulliganed to.': '第 1 回合开始时的起手牌——而非调度后的手牌。',
    'Deck size': '套牌张数',
    'Hand size': '手牌上限',
    'Free mulligans': '免费调度',
    'First': '先手',
    'On the play': '先手',
    'On the draw': '后手',
    'On draw': '后手',
    'On play': '先手',
    'On the play — every game': '每盘都先手',
    'On the draw — every game': '每盘都后手',
    'Won the toss': '掷骰获胜',
    'Lost the toss': '掷骰失败',
    'Won the toss — game 1': '掷骰获胜——第一盘',
    'Lost the toss — game 1': '掷骰失败——第一盘',
    'Won toss · G1': '掷骰胜 · 第一盘',
    'Lost toss · G1': '掷骰负 · 第一盘',
    'Chose to draw': '选择后手',
    'Chose draw': '选择后手',
    'This deck chose play or draw.': '本套牌选择先手或后手。',
    'The opponent chose play or draw.': '由对手选择先手或后手。',
    'Game 1': '第一盘',
    'Game 2': '第二盘',
    'Game 3': '第三盘',
    'Game 1 only.': '仅第一盘。',
    'Game 1 only, where who chooses is randomized.': '仅第一盘，先后手由随机决定。',
    'game 1, where the toss is random': '第一盘，掷骰决定',
    'G2 · won G1': '第二盘 · 赢了第一盘',
    'G2 · lost G1': '第二盘 · 输了第一盘',
    'Game 3 · 1–1 only': '第三盘 · 仅 1–1 时',
    'Game 3 — 1–1 matches only': '第三盘——仅 1–1 的对局',
    'game 1, where the toss is random': '第一盘，掷骰决定',

    // ——— 对局结果
    'Won': '胜',
    'Lost': '负',
    'Draw': '抓牌',
    'Wins, losses, draws': '胜、负、平',
    'W–L–D': '胜–负–平',
    'Match loss': '对局判负',
    'Victory': '胜利',
    'Defeat': '失败',
    'Concede': '认输',
    'Conceding': '认输中',
    'Forfeit': '弃权',
    'Forfeited': '已弃权',
    'Lethal': '致命',
    'Game over': '对局结束',
    'Good game': '打得好',
    'Start another game': '开始下一盘',
    'This run ends after this match.': '本次挑战在这场对局后结束。',
    'Your game is starting': '你的对局即将开始',
    'Your match is waiting': '你的对局在等你',
    'Your game is starting.': '你的对局即将开始。',
    'Going to game': '进入对局',
    'Joining game': '正在进入对局',
    'Failed to begin match': '开始对局失败',
    'The game has started; a forfeit clock runs against whichever seat it is waiting on. The countdown is on the board.':
      '对局已开始，弃权倒计时正在对等待中的席位运行。倒计时显示在战场上。',
    'A match in progress always finishes, even past the deadline or if you leave the run.':
      '进行中的对局总会打完，即使超过截止时间或你退出本次挑战。',

    // ——— 对局内菜单与辅助
    'Game Log': '对局日志',
    'Open game log': '打开对局日志',
    'Log': '日志',
    'Also in the log': '日志中亦有记录',
    'Game rail': '对局侧栏',
    'Menu — card size, decklist, settings, concede. Esc opens it, or right-click the board.':
      '菜单——牌张大小、牌表、设置、认输。按 Esc 或右键点击战场可打开。',
    'Close preview': '关闭预览',
    'Inspect': '检视',
    'Inspect hovered card': '检视悬停的牌',
    'Pin the card under the cursor to the detail panel (same as right-click).':
      '把光标下的牌固定到详情面板（等同于右键）。',
    'Card names over art': '画面上的牌名',
    'Compact stacks': '紧凑堆叠',
    'Stacks': '堆叠组',
    'Hand size': '手牌上限',
    'Keep pulling to tuck the hand': '继续下拉可收合手牌',
    'Peek behind prompt': '从提示框后窥视',
    'Collapse an open prompt window to peek at the battlefield; press again to restore.':
      '收起打开的提示窗口以查看战场；再次按下恢复。',
    'Move to decision panel (Esc)': '移到决策面板（Esc）',
    'Open the decisions list.': '打开决策列表。',
    'Detach this zone into a movable, resizable window you can keep open during your turn':
      '把该区域拆成可移动、可缩放的窗口，可在你的回合中一直打开',
    'Send to the floating tracker': '送到浮动追踪器',
    'Shared across all zone pop-outs & the reveal tracker.': '所有区域弹窗与展示追踪器共用。',
    'Drag to resize · double-click to reset': '拖动调整大小 · 双击重置',
    'Drag, click, or use arrow keys to resize. Double-click to reset.':
      '拖动、点击或用方向键调整大小，双击重置。',
    'Drag down to shrink. Drag up to grow. Double-tap to reset. Use arrow keys to resize or Home to reset.':
      '下拉缩小，上拉放大，双击重置。用方向键调整大小，按 Home 重置。',
    'Two thumbs set the smallest and largest card size; cards auto-fit between them. Drag or use arrow keys. Double-click to reset.':
      '两个滑块分别设定最小与最大牌张尺寸，牌张在区间内自动适配。拖动或用方向键调整，双击重置。',
    'Or swipe the step up for the opponent\'s turn, down for yours.':
      '或上滑进入对手回合，下滑进入你的回合。',
    'Loop shortcut': '循环快捷键',
    'Loopable Dungeon Ambience': '可循环地城氛围音',
    'Dark Ambient Loop 13': '暗黑氛围循环 13',
    'Scriptorium bed': '缮写室背景音',
    'Low candle-room loop for menus': '菜单用低烛光循环音',
    'Background music': '背景音乐',
    'Sound': '音效',
    'Sounds': '音效',
    'All sound': '全部声音',
    'Music': '音乐',
    'Volume': '音量',
    'Animation speed': '动画速度',
    'Visuals': '视觉',
    'Interface': '界面',
    'Navigation': '导航',
    'Controls': '操控'
  });
  /* ---------- 4. 轮抽 / 现开 / 比赛 / 赛事 ---------- */

  Object.assign(DICT, {
    // ——— 轮抽与现开
    'Pack': '补充包',
    'Packs': '补充包',
    'Booster': '补充包',
    'Booster pack open': '补充包已打开',
    'Cards per pack': '每包张数',
    'Cards per pick': '每次选牌张数',
    'Packs from': '补充包来源',
    'Pack order': '补充包顺序',
    'Original booster size': '原始补充包张数',
    'Pick': '选牌',
    'Picks': '选牌',
    'Your picks': '你的选牌',
    'Your picks gather here.': '你的选牌会汇集在这里。',
    'Pick timer': '选牌计时',
    'Pick undo': '撤销选牌',
    'Undo pick': '撤销选牌',
    'Picks from this pack': '还能从这包中选',
    'Waiting for a pack': '等待补充包',
    'Your next pack': '你的下一个补充包',
    'Opening your first pack': '正在打开你的第一个补充包',
    'Dealing packs…': '正在发牌…',
    'Shuffling the cube.': '正在洗Cube。',
    'Open packs, pick, pass.': '开包、选牌、传包。',
    'A new pack arrives in draft': '轮抽中收到新的补充包',
    'Draft complete': '轮抽完成',
    'Draft products': '轮抽产品',
    'Draft tournaments': '轮抽比赛',
    'Drafts': '轮抽',
    'Start sealed': '开始现开',
    'Your sealed pool': '你的现开牌池',
    'Your pool': '你的牌池',
    'Your Draft Pool': '你的轮抽牌池',
    'See your pool': '查看你的牌池',
    'From your pool, no time limit': '从你的牌池中选，不限时',
    'Failed to load pool': '牌池加载失败',
    'No pool found. Deck building opens after a completed draft or a sealed pool.':
      '没有找到牌池。完成一次轮抽或取得现开牌池后才能构筑。',
    'Give a bye': '给一个轮空',
    'Bye': '轮空',
    'Byes': '轮空',
    'Cube': 'Cube',
    'Cubes': 'Cube',
    'Your cubes': '你的Cube',
    'Build a cube': '构筑一个Cube',
    'Choose a cube': '选择Cube',
    'In this cube': '在本Cube中',
    'Search cubes': '搜索Cube',
    'No cubes yet.': '还没有Cube。',
    'Delete cube': '删除Cube',
    'Failed to set cube': '设置Cube失败',
    'Cards from a printed set, gathered into packs': '来自某个实际系列的牌，被聚成补充包',
    'Custom draft settings': '自定义轮抽设置',
    'Reset draft settings': '重置轮抽设置',
    'This table has custom draft settings. Reset them before starting.':
      '这张牌桌有自定义轮抽设置，开始前请先重置。',
    'Leave draft': '离开轮抽',
    'Leave draft…': '离开轮抽…',
    'Leave the draft?': '离开轮抽？',
    'Clear draft': '清除轮抽',
    'Keep drafting': '继续轮抽',
    'Back to the draft': '返回轮抽',
    'Join the draft': '加入轮抽',
    'Your draft seat went to a bot': '你的轮抽席位已由 AI 接管',
    'The table is waiting on your pick. A released seat is drafted by a bot for the rest of the draft, and can\'t be rejoined.':
      '牌桌正在等你的选牌。放弃的席位会由 AI 代抽到轮抽结束，且无法重新加入。',
    'left the draft. A bot picks for their seat now.': '离开了轮抽，其席位现在由 AI 代抽。',
    'Quitting the draft ends the run, prices its matches like leaving, and can hold you out of the pod queue for a while.':
      '中途退出轮抽会结束本次挑战，其比赛按离开计费，并可能让你一段时间内无法进入多人局队列。',
    'Leaving the pod is free. Once the draft starts, quitting it ends the run and can hold you out of the pod queue for a while.':
      '离开多人桌不收费。轮抽一旦开始，退出会结束本次挑战，并可能让你一段时间内无法进入多人局队列。',
    'Opening the draft…': '正在打开轮抽…',
    'This draft isn\'t running': '该轮抽未在进行',
    'This draft was closed': '该轮抽已关闭',
    'You\'re not in this draft': '你不在这次轮抽中',
    'You were removed from this draft': '你已被移出这次轮抽',

    // ——— 比赛 / 赛事
    'Tournament': '比赛',
    'Tournament after': '之后转为比赛',
    'Create a tournament': '创建比赛',
    'Manage tournaments': '管理比赛',
    'Players browse and create tournaments': '玩家可浏览并创建比赛',
    'Tournaments': '比赛',
    'My events': '我的赛事',
    'Your events': '你的赛事',
    'Events': '赛事',
    'Event': '赛事',
    'Event chat': '赛事聊天',
    'Event chat messages': '赛事聊天消息',
    'Event or organizer': '赛事或主办方',
    'Event, organizer or player': '赛事、主办方或玩家',
    'Edit event': '编辑赛事',
    'Search events': '搜索赛事',
    'Search events…': '搜索赛事…',
    'Search finished events': '搜索已结束的赛事',
    'Filter events': '筛选赛事',
    'Updating events…': '正在更新赛事…',
    'No events yet': '还没有赛事',
    'Round': '轮',
    'Rounds': '轮数',
    'Round time': '每轮时长',
    'Round clock': '本轮计时',
    'Round age': '本轮已进行',
    'Round running over time': '本轮超时中',
    'Next round': '下一轮',
    'Round 4 starts ten minutes late.': '第 4 轮延迟十分钟开始。',
    'Through round': '截至第几轮',
    'Pairings': '对阵',
    'Pairing': '配对',
    'Pair two players': '让两名玩家配对',
    'Change pairings': '更换对阵',
    'Change this pairing…': '更换此对阵…',
    'This round has not been paired yet. Tables appear the moment the pairing lands.':
      '本轮尚未配对。配对完成后牌桌会立即出现。',
    'No round has been paired yet.': '还没有任何一轮完成配对。',
    'Standings': '排名',
    'Printable standings': '可打印排名',
    'Record': '战绩',
    'Record · win rate': '战绩 · 胜率',
    'Match Record': '对局记录',
    'Match points': '比赛积分',
    'Score': '比分',
    'Scores': '比分',
    'Points': '积分',
    'Rank': '排名',
    'Place': '名次',
    'First Place': '第一名',
    'Second Place': '第二名',
    'Third Place': '第三名',
    'Top cut': '淘汰赛',
    'Top-cut clock': '淘汰赛计时',
    'Top-cut matches': '淘汰赛对局',
    'Single elimination': '单败淘汰',
    'Seeding': '种子排位',
    'Check in': '签到',
    'Check-in': '签到',
    'Check-in is open.': '签到已开始。',
    'Open check-in now': '现在开始签到',
    'Checked in': '已签到',
    'checked in for this round': '已为本轮签到',
    'Not checked in': '未签到',
    'The check-in clock is stopped': '签到计时已停止',
    'The check-in clock is stopped.': '签到计时已停止。',
    'Registration': '报名',
    'Registrations': '报名',
    'Register': '报名',
    'Signed up': '已报名',
    'Sign-ups open': '报名开放',
    'Sign-ups close when full': '报满即止',
    'You are registered.': '你已报名。',
    'Nobody has signed up yet.': '还没有人报名。',
    'Open for sign-ups': '开放报名',
    'Open registration': '打开报名',
    'Tournament registration is closed.': '比赛报名已关闭。',
    'Expected players': '预计人数',
    'Entry code': '入场码',
    'Enter code': '输入入场码',
    'Code or invite link': '代码或邀请链接',
    'Who can enter': '谁可以参加',
    'Everyone': '所有人',
    'Only people with the invite link': '仅持邀请链接者',
    'Invite': '邀请',
    'Invite link': '邀请链接',
    'Ask the host for a new invite link when they open the next one.': '等房主开下一桌时，向他要新的邀请链接。',
    'Prizes': '奖品',
    'Description, rules, prizes': '说明、规则、奖品',
    'House rules': '自定规则',
    'Rules': '规则',
    'Notice': '公告',
    'Post a notice': '发布公告',
    'Post notice': '发布公告',
    'Notices': '公告',
    'No notices yet.': '还没有公告。',
    'Drop from event': '退出赛事',
    'You left this event. You can join again while sign-ups are open.': '你已退出该赛事，报名开放期间可以重新加入。',
    'Late entry': '中途加入',
    'Late entry until': '中途加入截止',
    'Missed rounds count as losses': '缺席的轮次计为负',
    'Decklists are final at the start.': '牌表在开始时即锁定。',
    'You can change your deck until the event starts.': '赛事开始前可以更换套牌。',
    'This event is under way, so its settings can no longer be edited.': '赛事已开始，设置无法再修改。',
    'This event has not finished. These are the standings so far.': '赛事尚未结束，以下是当前排名。',
    'Running the rounds': '正在推进轮次',
    'Round to show': '显示第几轮',
    'Round robin': '循环赛',
    'The tournament list could not be read.': '比赛列表读取失败。',
    'Tournament results couldn\'t be read just now.': '暂时无法读取比赛成绩。',
    'The event could not be read.': '赛事读取失败。',
    'Finished events could not be read.': '已结束赛事读取失败。',
    'Nothing is waiting on staff.': '没有需要工作人员处理的事项。',
    'Message the event': '给赛事发消息'
  });
  /* ---------- 5. 战绩 / 评分 / 环境 / 统计 ---------- */

  Object.assign(DICT, {
    // ——— 战绩
    'Match': '对局',
    'Matches': '对局',
    'matches': '对局',
    'Match history': '对局记录',
    'Match details': '对局详情',
    'Match evidence': '对局证据',
    'Match recording': '对局录像',
    'Match share': '对局分享',
    'Match win': '对局胜',
    'Match win rate': '对局胜率',
    'Matchups': '对位',
    'Loading match…': '正在加载对局…',
    'Loading matches…': '正在加载对局…',
    'No match': '无对局',
    'No matches': '没有对局',
    'No matches yet. Your results appear here once the first one ends.':
      '还没有对局。第一场结束后结果会出现在这里。',
    'Recent matches': '最近对局',
    'Your recent matches couldn\'t be read just now.': '暂时无法读取你最近的对局。',
    'Unfinished': '未完成',
    'Unfinished records': '未完成的记录',
    'Completed records': '已完成的记录',
    'Recorded': '已记录',
    'Not recorded': '未记录',
    'Not rated yet': '尚未计分',
    'Duration': '时长',
    'Ended': '已结束',
    'Started': '已开始',
    'Winner': '胜者',
    'Result': '结果',
    'Opponent': '对手',
    'Opponents': '对手',
    'Against you': '对你',
    'Head-to-head win rate, row archetype against column archetype': '直接对位胜率，行原型对列原型',
    'Played': '已进行',
    'Played recently': '最近玩过',
    'Not played': '未进行',
    'Empty.': '空。',
    'Empty pile': '空牌堆',
    'Replay': '回放',
    'Replays': '回放',
    'Watch replay': '观看回放',
    'Download replay file': '下载回放文件',
    'Open a replay file': '打开回放文件',
    'Replay not found': '未找到回放',
    'Replay shortcuts': '回放快捷键',
    'Retry recording': '重试录制',
    'Refresh recording': '刷新录像',
    'Report recording': '举报录像',
    'Stop recording': '停止录制',
    'Recording': '录制中',
    'This replay can\'t be opened': '该回放无法打开',
    'This replay has nothing to show': '该回放没有内容',
    'This replay is too large to open': '该回放过大，无法打开',
    'This replay file is damaged and can\'t be opened.': '该回放文件已损坏，无法打开。',
    'This replay needs a newer version of Endstep': '该回放需要更新版本的 Endstep',
    'Replays aren\'t available yet.': '回放尚不可用。',
    'Replays couldn\'t be loaded.': '回放加载失败。',
    'Your replays couldn\'t be read just now.': '暂时无法读取你的回放。',
    'No replays yet. Your next game is recorded here.': '还没有回放。你的下一场对局会录制在这里。',
    'Loading your replays…': '正在加载你的回放…',

    // ——— 评分与天梯
    'Rating': '评分',
    'rating': '评分',
    'Raw rating': '原始评分',
    'Player rating': '玩家评分',
    'Rated': '计分',
    'Rated matches': '计分对局',
    'Unrated': '不计分',
    'Ranked': '排位',
    'Unranked': '非排位',
    'Casual': '休闲',
    'Ranked matches': '排位对局',
    'Ranked record': '排位战绩',
    'Ranked score': '排位积分',
    'Play ranked': '进行排位对局',
    'Stay ranked': '保持排位',
    'Narrower': '更窄',
    'Wider': '更宽',
    'Season': '赛季',
    'Next season': '下赛季',
    'Ranked ladders': '排位天梯',
    'Configure ladders': '配置天梯',
    'See the ladders': '查看天梯',
    'Provisional': '暂定',
    'Your standing': '你的名次',
    'Your standing': '你的名次',
    'Go to rank': '前往段位',
    'Win streak': '连胜',
    'Peak': '最高',
    'Current': '当前',
    'Tier': '段位',
    'Tiers': '段位',
    'Ladder': '天梯',
    'Ladder pages': '天梯页面',
    'Limit ratings': '评分上限',
    'Minimum rating': '最低评分',
    'Minimum rated matches': '最少计分对局',
    'Minimum finished matches': '最少完成对局',
    'Your rating, held back a little until enough rated matches back it up. Playing firms it up; time away eases it down a little.':
      '你的评分会先被稍微压低，直到有足够的计分对局支撑。多打会稳固它，久不玩会略微下滑。',
    'Goes up when you win and down when you lose, by more while you are new. You get a rank once it has settled, which takes a few rated matches.':
      '赢了上升、输了下降，新账号的波动更大。评分稳定后才会显示段位，通常需要几场计分对局。',
    'Ties break on OMW% (your opponents\' match-win rate, not your own), then GW%, then OGW%; each opponent counts as at least 33%, and a bye is not an opponent.':
      '同分时依次比较 OMW%（对手的对局胜率，不是你自己的）、GW%、OGW%；每个对手至少按 33% 计，轮空不算对手。',
    'How ranking works': '排名规则',
    'No rated matches on any ladder.': '任何天梯上都没有计分对局。',
    'No ranked ladders are open right now. When a season starts, its formats appear here.':
      '当前没有开放的排位天梯。赛季开始后，对应赛制会出现在这里。',
    'No ranked season is open.': '当前没有开放的排位赛季。',
    'Ranked could not be read.': '排位信息读取失败。',
    'The ladder couldn\'t be read.': '天梯读取失败。',
    'The ladders couldn\'t be read.': '天梯读取失败。',
    'Loading the ladders': '正在加载天梯',
    'Loading the ladder…': '正在加载天梯…',

    // ——— 环境 / 原型
    'Archetype': '原型',
    'Archetypes': '原型',
    'Archetype name': '原型名称',
    'Find an archetype': '查找原型',
    'Search archetypes': '搜索原型',
    'Name archetypes': '命名原型',
    'Retire archetypes': '退役原型',
    'No archetype matches.': '没有匹配的原型。',
    'No archetypes in this run to compare.': '本次统计没有可比较的原型。',
    'Meta': '环境',
    'Metagame': '环境',
    'Meta share': '环境占比',
    'Meta share over time': '环境占比走势',
    'Field share': '占比',
    'Play rate': '使用率',
    'Avg copies': '平均份数',
    'Average copies': '平均份数',
    'Deck': '套牌',
    'Sample list': '示例牌表',
    'Representative list': '代表性牌表',
    'The list': '牌表',
    'Distinct lists': '不同牌表',
    'Statistics': '统计',
    'Statistics rebuild': '重建统计',
    'Statistics rebuild failed': '统计重建失败',
    'Win rate': '胜率',
    'GW%': '游戏胜率',
    'OGW%': '对手游戏胜率',
    'OMW%': '对手对局胜率',
    'Avg OMW%': '平均对手对局胜率',
    'Population': '样本',
    'Whole field': '全场',
    'Loading the numbers': '正在加载数据',
    'Loading the graph': '正在加载图表',
    'No format has a metagame yet. Decks appear here once they have been played in finished matches.':
      '还没有任何赛制有环境数据。套牌在已结束的对局中被使用后才会出现在这里。',
    'The metagame could not be loaded.': '环境数据加载失败。',

    // ——— 个人资料
    'Full profile': '完整资料',
    'View full profile': '查看完整资料',
    'Read only profile': '只读资料',
    'Account': '账号',
    'Last seen': '最后在线',
    'Joined': '加入于',
    'Since': '自',
    'Activity': '活跃度',
    'Activity log': '活动记录',
    'Visits': '访问',
    'Recent connection': '最近连接',
    'Badges': '徽章',
    'Badge': '徽章',
    'Your badges couldn\'t be read just now.': '暂时无法读取你的徽章。',
    'No badge types match.': '没有匹配的徽章类型。',
    'Nothing suggested yet.': '暂无推荐。',
    'Your role': '你的身份',
    'Your rights': '你的权利'
  });
  /* ---------- 6. 表单 / 设置 / 状态 / 错误提示 ---------- */

  Object.assign(DICT, {
    // ——— 表单
    'Required': '必填',
    'Optional': '可选',
    'optional': '可选',
    'Description': '说明',
    'Detail': '详情',
    'Details': '详情',
    'Title': '标题',
    'Subtitle': '副标题',
    'Label': '标签',
    'Buttons': '按钮',
    'Button label': '按钮文字',
    'Button link': '按钮链接',
    'Action': '操作',
    'Actions': '操作',
    'Add': '添加',
    'Added': '已添加',
    'Choose': '选择',
    'Choose file': '选择文件',
    'Choose a date': '选择日期',
    'Choose a person': '选择玩家',
    'Choose a player': '选择玩家',
    'Choose a role': '选择身份',
    'Choose a table': '选择牌桌',
    'Choose a badge': '选择徽章',
    'Choose a kind': '选择类别',
    'Choose a rarity': '选择稀有度',
    'Choose a glyph': '选择符号',
    'Change': '更改',
    'Continue': '继续',
    'Submit': '提交',
    'Send': '发送',
    'Send report': '发送举报',
    'Post': '发布',
    'Reply': '回复',
    'Answer…': '回复…',
    'Notes': '备注',
    'Note': '备注',
    'Reason': '原因',
    'Message': '消息',
    'From': '来自',
    'To': '发送给',
    'By': '由',
    'When': '时间',
    'Where': '地点',
    'What': '内容',
    'Who': '操作人',
    'Date': '日期',
    'Time': '时间',
    'Times': '次数',
    'Length': '长度',
    'Unit': '单位',
    'Amount': '数值',
    'Mode': '模式',
    'Type': '类别',
    'Status': '状态',
    'State': '状态',
    'Kind': '类别',
    'Scope': '范围',
    'Source': '来源',
    'Target': '目标',
    'Value': '值',
    'Version': '版本',
    'Visibility': '可见性',
    'Public': '公开',
    'Private': '私密',
    'Hidden': '隐藏',
    'Unlisted': '不公开列出',
    'Everyone': '所有人',
    'Anyone': '任何人',
    'Any time': '任意时间',
    'Never': '从不',
    'Always': '始终',
    'None': '无',
    'None.': '无。',
    'Nothing': '无',
    'All': '全部',
    'Other': '其他',
    'Custom': '自定义',
    'Default': '默认',
    'Automatic': '自动',
    'Manual': '手动',
    'Random': '随机',
    'Unlimited': '不限',
    'No cap': '不设上限',
    'No maximum': '不设上限',
    'Minimum': '最小值',
    'Maximum': '最大值',
    'Exact': '精确',

    // ——— 状态
    'Active': '启用',
    'Inactive': '停用',
    'Enabled': '已启用',
    'Disabled': '已禁用',
    'Open': '开放',
    'Closed': '已关闭',
    'New': '新建',
    'Live': '进行中',
    'Ready': '就绪',
    'Loading': '加载中',
    'Pending': '待处理',
    'In progress': '进行中',
    'Resolved': '已解决',
    'Unresolved': '未解决',
    'Completed': '已完成',
    'Complete': '完成',
    'Finished': '已结束',
    'Cancelled': '已取消',
    'Archived': '已归档',
    'Published': '已发布',
    'Scheduled': '已排期',
    'Expired': '已过期',
    'Failed': '失败',
    'Success': '成功',
    'Error': '错误',
    'Warning': '警告',
    'Info': '提示',
    'Retired': '已退役',
    'Reported': '已举报',
    'Flagged': '已标记',
    'Verified': '已验证',
    'Confirmed': '已确认',
    'Requested': '已请求',
    'Saved': '已保存',
    'Sent': '已发送',
    'Updated': '已更新',
    'Changed': '已更改',
    'Deleted': '已删除',
    'Removed': '已移除',
    'available': '可用',
    'unavailable': '不可用',
    'Unavailable': '不可用',
    'Not available': '不可用',
    'now': '现在',
    'Now': '现在',
    'Today': '今天',
    'Yesterday': '昨天',
    'Earlier': '更早',
    'Later': '稍后',
    'Soon': '即将',
    'Starting soon': '即将开始',
    'Upcoming': '即将开始',
    'Past': '过去',
    'All time': '全部时间',

    // ——— 设置
    'Preferences': '偏好设置',
    'Appearance': '外观',
    'Theme': '主题',
    'Light': '浅色',
    'Dark': '深色',
    'System': '跟随系统',
    'Notifications': '通知',
    'Alerts': '提醒',
    'Get notified': '获取通知',
    'Keyboard shortcuts': '键盘快捷键',
    'Shortcuts': '快捷键',
    'Language': '语言',
    'About': '关于',
    'Version': '版本',
    'Help': '帮助',
    'Support': '支持',
    'Contact': '联系',
    'Credits': '鸣谢',
    'Licence': '许可',
    'Licences': '许可',
    'every credit and licence': '全部鸣谢与许可',
    'Terms': '条款',
    'Sign out': '退出登录',
    'Delete account': '注销账号',
    'Blocked players': '已屏蔽的玩家',
    'Muted': '已禁言',
    'You haven\'t blocked anyone.': '你还没有屏蔽任何人。',
    'No one is kept apart.': '没有玩家被分开。',

    // ——— 空状态与提示
    'No results': '没有结果',
    'No results.': '没有结果。',
    'Nothing here': '这里什么都没有',
    'Nothing here.': '这里什么都没有。',
    'None yet': '还没有',
    'None yet.': '还没有。',
    'Nothing yet.': '还没有。',
    'Not yet': '尚未',
    'Not open yet': '尚未开放',
    'Coming soon': '即将推出',
    'There is nothing to show.': '没有可显示的内容。',
    'Nothing to preview.': '没有可预览的内容。',
    'Nothing was played in the previous window, so there is nothing to compare with.':
      '上一个时间窗内没有对局，因此无可比较。',
    'Not enough data': '数据不足',
    'Your connection dropped': '你的连接已断开',
    'Network error': '网络错误',
    'Something went wrong': '出了点问题',
    'Something went wrong.': '出了点问题。',
    'Unexpected error': '意外错误',
    'Page unavailable': '页面不可用',
    'This page is unavailable.': '该页面不可用。',
    'This is taking longer than it should.': '这比预期要慢。',
    'Check your connection and try again.': '检查网络后重试。',
    'Search unavailable — check your connection and try again.':
      '搜索不可用——请检查网络后重试。',
    'The search could not be read. Try again in a moment.': '搜索读取失败，请稍后再试。',
    'The search failed. Try again.': '搜索失败，请重试。',
    'Message not sent. Try again.': '消息未发送，请重试。',
    'This is taking longer than it should. Try again in a moment.': '这比预期要慢，请稍后再试。',
    'Try disabling shields for endstep.cc, or a different browser or network.':
      '试着为 endstep.cc 关闭屏蔽插件，或换一个浏览器 / 网络。',
    'Can\'t reach the live game connection. A browser extension, ad-blocker, or network proxy may be blocking WebSockets — or the server may be briefly unavailable.':
      '无法连接实时对局通道。可能是浏览器扩展、广告拦截器或网络代理拦截了 WebSocket——也可能是服务器短暂不可用。',
    'Connection interrupted — reconnecting… your seat is held for the grace period.':
      '连接中断——正在重连…你的座位会在宽限期内保留。',
    'Server updating — reconnecting shortly…': '服务器更新中——稍后重连…',
    'Too many Endstep tabs are connected. Close another tab to make room. This tab will retry automatically.':
      '连接的 Endstep 标签页过多。关闭一个标签页腾出位置，本标签页会自动重试。',
    'Could not load live counters. Retrying automatically.': '无法加载实时计数，正在自动重试。',
    'Could not load your account. Reload the page to try again.': '无法加载你的账号，请刷新页面重试。',
    'Could not load your account. Close Settings and open it again to try again.':
      '无法加载你的账号，请关闭设置后重新打开。',
    'Players are unavailable. Refresh to retry.': '玩家信息不可用，刷新后重试。',
    'Profile unavailable.': '资料不可用。',
    'That archetype could not be read.': '该原型读取失败。',
    'This profile couldn\'t be read just now.': '暂时无法读取该资料。',
    'Your friends list could not be read.': '好友列表读取失败。',
    'No conversations yet.': '还没有会话。',
    'No people found.': '没有找到玩家。',
    'No such player': '没有该玩家',
    'Nobody matches.': '没有匹配的人。',
    'Nothing of yours matches.': '没有你的内容匹配。',
    'Nothing of yours is in progress.': '你没有进行中的内容。',
    'Nothing is sent.': '不会发送任何内容。',
    'Save': '保存',
    'Discard changes': '放弃修改',
    'Discard unsaved changes?': '放弃未保存的修改？',
    'Unsaved changes.': '有未保存的修改。',
    'Keep editing': '继续编辑',
    'This cannot be undone.': '此操作不可撤销。',
    'This can\'t be undone.': '此操作不可撤销。',
    'Something went wrong linking that account. Try again.': '绑定该账号时出错，请重试。',
    'That link attempt expired. Try again.': '该链接已过期，请重试。'
  });
  /* ---------- 9. 补遗：短标签 / 提示 / 记录类文案 ---------- */

  Object.assign(DICT, {
    // ——— 开关与状态词
    'On': '开',
    'Off': '关',
    'Esc': 'Esc',
    'T': 'T',
    'F': 'F',
    'D': 'D',
    'Z': 'Z',
    'AI': 'AI',
    'vs': '对',
    'vs Bot': '对 AI',
    'vs AI': '对 AI',
    'min': '分钟',
    'min each': '每人分钟',
    'size': '尺寸',
    'type': '类别',
    'live': '进行中',
    'stale': '已过期',
    'ghost': '幽灵',
    'global': '全局',
    'rejected': '已拒绝',
    'transient': '临时',
    'fulfilled': '已满足',
    'none': '无',
    'refreshed': '已刷新',
    's': '秒',
    'Paused': '已暂停',
    'Running': '进行中',
    'Finding': '查找中',
    'Building': '构建中',
    'Playing': '对局中',
    'Reading': '读取中',
    'Everything': '全部',
    'Expires': '到期',
    'Until': '至',
    'After': '之后',
    'Before': '之前',
    'Key': '键',
    'Group': '分组',
    'Clock': '计时',
    'Layout': '布局',
    'Preview': '预览',
    'Review': '复核',
    'Share': '分享',
    'Access': '访问权限',
    'Accounts': '账号',
    'Allowed': '允许',
    'Build': '构筑',
    'Chosen': '已选择',
    'Decisions': '决策',
    'Features': '功能',
    'Final turn': '最后一个回合',
    'Link': '链接',
    'People': '成员',
    'Product': '产品',
    'Role': '身份',
    'Roles': '身份',
    'Run': '运行',
    'Series': '系列赛',
    'Services': '服务',
    'Skip': '跳过',
    'Slug': '短名',
    'Stop': '停止',
    'Stakes': '赌注',
    'Tags': '标签',
    'Numbers': '数值',
    'Discord': 'Discord',
    'Patreon': 'Patreon',
    'Scryfall': 'Scryfall',
    'Forge': 'Forge',
    'Forge AI': 'Forge AI',
    'Forge profile': 'Forge 档案',
    'Game': '对局',
    'Games': '对局',
    'Games, play and draw, and texture': '对局、先手后手与节奏',
    'Gameplay': '玩法',
    'Game 2 after losing game 1': '输了第一盘后的第二盘',
    'Game 2 after winning game 1': '赢了第一盘后的第二盘',
    'Lists': '牌表',
    'In lists': '在牌表中',
    'All lists': '全部牌表',
    'All games': '全部对局',
    'all games': '全部对局',
    'All history': '全部记录',
    'All matches': '全部对局',
    'All cards': '全部牌张',
    'All types': '全部类别',
    'All updates': '全部更新',
    'All but drafts': '除轮抽外全部',
    'Anything goes': '百无禁忌',
    'Champion': '冠军',
    'Storm': '风暴',
    'Rings': '环形赛',
    'Overview': '总览',
    'Pilots': '操作者',
    'Jobs': '任务',
    'Incidents': '事件记录',
    'Cases': '案件',
    'Case': '案件',
    'Texture': '质感',
    'Variant': '变体',
    'Window': '时间窗',
    'Age': '时长',
    'Art': '画作',
    'Artist': '画师',
    'Print': '打印',
    'Publish': '发布',
    'Read': '读取',
    'Recent jobs': '最近任务',
    'Recent runs': '最近运行',
    'Reload latest': '重新载入最新',
    'Remove from table': '从牌桌移除',
    'Retire': '退役',
    'Run the event': '主持赛事',
    'To be decided': '待定',
    'Withdraw': '撤回',
    'Your result': '你的成绩',
    'Your game': '你的对局',
    'Opponent found': '已找到对手',
    'Choose your deck': '选择你的套牌',
    'Choose the shared deck': '选择共享牌库',
    'Coin flip': '掷硬币',
    'Continuous construction': '持续构筑',
    'Same as the rounds': '与轮次相同',
    'Seat grace': '留座宽限期',
    'Server timing': '服务器耗时',
    'Shrunk': '已收缩',
    'Placement status': '排位状态',
    'Planned end': '预定结束',
    'Open runs': '进行中的运行',
    'Override capacity': '覆盖人数上限',
    'Card cache': '牌张缓存',
    'Card suggestions': '牌张推荐',
    'Case tags': '案件标签',
    'Chat / Actions': '聊天 / 操作',
    'Chat mutes': '聊天禁言',
    'Cheats': '作弊项',
    'Sandbox cheats': '沙盒作弊项',
    'Dismiss': '忽略',
    'Decision': '决策',
    'Awaiting rating': '等待评分',
    'Awaiting opponent…': '等待对手…',
    'No deck': '无套牌',
    'No cut': '不切分',
    'No duels': '无对局',
    'No updates yet.': '还没有更新。',
    'Nothing decided': '暂无结论',
    'Names unavailable.': '名称不可用。',
    'Network restrictions': '网络限制',
    'Protected': '受保护',
    'Protected account': '受保护账号',
    'Public pages': '公开页面',
    'Public results pages': '公开战绩页面',
    'Who can find this table': '谁可以找到这张牌桌',
    'Who plays it': '谁来玩',
    'Who can enter': '谁可以参加',
    'Players see': '玩家可见',
    'Players told': '已通知玩家',
    'What happened': '发生了什么',
    'What it is for': '用途',
    'What changes for players': '对玩家的变化',
    'How long we keep it': '保留多久',
    'Legitimate interest.': '正当利益。',
    'Engine, card data and type': '规则引擎、牌张数据与类别',
    'Families and builds': '族系与构筑',
    'Find a badge': '查找徽章',
    'Find a capability': '查找权限',
    'Find a family or build': '查找族系或构筑',
    'Find a permission': '查找权限',
    'Find a person': '查找成员',
    'Find a player or a rank': '查找玩家或段位',
    'Find a tag': '查找标签',
    'Find card weight': '查找牌张权重',
    'First page': '第一页',
    'Last page': '最后一页',
    'Forfeit wins': '弃权判胜',
    'Forgive matchmaking incidents': '免除匹配违规',
    'Grant a badge': '授予徽章',
    'Grant badges': '授予徽章',
    'Granted': '已授予',
    'Held out of the pod queue': '被挡在多人局队列外',
    'Import format proposals': '导入赛制提案',
    'Inspect private metagame members': '查看私有环境成员',
    'Intentional draws': '协议和局',
    'Issue matchmaking timeouts': '施加匹配超时',
    'Keep apart': '分开',
    'Keep current': '保持当前',
    'Leave the waitlist': '退出候补',
    'Lift account bans': '解除账号封禁',
    'Lift chat mute…': '解除聊天禁言…',
    'Lift connection restriction': '解除连接限制',
    'Loading cases…': '正在加载案件…',
    'Loading profile…': '正在加载资料…',
    'Loading restrictions…': '正在加载限制…',
    'Loading tags…': '正在加载标签…',
    'Loading formats…': '正在加载赛制…',
    'Make a new code': '生成新代码',
    'Manage case tags': '管理案件标签',
    'Manage repeat-abuse bans': '管理重复滥用封禁',
    'Move to…': '移动到…',
    'Mute player chat': '禁言玩家聊天',
    'Named by': '命名者',
    'New folder': '新建文件夹',
    'New post': '新帖子',
    'New product': '新产品',
    'Move up': '上移',
    'Move down': '下移',
    'Move to first': '移到最前',
    'Remove the bot': '移除 AI',
    'Resolve all…': '全部处理…',
    'Retry game details': '重试对局详情',
    'Revocation reason': '撤销原因',
    'Revoke badges': '撤销徽章',
    'Revoked': '已撤销',
    'Run derivations': '运行推导',
    'Run rollups': '运行汇总',
    'Sample actions': '示例操作',
    'Search emoji': '搜索表情',
    'Search updates': '搜索更新',
    'Search your decks': '搜索你的套牌',
    'Start card sync': '开始同步牌张',
    'Start management': '开始管理',
    'Step down': '卸任',
    'Stop looking': '停止寻找',
    'Tag cases': '标记案件',
    'Throne empty': '王座空缺',
    'Unpin': '取消固定',
    'Use default art': '使用默认画作',
    'Use draft tournament override': '使用轮抽比赛覆盖设置',
    'View and sort': '查看与排序',
    'Void matches': '作废对局',
    'Warn players': '警告玩家',
    'Add a bot': '添加 AI',
    'Add allowance': '添加额度',
    'Add image': '添加图片',
    'Add permission': '添加权限',
    'Add role': '添加身份',
    'Add to tracker': '加入追踪',
    'Add screenshots': '添加截图',
    'Add details for the moderators': '为版务补充细节',
    'Additional eligible cards': '其他可用牌',
    'Adjust framing': '调整取景',
    'Admin sections': '管理分区',
    'Advance to the next phase (F)': '进入下一阶段（F）',
    'Advanced format settings': '高级赛制设置',
    'After deck building': '构筑之后',
    'After my review': '我复核之后',
    'Aggressive; attacks often': '激进；频繁攻击',
    'Agreement': '同意',
    'Allowance name': '额度名称',
    'Allowances': '额度',
    'Allowed rarities': '允许的稀有度',
    'Allowed set codes': '允许的系列代码',
    'Alpha strike': '全体进攻',
    'Alpha Strike': '全体进攻',
    'Alpha at target…': '对一个目标全体进攻…',
    'Already chosen': '已选择',
    'Always No': '始终为否',
    'Always Yes': '始终为是',
    'An aura/equipment attaches': '灵气/武具贴附',
    'An outline mark; the default': '轮廓标记；默认样式',
    'An unclaimed seat is a match loss.': '无人认领的座位视为对局判负。',
    'Announcement': '公告',
    'Announcement actions': '公告操作',
    'Announcement history unavailable': '公告历史不可用',
    'Announcement history unavailable.': '公告历史不可用。',
    'Another card': '另一张牌',
    'Another card…': '另一张牌…',
    'Answered': '已回应',
    'Any': '任意',
    'Apply correction': '应用更正',
    'Archetype cut': '原型切分',
    'Archetype id': '原型 ID',
    'Archetypes retired here': '此处退役的原型',
    'As shipped': '出厂默认',
    'Ask…': '询问…',
    'At the table, in lists, in chat.': '牌桌上、牌表里、聊天中。',
    'Auto Pay': '自动支付',
    'Auto-pilot': '自动驾驶',
    'Average game': '平均对局',
    'Average game length': '平均对局时长',
    'Average mulligans': '平均调度次数',
    'Average turns': '平均回合数',
    'Badge grants': '徽章授予',
    'Badge types': '徽章类型',
    'Balanced': '均衡',
    'Balanced play': '均衡打法',
    'Archive…': '归档…',
    'Archived': '已归档',
    'Back to case': '返回案件',
    'Ban': '封禁',
    'Ban accounts': '封禁账号',
    'Beside your name': '在你名字旁',
    'Build a fresh candidate': '构建新的候选版本',
    'Bypass report limit': '绕过举报上限',
    'Cancel event': '取消赛事',
    'Capabilities': '权限项',
    'Change art': '更换画作',
    'Change report status': '修改举报状态',
    'Changes': '变更',
    'Chaos theme': '混沌主题',
    'Compensate matches': '补偿对局',
    'Create badge types': '创建徽章类型',
    'Create ranked seasons': '创建排位赛季',
    'Create similar': '创建相似项',
    'Edit archetype art': '编辑原型画作',
    'Edit badge types': '编辑徽章类型',
    'Edit format drafts': '编辑赛制稿',
    'Edit metagame grouping': '编辑环境分组',
    'Edit report notes': '编辑举报备注',
    'Estimated · older recording': '估算 · 较早的录像',
    'Forfeit wins': '弃权判胜',
    'Go to your match': '前往你的对局',
    'Loading status…': '正在加载状态…',
    'Not found': '未找到',
    'Not found.': '未找到。',
    'Only host begins': '仅房主可开始',
    'Open runs': '进行中的运行',
    'Posted': '已发布',
    'Preview metagame': '预览环境',
    'Preview macros': '预览宏',
    'Privately spectate games': '私密观战',
    'Reason for change': '变更原因',
    'Reason shown to player': '向玩家展示的原因',
    'Reason (the player reads this)': '原因（玩家会读到）',
    'Reason (recorded against the correction)': '原因（与更正一同记录）',
    'Recorded unrated': '已记录为不计分',
    'Recorded in Access history.': '已记入访问历史。',
    'Release macros': '发布宏',
    'Release metagame': '发布环境',
    'Resolve…': '处理…',
    'Same as the rounds': '与轮次相同',
    'Start management': '开始管理',
    'Status unavailable': '状态不可用',
    'Status unavailable.': '状态不可用。',
    'Unfinished.': '未完成。',
    'Action / end step': '行动 / 结束',
    'Text': '文本',
    'Image': '图片',
    'Images': '图片',
    'Video': '视频',
    'Media': '媒体',
    'Upload': '上传',
    'Download': '下载',
    'Select': '选择',
    'Selected': '已选择',
    'Selected:': '已选择：',
    'Choose a file': '选择文件',
    'Or drag a card here': '或把牌拖到这里',
    'or drag a card here': '或把牌拖到这里',
    'Drop a disconnected player': '移出断线的玩家',
    'Drop disconnected players': '移出断线的玩家',
    'Drop after no-shows': '缺席后移出',
    'Dropped at the start': '开始时已移出',
    "Don't message": '不要发消息',
    'Abuse': '滥用',
    'Abusive messages, offensive names': '辱骂消息、冒犯性名称',
    'Cheating & collusion': '作弊与串通',
    'Stalling': '拖延',
    'Lag & crashes': '卡顿与崩溃',
    'Other conduct': '其他行为',
    'Bug': '程序错误',
    'Bugs': '程序错误',
    'Evidence': '证据',
    'Warnings don\'t restrict play. Repeated conduct can lead to a matchmaking timeout or a ban.':
      '警告本身不限制游玩，但反复违规可能导致匹配超时或封禁。',
    'A warning restricts nothing. The player must acknowledge it.': '警告不构成限制，但玩家必须确认阅读。',
    'Acknowledged': '已确认',
    'Bans are permanent until lifted by hand. There is no Undo for a void: the ladder is corrected in the same step.':
      '封禁是永久的，直到手动解除。作废没有撤销：天梯会在同一步中被更正。',
    'This does not ban the associated accounts. Account bans are managed separately.':
      '这不会封禁相关账号，账号封禁需单独处理。',

    // ——— 未登录首页 / 页脚
    'Skip to main content': '跳到主要内容',
    'Sign in with Discord': '使用 Discord 登录',
    'Play as a guest': '以访客身份游玩',
    'New here?': '首次使用？',
    'Create an account': '创建账号',
    'Draft a cube, build a deck, play a pod. A full rules engine runs every match, and there is nothing to install.':
      '轮抽Cube、构筑套牌、开一桌多人局。每场对局都由完整规则引擎运行，无需安装任何东西。',
    'Draft a cube, build a deck, play a pod. A full rules engine runs every match: the stack, triggers, priority. Nothing to install, and matches start in seconds. Plus formats you won\'t find elsewhere: Winston, Richman, Momir Basic, Forgetful Fish.':
      '轮抽Cube、构筑套牌、开一桌多人局。每场对局都由完整规则引擎运行：堆叠、触发、优先权。无需安装，几秒即可开局。还有别处玩不到的赛制：温斯顿、里奇曼、莫米尔基础、健忘鱼。',
    'By continuing, you agree to the': '继续即表示你同意',
    ', confirm you are 13 or older (16 in the EU, UK and Switzerland), and acknowledge the':
      '，并确认你已年满 13 岁（欧盟、英国与瑞士为 16 岁），且已知悉',
    'Endstep is unofficial Fan Content permitted under the': 'Endstep 为依据',
    '. Not approved, endorsed, or affiliated with Wizards. Magic: The Gathering and all related properties are © Wizards of the Coast LLC.':
      '发布的非官方粉丝内容。未经 Wizards 认可、背书或关联。Magic: The Gathering 及相关所有内容版权归 Wizards of the Coast LLC 所有。',
    'Rules engine by': '规则引擎：',
    'Card data and images from': '牌张数据与图像：',
    'Symbols, badge art, sounds and fonts:': '符号、徽章美术、音效与字体：',
    'Install': '安装',
    'Install Endstep': '安装 Endstep',
    'Ranked Draft': '排位轮抽',
    'Casual play': '休闲对局',
    'Rated play': '计分对局',
    'Play ranked': '进行排位对局',
    'See rated play': '查看计分对局',
    'Draft a cube, build a deck, play a pod.': '轮抽Cube、构筑套牌、开一桌多人局。'
  });
  /* ---------- 10. 收尾补漏 ---------- */

  Object.assign(DICT, {
    'Privacy': '隐私',
    'Wizards of the Coast Fan Content Policy': '《Wizards of the Coast 粉丝内容政策》',
    'Magic: The Gathering': '万智牌',
    'What is Endstep?': 'Endstep 是什么？',
    'Allow': '允许',
    'Experimental': '实验性',
    'With vs without': '有与无的对比',
    'Allow pop-ups': '允许弹窗',
    'Allow macros at pods?': '允许多人桌使用宏？',
    'ENDSTEP': 'ENDSTEP',
    'A card is exiled': '一张牌被放逐',
    'A game begins': '对局开始',
    'A land enters the battlefield': '一张地进入战场',
    'A spell goes on the stack': '有咒语进入堆叠',
    'A token enters (mass collapses)': '衍生物进场（大量时合并）',
    'A status update': '状态更新',
    'An aura/equipment attaches': '灵气/武具贴附',
    'Activate ability': '起动异能',
    'Cards drawn': '抓牌',
    'Card drawn': '抓一张牌',
    'Draw a card.': '你从牌库抓一张牌。',
    'Draw cards': '抓牌',
    'Draw 0-0-1': '平局 0-0-1',
    'Intentional draw 0-0-3': '协议平局 0-0-3',
    'Record the draw': '记录这场平局',
    'Game start': '开局',
    'Game number': '盘数',
    'Change game': '更换对局',
    'Game details are unavailable.': '对局详情不可用。',
    'Match details unavailable.': '对局详情不可用。',
    'The match is still being recorded. Player views become available after it ends.':
      '对局仍在录制中，结束后才能查看玩家视角。',
    'Loading game details…': '正在加载对局详情…',
    'Retry game details': '重试对局详情',
    'Your seat keeps its place': '你的座位会保留',
    'Drop a disconnected player': '移出断线的玩家',
    'Grace period': '宽限期',
    'Reconnect': '重新连接',
    'Reconnecting': '重新连接中',
    'You were disconnected': '你已断线',
    'You left this game': '你已离开这局',
    'Return to the game': '返回对局',
    'Leave this game?': '离开这局？',
    'Practice': '练习',
    'Solo practice against the AI.': '与 AI 单人练习。',
    'Play vs bot': '与 AI 对战',
    'The bot plays it': '由 AI 来玩',
    'The AI': 'AI',
    'Computer': '电脑',
    'the computer opponent': '电脑对手',
    ', the computer opponent': '，电脑对手',
    'Choose the AI\'s deck': '选择 AI 的套牌',
    'Choose the bots\' decks': '选择 AI 的套牌',
    'No deck, random creatures.': '不设套牌，随机生物。',
    'No deck: the engine deals one': '不设套牌：由规则引擎随机给出',
    'Failed to update bot seats': '更新 AI 座位失败',
    'Couldn\'t change the bot.': '无法更换 AI。'
  });
  /* ---------- 7. 动态文案规则（数字 / 复数 / 组合） ---------- */

  var RULES = [
    // 数字 + · + 文案（如 1724 · Provisional）
    [/^([0-9][0-9.,%]*K?) \u00b7 (.{1,40})$/, function (_, n, rest) {
      var t = lookup(rest) || applyRules(rest);
      return t ? n + ' \u00b7 ' + t : null;
    }],
    // 复合串：先按「 · 」切开，逐段翻译，全段命中才拼回去
    [/^(.{1,60}) \u00b7 (.{1,60})$/, function (_, a, b) {
      var ta = lookup(a) || applyRules(a);
      var tb = lookup(b) || applyRules(b);
      if (!ta || !tb) return null;
      return ta + ' \u00b7 ' + tb;
    }],
    // 局数 / 赛制
    [/^Best of (\d+)$/i, function (_, n) { return 'BO' + n + '（' + boName(+n) + '）'; }],
    [/^Bo(\d)$/i, function (_, n) { return 'BO' + n + '（' + boName(+n) + '）'; }],

    // 轮次与盘数
    [/^Round (\d+)$/i, function (_, n) { return '\u7b2c ' + n + ' \u8f6e'; }],
    [/^Round (\d+) of (\d+)$/i, function (_, n, m) { return '\u7b2c ' + n + ' / ' + m + ' \u8f6e'; }],
    [/^Game (\d+)$/i, function (_, n) { return '\u7b2c' + cnNum(n) + '\u76d8'; }],
    [/^Turn (\d+)$/i, function (_, n) { return '\u7b2c ' + n + ' \u56de\u5408'; }],
    [/^Table (\d+)$/i, function (_, n) { return n + ' \u53f7\u724c\u684c'; }],
    [/^Seat (\d+)$/i, function (_, n) { return n + ' \u53f7\u5ea7\u4f4d'; }],
    [/^Top (\d+)$/i, function (_, n) { return '\u524d ' + n + ' \u540d'; }],

    // 「N 张 / N 名 / N 盘」
    [/^(\d[\d,]*) (cards?)$/i, function (_, n) { return n + ' \u5f20\u724c'; }],
    [/^(\d[\d,]*) (players?)$/i, function (_, n) { return n + ' \u540d\u73a9\u5bb6'; }],
    [/^(\d[\d,]*) (games?)$/i, function (_, n) { return n + ' \u76d8'; }],
    [/^(\d[\d,]*) (turns?)$/i, function (_, n) { return n + ' \u56de\u5408'; }],
    [/^(\d[\d,]*) (decks?)$/i, function (_, n) { return n + ' \u5957\u724c'; }],
    [/^(\d[\d,]*) (lists?)$/i, function (_, n) { return n + ' \u4efd\u724c\u8868'; }],
    [/^(\d[\d,]*) (picks?)$/i, function (_, n) { return n + ' \u6b21\u9009\u724c'; }],
    [/^(\d[\d,]*) (packs?)$/i, function (_, n) { return n + ' \u5305'; }],
    [/^(\d[\d,]*) (cases?)$/i, function (_, n) { return n + ' \u4e2a\u6848\u4ef6'; }],

    // 时长
    [/^(\d+) (m|min|mins|minutes?)$/i, function (_, n) { return n + ' \u5206\u949f'; }],
    [/^(\d+) (h|hr|hours?)$/i, function (_, n) { return n + ' \u5c0f\u65f6'; }],
    [/^(\d+) h (\d+) min$/i, function (_, a, b) { return a + ' \u5c0f\u65f6 ' + b + ' \u5206'; }],
    [/^(\d+) (d|days?)$/i, function (_, n) { return n + ' \u5929'; }],
    [/^(\d+) min each$/i, function (_, n) { return '\u6bcf\u4eba ' + n + ' \u5206\u949f'; }],

    // 「N 天前」
    [/^(\d+) (sec|secs|seconds?) ago$/i, function (_, n) { return n + ' \u79d2\u524d'; }],
    [/^(\d+) (m|min|minutes?) ago$/i, function (_, n) { return n + ' \u5206\u949f\u524d'; }],
    [/^(\d+) (h|hours?) ago$/i, function (_, n) { return n + ' \u5c0f\u65f6\u524d'; }],
    [/^(\d+) days? ago$/i, function (_, n) { return n + ' \u5929\u524d'; }],
    [/^(\d+) (weeks?|w) ago$/i, function (_, n) { return n + ' \u5468\u524d'; }],
    [/^(\d+) mo ago$/i, function (_, n) { return n + ' \u4e2a\u6708\u524d'; }],
    [/^a month$/i, function () { return '\u4e00\u4e2a\u6708'; }],
    [/^(\d+) months?$/i, function (_, n) { return n + ' \u4e2a\u6708'; }],

    // 「N / M」
    [/^(\d+) of (\d+) (cards?|players?|games?|seats?)$/i, function (_, a, b, unit) {
      var u = /card/i.test(unit) ? '\u5f20\u724c' : (/player|seat/i.test(unit) ? '\u540d\u73a9\u5bb6' : '\u76d8');
      return b + ' ' + u + '\u4e2d\u7684 ' + a;
    }],
    [/^(\d+) of (\d+)$/i, function (_, a, b) { return a + ' / ' + b; }],

    // 剩余 / 计数
    [/^(\d+) left$/i, function (_, n) { return '\u8fd8\u5269 ' + n; }],
    [/^(\d+) left to pick$/i, function (_, n) { return '\u8fd8\u5269 ' + n + ' \u6b21\u9009\u724c'; }],
    [/^(\d+) left to register$/i, function (_, n) { return '\u8fd8\u5269 ' + n + ' \u540d\u672a\u62a5\u540d'; }],
    [/^(\d+) picks? from this pack$/i, function (_, n) { return '\u8fd9\u5305\u8fd8\u80fd\u9009 ' + n + ' \u5f20'; }],
    [/^(\d+) open seats$/i, function (_, n) { return n + ' \u4e2a\u7a7a\u5ea7'; }],
    [/^(\d+) more players$/i, function (_, n) { return '\u8fd8\u5dee ' + n + ' \u540d\u73a9\u5bb6'; }],
    [/^(\d+) of (\d+) seated$/i, function (_, a, b) { return a + ' / ' + b + ' \u5df2\u5165\u5ea7'; }],
    [/^(\d+) of (\d+) shown$/i, function (_, a, b) { return '\u5df2\u663e\u793a ' + a + ' / ' + b; }],
    [/^(\d+) of (\d+) finished$/i, function (_, a, b) { return a + ' / ' + b + ' \u5df2\u5b8c\u6210'; }],
    [/^(\d+) to (\d+) characters$/i, function (_, a, b) { return a + ' \u5230 ' + b + ' \u4e2a\u5b57\u7b26'; }],
    [/^(\d+) (KB|MB|GB)$/i, function (_, n, u) { return n + ' ' + u; }],
    [/^(\d+) px$/i, function (_, n) { return n + ' \u50cf\u7d20'; }],

    // 等待
    [/^Waiting for (.+)$/i, function (_, who) { return '\u7b49\u5f85' + tr(who); }],
    [/^Waiting for (.+) — (.+)$/i, function (_, who, rest) { return '\u7b49\u5f85' + tr(who) + '\u2014\u2014' + tr(rest); }],
    [/^Waiting for (.+) \((.+)\)$/i, function (_, who, rest) { return '\u7b49\u5f85' + tr(who) + '\uff08' + tr(rest) + '\uff09'; }],

    // 牌张 / 套牌信息
    [/^(\d+) cards? in (deck|hand)$/i, function (_, n, w) {
      return (/deck/i.test(w) ? '\u5957\u724c\u4e2d ' : '\u624b\u724c\u4e2d ') + n + ' \u5f20\u724c';
    }],
    [/^Mana value (\d+) or more$/i, function (_, n) { return '\u6cd5\u672f\u529b\u503c ' + n + ' \u53ca\u4ee5\u4e0a'; }],
    [/^Mana value (\d+)$/i, function (_, n) { return '\u6cd5\u672f\u529b\u503c ' + n; }],
    [/^Curve (\d+)$/i, function (_, n) { return '\u66f2\u7ebf ' + n; }],

    // 时间窗
    [/^The last (\d+) UTC days, today included\. The default\.$/i, function (_, n) {
      return '\u6700\u8fd1 ' + n + ' \u4e2a UTC \u65e5\uff08\u542b\u4eca\u5929\uff09\uff0c\u4e3a\u9ed8\u8ba4\u503c\u3002';
    }],
    [/^(\d+) days? live( \(.+\))?$/i, function (_, n, s) { return '\u4e0a\u7ebf ' + n + ' \u5929'; }],

    // 大厅筛选项 / 好友栏 / 环境页抬头
    [/^(\d+) formats?$/i, function (_, n) { return n + ' \u4e2a\u8d5b\u5236'; }],
    [/^(\d[\d,]*) matches?$/i, function (_, n) { return n + ' \u573a\u5bf9\u5c40'; }],
    [/^(\d[\d,]*) rounds?$/i, function (_, n) { return n + ' \u8f6e'; }],
    [/^(\d+) formats?, most played first$/i, function (_, n) { return n + ' \u4e2a\u8d5b\u5236\uff0c\u6309\u4f7f\u7528\u91cf\u6392\u5e8f'; }],
    [/^All (\d+) friends$/i, function (_, n) { return '\u5168\u90e8 ' + n + ' \u4f4d\u597d\u53cb'; }],
    [/^matching these settings in the last (\d+) hours?$/i, function (_, n) { return '\u7b26\u5408\u8fd9\u4e9b\u8bbe\u7f6e\uff08\u6700\u8fd1 ' + n + ' \u5c0f\u65f6\uff09'; }],
    [/^matching these settings$/i, function () { return '\u7b26\u5408\u8fd9\u4e9b\u8bbe\u7f6e'; }],
    [/^(\d+) free mulligans$/i, function (_, n) { return n + ' \u6b21\u514d\u8d39\u8c03\u5ea6'; }],
    [/^Begin with (.+)$/i, function (_, n) { return '\u4e0e ' + n + ' \u5f00\u59cb'; }],
    [/^Mirrors your deck \u00b7 choose another$/i, function () { return '\u955c\u50cf\u4f60\u7684\u5957\u724c \u00b7 \u53ef\u53e6\u9009'; }],
    [/^Keep this (\d+)-card hand, or mulligan\?$/i, function (_, n) { return '\u4fdd\u7559\u8fd9\u624b ' + n + ' \u5f20\u724c\uff0c\u8fd8\u662f\u8c03\u5ea6\uff1f'; }],
    [/^Keep (\d+)$/i, function (_, n) { return '\u4fdd\u7559 ' + n; }],
    [/^Mulligan to (\d+)$/i, function (_, n) { return '\u8c03\u5ea6\u81f3 ' + n + ' \u5f20'; }],
    [/^(\d+) mulligans? taken\. Keeping puts (\d+) cards? back - a (\d+)-card hand\.$/i, function (_, a, b, c) {
      return '\u5df2\u8c03\u5ea6 ' + a + ' \u6b21\u3002\u4fdd\u7559\u5c06\u653e\u56de ' + b + ' \u5f20\u724c\u2014\u2014\u8fd9\u624b\u724c\u4e3a ' + c + ' \u5f20\u3002';
    }],
    [/^(\d+) mulligans? taken\.$/i, function (_, a) { return '\u5df2\u8c03\u5ea6 ' + a + ' \u6b21\u3002'; }],
    [/^Keep or mulligan\?$/i, function () { return '\u4fdd\u7559\uff0c\u8fd8\u662f\u8c03\u5ea6\uff1f'; }],
    [/^You (won|lost) the last game(?:, (.+?))?\. Would you like to play or draw\?$/i, function (_, r, name) {
      return (/won/i.test(r) ? '你赢下了上一盘' : '你输掉了上一盘') + (name ? '，' + name : '') + '。你想先手还是后手？';
    }],
    [/^(Your|Opponent's) (first|second) main phase$/i, function (_, who, ord) {
      return (who.toLowerCase() === 'your' ? '你的' : '对手的') + (ord.toLowerCase() === 'first' ? '第一个' : '第二个') + '主要阶段';
    }],
    [/^(Your|Opponent's) (beginning|combat|ending) phase$/i, function (_, who, ph) {
      var m = { beginning: '开始阶段', combat: '战斗阶段', ending: '结束阶段' };
      return (who.toLowerCase() === 'your' ? '你的' : '对手的') + m[ph.toLowerCase()];
    }],
    [/^(Your|Opponent's) (untap|upkeep|draw|main 1|main 2|combat|begin combat|end combat|end step|cleanup)$/i, function (_, who, ph) {
      var map = { untap: '重置', upkeep: '维持', draw: '抓牌', 'main 1': '第一个主要阶段', 'main 2': '第二个主要阶段', combat: '战斗', 'begin combat': '战斗开始', 'end combat': '战斗结束', 'end step': '结束', cleanup: '清理' };
      return (who.toLowerCase() === 'your' ? '你的' : '对手的') + (map[ph.toLowerCase()] || ph);
    }],
    [/^You (?:have )?(won|lost) the coin toss, (.+?)\. Would you like to play or draw\?$/i, function (_, r, name) {
      return '\u4f60\u63b7\u786c\u5e01' + (/won/i.test(r) ? '\u8d62\u4e86' : '\u8f93\u4e86') + '\uff0c' + name + '\u3002\u4f60\u60f3\u5148\u624b\u8fd8\u662f\u540e\u624b\uff1f';
    }],
    [/^(Set|Remove) stop on (.+?) - (your turn|opponent's turn)$/i, function (_, act, ph, who) {
      var p = lookup(ph) || ph;
      var w = /^your/i.test(who) ? '\u4f60\u7684\u56de\u5408' : '\u5bf9\u624b\u7684\u56de\u5408';
      return (/^set$/i.test(act) ? '\u8bbe\u7f6e' : '\u53d6\u6d88') + '\u300c' + p + '\u300d\u505c\u6b62\u70b9\uff08' + w + '\uff09';
    }]
  ];

  /* ---------- 14. 句式规则：带名字/数字的提示句 ---------- */

  RULES.push(
    // ——— 对局内状态
    [/^(.+) has priority\.$/i, function (_, n) { return n + ' 拥有优先权。'; }],
    [/^(.+) is deciding\.$/i, function (_, n) { return n + ' 正在决策。'; }],
    [/^(.+) is typing…$/i, function (_, n) { return n + ' 正在输入…'; }],
    [/^(.+) is still connected\.$/i, function (_, n) { return n + ' 仍在线。'; }],
    [/^(.+) lost connection\. Waiting for them to reconnect\.$/i, function (_, n) { return n + ' 断线了，正在等待重连。'; }],
    [/^(.+) lost connection\. Their seat concedes if they do not return\.$/i, function (_, n) { return n + ' 断线了；若不回来，其席位将认输。'; }],
    [/^(.+) left the game before answering\.$/i, function (_, n) { return n + ' 未应答就离开了对局。'; }],
    [/^(.+) has closed the game\.$/i, function (_, n) { return n + ' 已关闭对局。'; }],
    [/^(.+) did not answer in time\.$/i, function (_, n) { return n + ' 未及时应答。'; }],
    [/^(.+) stepped away\. They forfeit if the timer ends\.$/i, function (_, n) { return n + ' 暂时离开，倒计时结束即弃权。'; }],
    [/^(.+) must act now or forfeit the match\.$/i, function (_, n) { return n + ' 必须现在行动，否则判负。'; }],
    [/^(.+) is muted for this match$/i, function (_, n) { return n + ' 在本场被禁言'; }],
    [/^(.+): (.+) has priority\.$/i, function (_, a, b) { return a + '：' + b + ' 拥有优先权。'; }],

    // ——— 轮抽与席位
    [/^(.+) left the draft\. A bot picks for their seat now\.$/i, function (_, n) {
      return n + ' 离开了轮抽，其席位现在由 AI 代抽。';
    }],
    [/^(.+) was removed for missing picks\. A bot picks for their seat now\.$/i, function (_, n) {
      return n + ' 因漏选被移出，其席位现在由 AI 代抽。';
    }],
    [/^Pick in your draft within (\d+)s, or your seat goes to a bot$/i, function (_, n) {
      return '在 ' + n + ' 秒内选牌，否则你的席位将交给 AI';
    }],
    [/^(.+) is your companion\.$/i, function (_, n) { return n + ' 是你的行侣。'; }],
    [/^(.+) is no longer your companion\.$/i, function (_, n) { return n + ' 不再是你的行侣。'; }],
    [/^Companion — put (.+) into your hand$/i, function (_, n) { return '行侣——把 ' + n + ' 置于你手上'; }],
    [/^Attacked with (.+)\.$/i, function (_, n) { return '用 ' + n + ' 攻击。'; }],
    [/^Attached to (.+)$/i, function (_, n) { return '贴附于 ' + n; }],
    [/^Block (.+)\. This match plays on\..*$/i, function (_, n) {
      return '已屏蔽 ' + n + '。本场对局继续。你们互相看不到聊天，也不会再同桌或同队。比赛仍可能把你们配到一起。';
    }],
    [/^(.+) is not legal for (.+)\.$/i, function (_, a, b) { return a + ' 对 ' + b + ' 不合法。'; }],
    [/^(.+) abilities from this card are on the stack$/i, function (_, n) { return '该牌的 ' + n + ' 个异能在堆叠上'; }],
    [/^(.+) of (.+) damage left to assign\.$/i, function (_, a, b) { return '还有 ' + a + ' / ' + b + ' 点伤害待分配。'; }],
    [/^Chosen color: (.+)$/i, function (_, n) { return '已选颜色：' + tr(n); }],
    [/^Chosen type: (.+)$/i, function (_, n) { return '已选类别：' + tr(n); }],
    [/^Chosen number: (.+)$/i, function (_, n) { return '已选数字：' + n; }],
    [/^Chosen direction: (.+)$/i, function (_, n) { return '已选方向：' + tr(n); }],
    [/^Chosen odd or even: (.+)$/i, function (_, n) { return '已选单双：' + tr(n); }],
    [/^Named card: (.+)$/i, function (_, n) { return '已指定牌名：' + n; }],

    // ——— 等待与计时
    [/^Waiting for (.+)\.$/i, function (_, n) { return '正在等待 ' + n + '。'; }],
    [/^Accepts automatically in (\d+)s$/i, function (_, n) { return n + ' 秒后自动接受'; }],
    [/^Waiting for (.+) — (.+) accepts automatically in (\d+)s\.$/i, function (_, a, b, s) {
      return '等待 ' + a + ' ——' + b + ' 将在 ' + s + ' 秒后自动接受。';
    }],
    [/^Waiting for (.+) — (.+)'s clock runs out in (\d+)s\.$/i, function (_, a, b, s) {
      return '等待 ' + a + ' ——' + b + ' 的计时还剩 ' + s + ' 秒。';
    }],

    // ——— 好友与私信
    [/^Friend request sent to (.+)\.$/i, function (_, n) { return '已向 ' + n + ' 发送好友请求。'; }],
    [/^Friends with (.+) again\.$/i, function (_, n) { return '已与 ' + n + ' 重新成为好友。'; }],
    [/^Blocked ([^.]+)\.$/i, function (_, n) { return '已屏蔽 ' + n + '。'; }],
    [/^Blocked (.+)\. You won't be seated together or message each other\.$/i, function (_, n) {
      return '已屏蔽 ' + n + '，你们不会再同桌，也不能互发消息。';
    }],
    [/^Declined (.+)'s request\.$/i, function (_, n) { return '已拒绝 ' + n + ' 的请求。'; }],
    [/^Declined and blocked (.+)\.$/i, function (_, n) { return '已拒绝并屏蔽 ' + n + '。'; }],
    [/^Cancelled your request to (.+)\.$/i, function (_, n) { return '已撤回发给 ' + n + ' 的请求。'; }],
    [/^Couldn't send a request to (.+)\.$/i, function (_, n) { return '无法向 ' + n + ' 发送请求。'; }],
    [/^Couldn't accept (.+)'s request\.$/i, function (_, n) { return '无法接受 ' + n + ' 的请求。'; }],
    [/^Couldn't decline (.+)'s request\.$/i, function (_, n) { return '无法拒绝 ' + n + ' 的请求。'; }],
    [/^Couldn't block (.+)\.$/i, function (_, n) { return '无法屏蔽 ' + n + '。'; }],
    [/^Couldn't unblock (.+)\.$/i, function (_, n) { return '无法取消屏蔽 ' + n + '。'; }],
    [/^Couldn't remove (.+)\.$/i, function (_, n) { return '无法移除 ' + n + '。'; }],
    [/^Couldn't delete your conversation with (.+)\.$/i, function (_, n) { return '无法删除与 ' + n + ' 的会话。'; }],
    [/^Deleted your conversation with (.+)\. They still have their copy\.$/i, function (_, n) {
      return '已删除与 ' + n + ' 的会话，对方仍保留自己的一份。';
    }],
    [/^Kept your conversation with (.+)\.$/i, function (_, n) { return '已保留与 ' + n + ' 的会话。'; }],
    [/^Message from (.+)$/i, function (_, n) { return '来自 ' + n + ' 的消息'; }],
    [/^Conversation with (.+)$/i, function (_, n) { return '与 ' + n + ' 的会话'; }],
    [/^(.+) is typing…$/i, function (_, n) { return n + ' 正在输入…'; }],
    [/^Allowed (.+) back\. They can join again\.$/i, function (_, n) { return '已允许 ' + n + ' 回来，可以重新加入。'; }],
    [/^(.+) is no longer your companion\.$/i, function (_, n) { return n + ' 不再是你的行侣。'; }],

    // ——— 套牌与立方操作
    [/^(.+) could not be moved\.$/i, function (_, n) { return n + ' 无法移动。'; }],
    [/^(.+) could not be duplicated\.$/i, function (_, n) { return n + ' 无法复制。'; }],
    [/^(.+) could not be renamed\.$/i, function (_, n) { return n + ' 无法重命名。'; }],
    [/^(.+) could not be read\.$/i, function (_, n) { return n + ' 读取失败。'; }],
    [/^Moved (.+) to first\.$/i, function (_, n) { return '已把 ' + n + ' 移到最前。'; }],
    [/^Move (.+) to mainboard$/i, function (_, n) { return '把 ' + n + ' 移到主牌'; }],
    [/^Move (.+) to sideboard$/i, function (_, n) { return '把 ' + n + ' 移到备牌'; }],
    [/^Changed the cover of (.+)\.$/i, function (_, n) { return '已更换 ' + n + ' 的封面。'; }],
    [/^Imported (\d+) cards from Cube Cobra\.$/i, function (_, n) { return '已从 Cube Cobra 导入 ' + n + ' 张牌。'; }],
    [/^Preferred printing removed for (.+)\.$/i, function (_, n) { return '已取消 ' + n + ' 的版本偏好。'; }],
    [/^(.+) will use this printing in future decks\.$/i, function (_, n) { return n + ' 以后的新套牌将沿用此版本。'; }],
    [/^Kept the name (.+)\.$/i, function (_, n) { return '已保留名称 ' + n + '。'; }],
    [/^Build a deck from your (.+) pool, (\d+) cards$/i, function (_, f, n) {
      return '用你的' + tr(f) + '牌池构筑，共 ' + n + ' 张牌';
    }],
    [/^Change (.+)'s art$/i, function (_, n) { return '更换 ' + n + ' 的画作'; }],
    [/^Change the game to (.+)\?$/i, function (_, n) { return '把对局改为 ' + tr(n) + '？'; }],
    [/^(.+)'s turn$/i, function (_, n) { return tr(n) + '的回合'; }],
    [/^(.+)'s deck$/i, function (_, n) { return tr(n) + '的套牌'; }],

    // ——— 回放
    [/^Deleted the replay against (.+)\.$/i, function (_, n) { return '已删除对 ' + n + ' 的回放。'; }],
    [/^Download replay of (.+)$/i, function (_, n) { return '下载对 ' + n + ' 的回放'; }],
    [/^Preparing the download of the replay against (.+)$/i, function (_, n) {
      return '正在准备下载对 ' + n + ' 的回放';
    }],

    // ——— 比赛
    [/^Check in for round (\d+) now, or lose the match$/i, function (_, n) {
      return '立刻为第 ' + n + ' 轮签到，否则判负';
    }],
    [/^Paired (.+) with (.+)\. Players are told\.$/i, function (_, a, b) { return '已让 ' + a + ' 与 ' + b + ' 配对，玩家已获通知。'; }],
    [/^Pair round (\d+)$/i, function (_, n) { return '为第 ' + n + ' 轮配对'; }],
    [/^(.+) has a bye\. Players are told\.$/i, function (_, n) { return n + ' 轮空，玩家已获通知。'; }],
    [/^Late entry open through round (\d+)\.$/i, function (_, n) { return '中途加入开放至第 ' + n + ' 轮。'; }],
    [/^(\d+) left to register$/i, function (_, n) { return '还有 ' + n + ' 人未报名'; }],
    [/^Deck building runs (\d+) minutes longer\. Builders are told\.$/i, function (_, n) {
      return '构筑时间延长 ' + n + ' 分钟，构筑中的玩家已获通知。';
    }],
    [/^Deck building until (.+)$/i, function (_, n) { return '构筑截止 ' + n; }],
    [/^Match (\d+) is on\.$/i, function (_, n) { return '第 ' + n + ' 场已开始。'; }],

    // ——— 引擎下发的通用询问（Forge）
    [/^Choose an? ([^,.]{1,40})([.!?])?$/i, function (_, n, q) { return '选择' + tr(n) + (q === '.' ? '。' : (q ? '？' : '')); }],
    [/^Choose up to (\d+) ([^,.]{1,40})[.!?]?$/i, function (_, n, x) { return '选择至多 ' + n + ' 个' + tr(x); }],
    [/^Select an? ([^,.]{1,40})([.!?])?$/i, function (_, n, q) { return '选择' + tr(n) + (q === '.' ? '。' : (q ? '？' : '')); }],
    [/^Would you like to pay (\d+) life\?$/i, function (_, n) { return '是否支付 ' + n + ' 点生命？'; }],
    [/^Would you like to ([^,.]{1,60})\?$/i, function (_, n) { return '是否要' + tr(n) + '？'; }],
    [/^Put ([^,.]{1,48}) on top of your library$/i, function (_, n) { return '把 ' + n + ' 放在你的牌库顶'; }],
    [/^Put ([^,.]{1,48}) into your hand$/i, function (_, n) { return '把 ' + n + ' 置于你手上'; }],
    [/^Discard ([^,.]{1,48})$/i, function (_, n) { return '弃掉 ' + n; }],
    [/^Sacrifice ([^,.]{1,48})$/i, function (_, n) { return '牺牲 ' + n; }],
    [/^Exile ([^,.]{1,48})$/i, function (_, n) { return '放逐 ' + n; }],
    [/^Tap ([^,.]{1,48})$/i, function (_, n) { return '横置 ' + n; }],
    [/^Return ([^,.]{1,48}) to (?:its|their) owner's hand$/i, function (_, n) { return '把 ' + n + ' 移回其拥有者手上'; }]
  );

  /* ---------- 15. 句式规则（二）：拖放、席位、社交 ---------- */

  RULES.push(
    // 拖放与桌面
    [/^(.+) is over a drop target\.$/i, function (_, n) { return n + ' 位于放置目标上。'; }],
    [/^(.+) is no longer over a drop target\.$/i, function (_, n) { return n + ' 已离开放置目标。'; }],
    [/^(.+) is over the cast zone\.$/i, function (_, n) { return n + ' 位于施放区上。'; }],
    [/^(.+) is no longer over a position\.$/i, function (_, n) { return n + ' 已离开该位置。'; }],
    [/^(.+) is over position (\d+) of (\d+)\.$/i, function (_, n, a, b) { return n + ' 位于第 ' + a + ' / ' + b + ' 位。'; }],
    [/^(.+) moved to position (\d+) of (\d+)\.$/i, function (_, n, a, b) { return '已把 ' + n + ' 移到第 ' + a + ' / ' + b + ' 位。'; }],
    [/^(.+) moved to (.+)\.$/i, function (_, a, b) { return '已把 ' + a + ' 移到 ' + b + '。'; }],
    [/^(.+) - held by (.+)$/i, function (_, a, b) { return a + ' ——由 ' + b + ' 留座'; }],
    [/^(.+) - view player details$/i, function (_, n) { return n + ' ——查看玩家资料'; }],
    [/^View (.+)'s profile$/i, function (_, n) { return '查看 ' + n + ' 的资料'; }],
    [/^View (.+)'s picture$/i, function (_, n) { return '查看 ' + n + ' 的图片'; }],
    [/^Showing (.+)'s board$/i, function (_, n) { return '正在查看 ' + n + ' 的战场'; }],
    [/^(.+) × (\d+) min to sideboard$/i, function (_, n, m) { return n + ' × ' + m + ' 分钟换备牌'; }],

    // 牌张与堆叠
    [/^(.+) returned (\d+) cards to hand$/i, function (_, n, c) { return n + ' 把 ' + c + ' 张牌移回手上'; }],
    [/^(.+) put (\d+) cards from exile into their hand$/i, function (_, n, c) {
      return n + ' 把 ' + c + ' 张牌从放逐区置于其手上';
    }],
    [/^(.+) × 3 min to sideboard$/i, function (_, n) { return n + ' × 3 分钟换备牌'; }],
    [/^Resolution order, (\d+) abilities\. The leftmost resolves first\.$/i, function (_, n) {
      return '结算顺序，共 ' + n + ' 个异能；最左边的先结算。';
    }],
    [/^Show (.+) on the game rail$/i, function (_, n) { return '在对局侧栏显示 ' + tr(n); }],
    [/^Remove \d+ reveal from panel$/i, function () { return '从面板移除展示'; }],
    [/^View command zone - (.+)$/i, function (_, n) { return '查看指挥官区——' + n; }],

    // 计时与轮次
    [/^Enter a number from 1 to (\d+) to act sooner\.$/i, function (_, n) {
      return '输入 1 到 ' + n + ' 之间的数字以提前行动。';
    }],
    [/^Press (.+) to read it enlarged\.$/i, function (_, k) { return '按 ' + k + ' 放大查看。'; }],
    [/^Round (\d+): you have a bye$/i, function (_, n) { return '第 ' + n + ' 轮：你轮空'; }],
    [/^Round (\d+) - take your seat$/i, function (_, n) { return '第 ' + n + ' 轮——入座'; }],
    [/^Round (\d+): new pairing$/i, function (_, n) { return '第 ' + n + ' 轮：新的对阵'; }],
    [/^Round (\d+) was paired again\. Players are told\.$/i, function (_, n) {
      return '第 ' + n + ' 轮已重新配对，玩家已获通知。';
    }],
    [/^Waiting for (.+) to act\. They forfeit if the timer ends\.$/i, function (_, n) {
      return '等待 ' + n + ' 行动；倒计时结束即弃权。';
    }],
    [/^Waiting on (\d+) players?\.$/i, function (_, n) { return '等待 ' + n + ' 名玩家。'; }],
    [/^Waits? (\d+) before the next quick reply\.$/i, function (_, n) { return '等 ' + n + ' 秒后才能再发快捷回复。'; }],

    // 社交
    [/^(.+) is over a drop target\.$/i, function (_, n) { return n + ' 位于放置目标上。'; }],
    [/^You and (.+) are friends\.$/i, function (_, n) { return '你和 ' + n + ' 是好友。'; }],
    [/^You're already friends with (.+)\.$/i, function (_, n) { return '你已和 ' + n + ' 是好友。'; }],
    [/^You blocked (.+)\.$/i, function (_, n) { return '你已屏蔽 ' + n + '。'; }],
    [/^You unblocked (.+)\.$/i, function (_, n) { return '你已取消屏蔽 ' + n + '。'; }],
    [/^Removed (.+) from your friends\.$/i, function (_, n) { return '已把 ' + n + ' 移出好友。'; }],
    [/^Request sent to (.+)\.$/i, function (_, n) { return '已向 ' + n + ' 发送请求。'; }],
    [/^Report about (.+) sent\. A moderator will look at it\.$/i, function (_, n) {
      return '关于 ' + n + ' 的举报已提交，版主会查看。';
    }],
    [/^Wearing (.+) beside your name\.$/i, function (_, n) { return '名字旁显示 ' + n + '。'; }],
    [/^Your name is now (.+)\.$/i, function (_, n) { return '你的名称现在是 ' + n + '。'; }],
    [/^Your name is (.+) again\.$/i, function (_, n) { return '你的名称已恢复为 ' + n + '。'; }],
    [/^(.+) pin, (.+)\. Change it$/i, function (_, a, b) { return a + ' 固定位，' + b + '。可更改'; }],
    [/^Set format for (.+)$/i, function (_, n) { return '为 ' + n + ' 设置赛制'; }],
    [/^Your deck for (.+)$/i, function (_, n) { return '你在 ' + n + ' 的套牌'; }],
    [/^Unknown format: (.+)$/i, function (_, n) { return '未知赛制：' + n; }],
    [/^Within ±(\d+) of your rating$/i, function (_, n) { return '评分 ±' + n + ' 以内'; }],
    [/^Removed (.+) from the graph\.$/i, function (_, n) { return '已从图表移除 ' + n + '。'; }],
    [/^Renamed to (.+)\.$/i, function (_, n) { return '已重命名为 ' + n + '。'; }],
    [/^Renamed back to (.+)\.$/i, function (_, n) { return '已改回 ' + n + '。'; }],
    [/^Sideboarding for game (\d+)…?$/i, function (_, n) { return '第 ' + n + ' 盘换备牌…'; }],
    [/^Top cut · Round (\d+)$/i, function (_, n) { return '淘汰赛 · 第 ' + n + ' 轮'; }],
    [/^Too many seated · (\d+) of (\d+)$/i, function (_, a, b) { return '入座过多 · ' + a + ' / ' + b; }],
    [/^You activated (.+)\.$/i, function (_, n) { return '你起动了 ' + n + '。'; }],
    [/^You and (.+) drew the match\.$/i, function (_, n) { return '你和 ' + n + ' 打成平局。'; }],
    [/^You won the match against (.+) in (.+)\.$/i, function (_, a, b) { return '你在 ' + b + ' 中战胜了 ' + a + '。'; }],
    [/^You lost the match to (.+) in (.+)\.$/i, function (_, a, b) { return '你在 ' + b + ' 中输给了 ' + a + '。'; }],
    [/^One (more|fewer) (.+)$/i, function (_, how, n) {
      var m = { card: '一张牌', cards: '一张牌', player: '一名玩家', players: '一名玩家', deck: '一套套牌', seat: '一个座位', game: '一盘', round: '一轮', source: '一个来源' };
      return (/more/i.test(how) ? '多' : '少') + (m[n.toLowerCase()] || tr(n));
    }],
    [/^You have played (.+)\.$/i, function (_, n) { return '你已进行过 ' + trDeep(n) + '。'; }],
    [/^Yours is (.+)\.$/i, function (_, n) { return '你的是 ' + trDeep(n) + '。'; }],
    [/^Open a (.+) table, (.+)$/i, function (_, a, b) { return '开一桌' + tr(a) + '，' + b; }],
    [/^No (.+) tables open\.$/i, function (_, n) { return '没有开放的' + tr(n) + '牌桌。'; }],
    [/^Support Endstep: you are a (.+) supporter$/i, function (_, n) { return '支持 Endstep：你是' + tr(n) + '支持者'; }],
    [/^Playing, level at (\d+) to (\d+)\.$/i, function (_, a, b) { return '对局中，等级 ' + a + ' 至 ' + b + '。'; }],
    [/^Game held until (.+)\.$/i, function (_, n) { return '对局保留至 ' + n + '。'; }],
    [/^Supporter since (.+)\.$/i, function (_, n) { return '自 ' + n + ' 起为支持者。'; }],
    [/^Paid with (.+)\.$/i, function (_, n) { return '已用 ' + tr(n) + ' 支付。'; }]
  );

  /* ---------- 37. 变量模板句（规则层） ---------- */

  RULES.push(
    // 成就 / 提示
    [/^Achievement unlocked: (.+)$/i, function (_, n) { return '成就解锁：' + n; }],
    [/^Companion - put (.+) into your hand$/i, function (_, n) { return '行侣——把 ' + n + ' 置于你手上'; }],
    [/^Auto-yield options for (.+)$/i, function (_, n) { return n + ' 的自动放过选项'; }],
    [/^Next draw - (.+)$/i, function (_, n) { return '下次抓牌——' + n; }],
    [/^Show prompt for (.+)$/i, function (_, n) { return '显示' + trDeep(n) + '的提示'; }],
    [/^Show prompt - (.+)$/i, function (_, n) { return '显示提示——' + n; }],
    [/^Hide prompt to peek at the board - (.+)$/i, function (_, n) { return '隐藏提示以查看战场——' + n; }],

    // 牌桌 / 对局状态
    [/^All (\d+) opponents are still connected\.$/i, function (_, n) { return '全部 ' + n + ' 名对手仍在线。'; }],
    [/^All (\d+) opponents have closed the game\.$/i, function (_, n) { return '全部 ' + n + ' 名对手已关闭对局。'; }],
    [/^Waiting on (.+) and (\d+) more$/i, function (_, a, b) { return '等待 ' + a + ' 及另外 ' + b + ' 人'; }],
    [/^Watch this (\d+)-player game$/i, function (_, n) { return '观战这场 ' + n + ' 人对局'; }],
    [/^Outside the game - (.+)$/i, function (_, n) { return '对局外——' + n; }],
    [/^Recording starts on turn (\d+) of game (\d+)\.$/i, function (_, a, b) { return '录像从第 ' + b + ' 盘第 ' + a + ' 回合开始。'; }],
    [/^You sent that one a moment ago\. You can send it again in (.+)\.$/i, function (_, n) {
      return '你刚发过这一条，' + n + ' 后可再次发送。';
    }],
    [/^You can only send quick replies until (.+)\. Reason: (.+)$/i, function (_, a, b) {
      return '在 ' + a + ' 之前只能发快捷回复。原因：' + b;
    }],
    [/^You can't chat in a game you're watching until (.+)\. Reason: (.+)$/i, function (_, a, b) {
      return '观战的对局里，' + a + ' 之前不能聊天。原因：' + b;
    }],
    [/^You're still in a game against (.+)\. Concede it to start a new one\?$/i, function (_, n) {
      return '你还在与 ' + n + ' 的对局中。认输才能开新局？';
    }],
    [/^Your conversation with (.+) was already deleted\.$/i, function (_, n) { return '与 ' + n + ' 的会话已被删除。'; }],
    [/^Your request to (.+) was already cancelled\.$/i, function (_, n) { return '你发给 ' + n + ' 的请求已撤回。'; }],
    [/^Couldn't cancel your request to (.+)\.$/i, function (_, n) { return '无法撤回发给 ' + n + ' 的请求。'; }],

    // 循环 / 快捷方式
    [/^Accept all (\d+)$/i, function (_, n) { return '接受全部 ' + n + ' 次'; }],
    [/^Accept all (\d+) iterations\.$/i, function (_, n) { return '接受全部 ' + n + ' 次迭代。'; }],
    [/^Leave the field blank to accept all (\d+) iterations, or enter a smaller count to act sooner\.$/i, function (_, n) {
      return '留空即接受全部 ' + n + ' 次迭代；输入更小的数字可更早行动。';
    }],
    [/^Your loop is running: all opponents accepted all (\d+)\.$/i, function (_, n) {
      return '循环正在运行：所有对手都接受了全部 ' + n + ' 次。';
    }],
    [/^Your loop is running: your opponent accepted all (\d+)\.$/i, function (_, n) {
      return '循环正在运行：对手接受了全部 ' + n + ' 次。';
    }],
    [/^Your loop is running: your opponent did not answer, so all (\d+) were accepted\.$/i, function (_, n) {
      return '循环正在运行：对手未应答，因此全部 ' + n + ' 次已被自动接受。';
    }],
    [/^Your opponent shortened your loop to (\d+) of (\d+) iterations - they act after iteration (\d+)\.$/i, function (_, a, b, c) {
      return '对手把你的循环缩短为 ' + a + ' / ' + b + ' 次迭代——他们在第 ' + c + ' 次迭代后行动。';
    }],

    // 套牌 / 立方
    [/^Cover for (.+)$/i, function (_, n) { return n + ' 的封面'; }],
    [/^The cover of (.+) could not be changed\.$/i, function (_, n) { return n + ' 的封面更换失败。'; }],
    [/^Format for (.+)$/i, function (_, n) { return n + ' 的赛制'; }],
    [/^The format of (.+) could not be set\.$/i, function (_, n) { return n + ' 的赛制设置失败。'; }],
    [/^Replaces the (\d+) cards in this cube$/i, function (_, n) { return '替换本立方中的 ' + n + ' 张牌'; }],
    [/^Remove all (.+)$/i, function (_, n) { return '移除全部 ' + n; }],
    [/^Remove one (.+)$/i, function (_, n) { return '移除一个 ' + n; }],
    [/^Removed (.+)\. Add the card that replaces it\.$/i, function (_, n) {
      return '已移除 ' + n + '。请添加替代它的牌。';
    }],
    [/^Registered deck: (.+)\. Change$/i, function (_, n) { return '已登记套牌：' + n + '。更改'; }],
    [/^Pin a badge (.+)$/i, function (_, n) { return '固定徽章 ' + n; }],
    [/^More for (.+)$/i, function (_, n) { return n + ' 的更多操作'; }],
    [/^Your report, with (.+)$/i, function (_, n) { return '你的举报，附 ' + n; }],

    // 环境 / 统计
    [/^No (.+) or card matches "(.+)"\.$/i, function (_, a, b) { return '没有匹配的' + a + '或牌「' + b + '」。'; }],
    [/^No archetype matches "(.+)"\. Search looks at archetype names\.$/i, function (_, n) {
      return '没有匹配「' + n + '」的原型。搜索只查原型名称。';
    }],
    [/^No comparison: (.+)$/i, function (_, n) { return '无可比较：' + n; }],
    [/^No list is shown: fewer than (\d+) played this deck in this window\.$/i, function (_, n) {
      return '未显示牌表：本时间窗内使用该套牌的人少于 ' + n + '。';
    }],
    [/^The sideboard and commanders are not shown: fewer than (\d+) brought this exact registration\.$/i, function (_, n) {
      return '未显示备牌与指挥官：携带完全相同登记的人少于 ' + n + '。';
    }],
    [/^Show only decks for (.+)$/i, function (_, n) { return '仅显示 ' + n + ' 的套牌'; }],
    [/^Set by the (.+) ladder$/i, function (_, n) { return '由 ' + n + ' 天梯决定'; }],
    [/^Suggested for (\d+) players$/i, function (_, n) { return '适合 ' + n + ' 名玩家的推荐'; }],

    // 比赛
    [/^Round (\d+) is held by the organizer$/i, function (_, n) { return '第 ' + n + ' 轮由主办方掌控'; }],
    [/^Round (\d+): your table is ready\.$/i, function (_, n) { return '第 ' + n + ' 轮：你的牌桌已就绪。'; }],
    [/^Round robin, (\d+) rounds$/i, function (_, n) { return '循环赛，' + n + ' 轮'; }],
    [/^Reset table (\d+)$/i, function (_, n) { return '重置牌桌 ' + n; }],
    [/^Reset to (.+)$/i, function (_, n) { return '重置为 ' + n; }],
    [/^Swapped (.+) and (.+)\. Players are told\.$/i, function (_, a, b) { return '已交换 ' + a + ' 与 ' + b + '，玩家已获通知。'; }],
    [/^Table (\d+) is reset\. Both players are told\.$/i, function (_, n) { return '牌桌 ' + n + ' 已重置，双方已获通知。'; }],
    [/^The draft starts at (.+)$/i, function (_, n) { return '轮抽于 ' + n + ' 开始'; }],
    [/^The draft starts when (\d+) players have joined\.$/i, function (_, n) { return n + ' 名玩家加入后开始轮抽。'; }],
    [/^The top (\d+) seeds get$/i, function (_, n) { return '前 ' + n + ' 号种子获得'; }],
    [/^Through round (\d+), missed rounds as losses$/i, function (_, n) { return '至第 ' + n + ' 轮，缺席轮次计为负'; }],
    [/^Open until (.+)$/i, function (_, n) { return '开放至 ' + n; }],
    [/^Scheduled for (.+)$/i, function (_, n) { return '预定于 ' + n; }],

    // 回放 / 停止点 / 按键
    [/^The replay against (.+)$/i, function (_, n) { return '对 ' + n + ' 的回放'; }],
    [/^Sideboard window did not load: (.+)$/i, function (_, n) { return '备牌窗口加载失败：' + n; }],
    [/^Stop set on (.+) at (.+)\.$/i, function (_, a, b) { return '已设置「' + trDeep(a) + '」在' + trDeep(b) + '的停止点。'; }],
    [/^Stop removed on (.+) at (.+)\.$/i, function (_, a, b) { return '已取消「' + trDeep(a) + '」在' + trDeep(b) + '的停止点。'; }],
    [/^Undo with (.+)\.$/i, function (_, n) { return '用 ' + n + ' 撤销。'; }],
    [/^Press a key for (.+)\. Escape cancels, Backspace restores the default\.$/i, function (_, n) {
      return '为' + trDeep(n) + '按一个键。Esc 取消，Backspace 恢复默认。';
    }],
    [/^Press a key for (.+)\. Escape cancels\.$/i, function (_, n) { return '为' + trDeep(n) + '按一个键。Esc 取消。'; }],
    [/^Change the key for (.+), now (.+)$/i, function (_, a, b) { return '更改' + trDeep(a) + '的按键，现为' + trDeep(b); }],
    [/^Esc cancels · Backspace: (.+)$/i, function (_, n) { return 'Esc 取消 · Backspace：' + n; }],
    [/^Resize (.+) - arrow keys, Shift for larger steps$/i, function (_, n) {
      return '调整 ' + n + '——方向键微调，Shift 加速';
    }],

    // 拖放
    [/^Picked up (.+) from position (\d+) of (\d+)\.$/i, function (_, n, a, b) {
      return '已拾起 ' + n + '（第 ' + a + ' / ' + b + ' 位）。';
    }],
    [/^Picked up ([^.]+)\.$/i, function (_, n) { return '已拾起 ' + n + '。'; }],
    [/^Reorder cancelled\. (.+) is back at (.+)\.$/i, function (_, a, b) {
      return '重新排序已取消。' + a + ' 已回到 ' + b + '。';
    }],
    [/^Put back (.+) for (.+)$/i, function (_, a, b) { return '放回 ' + a + ' 以代替 ' + b; }],
    [/^(\d+) of (\d+)$/i, function (_, a, b) { return a + ' / ' + b; }],
    [/^Pinned (\d+) of (\d+)$/i, function (_, a, b) { return '已固定 ' + a + ' / ' + b; }],
    [/^(\d+) Rated Matches$/i, function (_, n) { return n + ' 场计分对局'; }],
    // 徽章进度："12 / 50 counted matches"、"15.7 / 100 hours"
    [/^([\d.,]+) \/ ([\d.,]+) (.+)$/i, function (_, a, b, unit) { return a + ' / ' + b + ' ' + trDeep(unit); }],
    [/^(\d+) Hours Played$/i, function (_, n) { return '游玩 ' + n + ' 小时'; }],
    [/^(\d+) \/ (\d+) counted$/i, function (_, a, b) { return a + ' / ' + b + ' 已计入'; }],
    [/^A rated match counts when both players.*$/i, function () {
      return '一场对局被计入的前提是：本赛季双方都已在对应天梯上“确立”（至少打过 10 场计分对局、' +
        '不含协议和局、对手至少 5 位不同玩家；若赛季采用原始评分规则，还需评分已稳定）。' +
        '这正是排行榜早先的名次门槛，只是当时计入所有对手、而非仅限已确立的对手，也不要求近期有对局。';
    }],
    [/^Win in a row\..*$/i, function () {
      return '连续获胜。一负或一平即中断连胜；不计入的对局既不加长也不中断，' +
        '因此可能与记录里的连胜数不同。只统计与已确立对手的计分对局。';
    }],
    [/^Best of (\d+), within (.+)$/i, function (_, n, w) { return 'BO' + n + '\uff0c\u9650 ' + trDeep(w) + '\u5185'; }],
    [/^Only players within (\d+) of your Limited rating\. Fewer people, so it can take longer\.$/i, function (_, n) {
      return '\u4ec5\u9650\u4e0e\u4f60\u9650\u5236\u8d5b\u8bc4\u5206\u76f8\u5dee ' + n + ' \u4ee5\u5185\u7684\u73a9\u5bb6\u3002\u4eba\u8f83\u5c11\uff0c\u53ef\u80fd\u9700\u8981\u66f4\u4e45\u3002';
    }],
    [/^Fits the players, now (\d+)$/i, function (_, n) { return '\u9002\u914d\u73a9\u5bb6\u4eba\u6570\uff0c\u73b0\u4e3a ' + n; }],
    [/^Every (.+), its folder named on each$/i, function (_, n) { return '\u6bcf\u4e2a' + n + '\uff0c\u5404\u81ea\u6807\u6ce8\u6587\u4ef6\u5939\u540d'; }],
    [/^Create custom stack after (.+)$/i, function (_, n) { return '在' + trDeep(n) + '之后创建自定义堆栈'; }],
    [/^No decided (.+)$/i, function (_, n) { return '无已决' + trDeep(n); }],
    [/^Round of (\d+)$/i, function (_, n) { return n + ' 人的一轮'; }],
    [/^Filed under (.+) again\.$/i, function (_, n) { return '已重新归入 ' + n + '。'; }],
    [/^Don.t apply (.+)$/i, function (_, n) { return '不应用 ' + n; }],
    [/^Scroll (.+) for more cards$/i, function (_, n) { return '滚动 ' + n + ' 查看更多牌'; }],
    [/^Stop after (.+)$/i, function (_, n) { return '在' + trDeep(n) + '之后停止'; }],
    [/^Set to theirs: (.+)$/i, function (_, n) { return '采用对方的：' + trDeep(n); }],
    [/^If you don.t leave again, your free leave comes back on (.+)\.$/i, function (_, n) {
      return '若不再中途离开，免费离开次数将于 ' + n + ' 恢复。';
    }],
    [/^No card table: fewer than (\d+) played this deck in this window, so it would show one person.s list\.$/i, function (_, n) {
      return '没有牌张表：本时间窗内使用该套牌的人少于 ' + n + '，否则就会暴露某个人的牌表。';
    }]
  );

  function boName(n) {
    if (n === 1) return '\u4e00\u5c40\u5b9a\u80dc\u8d1f';
    if (n === 2) return '\u4e24\u5c40\u5b9a\u80dc\u8d1f';
    if (n === 3) return '\u4e09\u5c40\u4e24\u80dc';
    if (n === 5) return '\u4e94\u5c40\u4e09\u80dc';
    return n + ' \u5c40' + (Math.ceil(n / 2)) + ' \u80dc';
  }

  function cnNum(n) {
    var d = ['\u96f6', '\u4e00', '\u4e8c', '\u4e09', '\u56db', '\u4e94', '\u516d', '\u4e03', '\u516b', '\u4e5d', '\u5341'];
    var v = +n;
    if (v >= 0 && v <= 10) return d[v];
    if (v < 20) return '\u5341' + d[v - 10];
    return String(n);
  }

  // 规则内部用：先词表、再规则、最后原样
  function trDeep(x) {
    if (!x) return x;
    var h = lookup(x);
    if (h) return h;
    var r = applyRules(x);
    return r || x;
  }

  // 供规则内部调用：把嵌套片段再过一遍词表
  function tr(s) {
    if (!s) return s;
    var hit = DICT[s] || DICT_LC[s.toLowerCase()];
    return hit || s;
  }
  /* ---------- 11. 大厅筛选 / 好友栏 ---------- */

  Object.assign(DICT, {
    'No friends online.': '好友都不在线。',
    'Find friends': '找好友',
    'Opponents within': '对手评分范围',
    'Ranked only': '仅排位',
    'Quick': '快速',
    'quick': '快速',
    'Long': '长局',
    'long': '长局',
    'Either': '两者皆可',
    'either': '两者皆可',
    'Quick Play': '快速对局',
    'Quick play': '快速对局',
    'most played first': '按使用量排序',
    'The last 30 days': '最近 30 天',
    'The last 14 days': '最近 14 天',
    'The last 7 days': '最近 7 天',
    'The last 2 hours': '最近 2 小时',

    // 开局模式与牌桌列表
    'Forgetful Fish': '健忘鱼',
    'Freeplay': '自由对战',
    '100-card singleton, 40 life.': '100 张单张套牌，40 点生命。',
    'Build from six packs.': '用六个补充包构筑。',
    'Have an invite code?': '有邀请码？',
    'In queue': '排队中',
    'Queue': '队列',
    'not shown': '（未显示）',
    'limited': '受限',
    'Show all tables': '显示全部牌桌',
    'Friends first': '好友优先',
    'Most watched': '观看最多',
    'Longest running': '开局最久',
    'Newest': '最新',
    'Filling up': '快满了',
    'Most seats open': '空位最多',
    'Commander damage': '指挥官伤害',
    'Command zone': '指挥官区',

    // 套牌库 / 立方库
    'New deck': '新建套牌',
    'New cube': '新建 Cube',
    'Search decks or a card in them': '搜索套牌或其中的牌',
    'Search cubes or a card in them': '搜索 Cube 或其中的牌',
    'In folders': '分文件夹',
    'One list': '单一列表',
    'Open all folders': '展开全部文件夹',
    'Close all folders': '收起全部文件夹',
    'Not in a folder': '未归入文件夹',
    'New folder inside': '在此新建文件夹',
    'Its decks': '其中的套牌',
    'Its cubes': '其中的 Cube',
    'Show the issues': '显示问题',
    'Delete folder': '删除文件夹'
  });

  /* ---------- 12. 弹窗 / 菜单 / 提示（一） ---------- */

  Object.assign(DICT, {
    // ——— 通用小标签
    'And': '且',
    'Then': '然后',
    'Does': '执行',
    'Taken': '已占用',
    'Starts': '开始',
    'Work': '工作',
    'Write': '写入',
    'Cover': '封面',
    'Full': '完整',
    'Net': '净值',
    'Day': '日',
    'Last': '最后一个',
    'Likely': '很可能',
    'Misc': '杂项',
    'Levels': '等级',
    'Zoom': '缩放',
    'Space': '空格',
    'Cycle': '循环',
    'Command': '指令',
    'Ending': '结束阶段',
    'Enable': '启用',
    'Experience': '经验',
    'Essentials': '基础',
    'Connected': '已连接',
    'Continuous': '持续',
    'Earned': '已获得',
    'Edited': '已编辑',
    'Emoji': '表情',
    'Emoji chooser': '表情选择器',
    'Folder name': '文件夹名称',
    'Follow': '关注',
    'Gems': '宝石',
    'Installed': '已安装',
    'Mirrors your deck': '镜像你的套牌',
    'On the list': '在列表中',
    'One fewer': '少一个',
    'One more': '多一个',
    'Over time': '随时间变化',
    'Prompt': '提示',
    'Prompt ': '提示',
    'Restricted preview.': '受限预览。',
    'Structure': '结构',
    'Subtle': '细微',
    'Suggestion': '建议',
    'Thanks': '多谢',
    'Thank you.': '谢谢。',
    'Sorry': '抱歉',
    'View': '查看',
    'Work': '工作',
    'Reckless': '鲁莽',
    'Cautious': '谨慎',
    'Unpredictable': '难以预测',
    'Prefers defence and card advantage': '偏好防守与牌张优势',
    'Aggressive; attacks often': '激进；频繁攻击',
    'Balanced': '均衡',
    'Chaos': '混沌',
    'Contract.': '契约。',

    // ——— 菜单 / 操作项
    'Edit as text': '按文本编辑',
    'Edit as text…': '按文本编辑…',
    'Fix a card': '修正一张牌',
    'Fix it': '修正',
    'Fix it in the editor': '在编辑器中修正',
    'Fix this card…': '修正这张牌…',
    'Keep as is': '保持原样',
    'Keep this name': '保留此名称',
    'Keep playing': '继续对局',
    'Keep them until I close them': '保留到我关闭为止',
    'Take this name': '使用此名称',
    'Use as cover art': '用作封面图',
    'Use the default art': '使用默认画作',
    'Pin a badge': '固定徽章',
    'Pin to your profile': '固定到个人资料',
    'Wear beside your name': '显示在名字旁',
    'Stop wearing beside your name': '不再显示在身边',
    'Remove from graph': '从图表移除',
    'Remove from my list': '从我的列表移除',
    'Remove from staff': '移除工作人员身份',
    'Remove notice': '移除公告',
    'Remove this reveal': '移除这次展示',
    'Replace it': '替换它',
    'Offer it': '提供',
    'Withdraw the offer': '撤回提议',
    'Drop an .esreplay file here, or': '把 .esreplay 文件拖到这里，或',
    'Open a recorded perspective to inspect its actions.': '打开一个已记录的视角来检视其操作。',
    'Open record': '打开记录',
    'Open settings': '打开设置',
    'Open the file again': '重新打开文件',
    'Open Patreon': '打开 Patreon',
    'Leave replay': '离开回放',
    'Leave run': '离开本次挑战',
    'Leave this run?': '离开本次挑战？',
    'Close early…': '提前结束…',
    'Cancel / close': '取消 / 关闭',
    'Keep apart from…': '与…分开',
    'Keep players apart': '让玩家分开',
    'Keep two players apart': '让两名玩家分开',
    'Swap two players': '交换两名玩家',
    'Take it over': '接管',
    'Take off the waitlist': '移出候补',
    'Queue for this': '排队加入',
    'Sort and filter live games': '筛选并排序进行中的对局',
    'Sort and filter tables': '筛选并排序牌桌',
    'Sort matchups by': '对位排序方式',
    'See open tables': '查看开放的牌桌',
    'See the card table': '查看牌张表',
    'See the cards': '查看牌张',
    'Search log': '搜索日志',
    'Search the cards': '搜索牌张',
    'Show it': '显示',
    'Show prompt': '显示提示',
    'Jump to report': '跳到举报',
    'Resume report': '继续处理举报',
    'Report filed': '举报已提交',
    'Reported with no note.': '举报时未附说明。',
    'Screenshots to send': '要发送的截图',
    'Add screenshots': '添加截图',
    'Diagnostics attached': '已附带诊断信息',
    'Describe it first.': '请先描述问题。',
    'What kind of problem': '问题类型',
    'What you did about it': '你做了什么',
    'Jump to report': '跳到举报',
    'Join the Discord': '加入 Discord',
    'Manage on Patreon': '在 Patreon 上管理',
    'Open settings': '打开设置',
    'Search by name — pick the card to seat it on the throne.': '按牌名搜索——选一张牌放上王座。',
    'Click to select': '点击选择',
    'Click your plate to pay 2 life': '点击你的生命板以支付 2 点生命',
    'Confirm empty attacks': '确认不攻击',
    'Confirm to start': '确认并开始',
    'Confirm or pass (legacy)': '确认或让过（旧式）',
    'Confirm (alias)': '确认（别名）',
    'Decline and block': '拒绝并屏蔽',
    'Send every eligible creature at one target you pick next': '让所有可攻击生物攻击你接下来选择的同一个目标',
    'Pass priority until end of turn?': '让过优先权至回合结束？',
    'Before my turn': '我的回合之前',
    'My next turn': '我的下个回合',
    'Active turn.': '当前回合。',
    'Between games': '两盘之间',
    'Bring your own deck.': '自带套牌。',
    'Each takes the other\'s table.': '双方互换牌桌。',
    'The other players go back to the tables list.': '其他玩家回到牌桌列表。',
    'Only the host begins': '仅房主可开始',
    'No one joins once it has started': '开始后不可加入',
    'Starts when you find a match': '找到对局即开始',
    'Players read every list once it starts': '开始后玩家可查看全部牌表',
    'Tournament setup is now limited. Turn this off to use casual games.':
      '比赛设置已受限。关闭它即可使用休闲对局。',
    'Swiss rounds, then an optional top cut.': '瑞士轮，之后可选淘汰赛。',
    'One bracket from the first round. Byes go to the top seeds.': '首轮即为单败淘汰，轮空给头号种子。',
    'Paired again from the next round. Rounds they missed stay missed.': '从下一轮起重新配对，错过的轮次不再补。',
    'Open table': '开放牌桌',
    'Table in play': '对局中的牌桌',
    'Table waiting': '等待中的牌桌',
    'Tables, drafts, deck building.': '牌桌、轮抽、构筑。',
    'The table is silent.': '牌桌上很安静。',
    'Watching this table': '正在观战这张牌桌',
    'No table talk yet.': '还没有桌聊。',
    'No table matches that invite code': '没有牌桌匹配该邀请码',
    'Try another code': '换个代码试试',
    'The code may be mistyped, or the table may have closed.': '代码可能有误，或牌桌已关闭。',
    'That invite is for a table you have already joined.': '该邀请对应的牌桌你已经加入了。',
    'You\'re still in another game': '你还在另一场对局中',
    'You\'re in': '你已进入',
    'You\'re queued for Casual instead of Ranked. Nothing is at stake.':
      '你在休闲队列而非排位队列，没有任何赌注。',
    'You\'ve been eliminated': '你已被淘汰',
    'Still in a game': '仍在某场对局中',
    'You left it, your seat was released for missing picks, or it belongs to another table.':
      '你已离开，或因漏选被收回座位，或该座位属于另一张牌桌。',
    'They lose their place. It cannot be given back.': '他们会失去位置，且无法恢复。',
    'They can join again themselves.': '他们可以自行重新加入。',
    'Left on their own: they can join again themselves.': '自行离开：他们可以重新加入。',
    'Paused by the organizer': '已由主办方暂停',
    'Hand the event on': '移交赛事',
    'You stop helping run this event.': '你将不再协助管理该赛事。',
    'Nobody else helps run this event yet.': '还没有其他人协助管理该赛事。',
    'Events you played in, ran or judged': '你参加过、主持或执裁的赛事',
    'Events with the same series name share a leaderboard.': '同名系列赛的赛事共用一张排行榜。',
    'Leave it empty to take the event out of its series.': '留空即可把该赛事移出系列赛。',
    'The event was cancelled; its reports can no longer be answered.': '赛事已取消，其举报不再受理。',
    'No event in this series has finished yet.': '该系列赛还没有赛事结束。',
    'There is no series at this address, or none of its events are yours to see.':
      '该地址下没有系列赛，或其中没有你可查看的赛事。',
    'Series unavailable': '系列赛不可用',
    'Save series': '保存系列赛',
    'This event could not be read.': '赛事读取失败。',
    'Play your matches by ': '完成对局的截止时间 ',
    'What a missed deadline costs': '错过截止时间的代价',
    'Matches not played by the deadline cost the same as leaving.': '逾期未打的对局与离开代价相同。',
    'No results yet. Standings appear once the first round reports.': '还没有结果，首轮报分后即出现排名。',
    'No standings yet.': '还没有排名。',
    'This round has not been paired yet.': '本轮尚未配对。',
    'The seat deadline has passed': '入座截止时间已过',
    'No part of the match was recorded.': '这场对局没有任何记录。',
    'This recording cannot be drawn': '该录像无法绘制',
    'The recorded board is damaged. Other player views may still be available.':
      '记录的战场已损坏，其他玩家视角可能仍可用。',
    'No actions or events were captured in this perspective.': '该视角没有捕获到任何操作或事件。',
    'No available perspective': '没有可用视角',
    'Recorded on an older version of Endstep. Some board details may look different.':
      '录制于较早版本的 Endstep，部分战场细节可能不同。',
    'Recorded perspectives become reviewable after the match ends.': '对局结束后即可复核已记录的视角。',
    'Original match evidence · all times UTC': '原始对局证据 · 时间均为 UTC',
    'Original messages · all times UTC': '原始消息 · 时间均为 UTC',
    'Recorded UTC time': '记录的 UTC 时间',
    'About this recording': '关于这段录像',
    'Turns, damage, life, outcomes': '回合、伤害、生命、结果',
    'Staff evidence is kept separately from players\' replay access.': '工作人员证据与玩家回放权限分开保存。',
    'You need access to report recordings to review this evidence.': '需要举报录像权限才能查看该证据。',
    'Your access to this report recording has changed.': '你对这段举报录像的权限已变更。',
    'No chat messages were captured.': '没有捕获到聊天消息。',
    'No decisions were recorded.': '没有记录任何决策。',
    'No cards revealed yet.': '还没有牌被展示。',
    'No spells drafted.': '没有抽到咒语。',
    'No days to draw in this window.': '该时间窗内没有可统计的平局。',
    'Couldn\'t load the replay': '无法加载回放',
    'The replay file is damaged.': '回放文件已损坏。',
    'It\'s larger than the viewer can open.': '它超过了查看器可打开的大小。',
    'Replay files aren\'t kept after the page reloads. Choose it again to keep watching.':
      '刷新页面后回放文件不会被保留，重新选择即可继续观看。',
    'Delete replay': '删除回放',
    'It may have been deleted or passed the keep limit.': '它可能已被删除，或超过保留期限。',
    'No decks yet.': '还没有套牌。',
    'No decks on the graph. Add one below.': '图表上还没有套牌，在下面添加一个。',
    'The next decks could not be loaded.': '更多套牌加载失败。',
    'The next cards could not be loaded.': '更多牌张加载失败。',
    'The next archetypes could not be loaded.': '更多原型加载失败。',
    'The cards could not be loaded.': '牌张加载失败。',
    'The ratings could not be loaded.': '评分加载失败。',
    'The matchups could not be loaded. The rest of the page is current.': '对位加载失败，页面其余部分仍是最新的。',
    'The standings couldn\'t be read just now. The record above is unaffected.':
      '暂时无法读取排名，上方记录不受影响。',
    'Your matches couldn\'t be read just now.': '暂时无法读取你的对局。',
    'Your badges couldn\'t be read just now. The record above is unaffected.':
      '暂时无法读取你的徽章，上方记录不受影响。',
    'Couldn\'t load the tables.': '无法加载牌桌。',
    'No one else is online right now.': '现在没有其他人在线。',
    'No emoji found.': '没有找到表情。',
    'No emoji match.': '没有匹配的表情。',
    'No games match.': '没有匹配的对局。',
    'No reports.': '没有举报。',
    'No tournaments yet.': '还没有比赛。',
    'No formats pinned.': '没有固定的赛制。',
    'No shortcuts are starred. Star them in Settings → Controls.': '还没有星标快捷键，可在 设置 → 操控 中星标。',
    'No ranked cube or set is open right now': '当前没有开放排位的立方或系列',
    'No ranked season is open, so there is no season to show. Pick another window.':
      '当前没有开放的排位赛季，无可展示的赛季，请换一个时间窗。',
    'No rating change': '评分无变化',
    'No clock': '不计时',
    'No art': '无画作',
    'No ability text': '无异能文字',
    'No cards': '无牌',
    'No decisions': '无决策',
    'Nothing to build': '没有可构建的内容',
    'Nothing has been changed yet.': '目前还没有任何改动。',
    'Nothing illegal.': '没有违规。',
    'Not applied': '未应用',
    'Not the companion': '不是行侣',
    'Not about a specific match': '不针对具体对局',
    'Did not count': '未计入',
    'Decided matches': '已分胜负的对局',
    'Deciding': '判定中',
    'No rating change': '评分无变化'
  });

  /* ---------- 13. 弹窗 / 菜单 / 提示（二） ---------- */

  Object.assign(DICT, {
    // ——— 对局内提示
    'Game Prompt': '对局提示',
    'Hand → graveyard': '手牌 → 坟墓场',
    'Library → hand (mass-draw collapses)': '牌库 → 手牌（大量抓牌合并）',
    'Battlefield → graveyard (destroy / sacrifice / dies)': '战场 → 坟墓场（消灭 / 牺牲 / 死亡）',
    'A blocker is declared — the clash (Forge sounds blocks, not attacks)':
      '宣告阻挡者时——是撞击声（Forge 播放的是阻挡音，不是攻击音）',
    'ASSIGNED DAMAGE': '已分配伤害',
    'PREVENT': '防止',
    'POSITION 1': '第 1 位',
    'KEYWORDS': '关键字',
    'Land played': '已下地',
    'Casts, combat, triggers.': '施放、战斗、触发。',
    'Hide (the log keeps it)': '隐藏（日志仍会保留）',
    'Hidden from your opponent. Only you may look.': '对对手隐藏，只有你能查看。',
    'Reveal notes stay': '展示备注会保留',
    'Reveals, discards and scries beside the board. They hold while you point at them.':
      '展示、弃牌与占卜记录显示在战场旁，指向时会停住。',
    'Whatever was played this turn stays seen.': '本回合使用过的牌会保持可见。',
    'On every card, in every zone.': '每张牌、每个区域都显示。',
    'Prompt ': '提示',
    'Priority options': '优先权选项',
    'My next turn': '我的下个回合',
    'Before my turn': '我的回合之前',
    'Active turn.': '当前回合。',
    'Confirm empty attacks': '确认不攻击',
    'Confirm to start': '确认并开始',
    'Advances the cursor': '前进光标',
    'Navigate / step values': '导航 / 逐值调整',
    'Move focus': '移动焦点',
    'Next frame': '下一帧',
    'Previous frame': '上一帧',
    'Rewind': '回退',
    'Muted for this match': '本场已禁言',
    'You\'ll auto-pass through the rest of this turn. Cancel anytime with Esc.':
      '本回合剩余时间将自动让过，随时可按 Esc 取消。',
    'That invite is for a table you have already joined.': '该邀请对应的牌桌你已经加入了。',
    'Leave this run?': '离开本次挑战？',
    'My next turn': '我的下个回合',
    'You\'re eliminated.': '你已被淘汰。',

    // ——— 提示浮层 / 音效设置
    'Toast — success': '提示浮层 — 成功',
    'Toast — error': '提示浮层 — 错误',
    'Toast — info': '提示浮层 — 信息',
    'Success toast': '成功提示',
    'Error toast': '错误提示',
    'Info / warning toast': '提示 / 警告浮层',
    'Defeat tone (never celebratory)': '失败音（绝不欢庆）',
    'Spell cast': '施放咒语',
    'Every Button press': '每次按钮按下',
    'Button press': '按钮按下',
    'Clicks and menus.': '点击与菜单。',
    'Dialog / modal opens': '对话框 / 弹窗打开',
    'Dialog / modal closes': '对话框 / 弹窗关闭',
    'Modal open': '弹窗打开',
    'Modal close': '弹窗关闭',
    'Route / view change': '路由 / 视图切换',
    'How quickly effects play in a game.': '对局中效应的播放速度。',
    'INTENSITY': '强度',
    'Volume': '音量',
    'Off keeps your own music playing on a phone.': '关闭后手机上仍会播放你自己的音乐。',
    'On an iPhone or iPad, silent mode silences Endstep too.': '在 iPhone 或 iPad 上，静音模式也会让 Endstep 静音。',
    'On an iPhone or iPad, from Safari.': '在 iPhone 或 iPad 上，通过 Safari 添加。',
    'The other sounds, the turn chimes among them, were made for Endstep.':
      '其余音效（包括回合提示音）都是为 Endstep 制作的。',
    'How to install': '如何安装',
    'Know when a player joins your table or your game starts — even on another tab.':
      '有玩家加入你的牌桌或对局开始时通知你——即使在其他标签页。',
    'Pop-ups on other tabs': '在其他标签页弹窗提醒',
    'Allow pop-ups': '允许弹窗',
    'Allow pop-ups': '允许弹窗',

    // ——— 加载中
    'Loading cards': '正在加载牌张',
    'Loading conversations…': '正在加载会话…',
    'Loading formats': '正在加载赛制',
    'Loading match recording…': '正在加载对局录像…',
    'Loading matchups': '正在加载对位',
    'Loading page…': '正在加载页面…',
    'Loading pool…': '正在加载牌池…',
    'Loading printings…': '正在加载版本…',
    'Loading ratings': '正在加载评分',
    'Loading report evidence…': '正在加载举报证据…',
    'Loading tables…': '正在加载牌桌…',
    'Loading the results…': '正在加载结果…',
    'Loading the sample list': '正在加载示例牌表',
    'Loading the standings…': '正在加载排名…',
    'Loading the table…': '正在加载牌桌…',
    'Reading the art…': '正在读取画作…',
    'Reading the cards…': '正在读取牌张…',
    'Reading the log…': '正在读取日志…',
    'Reading the results…': '正在读取结果…',
    'Reading the series…': '正在读取系列赛…',
    'Reading the standings…': '正在读取排名…',
    'Reading the tournament list…': '正在读取比赛列表…',
    'Reading the tournament…': '正在读取比赛…',
    'Reading the event…': '正在读取赛事…',
    'Checking…': '检查中…',
    'Checking who is ready…': '正在检查谁已就绪…',
    'Looking': '寻找中',
    'Taking a screenshot…': '正在截图…',

    // ——— 校验 / 错误
    'A name is needed.': '需要填写名称。',
    'Choose a length to see when it ends.': '选择时长以查看结束时间。',
    'This name was generated from its cards; no one has chosen it yet.':
      '该名称由牌张自动生成，还没有人选定。',
    'Names and pictures must follow these rules; we may change ones that don’t.':
      '名称与图片须遵守这些规则，不符合的我们可能会修改。',
    'Set a password first, or you\'d have no way in.': '请先设置密码，否则你将无法登录。',
    'Long enough.': '长度足够。',
    'It can\'t be left until it has started. Give it a moment and try again.':
      '开始前无法离开，请稍等片刻再试。',
    'It may have finished or been closed, or the table hasn\'t started dealing yet.':
      '它可能已结束或已关闭，也可能牌桌还没开始发牌。',
    'That picture could not be prepared.': '该图片无法处理。',
    'The clipboard is blocked. Select and copy the list.': '剪贴板被拦截，请手动选中并复制牌表。',
    'Couldn\'t load the tables.': '无法加载牌桌。',
    'Engine refused this submission': '规则引擎拒绝了这次提交',
    'We couldn\'t reach the server, so nothing new was started.': '无法连接服务器，未开始任何新内容。',
    'We couldn\'t confirm that game ended, so nothing new was started.': '无法确认该对局已结束，未开始任何新内容。',
    'The game froze, so this match isn\'t counted.': '对局卡死，本场不计入。',
    'Patreon linking isn\'t available right now.': 'Patreon 绑定当前不可用。',
    'That Patreon account is already linked to another Endstep account.': '该 Patreon 账号已绑定到另一个 Endstep 账号。',
    'Reload the page to update, then open it again.': '刷新页面以更新，然后重新打开。',
    'The old code and every link with it stop working.': '旧代码及所有相关链接都会失效。',
    'Alerts already sent stay sent. It cannot be put back.': '已发出的提醒仍会发出，无法撤回。',
    'This cannot be undone. The flag stops blocking publish for every candidate of this build.':
      '此操作不可撤销：该标记将不再阻止此构建下所有候选版本的发布。',
    'Changes in this editor have not been saved. Leave it and discard your draft?':
      '此编辑器中的改动尚未保存，离开并放弃草稿？',
    'Settings are locked': '设置已锁定',
    'You need a refresh': '需要刷新',
    'Nothing here reads as a card list: one card per line, like “4 Lightning Bolt”.':
      '这里的内容读不出牌表：每行一张牌，例如「4 Lightning Bolt」。',
    'Line breaks and web links are kept.': '换行与网页链接会保留。',
    'Like cubecobra.com/cube/overview/vintagecube, or just vintagecube.':
      '例如 cubecobra.com/cube/overview/vintagecube，或直接填 vintagecube。',

    // ——— 对局侧栏设置项
    'Keys that cannot change': '不可更改的按键',
    'Keys you can change': '可更改的按键',
    'Fixed keys': '固定按键',
    'Navigate / step values': '导航 / 逐值调整',
    'Game win rate by game and by play or draw, wins–losses under each':
      '按盘数、先手后手拆分的对局胜率，各格下方为胜–负',
    'Games won and drawn': '胜与平的对局数',
    'Given for a finish, not counted.': '因名次给予，不计入统计。',
    'Match points summed over finished events. Ties go to average OMW%, then events played.':
      '已结束赛事的比赛积分之和；同分先比平均 OMW%，再比参赛场次。',
    'Marks it as chosen by a person': '标记为人工选定',
    'Merged Cards': '合并的牌',
    'Message a player from the Friends rail or their profile.': '从好友栏或其资料页给玩家发消息。',
    'Only counted matches are measured, as set out under “Which matches count”.':
      '只统计被计入的对局，规则见「哪些对局计入」。',
    'Each player once, at their average rating before their matches in this window.':
      '每位玩家计一次，取其在本时间窗内对局前的平均评分。',
    'Average opponents\' match-win percentage': '对手的平均对局胜率',
    'Ties break on OMW%, then GW%, then OGW%, each opponent counted as at least 33%.':
      '同分依次比较 OMW%、GW%、OGW%，每位对手至少按 33% 计。',
    'One day is one point, so this shows the last 7 days, today marked.':
      '每天一个点，这里显示最近 7 天，今天已标记。',
    'Scored like an automatic bye.': '按自动轮空计分。',
    'Recorded event': '已记录的赛事',
    'Related match': '相关对局',
    'Queue for this': '排队加入',
    'Larger rating ranges': '更大的评分区间',
    'Smaller rating ranges': '更小的评分区间',
    'Limited rating': '限制赛评分',
    'By rating': '按评分',
    'List to show': '显示哪份牌表',

    // ——— 个人资料 / 徽章
    'Pin a badge': '固定徽章',
    'Pin to your profile': '固定到个人资料',
    'Wear beside your name': '显示在名字旁',
    'Stop wearing beside your name': '不再显示在身边',
    'New owner': '新所有者',
    'View picture': '查看图片',
    'Badge glyphs by artist': '徽章符号（按画师）',
    'Never in a bracket': '从未进入淘汰赛',
    'One bracket from the first round. Byes go to the top seeds.': '首轮即为单败淘汰，轮空给头号种子。',
    'Counts a bye': '计入轮空',
    'No art': '无画作',

    // ——— 空状态
    'No reports.': '没有举报。',
    'No games match.': '没有匹配的对局。',
    'No one else is online right now.': '现在没有其他人在线。',
    'No emoji found.': '没有找到表情。',
    'No emoji match.': '没有匹配的表情。',
    'No formats pinned.': '没有固定的赛制。',
    'No shortcuts are starred. Star them in Settings → Controls.': '还没有星标快捷键，可在 设置 → 操控 中星标。',
    'No events yet.': '还没有赛事。',
    'No tournaments yet.': '还没有比赛。',
    'No table talk yet.': '还没有桌聊。',
    'Nothing to build': '没有可构建的内容',
    'Nothing illegal.': '没有违规。',
    'Nothing has been changed yet.': '目前还没有任何改动。',
    'Not applied': '未应用',
    'Not the companion': '不是行侣',
    'Not about a specific match': '不针对具体对局',
    'Open table': '开放牌桌',
    'You\'re in': '你已进入',
    'You\'re still in another game': '你还在另一场对局中',
    'You\'ve been eliminated': '你已被淘汰',
    'Still in a game': '仍在某场对局中',
    'You left it, your seat was released for missing picks, or it belongs to another table.':
      '你已离开，或因漏选被收回座位，或该座位属于另一张牌桌。',
    'You have already offered a draw at this table.': '你已经在这张牌桌提议和局了。',
    'The rematch request was withdrawn.': '再战请求已撤回。',
    'The rematch was declined.': '再战被拒绝。',
    'Their name shows once the match starts.': '对局开始后才会显示其名称。',
    'Their opponents then meet.': '他们的对手随后相遇。',
    'Everyone sees it in the tables list': '所有人都能在牌桌列表中看到',
    'Everyone in the event sees it, and is told.': '赛事内所有人都能看到，并会收到通知。',
    'Your friends see it in the tables list': '你的好友能在牌桌列表中看到',
    'Closed to watchers': '不对观战者开放',
    'Hide bot games': '隐藏与 AI 的对局',
    'Playing': '对局中',
    'Equip / attach': '装备 / 贴附',
    'Block declared': '已宣告阻挡',
    'Combat/spell damage (simultaneous hits collapse)': '战斗/咒语伤害（同时命中合并）',
    'Player-driven tap (mass-tap collapses)': '玩家主动横置（大量横置合并）',
    'Flip': '翻面',
    'SHIELDS': '护盾',
    'Victory toll': '胜利代价',
    'Later undone': '之后被撤销',
    'API terms': 'API 条款',
    'Create': '创建',
    'Got it': '知道了',

    // ——— 对局右侧阶段栏
    'Beginning': '开始阶段',
    'Beg.': '战斗开始',
    'Atk': '宣告攻击者',
    'Blk': '宣告阻挡者',
    'Dmg': '战斗伤害',
    '1st': '先攻',
    'End C.': '结束战斗',
    'Clean': '清理',
    'Your turn': '你的回合',
    'Opp turn': '对手回合',
    'Opponent\'s turn': '对手回合',
    'on your turn': '在你的回合',
    'on the opponent\'s turn': '在对手的回合',
    'Play first': '先手',
    'Draw first': '后手',
    'Would you like to play or draw?': '你想先手还是后手？',
    'M1': '主1',
    'M2': '主2',
    'ET': '结束',
    'CL': '清除',
    'End': '结束',
    'skip ahead': '快进',
    'Show decklist': '查看牌表',
    'Hide decklist': '隐藏牌表',
    'Record a macro': '录制宏',
    'Size': '尺寸',
    'In a game': '对局中',
    'Outside the game': '对局外'
  });

  /* ---------- 18. 对局内文案（GameView） ---------- */

  Object.assign(DICT, {
    'A result was recorded': '已记录结果',
    'Ability order': '异能顺序',
    'Answer the loop shortcut proposal.': '回应循环快捷方式提议。',
    'Arrange cards in the modal.': '在弹窗中排列牌张。',
    'Assign combat damage': '分配战斗伤害',
    'Assign lethal to every blocker first': '先给每个阻挡者分配致命伤害',
    'Assigned nothing.': '未分配。',
    'Attack with none': '不攻击',
    'Attacker order': '攻击者顺序',
    'Auto-yield options': '自动让过选项',
    'Auto-yield set — priority will be passed automatically while this resolves':
      '已设自动让过——此物结算期间将自动让过优先权',
    'Blocker order': '阻挡者顺序',
    'Both players are sideboarding.': '双方都在换备牌。',
    'Bottom of Library': '牌库底',
    'CMDR TAX': '指挥官税',
    'Choose card(s) — pick on the board or in the modal.': '选择牌——在战场上或弹窗中点选。',
    'Choose cards': '选择牌',
    'Choose mana': '选择法术力',
    'Choose target(s) — click on the board or pick in the modal.': '选择目标——在战场上点选或在弹窗中选择。',
    'Choose targets': '选择目标',
    'Chose nothing.': '未选择。',
    'Click +1 · Right-click −1 · Ctrl-click lethal': '左键 +1 · 右键 −1 · Ctrl 点击分配致命',
    'Click a blocker, then click an attacker to assign.': '先点阻挡者，再点攻击者来分配。',
    'Click the target your attackers swing at': '点击你的攻击者的攻击目标',
    'Click your creatures to attack': '点击你的生物进行攻击',
    'Click your creatures to attack. Press A for alpha strike.': '点击你的生物进行攻击。按 A 全体进攻。',
    'Close active effects': '关闭生效中的效应',
    'Close details': '关闭详情',
    'Close game log': '关闭对局日志',
    'Close reveals panel': '关闭展示面板',
    'Closest to bottom': '最接近牌库底',
    'Collapse the stack': '折叠堆叠',
    'Concede game': '认输本盘',
    'Concede game?': '认输本盘？',
    'Concede match': '认输本场',
    'Concede match?': '认输本场？',
    'Confirm damage assignment': '确认伤害分配',
    'Copy log': '复制日志',
    'Distribute combat damage in the bar above the hand.': '在手牌上方的横条中分配战斗伤害。',
    'Distribute shield counters in the bar above the hand.': '在手牌上方的横条中分配护盾指示物。',
    'Done Selecting Attackers': '完成选择攻击者',
    'Don’t apply': '不应用',
    'Drag to reorder, click to swap zones, Space + ←/→ via keyboard':
      '拖动可重排，点击可换区，键盘用 Space + ←/→',
    'Drag to resize hand cards': '拖动调整手牌大小',
    'Drag to resize · double-tap to reset': '拖动调整大小 · 双击重置',
    'Drag to resize, or to the edge to hide · Enter hides or shows · double-tap to reset':
      '拖动调整大小，拖到边缘可隐藏 · Enter 显示/隐藏 · 双击重置',
    'Face-down card': '牌面朝下的牌',
    'Follow a player': '跟随一名玩家',
    'Game drawn.': '平局。',
    'Game lost.': '本盘失利。',
    'Game notices': '对局提示',
    'Game rail — player plates and actions': '对局侧栏——玩家生命板与操作',
    'Game won.': '本盘获胜。',
    'Hidden card': '隐藏的牌',
    'Hide recorded prompt': '隐藏已记录的提示',
    'Hide recorded prompt to see the board': '隐藏已记录的提示以查看战场',
    'Hold priority — Ctrl+Shift to keep priority after you cast and pause auto-yields':
      '保留优先权——Ctrl+Shift，施放后保留优先权并暂停自动让过',
    'Hold priority — click or press Ctrl+Shift to keep priority after you cast and pause auto-yields':
      '保留优先权——点击或按 Ctrl+Shift，施放后保留优先权并暂停自动让过',
    'Holding priority — click or press Ctrl+Shift to release': '正保留优先权——点击或按 Ctrl+Shift 释放',
    'Holding priority, auto-yields paused — click or press Ctrl+Shift to release':
      '正保留优先权、自动让过已暂停——点击或按 Ctrl+Shift 释放',
    'Holding priority. Auto-yields are paused until you release it. Ctrl+Shift to release.':
      '正保留优先权。自动让过于释放前暂停，Ctrl+Shift 释放。',
    'Holding priority. Ctrl+Shift to release.': '正保留优先权，Ctrl+Shift 释放。',
    'Invalid attack declaration — adjust your attackers.': '攻击宣告不合法——请调整攻击者。',
    'Invalid block assignment': '阻挡分配不合法',
    'Keep on Top': '留在牌库顶',
    'Kept the hand.': '保留了这手牌。',
    'Log actions': '记录操作',
    'Message hidden': '消息已隐藏',
    'Minimize reveal tracker': '最小化展示追踪',
    'Move to decision panel': '移到决策面板',
    'Mulligan to': '调度至',
    'Mute chat': '禁言聊天',
    'Mute chat: hide new messages for the rest of this match': '禁言聊天：本场剩余时间内隐藏新消息',
    'No answer recorded.': '无应答记录。',
    'No attackers chosen — confirm to attack with none, or pick a creature.':
      '未选择攻击者——确认不攻击，或选择一只生物。',
    'No blocks.': '不阻挡。',
    'No card is revealed on top of your library.': '你的牌库顶没有展示的牌。',
    'No result': '无结果',
    'No targets.': '无目标。',
    'Nothing to arrange': '没有可排列的内容',
    'Now click what it attacks': '现在点击它的攻击对象',
    'Open opponent': '打开对手',
    'Opponent has priority': '对手拥有优先权',
    'Order attackers in the modal.': '在弹窗中排列攻击者顺序。',
    'Order blockers in the modal.': '在弹窗中排列阻挡者顺序。',
    'Order cards put into Exile': '排列放入放逐区的牌',
    'Order cards put into your Graveyard': '排列放入你坟墓场的牌',
    'Order cards put on the bottom of your Library': '排列放到你牌库底的牌',
    'Order cards put onto the Battlefield': '排列进入战场的牌',
    'Ordered cards': '已排列的牌',
    'Paid automatically.': '已自动支付。',
    'Paid life.': '已支付生命。',
    'Pass priority shortcuts': '让过优先权快捷键',
    'Paused. “Disable auto-yields” is on.': '已暂停：已开启「关闭自动让过」。',
    'Pay mana': '支付法术力',
    'Pay mana — tap lands or use Auto-Pay below the hand.': '支付法术力——横置地，或使用手牌下方的自动支付。',
    'Pending actions': '待处理操作',
    'Phase tracker and match score': '阶段追踪与比分',
    'Put first': '放在最上',
    'Recorded decision': '已记录的决策',
    'Recorded game.': '已记录对局。',
    'Refused by the game:': '引擎拒绝：',
    'Rematch unavailable. Returning to lobby.': '无法再战，正在返回大厅。',
    'Remove all revealed cards from panel': '从面板移除所有已展示的牌',
    'Replacement effect': '替代效应',
    'Resize battlefield split': '调整战场分隔',
    'Resize left rail': '调整左侧栏宽度',
    'Resize panel': '调整面板大小',
    'Resize right rail': '调整右侧栏宽度',
    'Resolve earlier (move left)': '提前结算（左移）',
    'Resolve later (move right)': '延后结算（右移）',
    'SIDEBOARD / LESSONS': '备牌 / 课程',
    'Scroll to newest events': '滚动到最新事件',
    'Search cards by name or type': '按牌名或类别搜索',
    'Search game log': '搜索对局日志',
    'Shared graveyard': '共享坟墓场',
    'Show castable cards only': '仅显示可施放的牌',
    'Showing top-of-library cards': '正在显示牌库顶的牌',
    'Showing top-of-library cards revealed to you.': '正在显示向你展示的牌库顶牌。',
    'Someone scried': '有人占卜',
    'Someone surveiled': '有人刺探',
    'Spent none of it.': '一点都没用。',
    'Stop spectating and leave this game': '停止观战并离开本局',
    'Submitted your deck.': '已提交你的套牌。',
    'Toggle search': '切换搜索',
    'Took a mulligan.': '已调度。',
    'Top of Library': '牌库顶',
    'Type name…': '输入名称…',
    'Unmute chat: show the messages hidden since you muted it': '解除禁言：显示禁言后隐藏的消息',
    'Use this order without asking whenever these same effects meet again this game. Forget it under Auto-yields.':
      '本局内再次遇到相同效应时不再询问，直接用此顺序。可在「自动让过」中忘记。',
    'Waiting on you': '等待你操作',
    'Withdrew your deck.': '已撤回你的套牌。',
    'You conceded the game.': '你认输了本盘。',
    'You conceded the match.': '你认输了本场。',
    'You have creatures that could attack': '你有可以攻击的生物',
    'You passed.': '你让过了。',
    'You took back your last action.': '你撤回了上一个操作。',
    'Your decision': '你的决策',
    'Your priority': '你的优先权',
    'Zone card size': '区域牌张尺寸',
    'Zone is empty.': '区域是空的。',
    'An ambient loop': '环境循环音',
    'Next card': '下一张牌'
  });
  /* ---------- 19. 牌桌页与全局（TableView / main） ---------- */

  Object.assign(DICT, {
    // 对局内剩余
    'Confirm Order': '确认顺序',
    'Order Cards': '排列牌张',
    'Order Abilities': '排列异能',
    'Commander Effect': '指挥官效应',
    'Expand reveal tracker': '展开展示追踪',
    'Accept Rematch': '接受再战',
    'Skip Combat': '跳过战斗',
    'Confirm Pass': '确认让过',

    // 牌桌
    'Casual games': '休闲对局',
    'Begin the draft': '开始轮抽',
    'Begin sealed': '开始现开',
    'Rich Man': '里奇曼',
    'No ranked season is running, so nothing rates right now.': '当前没有进行中的排位赛季，暂不计分。',
    'This format has no ranked ladder right now.': '该赛制当前没有排位天梯。',
    'Set a password or link Discord, and this table will count toward your rating.':
      '设置密码或绑定 Discord 后，这张牌桌才会影响你的评分。',
    'Your account cannot play ranked at the moment.': '你的账号目前无法进行排位。',
    'Ranked opens once your account is 3 days old and has finished 3 matches.':
      '账号满 3 天并完成 3 场对局后开放排位。',
    'One of the seats cannot play ranked, so this match will not count.': '有一个座位无法排位，本场不计分。',
    'Both chairs are the same account, so there is nothing to rate.': '两个座位是同一账号，无可计分。',
    'Ranked is played against people, so a bot seat will not count.': '排位是对人进行的，AI 座位不计分。',
    'Lobby not found': '未找到牌桌',
    'The host removed you from the table.': '房主把你移出了牌桌。',
    'Chat is offline.': '聊天已离线。',
    'Failed to start draft': '开始轮抽失败',
    'Failed to start sealed': '开始现开失败',
    'Failed to update visibility': '更新可见性失败',
    'Failed to update format': '更新赛制失败',
    'Failed to add the bot': '添加 AI 失败',
    'Failed to remove the bot': '移除 AI 失败',
    'Failed to rename the table': '重命名牌桌失败',
    'Failed to change format': '更换赛制失败',
    'Not ready': '未就绪',
    'Open seat': '空座',
    'Link copied': '链接已复制',
    'Copy invite link': '复制邀请链接',
    'Decks are drafted during play.': '套牌在对局中轮抽产生。',
    'Choose its deck': '选择它的套牌',
    'Auto-pilot, mirrors your deck': '自动驾驶，镜像你的套牌',
    'Choose the AI': '选择 AI',
    'Bring a deck. Banlist applies.': '自带套牌，适用禁牌表。',
    'Open packs, pick cards, pass left.': '开包、选牌、向左传。',
    'Open six packs, build a 40-card deck.': '开六个补充包，构筑 40 张套牌。',
    'No deck, random creatures each turn.': '不设套牌，每回合随机生物。',
    'Starting life': '起始生命',
    'One random set for the whole draft': '整场轮抽使用一个随机系列',
    'Every pack from a different set': '每包来自不同系列',
    'The host is choosing a cube': '房主正在选择立方',
    'Set for every pack': '每包同一系列',
    'Sealed packs': '现开补充包',
    'Draft packs': '轮抽补充包',
    'Same set for every pack': '每包同一系列',
    'A set per pack': '每包一个系列',
    'Deck building time not saved.': '构筑时间未保存。',
    'Needs a second player.': '还需第二名玩家。',
    'Trying again…': '正在重试…',
    'Chosen by the host': '由房主选择',
    'The host is choosing': '房主正在选择',
    'Mode not loaded': '模式未加载',
    'Your table stays open': '你的牌桌会保持开放',
    'You keep your seat': '你的座位会保留',
    'More for this table': '此牌桌的更多操作',
    'Say hello': '打个招呼',
    'The draft is starting': '轮抽即将开始',
    'The packs are opening': '正在开包',
    'Game 1 is starting': '第一盘即将开始',

    // 全局（举报 / 公告 / 错误）
    'Pinned badges': '已固定的徽章',
    'No messages yet. Say hello.': '还没有消息，打个招呼吧。',
    'Load earlier': '加载更早的',
    'Abusive or hateful messages': '辱骂或仇恨言论',
    'Cheating or colluding': '作弊或串通',
    'Stalling or leaving games': '拖延或中途离开',
    'Offensive name or picture': '冒犯性名称或图片',
    'Commander bracket dispute': '指挥官分级争议',
    'Something else': '其他问题',
    'Slow play is not stalling.': '慢打不等于拖延。',
    'Dismiss this announcement': '关闭此公告',
    'Deleted player': '已删除的玩家',
    'Choose the match this happened in.': '选择发生此事的对局。',
    'Say what happened.': '描述发生了什么。',
    'This tab is running an older version of the app. Reload to pick up the latest.':
      '此标签页运行的版本较旧，刷新即可获取最新版。',
    'Clear and reload': '清除并刷新',
    'Too long: use a smaller unit': '过长：请改用更小的单位',
    'Back to top': '回到顶部',
    'Back to Lobby': '返回大厅',
    'Back to my game': '返回我的对局',
    'Back to the table': '返回牌桌',
    'Anyone can join': '任何人都可加入',
    'After the draft, at your own pace': '轮抽结束后，按自己的节奏构筑',
    'At a table': '在牌桌上',
    'At your own pace': '按自己的节奏',
    'Available to staff': '工作人员可见',
    'Board menu': '战场菜单',
    'An opponent': '一名对手',
    'Account banned': '账号已封禁',
    'Alerts on': '提醒已开',
    'Alerts off': '提醒已关'
  });
  /* ---------- 20. 全局提示（main） ---------- */

  Object.assign(DICT, {
    'A gold frame for your profile picture': '头像的金色边框',
    'An ornate violet frame for your profile picture': '头像的华丽紫色边框',
    'A supporter name colour and sigil': '支持者的名字颜色与徽记',
    'A username is 3 to 32 characters.': '用户名长度为 3 到 32 个字符。',
    'A username is at most 64 characters.': '用户名最多 64 个字符。',
    'A warning from Endstep Moderation': '来自 Endstep 版务的警告',
    'Access from this connection is restricted.': '此网络连接已被限制访问。',
    'Add details or screenshots to this report. Moderators may reply here.':
      '为这次举报补充细节或截图，版主可能会在这里回复。',
    'Any clock': '不计时',
    'Back to Social': '返回社交',
    'Back to conversations': '返回会话列表',
    'Back to my games': '返回我的对局',
    'Being rated': '计分中',
    'Booster Draft': '补充包轮抽',
    'Cancel reply': '取消回复',
    'Casual games only — ranked uses the ladder': '仅休闲对局——排位请走天梯',
    'Choose commanders': '选择指挥官',
    'Choose emoji': '选择表情',
    'Choose the match…': '选择对局…',
    'Community and help': '社区与帮助',
    'Concede and continue': '认输并继续',
    'Conceding forfeits the whole match, not just the current game.':
      '认输会放弃整场对局，而不只是当前这一盘。',
    'Conversations and friends': '会话与好友',
    'Could not start a guest session.': '无法开始访客会话。',
    'Create account': '创建账号',
    'Dismiss announcement': '关闭公告',
    'Dismiss table notice': '关闭牌桌提示',
    'Drafting now': '正在轮抽',
    'Either stakes': '两者皆可',
    'Emoji options': '表情选项',
    'Enable notifications': '开启通知',
    'Endstep home': 'Endstep 首页',
    'ErrorBoundary caught:': '捕获到异常：',
    'Failed to block. Try again.': '屏蔽失败，请重试。',
    'Failed to join lobby': '加入牌桌失败',
    'Failed to unblock. Try again.': '取消屏蔽失败，请重试。',
    'Finishing matches brings the cost of leaving back down.': '把对局打完可以让中途离开的代价降回来。',
    'Friend requests': '好友请求',
    'Hide password': '隐藏密码',
    'Hide your recent reports': '隐藏你的最近举报',
    'In the queue': '在队列中',
    'Keep on Play': '固定在「对战」页',
    'Leaving again before your free leave returns costs rating.': '在免费离开次数恢复前再次离开会扣评分。',
    'Load older': '加载更早的',
    'Load older conversations': '加载更早的会话',
    'Loading your report…': '正在加载你的举报…',
    'Lobby not found with that invite code': '该邀请码没有对应的牌桌',
    'Login failed.': '登录失败。',
    'Looking for an opponent': '正在寻找对手',
    'Maintenance notice': '维护公告',
    'Match in progress': '对局进行中',
    'Matchmaking is paused.': '匹配已暂停。',
    'Message failed to send.': '消息发送失败。',
    'Message not sent.': '消息未发送。',
    'Metagame anchor is not ready': '环境基准尚未就绪',
    'Metagame edition does not match this page': '环境版本与此页不符',
    'Metagame edition expired': '环境版本已过期',
    'Metagame edition unavailable': '环境版本不可用',
    'Metagame page is out of order': '环境页面顺序异常',
    'Metagame response does not match this page': '环境数据与此页不匹配',
    'Metagame selection changed': '环境选择已变更',
    'More pages': '更多页面',
    'New games are paused for a moment.': '新对局暂停片刻。',
    'No friends or messages yet.': '还没有好友或消息。',
    'No recent matches found. You can still send this report.': '没有找到最近的对局，但你仍可提交这次举报。',
    'No root element': '缺少根元素',
    'Not now': '暂不',
    'Not sent.': '未发送。',
    'Opponent mulliganed to 7': '对手调度至 7 张',
    'Pasted image': '粘贴的图片',
    'Patreon and Discord': 'Patreon 与 Discord',
    'Pick in your draft soon, or your seat goes to a bot': '尽快选牌，否则你的席位将交给 AI',
    'Pin to Play': '固定到「对战」页',
    'Players in the queue': '队列中的玩家',
    'Ranked opponents stay anonymous until the game starts.': '排位对手在对局开始前保持匿名。',
    'Reading the invite': '正在读取邀请',
    'Registration failed.': '报名失败。',
    'Security check': '安全校验',
    'Sending screenshots…': '正在发送截图…',
    'Show password': '显示密码',
    'Sideboard your deck': '调整你的备牌',
    'Sign in to add friends.': '登录后才能添加好友。',
    'Site information and credits': '站点信息与鸣谢',
    'Sound off. Levels are in Settings.': '声音已关闭，音量可在设置中调整。',
    'Sound on.': '声音已开启。',
    'Target spell': '目标咒语',
    'That report was already removed from your list.': '该举报已从你的列表中移除。',
    'The password needs 8 or more characters.': '密码至少需要 8 个字符。',
    'The security check could not load. Check your connection and reload the page.':
      '安全校验加载失败，请检查网络后刷新页面。',
    'The security check hit a problem. Reload the page and try again.': '安全校验出错，请刷新页面重试。',
    'This account has been banned.': '该账号已被封禁。',
    'This account is banned permanently.': '该账号已被永久封禁。',
    'This game is still starting. Try again in a moment.': '对局仍在开始中，请稍后再试。',
    'This report is closed. If something new happens, file a new report.':
      '该举报已结案。若有新情况，请重新提交举报。',
    'Tick at least one format.': '请至少勾选一个赛制。',
    'Type your password.': '输入你的密码。',
    'Type your username.': '输入你的用户名。',
    'Wait a few seconds before the next quick reply.': '等几秒后再发下一条快捷回复。',
    'Your chat is muted. You can only send quick replies.': '你的聊天已被禁言，只能发送快捷回复。',
    'Your free leave comes back once you go a while without leaving.': '一段时间不中途离开后，免费离开次数会恢复。',
    'Your move': '该你行动',
    'Your recent reports': '你的最近举报',
    'Your rematch request was declined.': '你的再战请求被拒绝。',
    'Your table is ready.': '你的牌桌已就绪。',
    'Your tournament table is open': '你的比赛牌桌已开放',
    'Opponent is deciding…': '对手正在决策…',
    'Not implemented yet': '尚未实现',
    'Not saved': '未保存'
  });

  /* ---------- 21. 设置 / 视觉 / 手牌缩放 ---------- */

  Object.assign(DICT, {
    // 账号设置
    'Allowed. Alerts reach you on another tab or app.': '已允许。提醒会送到其他标签页或应用。',
    'Blocked in this browser': '已被此浏览器拦截',
    'Change picture': '更换图片',
    'Check pledge': '检查赞助状态',
    'Could not delete your account. Nothing was deleted.': '无法注销账号，未删除任何内容。',
    'Could not save. Try again.': '保存失败，请重试。',
    'Discord unlinked. Sign in with your name and password.': '已解绑 Discord。请用用户名和密码登录。',
    'Just checked. Give it a minute before trying again.': '刚检查过，请稍等一分钟再试。',
    'Linked. Set a password before you unlink it.': '已绑定。解绑前请先设置密码。',
    'Linked. You can sign in with Discord or your password.': '已绑定。你可以用 Discord 或密码登录。',
    'No pledge found on that Patreon account yet.': '该 Patreon 账号上还没有查到赞助。',
    'Not linked. Link it to sign in with Discord.': '未绑定。绑定后即可用 Discord 登录。',
    'Patreon unlinked. Your mark is gone from your name.': '已解绑 Patreon，名字旁的支持者标记已移除。',
    'Picture removed.': '图片已移除。',
    'Save picture': '保存图片',
    'That file could not be read as an image.': '该文件无法作为图片读取。',
    'That image is very large. Try one under 12 MB.': '图片过大，请用 12 MB 以下的。',
    'This browser can': '此浏览器可以',
    'This can': '这可以',
    'Upload a profile picture': '上传头像',
    'Use your browser': '使用你的浏览器',
    'Your account was deleted.': '你的账号已注销。',
    'Your account was deleted. Other open tabs may stay signed in for a few minutes.':
      '你的账号已注销。其他已打开的标签页可能还会保持登录几分钟。',
    'Your picture, framed. Drag or use the arrow keys to move it, plus and minus to zoom.':
      '头像的取景框。拖动或用方向键移动，加减号缩放。',
    'When a game needs your move, someone joins your table, or a game starts.':
      '当对局需要你行动、有人加入你的牌桌，或对局开始时。',

    // 头像与密码
    'Change password': '修改密码',
    'Could not change your name back.': '无法把名称改回去。',
    'Could not change your name.': '无法修改名称。',
    'Could not change your password.': '无法修改密码。',
    'Default keys': '默认按键',
    'Esc cancels': 'Esc 取消',
    'Every key is back to its default.': '所有按键已恢复默认。',
    'Names starting with deleted_ are reserved.': '以 deleted_ 开头的名称已被保留。',
    'Names starting with guest_ are reserved.': '以 guest_ 开头的名称已被保留。',
    'Not set.': '未设置。',
    'Notes stay until closed': '备注会保留到关闭为止',
    'Password changed. Your other devices are signed out.': '密码已修改，其他设备已退出登录。',
    'Password set. You can sign in with your name too.': '密码已设置，你也可以用用户名登录。',
    'Set password': '设置密码',
    'Settings sections': '设置分区',
    'Sound back to its defaults.': '声音已恢复默认。',
    'The two don': '两者不能',
    'Then you can also sign in with your name.': '之后你也可以用用户名登录。',
    'Type your current password.': '输入当前密码。',
    'Your device asks for less motion, so effects are kept to a minimum whatever you choose.':
      '你的设备要求减少动效，因此无论怎么选，效果都会保持最低限度。',
    'Your other devices are signed out.': '你的其他设备已退出登录。',

    // 视觉效果
    'Full effects': '完整特效',
    'Subtle effects': '轻量特效',
    'No effects': '无特效',
    'Glows, trails and impacts in a game.': '对局中的光效、拖尾与冲击效果。',
    'Scales every level below.': '按比例缩放以下所有等级。',

    // 手牌缩放 / 施放
    'Attack target': '攻击目标',
    'Auto-passing to': '自动让过至',
    'Auto-passing until': '自动让过至',
    'Battlefield card size range': '战场牌张尺寸范围',
    'Blocker selected': '已选阻挡者',
    'Selected blocker': '已选阻挡者',
    'Cancel pass-until': '取消「让过至」',
    'Cancel — abandon this before anything is paid': '取消——在支付任何费用前放弃',
    'Click or press Escape to cancel': '点击或按 Esc 取消',
    'Fan out': '展开',
    'Maximum card size': '最大牌张尺寸',
    'Minimum card size': '最小牌张尺寸',
    'Next turn': '下个回合',
    'No legal way to auto-pay this cost from your current mana': '以你当前的法术力，无法自动支付此费用',
    'Report stalling': '举报拖延',
    'Show all attached cards': '显示全部贴附的牌',
    'Skip — cast this with no modes chosen': '跳过——不选模式直接施放',
    'Skipping to': '跳至',
    'Stop this cast. What the cost has already taken is NOT returned — use Undo to take the whole cast back instead':
      '中止这次施放。已支付的费用不会退回——如需完整撤回，请用「撤销」。',
    'Take back the whole action you are in the middle of, including anything already paid':
      '撤回你正在进行的整个操作，包括已支付的部分',
    'Take back the whole cast — the board returns to before it started': '撤回整次施放——战场回到施放前',
    'Undo last action': '撤销上一个操作'
  });

  /* ---------- 22. 构筑与牌池 ---------- */

  Object.assign(DICT, {
    'Add to command zone': '加入指挥官区',
    'Change cover art': '更换封面图',
    'Changed the cover.': '封面已更换。',
    'Clear the companion': '清除行侣',
    'Colorless commander': '无色指挥官',
    'Colour of its mana symbols': '按法术力符号的颜色',
    'Couldn’t save the preferred printing. Try again.': '无法保存版本偏好，请重试。',
    'Cover art': '封面图',
    'Deck part': '套牌部分',
    'Fills this cube': '填满这个立方',
    'It fills this deck.': '它填满了这套牌。',
    'It replaces this deck': '它会替换这套牌',
    'Legality could not be checked.': '无法检查合法性。',
    'Make commander': '设为指挥官',
    'No other printings of this card.': '这张牌没有其他版本。',
    'No preference': '无偏好',
    'Not companion': '不是行侣',
    'Nothing here reads as a card list.': '这里的内容读不出牌表。',
    'Nothing in the clipboard reads as a card list.': '剪贴板里的内容读不出牌表。',
    'One card per line, like “4 Lightning Bolt”. A line saying “Sideboard” starts the sideboard.':
      '每行一张牌，例如「4 Lightning Bolt」。出现「Sideboard」行即开始备牌。',
    'Prefer printing': '偏好版本',
    'Previous card': '上一张牌',
    'Replaces the list (it asks first)': '替换现有牌表（会先询问）',
    'The clipboard could not be read. Check your browser': '无法读取剪贴板，请检查浏览器权限',
    'The clipboard is bare. Copy a card list first.': '剪贴板是空的，请先复制牌表。',
    'The cover could not be changed. Try again in a moment.': '封面更换失败，请稍后再试。',
    'The cube could not be made.': '无法创建立方。',
    'The deck did not bind. Try again.': '套牌未能绑定，请重试。',
    'What is not legal': '不合法之处',

    // 限制赛构筑
    'Deck-building time has ended': '构筑时间已结束',
    'Draft pool': '轮抽牌池',
    'Failed to submit deck': '提交套牌失败',
    'In your deck': '在你的套牌中',
    'In your sideboard': '在你的备牌中',
    'Mainboard must be at least 40 cards': '主牌至少需要 40 张',
    'Move 1 to the deck': '移 1 张到套牌',
    'Move 1 to the sideboard': '移 1 张到备牌',
    'No grouping': '不分组',
    'Register deck': '登记套牌',
    'Retry registration': '重试登记',
    'Save deck': '保存套牌',
    'Save deck to my library': '保存套牌到我的牌库',
    'Save to your decks': '保存到你的套牌',
    'Sealed pool': '现开牌池',
    'Submit deck': '提交套牌',
    'To sideboard': '移到备牌',
    'To the deck': '移到套牌',
    'Your list is saved to your decks as': '你的牌表已保存到「我的套牌」，名称为',
    'Points in ': '计分项：',
    'The deck ': '这套牌'
  });

  /* ---------- 23. 排位轮抽 / 手机端 / 回放 / 环境套牌 ---------- */

  Object.assign(DICT, {
    // 排位轮抽
    'Anyone who doesn’t confirm in time loses their place.': '未按时确认的人会失去位置。',
    'Closest rating first, then wider': '优先最近评分，再逐步放宽',
    'Confirm now': '立即确认',
    'Could not confirm. Try again.': '确认失败，请重试。',
    'Could not enter that run.': '无法进入该次挑战。',
    'Could not join the pod.': '无法加入多人桌。',
    'Could not join the queue.': '无法加入队列。',
    'Could not leave the pod queue.': '无法退出多人桌队列。',
    'Could not leave the queue.': '无法退出队列。',
    'Could not leave the run.': '无法退出本次挑战。',
    'How a run works': '挑战如何运作',
    'If you don’t confirm in time, you stop looking. It costs nothing.': '若未按时确认，将停止寻找；不产生任何代价。',
    'No matches played yet.': '还没有进行过对局。',
    'Ranked is closed right now': '排位当前关闭',
    'Ranked is in testing': '排位正在测试',
    'Ranked isn’t open to you yet': '排位尚未向你开放',
    'Ranked runs and open tables for draft and sealed.': '排位挑战，以及轮抽与现开的开放牌桌。',
    'Run complete.': '挑战完成。',
    'The match starts when you both have. Your opponent is named when it starts.':
      '双方都就绪后开始对局，对手名称会在开始时显示。',
    'What happens next': '接下来会发生什么',
    'You can join a pod again in': '你可以再次加入多人桌：',
    'You left a draft recently, so the pod queue is closed to you for a while.':
      '你最近中途退过轮抽，因此一段时间内无法进入多人桌队列。',
    'Your Limited rating is being updated.': '你的限制赛评分正在更新。',
    'Your Limited rating moves once, when the run ends.': '限制赛评分在挑战结束时只变动一次。',
    'Your Limited rating moves once, when the run ends. Leaving a run early can cost rating.':
      '限制赛评分在挑战结束时只变动一次。中途退出可能扣评分。',
    'Your matches': '你的对局',
    'Your pod is ready': '你的多人桌已就绪',

    // 手机端
    'Attack none?': '不攻击？',
    'Auto-passing continuously': '持续自动让过',
    'Auto-passing this turn': '本回合自动让过',
    'Confirm pass — mana will be lost': '确认让过——法术力会流失',
    'Hand restored': '手牌已展开',
    'Hand tucked': '手牌已收合',
    'Keep six or mulligan?': '保留 6 张，还是调度？',
    'No attackers — tap Attack none? again to confirm': '没有攻击者——再次点击「不攻击？」以确认',
    'Now tap what it attacks': '现在点击它的攻击对象',
    'Opponent seats': '对手座位',
    'Pass until end of turn. Long-press for more skip options.': '让过至回合结束。长按可查看更多让过选项。',
    'Pay 2 life for Phyrexian mana': '支付 2 点生命代替非瑞克西亚法术力',
    'Phase steps and stops': '阶段与停止点',
    'Phase steps and stops — changed from the defaults': '阶段与停止点——已非默认',
    'Phase stops changed from the defaults': '阶段停止点已非默认',
    'Phase stops changed from the defaults — open priority options to reset':
      '阶段停止点已非默认——打开优先权选项可重置',
    'Priority options — hold priority and pass-until': '优先权选项——保留优先权与让过至',
    'Resize hand cards': '调整手牌大小',
    'Resize the action dock': '调整操作栏大小',
    'Show your hand': '显示你的手牌',

    // 回放
    'Download failed. Try again.': '下载失败，请重试。',
    'Leave the replay': '离开回放',
    'Loading replay…': '正在加载回放…',
    'Older version': '较早的版本',
    'Opened from a file on this device. It was not uploaded.': '从本机文件打开，未上传。',
    'Partial recording': '部分录像',
    'Pin a card preview': '固定一张牌的预览',
    'Playback speed': '播放速度',
    'Preparing replay…': '正在准备回放…',
    'Previous / next game': '上一盘 / 下一盘',
    'Previous / next turn': '上一个 / 下一个回合',
    'Recorded on an older version of Endstep. Some details may look different.':
      '录制于较早的 Endstep 版本，部分细节可能不同。',
    'Recording ends before the match did.': '录像在对局结束前中断了。',
    'Replay controls': '回放控制',
    'Replay position': '回放进度',
    'Show passes': '显示让过',
    'Skipped a part that wasn': '跳过了一段未能',
    'The match was drawn.': '本场对局为平局。',
    'The recording stops before the match ended.': '录像在对局结束前中断。',
    'You lost the match.': '你输掉了本场对局。',
    'You won the match.': '你赢下了本场对局。',

    // 环境套牌页
    'Captured cards copied. The registration may be incomplete.': '已复制捕获的牌，登记可能不完整。',
    'Close other sample lists': '关闭其他示例牌表',
    'Copy captured cards': '复制捕获的牌',
    'Copy main deck': '复制主牌',
    'Decklist copied.': '牌表已复制。',
    'Highest first': '从高到低',
    'In every list, so there is nothing to compare it with': '每份牌表都有，因此无从比较',
    'Lowest first': '从低到高',
    'Main deck copied.': '主牌已复制。',
    'Matches against it': '对阵它的对局',
    'Minimum matches': '最少对局数',
    'No archetypes meet these filters in this window.': '该时间窗内没有原型满足这些筛选条件。',
    'No cards in this window.': '该时间窗内没有牌张数据。',
    'No list is shown.': '没有显示牌表。',
    'No sideboard cards in this window.': '该时间窗内没有备牌数据。',
    'No won toss with a recorded choice in this window.': '该时间窗内没有记录到「掷骰获胜后选择先后手」的数据。',
    'Other sample lists': '其他示例牌表',
    'Play and draw': '先手与后手',
    'Rating bins': '评分离散区间',
    'Show ratings as': '评分显示方式',
    'The sideboard and commanders are not shown.': '未显示备牌与指挥官。'
  });

  /* ---------- 24. 赛事管理（EventPage） ---------- */

  Object.assign(DICT, {
    'A player still gone when reconnect grace runs out is dropped.': '重连宽限期结束仍未回来的人会被移出。',
    'About the event.': '关于该赛事。',
    'Add to a series': '加入系列赛',
    'Allow back': '允许回来',
    'Allowed, before or during a game': '允许，对局开始前或进行中均可',
    'An entry code from the organizer.': '主办方提供的入场码。',
    'Ask them to allow you back, then join again here.': '请对方允许你回来，然后在此重新加入。',
    'Between matches': '对局之间',
    'Bye for': '轮空给',
    'Change series': '更换系列赛',
    'Check-in is not open yet.': '签到尚未开放。',
    'Checking in…': '正在签到…',
    'Closed at the start': '开始时关闭',
    'Copy link to this event': '复制该赛事的链接',
    'Deck building status': '构筑状态',
    'Decklists are open: every list can be read once the event starts.': '牌表公开：赛事开始后所有人都能查看。',
    'Decklists are shown when the event ends.': '牌表在赛事结束后公开。',
    'Decks stay as registered.': '套牌保持登记时的状态。',
    'Disconnected players stay in the event.': '断线的玩家仍留在赛事中。',
    'Drawn games': '平局盘数',
    'Entry code options': '入场码选项',
    'Event actions': '赛事操作',
    'Event offered to you': '有人把赛事移交给你',
    'Extend deck building': '延长构筑时间',
    'First player': '先手玩家',
    'Hide answered': '隐藏已回复的',
    'Hide match recording': '隐藏对局录像',
    'If accepted, you both take one match point.': '若接受，双方各得 1 个比赛积分。',
    'If accepted, your game ends and you both take one match point.': '若接受，本盘结束，双方各得 1 个比赛积分。',
    'Intentional draws are allowed.': '允许协议和局。',
    'Intentional draws are off.': '协议和局已关闭。',
    'It counts as a 2–0 win, three match points, and for nobody else': '计为 2–0 获胜、3 个比赛积分，且不计入他人',
    'Join late': '中途加入',
    'Join the waitlist': '加入候补',
    'Late entry is off.': '中途加入已关闭。',
    'Later rounds keep their pairings. Re-pair the current round if it has not started.':
      '后续轮次的对阵不变。当前轮若尚未开始，可重新配对。',
    'Leave event': '退出赛事',
    'Leaves the event and cannot join again unless you allow them back.': '退出赛事，除非你允许，否则无法再加入。',
    'Leaves the event before it starts.': '在开始前退出赛事。',
    'Longest round': '最长的一轮',
    'More time on a clock…': '给计时加时…',
    'More time to take their seats…': '给他们更多入座时间…',
    'No limit': '不限',
    'Notice actions': '公告操作',
    'Notice removed. Alerts already sent stay sent.': '公告已移除。已发出的提醒仍会送达。',
    'Offer withdrawn.': '移交已撤回。',
    'Only the top cut': '仅淘汰赛阶段',
    'Open to the organizer': '对主办方开放',
    'Opponent not responding': '对手未响应',
    'Pair them anyway': '仍然配对',
    'Pair with': '与…配对',
    'Paused. No clock runs out, no game starts, no round pairs.': '已暂停：不计时、不开局、不配对。',
    'Players and staff': '玩家与工作人员',
    'Players can': '玩家可以',
    'Players may rebuild from their pool between matches.': '玩家可在对局之间用牌池重新构筑。',
    'Players not checked in at the start are dropped.': '开始时未签到的玩家会被移出。',
    'Players, in the order they signed up.': '玩家，按报名顺序。',
    'Posted. Everyone in the event is told.': '已发布，赛事内所有人都会收到通知。',
    'Private to each player and the staff': '仅本人与工作人员可见',
    'Public results': '公开成绩',
    'Public results page': '公开成绩页面',
    'Reading the chat…': '正在读取聊天…',
    'Register your deck before building closes.': '请在构筑关闭前登记套牌。',
    'Registration is open. Players can find the event now.': '报名已开放，玩家现在可以找到该赛事。',
    'Required for something else.': '另有用途，必填。',
    'Resumed. Waiting tables get the paused time back.': '已恢复。等待中的牌桌会补回暂停的时间。',
    'Round to correct': '要更正的轮次',
    'Say why. The reason is required.': '请说明原因，此项必填。',
    'Sign-ups have closed, so you cannot join again.': '报名已关闭，无法再次加入。',
    'Start now': '立即开始',
    'Start the event': '开始赛事',
    'Swap with': '与…交换',
    'Tables that have not started': '尚未开始的牌桌',
    'Taken out of its series again.': '已再次移出系列赛。',
    'Taken out of its series.': '已移出系列赛。',
    'Technical problem': '技术问题',
    'That answer could not be sent. Try again.': '该回复发送失败，请重试。',
    'That change could not be made. Try again.': '该修改未能生效，请重试。',
    'That could not be done.': '操作未能完成。',
    'That could not be done. Try again.': '操作未能完成，请重试。',
    'That notice could not be saved.': '公告保存失败。',
    'That setting could not be saved. Try again.': '设置保存失败，请重试。',
    'That time could not be given. Try again.': '加时失败，请重试。',
    'The bracket follows its seeds.': '对阵表按种子顺序排列。',
    'The event could not be handed to you.': '赛事无法移交给你。',
    'The event could not be offered. Try again.': '赛事移交失败，请重试。',
    'The event could not be paused. Try again.': '赛事暂停失败，请重试。',
    'The event is running.': '赛事进行中。',
    'The link could not be copied.': '链接复制失败。',
    'The next round pairs on its own.': '下一轮会自动配对。',
    'The next round waits for you.': '下一轮在等你。',
    'The organizer closed this round before your table finished.': '主办方在你的牌桌结束前关闭了本轮。',
    'The organizer removed you from this event.': '主办方把你移出了该赛事。',
    'The organizer will open check-in before the start.': '主办方会在开始前开放签到。',
    'The result is in the standings.': '成绩已计入排名。',
    'The round clock and check-in are stopped until play resumes.': '在恢复之前，本轮计时与签到均停止。',
    'The series could not be saved. Try again.': '系列赛保存失败，请重试。',
    'The table is recorded as a draw, 0-0-3: one match point each and no game played. This is final.':
      '该牌桌记为平局 0-0-3：双方各得 1 个比赛积分，未进行对局。此为最终结果。',
    'The waitlist, in order.': '候补名单，按顺序。',
    'Their role could not be changed. Try again.': '其身份修改失败，请重试。',
    'They could not be added. Try again.': '添加失败，请重试。',
    'They could not be brought back. Try again.': '无法让他们回来，请重试。',
    'They could not be kept apart. Try again.': '无法将他们分开，请重试。',
    'They could not be removed. Try again.': '移除失败，请重试。',
    'They have played before. Pair them anyway?': '他们之前打过。仍然配对？',
    'They will reset the table or record a result. Nothing counts against you meanwhile.':
      '他们会重置牌桌或录入成绩。在此期间不会对你不利。',
    'This match was a draw.': '本场对局为平局。',
    'This table has no tournament result.': '该牌桌没有比赛成绩。',
    'Tournament deck-building time remaining': '比赛构筑剩余时间',
    'Wrong result': '错误的成绩',
    'You are in.': '你已进入。',
    'You are on the waitlist.': '你在候补名单中。',
    'You are out of this event.': '你已不在该赛事中。',
    'You can join again while sign-ups are open.': '报名开放期间你可以重新加入。',
    'You dropped from the event.': '你已退出该赛事。',
    'You have a bye this round.': '你本轮轮空。',
    'You judge': '你担任裁判',
    'You leave the event. Sign-ups have closed, so you cannot join again.': '你退出了赛事。报名已关闭，无法重新加入。',
    'You leave the event. You can join again while sign-ups are open.': '你退出了赛事。报名开放期间可以重新加入。',
    'You left the event.': '你已退出赛事。',
    'You left the waitlist.': '你已退出候补。',
    'You lost': '你输了',
    'You stepped down.': '你已卸任。',
    'You stop helping run this event. Only its organizers can add you back.':
      '你将不再协助管理该赛事。只有主办方能把你加回来。',
    'You were disqualified from this event.': '你已被取消该赛事的资格。',
    'You will not be paired again. Your results stay, and your opponent this round is given the win.':
      '你不会再被配对。你的成绩保留，本轮的对手判胜。',
    'You won': '你赢了',
    'Your check-in could not be saved. Try again.': '签到保存失败，请重试。',
    'Your deck comes from the draft.': '你的套牌来自这次轮抽。',
    'Your deck is registered.': '你的套牌已登记。',
    'Your entry': '你的报名',
    'Your game opens when you are both here.': '双方都在时对局才会开放。',
    'Your report could not be sent. Try again.': '举报发送失败，请重试。',
    'Your report is sent. The organizer and judges see it.': '举报已发送，主办方与裁判可见。',
    'Your reports': '你的举报',
    'Your results stay in the standings and keep counting towards everyone else': '你的成绩仍留在排名中，并继续计入他人的对手成绩',
    'Your table hit a problem. The organizer has been notified.': '你的牌桌出了问题，已通知主办方。'
  });

  /* ---------- 25. 办赛表单 / 战绩 / 资料 / 举报 ---------- */

  Object.assign(DICT, {
    // 办赛表单
    'A dropped player keeps their results': '被移出的玩家保留成绩',
    'A round robin is always capped': '循环赛总有人数上限',
    'A round robin takes up to 10': '循环赛最多 10 人',
    'After the round robin': '循环赛之后',
    'Already open': '已开放',
    'Anyone who passes the gates': '所有通过筛选条件的人',
    'Best of three, sideboarding between games': '三局两胜，盘间可换备牌',
    'Create tournament': '创建比赛',
    'Drawn at random when the event starts': '赛事开始时随机抽取',
    'Empty: you open them yourself': '留空：由你自己开包',
    'Everyone signed up plays': '所有报名者都参赛',
    'Forge plays a best of five to three wins': 'Forge 采用五局三胜制',
    'Highest rating on this format': '该赛制下评分最高者',
    'Listed for everyone': '对所有人列出',
    'Name the event.': '给赛事起个名字。',
    'No automatic no-shows': '不自动判定缺席',
    'No one is dropped for missing seats': '不会因未入座被移出',
    'No top cut': '不设淘汰赛',
    'Not checked in at the start: dropped': '开始时未签到：移出',
    'One bank for the whole match': '整场对局共用一个牌池',
    'One game, no sideboarding': '一盘定胜负，不换备牌',
    'One per opponent': '每位对手一个',
    'One per opponent, set when it starts': '每位对手一个，开始时确定',
    'Only the cut': '仅淘汰赛',
    'Pairs when every table is done': '所有牌桌结束后再配对',
    'Players who signed up stay signed up.': '已报名的玩家仍保留报名。',
    'Reachable by link': '可通过链接找到',
    'Reading formats…': '正在读取赛制…',
    'Set by the standings': '按排名决定',
    'Sets the suggested rounds and cut': '决定建议的轮数与淘汰赛规模',
    'Starts on its own if enough players are ready': '人数足够时自动开始',
    'Swiss only': '仅瑞士轮',
    'The bracket is the event': '淘汰赛即全部赛程',
    'The changes could not be saved.': '修改保存失败。',
    'The tournament could not be created.': '比赛创建失败。',
    'Then an empty seat is a no-show': '空座即视为缺席',
    'Times are in your time zone': '时间按你的时区显示',
    'Waits for you to pair it': '等你手动配对',
    'Who reads decklists': '谁能查看牌表',

    // 战绩 / 回放
    'Download replay': '下载回放',
    'Drop the file to open the replay': '把文件拖到这里打开回放',
    'It opens in your browser and is never uploaded.': '它只在你的浏览器中打开，绝不会上传。',
    'Loading your matches…': '正在加载你的对局…',
    'This file is too large to be a replay.': '该文件过大，不可能是回放。',
    'This replay is from a version of Endstep that can no longer be opened.': '该回放来自已无法打开的 Endstep 版本。',
    'This replay was saved by a newer version of Endstep. Reload the page to update, then try again.':
      '该回放由更新版本的 Endstep 保存。请刷新页面更新后再试。',
    'With replay': '含回放',

    // 个人资料
    'Earn a badge to pin it here': '获得徽章后可固定在这里',
    'Earned badges': '已获得的徽章',
    'Edit profile': '编辑资料',
    'Friend request sent': '好友请求已发送',
    'Three are pinned. Unpin one to pin another.': '已固定三个。取消一个才能再固定。',
    'Wearing your supporter mark.': '正在名字旁显示支持者标记。',

    // 举报对话框
    'Anything a moderator should know (optional)': '版主需要知道的情况（选填）',
    'Goes to the Endstep team.': '会发给 Endstep 团队。',
    'Goes to the Endstep team. Never include your password.': '会发给 Endstep 团队。请勿填写你的密码。',
    'Goes to the moderators with this match attached. The player is not told who sent it.':
      '会连同这场对局一起发给版务，对方不会知道是谁举报的。',
    'Lag and crashes': '卡顿与崩溃',
    'Patreon, password and login problems': 'Patreon、密码与登录问题',
    'Report sent. Thank you.': '举报已发送，谢谢。',
    'Tell us what happened. The server will attach the match timing record for review.':
      '说说发生了什么。服务器会附上对局计时记录供核查。',
    'The page, your browser and screen, the build, and the app': '页面、浏览器与屏幕、构建版本以及应用信息',
    'This page': '本页面',
    'What would you change?': '你希望改什么？',

    // 赛制说明
    'Any cards, no ban list': '任意牌，无禁牌表',
    'Commander and variants': '指挥官及其变体',
    'Commander for two': '双人指挥官',
    'Commons only': '仅普通牌',
    'Eighth Edition onward': '第八版及以后',
    'Every set, with a ban list': '全部系列，带禁牌表',
    'Every set, with a restricted list': '全部系列，带限牌表',
    'One shared deck and graveyard': '共用一套牌库与一个坟墓场',
    'Other games': '其他对局',
    'Return to Ravnica onward': '再访拉尼卡及以后',
    'The most recent sets': '最近的系列',
    'Your formats': '你的赛制',

    // 环境范围说明
    'A season has no previous window of the same length to compare with.': '本赛季没有等长的上一个时间窗可比较。',
    'Change in meta share, in points, against the window before.': '环境占比的百分点变化，对比上一个时间窗。',
    'Decks brought to finished matches. A deck played in ten matches counts ten times.':
      '出现在已结束对局中的套牌。一套牌打了十场就算十次。',
    'Each player': '每位玩家',
    'Meta share: this deck': '环境占比：本套牌',
    'Named decks, such as Mono-Red Madness. Lists close enough to each other share a name.':
      '已命名的套牌，例如红单一狂乱。足够接近的牌表会共用同一名称。',
    'No change figure': '无变化数据',
    'People who played this deck, each counted once.': '使用过本套牌的玩家，每人计一次。',
    'People, each counted once however often they played. Someone who plays several decks counts in each.':
      '玩家，无论打多少场每人只计一次。使用多套牌的人会在每套牌中各计一次。',
    'Small samples are hidden or merged so no one player can be picked out. Hidden is not zero.':
      '样本过小会被隐藏或合并，以免识别出具体玩家。隐藏不等于零。',
    'This season': '本赛季',
    'Times this deck was brought to a finished match.': '本套牌出现在已结束对局中的次数。'
  });
  /* ---------- 26. 挂机提醒 / 对局路由 / 图表 ---------- */

  Object.assign(DICT, {
    'Are you still there?': '你还在吗？',
    'Come back before the timer ends or you forfeit the match.': '在倒计时结束前回来，否则本场判负。',
    'Come back to the game or you forfeit the match.': '回到对局，否则本场判负。',
    'If the timer ends, they forfeit automatically.': '倒计时结束时，对方将自动弃权。',
    'If the timer ends, they forfeit the match.': '倒计时结束时，对方本场判负。',
    'Last call': '最后提醒',
    'Stepped away': '已离开',
    'Still deciding': '仍在决策',
    'Take an action or you forfeit the match.': '执行一个操作，否则本场判负。',
    'Your opponent': '你的对手',

    'Back to your event': '返回你的赛事',
    'Copy diagnostics': '复制诊断信息',
    'Could not join spectate session.': '无法加入观战。',
    'Could not reconnect to game. The game may have ended.': '无法重连对局，对局可能已结束。',
    'Load failed': '加载失败',
    'Open the connection': '打开连接',
    'This game could not be loaded.': '该对局无法加载。',
    'This game has ended and can no longer be resumed.': '该对局已结束，无法继续。',
    'This game has ended.': '该对局已结束。',
    'Timed out waiting for game state.': '等待对局状态超时。',
    'Tournament tables can': '比赛牌桌可以',

    'Counted live, not by calendar day': '实时统计，不按自然日',
    'Key cards': '关键牌',
    'No decks on the graph. Add one from its tile.': '图表上没有套牌，可在其卡片上添加。',
    'No registrations': '无报名记录',
    'On graph': '在图表上',
    'Rating before each match': '每场对局前的评分',
    'Rating before each match · no day in this window could be split into quarters':
      '每场对局前的评分 · 本时间窗内没有哪一天能切成四段',
    'Ratings exist only in rated play.': '评分只存在于计分对局中。',
    'What the numbers cover': '这些数据的口径',
    'Any number': '任意数字',
    'Full platform announcement details.': '完整的平台公告详情。',
    'Length and stakes for this format': '该赛制的时长与赌注'
  });
  /* ---------- 16. 审计补遗（一） ---------- */

  Object.assign(DICT, {
    'A card': '一张牌',
    'A copy of your data': '你的数据副本',
    'A fresh window to sit and a new game. Cannot be undone.': '全新的入座窗口与一盘新对局。不可撤销。',
    'A link': '一个链接',
    'A list': '一份牌表',
    'A player': '一名玩家',
    'All tiers include a custom profile picture and the option to display an achievement badge beside your name.':
      '所有档位都包含自定义头像，以及在你名字旁展示成就徽章的选项。',
    'Ask before ending combat with no attackers when some could attack.':
      '有生物可以攻击却没人攻击就要结束战斗时，先询问我。',
    'Ask through Report a problem.': '请通过「报告问题」来询问。',
    'At your pod’s table': '在你的多人桌上',
    'At your pod\'s table': '在你的多人桌上',
    'Authorities, where the law requires.': '在法律要求的情况下，向主管机关提供。',
    'Bar width': '条形宽度',
    'Bars': '条形图',
    'Be decent.': '做个正派人。',
    'Bragging rights.': '炫耀的资本。',
    'Call back': '召回',
    'Cards and credits': '牌张与鸣谢',
    'Cards that could not be resolved': '无法解析的牌',
    'Choosing a name for a guest account runs the same quick check as creating an account.':
      '为访客账号取名会执行与创建账号相同的快速检查。',
    'Clear the format tag': '清除赛制标签',
    'Clear the search': '清除搜索',
    'Clock, each player': '每位玩家的计时',
    'Commander suggestions': '指挥官推荐',
    'Cookies': 'Cookie',
    'Copy link to this event': '复制该赛事的链接',
    'Correct a result': '更正成绩',
    'Correct the result…': '更正成绩…',
    'Corrected result': '更正后的成绩',
    'Current window': '当前时间窗',
    'Custom count': '自定义数量',
    'Decks in': '套牌位于',
    'Developer': '开发者',
    'Disqualified. This cannot be undone.': '已取消资格，不可撤销。',
    'Don’t abandon matches.': '不要中途放弃对局。',
    'Don’t attack the service.': '不要攻击服务。',
    'Don’t cheat.': '不要作弊。',
    'Don’t dodge a sanction,': '不要逃避处罚，',
    'Don’t fix results.': '不要操纵比赛结果。',
    'Don’t stall on purpose.': '不要故意拖延。',
    'Ends it for everyone.': '对所有人结束。',
    'Every event of the format without its own cover': '该赛制下所有没有单独封面的赛事',
    'Every player': '每位玩家',
    'Failed to set draft variant': '设置轮抽变体失败',
    'Failed to set pod size': '设置人数失败',
    'Failed to set shared deck': '设置共享牌库失败',
    'Failed to update cheats setting': '更新作弊项设置失败',
    'Failed to update clock': '更新计时失败',
    'Failed to update game rule': '更新对局规则失败',
    'Failed to update match length': '更新对局时长失败',
    'Failed to update mulligan rule': '更新调度规则失败',
    'Failed to update pack settings': '更新补充包设置失败',
    'Failed to update rewind setting': '更新回退设置失败',
    'Failed to update spectator setting': '更新观战设置失败',
    'Failed to update the pick timer': '更新选牌计时失败',
    'Find a deck': '找一套套牌',
    'Find a game, report a bug, talk Magic.': '找对局、报 bug、聊万智牌。',
    'Finish or concede it, then open the invite link again.': '打完或认输，然后重新打开邀请链接。',
    'From a table': '来自牌桌',
    'From events and seasons': '来自赛事与赛季',
    'From the organizer, or in the link they shared.': '向主办方索取，或见其分享的链接。',
    'Full platform announcement details.': '完整的平台公告详情。',
    'Go to the home page': '回到首页',
    'How leaving is rated has not been decided yet.': '离开如何计分尚未决定。',
    'How long': '保留多久',
    'I understand that slow play is not stalling': '我明白慢打不等于拖延',
    'I\'m here': '我在',
    'I’m ready': '我准备好了',
    'I\'m ready': '我准备好了',
    'It may have been merged into another deck when decks were last worked out, or the link is mistyped.':
      '它可能在上次整理套牌时被并入另一套牌，或链接有误。',
    'Last 8': '最近 8 场',
    'Legal obligation.': '法律义务。',
    'Length and stakes for this format': '该赛制的时长与赌注',
    'Liability': '责任',
    'Longest a round runs': '单轮最长时长',
    'Maintenance notice': '维护公告',
    'Metagame pages:': '环境页面：',
    'Moderators read it, with the message attached. They are not told who sent the report.':
      '版主会连同消息一起看到，但不会被告知举报人是谁。',
    'More couldn\'t be read. Try Show more again.': '更多内容读取失败，请再点一次「显示更多」。',
    'More for Discord': 'Discord 相关',
    'More for Patreon': 'Patreon 相关',
    'More for deleting your account': '关于注销账号',
    'More for this conversation': '此会话的更多操作',
    'No spam or impersonation.': '禁止刷屏与冒充。',
    'On a player\'s clock': '计入玩家计时',
    'Only the cut\'s lists, when it ends (the top 8 with no cut, or in single elimination)':
      '仅切分出的牌表，结束时（无切分取前 8，或单败淘汰）',
    'Only you and your staff': '仅你与你的工作人员',
    'Opens your packs and starts your run.': '打开你的补充包并开始本次挑战。',
    'Other cards': '其他牌',
    'Other sources': '其他来源',
    'PNG, JPEG or WebP.': 'PNG、JPEG 或 WebP。',
    'Permanent, with a reason.': '永久，并附原因。',
    'Phase stops changed from the defaults': '阶段停止点已非默认'
  });

  /* ---------- 17. 审计补遗（二） ---------- */

  Object.assign(DICT, {
    'More for your picture': '头像的更多操作',
    'More pages': '更多页面',
    'More time': '更多时间',
    'More time on a clock…': '给计时加时…',
    'More time to take their seats…': '给他们更多入座时间…',
    'Play a rated match at least once every 30 days.': '每 30 天至少打一场计分对局。',
    'Play ten rated matches against at least five different opponents with match history.':
      '与至少五名不同对手打完十场计分对局，并保留对局记录。',
    'Policies': '政策',
    'Preview: public results are switched off, so only admins can see this page.':
      '预览：公开成绩已关闭，只有管理员能看到此页。',
    'Public results page': '公开成绩页面',
    'Ranked needs a claimed account name, not a guest one.': '排位需要已登录的正式账号，访客账号不可用。',
    'Registered': '已登记',
    'Release mode': '发布模式',
    'Removes your account for good. Other players keep their match history with you.':
      '永久删除你的账号。其他玩家仍保留与你的对局记录。',
    'Reports': '举报',
    'Reports:': '举报：',
    'Reset phase stops': '重置阶段停止点',
    'Results unavailable': '成绩不可用',
    'Results unavailable.': '成绩不可用。',
    'Retry now': '立即重试',
    'Rewinding is new and still being proven — if the game misbehaves afterwards, please file a bug report.':
      '回退是新功能，仍在验证中——若之后对局出现异常，请提交 bug 报告。',
    'Right to object:': '反对权：',
    'Scales every level below.': '按比例缩放以下所有等级。',
    'Services we use': '我们使用的服务',
    'Shown when the event ends': '赛事结束时显示',
    'Stack name': '堆叠名称',
    'Start not set': '未设置开始时间',
    'Start passed': '开始时间已过',
    'Technical:': '技术方面：',
    'The deck\'s link': '该套牌的链接',
    'The decks chosen at this table are cleared, and everyone chooses again.':
      '本桌已选的套牌会被清空，所有人重新选择。',
    'The picture on the event\'s card in the list': '列表中赛事卡片上的图片',
    'The rating for this match could not be read. It is unaffected; your profile will show the new figure.':
      '无法读取本场对局的评分。本场不受影响，你的资料会显示新的数值。',
    'The rules for using Endstep.': '使用 Endstep 的规则。',
    'The second seat belongs to a bot, so there is no room for a guest.':
      '第二个座位属于 AI，已无访客的位置。',
    'The service': '服务',
    'These examples were released in their own windows; they do not describe this window’s most popular list.':
      '这些示例发布于各自的时间窗，并不代表本时间窗最流行的牌表。',
    'These examples were released in their own windows; they do not describe this window\'s most popular list.':
      '这些示例发布于各自的时间窗，并不代表本时间窗最流行的牌表。',
    'They are told.': '已通知他们。',
    'They won\'t be able to send you messages. You can unblock them anytime — from this conversation or Settings.':
      '他们将无法给你发消息。你随时可以取消屏蔽——在此会话或设置中。',
    'This account already has a different Discord linked. Unlink that one first, then link this.':
      '该账号已绑定另一个 Discord，请先解绑再绑定这个。',
    'This player\'s prompts, submissions and events · UTC': '该玩家的提示、提交与赛事 · UTC',
    'This table': '这张牌桌',
    'Tick to queue a format now. Pin it to keep it on Play.':
      '勾选即可加入该赛制队列；固定后它会一直留在「对战」页。',
    'To fix and improve Endstep': '修复并改进 Endstep',
    'To keep play fair and safe': '维持公平与安全的对局',
    'To run Endstep': '运营 Endstep',
    'To take their seats': '等待入座',
    'To the tables': '前往牌桌',
    'Top level': '顶层',
    'Type your username.': '输入你的用户名。',
    'Unplaced': '未放置',
    'Untitled': '未命名',
    'Untitled Cube': '未命名 Cube',
    'We don’t collect your email, real name or payment details.': '我们不收集你的邮箱、真实姓名或支付信息。',
    'We may change these terms. The date at the top shows the current version.':
      '我们可能会修改这些条款，顶部日期即当前版本。',
    'We may update this policy. The date at the top shows when.': '我们可能会更新本政策，顶部日期即更新日期。',
    'What Endstep keeps about you, and for how long.': 'Endstep 会保留你的哪些信息，以及保留多久。',
    'What is kept, and how long': '保留什么、保留多久',
    'What is kept, and for how long': '保留什么、保留多久',
    'What we collect': '我们收集什么',
    'What you make:': '你创作的内容：',
    'What you post': '你发布的内容',
    'When a game needs your move, someone joins your table, or a game starts.':
      '当对局需要你行动、有人加入你的牌桌，或对局开始时。',
    'When one opens, it will be here. Open tables are still running draft and sealed.':
      '有开放时会出现在这里。开放牌桌仍可进行轮抽与现开。',
    'When reconnect grace runs out': '重连宽限期结束时',
    'When the rating is in, this run moves to Recent runs and you can start another.':
      '评分结算后，本次挑战会移到「最近运行」，你可以开始下一次。',
    'Where the law requires it.': '在法律要求的情况下。',
    'Where your data is': '你的数据存放在何处',
    'Which matches count': '哪些对局计入',
    'Who can see what': '谁可以看到什么',
    'Who reads decklists': '谁能查看牌表',
    'Who we are': '我们是谁',
    'Why we use it': '我们为何使用',
    'You are responsible for your account. Without a linked account, a lost password can’t be recovered.':
      '你对自己的账号负责。未绑定第三方账号时，密码丢失将无法找回。',
    'You can complain to a data protection authority, in particular where you live.':
      '你可以向数据保护机构投诉，尤其是你所在地区的机构。',
    'Your Limited run': '你的限制赛挑战',
    'Your first finished run sets it.': '你的第一次完成的挑战将决定它。',
    'Your reports': '你的举报',
    'Your run ends when the match in progress finishes.': '本次挑战会在进行中的对局结束后结束。'
  });

  /* ---------- 27. 收口补漏 ---------- */

  Object.assign(DICT, {
    '(no cards)': '（无牌）',
    'Acolyte': '侍僧',
    'Archmage': '大法师',
    'Mage': '法师',
    'King': '国王',
    'Banner': '旗帜',
    'Castable only': '仅可施放',
    'SPC': '特殊',
    'Verbose': '详细',
    'You chose': '你选择了',
    'Zone card size range': '区域牌张尺寸范围',
    'An enduring story — you kept three or more artifacts, legendaries, and/or Sagas':
      '一段长存的故事——你保留了三个或更多神器、传奇永久物和/或传纪',
    'The game froze, so this match isn\'t counted: no rating change, and it won\'t appear in match history.':
      '对局卡死，本场不计入：评分不变，也不会出现在对局记录中。',
    'Nobody is waiting for a pod.': '没有人在等多人桌。',
    'Endstep: a fast browser client for constructed, cube draft, sealed, and multiplayer pods':
      'Endstep：构筑、Cube 轮抽、现开与多人桌的极速浏览器客户端'
  });
  /* ---------- 28. 句内碎片（JSX children 里的裸字符串） ---------- */

  Object.assign(DICT, {
    'Start one card by card, paste a list, or bring one from Cube Cobra.':
      '可以逐张添加、粘贴一份牌表，或从 Cube Cobra 导入一套。',
    'Start one, or import a list or a link.': '新建一套，或导入牌表 / 链接。',
    'Add cards with the search above, or bring in a whole list.': '用上方搜索添加牌张，或直接导入整份牌表。',
    'Bots take the seats the host gives them.': 'AI 会占据房主分配给它们的座位。',
    'Connection interrupted — reconnecting. Your seat is held for the grace period.':
      '连接中断——正在重连。你的座位会在宽限期内保留。',
    'Leaving or idling out forfeits and can start a matchmaking cooldown.':
      '中途离开或挂机会判负，并可能触发匹配冷却。',
    'Nobody else has a bye, so their opponent gets one too.': '其他人没有轮空，因此其对手也获得轮空。',
    'On an unlisted event, only its players.': '未公开列出的赛事，仅参赛者可见。',
    'Only people with preview access see these pages.': '只有拥有预览权限的人能看到这些页面。',
    'Open tables below are open to everyone.': '下方开放的牌桌对所有人开放。',
    'Some reference windows could not be loaded.': '部分参考时间窗加载失败。',
    'Take your seat before the clock runs out.': '在倒计时结束前入座。',
    'Taking time to think is fine.': '花时间思考是允许的。',
    'Their table goes to their opponent.': '其牌桌判给对手。',
    'There is no public results page at this address.': '该地址没有公开成绩页面。',
    'You are checked in.': '你已签到。',
    'You can undo this in Settings.': '你可以在设置中撤销。',
    'is not implemented in Endstep yet, so a game leaves it out of the deck.':
      '在 Endstep 中尚未实现，因此对局时会把它排除在套牌之外。',
    'stays on as a co-organizer.': '仍保留协办人身份。',
    'such as decks, cubes, tournaments and settings.': '例如套牌、立方、比赛与设置。',
    'what you send in chat and direct messages.': '你在聊天与私信中发送的内容。',
    'or any other service you choose to sign in with or link.':
      '或你选择用于登录 / 绑定的其他服务。',
    'your browser loads card images from it, so it sees your IP address.':
      '你的浏览器会从该服务加载卡图，因此它会看到你的 IP 地址。',

    // 状态与标签
    '(can be activated)': '（可起动）',
    '(current phase)': '（当前阶段）',
    'a hidden card': '隐藏的牌',
    'active player': '当前行动玩家',
    'defending player': '防御玩家',
    'after drafting': '轮抽之后',
    'after opening packs': '开包之后',
    'again to put it back.': '再次点击放回。',
    'already spent — backing out won\'t undo that.': '已支付——退出不会退回。',
    'an event needs a person': '赛事需要指定一个人',
    'an intentional draw': '协议和局',
    'an opponent acts or the end step': '对手行动或阶段进入结束',
    'and sometimes with': '有时还包括',
    'applies first': '最先生效',
    'applies last if it still applies': '若仍生效则最后生效',
    'are replaced by': '被…替代',
    'attacking you': '正在攻击你',
    'becomes free for anyone to take.': '变为任何人可自由占用。',
    'beside Add to, or move a card here.': '在「添加」旁，或把牌移到这里。',
    'by colour': '按颜色',
    'by mana value': '按法术力值',
    'by rarity': '按稀有度',
    'card image unavailable': '卡图不可用',
    'deciding now': '正在决策',
    'decks are shown.': '套牌已显示。',
    'decks registered': '已登记套牌',
    'draggable card': '可拖动的牌',
    'every table reported': '所有牌桌已报分',
    'for this season': '本赛季',
    'friend request': '好友请求',
    'from the list.': '从列表中。',
    'game in play ends': '对局结束',
    'games are removed after': '对局会在…之后移除',
    'games in play end': '进行中的对局结束',
    'games, with no time limit.': '对局，不限时。',
    'hidden message': '隐藏的消息',
    'hidden messages': '隐藏的消息',
    'in place of the': '代替',
    'in the app, while signed in.': '在登录状态下的应用内。',
    'in your original': '在你原始的',
    'including with another account.': '包括使用其他账号。',
    'instead of': '而不是',
    'invalid format:': '格式无效：',
    'is empty.': '是空的。',
    'is playing with revealed.': '正在使用已展示的牌。',
    'it becomes': '它变为',
    'its players': '其参赛者',
    'just now': '刚刚',
    'key changed': '按键已更改',
    'keys changed': '按键已更改',
    'ladder clock': '天梯计时',
    'left out of this deck.': '被排除在本套牌之外。',
    'lost connection': '已断线',
    'min before': '分钟前',
    'more cards': '更多牌',
    'more matches': '更多对局',
    'more opponents with match history': '更多有对局记录的对手',
    'more since your last visit': '更多（自你上次访问以来）',
    'new messages hidden': '新消息已隐藏',
    'no deck chosen': '未选择套牌',
    'no folder': '无文件夹',
    'no season is open': '没有开放的赛季',
    'not grouped': '未分组',
    'oathbreaker or signature spell': '破誓者或标志性咒语',
    'on the ladder': '在天梯上',
    'once a second player sits': '第二名玩家入座后',
    'one half': '一半',
    'or click the pill to show it.': '或点击胶囊按钮显示。',
    'original size': '原始尺寸',
    'out of its folder': '移出文件夹',
    'out of this deck': '移出本套牌',
    'over the limit': '超出上限',
    'played by': '使用者',
    'proposes a loop shortcut: repeat': '提议循环快捷方式：重复',
    'rating still settling': '评分仍在稳定中',
    'resolves first': '最先结算',
    'resolves last': '最后结算',
    'results are': '结果为',
    'seconds left to take your seat': '秒后入座截止',
    'since your last visit': '自你上次访问以来',
    'something needs attention': '有事项需要处理',
    'starter deck': '起始套牌',
    'table has': '牌桌有',
    'the Swiss rounds, their number set by turnout': '瑞士轮，轮数由参赛人数决定',
    'the end step before my turn': '我回合之前的结束',
    'the folder': '该文件夹',
    'the game': '对局',
    'the graph is still loading': '图表仍在加载',
    'the match': '该对局',
    'the next player': '下一位玩家',
    'the next round': '下一轮',
    'the opponent\'s': '对手的',
    'the player': '该玩家',
    'the previous season': '上赛季',
    'the round': '该轮',
    'the round robin': '循环赛',
    'the rounds\' clock': '各轮计时',
    'the table to replay': '要回放的牌桌',
    'their players': '其参赛者',
    'they become': '它们变为',
    'this product\'s': '该产品的',
    'those games': '那些对局',
    'time is up': '时间到',
    'to draft from one.': '从中轮抽。',
    'to lift,': '解除，',
    'to move,': '移动，',
    'to read it.': '阅读。',
    'to reorder, or use the': '重新排序，或使用',
    'to return': '返回',
    'top right': '右上角',
    'unrated on this ladder': '在该天梯上不计分',
    'unread message': '未读消息',
    'unread messages': '未读消息',
    'waiting on the table': '等待牌桌',
    'was dropped.': '已放下。',
    'was not found. It may have been deleted.': '未找到，可能已被删除。',
    'wrong format': '格式错误',
    'you are provisional': '你是暂定评分',
    'you are unranked': '你尚未排名',
    'your commander': '你的指挥官',
    'your message': '你的消息',

    // 徽记分隔
    '· final standings': '· 最终排名',
    '· no clock': '· 不计时',
    '· no cut': '· 不设淘汰赛',
    '· seeded by rating': '· 按评分定种子',
    '· server time': '· 服务器时间',
    '· your companion': '· 你的行侣',
    '— Endstep now lives on your home screen, full-screen.': '— Endstep 已装到你的主屏幕，可全屏使用。',
    '— attack target': '— 攻击目标',
    '— castable card available': '— 有可施放的牌',
    '— click to play.': '— 点击施放。',
    '— concedes in': '— 认输倒计时',
    '— current step': '— 当前步骤',
    '— in progress': '— 进行中',
    '— valid target': '— 合法目标',
    '— waiting for them to reconnect': '— 等待对方重连',
    'Enduring Story': '长存的故事'
  });
  /* ---------- 29. 句内碎片（二） ---------- */

  Object.assign(DICT, {
    '(current)': '（当前）',
    '(now)': '（现在）',
    '(you)': '（你）',
    '(loss disabled)': '（已关闭判负）',
    '(accounts, games, drafts, decks, chat, replays, supporter perks).': '（账号、对局、轮抽、套牌、聊天、回放、支持者权益）。',
    '(moderation, bans, cheating and ban-evasion checks, rate limits, bot checks at sign-up).':
      '（版务、封禁、作弊与规避封禁检查、速率限制、注册时的机器人校验）。',
    '(reports, error reports, logs, usage figures).': '（举报、错误报告、日志、使用数据）。',
    'Paste a screenshot with Ctrl+V.': '按 Ctrl+V 粘贴截图。',
    'Don’t use bugs or tools to see hidden information or gain an unfair advantage. Report bugs instead.':
      '不要利用 bug 或工具获取隐藏信息、或取得不公平优势；请改为举报 bug。',
    'Legal in': '合法赛制：',
    'Lines show the likely range of each bar. Sparse ranges are combined to protect players.':
      '线段表示每根条形的可能区间。样本过稀的区间会被合并，以保护玩家。',
    'No flooding it with traffic, and no getting around its rate limits.':
      '不要用流量冲击它，也不要绕过其速率限制。',
    'No harassment, threats, hate speech, sexual content, or sharing someone’s personal information, in chat, names, pictures, decks or anywhere else.':
      '禁止骚扰、威胁、仇恨言论、色情内容，也不得在聊天、名称、图片、套牌或任何其他地方公开他人个人信息。',
    'No win trading or arranged outcomes.': '禁止刷分或操纵比赛结果。',
    'Only tables that have not started can change.': '只有尚未开始的牌桌才能更改。',
    'Pop out': '弹出窗口',
    'Repeat pairing': '重复配对',
    'Replays beyond your last': '超出你最近场次的回放',
    'The rest were left out.': '其余未被列入。',
    'Their table this round goes to their opponent.': '本轮其牌桌判给对手。',
    'ability fizzles.': '异能落空。',
    'are cut after': '之后被切掉',
    'asks the table to replay turn': '要求牌桌重打该回合',
    'at new': '在新',
    'button in Safari\'s toolbar.': '浏览器工具栏中的按钮。',
    'buttons. Tap a tile to read it.': '按钮。点击卡片即可查看。',
    'calls you back to the table.': '把你叫回牌桌。',
    'canceled the rematch request.': '取消了再战请求。',
    'carries and protects the site’s traffic, and may check that a sign-up comes from a person, which reads browser details.':
      '承载并保护站点流量，并可能校验注册是否来自真人，这会读取浏览器信息。',
    'checked in. The rest are dropped at the start.': '已签到。其余玩家在开始时被移出。',
    'could be used only with': '只能与…一起使用',
    'could not be checked: Scryfall may be down for a moment. Nothing was removed from your list.':
      '无法检查：Scryfall 可能暂时不可用。你的牌表没有删除任何内容。',
    'could not be loaded.': '加载失败。',
    'could not be read.': '读取失败。',
    'deck is in your library': '套牌在你的牌库中',
    'decks played are counted into public statistics that name no player.':
      '使用的套牌会计入不具名的公开统计。',
    'declined the rematch.': '拒绝了再战。',
    'effect requires': '效应需要',
    'from an': '来自一个',
    'from its start.': '自其开始。',
    'from the cube': '来自该立方',
    'from your last run': '来自你上次挑战',
    'games kept': '保留的对局',
    'hosts our private issue tracker, where we copy the parts of a bug report needed to fix it.':
      '托管我们的私有问题追踪系统，我们会把修复所需的 bug 报告内容复制过去。',
    'in Safari\'s toolbar.': '在 Safari 工具栏中。',
    'is empty. Add a card above to put it here.': '是空的。在上方添加一张牌即可放进来。',
    'is past the longest it could run': '已超过本轮可能的最长时长',
    'like the deck’s average list': '类似该套牌的平均牌表',
    'missed the seat deadline, so you win.': '错过了入座截止时间，因此你获胜。',
    'on the waitlist.': '在候补名单中。',
    'on this ladder this season.': '本赛季在该天梯上。',
    'other spells': '其他咒语',
    'places taken': '已占名额',
    'offered to hand this event to you.': '想把该赛事移交给你。',
    'offers an intentional draw.': '提议协议和局。',
    'rated matches ·': '计分对局 ·',
    'to accept…': '待接受…',
    'to drop. Click, right-click': '可放下。单击、右键',
    'to fix': '待修复',
    'to take your seat': '待入座',
    'was moved over droppable area': '已移到可放置区域',
    'what you write and attach, a screenshot of the page, browser and device details, recent errors.':
      '你填写与上传的内容、页面截图、浏览器与设备信息、近期错误。',
    'you can object at any time, on grounds relating to your situation, to any use of your data based on legitimate interest.':
      '你可以随时基于自身情况，反对我们基于正当利益使用你的数据。',
    '· Repeat pairing': '· 重复配对',
    '· estimated time': '· 预计时间',
    '· most common of': '· 最常见于',
    '· no bots': '· 无 AI',
    '· not found': '· 未找到',
    '· your rating': '· 你的评分',
    '· vs AI': '· 对 AI'
  });
  /* ---------- 30. 句内碎片（收尾） ---------- */

  Object.assign(DICT, {
    'decided games. Later games are only the matches that reached them, and players’ play or draw choices.':
      '已分胜负的对局。后续每盘只统计打到该盘的对局，以及玩家选择先手还是后手。',
    'games kept ·': '保留对局 ·',
    'has started. Only tables that have not started can change.':
      '已开始。只有尚未开始的牌桌才能更改。',
    'is no longer over a droppable area.': '已离开可放置区域。',
    'was dropped over droppable area': '已在可放置区域放下',
    'pool and': '牌池与',
    'still open': '仍开放',
    'in options when': '在…的选项中',
    '· past the longest this round can run': '· 已超过本轮最长时长',
    '· the game kept failing and automatic retries are spent': '· 对局持续失败，自动重试次数已用尽',
    '· the last rated game against them this week': '· 本周与他们最近的一场计分对局'
  });
  /* ---------- 31. 阶段标签与提示补漏 ---------- */

  Object.assign(DICT, {
    '1st Strike': '先攻',
    'Begin Combat': '战斗开始',
    'End Combat': '结束战斗',
    'Declare Attackers': '宣告攻击者',
    'Declare Blockers': '宣告阻挡者',
    'First Strike Damage': '先攻伤害',
    'Combat Damage': '战斗伤害',
    'End of Combat': '战斗结束',
    'Beginning of Combat': '战斗开始',
    'Esc to cancel': 'Esc 取消'
  });
  /* ---------- 32. 音效名 / 徽章符号 / 素材 ---------- */

  Object.assign(DICT, {
    'Sound effects': '音效',
    'Interface Sounds, Casino Audio, Impact Sounds, RPG Audio': '界面音效、赌场音效、冲击音效、RPG 音效',
    'Casting, damage, tapping, shuffling, game start, win, loss, clicks':
      '施放、伤害、横置、洗牌、开局、胜利、失败、点击',
    'Ambient — cave (CC-BY)': '环境音——洞穴（CC-BY）',
    'Ambient — dark drone (CC-BY)': '环境音——暗色低鸣（CC-BY）',
    'Ambient — scriptorium bed (synth)': '环境音——缮写室底噪（合成）',
    'Cast — magic spell': '施放——魔法咒语',
    'Cast — spell (CC-BY)': '施放——咒语（CC-BY）',
    'Combat — blade slice': '战斗——刀刃挥砍',
    'Damage — impact punch': '伤害——重击',
    'Damage — soft thud': '伤害——闷响',
    'Death — wood thunk': '死亡——木质闷响',
    'Draft — gold shimmer': '轮抽——金色闪鸣',
    'Draft — pack takeout': '轮抽——取包',
    'Draft — pack tear': '轮抽——撕包',
    'Draw — card slide': '抓牌——抽牌滑动',
    'Equip — metal latch': '装备——金属扣合',
    'Game start — leather handle': '开局——皮革摩擦',
    'Game start — magic sweep': '开局——魔法扫掠',
    'Game start — shuffle + seal': '开局——洗牌与封合',
    'Land — card place': '下地——放牌',
    'Land — soft thock': '下地——轻叩',
    'Land — wood thock': '下地——木质叩击',
    'Life gain — select': '获得生命——选中',
    'Life gain — warm rise': '获得生命——温暖上扬',
    'Match loss — air woosh': '对局失利——空气掠过',
    'Match loss — descending tone': '对局失利——下行音',
    'Match loss — jingle (CC-BY)': '对局失利——短铃（CC-BY）',
    'Match win — bell toll': '对局获胜——钟声',
    'Match win — jingle (CC-BY)': '对局获胜——短铃（CC-BY）',
    'Match win — light spell': '对局获胜——光之咒',
    'Modal close — page settle': '弹窗关闭——页面落定',
    'Modal open — page turn': '弹窗打开——翻页',
    'Nav — parchment whoosh': '导航——羊皮纸掠过',
    'Nav — wood light': '导航——轻木点击',
    'Shuffle — cards shove': '洗牌——推牌',
    'Shuffle — metal card deck': '洗牌——金属牌堆',
    'Toast — info tick': '提示浮层——轻响',
    'Token — leather drop': '衍生物——皮革落下',
    'Trigger — chip lay': '触发——筹码落下',
    'Trigger — low chime': '触发——低沉铃音',
    'UI click — camera shutter': '界面点击——快门',
    'UI — inventory open (CC-BY)': '界面——打开背包（CC-BY）',
    'UI — menu select (CC-BY)': '界面——菜单选择（CC-BY）',
    'UI — soft close': '界面——轻柔关闭',
    'Your turn — fifth chime': '你的回合——第五声铃',
    'Your turn — lock': '你的回合——锁定',
    'Your turn — triad shimmer': '你的回合——三音闪光',
    'Your turn — warm bell': '你的回合——温暖钟声',
    'Mixkit licence': 'Mixkit 许可',
    'Mixkit sound effects': 'Mixkit 音效',

    'All-Seeing Eye': '全视之眼',
    'Brandished Sword': '挥舞之剑',
    'Crowned Skull': '戴冠骷髅',
    'Dice Cup': '骰盅',
    'Heraldic Sun': '纹章太阳',
    'Laurel Crown': '桂冠',
    'Mana Font': '法术力之泉',
    'Star Medal': '星章',
    'Tattered Banner': '破旗',
    'Unfurled Scroll': '展开的卷轴',
    'Card-Forge contributors': 'Card-Forge 贡献者'
  });

  /* ---------- 33. 界面文案（补齐被过滤器误杀的整句） ---------- */

  Object.assign(DICT, {
    'You\'ll lose. This can\'t be undone.': '你会输掉。此操作不可撤销。',
    'Lose this game. The match continues. This can\'t be undone.': '输掉本盘。对局继续。此操作不可撤销。',
    'You’ll lose. This can’t be undone.': '你会输掉。此操作不可撤销。',
    'Lose this game. The match continues. This can’t be undone.': '输掉本盘。对局继续。此操作不可撤销。',
    'It ends for everyone, and cannot be undone.': '对所有人结束，且不可撤销。',
    '(no-show)': '（缺席）',
    'Act before the timer ends or you forfeit the match.': '在倒计时结束前行动，否则本场判负。',
    'Act now or you forfeit the match.': '现在行动，否则本场判负。',
    'Action outcome unavailable': '操作结果不可用',
    'Active keyword abilities': '生效中的关键字异能',
    'Advance to the next phase': '进入下一阶段',
    'Ask to rewind the turn': '请求回退本回合',
    'Before today': '今天之前',
    'Board at': '战场于',
    'Both players get a fresh check-in window and a new game from the start. Or correct the result instead. This cannot be undone.':
      '双方都会获得新的签到窗口，并从头开始一盘。也可以改为更正成绩。此操作不可撤销。',
    'A read-only view of the registered main deck, sideboard, and commanders. This does not reflect between-game sideboard changes.':
      '已登记主牌、备牌与指挥官的只读视图，不反映对局之间的换备。',
    'Card data, card images and mana symbols': '牌张数据、卡图与法术力符号',
    'Card size applies to Stacks and Gallery': '牌张尺寸作用于堆叠与画廊',
    'Casual / no banlist': '休闲 / 无禁牌表',
    'Chat and action evidence': '聊天与操作证据',
    'Chat history unavailable.': '聊天记录不可用。',
    'Chosen values': '已选数值',
    'Close chat': '关闭聊天',
    'Close decklist': '关闭牌表',
    'Combat ends.': '战斗结束。',
    'Connection restricted': '连接受限',
    'Continuous construction is off: decks stay as registered.': '持续构筑已关闭：套牌保持登记时的状态。',
    'Continuous construction is on: players may rebuild from their pool between matches.':
      '持续构筑已开启：玩家可在对局之间用牌池重新构筑。',
    'Continuous construction: between matches you may rebuild your deck from your pool.':
      '持续构筑：对局之间可以用牌池重新构筑套牌。',
    'Copied to clipboard.': '已复制到剪贴板。',
    'Could not copy. Select the list and copy it.': '复制失败，请手动选中牌表再复制。',
    'Could not download. Select the list and copy it.': '下载失败，请手动选中牌表再复制。',
    'Could not load this player.': '无法加载该玩家。',
    'Couldn’t copy decklist. Check clipboard access and try again.': '无法复制牌表，请检查剪贴板权限后重试。',
    'Create custom stack': '创建自定义堆叠',
    'Cube name': 'Cube 名称',
    'Current keywords': '当前关键字',
    'Custom sideboard stack': '自定义备牌堆叠',
    'Custom stack': '自定义堆叠',
    'Decoding audio data failed.': '音频解码失败。',
    'Done. Players are told.': '已完成，玩家已获通知。',
    'Drag the picture to place it.': '拖动图片来放置。',
    'Drag to reorder inside a folder': '拖动可在文件夹内重新排序',
    'Draggable item': '可拖动项',
    'Drop here to take the': '放这里以取得',
    'Enter 1 to act after the first iteration.': '输入 1 可在第一次迭代后行动。',
    'Enter fullscreen': '进入全屏',
    'Every copy': '每一份',
    'Every deck on the list is on the graph.': '列表上的每套牌都在图表中。',
    'Everyone has agreed.': '所有人都已同意。',
    'Failed to load decks': '加载套牌失败',
    'Find a finished event': '查找已结束的赛事',
    'Format, matches, entry, staff': '赛制、对局、报名、工作人员',
    'Gathering your library…': '正在整理你的牌库…',
    'Hide report to peek at the board': '隐藏举报内容以查看战场',
    'It has already been shortened to 1 iteration — accept it or let it run.':
      '已缩短为 1 次迭代——接受它，或让它跑完。',
    'Its first card that is not a land': '其中第一张非地牌',
    'Jump here': '跳到这里',
    'Loading decks': '正在加载套牌',
    'Loading more printings…': '正在加载更多版本…',
    'Locate the table': '定位牌桌',
    'Locked as registered': '锁定为登记状态',
    'Look at this card': '查看这张牌',
    'Loose decks': '未归入文件夹的套牌',
    'Match chat': '对局聊天',
    'Mirrors your deck · choose another': '镜像你的套牌 · 可另选',
    'Move chat window. Use arrow keys to reposition.': '移动聊天窗口，用方向键调整位置。',
    'Needs attention': '需要处理',
    'New entry code made.': '已生成新的入场码。',
    'Next month': '下个月',
    'Next page': '下一页',
    'Previous month': '上个月',
    'Previous page': '上一页',
    'No alternate printings found for this card.': '这张牌没有其他版本。',
    'No audio support.': '不支持音频。',
    'No cards bound.': '未绑定牌张。',
    'No commander bound.': '未绑定指挥官。',
    'No deck on the list matches': '列表中没有匹配的套牌',
    'No events ended yet.': '还没有赛事结束。',
    'No opponent': '无对手',
    'No paired prompt was recorded.': '没有记录到配对提示。',
    'No sideboard bound.': '未绑定备牌。',
    'Not sent. Try again.': '未发送，请重试。',
    'Not set': '未设置',
    'On stack': '在堆叠上',
    'On this page': '本页',
    'One ability from this card is on the stack': '这张牌的一个异能在堆叠上',
    'One card with a count': '带数量的一张牌',
    'Only available while you hold priority over a non-empty stack': '仅在你对非空堆叠拥有优先权时可用',
    'Only you can see it': '只有你能看到',
    'Opening deck building…': '正在打开构筑…',
    'Opening practice table…': '正在打开练习桌…',
    'Opening your deck…': '正在打开你的套牌…',
    'Opp priority': '对手优先权',
    'Order and format of open events': '开放赛事的顺序与格式',
    'Original match chat': '原始对局聊天',
    'Paused: no check-in deadline runs out, no game starts and no round pairs. Games under way play on. Resuming gives every waiting table the paused time back.':
      '已暂停：签到不倒计时、不开局、不配对；进行中的对局继续。恢复时，所有等待中的牌桌都会补回暂停的时间。',
    'Phase tracker': '阶段追踪',
    'Player view': '玩家视角',
    'Players are building their decks.': '玩家正在构筑套牌。',
    'Quick replies': '快捷回复',
    'Re-pair': '重新配对',
    'Read the update': '阅读更新',
    'Reading the list…': '正在读取牌表…',
    'Rebuild from your pool between matches': '对局之间可用牌池重新构筑',
    'Recorded actions': '已记录的操作',
    'Recorded perspectives': '已记录的视角',
    'Recording in progress': '正在录制',
    'Report evidence': '举报证据',
    'Resize chat window. Use arrow keys to resize.': '调整聊天窗口大小，用方向键调整。',
    'Results are applied one ladder at a time, in order. The new figure lands here in a moment.':
      '成绩按顺序逐个天梯应用，新的数值稍后会显示在这里。',
    'Review recording': '复核录像',
    'Right-click': '右键',
    'Route path': '路由路径',
    'Share change': '占比变化',
    'Show back face': '显示背面',
    'Show decks as': '套牌显示为',
    'Show face-down': '显示牌面朝下',
    'Show front face': '显示正面',
    'Show less': '收起',
    'Sign-ups are open.': '报名已开放。',
    'Still gone when reconnect grace runs out: dropped from future pairings. A brief disconnect, a concession or a loss does not count. You can reinstate them.':
      '重连宽限期结束仍未回来：将从后续配对中移除。短暂断线、认输或失利不计入。你可以恢复其资格。',
    'Summoning sick': '召唤失调',
    'Swipe up or press the up arrow to set a stop on the opponent':
      '上滑或按上方向键，在对手回合设置停止点',
    'Swiss rounds by turnout': '按参赛人数决定瑞士轮轮数',
    'Table chat': '牌桌聊天',
    'Take as long as you need. Your matches start once you submit it, and you can change it between matches.':
      '慢慢来。提交后对局就会开始，你可以在对局之间更换。',
    'That action was not accepted. Please try again.': '该操作未被接受，请重试。',
    'That could not be saved. Try again.': '保存失败，请重试。',
    'That could not be undone.': '无法撤销。',
    'That name could not be saved.': '名称保存失败。',
    'That replay was already deleted.': '该回放已被删除。',
    'That was a different Discord account from the one linked here. Try again with the Discord account linked to this profile.':
      '那是与本档案绑定的不同的 Discord 账号，请改用绑定到该资料的账号重试。',
    'The Initiative': '先制',
    'The art could not be changed.': '画作更换失败。',
    'The cover could not be put back.': '无法恢复封面。',
    'The event is cancelled. Everyone is told.': '赛事已取消，所有人已收到通知。',
    'The event is paused.': '赛事已暂停。',
    'The folder could not be made.': '无法创建文件夹。',
    'The folder could not be moved back.': '文件夹无法移回。',
    'The format could not be put back.': '无法恢复赛制。',
    'The interface': '界面',
    'The link may be old, or what it pointed to was deleted.': '链接可能已过期，或指向的内容已被删除。',
    'The match recording could not be loaded.': '对局录像无法加载。',
    'The old code and every link carrying it stop working. Players already in stay in.':
      '旧代码及所有携带它的链接都会失效。已在局中的玩家仍留在局中。',
    'The old name could not be put back.': '无法恢复旧名称。',
    'The operation was aborted.': '操作已中止。',
    'The proceed key — passes priority, or confirms whatever the game is asking (blocks, damage, targets, selections).':
      '「继续」键——让过优先权，或确认当前询问（阻挡、伤害、目标、选择）。',
    'The rules engine every game runs on': '每场对局所用的规则引擎',
    'The scheduled start passed. Start or cancel this event.': '预定开始时间已过。请开始或取消该赛事。',
    'The server is briefly unavailable — try again in a moment.': '服务器暂时不可用——请稍后再试。',
    'The table is waiting on your pick. A released seat is drafted by a bot for the rest of the draft, and can':
      '牌桌正等你的选牌。放弃的席位会由 AI 代抽至轮抽结束，且无法',
    'The top three': '前三名',
    'They could not be dropped. Try again.': '移出失败，请重试。',
    'This deck has no cards — edit it first.': '这套牌没有牌——请先编辑。',
    'This match was voided and does not count toward either player': '本场已作废，不计入双方',
    'This perspective is no longer available.': '该视角已不可用。',
    'This recording contains no board frames.': '这段录像没有战场画面。',
    'This recording could not be opened. It may be incomplete or damaged.':
      '这段录像无法打开，可能不完整或已损坏。',
    'Too early': '太早了',
    'Too late': '太晚了',
    'Too few to call ·': '样本过少 ·',
    'Turn alerts on to allow them as pop-ups on another tab.': '开启提醒后，可在其他标签页以弹窗形式接收。',
    'Victory - you…': '胜利——你…',
    'View mode': '查看模式',
    'Wait crosses a recording gap.': '等待跨越了录像的空白段。',
    'Who made what Endstep is built on, and the licence each is shared under.':
      '谁构建了 Endstep 的基础，以及各自的许可协议。',
    'Whose events': '谁的赛事',
    'With the organizer': '由主办方',
    'Yield until': '让过至',
    'You are away': '你已离开',
    'You are on the draw': '你后手',
    'You are on the play': '你先手',
    'You cancelled Discord sign-in. Try again whenever you': '你取消了 Discord 登录，随时可以重试',
    'You cannot use the': '你不能使用',
    'You could not be entered. Try again.': '无法将你加入，请重试。',
    'You have already met this opponent twice in seven days. Only the first two count, so this one won':
      '你七天内已与这位对手交手两次。只有前两场计入，因此这一场不会计入',
    'You leave this table.': '你离开了这张牌桌。',
    'You left the table — you': '你离开了牌桌——你',
    'You missed the ready check. Matchmaking is temporarily paused.':
      '你错过了准备确认，匹配已暂时暂停。',
    'You sent that one a moment ago. Pick another.': '你刚发过这一条，请换一条。',
    'You will not be paired again, and this cannot be undone. Your results stay, and your opponent this round is given the win.':
      '你不会再被配对，且不可撤销。你的成绩保留，本轮对手判胜。',
    'You wrote:': '你写道：',
    'Your access to report recordings has changed.': '你对举报录像的权限已变更。',
    'Your action could not reach this game. Refresh the page to reconnect, then try again.':
      '你的操作未能送达本局。刷新页面重新连接后再试。',
    'Your clock is running until you answer.': '你的计时正在运行，直到你应答。',
    'Your clock is running, and it runs out before this accepts itself — answer to keep playing.':
      '你的计时正在运行，且会在自动接受之前耗尽——请应答以继续。',
    'Your deck did not load.': '你的套牌未能加载。',
    'Your deck is taking a while to load.': '你的套牌加载较慢。',
    'Your deck stays as registered for the whole event.': '整个赛事期间套牌保持登记状态。',
    'Your events in progress': '你进行中的赛事',
    'Your events not started yet': '你未开始的赛事',
    'Your rank': '你的排名',
    'Your registered deck': '你登记的套牌',
    'Your row': '你所在的行',
    'Your sideboard is submitted. Reload to see it again.': '你的备牌已提交，刷新以再次查看。',
    'Your table is ready against': '你的牌桌已就绪，对手是',
    'Your turn to answer. You are the last to be asked.': '该你应答，你是最后一个被问到的。'
  });

  /* ---------- 34. 界面文案（收尾二） ---------- */

  Object.assign(DICT, {
    '(replays other players saved still show the name you had). Reports you filed, or that were filed about you, are kept until a year after they are closed.':
      '（其他玩家保存的回放仍会显示你当时用的名字）。你提交的、以及针对你的举报，会在结案后保留一年。',
    'A round robin': '循环赛',
    'An error occurred': '发生错误',
    'An ongoing match continues. You won': '进行中的对局继续。你赢下了',
    'Building closes at': '构筑截止于',
    'Canadian Highlander': '加拿大高地',
    'Cannot close': '无法关闭',
    'Cannot parse': '无法解析',
    'Deck building ·': '构筑 ·',
    'Decks are being built. Settings marked': '正在构筑。标记为',
    'Decks are built from each player': '套牌由每位玩家的',
    'Decks on the graph': '图表上的套牌',
    'Development log: the post': '开发日志：帖子',
    'Dismiss reveals (': '关闭展示（',
    'Dragging was cancelled. Draggable item': '拖动已取消。可拖动项',
    'Elimination bracket': '淘汰赛对阵',
    'Endstep hit an unexpected error and couldn': 'Endstep 遇到意外错误，无法',
    'Endstep still can': 'Endstep 仍无法',
    'Endstep will clear this device': 'Endstep 将清除本设备',
    'Enter Shift+F10': '输入 Shift+F10',
    'Every rated': '每场计分',
    'Evidence type': '证据类型',
    'Forfeit the series. Your opponent wins the match. This can': '弃权整场系列赛，对手获胜。此操作',
    'Founding Patron is open until': '创始支持者名额开放至',
    'From Cube Cobra': '来自 Cube Cobra',
    'Lose this game. The match continues. This can': '输掉本盘。对局继续。此操作',
    'Mana and card-type symbols in text': '牌面文字中的法术力与牌张类别符号',
    'Message a player from their card, or': '从牌张上给玩家发消息，或',
    'No card table for this window: next to another window': '该时间窗没有牌张表：与其他时间窗并列时',
    'No decided': '无已决',
    'No page at': '该地址没有页面',
    'No valid elements provided.': '未提供有效元素。',
    'Non-string found in selected audio sources - ignoring.': '音频源中发现非字符串项——已忽略。',
    'Now at the Tables · 32': '现在在牌桌 · 32',
    'Offered to': '已移交给',
    'Part of the app couldn': '应用的某部分无法',
    'Patreon linking isn': 'Patreon 绑定目前不可',
    'Picked for': '为…选取',
    'Press Begin within': '请在…内点击「开始」',
    'Prompt for': '…的提示',
    'Registered deck. Choose': '已登记套牌。选择',
    'Reloading and clearing this device': '正在刷新并清除本设备',
    'Reloading didn': '刷新未能',
    'Repeat count too high, must be less than 20': '重复次数过高，必须小于 20',
    'Replay files aren': '回放文件不会',
    'Replays couldn': '回放无法',
    'Set a password first, or you': '请先设置密码，否则你',
    'Settings copied from': '设置复制自',
    'Sideboard window did not load:': '备牌窗口加载失败：',
    'Standings in the order the server placed them: match points, then opponents':
      '排名按服务器的排定顺序：先比比赛积分，再比对手',
    'Start with': '起始为',
    'Stops at': '停止于',
    'Text changed: all instances of': '文本已更改：所有',
    'That badge': '该徽章',
    'That couldn': '那无法',
    'That didn': '那没有',
    'That player': '该玩家',
    'That quick reply isn': '该快捷回复不是',
    'The event': '该赛事',
    'The file couldn': '文件无法',
    'The format': '该赛制',
    'The ladder couldn': '天梯无法',
    'The ladders couldn': '天梯无法',
    'The picture on the event': '赛事卡片上的图片',
    'The replay couldn': '回放无法',
    'The request couldn': '请求无法',
    'This deck': '这套牌',
    'This draft isn': '该轮抽不是',
    'This match doesn': '本场不',
    'This player hasn': '该玩家还没有',
    'This profile couldn': '该资料无法',
    'This replay can': '该回放无法',
    'This replay file is damaged and can': '该回放文件已损坏，无法',
    'Ties break on OMW% (your opponents': '同分时比较 OMW%（你的对手',
    'Up to': '最多',
    'Waiting on': '等待',
    'Warnings don': '警告不会',
    'We couldn': '我们无法',
    'Which cards': '哪些牌',
    'You blocked': '你屏蔽了',
    'You can': '你可以',
    'You didn': '你没有',
    'You hadn': '你没有',
    'You have': '你有',
    'Your badges couldn': '你的徽章无法',
    'Your chat is muted. You can': '你的聊天已被禁言，你可以',
    'Your recent matches couldn': '你最近的对局无法',
    'Your run': '你的挑战',
    'Invalid message': '消息无效'
  });
  /* ---------- 35. 牌桌设置补充 ---------- */

  Object.assign(DICT, {
    'Spectators': '观战者',
    'The AI\'s deck': 'AI 的套牌',
    'Choose the AI\'s deck': '选择 AI 的套牌',
    'Watching': '观战中',
    'Cheats': '作弊项',
    'Rewind': '回退',
    'Begin with': '与',
    'Mirrors your deck': '镜像你的套牌'
  });
  /* ---------- 36. 阶段分组小写标签 ---------- */

  Object.assign(DICT, {
    'main': '主要阶段',
    'combat': '战斗阶段',
    'ending': '结束阶段',
    'beginning': '开始阶段',
    'mulligan': '调度'
  });
  /* ---------- 38. 对局结算句（五段拼接） ---------- */

  Object.assign(DICT, {
    'You and': '你和',
    'drew after': '战成平局，用时',
    'The match was drawn after': '本场平局，用时',
    'You wrest the match from': '你击败了',
    'You take the match after': '你赢下本场，用时',
    'You yield the match to': '你认输，对手',
    'takes the match after': '赢下本场，用时',
    'after': '，用时',
    'turns.': '回合。',
    'turns': '回合',
    'Life total': '总生命',
    'Hand': '手牌',
    'Last turn': '最后一个回合',
    'Match record': '对局记录',
    'Victory': '胜利',
    'Defeat': '失败',
    'Rematch': '再战一局',
    'Back to lobby': '返回大厅'
  });
  /* ---------- 39. 个人主页 / 徽章 ---------- */

  Object.assign(DICT, {
    'Tournament results': '比赛成绩',
    'Add to sideboard': '加入备牌',
    'Add to deck': '加入套牌',
    'Add to maybeboard': '加入待定区',
    'Add to cube': '加入立方',
    'Add to binder': '加入卡册',
    'Add to wishlist': '加入愿望单',
    'Your finishes appear here once you complete a tournament.': '完成一场比赛后，成绩会显示在这里。',
    'This player hasn\'t finished a tournament yet.': '该玩家还没有完成过比赛。',
    'counted matches': '已计入对局',
    'counted': '已计入',
    'Play rated matches against established opponents.': '与已确立的对手进行计分对局。',
    'Rated win streak': '计分连胜',
    'Five in a Row': '五连胜',
    'Ten in a Row': '十连胜',
    'Badges': '徽章',
    'Pinned': '已固定',
    'Tournaments': '比赛',
    'Event': '赛事',
    'Finished tournaments, newest first': '已完成的比赛，最新在前',
    'Which matches count': '哪些对局计入',
    'Only counted matches are measured, as set out under “Which matches count”.':
      '只统计被计入的对局，规则见「哪些对局计入」。'
  });
  /* ---------- 40. 徽章轨道（服务端数据） ---------- */

  Object.assign(DICT, {
    'counted wins': '已计入胜场',
    'counted games': '已计入对局',
    'hours': '小时',
    'hours played': '小时游玩',
    'Mull to four': '调度到四张',
    'Mull to Four': '调度到四张',
    'Win games after keeping four or fewer cards, in rated matches against established opponents.':
      '在计分对局中保留四张或更少的牌后赢下比赛。',
    'Hours played': '游玩时长',
    'Time spent in games of any kind.': '花在任何对局上的时间。',
    '10 Hours Played': '游玩 10 小时',
    '50 Hours Played': '游玩 50 小时',
    '100 Hours Played': '游玩 100 小时',
    'Founding Patron': '创始支持者',
    'No longer awarded.': '已不再授予。',
    'Founding Patron Acolyte': '创始支持者·侍僧',
    'Founding Patron Mage': '创始支持者·法师',
    'Founding Patron Archmage': '创始支持者·大法师',
    'No longer awarded': '已不再授予',
    'Given for a finish, not counted.': '因名次给予，不计入统计。'
  });
  /* ---------- 41. 万智牌常见关键字 ---------- */

  Object.assign(DICT, {
    // 常青关键字
    'Flying': '飞行',
    'Reach': '延势',
    'Trample': '践踏',
    'First strike': '先攻',
    'Double strike': '连击',
    'Deathtouch': '死触',
    'Lifelink': '系命',
    'Vigilance': '警戒',
    'Haste': '敏捷',
    'Hexproof': '辟邪',
    'Shroud': '帷幕',
    'Indestructible': '不灭',
    'Flash': '闪现',
    'Defender': '守军',
    'Menace': '威慑',
    'Prowess': '灵技',
    'Ward': '守护',
    'Protection': '保护',
    'Fear': '恐惧',
    'Intimidate': '威吓',
    'Shadow': '次元幽影',
    'Horsemanship': '骑术',
    'Banding': '羁绊',
    'Rampage': '狂暴',
    'Flanking': '侧击',
    'Wither': '凋萎',
    'Infect': '侵染',
    'Persist': '留存',
    'Undying': '不息',
    'Unleash': '脱缰',
    'Scavenge': '食腐',
    'Evolve': '进化',
    'Bloodthirst': '嗜血',
    'Devoid': '无质',
    'Ingest': '摄食',
    'Awaken': '觉醒',
    'Surge': '涌动',
    'Convoke': '召集',
    'Delve': '掘穴',
    'Improvise': '即兴',
    'Cascade': '倾曳',
    'Storm': '风暴',
    'Madness': '疯魔',
    'Morph': '变身',
    'Manifest': '显化',
    'Mutate': '变异',
    'Suspend': '延缓',
    'Rebound': '弹回',
    'Retrace': '复咏',
    'Flashback': '返照',
    'Cycling': '循环',
    'Kicker': '增幅',
    'Escalate': '升级',
    'Entwine': '缠结',
    'Buyback': '购回',
    'Overload': '压印',
    'Aftermath': '余响',
    'Escape': '脱逃',
    'Companion': '行侣',
    'Partner': '拍档',
    'Changeling': '化形',
    'Investigate': '探查',
    'Explore': '探索',
    'Landfall': '地落',
    'Raid': '突袭',
    'Revolt': '起义',
    'Ferocious': '威猛',
    'Spell mastery': '咒语精通',
    'Threshold': '门槛',
    'Delirium': '躁狂',
    'Metalcraft': '金技',
    'Hellbent': '竭念',
    'Ascend': '登殿',
    'Amass': '集结',
    'Adapt': '适应',
    'Riot': '暴动',
    'Spectacle': '炫威',
    'Undergrowth': '林地',
    'Magecraft': '法术师',
    'Daybound': '日耀',
    'Nightbound': '夜阴',
    'Cleave': '劈砍',
    'Blitz': '闪击',
    'Casualty': '献祭',
    'Enlist': '征召',
    'Read ahead': '预读',
    'Bargain': '议价',
    'Craft': '工艺',
    'Disguise': '伪装',
    'Saddle': '骑乘',
    'Gift': '赠礼',
    'Offspring': '子裔',
    'Impending': '将至',
    // 关键字列表的标题与说明
    'Keywords': '关键字',
    'Keyword': '关键字',
    'Keyword abilities': '关键字异能',
    'Active keyword abilities': '生效中的关键字异能',
    'Current keywords': '当前关键字'
  });

  /* 带参数的关键字（Ward {2}、Scry 2 …） */
  RULES.push(
    [/^Ward (\{[^}]+\}|\d+)$/i, function (_, n) { return '守护' + n; }],
    [/^Scry (\d+)$/i, function (_, n) { return '检视 ' + n; }],
    [/^Cycling (\{[^}]+\}|\d+)$/i, function (_, n) { return '循环' + n; }],
    [/^Kicker (\{[^}]+\})$/i, function (_, n) { return '增幅' + n; }],
    [/^Flashback (\{[^}]+\})$/i, function (_, n) { return '返照' + n; }],
    [/^Equip (\{[^}]+\})$/i, function (_, n) { return '装备' + n; }],
    [/^Annihilator (\d+)$/i, function (_, n) { return '歼灭 ' + n; }],
    [/^Affinity for (.+)$/i, function (_, n) { return '亲和' + trDeep(n); }],
    [/^Protection from (.+)$/i, function (_, n) {
      var c = { red: '红色', blue: '蓝色', green: '绿色', white: '白色', black: '黑色', colorless: '无色', artifacts: '神器', creatures: '生物', instants: '瞬间', sorceries: '法术', enchantments: '结界', everything: '所有' };
      return '保护免受' + (c[String(n).toLowerCase()] || trDeep(n));
    }],
  );

  /* ---------- 42. 法术力符号 SVG（内嵌，运行时零请求） ---------- */

  var MS_SVG = {
    "0": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><circle fill='#CAC5C0' cx='50' cy='50' r='50'/><path d='M23 52.428c0-9.787 2.061-18.813 6.191-27.072 5.117-10.236 12.123-15.355 21.012-15.355 8.797 0 15.666 4.359 20.605 13.064 4.127 7.186 6.191 15.537 6.191 25.051 0 9.881-2.064 18.814-6.191 26.803-5.031 10.058-12.035 15.081-21.011 15.081-8.531 0-15.305-4.307-20.336-12.926-4.308-7.361-6.461-15.576-6.461-24.646zm11.309-4.444c0 12.926 1.93 22.984 5.795 30.168 2.691 5.025 6.146 7.541 10.367 7.541 10.146 0 15.221-10.506 15.221-31.518 0-9.244-.809-17.059-2.422-23.434-2.785-10.504-7.498-15.76-14.145-15.76-9.879 0-14.816 10.15-14.816 30.443v2.56z' fill='#0D0F0F'/></g></svg>",
    "1": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M55.685 11.001v64.108c0 7.671 3.226 11.504 9.687 11.504h1.684v4.388h-34.111v-4.388h2.141c6.247 0 9.369-3.833 9.369-11.504v-42.054c0-7.758-2.697-11.643-8.081-11.643h-3.429v-4.247h1.237c6.66 0 12.691-2.057 18.08-6.165l3.423.001z' fill='#0D0F0F'/></g></svg>",
    "2": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"m78.442 69.105-5.681 19.898H25.555v-4.254c2.293-2.652 7.318-8.001 15.076-16.053a331.261 331.261 0 0 0 13.882-15.371c2.291-2.651 4.057-4.942 5.287-6.862 2.733-4.114 4.1-8.32 4.1-12.624 0-4.204-1.254-7.912-3.766-11.112-2.512-3.204-5.752-4.808-9.722-4.808-8.548 0-15.246 5.998-20.094 17.98l-4.235-1.647c5.73-16.829 14.763-25.249 27.106-25.249 6.083 0 11.261 2.149 15.536 6.448 4.278 4.3 6.414 9.604 6.414 15.92 0 8.052-4.449 15.918-13.353 23.601l-9.254 7.956c-5.908 5.127-10.804 9.929-14.676 14.412-.27.273-.796.916-1.587 1.921h24.59c3.79 0 6.656-.776 8.594-2.335 1.672-1.372 3.309-3.98 4.895-7.821h4.094Z\" fill=\"#0D0F0F\"/></g></svg>",
    "3": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M39.561 53.562l-2.018-3.771 1.337-.807c5.174-3.145 9.903-6.33 14.189-9.563 4.284-3.232 6.427-6.915 6.427-11.048 0-2.778-1.029-5.112-3.085-6.998-2.061-1.892-4.472-2.834-7.244-2.834-6.439 0-13.234 4.001-20.392 11.991l-3.354-2.559c7.453-11.316 16.566-16.974 27.341-16.974 4.757 0 8.795 1.168 12.122 3.503 3.771 2.607 5.655 6.153 5.655 10.642 0 3.229-1.349 6.374-4.039 9.426-1.528 1.798-4.226 4.132-8.083 7.004l-1.616 1.213c.718-.089 1.572-.134 2.56-.134 4.937 0 8.998 1.887 12.188 5.657 3.188 3.771 4.783 8.17 4.783 13.196 0 8.532-3.595 15.667-10.774 21.416-6.647 5.387-14.325 8.077-23.032 8.077-7.991 0-14.276-1.748-18.858-5.249l2.429-3.371c5.387 2.608 10.279 3.907 14.681 3.907 6.373 0 12.051-2.109 17.032-6.33 4.988-4.22 7.475-9.469 7.475-15.755 0-4.132-1.255-7.655-3.77-10.576-2.516-2.915-5.793-4.374-9.832-4.374-3.684.002-7.723 1.437-12.122 4.311z' fill='#0D0F0F'/></g></svg>",
    "4": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M64.27 68.359v6.723c0 7.684 2.695 11.525 8.094 11.525h2.33v4.394h-32.658v-4.394h2.607c5.303 0 7.961-3.798 7.961-11.392v-6.856h-32.795v-6.861l34.578-50.497h9.883v51.592h.82c3.383 0 5.852-2.608 7.408-7.816h4.115l-1.92 13.583-10.423-.001zm-11.666-5.766v-41.458l-27.893 41.458h27.893z' fill='#0D0F0F'/></g></svg>",
    "5": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M34.957 12.352h28.941c3.754 0 5.988-.45 6.703-1.352h4.156l-2.422 10.925h-35.314l-3.408 15.789c5.127-2.07 9.668-3.104 13.625-3.104 7.729 0 14.25 2.587 19.559 7.758 5.305 5.171 7.961 11.622 7.961 19.357 0 8.996-3.465 16.237-10.394 21.722-6.385 5.039-14.162 7.553-23.338 7.553-5.395 0-10.66-.808-15.785-2.426l1.617-4.046c4.32 1.169 8.141 1.751 11.469 1.751 6.654 0 12.477-2.18 17.473-6.544 4.99-4.358 7.488-9.826 7.488-16.392 0-5.665-1.844-10.32-5.533-13.959-3.689-3.646-8.365-5.468-14.033-5.468-5.213 0-10.07 1.8-14.568 5.396l-2.701-.538 8.504-36.422z' fill='#0D0F0F'/></g></svg>",
    "6": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M36.58 45.675c5.934-5.577 11.91-8.364 17.939-8.364 6.564 0 11.828 2.606 15.787 7.821 3.682 4.77 5.529 10.521 5.529 17.27 0 7.376-2.158 13.849-6.475 19.425-4.768 6.114-10.703 9.174-17.807 9.174-8.547 0-15.381-3.69-20.504-11.063-4.59-6.477-6.883-14.167-6.883-23.071 0-9.44 2.607-18.141 7.824-26.101 5.213-7.958 12.184-13.602 20.906-16.928 4.947-1.888 10.168-2.839 15.65-2.839v4.184c-11.691.631-20.414 5.308-26.174 14.031-2.958 4.501-4.895 9.983-5.792 16.461zm-.812 8.092c-.086 1.618-.133 3.238-.133 4.857 0 6.203 1.078 11.96 3.236 17.269 2.785 6.922 6.883 10.385 12.279 10.385 4.674 0 8.18-2.381 10.52-7.151 1.797-3.684 2.697-8.135 2.697-13.355 0-5.571-.857-10.342-2.563-14.299-2.34-5.396-5.936-8.092-10.793-8.092-5.933-.001-11.017 3.464-15.243 10.386z' fill='#0D0F0F'/></g></svg>",
    "7": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M53.494 91h-11.643v-1.238c0-7.396 2.328-16.659 6.98-27.808 7.035-16.799 13.52-29.673 19.453-38.624l.822-1.232h-27.256c-3.93 0-6.92.819-8.975 2.463-2.059 1.645-3.582 4.387-4.586 8.222h-4.52l4.926-21.782h2.881c1.734.914 4.742 1.371 9.041 1.371h35.609v6.165c-1.275 1.829-2.918 4.75-4.926 8.768-3.838 7.485-7.352 16.208-10.553 26.163-4.743 14.702-7.163 27.209-7.253 37.532z' fill='#0D0F0F'/></g></svg>",
    "8": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M40.965 50.463l-1.746-1.211c-5.119-3.502-8.492-6.33-10.107-8.489-2.066-2.691-3.096-5.83-3.096-9.426 0-6.105 2.557-11.087 7.678-14.949 4.758-3.59 10.281-5.388 16.568-5.388 5.922 0 11.18 1.573 15.756 4.713 5.203 3.503 7.813 8.127 7.813 13.876 0 7.004-4.898 12.66-14.682 16.967 11.131 5.388 16.699 12.884 16.699 22.492 0 6.914-2.646 12.389-7.949 16.434-4.753 3.682-10.729 5.518-17.909 5.518-6.734 0-12.525-1.703-17.377-5.119-5.568-3.856-8.348-8.976-8.348-15.349 0-6.373 2.963-11.63 8.889-15.761 1.616-1.074 4.223-2.51 7.811-4.308zm4.572 1.912c-8.08 3.677-12.111 9.466-12.111 17.361 0 5.113 1.635 9.218 4.916 12.314 3.277 3.097 7.475 4.643 12.594 4.643 4.574 0 8.461-1.232 11.646-3.695 3.186-2.464 4.781-5.891 4.781-10.28 0-6.626-4.367-12.001-13.098-16.122l-8.728-4.221zm9.031-7.973c7.088-3.141 10.641-7.854 10.641-14.139 0-4.313-1.506-7.766-4.51-10.375-3.012-2.603-6.715-3.906-11.113-3.906-3.684 0-6.869.991-9.563 2.964-2.965 2.154-4.443 5.03-4.443 8.62 0 4.4 2.063 7.948 6.195 10.643.805.537 4.396 2.286 10.775 5.25l2.018.943z' fill='#0D0F0F'/></g></svg>",
    "9": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M63.402 56.524c-5.922 5.567-11.898 8.353-17.91 8.353-6.555 0-11.809-2.604-15.758-7.814-3.684-4.758-5.523-10.507-5.523-17.241 0-7.272 2.152-13.777 6.461-19.526 4.672-6.199 10.555-9.296 17.648-9.296 8.622 0 15.489 3.728 20.605 11.181 4.582 6.554 6.867 14.319 6.867 23.302 0 12.746-4.224 23.498-12.655 32.257-8.441 8.752-18.993 13.174-31.653 13.261v-4.175c3.859-.176 6.953-.626 9.297-1.344 12.922-3.951 20.469-13.601 22.621-28.958zm.813-8.082c.086-1.706.129-3.322.129-4.846 0-6.285-1.074-12.034-3.23-17.24-2.875-6.916-7-10.374-12.386-10.374-4.676 0-8.125 2.385-10.375 7.141-1.797 3.683-2.691 8.126-2.691 13.334 0 5.566.852 10.324 2.559 14.275 2.332 5.387 5.926 8.083 10.777 8.083 5.92 0 10.99-3.458 15.217-10.373z' fill='#0D0F0F'/></g></svg>",
    "10": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M35.306 19.633v50.439c0 5.998 2.567 8.998 7.693 8.998h1.305v3.42h-26.866v-3.42h1.727c4.931 0 7.4-3 7.4-8.998v-33.08c0-6.08-2.155-9.123-6.467-9.123h-2.66v-3.424h1.016c5.238 0 9.969-1.604 14.191-4.813l2.661.001zm9.76 33.328c0-7.857 1.646-15.082 4.94-21.668 4.142-8.193 9.805-12.293 16.982-12.293 6.931 0 12.422 3.508 16.476 10.516 3.296 5.748 4.945 12.381 4.945 19.898 0 7.859-1.648 15.039-4.945 21.545-4.141 8.029-9.757 12.041-16.853 12.041-6.842 0-12.293-3.465-16.352-10.395-3.464-5.828-5.193-12.376-5.193-19.644zm9.122-3.676c0 6.68.718 12.676 2.156 17.996 2.197 8.195 5.785 12.295 10.771 12.295 8.111 0 12.165-8.447 12.165-25.346 0-20.869-4.394-31.301-13.182-31.301-7.941 0-11.912 8.105-11.912 24.328l.002 2.028z' fill='#0D0F0F'/></g></svg>",
    "11": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M39.831 19.32v50.84c0 6.049 2.516 9.07 7.536 9.07h1.279v3.449h-27.081v-3.449h1.788c5.109 0 7.667-3.021 7.667-9.07v-33.34c0-6.133-2.173-9.195-6.518-9.195h-2.683v-3.449h1.024c5.28 0 10.047-1.617 14.304-4.855l2.684-.001zm32.449 0v50.84c0 6.049 2.511 9.07 7.537 9.07h1.278v3.449h-27.086v-3.449h1.788c5.115 0 7.667-3.021 7.667-9.07v-33.34c0-6.133-2.173-9.195-6.513-9.195h-2.682v-3.449h1.019c5.28 0 10.047-1.617 14.31-4.855l2.682-.001z' fill='#0D0F0F'/></g></svg>",
    "12": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M35.63 20.215v49.18c0 5.875 2.428 8.816 7.277 8.816h1.278v3.445h-26.185v-3.445h1.533c4.938 0 7.406-2.941 7.406-8.816v-32.32c0-5.955-2.043-8.939-6.128-8.939h-2.682v-3.322h1.019c5.109 0 9.709-1.531 13.795-4.598l2.687-.001zm50.965 46.367l-4.471 15.203h-37.429v-3.32c1.793-2.043 5.749-6.133 11.882-12.266 3.659-3.66 7.324-7.578 10.988-11.748 1.788-2.049 3.191-3.748 4.215-5.115 2.126-3.232 3.191-6.465 3.191-9.703 0-3.238-.981-6.092-2.938-8.561-1.959-2.471-4.559-3.705-7.791-3.705-6.731 0-12.012 4.598-15.843 13.799l-3.321-1.279c4.601-12.775 11.752-19.164 21.461-19.164 4.767 0 8.857 1.621 12.262 4.855 3.404 3.238 5.109 7.281 5.109 12.137 0 6.215-3.534 12.262-10.598 18.141l-7.282 5.873c-4.688 3.92-8.561 7.625-11.628 11.111-.254.262-.681.729-1.273 1.41h19.544c2.979 0 5.192-.557 6.643-1.664 1.445-1.102 2.766-3.107 3.956-6.004h3.323z' fill='#0D0F0F'/></g></svg>",
    "13": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M37.967 20.789v48.543c0 5.707 2.428 8.555 7.282 8.555h1.149v3.322h-25.802v-3.322h1.663c4.938 0 7.406-2.848 7.406-8.555v-31.811c0-5.873-2.089-8.814-6.258-8.814h-2.558v-3.316h1.024c5.021 0 9.538-1.535 13.54-4.602h2.554zm21.717 32.191l-1.533-2.813 1.153-.641c3.831-2.379 7.387-4.785 10.666-7.215 3.274-2.426 4.917-5.17 4.917-8.238 0-2.129-.811-3.898-2.427-5.301-1.617-1.408-3.41-2.109-5.364-2.109-4.943 0-10.136 2.982-15.588 8.945l-2.553-1.918c5.619-8.516 12.517-12.777 20.692-12.777 3.576 0 6.602.895 9.07 2.684 2.896 1.965 4.346 4.645 4.346 8.051 0 2.387-1.024 4.725-3.067 7.021-1.195 1.279-3.238 3.025-6.133 5.24l-1.149 1.023c.51-.082 1.149-.129 1.918-.129 3.748 0 6.81 1.43 9.195 4.277 2.386 2.852 3.576 6.113 3.576 9.771 0 6.475-2.724 11.84-8.177 16.096-4.938 4.086-10.687 6.135-17.24 6.135-6.051 0-10.775-1.279-14.18-3.836l1.788-2.553c4.002 1.871 7.661 2.813 10.982 2.813 4.771 0 9.029-1.574 12.776-4.73 3.748-3.148 5.619-7.068 5.619-11.752 0-3.15-.936-5.83-2.807-8.045-1.877-2.215-4.346-3.322-7.412-3.322-2.722.001-5.747 1.109-9.068 3.323z' fill='#0D0F0F'/></g></svg>",
    "14": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M36.308 20.471v49.053c0 5.789 2.427 8.684 7.276 8.684h1.154v3.322h-26.062v-3.322h1.663c4.938 0 7.407-2.895 7.407-8.684v-32.191c0-5.879-2.09-8.816-6.259-8.816h-2.557v-3.32h1.023c5.021 0 9.579-1.574 13.665-4.725l2.69-.001zm43.047 43.687v5.109c0 5.707 1.996 8.561 6.003 8.561h1.658v3.316h-24.398v-3.316h1.918c4.003 0 6.004-2.813 6.004-8.43v-5.24h-24.528v-5.109l25.932-37.814h7.412v38.578h.639c2.47 0 4.299-1.953 5.489-5.873h3.066l-1.533 10.219-7.662-.001zm-6.773-5.109v-32.189l-21.716 32.189h21.716z' fill='#0D0F0F'/></g></svg>",
    "15": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M100 49.998c0 27.615-22.387 50.002-50.002 50.002-27.613 0-49.998-22.387-49.998-50.002 0-27.613 22.385-49.998 49.998-49.998 27.615 0 50.002 22.385 50.002 49.998z' id='Shape' fill='#CAC5C0'/><path d='M34.67 18.129v50.84c0 6.045 2.516 9.07 7.537 9.07h1.277v3.445h-27.078v-3.445h1.787c5.109 0 7.666-3.025 7.666-9.07v-33.344c0-6.129-2.172-9.195-6.518-9.195h-2.682v-3.449h1.023c5.281 0 10.047-1.617 14.305-4.852h2.683zm17.885 1.273h23.121c2.984 0 4.771-.336 5.369-1.02h3.322l-1.918 8.688h-28.229l-2.682 12.516c3.998-1.617 7.578-2.428 10.729-2.428 6.133 0 11.305 2.049 15.52 6.135 4.215 4.084 6.32 9.193 6.32 15.328 0 7.152-2.723 12.898-8.17 17.246-5.115 4-11.291 6.004-18.525 6.004-4.258 0-8.43-.641-12.516-1.918l1.273-3.191c3.404.934 6.43 1.402 9.07 1.402 5.281 0 9.902-1.742 13.861-5.234 3.961-3.492 5.936-7.84 5.936-13.031 0-4.512-1.465-8.219-4.402-11.113-2.941-2.895-6.621-4.344-11.051-4.344-4.172 0-8.045 1.449-11.625 4.344l-2.168-.383 6.765-29.001z' fill='#0D0F0F'/></g></svg>",
    "16": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M34.309 19.322v50.838c0 6.047 2.516 9.07 7.537 9.07h1.279v3.447h-27.082v-3.447h1.789c5.109 0 7.668-3.023 7.668-9.07v-33.344c0-6.127-2.174-9.193-6.52-9.193h-2.682v-3.451h1.023c5.281 0 10.049-1.617 14.305-4.85h2.683zm20.058 27.459c4.684-4.422 9.408-6.643 14.18-6.643 5.109 0 9.236 2.049 12.391 6.135 2.895 3.746 4.34 8.305 4.34 13.668 0 5.791-1.703 10.859-5.109 15.199-3.746 4.855-8.43 7.281-14.049 7.281-6.643 0-12.006-2.895-16.098-8.684-3.576-5.109-5.365-11.156-5.365-18.141 0-7.49 2.043-14.371 6.135-20.631 4.084-6.258 9.58-10.707 16.477-13.348 3.83-1.451 7.922-2.174 12.262-2.174v3.322c-9.193.428-16.051 4.092-20.563 10.988-2.304 3.579-3.837 7.919-4.601 13.028zm-.64 6.264c-.082 1.273-.129 2.553-.129 3.83 0 4.938.852 9.496 2.559 13.672 2.213 5.445 5.445 8.17 9.707 8.17 3.66 0 6.43-1.871 8.301-5.619 1.363-2.895 2.043-6.43 2.043-10.604 0-4.34-.633-8.088-1.912-11.236-1.877-4.262-4.729-6.389-8.561-6.389-4.684 0-8.686 2.725-12.008 8.176z' fill='#0D0F0F'/></g></svg>",
    "17": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M33.711 20.152v49.307c0 5.879 2.43 8.814 7.285 8.814h1.148v3.322h-26.188v-3.322h1.789c4.938 0 7.41-2.936 7.41-8.814v-32.318c0-5.957-2.129-8.941-6.387-8.941h-2.559v-3.32h1.023c5.109 0 9.711-1.576 13.797-4.727l2.682-.001zm32.707 61.825h-8.945v-1.02c0-5.707 1.789-12.902 5.363-21.586 5.453-12.949 10.48-22.912 15.074-29.893l.516-.895h-20.953c-3.066 0-5.387.639-6.961 1.912-1.574 1.279-2.793 3.41-3.645 6.389h-3.445l3.832-16.861h2.301c1.273.598 3.578.895 6.898.895h27.59v4.855c-1.02 1.449-2.297 3.746-3.832 6.896-2.984 5.795-5.707 12.521-8.176 20.182-3.664 11.415-5.535 21.126-5.617 29.126z' fill='#0D0F0F'/></g></svg>",
    "18": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M35.975 20.214v49.436c0 5.879 2.428 8.815 7.281 8.815h1.279v3.321h-26.316v-3.321h1.664c5.021 0 7.537-2.937 7.537-8.815v-32.444c0-5.962-2.133-8.939-6.389-8.939h-2.557v-3.322h1.023c5.109 0 9.709-1.574 13.795-4.729h2.683v-.002zm22.609 30.401l-1.277-1.019c-4.002-2.724-6.643-4.896-7.916-6.513-1.533-2.131-2.303-4.6-2.303-7.412 0-4.683 2-8.514 6.002-11.497 3.576-2.807 7.84-4.216 12.777-4.216 4.6 0 8.686 1.195 12.262 3.576 3.918 2.729 5.879 6.347 5.879 10.858 0 5.452-3.748 9.839-11.244 13.16 8.604 4.174 12.902 10.006 12.902 17.501 0 5.364-2.086 9.621-6.26 12.771-3.574 2.813-8.133 4.215-13.67 4.215-5.279 0-9.791-1.32-13.539-3.961-4.34-2.978-6.514-6.938-6.514-11.876 0-5.026 2.34-9.112 7.027-12.268 1.192-.844 3.151-1.952 5.874-3.319zm3.576 1.409c-6.215 2.895-9.324 7.406-9.324 13.54 0 3.919 1.279 7.09 3.83 9.517 2.559 2.428 5.75 3.639 9.586 3.639 3.576 0 6.596-.956 9.07-2.874 2.469-1.913 3.701-4.574 3.701-7.984 0-5.192-3.322-9.366-9.965-12.516l-6.898-3.322zm7.027-6.133c5.537-2.469 8.301-6.128 8.301-10.982 0-3.321-1.168-6.004-3.508-8.052-2.344-2.043-5.219-3.062-8.623-3.062-2.813 0-5.322.806-7.537 2.422-2.219 1.622-3.32 3.837-3.32 6.644 0 3.409 1.574 6.133 4.725 8.176.68.426 3.492 1.788 8.43 4.091l1.532.763z' fill='#0D0F0F'/></g></svg>",
    "19": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M37.162 19.574v50.205c0 5.962 2.51 8.939 7.537 8.939h1.277v3.451h-26.824v-3.451h1.787c5.027 0 7.537-2.978 7.537-8.939v-32.959c0-6.045-2.131-9.07-6.389-9.07h-2.682v-3.446h1.023c5.193 0 9.918-1.575 14.18-4.729l2.554-.001zm40.75 35.771c-4.684 4.429-9.365 6.643-14.049 6.643-5.109 0-9.242-2.089-12.393-6.263-2.812-3.659-4.216-8.13-4.216-13.41 0-5.708 1.658-10.817 4.979-15.329 3.746-4.854 8.39-7.281 13.925-7.281 6.728 0 12.049 2.895 15.967 8.686 3.66 5.197 5.494 11.284 5.494 18.265 0 10.053-3.3 18.504-9.899 25.359-6.602 6.855-14.881 10.327-24.846 10.41v-3.321c3.066-.171 5.494-.515 7.281-1.023 10.138-3.068 16.052-10.646 17.757-22.736zm.641-6.264c.082-1.356.129-2.635.129-3.83 0-4.938-.852-9.45-2.557-13.54-2.299-5.364-5.535-8.047-9.711-8.047-3.658 0-6.346 1.83-8.045 5.494-1.451 2.979-2.174 6.472-2.174 10.474 0 4.34.682 8.093 2.043 11.237 1.789 4.174 4.602 6.264 8.432 6.264 4.6 0 8.56-2.682 11.883-8.052z' fill='#0D0F0F'/></g></svg>",
    "20": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M53.244 64.266l-4.471 14.945h-36.791v-3.068c1.789-2.041 5.75-6.086 11.883-12.131 3.576-3.66 7.152-7.496 10.729-11.498 1.871-2.042 3.238-3.789 4.09-5.24 2.209-3.066 3.316-6.258 3.316-9.578 0-3.066-.998-5.813-2.998-8.238-2.002-2.428-4.539-3.639-7.6-3.639-6.643 0-11.84 4.512-15.588 13.541l-3.447-1.279c4.512-12.689 11.582-19.033 21.203-19.033 4.771 0 8.836 1.615 12.199 4.854 3.367 3.238 5.047 7.24 5.047 12.006 0 6.051-3.535 11.965-10.604 17.756l-7.152 6.004c-4.6 3.92-8.389 7.537-11.367 10.857-.256.172-.682.682-1.279 1.535h19.164c2.979 0 5.234-.642 6.768-1.918 1.279-1.021 2.557-2.98 3.83-5.875h3.068v-.001zm-.51-13.414c0-7.408 1.533-14.264 4.6-20.563 4.002-7.834 9.408-11.754 16.223-11.754 6.555 0 11.793 3.363 15.713 10.09 3.061 5.453 4.594 11.752 4.594 18.904 0 7.495-1.533 14.311-4.594 20.444-4.008 7.659-9.373 11.491-16.098 11.491-6.471 0-11.67-3.274-15.584-9.836-3.238-5.534-4.854-11.792-4.854-18.776zm8.686-3.448c0 6.389.68 12.096 2.043 17.116 2.041 7.84 5.451 11.754 10.219 11.754 7.748 0 11.627-8.047 11.627-24.146 0-19.928-4.217-29.891-12.646-29.891-7.496 0-11.242 7.748-11.242 23.248l-.001 1.919z' fill='#0D0F0F'/></g></svg>",
    "W": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><circle fill='#F8F6D8' cx='50' cy='50' r='50'/><path d='M97.691 57.064c-6.561-3.699-10.768-5.551-12.617-5.551-1.344 0-2.395 1.032-3.154 3.092-.758 2.063-2.27 3.09-4.541 3.09-.926 0-2.818-.336-5.678-1.008-1.598 2.44-2.398 3.996-2.398 4.668 0 .926.689 2.016 2.064 3.281 1.375 1.262 2.535 1.891 3.482 1.891.602 0 1.416-.125 2.449-.379 1.031-.25 1.721-.377 2.064-.377 1.033 0 1.547 1.893 1.547 5.678 0 3.617-.84 9.168-2.523 16.654-2.188-8.58-4.5-12.871-6.938-12.871-.338 0-1.031.252-2.082.76-1.053.502-1.83.754-2.334.754-2.438 0-4.625-2.227-6.561-6.688-3.869.59-5.805 2.567-5.805 5.934 0 1.684.777 3.027 2.336 4.035 1.553 1.008 2.334 1.727 2.334 2.145 0 2.273-3.324 5.764-9.969 10.473-3.531 2.523-5.973 4.289-7.316 5.297 1.174-1.512 2.352-3.487 3.533-5.928 1.344-2.775 2.018-4.92 2.018-6.436 0-.84-.967-2.02-2.902-3.533-1.936-1.512-2.9-3.111-2.9-4.793 0-1.428.502-3.193 1.512-5.299-1.094-1.262-2.395-1.895-3.91-1.895-3.365 0-5.045 1.096-5.045 3.28v3.406c.082 2.776-2.02 4.164-6.311 4.164-3.279 0-8.791-.759-16.527-2.271 8.748-2.188 13.121-4.711 13.121-7.57 0 .336-.168-.672-.504-3.028-.338-2.604 1.514-4.961 5.551-7.063-.758-3.867-2.773-5.806-6.057-5.806-.504 0-1.432.884-2.775 2.647-1.346 1.771-2.607 2.652-3.783 2.652-2.02 0-4.629-2.186-7.822-6.563-1.516-2.184-3.83-5.424-6.941-9.715 1.934 1.012 3.869 2.02 5.805 3.031 2.523 1.176 4.541 1.766 6.057 1.766 1.178 0 2.334-1.031 3.469-3.092 1.135-2.061 2.629-3.092 4.479-3.092.254 0 1.936.504 5.047 1.516 1.596-2.439 2.398-4.248 2.398-5.426 0-1.01-.611-2.166-1.83-3.471-1.221-1.303-2.334-1.955-3.344-1.955-.422 0-1.072.125-1.957.379-.881.252-1.533.379-1.953.379-1.516 0-2.273-1.893-2.273-5.678 0-1.01.969-6.77 2.904-17.285-.086 1.26.461 3.617 1.639 7.064 1.43 4.207 3.111 6.309 5.049 6.309.334 0 1.008-.252 2.018-.758 1.008-.504 1.807-.754 2.396-.754 1.934 0 3.531 1.094 4.795 3.277l1.893 3.406c1.766 0 3.238-.629 4.414-1.891 1.178-1.262 1.768-2.777 1.768-4.543 0-1.85-.777-3.26-2.334-4.227-1.559-.967-2.336-1.703-2.336-2.207 0-1.768 2.777-4.752 8.328-8.958 4.457-3.363 7.359-5.34 8.707-5.93-3.617 4.879-5.426 8.451-5.426 10.724 0 1.178.713 2.441 2.145 3.785 1.766 1.598 2.775 2.734 3.027 3.406.84 1.938.756 4.586-.252 7.949 2.271 1.6 3.994 2.396 5.174 2.396 2.436 0 3.658-1.264 3.658-3.785 0-.252-.105-1.051-.314-2.396-.213-1.344-.273-2.102-.191-2.271.336-1.178 2.65-1.768 6.939-1.768 2.691 0 8.283.758 16.781 2.273-1.852.504-4.627 1.26-8.326 2.27-3.365 1.01-5.049 2.145-5.049 3.406 0 .59.209 1.598.631 3.027.42 1.432.633 2.48.633 3.156 0 1.176-.758 2.27-2.271 3.277l-4.291 3.031c1.01 1.852 1.682 2.945 2.02 3.279.84 1.008 1.975 1.514 3.406 1.514 1.01 0 1.934-.883 2.775-2.648.84-1.768 2.188-2.65 4.037-2.65 2.27 0 4.838 2.104 7.697 6.311 1.593 2.36 4.075 5.933 7.44 10.727zm-28.007-7.316c0-5.381-1.979-10.051-5.932-14.006-3.953-3.953-8.621-5.93-14.004-5.93-5.469 0-10.18 1.957-14.131 5.869-3.953 3.91-5.973 8.6-6.055 14.066-.086 5.383 1.912 10.03 5.992 13.938 4.08 3.912 8.811 5.869 14.193 5.869 5.719 0 10.492-1.873 14.318-5.615 3.83-3.74 5.701-8.47 5.619-14.191zm-1.893 0c0 5.131-1.725 9.381-5.174 12.74-3.451 3.367-7.74 5.049-12.869 5.049-4.963 0-9.211-1.723-12.742-5.174-3.531-3.445-5.299-7.652-5.299-12.615 0-4.877 1.785-9.064 5.359-12.553 3.578-3.49 7.803-5.238 12.682-5.238 4.877 0 9.104 1.766 12.68 5.301 3.574 3.533 5.363 7.695 5.363 12.49z' fill='#0D0F0F'/></g></svg>",
    "U": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><circle fill='#C1D7E9' cx='50' cy='50' r='50'/><path d='M67.488 83.719c-4.787 4.871-10.684 7.307-17.688 7.307-7.861 0-14.098-2.69-18.711-8.073-4.359-5.127-6.537-11.662-6.537-19.606 0-8.543 3.717-18.286 11.15-29.224 6.064-8.969 13.199-16.83 21.402-23.58-1.197 5.469-1.793 9.355-1.793 11.662 0 5.299 1.664 10.467 4.996 15.508 4.102 5.98 7.219 10.426 9.357 13.328 3.332 5.043 4.998 9.955 4.998 14.737.002 7.093-2.391 13.074-7.174 17.941zm-.129-27.362c-1.281-2.861-2.777-4.762-4.486-5.703.256.514.385 1.24.385 2.18 0 1.795-.512 4.357-1.539 7.689l-1.664 5.127c0 2.99 1.492 4.486 4.484 4.486 3.16 0 4.742-2.095 4.742-6.281 0-2.134-.64-4.632-1.922-7.498z' fill='#0D0F0F'/></g></svg>",
    "B": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M90.695 48.14c0 5.463-2.008 9.189-6.02 11.175-1.172.58-4.85 1.365-11.037 2.36-4.012.663-6.018 2.194-6.018 4.592v10.058c0 .418.125 1.698.375 3.85l.377 3.975c0 1.242-.293 3.273-.879 6.085-1.588.33-3.428.702-5.518 1.12-.67-2.486-1.004-4.182-1.004-5.095 0-.411.105-1.034.313-1.863.207-.826.316-1.447.316-1.864 0-.575-.52-2.191-1.559-4.839h-1.945c-.258.414-.344.952-.26 1.613.334 1.408.459 2.607.377 3.6a282.655 282.655 0 0 1-5.895 3.974c-.586-.164-.793-.247-.629-.247v-8.816c-.164-.412-.584-.575-1.254-.497h-1.504l-1.504 11.67c-1.174.083-2.592.083-4.264 0-.588-2.73-1.631-6.785-3.135-12.167h-1.004c-.922 2.9-1.422 4.474-1.506 4.722 0 .33.104.97.314 1.922.207.953.313 1.593.313 1.924 0 .248-.084.868-.25 1.862l-.377 2.98a.862.862 0 0 1-.627.248c-2.508 0-4.182-.62-5.016-1.86-.836-1.244-1.172-2.982-1.004-5.219l1.004-14.898c0-.25.082-.58.25-.994.164-.414.25-.704.25-.868 0-.664-.711-1.989-2.131-3.975-.248-.08-1.549-.373-3.887-.87-1.424-.33-4.225-.909-8.402-1.739-5.771-1.073-8.654-5.668-8.654-13.782 0-12.086 5.018-22.143 15.051-30.173.414 2.236 1.127 5.214 2.129 8.94.754.168 2.385.54 4.891 1.117.504.167 3.053 1.078 7.652 2.733-2.344-1.408-5.393-3.682-9.156-6.83-1.422-1.655-2.133-4.426-2.133-8.316 0-.911 1.59-1.989 4.768-3.232 2.84-1.159 4.975-1.818 6.396-1.986 4.514-.577 7.984-.87 10.41-.87 10.449 0 18.891 2.65 25.328 7.949-2.088 2.402-5.684 4.964-10.783 7.696 2.008.083 4.934-.7 8.779-2.36 3.844-1.653 5.475-2.483 4.891-2.483.668 0 2.008 1.327 4.014 3.975 1.504 1.986 2.715 3.769 3.637 5.337 2.674 4.721 4.471 9.81 5.393 15.274 0 1.906.041 3.272.125 4.098v.994h.002Zm-48.031 2.235c0-3.558-1.568-6.932-4.703-10.122-3.137-3.187-6.502-4.778-10.096-4.778-3.178 0-5.977 1.335-8.402 4-2.426 2.666-3.637 5.625-3.637 8.874 0 2.83 1.379 4.666 4.139 5.498 1.756.5 4.219.793 7.398.874h6.898c5.598.083 8.403-1.366 8.403-4.346Zm13.668 15.4v-3.851a120.953 120.953 0 0 1-1.754-3.354c-.502-1.657-1.422-3.974-2.76-6.955l-1.381 14.529c0 1.16-.25 1.738-.752 1.738-.334 0-.584-.081-.752-.245-.586-8.776-.879-12.584-.879-11.427v-4.344c-.168-.251-.375-.375-.625-.375-2.844 2.901-4.264 7.576-4.264 14.032 0 3.56.33 5.753 1.002 6.582.67-.164 1.422-.455 2.258-.868.334-.167 1.295-.25 2.887-.25 1.584 0 3.51.497 5.766 1.49.836 0 1.254-2.234 1.254-6.703Zm28.344-17.303c0-3.333-1.254-6.312-3.762-8.935-2.51-2.622-5.395-3.936-8.652-3.936-3.512 0-6.795 1.591-9.846 4.778-3.053 3.187-4.578 6.519-4.578 9.996 0 2.9 1.42 4.346 4.264 4.346h14.422c5.433-.081 8.152-2.165 8.152-6.249Z\" fill=\"#0D0F0F\"/></g></svg>",
    "R": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><circle fill='#E49977' cx='50' cy='50' r='50'/><path d='M91.965 66.617c-3.736 8.912-11.16 13.367-22.275 13.367-2.037 0-4.246.254-6.621.762-3.564.764-5.346 1.828-5.346 3.186 0 .424.295.91.891 1.463.592.553 1.104.826 1.527.826-2.123 0-.68.064 4.326.191 5.008.127 8.148.191 9.422.191-7.383 4.326-19.732 6.319-37.043 5.981-5.688-.084-10.566-2.588-14.639-7.51-3.992-4.669-5.984-9.888-5.984-15.658 0-6.108 2.057-11.308 6.176-15.595 4.113-4.282 9.229-6.427 15.338-6.427 1.357 0 3.16.297 5.41.891 2.248.594 3.756.891 4.518.891 3.139 0 7.045-1.293 11.713-3.883 4.666-2.588 6.875-3.883 6.621-3.883-.85 8.912-3.82 14.896-8.914 17.948-3.648 2.123-5.473 4.201-5.473 6.236 0 1.273.764 2.293 2.291 3.057 1.188.595 2.502.892 3.945.892 2.207 0 4.371-1.356 6.494-4.071 2.119-2.718 3.055-5.177 2.801-7.386-.254-2.545-.084-5.603.51-9.164.168-1.02.783-2.27 1.844-3.754 1.061-1.486 2.016-2.398 2.865-2.738 0 .762-.275 2.037-.828 3.818-.553 1.781-.826 3.1-.826 3.947 0 1.867.508 3.309 1.527 4.326 1.525-.592 2.883-2.502 4.074-5.729 1.016-2.459 1.609-4.836 1.781-7.127-3.566-.17-6.982-1.781-10.248-4.838-3.268-3.057-4.9-6.365-4.9-9.928 0-.594.082-1.188.256-1.783.508.764 1.271 1.953 2.289 3.564 1.443 2.121 2.547 3.182 3.313 3.182 1.016 0 1.525-1.061 1.525-3.182 0-2.715-.723-5.176-2.164-7.383-1.613-2.631-3.693-3.947-6.238-3.947-1.189 0-2.971.637-5.344 1.91-2.379 1.271-4.543 1.91-6.492 1.91-.596 0-3.229-.766-7.895-2.293 8.23-1.355 12.348-2.586 12.348-3.691 0-2.885-5.645-4.838-16.93-5.855-1.105-.084-3.141-.254-6.111-.51.338-.424 2.758-.891 7.258-1.4 3.818-.422 6.492-.637 8.018-.637 20.197 0 33.012 9.805 38.443 29.408.934-.773 1.402-2.066 1.402-3.871 0-2.324-.68-5.25-2.037-8.777-.512-1.375-1.318-3.441-2.42-6.193 6.957 8.867 10.439 17.27 10.439 25.199 0 4.178-.979 7.973-2.93 11.381-1.27 2.303-3.65 5.244-7.127 8.826-3.48 3.58-5.857 6.352-7.131 8.313 4.668-1.271 7.725-2.248 9.168-2.928 3.223-1.44 6.15-3.606 8.783-6.492 0 1.106-.467 2.762-1.4 4.967zm-55.502-50.025c0 1.525-.85 2.502-2.545 2.926l-3.311.51c-1.189.594-2.928 2.928-5.219 7-.256-1.271-.637-3.053-1.146-5.346-.764.086-2.035.764-3.818 2.037-.764.594-1.996 1.484-3.693 2.672.512-3.055 2.207-6.148 5.094-9.293 3.055-3.477 6.025-5.217 8.91-5.217 3.818 0 5.728 1.572 5.728 4.711zm22.15 11.709c0 1.443-.785 2.654-2.355 3.629-1.57.977-3.119 1.465-4.646 1.465-2.037 0-3.863-1.146-5.473-3.438-1.955-2.801-3.947-4.625-5.984-5.477.424-.422.934-.635 1.529-.635.764 0 2.055.594 3.881 1.781 1.824 1.189 2.99 1.783 3.502 1.783.424 0 1.123-.594 2.1-1.783.975-1.188 2.057-1.781 3.246-1.781 2.8.001 4.2 1.487 4.2 4.456z' fill='#0D0F0F'/></g></svg>",
    "G": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M100 49.998c0 27.615-22.385 50.002-50.002 50.002-27.613 0-49.998-22.387-49.998-50.002 0-27.613 22.385-49.998 49.998-49.998 27.617 0 50.002 22.385 50.002 49.998z' id='Shape' fill='#A3C095'/><path d='M93.762 56.225c0 1.668-.645 3.164-1.936 4.498-1.289 1.332-2.77 1.998-4.436 1.998-2.662 0-4.623-1.25-5.869-3.748l-5.871-.25c-1.252 0-3.709.543-7.371 1.625-3.914 1.082-6.164 1.957-6.746 2.623-.916.998-1.664 3.332-2.248 6.996-.502 2.998-.748 5.205-.748 6.621 0 2.246.352 3.893 1.061 4.934.709 1.041 2.166 1.916 4.371 2.623 2.205.707 3.561 1.104 4.061 1.187.332 0 .873-.041 1.625-.125h1.498c1.08 0 2.205.17 3.373.5 1.666.5 2.375 1.166 2.125 2-1.168-.166-3.207.084-6.121.75l3.496 1.748c0 1-1.416 1.498-4.246 1.498-.752 0-1.771-.166-3.063-.498-1.291-.336-2.145-.5-2.559-.5h-1.625c-.082.832-.334 2.08-.75 3.746-1.418-.084-3.08-.918-4.996-2.498-1.918-1.58-3.123-2.373-3.621-2.373-.502 0-1.211.793-2.125 2.373-.918 1.58-1.375 2.664-1.375 3.248-1.082-.584-1.996-1.668-2.75-3.248-.332-1.084-.707-2.166-1.121-3.248-.832.084-2.375 1.834-4.621 5.248h-.627c-.166-.252-.795-2-1.873-5.248-2.582-.832-4.996-1.248-7.246-1.248-1.082 0-2.748.25-4.996.748l-3.496-.248c.498-.5 1.955-1.457 4.371-2.873 2.83-1.666 4.996-2.5 6.496-2.5.246 0 .578.043 1 .125.414.086.75.125 1 .125.578 0 1.518-.312 2.809-.938 1.291-.623 2.039-1.186 2.246-1.684.211-.504.316-1.793.316-3.875 0-4.746-1.25-8.285-3.75-10.617-2.168-2.082-5.746-3.58-10.744-4.498-1.332 4.746-5.08 7.123-11.24 7.123-2 0-3.998-1.207-5.996-3.623-1.996-2.416-2.996-4.623-2.996-6.621 0-3.082 1.287-5.621 3.869-7.623-2.08-2.162-3.121-4.369-3.121-6.617 0-2.084.643-3.914 1.936-5.5 1.291-1.578 2.977-2.496 5.059-2.748-.166-2.662.707-4.496 2.623-5.496-.916-.914-1.373-2.537-1.373-4.869 0-2.748.916-5.039 2.748-6.871 1.83-1.832 4.121-2.75 6.869-2.75 3 0 5.457 1.045 7.371 3.125 2.416-8.244 7.621-12.367 15.613-12.367 4.164 0 7.828 1.666 10.994 4.998 1.166 1.248 1.748 1.916 1.748 1.996-1 0-.498-.188 1.5-.561 1.996-.375 3.453-.563 4.373-.563 3.246 0 6.119 1.207 8.619 3.623 2.164 2.166 3.664 4.912 4.498 8.244.58.084 1.498.332 2.748.748 1.83.92 2.748 2.498 2.748 4.748 0 .418-.336 1.209-1 2.373 5.328 2.998 7.994 7.162 7.994 12.492 0 1.498-.582 3.584-1.748 6.247 2.166 1.247 3.246 3.081 3.246 5.495zm-51.467 5.496v-1.623c0-1.914-.936-3.664-2.809-5.246-1.875-1.582-3.77-2.373-5.684-2.373-2.334 0-4.496.541-6.496 1.621 4.413-.248 9.411 2.293 14.989 7.621zm-2.246-15.489c-1.25-1.418-2.332-2.875-3.25-4.373-3.498.916-5.246 1.957-5.246 3.121 1-.08 2.457.105 4.371.564 1.914.459 3.291.688 4.125.688zm7.621-3.873v-5.496c-2-.332-3.211-.5-3.623-.5v1.873l3.623 4.123zm16.238-3.498c-1-.416-2.875-1.25-5.621-2.498v10.742c3.912-2.25 5.785-4.998 5.621-8.244zm6.867 14.741l-2.746-3.373c-1.664 1.167-3.352 2.354-5.061 3.561-1.709 1.207-3.186 2.563-4.432 4.06 3.747-2.002 7.829-3.414 12.239-4.248z' fill='#0D0F0F'/></g></svg>",
    "C": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M100 50c0 27.609-22.382 50-50 50s-50-22.391-50-50 22.382-50 50-50 50 22.391 50 50z' id='Shape' fill='#CAC5C0'/><path d='M49.687 12.026c2.475 4.968 5.504 9.793 9.096 14.475 1.528 1.966 3.279 4.021 5.254 6.147 1.948 2.126 4.11 4.253 6.451 6.344 2.359 2.091 4.941 4.074 7.756 5.951 2.815 1.876 5.843 3.592 9.096 5.129-4.78 2.556-9.516 5.665-14.225 9.346-1.956 1.537-4.003 3.306-6.147 5.325-2.126 2.002-4.217 4.2-6.263 6.576-2.046 2.412-4.012 5.004-5.897 7.827-1.877 2.806-3.583 5.79-5.12 8.953-2.395-4.7-5.379-9.346-8.962-13.956-3.074-3.931-6.96-8.059-11.66-12.42-4.691-4.36-10.373-8.238-17.03-11.651 4.789-2.484 9.525-5.557 14.224-9.221 4.012-3.163 8.149-7.112 12.411-11.848 4.27-4.736 7.933-10.383 11.016-16.977zm-5.504 52.895c2.225 2.824 4.056 5.683 5.504 8.578 1.885-4.021 4.146-7.47 6.781-10.365 2.645-2.913 5.218-5.343 7.693-7.309 2.814-2.198 5.754-4.128 8.837-5.772-4.101-1.859-7.586-4.128-10.436-6.773-2.868-2.645-5.281-5.2-7.237-7.684-2.225-2.805-4.11-5.79-5.638-8.953-1.876 4.092-4.128 7.595-6.719 10.49-2.609 2.913-5.146 5.325-7.622 7.309-2.823 2.216-5.763 4.074-8.837 5.629 4.101 2.127 7.595 4.521 10.499 7.166 2.904 2.645 5.299 5.218 7.175 7.684z' fill='#000'/></g></svg>",
    "S": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><circle fill='#C9C4BE' cx='50.001' cy='50' r='50'/><path id='Shape' fill='#0D0F0F' d='M37.843 89.157l2.355-4.08 9.803 13.804 9.802-13.804 2.355 4.08 4.338.051 8.505 4.095.707-9.412 2.125-3.786-2.354-4.078 16.855-1.588-7.055-15.389h4.711l2.213-3.732 7.797-5.318-7.797-5.319-2.213-3.731h-4.711l7.054-15.391-16.854-1.586 2.354-4.08-2.126-3.782-.707-9.412-8.504 4.093-4.338.051-2.355 4.079-9.803-13.804-9.802 13.804-2.355-4.079-4.338-.051-8.505-4.093-.707 9.412-2.125 3.782 2.355 4.08-16.856 1.587 7.055 15.39h-4.711l-2.213 3.732-7.798 5.318 7.797 5.318 2.214 3.732h4.711l-7.054 15.391 16.855 1.586-2.355 4.078 2.125 3.784.708 9.414 8.504-4.094z'/><path d='M34.895 80.211l15.105-24.336 15.105 24.336v4.048l3.504 2.023 3.507-2.024v-4.046l-3.507-2.024-13.521-25.25 28.629-.915 3.506 2.025 3.504-2.023v-4.049l-3.504-2.023-3.506 2.023-28.629-.913 13.523-25.25 3.506-2.024v-4.046l-3.506-2.024-3.504 2.023-.002 4.047-15.104 24.336-15.105-24.336-.001-4.048-3.503-2.023-3.507 2.025v4.046l3.506 2.024 13.522 25.25-28.628.913-3.507-2.023-3.503 2.022v4.048l3.503 2.024 3.507-2.024 28.628.915-13.523 25.25-3.505 2.023-.001 4.047 3.506 2.023 3.505-2.023v-4.047zm22.156-57.818l-7.05 12.288-7.05-12.288 7.05-12.289 7.05 12.289zm-27.434 7.697l7.117 12.25-14.167-.039-7.117-12.249 14.167.038zm-7.051 27.607l14.167-.038-7.117 12.249-14.167.039 7.117-12.25zm20.383 19.91l7.051-12.289 7.05 12.289-7.05 12.289-7.051-12.289zm27.435-7.697l-7.116-12.25 14.166.039 7.117 12.248-14.167-.037zm7.052-27.607l-14.168.038 7.117-12.249 14.166-.039-7.115 12.25z' fill='#fff'/></g></svg>",
    "X": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M100 49.998c0 27.615-22.383 50.002-50 50.002-27.613 0-50-22.387-50-50.002 0-27.613 22.387-49.998 50-49.998 27.617 0 50 22.385 50 49.998z' id='Shape' fill='#CAC5C0'/><path d='M56.641 80v-3.297c4.703-.521 7.059-1.887 7.059-4.082 0-1.582-.629-3.164-1.883-4.746l-13.008-16.01-10.273 12.111c-2.57 2.973-3.863 5.432-3.863 7.354 0 2.976 2.354 4.771 7.07 5.387v3.283h-25.051v-3.287c3.172-.609 5.867-1.752 8.102-3.416 1.539-1.223 3.637-3.371 6.285-6.438l15.449-17.915-17.867-21.66c-2.315-2.797-4.121-4.633-5.401-5.51-1.724-1.225-4.121-2.012-7.203-2.361v-3.413h29.539v3.285c-4.453.877-6.676 2.234-6.676 4.074 0 1.23.594 2.586 1.793 4.072l11.816 14.322 9.508-11.691c1.711-2.104 2.57-3.941 2.57-5.52 0-2.629-2.105-4.34-6.301-5.129v-3.413h23.512v3.291c-2.055.439-3.473.834-4.23 1.188-2.57 1.229-6.496 4.869-11.797 10.92-.852.969-4.453 5.393-10.789 13.285l18.977 23.363c4.113 5.078 8.305 7.971 12.586 8.666v3.287h-29.924z' fill='#0D0F0F'/></g></svg>",
    "Y": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M100 49.998c0 27.613-22.383 50.002-50 50.002-27.613 0-50-22.387-50-50.001 0-27.615 22.387-49.999 50-49.999 27.617 0 50 22.384 50 49.998z' id='Shape' fill='#C9C4BE'/><path d='M54.91 65.695c0 3.988.654 6.793 1.963 8.414 1.309 1.621 3.521 2.431 6.639 2.431l.748-.095v3.555h-28.796v-3.553h.934c3.117.063 5.33-.717 6.639-2.338 1.309-1.619 1.963-4.394 1.963-8.319v-12.53l-18.325-26.833-1.964-2.618c-.561-.748-1.091-1.339-1.589-1.776-.811-.686-1.668-1.169-2.571-1.45-.904-.281-2.073-.514-3.506-.701v-3.647h27.955v3.553c-2.805.25-4.708.64-5.703 1.168-.998.53-1.496 1.512-1.496 2.945 0 .624.124 1.248.373 1.87.249.624.592 1.278 1.029 1.963l14.212 20.569 10.378-15.24c.996-1.371 1.713-2.555 2.15-3.553.435-.996.715-1.931.841-2.804v-.749c0-1.931-.53-3.366-1.589-4.3-1.06-.936-2.899-1.527-5.516-1.776v-3.647h23.093v3.553c-.748.125-1.435.296-2.056.514-.624.219-1.216.515-1.777.889-.998.561-2.026 1.449-3.085 2.665-1.061 1.215-2.337 2.915-3.833 5.096l-17.11 24.309v12.436h-.001v-.001z' fill='#0D0F0F'/></g></svg>",
    "Z": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M100 49.998c0 27.615-22.384 50.002-50 50.002-27.613 0-50-22.387-50-50.002 0-27.613 22.387-49.998 50-49.998 27.616 0 50 22.385 50 49.998z' id='Shape' fill='#C9C4BE'/><path d='M74.355 79.999h-53.76v-2.711l42.635-57.22h-18.979c-3.118.063-5.517.391-7.2.981-1.683.594-3.242 1.73-4.675 3.413-.125.126-.233.25-.327.374-.093.126-.203.25-.327.373-.25.375-.483.702-.702.982-.219.28-.42.577-.607.889-.063.188-.156.374-.28.561l-.374.562c-.126.374-.281.765-.467 1.168-.188.406-.407.889-.654 1.449l-3.367-.094v-14.491h51.049v2.524l-43.007 57.406h18.605c2.805.063 5.033 0 6.685-.188 1.65-.187 3.193-.59 4.628-1.213l.514-.188.421-.188c.873-.436 1.714-.935 2.524-1.496.809-.561 1.62-1.215 2.431-1.963.561-.562 1.122-1.168 1.683-1.822.561-.655 1.153-1.388 1.777-2.197l2.431-3.461h3.552l-4.209 16.55z' fill='#0D0F0F'/></g></svg>",
    "T": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M85.332 59.918h-36.004l13.185-9.383c-4.898-3.887-10.566-5.828-16.984-5.828-3.211 0-5.414.613-6.59 1.836-1.184 1.227-1.777 3.445-1.777 6.654 0 8.873 4.563 18.34 13.691 28.396l-10.391 10.521c-12.09-14.705-18.129-27.844-18.129-39.424 0-6.928 2.086-12.447 6.27-16.545 4.18-4.098 9.746-6.148 16.668-6.148 8.453 0 17.664 3.215 27.641 9.635l7.728-13.182 4.692 33.468z' fill='#0D0F0F'/></g></svg>",
    "Q": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#0D0F0F\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"m78.945 24.039-12.648 7.344c6.16 9.471 9.238 18.224 9.238 26.25 0 6.582-1.969 11.858-5.895 15.83-3.938 3.978-9.219 5.963-15.871 5.963-11.113 0-23.719-5.74-37.824-17.22l10.094-9.877c9.656 8.673 18.73 13.005 27.246 13.005 3.078 0 5.207-.559 6.379-1.683 1.18-1.125 1.766-3.211 1.766-6.259 0-6.1-1.867-11.481-5.594-16.134L46.84 53.776V19.587l32.105 4.452Z\" fill=\"#FFF\"/></g></svg>",
    "E": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 102 101'><g stroke='#fff' fill='none'><path d='M20.796 1c31.629 5.815 45.711 4.744 58.731 0 0 0 4.376 42.061 21.428 62.559 0 0-30.335 8.504-50.112 37.308 0 0-19.364-27.014-49.842-37.789 9.542-13.121 18.357-39.075 19.796-62.078z' fill='#000'/><path d='M38.272 10.497c-.211-1.696 6.723 4.506 26.444-.587 0 0-14.239 11.917-15.834 31.303 0 0 15.408 3.458 29.732-1.089 0 0-21.436 27.626-26.954 52.361 0 0-6.005-13.6.205-36.533 0 0-7.38-5.067-33.694 1.59 0 0 22.678-26.323 20.101-47.044z' fill='#fff'/></g></svg>",
    "P": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 86 100\"><g fill=\"#000\" fill-rule=\"nonzero\"><path d=\"M38.023.342c-2.564.935-4.254 1.78-6.336 3.168a39.056 39.056 0 0 0-2.614 1.88c-1.469 1.177-4.948 4.667-5.904 5.924-2.785 3.68-4.395 7.26-4.948 11.012-.583 3.982-.08 7.442 1.61 10.952.744 1.558 1.498 2.665 2.604 3.821 1.489 1.549 3.047 2.545 4.978 3.188.795.272.966.292 2.464.292 1.8 0 2.776-.161 4.093-.664 3.872-1.498 6.185-5.712 5.984-10.901-.11-2.665-.593-4.466-2.605-9.594-1.71-4.385-2.051-5.894-1.96-8.91.05-2.213.31-3.5 1.136-5.854.764-2.142 1.066-2.695 2.353-4.384.12-.151.18-.272.13-.272-.04.01-.482.16-.985.342ZM46.984.12c.05.071.291.403.543.735a10.013 10.013 0 0 1 1.367 2.283c.503 1.206 1.157 3.258 1.418 4.505.242 1.116.272 1.478.272 3.319.01 1.609-.03 2.253-.171 2.956-.272 1.308-.795 2.987-1.539 4.878-2.464 6.235-2.936 8.136-2.826 11.374.08 2.213.393 3.56 1.237 5.28 1.69 3.47 5.029 5.33 9.242 5.159 1.348-.06 2.354-.322 3.62-.965 2.515-1.258 4.748-3.63 6.045-6.407 1.378-2.956 1.95-5.983 1.74-9.151-.201-2.977-.875-5.43-2.243-8.196-1.398-2.806-2.987-4.958-5.581-7.543-4.093-4.093-7.452-6.306-12.159-8.005-1.056-.382-1.066-.392-.965-.221ZM9.784 21.893C4.092 27.555 1.708 32.011.42 39.423c-.422 2.413-.553 6.546-.272 8.548.513 3.7 1.7 6.979 3.47 9.553.694 1.016 2.474 2.846 3.46 3.55 1.367.986 3.218 1.8 4.766 2.092 1.006.191 2.806.141 3.752-.1 1.076-.282 2.463-.976 3.288-1.66.604-.503 1.84-1.98 2.685-3.208.503-.744 1.177-2.232 1.428-3.188.332-1.227.312-2.987-.04-4.344-.865-3.279-2.514-5.974-6.798-11.123-3.108-3.721-4.013-5.089-4.928-7.382-.573-1.458-.855-3.439-.714-5.008.09-1.016.573-3.319 1.066-5.109.432-1.579.523-2.132.332-2.132-.07 0-1.026.895-2.132 1.981ZM73.956 20.033c-.05.14.02.463.603 2.695.231.855.523 2.162.664 2.897.543 2.815.231 5.219-.996 7.683-1.005 2.041-1.639 2.916-4.405 6.235-1.92 2.293-3.037 3.741-3.821 4.908-2.645 3.992-3.67 7.25-3.148 9.976.282 1.418 1.016 3.097 1.85 4.184.202.261.624.814.936 1.226 1.488 1.972 3.51 3.148 5.903 3.42 2.273.251 4.797-.463 7.16-2.042 1.077-.714 2.927-2.614 3.742-3.841 3.45-5.19 4.414-11.948 2.785-19.611-.653-3.087-1.186-4.666-2.303-6.94-1.518-3.077-3.379-5.57-6.587-8.779-1.166-1.166-2.182-2.132-2.242-2.132-.05 0-.121.05-.141.121ZM41.14 49.74c-5.36.624-9.795 3.138-13.385 7.583-2.222 2.756-4.857 7.392-6.768 11.907-.533 1.258-.744 1.62-1.287 2.263-1.56 1.85-3.36 4.968-4.305 7.442-.442 1.167-.895 2.846-1.126 4.184-.251 1.448-.251 5.36 0 6.637.533 2.685 1.569 4.747 3.077 6.095 1.117 1.005 3.5 2.303 5.2 2.836 1.589.502 2.383.613 4.264.623 2.604 0 3.63-.251 8.548-2.092 4.546-1.71 5.25-1.88 7.623-1.88 2.484 0 2.856.09 7.965 2.001 4.676 1.74 6.275 2.102 8.79 1.991 2.142-.1 3.7-.503 5.712-1.468 3.298-1.589 4.917-3.38 5.853-6.446.774-2.585.855-6.014.21-9.222-.733-3.62-2.654-7.563-5.168-10.61-.604-.744-.815-1.096-1.328-2.313-1.408-3.319-3.349-7-4.968-9.434-3.962-5.963-8.618-9.161-14.542-10.006-.935-.13-3.53-.181-4.364-.09Z\"/></g></svg>",
    "H": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 57 100'><path d='M56.435 49.927c.06-5.453-1.672-10.957-5.068-15.233-1.64-1.806-2.991-3.864-4.728-5.572-3.832-3.801-9.566-4.054-14.18-6.449-.269-2.405-1.148-4.811-.616-7.239.162-.807.401-1.624-.03-2.396-1.211-2.788-.169-5.815-.385-8.721-.161-1.518-.059-3.377-1.506-4.315-.337 3.161-1.499 6.102-2.441 9.1-.435 2.338-.435 4.771-1.442 6.976.64 2.234-.626 4.113-1.995 5.761-3.029 1.551-6.629 1.919-9.263 4.193-1.878 1.595-3.906 2.992-6.007 4.289-1.577 1.973-3.322 3.874-4.026 6.367-2.818 3.402-3.151 7.97-4.749 11.956-.03 5.917 1.169 12.289 4.949 17.032 2.704 2.233 4.594 5.236 7.295 7.467 2.593 1.549 5.359 2.82 8.036 4.211 1.744.408 3.546.608 5.282 1.083 1.407 7.254 2.369 14.683 5.196 21.564.937-2.824.823-5.853 1.633-8.707 1.142-4.219-1.2-8.611.119-12.755 1.978-1.767 5.276-.619 7.469-2.137 4.176-2.574 8.594-5.082 11.623-9.02 1.128-2.264 3.496-3.956 3.496-6.672.019-3.656 2.152-7.083 1.337-10.782zm-30.993 22.38c-3.026-.736-5.844-2.183-8.381-3.95-2.731-1.819-3.749-5.213-6.443-7.076-2.523-3.009-1.978-7.122-3.011-10.689.414-2.489.903-4.956 1.162-7.476 1.23-1.995 3.129-3.586 3.655-5.989 1.805-2.585 4.55-4.372 6.754-6.612 1.604-1.85 4.157-1.068 6.264-1.142-.208 2.041-.373 4.153.137 6.164.249 1.238.807 2.457.616 3.751-.422 2.754.61 5.518-.119 8.241-1.472 5.69.134 11.438.273 17.176-.21 2.539-.33 5.1-.908 7.601zm22.936-10.786c-2.003 1.427-3.711 3.174-5.459 4.883-3.04 2.103-6.045 4.327-9.662 5.378.326-2.581.644-5.236-.178-7.762-2.019-5.708.453-11.679.871-17.451-.368-3.432-.017-7.093-1.592-10.254-.205-2.373.822-4.667 1.516-6.902 2.39.955 4.64 2.242 6.629 3.898 2.402 1.802 6.083 2.967 6.62 6.326.273 2.204 2.687 3.538 2.616 5.794-.149 5.363.591 10.971-1.362 16.092z' fill='#111212'/></svg>",
    "HALF": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#CAC5C0' cx='50' cy='50.998' r='50'/><path d='M52.307 7.25v27.246c0 3.26 1.371 4.889 4.117 4.889h.715v1.865h-14.496v-1.865h.91c2.656 0 3.98-1.629 3.98-4.889v-17.873c0-3.297-1.145-4.947-3.434-4.947h-1.457v-1.805h.523c2.832 0 5.395-.875 7.688-2.621h1.454zm9.246 74.254l-2.504 8.455h-20.82v-1.809c1.012-1.127 3.227-3.4 6.648-6.822 2.063-2.063 4.102-4.238 6.121-6.531 1.012-1.129 1.789-2.102 2.332-2.918 1.207-1.746 1.809-3.535 1.809-5.363 0-1.789-.555-3.363-1.66-4.723-1.105-1.363-2.531-2.045-4.285-2.045-3.773 0-6.727 2.551-8.863 7.643l-1.867-.701c2.527-7.15 6.508-10.729 11.953-10.729 2.684 0 4.965.912 6.855 2.738 1.887 1.828 2.828 4.082 2.828 6.768 0 3.422-1.965 6.766-5.891 10.029l-4.082 3.379c-2.605 2.184-4.766 4.225-6.473 6.129-.117.113-.352.391-.699.814h10.848c1.668 0 2.934-.33 3.789-.992.734-.582 1.457-1.689 2.156-3.32h1.805v-.002zm-40.821-31.049v-2.91h58.328v2.91h-58.328z' fill='#0D0F0F'/></g></svg>",
    "A": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' fill-rule='evenodd'><circle fill='#CAC5C0' cx='50' cy='49.998' r='50'/><path d='M29.906 82.967c-3.174-.855-6.748-1.414-8.446-1.32l-2.944.163.373-1.984c.233-1.243-.248-4.55-1.29-8.864-3.498-14.484-1.34-23.745 8.348-35.81 5.267-6.56 9-7.685 15.156-4.57 4.643 2.348 13.969 10.33 20.12 17.218 11.725 13.13 13.098 18.416 6.405 24.655-5.309 4.95-12.604 9.211-19.034 11.12-4.79 1.422-12.03 1.187-18.688-.608zm-3.877-28.974c2.935-5.976 8.184-11.656 12.894-13.953 3.308-1.613 3.584-2.54 1.293-4.343-3.304-2.599-7.627-1.02-11.858 4.333-6.103 7.72-9.124 18.223-7.532 26.184.365 1.828.483 1.633 1.523-2.522.62-2.476 2.276-6.84 3.68-9.699zm47.925 13.164c1.328-3.178 1.091-5.107-1.181-9.618-5.843-11.6-22.08-27.284-32.144-31.047-3.461-1.295-3.856-1.324-6.441-.472-2.752.906-2.754.905-2.754-.563 0-1.824 1.9-5.63 3.563-7.133 2.975-2.69 9.45-3.592 14.078-1.96 1.381.487 4.786 2.265 7.566 3.95 5.016 3.04 5.09 3.063 9.673 2.893 2.54-.095 4.953-.379 5.362-.632.41-.254 1.89-2.023 3.288-3.932 3.65-4.983 4.345-5.255 5.064-1.982.215.979 1.248 3.075 2.297 4.658l1.906 2.878-1.79 1.296c-4.427 3.202-5.019 4.129-5.373 8.41l-.335 4.06 3.625 6.021c4.195 6.966 5.2 10.572 4.289 15.379-.336 1.772-.886 3.735-1.222 4.362-1.002 1.873-4.19 4.24-6.617 4.914-3.648 1.013-3.852.907-2.854-1.482z' fill='#000' fill-rule='nonzero'/></g></svg>",
    "L": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M21 9v83h58.704V76.655H39.251V9z' fill='#000' fill-rule='nonzero'/></svg>",
    "D": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50.646 92H15V9h35.646c5.127.075 9.393.676 12.798 1.802 5.8 1.914 10.497 5.424 14.09 10.53 2.882 4.13 4.846 8.596 5.894 13.401S85 44.118 85 48.473c0 11.036-2.208 20.384-6.624 28.042C72.388 86.838 63.145 92 50.646 92ZM63.5 30.172c-2.657-4.504-7.915-6.757-15.773-6.757H31.784v54.17h15.943c8.158 0 13.846-4.036 17.064-12.107 1.76-4.43 2.639-9.704 2.639-15.823 0-8.446-1.31-14.94-3.93-19.483Z' fill='#000' fill-rule='nonzero'/></svg>",
    "WU": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M85.349 14.637c9.052 9.051 14.651 21.551 14.651 35.36 0 27.616-22.387 50.003-50.001 50.003-13.806 0-26.305-5.596-35.354-14.646' id='Shape' fill='#C1D7E9'/><path d='M14.646 85.354c-9.049-9.047-14.646-21.549-14.646-35.356 0-27.613 22.386-49.997 49.999-49.997 13.804 0 26.302 5.594 35.35 14.637' id='Shape' fill='#F8F6D8'/><path d='M76.722 83.675c-2.693 2.739-6.007 4.109-9.946 4.109-4.423 0-7.93-1.515-10.525-4.541-2.452-2.884-3.676-6.558-3.676-11.028 0-4.804 2.09-10.281 6.271-16.434 3.41-5.047 7.423-9.467 12.037-13.264-.672 3.076-1.009 5.262-1.009 6.561 0 2.98.935 5.886 2.812 8.721 2.305 3.365 4.06 5.864 5.261 7.496 1.874 2.835 2.813 5.6 2.813 8.289-.001 3.99-1.348 7.354-4.038 10.091zm-.071-15.388c-.722-1.609-1.563-2.68-2.524-3.208.145.288.216.698.216 1.226 0 1.01-.287 2.453-.864 4.324l-.938 2.885c0 1.68.84 2.522 2.524 2.522 1.776 0 2.667-1.177 2.667-3.532-.001-1.201-.361-2.608-1.081-4.217zm-21.984-30.023c-2.436-2.264-4.054-3.492-4.848-3.682-.577-.139-1.135.197-1.672 1.005-.537.808-1.292 1.095-2.268.858-.397-.094-1.175-.434-2.333-1.016-.938.885-1.441 1.471-1.511 1.758-.095.397.089.938.55 1.621.46.685.894 1.072 1.301 1.17.257.063.622.092 1.09.09.468-.002.777.015.926.051.444.104.469.971.079 2.597-.37 1.552-1.302 3.853-2.794 6.892-.058-3.908-.609-5.988-1.655-6.238-.145-.035-.469.003-.972.111-.505.106-.864.138-1.08.086-1.048-.252-1.758-1.434-2.131-3.547-1.722-.145-2.757.506-3.103 1.949-.173.725.024 1.383.589 1.975.564.594.824.98.783 1.16-.232.978-2.021 2.133-5.355 3.474-1.777.721-3.007 1.228-3.688 1.522.659-.527 1.369-1.257 2.126-2.183.862-1.056 1.372-1.905 1.528-2.558.086-.359-.208-.967-.883-1.815-.676-.849-.926-1.633-.753-2.354.146-.614.543-1.319 1.193-2.121-.34-.653-.834-1.06-1.484-1.215-1.444-.346-2.279-.049-2.504.892l-.349 1.462c-.25 1.2-1.296 1.58-3.138 1.141-1.409-.339-3.696-1.229-6.864-2.673 3.982-.04 6.119-.675 6.412-1.903-.033.146-.003-.307.096-1.353.123-1.153 1.16-1.976 3.108-2.464.073-1.738-.593-2.775-2.003-3.114-.216-.052-.706.232-1.463.853-.76.621-1.393.871-1.898.748-.867-.205-1.762-1.412-2.684-3.619-.426-1.096-1.087-2.723-1.982-4.885l2.181 1.896c.963.766 1.77 1.225 2.419 1.382.506.12 1.108-.204 1.808-.973.698-.769 1.446-1.058 2.24-.866.111.025.78.414 2.012 1.169.937-.884 1.466-1.577 1.588-2.084.102-.435-.04-.991-.431-1.678-.389-.685-.802-1.078-1.235-1.185-.181-.043-.472-.057-.877-.037-.406.018-.699.004-.879-.039-.65-.155-.781-1.045-.392-2.672.102-.434 1.111-2.808 3.022-7.123-.166.531-.173 1.601-.021 3.203.181 1.953.687 3.026 1.518 3.228.144.034.459-.005.945-.119.485-.112.853-.14 1.105-.078.83.198 1.404.833 1.722 1.901l.463 1.656c.757.182 1.455.063 2.089-.358.636-.42 1.046-1.011 1.227-1.769.189-.795 0-1.479-.568-2.056-.57-.575-.829-.971-.775-1.188.181-.758 1.68-1.754 4.495-2.989 2.26-.985 3.709-1.537 4.349-1.651-2.054 1.725-3.199 3.07-3.431 4.047-.121.506.055 1.123.531 1.848.595.867.912 1.459.95 1.771.162.92-.146 2.047-.924 3.389.811.92 1.469 1.439 1.977 1.562 1.044.25 1.699-.167 1.958-1.25.027-.108.063-.462.112-1.062.046-.6.098-.931.151-.996.267-.471 1.32-.486 3.162-.045 1.156.277 3.479 1.176 6.972 2.699-.846.026-2.116.065-3.809.12-1.549.087-2.388.402-2.519.943-.059.254-.074.708-.04 1.364.034.656.016 1.133-.053 1.42-.12.507-.558.896-1.311 1.176l-2.156.859c.246.897.42 1.438.531 1.615.259.52.693.854 1.307 1.002.434.104.922-.181 1.465-.854.542-.672 1.212-.912 2.006-.723.975.232 1.861 1.398 2.658 3.5.441 1.174 1.139 2.965 2.092 5.37zm-11.275-6.021c.552-2.312.183-4.521-1.108-6.623-1.292-2.104-3.094-3.433-5.404-3.986-2.349-.562-4.573-.206-6.671 1.069-2.098 1.271-3.448 3.078-4.045 5.417-.59 2.303-.21 4.505 1.141 6.603 1.35 2.1 3.18 3.426 5.493 3.979 2.455.587 4.698.275 6.725-.941 2.025-1.214 3.315-3.055 3.869-5.518zm-.814-.194c-.527 2.203-1.703 3.852-3.53 4.939-1.826 1.09-3.843 1.373-6.044.846-2.131-.51-3.777-1.688-4.94-3.531-1.163-1.843-1.489-3.828-.979-5.962.503-2.095 1.698-3.708 3.592-4.841 1.896-1.129 3.889-1.445 5.983-.943 2.094.5 3.728 1.693 4.899 3.577 1.171 1.886 1.512 3.854 1.019 5.915z' fill='#0D0F0F'/></g></svg>",
    "WB": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#F8F6D8\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.637C94.401 23.688 100 36.188 100 49.997 100 77.613 77.614 100 49.999 100c-13.806 0-26.305-5.596-35.354-14.646\" fill=\"#CAC5C0\"/><path d=\"M89.62 65.99c0 2.701-.982 4.544-2.947 5.525-.574.287-2.374.678-5.404 1.166-1.963.33-2.946 1.086-2.946 2.271v4.973c0 .209.063.842.185 1.905l.185 1.966c0 .613-.144 1.617-.431 3.008-.777.163-1.678.348-2.701.555-.328-1.23-.491-2.069-.491-2.52 0-.203.05-.512.153-.921.102-.407.154-.716.154-.922 0-.284-.253-1.083-.762-2.394h-.953c-.126.205-.167.472-.127.797.164.697.225 1.289.186 1.781-.697.491-1.657 1.146-2.885 1.965-.289-.082-.389-.123-.308-.123v-4.359c-.081-.203-.285-.285-.614-.246h-.737l-.737 5.771c-.573.041-1.268.041-2.086 0-.287-1.351-.799-3.354-1.535-6.017h-.493c-.45 1.433-.695 2.211-.737 2.334 0 .163.052.479.155.951.102.472.153.787.153.951 0 .122-.042.43-.125.921l-.184 1.475a.425.425 0 0 1-.306.12c-1.228 0-2.048-.307-2.455-.919-.412-.615-.576-1.475-.493-2.58l.493-7.365c0-.123.039-.287.121-.492.082-.203.123-.348.123-.428 0-.328-.348-.984-1.043-1.968-.123-.04-.757-.185-1.904-.431-.695-.162-2.066-.449-4.112-.857-2.825-.531-4.238-2.803-4.238-6.814 0-5.978 2.457-10.949 7.367-14.92.204 1.106.554 2.578 1.045 4.42l2.394.554c.247.081 1.494.532 3.745 1.351-1.145-.695-2.64-1.818-4.48-3.375-.697-.818-1.046-2.19-1.046-4.113 0-.452.778-.982 2.335-1.6 1.391-.572 2.434-.896 3.131-.979 2.209-.286 3.908-.431 5.096-.431 5.115 0 9.25 1.311 12.401 3.932-1.022 1.188-2.783 2.453-5.279 3.806.982.041 2.415-.347 4.298-1.168 1.882-.815 2.68-1.228 2.394-1.228.327 0 .983.656 1.965 1.965.734.982 1.329 1.863 1.78 2.64a23.075 23.075 0 0 1 2.641 7.552c0 .942.02 1.617.061 2.025l-.002.49Zm-23.516 1.108c0-1.761-.767-3.429-2.301-5.006-1.536-1.576-3.186-2.363-4.944-2.363-1.555 0-2.925.66-4.113 1.978-1.187 1.319-1.78 2.782-1.78 4.39 0 1.4.675 2.309 2.026 2.719.86.248 2.066.392 3.621.434h3.377c2.743.035 4.114-.682 4.114-2.152Zm6.693 7.612v-1.901a61.917 61.917 0 0 1-.858-1.66c-.246-.817-.697-1.963-1.351-3.439l-.676 7.184c0 .576-.122.861-.369.861-.163 0-.287-.04-.368-.123-.287-4.338-.429-6.222-.429-5.646v-2.148c-.083-.126-.185-.188-.308-.188-1.391 1.437-2.086 3.748-2.086 6.938 0 1.761.163 2.845.49 3.257a5.52 5.52 0 0 0 1.106-.431c.163-.083.633-.123 1.411-.123.775 0 1.72.245 2.823.735.411-.003.615-1.105.615-3.316Zm13.876-8.556c0-1.646-.614-3.119-1.842-4.418-1.228-1.297-2.64-1.945-4.234-1.945-1.72 0-3.328.787-4.821 2.361-1.495 1.576-2.242 3.224-2.242 4.945 0 1.432.697 2.147 2.088 2.147h7.059c2.662-.04 3.992-1.068 3.992-3.09Zm-32.006-27.89c-2.436-2.264-4.054-3.492-4.848-3.682-.577-.139-1.135.197-1.672 1.005-.537.808-1.292 1.095-2.268.858-.397-.094-1.175-.432-2.333-1.016-.938.885-1.441 1.471-1.511 1.758-.095.397.089.938.55 1.623.46.683.894 1.07 1.301 1.168.257.063.622.092 1.09.09.468 0 .777.015.926.051.444.105.469.971.079 2.597-.37 1.552-1.302 3.853-2.794 6.892-.058-3.908-.609-5.988-1.655-6.238-.145-.035-.469.003-.972.111-.505.106-.864.138-1.08.086-1.048-.25-1.758-1.434-2.131-3.547-1.722-.145-2.757.506-3.103 1.949-.173.725.024 1.383.589 1.975.564.594.824.981.783 1.16-.232.978-2.021 2.133-5.355 3.474a219.364 219.364 0 0 0-3.688 1.524c.659-.529 1.369-1.258 2.126-2.185.862-1.054 1.372-1.905 1.528-2.558.086-.357-.208-.965-.883-1.813-.676-.851-.926-1.634-.753-2.354.146-.616.543-1.321 1.193-2.123-.34-.653-.834-1.059-1.484-1.213-1.444-.348-2.279-.051-2.504.89l-.349 1.464c-.25 1.198-1.296 1.578-3.138 1.139-1.409-.336-3.696-1.228-6.864-2.672 3.982-.041 6.119-.675 6.412-1.904-.033.146-.003-.307.096-1.353.123-1.151 1.16-1.976 3.108-2.464.073-1.736-.593-2.775-2.003-3.111-.216-.055-.706.229-1.463.85-.76.621-1.393.871-1.898.75-.867-.207-1.762-1.414-2.684-3.621a266.467 266.467 0 0 0-1.982-4.885l2.181 1.896c.963.766 1.77 1.225 2.419 1.382.506.12 1.108-.202 1.808-.973.698-.767 1.446-1.056 2.24-.866.111.025.78.414 2.012 1.169.937-.882 1.466-1.577 1.588-2.084.102-.432-.04-.991-.431-1.678-.389-.685-.802-1.078-1.235-1.185-.181-.043-.472-.057-.877-.037-.406.018-.699.006-.879-.039-.65-.155-.781-1.045-.392-2.67.102-.436 1.111-2.809 3.022-7.125-.166.531-.173 1.601-.021 3.205.181 1.953.687 3.024 1.518 3.226.144.034.459-.005.945-.119.485-.112.853-.14 1.105-.078.83.2 1.404.833 1.722 1.901l.463 1.656c.757.182 1.455.063 2.089-.357a2.838 2.838 0 0 0 1.227-1.77c.189-.793 0-1.479-.568-2.056-.57-.575-.829-.971-.775-1.188.181-.758 1.68-1.754 4.495-2.987 2.26-.987 3.709-1.539 4.349-1.653-2.054 1.725-3.199 3.07-3.431 4.047-.121.506.055 1.123.531 1.848.595.867.912 1.459.95 1.771.162.92-.146 2.049-.924 3.389.811.92 1.469 1.439 1.977 1.562 1.044.25 1.699-.167 1.958-1.25.027-.108.063-.462.112-1.06.046-.602.098-.933.151-.998.267-.471 1.32-.484 3.162-.045 1.156.277 3.479 1.176 6.972 2.699-.846.026-2.116.065-3.809.12-1.549.087-2.388.403-2.519.945-.059.252-.074.707-.04 1.364.034.656.016 1.131-.053 1.418-.12.507-.558.896-1.311 1.176l-2.156.859c.246.899.42 1.438.531 1.615.259.521.693.855 1.307 1.002.434.104.922-.181 1.465-.854.542-.672 1.212-.911 2.006-.723.975.233 1.861 1.399 2.658 3.5a346.976 346.976 0 0 0 2.092 5.37Zm-11.275-6.02c.552-2.311.183-4.521-1.108-6.624-1.292-2.104-3.094-3.433-5.404-3.983-2.349-.564-4.573-.209-6.671 1.066-2.098 1.271-3.448 3.078-4.045 5.417-.59 2.303-.21 4.505 1.141 6.604 1.35 2.096 3.18 3.424 5.493 3.977 2.455.586 4.698.273 6.725-.939 2.025-1.215 3.315-3.056 3.869-5.518Zm-.814-.195c-.527 2.203-1.703 3.852-3.53 4.939-1.826 1.092-3.843 1.373-6.044.846-2.131-.51-3.777-1.688-4.94-3.531-1.163-1.843-1.489-3.828-.979-5.962.503-2.095 1.698-3.708 3.592-4.841 1.896-1.129 3.889-1.443 5.983-.943 2.094.5 3.728 1.693 4.899 3.577 1.171 1.886 1.512 3.854 1.019 5.915Z\" fill=\"#0D0F0F\"/></g></svg>",
    "UB": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#C1D7E9\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.636C94.401 23.687 100 36.187 100 49.996c0 27.616-22.387 50.003-50 50.003-13.807 0-26.305-5.596-35.354-14.646\" fill=\"#CAC5C0\"/><path d=\"M41.116 48.155c-2.692 2.736-6.007 4.107-9.946 4.107-4.422 0-7.929-1.513-10.524-4.541-2.452-2.885-3.677-6.56-3.677-11.027 0-4.805 2.09-10.284 6.271-16.436 3.411-5.044 7.423-9.465 12.037-13.262-.673 3.077-1.009 5.262-1.009 6.559 0 2.98.935 5.889 2.811 8.723 2.306 3.363 4.061 5.863 5.262 7.496 1.874 2.836 2.812 5.6 2.812 8.287 0 3.993-1.347 7.354-4.037 10.094Zm-.072-15.386c-.721-1.611-1.561-2.681-2.523-3.211.145.289.216.697.216 1.228 0 1.01-.287 2.45-.864 4.323l-.938 2.885c0 1.681.841 2.521 2.523 2.521 1.777 0 2.668-1.178 2.668-3.531-.001-1.202-.362-2.607-1.082-4.215Zm48.576 33.22c0 2.701-.982 4.544-2.947 5.525-.574.287-2.374.678-5.404 1.166-1.963.33-2.946 1.086-2.946 2.271v4.973c0 .209.063.842.184 1.905l.185 1.966c0 .613-.144 1.617-.431 3.008-.777.163-1.678.348-2.701.555-.328-1.23-.491-2.069-.491-2.52 0-.203.05-.512.153-.921.102-.407.154-.716.154-.922 0-.284-.253-1.083-.762-2.394h-.953c-.126.205-.167.472-.127.797.164.697.225 1.289.185 1.781-.697.491-1.657 1.146-2.885 1.965-.289-.082-.389-.123-.308-.123v-4.359c-.081-.203-.285-.285-.614-.246h-.737l-.737 5.771c-.573.041-1.268.041-2.086 0-.287-1.351-.799-3.354-1.535-6.017h-.493c-.45 1.433-.695 2.211-.737 2.334 0 .163.052.479.155.951.101.472.153.787.153.951 0 .122-.042.43-.125.921l-.184 1.475a.425.425 0 0 1-.306.12c-1.228 0-2.048-.307-2.455-.919-.412-.615-.576-1.475-.493-2.58l.493-7.365c0-.123.039-.287.121-.492.082-.203.123-.348.123-.428 0-.328-.348-.984-1.043-1.968-.123-.04-.757-.185-1.904-.431-.695-.162-2.067-.449-4.112-.857-2.825-.531-4.238-2.803-4.238-6.814 0-5.978 2.457-10.949 7.367-14.92.204 1.106.554 2.578 1.045 4.42l2.394.554c.247.081 1.494.532 3.745 1.351-1.145-.695-2.64-1.818-4.48-3.375-.697-.818-1.046-2.19-1.046-4.113 0-.452.778-.982 2.335-1.6 1.391-.572 2.434-.896 3.131-.979 2.209-.286 3.908-.431 5.096-.431 5.115 0 9.25 1.311 12.401 3.932-1.022 1.188-2.783 2.453-5.279 3.806.982.041 2.415-.347 4.298-1.168 1.882-.815 2.68-1.228 2.394-1.228.327 0 .983.656 1.965 1.965.735.982 1.329 1.863 1.78 2.64a23.075 23.075 0 0 1 2.641 7.552c0 .942.02 1.617.061 2.025v.49Zm-23.516 1.108c0-1.761-.767-3.429-2.301-5.006-1.536-1.576-3.185-2.363-4.944-2.363-1.555 0-2.925.66-4.113 1.978-1.187 1.319-1.78 2.782-1.78 4.39 0 1.4.675 2.309 2.026 2.719.86.248 2.066.392 3.621.434h3.377c2.743.035 4.114-.682 4.114-2.152Zm6.693 7.612v-1.901a61.917 61.917 0 0 1-.858-1.66c-.246-.817-.697-1.963-1.351-3.439l-.676 7.184c0 .576-.122.861-.369.861-.163 0-.287-.04-.368-.123-.287-4.338-.429-6.222-.429-5.646v-2.148c-.083-.126-.185-.188-.308-.188-1.391 1.437-2.086 3.748-2.086 6.938 0 1.761.163 2.845.49 3.257a5.55 5.55 0 0 0 1.107-.431c.163-.083.633-.123 1.411-.123.775 0 1.72.245 2.823.735.41-.003.614-1.105.614-3.316Zm13.876-8.556c0-1.646-.614-3.119-1.842-4.418-1.228-1.297-2.64-1.945-4.234-1.945-1.72 0-3.328.787-4.821 2.361-1.495 1.576-2.242 3.224-2.242 4.945 0 1.432.697 2.147 2.088 2.147h7.059c2.662-.04 3.992-1.068 3.992-3.09Z\" fill=\"#0D0F0F\"/></g></svg>",
    "UR": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M85.349 14.637c9.052 9.051 14.651 21.551 14.651 35.36 0 27.616-22.387 50.003-50 50.003-13.807 0-26.305-5.596-35.354-14.646' id='Shape' fill='#E49977'/><path d='M14.646 85.354c-9.049-9.047-14.646-21.549-14.646-35.356 0-27.613 22.387-49.997 50-49.997 13.802 0 26.301 5.594 35.349 14.637' id='Shape' fill='#C1D7E9'/><path d='M88.3 74.439c-1.718 4.1-5.13 6.146-10.24 6.146-.937 0-1.952.115-3.044.35-1.639.353-2.458.84-2.458 1.465 0 .195.136.418.41.674.272.253.508.381.703.381-.977 0-.314.029 1.987.085 2.303.06 3.747.089 4.333.089-3.394 1.989-9.07 2.906-17.029 2.75-2.614-.037-4.857-1.188-6.729-3.451-1.835-2.146-2.751-4.545-2.751-7.197 0-2.81.946-5.198 2.839-7.17 1.89-1.968 4.242-2.953 7.051-2.953.623 0 1.453.137 2.486.408 1.034.273 1.727.41 2.077.41 1.444 0 3.239-.597 5.385-1.785 2.146-1.189 3.16-1.785 3.043-1.785-.391 4.097-1.756 6.849-4.097 8.25-1.678.978-2.516 1.934-2.516 2.867 0 .586.35 1.055 1.052 1.406.546.271 1.151.408 1.815.408 1.014 0 2.008-.623 2.984-1.872.974-1.247 1.403-2.379 1.286-3.394-.116-1.172-.037-2.576.235-4.213.077-.47.361-1.045.848-1.727.488-.684.928-1.104 1.317-1.262 0 .354-.127.939-.38 1.756-.254.82-.38 1.427-.38 1.814 0 .86.234 1.523.703 1.99.701-.271 1.324-1.15 1.872-2.634.468-1.13.74-2.224.82-3.274-1.64-.078-3.211-.82-4.711-2.227-1.501-1.404-2.252-2.925-2.252-4.563 0-.271.037-.547.117-.819.232.353.583.899 1.053 1.64.662.975 1.17 1.463 1.521 1.463.468 0 .702-.488.702-1.463 0-1.249-.332-2.38-.995-3.395-.743-1.211-1.699-1.814-2.867-1.814-.548 0-1.366.292-2.458.878-1.093.584-2.088.878-2.983.878-.273 0-1.484-.353-3.629-1.054 3.783-.625 5.676-1.19 5.676-1.699 0-1.325-2.594-2.223-7.783-2.688-.508-.039-1.443-.117-2.809-.235.155-.194 1.268-.407 3.336-.644 1.755-.192 2.983-.293 3.685-.293 9.285 0 15.175 4.506 17.673 13.521.431-.358.645-.95.645-1.78 0-1.068-.312-2.412-.937-4.033-.235-.635-.607-1.584-1.113-2.849 3.198 4.075 4.8 7.938 4.8 11.583 0 1.922-.451 3.667-1.348 5.232-.583 1.059-1.678 2.41-3.276 4.059-1.6 1.645-2.691 2.919-3.277 3.821 2.146-.586 3.551-1.035 4.214-1.347 1.481-.664 2.828-1.66 4.037-2.985 0 .51-.215 1.272-.643 2.281zm-25.514-22.996c0 .701-.391 1.152-1.17 1.348l-1.521.232c-.547.272-1.347 1.348-2.398 3.219-.119-.584-.293-1.403-.528-2.457-.351.037-.935.352-1.755.936-.351.273-.917.684-1.699 1.229.235-1.403 1.017-2.826 2.342-4.271 1.404-1.598 2.77-2.396 4.096-2.396 1.755-.002 2.633.719 2.633 2.16zm10.182 5.385c0 .662-.361 1.22-1.083 1.668-.722.447-1.434.673-2.135.673-.938 0-1.777-.524-2.517-1.581-.898-1.285-1.814-2.125-2.75-2.516.194-.195.429-.293.704-.293.349 0 .944.271 1.783.818.837.549 1.375.82 1.61.82.195 0 .516-.271.964-.82.448-.547.946-.818 1.493-.818 1.288 0 1.931.684 1.931 2.049zm-31.852-8.672c-2.693 2.736-6.007 4.107-9.946 4.107-4.422 0-7.929-1.513-10.524-4.541-2.452-2.885-3.677-6.56-3.677-11.027 0-4.805 2.09-10.284 6.272-16.436 3.411-5.044 7.423-9.465 12.037-13.262-.673 3.077-1.009 5.262-1.009 6.559 0 2.98.935 5.889 2.811 8.723 2.306 3.363 4.061 5.863 5.262 7.496 1.874 2.836 2.812 5.6 2.812 8.287-.001 3.993-1.348 7.354-4.038 10.094zm-.072-15.386c-.721-1.611-1.561-2.681-2.523-3.211.145.289.216.697.216 1.228 0 1.01-.287 2.45-.864 4.323l-.938 2.885c0 1.681.841 2.521 2.523 2.521 1.777 0 2.668-1.178 2.668-3.531-.001-1.202-.362-2.607-1.082-4.215z' fill='#0D0F0F'/></g></svg>",
    "BR": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.636C94.401 23.687 100 36.187 100 49.996c0 27.616-22.387 50.003-50 50.003-13.807 0-26.305-5.596-35.354-14.646\" fill=\"#E49977\"/><path d=\"M88.3 74.438c-1.718 4.1-5.13 6.146-10.24 6.146-.937 0-1.952.115-3.044.35-1.639.353-2.458.84-2.458 1.465 0 .195.136.418.41.674.271.253.508.381.703.381-.977 0-.314.029 1.987.085 2.303.06 3.747.089 4.333.089-3.394 1.989-9.07 2.906-17.029 2.75-2.614-.037-4.857-1.188-6.729-3.451-1.835-2.146-2.751-4.545-2.751-7.197 0-2.81.946-5.198 2.839-7.17 1.89-1.968 4.242-2.953 7.051-2.953.623 0 1.453.137 2.486.408 1.034.273 1.727.41 2.077.41 1.444 0 3.239-.597 5.385-1.785 2.146-1.189 3.16-1.785 3.043-1.785-.391 4.097-1.756 6.849-4.097 8.25-1.678.978-2.516 1.934-2.516 2.867 0 .586.35 1.055 1.052 1.406a4.026 4.026 0 0 0 1.815.408c1.014 0 2.008-.623 2.984-1.872.974-1.247 1.403-2.379 1.286-3.394-.116-1.172-.037-2.576.235-4.213.077-.47.361-1.045.848-1.727.488-.684.928-1.104 1.317-1.262 0 .354-.127.939-.38 1.756-.254.82-.38 1.427-.38 1.814 0 .86.234 1.523.703 1.99.701-.271 1.324-1.15 1.872-2.634.468-1.13.74-2.224.82-3.274-1.64-.078-3.211-.82-4.711-2.227-1.501-1.404-2.252-2.925-2.252-4.563a2.9 2.9 0 0 1 .117-.819c.232.353.583.899 1.053 1.64.662.975 1.17 1.463 1.521 1.463.468 0 .702-.488.702-1.463 0-1.249-.332-2.38-.995-3.395-.743-1.211-1.699-1.814-2.867-1.814-.548 0-1.366.292-2.458.878-1.093.584-2.088.878-2.983.878-.273 0-1.484-.353-3.629-1.054 3.783-.625 5.676-1.19 5.676-1.699 0-1.325-2.594-2.223-7.783-2.688-.508-.039-1.443-.117-2.809-.235.155-.194 1.268-.407 3.336-.644 1.755-.192 2.983-.293 3.685-.293 9.285 0 15.175 4.506 17.673 13.521.431-.358.646-.95.646-1.78 0-1.068-.313-2.412-.938-4.033a130.76 130.76 0 0 0-1.113-2.849c3.198 4.075 4.8 7.938 4.8 11.583 0 1.922-.451 3.667-1.348 5.232-.583 1.059-1.678 2.41-3.276 4.059-1.6 1.645-2.691 2.919-3.277 3.821 2.146-.586 3.551-1.035 4.214-1.347 1.481-.664 2.828-1.66 4.037-2.985 0 .51-.215 1.272-.643 2.281ZM62.786 51.442c0 .701-.391 1.152-1.17 1.348l-1.521.232c-.547.272-1.347 1.348-2.398 3.219-.119-.584-.293-1.403-.528-2.457-.351.037-.935.352-1.755.936-.351.273-.917.684-1.699 1.229.235-1.403 1.017-2.826 2.342-4.271 1.404-1.598 2.77-2.396 4.096-2.396 1.755-.002 2.633.719 2.633 2.16Zm10.182 5.385c0 .662-.361 1.22-1.083 1.668-.722.447-1.434.673-2.135.673-.938 0-1.777-.524-2.517-1.581-.898-1.285-1.814-2.125-2.75-2.516a.958.958 0 0 1 .704-.293c.349 0 .944.271 1.783.818.837.549 1.375.82 1.61.82.195 0 .516-.271.964-.82.448-.547.946-.818 1.493-.818 1.288 0 1.931.684 1.931 2.049ZM53.257 28.11c0 2.701-.982 4.543-2.948 5.525-.574.287-2.373.678-5.403 1.166-1.964.329-2.946 1.088-2.946 2.271v4.973c0 .209.063.842.184 1.906l.185 1.965c0 .613-.144 1.617-.431 3.008-.777.163-1.678.348-2.7.555-.329-1.229-.491-2.069-.491-2.52 0-.203.05-.512.152-.921.102-.408.154-.716.154-.921 0-.284-.253-1.084-.762-2.393h-.953c-.126.203-.167.469-.127.795.165.696.225 1.289.185 1.781-.697.491-1.657 1.146-2.885 1.965-.289-.082-.389-.123-.308-.123v-4.359c-.082-.202-.286-.285-.614-.245h-.737l-.737 5.771c-.573.041-1.268.041-2.086 0-.287-1.35-.799-3.354-1.534-6.015h-.493c-.45 1.433-.696 2.21-.737 2.333 0 .163.052.48.155.951.101.471.152.787.152.951 0 .121-.042.43-.125.921l-.183 1.474a.424.424 0 0 1-.307.121c-1.228 0-2.048-.306-2.455-.919-.411-.614-.576-1.476-.493-2.58l.493-7.366c0-.121.039-.285.121-.492.082-.203.123-.348.123-.428 0-.328-.348-.984-1.043-1.967-.123-.039-.758-.184-1.904-.43-.696-.163-2.067-.45-4.112-.858-2.824-.53-4.237-2.803-4.237-6.815 0-5.977 2.456-10.948 7.367-14.918.204 1.105.553 2.576 1.044 4.418l2.394.555c.247.081 1.495.533 3.745 1.352-1.146-.695-2.64-1.82-4.48-3.377-.697-.818-1.046-2.189-1.046-4.113 0-.45.778-.981 2.335-1.599 1.391-.571 2.434-.897 3.131-.979 2.209-.286 3.908-.432 5.096-.432 5.115 0 9.249 1.312 12.401 3.932-1.022 1.188-2.783 2.453-5.279 3.807.982.041 2.415-.348 4.298-1.168 1.882-.816 2.68-1.227 2.394-1.227.327 0 .982.654 1.965 1.963.735.982 1.329 1.865 1.78 2.641a23.064 23.064 0 0 1 2.641 7.553c0 .941.02 1.616.061 2.024v.488Zm-23.516 1.108c0-1.761-.767-3.429-2.301-5.006-1.536-1.576-3.184-2.363-4.943-2.363-1.555 0-2.925.66-4.114 1.978-1.187 1.319-1.78 2.782-1.78 4.389 0 1.401.675 2.31 2.027 2.72.859.248 2.065.392 3.621.434h3.376c2.742.036 4.114-.682 4.114-2.152Zm6.692 7.612v-1.901a60.44 60.44 0 0 1-.858-1.66c-.246-.817-.697-1.963-1.351-3.439l-.676 7.186c0 .574-.121.859-.368.859-.163 0-.287-.04-.369-.122-.287-4.339-.429-6.224-.429-5.647v-2.148c-.083-.126-.185-.188-.308-.188-1.391 1.437-2.086 3.748-2.086 6.938 0 1.761.163 2.845.49 3.257a5.611 5.611 0 0 0 1.107-.431c.163-.083.633-.123 1.412-.123.775 0 1.719.246 2.823.735.409-.001.613-1.105.613-3.316Zm13.876-8.556c0-1.646-.614-3.118-1.842-4.418-1.229-1.297-2.64-1.945-4.235-1.945-1.719 0-3.328.787-4.821 2.363-1.494 1.574-2.242 3.223-2.242 4.942 0 1.433.697 2.148 2.088 2.148h7.06c2.662-.04 3.992-1.068 3.992-3.09Z\" fill=\"#0D0F0F\"/></g></svg>",
    "BG": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.637C94.402 23.688 100 36.188 100 49.997 100 77.613 77.613 100 50 100c-13.807 0-26.305-5.596-35.354-14.646\" fill=\"#A3C095\"/><path d=\"M53.257 28.111c0 2.701-.982 4.543-2.947 5.525-.574.287-2.374.678-5.404 1.166-1.963.329-2.945 1.088-2.945 2.271v4.973c0 .209.062.842.184 1.906l.185 1.965c0 .613-.144 1.617-.431 3.008-.776.163-1.678.348-2.7.555-.328-1.229-.491-2.069-.491-2.52 0-.203.05-.512.152-.921.102-.408.153-.716.153-.921 0-.284-.253-1.084-.762-2.393h-.953c-.125.203-.167.469-.127.795.164.696.225 1.289.186 1.781-.697.491-1.657 1.146-2.886 1.965-.288-.082-.39-.123-.308-.123v-4.359c-.082-.202-.286-.285-.614-.245h-.737l-.736 5.771c-.572.041-1.269.041-2.086 0-.287-1.35-.8-3.354-1.535-6.015h-.492c-.45 1.433-.695 2.21-.737 2.333 0 .163.052.48.155.951.101.471.152.787.152.951 0 .121-.041.43-.124.921l-.184 1.474a.423.423 0 0 1-.306.121c-1.229 0-2.048-.306-2.455-.919-.411-.614-.575-1.476-.493-2.58l.493-7.366c0-.121.038-.285.121-.492.082-.203.123-.348.123-.428 0-.328-.348-.984-1.043-1.967-.123-.039-.758-.184-1.904-.43-.695-.163-2.067-.45-4.112-.858-2.824-.53-4.237-2.803-4.237-6.815 0-5.977 2.456-10.948 7.367-14.918.204 1.105.553 2.576 1.044 4.418l2.396.555c.247.081 1.494.533 3.745 1.352-1.146-.695-2.64-1.82-4.48-3.377-.697-.818-1.046-2.189-1.046-4.113 0-.45.778-.981 2.335-1.599 1.391-.571 2.434-.897 3.131-.979 2.209-.286 3.907-.432 5.096-.432 5.115 0 9.249 1.312 12.4 3.932-1.022 1.188-2.783 2.453-5.279 3.807.982.041 2.415-.348 4.299-1.168 1.882-.816 2.68-1.227 2.394-1.227.327 0 .982.654 1.965 1.963.735.982 1.329 1.865 1.78 2.641a23.089 23.089 0 0 1 2.642 7.553c0 .941.019 1.616.061 2.024v.489h-.005v-.001Zm-23.516 1.108c0-1.761-.767-3.429-2.302-5.006-1.535-1.576-3.184-2.363-4.943-2.363-1.555 0-2.925.66-4.113 1.978-1.187 1.319-1.779 2.782-1.779 4.389 0 1.401.674 2.31 2.026 2.72.86.248 2.065.392 3.621.434h3.376c2.742.036 4.114-.682 4.114-2.152Zm6.693 7.612V34.93a60.44 60.44 0 0 1-.858-1.66c-.246-.817-.697-1.963-1.352-3.439l-.676 7.186c0 .574-.121.859-.368.859-.163 0-.287-.04-.369-.122-.286-4.339-.429-6.224-.429-5.647v-2.148c-.083-.126-.185-.188-.308-.188-1.391 1.437-2.086 3.748-2.086 6.938 0 1.761.162 2.845.489 3.257a5.605 5.605 0 0 0 1.106-.431c.163-.083.634-.123 1.412-.123.775 0 1.719.246 2.823.735.411-.001.616-1.105.616-3.316Zm13.876-8.556c0-1.646-.614-3.118-1.843-4.418-1.229-1.297-2.64-1.945-4.234-1.945-1.72 0-3.328.787-4.82 2.363-1.495 1.574-2.242 3.223-2.242 4.942 0 1.433.697 2.148 2.088 2.148h7.06c2.66-.04 3.991-1.068 3.991-3.09Zm39.209 39.343c0 .758-.293 1.437-.879 2.043-.586.604-1.258.905-2.016.905-1.207 0-2.098-.566-2.663-1.701l-2.667-.112c-.567 0-1.684.246-3.345.737-1.777.49-2.798.888-3.064 1.189-.414.454-.755 1.514-1.02 3.178-.228 1.36-.339 2.363-.339 3.006 0 1.02.16 1.768.48 2.24.321.473.984.869 1.984 1.189 1 .318 1.616.502 1.844.539.151 0 .396-.018.737-.057h.681c.491 0 1.001.076 1.532.227.755.227 1.077.527.965.907-.531-.074-1.456.038-2.778.34l1.586.795c0 .454-.643.679-1.928.679-.342 0-.806-.072-1.39-.225-.588-.154-.976-.229-1.163-.229h-.737c-.038.379-.15.943-.34 1.701-.646-.037-1.399-.416-2.27-1.133-.87-.72-1.418-1.079-1.643-1.079-.228 0-.551.359-.965 1.079-.417.717-.624 1.207-.624 1.475-.491-.268-.906-.758-1.249-1.475a23.1 23.1 0 0 0-.509-1.479c-.379.039-1.077.836-2.099 2.385h-.284c-.077-.113-.36-.906-.852-2.385-1.172-.375-2.268-.563-3.288-.563-.491 0-1.249.112-2.27.341l-1.587-.113c.226-.228.888-.662 1.984-1.305 1.284-.758 2.269-1.137 2.949-1.137.112 0 .264.021.454.059.188.039.341.058.454.058.262 0 .689-.142 1.275-.427.586-.283.927-.539 1.019-.766.098-.229.145-.813.145-1.759 0-2.153-.568-3.763-1.703-4.819-.983-.945-2.608-1.625-4.877-2.043-.604 2.154-2.307 3.234-5.103 3.234-.909 0-1.816-.549-2.723-1.646-.907-1.098-1.361-2.099-1.361-3.007 0-1.399.586-2.551 1.758-3.459-.944-.981-1.418-1.983-1.418-3.006 0-.944.292-1.776.879-2.496.586-.716 1.353-1.133 2.297-1.248-.074-1.208.321-2.042 1.19-2.495-.415-.414-.622-1.15-.622-2.211 0-1.246.414-2.287 1.247-3.119.83-.83 1.871-1.248 3.117-1.248 1.363 0 2.479.475 3.348 1.418 1.098-3.742 3.459-5.613 7.089-5.613 1.889 0 3.554.756 4.99 2.27.53.565.793.868.793.905-.452 0-.225-.086.681-.254.909-.171 1.568-.257 1.986-.257 1.474 0 2.778.55 3.915 1.646.982.984 1.663 2.229 2.042 3.742.263.039.679.151 1.245.341.832.417 1.249 1.135 1.249 2.155 0 .188-.152.549-.454 1.079 2.419 1.361 3.63 3.251 3.63 5.67 0 .681-.266 1.627-.793 2.836.986.569 1.478 1.401 1.478 2.498Zm-23.368 2.495v-.736c0-.869-.424-1.664-1.275-2.382-.851-.72-1.71-1.077-2.58-1.077-1.06 0-2.042.246-2.949.734 2.004-.11 4.271 1.041 6.804 3.461Zm-1.02-7.03a14.565 14.565 0 0 1-1.474-1.985c-1.589.414-2.383.889-2.383 1.416.453-.037 1.116.047 1.984.256.87.209 1.496.313 1.873.313Zm3.462-1.761v-2.495c-.909-.149-1.459-.226-1.646-.226v.851l1.646 1.87Zm7.372-1.586a108.92 108.92 0 0 1-2.554-1.135v4.877c1.778-1.022 2.628-2.268 2.554-3.742Zm3.116 6.692-1.246-1.529c-.755.529-1.521 1.066-2.298 1.615a10.35 10.35 0 0 0-2.011 1.844c1.699-.911 3.554-1.551 5.555-1.93Z\" fill=\"#0D0F0F\"/></g></svg>",
    "RG": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M85.349 14.637c9.053 9.051 14.651 21.551 14.651 35.36 0 27.616-22.387 50.003-50 50.003-13.807 0-26.305-5.596-35.354-14.646' id='Shape' fill='#A3C095'/><path d='M14.646 85.354c-9.05-9.047-14.646-21.549-14.646-35.356 0-27.613 22.387-49.997 50-49.997 13.802 0 26.301 5.594 35.349 14.637' id='Shape' fill='#E49977'/><path d='M51.937 38.077c-1.718 4.099-5.13 6.146-10.24 6.146-.937 0-1.952.115-3.044.35-1.639.353-2.457.841-2.457 1.465 0 .195.136.418.409.674.272.253.508.38.703.38-.977 0-.313.03 1.987.086 2.302.06 3.746.089 4.332.089-3.395 1.988-9.07 2.906-17.029 2.75-2.614-.037-4.857-1.188-6.729-3.451-1.834-2.146-2.75-4.545-2.75-7.196 0-2.81.945-5.199 2.839-7.171 1.89-1.967 4.242-2.953 7.051-2.953.623 0 1.453.137 2.486.408 1.034.273 1.727.41 2.077.41 1.444 0 3.238-.597 5.384-1.785 2.146-1.19 3.161-1.785 3.044-1.785-.391 4.096-1.756 6.848-4.097 8.251-1.679.978-2.516 1.933-2.516 2.866 0 .586.349 1.055 1.052 1.406.546.271 1.151.408 1.815.408 1.014 0 2.008-.623 2.984-1.871.974-1.248 1.403-2.38 1.286-3.396-.115-1.171-.037-2.576.235-4.212.077-.471.361-1.045.848-1.727.488-.684.928-1.104 1.317-1.261 0 .353-.128.938-.381 1.755-.254.819-.38 1.428-.38 1.814 0 .859.233 1.522.702 1.99.702-.271 1.325-1.15 1.872-2.634.468-1.131.74-2.224.82-3.276-1.64-.075-3.211-.818-4.712-2.225-1.502-1.404-2.252-2.926-2.252-4.563 0-.272.037-.547.117-.819.232.353.583.899 1.054 1.64.661.973 1.17 1.461 1.521 1.461.468 0 .701-.488.701-1.461 0-1.248-.331-2.379-.994-3.395-.742-1.211-1.698-1.814-2.867-1.814-.548 0-1.366.293-2.458.879-1.093.584-2.088.877-2.982.877-.274 0-1.484-.354-3.63-1.055 3.783-.624 5.676-1.189 5.676-1.697 0-1.326-2.594-2.224-7.783-2.69-.507-.038-1.442-.116-2.808-.235.155-.193 1.268-.408 3.336-.644 1.755-.192 2.983-.294 3.685-.294 9.285 0 15.175 4.508 17.673 13.521.431-.357.646-.949.646-1.779 0-1.069-.313-2.414-.937-4.035-.235-.633-.607-1.584-1.113-2.848 3.197 4.075 4.8 7.938 4.8 11.584 0 1.92-.451 3.666-1.348 5.23-.583 1.061-1.678 2.412-3.276 4.059-1.599 1.646-2.691 2.92-3.277 3.822 2.146-.586 3.552-1.036 4.215-1.348 1.48-.663 2.827-1.659 4.036-2.984-.001.511-.216 1.27-.643 2.283zm-25.515-22.997c0 .702-.391 1.15-1.17 1.348l-1.521.233c-.548.271-1.347 1.346-2.398 3.218-.118-.584-.293-1.404-.528-2.458-.351.039-.936.353-1.755.937-.351.272-.917.684-1.698 1.229.235-1.404 1.017-2.826 2.342-4.271 1.404-1.599 2.771-2.396 4.096-2.396 1.755-.003 2.632.719 2.632 2.16zm10.182 5.385c0 .661-.36 1.221-1.083 1.668-.722.448-1.434.674-2.135.674-.938 0-1.777-.525-2.517-1.582-.898-1.285-1.814-2.125-2.751-2.516.193-.195.429-.293.704-.293.35 0 .944.271 1.783.818.837.549 1.374.82 1.609.82.195 0 .517-.271.965-.82.448-.547.945-.818 1.493-.818 1.289 0 1.932.684 1.932 2.049zm52.915 47.153c0 .758-.293 1.437-.879 2.043-.586.604-1.258.905-2.016.905-1.207 0-2.098-.566-2.663-1.701l-2.667-.112c-.567 0-1.684.246-3.345.737-1.777.49-2.798.888-3.063 1.189-.414.454-.755 1.514-1.021 3.178-.228 1.36-.339 2.363-.339 3.006 0 1.02.16 1.768.48 2.24.321.473.984.869 1.984 1.189 1 .318 1.616.502 1.844.539.151 0 .396-.018.737-.057h.681c.491 0 1.001.076 1.532.227.755.227 1.077.527.965.907-.531-.074-1.456.038-2.778.34l1.586.795c0 .454-.643.679-1.928.679-.342 0-.806-.072-1.39-.225-.588-.154-.976-.229-1.163-.229h-.737c-.038.379-.15.943-.34 1.701-.646-.037-1.399-.416-2.27-1.133-.87-.72-1.418-1.079-1.643-1.079-.228 0-.551.359-.965 1.079-.417.717-.624 1.207-.624 1.475-.491-.268-.906-.758-1.249-1.475-.151-.494-.321-.986-.509-1.479-.379.039-1.077.836-2.099 2.385h-.284c-.077-.113-.36-.906-.852-2.385-1.172-.375-2.268-.563-3.288-.563-.491 0-1.249.112-2.27.341l-1.587-.113c.226-.228.888-.662 1.984-1.305 1.284-.758 2.269-1.137 2.949-1.137.112 0 .264.021.454.059.188.039.341.058.454.058.262 0 .689-.142 1.275-.427.586-.283.927-.539 1.019-.766.098-.229.145-.813.145-1.759 0-2.153-.568-3.763-1.703-4.819-.983-.945-2.608-1.625-4.877-2.043-.604 2.154-2.307 3.234-5.103 3.234-.909 0-1.816-.549-2.723-1.646-.907-1.097-1.361-2.099-1.361-3.007 0-1.399.586-2.551 1.758-3.459-.944-.981-1.418-1.983-1.418-3.006 0-.944.292-1.776.879-2.496.586-.716 1.353-1.133 2.297-1.248-.074-1.208.321-2.042 1.19-2.495-.415-.414-.622-1.15-.622-2.211 0-1.246.414-2.287 1.247-3.119.83-.83 1.871-1.248 3.117-1.248 1.363 0 2.479.475 3.348 1.418 1.098-3.742 3.459-5.613 7.089-5.613 1.889 0 3.554.756 4.99 2.27.53.565.793.868.793.905-.452 0-.225-.086.681-.254.909-.171 1.568-.257 1.986-.257 1.474 0 2.778.55 3.915 1.646.982.984 1.663 2.229 2.042 3.742.263.039.679.151 1.245.341.832.417 1.249 1.135 1.249 2.155 0 .188-.152.549-.454 1.079 2.419 1.361 3.63 3.251 3.63 5.67 0 .681-.266 1.627-.793 2.836.986.569 1.478 1.401 1.478 2.498zm-23.368 2.495v-.736c0-.869-.424-1.664-1.275-2.382-.851-.72-1.71-1.077-2.58-1.077-1.06 0-2.042.246-2.949.734 2.004-.11 4.271 1.041 6.804 3.461zm-1.02-7.03c-.566-.646-1.058-1.306-1.474-1.985-1.589.414-2.383.889-2.383 1.416.453-.037 1.116.047 1.984.256.87.209 1.496.313 1.873.313zm3.462-1.761v-2.495c-.909-.149-1.459-.226-1.646-.226v.851l1.646 1.87zm7.372-1.586c-.454-.189-1.305-.568-2.554-1.135v4.877c1.778-1.022 2.628-2.268 2.554-3.742zm3.116 6.692l-1.246-1.529c-.755.529-1.521 1.066-2.298 1.615-.775.547-1.445 1.162-2.011 1.844 1.699-.911 3.554-1.551 5.555-1.93z' fill='#0D0F0F'/></g></svg>",
    "RW": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M85.349 14.637c9.053 9.051 14.651 21.551 14.651 35.36 0 27.616-22.387 50.003-50 50.003-13.807 0-26.305-5.596-35.354-14.646' id='Shape' fill='#F8F6D8'/><path d='M14.646 85.354c-9.05-9.047-14.646-21.549-14.646-35.356 0-27.613 22.387-49.997 50-49.997 13.802 0 26.301 5.594 35.349 14.637' id='Shape' fill='#E49977'/><path d='M88 73.111c-2.436-2.264-4.054-3.491-4.848-3.682-.576-.138-1.135.198-1.672 1.006-.537.808-1.291 1.092-2.268.858-.396-.095-1.175-.435-2.334-1.017-.938.885-1.441 1.471-1.511 1.758-.095.398.089.938.551 1.621.46.685.894 1.072 1.301 1.171.257.062.621.091 1.09.089.468-.001.777.016.927.051.443.104.469.971.078 2.598-.37 1.552-1.302 3.852-2.793 6.892-.059-3.909-.61-5.989-1.656-6.239-.145-.035-.469.004-.972.111-.505.107-.864.137-1.08.085-1.048-.251-1.758-1.433-2.131-3.546-1.723-.145-2.757.506-3.103 1.949-.174.726.023 1.383.589 1.976.563.592.823.979.782 1.16-.233.978-2.021 2.133-5.355 3.473-1.776.722-3.007 1.228-3.688 1.522.659-.528 1.369-1.256 2.127-2.182.862-1.057 1.371-1.906 1.528-2.559.086-.359-.209-.966-.884-1.814-.676-.849-.926-1.634-.753-2.355.146-.614.543-1.319 1.194-2.12-.341-.653-.835-1.06-1.485-1.215-1.444-.347-2.279-.05-2.504.891l-.35 1.462c-.25 1.2-1.296 1.58-3.138 1.141-1.409-.338-3.696-1.229-6.864-2.674 3.981-.039 6.118-.674 6.411-1.901-.032.146-.003-.308.097-1.353.122-1.154 1.16-1.977 3.108-2.465.072-1.738-.594-2.777-2.004-3.113-.216-.053-.705.231-1.463.853-.761.619-1.393.87-1.898.748-.867-.205-1.763-1.413-2.684-3.62-.427-1.095-1.088-2.723-1.983-4.885.727.632 1.453 1.266 2.182 1.896.963.766 1.77 1.226 2.419 1.383.506.119 1.108-.205 1.808-.974.699-.768 1.446-1.058 2.24-.866.111.026.78.414 2.013 1.168.937-.883 1.466-1.576 1.588-2.082.102-.435-.04-.994-.431-1.679-.39-.687-.802-1.079-1.235-1.184-.181-.044-.473-.058-.878-.039-.405.019-.698.005-.879-.038-.649-.155-.781-1.045-.392-2.671.102-.435 1.11-2.81 3.022-7.123-.166.53-.173 1.601-.021 3.202.181 1.953.687 3.027 1.518 3.228.144.033.459-.005.946-.118.485-.113.852-.14 1.104-.078.83.197 1.404.832 1.723 1.9l.463 1.655c.758.183 1.455.063 2.09-.357.636-.421 1.046-1.011 1.227-1.769.189-.795 0-1.479-.568-2.055-.569-.576-.829-.972-.775-1.188.181-.758 1.68-1.755 4.495-2.99 2.26-.985 3.709-1.536 4.349-1.651-2.054 1.725-3.199 3.07-3.432 4.047-.121.507.055 1.121.531 1.848.595.867.912 1.459.95 1.771.161.92-.146 2.047-.925 3.39.811.92 1.47 1.438 1.977 1.562 1.045.25 1.699-.168 1.958-1.25.026-.109.063-.463.112-1.063.046-.6.098-.932.151-.995.266-.472 1.319-.487 3.161-.045 1.156.276 3.479 1.175 6.973 2.698l-3.809.121c-1.55.086-2.389.401-2.519.942-.06.253-.074.708-.04 1.364.034.656.017 1.132-.053 1.421-.12.506-.559.896-1.312 1.175l-2.155.859c.245.898.42 1.438.531 1.615.259.521.692.854 1.306 1.002.434.104.922-.18 1.465-.854.542-.672 1.212-.913 2.007-.722.975.232 1.861 1.398 2.657 3.499.445 1.176 1.143 2.967 2.096 5.37zm-11.274-6.019c.552-2.313.184-4.52-1.108-6.623-1.292-2.103-3.094-3.433-5.404-3.986-2.348-.561-4.573-.205-6.671 1.07-2.099 1.27-3.448 3.077-4.046 5.416-.59 2.303-.21 4.504 1.141 6.604 1.35 2.098 3.18 3.425 5.493 3.978 2.454.587 4.697.274 6.725-.94 2.026-1.215 3.316-3.056 3.87-5.519zm-.815-.196c-.526 2.203-1.703 3.851-3.53 4.939-1.826 1.09-3.843 1.373-6.044.846-2.131-.51-3.777-1.687-4.94-3.531-1.163-1.844-1.489-3.83-.979-5.961.503-2.096 1.698-3.709 3.592-4.842 1.896-1.13 3.889-1.445 5.984-.943 2.094.5 3.727 1.693 4.898 3.576 1.171 1.887 1.512 3.858 1.019 5.916zm-23.974-28.819c-1.718 4.099-5.13 6.146-10.24 6.146-.937 0-1.952.115-3.044.35-1.639.353-2.457.841-2.457 1.465 0 .195.136.418.409.674.272.253.508.38.703.38-.977 0-.313.03 1.987.086 2.302.06 3.746.089 4.332.089-3.395 1.988-9.07 2.906-17.029 2.75-2.614-.037-4.857-1.188-6.729-3.451-1.834-2.146-2.75-4.545-2.75-7.196 0-2.81.945-5.199 2.839-7.171 1.89-1.967 4.242-2.953 7.051-2.953.623 0 1.453.137 2.486.408 1.034.273 1.727.41 2.077.41 1.444 0 3.238-.597 5.384-1.785 2.146-1.19 3.161-1.785 3.044-1.785-.391 4.096-1.756 6.848-4.097 8.251-1.679.978-2.516 1.933-2.516 2.866 0 .586.349 1.055 1.052 1.406.546.271 1.151.408 1.815.408 1.014 0 2.008-.623 2.984-1.871.974-1.248 1.403-2.38 1.286-3.396-.115-1.171-.037-2.576.235-4.212.077-.471.361-1.045.848-1.727.488-.684.928-1.104 1.317-1.261 0 .353-.128.938-.381 1.755-.254.819-.38 1.428-.38 1.814 0 .859.233 1.522.702 1.99.702-.271 1.325-1.15 1.872-2.634.468-1.131.74-2.224.82-3.276-1.64-.075-3.211-.818-4.712-2.225-1.502-1.404-2.252-2.926-2.252-4.563 0-.272.037-.547.117-.819.232.353.583.899 1.054 1.64.661.973 1.17 1.461 1.521 1.461.468 0 .701-.488.701-1.461 0-1.248-.331-2.379-.994-3.395-.742-1.211-1.698-1.814-2.867-1.814-.548 0-1.366.293-2.458.879-1.093.584-2.088.877-2.982.877-.274 0-1.484-.354-3.63-1.055 3.783-.624 5.676-1.189 5.676-1.697 0-1.326-2.594-2.224-7.783-2.69-.507-.038-1.442-.116-2.808-.235.155-.193 1.268-.408 3.336-.644 1.755-.192 2.983-.294 3.685-.294 9.285 0 15.175 4.508 17.673 13.521.431-.357.646-.949.646-1.779 0-1.069-.313-2.414-.937-4.035-.235-.633-.607-1.584-1.113-2.848 3.197 4.075 4.8 7.938 4.8 11.584 0 1.92-.451 3.666-1.348 5.23-.583 1.061-1.678 2.412-3.276 4.059-1.599 1.646-2.691 2.92-3.277 3.822 2.146-.586 3.552-1.036 4.215-1.348 1.48-.663 2.827-1.659 4.036-2.984-.001.511-.216 1.27-.643 2.283zm-25.515-22.997c0 .702-.391 1.15-1.17 1.348l-1.521.233c-.548.271-1.347 1.346-2.398 3.218-.118-.584-.293-1.404-.528-2.458-.351.039-.936.353-1.755.937-.351.272-.917.684-1.698 1.229.235-1.404 1.017-2.826 2.342-4.271 1.404-1.599 2.771-2.396 4.096-2.396 1.755-.003 2.632.719 2.632 2.16zm10.182 5.385c0 .661-.36 1.221-1.083 1.668-.722.448-1.434.674-2.135.674-.938 0-1.777-.525-2.517-1.582-.898-1.285-1.814-2.125-2.751-2.516.193-.195.429-.293.704-.293.35 0 .944.271 1.783.818.837.549 1.374.82 1.609.82.195 0 .517-.271.965-.82.448-.547.945-.818 1.493-.818 1.289 0 1.932.684 1.932 2.049z' fill='#0D0F0F'/></g></svg>",
    "GW": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M85.349 14.637c9.052 9.051 14.651 21.551 14.651 35.36 0 27.616-22.387 50.003-50 50.003-13.807 0-26.305-5.596-35.354-14.646' id='Shape' fill='#F8F6D8'/><path d='M14.646 85.354c-9.05-9.047-14.646-21.549-14.646-35.356 0-27.614 22.387-49.998 50-49.998 13.802 0 26.301 5.593 35.349 14.637' id='Shape' fill='#A3C095'/><path d='M88 73.111c-2.436-2.264-4.054-3.491-4.848-3.682-.576-.139-1.135.198-1.672 1.004-.537.809-1.291 1.094-2.268.86-.396-.095-1.175-.435-2.334-1.019-.938.886-1.441 1.472-1.511 1.759-.095.399.089.938.551 1.622.46.683.894 1.072 1.301 1.171.257.062.621.091 1.09.089.468-.001.777.016.927.051.443.104.469.971.078 2.596-.37 1.554-1.302 3.854-2.793 6.893-.059-3.909-.61-5.99-1.656-6.238-.145-.035-.469.004-.972.111-.505.107-.864.137-1.08.084-1.048-.25-1.758-1.434-2.131-3.545-1.723-.146-2.757.506-3.103 1.949-.174.726.023 1.383.589 1.975.563.592.823.98.782 1.16-.233.977-2.021 2.134-5.356 3.474-1.776.722-3.007 1.228-3.688 1.522.659-.528 1.369-1.256 2.127-2.182.862-1.057 1.371-1.906 1.528-2.559.086-.359-.209-.967-.884-1.814-.676-.849-.926-1.634-.753-2.355.146-.614.543-1.321 1.194-2.12-.341-.653-.835-1.06-1.485-1.215-1.444-.349-2.279-.05-2.504.89l-.35 1.463c-.25 1.2-1.296 1.579-3.138 1.141-1.409-.338-3.696-1.229-6.864-2.674 3.981-.039 6.118-.674 6.411-1.903-.032.146-.003-.306.097-1.353.122-1.152 1.16-1.975 3.108-2.463.072-1.738-.594-2.777-2.004-3.113-.216-.053-.705.231-1.463.851-.761.621-1.393.872-1.898.75-.867-.205-1.763-1.413-2.684-3.62-.427-1.095-1.088-2.723-1.983-4.886.727.633 1.453 1.267 2.182 1.896.963.768 1.77 1.227 2.419 1.383.506.121 1.108-.203 1.808-.972.699-.769 1.446-1.058 2.24-.866.111.026.78.414 2.013 1.168.937-.883 1.466-1.576 1.588-2.082.102-.435-.04-.994-.431-1.679-.39-.687-.802-1.079-1.235-1.185-.181-.045-.473-.057-.878-.038-.405.019-.698.005-.879-.038-.649-.157-.781-1.045-.392-2.671.102-.435 1.11-2.81 3.022-7.124-.166.531-.173 1.602-.021 3.203.181 1.953.687 3.025 1.518 3.228.144.032.459-.007.946-.118.485-.113.852-.14 1.104-.08.83.199 1.404.834 1.723 1.902l.463 1.655c.758.183 1.455.063 2.09-.357.636-.422 1.046-1.011 1.227-1.769.189-.795 0-1.479-.568-2.057-.569-.574-.829-.972-.775-1.188.181-.758 1.68-1.755 4.495-2.99 2.26-.986 3.709-1.537 4.349-1.652-2.054 1.726-3.199 3.071-3.432 4.049-.121.506.055 1.121.531 1.847.595.867.912 1.459.95 1.772.161.916-.146 2.045-.925 3.389.811.92 1.47 1.438 1.977 1.561 1.045.25 1.699-.166 1.958-1.25.026-.109.063-.462.112-1.062.046-.599.098-.931.151-.995.266-.471 1.319-.486 3.161-.045 1.156.275 3.479 1.175 6.973 2.699-.847.025-2.116.064-3.809.117-1.55.09-2.389.404-2.519.945-.06.254-.074.708-.04 1.364.034.657.017 1.132-.053 1.419-.12.507-.559.896-1.312 1.175l-2.155.861c.245.897.42 1.437.531 1.616.259.518.692.854 1.306 1 .434.104.922-.182 1.465-.854.542-.672 1.212-.913 2.007-.722.975.231 1.861 1.397 2.657 3.498.446 1.179 1.144 2.968 2.097 5.373zm-11.274-6.019c.552-2.313.184-4.521-1.108-6.625s-3.094-3.433-5.404-3.984c-2.348-.561-4.573-.205-6.671 1.07-2.099 1.27-3.448 3.077-4.046 5.415-.59 2.302-.21 4.505 1.141 6.604 1.35 2.097 3.18 3.425 5.493 3.978 2.454.587 4.697.272 6.725-.94 2.026-1.214 3.316-3.055 3.87-5.518zm-.815-.196c-.526 2.203-1.703 3.851-3.53 4.939-1.826 1.09-3.843 1.373-6.044.846-2.131-.512-3.777-1.687-4.94-3.533-1.163-1.842-1.489-3.828-.979-5.959.503-2.096 1.698-3.709 3.592-4.842 1.896-1.131 3.889-1.445 5.984-.943 2.094.5 3.727 1.691 4.898 3.576 1.171 1.887 1.512 3.858 1.019 5.916zm-24.271-32.582c0 .758-.293 1.438-.879 2.043-.586.604-1.258.908-2.016.908-1.207 0-2.098-.567-2.663-1.701l-2.666-.115c-.568 0-1.685.246-3.346.738-1.777.49-2.798.89-3.064 1.19-.414.452-.755 1.513-1.02 3.175-.228 1.361-.339 2.364-.339 3.008 0 1.021.16 1.769.48 2.239.321.474.984.87 1.984 1.191 1.001.319 1.616.501 1.844.536.151 0 .396-.018.737-.057h.681c.491 0 1.001.077 1.532.229.755.229 1.077.529.965.908-.531-.076-1.456.037-2.778.34l1.586.794c0 .454-.643.681-1.928.681-.342 0-.805-.076-1.39-.227-.587-.152-.975-.227-1.163-.227h-.736c-.039.377-.151.943-.341 1.7-.645-.039-1.399-.416-2.27-1.136-.87-.717-1.418-1.077-1.643-1.077-.228 0-.551.36-.965 1.077-.417.72-.624 1.211-.624 1.476-.491-.265-.905-.756-1.249-1.476-.151-.491-.321-.982-.509-1.475-.379.039-1.077.832-2.099 2.383h-.284c-.076-.114-.36-.908-.852-2.383-1.172-.377-2.268-.566-3.288-.566-.491 0-1.249.115-2.27.34l-1.586-.111c.225-.229.888-.662 1.983-1.305 1.284-.756 2.269-1.135 2.949-1.135.112 0 .264.02.454.057.188.038.341.057.454.057.263 0 .689-.142 1.275-.427.586-.28.927-.536 1.019-.764.098-.228.145-.813.145-1.761 0-2.153-.568-3.76-1.703-4.819-.983-.944-2.608-1.625-4.877-2.04-.604 2.154-2.307 3.232-5.103 3.232-.909 0-1.815-.549-2.723-1.646-.905-1.096-1.361-2.098-1.361-3.005 0-1.399.586-2.554 1.758-3.462-.944-.98-1.418-1.982-1.418-3.004 0-.947.292-1.777.879-2.498.586-.717 1.353-1.133 2.297-1.245-.074-1.211.321-2.042 1.191-2.496-.416-.416-.623-1.153-.623-2.211 0-1.247.414-2.288 1.247-3.119.83-.833 1.872-1.25 3.117-1.25 1.363 0 2.479.478 3.348 1.42 1.098-3.743 3.459-5.614 7.089-5.614 1.89 0 3.554.756 4.99 2.269.53.567.793.87.793.907-.452 0-.225-.086.681-.256.909-.17 1.568-.256 1.986-.256 1.474 0 2.778.549 3.915 1.646.982.982 1.663 2.229 2.042 3.742.263.039.679.152 1.246.34.831.419 1.248 1.135 1.248 2.156 0 .188-.152.549-.454 1.076 2.419 1.361 3.63 3.252 3.63 5.674 0 .679-.265 1.625-.793 2.834.986.571 1.478 1.405 1.478 2.498zm-23.367 2.497v-.734c0-.87-.425-1.665-1.276-2.383-.851-.717-1.71-1.077-2.58-1.077-1.06 0-2.042.243-2.949.735 2.004-.114 4.272 1.041 6.805 3.459zm-1.021-7.032c-.566-.645-1.058-1.305-1.474-1.985-1.589.417-2.382.89-2.382 1.417.452-.035 1.115.048 1.983.258.87.207 1.496.31 1.873.31zm3.463-1.758v-2.496c-.91-.149-1.459-.228-1.646-.228v.851l1.646 1.873zm7.371-1.587c-.454-.189-1.305-.567-2.554-1.135v4.877c1.779-1.022 2.628-2.27 2.554-3.742zm3.116 6.692l-1.246-1.532c-.755.53-1.521 1.067-2.298 1.617-.775.549-1.445 1.162-2.011 1.842 1.699-.908 3.554-1.549 5.555-1.927z' fill='#0D0F0F'/></g></svg>",
    "GU": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M85.35 14.637c9.053 9.051 14.65 21.551 14.65 35.36 0 27.616-22.387 50.003-50 50.003-13.807 0-26.305-5.596-35.354-14.646' id='Shape' fill='#C1D7E9'/><path d='M14.646 85.354c-9.05-9.047-14.646-21.549-14.646-35.357 0-27.613 22.387-49.997 50-49.997 13.803 0 26.301 5.593 35.35 14.637' id='Shape' fill='#A3C095'/><path d='M76.723 83.675c-2.693 2.739-6.008 4.109-9.945 4.109-4.424 0-7.93-1.515-10.524-4.541-2.452-2.884-3.678-6.558-3.678-11.028 0-4.804 2.091-10.281 6.272-16.434 3.41-5.047 7.424-9.467 12.036-13.264-.675 3.076-1.009 5.262-1.009 6.561 0 2.98.936 5.886 2.811 8.721 2.307 3.365 4.062 5.864 5.262 7.496 1.873 2.835 2.813 5.6 2.813 8.289-.002 3.99-1.349 7.354-4.038 10.091zm-.075-15.388c-.719-1.609-1.561-2.68-2.521-3.208.146.288.217.698.217 1.226 0 1.01-.287 2.453-.865 4.324l-.938 2.885c0 1.68.84 2.522 2.521 2.522 1.777 0 2.668-1.177 2.668-3.532 0-1.201-.36-2.608-1.082-4.217zm-25.007-34.002c0 .757-.293 1.438-.879 2.043-.587.604-1.259.904-2.017.904-1.207 0-2.098-.565-2.663-1.7l-2.666-.112c-.568 0-1.685.245-3.346.736-1.777.49-2.798.888-3.064 1.191-.414.453-.755 1.514-1.02 3.176-.228 1.361-.339 2.363-.339 3.008 0 1.018.16 1.767.48 2.24.321.472.984.867 1.984 1.188 1.001.319 1.616.502 1.844.538.151 0 .396-.018.737-.057h.681c.491 0 1.001.078 1.532.228.755.226 1.077.528.965.906-.531-.073-1.456.038-2.778.341l1.586.795c0 .454-.643.68-1.928.68-.342 0-.805-.074-1.39-.226-.587-.153-.975-.229-1.163-.229h-.736c-.039.379-.151.944-.341 1.703-.645-.039-1.399-.418-2.27-1.135-.87-.719-1.418-1.078-1.643-1.078-.228 0-.551.359-.965 1.078-.417.717-.624 1.208-.624 1.475-.491-.267-.905-.758-1.249-1.475-.151-.494-.321-.984-.509-1.477-.379.037-1.077.834-2.099 2.384h-.284c-.076-.114-.36-.907-.852-2.384-1.172-.377-2.268-.565-3.288-.565-.491 0-1.249.112-2.27.341l-1.586-.111c.225-.229.888-.664 1.983-1.307 1.284-.758 2.269-1.136 2.949-1.136.112 0 .264.021.454.058.188.041.341.059.454.059.263 0 .689-.143 1.275-.428.586-.283.927-.537 1.019-.765.098-.229.146-.813.146-1.759 0-2.154-.568-3.762-1.703-4.821-.983-.942-2.608-1.624-4.877-2.042-.604 2.154-2.307 3.234-5.103 3.234-.909 0-1.815-.547-2.723-1.645-.905-1.1-1.361-2.1-1.361-3.008 0-1.4.586-2.551 1.758-3.46-.944-.981-1.418-1.983-1.418-3.005 0-.945.292-1.777.879-2.496.586-.716 1.353-1.134 2.297-1.249-.074-1.207.321-2.042 1.191-2.494-.416-.415-.623-1.151-.623-2.211 0-1.247.414-2.286 1.247-3.118.83-.832 1.872-1.25 3.117-1.25 1.363 0 2.479.475 3.348 1.418 1.098-3.742 3.459-5.613 7.089-5.613 1.89 0 3.554.757 4.99 2.271.53.563.793.868.793.905-.452 0-.225-.086.681-.256.909-.17 1.568-.256 1.986-.256 1.474 0 2.778.55 3.915 1.646.982.984 1.663 2.229 2.042 3.742.263.038.679.15 1.246.34.831.418 1.248 1.135 1.248 2.156 0 .189-.152.549-.454 1.078 2.419 1.361 3.63 3.25 3.63 5.67 0 .681-.266 1.628-.793 2.837.985.569 1.478 1.402 1.478 2.499zm-23.368 2.496v-.737c0-.87-.425-1.664-1.276-2.382-.851-.721-1.71-1.077-2.58-1.077-1.06 0-2.042.245-2.949.735 2.004-.111 4.272 1.039 6.805 3.461zm-1.021-7.031c-.566-.646-1.058-1.307-1.474-1.986-1.589.416-2.382.889-2.382 1.416.452-.037 1.115.049 1.983.256.87.21 1.496.314 1.873.314zm3.463-1.76v-2.496c-.91-.15-1.459-.227-1.646-.227v.851l1.646 1.872zm7.371-1.588c-.454-.189-1.305-.567-2.554-1.135v4.877c1.779-1.022 2.628-2.268 2.554-3.742zm3.116 6.692l-1.246-1.529c-.755.529-1.521 1.067-2.298 1.615-.775.547-1.445 1.163-2.011 1.844 1.699-.911 3.554-1.551 5.555-1.93z' fill='#0D0F0F'/></g></svg>",
    "2W": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.636C94.401 23.687 100 36.187 100 49.996c0 27.616-22.386 50.003-50.001 50.003-13.806 0-26.305-5.596-35.354-14.646\" fill=\"#F8F6D8\"/><path d=\"m43.646 41.59-2.866 9.677H16.959v-2.068c1.157-1.29 3.692-3.891 7.607-7.805a163.519 163.519 0 0 0 7.005-7.476c1.157-1.288 2.048-2.401 2.667-3.336 1.379-1.999 2.07-4.046 2.07-6.138 0-2.045-.633-3.848-1.901-5.402-1.267-1.561-2.903-2.339-4.905-2.339-4.313 0-7.694 2.916-10.14 8.743l-2.137-.803c2.891-8.183 7.448-12.274 13.678-12.274 3.069 0 5.682 1.044 7.839 3.134 2.159 2.092 3.236 4.67 3.236 7.741 0 3.915-2.245 7.737-6.738 11.476l-4.668 3.868c-2.981 2.492-5.453 4.827-7.406 7.005-.136.137-.402.446-.802.936h12.41c1.912 0 3.359-.377 4.335-1.133.845-.67 1.67-1.937 2.47-3.806h2.067ZM88 73.11c-2.436-2.264-4.054-3.491-4.847-3.682-.577-.138-1.135.198-1.672 1.006-.537.808-1.292 1.092-2.269.858-.396-.095-1.175-.435-2.333-1.017-.938.885-1.441 1.471-1.51 1.758-.095.398.088.938.55 1.622.46.684.894 1.071 1.3 1.17.258.062.622.091 1.091.089.467-.001.777.016.926.051.444.104.469.971.078 2.598-.37 1.552-1.302 3.852-2.793 6.892-.058-3.909-.609-5.989-1.656-6.239-.145-.035-.469.004-.972.111-.504.107-.864.137-1.08.085-1.047-.251-1.758-1.433-2.13-3.546-1.723-.145-2.757.506-3.103 1.949-.173.726.024 1.383.589 1.976.564.592.824.979.783 1.16-.233.978-2.021 2.133-5.355 3.473a228.49 228.49 0 0 0-3.688 1.522c.658-.528 1.369-1.256 2.126-2.182.863-1.057 1.372-1.906 1.529-2.559.086-.359-.209-.967-.883-1.814-.676-.849-.926-1.634-.753-2.355.146-.614.543-1.319 1.193-2.12-.34-.653-.834-1.06-1.486-1.215-1.444-.347-2.278-.05-2.503.891l-.349 1.462c-.25 1.2-1.296 1.58-3.138 1.141-1.409-.338-3.696-1.229-6.864-2.674 3.982-.039 6.118-.674 6.411-1.901-.032.146-.003-.308.096-1.353.123-1.154 1.16-1.977 3.109-2.465.072-1.738-.593-2.777-2.003-3.113-.216-.053-.706.231-1.463.853-.761.619-1.394.87-1.898.748-.867-.205-1.762-1.413-2.684-3.62a260.93 260.93 0 0 0-1.983-4.885l2.181 1.896c.963.766 1.77 1.225 2.419 1.383.506.119 1.108-.205 1.808-.974.698-.769 1.445-1.058 2.24-.866.111.026.78.414 2.012 1.168.937-.883 1.466-1.576 1.587-2.082.102-.435-.04-.994-.43-1.679-.389-.687-.802-1.079-1.236-1.185-.18-.043-.472-.057-.877-.039-.405.02-.698.006-.879-.037-.649-.155-.781-1.045-.392-2.672.102-.434 1.111-2.809 3.023-7.122-.166.53-.173 1.6-.021 3.202.18 1.953.687 3.027 1.518 3.228.144.033.458-.005.945-.118.484-.113.853-.14 1.104-.078.83.197 1.404.832 1.722 1.9l.463 1.654c.757.184 1.454.064 2.089-.356a2.836 2.836 0 0 0 1.227-1.769c.189-.795 0-1.479-.568-2.055-.57-.576-.829-.972-.775-1.188.181-.759 1.679-1.755 4.495-2.99 2.259-.985 3.709-1.536 4.349-1.651-2.054 1.725-3.199 3.07-3.431 4.047-.122.507.055 1.121.531 1.848.595.867.911 1.459.95 1.771.161.92-.146 2.047-.925 3.39.811.92 1.469 1.438 1.977 1.562 1.044.25 1.698-.168 1.958-1.25.026-.109.063-.463.112-1.063.046-.6.099-.932.151-.995.267-.472 1.32-.487 3.162-.045 1.156.276 3.479 1.175 6.972 2.698-.847.027-2.116.065-3.809.121-1.549.086-2.388.401-2.52.942-.059.253-.074.708-.04 1.364.034.656.018 1.132-.053 1.421-.12.506-.558.896-1.311 1.175l-2.156.859c.246.898.42 1.438.531 1.615.259.521.692.854 1.307 1.002.434.104.922-.18 1.465-.854.542-.672 1.212-.913 2.006-.722.976.232 1.861 1.398 2.657 3.498A390.378 390.378 0 0 0 88 73.11Zm-11.275-6.019c.552-2.313.184-4.52-1.108-6.623-1.292-2.103-3.094-3.433-5.404-3.986-2.348-.561-4.574-.205-6.672 1.07-2.098 1.271-3.447 3.077-4.045 5.416-.59 2.303-.21 4.504 1.141 6.604 1.349 2.098 3.18 3.425 5.492 3.978 2.455.587 4.698.274 6.725-.94 2.028-1.215 3.318-3.056 3.871-5.519Zm-.813-.196c-.527 2.203-1.703 3.851-3.531 4.939-1.826 1.09-3.842 1.373-6.044.846-2.131-.51-3.778-1.687-4.941-3.531-1.163-1.844-1.488-3.83-.979-5.961.503-2.096 1.699-3.709 3.593-4.842 1.896-1.13 3.889-1.445 5.982-.943 2.094.5 3.729 1.693 4.899 3.576 1.173 1.887 1.513 3.858 1.021 5.916Z\" fill=\"#0D0F0F\"/></g></svg>",
    "2U": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.637C94.401 23.688 100 36.188 100 49.997 100 77.613 77.614 100 49.999 100c-13.806 0-26.305-5.596-35.354-14.646\" fill=\"#C1D7E9\"/><path d=\"M76.722 83.675c-2.692 2.739-6.008 4.108-9.947 4.108-4.422 0-7.929-1.514-10.524-4.54-2.452-2.884-3.676-6.558-3.676-11.028 0-4.804 2.09-10.281 6.271-16.434 3.41-5.047 7.423-9.467 12.037-13.264-.673 3.076-1.01 5.262-1.01 6.561 0 2.98.937 5.886 2.811 8.721 2.307 3.365 4.061 5.864 5.262 7.496 1.874 2.835 2.811 5.6 2.811 8.289.001 3.99-1.344 7.354-4.035 10.091Zm-.072-15.388c-.721-1.609-1.562-2.68-2.523-3.208.145.288.215.698.215 1.226 0 1.01-.287 2.453-.863 4.324l-.938 2.885c0 1.68.839 2.522 2.522 2.522 1.777 0 2.668-1.177 2.668-3.532 0-1.201-.36-2.608-1.081-4.217ZM43.646 41.593l-2.866 9.675H16.959V49.2c1.157-1.289 3.692-3.889 7.607-7.805a162.48 162.48 0 0 0 7.005-7.476c1.157-1.287 2.048-2.401 2.667-3.335 1.379-2 2.07-4.045 2.07-6.139 0-2.045-.633-3.846-1.901-5.402-1.267-1.559-2.903-2.338-4.905-2.338-4.313 0-7.694 2.915-10.14 8.742l-2.137-.801c2.891-8.185 7.448-12.276 13.678-12.276 3.069 0 5.682 1.044 7.839 3.135 2.159 2.091 3.236 4.67 3.236 7.74 0 3.915-2.245 7.739-6.738 11.478l-4.668 3.866c-2.981 2.492-5.453 4.827-7.406 7.007-.136.135-.402.446-.802.936h12.41c1.912 0 3.359-.377 4.335-1.135.845-.668 1.67-1.937 2.47-3.803l2.067-.001Z\" fill=\"#0D0F0F\"/></g></svg>",
    "2B": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.637C94.401 23.688 100 36.188 100 49.997 100 77.613 77.614 100 49.999 100c-13.806 0-26.305-5.596-35.354-14.646\" fill=\"#BAB1AB\"/><path d=\"m43.646 41.591-2.866 9.677H16.959V49.2c1.157-1.29 3.692-3.891 7.607-7.805a163.519 163.519 0 0 0 7.005-7.476c1.157-1.288 2.048-2.401 2.667-3.336 1.379-1.999 2.07-4.046 2.07-6.138 0-2.045-.633-3.848-1.901-5.402-1.267-1.561-2.903-2.339-4.905-2.339-4.313 0-7.694 2.916-10.14 8.743l-2.137-.803c2.891-8.183 7.448-12.274 13.678-12.274 3.069 0 5.682 1.044 7.839 3.134 2.159 2.092 3.236 4.67 3.236 7.741 0 3.915-2.245 7.737-6.738 11.476l-4.668 3.868c-2.981 2.492-5.453 4.827-7.406 7.005-.136.137-.402.446-.802.936h12.41c1.912 0 3.359-.377 4.335-1.133.845-.67 1.67-1.937 2.47-3.806h2.067ZM89.62 65.99c0 2.701-.982 4.544-2.947 5.525-.574.287-2.374.678-5.404 1.166-1.963.33-2.946 1.086-2.946 2.271v4.973c0 .209.063.842.184 1.905l.185 1.966c0 .613-.144 1.617-.431 3.008-.777.163-1.678.348-2.701.555-.328-1.23-.491-2.069-.491-2.52 0-.203.05-.512.153-.921.102-.408.154-.716.154-.922 0-.284-.253-1.083-.762-2.394h-.953c-.126.205-.167.471-.127.797.164.697.225 1.289.185 1.781-.697.491-1.657 1.146-2.885 1.965-.289-.082-.389-.123-.308-.123v-4.359c-.081-.203-.285-.285-.614-.246h-.737l-.737 5.771c-.573.041-1.268.041-2.086 0-.287-1.351-.799-3.354-1.535-6.017h-.493c-.45 1.433-.695 2.211-.737 2.334 0 .163.052.479.155.951.101.472.153.787.153.951 0 .122-.042.43-.125.921l-.184 1.475a.425.425 0 0 1-.306.12c-1.228 0-2.048-.307-2.455-.919-.412-.615-.576-1.475-.493-2.58l.493-7.365c0-.123.039-.287.121-.492.082-.203.123-.348.123-.428 0-.328-.348-.984-1.043-1.968-.123-.04-.757-.185-1.904-.431-.695-.162-2.067-.449-4.112-.857-2.825-.531-4.238-2.803-4.238-6.814 0-5.978 2.457-10.949 7.367-14.92.204 1.106.554 2.578 1.045 4.42l2.394.554c.247.081 1.494.532 3.745 1.351-1.145-.695-2.64-1.818-4.48-3.375-.697-.818-1.046-2.191-1.046-4.113 0-.453.778-.982 2.335-1.6 1.391-.572 2.434-.896 3.131-.98 2.209-.285 3.908-.43 5.096-.43 5.115 0 9.25 1.311 12.401 3.932-1.022 1.188-2.783 2.453-5.279 3.806.982.041 2.415-.347 4.298-1.168 1.882-.815 2.68-1.228 2.394-1.228.327 0 .983.656 1.965 1.965.735.982 1.329 1.863 1.78 2.64a23.075 23.075 0 0 1 2.641 7.552c0 .942.02 1.617.061 2.025v.49Zm-23.516 1.108c0-1.761-.767-3.429-2.301-5.006-1.536-1.576-3.185-2.363-4.944-2.363-1.555 0-2.925.66-4.113 1.978-1.187 1.319-1.78 2.782-1.78 4.39 0 1.4.675 2.309 2.026 2.719.86.248 2.066.392 3.621.434h3.377c2.743.035 4.114-.682 4.114-2.152Zm6.693 7.612v-1.901a61.917 61.917 0 0 1-.858-1.66c-.246-.817-.697-1.963-1.351-3.439l-.676 7.184c0 .576-.122.861-.369.861-.163 0-.287-.04-.368-.123-.287-4.338-.429-6.222-.429-5.646v-2.148c-.083-.126-.185-.188-.308-.188-1.391 1.437-2.086 3.748-2.086 6.938 0 1.761.163 2.845.49 3.257a5.674 5.674 0 0 0 1.107-.431c.163-.083.633-.123 1.411-.123.775 0 1.72.245 2.823.735.41-.003.614-1.105.614-3.316Zm13.876-8.556c0-1.646-.614-3.119-1.842-4.418-1.228-1.297-2.64-1.945-4.234-1.945-1.72 0-3.328.787-4.821 2.361-1.495 1.576-2.242 3.224-2.242 4.945 0 1.432.697 2.147 2.088 2.147h7.059c2.662-.04 3.992-1.068 3.992-3.09Z\" fill=\"#0D0F0F\"/></g></svg>",
    "2R": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.637C94.401 23.688 100 36.188 100 49.997 100 77.613 77.613 100 50 100c-13.807 0-26.305-5.596-35.354-14.646\" fill=\"#E49977\"/><path d=\"M88.3 74.439c-1.718 4.099-5.13 6.145-10.24 6.145-.937 0-1.952.117-3.044.354-1.639.349-2.458.838-2.458 1.463 0 .193.136.418.41.674.272.254.508.38.703.38-.977 0-.314.028 1.987.087 2.303.059 3.747.089 4.333.089-3.394 1.987-9.07 2.903-17.029 2.75-2.614-.039-4.857-1.19-6.729-3.454-1.835-2.146-2.751-4.541-2.751-7.197 0-2.808.946-5.196 2.839-7.168 1.89-1.97 4.242-2.955 7.051-2.955.623 0 1.453.137 2.486.41 1.034.273 1.727.41 2.077.41 1.444 0 3.239-.596 5.385-1.787 2.146-1.188 3.16-1.783 3.043-1.783-.391 4.098-1.756 6.847-4.097 8.252-1.678.976-2.516 1.93-2.516 2.867 0 .582.35 1.053 1.052 1.403.546.274 1.151.41 1.815.41 1.014 0 2.008-.624 2.984-1.873.974-1.249 1.403-2.379 1.286-3.396-.116-1.17-.037-2.573.235-4.213.077-.469.361-1.043.848-1.727.488-.684.928-1.102 1.317-1.258 0 .35-.127.936-.38 1.755-.254.819-.38 1.427-.38 1.813 0 .858.234 1.521.703 1.99.701-.273 1.324-1.152 1.872-2.634.468-1.131.74-2.224.82-3.276-1.64-.078-3.211-.818-4.711-2.224-1.501-1.405-2.252-2.927-2.252-4.563 0-.273.037-.547.117-.82.232.352.583.898 1.053 1.639.662.977 1.17 1.462 1.521 1.462.468 0 .702-.485.702-1.462 0-1.248-.332-2.38-.995-3.395-.743-1.209-1.699-1.813-2.867-1.813-.548 0-1.366.291-2.458.877-1.093.583-2.088.877-2.983.877-.273 0-1.484-.352-3.629-1.054 3.783-.622 5.676-1.188 5.676-1.696 0-1.324-2.594-2.224-7.783-2.691-.508-.037-1.443-.116-2.809-.234.155-.193 1.268-.408 3.336-.645 1.755-.192 2.983-.291 3.685-.291 9.285 0 15.175 4.508 17.673 13.521.431-.356.645-.952.645-1.78 0-1.07-.312-2.414-.937-4.035-.235-.633-.607-1.582-1.113-2.847 3.198 4.075 4.8 7.938 4.8 11.584 0 1.921-.451 3.664-1.348 5.231-.583 1.057-1.678 2.408-3.276 4.058-1.6 1.646-2.691 2.92-3.277 3.82 2.146-.583 3.551-1.034 4.214-1.347 1.481-.662 2.828-1.658 4.037-2.982 0 .505-.215 1.268-.643 2.279ZM62.786 51.443c0 .701-.391 1.148-1.17 1.346l-1.521.232c-.547.272-1.347 1.348-2.398 3.22-.119-.585-.293-1.402-.528-2.458-.351.039-.935.351-1.755.938-.351.271-.917.684-1.699 1.229.235-1.404 1.017-2.826 2.342-4.271 1.404-1.601 2.77-2.398 4.096-2.398 1.755-.004 2.633.719 2.633 2.162Zm10.182 5.384c0 .663-.361 1.219-1.083 1.667-.722.449-1.434.674-2.135.674-.938 0-1.777-.527-2.517-1.58-.898-1.287-1.814-2.125-2.75-2.518a.965.965 0 0 1 .704-.293c.349 0 .944.273 1.783.818.837.549 1.375.819 1.61.819.195 0 .516-.271.964-.819.448-.545.946-.818 1.493-.818 1.288 0 1.931.686 1.931 2.05ZM43.646 41.593l-2.866 9.675H16.959V49.2c1.157-1.289 3.692-3.889 7.607-7.805a162.48 162.48 0 0 0 7.005-7.476c1.157-1.287 2.048-2.401 2.667-3.335 1.379-2 2.07-4.045 2.07-6.139 0-2.045-.633-3.846-1.901-5.402-1.267-1.559-2.903-2.338-4.905-2.338-4.313 0-7.694 2.915-10.14 8.742l-2.137-.801c2.891-8.185 7.448-12.276 13.678-12.276 3.069 0 5.682 1.044 7.839 3.135 2.159 2.091 3.236 4.67 3.236 7.74 0 3.915-2.245 7.739-6.738 11.478l-4.668 3.866c-2.981 2.492-5.453 4.827-7.406 7.007-.136.135-.402.446-.802.936h12.41c1.912 0 3.359-.377 4.335-1.135.845-.668 1.67-1.937 2.47-3.803l2.067-.001Z\" fill=\"#0D0F0F\"/></g></svg>",
    "2G": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><g fill=\"none\" fill-rule=\"evenodd\"><circle fill=\"#CAC5C0\" cx=\"50\" cy=\"50\" r=\"50\"/><path d=\"M85.349 14.636C94.401 23.687 100 36.187 100 49.996c0 27.616-22.387 50.003-50 50.003-13.807 0-26.305-5.596-35.354-14.646\" fill=\"#A3C095\"/><path d=\"m43.646 41.591-2.866 9.677H16.959V49.2c1.157-1.29 3.692-3.891 7.607-7.805a163.519 163.519 0 0 0 7.005-7.476c1.157-1.288 2.048-2.401 2.667-3.336 1.379-1.999 2.07-4.046 2.07-6.138 0-2.045-.633-3.848-1.901-5.402-1.267-1.561-2.903-2.339-4.905-2.339-4.313 0-7.694 2.916-10.14 8.743l-2.137-.803c2.891-8.183 7.448-12.274 13.678-12.274 3.069 0 5.682 1.044 7.839 3.134 2.159 2.092 3.236 4.67 3.236 7.741 0 3.915-2.245 7.737-6.738 11.476l-4.668 3.868c-2.981 2.492-5.453 4.827-7.406 7.005-.136.137-.402.446-.802.936h12.41c1.912 0 3.359-.377 4.335-1.133.845-.67 1.67-1.937 2.47-3.806h2.067Zm44.872 25.026c0 .758-.293 1.437-.879 2.043-.586.604-1.257.905-2.015.905-1.208 0-2.098-.566-2.663-1.701l-2.667-.112c-.568 0-1.684.246-3.346.737-1.777.49-2.798.888-3.063 1.189-.415.455-.755 1.514-1.021 3.178-.228 1.361-.339 2.363-.339 3.006 0 1.02.16 1.768.481 2.24.321.473.984.869 1.984 1.189 1 .318 1.616.502 1.844.539.151 0 .396-.018.737-.057h.681a5.6 5.6 0 0 1 1.533.227c.755.227 1.078.527.965.907-.531-.074-1.456.038-2.779.34l1.586.795c0 .454-.642.679-1.928.679-.342 0-.805-.072-1.389-.225-.587-.154-.975-.229-1.163-.229h-.737c-.039.379-.151.943-.34 1.701-.645-.037-1.4-.416-2.27-1.133-.87-.72-1.418-1.079-1.643-1.079-.228 0-.55.359-.965 1.079-.417.717-.625 1.207-.625 1.475-.491-.268-.905-.758-1.249-1.475a22.89 22.89 0 0 0-.509-1.479c-.378.039-1.077.836-2.098 2.385h-.284c-.077-.113-.361-.906-.853-2.385-1.172-.375-2.267-.563-3.288-.563-.491 0-1.249.112-2.271.341l-1.586-.113c.225-.228.888-.662 1.984-1.305 1.285-.758 2.269-1.137 2.949-1.137.112 0 .263.021.454.059.188.039.34.058.454.058.262 0 .69-.142 1.276-.427.586-.283.926-.539 1.018-.766.098-.229.145-.813.145-1.759 0-2.153-.568-3.763-1.703-4.819-.984-.945-2.608-1.625-4.876-2.043-.605 2.154-2.307 3.234-5.104 3.234-.909 0-1.815-.549-2.723-1.646-.905-1.098-1.361-2.099-1.361-3.006 0-1.4.586-2.552 1.758-3.46-.944-.981-1.417-1.983-1.417-3.006 0-.944.292-1.776.879-2.496.586-.716 1.353-1.133 2.296-1.248-.074-1.208.321-2.042 1.191-2.495-.416-.414-.623-1.15-.623-2.211 0-1.246.415-2.287 1.248-3.119.83-.83 1.872-1.248 3.117-1.248 1.363 0 2.479.475 3.347 1.418 1.098-3.742 3.459-5.613 7.089-5.613 1.89 0 3.554.756 4.991 2.27.53.565.793.868.793.905-.453 0-.225-.086.681-.254.908-.171 1.568-.257 1.985-.257 1.474 0 2.779.55 3.915 1.646.983.984 1.664 2.229 2.042 3.742.264.039.679.151 1.246.341.832.417 1.249 1.135 1.249 2.155 0 .188-.152.549-.454 1.079 2.419 1.361 3.629 3.251 3.629 5.67 0 .682-.265 1.627-.793 2.836.986.569 1.477 1.401 1.477 2.498Zm-23.366 2.495v-.736c0-.869-.425-1.664-1.275-2.382-.851-.72-1.71-1.077-2.581-1.077-1.06 0-2.042.246-2.949.734 2.003-.11 4.272 1.041 6.805 3.461Zm-1.021-7.03a14.482 14.482 0 0 1-1.474-1.985c-1.589.414-2.382.889-2.382 1.416.453-.037 1.116.047 1.984.256.868.209 1.494.313 1.872.313Zm3.462-1.761v-2.495c-.91-.149-1.459-.226-1.646-.226v.851l1.646 1.87Zm7.372-1.586c-.455-.189-1.305-.568-2.554-1.135v4.877c1.778-1.022 2.628-2.268 2.554-3.742Zm3.116 6.692-1.246-1.529c-.754.529-1.521 1.066-2.298 1.615a10.32 10.32 0 0 0-2.011 1.844c1.699-.911 3.555-1.551 5.555-1.93Z\" fill=\"#0D0F0F\"/></g></svg>",
    "WP": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><circle fill='#F8F6D8' cx='50' cy='50' r='50'/><path d='M77.307 49.928c.059-5.344-1.639-10.738-4.967-14.928-1.607-1.77-2.931-3.787-4.633-5.461-3.755-3.725-9.375-3.973-13.896-6.32-.264-2.357-1.125-4.715-.604-7.094.159-.791.393-1.592-.029-2.348-1.187-2.732-.166-5.699-.377-8.547-.158-1.488-.058-3.309-1.476-4.229-.33 3.098-1.469 5.98-2.392 8.918-.426 2.291-.426 4.676-1.413 6.836.627 2.189-.613 4.031-1.955 5.646-2.968 1.52-6.496 1.881-9.078 4.109-1.84 1.563-3.828 2.932-5.887 4.203-1.545 1.934-3.256 3.797-3.945 6.24-2.762 3.334-3.088 7.811-4.654 11.717-.029 5.799 1.146 12.043 4.85 16.691 2.65 2.188 4.502 5.131 7.149 7.318 2.541 1.518 5.252 2.764 7.875 4.127 1.709.4 3.475.596 5.176 1.061 1.379 7.109 2.322 14.389 5.092 21.133.918-2.768.807-5.736 1.6-8.533 1.119-4.135-1.176-8.439.117-12.5 1.938-1.732 5.17-.607 7.32-2.094 4.092-2.523 8.422-4.98 11.391-8.84 1.105-2.219 3.426-3.877 3.426-6.539.019-3.583 2.109-6.941 1.31-10.566zm-30.373 21.932c-2.965-.721-5.727-2.139-8.213-3.871-2.676-1.783-3.674-5.109-6.314-6.934-2.473-2.949-1.938-6.98-2.951-10.475.406-2.439.885-4.857 1.139-7.326 1.205-1.955 3.066-3.514 3.582-5.869 1.769-2.533 4.459-4.285 6.619-6.48 1.572-1.813 4.074-1.047 6.139-1.119-.204 2-.366 4.07.134 6.041.244 1.213.791 2.408.604 3.676-.414 2.699.598 5.408-.117 8.076-1.443 5.576.131 11.209.268 16.832-.206 2.488-.323 4.998-.89 7.449zm22.477-10.57c-1.963 1.398-3.637 3.111-5.35 4.785-2.979 2.061-5.924 4.24-9.469 5.27.319-2.529.631-5.131-.174-7.607-1.979-5.594.444-11.445.854-17.102-.361-3.363-.017-6.951-1.56-10.049-.201-2.326.806-4.574 1.486-6.764 2.342.936 4.547 2.197 6.496 3.82 2.354 1.766 5.961 2.908 6.488 6.199.268 2.16 2.633 3.467 2.564 5.678-.146 5.256.579 10.752-1.335 15.77z' fill='#111212'/></g></svg>",
    "UP": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><circle fill='#C1D7E9' cx='50' cy='50' r='50'/><path d='M77.307 49.928c.059-5.344-1.639-10.738-4.967-14.928-1.607-1.77-2.931-3.787-4.633-5.461-3.755-3.725-9.375-3.973-13.896-6.32-.264-2.357-1.125-4.715-.604-7.094.159-.791.393-1.592-.029-2.348-1.187-2.732-.166-5.699-.377-8.547-.158-1.488-.058-3.309-1.476-4.229-.33 3.098-1.469 5.98-2.392 8.918-.426 2.291-.426 4.676-1.413 6.836.627 2.189-.613 4.031-1.955 5.646-2.968 1.52-6.496 1.881-9.078 4.109-1.84 1.563-3.828 2.932-5.887 4.203-1.545 1.934-3.256 3.797-3.945 6.24-2.762 3.334-3.088 7.811-4.654 11.717-.029 5.799 1.146 12.043 4.85 16.691 2.65 2.188 4.502 5.131 7.149 7.318 2.541 1.518 5.252 2.764 7.875 4.127 1.709.4 3.475.596 5.176 1.061 1.379 7.109 2.322 14.389 5.092 21.133.918-2.768.807-5.736 1.6-8.533 1.119-4.135-1.176-8.439.117-12.5 1.938-1.732 5.17-.607 7.32-2.094 4.092-2.523 8.422-4.98 11.391-8.84 1.105-2.219 3.426-3.877 3.426-6.539.019-3.583 2.109-6.941 1.31-10.566zm-30.373 21.932c-2.965-.721-5.727-2.139-8.213-3.871-2.676-1.783-3.674-5.109-6.314-6.934-2.473-2.949-1.938-6.98-2.951-10.475.406-2.439.885-4.857 1.139-7.326 1.205-1.955 3.066-3.514 3.582-5.869 1.769-2.533 4.459-4.285 6.619-6.48 1.572-1.813 4.074-1.047 6.139-1.119-.204 2-.366 4.07.134 6.041.244 1.213.791 2.408.604 3.676-.414 2.699.598 5.408-.117 8.076-1.443 5.576.131 11.209.268 16.832-.206 2.488-.323 4.998-.89 7.449zm22.477-10.57c-1.963 1.398-3.637 3.111-5.35 4.785-2.979 2.061-5.924 4.24-9.469 5.27.319-2.529.631-5.131-.174-7.607-1.979-5.594.444-11.445.854-17.102-.361-3.363-.017-6.951-1.56-10.049-.201-2.326.806-4.574 1.486-6.764 2.342.936 4.547 2.197 6.496 3.82 2.354 1.766 5.961 2.908 6.488 6.199.268 2.16 2.633 3.467 2.564 5.678-.146 5.256.579 10.752-1.335 15.77z' fill='#111212'/></g></svg>",
    "BP": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g transform='translate(0 -1)' fill='none'><circle fill='#BAB1AB' cx='50' cy='50.998' r='50'/><path d='M77.307 50.928c.059-5.344-1.639-10.738-4.967-14.928-1.607-1.77-2.931-3.787-4.633-5.461-3.755-3.725-9.375-3.973-13.896-6.32-.264-2.357-1.125-4.715-.604-7.094.159-.791.393-1.592-.029-2.348-1.187-2.732-.166-5.699-.377-8.547-.158-1.488-.058-3.309-1.476-4.229-.33 3.098-1.469 5.98-2.392 8.918-.426 2.291-.426 4.676-1.413 6.836.627 2.189-.613 4.031-1.955 5.646-2.968 1.52-6.496 1.881-9.078 4.109-1.84 1.563-3.828 2.932-5.887 4.203-1.545 1.934-3.256 3.797-3.945 6.24-2.762 3.334-3.088 7.811-4.654 11.717-.029 5.799 1.146 12.043 4.85 16.691 2.65 2.188 4.502 5.131 7.149 7.318 2.541 1.518 5.252 2.764 7.875 4.127 1.709.4 3.475.596 5.176 1.061 1.379 7.109 2.322 14.389 5.092 21.133.918-2.768.807-5.736 1.6-8.533 1.119-4.135-1.176-8.439.117-12.5 1.938-1.732 5.17-.607 7.32-2.094 4.092-2.523 8.422-4.98 11.391-8.84 1.105-2.219 3.426-3.877 3.426-6.539.019-3.583 2.109-6.941 1.31-10.566zm-30.373 21.932c-2.965-.721-5.727-2.139-8.213-3.871-2.676-1.783-3.674-5.109-6.314-6.934-2.473-2.949-1.938-6.98-2.951-10.475.406-2.439.885-4.857 1.139-7.326 1.205-1.955 3.066-3.514 3.582-5.869 1.769-2.533 4.459-4.285 6.619-6.48 1.572-1.813 4.074-1.047 6.139-1.119-.204 2-.366 4.07.134 6.041.244 1.213.791 2.408.604 3.676-.414 2.699.598 5.408-.117 8.076-1.443 5.576.131 11.209.268 16.832-.206 2.488-.323 4.998-.89 7.449zm22.477-10.57c-1.963 1.398-3.637 3.111-5.35 4.785-2.979 2.061-5.924 4.24-9.469 5.27.319-2.529.631-5.131-.174-7.607-1.979-5.594.444-11.445.854-17.102-.361-3.363-.017-6.951-1.56-10.049-.201-2.326.806-4.574 1.486-6.764 2.342.936 4.547 2.197 6.496 3.82 2.354 1.766 5.961 2.908 6.488 6.199.268 2.16 2.633 3.467 2.564 5.678-.146 5.256.579 10.752-1.335 15.77z' fill='#111212'/></g></svg>",
    "RP": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><circle fill='#E49977' cx='50' cy='50' r='50'/><path d='M77.307 48.927c.059-5.344-1.639-10.738-4.967-14.928-1.607-1.77-2.931-3.787-4.633-5.461-3.755-3.725-9.375-3.973-13.896-6.32-.264-2.357-1.125-4.715-.604-7.094.159-.791.393-1.592-.029-2.348-1.187-2.732-.166-5.699-.377-8.547-.158-1.488-.058-3.309-1.476-4.229-.33 3.098-1.469 5.98-2.392 8.918-.426 2.291-.426 4.676-1.413 6.836.627 2.189-.613 4.031-1.955 5.646-2.968 1.52-6.496 1.881-9.078 4.109-1.84 1.563-3.828 2.932-5.887 4.203-1.545 1.934-3.256 3.797-3.945 6.24-2.762 3.334-3.088 7.811-4.654 11.717-.029 5.799 1.146 12.043 4.85 16.691 2.65 2.188 4.502 5.131 7.149 7.318 2.541 1.518 5.252 2.764 7.875 4.127 1.709.4 3.475.596 5.176 1.061 1.379 7.109 2.322 14.389 5.092 21.133.918-2.768.807-5.736 1.6-8.533 1.119-4.135-1.176-8.439.117-12.5 1.938-1.732 5.17-.607 7.32-2.094 4.092-2.523 8.422-4.98 11.391-8.84 1.105-2.219 3.426-3.877 3.426-6.539.019-3.583 2.109-6.941 1.31-10.566zm-30.373 21.932c-2.965-.721-5.727-2.139-8.213-3.871-2.676-1.783-3.674-5.109-6.314-6.934-2.473-2.949-1.938-6.98-2.951-10.475.406-2.439.885-4.857 1.139-7.326 1.205-1.955 3.066-3.514 3.582-5.869 1.769-2.533 4.459-4.285 6.619-6.48 1.572-1.813 4.074-1.047 6.139-1.119-.204 2-.366 4.07.134 6.041.244 1.213.791 2.408.604 3.676-.414 2.699.598 5.408-.117 8.076-1.443 5.576.131 11.209.268 16.832-.206 2.488-.323 4.998-.89 7.449zm22.477-10.57c-1.963 1.398-3.637 3.111-5.35 4.785-2.979 2.061-5.924 4.24-9.469 5.27.319-2.529.631-5.131-.174-7.607-1.979-5.594.444-11.445.854-17.102-.361-3.363-.017-6.951-1.56-10.049-.201-2.326.806-4.574 1.486-6.764 2.342.936 4.547 2.197 6.496 3.82 2.354 1.766 5.961 2.908 6.488 6.199.268 2.16 2.633 3.467 2.564 5.678-.146 5.256.579 10.752-1.335 15.77z' fill='#111212'/></g></svg>",
    "GP": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none'><path d='M100 49.998c0 27.615-22.385 50.002-50.002 50.002-27.613 0-49.998-22.387-49.998-50.002 0-27.613 22.385-49.998 49.998-49.998 27.617 0 50.002 22.385 50.002 49.998z' id='Shape' fill='#A3C095'/><path d='M77.307 48.927c.059-5.344-1.639-10.738-4.967-14.928-1.607-1.77-2.931-3.787-4.633-5.461-3.755-3.725-9.375-3.973-13.896-6.32-.264-2.357-1.125-4.715-.604-7.094.159-.791.393-1.592-.029-2.348-1.187-2.732-.166-5.699-.377-8.547-.158-1.488-.058-3.309-1.476-4.229-.33 3.098-1.469 5.98-2.392 8.918-.426 2.291-.426 4.676-1.413 6.836.627 2.189-.613 4.031-1.955 5.646-2.968 1.52-6.496 1.881-9.078 4.109-1.84 1.563-3.828 2.932-5.887 4.203-1.545 1.934-3.256 3.797-3.945 6.24-2.762 3.334-3.088 7.811-4.654 11.717-.029 5.799 1.146 12.043 4.85 16.691 2.65 2.188 4.502 5.131 7.149 7.318 2.541 1.518 5.252 2.764 7.875 4.127 1.709.4 3.475.596 5.176 1.061 1.379 7.109 2.322 14.389 5.092 21.133.918-2.768.807-5.736 1.6-8.533 1.119-4.135-1.176-8.439.117-12.5 1.938-1.732 5.17-.607 7.32-2.094 4.092-2.523 8.422-4.98 11.391-8.84 1.105-2.219 3.426-3.877 3.426-6.539.019-3.583 2.109-6.941 1.31-10.566zm-30.373 21.932c-2.965-.721-5.727-2.139-8.213-3.871-2.676-1.783-3.674-5.109-6.314-6.934-2.473-2.949-1.938-6.98-2.951-10.475.406-2.439.885-4.857 1.139-7.326 1.205-1.955 3.066-3.514 3.582-5.869 1.769-2.533 4.459-4.285 6.619-6.48 1.572-1.813 4.074-1.047 6.139-1.119-.204 2-.366 4.07.134 6.041.244 1.213.791 2.408.604 3.676-.414 2.699.598 5.408-.117 8.076-1.443 5.576.131 11.209.268 16.832-.206 2.488-.323 4.998-.89 7.449zm22.477-10.57c-1.963 1.398-3.637 3.111-5.35 4.785-2.979 2.061-5.924 4.24-9.469 5.27.319-2.529.631-5.131-.174-7.607-1.979-5.594.444-11.445.854-17.102-.361-3.363-.017-6.951-1.56-10.049-.201-2.326.806-4.574 1.486-6.764 2.342.936 4.547 2.197 6.496 3.82 2.354 1.766 5.961 2.908 6.488 6.199.268 2.16 2.633 3.467 2.564 5.678-.146 5.256.579 10.752-1.335 15.77z' fill='#111212'/></g></svg>"
  };

  /* ---------- 8. 查表 / 归一化 / DOM 处理 ---------- */

  // 小写索引：只收长度 >= 5 的键，避免 "open"/"card" 这类短词误伤卡名与玩家名
  var DICT_LC = Object.create(null);
  for (var k in DICT) {
    if (k.length >= 5 && !(k.toLowerCase() in DICT_LC)) DICT_LC[k.toLowerCase()] = DICT[k];
  }

  var PUNCT_MAP = {
    '\u2018': "'", '\u2019': "'", '\u201A': "'", '\u201B': "'",
    '\u201C': '"', '\u201D': '"',
    '\u2013': '-', '\u2014': '-', '\u2212': '-',
    '\u00A0': ' ', '\u2009': ' ', '\u202F': ' ', '\u2007': ' '
  };
  var PUNCT_RE = /[\u2018\u2019\u201A\u201B\u201C\u201D\u2013\u2014\u2212\u00A0\u2009\u202F\u2007]/g;

  function norm(s) {
    return s.replace(PUNCT_RE, function (c) { return PUNCT_MAP[c] || c; })
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 归一化索引：词表里的 — ’ “ ” 两侧写法必须对齐，否则带破折号的句子永远查不到
  var DICT_N = Object.create(null);
  for (var k2 in DICT) {
    var nk = norm(k2);
    if (!(nk in DICT_N)) DICT_N[nk] = DICT[k2];
  }

  var TAIL_RE = /^([\s\S]*?)(\.{3,}|[.?!:;]+|\u2026+)$/;

  function lookup(raw) {
    var s = norm(raw);
    if (!s) return null;
    if (s in DICT_N) return DICT_N[s];

    var lower = s.toLowerCase();
    if (lower in DICT_LC) return DICT_LC[lower];

    var m = TAIL_RE.exec(s);
    if (m) {
      var core = m[1];
      var tail = m[2];
      if (core in DICT_N) return DICT_N[core] + zhTail(tail, DICT_N[core]);
      if (core.toLowerCase() in DICT_LC) return DICT_LC[core.toLowerCase()] + zhTail(tail, DICT_LC[core.toLowerCase()]);
    }
    return null;
  }

  // 英文标点转中文标点：短标签直接丢弃标点，长句补全角句号
  function zhTail(tail, zh) {
    if (!zh) return '';
    if (/^(\.{3,}|\u2026+)$/.test(tail)) return '\u2026';
    if (zh.length < 5) return '';
    if (tail === '?') return '\uff1f';
    if (tail === '!') return '\uff01';
    if (tail === ':') return '\uff1a';
    return '\u3002';
  }

  /* ------------------------------ 规则 ------------------------------ */

  // tooltip 常把「整句 + (B, Esc to cancel)」拼成一条，先剥掉尾部的快捷键提示再翻
  var HOTKEY_TAIL = /^([\s\S]{2,300}?)\s*\(([A-Za-z0-9+\-\u2190\u2191\u2192\u2193]{1,12}), Esc to cancel\)$/;

  function applyRules(raw) {
    var s = norm(raw);
    if (!s) return null;

    var hk = HOTKEY_TAIL.exec(s);
    if (hk) {
      var body = lookup(hk[1]) || applyRules(hk[1]);
      if (body) {
        // 原句本身以（…）结尾时，把快捷键并进同一个括号
        if (body.slice(-1) === '\uff09') {
          return body.slice(0, -1) + '\uff0c' + hk[2] + '\uff0cEsc \u53d6\u6d88\uff09';
        }
        return body + '\uff08' + hk[2] + '\uff0cEsc \u53d6\u6d88\uff09';
      }
    }

    if (s.length > 600) return null;
    for (var i = 0; i < RULES.length; i++) {
      var m = RULES[i][0].exec(s);
      if (!m) continue;
      var out = null;
      try { out = RULES[i][1].apply(null, m); } catch (e) { out = null; }
      if (out != null) return out;
    }
    return null;
  }

  try { window.__eszhVer = '1.4.1'; } catch (e) {}

  /* ------------------- 卡面词典（mtgch 中文 / Scryfall 兜底） ------------------- */

  /*
   * 卡面文字不是界面文案，是卡牌数据。站点 CSP 只放行 'self' 与 api.scryfall.com，
   * 所以 mtgch 走 GM_xmlhttpRequest，Scryfall 走普通 fetch 兜底。
   *
   * 双面 / 预兆牌要按「当前显示的是哪一面」取值：mtgch 的 other_faces、Scryfall 的
   * card_faces 都带每面的英文类型行，用它与页面上的类型行比对即可判断。
   */
  var MTGCH_API = 'https://mtgch.com/api/v1/result?q=';
  var SCRY_API = 'https://api.scryfall.com/cards/search?unique=prints&q=';
  var CARD_KEY = 'eszh:card3:';
  var CARD_MEM = Object.create(null);
  var CARD_PENDING = Object.create(null);
  var CARD_MARK = 'data-eszh-card';

  /* ---- 自检：打开 endstep.cc/#eszh-debug 会在左下角显示一行统计 ---- */
  var DBG = {
    on: false, el: null, box: 0, type: 0, hit: 0, miss: 0, fail: 0, last: '',
    init: function () {
      try {
        DBG.on = /eszh-debug/.test(location.hash) || localStorage.getItem('eszh:debug') === '1';
      } catch (e) {}
      return DBG.on;
    },
    show: function () {
      if (!DBG.on) return;
      if (!DBG.el && document.body) {
        var d = document.createElement('div');
        d.id = 'eszh-debug';
        d.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:2147483647;background:#141110;' +
          'color:#c8aa5a;font:11px/1.5 Consolas,monospace;padding:8px 10px;border:1px solid #6b5636;' +
          'border-radius:4px;max-width:520px;white-space:pre-wrap;pointer-events:none';
        document.body.appendChild(d);
        DBG.el = d;
      }
      if (DBG.el) {
        DBG.el.textContent =
          'eszh 自检 v' + (window.__eszhVer || '?') + '\n' +
          '卡面容器 .es-ct: ' + DBG.box + '\n' +
          '类型行命中: ' + DBG.type + '\n' +
          '查询成功 / 无中文 / 请求失败: ' + DBG.hit + ' / ' + DBG.miss + ' / ' + DBG.fail + '\n' +
          '最近: ' + (DBG.last || '-');
      }
    }
  };

  // 跨域：mtgch 只能走 GM_xmlhttpRequest
  function gmGet(url) {
    return new Promise(function (resolve, reject) {
      var fn = (typeof GM_xmlhttpRequest === 'function') ? GM_xmlhttpRequest
        : (typeof GM !== 'undefined' && GM && GM.xmlHttpRequest) ? GM.xmlHttpRequest
        : null;
      if (!fn) return reject(new Error('GM_xmlhttpRequest unavailable'));
      try {
        fn({
          method: 'GET',
          url: url,
          timeout: 15000,
          headers: { Accept: 'application/json' },
          onload: function (r) { resolve({ ok: r.status >= 200 && r.status < 300, status: r.status, text: r.responseText }); },
          onerror: function () { reject(new Error('network error')); },
          ontimeout: function () { reject(new Error('timeout')); }
        });
      } catch (e) { reject(e); }
    });
  }

  // 串行 + 间隔，避免一屏卡牌把接口打满
  var CARD_QUEUE = [];
  var CARD_RUNNING = false;
  function cardPump() {
    if (CARD_RUNNING || !CARD_QUEUE.length) return;
    CARD_RUNNING = true;
    var job = CARD_QUEUE.shift();
    Promise.resolve()
      .then(job.run)
      .then(job.resolve, job.reject)
      .then(function () {
        setTimeout(function () { CARD_RUNNING = false; cardPump(); }, 110);
      });
  }
  function queueJob(fn) {
    return new Promise(function (resolve, reject) {
      CARD_QUEUE.push({ run: fn, resolve: resolve, reject: reject });
      cardPump();
    });
  }

  function normType(s) {
    return String(s == null ? '' : s)
      .toLowerCase()
      .replace(/[\u2014\u2013-]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // 统一成 [{en, type, zh, ztype, ztext, zflavor}, ...]，正面在前
  function faceFrom(obj, tag) {
    return {
      en: obj.face_name || obj.name || '',
      type: obj.type_line || '',
      zh: obj.zhs_name || obj.atomic_translated_name || obj.printed_name || '',
      ztype: obj.zhs_type_line || obj.atomic_translated_type || obj.printed_type_line || '',
      ztext: obj.zhs_text || obj.atomic_translated_text || obj.printed_text || '',
      zflavor: obj.zhs_flavor_text || obj.atomic_translated_flavor_text || '',
      enText: String(obj.oracle_text || '').replace(/\s+/g, ' ').trim()
    };
  }

  function facesFromMtgch(j, name) {
    var items = (j && j.items) || [];
    var low = name.toLowerCase();
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var iname = (it.name || '').toLowerCase();
      var fname = (it.face_name || '').toLowerCase();
      if (iname !== low && iname.indexOf(low + ' // ') !== 0 && fname !== low) {
        // 也可能是另一面名命中
        var others = it.other_faces || [];
        var ok = false;
        for (var q = 0; q < others.length; q++) {
          if ((others[q].face_name || '').toLowerCase() === low) ok = true;
        }
        if (!ok) continue;
      }
      var list = [it].concat(it.other_faces || []);
      var out = [];
      for (var k = 0; k < list.length; k++) out.push(faceFrom(list[k]));
      if (out.length) return out;
    }
    return null;
  }

  function facesFromScryfall(j) {
    var items = (j && j.data) || [];
    for (var i = 0; i < items.length; i++) {
      var c = items[i];
      if (c.card_faces && c.card_faces.length > 1) {
        var out = [];
        for (var k = 0; k < c.card_faces.length; k++) out.push(faceFrom(c.card_faces[k]));
        if (out.some(function (f) { return f.zh; })) return out;
      }
      if (c.printed_name) return [faceFrom(c)];
    }
    return null;
  }

  function cardZh(name) {
    if (Object.prototype.hasOwnProperty.call(CARD_MEM, name)) return Promise.resolve(CARD_MEM[name]);
    if (CARD_PENDING[name]) return CARD_PENDING[name];

    var hit = null;
    try {
      var raw = localStorage.getItem(CARD_KEY + name);
      if (raw) hit = JSON.parse(raw);
    } catch (e) {}
    if (hit) {
      CARD_MEM[name] = hit;
      if (DBG.on) { DBG.hit++; DBG.last = name + '（缓存）'; DBG.show(); }
      return Promise.resolve(hit);
    }

    function fromMtgch() {
      return queueJob(function () { return gmGet(MTGCH_API + encodeURIComponent(name)); })
        .then(function (r) {
          if (!r.ok) return null;
          return facesFromMtgch(JSON.parse(r.text), name);
        });
    }

    function fromScryfall() {
      var q = SCRY_API + encodeURIComponent('!"' + name + '" lang:zhs');
      return queueJob(function () { return fetch(q, { credentials: 'omit' }); })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) { return j ? facesFromScryfall(j) : null; });
    }

    var p = fromMtgch()
      .catch(function () { return null; })
      .then(function (v) { return v || fromScryfall().catch(function () { return null; }); })
      .catch(function (e) {
        if (DBG.on) { DBG.fail++; DBG.last = name + ' → 请求失败 ' + (e && e.message ? e.message : ''); DBG.show(); }
        return null;
      })
      .then(function (v) {
        var usable = v && v.some(function (f) { return f.zh; }) ? v : null;
        if (DBG.on) {
          if (usable) DBG.hit++; else DBG.miss++;
          DBG.last = name + (usable ? ' → ' + usable[0].zh + (usable.length > 1 ? '（' + usable.length + ' 面）' : '') : ' → 无中文');
          DBG.show();
        }
        CARD_MEM[name] = usable;
        delete CARD_PENDING[name];
        try { if (usable) localStorage.setItem(CARD_KEY + name, JSON.stringify(usable)); } catch (e) {}
        return usable;
      });

    CARD_PENDING[name] = p;
    return p;
  }

  /* 双面 / 预兆 / 分卡：一律不翻，保持英文原样。
   * 这类牌两面文字共用一段区域，翻一面就会和另一面混排，不如整体不动。 */
  function pickFace(faces) {
    if (!faces || !faces.length) return null;
    if (faces.length > 1) return null;
    return faces[0].zh ? faces[0] : null;
  }

  // 接口偶尔把换行转义成字面量「\n」（两个字符），且个别卡把 {T} 存成 ocT
  function fixText(t) {
    return String(t == null ? '' : t)
      .replace(/\\r\\n|\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, ' ')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\boc([A-Z0-9])\b/g, '{$1}')
      .replace(/\bo([0-9])\b/g, '{$1}')
      // 个别卡把费用写成「～一绿」这类中文，还原成法术力符号
      .replace(/([～~—–-])\s*([0-9一二三四五六七八九十]+)\s*([白蓝黑红绿])/g,
        function (_, dash, num, color) {
          var cn = { '一': '1', '二': '2', '两': '2', '三': '3', '四': '4', '五': '5', '六': '6', '七': '7', '八': '8', '九': '9', '十': '10' };
          var col = { '白': 'W', '蓝': 'U', '黑': 'B', '红': 'R', '绿': 'G' }[color];
          var n = cn[num] || num;
          return dash + '{' + n + '}{' + col + '}';
        });
  }

  /* 法术力符号：不依赖 mana-font，也不克隆原文节点——
   * 站点面板本身不解析 {X}，没有符号元素可用，所以自己画一个小圆徽章。
   * 纯内联样式，任何环境都能显示，不会出现字体没加载变成空白/方框。 */
  var MS_COLOR = {
    W: ['#F6EBD0', '#4A3A1C'], U: ['#B9DCF2', '#123A5C'], B: ['#45403C', '#F2E9DA'],
    R: ['#F0A98C', '#4A1B0C'], G: ['#A8C9A0', '#173404'], C: ['#CFC9BC', '#2C2C2A'],
    S: ['#D7E6F2', '#2C3E50'], E: ['#F2D07A', '#4A3506'], X: ['#CFC9BC', '#2C2C2A'],
    Y: ['#CFC9BC', '#2C2C2A'], Z: ['#CFC9BC', '#2C2C2A'], T: ['#E7DCC0', '#3A2C0E'],
    Q: ['#E7DCC0', '#3A2C0E'], P: ['#D9C9A8', '#3A2C0E'], H: ['#D9C9A8', '#3A2C0E'],
    A: ['#CFC9BC', '#2C2C2A'], L: ['#F2D07A', '#4A3506'], D: ['#CFC9BC', '#2C2C2A']
  };

  function symEl(code) {
    var raw = String(code).replace(/[{}]/g, '').trim();
    var key = raw.toUpperCase().replace(/[\/]/g, '');
    var svg = (typeof MS_SVG !== 'undefined' && MS_SVG[key]) || null;
    if (!svg && key.length === 2) {
      var rev = key.charAt(1) + key.charAt(0);
      svg = (typeof MS_SVG !== 'undefined' && MS_SVG[rev]) || null;
    }

    var wrap = document.createElement('span');
    wrap.className = 'eszh-ms';
    wrap.setAttribute('aria-label', '{' + raw + '}');
    wrap.style.cssText =
      'display:inline-block;width:1.05em;height:1.05em;margin:0 .1em;' +
      'vertical-align:-.16em;line-height:0';

    if (svg) {
      wrap.innerHTML = svg;
      var node = wrap.firstChild;
      if (node && node.tagName && node.tagName.toLowerCase() === 'svg') {
        node.setAttribute('width', '100%');
        node.setAttribute('height', '100%');
        node.style.display = 'block';
      }
      return wrap;
    }

    // 没收录的符号退回文字徽章，保证不出现空白
    var c = MS_COLOR[key.charAt(0)] || MS_COLOR.C;
    wrap.textContent = key;
    wrap.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;' +
      'min-width:.95em;height:.95em;padding:0 .16em;box-sizing:border-box;' +
      'border-radius:50%;font-size:.8em;font-weight:700;line-height:1;' +
      'vertical-align:-.12em;margin:0 .08em;background:' + c[0] + ';color:' + c[1] + ';' +
      'box-shadow:inset 0 0 0 1px rgba(0,0,0,.28)';
    return wrap;
  }

  // 把中文逐段写回，{T}{G} 一律渲染成上面那种徽章
  function setRichText(el, text) {
    text = fixText(text);
    var frag = document.createDocumentFragment();
    var parts = text.split(/(\{[^}]{1,16}\})/);
    for (var i = 0; i < parts.length; i++) {
      var seg = parts[i];
      if (!seg) continue;
      if (/^\{[^}]{1,16}\}$/.test(seg)) {
        frag.appendChild(symEl(seg.slice(1, -1)));
        continue;
      }
      var lines = seg.split('\n');
      for (var k = 0; k < lines.length; k++) {
        if (k) frag.appendChild(document.createElement('br'));
        if (lines[k]) frag.appendChild(document.createTextNode(lines[k]));
      }
    }
    el.textContent = '';
    el.appendChild(frag);
  }

  // 纯文本节点写入：带换行时替换成 <br>
  function writeInline(node, text) {
    text = fixText(text);
    if (text.indexOf('\n') < 0) { node.nodeValue = text; return; }
    var frag = document.createDocumentFragment();
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (i) frag.appendChild(document.createElement('br'));
      if (lines[i]) frag.appendChild(document.createTextNode(lines[i]));
    }
    if (node.parentNode) node.parentNode.replaceChild(frag, node);
  }

  // 容器里出现多个面名时，用字号最大的那个判断当前显示的是哪一面
  function findFaceNameNode(box, faces) {
    var idxBy = Object.create(null);
    for (var i = 0; i < faces.length; i++) {
      if (faces[i].en) idxBy[faces[i].en.toLowerCase()] = i;
    }
    var nodes = [];
    textNodesIn(box, nodes, 80);
    var best = null, bestSize = -1, bestIdx = -1;
    for (var k = 0; k < nodes.length; k++) {
      var t = (nodes[k].nodeValue || '').trim().toLowerCase();
      if (!(t in idxBy)) continue;
      var host = nodes[k].parentNode;
      if (!host || host.nodeType !== 1) host = box;
      // 跳过不可见的节点（隐藏的正面名、离屏副本），否则会误判成另一面
      try {
        if (host.getClientRects && host.getClientRects().length === 0) continue;
      } catch (e) {}
      var size = 0;
      try { size = parseFloat(window.getComputedStyle(host).fontSize) || 0; } catch (e) {}
      if (size > bestSize) { best = nodes[k]; bestSize = size; bestIdx = idxBy[t]; }
    }
    return best ? { node: best, index: bestIdx } : null;
  }

  function applyOneCard(box) {
    if (!box || box.getAttribute(CARD_MARK)) return;
    var nameEl = box.querySelector('b');
    if (!nameEl) return;
    var en = (nameEl.textContent || '').trim();
    if (!en || /[\u4e00-\u9fff]/.test(en)) return;
    if (en.length > 80) return;
    box.setAttribute(CARD_MARK, '1');

    var tlEl = box.querySelector('[class*="es-ct-tl"]');
    var oeEl = box.querySelector('[class*="es-ct-o"]');

    cardZh(en).then(function (faces) {
      if (!faces) {
        var tries = parseInt(box.getAttribute('data-eszh-try') || '0', 10);
        if (tries < 2) {
          setTimeout(function () {
            box.removeAttribute(CARD_MARK);
            box.setAttribute('data-eszh-try', String(tries + 1));
          }, 1500);
        }
        return;
      }
      var hit = findFaceNameNode(box, faces);
      var bodyTxt = oeEl ? oeEl.textContent : '';
      var f = pickFace(faces);
      if (DBG.on) {
        DBG.last = '卡面 ' + en + ' ｜面 ' + (hit ? hit.index : '-') + '/' + faces.length +
          ' ｜title=' + String(hit ? hit.node.nodeValue : nameEl.textContent).slice(0, 18) +
          ' ｜type=' + String(tlEl ? tlEl.textContent : '-').slice(0, 22) +
          ' ｜正文=' + String(bodyTxt).replace(/\s+/g, ' ').slice(0, 22) +
          ' → ' + (f ? f.zh : '未选');
        DBG.show();
      }
      if (!f || !f.zh) return;
      // 标题：优先改「可见且字号最大的面名节点」，再把 b 也一并改掉
      if (hit && hit.node.nodeValue !== f.zh) hit.node.nodeValue = f.zh;
      if (nameEl.parentNode && nameEl.textContent !== f.zh) nameEl.textContent = f.zh;
      if (tlEl && f.ztype) tlEl.textContent = f.ztype;
      if (oeEl && f.ztext) setRichText(oeEl, f.ztext);
      var fhs = box.querySelectorAll('[class*="es-ct-fh"]');
      if (fhs.length > 1 && f.zflavor) fhs[fhs.length - 1].textContent = f.zflavor;
    });
  }

  /* ---- 结构启发：不认类名，靠「类型行」这个排版特征定位卡面 ---- */

  var TYPE_RE = /^(?:(?:Basic|Snow|Legendary|World|Ongoing|Elite|Host|Token)\s+)*(Instant|Sorcery|Enchantment|Artifact|Creature|Land|Planeswalker|Battle|Tribal|Conspiracy|Scheme|Vanguard|Phenomenon|Plane|Dungeon)\b/i;
  var TYPE_SEEN = typeof WeakSet === 'function' ? new WeakSet() : null;

  function isTypeLine(text) {
    var t = (text || '').trim();
    if (!t || t.length > 64) return false;
    return TYPE_RE.test(t);
  }

  function textNodesIn(el, out, limit) {
    var tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var n, i = 0;
    while ((n = tw.nextNode())) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      out.push(n);
      if (++i > (limit || 120)) break;
    }
    return out;
  }

  // 标题可能不在同一个容器里（例如类型+正文在子块、标题在外层），
  // 逐层向上找一个「含可见面名」的祖先来改标题
  function replaceTitleNear(tn, faces, zhName) {
    var el = tn.parentNode;
    for (var up = 0; up < 3 && el && el.nodeType === 1; up++) {
      var h = findFaceNameNode(el, faces);
      if (h && h.node.nodeValue !== zhName) { h.node.nodeValue = zhName; return true; }
      el = el.parentElement;
    }
    return false;
  }

  function cardPassHeuristic(root) {
    var nodes = [];
    textNodesIn(root, nodes, 80);
    for (var i = 0; i < nodes.length; i++) {
      var tn = nodes[i];
      if (!isTypeLine(tn.nodeValue)) continue;
      if (DBG.on) { DBG.type++; DBG.show(); }

      var box = tn.parentNode;
      for (var up = 0; up < 4 && box && box.parentNode; up++) {
        if (box.textContent && box.textContent.trim().length > tn.nodeValue.trim().length + 24) break;
        box = box.parentNode;
      }
      if (!box || box.nodeType !== 1) continue;
      if (TYPE_SEEN && TYPE_SEEN.has(tn)) continue;

      var inner = [];
      textNodesIn(box, inner, 60);
      var idx = inner.indexOf(tn);
      if (idx < 0) continue;   // idx===0 也要处理：类型行就是容器第一行时标题在外层

      // 卡名只在「类型行的前一个兄弟块」里找，避免抓到另一面的名字
      var nameNode = null;
      var scope = tn.parentNode && tn.parentNode.previousElementSibling;
      if (scope) {
        var scoped = [];
        textNodesIn(scope, scoped, 20);
        for (var q = scoped.length - 1; q >= 0; q--) {
          var qt = scoped[q].nodeValue.trim();
          if (qt.length && qt.length <= 80 && /[A-Za-z]{2}/.test(qt) && !/^\{|^\d+\s*\/\s*\d+$/.test(qt)) {
            nameNode = scoped[q];
            break;
          }
        }
      }
      if (!nameNode) {
        for (var k = idx - 1; k >= 0; k--) {
          var t = inner[k].nodeValue.trim();
          if (t.length && t.length <= 80 && /[A-Za-z]{2}/.test(t) && !/^\{|^\d+\s*\/\s*\d+$/.test(t)) {
            nameNode = inner[k];
            break;
          }
        }
      }
      // 标题常常在类型块之外（外层容器里），再往外一层找
      if (!nameNode) {
        var outer = box.parentElement || box;
        var cands = [];
        textNodesIn(outer, cands, 80);
        for (var c = cands.length - 1; c >= 0; c--) {
          var cn2 = cands[c];
          if (cn2 === tn) continue;
          if (!(cn2.compareDocumentPosition(tn) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
          var ct = cn2.nodeValue.trim();
          if (ct.length && ct.length <= 80 && /[A-Za-z]{2}/.test(ct) &&
              !/^\{|^\d+\s*\/\s*\d+$/.test(ct) && !isTypeLine(ct)) {
            nameNode = cn2;
            box = outer;
            break;
          }
        }
      }
      if (!nameNode) continue;
      var en = nameNode.nodeValue.trim();
      if (/[\u4e00-\u9fff]/.test(en)) continue;

      // 规则文本块：类型行元素的下一块（可能夹着符号元素）
      var oracleEl = null;
      var tlEl = tn.parentNode;
      if (tlEl && tlEl.nodeType === 1 && tlEl.nextElementSibling) {
        var sib = tlEl.nextElementSibling;
        var st = (sib.textContent || '').replace(/\s+/g, ' ').trim();
        if (st && st.length < 600 && !/^\d+\s*\/\s*\d+$/.test(st) && !isTypeLine(st)) oracleEl = sib;
      }

      if (TYPE_SEEN) TYPE_SEEN.add(tn);

      (function (bz, nn, tl, oe) {
        var key = (nn.nodeValue || '').trim();
        var typeTxt = (tl.nodeValue || '').trim();
        cardZh(key).then(function (faces) {
          if (!faces) return;
          var hit = findFaceNameNode(bz, faces);
          var bodyTxt = oe ? oe.textContent : '';
          var f = pickFace(faces);
          if (DBG.on) {
            DBG.last = '结构 ' + key + ' ｜面 ' + (f ? faces.indexOf(f) : '-') + '/' + faces.length +
              ' ｜title=' + String(hit ? hit.node.nodeValue : nn.nodeValue).slice(0, 16) +
              ' ｜type=' + String(typeTxt).slice(0, 20) +
              ' ｜正文=' + String(bodyTxt).replace(/\s+/g, ' ').slice(0, 18) +
              ' → ' + (f ? f.zh : '未选');
            DBG.show();
          }
          if (!f || !f.zh) return;
          var titled = replaceTitleNear(tl, faces, f.zh);
          if (!titled) {
            if (hit && hit.node.nodeValue !== f.zh) hit.node.nodeValue = f.zh;
            if (nn.nodeValue !== f.zh) nn.nodeValue = f.zh;
          }
          if (tl && f.ztype) tl.nodeValue = f.ztype;
          if (oe && f.ztext) setRichText(oe, f.ztext);
        });
      })(box, nameNode, tn, oracleEl);
    }
  }

  function cardPass(root) {
    if (!root || root.nodeType !== 1) return;
    if (!DBG.on && !DBG.el) DBG.init();

    var boxes = [];
    try {
      if (root.matches && root.matches('.es-ct')) boxes.push(root);
      if (root.querySelectorAll) {
        var found = root.querySelectorAll('.es-ct');
        for (var i = 0; i < found.length; i++) boxes.push(found[i]);
      }
    } catch (e) {}
    if (DBG.on && boxes.length) { DBG.box += boxes.length; DBG.show(); }
    for (var j = 0; j < boxes.length; j++) applyOneCard(boxes[j]);

    try { cardPassHeuristic(root); } catch (e) {}
  }

  /* ------------------------------ DOM ------------------------------- */

  var SKIP_TAGS = {
    SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1,
    CODE: 1, PRE: 1, KBD: 1, SAMP: 1, SVG: 1, CANVAS: 1, IFRAME: 1, HEAD: 1, TITLE: 1
  };

  // 整块跳过：聊天正文、牌表卡名、输入区、玩家自建内容
  var SKIP_SEL = [
    '[data-eszh-skip]',
    '[contenteditable=""]',
    '[contenteditable="true"]',
    '[class*="es-msg-line"]',
    '[class*="es-msg-t"]',
    '[class*="es-msg-time"]',
    '[class*="es-msg-who"]',
    '[class*="es-chat-sys"]',
    '[class*="es-chat-quick-note"]',
    '[class*="es-dl-name"]',
    '[data-card-name]',
    /* 卡面：名称 / 类型行 / 规则文本 / 风味文字 / 力量防御 —— 整块保持原文 */
    '[class*="es-ct-o"]',
    '[class*="es-ct-tl"]',
    '[class*="es-ct-na"]',
    '[class*="es-ct-fh"]',
    '[class*="es-ct-pt"]',
    '[class*="es-cb-pv"]',
    '[class*="es-cg-name"]',
    '[class*="es-cg-sub"]'
  ].join(',');

  function shouldSkip(el) {
    if (!el || el.nodeType !== 1) return false;
    if (SKIP_TAGS[el.tagName]) return true;
    if (el.isContentEditable) return true;
    try { if (el.closest && el.closest(SKIP_SEL)) return true; } catch (e) {}
    return false;
  }

  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];

  function trText(text) {
    var lead = /^\s*/.exec(text)[0];
    var trail = /\s*$/.exec(text)[0];
    var end = text.length - trail.length;
    var core = text.slice(lead.length, end > lead.length ? end : text.length);
    if (!core) return null;

    var out = lookup(core);
    if (out == null) out = applyRules(core);
    if (out == null || out === core) return null;
    // 中文标点前不留空格：片段译成「，用时」这类时，前面的空格要丢掉
    if (/^[\uff0c\u3002\u3001\uff1b\uff1a\uff01\uff1f\uff09\u3011\u300d\u300f]/.test(out)) lead = '';
    return lead + out + trail;
  }

  function walkTextNode(node) {
    var v = trText(node.nodeValue);
    if (v != null) node.nodeValue = v;
  }

  function walkAttrs(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      var v = el.getAttribute(a);
      if (!v) continue;
      var out = lookup(v);
      if (out == null) out = applyRules(v);
      if (out != null && out !== v) el.setAttribute(a, out);
    }
    if (el.tagName === 'INPUT' && el.value && /^(submit|button)$/i.test(el.type)) {
      var ov = lookup(el.value) || applyRules(el.value);
      if (ov && ov !== el.value) el.value = ov;
    }
  }

  var ATTR_SEL = '[placeholder],[title],[aria-label],[alt],input[value]';

  // 属性单独走一遍：输入框的文本虽然跳过，但 placeholder 必须翻
  function attrPass(root) {
    if (root.nodeType === 1 && !/^(SCRIPT|STYLE|HEAD|TITLE)$/.test(root.tagName)) walkAttrs(root);
    if (!root.querySelectorAll) return;
    var list;
    try { list = root.querySelectorAll(ATTR_SEL); } catch (e) { return; }
    for (var i = 0; i < list.length; i++) walkAttrs(list[i]);
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      if (!shouldSkip(root.parentNode)) walkTextNode(root);
      return;
    }
    if (root.nodeType !== 1) return;

    attrPass(root);
    cardPass(root);
    if (shouldSkip(root)) return;

    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return shouldSkip(n.parentNode) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = tw.nextNode())) walkTextNode(n);
  }

  /* ---------------------------- 观察器 ------------------------------ */

  var pending = [];
  var pendingSet = new Set();
  var scheduled = false;

  function syncTitle() {
    var t = document.title;
    if (!t) return;
    var out = lookup(t) || applyRules(t);
    if (out && out !== t) document.title = out;
  }

  function flush() {
    scheduled = false;
    syncTitle();
    var list = pending;
    pending = [];
    pendingSet = new Set();
    for (var i = 0; i < list.length; i++) {
      var n = list[i];
      if (!n.isConnected) continue;
      if (n.nodeType === 3) {
        if (!shouldSkip(n.parentNode)) walkTextNode(n);
      } else {
        walk(n);
      }
    }
  }

  function schedule(n) {
    if (pendingSet.has(n)) return;
    pendingSet.add(n);
    pending.push(n);
    if (scheduled) return;
    scheduled = true;
    if (window.requestAnimationFrame) requestAnimationFrame(flush);
    else setTimeout(flush, 16);
  }

  var observer = null;

  function onMutations(muts) {
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'characterData') {
        if (m.target.parentNode && !shouldSkip(m.target.parentNode)) schedule(m.target);
      } else if (m.type === 'attributes') {
        // 输入框也要翻 placeholder，所以这里不能用 shouldSkip 拦
        if (m.target) schedule(m.target);
      } else {
        for (var j = 0; j < m.addedNodes.length; j++) {
          var n = m.addedNodes[j];
          if (n.nodeType === 1 || n.nodeType === 3) schedule(n);
        }
      }
    }
  }

  function start() {
    if (observer) return;
    observer = new MutationObserver(onMutations);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS.concat(['value'])
    });
    if (document.body) walk(document.body);
    syncTitle();
  }

  function stop() {
    if (observer) { observer.disconnect(); observer = null; }
  }

  /* ----------------------------- 角标 ------------------------------- */

  var pill = null;

  function makePill() {
    if (pill) {
      if (pill.parentNode) pill.parentNode.removeChild(pill);
      pill = null;
      return;
    }
    if (!document.body) return;
    pill = document.createElement('button');
    pill.type = 'button';
    pill.setAttribute('data-eszh-skip', '');
    pill.textContent = enabled ? '\u4e2d\u6587' : 'EN';
    pill.style.cssText = [
      'position:fixed', 'right:14px', 'bottom:14px', 'z-index:2147483000',
      'padding:6px 12px', 'border-radius:999px', 'cursor:pointer',
      'font:600 12px/1.4 system-ui,sans-serif',
      'border:1px solid rgba(200,170,90,.55)', 'color:#f0e6cf',
      'background:rgba(20,16,12,.82)', 'backdrop-filter:blur(6px)',
      'box-shadow:0 4px 14px rgba(0,0,0,.45)'
    ].join(';');
    pill.addEventListener('click', toggle);
    document.body.appendChild(pill);
  }

  function toggle() {
    enabled = !enabled;
    writeStore(STORE_KEY, enabled ? '1' : '0');
    if (pill) pill.textContent = enabled ? '\u4e2d\u6587' : 'EN';
    if (enabled) {
      start();
      if (document.body) walk(document.body);
    } else {
      stop();
      if (confirm('\u5df2\u6682\u505c\u6c49\u5316\u3002\u91cd\u65b0\u52a0\u8f7d\u9875\u9762\u4ee5\u8fd8\u539f\u82f1\u6587\u754c\u9762\uff1f')) {
        location.reload();
      } else {
        enabled = true;
        writeStore(STORE_KEY, '1');
        start();
      }
    }
  }

  /* ----------------------------- 启动 ------------------------------- */

  function boot() {
    try { document.documentElement.lang = 'zh-CN'; } catch (e) {}
    if (enabled) start();
    if (String(readStore(BTN_KEY, '0')) === '1') makePill();

    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('\u5207\u6362\u4e2d\u6587 / English', toggle);
      GM_registerMenuCommand('\u91cd\u65b0\u5e94\u7528\u6c49\u5316', function () {
        if (document.body) walk(document.body);
      });
      GM_registerMenuCommand('\u663e\u793a / \u9690\u85cf\u89d2\u6807', function () {
        writeStore(BTN_KEY, String(readStore(BTN_KEY, '0')) === '1' ? '0' : '1');
        makePill();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
