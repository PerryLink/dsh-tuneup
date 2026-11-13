<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-clinic-hero-en-dark.webp">
  <img src="docs/assets/dsh-clinic-hero-en-light.webp" width="100%" alt="dsh-clinic: accept a DSH plugin in one run — package structure, cordis contract, sandbox boot and listing checks, graded into six states and exit codes 0–6">
</picture>

# dsh-clinic

**Accept a DSH plugin in one run — package structure, cordis contracts, sandbox boot, and directory listings.**

A zero-dependency "integrity + runtime health" checker for DeepSeek Harness plugins: the two static layers run offline, the dynamic smoke boots a composition in a throwaway sandbox, and the verdict is readable from the exit code.

[Install](#three-step-setup) · [Configuration](#configuration) · [FAQ](#faq) · [简体中文](README.md) · [English](README.en.md) · [Español](README.es.md) · [Português](README.pt.md) · [हिन्दी](README.hi.md)

[![License](https://img.shields.io/badge/license-Apache--2.0-3366CC?style=flat-square&labelColor=2B3245)](LICENSE)
[![DSH](https://img.shields.io/badge/DSH-%E2%89%A50.2.1%20%3C0.3.0-4B67B4?style=flat-square&labelColor=2B3245)](#compatibility)
[![npm](https://img.shields.io/npm/v/dsh-clinic?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-clinic)
[![CI](https://img.shields.io/github/actions/workflow/status/PerryLink/dsh-clinic/smoke.yml?branch=main&label=CI&style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-clinic/actions/workflows/smoke.yml)
[![Node](https://img.shields.io/badge/node-%3E%3D24.9-339933?style=flat-square&labelColor=2B3245)](#compatibility)

[![Stars](https://img.shields.io/github/stars/PerryLink/dsh-clinic?style=flat-square&labelColor=2B3245)](https://github.com/PerryLink/dsh-clinic/stargazers)
[![npm downloads](https://img.shields.io/npm/dm/dsh-clinic?style=flat-square&labelColor=2B3245&color=CB3837)](https://www.npmjs.com/package/dsh-clinic)
[![dshfind](https://dshfind.com/api/badge/PerryLink/dsh-clinic?metric=downloads)](https://dshfind.com/plugins/PerryLink/dsh-clinic?ref=badge)

```sh
dsh plugin --profile <name> add dsh-clinic
```

</div>

<sub>Community tool, not affiliated with DeepSeek and not a certification, audit, or official endorsement; the `dsh.standards` block is a `not-run` placeholder, not a pass. Canonical repository: <https://github.com/PerryLink/dsh-clinic> (formerly `@perrylink/dsh-plugin-doctor`; the old repo remains as a pointer).</sub>

## What it is

`dsh-clinic` splits "can this plugin be installed, can it boot, will a directory reject it" into four readable layers: **R package structure → K cordis contracts → D sandbox smoke → CC directory listings**. R and K read only the committed tree — no dependency install, no network; D really runs `npm pack` and boots a keyless profile in a one-shot sandbox up to the model request; CC checks the real constraints of five ecosystem directories/registries. One run yields a six-state verdict (pass / warn / info / skip / fail / error) and seven exit codes, so CI can branch on the code.

The criteria are not improvised: they come from three first-hand research tracks dated 2026-09-07 — the deepseek-harness docs and source, the cordiverse/cordis source contracts, and an inventory of every distribution channel in the workspace (full text and every citation in [`SURVEY.md`](SURVEY.md)). It does not replace tests and is not a security audit: it turns what can be judged statically into a reproducible gate.

**📖 Ecosystem knowledge base** (measured data, not marketing): [plugin development guide · plugin-selection data · maintenance criteria](https://perrylink.github.io/dsh-plugin-guide/).

### Same-name confusion (important)

In 2026-11 this repository was renamed from **`@perrylink/dsh-plugin-doctor`** to **`dsh-clinic`**; the old scoped npm package and the old GitHub repo remain as pointers/backups. Other same-named projects exist — do not install the wrong one:

- The bare npm name **`dsh-plugin-doctor`** (0.1.1) belongs to **Xrainsmile/DSH-Plugin-Doctor**, not this repo. **Never run `npx dsh-plugin-doctor`** — that executes someone else's package.
- This repo's npm package is now **`dsh-clinic`**; `npx dsh-clinic@<version>` and `dsh plugin add dsh-clinic` both resolve to it.
- Ten GitHub repos carry `dsh-plugin-doctor` in their name (eight exactly), e.g. `zoahdev/dsh-plugin-doctor` (GitHub-only, never published to npm).
- [`dsh-testkit`](https://github.com/PerryLink/dsh-testkit)'s README links the old name to the zoahdev repo; that has nothing to do with this one.

In one line: **zero-dependency, offline-capable (`--only R,K`), and it turns the cordis v4 contracts (K1–K16) and five ecosystem directory listings (CC1–CC5) into a CI gate whose verdict is readable from the exit code.** (No "the only" style claim — merely that nothing comparable appeared within the set of tools actually surveyed.)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/dsh-clinic-flow-v5-dark.svg">
  <img src="docs/assets/dsh-clinic-flow-v5-light.svg" width="100%" alt="dsh-clinic structure (a funnel): five evidence feeds R/K/D/CC/X pour into one funnel, each check lands in one of six states, the worst state sets the verdict, and the spout yields exit codes 0–6">
</picture>

## Three-step setup

1. **Install** (pick one channel):

   ```sh
   # git channel (latest main; equivalent to git+https://github.com/PerryLink/dsh-clinic.git)
   dsh plugin --profile web add github:PerryLink/dsh-clinic
   # npm channel (published releases)
   dsh plugin --profile web add dsh-clinic
   # tarball channel: pnpm pack in this repo, then
   dsh plugin --profile web add ./dsh-clinic-<version>.tgz
   ```

   `package.json` declares `dsh.bundle.patch` → `cordis.patch.yml`, so it installs as a DSH bundle and also runs as a standalone CLI (`node doctor.mjs` / `npx dsh-clinic`).

2. **Mount** (the bundle form inserts one row; no config keys needed):

   ```yaml
   - insert:
       - id: plugin-doctor
         name: 'dsh-clinic'
   ```

   The inserted row loads this package under the standard Cordis plugin contract: the host half is a plain ESM module exporting `apply(ctx)` (its `inject` declares `tools` and `commands`). The package ships no browser UI, so there is no `dsh.client` declaration.

3. **Verify it works**:

   ```sh
   node doctor.mjs --repo . --no-smoke --only R,K
   ```

Expected output (the CLI reports in Chinese):

```text
== 静态·包结构 ==
[PASS] R0 基础字段（name/version/license/README/type）
    基础字段齐全
[PASS] R1 激活门 dsh.bundle.patch [关键]
    dsh.bundle.patch = ./cordis.patch.yml
```

   **Uninstall**: `dsh plugin --profile web remove dsh-clinic` (or remove the row from the profile patch). The CLI usage is unaffected.

## Core capabilities

The same checks have two entry points: the CLI (`doctor.mjs`, with exit codes) and the host half (`plugin_doctor` tool / `/doctor` command, returning the full report). Four core groups:

- **R | package structure (R0–R8)** — base fields; the activation gate `dsh.bundle.patch` (critical); whether `npm pack --dry-run` carries the entry and the patch; `cordis.patch.yml` structure; entry `name`/`apply` exports; rescoped dependency policy; `engines` alignment; prebuild + `files` allowlist; leftover old-rc peers.
- **K | cordis contracts (K1–K16)** — service access vs `inject` declaration; the `ctx` live-data serialization red line; timers/listeners not wrapped in `ctx.effect`; Schema containing a function; `apply` return shape (the v4 Effect contract); `inject` service-name seam; v3 legacy APIs; Config must be a Standard Schema; the `name==='apply'` special case; K15 nested activation spec (host ≥ 0.2.2-rc.3 flattened it, so a prompt inside request stops working); K16 temperature/top_p without reasoningEffort under thinking mode (silently ignored, INFO).
- **D | sandbox smoke (D0–D3, D9)** — `npm pack` → `dsh plugin --profile headless add <tarball>` → assert the profile's bundles contain the package name → `--dump-config` layer marker → keyless headless run expected to **exit 1 + `dsh: MISSING_CREDENTIAL`** (the composition booted as far as a model request) → sandbox cleanup.
- **CC | directory listings (CC1–CC5)** — the certification registry spec v1 five-dimension evidence; adp-list yml fields/enums/descriptions; dsh-catalog entry constraints (install commands forbidden, truncation heuristics); the omdsh `dshWorkshop` activation five values; the dsh-plugin-kit three gates (license / five-language README / the three seam roles).
- **X | host contracts (supplementary evidence)** — peer corridor, `inject` service surface, patch-row locatability; degrades when no dsh install can be read and never pretends to pass.

**GitHub Action**: the repository ships `action.yml` at its root, so a workflow can call it with no install step: `uses: PerryLink/dsh-clinic@main` (`with: only: R,K`); pin to a published tag in production.

### Check catalog

| Group | Checks | What the criteria cover |
|---|---|---|
| static · package structure | R0–R8 | base fields; **the activation gate `dsh.bundle.patch` (critical)**; tarball contains the entry and the patch; `cordis.patch.yml` structure; entry `name`/`apply` exports; rescoped dependency policy (bare `cordis` forbidden); `engines` aligned to the official line; prebuild + `files` allowlist; leftover old-rc peers (the 2026-09-05 dual-baseline lesson) |
| static · Cordis contract | K1–K16 | service access vs `inject` declaration; the `ctx` live-data serialization red line; timers/listeners not wrapped in `ctx.effect`; Schema containing a function; `apply` return shape (the v4 Effect contract); `inject` service-name seam; **v3 legacy APIs (the 3.x→4.x removal list)**; Config must be a Standard Schema; the `name==='apply'` special case; K15 nested activation spec (host ≥ 0.2.2-rc.3 flattened it, so a prompt inside request stops working); K16 temperature/top_p without reasoningEffort under thinking mode (silently ignored, INFO) |
| dynamic · sandbox smoke | D0–D3, D9 | `npm pack` → `dsh plugin --profile headless add <tarball>` → assert `dsh.profile.bundles` contains the package name → `--dump-config` layer marker → keyless headless run expected to **exit 1 + `dsh: MISSING_CREDENTIAL`** (NO_ADAPTER / ERR_MODULE_NOT_FOUND / SyntaxError / TypeError excluded) → sandbox cleanup |
| ecosystem · directory listings | CC1–CC5 | the certification registry spec v1 five-dimension evidence; adp-list yml fields/enums/descriptions; dsh-catalog entry constraints (install commands forbidden, truncation heuristics); the omdsh `dshWorkshop` activation five values; the dsh-plugin-kit three gates (license / five-language README / the three seam roles, preferring the kit's official CLI) |

### Exit-code contract

| Code | Meaning | Introduced |
|---|---|---|
| `0` | no fail/error (warn/skip allowed), and every requested group really ran | 0.1.x |
| `1` | fail/error present (a plugin defect) | 0.1.x |
| `2` | usage error, unknown group, **unknown option** | 0.1.x |
| `3` | infrastructure error (missing npm/pnpm and the like) | **0.2.0** |
| `4` | unsupported host version (the host itself failed to install; **not** a plugin verdict) | **0.2.0** |
| `5` | unstable result (a step timed out or was killed by a signal) | **0.2.0** |
| `6` | **degraded**: a requested group never really ran (e.g. no source files to scan) | **0.2.0** |

**Guarding against silent passes** (two layers):

1. If even one group name in `--only` fails to match → immediately `2`. Versions 0.1.4 and earlier would "check nothing + exit 0" when a group name was mangled, which once turned the CI gates of 35 repos into false green (measured 2026-09-09: `checks_run=0`, `exit=0`).
2. From 0.2.0: **a requested group whose checks all skipped → `6`**. The old implementation only covered "not a single check ran", not "it ran but everything skipped" — the latter let "K group with zero coverage" count as a pass. To accept that explicitly, use `--allow-degraded` (exit code drops to 0, but `degraded` stays non-empty in the JSON).

> ⚠️ The existing gates in 41 family repos **do not read the exit code** (their workflows use `set +e` / `out="$(…)"` / `set -e`) and only parse the `R0 ` / `K1 ` prefixes on stdout and `results[].name` in the JSON. So 0.2.0's new exit codes **change nothing for those pipelines**; they serve interactive use and future integrators.

### Host half: `plugin_doctor` / `/doctor`

Installed as a bundle, the plugin registers the same R/K/X checks as a read-only tool and a command. Two things differ from the CLI, and both are stated in the reply because **the host half has no exit code** — the returned report is the whole message:

- **Degraded runs say so.** When a requested group never really ran, the reply carries the same degradation warning line the CLI prints, naming the groups, so a degraded reply can never be read as a pass. Before 0.7.1 the renderer dropped that fact, so a degraded reply was indistinguishable from a run with nothing to do.
- **`workspace` is resolved from the repository, not from the install.** The tool walks up from the repository under check to the nearest directory holding two or more DSH plugin repos (`DSH_WORKSPACE` and the explicit parameter win over it). Resolving it as `import.meta.dirname/..` — as 0.7.0 did — yields `<profile>/node_modules` (or `…/@perrylink`) once the package is installed as a bundle, which is not a workspace at all: CC1–CC4 then report "not present locally" for registries that do exist, and K14 never finds a sibling. When no workspace can be located the reply says so explicitly, instead of letting those skips read as absent registries.

See [Configuration](#configuration) for the parameters and defaults.

### Target shapes and coverage

`--repo` may be a **source tree** or an **installed package directory / unpacked tarball artifact** (the latter is common at `node_modules/<pkg>`). The criteria change with the shape:

| Shape | K group (Cordis contract) | Notes |
|---|---|---|
| Source tree with `src/` | scans `src/**` plus root-level JS (`mode: src`) | complete |
| **No `src/`, `main` points at `lib/`** | **fallback scan of `lib/**` (`mode: lib-fallback`)** | fixed in 0.2.0: the old implementation keyed on "no build script", but published packages **keep** their build script → the fallback never fired, all nine K checks were skipped, and it still exited 0 (false green) |
| Neither `src/` nor `lib/` | all nine skipped (`mode: none`) | **the whole group never really ran → exit code 6**, no more false green |

Coverage is written to `coverage.K` in the JSON (`{filesInspected, mode}`) and summarised in `groups.K`.

### `--only` groups and ASCII aliases

| Alias | Full group name | Contents |
|---|---|---|
| `R` | static · package structure | R0–R8 |
| `K` | static · Cordis contract scan | K1–K16 |
| `D` | dynamic · sandbox smoke | D0–D3, D9 |
| `CC` | ecosystem · directory listings | CC1–CC5 |

Aliases are case-insensitive, and the Chinese full names still work. **Use the aliases in workflows**: if an editor or script round-trips a Chinese group name through the wrong encoding, `--only` matches no group at all.

### The three-value contract view (`--format check`)

`--format check` emits the ecosystem's common three-value contract (`PASS`/`WARN`/`FAIL`, exit `0`/`1`/`2`, flat `checks[]`) instead of this project's richer envelope, so another checker or Action can consume the result directly. It is a *view*: it never changes whether a project passes, and a `skip` is never rendered as `PASS` (it becomes `WARN` with `skipped: true`). The full semantics stay in a `doctor` side field. See `SPEC.md` §1.1 — those three properties are normative and `tests/compat.mjs` asserts them.

### Examples

**Detailed example** — command `node doctor.mjs --repo . --no-smoke --only R,K`, output:

```text
== 静态·包结构 ==
[PASS] R0 基础字段（name/version/license/README/type）
    基础字段齐全
[PASS] R1 激活门 dsh.bundle.patch [关键]
    dsh.bundle.patch = ./cordis.patch.yml
```

*Observed from `doctor.mjs` (Usage); `lib/framework.mjs:121` (render)*

**Failure branch** — input:

```text
node doctor.mjs --repo . --only NOPE --no-smoke
```

Output:

```text
未知分组: NOPE
可用分组: 静态·包结构（R）, 静态·cordis 契约扫描（K）, 动态面·宿主契约（X）, 生态·集合站清单（CC）
```

*Observed from `doctor.mjs:196-206`; `tests/selftest.mjs:95`*

**Brief examples**: `--only R,K` · `--json -` · `--format check`

### Where the criteria come from

- **harness side**: `docs/user/develop/basic/publish.md`, `apps/cli/src/plugin.ts` (the activation gate is the only switch), `packages/bundle/headless/README.md` (the MISSING_CREDENTIAL criterion), Releases (the 0.1.2-rc.1 / 0.1.3-alpha.1 changes), `@deepseek-ai/dsh-loader-smoke` (the official "temporary DSH_HOME + expected exit code" pattern).
- **Cordis side**: the cordiverse/cordis v4 source (registry/fiber/reflect/events.ts) + the DSH cordis-primer/tutorial docs + the v3 `@cordisjs/core@3.10.2` d.ts diff (the 3.x→4.x blacklist).
- **ecosystem side**: the dsh-plugin-certification spec v1, adp-list `entries.mjs`/`check-submission.mjs`, dsh-catalog `validate.mjs`/`deploy.yml` live smoke, omdsh build-submission, dsh-plugin-kit `verify/*`.

## Verified badges

There are **two badge paths**, and they make different claims. Pick the one whose claim you can actually back. **[`FOR-ADOPTERS.md`](FOR-ADOPTERS.md) is the step-by-step version of this section** — the exact file to copy, the exact badge markdown, what each verdict means, and what this check does *not* prove.

### Path A — self-serve gate badge (no permission needed, no author involvement)

This badge makes **one narrow, checkable claim**: *the repository runs dsh-clinic's static R+K gate in its own CI, and that workflow is green on the repository's default branch.* It is rendered directly from your own workflow's status — GitHub's native badge (shown) or shields.io — so it needs no registry entry, no pull request, no token from anyone, and it cannot be broken by this project's infrastructure:

```markdown
[![dsh-doctor R+K](https://github.com/<owner>/<name>/actions/workflows/plugin-doctor.yml/badge.svg)](https://github.com/PerryLink/dsh-clinic/blob/main/SPEC.md)
```

Replace `<owner>/<name>` (and `branch=` if your default branch is not `main`). The link target is `SPEC.md` — the criteria you are claiming to meet, and an explicit statement of who authored them.

**Use Path A.** It is the whole standard, self-serve, and it is what this specification is designed for. It requires nothing of this project.

Two honest caveats about Path A: the badge reflects *your* workflow, so it is only as trustworthy as your CI configuration — it is not verified by anyone else; and if you use the shields.io form, shields.io learns your repository name.

### Path B — author-issued audited badge

Wearing this badge means exactly one auditable thing: **the repo runs dsh-clinic's static R+K gate (23 checks: R0/R1/R3/R5/R6/R7/R8 + K1–K16) in its own CI, and that gate is green on the current HEAD of the default branch**, *as re-checked by this project's auditor*. It is **not** a certification badge: no Scorecard, no provenance, no install smoke. R2 (tarball integrity) and R4 (entry contract) read the built `lib/`, and building most family repos needs `HARNESS_COMMIT` + `gen-aliases` to pass — those two are covered by each repo's own `ci.yml` (build-drift gate + pack smoke) and are deliberately outside this gate.

```markdown
[![dsh-doctor](https://raw.githubusercontent.com/PerryLink/dsh-clinic/main/badges/PerryLink__dsh-github.svg)](https://github.com/PerryLink/dsh-clinic/blob/main/README.en.md#verified-badges)
```

**Path B is a centralized, single-operator service and should be treated as such.** It needs a fine-grained PAT with cross-repository read access, stored as the `DOCTOR_AUDIT_TOKEN` repository secret. The workflow-scoped `GITHUB_TOKEN` **cannot** substitute for it: it carries no cross-repository read permission, so GitHub treats it as an anonymous caller limited to 60 requests/hour, while a full audit of the declared repos needs 200+. Without the PAT, every badge renders grey `NO DATA` — the failure looks like a broken badge program rather than a missing secret. This has happened (once as `401`, then as `403 rate limit exceeded`), and it is the reason Path A exists and is recommended. `scripts/verify.mjs` now stops at the first such response, exits `3`, and writes a registry whose reasons name the real cause instead of emitting the same rate-limit line for every repo.

- The registry `data/verified.json` is the single source of truth for Path B, refreshed by `scripts/verify.mjs` (originally driven by a daily + on-push workflow; this repo currently keeps only the smoke workflow, and the refresh script remains). A refresh only reads the GitHub API: it parses each repo's HEAD `plugin-doctor.yml` gate configuration (which must pin `dsh-clinic@<version>`, use a working `--only` argument, and self-verify that R0/K1 actually ran), then checks the conclusion of that HEAD's `plugin-doctor` workflow run. **This repo's CI never clones, installs or executes any third-party code.**
- Badge appearance: the visual language follows the two newer badges in the ecosystem (`dsh.directory`'s monospace-uppercase + letter-spacing + mark + gradient, and `awesome-dsh-plugin`'s seal block) — **a silver/platinum metallic left segment, a shield tick mark, and ink-blue monospace uppercase**, with the right segment a **solid GitHub-convention status colour** (green/orange/red/grey) carrying a monospace uppercase status word, and the status additionally expressed by a **path-drawn icon** (✓ / ! / ✕ / –) so it stays readable with colour-vision deficiency. 5px corner radius + 1px stroke; **the stroke is required** — without it the silver left segment disappears against a white README background.
- Four states (value text uses the shields / GitHub Actions conventional words): `passing` (green: the HEAD run succeeded) / `warning` (orange: HEAD has not run yet, a run is still queued, or a gate precondition is missing) / `failing` (red: the HEAD run failed, or the gate configuration does not hold — including a "fake gate" whose `--only` argument is doubly mis-encoded) / `no data` (grey: the API query failed). The badge is **dynamic**: once it stops passing it turns red. The precise R+K scope lives in this section and in the registry's `meaning` field, not in the badge text (the badge links back here).
- To join Path B: open a PR against `data/verified-repos.json` adding `{ "repo": "<owner>/<name>", "package": "<npm package name>" }`, and add `plugin-doctor.yml` to your own repo; the entry must pass the audit above. **Path A needs none of this.**
- **The gate file is shipped, not scraped.** Copy [`plugin-doctor.yml`](plugin-doctor.yml) — the canonical, ready-to-use workflow — to `.github/workflows/plugin-doctor.yml` in your repository and adjust the pin. It is also inside the npm tarball, so `npx dsh-clinic` users can read the shipped copy instead of reconstructing the step from this README. Group names use the **ASCII aliases `R,K`** (supported since 0.1.5, keeping file and command line pure ASCII), and the tail self-verifies that R0/K1 really ran.

> Why the gate installs and builds nothing, and why this repo does not run the badge itself: the static R/K checks read only the committed tree (no dependencies needed), whereas `npm run build` fails in an environment without the harness aliases, and its prebuild wipes the committed `lib/`, manufacturing a false red. Concentrating third-party dependency installs into this repo's CI, on the other hand, would be a supply-chain risk. So the gate runs inside each repo's own CI against the committed tree, and this repo only audits and issues the Path B badge.

## Measured data

These numbers come from **real runs**, not marketing charts. The first static R+K scan of third-party (non-PerryLink) plugins (2026-09-10, 0.2.0): **60 candidates → 20 plugins that really declare `dsh.bundle.patch` → 10 passed / 10 failed under the 16-check gate**. A re-scan of the same qualified set on 2026-09-23 with 0.3.0: **20 candidates re-scanned → 19 qualified → 6 passed / 13 failed / 0 degraded / 1 clone failure**; gated failure histogram `{"R8":9,"R3":5,"R7":3}`. **No repository regressed because of the R3/R7 fixes** — the headline movement is entirely `R8`: the minimum peer line moved on, and repos still pinning `0.1.0-rc.6` are now measurably behind. Read `R8` as **staleness, not breakage**. The full method, the per-repo table, the reproduce commands, and the correction channel are in [`THIRD-PARTY-RK-SCAN.md`](THIRD-PARTY-RK-SCAN.md); the 2026-09-10 machine-readable baseline is `data/rk-scans.json`.

**It is not a certification, not a rating, and says nothing about a plugin's security**: a pass means only that "the 23 static checks reported no failure on that commit". Method: read-only clones, **zero execution** of third-party code, R2/R4 listed separately and not gated; `lib-fallback` coverage is real but not equivalent, and K3–K7 may under-report. Any repository named in the report can open an issue through the correction channel and the row is re-run and amended in place with equal prominence.

## Configuration

`dsh-clinic` has **no Config schema** of its own — the tunables are the CLI flags and the host half's six tool parameters. The defaults are CI-ready; an offline static gate needs only `--only R,K --no-smoke`.

Common CLI flags:

| Flag | Default | Meaning |
|---|---|---|
| `--repo <path>` | required | plugin repository path (source tree, or an installed package directory / unpacked tarball artifact) |
| `--only <groups>` | all | run only the named groups: `R`, `K`, `D`, `CC` (case-insensitive ASCII aliases; the Chinese full names also work) |
| `--no-smoke` | off | skip the dynamic sandbox smoke; static checks and listings only (offline/CI static gate) |
| `--dsh <version>` | peer floor | host version used by the smoke; defaults to the npm latest released line |
| `--json <path>` | — | write the report to a file; `-` means stdout (suppresses the human-readable report) |
| `--format check` | doctor | three-value contract view (PASS/WARN/FAIL + 0/1/2, flat `checks[]`) |
| `--workspace <root>` | auto | family workspace holding the sibling repos (for CC1–CC5 and K14) |
| `--allow-degraded` | off | explicitly accept "the whole group never really ran"; default is exit 6 |
| `--no-nested-activation` | on | disable K15 (nested activation spec) |
| `--no-thinking` | on | disable K16 (temperature/top_p misuse under thinking mode) |

<details>
<summary>Host-half parameters (<code>plugin_doctor</code> / <code>/doctor</code>)</summary>

| Parameter | Default | Meaning |
|---|---|---|
| `repo` (required) | — | plugin repository path (needs `package.json`) |
| `smoke` | `false` | also run the D-group sandbox smoke (needs network + pnpm) |
| `host` | `true` | run the X group (host-contract checks); degrades when no dsh install is readable |
| `workspace` | auto | family workspace directory (the parent holding several `dsh-*` plugin repos) for CC1–CC5 and K14; resolved upward from the repository by default, and `DSH_WORKSPACE` also works |
| `nestedActivation` | `true` | run K15; the CLI equivalent is `--no-nested-activation` |
| `thinking` | `true` | run K16; the CLI equivalent is `--no-thinking` |

</details>

Full command surface (maintenance flags such as `--purge` are not in the table above):

```powershell
node doctor.mjs --repo <plugin-repo-path>       # full run (includes dynamic smoke; needs network + pnpm)
node doctor.mjs --repo <path> --no-smoke        # static + listings only
node doctor.mjs --repo <path> --dsh 0.2.2-alpha.3 # smoke host version (defaults to the npm latest released line)
node doctor.mjs --repo <path> --only R,K        # only the two static layers (ASCII aliases recommended)
node doctor.mjs --repo <path> --json report.json
node doctor.mjs --repo <path> --json -          # JSON to stdout (suppresses the human-readable report)
node doctor.mjs --repo <path> --format check --json -   # ecosystem three-value contract view (PASS/WARN/FAIL + 0/1/2)
node doctor.mjs --repo <path> --workspace <workspace-root>   # workspace holding the sibling repos (used by the CC group)
node doctor.mjs --repo <path> --allow-degraded  # explicitly accept "the whole group never really ran" (default exit 6)
node doctor.mjs --purge <quarantine-dir>        # clean up quarantine dirs this tool created (doctor-quarantine-* only)
```

## FAQ

<details>
<summary>Does it touch my repository or environment?</summary>

No. Static R/K/CC read only the committed tree — no dependency install, no execution of the code under test; the third-party scan is a read-only clone. The D group keeps its temporary `DSH_HOME`/`DSH_AGENTS_HOME` inside a self-made `%TEMP%` sandbox (prefix `doctor-`, which **does not overlap** the host-protected `%TEMP%\dsh-*` template), and `dsh plugin add` is always passed `--ignore-scripts`, so the tested package's install/prepare scripts never execute on the host. At the end the run **quarantines instead of deleting** (renames to `%TEMP%\doctor-quarantine-*`), and removal is left to `--purge` after a human confirms. Absolute paths seen at runtime are placeholder-ised to `<path>` before they reach the JSON or the rendered text.

</details>

<details>
<summary>Is a PASS a certification or security rating?</summary>

No. A pass means only that "the requested static checks raised no failure on that commit". The K group is a **heuristic static scan** — complex wrappers can be missed and false alarms are possible; D3 only proves the composition boots as far as a model request, not that the tool schemas are valid or the business logic correct; an `R8` failure reads as "stale peer line", not "broken plugin". This tool runs no security audit, and the `dsh.standards` block is a `not-run` placeholder, not a pass.

</details>

<details>
<summary>How do I run it in CI? Does it need network?</summary>

The static gate needs no network: `npx --yes dsh-clinic@0.8.1 --repo . --no-smoke --only "R,K"`, then branch on the exit code or the JSON. Only the D-group smoke needs network and pnpm. The full action is in [`plugin-doctor.yml`](plugin-doctor.yml): it reads only the committed tree, self-verifies that R0/K1 really ran, and lists R2/R4 separately instead of gating on them (they read built artifacts).

</details>

<details>
<summary>Can a degraded or skipped run produce a false green?</summary>

No. An unmatched group name in `--only` → immediately exit 2; a requested group that never really ran → exit 6; in `--format check` a skip is never rendered as `PASS` (it becomes `WARN` with `skipped: true`). If you really want to accept degradation, use `--allow-degraded` — the exit code drops to 0, but the JSON's `degraded` stays non-empty and the host half names the groups in its reply.

</details>

<details>
<summary>Why is there still a dsh-plugin-doctor on npm?</summary>

Because that is a different project. This repository was renamed from `@perrylink/dsh-plugin-doctor` to `dsh-clinic`; the bare npm name `dsh-plugin-doctor` (0.1.1) belongs to Xrainsmile/DSH-Plugin-Doctor, so `npx dsh-plugin-doctor` executes someone else's package. Use `npx dsh-clinic@<version>` (or `dsh plugin add dsh-clinic`). The old scoped package and the old GitHub repo remain as pointers.

</details>

## Security boundaries

- **Static and read-only.** R/K/CC and the third-party scan only read the filesystem; nothing writes to the repository under check outside tests. The only writes are this tool's own `%TEMP%` sandbox and quarantine directories.
- **One-shot sandbox.** The D group's temporary `DSH_HOME`/`DSH_AGENTS_HOME` live under `%TEMP%\doctor-*` and never touch the real `~/.dsh` (red line 3).
- **No install scripts from the tested package.** `dsh plugin add` explicitly passes `--ignore-scripts`; a pnpm `ignored-builds` block is classified as `environment` (counts neither as a pass nor as a plugin defect).
- **Quarantine, not delete.** Every step's subprocess stdout/stderr is written to `%TEMP%\doctor-run-*\logs\`; at the end the run renames it to `%TEMP%\doctor-quarantine-*`, prints that path in the report tail, and leaves removal to `--purge` after a human confirms (red line 4, the three-stage rule).
- **Path redaction.** Absolute paths seen at runtime become `<path>` before they enter the JSON or the rendered text, so a report can be committed into someone else's repo without tripping its path-leak gate.
- **Fail closed, no false green.** Unknown group/unknown option → 2; a whole group that never ran → 6; degradation must be accepted explicitly with `--allow-degraded`; a `skip` is never written as `pass`.

## Known limitations

- The K group is a **heuristic static scan**: K1/K3/K4 miss complex wrappers and can also raise false alarms — every warn-level finding needs a human look and never condemns a plugin automatically.
- D3 only proves that "the composition boots as far as a model request"; it **does not prove the tool schemas are valid or the business logic correct** (that needs a keyed e2e run or a mock LLM).
- A pnpm `ignored-builds` block is an environment-recipe problem: when D1 hits it, the check degrades to warn and prints the `compat.yml` `allowBuilds` recipe, matching the certification spec v1's environment-blocked line, and it never counts as a plugin defect.
- npm-line hosts (0.1.2-rc.1) have no engines/peerDependencies enforcement in their packument, so R6 is advisory there.
- A measured trap in this environment: a `$` anchor (without the `m` flag) does not match the position before a lone trailing `\r`, so parsing CRLF text must split on `/\r?\n/` (already handled internally — do not regress it).
- **Standards crosswalk.** R/K/D — with X as supplementary evidence — map only onto the **DSH-ENTRY** compatibility baseline; the JSON envelope now carries an additive `standards` field (`dsh-levels/1`). DSH-FLOW (`J1–J8`) is `manual` and DSH-BOOST (`LEV-1..LEV-8`) is `not-measured` — this tool runs no user journeys and no benchmarks — and the levels are not an official DeepSeek standard. See [`STANDARDS.md`](STANDARDS.md) and `data/standards.json`.

## Compatibility

| Surface | Status |
|---|---|
| Harness | DeepSeek Harness `dsh-v0.2.2-alpha.3` (baseline updated 2026-11-03; zero-dependency and host-agnostic by design: `package.json` declares no `@deepseek-ai/dsh-*` dependency and no peer range at all, so this repository's `R5`/`R8` skip deliberately instead of passing — see `SELF-CHECK.md`; the line is recorded in `CHANGELOG.md` §0.4.6, "host pins move to `0.2.1-alpha.1`", and the D-group sandbox smoke takes its host from `--dsh`, default the peer floor `0.1.2-rc.1`) |
| Node | `>=24.9.0` |

## Ecosystem & quality

- [dshfind plugin page](https://dshfind.com/plugins/PerryLink/dsh-clinic) (installs and ranking)
- [Ecosystem knowledge base](https://perrylink.github.io/dsh-plugin-guide/): plugin development guide · plugin-selection data · maintenance criteria
- [dsh-standards repository](https://github.com/PerryLink/dsh-standards): the family standard this tool's criteria are crosswalked against
- [Third-party R+K scan report](THIRD-PARTY-RK-SCAN.md): 60 candidates → 20 qualified plugins → 10 pass / 10 fail (2026-09-10); re-scan on 2026-09-23: 19 → 6 pass / 13 fail
- **Honest status**: 43 family repos already ship the gate (the registry `data/verified-repos.json` currently lists 40; the gate template was unified byte-for-byte on 2026-09-23/24); **there are no external adopters yet** — adoption, not catalogue coverage, is what limits this project (reasoning in [`OUTREACH.md`](OUTREACH.md) §C4). Releases go out through npm Trusted Publishing (OIDC), with no long-lived token. Every 0.2.0 change is additive, verified against the 37-repo baseline with diffs = 0.
- **1024 store channel**: `npm i -g dsh1024` once, then `dsh1024 plugin --profile web add dsh-clinic` (counts toward the [deepseek1024.com](https://deepseek1024.com) install ranking)

## Development

```sh
npm install
npm test                      # syntax checks + 14 self-tests + contract/drift/compat suites
npm run check:readmes         # five-language README consistency gate (A mode)
npm run test:host-surface     # host service-surface data matches the 0.2.2-alpha.3 baseline
npm run check:cross-repo      # monthly K14 cross-repo gate (stages the family from published tarballs)
node scripts/check-release-health.mjs --repo . --no-registry   # release health (offline)
npm run verify:registry       # Path B registry and badge refresh (read-only GitHub API)
npm run badge                 # re-render the verified SVG
```

### Repository layout

```text
doctor.mjs               CLI entry (group orchestration, exit codes, JSON report)
plugin.mjs               host half (plugin_doctor tool + /doctor command)
cordis.patch.yml         bundle declaration (inserts one row; no config keys)
lib/framework.mjs        check registration/run/verdict/rendering (zero dependencies)
lib/util.mjs             temporary sandbox + subprocess execution (stdout/stderr to disk, avoiding pipe-capture limits)
lib/workspace.mjs        family workspace resolution
lib/checks-package.mjs   static · package structure R0–R8
lib/checks-cordis.mjs    static · Cordis contract K1–K16
lib/checks-runtime.mjs   X host-contract checks
lib/checks-smoke.mjs     dynamic · sandbox smoke D0–D3, D9
lib/checks-collections.mjs  ecosystem · directory listings CC1–CC5
tests/selftest.mjs       14 real-CLI self-tests (the 7 existing exit-code-contract cases byte-identical, plus 7 new degraded/usage-guard cases)
tests/contract.mjs       31 contract tests (freezing the 5 observables the existing 37-repo CI depends on)
scripts/check-readme-sync.mjs  five-language README gate (A mode: Chinese main + English)
scripts/verify.mjs       verified registry and badge refresh (reads the GitHub API to audit each repo's gate)
scripts/badge.mjs        verified SVG rendering
scripts/check-cross-repo.mjs    monthly K14 cross-repo gate (stages the family from published tarballs)
scripts/check-release-health.mjs release health (version carriers, registry, provenance, tarball)
scripts/gen-readme-assets.py     programmatic README images (Python + Pillow)
data/verified-repos.json verified declaring repos
data/verified.json       verified registry
badges/                  verified badges
THIRD-PARTY-RK-SCAN.md   third-party static R+K scan result set (public report)
data/rk-scans.json       machine-readable form of that scan (2026-09-10 baseline)
SURVEY.md                the full-channel detection methodology plus every criterion's source
SPEC.md                  the normative verification criteria (authored by PerryLink)
GOVERNANCE.md            authorship, spec versioning, and what attribution is asked vs required
NOTICE                   Apache-2.0 attribution notice (must travel with redistributions)
CITATION.cff             citation metadata
plugin-doctor.yml        the canonical CI gate, shipped ready to copy into your repo
FOR-ADOPTERS.md          the adopter's landing page: gate, badge, verdicts, limits
SELF-CHECK.md            this tool's own result against its own criteria
OUTREACH.md              adoption notes: channel states, positioning, actions
```

### Release health

A green release workflow does not prove a correct release. On 2026-10-05 the family shipped 37 packages and the failures that mattered were invisible in the job colour: 36 CHANGELOGs carried the literal date `undefined`, two packages published successfully and still ended red, one failed `ENEEDAUTH` because npm's trusted-publisher binding named a workflow file that no longer performs the OIDC exchange, and one never reached npm at all because its pre-publish `verify` gate failed first and the publish job was `skipped`.

`scripts/check-release-health.mjs` checks the four things that cover all of those:

| Pass | Question | Needs network |
|---|---|---|
| LOCKSTEP | does every version carrier in the repo agree with `package.json`? | no |
| PUBLISHED | is the local version the one on the registry? | yes |
| PROVENANCE | which workflow file published it, and is that a current publish file? | yes |
| FILES | does the published tarball still carry `src/`, `lib/` or `dist/`? | yes |

```sh
# one repository, offline (the mode a downstream repo should use in its own CI)
node scripts/check-release-health.mjs --repo . --no-registry

# the whole declared family, from the registry, without checking any of it out
node scripts/check-release-health.mjs --roster data/verified-repos.json
```

Exit codes: `0` healthy, `1` at least one problem, `2` usage error. `--json <path>` writes the machine-readable report, `--quiet` prints only failures. Both commands can be wired into your own CI.

Only two carrier shapes fail the check, because only two are asserted family-wide: `src/version.ts`'s exported `VERSION`, and a `VERSION` file where one exists. A `SKILL.md` version difference is reported as a note — most skills version independently.

### Regenerating the images

`docs/assets/dsh-clinic-hero-{zh,en}-{light,dark}.webp` and `docs/assets/dsh-clinic-flow-v5-{light,dark}.svg` are generated programmatically by [`scripts/gen-readme-assets.py`](scripts/gen-readme-assets.py) (Pillow for the hero, hand-written SVG for the structure figure; a missing font aborts with an error). The hero ships in zh/en; the structure figure contains command tokens only (group names, commands, exit codes) and is shared by all five languages. Re-run:

```sh
python scripts/gen-readme-assets.py
```

This repository has no benchmark data, so no evidence bar chart is generated; the measured numbers above are quoted directly from the scan report.

## Family & thanks

This project is part of the DeepSeek Harness plugin family from [PerryLink](https://github.com/PerryLink) (95 plugins, all Apache-2.0). If it is useful, **a star helps the next person find it** — nothing is gated behind it.

### Authorship of the criteria

The verification criteria — not only the tool that implements them — were authored by **PerryLink** (<https://github.com/PerryLink>). Their normative text is [`SPEC.md`](SPEC.md), and this repository is the canonical source for both the specification and the reference implementation. See [`GOVERNANCE.md`](GOVERNANCE.md) for how the criteria change and for what attribution is requested (versus required by Apache-2.0 §4(d) via [`NOTICE`](NOTICE)).

Adopting the gate needs no permission. If you adopt it, please keep the criteria attributed to PerryLink and do not present them as your own standard.

<details>
<summary>Expand all plugins</summary>

| Plugin | Status |
|---|---|
| **[dsh-aqua-input-check](https://github.com/PerryLink/dsh-aqua-input-check)** |  |
| **[dsh-archive-check](https://github.com/PerryLink/dsh-archive-check)** |  |
| **[dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)** |  |
| **[dsh-autotier](https://github.com/PerryLink/dsh-autotier)** | 🧊 FROZEN — see the repo README |
| **[dsh-bid-ca-precheck](https://github.com/PerryLink/dsh-bid-ca-precheck)** |  |
| **[dsh-bid-qual-check](https://github.com/PerryLink/dsh-bid-qual-check)** |  |
| **[dsh-cert-mcp](https://github.com/PerryLink/dsh-cert-mcp)** | 🧊 FROZEN — see the repo README |
| **[dsh-checkpoint-rewind](https://github.com/PerryLink/dsh-checkpoint-rewind)** |  |
| **[dsh-click](https://github.com/PerryLink/dsh-click)** |  |
| **[dsh-composer-history](https://github.com/PerryLink/dsh-composer-history)** |  |
| **[dsh-contract-stance](https://github.com/PerryLink/dsh-contract-stance)** |  |
| **[dsh-customs-doc-check](https://github.com/PerryLink/dsh-customs-doc-check)** |  |
| **[dsh-data-quality](https://github.com/PerryLink/dsh-data-quality)** | 🧊 FROZEN — see the repo README |
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
| **[dsh-memento](https://github.com/PerryLink/dsh-memento)** | 🧊 FROZEN — see the repo README |
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
| **[dsh-plugin-kit](https://github.com/PerryLink/dsh-plugin-kit)** | 🚫 RETIRED (repo archived) |
| **[dsh-plugin-upgrade](https://github.com/PerryLink/dsh-plugin-upgrade)** | 🚫 RETIRED (repo archived) |
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
| **[dsh-score](https://github.com/PerryLink/dsh-score)** | 🧊 FROZEN — see the repo README |
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
| **[dsh-ticktick](https://github.com/PerryLink/dsh-ticktick)** | 🚫 RETIRED (repo archived) |
| **[dsh-translate](https://github.com/PerryLink/dsh-translate)** |  |
| **[dsh-warranty-calc](https://github.com/PerryLink/dsh-warranty-calc)** |  |
| **[dsh-budget](https://github.com/PerryLink/dsh-budget)** | 🧊 FROZEN — see the repo README |
| **[dsh-claude-move](https://github.com/PerryLink/dsh-claude-move)** | 🧊 FROZEN — see the repo README |
| **[dsh-defend](https://github.com/PerryLink/dsh-defend)** | 🧊 FROZEN — see the repo README |
| **[dsh-draw](https://github.com/PerryLink/dsh-draw)** | 🧊 FROZEN — see the repo README |
| **[dsh-reach](https://github.com/PerryLink/dsh-reach)** | 🧊 FROZEN — see the repo README |
| **[dsh-background-agents](https://github.com/PerryLink/dsh-background-agents)** | 🚫 RETIRED (repo archived) |
| **[dsh-session-pin](https://github.com/PerryLink/dsh-session-pin)** | 🚫 RETIRED (repo archived) |
| **[dsh-team-rooms](https://github.com/PerryLink/dsh-team-rooms)** | 🚫 RETIRED (repo archived) |
</details>

## License

[LICENSE](LICENSE) (Apache License 2.0) © 2026 dsh-clinic contributors

<p align="center"><sub>Apache-2.0 · Community tool, not affiliated with DeepSeek.</sub></p>
