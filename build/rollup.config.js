// rollup.config.js
import fs from 'fs';
import path from 'path';
import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import minimist from 'minimist';
import resolve from 'rollup-plugin-node-resolve';
import pkg from '../package.json';


const changelog = fs.readFileSync('./CHANGELOG.md', 'utf8')

// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs.readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, '..');

const baseConfig = {
  input: 'src/entry.ts',
  plugins: {
    preVue: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        "PACKAGE_JSON_VERSION": pkg.version,
        "_CHANGELOG_": changelog
      }),
      alias({
        resolve: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        entries: {
          '@': path.resolve(projectRoot, 'src'),
        },
      }),
    ],
    vue: {
      css: true,
      template: {
        isProduction: true,
      },
    },
    babel: {
      exclude: 'node_modules/dayjs/*',
      runtimeHelpers: true,
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
    },
  },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  'vue',
  "openapi-client-axios",
  "regenerator-runtime",
  "axios",
  "jwt-decode",
  "dayjs",
  "jspdf",
  "jspdf-autotable",
  "vue-apexcharts",
  "@scribe-systems/modularus"
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: 'Modularus.externals.Vue',
  'openapi-client-axios': "Modularus.externals.OpenApi",
  axios: "Modularus.externals.axios",
  "jwt-decode": "Modularus.externals.jwtDecode",
  "dayjs": "Modularus.externals.dayjs",
  jspdf: "Modularus.externals.jspdf",
  "jspdf-autotable": "Modularus.externals.autotable",
  "vue-apexcharts": "Modularus.externals.apexcharts",
  "@scribe-systems/modularus": "Modularus.externals.modularus"
};

// Customize configs for individual targets
const buildFormats = [];

if (!argv.format || argv.format === 'iife') {
  const unpkgConfig = {
    ...baseConfig,
    external,
    output: {
      compact: true,
      file: 'dist/boilerplate.min.js',
      format: 'iife',
      name: 'BoilerplateModule',
      exports: 'named',
      globals,
    },
    plugins: [
      ...baseConfig.plugins.preVue,
      vue(baseConfig.plugins.vue),
      babel(baseConfig.plugins.babel),
      commonjs(),
      terser({
        output: {
          ecma: 5,
        },
      }),
      resolve({
        mainFields: ["module", "main"],
        extensions: [".ts", ".js", ".jsx", ".json", ".node", ".mjs"]
      })
    ],
  };
  buildFormats.push(unpkgConfig);
}

// Export config
export default buildFormats;