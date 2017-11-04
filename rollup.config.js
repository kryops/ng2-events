import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'tmp/ngc/index.js',
    output: {
        format: 'es',
        file: 'lib/ng2-events.es2015.js'
    },
    external: id => /@angular|rxjs/.test(id),
    plugins: [
        resolve()
    ]
}
