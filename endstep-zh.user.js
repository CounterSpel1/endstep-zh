// ==UserScript==
// @name         Endstep 汉化
// @name:en      Endstep Chinese Localization
// @namespace    https://endstep.cc/
// @version      1.2.0
// @description  把 endstep.cc 的界面与卡面文字汉化为简体中文
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

  try { window.__eszhVer = '1.2.0'; } catch (e) {}

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
      zflavor: obj.zhs_flavor_text || obj.atomic_translated_flavor_text || ''
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

  // 按页面上的类型行挑出「当前这一面」
  function pickFace(faces, typeText, nameText) {
    if (!faces || !faces.length) return null;
    if (faces.length === 1) return faces[0];
    var want = normType(typeText);
    if (want) {
      for (var i = 0; i < faces.length; i++) {
        if (normType(faces[i].type) === want && faces[i].zh) return faces[i];
      }
    }
    var title = String(nameText || '').trim().toLowerCase();
    if (title) {
      for (var j = 0; j < faces.length; j++) {
        if ((faces[j].en || '').toLowerCase() === title && faces[j].zh) return faces[j];
      }
    }
    for (var k = 0; k < faces.length; k++) if (faces[k].zh) return faces[k];
    return faces[0];
  }

  // 接口偶尔把换行转义成字面量「\n」（两个字符），且个别卡把 {T} 存成 ocT
  function fixText(t) {
    return String(t == null ? '' : t)
      .replace(/\\r\\n|\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/\\t/g, ' ')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\boc([A-Z0-9])\b/g, '{$1}');
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
    var parts = raw.split('/');
    var head = (parts[0] || '').toUpperCase();
    var pair = null;
    if (parts.length === 2) {
      var c = MS_COLOR[head] || MS_COLOR.C;
      pair = [c[0], (MS_COLOR[(parts[1] || '').toUpperCase()] || MS_COLOR.C)[0]];
    }
    var col = pair || MS_COLOR[head] || MS_COLOR.C;
    var label = raw.toUpperCase().replace(/\//g, '');

    var el = document.createElement('span');
    el.className = 'eszh-ms';
    el.textContent = label;
    el.setAttribute('aria-label', '{' + raw + '}');
    el.style.cssText =
      'display:inline-flex;align-items:center;justify-content:center;' +
      'min-width:1.2em;height:1.2em;padding:0 .18em;box-sizing:border-box;' +
      'border-radius:50%;font-size:.8em;font-weight:700;line-height:1;' +
      'vertical-align:-.14em;margin:0 .1em;letter-spacing:-.02em;' +
      (pair
        ? 'background:linear-gradient(135deg,' + pair[0] + ' 50%,' + pair[1] + ' 50%);color:#2C2C2A;'
        : 'background:' + col[0] + ';color:' + col[1] + ';') +
      'box-shadow:inset 0 0 0 1px rgba(0,0,0,.28)';
    return el;
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
      var f = pickFace(faces, tlEl && tlEl.textContent, nameEl.textContent);
      if (!f || !f.zh) return;
      if (nameEl.parentNode) nameEl.textContent = f.zh;
      if (tlEl && f.ztype) tlEl.textContent = f.ztype;
      if (oeEl && f.ztext) setRichText(oeEl, f.ztext);
      var fhs = box.querySelectorAll('[class*="es-ct-fh"]');
      if (fhs.length > 1 && f.zflavor) fhs[fhs.length - 1].textContent = f.zflavor;
    });
  }

  /* ---- 结构启发：不认类名，靠「类型行」这个排版特征定位卡面 ---- */

  var TYPE_RE = /^(?:(?:Basic|Snow|Legendary|World|Ongoing|Elite|Host|Token)\s+)*(Instant|Sorcery|Enchantment|Artifact|Creature|Land|Planeswalker|Battle|Tribal|Conspiracy|Scheme|Vanguard|Phenomenon|Plane|Dungeon)\b/i;
  var CARD_SEEN = typeof WeakSet === 'function' ? new WeakSet() : null;

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
      if (CARD_SEEN && CARD_SEEN.has(box)) continue;

      var inner = [];
      textNodesIn(box, inner, 60);
      var idx = inner.indexOf(tn);
      if (idx <= 0) continue;

      var nameNode = null;
      for (var k = idx - 1; k >= 0; k--) {
        var t = inner[k].nodeValue.trim();
        if (t.length && t.length <= 80 && /[A-Za-z]{2}/.test(t) && !/^\{|^\d+\s*\/\s*\d+$/.test(t)) {
          nameNode = inner[k];
          break;
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

      if (CARD_SEEN) CARD_SEEN.add(box);
      box.setAttribute(CARD_MARK, '1');

      (function (bz, nn, tl, oe) {
        var key = (nn.nodeValue || '').trim();
        var typeTxt = (tl.nodeValue || '').trim();
        cardZh(key).then(function (faces) {
          if (!faces) return;
          var f = pickFace(faces, typeTxt, nn.nodeValue);
          if (!f || !f.zh) return;
          nn.nodeValue = f.zh;
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
