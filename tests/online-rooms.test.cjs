const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loader}=require('./load-ts.cjs');
const load=loader();
const {createOnlineRoomService}=load('server/onlineRooms.ts');
const {memoryRoomStore}=load('server/onlineStore.ts');
const requestId=()=>require('node:crypto').randomUUID();
const joinToken=()=>require('node:crypto').randomBytes(32).toString('hex');
const create=api=>api({action:'create',name:'Phòng Lạc Việt',playerName:'Chủ phòng'});

test('private room codes, names and reconnect credentials are separate from the public room',async()=>{
 const api=createOnlineRoomService(memoryRoomStore());const host=await create(api);
 assert.match(host.room.code,/^[A-HJ-NP-Z2-9]{6}$/);assert.equal(host.room.name,'Phòng Lạc Việt');
 const read=await api({action:'read',...host.identity});
 assert.equal(read.room.hostId,host.identity.memberId);assert.equal(read.room.credentials,undefined);assert.equal(read.room.requests,undefined);
 assert.equal(JSON.stringify(read).includes(host.identity.token),false);
 await assert.rejects(api({action:'read',...host.identity,token:'wrong'}),/quyền/);
});
test('concurrent joins cannot exceed four seats and repeating a join does not duplicate a player',async()=>{
 const api=createOnlineRoomService(memoryRoomStore());const host=await create(api);
 const join={action:'join',code:host.room.code,playerName:'Bạn 1',joinToken:joinToken(),requestId:requestId()};
 const first=await api(join),repeat=await api(join);assert.deepEqual(first.identity,repeat.identity);assert.equal(repeat.room.members.length,2);
 const results=await Promise.allSettled(Array.from({length:4},(_,i)=>api({...join,playerName:`Bạn ${i+2}`,joinToken:joinToken(),requestId:requestId()})));
 assert.equal(results.filter(r=>r.status==='fulfilled').length,2);
 const {room}=await api({action:'read',...host.identity});assert.equal(room.members.length,4);assert.equal(new Set(room.members.map(m=>m.token)).size,4);
});
test('only the host configures the room; stale revisions and occupied tokens are rejected',async()=>{
 const api=createOnlineRoomService(memoryRoomStore());const host=await create(api);
 const guest=await api({action:'join',code:host.room.code,playerName:'Bạn',joinToken:joinToken(),requestId:requestId()});
 await assert.rejects(api({action:'configure',...guest.identity,version:guest.room.version,requestId:requestId(),rule:'co_ban'}),/chủ phòng/);
 await assert.rejects(api({action:'profile',...guest.identity,version:guest.room.version,requestId:requestId(),playerName:'Bạn',playerToken:'non_la'}),/đã có người/);
 const configured=await api({action:'configure',...host.identity,version:guest.room.version,requestId:requestId(),rule:'truong_ky'});
 assert.equal(configured.room.settings.goal,7);
 await assert.rejects(api({action:'ready',...guest.identity,version:guest.room.version,requestId:requestId(),ready:true}),/vừa thay đổi/);
});
test('the host can close a lobby and future reads cannot reopen it',async()=>{
 const api=createOnlineRoomService(memoryRoomStore());const host=await create(api);
 await api({action:'leave',...host.identity,version:host.room.version,requestId:requestId()});
 await assert.rejects(api({action:'read',...host.identity}),/đóng phòng/);
});

test('two ready members start one authoritative game, out-of-turn commands and forged rewards are rejected',async()=>{
 const store=memoryRoomStore();let api=createOnlineRoomService(store);const host=await create(api);
 const guest=await api({action:'join',code:host.room.code,playerName:'Bạn',joinToken:joinToken(),requestId:requestId()});
 await assert.rejects(api({action:'start',...host.identity,version:guest.room.version,requestId:requestId()}),/sẵn sàng/);
 const ready=await api({action:'ready',...guest.identity,version:guest.room.version,ready:true,requestId:requestId()});
 await assert.rejects(api({action:'start',...guest.identity,version:ready.room.version,requestId:requestId()}),/chủ phòng/);
 let current=await api({action:'start',...host.identity,version:ready.room.version,requestId:requestId()});
 assert.equal(current.room.game.mode,'online');assert.equal(current.room.game.players.length,2);
 const active=current.room.game.players[current.room.game.activePlayerIndex].id;
 const who=active===host.identity.memberId?host.identity:guest.identity, other=active===host.identity.memberId?guest.identity:host.identity;
 await assert.rejects(api({action:'command',...other,version:current.room.version,requestId:requestId(),method:'roll',args:[]}),/đến lượt/);
 const id=requestId();current=await api({action:'command',...who,version:current.room.version,requestId:id,method:'roll',args:[]});
 const rolled=current.room.game.diceValue;assert.ok(rolled>=1&&rolled<=6);
 const repeated=await api({action:'command',...who,version:current.room.version,requestId:id,method:'roll',args:[]});assert.equal(repeated.room.game.diceValue,rolled);
 // A fresh service instance reads the same game; no host browser is the authority.
 api=createOnlineRoomService(store);const restored=await api({action:'read',...other});assert.deepEqual(restored.room.game,current.room.game);
 assert.equal(restored.room.operation,undefined);
});

test('server grades canonical answers and never accepts a client-supplied artifact or success flag',async()=>{
 const {gradeResolution}=load('server/onlineEngine.ts');const {QUESTION_BANK,bankGameCard}=load('src/data/questionBank.ts');
 const q=QUESTION_BANK[0],card=bankGameCard(q,'Hà Nội');
 const game={players:[{id:'a',name:'A',cards:{knowledge:[],resource:[],fortune:[]},biKipCards:[]}],activePlayerIndex:0,currentActionModal:{card}};
 assert.throws(()=>gradeResolution(game,{success:true,rewardArtifactItem:{id:'fake'}},Date.now()),/phương án/);
 const wrong=gradeResolution(game,{success:true,quizAnswer:(q.correctAnswer+1)%4,rewardArtifactItem:{id:'fake'}},Date.now());
 assert.equal(wrong.success,false);assert.equal(wrong.rewardArtifactItem,undefined);
 const expired=gradeResolution(game,{quizAnswer:q.correctAnswer},Date.now()-21000);assert.equal(expired.success,false);
});

test('a suspended decision replays identically after serialization without duplicating dice draws or card spending',async()=>{
 const {executeOperation,operation}=load('server/onlineEngine.ts');const {RESOURCE_CARDS}=load('src/data/cardDecks.ts');
 const players=[{id:'a',name:'A',seat:1,token:'non_la',position:0,isAI:false,color:'#000',artifactItems:[],artifacts:0,safeArtifacts:0,biKipCards:[],milestones:[],score:0,tokenSkillAvailable:true,hasShield:false,immuneToPenalty:false,cards:{knowledge:[],resource:[{...RESOURCE_CARDS.find(c=>c.category==='steed'),id:'steed'}],fortune:[]},lapsCompleted:0}];
 players.push({...structuredClone(players[0]),id:'b',name:'B',seat:2,position:20,cards:{knowledge:[],resource:[],fortune:[]}});
 const base={players,activePlayerIndex:0,gameStatus:'playing',mode:'online',gameModeRule:'toc_chien',artifactGoal:3,round:1,turnStep:1,diceValue:null,hasRolled:false,winner:null,lostAndFound:[],milestones:[],options:{physicalDice:false,physicalQR:false,exploreMode:false,timedMode:false},currentActionModal:null,historyLog:[]};
 const op=operation(base,'roll');op.seed='00000001000000000000000000000000';
 const first=await executeOperation(op);assert.equal(first.pending,true);assert.equal(first.panel.choice.playerId,'a');
 const replay=await executeOperation(JSON.parse(JSON.stringify(op)));assert.deepEqual(replay,first);
 op.answers.push(['no']);const done=await executeOperation(op);assert.equal(done.pending,false);assert.equal(done.game.diceValue,first.game.diceValue);assert.equal(done.game.players[0].cards.resource[0].id,'steed');
});
