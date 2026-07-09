import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const workspace = resolve(root, 'var', 'private-build');
const localSourceDir = resolve(root, 'source-local');
const localConfig = resolve(root, '_config.local.yml');

const mode = process.argv[2] || 'build';

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function copyIntoWorkspace(from, to) {
  ensureDir(dirname(to));
  cpSync(from, to, { recursive: true });
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
    'themes',
    'source'
  ];

  for (const item of itemsToCopy) {
    const from = resolve(root, item);
    if (existsSync(from)) {
      copyIntoWorkspace(from, resolve(workspace, item));
    }
  }

  if (existsSync(localSourceDir)) {
    cpSync(localSourceDir, resolve(workspace, 'source'), { recursive: true, force: true });
  }

  if (existsSync(localConfig)) {
    writeFileSync(resolve(workspace, '_config.private.yml'), '');
  }
}

function runHexo(args) {
  const extraArgs = [];

  if (existsSync(resolve(workspace, '_config.private.yml')) && existsSync(localConfig)) {
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
  runHexo(['server']);
} else {
  console.error(`Unknown mode: ${mode}`);
  process.exit(1);
}
