const {test}=require('node:test');
const assert=require('node:assert/strict');
const {loader}=require('./load-ts.cjs');
const {createRoomService}=loader()('server/rooms.ts');
const bank=require('../src/data/questionBank.json').questions;
async function fixture(){const api=createRoomService(true);const host=await api({action:'create'});const guest={code:host.code,...await api({action:'join',code:host.code})};return {api,host,guest};}
const pending={key:'turn-one',kind:'knowledge',province:'Hà Nội',player:'Người chơi 1'};
test('phone opens exact pending task and host receives one server-graded answer',async()=>{
 const {api,host,guest}=await fixture();
 await api({...host,action:'publish',snapshot:pending});
 await assert.rejects(api({...guest,action:'open',...pending,key:pending.key,kind:'challenge',difficulty:'basic'}),/đúng loại/);
 await assert.rejects(api({...guest,action:'open',key:pending.key,kind:'knowledge',province:'Huế',difficulty:'basic'}),/đúng loại/);
 await api({...guest,action:'open',key:pending.key,kind:'knowledge',province:'Hà Nội',difficulty:'basic'});
 const open=await api({...host,action:'host'});assert.equal(open.command.type,'open');
 await api({...host,action:'ack',id:open.command.id});
 const q=bank.find(q=>q.group==='knowledge');
 await api({...host,action:'publish',snapshot:{...pending,key:'card-one',questionId:q.id,seconds:20}});
 const phone=await api({...guest,action:'read'});assert.equal(phone.snapshot.question.question,q.question);assert.equal(phone.snapshot.question.correctAnswer,undefined);
 const [a,b]=await Promise.all([api({...guest,action:'answer',key:'card-one',answer:q.correctAnswer}),api({...guest,action:'answer',key:'card-one',answer:(q.correctAnswer+1)%4})]);
 assert.deepEqual(a.result,b.result);assert.equal(a.result.success,true);
 const received=await api({...host,action:'host'});assert.equal(received.command.success,true);
 await api({...host,action:'ack',id:received.command.id});assert.equal((await api({...host,action:'host'})).command,null);
});
test('different rooms are isolated and guest cannot publish or inspect host commands',async()=>{
 const a=await fixture(),b=await fixture();
 await a.api({...a.host,action:'publish',snapshot:pending});
 assert.equal((await b.api({...b.guest,action:'read'})).snapshot,null);
 await assert.rejects(a.api({...a.guest,action:'publish',snapshot:null}),/quyền/);
 await assert.rejects(a.api({...a.guest,action:'host'}),/quyền/);
 await assert.rejects(a.api({...a.host,guestToken:b.guest.guestToken,action:'read'}),/quyền/);
});
test('old task answers and invalid options are rejected; new task removes old command',async()=>{
 const {api,host,guest}=await fixture();const q=bank[0];
 await api({...host,action:'publish',snapshot:{...pending,key:'first',questionId:q.id}});
 await assert.rejects(api({...guest,action:'answer',key:'first',answer:4}),/Đáp án/);
 await api({...guest,action:'answer',key:'first',answer:q.correctAnswer});
 await api({...host,action:'publish',snapshot:{...pending,key:'second',questionId:q.id}});
 await assert.rejects(api({...guest,action:'answer',key:'first',answer:q.correctAnswer}),/thay đổi/);
 assert.equal((await api({...host,action:'host'})).command,null);
});
test('deadline is checked on server and timeout reaches laptop even if phone disconnects',async()=>{
 const {api,host,guest}=await fixture();const q=bank[0];const original=Date.now;let now=10000;Date.now=()=>now;
 try {
  await api({...host,action:'publish',snapshot:{...pending,key:'timed',questionId:q.id,seconds:20}});
  now=31000;
  const hostResult=await api({...host,action:'host'});assert.equal(hostResult.command.success,false);assert.equal(hostResult.command.answer,-1);
  const late=await api({...guest,action:'answer',key:'timed',answer:q.correctAnswer});assert.equal(late.result.success,false);
 }finally{Date.now=original;}
});
test('refresh and publishing same question retain original deadline and accepted result',async()=>{
 const {api,host,guest}=await fixture();const q=bank[0];const snapshot={...pending,key:'refresh',questionId:q.id,seconds:20};
 await api({...host,action:'publish',snapshot});const before=await api({...guest,action:'read'});
 await api({...guest,action:'answer',key:'refresh',answer:q.correctAnswer});await api({...host,action:'publish',snapshot});
 const after=await api({...guest,action:'read'});assert.equal(before.deadline,after.deadline);assert.equal(after.result.success,true);
});
test('production requires durable storage instead of silently using per-instance memory',async()=>{
 if(process.env.UPSTASH_REDIS_REST_URL||process.env.KV_REST_API_URL)return;
 await assert.rejects(createRoomService(false)({action:'create'}),/Redis/);
});
