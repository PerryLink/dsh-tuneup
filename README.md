<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-clinic-hero-zh-dark.webp">
  <img src="docs/assets/dsh-clinic-hero-zh-light.webp" width="100%" alt="dsh-clinic：一次运行验收一个 DSH 插件——包结构、cordis 契约、沙箱冒烟与集合站清单，结论落在六态判定与退出码 0–6">
</picture>

# dsh-clinic

**一次运行验收一个 DSH 插件——从包结构、cordis 契约到沙箱启动与目录清单。**

面向 DeepSeek Harness 插件的零依赖「完整性 + 运行健康」检测器：静态两层可离线跑，动态冒烟在一次性沙箱里启动组合，结论落在退出码上。

[安装](#三步上手) · [配置](#配置) · [FAQ](#faq) · [简体中文](README.md) · [English](README.en.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![License](https://img.shields.io/badge/license-Apache--2.0-3366CC?style=flat-square&labelColor=2B3245)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-%E2%89%A50.2.1%20%3C0.3.0-4B67B4?style=flat-square&labelColor=2B3245)](#兼容性)
[![npm](https://img.shields.io/npm/v/dsh-clinic?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-clinic)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-clinic/smoke.yml?branch=main&label=CI&style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-clinic/actions/workflows/smoke.yml)
[![Node](https://img.shields.io/badge/node-%3E%3D24.9-339933?style=flat-square&labelColor=2B3245)](#兼容性)

[![Stars](https://img.shields.io/github/stars/PerryLink/dsh-clinic?style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-clinic/stargazers)
[![npm downloads](https://img.shields.io/npm/dm/dsh-clinic?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-clinic)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-clinic?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-clinic?ref=badge)

```sh
dsh plugin --profile <name> add dsh-clinic
```

</div>

<sub>社区工具，与 DeepSeek 官方无关，不是认证、审计或官方背书；`dsh.standards` 块是 `not-run` 占位，不是通过。唯一仓库：<https://github.com/PerryLink/dsh-clinic>（原名 `@perrylink/dsh-plugin-doctor`，旧仓保留为指针）。</sub>

## 它是什么

`dsh-clinic` 把「这个插件能不能装、能不能起、进了目录站会不会被拒」拆成四层可判读的检查：**R 包结构 → K cordis 契约 → D 沙箱冒烟 → CC 集合站清单**。R 与 K 只读已提交的树，不需要装依赖、不需要联网；D 会在 `%TEMP%` 的一次性沙箱里真正 `npm pack` 并用无钥 profile 启动到模型请求；CC 对照生态里五个目录/注册表的真实约束。一次运行给出六态结论（pass / warn / info / skip / fail / error）与七个退出码，CI 可以直接按码分流。

判据不是拍脑袋写的：全部来自 2026-09-07 三路一手调研——deepseek-harness 的文档与源码、cordiverse/cordis 的源码契约、工作区全渠道存量盘点（全文与每个判据的出处见 [`SURVEY.md`](SURVEY.md)）。它不替代测试，也不构成安全审计：它把可静态判定的部分变成可复现的门禁。

**📖 生态实测知识库**（实测数据，不是营销）：[插件开发指南 · 选型实测数据 · 维护取舍判据](https://perrylink.github.io/dsh-plugin-guide/)。

### 同名区分（重要）

本仓在 2026-11 由 **`@perrylink/dsh-plugin-doctor`** 更名为 **`dsh-clinic`**，旧的 scoped npm 包与旧 GitHub 仓保留为指针/备份。生态里还有别的同名项目，别装错：

- npm 裸名 **`dsh-plugin-doctor`**（0.1.1）属于 **Xrainsmile/DSH-Plugin-Doctor**，不是本仓。**永远不要运行 `npx dsh-plugin-doctor`**——那执行的是别人的包。
- 本仓现在的 npm 包名就是 **`dsh-clinic`**；`npx dsh-clinic@<版本>` 与 `dsh plugin add dsh-clinic` 指向的都是它。
- GitHub 上名称含 `dsh-plugin-doctor` 的仓有 10 个（其中 8 个恰同名），例如 `zoahdev/dsh-plugin-doctor`（只在 GitHub，从未发布到 npm）。
- [`dsh-testkit`](https://github.com/PerryLink/dsh-testkit) 的 README 把旧名链向 zoahdev 的仓，与本仓无关。

一句话定位：**零依赖、可离线（`--only R,K`）、把 cordis v4 契约（K1–K16）与五大集合站清单（CC1–CC5）做成退出码可判读的 CI 门禁。**（“唯一”这类全称不作声称——仅在已核对的工具集合内未见同类。）

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-clinic-flow-v5-dark.svg">
  <img src="docs/assets/dsh-clinic-flow-v5-light.svg" width="100%" alt="dsh-clinic 结构图（漏斗）：R/K/D/CC/X 五路取证汇入同一漏斗，每项检查落入六态之一，最坏状态决定判定，漏斗口给出退出码 0–6">
</picture>

## 三步上手

1. **安装**（三选一）：

   ```sh
   # git 通道（最新 main；等价于 git+https://github.com/PerryLink/dsh-clinic.git）
   dsh plugin --profile web add github:PerryLink/dsh-clinic
   # npm 通道（已发布版本）
   dsh plugin --profile web add dsh-clinic
   # tarball 通道：本仓库 pnpm pack 后
   dsh plugin --profile web add ./dsh-clinic-<version>.tgz
   ```

   `package.json` 声明了 `dsh.bundle.patch` → `cordis.patch.yml`，所以它既能作为 DSH bundle 装入 profile，也能脱离宿主当 CLI 用（`node doctor.mjs` / `npx dsh-clinic`）。

2. **挂载**（bundle 形态自动插入一行；无需任何配置键）：

   ```yaml
   - insert:
       - id: plugin-doctor
         name: 'dsh-clinic'
   ```

   插入的行按标准 Cordis 插件契约加载本包：宿主半区是一个导出 `apply(ctx)` 的纯 ESM 模块（`inject` 声明 `tools` 与 `commands`）。本包不带浏览器 UI，因此没有 `dsh.client` 声明。

3. **验证已生效**：

   ```sh
   node doctor.mjs --repo . --no-smoke --only R,K
   ```

   ```text
   == 静态·包结构 ==
   [PASS] R0 基础字段（name/version/license/README/type）
       基础字段齐全
   [PASS] R1 激活门 dsh.bundle.patch [关键]
       dsh.bundle.patch = ./cordis.patch.yml
   ```

   **卸载**：`dsh plugin --profile web remove dsh-clinic`（或从 profile patch 删掉该行）。CLI 用法不受影响。

## 核心能力

同一套检查有两种入口：CLI（`doctor.mjs`，有退出码）与宿主半区（`plugin_doctor` 工具 / `/doctor` 命令，返回完整报告）。四个核心分组：

- **R｜包结构（R0–R8）** —— 基础字段；激活门 `dsh.bundle.patch`（关键）；`npm pack --dry-run` 的 tarball 是否含入口与 patch；`cordis.patch.yml` 结构；入口 `name`/`apply` 导出；rescope 依赖口径；`engines` 对齐；prebuild + `files` 白名单；旧 rc peer 残留。
- **K｜cordis 契约（K1–K16）** —— 服务访问 vs `inject` 声明；`ctx` 活数据序列化红线；定时器/监听器未包 `ctx.effect`；Schema 含函数；`apply` 返回形状（v4 Effect 契约）；`inject` 服务名 seam；v3 遗留 API；Config 必须是 Standard Schema；`name==='apply'` 特例；K15 嵌套 activation spec（宿主 ≥ 0.2.2-rc.3 已扁平化，request 内的 prompt 会失效）；K16 思考模式下只设 temperature/top_p 而不设 reasoningEffort（参数被静默忽略，INFO 级）。
- **D｜沙箱冒烟（D0–D3、D9）** —— `npm pack` → `dsh plugin --profile headless add <tarball>` → 断言 profile 的 bundles 含包名 → `--dump-config` 层标记 → 无钥 headless 运行期望 **exit 1 + `dsh: MISSING_CREDENTIAL`**（=组合 boot 到模型请求阶段）→ 沙箱清理。
- **CC｜集合站清单（CC1–CC5）** —— 认证注册表 spec v1 的五维 evidence；adp-list yml 字段/枚举/描述；dsh-catalog 目录条目约束（禁安装命令、截断启发式）；omdsh `dshWorkshop` 激活五值；dsh-plugin-kit 三门（license / 五语 README / seam 三角色）。
- **X｜宿主契约（补充证据）** —— peer 走廊、`inject` 服务面、patch 行可定位性；读不到 dsh 安装时该组降级，不冒充通过。

**GitHub Action**：仓库根目录带有 `action.yml`，可直接在 workflow 里调用，无需安装步骤：`uses: PerryLink/dsh-clinic@main`（`with: only: R,K`）；生产环境请 pin 到已发布的 tag。

### 检测目录

| 分组 | 项 | 判据要点 |
|---|---|---|
| 静态·包结构 | R0–R8 | 基础字段；**激活门 `dsh.bundle.patch`（关键）**；tarball 含入口与 patch；`cordis.patch.yml` 结构；入口 `name`/`apply` 导出；rescope 依赖口径（禁裸 `cordis`）；`engines` 对齐官方线；预构建 + `files` 白名单；peer 旧 rc 残留（2026-09-05 双基线教训） |
| 静态·cordis 契约 | K1–K16 | 服务访问 vs `inject` 声明；`ctx` 活数据序列化红线；定时器/监听器未包 `ctx.effect`；Schema 含函数；`apply` 返回形状（v4 Effect 契约）；`inject` 服务名 seam；**v3 遗留 API（3.x→4.x 已删除清单）**；Config 必须是 Standard Schema；`name==='apply'` 特例；K15 嵌套 activation spec（宿主 ≥ 0.2.2-rc.3 已扁平化，request 内的 prompt 会失效）；K16 思考模式下只设 temperature/top_p 而不设 reasoningEffort（参数被静默忽略，INFO 级） |
| 动态·沙箱冒烟 | D0–D3、D9 | `npm pack` → `dsh plugin --profile headless add <tarball>` → 断言 `dsh.profile.bundles` 含包名 → `--dump-config` 层标记 → keyless headless 运行期望 **exit 1 + `dsh: MISSING_CREDENTIAL`**（排除 NO_ADAPTER / ERR_MODULE_NOT_FOUND / SyntaxError / TypeError）→ 沙箱清理 |
| 生态·集合站清单 | CC1–CC5 | 认证注册表 spec v1 五维 evidence；adp-list yml 字段/枚举/描述；dsh-catalog 目录条目约束（禁安装命令、截断启发式）；omdsh `dshWorkshop` activation 5 值；dsh-plugin-kit 三门（license / 五语 README / seam 三角色，优先调用 kit 官方 CLI） |

### 退出码契约

| 码 | 含义 | 引入版本 |
|---|---|---|
| `0` | 无 fail/error（可含 warn/skip），且被请求的分组都真的跑了 | 0.1.x |
| `1` | 存在 fail/error（插件缺陷） | 0.1.x |
| `2` | 用法错误、未知分组、**未知选项** | 0.1.x |
| `3` | 基础设施错误（缺 npm/pnpm 等环境不可用） | **0.2.0** |
| `4` | 不支持的宿主版本（宿主自身安装失败，**不判插件**） | **0.2.0** |
| `5` | 结果不稳定（步骤超时/被信号终止） | **0.2.0** |
| `6` | **降级**：被请求的分组整组未真跑（如无源文件可扫描） | **0.2.0** |

**防静默通过**（两层）：

1. `--only` 里只要有一个分组名不匹配 → 立即 `2`。0.1.4 及更早版本在分组名乱码时会“零检查 + exit 0”，这曾让 35 个仓的 CI 门禁变成假绿（2026-09-09 实测：`checks_run=0`、`exit=0`）。
2. 0.2.0 起：**被请求的分组若整组未真跑（全 skip）→ `6`**。旧实现只覆盖“一项都没跑”，不覆盖“跑了但全 skip”——后者会让“K 组 0 覆盖”被当成通过。如需显式接受，用 `--allow-degraded`（退出码降为 0，但 JSON 里 `degraded` 仍非空）。

> ⚠️ 既有家族 41 仓的门禁**不读退出码**（workflow 用 `set +e` / `out="$(…)"` / `set -e`），只读 stdout 的 `R0 ` / `K1 ` 前缀与 JSON 里 `results[].name` 分流。因此 0.2.0 的退出码新增**对既有链路零影响**；它服务于交互式使用与未来的接入方。

### 宿主半区：`plugin_doctor` / `/doctor`

作为 bundle 装进 profile 后，同一套 R/K/X 检查以只读工具与命令的形式提供。与 CLI 有两处不同，且两处都必须写在回复里——**宿主半区没有退出码，返回的报告就是全部信息**：

- **降级会说出来。** 被请求的分组整组未真跑时，回复带上与 CLI 同一行 `[降级] …不可当作通过` 并点名分组。0.7.1 之前渲染层丢掉了这个事实，降级回复与“本来就没有要跑的项”无法区分。
- **`workspace` 从被检仓推导，而不是从本插件的安装位置推导。** 工具从被检仓向上找最近的、含两个及以上 DSH 插件仓的目录（`DSH_WORKSPACE` 与显式参数优先）。0.7.0 用的 `import.meta.dirname/..` 在 bundle 安装形态下等于 `<profile>/node_modules`（或 `…/@perrylink`），根本不是工作区：CC1–CC4 会对真实存在的注册表报“本地不存在”，K14 永远找不到兄弟仓。定位不到时回复会明说这一点，而不是让那些 skip 读起来像“注册表不存在”。

参数与默认值见[配置](#配置)。

### 目标形态与覆盖率

`--repo` 可以是**源码树**，也可以是**已装包目录 / 解包后的 tarball 产物**（后者常见于 `node_modules/<pkg>`）。判据随形态变化：

| 形态 | K 组（cordis 契约） | 说明 |
|---|---|---|
| 有 `src/` 的源码树 | 扫 `src/**` + 根层 JS（`mode: src`） | 完整 |
| **无 `src/`、`main` 指向 `lib/`** | **兜底扫 `lib/**`（`mode: lib-fallback`）** | 0.2.0 修复：旧实现的门槛是“无 build 脚本”，而已发布包**保留** build 脚本 → 兜底永不触发、K 九项全 skip 却仍 exit 0（假绿） |
| 既无 `src/` 也无 `lib/` | 九项全 skip（`mode: none`） | **整组未真跑 → 退出码 6**，不再假绿 |

覆盖率写入 JSON 的 `coverage.K`（`{filesInspected, mode}`），并汇总到 `groups.K`。

### `--only` 分组与 ASCII 别名

| 别名 | 分组全名 | 内容 |
|---|---|---|
| `R` | 静态·包结构 | R0–R8 |
| `K` | 静态·cordis 契约扫描 | K1–K16 |
| `D` | 动态·沙箱冒烟 | D0–D3、D9 |
| `CC` | 生态·集合站清单 | CC1–CC5 |

别名大小写不敏感，中文全名同样可用。**工作流里请一律使用别名**：中文分组名一旦被编辑器/脚本按错误编码往返，`--only` 就会一个分组都匹配不上。

### 三值契约视图（`--format check`）

`--format check` 输出生态通用的三值契约（`PASS`/`WARN`/`FAIL`，exit `0`/`1`/`2`，扁平 `checks[]`），而不是本项目更丰富的信封，好让别的检查器或 Action 直接消费。它只是一个**视图**：从不改变项目是否通过，`skip` 也绝不渲染成 `PASS`（会变成带 `skipped: true` 的 `WARN`）；完整语义留在 `doctor` 侧字段。见 `SPEC.md` §1.1——那三条性质是规范性的，`tests/compat.mjs` 会断言。

### 示例

**详细示例** —— 命令 `node doctor.mjs --repo . --no-smoke --only R,K`，输出：

```text
== 静态·包结构 ==
[PASS] R0 基础字段（name/version/license/README/type）
    基础字段齐全
[PASS] R1 激活门 dsh.bundle.patch [关键]
    dsh.bundle.patch = ./cordis.patch.yml
```

*Observed from `doctor.mjs`（Usage）; `lib/framework.mjs:121`（render）*

**失败分支** —— 输入：

```text
node doctor.mjs --repo . --only NOPE --no-smoke
```

输出：

```text
未知分组: NOPE
可用分组: 静态·包结构（R）, 静态·cordis 契约扫描（K）, 动态面·宿主契约（X）, 生态·集合站清单（CC）
```

*Observed from `doctor.mjs:196-206`; `tests/selftest.mjs:95`*

**简短示例**：`--only R,K` · `--json -` · `--format check`

### 判据从哪里来

- **harness 侧**：`docs/user/develop/basic/publish.md`、`apps/cli/src/plugin.ts`（激活门是唯一开关）、`packages/bundle/headless/README.md`（MISSING_CREDENTIAL 判据）、Releases（0.1.2-rc.1 / 0.1.3-alpha.1 变更）、`@deepseek-ai/dsh-loader-smoke`（官方化“临时 DSH_HOME + 期望退出码”模式）。
- **cordis 侧**：cordiverse/cordis v4 源码（registry/fiber/reflect/events.ts）+ DSH cordis-primer/tutorial 文档 + v3 `@cordisjs/core@3.10.2` d.ts 差异（3.x→4.x 黑名单）。
- **生态侧**：dsh-plugin-certification spec v1、adp-list `entries.mjs`/`check-submission.mjs`、dsh-catalog `validate.mjs`/`deploy.yml` live smoke、omdsh build-submission、dsh-plugin-kit `verify/*`。

## 已验证徽章

有**两条徽章路径**，它们的主张不同。挑你能真正背书的那条。**[`FOR-ADOPTERS.md`](FOR-ADOPTERS.md) 是这一节的逐步版**：复制哪个文件、徽章 markdown 原文、每个判定什么意思，以及这个检查**不**证明什么。

### Path A — 自助门禁徽章（无需许可，也无需作者参与）

这枚徽章只主张**一条窄且可核对的事实**：*该仓在自己的 CI 里跑 dsh-clinic 的静态 R+K 门禁，且该 workflow 在默认分支上是绿的。* 它由 GitHub 原生徽章（当前示例）或 shields.io 直接从你自己的 workflow 状态渲染，不需要注册表条目、不需要 PR、不需要任何人的 token，也不会被本项目的基础设施搞坏：

```markdown
[![dsh-doctor R+K](https://github.com/<owner>/<name>/actions/workflows/plugin-doctor.yml/badge.svg)](https://github.com/PerryLink/dsh-clinic/blob/main/SPEC.md)
```

把 `<owner>/<name>`（以及默认分支不是 `main` 时的 `branch=`）换成你的。链接目标指向 `SPEC.md`——你声称满足的判据，以及判据作者的明示。

**请用 Path A。** 它就是整个标准，自助、且这个规范就是为它设计的；它不需要本项目做任何事。

关于 Path A 的两条诚实提醒：徽章反映的是**你的** workflow，所以它只和你的 CI 配置一样可信——没有第三方复核；若改用 shields.io 形式，shields.io 会知道你的仓库名。

### Path B — 作者签发的审计徽章

挂这枚徽章的含义只有一条，且可审计：**该仓在自己的 CI 里跑 dsh-clinic 的静态 R+K 门禁（23 项：R0/R1/R3/R5/R6/R7/R8 + K1–K16），且门禁在默认分支当前 HEAD 上是绿的**，*并由本项目的审计者复核过*。它**不是**认证徽章：不含 Scorecard、provenance、安装冒烟。R2（tarball 完整性）与 R4（入口契约）读取构建产物 `lib/`，而家族多数仓的构建需要 `HARNESS_COMMIT` + `gen-aliases` 才能通过——这两项由各仓自己的 `ci.yml`（build drift gate + pack smoke）把关，不在本门禁内。

```markdown
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-clinic/main/badges/PerryLink__dsh-github.svg)](https://github.com/PerryLink/dsh-clinic#已验证徽章)
```

**Path B 是集中式的单人服务，应当按这个前提看待。** 它需要一枚带跨仓只读权限的 fine-grained PAT，存为 `DOCTOR_AUDIT_TOKEN` 仓库 secret。workflow 级的 `GITHUB_TOKEN` **不能**替代：它没有跨仓读权限，GitHub 会当成匿名调用（60 请求/小时），而把声明仓全部审计一遍需要 200+。没有 PAT 时，每枚徽章都渲染成灰色 `NO DATA`——故障看起来像徽章程序坏了，而不是 secret 缺失。这事真的发生过（先 `401`，再 `403 rate limit exceeded`），也是 Path A 存在且被推荐的原因。`scripts/verify.mjs` 现在会在第一个此类响应处停下、exit `3`，并写出一个理由字段点名真实原因的注册表，而不是给每个仓打印同一行限流。

- 注册表 `data/verified.json` 是 Path B 的唯一事实来源，由 `scripts/verify.mjs` 刷新（原先每日 + 每次相关 push 的 workflow 驱动；本仓当前只保留 smoke workflow，刷新脚本仍在）。刷新只读 GitHub API：解析各仓 HEAD 的 `plugin-doctor.yml` 门禁配置（必须钉住 `dsh-clinic@<版本>`、`--only` 参数可用、含 R0/K1 实跑自校验），再核对 HEAD 那次 `plugin-doctor` workflow run 的结论。**本仓 CI 不克隆、不安装、不执行任何第三方代码。**
- 徽章外观：视觉语言对齐生态里较新的两枚徽章（`dsh.directory` 的等宽大写 + 字距 + 标记 + 渐变，`awesome-dsh-plugin` 的印章块）——**银白/铂金金属左段 + 盾牌勾标记 + 墨蓝等宽大写字**，右段是**整块 GitHub 惯例状态色**（绿/橙/红/灰）配等宽大写状态词，状态另用**路径绘制的图标**（✓ / ! / ✕ / –）冗余表达，色觉障碍下同样可读。5px 圆角 + 1px 描边；**描边是必需的**——去掉后银白左段在白色 README 背景上会消失。
- 四种状态（值文本用 shields / GitHub Actions 惯用词）：`passing`（绿，HEAD 上 run success）/ `warning`（橙：HEAD 还没跑、run 仍在队列、或缺少门禁配置的前置条件）/ `failing`（红：HEAD 上 run 失败，或门禁配置不成立——含 `--only` 参数是双重编码乱码的“假门禁”）/ `no data`（灰：API 查询失败）。徽章是**动态**的：不再通过就会变红。R+K 的精确口径不在徽章文字里，而在本节与注册表 `meaning` 字段（徽章链接指回本节）。
- 加入方式：向 `data/verified-repos.json` 提 PR 增加 `{ "repo": "<owner>/<name>", "package": "<npm 包名>" }`，并按下面的门禁在自己的仓里加 `plugin-doctor.yml`；条目必须通过上面的门禁核对。**Path A 不需要这些。**
- **门禁文件是随包发布的，不是让你抄的。** 把 [`plugin-doctor.yml`](plugin-doctor.yml)——权威的、开箱即用的 workflow——复制到你的仓的 `.github/workflows/plugin-doctor.yml` 并改 pin。它也在 npm tarball 里，`npx dsh-clinic` 用户可以直接读随包副本，而不是从 README 重建步骤。分组名用 **ASCII 别名 `R,K`**（0.1.5 起支持，文件与命令行全程纯 ASCII），末尾自校验 R0/K1 确实跑了。

> 为什么门禁不 install/build、徽章也不由本仓自跑：静态 R/K 检查只读已提交的树（无需依赖），而 `npm run build` 在缺 harness 别名的环境里会失败，其 prebuild 还会清空已提交的 `lib/`，制造假红。把第三方仓的依赖安装集中到本仓 CI 执行则是供应链风险。因此门禁在各仓自己的 CI 里执行、只读提交树，本仓只做审计与发徽。

## 实测数据

这里的数字来自**真实运行**，不是营销图。首份第三方（非 PerryLink）静态 R+K 扫描（2026-09-10，0.2.0）：**60 个候选 → 20 个真正声明 `dsh.bundle.patch` 的插件 → 16 项门禁下 10 通过 / 10 失败**。2026-09-23 用 0.3.0 对同一合格集重扫：**20 个候选重扫 → 19 个合格 → 6 通过 / 13 失败 / 0 降级 / 1 克隆失败**；失败直方图 `{"R8":9,"R3":5,"R7":3}`。**没有任何仓因 R3/R7 修复而回退**——头条变化全部来自 `R8`：peer 线最低要求前移，仍钉在 `0.1.0-rc.6` 的仓被判定为落后；`R8` 读作**陈旧度，不是损坏**。完整方法、逐仓表格、复现命令与更正通道见 [`THIRD-PARTY-RK-SCAN.md`](THIRD-PARTY-RK-SCAN.md)；2026-09-10 的机器可读基线在 `data/rk-scans.json`。

**它不是认证、不是评级，也不代表插件安全**：pass 仅表示“该 commit 上 23 项静态门禁未报失败”。方法上：只读克隆、**零执行**第三方代码，R2/R4 单列、不入门禁；`lib-fallback` 覆盖真实但不等价，K3–K7 可能少报。被点名仓若有异议，按报告里的更正通道提 issue，会以同等显著度原地更正。

## 配置

`dsh-clinic` 自身**没有 Config schema**——可调项就是 CLI 参数与宿主半区的六个工具参数。默认值即可用于 CI；离线静态门禁只需要 `--only R,K --no-smoke`。

CLI 常用参数：

| 参数 | 默认值 | 含义 |
|---|---|---|
| `--repo <path>` | 必填 | 被检插件仓路径（源码树，或已装包目录 / 解包后的 tarball 产物） |
| `--only <groups>` | 全部 | 只跑指定分组：`R`、`K`、`D`、`CC`（ASCII 别名，大小写不敏感；中文全名同样可用） |
| `--no-smoke` | 关 | 跳过动态沙箱冒烟，仅跑静态与清单（离线/CI 静态门禁用） |
| `--dsh <version>` | peer 下限 | 冒烟使用的宿主版本；默认 npm latest 已发布线 |
| `--json <path>` | — | 报告写入文件；`-` 表示写 stdout（此时抑制人类可读报告） |
| `--format check` | doctor | 三值契约视图（PASS/WARN/FAIL + 0/1/2，扁平 `checks[]`） |
| `--workspace <root>` | 自动 | 兄弟仓所在家族工作区（CC1–CC5 与 K14 核对用） |
| `--allow-degraded` | 关 | 显式接受“整组未真跑”；默认该情况 exit 6 |
| `--no-nested-activation` | 开 | 关闭 K15（嵌套 activation spec 检查） |
| `--no-thinking` | 开 | 关闭 K16（思考模式下 temperature/top_p 误用检查） |

<details>
<summary>宿主半区参数（<code>plugin_doctor</code> / <code>/doctor</code>）</summary>

| 参数 | 默认值 | 含义 |
|---|---|---|
| `repo`（必填） | — | 被检插件仓路径（需含 `package.json`） |
| `smoke` | `false` | 额外跑 D 组沙箱冒烟（需网络 + pnpm） |
| `host` | `true` | 跑 X 组宿主契约检查；读不到 dsh 安装时该组降级 |
| `workspace` | 自动 | 家族工作区目录（含多个 `dsh-*` 插件仓的父目录），用于 CC1–CC5 与 K14；默认从被检仓向上定位，也可用 `DSH_WORKSPACE` 环境变量 |
| `nestedActivation` | `true` | 跑 K15；对应 CLI 的 `--no-nested-activation` |
| `thinking` | `true` | 跑 K16；对应 CLI 的 `--no-thinking` |

</details>

完整命令形态（`--purge` 等维护参数不在上表）：

```powershell
node doctor.mjs --repo <插件仓路径>            # 全量（含动态冒烟，需网络 + pnpm）
node doctor.mjs --repo <路径> --no-smoke       # 仅静态 + 清单
node doctor.mjs --repo <路径> --dsh 0.2.2-alpha.3 # 冒烟宿主版本（默认 npm latest 已发布线）
node doctor.mjs --repo <路径> --only R,K       # 只跑静态两层（推荐用 ASCII 别名）
node doctor.mjs --repo <路径> --json report.json
node doctor.mjs --repo <路径> --json -         # JSON 写 stdout（此时抑制人类可读报告）
node doctor.mjs --repo <路径> --format check --json -   # 生态三值契约视图（PASS/WARN/FAIL + 0/1/2）
node doctor.mjs --repo <路径> --workspace <工作区根>   # 指定兄弟仓所在工作区（CC 组核对用）
node doctor.mjs --repo <路径> --allow-degraded # 显式接受「整组未真跑」（默认 exit 6）
node doctor.mjs --purge <隔离目录>              # 清理本工具产生的隔离目录（仅 doctor-quarantine-*）
```

## FAQ

<details>
<summary>它会不会动我的仓库或环境？</summary>

不会。静态 R/K/CC 只读已提交的树，不安装依赖、不执行被测代码；第三方扫描是只读克隆。D 组冒烟把临时 `DSH_HOME`/`DSH_AGENTS_HOME` 放进 `%TEMP%` 自建沙箱（前缀 `doctor-`，**不与宿主保护模板 `%TEMP%\dsh-*` 重叠**），`dsh plugin add` 总是带 `--ignore-scripts`，被测包的 install/prepare 脚本不会在宿主执行。运行结束**只隔离不删除**（rename 到 `%TEMP%\doctor-quarantine-*`），由人确认后用 `--purge` 清理。运行期绝对路径在写 JSON/渲染前统一占位化为 `<path>`。

</details>

<details>
<summary>PASS 是不是认证或安全评级？</summary>

不是。pass 只表示“该 commit 上被请求的静态检查未报失败”。K 组是**启发式静态扫描**，复杂包装可能漏报、也可能误报；D3 只证明组合能 boot 到模型请求，不证明工具 schema 合法或业务逻辑正确；`R8` 失败读作“peer 线陈旧”，不是“插件坏了”。本工具不做安全审计，`dsh.standards` 块也是 `not-run` 占位，不是通过。

</details>

<details>
<summary>CI 里怎么跑？要联网吗？</summary>

静态门禁不需要网络：`npx --yes dsh-clinic@0.8.1 --repo . --no-smoke --only "R,K"`，然后用退出码或 JSON 判定。要跑 D 组冒烟才需要网络与 pnpm。完整动作见 [`plugin-doctor.yml`](plugin-doctor.yml)：它只读提交树、末尾自校验 R0/K1 确实跑了，R2/R4 单列、不入门禁（它们读构建产物）。

</details>

<details>
<summary>降级或跳过会不会造成假绿？</summary>

不会。`--only` 里有分组名不匹配 → 立即 exit 2；被请求的分组整组未真跑 → exit 6；`--format check` 里 skip 绝不渲染成 `PASS`（变成带 `skipped: true` 的 `WARN`）。若你确实要接受降级，用 `--allow-degraded`——退出码降为 0，但 JSON 的 `degraded` 仍非空，宿主半区也会在回复里点名。

</details>

<details>
<summary>为什么 npm 上还有一个 dsh-plugin-doctor？</summary>

因为那是另一个项目。本仓由 `@perrylink/dsh-plugin-doctor` 更名为 `dsh-clinic`；npm 裸名 `dsh-plugin-doctor`（0.1.1）属于 Xrainsmile/DSH-Plugin-Doctor，`npx dsh-plugin-doctor` 执行的是别人的包。请用 `npx dsh-clinic@<版本>`（或 `dsh plugin add dsh-clinic`）。旧 scoped 包与旧 GitHub 仓保留为指针。

</details>

## 安全边界

- **静态只读。** R/K/CC 与第三方扫描只读文件系统；tests 之外不写被测仓。唯一写入是本工具自己的 `%TEMP%` 沙箱与隔离目录。
- **一次性沙箱。** D 组的临时 `DSH_HOME`/`DSH_AGENTS_HOME` 在 `%TEMP%\doctor-*` 里，绝不触碰真实 `~/.dsh`（红线 3）。
- **不执行被测包的安装脚本。** `dsh plugin add` 显式传 `--ignore-scripts`；pnpm 的 `ignored-builds` 阻断归类为 `environment`（不计 pass、不计插件缺陷）。
- **只隔离不删除。** 每步子进程 stdout/stderr 落盘 `%TEMP%\doctor-run-*\logs\`；结束 rename 到 `%TEMP%\doctor-quarantine-*`，报告尾部打印路径，人确认后才 `--purge`（红线 4 三段式）。
- **路径占位化。** 运行期绝对路径在进入 JSON/渲染文本前统一变成 `<path>`，报告可以提交进别人的仓而不触发其路径泄漏门禁。
- **失败关闭、防假绿。** 未知分组/未知选项 → 2；整组未真跑 → 6；降级必须显式 `--allow-degraded`；`skip` 永远不写成 `pass`。

## 已知限制

- K 组为**启发式静态扫描**：K1/K3/K4 会漏掉复杂包装，也可能误报——warn 级均需人工复核，不自动判死。
- D3 只证明“组合可 boot 到模型请求”，**不证明工具 schema 合法或业务逻辑正确**（需带钥 e2e 或 mock LLM 补充）。
- pnpm `ignored-builds` 属环境配方问题：D1 命中时降级为 warn 并给出 `compat.yml` 的 `allowBuilds` 配方提示，与认证 spec v1 的 environment-blocked 口径一致，不计为插件缺陷。
- npm 线宿主（0.1.2-rc.1）的 packument 没有 engines/peerDependencies 强制，R6 在该线只是建议门。
- 本环境实测陷阱：`$` 锚点（无 `m` 标志）不匹配行尾孤立 `\r` 之前的位置，解析 CRLF 文本必须按 `/\r?\n/` 切行（已内建处理，勿回退）。
- **标准对照。** R/K/D——X 作为补充证据——只映射到 **DSH-ENTRY** 兼容基线；JSON 信封新增加法式 `standards` 字段（`dsh-levels/1`）。DSH-FLOW（`J1–J8`）是 `manual`，DSH-BOOST（`LEV-1..LEV-8`）是 `not-measured`——本工具不跑用户旅程、也不跑 benchmark——这些等级不是 DeepSeek 官方标准。见 [`STANDARDS.md`](STANDARDS.md) 与 `data/standards.json`。

## 兼容性

| 维度 | 状态 |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.2-alpha.3`（2026-11-03 更新基线；零依赖且刻意与宿主版本解耦：`package.json` 未声明任何 `@deepseek-ai/dsh-*` 依赖、也没有 peer 区间，因此本仓的 `R5`/`R8` 是刻意 skip 而非 pass——见 `SELF-CHECK.md`；该线的记录在 `CHANGELOG.md` §0.4.6“host pins move to `0.2.1-alpha.1`”；D 组沙箱冒烟的宿主由 `--dsh` 指定，默认 peer 下限 `0.1.2-rc.1`） |
| Node | `>=24.9.0` |

## 生态与质量

- [dshfind 插件页](https://dshfind.com/plugins/PerryLink/dsh-clinic)（安装量与排名）
- [生态实测知识库](https://perrylink.github.io/dsh-plugin-guide/)：插件开发指南 · 选型实测数据 · 维护取舍判据
- [dsh-standards 标准仓库](https://github.com/PerryLink/dsh-standards)：本工具判据对照的家族标准
- [第三方 R+K 扫描报告](THIRD-PARTY-RK-SCAN.md)：60 候选 → 20 合格插件 → 10 通过 / 10 失败（2026-09-10），2026-09-23 重扫 19 个 → 6 通过 / 13 失败
- **诚实状态**：家族里已有 43 个仓内置该门禁（注册表 `data/verified-repos.json` 当前登记 40 个仓；门禁模板在 2026-09-23/24 统一为逐字节一致的一版）；**尚无外部采用者**——限制来自采用，而不是目录覆盖（推理见 [`OUTREACH.md`](OUTREACH.md) §C4）。发布走 npm Trusted Publishing（OIDC），不用长期 token。0.2.0 的改动全部是加法式的，已用 37 仓基线验证 diffs = 0。
- **1024 商店渠道**：先 `npm i -g dsh1024`，再 `dsh1024 plugin --profile web add dsh-clinic`（计入 [deepseek1024.com](https://deepseek1024.com) 安装排行）

## 开发

```sh
npm install
npm test                      # 语法检查 + 14 例自检 + 契约/漂移/兼容测试
npm run check:readmes         # 五语 README 一致性门禁（A 模式）
npm run test:host-surface     # 宿主服务面数据与 0.2.2-alpha.3 基线一致
npm run check:cross-repo      # 月度 K14 跨仓门禁（从已发布 tarball 搭家族）
node scripts/check-release-health.mjs --repo . --no-registry   # 发布健康度（离线）
npm run verify:registry       # Path B 注册表与徽章刷新（只读 GitHub API）
npm run badge                 # 重新渲染 verified SVG
```

### 目录结构

```text
doctor.mjs               CLI 入口（分组编排、退出码、JSON 报告）
plugin.mjs               宿主半区（plugin_doctor 工具 + /doctor 命令）
cordis.patch.yml         bundle 声明（insert 一行；无配置键）
lib/framework.mjs        检查注册/运行/判定/渲染（零依赖）
lib/util.mjs             临时沙箱 + 子进程执行（stdout/stderr 落盘，规避管道捕获限制）
lib/workspace.mjs        家族工作区定位
lib/checks-package.mjs   静态·包结构 R0–R8
lib/checks-cordis.mjs    静态·cordis 契约 K1–K16
lib/checks-runtime.mjs   X 组宿主契约检查
lib/checks-smoke.mjs     动态·沙箱冒烟 D0–D3、D9
lib/checks-collections.mjs  生态·集合站清单 CC1–CC5
tests/selftest.mjs       14 例真实 CLI 自检（既有 7 例退出码契约逐字不变 + 新增降级/用法守卫 7 例）
tests/contract.mjs       31 项契约测试（冻结既有 37 仓 CI 依赖的 5 个可观测量）
scripts/check-readme-sync.mjs  五语 README 门禁（A 模式：中文主版 + 英文版）
scripts/verify.mjs       verified 注册表与徽章刷新（只读 GitHub API 审计各仓门禁）
scripts/badge.mjs        verified SVG 渲染
scripts/check-cross-repo.mjs    月度 K14 跨仓门禁（从已发布 tarball 搭家族）
scripts/check-release-health.mjs 发布健康度（版本载体、注册表、provenance、tarball）
scripts/gen-readme-assets.py     程序化生成 README 配图（Python + Pillow）
data/verified-repos.json verified 声明仓清单
data/verified.json       verified 注册表
badges/                  verified 徽章
THIRD-PARTY-RK-SCAN.md   第三方插件静态 R+K 扫描结果集（公开报告）
data/rk-scans.json       上述扫描的机器可读形态（2026-09-10 基线）
SURVEY.md                全渠道检测方法梳理 + 判据出处
SPEC.md                  规范性验证判据（PerryLink 撰写）
GOVERNANCE.md            作者身份、规范版本化、署名要求
NOTICE                   Apache-2.0 归属声明（再分发时必须随附）
CITATION.cff             引用元数据
plugin-doctor.yml        权威 CI 门禁模板（随包发布，复制即用）
FOR-ADOPTERS.md          采用者落地页：门禁、徽章、判定、限制
SELF-CHECK.md            本工具用自身判据跑自己的结果
OUTREACH.md              采用笔记：渠道路径、定位、动作
```

### 发布健康度

绿色 release workflow 不证明发布正确。2026-10-05 家族发了 37 个包，真正要命的问题在 job 颜色里看不见：36 个 CHANGELOG 带着字面日期 `undefined`；两个包发布成功却仍是红色；一个败在 `ENEEDAUTH`，因为 npm 的 trusted-publisher 绑定指向了一个已经不做 OIDC 交换的 workflow；还有一个根本没到 npm，因为发布前的 `verify` 门禁先失败，publish job 被 `skipped`。

`scripts/check-release-health.mjs` 检查覆盖上述全部的四件事：

| Pass | 问题 | 需要网络 |
|---|---|---|
| LOCKSTEP | 仓里每个版本载体都与 `package.json` 一致吗？ | 否 |
| PUBLISHED | 本地版本就是注册表上的那个吗？ | 是 |
| PROVENANCE | 是哪个 workflow 文件发布的，它还是当前的发布文件吗？ | 是 |
| FILES | 已发布的 tarball 还带着 `src/`、`lib/` 或 `dist/` 吗？ | 是 |

```sh
# 单仓、离线（下游仓在自己的 CI 里应使用的模式）
node scripts/check-release-health.mjs --repo . --no-registry

# 整个声明家族，直接查注册表，不 checkout 任何一个仓
node scripts/check-release-health.mjs --roster data/verified-repos.json
```

退出码：`0` 健康，`1` 至少一个问题，`2` 用法错误。`--json <path>` 写机器可读报告，`--quiet` 只打印失败。两条命令都可直接接进你自己的 CI。

只有两种载体形态会让检查失败，因为家族只断言这两种：`src/version.ts` 导出的 `VERSION`，以及存在时的 `VERSION` 文件。`SKILL.md` 的版本差异只作为 note 报告——多数 skill 独立版本化。

### 配图复跑

`docs/assets/dsh-clinic-hero-{zh,en}-{light,dark}.webp` 与 `docs/assets/dsh-clinic-flow-v5-{light,dark}.svg` 由 [`scripts/gen-readme-assets.py`](scripts/gen-readme-assets.py) 程序化生成（Pillow 画 hero，手写 SVG 画结构图；字体探测缺失即报错退出）。hero 分 zh/en 两版；结构图内只放命令 token（分组名、命令、退出码），五语共用。复跑：

```sh
python scripts/gen-readme-assets.py
```

本仓没有 benchmark 数据，因此不生成 evidence 条形图；实测数字直接引用上面的扫描报告。

## 家族与致谢

本项目是 [PerryLink](https://github.com/PerryLink) 维护的 DeepSeek Harness 插件家族成员（95 个，全部 Apache-2.0）。如果这个插件帮到了你，**给个 star**——它不解锁任何功能，但会让下一个人更容易找到它。

### 判据的作者

验证判据——不只是实现它们的工具——由 **PerryLink**（<https://github.com/PerryLink>）撰写。规范文本是 [`SPEC.md`](SPEC.md)，本仓既是规范的规范来源，也是参考实现。判据如何变更、以及 Apache-2.0 §4(d) 通过 [`NOTICE`](NOTICE) 要求什么署名，见 [`GOVERNANCE.md`](GOVERNANCE.md)。

采用门禁不需要许可。若你采用，请保留判据对 PerryLink 的署名，不要把判据说成你自己的标准。

<details>
<summary>展开全部插件</summary>

| 插件 | 状态 |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-demurrage-ledger](https://github.com/PerryLink/dsh-demurrage-ledger)** |  |
| **[dsh-doublecheck](https://github.com/PerryLink/dsh-doublecheck)** |  |
| **[dsh-drill-script-check](https://github.com/PerryLink/dsh-drill-script-check)** |  |
| **[dsh-eia-guide-check](https://github.com/PerryLink/dsh-eia-guide-check)** |  |
| **[dsh-emergency-plan](https://github.com/PerryLink/dsh-emergency-plan)** |  |
| **[dsh-essay-rubric-check](https://github.com/PerryLink/dsh-essay-rubric-check)** |  |
| **[dsh-evidence-check](https://github.com/PerryLink/dsh-evidence-check)** |  |
| **[dsh-export-ctl-check](https://github.com/PerryLink/dsh-export-ctl-check)** |  |
| **[dsh-fast](https://github.com/PerryLink/dsh-fast)** |  |
| **[dsh-fmea-table-check](https://github.com/PerryLink/dsh-fmea-table-check)** |  |
| **[dsh-forecast-penalty](https://github.com/PerryLink/dsh-forecast-penalty)** |  |
| **[dsh-fund-research](https://github.com/PerryLink/dsh-fund-research)** |  |
| **[dsh-github](https://github.com/PerryLink/dsh-github)** |  |
| **[dsh-gongwen-flow-check](https://github.com/PerryLink/dsh-gongwen-flow-check)** |  |
| **[dsh-gongwen-word-check](https://github.com/PerryLink/dsh-gongwen-word-check)** |  |
| **[dsh-guard-plan-qc](https://github.com/PerryLink/dsh-guard-plan-qc)** |  |
| **[dsh-hazchem-check](https://github.com/PerryLink/dsh-hazchem-check)** |  |
| **[dsh-hazplan-check](https://github.com/PerryLink/dsh-hazplan-check)** |  |
| **[dsh-hidden-risk-map](https://github.com/PerryLink/dsh-hidden-risk-map)** |  |
| **[dsh-hs-classify](https://github.com/PerryLink/dsh-hs-classify)** |  |
| **[dsh-icd-rule-check](https://github.com/PerryLink/dsh-icd-rule-check)** |  |
| **[dsh-industry-research](https://github.com/PerryLink/dsh-industry-research)** |  |
| **[dsh-lawcite-adapter](https://github.com/PerryLink/dsh-lawcite-adapter)** |  |
| **[dsh-laya](https://github.com/PerryLink/dsh-laya)** |  |
| **[dsh-lc-doc-check](https://github.com/PerryLink/dsh-lc-doc-check)** |  |
| **[dsh-learning-gap-check](https://github.com/PerryLink/dsh-learning-gap-check)** |  |
| **[dsh-library](https://github.com/PerryLink/dsh-library)** |  |
| **[dsh-local-ai](https://github.com/PerryLink/dsh-local-ai)** |  |
| **[dsh-lsp-actions](https://github.com/PerryLink/dsh-lsp-actions)** |  |
| **[dsh-mask](https://github.com/PerryLink/dsh-mask)** |  |
| **[dsh-mcp-panel](https://github.com/PerryLink/dsh-mcp-panel)** |  |
| **[dsh-medrec-qc](https://github.com/PerryLink/dsh-medrec-qc)** |  |
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-nsfc-form-check](https://github.com/PerryLink/dsh-nsfc-form-check)** |  |
| **[dsh-nurse-record-check](https://github.com/PerryLink/dsh-nurse-record-check)** |  |
| **[dsh-observe](https://github.com/PerryLink/dsh-observe)** |  |
| **[dsh-origin-rvc-check](https://github.com/PerryLink/dsh-origin-rvc-check)** |  |
| **[dsh-ota-review-check](https://github.com/PerryLink/dsh-ota-review-check)** |  |
| **[dsh-output-styles](https://github.com/PerryLink/dsh-output-styles)** |  |
| **[dsh-paper-doc-adapter](https://github.com/PerryLink/dsh-paper-doc-adapter)** |  |
| **[dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)** |  |
| **[dsh-permit-report-check](https://github.com/PerryLink/dsh-permit-report-check)** |  |
| **[dsh-pipeline-check](https://github.com/PerryLink/dsh-pipeline-check)** |  |
| **[dsh-pleading-draft](https://github.com/PerryLink/dsh-pleading-draft)** |  |
| **[dsh-clinic](https://github.com/PerryLink/dsh-clinic)** |  |
| **[dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)** |  |
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | 🚫 已退役（仓库已归档） |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | 🚫 已退役（仓库已归档） |
| **[dsh-policy-brief-draft](https://github.com/PerryLink/dsh-policy-brief-draft)** |  |
| **[dsh-power-loss-split](https://github.com/PerryLink/dsh-power-loss-split)** |  |
| **[dsh-power-ticket-check](https://github.com/PerryLink/dsh-power-ticket-check)** |  |
| **[dsh-ppap-check](https://github.com/PerryLink/dsh-ppap-check)** |  |
| **[dsh-protest-deadline](https://github.com/PerryLink/dsh-protest-deadline)** |  |
| **[dsh-railway-window](https://github.com/PerryLink/dsh-railway-window)** |  |
| **[dsh-repair-order-qc](https://github.com/PerryLink/dsh-repair-order-qc)** |  |
| **[dsh-research-report](https://github.com/PerryLink/dsh-research-report)** |  |
| **[dsh-review-reply-check](https://github.com/PerryLink/dsh-review-reply-check)** |  |
| **[dsh-rulefile-check](https://github.com/PerryLink/dsh-rulefile-check)** |  |
| **[dsh-safety-brief-check](https://github.com/PerryLink/dsh-safety-brief-check)** |  |
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-session-sync](https://github.com/PerryLink/dsh-session-sync)** |  |
| **[dsh-site-log-check](https://github.com/PerryLink/dsh-site-log-check)** |  |
| **[dsh-skill-pack-security](https://github.com/PerryLink/dsh-skill-pack-security)** |  |
| **[dsh-soe-decision-check](https://github.com/PerryLink/dsh-soe-decision-check)** |  |
| **[dsh-soilwater-check](https://github.com/PerryLink/dsh-soilwater-check)** |  |
| **[dsh-sop-sync-check](https://github.com/PerryLink/dsh-sop-sync-check)** |  |
| **[dsh-spc-gbt-adapter](https://github.com/PerryLink/dsh-spc-gbt-adapter)** |  |
| **[dsh-talk](https://github.com/PerryLink/dsh-talk)** |  |
| **[dsh-tender-extract](https://github.com/PerryLink/dsh-tender-extract)** |  |
| **[dsh-tender-matrix](https://github.com/PerryLink/dsh-tender-matrix)** |  |
| **[dsh-test-drive](https://github.com/PerryLink/dsh-test-drive)** |  |
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | 🚫 已退役（仓库已归档） |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 已冻结 — 见仓库 README |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 已退役（仓库已归档） |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 已退役（仓库已归档） |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 已退役（仓库已归档） |
</details>

## License

[LICENSE](LICENSE)（Apache License 2.0）© 2026 dsh-clinic contributors

<p align="center"><sub>Apache-2.0 · 社区工具，与 DeepSeek 无关。</sub></p>
