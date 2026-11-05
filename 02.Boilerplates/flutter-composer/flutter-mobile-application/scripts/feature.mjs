import { readFile, open, rm } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { planFeatures, applyChanges, safePath } from './composer-core.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
async function main() {
  if (process.argv.length === 3 && ['help', '--help'].includes(process.argv[2])) { console.log("생성 프로젝트 명령 안내\n  npm run help                     명령 목록\n  npm run feature -- list           활성 형태·기능 확인\n  npm run feature -- add <기능>      기능 추가·자동 연결·검증\n\n기능은 이 프로젝트에 포함된 catalog에서 가져옵니다. 자동 업데이트/제거는 지원하지 않습니다.\n기존 파일과 충돌하면 중단하며, 검증 실패 시 소스·설정·lock·상태를 복구합니다.\n캐시·빌드 산출물·외부 설치 부작용은 복구하지 않습니다.\n추가 전 README와 docs/01-getting-started.md의 도구·환경 준비를 완료합니다.\n예: npm run feature -- add greeting-resource,counter\n검증: FVM pub get → analyze → test → 선택 플랫폼 빌드\n"); return; }
  const [command, names, ...extra] = process.argv.slice(2);
  const statePath = await safePath(root, '.composer/state.json');
  const state = JSON.parse(await readFile(statePath, 'utf8'));
  if (state.schemaVersion !== 1) throw new Error('지원하지 않는 Composer 상태 형식');
  if (command === 'list' && !names) { console.log(JSON.stringify({ target: state.target, features: state.features }, null, 2)); return; }
  if (command !== 'add' || !names || extra.length) throw new Error('npm run feature -- add greeting-resource,counter | list');
  const lockPath = await safePath(root, '.composer/feature.lock');
  let lock;
  try { lock = await open(lockPath, 'wx'); }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error('다른 feature 작업이 실행 중이거나 종료 잠금이 남았습니다. 실행 프로세스와 Git diff를 먼저 확인합니다.');
    throw error;
  }
  try {
    const current = JSON.parse(await readFile(statePath, 'utf8'));
    const requested = names.split(',');
    const plan = await planFeatures(root, current, requested);
    if (plan.next.features.length === current.features.length) { console.log('이미 활성화된 기능입니다.'); return; }
    await applyChanges(root, plan.changes, plan.next, async () => {
      const commands = [['pub', 'get'], ['analyze'], ['test']];
      if (current.target !== 'ios') commands.push(['build', 'apk', '--debug']);
      if (current.target !== 'android' && process.platform === 'darwin') commands.push(['build', 'ios', '--simulator', '--debug', '--no-codesign']);
      for (const args of commands) {
        const bundled = args[0] === 'build' && args[1] === 'ios';
        const command = bundled ? 'bundle' : process.platform === 'win32' ? 'fvm.exe' : 'fvm';
        const result = spawnSync(command, bundled ? ['exec', 'fvm', 'flutter', ...args] : ['flutter', ...args], { cwd: root, stdio: 'inherit' });
        if (result.status !== 0) throw new Error(`fvm flutter ${args.join(' ')} 실패. 소스·pubspec/lock·상태를 복구합니다.`);
      }
      if (current.target !== 'android' && process.platform !== 'darwin') console.log('iOS 빌드는 macOS에서 별도로 확인해야 합니다. 현재 미검증입니다.');
    });
    console.log(`활성화·검사 완료: ${plan.next.features.map(feature => `${feature.id}@${feature.version}`).join(', ')}`);
  } finally { await lock.close(); await rm(lockPath); }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
