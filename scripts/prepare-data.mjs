import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { applyGuide } from './guide-review.mjs';
import { normalizeAssignments } from '../src/academic.js';
const root = path.resolve(import.meta.dirname, '..');
const source = JSON.parse(fs.readFileSync(path.join(root, 'data', 'evaluations-source.json'), 'utf8'));
const cleanAxis = value => value.replace(/ـ/g, '').replace(/[\u064B-\u065F]/g, '').replace(/إ|أ|آ/g, 'ا').trim().replace(/\s+/g, ' ');
const courses = source.filter(record => record.status === 'imported').map(({ result }) => {
  const questionGroups = new Map();
  const questions = result.questions.map(question => ({ ...question, axis: cleanAxis(question.axis) }));
  for (const question of questions) questionGroups.set(question.axis, [...(questionGroups.get(question.axis) || []), question.percentage]);
  return {
    id: crypto.createHash('sha256').update(result.path).digest('hex').slice(0, 16),
    code: result.code, title: result.courseName, semester: result.meta.semester, year: result.meta.year,
    score: result.overall, responses: result.responses, level: result.meta.level,
    assignments: normalizeAssignments(result.meta),
    axes: Object.fromEntries([...questionGroups].map(([axis, values]) => [axis, values.reduce((a, b) => a + b, 0) / values.length])),
    questions, sourcePath: result.path, reviewReasons: result.mappingReview?.needsReview ? [result.mappingReview.status] : [],
    sourcePrograms: result.meta.programs?.length ? result.meta.programs : [result.meta.program],
  };
});
fs.writeFileSync(path.join(root, 'src', 'courses.json'), JSON.stringify(courses.map(applyGuide)));
console.log(`Prepared ${courses.length} unique evaluations with canonical academic memberships.`);
