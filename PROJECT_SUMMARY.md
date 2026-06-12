# Fundraising Coach Reference Tool — Project Summary
# 募款教练参考工具 — 项目完整摘要

**生成时间 Generated:** 2026-06-12  
**用途 Purpose:** Agent handoff / verification document  
**仓库 Repository:** https://github.com/mrk-crypto/Fundrasing-Coach-Reference-Notes  
**部署地址 Deployed URL:** https://mrk-crypto.github.io/Fundrasing-Coach-Reference-Notes/

---

## 1. 项目概述 Project Overview

这是一个**单文件双语互动教练参考工具**，服务于 AFC（使者协会）的 DRC 教练计划。设计目标是让信心募款教练在会谈前、中、后都能快速找到正确的框架和提问。

A **single-file bilingual interactive coaching reference tool** for AFC (Ambassadors for Christ) DRC coaching program. Designed to help support-raising coaches find the right frameworks and questions before, during, and after coaching sessions.

**技术栈 Tech Stack:**
- 单 HTML 文件，无外部依赖（字体除外）
- 原生 JS（无框架）
- CSS 自定义属性（design tokens）
- localStorage 持久化
- PWA（Progressive Web App）支持

---

## 2. 文件清单 File Inventory

| 文件 | 大小 | 用途 |
|------|------|------|
| `index.html` | ~172KB / ~3,223 行 | 主工具文件，包含所有内容和逻辑 |
| `manifest.json` | 557 bytes | PWA 应用清单 |
| `service-worker.js` | ~1.5KB | 离线缓存服务工作者 |
| `icon.svg` | ~1KB | 应用图标（4个D-level颜色点） |

---

## 3. 功能模块 Feature Modules（9个Tab）

### Tab 1: Overview 总览
- D1–D4 发展阶段卡片（可展开）
- 每张卡片含：可能说的话、需要什么、教练姿态
- 颜色系统：D1橙 / D2蓝 / D3绿 / D4紫

### Tab 2: Behaviors 行为
- 两种行为对比：Directive（指导性）vs Supportive（支持性）
- DAC 框架：Diagnose → Adapt → Communicate

### Tab 3: GROW Model ★
**主要升级模块。** 核心功能：
- G/R/O/W 四阶段步骤选择器
- D-level 筛选栏（All / D1 / D2 / D3 / D4）
- 每个GROW阶段 × 每个D-level = 3-4个双语提问
- 点击提问 → 复制到剪贴板（含中英文）
- 每阶段含教练提示（Coach Tip）

**提问总数：** ~48个双语提问

### Tab 4: Matching 配对
- D-level ↔ S-level 配对表（简洁参考）

### Tab 5: Application 应用
- 信心募款情境应用表（8种场景，含华人文化特有场景）
- 教练观察快速清单（10项，可勾选）

### Tab 6: Diagnose 诊断 ★
**互动诊断工具。** 核心功能：
- 两轴输入：能力（C1-C4）× 委身/动力（M1-M4）
- 4×4 = 16种组合映射表
- 边界情况附黄色提示说明
- 结果显示：D-level + 推荐S-level + 典型话语
- 跳转按钮：→ GROW提问（带D-level筛选）/ → Overview详情

**诊断逻辑：**
```
C1-M1 → D1    C1-M2 → D2    C1-M3 → D2    C1-M4 → D1*
C2-M1 → D1*   C2-M2 → D2    C2-M3 → D2    C2-M4 → D3*
C3-M1 → D3*   C3-M2 → D3    C3-M3 → D3    C3-M4 → D4*
C4-M1 → D4    C4-M2 → D3    C4-M3 → D3*   C4-M4 → D4
（* = 含边界提示）
```

### Tab 7: Barriers 障碍 ★
**心理障碍识别模块。** 核心功能：
- 13个信号短语快速识别栏（点击 → 展开对应障碍卡片）
- 5种障碍类型（手风琴卡片）：
  1. 🟠 身份认同障碍（D2/D3）— "感觉在要钱"
  2. 🌸 关系障碍（D3/D2）— "怕伤害关系"
  3. 🟣 神学/使命障碍（D2）— "不确定呼召"
  4. 🔵 技能/实践障碍（D1）— "不知道怎么开口"
  5. ⚫ 过去经历障碍（D2/D3）— "被拒绝很受伤"
- 每种障碍：观察信号 / 根本原因 / 重新框架 / 3个双语教练提问（可复制）

### Tab 8: Theology 神学
**神学框架模块。**
- 核心宣言：募款不是要钱，是邀请
- 三根支柱（手风琴）：
  1. 使命属于神，工人是管家（对应障碍：身份、神学）
  2. 邀请是礼物，不是负担（对应障碍：身份、关系）
  3. 差遣与被差遣都是使命的一部分（对应障碍：关系、神学）
- 5处核心经文（腓4:15-17 / 路10:7 / 罗10:14-15 / 腓4:19 / 林后9:6-7）
- 神学→教练语言转译表（6行）

### Tab 9: Session 会谈
**10步会谈陪伴流程。** 核心功能：
- 纵向 Stepper（灰→深色→绿色✓）
- 进度条（0/10 → 10/10）
- **步骤结构：**
  1. 连接 Connection — 开场提问 × 3
  2. 目标 Goal (G) — GROW G提问 × 3
  3. 现实 Reality (R) — GROW R提问 × 4
  4. 诊断 Diagnose — D1/D2/D3/D4 选择按钮 → 触发第5-7步动态适配
  5. 调整 Adapt (S) — **动态**：自动显示对应S-level风格
  6. 选择 Options (O) — **动态**：自动切换D-level提问
  7. 下一步 Way Forward (W) — **动态**提问 + What/When/Who三个输入框
  8. 跟进 Follow-Up — 提问 + 下次会谈日期字段
  9. 祷告 Prayer — 祷告提示 × 2
  10. 教练反思 Coach Reflection — 迷你清单（5项）+ 反思提问 × 3
- **复制笔记**：生成格式化会谈记录（含日期、D-level、全部步骤笔记）
- **重置**：清空所有内容
- **localStorage持久化**：笔记自动保存，刷新后恢复，显示"✓ 已保存" / "X分钟前保存"

---

## 4. 神学核心框架 Theological Framework

募款的核心重构：
- **不是**：要钱 / 乞讨 / 麻烦别人
- **而是**：邀请别人参与神的使命

三大支柱：
1. 使命属于神（Luke 10:2, 10:7）
2. 邀请是礼物（Phil 4:17）
3. 差遣神学（Rom 10:14-15）

---

## 5. 教练框架 Coaching Frameworks

**Situational Leadership II (SLII):**
- D1 Enthusiastic Beginner → S1 Telling/Directing
- D2 Disillusioned Learner → S2 Selling/Coaching
- D3 Capable but Cautious → S3 Participating/Supporting
- D4 Self-Reliant Achiever → S4 Delegating

**GROW Model:** Goal → Reality → Options → Way Forward

**DAC:** Diagnose → Adapt → Communicate

---

## 6. 设计系统 Design System

**颜色 Color Tokens:**
```css
--c-d1: #E85D24  /* D1 橙 */
--c-d2: #3B8BD4  /* D2 蓝 */
--c-d3: #1D9E75  /* D3 绿 */
--c-d4: #7F77DD  /* D4 紫 */
--bg:   #FAFAF8  /* 暖米色背景 */
--text: #1A1A18  /* 深色文字 */
```

**字体 Fonts:** DM Sans + Noto Sans SC + DM Mono（Google Fonts）

**圆角 Radius:** 12px（卡片）/ 8px（小元素）

---

## 7. PWA 配置 PWA Configuration

**manifest.json 关键字段：**
- `display: standalone` → 全屏App模式
- `theme_color: #1A1A18` → 状态栏颜色
- `start_url: ./` → 相对路径（适配GitHub Pages子路径）

**service-worker.js 策略：**
- Cache-first（先走缓存，后台更新）
- 离线回退到 `./`（主页）
- 版本控制：`coach-ref-v1`

**安装方式：**
- iOS Safari：分享 → 加入主画面
- Android Chrome：顶部横幅 / 菜单 → 安装应用

---

## 8. localStorage 实现 Persistence Implementation

**键名：** `coach-tool-session-v1` (修正前可能为 `coach_ref_session_v1`)

**保存内容：**
```json
{
  "notes": {"1": "...", "2": "...", ...},
  "diagLevel": 2,
  "doneSteps": [1, 2, 3],
  "wfWhat": "具体行动",
  "wfWhen": "时间",
  "wfWho": "问责人",
  "fuDate": "下次会谈",
  "savedAt": "ISO timestamp"
}
```

**触发保存：** 所有 `.ss-note` textarea 的 `input` 事件 + D-level 选择 + 步骤完成

**注意：** localStorage 键名在多次迭代中可能有 `LS_KEY` 和 `SESS_KEY` 两个变量。需检查文件中实际使用的键名是否一致。

---

## 9. 已知待核实项 Known Items to Verify

1. **localStorage 键名一致性**：检查 `saveSession()` 和 `loadSession()` 使用的是 `LS_KEY` 还是 `SESS_KEY`，确保读写用同一个键。
2. **Service Worker 路径**：`service-worker.js` 注册时用 `./service-worker.js`，需确认与实际文件路径匹配。
3. **Manifest 图标**：`icon.svg` 使用 `"sizes": "any"`，需在实际设备上测试显示效果。
4. **CDN 传播**：截至生成本文档时，GitHub Pages CDN 仍在传播新版本。用户在设备上看到旧版本（5个tab），属正常现象，无需修改文件。
5. **GROW 动态渲染**：GROW 提问通过 `renderGrow()` 动态渲染到 `#grow-detail`，不在静态 HTML 中。检查时需运行 JS 后查看。

---

## 10. 迭代历史 Iteration History

| 迭代 | 内容 |
|------|------|
| 1 | GROW 模型深度扩展 + D-level 提问库（~48个提问）|
| 2 | 诊断工具 Diagnose（4×4矩阵）+ 跨Tab跳转 |
| 3 | 心理障碍识别 Barriers（5种障碍 + 信号短语）|
| 4 | 神学框架 Theology（3支柱 + 5经文 + 转译表）|
| 5 | 10步会谈陪伴 Session（动态适配 + 笔记导出）|
| 6 | PWA 支持 + localStorage 持久化 |

---

## 11. 上下文背景 Context

**使用者：** Jing Chen，AFC DRC 教练计划负责人  
**服务对象：** 华人事工工作者（需要信心募款的同工）  
**语言：** 中英双语（中文主要，英文辅助）  
**核心挑战：** 华人文化对募款的心理障碍（面子/人情/自力更生）  
**教练模型：** SLII（Situational Leadership II）+ GROW
