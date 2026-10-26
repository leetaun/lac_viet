const {test}=require('node:test');
const assert=require('node:assert/strict');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const {loader}=require('./load-ts.cjs');
const load=loader();

test('initial app renders the existing font and layout with only setup step one visible',()=>{
 const before=global.location;global.location={hash:''};
 try{
  const {App}=load('src/App.tsx');const html=renderToStaticMarkup(React.createElement(App));
  assert.ok(html.includes('font-serif-lacviet'));assert.ok(html.includes('font-sans'));
  assert.ok(html.includes('Bạn muốn chơi thế nào?'));assert.ok(html.includes('Chơi offline'));assert.ok(html.includes('Chơi với AI'));
  assert.equal(html.includes('SỐ NGƯỜI CHƠI'),false);assert.equal(html.includes('Phiên bản 2.0'),false);
 }finally{global.location=before;}
});
test('new rule choices use the same existing modal and button design classes',()=>{
 const {RuleChoiceModal}=load('src/components/Modals/RuleChoiceModal.tsx');
 const html=renderToStaticMarkup(React.createElement(RuleChoiceModal,{choice:{title:'Chọn Kỷ vật',options:[{id:'a',label:'Trống đồng'}],min:1,max:1},onConfirm(){}}));
 assert.ok(html.includes('border-4 border-[#C5A059]'));assert.ok(html.includes('crimson-gradient-bg'));assert.ok(html.includes('font-serif-lacviet'));assert.ok(html.includes('aria-modal="true"'));
});
