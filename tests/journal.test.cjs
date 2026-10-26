const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loader}=require('./load-ts.cjs');
const {buildJournal,journalUrl,readJournal}=loader()('src/utils/journal.ts');

test('journey QR is self-contained, round-trips Unicode, artifacts and learned knowledge',async()=>{
 const player={name:'Bé Sen',artifactItems:[{name:'Nón lá Huế',province:'Huế',region:'trung_bo',storage:'safe',isSealed:false,isTreasure:true}],journey:[{title:'Nhã nhạc',province:'Huế',question:'Học được gì?',knowledge:'Nghệ thuật cung đình',source:'Tư liệu văn hóa'}]};
 const previous=global.location;global.location={origin:'https://example.test',pathname:'/lac-viet/'};
 try{
  const url=await journalUrl(player);assert.ok(url.startsWith('https://example.test/lac-viet/#journal='));assert.equal(url.includes('lacviet.edu.vn'),false);
  const recovered=await readJournal(url.slice(url.indexOf('#')));assert.deepEqual(recovered,buildJournal(player));
 }finally{global.location=previous;}
});
test('invalid journal data is rejected instead of treated as a player record',async()=>{
 await assert.rejects(()=>readJournal('#journal=invalid'));
});
