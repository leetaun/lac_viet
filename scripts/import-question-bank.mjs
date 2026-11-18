import fs from 'node:fs';
const args=Object.fromEntries(Array.from({length:process.argv.slice(2).length/2},(_,i)=>[process.argv[2+i*2].replace(/^--/,''),process.argv[3+i*2]]));
const lines=JSON.parse(fs.readFileSync(args.paragraphs,'utf8').replace(/^\uFEFF/,''));
const sections={history:{questions:[],answers:new Map()},geography:{questions:[],answers:new Map()}};
let topic,current,answerMode=false;
for(const raw of lines){
  const line=raw.trim();if(!line)continue;
  if(line==='ĐÁP ÁN'){answerMode=true;current=null;continue;}
  if(/^PHẦN I\. LỊCH SỬ/.test(line)||line==='I. Lịch sử'){topic='history';current=null;continue;}
  if(/^PHẦN II\. ĐỊA LÝ/.test(line)||line==='II. Địa lý'){topic='geography';current=null;continue;}
  if(!topic)continue;
  if(answerMode){
    for(const match of line.matchAll(/(\d+)\.\s*([ABCD])\b/g)){
      const n=Number(match[1]);if(sections[topic].answers.has(n))throw Error('Duplicate answer '+topic+'/'+n);
      sections[topic].answers.set(n,match[2].charCodeAt(0)-65);
    }
    continue;
  }
  const question=line.match(/^Câu\s+(\d+)\.\s*(.+)$/);
  if(question){current={number:Number(question[1]),question:question[2],options:[]};sections[topic].questions.push(current);continue;}
  const option=line.match(/^([ABCD])\.\s*(.+)$/);
  if(option&&current){if(option[1]!==String.fromCharCode(65+current.options.length))throw Error('Option order: '+line);current.options.push(option[2]);}
}
const questions=[];
for(const [topic,s] of Object.entries(sections)){
  if(s.questions.length!==50||s.answers.size!==50)throw Error(`Expected 50 questions and answers for ${topic}, found ${s.questions.length}/${s.answers.size}`);
  const numbers=new Set();
  for(const q of s.questions){
    if(numbers.has(q.number)||q.number<1||q.number>50||q.options.length!==4||!s.answers.has(q.number))throw Error('Incomplete/duplicate question '+topic+'/'+q.number);
    numbers.add(q.number);const answer=s.answers.get(q.number),label=topic==='history'?'Lịch sử':'Địa lý';
    questions.push({id:`lv100_${topic}_${String(q.number).padStart(3,'0')}`,group:'knowledge',difficulty:'basic',topic,number:q.number,question:q.question,options:q.options,correctAnswer:answer,explanation:`Đáp án trong bộ câu hỏi: ${String.fromCharCode(65+answer)}. ${q.options[answer]}.`,sources:[{id:`DOCX_${topic}_${q.number}`,label:`${args.source} · ${label} · Câu ${q.number}`,url:''}],scope:'general'});
  }
}
if(questions.length!==100||new Set(questions.map(q=>q.id)).size!==100)throw Error('Expected 100 unique questions');
const bank={sourceFile:args.source,sourceSha256:args.sha256,importedOn:'2026-11-19',sourceDifficulty:'Dễ – Trung bình (theo tài liệu, không chia mức cho từng câu)',questionSetId:`lv100-${args.sha256.slice(0,16)}`,questions};
fs.writeFileSync('src/data/questionBank.json',JSON.stringify(bank,null,2)+'\n','utf8');
const report={sourceFile:args.source,sourceSha256:args.sha256,total:100,topics:{history:50,geography:50},missingAnswers:0,sourceReferences:'User-supplied DOCX and answer key; no external citations or extra explanations added.',usage:'One canonical set reused by all quiz spaces; no invented difficulty or action tasks.'};
fs.mkdirSync('output/qr',{recursive:true});fs.writeFileSync('output/qr/question-import-report.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
