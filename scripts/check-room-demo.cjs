const assert=require('node:assert/strict');
const bank=require('../src/data/questionBank.json').questions;
const base=process.argv[2]||'http://127.0.0.1:3014';
async function call(body){const response=await fetch(`${base}/api/qr-room`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});const text=await response.text();let data;try{data=JSON.parse(text);}catch{throw Error(`API HTTP ${response.status}: ${text.slice(0,120)}`);}if(!response.ok)throw Error(data.error);return data;}
(async()=>{
 const laptop=await call({action:'create'});
 const phone={code:laptop.code,...await call({action:'join',code:laptop.code})};
 const pending={key:'http-demo-pending',kind:'knowledge',province:'Hà Nội',player:'Người chơi demo'};
 await call({...laptop,action:'publish',snapshot:pending});
 const initial=await call({...phone,action:'read'});assert.equal(initial.snapshot.key,pending.key);
 await call({...phone,action:'open',key:pending.key,kind:'knowledge',province:'Hà Nội',difficulty:'basic'});
 const request=await call({...laptop,action:'host'});assert.equal(request.command.type,'open');
 await call({...laptop,action:'ack',id:request.command.id});
 const q=bank[0];await call({...laptop,action:'publish',snapshot:{...pending,key:'http-demo-question',questionId:q.id,seconds:20}});
 const question=await call({...phone,action:'read'});assert.equal(question.snapshot.question.question,q.question);
 await call({...phone,action:'answer',key:'http-demo-question',answer:q.correctAnswer});
 const answer=await call({...laptop,action:'host'});assert.equal(answer.command.success,true);
 await call({...laptop,action:'ack',id:answer.command.id});assert.equal((await call({...laptop,action:'host'})).command,null);
 console.log('HTTP demo passed: separate laptop/phone requests, room pairing, province, question, grading, one-time result.');
})().catch(error=>{console.error(error.message);process.exitCode=1;});
