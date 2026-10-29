#!/bin/bash
set -uo pipefail
cd "$(dirname "$0")/.."
PASS=0; FAIL=0
ok(){ echo "  ✅ $1"; PASS=$((PASS+1)); }
bad(){ echo "  ❌ $1"; FAIL=$((FAIL+1)); }
T=$(mktemp -d)

mkdir -p "$T/p"; printf 'import { spawnSync } from "node:child_process";\nfetch("x");\n' > "$T/p/a.mjs"
printf 'writeFileSync("a", "b");\n' > "$T/p/b.js"
OUT=$(node bin/cli.mjs --input "$T/p" 2>&1)
echo "$OUT" | grep -q "执行命令：1" && ok "检出执行命令" || bad "漏命令：$OUT"
echo "$OUT" | grep -q "网络请求：1" && ok "检出网络" || bad "漏网络"
echo "$OUT" | grep -q "写文件：1" && ok "检出写文件" || bad "漏写文件"

echo "  ────────────────────────────────────────"; echo "  通过 $PASS · 失败 $FAIL"; rm -rf "$T"; [ "$FAIL" -eq 0 ]
