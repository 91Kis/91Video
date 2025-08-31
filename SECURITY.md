# Security Policy · 91Video

**Maintainers:** 91Kis & 91YuchengH  
**Contact:** <Video91_official@hotmail.com>

## Supported Versions
We accept vulnerability reports for:
- The latest `main` branch of this repository.
- The currently deployed site (GitHub Pages).

## Scope
In scope:
- This repository’s code and configurations
- The deployed site at `https://91kis.github.io/91Video/` and subpaths

Out of scope (examples):
- Third-party platforms or infrastructure (e.g., GitHub, Firebase) unless the issue arises from our misuse
- Social engineering, physical attacks, account brute-forcing, spam or volumetric DoS
- Findings that require compromised devices/accounts or user-installed malware

## Reporting a Vulnerability
**Please DO NOT open public issues or pull requests.**

Preferred channel: **GitHub Private Vulnerability Reporting**  
Open the repository → **Security** → **Report a vulnerability**.

If GitHub reporting is unavailable, email us at <Video91_official@hotmail.com>.

Please include:
- Clear, reproducible description and impact
- PoC or step-by-step reproduction
- Affected URL(s), commit hash or version
- Environment (browser, OS) and any logs/screen recordings
- Your contact info for coordination

## Handling & Timelines
- **Acknowledgment:** within **72 hours**
- **Initial triage & severity (CVSS v3.1 as reference):** within **7 days**
- **Status updates:** at least **every 7 days** until resolution
- **Target remediation:** up to **90 days** for High/Critical (expedited when feasible)
- We credit the reporter in release notes (unless anonymity is requested).  
  For duplicate reports, credit goes to the first verifiable submission.

## Coordinated Disclosure
- Please allow us time to investigate and release a fix before public disclosure.
- Do not test against real users’ data; use your own test accounts only.

## Safe Harbor (Good-Faith Research)
We will not pursue legal action for good-faith, non-destructive research that:
- Avoids privacy violations, data exfiltration, service disruption (DoS), or social engineering
- Respects rate limits and uses test data/accounts only
- Stops immediately if sensitive data is encountered and reports it to us

## Out of Scope (Examples)
- Self-XSS requiring user to paste code into the console
- Clickjacking on pages without sensitive actions
- Lack of rate limiting without demonstrable impact
- Vulnerabilities requiring already-compromised devices or accounts

## Bounties
This project **does not currently offer monetary bug bounties**. We are happy to provide public or private thanks.

---

# 安全策略（中文）

**维护者：** 91Kis & 91YuchengH  
**联系邮箱：** <Video91_official@hotmail.com>

## 覆盖范围
接受以下范围的漏洞报告：
- 本仓库 `main` 分支的最新代码
- 部署在 `https://91kis.github.io/91Video/` 的线上页面

不在范围（示例）：
- 第三方平台/基础设施本身的问题（如 GitHub、Firebase），除非因我们配置不当造成影响
- 社工、物理攻击、暴力破解、垃圾信息或大流量 DoS
- 需要已被攻陷的设备/账号或用户安装恶意软件才能实现的漏洞

## 报告方式
**请不要建立公开 Issue 或 PR。**

首选：**GitHub 私密漏洞上报**（仓库 → **Security → Report a vulnerability**）。  
若不可用，可发邮件至 <Video91_official@hotmail.com>。

请尽量提供：
- 清晰复现步骤与影响说明
- PoC 或者操作步骤
- 受影响的 URL、提交哈希或版本
- 复现环境（浏览器/系统）与日志/录屏
- 你的联系方式以便沟通

## 处理与时限
- **72 小时内**确认收到  
- **7 天内**完成初步分级与定级（参考 **CVSS v3.1**）  
- 修复前每 **7 天**至少一次状态更新  
- **目标修复时限：** 高/危急级不超过 **90 天**（可加速）  
- 我们会在发布说明中感谢报告者（如不希望署名可告知）；重复报告按先到原则致谢。

## 协同披露
- 在我们修复前请暂缓公开披露  
- 仅在自有账号/测试数据上测试，勿触碰真实用户数据

## 安全港（善意研究）
对善意、非破坏性测试不采取法律行动，前提：
- 不进行隐私数据读取/外传、不进行 DoS、不进行社工
- 遵守速率限制，仅使用测试数据/账号
- 若意外接触到敏感数据，应立即停止并报告

## 不在范围（示例）
- 需要用户自行在控制台粘贴代码的 Self-XSS
- 无敏感操作页面的点击劫持
- 无实质影响的限流类问题
- 仅在已被攻陷设备/账号条件下才能实现的漏洞

## 赏金
目前**不提供现金赏金**；欢迎接受公开/私下致谢。
