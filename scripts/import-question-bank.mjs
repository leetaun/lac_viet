import fs from 'node:fs';
import path from 'node:path';
const args=Object.fromEntries(Array.from({length:process.argv.slice(2).length/2},(_,i)=>[process.argv[2+i*2].replace(/^--/,''),process.argv[3+i*2]]));
const lines=JSON.parse(fs.readFileSync(args.paragraphs,'utf8').replace(/^\uFEFF/,''));
const grades={'CẤP ĐỘ CƠ BẢN':'basic','CẤP ĐỘ TRUNG BÌNH':'intermediate','CẤP ĐỘ CAO CẤP':'advanced'};
const groups={'KIẾN THỨC':'knowledge','THỬ THÁCH':'challenge','THỊ TRƯỜNG':'market','LỄ HỘI':'festival'};
const sections=[];let grade,section,current;
for(const original of lines){
  const line=original.trim();if(!line)continue;
  if(grades[line]) { grade=grades[line];continue; }
  const heading=line.match(/^(KIẾN THỨC|THỬ THÁCH|THỊ TRƯỜNG|LỄ HỘI)\s*[—–-]\s*(\d+)\s*CÂU$/);
  if(heading){section={grade,group:groups[heading[1]],expected:Number(heading[2]),questions:[],answers:new Map(),sources:new Map()};sections.push(section);current=null;continue;}
  if(!section)continue;
  const question=line.match(/^Câu\s+(\d+)\.\s*(.+)$/);
  if(question){current={number:Number(question[1]),question:question[2],options:[]};section.questions.push(current);continue;}
  const option=line.match(/^([ABCD])\.\s*(.+)$/);
  if(option&&current){if(option[1]!==String.fromCharCode(65+current.options.length))throw Error('Option order: '+line);current.options.push(option[2]);continue;}
  const answer=line.match(/^(\d+)\.\s*Đáp án\s+([ABCD])\.\s*(.+)$/);
  if(answer){current=null;if(section.answers.has(Number(answer[1])))throw Error('Duplicate answer');section.answers.set(Number(answer[1]),{correctAnswer:answer[2].charCodeAt(0)-65,explanation:answer[3].replace(/\s*\[[A-Z0-9_]+\]/g,'').trim(),sourceIds:[...answer[3].matchAll(/\[([A-Z0-9_]+)\]/g)].map(m=>m[1])});continue;}
  const source=line.match(/^\[([A-Z0-9_]+)\]\s*(.+?)\s*[—–]\s*(https?:\/\/\S+)$/);
  if(source){section.sources.set(source[1],{id:source[1],label:source[2],url:source[3]});current=null;}
}
if(sections.length!==12)throw Error(`Expected 12 sections, found ${sections.length}`);
const questions=[];
for(const s of sections){
  if(s.questions.length!==s.expected||s.answers.size!==s.expected)throw Error(`${s.grade}/${s.group}: ${s.questions.length} questions, ${s.answers.size} answers; expected ${s.expected}`);
  for(const q of s.questions){
    const answer=s.answers.get(q.number);if(q.options.length!==4||!answer)throw Error('Incomplete question '+q.number);
    const sources=answer.sourceIds.map(id=>{const ref=s.sources.get(id);if(!ref)throw Error('Missing source '+id);return ref;});
    if(!sources.length)throw Error('No source for '+q.number);
    questions.push({id:`bank_${s.grade}_${s.group}_${String(q.number).padStart(3,'0')}`,group:s.group,difficulty:s.grade,number:q.number,question:q.question,options:q.options,correctAnswer:answer.correctAnswer,explanation:answer.explanation,sources,scope:'general'});
  }
}
if(questions.length!==375||new Set(questions.map(q=>q.id)).size!==375)throw Error('Expected 375 unique records');
const bank={sourceFile:args.source,sourceSha256:args.sha256,importedOn:'2026-10-27',questions};
fs.mkdirSync('src/data',{recursive:true});fs.writeFileSync('src/data/questionBank.json',JSON.stringify(bank,null,2)+'\n','utf8');
const counts={};for(const q of questions){const key=`${q.difficulty}/${q.group}`;counts[key]=(counts[key]||0)+1;}
fs.mkdirSync('output/qr',{recursive:true});fs.writeFileSync('output/qr/question-import-report.json',JSON.stringify({sourceFile:args.source,sourceSha256:args.sha256,total:questions.length,counts,missingAnswers:0,missingSources:0,classification:'Original group and difficulty; no invented province attribution.'},null,2)+'\n');
console.log(JSON.stringify({total:questions.length,counts,missingAnswers:0,missingSources:0},null,2));
