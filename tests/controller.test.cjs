const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loader}=require('./load-ts.cjs');
const base=loader(),decks=base('src/data/cardDecks.ts');
const artifact=(id,region='bac_bo',extra={})=>({id,name:id,region,province:'Hà Nội',storage:'pouch',isTreasure:false,isSealed:false,...extra});
function player(id,position=0,extra={}){return {id,name:id,position,seat:Number(id.slice(1)),isAI:false,token:'non_la',color:'#000',artifactItems:[],artifacts:0,safeArtifacts:0,biKipCards:[],milestones:[],score:0,tokenSkillAvailable:true,hasShield:false,immuneToPenalty:false,cards:{knowledge:[],resource:[],fortune:[]},lapsCompleted:0,...extra};}
function harness(players,options={}) {
 let cursor=0,slots=[];
 const react={useEffect(){},useRef(value){const i=cursor++;if(!slots[i])slots[i]={current:value};return slots[i];},useState(value){const i=cursor++;if(!(i in slots))slots[i]=typeof value==='function'?value():value;return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];}};
 const {useGameController}=loader({react}).call(null,'src/engine/useGameController.ts');
 const render=()=>{cursor=0;return useGameController(players,0);};
 const h={render,async act(fn,picker=choice=>choice.options.slice(0,choice.min).map(o=>o.id)){
  let done=false,error;Promise.resolve(fn()).then(()=>done=true,e=>{done=true;error=e;});
  for(let i=0;i<100&&!done;i++) {
   await Promise.resolve();await Promise.resolve();const c=render();
   if(c.choice)c.confirmChoice(picker(c.choice));
  }
  if(error)throw error;assert.equal(done,true,'action must finish without deadlocking');return render();
 }};
 render().handleStartGame({mode:'offline',gameModeRule:'toc_chien',artifactGoal:3,playerCount:players.length,players,options:{starterBiKip:false,exploreMode:false,timedMode:false,...options}});
 return h;
}
async function random(value,fn){const before=Math.random;Math.random=()=>value;try{return await fn();}finally{Math.random=before;}}

test('passing START pauses movement for quiz and then resumes remaining spaces',()=>random(0.4,async()=>{
 const h=harness([player('p1',38),player('p2',20)]);
 let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activeCornerStation.index,0);assert.equal(c.activePlayer.position,0);assert.equal(c.activePlayer.lapsCompleted,1);
 c=await h.act(()=>h.render().handleCloseCorner());assert.equal(c.activePlayer.position,1);assert.equal(c.activeCardModal.type,'knowledge');assert.equal(c.activeCardModal.province,'Hà Nội');
 c=await h.act(()=>h.render().handleResolveCard({success:false,logMessage:'wrong'}));assert.equal(c.gameState.turnStep,5);assert.equal(c.activePlayer.biKipCards.length,1);
}));
test('market grants one usable resource, pays exact selected card and awards local artifact',()=>random(0.5,async()=>{
 const h=harness([player('p1',0),player('p2',20)]); // first index 1 when random=.5
 // Seed the randomly selected first player to land on market #4 with a roll of 4.
 const players=[player('p1',0),player('p2',0)];const g=harness(players);
 let c=await g.act(()=>g.render().handleRollDice());assert.equal(c.activePlayer.position,4);assert.equal(c.activeCardModal.marketVisit,true);
 const card=c.activePlayer.cards.resource[0];assert.ok(card);
 const correctAnswer=c.activeCardModal.marketQuestion.correctAnswer;
 c=await g.act(()=>g.render().handleResolveCard({success:true,consumeCards:[card],marketAnswer:correctAnswer,logMessage:'buy'}));assert.equal(c.activePlayer.cards.resource.length,0);assert.equal(c.activePlayer.artifactItems.length,1);assert.equal(c.activePlayer.artifactItems[0].province,'Hải Phòng');
}));
test('encounter transfers one actual card rather than deleting it',()=>random(0,async()=>{
 const card={...decks.RESOURCE_CARDS[0],id:'one'};
 const h=harness([player('p1',0),player('p2',1,{cards:{knowledge:[],resource:[card],fortune:[]}})]);
 let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activeStealTarget.id,'p2');
 c=await h.act(()=>h.render().handleExecuteSteal('card'));assert.equal(c.gameState.players[0].cards.resource[0].id,'one');assert.equal(c.gameState.players[1].cards.resource.length,0);assert.equal(c.activeCardModal.type,'knowledge');
}));
test('exploration forces blitz, removes encounters and leaves local task reachable',()=>random(0,async()=>{
 const h=harness([player('p1',0),player('p2',1)],{exploreMode:true});
 let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activeStealTarget,null);assert.equal(c.activeCardModal.type,'knowledge');assert.equal(c.gameState.artifactGoal,3);
}));
test('Banh mi shifts the actual rolled movement before tasks and can enter a corner',()=>random(0.4,async()=>{
 const h=harness([player('p1',6,{token:'banh_mi'}),player('p2',20)]);
 let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.showTokenSkillModal,true);assert.equal(c.activePlayer.position,6);
 c=await h.act(()=>h.render().handleBanhMiShift(1));assert.equal(c.activePlayer.position,10);assert.equal(c.activePlayer.tokenSkillAvailable,false);assert.equal(c.activeCornerStation.index,10);
}));
test('challenge failure asks for the exact lost artifact and consumes Non La if accepted',()=>random(0,async()=>{
 const h=harness([player('p1',4,{artifactItems:[artifact('a'),artifact('b','nam_bo')]}),player('p2',20)]);
 let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activeCardModal.type,'challenge');
 c=await h.act(()=>h.render().handleResolveCard({success:false,logMessage:'fail'}),choice=>choice.title.includes('Nón lá')?['no']:choice.title.includes('làm rơi')?['b']:choice.options.slice(0,choice.min).map(o=>o.id));
 assert.equal(c.gameState.lostAndFound[0].id,'b');assert.equal(c.activePlayer.artifactItems[0].id,'a');assert.equal(c.activePlayer.biKipCards.length,1);
 const g=harness([player('p1',4,{artifactItems:[artifact('a')]}),player('p2',20)]);await g.act(()=>g.render().handleRollDice());
 c=await g.act(()=>g.render().handleResolveCard({success:false,logMessage:'hat'}));assert.equal(c.activePlayer.tokenSkillAvailable,false);assert.equal(c.gameState.lostAndFound.length,0);assert.equal(c.activePlayer.artifactItems.length,1);
}));
test('failed challenge moves a treasure into Lost and Found without destroying its identity',()=>random(0.4,async()=>{
 // First create a dropped treasure via a failed challenge.
 const treasure=artifact('treasure','bac_bo',{isTreasure:true});
 const h=harness([player('p1',2,{artifactItems:[treasure],token:'hoa_sen'}),player('p2',20)]);
 await h.act(()=>h.render().handleRollDice());let c=await h.act(()=>h.render().handleResolveCard({success:false,logMessage:'fail'}));assert.equal(c.gameState.lostAndFound.length,1);
 // Subsequent game turns are covered by the pure reclaim/START tests; retain a real transfer assertion here.
 assert.equal(c.activePlayer.artifactItems.length,0);assert.equal(c.gameState.lostAndFound[0].id,'treasure');
}));
test('end turn cannot bypass an open task, and resolves excess cards with a selection',()=>random(0,async()=>{
 const resources=Array.from({length:7},(_,i)=>({...decks.RESOURCE_CARDS[0],id:String(i)}));
 const h=harness([player('p1',0,{cards:{knowledge:[],resource:resources,fortune:[]}}),player('p2',20)]);
 let c=await h.act(()=>h.render().handleRollDice());await h.act(()=>h.render().handleEndTurn());assert.equal(h.render().gameState.activePlayerIndex,0);
 await h.act(()=>h.render().handleResolveCard({success:true,logMessage:'correct'}));
 c=await h.act(()=>h.render().handleEndTurn());assert.equal(c.gameState.activePlayerIndex,1);assert.equal(c.gameState.players[0].cards.resource.length,5);
}));

async function sequence(values,fn){const previous=Math.random;Math.random=()=>values.length?values.shift():0;try{return await fn();}finally{Math.random=previous;}}
test('festival gift awards the artifact of its province and does not store an event card',()=>sequence([0,0,0.4],async()=>{
 const h=harness([player('p1',1),player('p2',20)]);let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activeCardModal.eventType,'fortune_gift');
 c=await h.act(()=>h.render().handleResolveCard({success:true,logMessage:'gift'}));assert.equal(c.activePlayer.artifactItems[0].province,'Bắc Ninh');assert.equal(c.activePlayer.cards.fortune.length,0);assert.equal(c.gameState.turnStep,5);
}));
test('storm moves back two without invoking a task or a START visit',()=>sequence([0,0,0.65],async()=>{
 const h=harness([player('p1',1,{token:'hoa_sen'}),player('p2',20)]);let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activeCardModal.eventType,'storm');
 c=await h.act(()=>h.render().handleResolveCard({success:true,logMessage:'storm'}));assert.equal(c.activePlayer.position,0);assert.equal(c.activeCornerStation,null);assert.equal(c.activeCardModal,null);assert.equal(c.gameState.turnStep,5);
}));
test('harvest opens an extra roll in the same turn and resolves its new tile',()=>sequence([0,0,0.3],async()=>{
 const h=harness([player('p1',1),player('p2',20)]);let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activeCardModal.eventType,'harvest');
 c=await h.act(()=>h.render().handleResolveCard({success:true,logMessage:'harvest'}));assert.equal(c.gameState.hasRolled,false);assert.equal(c.gameState.turnStep,2);
 c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activePlayer.position,3);assert.equal(c.activeCardModal.province,'Hưng Yên');
}));
test('tailwind actually reaches the next corner and opens its privileges',()=>sequence([0,0,0.48],async()=>{
 const h=harness([player('p1',1),player('p2',20)]);let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.activeCardModal.eventType,'tailwind');
 c=await h.act(()=>h.render().handleResolveCard({success:true,logMessage:'tailwind'}));assert.equal(c.activePlayer.position,10);assert.equal(c.activeCornerStation.index,10);
}));
test('contest ties prefer the active player and never store the event in hand',()=>sequence([0,0,0],async()=>{
 const h=harness([player('p1',1),player('p2',20)]);await h.act(()=>h.render().handleRollDice());
 const c=await h.act(()=>h.render().handleResolveCard({success:true,logMessage:'contest'}),choice=>choice.options.map(o=>o.id));assert.equal(c.activePlayer.artifactItems.length,1);assert.equal(c.gameState.players[1].artifactItems.length,0);assert.equal(c.activePlayer.cards.fortune.length,0);
}));
test('Lantern previews the actual upcoming question and spends its use before redraw',()=>random(0,async()=>{
 const h=harness([player('p1',0,{token:'den_long'}),player('p2',20)]);let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.showTokenSkillModal,true);assert.equal(c.activeCardModal,null);
 const card=await h.render().handlePreviewLantern();assert.equal(card.province,'Hà Nội');assert.equal(h.render().activePlayer.tokenSkillAvailable,false);
 c=await h.act(()=>h.render().handleLanternRedraw());assert.equal(c.activeCardModal.province,'Hà Nội');assert.notEqual(c.activeCardModal.question,card.question);assert.equal(c.showTokenSkillModal,false);
}));
test('resetting after victory clears the winner so setup is not covered by the victory modal',()=>random(0,async()=>{
 const h=harness([player('p1',39,{artifactItems:[artifact('a'),artifact('b','trung_bo'),artifact('c','nam_bo')]}),player('p2',20)]);
 let c=await h.act(()=>h.render().handleRollDice());assert.equal(c.gameState.winner.id,'p1');
 c.resetSetup();c=h.render();assert.equal(c.gameState.winner,null);assert.equal(c.gameState.gameStatus,'setup');assert.equal(c.activeCornerStation,null);
}));
