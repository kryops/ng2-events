import resolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'tmp/ngc/index.js',
    format: 'es',
    dest: 'lib/ng2-events.es2015.js',
    external: id => /@angular|rxjs/.test(id),
    plugins: [
        resolve()
    ]
}
