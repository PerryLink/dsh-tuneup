// 宿主迁移检查的命中/不命中/开关测试（K15、K16 与 X4 的方法调用扫描）。
//
// 为什么单开一份：这三条判据都是"文本扫描 + 行号"，而 tests/contract.mjs 只跑
// 干净 fixture 的计数断言，tests/selftest.mjs 只跑退出码。命中路径若不被断言，
// 一个正则写错（或把 `request:` 写成 `request`）会让检查永久静默 pass ——
// 这正是本工具存在的"假绿"形态。
//
// 用法: node tests/checks-migrations.mjs
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { REMOVED_SEAM_BY_NAME } from '../lib/removed-seams.mjs'

const ROOT = path.resolve(import.meta.dirname, '..')
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'doctor-migrations-'))
const HOST_FLAT = path.join(sandbox, 'host-flat')
const HOST_OLD = path.join(sandbox, 'host-old')
for (const [dir, version] of [[HOST_FLAT, '0.2.2-rc.3'], [HOST_OLD, '0.2.1-rc.4']]) {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({ name: '@deepseek-ai/dsh', version }) + '\n')
}

const checks = []
const assert = (name, cond, detail = '') => checks.push({ name, ok: !!cond, detail })

function makeRepo(name, source) {
  const dir = path.join(sandbox, name)
  fs.mkdirSync(path.join(dir, 'src'), { recursive: true })
  fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify({
    name: `dsh-${name}-fixture`,
    version: '1.0.0',
    type: 'module',
    main: 'src/index.ts',
    license: 'Apache-2.0',
  }, null, 2) + '\n')
  fs.writeFileSync(path.join(dir, 'src', 'index.ts'), source)
  return dir
}

const NESTED = `export const name = 'dsh-nested-fixture'
export const inject = ['subagents']
export function apply(ctx) {
  return ctx.subagents.startActivation({
    provider: 'spawn',
    label: 'x',
    request: {
      prompt: [{ type: 'text', text: 'hi' }],
      parent: null,
      signal: null,
    },
  })
}
`

const FLAT = `export const name = 'dsh-flat-fixture'
export const inject = ['subagents']
export function apply(ctx) {
  return ctx.subagents.startActivation({
    provider: 'spawn',
    label: 'x',
    prompt: [{ type: 'text', text: 'hi' }],
    parent: null,
    signal: null,
  })
}
`

const THINKING = `export const name = 'dsh-thinking-fixture'
export const inject = ['llm']
export function apply(ctx) {
  void ctx.llm.generate({
    provider: 'deepseek',
    model: 'deepseek-chat',
    temperature: 0.2,
    messages: [],
  })
}
`

const REASONING = `export const name = 'dsh-reasoning-fixture'
export const inject = ['llm']
export function apply(ctx) {
  void ctx.llm.generate({
    provider: 'deepseek',
    model: 'deepseek-chat',
    reasoningEffort: 'high',
    temperature: 0.2,
    messages: [],
  })
}
`

const METHODS = `export const name = 'dsh-methods-fixture'
export const inject = ['subagents']
export function apply(ctx) {
  void ctx.subagents.start({ provider: 'spawn' })
  void ctx.subagents.startContinuable({ provider: 'spawn' })
}
`

const METHODS_FLAT = `export const name = 'dsh-methods-flat-fixture'
export const inject = ['subagents']
const NOTE = 'ctx.subagents.start() was removed; use startActivation()'
export function apply(ctx) {
  void ctx.subagents.startActivation({ provider: 'spawn', label: 'x', prompt: [{ type: 'text', text: 'hi' }], parent: null, signal: null })
}
`

const nested = makeRepo('nested', NESTED)
const flat = makeRepo('flat', FLAT)
const thinking = makeRepo('thinking', THINKING)
const reasoning = makeRepo('reasoning', REASONING)
const methods = makeRepo('methods', METHODS)
const methodsFlat = makeRepo('methods-flat', METHODS_FLAT)

/**
 * @param {string} repo
 * @param {string[]} args
 * @returns {{exit:number, report:any, stdout:string, stderr:string}}
 */
function run(repo, args) {
  const r = spawnSync(process.execPath, ['doctor.mjs', '--repo', repo, '--no-smoke', ...args, '--json', '-'], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  })
  let report = null
  try { report = JSON.parse(r.stdout) } catch { report = null }
  return { exit: r.status, report, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
}

const item = (report, id) => (report?.results ?? []).find((x) => x.id === id)

/** Human-readable run (no --json): used only for the [STATUS] line assertions. */
function runHuman(repo, args) {
  const r = spawnSync(process.execPath, ['doctor.mjs', '--repo', repo, '--no-smoke', ...args], {
    cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  })
  return { exit: r.status, stdout: r.stdout ?? '', stderr: r.stderr ?? '' }
}

// ── REMOVED_SEAMS：两个 subagent 方法必须在表里（X4 才能证明移除）────────
for (const name of ['subagents.start', 'subagents.startContinuable']) {
  const seam = REMOVED_SEAM_BY_NAME.get(name)
  assert(`${name} 在 REMOVED_SEAMS 表中且 kind=method`, seam?.kind === 'method', `实际 ${JSON.stringify(seam)}`)
  assert(`${name} 指向 startActivation() 且带官方出处`,
    /startActivation/.test(seam?.replacement ?? '') && /docs\/upgrade-guide\/v0\.2\.1-alpha\.1\/subagent-activations\/guide\.md/.test(seam?.source ?? ''),
    `replacement=${seam?.replacement} source=${seam?.source}`)
}

// ── K15：嵌套 activation spec ─────────────────────────────────────────────
{
  const hit = run(nested, ['--only', 'K', '--dsh-install', HOST_FLAT])
  const k15 = item(hit.report, 'K15')
  assert('K15 命中嵌套 request → warn', k15?.status === 'warn', `实际 ${k15?.status}`)
  assert('K15 消息含官方迁移关键词与行号',
    /嵌套/.test(String(k15?.message)) && /request/.test(String(k15?.message))
      && /startActivation/.test(String(k15?.message)) && /index\.ts:7/.test(String(k15?.message)),
    String(k15?.message).slice(0, 160))
  assert('K15 在人类可读输出里显示 [WARN] K15', runHuman(nested, ['--only', 'K', '--dsh-install', HOST_FLAT]).stdout.includes('[WARN] K15'))
  assert('K15 命中不改变退出码（warn 不是 fail）', hit.exit === 0, `实际 ${hit.exit}`)

  const old = run(nested, ['--only', 'K', '--dsh-install', HOST_OLD])
  const k15old = item(old.report, 'K15')
  assert('K15 目标宿主 < 0.2.2-rc.3 → pass（旧形状仍合法）', k15old?.status === 'pass', `实际 ${k15old?.status}`)
  assert('K15 旧宿主消息点明版本阈值', /低于 0\.2\.2-rc\.3/.test(String(k15old?.message)), String(k15old?.message).slice(0, 120))

  const miss = run(flat, ['--only', 'K', '--dsh-install', HOST_FLAT])
  const k15miss = item(miss.report, 'K15')
  assert('K15 扁平 spec → pass（不误报）', k15miss?.status === 'pass', `实际 ${k15miss?.status}`)
  assert('K15 不命中消息明确说未发现', /未发现嵌套/.test(String(k15miss?.message)), String(k15miss?.message))

  const off = run(nested, ['--only', 'K', '--dsh-install', HOST_FLAT, '--no-nested-activation'])
  const k15off = item(off.report, 'K15')
  assert('K15 可由 --no-nested-activation 关闭', k15off?.status === 'skip', `实际 ${k15off?.status}`)
  assert('K15 关闭消息点名开关', /--no-nested-activation/.test(String(k15off?.message)), String(k15off?.message))
}

// ── K16：temperature/top_p 与 reasoningEffort ─────────────────────────────
{
  const hit = run(thinking, ['--only', 'K', '--dsh-install', HOST_FLAT])
  const k16 = item(hit.report, 'K16')
  assert('K16 命中 temperature 无 reasoningEffort → info', k16?.status === 'info', `实际 ${k16?.status}`)
  assert('K16 消息含行号与静默失效说明',
    /index\.ts:7/.test(String(k16?.message)) && /temperature/.test(String(k16?.message))
      && /reasoningEffort/.test(String(k16?.message)) && /静默忽略/.test(String(k16?.message)),
    String(k16?.message).slice(0, 160))
  assert('K16 在人类可读输出里显示 [INFO] K16', runHuman(thinking, ['--only', 'K', '--dsh-install', HOST_FLAT]).stdout.includes('[INFO] K16'))
  assert('K16 是 info，不改变退出码', hit.exit === 0, `实际 ${hit.exit}`)

  const miss = run(reasoning, ['--only', 'K', '--dsh-install', HOST_FLAT])
  const k16miss = item(miss.report, 'K16')
  assert('K16 已设 reasoningEffort → pass（不误报）', k16miss?.status === 'pass', `实际 ${k16miss?.status}`)

  const off = run(thinking, ['--only', 'K', '--dsh-install', HOST_FLAT, '--no-thinking'])
  const k16off = item(off.report, 'K16')
  assert('K16 可由 --no-thinking 关闭', k16off?.status === 'skip', `实际 ${k16off?.status}`)
  assert('K16 关闭消息点名开关', /--no-thinking/.test(String(k16off?.message)), String(k16off?.message))

  // --format check：info 在三值契约里只能是 PASS，但必须保留 doctorStatus=info，
  // 不能把"建议级"静默抹平（SPEC §1.1 第 3 条）。
  const contractRun = run(thinking, ['--only', 'K', '--dsh-install', HOST_FLAT, '--format', 'check'])
  let contract = null
  try { contract = JSON.parse(contractRun.stdout) } catch { contract = null }
  const c16 = (contract?.checks ?? []).find((c) => c.id === 'K16')
  assert('K16 的 info 在三值契约中映射为 PASS', c16?.status === 'PASS', `实际 ${c16?.status}`)
  assert('K16 的 info 在契约里保留 doctorStatus=info', c16?.doctorStatus === 'info', `实际 ${c16?.doctorStatus}`)
}

// ── X4：已移除方法调用 ────────────────────────────────────────────────────
{
  const hit = run(methods, ['--only', 'X', '--dsh-install', HOST_FLAT])
  const x4 = item(hit.report, 'X4')
  assert('X4 命中 ctx.subagents.start/startContinuable → fail', x4?.status === 'fail', `实际 ${x4?.status}`)
  assert('X4 消息同时点名两个方法与 startActivation',
    /subagents\.start/.test(String(x4?.message)) && /startContinuable/.test(String(x4?.message))
      && /startActivation/.test(String(x4?.message)),
    String(x4?.message).slice(0, 200))
  assert('X4 消息带方法调用的行号（两条都在 4/5 行）',
    /index\.ts:4/.test(String(x4?.message)) && /index\.ts:5/.test(String(x4?.message)),
    String(x4?.message).slice(0, 200))
  assert('X4 在人类可读输出里显示 [FAIL] X4', runHuman(methods, ['--only', 'X', '--dsh-install', HOST_FLAT]).stdout.includes('[FAIL] X4'))
  assert('X4 方法命中是 fail → 退出码 1', hit.exit === 1, `实际 ${hit.exit}`)

  const miss = run(methodsFlat, ['--only', 'X', '--dsh-install', HOST_FLAT])
  const x4miss = item(miss.report, 'X4')
  assert('X4 只调用 startActivation → 不因方法误报', x4miss?.status === 'pass', `实际 ${x4miss?.status}`)
  assert('X4 不把文档字符串里的 subagents.start() 当调用', x4miss?.status === 'pass', `实际 ${x4miss?.status}`)
  assert('X4 不命中消息不含已移除方法', !/subagents\.start\b/.test(String(x4miss?.message)), String(x4miss?.message).slice(0, 160))
}

fs.rmSync(sandbox, { recursive: true, force: true })

let failed = 0
for (const c of checks) {
  if (!c.ok) failed++
  console.log(`${c.ok ? 'PASS' : 'FAIL'}  ${c.name}${c.detail ? `  — ${c.detail}` : ''}`)
}
console.log(`\nmigrations: ${checks.length - failed}/${checks.length} passed`)
if (failed > 0) process.exitCode = 1
