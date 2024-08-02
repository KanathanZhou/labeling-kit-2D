import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
    input: 'lib/main.js',
    output: [
        {
            file: 'dist/yasha-kit.cjs.js',
            format: 'cjs'
        },
        {
            file: 'dist/yasha-kit.esm.js',
            format: 'esm'
        },
        {
            name: 'YashaKit',
            file: 'dist/yasha-kit.umd.js',
            format: 'umd'
        },
    ],
    plugins: [
        commonjs({
            include: /node_modules/,
        }),
        nodeResolve({
            preferBuiltins: false
        })
    ]
};