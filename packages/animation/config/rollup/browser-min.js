import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import banner from '../banner';
import { DIST_UNIVERSAL, SRC, PACKAGE_NAME } from '../const';
import {terser} from "rollup-plugin-terser";

export default {
    input: `${SRC}/global.js`,
    output: {
        file: `${DIST_UNIVERSAL}/animation.min.js`,
        format: 'iife',
        name: "",
        sourcemap: false,
        banner: banner,
        exports: 'named',
    },
    plugins: [
        babel(),
        resolve(),
        commonjs(),
        terser({
            output: {
                comments: "all",
            },
        })
    ],
};