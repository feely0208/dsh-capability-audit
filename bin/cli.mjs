#!/usr/bin/env node
import { run } from '../lib/core.mjs';

const args = process.argv.slice(2);
const val = (k, d = '') => { const i = args.indexOf('--' + k); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };
if (!args.length || args.includes('--help')) {
  console.log(`dsh-capability-audit —— 深鲸能力清单

用法：dsh-capability-audit --op <audit> [参数]
参数：input
示例：dsh-capability-audit --input ./plugins/xxx`);
  process.exit(0);
}
const input = { op: val('op', 'audit') };
for (const k of ["input"]) input[k] = val(k);
const r = await run(input);
if (!r.ok) { console.error('❌', r.text || '失败'); process.exit(1); }
console.log(r.text || '');
process.exit(0);
