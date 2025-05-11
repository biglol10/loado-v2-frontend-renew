import react from '@vitejs/plugin-react-swc';
import path, { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ''); // https://dev.to/boostup/uncaught-referenceerror-process-is-not-defined-12kg
  const apiProxyTarget = env['API_PROXY_TARGET'];
  const loadoApiUrl = env['LOADO_API_URL'];
  const port = Number(env['FE_PORT']);
  const appMode = env['MODE'];

  return {
    define: {
      'process.env': env,
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
