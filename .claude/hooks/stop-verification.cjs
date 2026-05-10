/**
 * Stop Hook: 交付验收检查
 *
 * 在本轮 Claude 修改了代码/配置/文档时，强制验证 lint + typecheck 通过，
 * 否则阻止本次结束，要求 Claude 继续完成验证。
 *
 * 安装: 在 .claude/settings.json 中注册
 *   "hooks": { "stop": "node .claude/hooks/stop-verification.cjs" }
 */

const { execSync } = require('child_process');
const { existsSync, statSync, readdirSync, readFileSync, writeFileSync } = require('fs');
const path = require('path');

// ========== config ==========
const ROOT = path.resolve(__dirname, '..', '..');
const PROJECT_DIR = path.join(ROOT, 'customer-notes');
const STATE_FILE = path.join(__dirname, '.verify-state.json');

// 监控路径 (相对 ROOT)
const WATCH_PATHS = [
  { type: 'dir',  path: 'customer-notes/src' },
  { type: 'file', path: 'customer-notes/tsconfig.json' },
  { type: 'file', path: 'customer-notes/tsconfig.app.json' },
  { type: 'file', path: 'customer-notes/vite.config.ts' },
  { type: 'file', path: 'customer-notes/eslint.config.js' },
  { type: 'file', path: 'customer-notes/package.json' },
  { type: 'file', path: '.claude/settings.json' },
  { type: 'file', path: '.claude/settings.local.json' },
  { type: 'dir',  path: 'resume-plan.md' },
];

// 视为"代码/配置/文档"的文件扩展名
const CODE_EXTS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.css', '.scss', '.less',
  '.json', '.md', '.html', '.htm', '.yaml', '.yml',
]);

// ========== helpers ==========
function walkDir(dir) {
  const files = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', '.git', '.claude'].includes(entry.name)) {
          files.push(...walkDir(fp));
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (CODE_EXTS.has(ext)) files.push(fp);
      }
    }
  } catch (_) { /* path not found — skip */ }
  return files;
}

function getCurrentState() {
  const state = {};
  for (const entry of WATCH_PATHS) {
    const fp = path.join(ROOT, entry.path);
    if (!existsSync(fp)) continue;
    try {
      if (entry.type === 'dir') {
        const files = walkDir(fp);
        for (const f of files) {
          try { state[f] = statSync(f).mtimeMs; } catch (_) {}
        }
      } else {
        state[fp] = statSync(fp).mtimeMs;
      }
    } catch (_) {}
  }
  return state;
}

function getChangedFiles(current) {
  // 首次运行: 无基线文件，保存状态并跳过检查
  if (!existsSync(STATE_FILE)) {
    return [];
  }

  const prev = JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
  return Object.entries(current)
    .filter(([file, mtime]) => {
      const prevMtime = prev[file];
      return prevMtime === undefined || Math.abs(prevMtime - mtime) > 50; // 50ms 容差
    })
    .map(([f]) => f);
}

function runCmd(cmd, cwd) {
  try {
    const out = execSync(cmd, {
      cwd,
      encoding: 'utf8',
      timeout: 120_000,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, stdout: (out || '').trim(), stderr: '' };
  } catch (e) {
    return {
      code: e.status ?? 1,
      stdout: (e.stdout || '').trim(),
      stderr: (e.stderr || '').trim(),
    };
  }
}

// ========== main ==========
function main() {
  const currentState = getCurrentState();
  const changed = getChangedFiles(currentState);

  // 没有修改 → 放行
  if (changed.length === 0) {
    writeFileSync(STATE_FILE, JSON.stringify(currentState, null, 2));
    process.exit(0);
  }

  // ---- 检测到修改 ----
  const sep = '─'.repeat(50);
  console.error(`\n${sep}`);
  console.error('🔍 Stop Hook: 检测到文件修改，运行交付验收...');
  console.error(`${sep}`);
  console.error(`修改文件 (${changed.length}):`);
  changed.slice(0, 10).forEach(f => console.error(`  • ${path.relative(ROOT, f)}`));
  if (changed.length > 10) {
    console.error(`  … 及其他 ${changed.length - 10} 个文件`);
  }

  // ---- 验证 step 1: lint ----
  console.error('\n── [1/2] ESLint ──');
  const lint = runCmd('npm run lint 2>&1', PROJECT_DIR);
  if (lint.code === 0) {
    console.error('✅ lint 通过');
  } else {
    console.error('❌ lint 失败:');
    console.error(lint.stderr || lint.stdout || '(无输出)');
  }

  // ---- 验证 step 2: typecheck ----
  console.error('\n── [2/2] TypeScript 类型检查 ──');
  const tsc = runCmd('npx tsc -b --noEmit 2>&1', PROJECT_DIR);
  if (tsc.code === 0) {
    console.error('✅ typecheck 通过');
  } else {
    console.error('❌ typecheck 失败:');
    console.error(tsc.stderr || tsc.stdout || '(无输出)');
  }

  // ---- 保存基线状态（无论结果，避免卡死） ----
  writeFileSync(STATE_FILE, JSON.stringify(currentState, null, 2));

  // ---- 判断 ----
  const allPass = lint.code === 0 && tsc.code === 0;

  if (allPass) {
    console.error(`\n${sep}`);
    console.error('✅ 交付验收全部通过\n');
    process.exit(0);
  } else {
    console.error(`\n${sep}`);
    console.error('❌ 交付验收未通过 — 阻止结束');
    console.error('请修复上述问题后重试，或运行以下命令确认:');
    console.error('   npm run lint');
    console.error('   npx tsc -b --noEmit');
    console.error(`${sep}\n`);
    process.exit(1);
  }
}

main();
