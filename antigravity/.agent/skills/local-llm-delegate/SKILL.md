---
name: "local-llm-delegate"
description: "lmstudio-server MCP가 활성화된 경우, 문서 작성·번역·코드 설명·텍스트 생성 등 대부분의 텍스트 생성 작업을 로컬 LLM에 위임하여 처리하는 스킬. 클라우드 API 사용량을 줄이고 개인 PC의 GPU 연산 자원을 활용한다."
---

# 로컬 LLM 위임 스킬 (local-llm-delegate)

이 스킬은 `lmstudio-server` MCP가 연결된 환경에서 **클라우드 모델 대신 로컬 LLM을 우선적으로 활용**하도록 에이전트의 행동을 정의합니다.

---

## 🎯 목적

- agy-cli 클라우드 API 사용량(토큰 비용) 절감
- 사용자의 GPU PC(RTX 3080) 연산 자원 활용
- 민감한 코드/문서를 클라우드로 전송하지 않는 프라이버시 이점

---

## 🔀 위임 대상 작업 목록

에이전트는 아래 작업 요청을 수신하면, **즉시 `lmstudio-server` MCP의 `openai_chat` 도구를 호출**하여 로컬 모델에게 처리를 위임한다.

| 작업 유형 | 예시 |
|---|---|
| 문서 초안 작성 | README, 가이드, 설명서, 릴리즈 노트 |
| 코드 설명 / 주석 생성 | 함수·클래스 동작 요약, JSDoc/Docstring 생성 |
| 번역 | 영→한, 한→영 문서 번역 |
| 텍스트 요약 | 긴 문서·코드를 짧게 요약 |
| 리포맷 | JSON→Markdown 표, CSV→표 변환 등 |
| 정형 텍스트 생성 | 커밋 메시지 초안, 체인지로그, PR 설명 |
| 코드 리팩터링 초안 | 단순 변수명 변경, 코드 정리 제안 |

---

## ⚙️ 호출 방법 (에이전트 행동 지침)

### 기본 호출 패턴

```
MCP 서버: lmstudio-server
도구: openai_chat
model: (생략 - LM Studio에 현재 로드된 모델 자동 사용)
messages:
  - role: system  →  작업 목적에 맞는 시스템 프롬프트
  - role: user    →  사용자 요청 내용
```

### 시스템 프롬프트 예시

- **문서 작성**: `"You are a technical writer. Write clear, concise Korean documentation in Markdown format."`
- **코드 설명**: `"You are a code explainer. Summarize what the given code does in Korean, targeting a developer audience."`
- **번역**: `"You are a professional translator. Translate the following text accurately into Korean, preserving technical terms."`

---

## ✅ 결과 처리 규칙

1. 로컬 모델의 응답을 **그대로 전달하지 않는다.**
2. 에이전트가 결과를 검토하고, 오류·부자연스러운 표현·누락된 내용을 보정한다.
3. 최종 결과물만 사용자에게 전달한다.

---

## ⚠️ 폴백 (Fallback) 규칙

아래 상황에서는 클라우드 모델로 자동 전환한다:

- MCP 연결 오류 (LM Studio 서버 미실행 등)
- 응답 타임아웃 (30초 초과)
- 로컬 모델이 작업을 처리하지 못하는 경우 (빈 응답, 오류 응답)

폴백 발생 시 사용자에게 반드시 알린다:
> ⚠️ 로컬 모델(lmstudio-server) 연결에 실패하여 클라우드 모델로 처리했습니다.
