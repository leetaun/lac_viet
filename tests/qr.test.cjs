const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const React=require('react');
const {renderToStaticMarkup}=require('react-dom/server');
const {loader}=require('./load-ts.cjs');
const load=loader();
const bank=load('src/data/questionBank.ts');
const qr=load('src/utils/physicalQR.ts');
const reading=load('src/utils/learningResources.ts');

test('every supplied question has a checked HTTPS reading and all four task types resolve by question, not province',()=>{
 const manifest=require('../src/data/questionResources.json');
 assert.equal(manifest.questionSetId,bank.QUESTION_SET_ID);assert.equal(Object.keys(manifest.resources).length,90);
 for(const question of bank.QUESTION_BANK){
  const expected=question.learningResource;
  assert.ok(expected?.title);const url=new URL(expected.url);assert.equal(url.protocol,'https:');assert.equal(url.username,'');assert.equal(url.password,'');
  assert.notEqual(url.hostname,'lacviet.edu.vn');assert.ok(!url.hostname.includes('google.'));
  assert.ok(question.sources.some(s=>s.url===expected.url));
  const knowledge=bank.bankGameCard({...question,group:'knowledge'},'Tuyên Quang');
  const challenge=bank.bankGameCard({...question,group:'challenge'},'Hà Nội');
  const market={type:'resource',marketQuestion:question,province:'Tuyên Quang'};
  const contest={type:'fortune',contestQuestion:question,province:'Cà Mau'};
  for(const task of [knowledge,challenge,market,contest])assert.deepEqual(reading.getCardLearningResource(task),expected);
  assert.equal(knowledge.qrContent,expected.url);assert.equal(challenge.qrContent,expected.url);
 }
 const culture=bank.QUESTION_BANK.find(q=>q.topic==='culture'&&q.number===12);
 assert.ok(decodeURIComponent(culture.learningResource.url).includes('Hát_then'));
 // An old restored card's stale province link must not override the question registry.
 assert.equal(reading.getCardLearningResource({type:'knowledge',bankQuestionId:culture.id,qrContent:'https://lacviet.edu.vn/tinh-thanh/tuyen-quang'}).url,culture.learningResource.url);
 assert.equal(reading.getCardLearningResource({type:'resource',id:'bonus',province:'Tuyên Quang'}),undefined);
});

test('reading QR supports the longest curated URL and blank source URLs are never rendered as links',async()=>{
 const resource=bank.QUESTION_BANK.map(q=>q.learningResource).sort((a,b)=>b.url.length-a.url.length)[0];
 const {generateQRCode}=load('src/utils/qrcode.ts');
 assert.ok((await generateQRCode(resource.url,{width:384,margin:4})).startsWith('data:image/png;base64,'));
 const {QuestionSources}=load('src/components/QuestionSources.tsx');
 const html=renderToStaticMarkup(React.createElement(QuestionSources,{sources:bank.QUESTION_BANK[0].sources}));
 assert.equal(html.includes('href=""'),false);assert.ok(html.includes('<a '));assert.ok(html.includes(bank.BANK_SOURCE.file));
});
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

test('exactly 90 replacement questions preserve all three answer keys and source difficulties',()=>{
 assert.equal(bank.QUESTION_BANK.length,90);assert.equal(new Set(bank.QUESTION_BANK.map(q=>q.id)).size,90);
 // Answer keys independently transcribed from the three source tables, 1–30 each.
 const keys={history:'BAACDACBACBBCABACBBBCACADABBAC',culture:'BBBBCCBABBABABBBACBBACCBCCAACB',geography:'ABCADABCAABBBBAAAAABAACBBBBAAB'};
 for(const [topic,key] of Object.entries(keys)){
  const questions=bank.QUESTION_BANK.filter(q=>q.topic===topic);assert.equal(questions.length,30);assert.equal(key.length,30);
  questions.forEach((q,index)=>{assert.equal(q.number,index+1);assert.equal(q.correctAnswer,key.charCodeAt(index)-65);assert.equal(q.options.length,4);assert.ok(q.id.startsWith('lv90_'));assert.equal(q.difficulty,index<10?'basic':index<20?'intermediate':'advanced');assert.ok(q.sources[0].label.includes(bank.BANK_SOURCE.file));});
 }
 assert.equal(bank.QUESTION_BANK[0].options[0],'30/4');
 assert.equal(bank.BANK_SOURCE.sha256,'e94b820a578b08cdd5d44eca520bbe182861281be87735ae0960e947fef12938');
});
test('all quiz spaces reuse the new set with repeat avoidance and no invented difficulty',()=>{
 const all=bank.QUESTION_BANK;const wanted=all.at(-1);
 assert.equal(bank.pickBankQuestion('knowledge','advanced',all.slice(0,-1).map(q=>q.id)).id,wanted.id);
 const card=bank.bankGameCard(wanted,'Huế');assert.equal(card.question,wanted.question);assert.equal(card.province,'Huế');assert.equal(card.topic,'geography');assert.equal(card.correctAnswer,wanted.correctAnswer);
 for(const group of ['knowledge','challenge','market','festival'])for(const difficulty of ['basic','intermediate','advanced']){const q=bank.pickBankQuestion(group,difficulty);assert.equal(q.group,group);assert.equal(q.difficulty,difficulty);}
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

test('saved match resumes the same Vietnam day and expires at Vietnam midnight',()=>stored(async(values)=>{
 const session=load('src/utils/gameSession.ts');
 const state=hooks(true).render().gameState;
 const beforeMidnight=new Date('2026-11-19T16:59:00Z');
 const midnight=new Date('2026-11-19T17:00:00Z');
 values.set('lacviet.library.v1','keep activated packs');
 assert.equal(session.saveGameSession(state,beforeMidnight),true);
 assert.equal(session.loadGameSession(new Date('2026-11-19T16:59:59Z')).sessionId,state.sessionId);
 assert.equal(session.loadGameSession(midnight),null);
 assert.equal(values.has(session.GAME_SESSION_KEY),false);
 assert.equal(values.get('lacviet.library.v1'),'keep activated packs');
 assert.equal(session.saveGameSession(state,midnight),true);
 assert.equal(session.loadGameSession(new Date('2026-11-20T09:00:00Z')).sessionId,state.sessionId);
}));

test('undated saves expire instead of restoring a match from before the daily reset update',()=>stored(async(values)=>{
 const session=load('src/utils/gameSession.ts');
 values.set(session.GAME_SESSION_KEY,JSON.stringify({schema:1,state:hooks().render().gameState}));
 assert.equal(session.loadGameSession(),null);
 assert.equal(values.has(session.GAME_SESSION_KEY),false);
}));

test('saved matches replace retired questions without losing artifacts or reviving old phone answers',()=>stored(async()=>{
 const h=hooks(true);let c=await h.act(()=>h.render().handleRollDice());
 c=await h.act(()=>h.render().openPhysicalCard('knowledge','Hà Nội','basic'));
 const session=load('src/utils/gameSession.ts');const legacy=JSON.parse(JSON.stringify(c.gameState));
 delete legacy.questionSetId;legacy.options.questionIds=['retired'];
 legacy.currentActionModal.card.question='OLD QUESTION';legacy.currentActionModal.card.bankQuestionId='retired';
 legacy.players[0].artifactItems=[{id:'keep',name:'Kỷ vật đã nhận',province:'Hà Nội',region:'bac_bo',storage:'pouch',isTreasure:false,isSealed:false}];
 legacy.players[0].biKipCards=[{id:'scroll',topic:'history',title:'OLD QUESTION',questionSnippet:'OLD QUESTION'}];
 session.saveGameSession(legacy);
 const restored=session.loadGameSession();
 assert.equal(restored.questionSetId,bank.QUESTION_SET_ID);assert.equal(restored.players[0].artifactItems[0].id,'keep');
 assert.equal(restored.players[0].biKipCards[0].id,'scroll');assert.equal(restored.players[0].biKipCards[0].questionSnippet,undefined);
 assert.ok(restored.currentActionModal.card.bankQuestionId.startsWith('lv90_'));
 assert.notEqual(restored.currentActionModal.card.id,legacy.currentActionModal.card.id);
 assert.equal(restored.options.questionIds,undefined);assert.equal(JSON.stringify(restored).includes('OLD QUESTION'),false);
 assert.equal(session.loadGameSession().revision,restored.revision);
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
 assert.ok(html.includes('Bắt đầu luyện tập'));assert.ok(html.includes('không cộng Kỷ vật'));assert.ok(html.includes('90 câu Kiến thức'));assert.ok(html.includes('font-serif-lacviet'));
});
