import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

/**
 * 리액트 쿼리 설정 및 공급자
 *
 * 애플리케이션 전체에서 사용할 QueryClient를 설정하고 제공합니다.
 *
 * 이점:
 * 1. 중앙화된 쿼리 설정: 일관된 쿼리 클라이언트 설정으로 애플리케이션 전체의 데이터 관리 표준화
 * 2. 개발 도구 통합: 개발 환경에서 ReactQueryDevtools 자동 제공
 * 3. 유연한 에러 처리: 글로벌 기본 에러 처리 설정으로 일관된 에러 관리
 * 4. 퍼포먼스 최적화: 애플리케이션 특성에 맞는 기본 데이터 상태 관리 설정
 */

// QueryClient 설정
const defaultQueryClientOptions = {
  defaultOptions: {
    queries: {
      // 기본 쿼리 설정
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 30 * 60 * 1000, // 30분 (cacheTime -> gcTime으로 변경됨)
      refetchOnWindowFocus: process.env.NODE_ENV === 'production', // 개발 환경에서는 창 포커스 시 리패치 비활성화
      retry: 1, // 실패 시 한 번만 재시도
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프 전략
      useErrorBoundary: false, // 에러 바운더리 사용 여부
    },
    mutations: {
      // 기본 뮤테이션 설정
      retry: 1,
      useErrorBoundary: false,
    },
  },
};

// 글로벌 쿼리 클라이언트 인스턴스 생성
export const queryClient = new QueryClient(defaultQueryClientOptions);

/**
 * React Query Provider 컴포넌트
 *
 * 애플리케이션을 React Query로 감싸고 개발 도구를 제공합니다.
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 개발 환경에서만 React Query Devtools 표시 */}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools position="bottom" />}
    </QueryClientProvider>
  );
};

export default QueryProvider;
