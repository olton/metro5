import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import glob from 'glob';

import { DIST_MODULE_CJS, SRC } from '../const';

function modulesPaths() {
    return glob.sync(SRC + '/*/*.js', {
        ignore: [
            SRC + '/helpers/**/*.js',
            SRC + '/functions.js',
            SRC + '/index.js',
        ],
    });
}

export default {
    input: modulesPaths(),
    output: {
        exports: "auto",
        dir: DIST_MODULE_CJS,
        format: 'cjs',
        chunkFileNames: 'internal/[name].js',
    },
    plugins: [babel(),
        resolve(),
        commonjs()
    ],
};