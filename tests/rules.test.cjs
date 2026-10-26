const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loader}=require('./load-ts.cjs');
const load=loader();
const rules=load('src/engine/rules.ts');
const decks=load('src/data/cardDecks.ts');
const content=load('src/engine/content.ts');
const {BOARD_SPACES}=load('src/data/boardData.ts');
const resource=(id='r')=>({...decks.RESOURCE_CARDS[0],id});
const artifact=(id,region='bac_bo',extra={})=>({id,name:id,region,province:'Hà Nội',storage:'pouch',isTreasure:false,isSealed:false,...extra});
function player(id,arts=[],cards=[]) {return {id,name:id,seat:Number(id.slice(1))||1,isAI:false,token:'non_la',color:'#000',position:1,artifactItems:arts,artifacts:arts.length,safeArtifacts:0,biKipCards:[],milestones:[],score:0,tokenSkillAvailable:true,hasShield:false,immuneToPenalty:false,cards:{knowledge:[],resource:cards,fortune:[]},lapsCompleted:0};}
function state(players){return {players,activePlayerIndex:0,firstPlayerIndex:0,gameStatus:'playing',gameModeRule:'toc_chien',artifactGoal:3,mode:'offline',round:1,turnStep:1,diceValue:null,hasRolled:false,lostAndFound:[],milestones:[],options:{exploreMode:false,timedMode:false,starterBiKip:false},historyLog:[],currentActionModal:null,winner:null};}
function frozen(value){Object.freeze(value);for(const child of Object.values(value))if(child&&typeof child==='object'&&!Object.isFrozen(child))frozen(child);return value;}

test('victory excludes sealed pouch, includes safe exactly once and requires each region',()=>{
 const p=player('p1',[artifact('a'),artifact('b','trung_bo'),artifact('c','nam_bo',{storage:'safe'})]);
 assert.equal(rules.canWin(p,3,'toc_chien'),true);
 p.artifactItems[0].isSealed=true;assert.equal(rules.canWin(p,3,'toc_chien'),false);
 p.artifactItems[0].storage='safe';assert.equal(rules.canWin(p,3,'toc_chien'),true);
 assert.equal(rules.canWin(p,7,'truong_ky'),false);
});
test('least-artifact protection counts sealed items and protects tied minima',()=>{
 const a=player('p1',[artifact('a',{},{isSealed:true})]);const b=player('p2',[]);const c=player('p3',[]);
 assert.equal(rules.isProtected(a,[a,b,c]),false);assert.equal(rules.isProtected(b,[a,b,c]),true);assert.equal(rules.isProtected(c,[a,b,c]),true);
 assert.equal(rules.isProtected(b,[b,c]),true);
});
test('weighted draws cover every percentage point exactly',()=>{
 for(const deck of [decks.RESOURCE_CARDS,decks.FORTUNE_CARDS]) {
  const counts={};for(let i=0;i<100;i++){const card=rules.weightedDraw(deck,()=>(i+0.5)/100);counts[card.id]=(counts[card.id]||0)+1;}
  for(const card of deck)assert.equal(counts[card.id],card.ratePercent);
 }
});
test('exploration removes crossbow/seal and each drawn card has independent identity',()=>{
 for(let i=0;i<100;i++){assert.notEqual(decks.drawResourceCard(true).category,'crossbow');assert.notEqual(decks.drawFortuneCard(true).eventType,'seal');}
 assert.notEqual(decks.drawResourceCard().id,decks.drawResourceCard().id);
});
test('transferring one card conserves identity and never mutates prior state',()=>{
 const a=player('p1',[],[resource('a'),resource('b')]),b=player('p2');const before=frozen([a,b]);
 const after=rules.transferCard(before,'p1','p2','a');assert.deepEqual(rules.hand(after[0]).map(c=>c.id),['b']);assert.deepEqual(rules.hand(after[1]).map(c=>c.id),['a']);assert.equal(a.cards.resource.length,2);
 assert.throws(()=>rules.transferCard(after,'p1','p2','a'));
});
test('spending a card instance preserves another instance of the same template',()=>{
 const p=player('p1',[],[resource('one'),resource('two')]);const next=rules.removeCards(p,['one']);assert.deepEqual(rules.hand(next).map(c=>c.id),['two']);assert.throws(()=>rules.removeCards(p,['one','one']));
});
test('Bi kip costs are validated and debited once',()=>{
 const p={...player('p1'),biKipCards:[1,2,3].map(i=>({...decks.STARTER_BIKIP_CARDS[0],id:String(i)}))};
 assert.equal(rules.spendBiKip(p,['1']).biKipCards.length,2);assert.equal(rules.spendBiKip(p,['1','2','3']).biKipCards.length,0);assert.throws(()=>rules.spendBiKip(p,['missing']));
});
test('safe deposit rejects sealed, more than two and nonowned artifacts',()=>{
 const p=player('p1',[artifact('a'),artifact('b'),artifact('c','nam_bo',{isSealed:true})]);
 assert.equal(rules.deposit(p,['a','b']).safeArtifacts,2);assert.throws(()=>rules.deposit(p,['c']));assert.throws(()=>rules.deposit(p,['a','b','c']));assert.throws(()=>rules.deposit(p,['z']));
});
test('reclaim chooses exact artifact and clears treasure and seal',()=>{
 const lost=[artifact('a'),artifact('b','nam_bo',{isTreasure:true,isSealed:true})];const result=rules.reclaim(player('p1'),lost,'b');assert.equal(result.player.artifactItems[0].id,'b');assert.equal(result.player.artifactItems[0].isTreasure,false);assert.equal(result.player.artifactItems[0].isSealed,false);assert.deepEqual(result.lost.map(a=>a.id),['a']);
});
test('challenge failure permits any pouch artifact and never drops a safe artifact',()=>{
 const p=player('p1',[artifact('safe','nam_bo',{storage:'safe'}),artifact('sealed','bac_bo',{isSealed:true})]);const s=state([p]);
 const result=rules.failChallenge(s,'sealed');assert.equal(result.lostAndFound[0].id,'sealed');assert.equal(result.players[0].safeArtifacts,1);assert.throws(()=>rules.failChallenge(s,'safe'));
});
test('empty-pouch challenge penalty discards chosen card; Non La consumes exactly once',()=>{
 const s=state([player('p1',[],[resource('a'),resource('b')])]);
 assert.equal(rules.hand(rules.failChallenge(s,undefined,'b').players[0]).length,1);
 const shielded=rules.failChallenge(s,undefined,undefined,true);assert.equal(shielded.players[0].tokenSkillAvailable,false);assert.throws(()=>rules.failChallenge(shielded,undefined,undefined,true));
});
test('crossbow respects wrapped distance, treasures, safe storage and protection',()=>{
 const attack={...decks.RESOURCE_CARDS[2],id:'cross'};const a=player('p1',[],[attack]);a.position=39;
 const b=player('p2',[artifact('target'),artifact('extra')]);b.position=1;
 const s=state([a,b]);const result=rules.useCard(s,'cross',{targetId:'p2',artifactId:'target'});assert.equal(result.players[0].artifactItems[0].id,'target');assert.equal(result.players[1].artifactItems.length,1);assert.equal(rules.hand(result.players[0]).length,0);
 b.position=5;assert.throws(()=>rules.useCard(s,'cross',{targetId:'p2',artifactId:'target'}));
 b.position=1;b.artifactItems[0].isTreasure=true;assert.throws(()=>rules.useCard(s,'cross',{targetId:'p2',artifactId:'target'}));
});
test('shield consumes defense and attack while conserving artifact ownership',()=>{
 const a=player('p1',[],[{...decks.RESOURCE_CARDS[2],id:'cross'}]);const b=player('p2',[artifact('a'),artifact('b')],[resource('shield')]);
 const next=rules.useCard(state([a,b]),'cross',{targetId:'p2',artifactId:'a',blockedBy:'shield'});assert.equal(rules.hand(next.players[0]).length,0);assert.equal(rules.hand(next.players[1]).length,0);assert.equal(next.players[1].artifactItems.length,2);
});
test('third milestone requires selecting an old flag and retains cap',()=>{
 const p=player('p1',[],[{...decks.RESOURCE_CARDS[3],id:'flag'}]);p.position=3;
 const s=state([p]);s.milestones=[1,2].map(spaceIndex=>({spaceIndex,playerId:p.id,playerSeat:1,playerColor:p.color,provinceName:''}));
 assert.throws(()=>rules.placeMilestone(s,'flag'));const next=rules.placeMilestone(s,'flag',1);assert.deepEqual(next.players[0].milestones,[2,3]);assert.equal(next.milestones.length,2);
});
test('turn cannot end before task; must discard excess and timed ranking uses valid assets',()=>{
 const a=player('p1',[],Array.from({length:7},(_,i)=>resource(String(i))));const b=player('p2',[artifact('a')]);let s=state([a,b]);assert.throws(()=>rules.finishTurn(s));
 s={...s,hasRolled:true,turnStep:5};assert.throws(()=>rules.finishTurn(s));const next=rules.finishTurn(s,['0','1']);assert.equal(next.activePlayerIndex,1);assert.equal(rules.hand(next.players[0]).length,5);
 s.options.timedMode=true;s.endsAt=1;const timed=rules.finishTurn(s,['0','1'],2);assert.equal(timed.winner.id,'p2');assert.equal(timed.gameStatus,'game_over');
});
test('timed ties prefer region count, then forward distance to START',()=>{
 const a=player('p1',[artifact('a'),artifact('b')]);const b=player('p2',[artifact('c'),artifact('d','nam_bo')]);assert.equal(rules.timedRanking([a,b])[0].id,'p2');a.artifactItems[1].region='nam_bo';a.position=39;b.position=1;assert.equal(rules.timedRanking([a,b])[0].id,'p1');
});
test('board layout and every local draw stay in the correct province (including Hue)',()=>{
 assert.equal(BOARD_SPACES.length,40);
 for(const space of BOARD_SPACES.filter(s=>s.province)) for(const type of ['knowledge','challenge']) {
  const card=content.drawLocalQuestion(space.province,type);assert.equal(card.province,space.province);assert.equal(card.region,space.region);assert.ok(card.options.length>=3);assert.ok(card.options[card.correctAnswer]);
 }
});

exports.player=player;exports.state=state;
