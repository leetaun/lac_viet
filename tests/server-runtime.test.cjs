const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const ts=require('typescript');

test('deployed API modules load in native Node ESM without a Vite resolver',()=>{
 const root=path.resolve(__dirname,'..');
 const output=fs.mkdtempSync(path.join(root,'node_modules','.server-runtime-'));
 const visited=new Set();
 function emit(file){
  if(visited.has(file))return;visited.add(file);
  const target=path.join(output,path.relative(root,file).replace(/\.tsx?$/,'.js'));
  fs.mkdirSync(path.dirname(target),{recursive:true});
  if(file.endsWith('.json')){fs.copyFileSync(file,target);return;}
  const source=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  fs.writeFileSync(target,source);
  for(const match of source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)){
   if(!match[1].startsWith('.'))continue;
   const base=path.resolve(path.dirname(file),match[1]);
   const dependency=[base,base.replace(/\.js$/,'.ts'),base.replace(/\.js$/,'.tsx'),base+'.ts',base+'.tsx'].find(p=>fs.existsSync(p)&&fs.statSync(p).isFile());
   assert.ok(dependency,'Missing dependency '+base);emit(dependency);
  }
 }
 try{
  fs.writeFileSync(path.join(output,'package.json'),JSON.stringify({type:'module'}));
  emit(path.join(root,'api/online-room.ts'));emit(path.join(root,'api/qr-room.ts'));
  const probe=`for(const name of ['online-room','qr-room']){const {default:handler}=await import('./api/'+name+'.js');let status;await handler({method:'GET'},{setHeader(){},status(n){status=n;return this},json(){}});if(status!==405)throw Error(name+' did not start');}`;
  const check=path.join(output,'check.mjs');fs.writeFileSync(check,probe);
  const result=spawnSync(process.execPath,[check],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr||result.error?.message);
 }finally{
  // Remove only files created by this test; no recursive directory deletion.
  function clean(dir){for(const name of fs.readdirSync(dir)){const file=path.join(dir,name);if(fs.statSync(file).isDirectory())clean(file);else fs.unlinkSync(file);}fs.rmdirSync(dir);}
  clean(output);
 }
});
