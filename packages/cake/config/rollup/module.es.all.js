import babel from 'rollup-plugin-babel';
import glob from 'glob';
import { DIST_MODULE_ES, SRC } from '../const';
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";

function modulesPaths() {
    return glob.sync(SRC + '/*/*.js', {
        ignore: [
            SRC + '/helper/**/*.js',
            SRC + '/functions.js',
            SRC + '/index.js',
        ],
    });
}

export default {
    input: modulesPaths(),
    output: {
        dir: DIST_MODULE_ES,
        format: 'es',
        chunkFileNames: 'internal/[name].js',
    },
    plugins: [babel(),
        resolve(),
        commonjs()
    ],
};