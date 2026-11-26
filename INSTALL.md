# 安装

## 一键安装

浏览器先装好 **Tampermonkey**（[Chrome](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) / [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) / [Firefox](https://addons.mozilla.org/firefox/addon/tampermonkey/)），然后点下面的链接：

**👉 [安装 Endstep 汉化](https://raw.githubusercontent.com/CounterSpel1/endstep-zh/main/endstep-zh.user.js)**

Tampermonkey 会自动识别 `.user.js` 并弹出安装页，点「安装」即可。

国内网络访问 raw 地址较慢时，用 jsDelivr 镜像（有缓存，新版本可能延迟几小时）：

**👉 [从 jsDelivr 安装](https://cdn.jsdelivr.net/gh/CounterSpel1/endstep-zh@main/endstep-zh.user.js)**

## 安装时会遇到的两个提示

**1. 跨域请求授权**

会弹出「是否允许访问 mtgch.com」。**必须点允许**——卡牌中文数据来自这个接口，拒绝的话卡面不会翻译，界面文案照常。

**2. 已安装旧版本**

如果之前装过更低版本号的副本，Tampermonkey 会提示「已安装更新版本」并阻止安装。先到管理面板删掉旧的，再点上面的链接。

## 安装后

打开 [endstep.cc](https://endstep.cc)，刷新一次。界面文案、赛制名、阶段栏、对局提示应该都变成中文；悬停卡牌，卡面文字会显示中文（首次约 0.2 秒，之后走缓存）。

## 更新

脚本头部已声明 `@updateURL`，Tampermonkey 会定期检查。有新版本时浏览器扩展图标上会出现提示，点开确认更新即可。

想手动检查：Tampermonkey 面板 → 找到本脚本 → 「检查更新」。

## 卸载

Tampermonkey 面板 → 本脚本 → 删除。刷新页面即恢复原样，不会留下任何残留（缓存在 `localStorage`，键前缀 `eszh:`，清站点数据即可清除）。

## 出问题时

在网址后面加 `#eszh-debug`，页面左下角会出现自检浮窗，显示卡面识别的命中数。把这个浮窗截图发到仓库的 Issues 里，比描述现象有用得多。
