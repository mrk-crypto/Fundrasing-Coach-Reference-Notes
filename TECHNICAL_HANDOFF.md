# Fundraising Coach Reference Tool — Technical Handoff Document
# 募款教练参考工具 — 技术接手文档

**Version 版本:** Post-PWA build (June 2026)  
**File under review 检查文件:** `index.html` (168KB / 3,223 lines)  
**Repo 仓库:** https://github.com/mrk-crypto/Fundrasing-Coach-Reference-Notes  
**Live URL 部署地址:** https://mrk-crypto.github.io/Fundrasing-Coach-Reference-Notes/

---

## 1. Architecture Overview 架构概述

### 1.1 Single-File Design Decision 单文件设计决策

**中文：** 整个工具是一个自包含的 HTML 文件，无构建工具、无框架、无外部 JS 依赖（字体从 Google Fonts 加载，但工具功能不依赖字体）。这个决策是刻意的：工具需要在不可靠网络环境下运行（教练会谈现场），需要可以直接通过 GitHub Pages 部署而无需 CI/CD 流水线，也需要让非技术用户能够直接上传替换文件。

**EN:** The entire tool is a self-contained HTML file with no build tools, no frameworks, and no external JS dependencies (fonts are loaded from Google Fonts, but tool functionality does not depend on them). This was an intentional decision: the tool needs to function in unreliable network environments (live coaching sessions), must deploy directly via GitHub Pages without a CI/CD pipeline, and must be updatable by a non-technical user through direct file upload.

### 1.2 Build Process 构建过程

**中文：** 工具通过迭代的 Python 字符串替换（`str.replace()`）构建，而非传统的 diff/patch 流程。每次功能迭代都在前一版本的 HTML 字符串上做精准插入。这意味着：(a) 没有 git history 可以追踪单个功能变更；(b) 文件中可能存在多次迭代遗留的冗余代码（见第5节已知问题）；(c) HTML 标签和 JS 括号平衡已通过 Python 验证（open=close for all tags, {225}={225}, (397)=(397)）。

**EN:** The tool was built through iterative Python string replacements (`str.replace()`), not traditional diff/patch. Each feature iteration performed targeted insertions into the previous HTML string. This means: (a) there is no git history tracking individual feature changes; (b) the file may contain residual code from multiple iterations (see Section 5, Known Issues); (c) HTML tag balance and JS brace balance have been verified via Python (all tags matched, {225}={225}, (397)=(397)).

---

## 2. File Inventory 文件清单

| File | Size | Role |
|------|------|------|
| `index.html` | 168KB / 3,223 lines | Entire tool — HTML + CSS + JS in one file |
| `manifest.json` | 557B | PWA app manifest |
| `service-worker.js` | ~1.5KB | Offline cache (cache-first strategy) |
| `icon.svg` | ~1KB | App icon (4 colored dots = D1–D4 levels) |

---

## 3. HTML / CSS Architecture CSS与HTML架构

### 3.1 Design Token System 设计系统

**中文：** 所有颜色和间距通过 `:root` CSS 自定义属性定义，共 16 个变量。颜色系统的核心是 4 个 D-level 颜色，全工具统一使用：

**EN:** All colors and spacing are defined via `:root` CSS custom properties — 16 variables total. The color system centers on 4 D-level colors used consistently throughout:

```css
:root {
  /* D-Level colors — used across ALL tabs */
  --c-d1: #E85D24;   /* D1 Orange    */
  --c-d2: #3B8BD4;   /* D2 Blue      */
  --c-d3: #1D9E75;   /* D3 Green     */
  --c-d4: #7F77DD;   /* D4 Purple    */

  /* Surfaces */
  --bg:   #FAFAF8;   /* Warm cream — main background    */
  --bg2:  #F2F0EC;   /* Slightly darker — panel bg      */
  --bg3:  #E8E5DF;   /* Darkest surface — hover states  */

  /* Text */
  --text:  #1A1A18;  /* Primary text / dark header bg   */
  --text2: #5A5A54;  /* Secondary / body text           */
  --text3: #9A9A90;  /* Tertiary / placeholder / hint   */

  /* Borders */
  --border:  rgba(0,0,0,0.10);
  --border2: rgba(0,0,0,0.18);

  /* Tokens */
  --radius:    12px;
  --radius-sm:  8px;
  --shadow:    0 2px 12px rgba(0,0,0,0.07);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.10);
}
```

### 3.2 Tab System 标签切换系统

**中文：** 9 个 tab 用 show/hide 实现，无路由、无 URL hash。所有 `.section` div 默认 `display:none`，通过 `showTab(name, btn)` 切换 `.active` 类（`display:block`）。每个 section 的 `id` 格式为 `tab-{name}`（例：`tab-session`）。两个 tab 按钮有命名 ID 供跨 tab 跳转使用：`id="btn-overview-tab"` 和 `id="btn-grow-tab"`。

**EN:** 9 tabs use show/hide, not routing or URL hashes. All `.section` divs are `display:none` by default; `showTab(name, btn)` toggles the `.active` class (`display:block`). Each section's `id` follows the pattern `tab-{name}` (e.g. `tab-session`). Two tab buttons have named IDs for programmatic cross-tab navigation: `id="btn-overview-tab"` and `id="btn-grow-tab"`.

```
Tabs in order:
  tab-overview | tab-behaviors | tab-grow | tab-matching
  tab-application | tab-diagnose | tab-barriers
  tab-theology | tab-session
```

### 3.3 Fonts 字体

**中文：** 从 Google Fonts 加载三种字体：`DM Sans`（主字体）、`Noto Sans SC`（中文）、`DM Mono`（代码/数字/标签）。字体加载失败时系统字体接管，功能不受影响。

**EN:** Three fonts loaded from Google Fonts: `DM Sans` (primary), `Noto Sans SC` (Chinese), `DM Mono` (code/numbers/labels). System fonts take over on failure; tool functionality is unaffected.

---

## 4. JavaScript Architecture JS架构

### 4.1 Script Structure Script结构

**中文：** 文件包含 3 个 `<script>` 块：
1. 主块（底部 body，~1,200行）：所有功能逻辑 + 数据 + 初始化
2. PWA 注册块：`navigator.serviceWorker.register('./service-worker.js')`
3. 无第三方库

**EN:** The file has 3 `<script>` blocks:
1. Main block (bottom of body, ~1,200 lines): all logic + data + initialization
2. PWA registration block: `navigator.serviceWorker.register('./service-worker.js')`
3. No third-party libraries

### 4.2 Function Inventory 函数清单 (26 total)

| Function | Tab | Purpose |
|----------|-----|---------|
| `showTab(name, btn)` | Global | Switch active tab |
| `showToast(msg)` | Global | Temporary copy confirmation message |
| `copyQ(el)` | GROW | Copy zh+en question pair to clipboard |
| `renderGrow()` | GROW | **Dynamic render** — builds Q-bank HTML from `growData` object |
| `showGrow(key)` | GROW | Switch G/R/O/W step + re-render |
| `setFilter(level, btn)` | GROW | Filter questions by D-level |
| `showDetail(id)` | Overview | Expand D-level detail panel |
| `closeDetail(id)` | Overview | Close detail panel |
| `updateCount()` | Application | Update checklist completion counter |
| `selectDiag(type, val, el)` | Diagnose | Select C or M axis value |
| `renderDiagResult()` | Diagnose | Compute D-level from C×M, render result |
| `jumpToGrow(dlevel)` | Diagnose | Switch to GROW tab + set D-level filter |
| `jumpToOverview(dlevel)` | Diagnose | Switch to Overview + open detail panel |
| `resetDiag()` | Diagnose | Clear diagnosis selections |
| `toggleBarrier(type)` | Barriers | Open/close barrier accordion card |
| `signalClick(chip, type)` | Barriers | Signal phrase → expand matching barrier |
| `togglePillar(num)` | Theology | Open/close pillar accordion card |
| `toggleSStep(num)` | Session | Open/close session step |
| `markDone(num)` | Session | Mark step complete + open next + autosave |
| `updateSessProgress()` | Session | Update progress bar (X/10) |
| `setSessLevel(level, btn)` | Session | Set D-level → dynamically update steps 5-7 |
| `copyPrompt(el)` | Session | Copy session prompt to clipboard |
| `copySessionNotes()` | Session | Generate formatted session notes text |
| `resetSession()` | Session | Clear all session state + localStorage |
| `saveSession()` | Session | Save all session state to localStorage |
| `loadSession()` | Session | Restore session state from localStorage |

### 4.3 Key Data Objects 关键数据对象

**中文：** 工具的所有内容（GROW 提问、D-level 信息、Session 适配内容）都存储在 JS 对象中，不在静态 HTML 里。这意味着静态 HTML 分析工具找不到这些内容——必须运行 JS 才能看到渲染结果。

**EN:** All tool content (GROW questions, D-level info, Session adaptive content) lives in JS objects, not in static HTML. This means static HTML analysis tools will not find this content — JS must execute for it to appear.

```javascript
// GROW Question Bank (~48 bilingual Q&A pairs)
growData = {
  g: { dqs: { 1:[...], 2:[...], 3:[...], 4:[...] } },
  r: { ... }, o: { ... }, w: { ... }
}

// Diagnosis mapping (16 entries, C1–C4 × M1–M4)
diagMap = {
  'C1-M1': { d:1, note:null },
  'C1-M2': { d:2, note:'...' },
  // ... 16 entries total
}

// Session adaptive content (per D-level)
adaptData   = { 1:{...}, 2:{...}, 3:{...}, 4:{...} }  // Coaching style for Step 5
sessOptionsQs = { 1:[...], 2:[...], 3:[...], 4:[...] } // Questions for Step 6
sessWFQs    = { 1:[...], 2:[...], 3:[...], 4:[...] }   // Questions for Step 7
```

### 4.4 Global State Variables 全局状态变量

```javascript
// GROW tab
var activeGrowKey = 'g';    // Current step: 'g'|'r'|'o'|'w'
var activeFilter  = 'all';  // D-level filter: 'all'|'1'|'2'|'3'|'4'

// Diagnose tab
var selC = null;   // Selected competence: 'C1'–'C4'
var selM = null;   // Selected motivation: 'M1'–'M4'

// Session tab
var sessLevel = null;  // Diagnosed D-level: 1|2|3|4|null
var sessDone  = {};    // Completed steps: { 1:true, 2:true, ... }
```

### 4.5 Initialization 初始化流程

**中文：** 初始化在底部 script 结尾，不使用 `DOMContentLoaded`（script 在 body 底部，DOM 已就绪）。

**EN:** Initialization at the end of the main script, no `DOMContentLoaded` needed (script is at bottom of body, DOM is ready).

```javascript
/* ── Init ── */
// 1. Attach autosave listeners to all session input fields
(function() {
  var ids = ['sn-1', ..., 'fu-date'];
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', saveSession);
  });
  setTimeout(loadSession, 80);  // 80ms delay ensures DOM fully painted
})();

// 2. Initialize GROW tab with 'G' step open
showGrow('g');
```

---

## 5. localStorage Implementation localStorage实现

### 5.1 Key and Structure 键名与数据结构

```javascript
var LS_KEY = 'coach_ref_session_v1';   // ← CANONICAL KEY 正确键名

// Payload structure stored:
{
  level: 2,                   // Diagnosed D-level (int or null)
  done:  { 1:true, 3:true },  // Completed step numbers
  notes: {                    // All input field values by element ID
    'sn-1': 'text...',        // Step textarea notes
    'wf-what': 'action...',   // Way Forward: What
    'wf-when': 'date...',     // Way Forward: When
    'wf-who':  'name...',     // Way Forward: Who
    'fu-date': 'date...'      // Follow-Up: Next session
  }
}
```

### 5.2 Save / Load / Reset Flow 存取流程

```
saveSession() ──► localStorage.setItem(LS_KEY, JSON.stringify(payload))
                  ► Shows '✓ 已保存' indicator for 1.8s

loadSession()  ──► localStorage.getItem(LS_KEY)
                  ► Restores notes (Object.keys loop)
                  ► Restores done steps (classList + sessDone)
                  ► Restores D-level (calls setSessLevel())
                  ► Shows toast if steps were restored

resetSession() ──► [LINE 3101] localStorage.removeItem(SESS_KEY)  ← FAILS SILENTLY*
                  ► Clears UI state (sessLevel, sessDone, all inputs)
                  ► [LINE 3121] localStorage.removeItem(LS_KEY)   ← SUCCEEDS ✓
```

### ⚠️ 5.3 Known Code Issue: Stale SESS_KEY Reference 已知代码问题

**中文：** `resetSession()` 函数体内有两行 `localStorage.removeItem`：
- 第一行（Line 3101）：`localStorage.removeItem(SESS_KEY)` — `SESS_KEY` 变量从未定义，抛出 `ReferenceError`，被 `try-catch` 静默吞掉
- 第二行（Line 3121）：`localStorage.removeItem(LS_KEY)` — `LS_KEY = 'coach_ref_session_v1'`，正确执行

**功能上不是 bug**：LS_KEY 那行确保了 localStorage 被正确清除。但这是多次迭代清理不完全留下的代码噪声，应在下次迭代时删除 Line 3101。

**EN:** `resetSession()` has two `localStorage.removeItem` calls:
- Line 3101: `localStorage.removeItem(SESS_KEY)` — `SESS_KEY` is never defined, throws `ReferenceError`, silently caught by try-catch
- Line 3121: `localStorage.removeItem(LS_KEY)` — `LS_KEY = 'coach_ref_session_v1'`, executes correctly

**Not a functional bug**: the LS_KEY line ensures localStorage is correctly cleared. But this is residual noise from incomplete cleanup across iterations — Line 3101 should be removed in the next iteration.

**Fix (one line):**
```javascript
// DELETE this line from resetSession():
try { localStorage.removeItem(SESS_KEY); } catch(e) {}
```

---

## 6. PWA Implementation PWA实现

### 6.1 manifest.json

```json
{
  "name": "Fundraising Coach Reference 募款教练参考工具",
  "short_name": "Coach Ref",
  "start_url": "./",           // Relative — works on any GitHub Pages base path
  "scope": "./",
  "display": "standalone",    // Hides browser chrome when installed
  "theme_color": "#1A1A18",   // Matches --text CSS variable (dark header)
  "background_color": "#FAFAF8" // Matches --bg CSS variable
}
```

### 6.2 service-worker.js Strategy 缓存策略

**中文：** 使用 **Cache-First with Background Update** 策略：
1. 有缓存 → 立即从缓存返回，同时后台更新
2. 无缓存 → 网络请求，缓存响应
3. 网络失败 → 回退到根路径 `./`（即 index.html）

缓存键名：`coach-ref-v1`（更新工具时需要递增版本号触发缓存刷新）

**EN:** Uses **Cache-First with Background Update** strategy:
1. Cache hit → serve immediately from cache, update in background
2. Cache miss → fetch from network, cache the response
3. Network failure → fall back to `./` (index.html)

Cache name: `coach-ref-v1` (increment version to force cache refresh on tool updates)

### 6.3 iOS-Specific Meta Tags iOS专属标签

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Coach Ref">
<link rel="apple-touch-icon" href="icon.svg">
```

**중文：** `apple-touch-icon` 指向 SVG 文件。iOS 16+ 支持 SVG 主屏幕图标，iOS 15 及以下可能回退到默认图标（功能不受影响）。

**EN:** `apple-touch-icon` points to the SVG file. iOS 16+ supports SVG home screen icons; iOS 15 and below may fall back to a default icon (no functional impact).

---

## 7. Cross-Tab Navigation 跨Tab导航

**中文：** 诊断工具（Diagnose tab）的"跳转"按钮需要以编程方式切换 tab 并设置状态。这需要两个 tab 按钮有固定 ID：

**EN:** The Diagnose tab's "jump" buttons need to programmatically switch tabs and set state. This requires two tab buttons to have fixed IDs:

```javascript
// jumpToGrow(dlevel): called from Diagnose result panel
function jumpToGrow(dlevel) {
  // 1. Switch tab
  document.getElementById('tab-grow').classList.add('active');
  document.getElementById('btn-grow-tab').classList.add('active');  // ← needs id

  // 2. Set D-level filter
  activeFilter = String(dlevel);
  document.querySelector('.gf-btn.gf-d' + dlevel).classList.add('active');
  renderGrow();  // Re-render with new filter
}

// jumpToOverview(dlevel): opens detail panel in Overview
function jumpToOverview(dlevel) {
  document.getElementById('btn-overview-tab').classList.add('active');  // ← needs id
  document.getElementById('detail-d' + dlevel).classList.add('visible');
}
```

**Required IDs in HTML 必须存在的ID:**
- `id="btn-overview-tab"` on the Overview tab button ✓ (verified present)
- `id="btn-grow-tab"` on the GROW tab button ✓ (verified present)

---

## 8. Dynamic Rendering Detail 动态渲染详解

### 8.1 GROW Question Bank GROW提问库

**中文：** GROW tab 的内容完全由 `renderGrow()` 动态渲染到 `<div id="grow-detail">`，每次切换步骤或筛选 D-level 时重新渲染。静态 HTML 中 `#grow-detail` 是空的 div。提问通过 `copyQ(this)` 复制，使用 `data-zh` 和 `data-en` 属性传递内容（避免 onclick 属性中的引号转义问题）。

**EN:** GROW tab content is entirely dynamically rendered into `<div id="grow-detail">` by `renderGrow()`, which re-runs on every step switch and D-level filter change. In static HTML, `#grow-detail` is an empty div. Questions use `copyQ(this)` for copy, passing content through `data-zh` and `data-en` attributes (avoids quote escaping in onclick attributes).

### 8.2 Session Steps 5-7 Dynamic Adaptation Session动态适配

**中文：** 当教练在 Step 4 选择 D-level 时，`setSessLevel(level, btn)` 更新三个 DOM 元素的 innerHTML：
- `#ss-adapt-box`：显示 S-level 风格说明（来自 `adaptData[level]`）
- `#ss-options-prompts`：替换 Options 提问列表（来自 `sessOptionsQs[level]`）
- `#ss-wf-prompts`：替换 Way Forward 提问列表（来自 `sessWFQs[level]`）

**EN:** When the coach selects a D-level in Step 4, `setSessLevel(level, btn)` updates the innerHTML of three DOM elements:
- `#ss-adapt-box`: coaching style description (from `adaptData[level]`)
- `#ss-options-prompts`: replaces Options question list (from `sessOptionsQs[level]`)
- `#ss-wf-prompts`: replaces Way Forward question list (from `sessWFQs[level]`)

---

## 9. Deployment Status 部署状态

**中文：** 截至文档生成时：
- GitHub 仓库内容：✅ 正确新版本（153,805 字符，9个tab，全功能）
- GitHub Pages 构建状态：✅ `built`（已于 2026-06-12 重新触发部署）
- CDN 传播状态：⏳ 进行中（从外部节点抓取仍返回旧版本）
- 原因：GitHub Pages 使用 Fastly CDN，边缘节点缓存刷新通常需要 5-30 分钟

**EN:** As of document generation:
- GitHub repo contents: ✅ Correct new version (153,805 chars, 9 tabs, all features)
- GitHub Pages build status: ✅ `built` (rebuild triggered 2026-06-12)
- CDN propagation: ⏳ In progress (external fetches still return old version)
- Cause: GitHub Pages uses Fastly CDN; edge node cache invalidation typically takes 5–30 min

---

## 10. Verification Checklist 核实清单

An agent verifying this file should check the following:

### Must-verify items 必核实项

- [ ] **LS_KEY consistency**: Confirm `saveSession()`, `loadSession()`, and the working `removeItem` in `resetSession()` all reference `LS_KEY = 'coach_ref_session_v1'`
- [ ] **SESS_KEY cleanup**: Line ~3101 contains `localStorage.removeItem(SESS_KEY)` where SESS_KEY is undefined — functionally harmless but should be removed
- [ ] **9 tabs present**: `tab-overview`, `tab-behaviors`, `tab-grow`, `tab-matching`, `tab-application`, `tab-diagnose`, `tab-barriers`, `tab-theology`, `tab-session`
- [ ] **Cross-tab IDs**: `id="btn-overview-tab"` and `id="btn-grow-tab"` exist on their respective tab buttons
- [ ] **D-level filter CSS classes**: `.gf-btn.gf-d1` through `.gf-btn.gf-d4` exist for GROW tab filter
- [ ] **Session D-level button classes**: `.sdb-d1` through `.sdb-d4` exist for Session Step 4
- [ ] **growData completeness**: 4 GROW stages × 4 D-levels = 16 question groups, each with ≥2 questions
- [ ] **diagMap completeness**: 16 entries covering all C1–C4 × M1–M4 combinations
- [ ] **Service worker scope**: `./service-worker.js` registered at correct relative path

### Good-to-verify items 建议核实项

- [ ] PWA installable on iOS Safari (share → Add to Home Screen)
- [ ] Session notes persist across page refresh (write note → refresh → note reappears)
- [ ] Copy-to-clipboard works for GROW questions and barrier questions
- [ ] Diagnosis result "jump" buttons switch to correct tab with correct D-level filter
- [ ] `resetSession()` clears localStorage (verify `coach_ref_session_v1` key is deleted)

---

## 11. Quick Diff: What Changed From Original

| Original (pre-improvements) | Current version |
|---|---|
| 5 tabs | 9 tabs |
| GROW: 3 generic questions per stage | GROW: 3–4 questions × 4 D-levels, with filter + copy |
| Checklist: 4 items | Checklist: 10 items |
| No diagnosis tool | Full 4×4 C×M diagnosis matrix |
| No barrier module | 5 barrier types with signal phrases |
| No theology module | 3 pillars + 5 scriptures + translation table |
| No session flow | 10-step companion with dynamic adaptation |
| No PWA | Full PWA (manifest + service worker + icon) |
| No persistence | localStorage autosave + restore |
