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
                output: 'metro-ui.css',
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
            file: './lib/metro-ua.js',
            format: 'iife',
        }
    },
    {
        input: './lib/metro-ua.js',
        plugins: [
            terser()
        ],
        output: {
            file: './lib/metro-ui.min.js',
            format: 'iife',
            sourcemap
        }
    }
];