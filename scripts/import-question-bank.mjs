import fs from 'node:fs';
const input = JSON.parse(fs.readFileSync(process.argv[2] || 'output/new-question-document.json', 'utf8').replace(/^\uFEFF/, ''));
const labels = { history: 'Lịch sử', culture: 'Văn hóa', geography: 'Địa lý' };
const topics = Object.keys(labels);
const sections = Object.fromEntries(topics.map(topic => [topic, { questions: [], answers: new Map() }]));
let topic, current, answerMode = false;
for (const raw of input.lines) {
  const line = raw.trim();
  const heading = line.match(/^([123])\. Bộ [123]:/);
  const answerHeading = line.match(/^4\.([123])\. Đáp Án Bộ/);
  if (heading || answerHeading) {
    topic = topics[Number((heading || answerHeading)[1]) - 1];
    answerMode = !!answerHeading; current = null; continue;
  }
  if (!topic) continue;
  if (answerMode) {
    for (const match of line.matchAll(/(?:^|,)(\d+),([ABCD])(?=,|$)/g)) {
      const n = Number(match[1]);
      if (sections[topic].answers.has(n)) throw Error(`Duplicate answer ${topic}/${n}`);
      sections[topic].answers.set(n, match[2].charCodeAt(0) - 65);
    }
    continue;
  }
  const question = line.match(/^Câu\s+(\d+):\s*(.+)$/);
  if (question) {
    current = { number: Number(question[1]), question: question[2], options: [] };
    sections[topic].questions.push(current); continue;
  }
  const option = line.match(/^([ABCD])\.\s*(.+)$/);
  if (option && current) {
    if (option[1] !== String.fromCharCode(65 + current.options.length)) throw Error(`Option order: ${line}`);
    current.options.push(option[2]);
  }
}
const questions = [];
for (const [topic, section] of Object.entries(sections)) {
  if (section.questions.length !== 30 || section.answers.size !== 30) throw Error(`Incomplete ${topic}: ${section.questions.length}/${section.answers.size}`);
  const numbers = new Set();
  for (const q of section.questions) {
    if (numbers.has(q.number) || q.number < 1 || q.number > 30 || q.options.length !== 4 || !section.answers.has(q.number)) throw Error(`Incomplete/duplicate question ${topic}/${q.number}`);
    numbers.add(q.number);
    const answer = section.answers.get(q.number);
    questions.push({ id: `lv90_${topic}_${String(q.number).padStart(3, '0')}`, group: 'knowledge', difficulty: q.number <= 10 ? 'basic' : q.number <= 20 ? 'intermediate' : 'advanced', topic, number: q.number, question: q.question, options: q.options, correctAnswer: answer,
      explanation: `Đáp án trong bộ câu hỏi: ${String.fromCharCode(65 + answer)}. ${q.options[answer]}.`,
      sources: [{ id: `DOCX_${topic}_${q.number}`, label: `${input.source} · ${labels[topic]} · Câu ${q.number}`, url: '' }], scope: 'general' });
  }
}
if (questions.length !== 90 || new Set(questions.map(q => q.id)).size !== 90) throw Error('Expected 90 unique questions');
const bank = { sourceFile: input.source, sourceSha256: input.sha256, importedOn: '2026-11-19', sourceDifficulty: 'Dễ: câu 1–10; Trung bình: câu 11–20; Khó: câu 21–30 trong mỗi chủ đề (theo tài liệu)', questionSetId: `lv90-${input.sha256.slice(0, 16)}`, questions };
fs.writeFileSync('src/data/questionBank.json', JSON.stringify(bank, null, 2) + '\n');
const report = { sourceFile: input.source, sourceSha256: input.sha256, total: 90, topics: { history: 30, culture: 30, geography: 30 }, difficulties: { basic: 30, intermediate: 30, advanced: 30 }, missingAnswers: 0, sourceReferences: 'Exact supplied DOCX questions, options and answer key. Reading links are maintained separately.', usage: 'Canonical set reused by all quiz spaces, with source-defined difficulty.' };
fs.writeFileSync('output/qr/question-import-report.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
