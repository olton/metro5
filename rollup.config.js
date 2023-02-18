import {nodeResolve as resolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import copy from 'rollup-plugin-copy'
import {terser} from "rollup-plugin-terser"
import css from "rollup-plugin-import-css"

const
    dev = (process.env.NODE_ENV !== 'production'),
    sourcemap = dev ? 'inline' : false

export default [
    {
        input: './src/browser.js',
        watch: { clearScreen: false },
        plugins: [
            css({
                output: 'metro5.css',
                minify: false
            }),
            resolve({
                browser: true
            }),
            commonjs(),
            copy({
                targets: [
                    {src: './fonts/*', dest: './lib/fonts'},
                    // { src: ['assets/fonts/arial.woff', 'assets/fonts/arial.woff2'], dest: 'dist/public/fonts' },
                    // { src: 'assets/images/**/*', dest: 'dist/public/images' }
                ]
            })
        ],
        output: {
            file: './lib/metro5.js',
            format: 'iife',
        }
    },
    {
        input: './lib/metro5.js',
        plugins: [
            terser()
        ],
        output: {
            file: './lib/metro5.min.js',
            format: 'iife',
            sourcemap
        }
    }
];