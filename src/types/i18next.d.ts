/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */
import 'i18next';

// 환경과 상황에 따라 다르게 불러오도록 합니다.
import type ko from '../locales/ko/ko.json';
import type en from '../locales/en/en.json';

interface I18nNamespaces {
  ko: typeof ko;
  en: typeof en;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    // 따로 Namespace를 전달하지 않는 경우 가져오는 기본값입니다.
    defaultNS: 'common';
    resources: I18nNamespaces;
  }
}
