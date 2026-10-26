const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

exports.loader = function loader(overrides = {}) {
  const cache = new Map();
  function load(filename) {
    const absolute = path.resolve(filename);
    if(absolute.endsWith('.json'))return JSON.parse(fs.readFileSync(absolute,'utf8'));
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const module = { exports: {} }; cache.set(absolute, module);
    const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    function localRequire(name) {
      if (Object.hasOwn(overrides,name)) return overrides[name];
      if (!name.startsWith('.')) return require(name);
      const base = path.resolve(path.dirname(absolute),name);
      const resolved = ['', '.ts','.tsx','.js','.json'].map(ext=>base+ext).find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
      if (!resolved) throw Error('Cannot load '+base);
      return load(resolved);
    }
    new Function('require','module','exports',source)(localRequire,module,module.exports);
    return module.exports;
  }
  return load;
};
