<!-- version: v1.1.0 -->
# C/C++ 툴체인·빌드 환경 버전 관리

확인일: 2026-10-28. C/C++는 GCC·Clang·MSVC 컴파일러와 링커·표준 라이브러리·SDK·빌드 도구의 조합을 관리합니다. 모든 OS를 통합하는 nvm 같은 도구를 필수로 추가하지 않고, OS별 병행 설치와 프로젝트 빌드 설정을 사용합니다. 초기 설치는 [00.Setup](../00.Setup/OS_Dev_Setting.md)을 따릅니다.

## 1. 무엇을 고정할 것인가

| 항목 | 의미 | 기록 위치 예시 |
| :--- | :--- | :--- |
| C11·C17·C++17·C++20 등 | 사용할 언어 표준 | CMakeLists.txt의 타깃 설정 |
| GCC·Clang·MSVC 버전 | 컴파일러 구현과 호환성 | 빌드 기록·CMake 프리셋·CI |
| SDK·표준 라이브러리·링커 | 플랫폼 API·헤더·ABI·실행 호환성 | 툴체인 설정·SDK 버전·이미지 기록 |
| CMake·Ninja·MSBuild | 구성·빌드 실행 도구 | 개발 환경 요구 버전·CI |
| 외부 라이브러리 | 프로젝트 의존성 | 기존 패키지 관리자의 manifest·잠금/기준 버전 |
| CPU·최소 OS·빌드 옵션 | 결과물의 대상 | 프리셋·toolchain 파일·CI |

C++20 지정만으로 컴파일러 버전이 고정되지는 않습니다. CMake 최소 버전 선언도 정확한 설치 버전의 고정을 대신하지 않습니다. 컴파일러가 같아도 SDK·라이브러리·옵션이 다르면 결과가 달라질 수 있습니다.

## 2. Linux: 병행 설치 후 프로젝트에서 선택

배포판 저장소에서 제공하는 GCC·Clang 버전을 확인하고 필요한 버전만 설치합니다. 예를 들어 gcc-13·g++-13이 설치된 환경에서:

```bash
gcc-13 --version
g++-13 --version
cmake -S . -B build/gcc13 -DCMAKE_C_COMPILER=gcc-13 -DCMAKE_CXX_COMPILER=g++-13
cmake --build build/gcc13
```

기존 프로젝트의 프리셋이 있으면 그것을 우선합니다. 다른 버전은 별도 빌드 디렉터리를 사용합니다. 모든 프로젝트를 위해 시스템 gcc 심볼릭 링크나 update-alternatives를 먼저 변경하지 않습니다. Clang도 실제 설치된 clang·clang++ 쌍을 같은 방식으로 선택합니다. C++ 표준 라이브러리·런타임의 최소 실행 환경도 확인합니다.

## 3. macOS: Xcode·Apple Clang·SDK 선택

```bash
xcode-select -p
xcodebuild -version
xcrun --find clang
xcrun clang --version
xcrun --show-sdk-path
xcrun --show-sdk-version
```

xcodebuild는 전체 Xcode가 필요한 경우 사용합니다. Command Line Tools만 설치한 환경에서는 전체 Xcode 명령이 실패할 수 있습니다. 여러 Xcode를 설치했다면 프로젝트 요구 버전의 앱을 선택합니다. 예를 들어 해당 경로에 Xcode가 실제 설치된 경우:

```bash
DEVELOPER_DIR=/Applications/Xcode_16.app/Contents/Developer xcrun clang --version
DEVELOPER_DIR=/Applications/Xcode_16.app/Contents/Developer cmake -S . -B build/xcode16
DEVELOPER_DIR=/Applications/Xcode_16.app/Contents/Developer cmake --build build/xcode16
```

버전·경로는 예시입니다. 해당 Xcode가 현재 macOS에서 실행되는지도 확인합니다. DEVELOPER_DIR은 그 명령에 적용합니다. 시스템 기본 선택까지 바꾸려면 관리자가 `sudo xcode-select --switch 실제경로`를 사용하며 다른 프로젝트에 미치는 영향을 확인합니다.

Apple Clang과 LLVM 배포 Clang은 같은 이름이어도 동일한 버전 체계·SDK 통합이 아닙니다. Homebrew LLVM을 추가할 경우 실행 경로·SDK·라이브러리 구성을 명시합니다. Apple Silicon arm64와 Intel x86_64 대상, 최소 배포 OS도 프로젝트 설정에 기록합니다.

### macOS CMake와 pkgconf 설치·업데이트

Homebrew 없이 CMake의 [공식 다운로드](https://cmake.org/download/)에서 사용 중인 macOS를 지원하는 **stable macOS universal** 배포판을 선택합니다. 2026-10-30 확인한 stable 4.4.5의 일반 macOS 배포판은 macOS 12 이상으로 안내되어 있습니다. RC·nightly와 구분하고 프로젝트가 요구하는 버전이 있으면 그 버전을 우선합니다.

DMG를 내려받아 CMake.app을 Applications에 설치하거나 공식 tar.gz를 원하는 경로에 풉니다. curl을 사용하려면 공식 페이지에서 해당 릴리스의 정확한 다운로드 링크를 복사합니다. 고정 URL 형식 예시는 다음과 같으며 설치기는 실행하지 않습니다.

```bash
curl -fL 'https://github.com/Kitware/CMake/releases/download/v4.4.5/cmake-4.4.5-macos-universal.dmg' -o CMake-4.4.5.dmg
```

배포 페이지의 SHA-256과 받은 파일을 확인한 뒤 DMG를 열어 설치합니다. CMake.app을 Applications에 둔 경우 ~/.zshrc에 `export PATH="/Applications/CMake.app/Contents/bin:$PATH"`를 한 번 추가하고 새 터미널에서 cmake --version을 확인합니다. tar.gz는 bin·share 등 디렉터리 관계를 유지하고 해당 bin 경로를 PATH에 둡니다. 기존 brew cmake가 먼저 잡히면 which -a cmake로 우선순위를 확인하며 기존 설치를 임의 삭제하지 않습니다.

갱신은 새 공식 stable 배포판으로 같은 절차를 수행합니다. 프로젝트 요구 버전과 이전 설치 파일·경로를 기록하고 별도 빌드 디렉터리에서 검증한 뒤 이전 버전을 정리합니다.

pkgconf는 모든 프로젝트의 필수 초기 도구가 아닙니다. 필요한 경우 [공식 release tarball과 빌드 안내](https://github.com/pkgconf/pkgconf)를 사용합니다. 현재 upstream 빌드는 Meson을 사용하므로 해당 릴리스의 도구 조건을 먼저 확인하고 소스 빌드합니다. 임의의 curl 설치 스크립트를 사용하지 않습니다. 갱신도 목표 릴리스로 다시 빌드·설치하며 설치 prefix·버전을 기록합니다.

## 4. Windows: MSVC 툴셋·Windows SDK

Visual Studio Installer에서 프로젝트가 요구하는 C++ Build Tools·툴셋·Windows SDK를 설치합니다. 필요한 이전 툴셋은 지원 범위에서 병행 설치하고 프로젝트의 Platform Toolset·Windows SDK Version을 선택합니다. v143 같은 툴셋 이름만으로 세부 MSVC 패치 버전까지 고정되지는 않습니다.

해당 버전·아키텍처의 Developer PowerShell 또는 Native Tools 명령 프롬프트에서 cl·CMake·SDK 환경을 확인합니다. CMake Visual Studio generator를 쓰는 경우 실제 설치된 generator·architecture·toolset을 선택하고 프리셋 또는 CI에 기록합니다. 일반 PowerShell에서 cl을 찾지 못한다고 곧바로 재설치하지 않습니다.

Windows SDK와 MSVC의 버전은 별개이며 x64·ARM64도 구분합니다. 기존 .vcxproj·프리셋을 임의로 최신 툴셋으로 재대상화하지 않습니다. [Microsoft 툴셋 선택](https://learn.microsoft.com/en-us/cpp/build/how-to-modify-the-target-framework-and-platform-toolset?view=msvc-170)

## 5. CMake 프리셋으로 공유

CMakePresets.json은 팀 공용 설정, CMakeUserPresets.json은 개인 설치 경로 등 로컬 설정에 사용하며 후자는 Git에서 제외합니다. 프리셋은 컴파일러를 설치해 주거나 바이너리를 잠그는 파일이 아닙니다.

아래는 GCC 13 쌍이 설치된 Linux용 예시입니다. 기존 프리셋은 덮어쓰지 않고 필요한 항목만 병합합니다. schema version 3은 CMake 3.21 이상을 요구합니다.

```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "linux-gcc13",
      "generator": "Unix Makefiles",
      "binaryDir": "${sourceDir}/build/gcc13",
      "cacheVariables": {
        "CMAKE_C_COMPILER": "gcc-13",
        "CMAKE_CXX_COMPILER": "g++-13",
        "CMAKE_BUILD_TYPE": "Debug"
      }
    }
  ],
  "buildPresets": [
    {
      "name": "linux-gcc13",
      "configurePreset": "linux-gcc13"
    }
  ]
}
```

```bash
cmake --list-presets
cmake --preset linux-gcc13
cmake --build --preset linux-gcc13
```

크로스 컴파일은 기존 toolchain 파일에 대상 시스템·컴파일러·sysroot·SDK를 지정하고 프리셋에서 연결합니다. 동일 build 디렉터리의 컴파일러만 뒤늦게 바꾸지 않습니다. CC·CXX 환경 변수도 보통 최초 구성에서 반영되므로 기존 CMake 캐시를 두고 변경됐다고 가정하지 않습니다.

## 6. 언어 표준과 의존성

CMake 타깃의 C_STANDARD·CXX_STANDARD 또는 target_compile_features로 요구 표준을 선언합니다. 예를 들어 기존 app 타깃에 C++20을 요구하려면 `target_compile_features(app PRIVATE cxx_std_20)`을 사용합니다. 엄격한 표준·확장 허용 여부는 프로젝트 정책에 맞춰 추가합니다.

외부 라이브러리는 기존 프로젝트가 쓰는 vcpkg·Conan·FetchContent 등의 버전 관리 방식을 유지합니다. 버전 관리를 위해 여러 패키지 관리자를 동시에 도입하지 않습니다. manifest나 다운로드 태그만으로 모든 의존성이 완전히 고정되는지, 잠금·baseline·해시가 필요한지도 해당 도구 기준으로 확인합니다.

## 7. 업데이트·복귀와 검증

1. 현재 컴파일러·SDK·CMake·CPU·의존성·빌드 옵션을 기록합니다.
2. 새 툴체인을 병행 설치하고 별도 프리셋·빌드 디렉터리에서 구성합니다.
3. 컴파일·테스트·링크·실제 대상 OS 실행을 확인합니다. CTest가 구성된 프로젝트는 `ctest --test-dir 빌드경로 --output-on-failure`를 사용합니다.
4. 경고·ABI·배포 의존성 변경을 검토하고 프리셋·CI·개발 안내를 함께 갱신합니다.
5. 실패하면 이전 프리셋·툴체인·의존성 설정으로 복귀합니다. 확인 전 이전 SDK·컴파일러를 제거하지 않습니다.

서버 컨테이너의 apt 도구 변경은 관리자가 새 이미지 버전으로 배포합니다. OS 태그·apt 설치 명령만으로 과거 환경을 완전히 재현할 수 없으므로 검증한 이미지 ID·digest와 도구 버전을 [서버 운영 기록](../04.Servers/docker-server/operations.md)에 함께 남깁니다. macOS·Windows 빌드는 Linux 이미지로 모두 대체할 수 없습니다.

공식 참고: [CMake 툴체인](https://cmake.org/cmake/help/latest/manual/cmake-toolchains.7.html), [프리셋](https://cmake.org/cmake/help/latest/manual/cmake-presets.7.html), [C++ 표준](https://cmake.org/cmake/help/latest/prop_tgt/CXX_STANDARD.html), [Apple 명령줄 도구 선택](https://developer.apple.com/library/archive/technotes/tn2339/_index.html).
