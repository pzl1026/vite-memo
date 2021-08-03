const vue = require('@vitejs/plugin-vue');
const path = require('path');
const styleImport = require('vite-plugin-style-import').default;

module.exports = {
  // root: path.resolve(__dirname, 'publicMain'),
  // publicDir: path.resolve(process.cwd(), 'public'),
  configFile: false,
  resolve: {
    alias: {
      // '@': '/src',
      '@': path.resolve(process.cwd(), 'src'),
      'ant-design-vue$': 'ant-design-vue/es/index.js',
      'vue-router$': 'vue-router/dist/vue-router.cjs.js',
      '@ant-design/icons-vue$': '@ant-design/icons-vue/lib',
      axios$: 'axios/dist/axios.js',
      moment$: 'moment/dist/moment.js',
      vue$: 'vue/dist/vue.esm-browser.js',
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: 'ant-design-vue',
          esModule: true,
          resolveStyle: (name) => {
            return `ant-design-vue/es/${name}/style/css`;
          },
        },
      ],
    }),
  ],
};
