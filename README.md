# Endstep 汉化

把 [endstep.cc](https://endstep.cc)（浏览器端万智牌对战平台）的界面换成简体中文的油猴脚本。

界面文案、赛制名、阶段栏、对局提示、个人主页，以及**卡牌的名称、类型、规则文本、风味文字**都会显示为中文。

## 效果

| 位置 | 原文 | 汉化后 |
| --- | --- | --- |
| 阶段栏 | `Upkeep` / `End Step` | 维持 / 结束 |
| 开局提示 | `You have won the coin toss, User. Would you like to play or draw?` | 你掷硬币赢了，User。你想先手还是后手？ |
| 悬停说明 | `Auto-pass priority to the end step of the turn right before yours. (B, Esc to cancel)` | 自动让过优先权，直到你回合之前的那个结束阶段（你重置前的最后一个窗口）。（B，Esc 取消） |
| 卡面 | `Llanowar Elves / Creature — Elf Druid / {T}: Add {G}.` | 罗堰妖精 / 生物～妖精／德鲁伊 / {T}：加{G}。 |
| 赛制 | `Modern` / `Pauper` | 摩登 / 纯铁 |

法术力符号（`{T}`、`{G}`）在卡面上仍显示为原图形，不会变成字母。

## 安装

1. 浏览器安装 **Tampermonkey**（Chrome / Edge / Firefox 均有官方扩展）
2. 打开本仓库的 `endstep-zh.user.js`，点右上角 **Raw**，Tampermonkey 会弹出安装页
3. 点「安装」；弹出跨域请求提示时**请允许**（用于查询中文卡牌数据）
4. 打开 endstep.cc，刷新一次

装好后可以在 Tampermonkey 面板查看版本号，用来确认是否装上了最新版。

## 常见问题

**卡面还是英文？**

首次查看某张牌需要联网查询，约 0.2 秒，之后会缓存。若始终不生效：

- 确认 Tampermonkey 里脚本版本号是最新版
- 在网址后面加 `#eszh-debug` 打开自检浮层，会显示「卡面容器 / 类型行命中 / 查询成功」的计数

**会不会影响搜索或复制牌表？**

不会。牌表里的卡名、聊天内容、输入框都保持英文原样——搜索和导出依赖英文名。

**数据存在哪？**

查过的卡面缓存在浏览器本地（`localStorage`，键前缀 `eszh:card2:`）。清除站点数据后会重新下载。

## 工作原理

- **界面文案**：内置约 4100 条词表 + 350 条句式规则（处理带玩家名、数字、阶段名的句子），只替换页面文本，不改站点代码、不注入请求。
- **卡面文字**：卡牌数据不属于界面文案，改为按需查询中文卡库（[mtgch.com](https://mtgch.com) 优先，[Scryfall](https://scryfall.com) 中文印刷版兜底）。

## 数据来源与致谢

- 中文卡牌数据来自 **[大学院废墟 mtgch.com](https://mtgch.com)** 与 **[Scryfall](https://scryfall.com)**
- 万智牌相关名称与牌面文字版权归 Wizards of the Coast 所有
- 本项目仅替换界面显示，不提供、不托管任何卡牌数据

## 许可

脚本本身以 [MIT](LICENSE) 许可发布。第三方数据（卡牌中文文本）不在此许可范围内。

## 免责

非官方项目，与 Endstep、Wizards of the Coast 均无关联。使用第三方脚本存在风险，请自行判断；因使用造成的账号或数据问题由使用者承担。
