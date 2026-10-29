import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const 能力 = [
  { k: '执行命令', re: /(?:spawnSync|child_process|execSync|execFile|spawn\()/ },
  { k: '网络请求', re: /(?:fetch\(|https?\.request|axios|undici)/ },
  { k: '写文件', re: /(?:writeFileSync|writeFile\(|appendFile|createWriteStream|renameSync|rmSync)/ },
  { k: '读凭据', re: /(?:process\.env\.[A-Z_]*(?:KEY|TOKEN|SECRET)|credentials|\.netrc|keychain)/ },
  { k: '读用户目录', re: /(?:homedir\(\)|os\.homedir|~\/)/ },
  { k: '启动常驻进程', re: /(?:setInterval|setTimeout\([^)]*,\s*(?:[1-9]\d{3,})) / },
];

const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__']);
const EXTS = ['.js', '.mjs', '.cjs', '.ts', '.py', '.sh'];

export function run({ input = '' } = {}) {
  const dir = String(input || '').trim();
  if (!dir) return { ok: false, text: '请填写要审计的目录' };
  if (!existsSync(dir)) return { ok: false, text: '目录不存在：' + dir };
  const files = [];
  const 收 = (p) => {
    if (statSync(p).isDirectory()) { for (const n of readdirSync(p)) if (!n.startsWith('.') && !SKIP.has(n)) 收(join(p, n)); return; }
    if (EXTS.includes(extname(p).toLowerCase())) files.push(p);
  };
  收(dir);
  if (!files.length) return { ok: false, text: '没有找到代码文件' };
  const 汇总 = Object.fromEntries(能力.map((c) => [c.k, 0]));
  const 文件能力 = [];
  for (const f of files) {
    let t = ''; try { t = readFileSync(f, 'utf8'); } catch { continue; }
    const 命中 = 能力.filter((c) => c.re.test(t)).map((c) => c.k);
    for (const k of 命中) 汇总[k] += 1;
    if (命中.length) 文件能力.push({ f, 命中 });
  }
  const lines = ['能力清单（' + files.length + ' 个代码文件）', ''];
  for (const c of 能力) lines.push('  ' + c.k + '：' + 汇总[c.k] + ' 个文件');
  lines.push('', '风险最高的文件（命中能力最多）：');
  for (const x of 文件能力.sort((a, b) => b.命中.length - a.命中.length).slice(0, 10)) {
    lines.push('  ' + x.f + '：' + x.命中.join('、'));
  }
  lines.push('', '说明：这是静态清单，用于核对「插件声明的权限」与「实际用到的能力」是否一致。');
  return { ok: true, text: lines.join('\n') };
}
