import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const workspace = resolve(root, 'var', 'private-build');
const localSourceDir = resolve(root, 'source-local');
const localConfig = resolve(root, '_config.local.yml');

const mode = process.argv[2] || 'build';
const modeArgs = process.argv.slice(3);

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function copyIntoWorkspace(from, to) {
  ensureDir(dirname(to));
  cpSync(from, to, { recursive: true });
}

function copyBaseSource() {
  const baseSourceDir = resolve(root, 'source');
  const workspaceSourceDir = resolve(workspace, 'source');
  const hasLocalPosts = existsSync(resolve(localSourceDir, '_posts'));

  ensureDir(workspaceSourceDir);

  const sourceItems = [
    '_data',
    'about',
    'categories',
    'en',
    'favicon.ico',
    'images',
    'life',
    'tags'
  ];

  if (!hasLocalPosts) {
    sourceItems.push('_posts');
  }

  for (const item of sourceItems) {
    const from = resolve(baseSourceDir, item);
    if (existsSync(from)) {
      copyIntoWorkspace(from, resolve(workspaceSourceDir, item));
    }
  }
}

function hasUsableLocalConfig() {
  if (!existsSync(localConfig)) {
    return false;
  }

  const text = readFileSync(localConfig, 'utf8');
  const meaningfulLines = text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  return meaningfulLines.length > 0;
}

function setupWorkspace() {
  rmSync(workspace, { recursive: true, force: true });
  ensureDir(workspace);

  const itemsToCopy = [
    '.gitignore',
    'package.json',
    'package-lock.json',
    '_config.yml',
    'scaffolds',
    'themes'
  ];

  for (const item of itemsToCopy) {
    const from = resolve(root, item);
    if (existsSync(from)) {
      copyIntoWorkspace(from, resolve(workspace, item));
    }
  }

  copyBaseSource();

  if (existsSync(localSourceDir)) {
    cpSync(localSourceDir, resolve(workspace, 'source'), { recursive: true, force: true });
  }

  if (hasUsableLocalConfig()) {
    writeFileSync(resolve(workspace, '_config.private.yml'), '');
  }
}

function runHexo(args) {
  const extraArgs = [];

  if (existsSync(resolve(workspace, '_config.private.yml')) && hasUsableLocalConfig()) {
    extraArgs.push('--config', '_config.yml,_config.local.yml');
    copyIntoWorkspace(localConfig, resolve(workspace, '_config.local.yml'));
  }

  const result = spawnSync('npx', ['hexo', ...args, ...extraArgs], {
    cwd: workspace,
    stdio: 'inherit',
    shell: false
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

setupWorkspace();

if (mode === 'build') {
  runHexo(['clean']);
  runHexo(['generate']);
} else if (mode === 'deploy') {
  runHexo(['clean']);
  runHexo(['generate']);
  runHexo(['deploy']);
} else if (mode === 'server') {
  runHexo(['server', ...modeArgs]);
} else {
  console.error(`Unknown mode: ${mode}`);
  process.exit(1);
}
