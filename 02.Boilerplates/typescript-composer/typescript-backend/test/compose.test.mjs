import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, access, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('../scripts/compose.mjs', import.meta.url));
const seed = resolve(script, '../..');
const run = (args, file, cwd = resolve(file, '../..')) => spawnSync(process.execPath, [file, ...args], { cwd, encoding: 'utf8', timeout: 20000 });
async function fixture(prefix) {
  const directory = await mkdtemp(join(tmpdir(), prefix));
  const library = join(directory, 'library');
  await mkdir(library);
  const filter = source => {
    const name = source.split(/[\\/]/).at(-1);
    return !['node_modules', '.git', 'dist', 'release'].includes(name) && (!name.startsWith('.env') || name === '.env.example');
  };
  const copySeed = join(library, 'typescript-backend');
  await cp(seed, copySeed, { recursive: true, filter });
  await cp(join(seed, '../components'), join(library, 'components'), { recursive: true, filter });
  return { directory, library, seed: copySeed, script: join(copySeed, 'scripts/compose.mjs') };
}

test('All target presets create independent wired projects with matching package commands', async () => {
  const { directory, library, script: entry } = await fixture('compose-targets-');
  try {
    for (const target of ['typescript-backend', 'backend-webui', 'web-app', 'web-phaser', 'electron-backend', 'electron-app', 'electron-phaser']) {
      const output = join(library, `app-${target}`);
      const result = run([target, `app-${target}`], entry); assert.equal(result.status, 0, result.stderr);
      const pkg = JSON.parse(await readFile(join(output, 'package.json'), 'utf8'));
      assert(!pkg.scripts.compose); assert(!pkg.scripts['test:compose']);
      await assert.rejects(access(join(output, 'scripts/compose.mjs')));
      await assert.rejects(access(join(output, 'package-lock.json')));
      await access(join(output, 'AGENTS.md'));
      if (target.startsWith('web-')) {
        await assert.rejects(access(join(output, 'src/backend')));
        assert(!pkg.dependencies.express);
        assert.equal(pkg.scripts.build, 'npm run build:frontend');
      }
      if (target === 'backend-webui') assert.match(await readFile(join(output, 'src/backend/core/web-server.ts'), 'utf8'), /app\.use\(createFrontendRouter\(\)\)/);
      if (target.startsWith('electron-')) assert.equal(pkg.main, 'dist/backend/electron.js');
      if (target === 'electron-phaser') {
        assert.match(await readFile(join(output, 'src/backend/electron.ts'), 'utf8'), /registerPersistenceIpc\(window, page, gamePersistence/);
        assert.match(await readFile(join(output, 'src/preload/index.ts'), 'utf8'), /import '.\/game-save.js'/);
        await access(join(output, 'src/backend/services/persistence/persistence.service.ts'));
      }
    }
  } finally { await rm(directory, { recursive: true }); }
});

test('Features add packages and env templates; existing or invalid destinations remain untouched', async () => {
  const { directory, library, script: entry } = await fixture('compose-features-');
  try {
    const output = join(library, 'network');
    const result = run(['typescript-backend', 'network', '--features', 'tcp,udp,mqtt,socket-io,game-persistence'], entry);
    assert.equal(result.status, 0, result.stderr);
    const pkg = JSON.parse(await readFile(join(output, 'package.json'), 'utf8'));
    assert.equal(pkg.dependencies['socket.io'], '4.8.4'); assert.equal(pkg.dependencies.mqtt, '5.16.1');
    assert.match(await readFile(join(output, '.env.example'), 'utf8'), /MQTT_PREFIX/);
    assert.match(await readFile(join(output, 'src/backend/core/di.ts'), 'utf8'), /return \{ greetingUsecase: usecase, gamePersistence \}/);
    assert(!pkg.scripts['start:game-persistence']);
    await writeFile(join(output, 'sentinel'), 'keep');
    assert.notEqual(run(['web-app', 'network'], entry).status, 0);
    assert.equal(await readFile(join(output, 'sentinel'), 'utf8'), 'keep');
    for (const args of [['bad', 'bad'], ['web-app', 'bad', '--features', 'tcp'], ...['typescript-backend', 'components', 'docs', 'con', '../escape', './nested', join(directory, 'outside'), 'My App'].map(name => ['web-app', name])]) assert.notEqual(run(args, entry).status, 0);
  } finally { await rm(directory, { recursive: true }); }
});

test('Template exclusions and explicit feature patches preserve existing content', async () => {
  const { directory, library: copy, seed: copySeed, script: entry } = await fixture('compose-private-');
  try {
    await writeFile(join(copySeed, '.env'), 'PRIVATE=test-only');
    await mkdir(join(copySeed, 'node_modules'));
    await writeFile(join(copySeed, 'node_modules/private-cache'), 'test-only');
    const output = join(copy, 'app');
    const result = run(['web-app', 'app'], entry);
    assert.equal(result.status, 0, result.stderr);
    await assert.rejects(access(join(output, '.env')));
    await assert.rejects(access(join(output, 'node_modules')));
    const feature = join(copy, 'components/03-features/communications/socket-io');
    const recipeFile = join(feature, 'compose.json');
    const originalRecipe = await readFile(recipeFile, 'utf8');
    const bad = join(copy, 'bad-feature');
    await writeFile(recipeFile, JSON.stringify({ patches: [{ file: 'src/backend/core/di.ts', find: 'missing hook', replace: 'nothing' }] }));
    assert.notEqual(run(['typescript-backend', 'bad-feature', '--features', 'socket-io'], entry).status, 0);
    await assert.rejects(access(bad));
    await writeFile(recipeFile, JSON.stringify({ dependencies: { express: '0.0.0' } }));
    assert.notEqual(run(['typescript-backend', 'bad-feature', '--features', 'socket-io'], entry).status, 0);
    await writeFile(recipeFile, originalRecipe);
    await writeFile(join(feature, 'files/src/backend/core/di.ts'), 'must not replace DI');
    assert.notEqual(run(['typescript-backend', 'bad-feature', '--features', 'socket-io'], entry).status, 0);
    await assert.rejects(access(bad));
    const tcpRecipe = join(copy, 'components/03-features/communications/tcp/compose.json');
    const tcp = JSON.parse(await readFile(tcpRecipe, 'utf8'));
    tcp.patches = [{ file: 'src/backend/core/di.ts', find: 'greetingUsecase: usecase', replace: 'greetingUsecase: usecase, tcpEnabled: true' }];
    await writeFile(tcpRecipe, JSON.stringify(tcp));
    for (const [index, features] of ['game-persistence,tcp', 'tcp,game-persistence'].entries()) {
      const merged = join(copy, `merged-di-${index}`);
      const mergedResult = run(['typescript-backend', `merged-di-${index}`, '--features', features], entry);
      assert.equal(mergedResult.status, 0, mergedResult.stderr);
      const di = await readFile(join(merged, 'src/backend/core/di.ts'), 'utf8');
      assert.match(di, /tcpEnabled: true/); assert.match(di, /greetingUsecase: usecase/); assert.match(di, /gamePersistence/);
    }
    const serverFile = join(copySeed, 'src/backend/core/web-server.ts');
    await writeFile(serverFile, (await readFile(serverFile, 'utf8')).replace('API not found.', 'Changed template'));
    const invalid = join(copy, 'invalid');
    assert.notEqual(run(['backend-webui', 'invalid'], entry).status, 0);
    await assert.rejects(access(invalid));
  } finally { await rm(directory, { recursive: true }); }
});

test('Project names always resolve under the copied Composer regardless of working directory', async () => {
  const { directory, library, seed: copySeed, script: entry } = await fixture('compose-location-');
  try {
    for (const [index, cwd] of [copySeed, library, directory].entries()) {
      const name = `project-${index}`;
      const result = run(['web-app', name], entry, cwd);
      assert.equal(result.status, 0, result.stderr);
      await access(join(library, name, 'package.json'));
      await assert.rejects(access(join(copySeed, name)));
    }
  } finally { await rm(directory, { recursive: true }); }
});

test('Exported feature command adds connections, preserves edits, is idempotent and rolls back failed checks', async () => {
  const { directory, library, script: entry } = await fixture('feature-command-');
  try {
    assert.equal(run(['typescript-backend', 'app'], entry).status, 0);
    const app = join(library, 'app');
    const feature = join(app, 'scripts/feature.mjs');
    const bin = join(directory, 'bin'); await mkdir(bin);
    const { chmod } = await import('node:fs/promises');
    await writeFile(join(bin, 'npm'), '#!/bin/sh\nexit 0\n'); await chmod(join(bin, 'npm'), 0o755);
    const add = names => spawnSync(process.execPath, [feature, 'add', names], { cwd: directory, encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
    await writeFile(join(app, 'src/backend/user.ts'), '// keep user source\n');
    assert.equal(add('game-persistence').status, 0);
    assert.match(await readFile(join(app, 'src/backend/core/di.ts'), 'utf8'), /gamePersistence/);
    assert.equal(await readFile(join(app, 'src/backend/user.ts'), 'utf8'), '// keep user source\n');
    const state = await readFile(join(app, '.composer/state.json'), 'utf8');
    assert.equal(add('game-persistence').status, 0);
    assert.equal(await readFile(join(app, '.composer/state.json'), 'utf8'), state);
    await writeFile(join(bin, 'npm'), '#!/bin/sh\nexit 1\n');
    const pkg = await readFile(join(app, 'package.json'), 'utf8');
    assert.notEqual(add('socket-io').status, 0);
    assert.equal(await readFile(join(app, 'package.json'), 'utf8'), pkg);
    assert.equal(await readFile(join(app, '.composer/state.json'), 'utf8'), state);
    await assert.rejects(access(join(app, 'src/backend/socket-io.ts')));
    assert.equal(run(['typescript-backend', 'edited'], entry).status, 0);
    const edited = join(library, 'edited');
    const di = join(edited, 'src/backend/core/di.ts');
    await writeFile(di, (await readFile(di, 'utf8')) + '// user change\n');
    const result = run(['add', 'game-persistence'], join(edited, 'scripts/feature.mjs'));
    assert.notEqual(result.status, 0); assert.match(result.stderr, /사용자 변경/);
    await assert.rejects(access(join(edited, 'src/backend/services/persistence/persistence.service.ts')));
  } finally { await rm(directory, { recursive: true }); }
});
