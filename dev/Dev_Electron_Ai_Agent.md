# TypeScript + Electron 기반 로컬 AI 에이전트 앱 구축 가이드

---

## 핵심 라이브러리 스택

| 역할 | 라이브러리 | 이유 |
| :--- | :--- | :--- |
| **LLM 추론 엔진** | `node-llama-cpp` | llama.cpp의 공식 Node.js 바인딩. TypeScript 완전 지원, Metal/CUDA 자동 감지 |
| **마우스/키보드 시뮬레이션** | `robotjs` | MIT 라이선스 무료. 크로스 플랫폼 마우스/키보드 시뮬레이션 |
| **글로벌 입력 이벤트 감지** | `uiohook-napi` | MIT 라이선스 무료. N-API 기반 글로벌 키/마우스 훅 (TypeScript 내장) |
| **화면 캡처** | Electron 내장 `desktopCapturer` | 별도 라이브러리 불필요. macOS 권한 처리 포함 |
| **파일 시스템** | Node.js `fs/promises` | 내장 |
| **터미널 실행** | Node.js `child_process` | 내장 |
| **앱 빌드/번들** | `electron-vite` or `electron-forge` | TypeScript + Vite 환경 권장 |

---

## 1. 프로젝트 초기 세팅

### 공식 스캐폴드 (권장)

```bash
# node-llama-cpp 공식 Electron + TypeScript + React 템플릿
npm create node-llama-cpp@latest -- --template electron-typescript-react

cd my-ai-app
npm install

# 추가 도구 설치
npm install robotjs                 # 마우스/키보드 시뮬레이션 (MIT)
npm install uiohook-napi            # 글로벌 입력 이벤트 훅 (MIT)
npm install @types/robotjs          # TypeScript 타입 정의
```

### 또는 기존 프로젝트에 추가

```bash
npm install node-llama-cpp
npm install @nut-tree/nut-js

# 모델 다운로드 (CLI 도구 포함)
npx node-llama-cpp download \
  --repo Qwen/Qwen2.5-Coder-7B-Instruct-GGUF \
  --filename qwen2.5-coder-7b-instruct-q4_k_m.gguf
```

---

## 2. 핵심 아키텍처 — 프로세스 분리

```
┌─────────────────────────────────────────────────────────┐
│                    Electron App                          │
│                                                          │
│  ┌─────────────────────────┐                            │
│  │   Renderer Process (UI)  │                            │
│  │   React / Vanilla TS     │                            │
│  │   - 채팅 UI              │                            │
│  │   - 작업 결과 표시       │                            │
│  └────────────┬────────────┘                            │
│               │  IPC (ipcRenderer / contextBridge)       │
│               ▼                                          │
│  ┌─────────────────────────┐                            │
│  │   Main Process           │  ← Node.js 풀 권한         │
│  │   - LLM 추론 (node-llama)│                            │
│  │   - 도구 실행 관리       │                            │
│  │   - 화면 캡처            │                            │
│  └────────────┬────────────┘                            │
│               │                                          │
│    ┌──────────┼──────────────┐                           │
│    ▼          ▼              ▼                           │
│  [파일R/W] [터미널 실행]  [마우스/키보드]                 │
│  fs/promises  child_process  @nut-tree/nut-js            │
└─────────────────────────────────────────────────────────┘

⚠️ node-llama-cpp는 반드시 Main Process에서만 사용
   Renderer에서 직접 사용하면 앱이 크래시됨
```

---

## 3. Main Process — LLM 초기화

```typescript
// src/main/llm.ts

import { getLlama, LlamaChatSession, LlamaModel, LlamaContext } from "node-llama-cpp";
import path from "path";
import { app } from "electron";

let model: LlamaModel | null = null;
let context: LlamaContext | null = null;
let session: LlamaChatSession | null = null;

export async function initLLM() {
  const llama = await getLlama(); // Metal / CUDA 자동 감지

  model = await llama.loadModel({
    modelPath: path.join(app.getPath("userData"), "models", "qwen2.5-coder-7b-q4_k_m.gguf"),
  });

  context = await model.createContext({
    contextSize: 16384,   // 컨텍스트 창: 16K 토큰
  });

  session = new LlamaChatSession({
    contextSequence: context.getSequence(),
    systemPrompt: `
      너는 로컬 AI 에이전트야. 사용자의 요청에 따라:
      - 파일을 읽고 수정할 수 있어
      - 터미널 명령어를 실행할 수 있어
      - 화면을 분석하고 마우스/키보드를 제어할 수 있어
      행동이 필요할 경우, 반드시 JSON 형식으로 도구 호출을 출력해.
    `
  });

  console.log("✅ LLM 초기화 완료");
}

export async function chat(
  prompt: string,
  onToken: (token: string) => void  // 스트리밍 콜백
): Promise<string> {
  if (!session) throw new Error("LLM이 초기화되지 않았습니다.");

  let fullResponse = "";

  await session.prompt(prompt, {
    onTextChunk(chunk) {
      fullResponse += chunk;
      onToken(chunk);  // 토큰 단위로 Renderer에 전송
    },
  });

  return fullResponse;
}
```

---

## 4. Main Process — 도구 모음 (Tools)

```typescript
// src/main/tools.ts

import fs from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";
import { desktopCapturer } from "electron";

const execAsync = promisify(exec);

// ── 파일 도구 ──────────────────────────────────────────

export async function readFile(filePath: string): Promise<string> {
  return await fs.readFile(filePath, "utf-8");
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, "utf-8");
}

export async function listDir(dirPath: string): Promise<string[]> {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  return entries.map(e => (e.isDirectory() ? `[DIR] ${e.name}` : e.name));
}

// ── 터미널 도구 ────────────────────────────────────────

export async function runCommand(
  command: string,
  cwd?: string
): Promise<{ stdout: string; stderr: string }> {
  try {
    const result = await execAsync(command, {
      cwd: cwd ?? process.cwd(),
      timeout: 30000,         // 30초 타임아웃
      maxBuffer: 1024 * 1024, // 1MB 출력 버퍼
    });
    return result;
  } catch (err: any) {
    return { stdout: "", stderr: err.message };
  }
}

// ── 화면 캡처 도구 ─────────────────────────────────────

export async function captureScreen(): Promise<string> {
  // Electron 내장 desktopCapturer 사용
  const sources = await desktopCapturer.getSources({
    types: ["screen"],
    thumbnailSize: { width: 1920, height: 1080 },
  });

  if (sources.length === 0) throw new Error("캡처 가능한 화면이 없습니다.");

  // NativeImage → base64 PNG 변환
  const thumbnail = sources[0].thumbnail;
  return thumbnail.toPNG().toString("base64");
}
```

---

## 5. Main Process — 마우스/키보드 제어

```typescript
// src/main/automation.ts

// robotjs: 마우스/키보드 시뮬레이션 (MIT 라이선스)
import robot from "robotjs";
// uiohook-napi: 글로벌 입력 이벤트 감지 (MIT 라이선스)
import { uIOhook, UiohookKey } from "uiohook-napi";

// ── 마우스 제어 (robotjs) ─────────────────────────────

export function moveMouse(x: number, y: number): void {
  robot.moveMouse(x, y);
}

export function clickMouse(
  x: number,
  y: number,
  button: "left" | "right" | "middle" = "left"
): void {
  robot.moveMouse(x, y);
  robot.mouseClick(button);
}

export function doubleClick(x: number, y: number): void {
  robot.moveMouse(x, y);
  robot.mouseClick("left", true); // true = 더블클릭
}

export function dragMouse(
  fromX: number, fromY: number,
  toX: number,   toY: number
): void {
  robot.moveMouse(fromX, fromY);
  robot.mouseToggle("down", "left");
  robot.dragMouse(toX, toY);
  robot.mouseToggle("up", "left");
}

export function scrollMouse(x: number, y: number, direction: "up" | "down", amount = 3): void {
  robot.moveMouse(x, y);
  robot.scrollMouse(amount, direction === "up" ? 1 : -1);
}

// ── 키보드 제어 (robotjs) ─────────────────────────────

export function typeText(text: string): void {
  robot.typeString(text);
}

export function pressKey(key: string, modifier?: string): void {
  if (modifier) {
    robot.keyTap(key, modifier);
  } else {
    robot.keyTap(key);
  }
}

// 자주 쓰는 단축키 헬퍼
export const Shortcuts = {
  // Windows / Linux
  copy:      () => robot.keyTap("c", "control"),
  paste:     () => robot.keyTap("v", "control"),
  undo:      () => robot.keyTap("z", "control"),
  selectAll: () => robot.keyTap("a", "control"),
  // macOS (command key)
  macCopy:   () => robot.keyTap("c", "command"),
  macPaste:  () => robot.keyTap("v", "command"),
  macUndo:   () => robot.keyTap("z", "command"),
};

// ── 화면 정보 (robotjs) ──────────────────────────────

export function getScreenSize(): { width: number; height: number } {
  return robot.getScreenSize();
}

export function getPixelColor(x: number, y: number): string {
  return robot.getPixelColor(x, y); // 16진수 색상값 반환
}

// ── 글로벌 입력 이벤트 훅 (uiohook-napi) ──────────────
// 사용자가 마우스/키보드를 사용하는 것을 감지 (AI 작업 중단 등에 활용)

export function startInputHook(onKeyDown?: (key: number) => void): void {
  if (onKeyDown) {
    uIOhook.on("keydown", (e) => {
      // ESC 키 감지 시 에이전트 긴급 중단 등에 활용
      if (e.keycode === UiohookKey.Escape) {
        console.log("[안전장치] ESC 감지 → 에이전트 작업 중단");
      }
      onKeyDown(e.keycode);
    });
  }
  uIOhook.start();
}

export function stopInputHook(): void {
  uIOhook.stop();
}
```

---

## 6. Main Process — IPC 핸들러 등록

```typescript
// src/main/ipc-handlers.ts

import { ipcMain, BrowserWindow } from "electron";
import { chat } from "./llm";
import { readFile, writeFile, listDir, runCommand, captureScreen } from "./tools";
import { clickMouse, typeText, pressKey, moveMouse } from "./automation";
import { Key } from "@nut-tree/nut-js";

export function registerIpcHandlers(win: BrowserWindow) {

  // ── LLM 채팅 (스트리밍) ─────────────────────────────
  ipcMain.handle("llm:chat", async (_event, prompt: string) => {
    await chat(prompt, (token) => {
      // 토큰을 Renderer로 스트리밍 전송
      win.webContents.send("llm:token", token);
    });
  });

  // ── 파일 도구 ────────────────────────────────────────
  ipcMain.handle("tool:readFile",  (_e, path: string) => readFile(path));
  ipcMain.handle("tool:writeFile", (_e, path: string, content: string) => writeFile(path, content));
  ipcMain.handle("tool:listDir",   (_e, path: string) => listDir(path));

  // ── 터미널 도구 ──────────────────────────────────────
  ipcMain.handle("tool:runCommand", (_e, cmd: string, cwd?: string) => runCommand(cmd, cwd));

  // ── 화면 캡처 ────────────────────────────────────────
  ipcMain.handle("tool:captureScreen", () => captureScreen());

  // ── 마우스/키보드 ────────────────────────────────────
  ipcMain.handle("tool:click",    (_e, x: number, y: number) => clickMouse(x, y));
  ipcMain.handle("tool:type",     (_e, text: string) => typeText(text));
  ipcMain.handle("tool:keyPress", (_e, key: string, mod?: string) => pressKey(key, mod));
  ipcMain.handle("tool:move",     (_e, x: number, y: number) => moveMouse(x, y));
  ipcMain.handle("tool:scroll",   (_e, x: number, y: number, dir: "up"|"down") => scrollMouse(x, y, dir));
  ipcMain.handle("tool:getScreenSize", () => getScreenSize());
}
```

---

## 7. Preload Script — 보안 브릿지

```typescript
// src/preload/index.ts
// contextBridge로 Renderer에 안전하게 API 노출

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ai", {
  // LLM 채팅
  chat: (prompt: string) => ipcRenderer.invoke("llm:chat", prompt),
  onToken: (cb: (token: string) => void) =>
    ipcRenderer.on("llm:token", (_e, token) => cb(token)),

  // 파일 도구
  readFile:  (path: string) => ipcRenderer.invoke("tool:readFile", path),
  writeFile: (path: string, content: string) => ipcRenderer.invoke("tool:writeFile", path, content),
  listDir:   (path: string) => ipcRenderer.invoke("tool:listDir", path),

  // 터미널
  runCommand: (cmd: string, cwd?: string) => ipcRenderer.invoke("tool:runCommand", cmd, cwd),

  // 화면 캡처
  captureScreen: () => ipcRenderer.invoke("tool:captureScreen"),

  // 마우스/키보드
  click:         (x: number, y: number) => ipcRenderer.invoke("tool:click", x, y),
  type:          (text: string) => ipcRenderer.invoke("tool:type", text),
  keyPress:      (key: string, mod?: string) => ipcRenderer.invoke("tool:keyPress", key, mod),
  move:          (x: number, y: number) => ipcRenderer.invoke("tool:move", x, y),
  scroll:        (x: number, y: number, dir: "up"|"down") => ipcRenderer.invoke("tool:scroll", x, y, dir),
  getScreenSize: () => ipcRenderer.invoke("tool:getScreenSize"),
});

// TypeScript 타입 선언
declare global {
  interface Window {
    ai: typeof window.ai;
  }
}
```

---

## 8. Renderer — UI에서 사용 예시

```typescript
// src/renderer/App.tsx (React)

export default function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentToken, setCurrentToken] = useState("");

  useEffect(() => {
    // 토큰 스트리밍 수신
    window.ai.onToken((token: string) => {
      setCurrentToken(prev => prev + token);
    });
  }, []);

  const handleSend = async (prompt: string) => {
    setCurrentToken("");
    await window.ai.chat(prompt);
    setMessages(prev => [...prev, currentToken]);
  };

  const handleScreenCapture = async () => {
    const base64Img = await window.ai.captureScreen();
    // VLM에 이미지와 함께 전달하는 로직...
  };

  const handleRunCommand = async () => {
    const result = await window.ai.runCommand("ls -la", "/Users/user/Desktop");
    console.log(result.stdout);
  };

  return (
    <div>
      {/* 채팅 UI 구현 */}
    </div>
  );
}
```

---

## 9. electron-builder 패키징 설정

```json
// package.json (electron-builder 설정)
{
  "build": {
    "appId": "com.myapp.ai-agent",
    "asarUnpack": [
      "node_modules/node-llama-cpp/**",
      "node_modules/@nut-tree/**",
      "resources/models/**"
    ],
    "extraResources": [
      {
        "from": "models/",
        "to": "models/",
        "filter": ["**/*.gguf"]
      }
    ],
    "mac": {
      "entitlements": "build/entitlements.mac.plist",
      "hardenedRuntime": true
    }
  }
}
```

```xml
<!-- build/entitlements.mac.plist (macOS 권한) -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" ...>
<plist version="1.0">
<dict>
  <!-- 화면 녹화 권한 -->
  <key>com.apple.security.device.camera</key><true/>
  <!-- 접근성 권한 (마우스/키보드 제어) -->
  <key>com.apple.security.automation.apple-events</key><true/>
</dict>
</plist>
```

---

## 10. OS별 권한 처리

### macOS — 접근성 및 화면 녹화 권한

```typescript
// src/main/permissions.ts (macOS)
import { systemPreferences, dialog } from "electron";

export async function requestMacPermissions() {
  // 화면 녹화 권한 확인
  const screenStatus = systemPreferences.getMediaAccessStatus("screen");
  if (screenStatus !== "granted") {
    dialog.showMessageBox({
      message: "화면 캡처를 위해 화면 녹화 권한이 필요합니다.",
      detail: "시스템 환경설정 > 개인정보 보호 > 화면 녹화에서 이 앱을 허용해 주세요."
    });
  }

  // 접근성 권한 확인 (마우스/키보드 제어용)
  const accessibilityGranted = systemPreferences.isTrustedAccessibilityClient(true);
  if (!accessibilityGranted) {
    dialog.showMessageBox({
      message: "마우스/키보드 제어를 위해 손쉬운 사용 권한이 필요합니다.",
      detail: "시스템 환경설정 > 개인정보 보호 > 손쉬운 사용에서 이 앱을 허용해 주세요."
    });
  }
}
```

### Windows — UAC 처리

```typescript
// Windows에서 관리자 권한 확인
import { exec } from "child_process";

function isRunningAsAdmin(): Promise<boolean> {
  return new Promise(resolve => {
    exec("net session", (err) => resolve(!err));
  });
}
```

### Linux — Wayland/X11 감지

```typescript
// X11 vs Wayland 환경 감지
const isWayland = process.env.WAYLAND_DISPLAY !== undefined;
const displayServer = isWayland ? "wayland" : "x11";
console.log(`디스플레이 서버: ${displayServer}`);

// nut.js는 X11/Wayland 모두 지원하나
// Wayland에서는 일부 기능 제한 있을 수 있음
```

---

## 11. 개발 로드맵 (단계별 구현 순서)

```
✅ Step 1  node-llama-cpp 설치 + GGUF 모델 로드 + 기본 채팅
✅ Step 2  IPC 연결 + Renderer에서 채팅 UI + 스트리밍 토큰 표시
✅ Step 3  파일 읽기/쓰기 도구 연결
✅ Step 4  터미널 실행 도구 연결 + 결과 UI 표시
✅ Step 5  화면 캡처 (desktopCapturer) 연결
✅ Step 6  @nut-tree/nut-js 마우스/키보드 제어 연결
✅ Step 7  VLM 모델 추가 (qwen2.5vl) + 화면 분석 기능
✅ Step 8  도구 자동 선택 에이전트 루프 구현
✅ Step 9  electron-builder 패키징 + 권한 설정
```
