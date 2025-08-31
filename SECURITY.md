# Security Policy · 91Video

**Maintainers:** 91Kis & 91YuchengH

## Supported Versions
We accept vulnerability reports for:
- The latest `main` branch of this repository.
- The currently deployed site (GitHub Pages).

---

## Reporting a Vulnerability
**Please DO NOT open public issues or pull requests.**

Preferred channel: **GitHub Private Vulnerability Reporting**  
Open the repository → **Security** → **Report a vulnerability**.

If GitHub reporting is unavailable, you may email the maintainers.
- Email: <Video91_official@hotmail.com>

**Please include:**
- A clear, reproducible description and impact
- A proof-of-concept (PoC) or step-by-step reproduction
- Affected URL(s), commit hash or version
- Environment (browser, OS) and any logs/screen recordings
- Your contact info for coordination

**Our commitment:**
- Acknowledge within **72 hours**
- Triage within **7 days**
- Status updates at least **every 7 days** until resolution
- Credit the reporter in release notes (unless you prefer to remain anonymous)

---

## Coordinated Disclosure
- Please allow us reasonable time to investigate and release a fix before any public disclosure.
- Do not test against real users’ data; use your own accounts only.

---

## Safe Harbor (Good-Faith Research)
We will not pursue legal action for good-faith, non-destructive research that:
- Avoids privacy violations, data exfiltration, service disruption (DoS), or social engineering
- Respects rate limits and only uses test data/accounts
- Stops immediately if sensitive data is encountered and reports it to us

---

## Out of Scope (Examples)
- Self-XSS that requires pasting code into the console
- Clickjacking on pages without sensitive actions
- Lack of rate limiting without demonstrable impact
- Vulnerabilities requiring already-compromised devices or accounts

---

## Bounties
This project **does not currently offer monetary bug bounties**. We are happy to provide public or private thanks.

---

# 安全策略（中文）

**维护者：** 91Kis & 91YuchengH

## 覆盖范围
接受以下范围的漏洞报告：
- 本仓库 `main` 分支的最新代码
- 当前线上部署（GitHub Pages）页面

## 如何报告漏洞
**请不要建立公开 Issue 或 PR。**

首选渠道：**GitHub 私密漏洞上报**  
在仓库页面进入 **Security → Report a vulnerability**。

若该渠道不可用，可邮件联系维护者:
- 邮箱：<Video91_official@hotmail.com>

**请尽量提供：**
- 清晰的复现步骤与影响描述
- PoC 或者操作步骤
- 受影响的 URL、提交哈希或版本
- 复现环境（浏览器/系统）与日志/录屏
- 你的联系方式以便沟通

**我们的承诺：**
- **72 小时**内确认收到  
- **7 天**内分级与初步结论  
- 修复前每 **7 天**至少一次状态更新  
- 修复后在发布说明中感谢报告者（如你不希望署名可告知）

## 协同披露
- 请在我们修复前暂缓公开披露
- 仅在自有账号/测试数据上测试，勿触碰真实用户数据

## 安全港（善意研究）
对善意、非破坏性测试不采取法律行动，前提：
- 不进行隐私数据读取/外传、不进行 DoS、不进行社工
- 遵守速率限制，仅使用测试数据/账号
- 若意外接触敏感数据，应立即停止并报告

## 不在范围（示例）
- 需要用户自行在控制台粘贴代码的 Self-XSS
- 无敏感操作页面的点击劫持
- 无实质影响的限流类问题
- 仅在已被攻陷设备/账号条件下才能实现的漏洞

## 赏金
目前**不提供现金赏金**；欢迎接受公开/私下致谢。
