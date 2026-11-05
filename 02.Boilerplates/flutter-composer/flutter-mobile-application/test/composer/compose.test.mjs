import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, cp, readFile, writeFile, access, rm, chmod, symlink, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { collect } from '../../scripts/composer-core.mjs';

const originalSeed = fileURLToPath(new URL('../../', import.meta.url));
async function fixture() {
  const directory = await mkdtemp(join(tmpdir(), 'flutter-composer-test-'));
  const library = join(directory, 'composer');
  await mkdir(library);
  const filter = path => !['.fvm', '.dart_tool', 'build', 'node_modules', 'Pods'].includes(path.split(/[\\/]/).at(-1));
  await cp(originalSeed, join(library, 'flutter-mobile-application'), { recursive: true, filter });
  await cp(resolve(originalSeed, '../components'), join(library, 'components'), { recursive: true });
  return { directory, library, seed: join(library, 'flutter-mobile-application'), entry: join(library, 'flutter-mobile-application/scripts/compose.mjs') };
}
const run = (file, args, cwd, env = process.env) => spawnSync(process.execPath, [file, ...args], { cwd, env, encoding: 'utf8', timeout: 30000 });
const json = async path => JSON.parse(await readFile(path, 'utf8'));
async function fakeTools(directory, fail = false) {
  const bin = join(directory, 'bin'); await mkdir(bin, { recursive: true });
  const script = `#!/bin/sh\nprintf '%s\\n' "$*" >> tool-log\n${fail ? "printf 'changed lock' > pubspec.lock\nexit 1" : 'exit 0'}\n`;
  for (const name of ['fvm', 'bundle']) { await writeFile(join(bin, name), script); await chmod(join(bin, name), 0o755); }
  return { ...process.env, PATH: `${bin}:${process.env.PATH}` };
}

test('three targets generate standalone named apps with only selected native roots and valid doc links', async () => {
  const f = await fixture();
  try {
    for (const [index, target] of ['android', 'ios', 'android-ios'].entries()) {
      const name = `app_${index}`;
      const result = run(f.entry, [target, name], index === 0 ? f.seed : f.directory); assert.equal(result.status, 0, result.stderr);
      const app = join(f.library, name);
      const state = await json(join(app, '.composer/state.json'));
      assert.equal(state.target, target); assert.equal(state.base.version, '0.1.0'); assert.deepEqual(state.features, []);
      const files = await collect(app);
      assert.equal([...files.keys()].some(name => name.startsWith('android/')), target !== 'ios');
      assert.equal([...files.keys()].some(name => name.startsWith('ios/')), target !== 'android');
      assert.equal(files.has('Gemfile'), target !== 'android');
      if (target !== 'ios') assert((await stat(join(app, 'android/gradlew'))).mode & 0o100);

      assert(!files.has('scripts/compose.mjs')); assert(![...files.keys()].some(name => name.startsWith('test/composer/')));
      assert.match(files.get('pubspec.yaml').toString(), new RegExp(`^name: ${name}`, 'm'));
      assert.match(files.get('test/app_test.dart').toString(), new RegExp(`package:${name}/`));
      assert.equal(files.get('AGENTS.md').toString(), files.get('project-agents.md').toString());
      assert.match(files.get('AGENTS.md').toString(), /새 이력은 제목·소개 바로 아래 맨 위/);
      for (const [path, content] of files) {
        if (!path.endsWith('.md') || path.startsWith('.composer/')) continue;
        for (const [, link] of content.toString().matchAll(/\]\(([^)]+)\)/g)) {
          if (link.includes('://') || link.startsWith('#')) continue;
          await access(resolve(app, path, '..', link.split('#')[0]));
        }
      }
    }
  } finally { await rm(f.directory, { recursive: true }); }
});

test('invalid targets/names, existing outputs, private files and symlinks are protected', async () => {
  const f = await fixture();
  try {
    await writeFile(join(f.seed, '.env'), 'private');
    await writeFile(join(f.seed, 'key.properties'), 'private');
    await mkdir(join(f.seed, '.dart_tool')); await writeFile(join(f.seed, '.dart_tool/private'), 'private');
    assert.equal(run(f.entry, ['android', 'app'], f.seed).status, 0);
    await assert.rejects(access(join(f.library, 'app/.env'))); await assert.rejects(access(join(f.library, 'app/key.properties')));
    await assert.rejects(access(join(f.library, 'app/.dart_tool')));
    const before = await readFile(join(f.library, 'app/pubspec.yaml'));
    assert.notEqual(run(f.entry, ['android', 'app'], f.seed).status, 0);
    assert.deepEqual(await readFile(join(f.library, 'app/pubspec.yaml')), before);
    for (const name of ['../escape', './nested', 'My-App', 'con', 'class', '123app', 'ios']) assert.notEqual(run(f.entry, ['android', name], f.seed).status, 0);
    assert.notEqual(run(f.entry, ['windows', 'invalid'], f.seed).status, 0);
    await symlink(join(f.seed, 'pubspec.yaml'), join(f.seed, 'linked'));
    assert.notEqual(run(f.entry, ['android', 'linked_app'], f.seed).status, 0);
    await assert.rejects(access(join(f.library, 'linked_app')));
  } finally { await rm(f.directory, { recursive: true }); }
});

test('feature commands automatically register DI/assets, preserve user files and active features in either order', async () => {
  const f = await fixture();
  try {
    const env = await fakeTools(f.directory);
    for (const [index, order] of [['greeting-resource', 'counter'], ['counter', 'greeting-resource']].entries()) {
      const name = `app_${index}`; assert.equal(run(f.entry, ['android', name], f.seed).status, 0);
      const app = join(f.library, name), feature = join(app, 'scripts/feature.mjs');
      await writeFile(join(app, 'lib/user.dart'), '// keep\n');
      for (const id of order) { const result = run(feature, ['add', id], f.directory, env); assert.equal(result.status, 0, result.stderr); }
      const state = await json(join(app, '.composer/state.json'));
      assert.deepEqual(state.features.map(feature => feature.id), order);
      assert(state.features.every(feature => feature.version === '0.1.0'));
      assert.equal(await readFile(join(app, 'lib/user.dart'), 'utf8'), '// keep\n');
      const registry = await readFile(join(app, 'lib/core/features.g.dart'), 'utf8'); assert.match(registry, /createGreetingFeature/); assert.match(registry, /createCounterFeature/);
      assert.match(await readFile(join(app, 'pubspec.yaml'), 'utf8'), /- lib\/resource\/greeting.json/);
      assert.match(await readFile(join(app, 'test/scenes/counter/counter_test.dart'), 'utf8'), new RegExp(`package:${name}/`));
      const log = await readFile(join(app, 'tool-log'), 'utf8'); assert.match(log, /flutter analyze/); assert.match(log, /flutter test/); assert.match(log, /flutter build apk --debug/);
      const previous = await readFile(join(app, '.composer/state.json'), 'utf8');
      assert.equal(run(feature, ['add', order.join(',')], f.directory, env).status, 0);
      assert.equal(await readFile(join(app, '.composer/state.json'), 'utf8'), previous);
      assert.equal(run(feature, ['list'], f.directory, env).status, 0);
    }
  } finally { await rm(f.directory, { recursive: true }); }
});

test('validation failures roll back pubspec/lock/state and added files; conflicts and lock reject before mutation', async () => {
  const f = await fixture();
  try {
    assert.equal(run(f.entry, ['android-ios', 'app'], f.seed).status, 0);
    const app = join(f.library, 'app'), feature = join(app, 'scripts/feature.mjs');
    const before = await collect(app);
    const failure = run(feature, ['add', 'counter'], f.directory, await fakeTools(f.directory, true)); assert.notEqual(failure.status, 0);
    for (const name of ['pubspec.yaml', 'pubspec.lock', '.composer/state.json', 'lib/core/features.g.dart']) assert.deepEqual(await readFile(join(app, name)), before.get(name));
    await assert.rejects(access(join(app, 'lib/scenes/counter/counter_feature.dart')));
    await writeFile(join(app, '.composer/feature.lock'), 'busy'); assert.notEqual(run(feature, ['add', 'counter'], f.directory).status, 0);
    await rm(join(app, '.composer/feature.lock'));
    await writeFile(join(app, 'lib/core/features.g.dart'), '// user change');
    const result = run(feature, ['add', 'counter'], f.directory); assert.notEqual(result.status, 0); assert.match(result.stderr, /사용자 변경/);
    assert.equal(await readFile(join(app, 'lib/core/features.g.dart'), 'utf8'), '// user change');
    await writeFile(join(app, 'lib/core/features.g.dart'), before.get('lib/core/features.g.dart'));
    await mkdir(join(app, 'lib/scenes/counter'), { recursive: true });
    await writeFile(join(app, 'lib/scenes/counter/counter_feature.dart'), '// user source');
    assert.notEqual(run(feature, ['add', 'counter'], f.directory).status, 0);
    assert.equal(await readFile(join(app, 'lib/scenes/counter/counter_feature.dart'), 'utf8'), '// user source');
    assert.notEqual(run(feature, ['add', 'unknown'], f.directory).status, 0);
    assert.deepEqual(await readFile(join(app, '.composer/state.json')), before.get('.composer/state.json'));
  } finally { await rm(f.directory, { recursive: true }); }
});

test('target-specific feature verification builds only selected platforms and rejects unsupported declarations', async () => {
  const f = await fixture();
  try {
    const env = await fakeTools(f.directory);
    for (const [index, target] of ['ios', 'android-ios'].entries()) {
      assert.equal(run(f.entry, [target, `app_${index}`], f.seed).status, 0);
      const app = join(f.library, `app_${index}`);
      const result = run(join(app, 'scripts/feature.mjs'), ['add', 'counter'], f.directory, env); assert.equal(result.status, 0, result.stderr);
      const log = await readFile(join(app, 'tool-log'), 'utf8');
      assert.equal(log.includes('build apk'), target !== 'ios');
      assert.equal(log.includes('build ios'), process.platform === 'darwin');
      if (process.platform === 'darwin') assert.match(log, /exec fvm flutter build ios --simulator --debug --no-codesign/);
    }
    const declaration = join(f.library, 'components/03-features/scenes/counter/compose.json');
    const definition = await json(declaration); definition.dependencies = { unsupported: '1.0.0' };
    await writeFile(declaration, JSON.stringify(definition));
    const result = run(f.entry, ['android', 'invalid'], f.seed);
    assert.notEqual(result.status, 0); assert.match(result.stderr, /지원하지 않는 feature 선언 필드/);
    await assert.rejects(access(join(f.library, 'invalid')));
  } finally { await rm(f.directory, { recursive: true }); }
});

test('Composer and exported help are detailed and have no generation or installation side effects', async () => {
  const f = await fixture();
  try {
    const { readdir } = await import('node:fs/promises');
    const before = await readdir(f.library);
    for (const argument of ['help', '--help', '--commands']) {
      const result = run(f.entry, [argument], f.seed); assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, argument === '--commands' ? /명령 안내/ : /생성 위치/);
      if (argument !== '--commands') { assert.match(result.stdout, /android-ios/); assert.match(result.stdout, /my_app/); }
    }
    assert.deepEqual(await readdir(f.library), before);
    assert.equal((await json(join(f.seed, 'package.json'))).scripts.help, 'node scripts/compose.mjs --commands');
    assert.equal(run(f.entry, ['android', 'app'], f.seed).status, 0);
    const app = join(f.library, 'app');
    assert.equal((await json(join(app, 'package.json'))).scripts.help, 'node scripts/feature.mjs help');
    const state = await readFile(join(app, '.composer/state.json'), 'utf8');
    const result = run(join(app, 'scripts/feature.mjs'), ['help'], f.directory); assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /feature -- add/); assert.match(result.stdout, /복구/);
    assert.equal(await readFile(join(app, '.composer/state.json'), 'utf8'), state);
    await assert.rejects(access(join(app, '.composer/feature.lock')));
  } finally { await rm(f.directory, { recursive: true }); }
});
