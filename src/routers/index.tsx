import { useRoutes } from 'react-router-dom';
import routeElements from './routeElements';

// const rootRouter = createBrowserRouter(routeElements); // BrowserActivity가 Router 와 동일한 레벨에 있으면 에러 발생

const Router = () => {
  const routes = useRoutes(routeElements);

  return routes;
};

export default Router;

/**
 * useRoutes
 *  - React 컴포넌트 내에서 Hook으로 사용됩니다.
 *  - 기존 React 컴포넌트와 함께 사용하기 위해 선언적 방식으로 라우팅을 정의합니다.
 *  - <BrowserRouter> 또는 다른 라우터 컴포넌트 내에서 사용해야 합니다.
 *  - 기본적인 라우팅 기능(URL 매칭, 컴포넌트 렌더링 등)을 제공합니다.
 *  - 주로 선언적 모드(Declarative Mode)에서 사용됩니다.
 *
 * createBrowserRouter
 *  - 라우터 객체를 생성하고 <RouterProvider>와 함께 사용합니다.
 *  - 라우트 구성을 React 렌더링 외부에서 정의합니다.
 *  - 더 많은 고급 기능을 제공합니다:
 *    - 데이터 로딩(loader)
 *    - 액션(action)
 *    - 에러 처리(errorElement)
 *    - 대기 상태(pending states)
 *    - 기타 데이터 관련 기능들
 *  - 데이터 모드(Data Mode)에서 사용됩니다.
 *
 * 언제 어떤 것을 사용해야 하는지:
 *  1. useRoutes 사용 시기
 *    - 기본적인 라우팅 기능만 필요할 때
 *    - 기존 React 컴포넌트 구조 내에서 라우팅을 통합하고 싶을 때
 *    - 별도의 데이터 로딩이나 액션 처리가 필요 없을 때
 *    - 기존 v6 코드를 유지하면서 객체 기반 라우트 구성을 사용하고 싶을 때
 *
 * 2. createBrowserRouter 사용 시기
 *    - 데이터 로딩, 폼 제출, 에러 처리 등의 고급 기능이 필요할 때
 *    - 라우트별 데이터 로딩과 액션이 필요할 때
 *    - 로딩/에러 상태를 깔끔하게 처리하고 싶을 때
 *    - 더 현대적인 React Router 기능을 모두 활용하고 싶을 때
 *    - 새 프로젝트를 시작할 때 (React Router 팀은 이 방식을 권장합니다)
 *
 *
 *
 */
