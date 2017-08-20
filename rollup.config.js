import { readFileSync } from 'fs';
import replace from 'rollup-plugin-re';
import buble from 'rollup-plugin-buble';
import json from 'rollup-plugin-json';
import cjs from 'rollup-plugin-commonjs';
import node from 'rollup-plugin-node-resolve-and-alias';
import literal from 'rollup-plugin-string';
import inject from 'rollup-plugin-inject';
import config from './src/js/config';

const scmversion = (function (file) {
    try {
        return readFileSync( file, 'utf-8' );
    } catch (e) {
        return '00000000';
    }
})('.scmversion');

export default [
    {
        entry: 'src/js/start.js',
        plugins: [
            replace({
                include: 'src/js/**/*.js',
                defines: {
                    IS_BROWSER: false,
                    IS_SERVER:  true
                }
            }),
            literal({
                include: [
                    'src/html/**/*.html',
                    'src/**/*.txt'
                ]
            }),
            buble({
                include: [ 'src/js/**' ],
                target: {
                    node: '6'
                }
            }),
            json({
                preferConst: true
            })
        ],
        external: [
            'broadway',
            'tarantino',
            'mime',
            'spdy',
            'spdy-transport',
            'union',
            'winston',

            'assert',
            'buffer',
            'constants',
            'crypto',
            'events',
            'fs',
            'http',
            'https',
            'nconf',
            'net',
            'os',
            'path',
            'querystring',
            'readable-stream',
            'string_decoder',
            'stream',
            'tls',
            'tty',
            'url',
            'util',
            'zlib'
        ],
        sourceMap: true,
        targets: [
            { dest: 'dist/start.js', format: 'cjs' }
        ]
    },
    {
        entry: 'src/js/browser.js',
        plugins: [
            replace({
                include: 'src/js/**',
                defines: {
                    IS_BROWSER: true,
                    IS_SERVER:  false
                }
            }),
            buble({
                include: [ 'src/js/**' ]
            }),
            json({
                preferConst: true
            }),
            cjs(),
            node({
                jsnext: true,
                main: true,
                preferBuiltins: false
            }),
            inject({
                include: [
                    'node_modules/bootstrap/js/**/*.js'
                ],
                modules: {
                    jQuery: 'jquery'
                }
            })
        ],
        sourceMap: true,
        targets: [
            { dest: 'dist/bundle.js', format: 'iife' }
        ]
    }
];
