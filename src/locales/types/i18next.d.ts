import { resources } from '../i18n';

/**
 * If you want to enable locale keys typechecking and enhance IDE experience.
 *
 * Requires `resolveJsonModule:true` in your tsconfig.json.
 *
 * @link https://www.i18next.com/overview/typescript
 */

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['ko'];
  }
}
