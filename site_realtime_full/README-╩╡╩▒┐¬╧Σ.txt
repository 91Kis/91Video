
# 实时评论 & 聊天（开箱即用）

本包支持两种模式：
- **DEMO 模式（默认）**：零配置，本地多标签页实时（BroadcastChannel）。
- **FIREBASE 模式**：改 `MODE='FIREBASE'` 并填入你的 Firebase 配置，获得跨设备实时。

## 已实现
- **评论区**（`detail.html` 注入）：实时、回复、**仅作者可删除**。
- **消息页**（`messages.html`）：
  - 6 位 ID 加好友 → 展示简介 → 发送申请
  - 新建群聊（≥3）
  - 新建私聊（输入对方 UID）
  - 私聊 & 群聊发送消息、**消息撤回**
  - 群主：公告 / 邀请 / 拉黑 / 禁言 / 踢出 / 设管理员（≤3） / 解散群
  - 管理员：公告 / 邀请 / 拉黑 / 禁言 / 踢出
  - 任意成员：退出群聊
  - 纯黑背景、白字，所有主要按钮 `#ff9900`，标题下有“返回首页”

## 切换到 Firebase（跨设备）
1. Firebase 控制台启用 **Authentication → Anonymous**；启用 **Firestore**。
2. Firestore 规则粘贴 `firestore.rules.txt` 内容并发布。
3. 在 `singlefile_build/messages.html` 与 `singlefile_build/detail.html` 顶部脚本中：
   ```js
   const MODE = 'FIREBASE'
   const FIREBASE_CONFIG = { apiKey:'...', authDomain:'...', projectId:'...', ... }
   ```
4. 部署站点，多设备实时生效。

建议：如需账号体系（邮箱/手机），把 `signInAnonymously` 换成你的登录方式即可。
