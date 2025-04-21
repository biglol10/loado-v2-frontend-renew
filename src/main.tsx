import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import '@/locales/i18n.ts';
// 새로운 API 레이어 및 상태 관리 시스템 통합
import { QueryProvider } from './apis/core';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* React Query로 애플리케이션 감싸기 */}
    <QueryProvider>
      <App />
    </QueryProvider>
  </StrictMode>
);
