import react from '@vitejs/plugin-react-swc';
import path, { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), ''); // https://dev.to/boostup/uncaught-referenceerror-process-is-not-defined-12kg
  const apiProxyTarget = env['API_PROXY_TARGET'];
  const loadoApiUrl = env['LOADO_API_URL'];
  const port = Number(env['FE_PORT']);
  const appMode = env['MODE'];

  // ⚠️ 과거에는 `'process.env': env`로 .env + 시스템 환경변수 전체를 번들에 주입했다.
  // 이는 시크릿(토큰 등)까지 클라이언트 JS에 노출시키므로, 실제 사용하는 키만 명시적으로 주입한다.
  const nodeEnv = command === 'build' ? 'production' : 'development';

  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      'process.env.MODE': JSON.stringify(env.MODE),
      'process.env.USE_MSW': JSON.stringify(env.USE_MSW),
      'process.env.REACT_APP_BASE_URL': JSON.stringify(env.REACT_APP_BASE_URL),
      'process.env.LOADO_API_URL': JSON.stringify(env.LOADO_API_URL),
      // Frontend-only tradeoff: this value is included in the browser bundle.
      'process.env.REACT_APP_SMILEGATE_TOKEN': JSON.stringify(env.REACT_APP_SMILEGATE_TOKEN),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        '~': resolve(__dirname, './public'),
      },
    },
    plugins: [
      react(),
      svgr(),
      visualizer({
        filename: path.resolve(__dirname, 'bundleReport', 'report.html'),
        open: false,
        brotliSize: true,
      }),
    ],
    server: {
      port,
      proxy: {
        '/lostark/markets': {
          target: apiProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/lostark/, ''),
        },
        '/lostark/auctions': {
          target: apiProxyTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/lostark/, ''),
        },
        '/api': {
          target: loadoApiUrl ?? 'http://localhost:8090',
          changeOrigin: true,
          secure: false, // https://stackoverflow.com/questions/74033733/vite-self-signed-certificate-error-when-calling-local-api
        },
      },
    },
    build: {
      sourcemap: appMode === 'development',
      minify: 'esbuild',
      rollupOptions: {
        output: {
          chunkFileNames: 'loado_[name].[hash].js',
          assetFileNames: 'loado_[name].[hash].[ext]',
          entryFileNames: 'loado_[name].[hash].js',
        },
      },
    },
  };
});
