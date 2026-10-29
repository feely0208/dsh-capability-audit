import { createPlugin, pkgRootFrom } from '@deepwhale-cn/dsh-guard-core/plugin';
import { registerApi } from './api.js';

const base = createPlugin({
  name: 'capability-audit',
  pkgRoot: pkgRootFrom(import.meta.url),
  skillFile: 'skill/capability-audit.md',
  binFile: 'bin/cli.mjs',
  description: '深鲸能力清单：静态扫描代码，列出执行命令/网络/写文件/读凭据等能力分布与高风险文件',
  whenToUse: '当用户要核对一个项目/插件实际用到的能力时使用：静态扫描代码，统计命令执行、网络、写文件、读凭据、读用户目录等能力。',
});
export const name = base.name;
export const inject = [...base.inject, 'webServer'];
export function apply(ctx) {
  base.apply(ctx);
  try { if (ctx.webServer?.register) registerApi(ctx); } catch (e) { ctx.logger?.warn?.('[capability-audit] 面板出口注册失败: ' + (e?.message || e)); }
}
