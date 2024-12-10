import 'react-i18next';
import ko from './locales/ko/ko.json';
import en from './locales/en/en.json';

// 리소스 타입 정의
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'; // 기본 네임스페이스
    resources: {
      en: typeof en;
      ko: typeof ko;
    };
  }
}
