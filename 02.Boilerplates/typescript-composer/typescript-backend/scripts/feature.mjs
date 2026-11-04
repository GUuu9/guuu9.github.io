import { readFile, readdir, mkdir, writeFile, mkdtemp, cp, rm, lstat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const hash = value => createHash('sha256').update(value).digest('hex');
async function read(path) {
  try {
    if ((await lstat(path)).isSymbolicLink()) throw new Error(`심볼릭 링크는 갱신하지 않습니다: ${path}`);
    return await readFile(path);
  } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
async function main() {
  const state = JSON.parse(await readFile(join(root, '.composer/state.json'), 'utf8'));
  const [command, names, ...extra] = process.argv.slice(2);
  if (command === 'list' && !names) { console.log(`형태: ${state.target}\n활성 기능: ${state.features.join(', ') || '없음'}`); return; }
  if (command !== 'add' || !names || extra.length) throw new Error('사용법: npm run feature -- add tcp,udp | list');
  const features = [...new Set([...state.features, ...names.split(',')])];
  if (features.length === state.features.length) { console.log('이미 활성화된 기능입니다.'); return; }
  const temporary = await mkdtemp(join(tmpdir(), 'composer-feature-'));
  try {
    const library = join(temporary, 'library');
    await cp(join(root, '.composer/catalog'), library, { recursive: true });
    const generated = spawnSync(process.execPath, [join(library, 'typescript-backend/scripts/compose.mjs'), state.target, 'result', '--features', features.join(',')], { encoding: 'utf8', env: { ...process.env, COMPOSER_INTERNAL: '1' } });
    if (generated.status !== 0) throw new Error(generated.stderr || '기능 조합 실패');
    const files = new Map();
    async function collect(directory, prefix = '') {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const name = prefix ? `${prefix}/${entry.name}` : entry.name;
        if (entry.isDirectory()) await collect(join(directory, entry.name), name);
        else files.set(name, await readFile(join(directory, entry.name)));
      }
    }
    await collect(join(library, 'result'));
    // 사용자 소유의 안내·이력은 재생성하지 않습니다.
    for (const name of ['README.md', 'update.md', 'AGENTS.md', 'project-agents.md', 'scripts/feature.mjs']) files.delete(name);
    const changes = new Map();
    const nextBaseline = { ...state.baseline };
    for (const [name, value] of files) {
      if (name === 'package.json') continue;
      const digest = hash(value);
      if (state.baseline[name] === digest) continue;
      const path = join(root, name);
      // 부모 디렉터리 링크도 저장소 밖 쓰기를 허용하지 않습니다.
      for (let parent = dirname(path); parent !== root; parent = dirname(parent)) {
        try { if ((await lstat(parent)).isSymbolicLink()) throw new Error(`심볼릭 링크 경로: ${name}`); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
      }
      const current = await read(path);
      if (current && hash(current) !== state.baseline[name]) throw new Error(`사용자 변경 또는 파일 충돌: ${name}`);
      if (!current && state.baseline[name]) throw new Error(`사용자가 삭제한 파일: ${name}`);
      changes.set(name, value); nextBaseline[name] = digest;
    }
    const pkgPath = join(root, 'package.json');
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8'));
    const desired = JSON.parse(files.get('package.json'));
    for (const section of ['scripts', 'dependencies', 'devDependencies']) {
      pkg[section] ??= {};
      for (const [name, value] of Object.entries(desired[section] ?? {})) {
        if (pkg[section][name] !== undefined && pkg[section][name] !== value) {
          throw new Error(`패키지 설정 충돌: ${section}.${name}`);
        }
        pkg[section][name] = value;
      }
    }
    changes.set('package.json', Buffer.from(JSON.stringify(pkg, null, 2) + '\n'));
    const originals = new Map();
    for (const name of [...changes.keys(), 'package-lock.json', '.composer/state.json']) originals.set(name, await read(join(root, name)));
    try {
      for (const [name, value] of changes) {
        await mkdir(dirname(join(root, name)), { recursive: true });
        await writeFile(join(root, name), value);
      }
      const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
      for (const args of [['install'], ['run', 'check'], ['test'], ['run', 'build']]) {
        const result = spawnSync(npm, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });
        if (result.status !== 0) throw new Error(`npm ${args.join(' ')} 실패. 소스·manifest·lock·활성화 내역을 복구합니다.`);
      }
      await writeFile(join(root, '.composer/state.json'), JSON.stringify({ ...state, features, baseline: nextBaseline }, null, 2) + '\n');
      console.log(`활성화·검증 완료: ${features.join(', ')}`);
    } catch (error) {
      for (const [name, original] of originals) {
        if (original === null) await rm(join(root, name), { force: true });
        else await writeFile(join(root, name), original);
      }
      throw error;
    }
  } finally { await rm(temporary, { recursive: true, force: true }); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
