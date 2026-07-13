import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const workspace = resolve(root, 'var', 'private-build');
const localSourceDir = resolve(root, 'source-local');
const localConfig = resolve(root, '_config.local.yml');
const templateConfig = resolve(root, '_config.private-template.yml');
const baseSourceDir = resolve(root, 'source');

const mode = process.argv[2] || 'build';
const modeArgs = process.argv.slice(3);
const supportedModes = new Set(['build', 'deploy', 'server']);

function printInfo(message) {
  console.log(`[private-build] ${message}`);
}

function printWarn(message) {
  console.warn(`[private-build] Warning: ${message}`);
}

function printNote(message) {
  console.log(`[private-build] ${message}`);
}

function fail(message, tips = []) {
  console.error(`[private-build] ${message}`);

  for (const tip of tips) {
    console.error(`- ${tip}`);
  }

  process.exit(1);
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function copyIntoWorkspace(from, to) {
  ensureDir(dirname(to));
  cpSync(from, to, { recursive: true });
}

function copyBaseSource() {
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

function validateMode() {
  if (!supportedModes.has(mode)) {
    fail(`Unknown mode: ${mode}`, [
      'Supported modes: build, deploy, server'
    ]);
  }
}

function validateProjectFiles() {
  const requiredPaths = [
    ['package.json', resolve(root, 'package.json')],
    ['_config.yml', resolve(root, '_config.yml')],
    ['source/', baseSourceDir],
    ['themes/', resolve(root, 'themes')]
  ];

  for (const [label, file] of requiredPaths) {
    if (!existsSync(file)) {
      fail(`Required project file is missing: ${label}`, [
        'Please run this command from the project root.'
      ]);
    }
  }
}

function validatePrivateInputs() {
  if (!existsSync(localSourceDir)) {
    const tips = [
      'Initialize it with: cp -R source-local.example source-local'
    ];

    if (existsSync(resolve(root, 'source-local.example'))) {
      tips.push('Then place your private posts, about page, avatar, and profile config under source-local/.');
    }

    fail('Private source directory not found: source-local/', tips);
  }

  const recommendedPaths = [
    ['source-local/_data/profile.yml', resolve(localSourceDir, '_data', 'profile.yml')],
    ['source-local/about/index.md', resolve(localSourceDir, 'about', 'index.md')]
  ];

  for (const [label, file] of recommendedPaths) {
    if (!existsSync(file)) {
      printWarn(`Missing optional private file: ${label}`);
    }
  }

  if (!existsSync(localConfig)) {
    if (existsSync(templateConfig)) {
      printNote('No _config.local.yml found. Private build will continue without local config overrides.');
      printNote('You can initialize it with: cp _config.private-template.yml _config.local.yml');
    }

    return;
  }

  if (!hasUsableLocalConfig()) {
    printNote('_config.local.yml is empty. Private build will continue without local config overrides.');
  }
}

function setupWorkspace() {
  printInfo(`Preparing private workspace for mode: ${mode}`);
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
    printInfo('Merging source-local/ into workspace source/.');
    cpSync(localSourceDir, resolve(workspace, 'source'), { recursive: true, force: true });
  }

  if (hasUsableLocalConfig()) {
    printInfo('Detected local config overrides from _config.local.yml.');
    writeFileSync(resolve(workspace, '_config.private.yml'), '');
  }
}

function runHexo(args) {
  const extraArgs = [];

  if (existsSync(resolve(workspace, '_config.private.yml')) && hasUsableLocalConfig()) {
    extraArgs.push('--config', '_config.yml,_config.local.yml');
    copyIntoWorkspace(localConfig, resolve(workspace, '_config.local.yml'));
  }

  printInfo(`Running: npx hexo ${[...args, ...extraArgs].join(' ')}`);
  const result = spawnSync('npx', ['hexo', ...args, ...extraArgs], {
    cwd: workspace,
    stdio: 'inherit',
    shell: false
  });

  if (result.error) {
    fail(`Failed to start Hexo: ${result.error.message}`, [
      'Please confirm project dependencies are installed with: npm install'
    ]);
  }

  if (result.status !== 0) {
    fail(`Hexo command failed with exit code ${result.status ?? 1}`, [
      'Check the Hexo output above for the exact failure reason.'
    ]);
  }
}

validateMode();
validateProjectFiles();
validatePrivateInputs();
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
