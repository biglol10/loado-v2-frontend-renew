# 🎓 Loado v2 Frontend 코드리뷰

> **작성일:** 2026-06-11
> **대상:** loado-v2-frontend-renew (React 18 + Vite + TS, MUI, react-query, zustand, RHF/zod, i18next, MSW)
> **리뷰 범위:** 아키텍처 인프라(API/캐시/상태), 페이지·컴포넌트, 빌드/설정, 성능·보안
> **리뷰 방식:** 코드베이스 정밀 탐색(Read/Grep), 파일·라인 단위 근거 기반

---

## 0. 총평 — 지금 어디쯤 와 있나

이건 "주니어가 만든 토이프로젝트"가 아니다. react-query + zustand + RHF/zod + i18n + MSW + 커스텀 캐싱/성능 레이어까지, **미들 레벨 실무 스택을 거의 다 끌어다 직접 조립**해봤다는 게 코드 전반에 보인다. AxiosCanceler, 성능 모니터링 싱글톤, IntersectionObserver 지연 로딩, 재귀 시뮬레이션 — 이런 걸 직접 만들어 봤다는 경험치 자체가 자산이다.

그런데 **딱 그 지점이 함정**이기도 하다. 도구를 많이 알지만, **"이 도구가 이미 해주는 일을 내가 또 하고 있다"**는 패턴이 반복된다. 한 단계 올라가는 핵심은 **새 기능 추가가 아니라, 책임 경계를 정리하고 중복 레이어를 걷어내는 것**이다.

점수로 굳이 매기면 **구조 설계 의도는 70점, 실제 정합성은 50점대**. 갭의 대부분은 "레이어가 서로 안 맞물려 있다"에서 온다.

### 요약 지표

| 항목          | 값                   |
| ------------- | -------------------- |
| Critical 이슈 | 4건 (실제 버그/보안) |
| Major 이슈    | 8건 (구조·품질)      |
| Minor 이슈    | 6건 (위생·다듬기)    |
| 핵심 강점     | 5건                  |

---

## 🔴 CRITICAL — 지금 당장 고쳐야 (실제 버그)

### C1. QueryClient가 **두 개** 존재한다 — 캐시 유틸이 통하지 않는다

가장 중요한 구조 결함.

- 실제 앱 트리에 주입되는 클라이언트: `App.tsx:23` → `getQueryClient(handleError)`
- `cacheUtils.ts`가 import하는 클라이언트: `queryClient.ts:45`의 **default export `queryClient`** (별개 인스턴스)

```ts
// cacheUtils.ts:2
import queryClient from '../queryClient'; // ← Provider에 안 들어간 '유령' 클라이언트
export const invalidateCache = (queryKey) => queryClient.invalidateQueries({ queryKey });
```

즉 `invalidateCache / setCache / getCache / removeCache`를 호출해도 **화면을 그리는 실제 캐시에는 아무 영향이 없다.** 지금은 이 유틸들을 아무 데서도 안 써서(grep 결과 사용처 0건) 터지지 않고 잠복 중일 뿐. 나중에 "왜 invalidate가 안 먹지?"로 몇 시간 날릴 폭탄이다.

**고치는 법:** 클라이언트는 **앱 전체에서 단 하나**여야 한다. `queryClient.ts`의 default export 하나만 남기고, `getQueryClient` 팩토리는 없앤다. `handleError`(언어 의존)는 `queryClient.getQueryCache().config.onError`로 나중에 주입하거나, 토스트를 `i18n.t`로 직접 처리하면 된다.

---

### C2. `App` 리렌더마다 QueryClient를 새로 만든다 → 언어 바꾸면 캐시 전멸

```tsx
// App.tsx:22-23  (컴포넌트 body 안, useMemo/useState 아님)
const { handleError } = useHandleError(); // useHandleError 내부에서 useTranslation() 사용
const queryClient = getQueryClient(handleError);
```

`useHandleError`가 내부에서 `useTranslation()`을 쓰므로 **`App`은 i18n 구독자**다. 언어를 바꾸면 → `App` 리렌더 → `getQueryClient()`가 **새 인스턴스 생성** → `<QueryClientProvider client={새것}>` → **진행 중인 모든 쿼리·캐시가 날아가고 전부 재요청**된다. 사용자가 한/영 토글하는 순간 화면이 깜빡이며 다시 로딩하는 버그.

**원칙:** Provider에 주는 client는 **렌더 사이에 동일 참조**여야 한다. 모듈 최상단에서 한 번 만들거나, 정 컴포넌트 안이면 `useState(() => createClient())`. C1 해결(단일 인스턴스)이 이걸 동시에 해결한다.

---

### C3. **에러가 reject가 아니라 resolve된다** — 에러 핸들러가 영원히 안 탄다

이게 `useHandleError.ts:21`의 `// 얘는 잘 안 먹힘` 주석의 **진짜 원인**이다.

```ts
// AxiosInstance.ts
async request<T>(...) {
  try { ... return res.data; }
  catch (error) {
    return this.handleError(error, ...);   // ← (185) catch에서 'return'
  }
}
async handleError(error, ...) {
  if (error instanceof RequestLimitError) { ...재시도... }
  return error;   // ← (156) throw가 아니라 'return error'
}
```

429(RequestLimitError)가 아닌 일반 에러(500 등)는 `handleError`가 **에러 객체를 `return`** 한다. 그러면 `request()`가 **reject가 아니라 resolve**되고, react-query 입장에서는 **"성공"**이다. 그래서:

- `queryCache.onError`(= 당신의 `handleError` 토스트)가 **절대 안 불린다.**
- 쿼리 data에 에러 바디(`{ message: ... }`)가 "정상 데이터"로 들어가고, `select: (r) => r.data`는 `undefined`가 된다. → 차트가 조용히 빈 화면.

**고치는 법:** 처리 못 하는 에러는 반드시 **다시 throw**.

```ts
async handleError(error, ...) {
  if (error instanceof RequestLimitError && retryCount < MAX_RETCNT) {
    await hold(RPS);
    return this.request({ method, url, data, retryCount: retryCount + 1 });
  }
  throw error;   // ← resolve가 아니라 reject로
}
```

이 한 줄이 에러 토스트 / 재시도 / `isError` 전부를 정상화한다.

---

### C4. **모든 환경변수(시크릿 포함)가 클라이언트 번들에 박힌다**

```ts
// vite.config.ts:9,16
const env = loadEnv(mode, process.cwd(), ''); // prefix '' = 모든 변수 로드 (VITE_ 필터 없음)
return { define: { 'process.env': env } }; // 전부 번들에 inline
```

`loadEnv(..., '')`로 **접두사 필터 없이 전부** 읽고, `define`으로 `process.env` 전체를 번들에 문자열 치환한다. 결과적으로 `REACT_APP_SMILEGATE_TOKEN`(로스트아크 API Bearer 토큰)이 **빌드된 JS에 평문으로** 들어간다. 브라우저 개발자도구 → Sources에서 누구나 추출 가능. 게임 API 토큰이지만, **시크릿을 프론트 번들에 노출하는 패턴 자체**가 위험하다.

게다가 코드가 읽는 키가 어긋나 있다:

- env 파일: `REACT_APP_SMILEGATE_TOKEN`
- 코드(`AxiosInstance.ts:43`): `process.env.SIMEGATE_TOKEN` ← **이름 불일치 → 실제로 `Bearer undefined`일 가능성**

**제대로 된 해법:** 토큰이 필요한 로스트아크 호출은 **서버(BFF)에서** 헤더를 붙여야 한다. 이미 `vite.config.ts`에 dev proxy(`/lostark` → onstove)가 있으니, **프로덕션에서도 같은 역할의 서버 프록시**를 두고 프론트는 토큰을 아예 모르게 한다. 최소한 즉시 조치로는: `loadEnv` 접두사를 `VITE_`로 좁히고, 시크릿은 절대 `define`에 넣지 않기.

---

## 🟡 MAJOR — 구조·품질 (실무 레벨 차이가 갈리는 지점)

### M1. 서버 상태를 useState로 **복제**하고 있다 (가장 자주 지적할 안티패턴)

`item-price/index.tsx:36-85`:

```tsx
const [refinement, setRefinement] = useState([]);
const [refinementAdditional, setRefinementAdditional] = useState([]);
const [esder, setEsder] = useState([]);
// ...5개 useState
useEffect(() => {
  queryResults.forEach((q) => { switch(code) { case 44410: setEngravings(...) } });
}, [queryResults, isFetched]);
```

react-query가 이미 들고 있는 데이터를 **다시 5개의 useState로 복사**하고, `useEffect`로 동기화한다. 이건 세 가지를 동시에 망친다:

1. **불필요한 추가 렌더** (쿼리 1회 + setState 5회).
2. **동기화 버그 위험** — 쿼리가 갱신돼도 effect 타이밍에 따라 state가 한 박자 늦거나 안 맞음.
3. **데이터 출처가 둘**이 되어 디버깅이 어려움.

**핵심 교훈:** _"서버에서 온 데이터에서 파생되는 값은 state가 아니라 `useMemo`다."_

```tsx
const byCategory = useMemo(() => {
  const map = { engravings: [], refinement: [], refinementAdditional: [], esder: [], jewelry: [] };
  queryResults.forEach((q) => {
    const rows = (q?.data ?? [])
      .slice()
      .sort((a, b) => b.minCurrentMinPrice - a.minCurrentMinPrice);
    switch (rows[0]?.categoryCode) {
      case 44410:
        map.engravings = rows;
        break;
      case 50010:
        map.refinement = rows;
        break;
      // ...
    }
  });
  return map;
}, [queryResults]);
```

useState 5개 + useEffect 통째로 사라지고, 버그 표면적도 사라진다. (덤: 원본 배열을 `dataToUse.sort()`로 **제자리 정렬**하는데, react-query 캐시 배열을 직접 mutate하는 거라 위험하다. `.slice().sort()`로 복사 후 정렬할 것.)

---

### M2. `columns`와 `columnsForBook`이 **완전히 동일**

`item-price/index.tsx:87-121` — 두 `useMemo`의 내용이 글자 하나 안 틀리고 똑같다. 복붙 후 분기 의도가 사라진 흔적. 하나로 합치거나, 진짜 달라야 한다면 차이를 만들 것. DRY 위반의 교과서 사례.

---

### M3. axios `CancelToken` (deprecated) + react-query와 **취소 책임 중복**

`AxiosCanceler`는 axios의 **deprecated된 `CancelToken.source()`** 기반(현재 표준은 `AbortController`). 더 근본적으로, **react-query는 이미 쿼리 취소를 `signal`로 해준다.** 같은 일을 두 레이어가 따로 관리하면, 한쪽이 취소한 요청을 다른 쪽이 모르고 키 충돌이 난다.

스텝업 방향: 커스텀 캔슬러를 버리고 react-query의 `queryFn: ({ signal }) => httpService.get(url, { signal })` 패턴으로 일원화. "직접 만든 걸 버리는 결정"이 다음 레벨의 핵심 역량.

---

### M4. 스타일링 시스템이 **3중**으로 공존

`package.json`에 `@emotion/styled`, `styled-components`, 그리고 MUI의 `styled`가 동시에 들어있고 실제로 섞여 쓰인다(`SingleItemPriceModal`은 MUI `styled`+`css`, 다른 곳은 styled-components). 런타임 두 개를 동시에 번들에 싣고, 팀/미래의 본인이 "여긴 뭘로 쓰지?"를 매번 고민하게 된다. **MUI를 쓰는 이상 emotion 단일화**를 권장. styled-components 제거가 번들도 줄이고 일관성도 준다.

---

### M5. `any`가 핵심 경로에 퍼져 있다

`request<T>`의 `data?: any`, `handleError(error: any)`, `queryClient onError(error: any)`, performance 엔트리 `as any` 다수. eslint가 `no-explicit-any: 'warn'`이라 경고만 뜨고 방치된다. 특히 **API 응답에 타입을 믿고 `select`까지 태우는데 런타임 검증이 없어서** C3 같은 "에러 바디가 데이터로 둔갑" 사고가 조용히 통과한다.

스텝업: 이미 `zod`를 쓰고 있으니, **API 응답도 zod 스키마로 parse**해서 경계에서 한 번 검증할 것. `httpService.get<T>`가 `T`를 "주장"만 하는 것과, 런타임에 "보장"하는 것은 신뢰도가 다르다.

---

### M6. `RPS = 60 * 1020` — 의도와 다른 상수

`AxiosInstance.ts:20`. 주석은 "1분 정도 뒤 재요청"인데 `60 * 1020 = 61,200ms`(61.2초)다. `60 * 1000`의 오타로 보인다. 동작은 하지만 "내가 쓴 숫자가 내 의도와 다르다"는 건 신뢰성 문제. `const ONE_MINUTE_MS = 60 * 1000;`처럼 **이름 있는 상수**로.

---

### M7. `keepPreviousData`가 v5에서 무효 + 위치도 틀림

`useItemPriceQuery.ts:57`에서 개별 쿼리 옵션에 `keepPreviousData: true`를 줬는데, (1) react-query **v5에서 제거된 옵션**이고 (2) `useQueries`의 개별 쿼리엔 적용되지도 않는다 → **조용히 무시되는 죽은 코드**. 날짜 바꿀 때 이전 데이터를 유지하려는 의도였다면 `placeholderData: keepPreviousData`(함수 import)를 써야 한다.

---

### M8. `useIntersectionObserver`의 `options` 의존성 함정

`useIntersectionObserver.ts:31`에서 effect deps에 `options`(객체)가 들어가는데, `ItemAvatar.tsx:20`은 **인라인 객체 리터럴**을 넘긴다. 매 렌더마다 새 객체 → effect 재실행 → **observer를 매 렌더 disconnect/생성**. 지연 로딩하려고 만든 훅이 오히려 렌더마다 옵저버를 새로 단다. 옵션을 `useMemo`로 고정하거나, 훅 내부에서 `rootMargin`/`threshold`를 원시값으로 받아 deps에 넣을 것.

---

## 🟢 MINOR — 다듬기 (인상과 위생)

- **워크스페이스 오염:** `test.html`, `wget-log`, `bundleReport/report.html`가 커밋돼 있다. 빌드 산출물/실험 파일은 `.gitignore`로.
- **죽은 코드 / Redux 잔재:** `AxiosInstance`의 `queueUserLog`/`logQueue`/`debounceUserLog` 전체가 주석 처리된 빈 함수, `store.dispatch(showLoader())` 잔재 주석, `routers/index.tsx`의 40줄짜리 설명 주석, 모달의 주석 처리된 에러 블록. 지금의 본인에겐 메모지만, 6개월 뒤엔 노이즈다. git이 기억해주니 과감히 지울 것.
- **`console.log/console.error` 다수**가 프로덕션 경로에 노출(`handleResponseError`, 캔슬러 등). 최소한 환경 가드.
- **PerformanceManager 잠재 버그:** `setupUserInteractionObserver`에서 `target.className.replace(...)` — SVG 요소의 `className`은 문자열이 아니라 `SVGAnimatedString`이라 `.replace`에서 throw 가능. `(target.getAttribute('class') ?? '')`로 안전하게.
- **`process.env.MODE` 혼란:** Vite인데 CRA식 `process.env`를 `define`으로 흉내낸다. `import.meta.env` + `VITE_` 접두사가 표준이고, HMR/타입 지원도 더 낫다. (C4와 같은 뿌리)
- **재귀 시뮬레이션:** `refineSimulation`이 꼬리재귀로 돌고 `memoryArr`를 인자로 mutate한다. 강화 횟수가 극단적으로 많아지면 스택이 쌓인다. 로직은 깔끔하니 `while` 루프로 바꾸면 스택 걱정이 사라진다 — 함수 분해(`calculateRetryBonus` 등)는 잘 나눠놨다, 칭찬할 부분.

---

## ✅ 잘한 부분 (계속 가져갈 강점)

1. **API 훅의 캐시 키 설계** — `cacheKeys.itemPrice.all` 스프레드 + `generateQueryKey`를 훅의 static 멤버로 노출(`useItemPriceQuery.generateQueryKey`)한 건 실무에서 인정받는 패턴. 키 구조가 계층적이고 invalidate 범위를 잡기 좋다.
2. **데이터 변동성별 캐싱 정책**(`cachingConfig`의 static/moderate/dynamic/user) — 이걸 "도메인 데이터 성격으로" 분류한 사고방식이 좋다. 시니어가 하는 고민이다.
3. **시뮬레이션 순수 로직 분리** — `simulationFunction.ts`가 컴포넌트와 완전히 분리된 순수 함수고, 확률 계산을 작은 함수로 쪼갰다. 테스트하기 딱 좋은 구조(지금 테스트가 0인 게 아까울 정도).
4. **`useIntersectionObserver`의 callbackRef 패턴** — 최신 콜백을 `ref`로 들고 stale closure를 피한 건 정확한 고급 테크닉. (M8의 deps 문제만 빼면)
5. **`combine`으로 useQueries 집계** — 여러 카테고리 쿼리를 하나의 파생 상태로 합친 접근이 깔끔하다.

이런 게 보인다는 건 "패턴을 안다" 수준은 넘었다는 증거다. 다음은 "패턴들을 **정합성 있게 엮는**" 단계.

---

## 🚀 1~2단계 스텝업 로드맵

| 우선순위        | 할 일                                                              | 무엇을 증명하나                       |
| --------------- | ------------------------------------------------------------------ | ------------------------------------- |
| **1 (이번 주)** | C1~C4 수정: 단일 QueryClient, 에러 `throw`, 시크릿을 번들에서 제거 | "레이어가 맞물리게 한다"              |
| **2**           | M1: 서버 상태 useState 복제 제거 → `useMemo` 파생                  | **서버 상태 vs 클라이언트 상태 경계** |
| **3**           | M5: zod로 API 응답 **런타임 검증**, `any` 제거                     | "타입을 주장이 아니라 보장으로"       |
| **4**           | M3/M4: 커스텀 캔슬러 폐기(react-query signal), 스타일 단일화       | **"직접 만든 걸 버리는" 판단력**      |
| **5**           | 테스트 도입: `simulationFunction`부터 vitest 단위 테스트           | 회귀 안전망                           |

### 가장 중요한 개념 한 줄

지금 코드의 거의 모든 문제는 **"하나여야 할 진실의 출처(Single Source of Truth)가 둘 이상"** 으로 수렴한다 — QueryClient 두 개(C1), 서버 데이터와 useState 복제(M1), 취소 로직 두 군데(M3), 스타일 시스템 셋(M4).

다음 레벨의 엔지니어는 기능을 더하기 전에 **"이 정보의 주인은 누구인가?"** 를 먼저 묻는다. 이 프로젝트로 그 훈련을 하면 한 단계가 아니라 두 단계 올라간다.

---

## 부록 — 이슈 인덱스 (파일·라인)

| ID  | 심각도 | 위치                                                 | 한 줄 요약                                           |
| --- | ------ | ---------------------------------------------------- | ---------------------------------------------------- |
| C1  | 🔴     | `App.tsx:23`, `queryClient.ts:45`, `cacheUtils.ts:2` | QueryClient 인스턴스 2개로 분리됨                    |
| C2  | 🔴     | `App.tsx:22-23`                                      | 렌더마다 QueryClient 재생성 (언어 변경 시 캐시 전멸) |
| C3  | 🔴     | `AxiosInstance.ts:156,185`                           | 에러를 throw 안 하고 return → 에러 핸들러 미작동     |
| C4  | 🔴     | `vite.config.ts:9,16`, `AxiosInstance.ts:43`         | 시크릿이 번들에 노출 + env 키 이름 불일치            |
| M1  | 🟡     | `item-price/index.tsx:36-85`                         | 서버 상태를 useState로 복제                          |
| M2  | 🟡     | `item-price/index.tsx:87-121`                        | columns/columnsForBook 완전 중복                     |
| M3  | 🟡     | `AxiosCanceler.ts`                                   | deprecated CancelToken + 취소 책임 중복              |
| M4  | 🟡     | `package.json`, 전역                                 | 스타일링 시스템 3중 공존                             |
| M5  | 🟡     | `AxiosInstance.ts` 외                                | 핵심 경로 any 남발, 런타임 검증 없음                 |
| M6  | 🟡     | `AxiosInstance.ts:20`                                | RPS 상수 오타(61.2초)                                |
| M7  | 🟡     | `useItemPriceQuery.ts:57`                            | keepPreviousData v5 무효/위치 오류                   |
| M8  | 🟡     | `useIntersectionObserver.ts:31`, `ItemAvatar.tsx:20` | options 인라인 객체로 observer 매 렌더 재생성        |
