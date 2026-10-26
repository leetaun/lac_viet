const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const {loader}=require('./load-ts.cjs');
const load=loader();
const bank=load('src/data/questionBank.ts');
const qr=load('src/utils/physicalQR.ts');
function player(id,position=0){return {id,name:id,position,seat:Number(id.slice(1)),isAI:false,token:'non_la',color:'#000',artifactItems:[],artifacts:0,safeArtifacts:0,biKipCards:[],milestones:[],score:0,tokenSkillAvailable:true,hasShield:false,immuneToPenalty:false,cards:{knowledge:[],resource:[],fortune:[]},lapsCompleted:0};}
function hooks(start=false,players=[player('p1'),player('p2',20)]){
 let cursor=0;const slots=[];
 const react={useEffect(){},useState(value){const i=cursor++;if(!(i in slots))slots[i]=typeof value==='function'?value():value;return[slots[i],v=>slots[i]=typeof v==='function'?v(slots[i]):v];},useRef(value){const i=cursor++;if(!(i in slots))slots[i]={current:value};return slots[i];}};
 const useController=loader({react})('src/engine/useGameController.ts').useGameController;
 const render=()=>{cursor=0;return useController(players,0);};
 const h={render,async act(fn){let done=false,error;Promise.resolve(fn()).then(()=>done=true,e=>{error=e;done=true;});for(let i=0;i<150&&!done;i++){await Promise.resolve();await Promise.resolve();const c=render();if(c.choice)c.confirmChoice(c.choice.options.slice(0,c.choice.min).map(o=>o.id));}if(error)throw error;assert.equal(done,true);return render();}};
 if(start)render().handleStartGame({mode:'offline',gameModeRule:'toc_chien',artifactGoal:3,playerCount:2,players,options:{physicalQR:true,starterBiKip:false,exploreMode:false,timedMode:false}});
 return h;
}
async function stored(fn){const before=global.localStorage,random=Math.random;const values=new Map();global.localStorage={getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,String(value)),removeItem:key=>values.delete(key)};Math.random=()=>0;try{return await fn(values);}finally{global.localStorage=before;Math.random=random;}}

test('all 375 imported questions retain four options, one valid answer and actual source references',()=>{
 assert.equal(bank.QUESTION_BANK.length,375);assert.equal(new Set(bank.QUESTION_BANK.map(q=>q.id)).size,375);
 for(const difficulty of ['basic','intermediate','advanced'])for(const group of ['knowledge','challenge','market','festival'])assert.equal(bank.QUESTION_BANK.filter(q=>q.difficulty===difficulty&&q.group===group).length,group==='knowledge'?50:25);
 for(const q of bank.QUESTION_BANK){assert.equal(q.options.length,4);assert.ok(q.correctAnswer>=0&&q.correctAnswer<4);assert.ok(q.explanation);assert.ok(q.sources.length);assert.ok(q.sources.every(s=>/^https:\/\//.test(s.url)));assert.equal(q.scope,'general');assert.equal('province' in q,false);}
 assert.equal(bank.QUESTION_BANK[0].correctAnswer,3);assert.equal(bank.QUESTION_BANK[0].options[3],'Ngô Quyền');
});
test('difficulty filtering and repeat avoidance preserve the original bank group',()=>{
 const all=bank.QUESTION_BANK.filter(q=>q.group==='knowledge'&&q.difficulty==='advanced');const wanted=all.at(-1);
 assert.equal(bank.pickBankQuestion('knowledge','advanced',all.slice(0,-1).map(q=>q.id)).id,wanted.id);
 const card=bank.bankGameCard(wanted,'Huế');assert.equal(card.question,wanted.question);assert.equal(card.province,'Huế');assert.equal(card.questionScope,'general');assert.equal(card.topic,'general');assert.equal(card.correctAnswer,wanted.correctAnswer);
});
test('four physical codes point only to the supplied HTTPS website and recognized entry kinds',()=>{
 const manifest=JSON.parse(fs.readFileSync('output/qr/manifest.json','utf8'));assert.equal(manifest.cards.length,4);
 for(const card of qr.PHYSICAL_CARDS){const url=qr.physicalCardUrl(card.kind);assert.equal(qr.readPhysicalCard(new URL(url).hash),card.kind);assert.equal(new URL(url).origin,'https://lac-viet.vercel.app');assert.equal(manifest.cards.find(c=>c.kind===card.kind).url,url);assert.ok(fs.existsSync(`public/qr/${card.kind}.svg`));assert.ok(fs.existsSync(`public/qr/${card.kind}.png`));}
 assert.equal(qr.readPhysicalCard('#card=unknown'),null);assert.throws(()=>qr.physicalCardUrl('knowledge','http://localhost:5173'));assert.throws(()=>qr.physicalCardUrl('knowledge','https://user:pass@example.test'));assert.throws(()=>qr.physicalCardUrl('knowledge','https://example.test/?secret=1'));
});
test('offline QR mode pauses before awarding or drawing a question and rejects a wrong physical card',()=>stored(async()=>{
 const h=hooks(true);let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.gameState.pendingPhysicalCard.kind,'knowledge');assert.equal(c.activeCardModal,null);assert.equal(c.activePlayer.artifactItems.length,0);
 c=await h.act(()=>h.render().openPhysicalCard('resource','Hà Nội','basic'));assert.equal(c.activeCardModal,null);assert.equal(c.gameState.pendingPhysicalCard.kind,'knowledge');assert.ok(c.notice);
 c=await h.act(()=>h.render().openPhysicalCard('knowledge','Huế','basic'));assert.equal(c.activeCardModal,null);assert.equal(c.activePlayer.artifactItems.length,0);
}));
test('scanning in a new tab restores the match and stale tabs cannot award the mission twice',()=>stored(async()=>{
 const original=hooks(true);await original.act(()=>original.render().handleRollDice());
 const scanned=hooks();assert.equal(scanned.render().gameState.pendingPhysicalCard.kind,'knowledge');
 let c=await scanned.act(()=>scanned.render().openPhysicalCard('knowledge','Hà Nội','advanced'));assert.equal(c.activeCardModal.type,'knowledge');assert.equal(c.activeCardModal.difficulty,'advanced');assert.equal(c.activeCardModal.questionScope,'general');
 const reopened=hooks();assert.equal(reopened.render().activeCardModal.bankQuestionId,c.activeCardModal.bankQuestionId);
 c=await reopened.act(()=>reopened.render().handleResolveCard({success:true,logMessage:'correct'}));assert.equal(c.activePlayer.artifactItems.length,1);assert.equal(c.gameState.turnStep,5);
 c=await scanned.act(()=>scanned.render().handleResolveCard({success:true,logMessage:'duplicate'}));assert.equal(c.activePlayer.artifactItems.length,1);assert.equal(c.activeCardModal,null);
 c=await original.act(()=>original.render().openPhysicalCard('knowledge','Hà Nội','basic'));assert.equal(c.activePlayer.artifactItems.length,1);assert.equal(c.gameState.pendingPhysicalCard,null);
}));
test('corrupt or unsupported saved sessions are ignored safely',()=>stored(async values=>{
 const session=load('src/utils/gameSession.ts');values.set(session.GAME_SESSION_KEY,'{');assert.equal(session.loadGameSession(),null);values.set(session.GAME_SESSION_KEY,JSON.stringify({schema:999,state:{}}));assert.equal(session.loadGameSession(),null);
}));

test('server-graded phone answer applies laptop reward once through the real controller',()=>stored(async()=>{
 const api=load('server/rooms.ts').createRoomService(true);const host=await api({action:'create'});const guest={code:host.code,...await api({action:'join',code:host.code})};
 const h=hooks(true);let c=await h.act(()=>h.render().handleRollDice());
 const snapshot={key:'pending',kind:'knowledge',province:'Hà Nội',player:c.activePlayer.name};await api({...host,action:'publish',snapshot});
 await api({...guest,action:'open',key:'pending',kind:'knowledge',province:'Hà Nội',difficulty:'basic'});
 const opening=(await api({...host,action:'host'})).command;
 c=await h.act(()=>h.render().openPhysicalCard(opening.kind,opening.province,opening.difficulty));
 await api({...host,action:'publish',snapshot:{...snapshot,key:c.activeCardModal.id,questionId:c.activeCardModal.bankQuestionId,seconds:20}});
 await api({...guest,action:'answer',key:c.activeCardModal.id,answer:c.activeCardModal.correctAnswer});
 const answer=(await api({...host,action:'host'})).command;
 c=await h.act(()=>h.render().handleResolveCard({success:answer.success,logMessage:'Điện thoại gửi kết quả.'}));
 assert.equal(c.activePlayer.artifactItems.length,1);assert.equal(c.activePlayer.artifactItems[0].province,'Hà Nội');assert.equal(c.gameState.turnStep,5);
 c=await h.act(()=>h.render().handleResolveCard({success:answer.success,logMessage:'Gửi lại.'}));assert.equal(c.activePlayer.artifactItems.length,1);
}));
test('Lantern state survives QR reload both before and after the preview is consumed',()=>stored(async()=>{
 const first=player('p1');first.token='den_long';const original=hooks(true,[first,player('p2',20)]);await original.act(()=>original.render().handleRollDice());
 const scanned=hooks();let c=await scanned.act(()=>scanned.render().openPhysicalCard('knowledge','Hà Nội','basic'));assert.equal(c.showTokenSkillModal,true);assert.equal(c.activeCardModal,null);
 const reopened=hooks();assert.equal(reopened.render().showTokenSkillModal,true);const preview=await reopened.render().handlePreviewLantern();assert.ok(preview.bankQuestionId);
 const resumed=hooks();assert.equal(resumed.render().activePlayer.tokenSkillAvailable,false);assert.equal(resumed.render().lanternInitialPreview.bankQuestionId,preview.bankQuestionId);
 c=await resumed.act(()=>resumed.render().handleCloseToken());assert.equal(c.activeCardModal.bankQuestionId,preview.bankQuestionId);assert.equal(c.showTokenSkillModal,false);
}));
test('a QR on a device with no active match renders practice and never pretends to award artifacts',()=>{
 const {QRCardGateway}=load('src/components/QRCardGateway.tsx');const state={players:[player('p1'),player('p2')],activePlayerIndex:0,gameStatus:'setup'};
 const html=renderToStaticMarkup(React.createElement(QRCardGateway,{kind:'knowledge',gameState:state,onOpen(){throw Error('Should not run');},onBack(){}}));
 assert.ok(html.includes('Bắt đầu luyện tập'));assert.ok(html.includes('không cộng Kỷ vật'));assert.ok(html.includes('50 câu Kiến thức'));assert.ok(html.includes('font-serif-lacviet'));
});
