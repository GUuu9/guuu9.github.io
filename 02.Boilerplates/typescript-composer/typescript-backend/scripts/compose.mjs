import { readFile, readdir, lstat, mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const seed = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const library = dirname(seed);
const components = join(library, 'components');
const presets = {
  'typescript-backend': [],
  'backend-webui': ['01-base/frontend', '02-targets/backend-webui'],
  'web-app': ['01-base/frontend', '02-targets/web-app'],
  'web-phaser': ['01-base/phaser', '02-targets/web-phaser'],
  'electron-backend': ['01-base/electron-backend'],
  'electron-app': ['01-base/frontend', '01-base/electron-backend', '02-targets/electron-app'],
  'electron-phaser': ['01-base/phaser', '01-base/electron-backend', '03-features/services/game-persistence', '02-targets/electron-phaser'],
};
const featurePaths = {
  tcp: '03-features/communications/tcp',
  udp: '03-features/communications/udp',
  mqtt: '03-features/communications/mqtt',
  'socket-io': '03-features/communications/socket-io',
  'game-persistence': '03-features/services/game-persistence',
};
const featureNames = Object.keys(featurePaths);
const [target, output, ...options] = process.argv.slice(2);
const usage = `사용법: npm run compose -- <형태> <프로젝트명> [--features tcp,udp,mqtt,socket-io,game-persistence]\n형태: ${Object.keys(presets).join(', ')}`;
const reservedNames = new Set(['typescript-backend', 'components', 'docs', 'node-modules', 'dist', 'release', 'con', 'prn', 'aux', 'nul', ...Array.from({ length: 9 }, (_, index) => `com${index + 1}`), ...Array.from({ length: 9 }, (_, index) => `lpt${index + 1}`)]);

async function compose() {
  if (target === '--help' && output === undefined) { console.log(usage); return; }
  if (!Object.hasOwn(presets, target ?? '') || !output) throw new Error(usage);
  if (options.length && (options.length !== 2 || options[0] !== '--features')) throw new Error(usage);
  const features = options.length ? options[1].split(',') : [];
  if (features.some(name => !featureNames.includes(name)) || new Set(features).size !== features.length) throw new Error(`지원 기능: ${featureNames.join(', ')}`);
  const web = target === 'web-app' || target === 'web-phaser';
  if (web && features.length) throw new Error('Node 기능은 정적 웹 프로젝트에 추가할 수 없습니다. 별도 backend를 조합합니다.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(output) || reservedNames.has(output)) throw new Error('프로젝트명은 영문 소문자·숫자·하이픈으로 입력합니다. 경로와 예약 이름은 사용할 수 없습니다.');
  const destination = join(library, output);
  try { await lstat(destination); throw new Error('동일한 프로젝트가 이미 있습니다. 새 이름을 지정합니다.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }

  // 모든 조합·패치를 메모리에서 확인한 뒤 새 대상에 기록합니다.
  const files = new Map();
  async function collect(directory, prefix = '', feature = false) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const name = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (['.git', 'node_modules', 'dist', 'release', '.DS_Store'].includes(entry.name) || (entry.name.startsWith('.env') && entry.name !== '.env.example')) continue;
      if (entry.isSymbolicLink()) throw new Error(`템플릿 심볼릭 링크는 허용하지 않습니다: ${name}`);
      if (entry.isDirectory()) await collect(join(directory, entry.name), name, feature);
      else {
        const content = await readFile(join(directory, entry.name));
        if (feature && files.has(name) && name !== '.env.example') throw new Error(`기능 파일이 기존 파일과 충돌합니다. compose.json 패치로 연결합니다: ${name}`);
        files.set(name, name === '.env.example' && files.has(name) ? Buffer.concat([files.get(name), Buffer.from('\n'), content]) : content);
      }
    }
  }
  await collect(seed);
  const originalSeed = new Map(files);
  const selected = [...new Set([
    ...presets[target],
    ...(features.some(name => ['tcp', 'udp', 'mqtt'].includes(name)) ? ['03-features/communications/common'] : []),
    ...features.map(name => featurePaths[name]),
  ])];
  const recipes = [];
  for (const component of selected) {
    const feature = component.startsWith('03-features/');
    await collect(join(components, component, 'files'), '', feature);
    if (feature) recipes.push(JSON.parse(await readFile(join(components, component, 'compose.json'), 'utf8')));
  }
  const text = name => files.get(name)?.toString('utf8');
  const put = (name, content) => files.set(name, Buffer.from(content));
  function patch(name, before, after) {
    const source = text(name);
    if (!source || source.split(before).length !== 2) throw new Error(`연결 위치가 템플릿과 다릅니다: ${name}`);
    put(name, source.replace(before, after));
  }
  if (target === 'backend-webui') {
    patch('src/backend/core/web-server.ts', "import { GreetingBridge }", "import { createFrontendRouter } from './frontend.js';\nimport { GreetingBridge }");
    patch('src/backend/core/web-server.ts', "app.use((_request, response) => {\n    response.status(404).json({ success: false, payload: 'API not found.' });\n  });", "app.use('/api', (_request, response) => {\n    response.status(404).json({ success: false, payload: 'API not found.' });\n  });\n  app.use(createFrontendRouter());\n  app.use((_request, response) => {\n    response.status(404).json({ success: false, payload: 'Not found.' });\n  });");
  }
  if (target === 'electron-phaser') {
    patch('src/backend/electron.ts', 'const { greetingUsecase } = createDI();', "const { greetingUsecase, gamePersistence } = createDI(app.getPath('userData'));");
    put('src/preload/index.ts', text('src/preload/index.ts') + "\nimport './game-save.js';\n");
    patch('src/backend/electron.ts', "import { app, BrowserWindow }", "import { registerPersistenceIpc } from './bridge/persistence/persistence.ipc.js';\nimport { app, BrowserWindow }");
    patch('src/backend/electron.ts', 'cleanup = registerGreetingIpc(window, page, greetingUsecase);', "const removeGreeting = registerGreetingIpc(window, page, greetingUsecase);\n  const removePersistence = registerPersistenceIpc(window, page, gamePersistence);\n  cleanup = () => { removeGreeting(); removePersistence(); };");
  }

  for (const recipe of recipes) {
    if (recipe.patches !== undefined && !Array.isArray(recipe.patches)) throw new Error('compose.json patches는 배열이어야 합니다.');
    for (const change of recipe.patches ?? []) {
      if (!change || !['file', 'find', 'replace'].every(key => typeof change[key] === 'string') || !change.find) throw new Error('compose.json 패치 형식이 올바르지 않습니다.');
      patch(change.file, change.find, change.replace);
    }
  }

  const pkg = JSON.parse(text('package.json'));
  pkg.name = output;
  const scripts = pkg.scripts;
  delete scripts.compose;
  delete scripts['test:compose'];
  const dependencies = pkg.dependencies;
  const dev = pkg.devDependencies;
  const desktop = target.startsWith('electron-');
  const frontend = selected.includes('01-base/frontend') || selected.includes('01-base/phaser');
  if (frontend) {
    Object.assign(dev, { vite: '8.3.5' });
    if (selected.includes('01-base/frontend')) {
      Object.assign(dependencies, { react: '19.3.0', 'react-dom': '19.3.0' });
      Object.assign(dev, { '@types/react': '19.3.0', '@types/react-dom': '19.3.0' });
    } else dependencies.phaser = '4.2.1';
    Object.assign(scripts, {
      'dev:frontend': 'vite --config vite.config.ts',
      'check:frontend': 'tsc --noEmit -p tsconfig.frontend.json',
      'test:frontend': 'tsx --test test/frontend/*.test.ts',
      'build:frontend': 'npm run check:frontend && vite build --config vite.config.ts',
    });
  }
  if (desktop) {
    Object.assign(dev, { electron: '45.1.0', esbuild: '0.28.2', 'electron-builder': '26.18.0' });
    pkg.main = 'dist/backend/electron.js';
    Object.assign(scripts, {
      'build:electron': 'tsc -p tsconfig.electron.json && esbuild src/preload/index.ts --bundle --platform=node --format=cjs --outfile=dist/preload/index.cjs --external:electron && node scripts/copy-config.mjs',
      'start:desktop': 'electron .',
      'package:desktop': 'electron-builder --dir',
      'release:desktop': 'electron-builder',
    });
    scripts.build = frontend ? 'npm run build:electron && npm run build:frontend' : 'npm run build:electron && node scripts/copy-desktop-shell.mjs';
    scripts[frontend ? 'build:desktop' : 'build:desktop-backend'] = 'npm run build';
    scripts.start = 'npm run start:desktop';
    delete scripts.dev;
  }
  if (web) {
    for (const name of [...files.keys()]) {
      if (name.startsWith('src/backend/') || /^test\/[^/]+\.test\.ts$/.test(name) || name === 'tsconfig.build.json' || name === 'scripts/copy-config.mjs' || name === 'docs/02-boilerplate.md' || name === 'docs/03-build-and-release.md') files.delete(name);
    }
    delete dependencies.express; delete dev['@types/express'];
    put('tsconfig.json', JSON.stringify({ extends: './tsconfig.frontend.json' }, null, 2) + '\n');
    Object.assign(scripts, { dev: 'npm run dev:frontend', check: 'npm run check:frontend', test: 'npm run test:frontend', build: 'npm run build:frontend', 'build:web': 'npm run build', 'preview:web': 'vite preview --config vite.config.ts --host 127.0.0.1 --port 4173 --strictPort', start: 'npm run preview:web' });
  } else if (frontend) {
    scripts['check:backend'] = 'tsc --noEmit';
    scripts['test:backend'] = 'tsx --test test/*.test.ts';
    scripts.check = 'npm run check:backend && npm run check:frontend';
    scripts.test = 'npm run test:backend && npm run test:frontend';
    if (!desktop) {
      scripts['build:backend'] = 'npm run check:backend && tsc -p tsconfig.build.json && node scripts/copy-config.mjs';
      scripts.build = 'npm run build:backend && npm run build:frontend';
      scripts['build:backend-webui'] = 'npm run build';
    }
  }
  for (const recipe of recipes) {
    for (const [section, values] of Object.entries({ scripts: recipe.scripts, dependencies: recipe.dependencies, devDependencies: recipe.devDependencies })) {
      if (values === undefined) continue;
      if (!values || typeof values !== 'object' || Array.isArray(values)) throw new Error(`compose.json ${section}은 객체여야 합니다.`);
      for (const [name, value] of Object.entries(values)) {
        if (typeof value !== 'string') throw new Error(`compose.json ${section}.${name}은 문자열이어야 합니다.`);
        if (Object.hasOwn(pkg[section], name) && pkg[section][name] !== value) throw new Error(`패키지 설정 충돌: ${section}.${name}`);
        Object.defineProperty(pkg[section], name, { value, enumerable: true, writable: true, configurable: true });
      }
    }
  }
  put('package.json', JSON.stringify(pkg, null, 2) + '\n');
  // 새 manifest의 잠금은 출력 프로젝트의 첫 npm install에서 생성합니다.
  files.delete('package-lock.json');
  files.delete('scripts/compose.mjs');
  files.delete('test/compose.test.mjs');
  put('.gitignore', text('.gitignore') + '\nrelease/\n.env.*\n!.env.example\n');
  const nodePreparation = text('docs/01-getting-started.md').split('## 2. PC 기본 도구 준비')[1]?.split('## 4. 프로젝트 의존성 복원·검사')[0];
  if (!nodePreparation) throw new Error('Node 준비 문서 구성이 변경됐습니다.');
  put('docs/01-getting-started.md', '# 프로젝트 환경 준비\n\n생성된 프로젝트에서 시작합니다. package.json·.nvmrc·README와 선택 구성품 문서를 확인합니다. 최초에는 npm install로 잠금 파일을 만들고 이후에는 npm ci로 복원합니다. 실행 형태와 검사는 [README](../README.md)를 따릅니다.\n\n## 2. PC 기본 도구 준비' + nodePreparation + '\n## 설치·실행\n\n준비한 Node 환경에서 README의 설치·검사·빌드·실행 순서를 진행합니다. 종료는 Ctrl+C입니다.\n');
  put('docs/02-boilerplate.md', '# 프로젝트 구조\n\n' + `형태: ${target}.\n\n` + (web ? 'src/frontend의 진입점·core·기능별 Scene과 Api를 사용합니다. Node 전용 모듈을 브라우저에서 import하지 않습니다.\n' : 'src/backend의 진입점·core DI·기능별 Bridge/Usecase·Service를 사용합니다. frontend가 있으면 별도 빌드하고 HTTP 또는 IPC로 연결합니다.\n') + '\n선택 구성품의 상세 연결·수정 지점은 README에 나열한 프로젝트 내부 docs를 따릅니다. 외부 구성품 폴더를 import하지 않습니다.\n');
  if (web) put('docs/03-build-and-release.md', '# 웹 빌드·배포\n\nnpm run build로 생성한 dist/frontend 전체를 정적 호스팅에 배포합니다. npm start는 로컬 preview이며 운영 서비스가 아닙니다. 실제 API·자산·저장·브라우저·배포 OS의 검증 범위와 복귀 절차는 선택한 웹 구성품 문서를 따릅니다. 정상 산출물·lock·공개 빌드 설정을 릴리스 단위로 보관합니다.\n');

  const docNames = [...files.keys()].filter(name => name.startsWith('docs/') && name.endsWith('.md')).sort();
  const title = `# ${pkg.name}\n\n${target} 조합으로 생성한 프로젝트입니다. 구성품 복사·연결과 package.json 설정은 적용됐습니다.\n\n`;
  put('README.md', title + '## 설치·실행\n\nNode 버전은 .nvmrc를 사용합니다. 최초에는 npm install로 이 조합의 package-lock.json을 생성·보관합니다. 이후 같은 잠금 파일 복원은 npm ci를 사용합니다.\n\n```bash\nnpm install\nnpm run check\nnpm test\nnpm run build\nnpm start\n```\n\n' + (desktop ? '실제 Electron 실행·패키징은 OS/CPU 지원과 설치 스크립트 승인을 확인합니다. 기본 macOS 묶음은 미서명입니다.\n\n' : web ? 'npm start는 정적 결과의 로컬 preview입니다. 실제 웹 배포는 선택한 웹 문서를 따릅니다.\n\n' : '기본 HTTP는 127.0.0.1:3101입니다. 종료는 Ctrl+C입니다.\n\n') + (features.length ? `선택한 기능: ${features.join(', ')}. 통신 기능은 npm run start:<통신명>으로 별도 실행합니다. MQTT는 .env를 먼저 준비합니다. game-persistence는 DI의 gamePersistence로 사용합니다.\n\n` : '') + '## 설명서\n\n' + docNames.map(name => `- [${name}](${name})`).join('\n') + '\n\n구성품 문서의 수동 복사·npm scripts 등록은 이미 적용된 상태입니다. 환경 설정·사용·배포·데이터 보존 절차를 확인합니다.\n');
  put('project-agents.md', '# 프로젝트 작업 지침\n\n실행·설치·검사는 [README](./README.md)를 따릅니다. Node·의존성은 .nvmrc·package.json과 첫 npm install로 생성한 lock을 기준으로 합니다. 원본 Composer에 의존하지 않습니다.\n\n진입점·DI·Bridge·Usecase·Service의 경계를 유지합니다. 외부 입력·Origin·IPC 발신자를 검증하고 내부 오류 상세를 노출하지 않습니다. 실제 .env·비밀값·캐시·dist·release를 Git에서 제외합니다. 종료·삭제·업데이트 전에 저장 데이터와 정상 릴리스를 보존합니다.\n\n변경 후 npm run check·npm test·npm run build와 관련 실행을 확인하고 실제 GUI·원격·다른 OS의 미검증 범위를 구분해 기록합니다.\n');
  put('AGENTS.md', text('project-agents.md'));
  put('update.md', `# 변경 이력\n\n## ${new Date().toISOString().slice(0, 10)} — 프로젝트 생성\n\n- 형태: ${target}\n- 구성품: ${selected.join(', ') || '기준 뼈대 단독'}\n- 생성 시 패키지 설치·테스트·빌드·배포는 실행하지 않았습니다.\n`);
  // 반출 프로젝트에서 원본 Composer 없이 같은 조합을 재현합니다.
  if (!process.env.COMPOSER_INTERNAL) {
    const catalog = new Map();
    async function catalogFiles(directory, prefix) {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        if (['node_modules', '.git', 'dist', 'release', '.DS_Store'].includes(entry.name) || (entry.name.startsWith('.env') && entry.name !== '.env.example')) continue;
        if (entry.isSymbolicLink()) throw new Error('구성품 심볼릭 링크는 허용하지 않습니다.');
        const name = `${prefix}/${entry.name}`;
        if (entry.isDirectory()) await catalogFiles(join(directory, entry.name), name);
        else catalog.set(name, await readFile(join(directory, entry.name)));
      }
    }
    for (const [name, content] of originalSeed) catalog.set(`typescript-backend/${name}`, content);
    await catalogFiles(components, 'components');
    const baseline = Object.fromEntries([...files].map(([name, content]) => [name, createHash('sha256').update(content).digest('hex')]));
    for (const [name, content] of catalog) put(`.composer/catalog/${name}`, content);
    put('.composer/state.json', JSON.stringify({ target, features: [...new Set([...(target === 'electron-phaser' ? ['game-persistence'] : []), ...features])], baseline }, null, 2) + '\n');
    pkg.scripts.feature = 'node scripts/feature.mjs';
    put('package.json', JSON.stringify(pkg, null, 2) + '\n');
    put('scripts/feature.mjs', originalSeed.get('scripts/feature.mjs'));
    put('README.md', text('README.md') + '\n## 기능 추가\n\n```bash\nnpm run feature -- list\nnpm run feature -- add socket-io\n```\n\n구현·연결·의존성을 자동 반영하고 설치·검사·테스트·빌드를 수행합니다. 변경할 파일이 수정되어 있으면 중단합니다. .composer는 구성품 원본과 활성화 내역이므로 Git에 포함합니다.\n');
  }
  await mkdir(destination);
  for (const [name, content] of files) {
    const path = join(destination, name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, { flag: 'wx' });
  }
  console.log(`생성 완료: ${destination}\n형태: ${target}\n다음: 출력 폴더에서 npm install → npm run check → npm test → npm run build → npm start`);
}

compose().catch(error => { console.error(error.message); process.exitCode = 1; });
