import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, writeFile, lstat } from 'node:fs/promises';
import { collect, hash, targets, featureCatalog, assetBlock } from './composer-core.mjs';

const seed = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const library = dirname(seed);
const usage = 'npm run compose -- <android|ios|android-ios> <project_name>';
const detailedHelp = "Flutter Composer 상세 도움말\n\n사용법: npm run compose -- <android|ios|android-ios> <project_name>\n\n형태:\n  android      android/만 포함, ios/·Gemfile 제외\n  ios          ios/·Gemfile 포함, android/ 제외\n  android-ios  두 플랫폼 포함\n\n프로젝트명: Dart 패키지 형식의 영문 소문자·숫자·밑줄(snake_case).\n경로·예약어·기존 폴더는 거부합니다.\n생성 위치: 실행 cwd와 관계없이 복사한 flutter-composer 바로 아래.\n묶음 루트 또는 flutter-mobile-application에서 호출합니다. 원본 플랫폼 폴더는 삭제하지 않습니다.\n\n예시:\n  npm run compose -- android my_android\n  npm run compose -- ios my_ios\n  npm run compose -- android-ios my_app\n\n생성 후 새 프로젝트에서:\n  cd ../my_app                  # flutter-mobile-application에서 생성한 경우\n  # README에 따라 FVM·선택 플랫폼 도구·라이선스·환경을 먼저 준비\n  fvm install\n  fvm flutter pub get\n  npm run help\n  npm run feature -- add greeting-resource,counter\n\n루트에서 생성했다면 cd my_app을 사용합니다.\nfeature: greeting-resource(번들 JSON·MVVM), counter(메모리 카운터).\n기능 명령은 pub get·분석·테스트·선택 플랫폼 빌드를 수행합니다.\niOS 빌드는 macOS·Xcode·Ruby/Bundler 환경이 필요하며 다른 OS에서는 미검증으로 생략합니다.\nAndroid SDK/JDK는 Android 포함 형태에만 준비합니다.\n앱 식별자·서명·기기 실행·스토어 제출은 별도 절차입니다.\n생성 시 SDK 설치·빌드·배포는 하지 않습니다. 기존 앱의 target 전환·자동 기능 업데이트/제거는 지원하지 않습니다.\n자세한 설치·환경·충돌·복구: README.md, docs/01-getting-started.md.\n";
const commandHelp = "Flutter Composer 명령 안내\n  npm run help                    명령 목록\n  npm run compose -- help         플랫폼·이름·생성 위치·예제 상세\n  npm run test:compose             생성·feature 회귀 검사\n\n먼저 compose 도움말에서 플랫폼을 선택하고 새 프로젝트를 생성합니다.\n생성 앱에서 npm run help, npm run feature -- list/add를 사용합니다.\nFlutter/FVM·선택 플랫폼 도구 준비는 앱 README와 docs/01-getting-started.md를 따릅니다.";

async function main() {
  const [target, name, ...extra] = process.argv.slice(2);
  if (name === undefined && extra.length === 0 && ['help', '--help', '--commands'].includes(target)) { console.log(target === '--commands' ? commandHelp : detailedHelp); return; }
  const reserved = /^(?:flutter|dart|test|lib|ios|android|build|docs|components|scripts|con|prn|aux|nul|com[1-9]|lpt[1-9])$/;
  const keywords = new Set(['abstract', 'as', 'assert', 'async', 'await', 'base', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'deferred', 'do', 'dynamic', 'else', 'enum', 'export', 'extends', 'extension', 'external', 'factory', 'false', 'final', 'finally', 'for', 'get', 'hide', 'if', 'implements', 'import', 'in', 'interface', 'is', 'late', 'library', 'mixin', 'new', 'null', 'of', 'on', 'operator', 'part', 'required', 'rethrow', 'return', 'sealed', 'set', 'show', 'static', 'super', 'switch', 'sync', 'this', 'throw', 'true', 'try', 'typedef', 'var', 'void', 'when', 'while', 'with', 'yield']);
  if (!targets.includes(target) || !name || !/^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/.test(name) || reserved.test(name) || keywords.has(name) || extra.length) throw new Error(usage + '\n이름은 Dart 패키지 형식의 영문 소문자·숫자·밑줄이며 경로/예약어는 사용할 수 없습니다.');
  const output = join(library, name);
  try { await lstat(output); throw new Error('기존 대상은 덮어쓰지 않습니다.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const files = await collect(seed);
  const targetDefinition = JSON.parse((await collect(join(library, 'components/02-targets', target))).get('compose.json'));
  const platforms = targets.includes(target) && target === 'android-ios' ? ['android', 'ios'] : [target];
  if (JSON.stringify(targetDefinition.platforms) !== JSON.stringify(platforms)) throw new Error('target 플랫폼 선언 불일치');
  for (const path of [...files.keys()]) {
    if ((!platforms.includes('android') && path.startsWith('android/')) || (!platforms.includes('ios') && (path.startsWith('ios/') || path === 'Gemfile')) || path === 'scripts/compose.mjs' || path.startsWith('test/composer/')) files.delete(path);
  }
  for (const [path, data] of files) {
    if (path.endsWith('.dart') || path === 'pubspec.yaml') files.set(path, Buffer.from(data.toString().replaceAll('package:mobile_app_sample/', `package:${name}/`).replace(/^name: mobile_app_sample$/m, `name: ${name}`)));
  }
  if (!platforms.includes('ios')) {
    for (const [path, data] of files) if (path.endsWith('.md')) files.set(path, Buffer.from(data.toString().replace(/\[([^\]]+)\]\((?:\.\.\/|\.\/)?Gemfile\)/g, '$1 (iOS 선택 시 포함)')));
  }
  const { files: features } = await featureCatalog(join(library, 'components/03-features'));
  for (const [path, data] of features) files.set(`.composer/features/${path}`, data);
  // 원본 migration 기록은 변경하지 않고 선택하지 않은 플랫폼 항목만 제외합니다.
  const metadata = files.get('.metadata').toString().replace(/    - platform: (android|ios)\n      create_revision: [^\n]+\n      base_revision: [^\n]+\n/g, (block, platform) => platforms.includes(platform) ? block : '');
  files.set('.metadata', Buffer.from(platforms.includes('ios') ? metadata : metadata.replace("    - 'ios/Runner.xcodeproj/project.pbxproj'\n", '')));
  const sourceDigest = hash(Buffer.concat([...files].sort(([a], [b]) => a.localeCompare(b)).map(([path, data]) => Buffer.concat([Buffer.from(path + '\0'), data]))));
  const base = JSON.parse((await collect(join(library, 'components/01-base/flutter'))).get('compose.json'));
  const state = { schemaVersion: 1, base, target, targetVersion: targetDefinition.version, packageName: name, sourceDigest, features: [], hashes: { 'lib/core/features.g.dart': hash(files.get('lib/core/features.g.dart')) }, assetBlock: assetBlock(files.get('pubspec.yaml').toString()) };
  files.set('.composer/state.json', Buffer.from(JSON.stringify(state, null, 2) + '\n'));
  files.set('package.json', Buffer.from(JSON.stringify({ name, private: true, engines: { node: '>=24 <27' }, scripts: { help: 'node scripts/feature.mjs help', feature: 'node scripts/feature.mjs' } }, null, 2) + '\n'));
  const docs = [...files.keys()].filter(path => path.startsWith('docs/') && path.endsWith('.md')).sort();
  files.set('README.md', Buffer.from(`# ${name}\n\n형태: ${target}. Android/iOS 식별자와 표시 이름은 예시값이며 docs/06-build-and-release.md에 따라 제품 값으로 변경합니다.\n\n먼저 [환경 준비](docs/01-getting-started.md)를 읽고 선택한 플랫폼의 도구를 설치합니다. Node는 feature 명령에만 필요합니다.\n\n\x60\x60\x60bash\nfvm install\nfvm flutter pub get\nfvm flutter analyze\nfvm flutter test\nnpm run feature -- add greeting-resource,counter\nfvm flutter devices\nfvm flutter run -d 기기ID\n\x60\x60\x60\n\n종료는 Ctrl+C입니다. feature 없이도 빈 시작 화면을 실행합니다.\n\n## 기능 추가\n\n\x60\x60\x60bash\nnpm run help\nnpm run feature -- list\nnpm run feature -- add counter\n\x60\x60\x60\n\n선택한 기능만 추가하고 화면·DI·해제·asset을 자동 연결합니다. pub get·analyze·test 후 Android debug APK, macOS에서는 iOS simulator 빌드를 수행합니다. macOS 외에서 iOS 빌드는 건너뛰며 미검증으로 표시합니다. 기존 파일 충돌/생성 파일 수정은 중단합니다. 실패 시 소스·pubspec/lock·상태를 복구하며 도구 캐시·빌드 결과·외부 설치 작업은 복구하지 않습니다.\n\n.composer의 기능 원본·버전·활성 내역을 Git에 보관합니다. catalog 자동 업데이트·feature 제거·target 전환은 지원하지 않습니다.\n\n## 설명서\n\n${docs.map(path => `- [${path}](${path})`).join('\n')}\n\n플랫폼 설치·배포 문서는 함께 보관하지만 선택하지 않은 플랫폼의 명령은 실행하지 않습니다. 생성 성공은 실제 빌드·기기 실행·스토어 제출 성공이 아닙니다.\n`));
  files.set('AGENTS.md', files.get('project-agents.md'));
  files.set('update.md', Buffer.from(`# 변경 이력\n\n## ${new Date().toISOString().slice(0, 10)} — 생성\n\n- 형태: ${target} ${targetDefinition.version}\n- 원본 스냅샷 SHA-256: ${sourceDigest}\n- 생성 시 설치·실행·배포는 수행하지 않았습니다.\n`));
  await mkdir(output);
  for (const [path, data] of files) { await mkdir(dirname(join(output, path)), { recursive: true }); await writeFile(join(output, path), data, { flag: 'wx', mode: path === 'android/gradlew' ? 0o755 : 0o644 }); }
  console.log(`생성 완료: ${output}\n선택 플랫폼: ${platforms.join(', ')}\n프로젝트 README의 환경 준비부터 진행합니다.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
