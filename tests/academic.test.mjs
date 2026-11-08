import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { departments, degrees, specializations, resolveAcademicName } from '../src/academic.js';
import { selectCourses, summary, academicGroups } from '../src/metrics.js';
const courses = JSON.parse(fs.readFileSync(new URL('../src/courses.json', import.meta.url), 'utf8'));
const original = JSON.parse(fs.readFileSync(new URL('../data/evaluations-source.json', import.meta.url), 'utf8')).filter(item => item.status === 'imported');

test('uses five official departments with seven degree entries and nine named specializations', () => {
  assert.equal(departments.length, 5);
  assert.equal(degrees.length, 7);
  assert.equal(specializations.filter(item => item.degree === 'ba').length, 5);
  assert.equal(specializations.filter(item => item.degree === 'bt').length, 4);
  assert.equal(resolveAcademicName('Digital Economics').department, 'eco');
  assert.equal(resolveAcademicName('Digital Political Science').department, 'pol');
  assert.deepEqual(resolveAcademicName('Mis'), resolveAcademicName('Management Information Systems'));
  assert.deepEqual(resolveAcademicName('Marketing Intellgence'), resolveAcademicName('Marketing Intelligence'));
  assert.equal(resolveAcademicName('Fintech').specialization, 'dbf');
  assert.equal(resolveAcademicName('Business Administration').specialization, null);
  assert.equal(resolveAcademicName('Business'), null);
});

test('preserves every evaluation and its official numeric result', () => {
  assert.equal(courses.length, original.length);
  assert.equal(new Set(courses.map(item => item.id)).size, courses.length);
  for (const course of courses) {
    const source = original.find(item => item.path === course.sourcePath).result;
    assert.equal(course.score, source.overall);
    assert.equal(course.responses, source.responses);
    assert.equal(course.questions.length, source.questions.length);
    for (const assignment of course.assignments) {
      assert.ok(departments.some(item => item.id === assignment.department));
      assert.ok(degrees.some(item => item.id === assignment.degree && item.department === assignment.department));
      if (assignment.specialization) assert.ok(specializations.some(item => item.id === assignment.specialization && item.degree === assignment.degree));
    }
  }
});

test('filters a correlated membership and counts shared courses once', () => {
  const course = courses.find(item => item.code === 'STA302' && item.semester === 'fall');
  assert.ok(selectCourses([course], { department: 'ba', specialization: 'finance' }).length);
  assert.equal(selectCourses([course], { department: 'acc', specialization: 'finance' }).length, 0);
  assert.equal(selectCourses([course], { department: 'ba' }).length, 1);
  const groups = academicGroups(courses, 'department', departments);
  assert.equal(groups.length, 5);
  for (const group of groups) assert.equal(new Set(group.courses.map(item => item.id)).size, group.courses.length);
  assert.equal(summary([]), null);
});

 test('guide evidence preserves survey codes and flags conflicting identities',()=>{
 const mkt=courses.find(c=>c.code==='MKT403'); assert.deepEqual(mkt.assignments.map(a=>a.specialization),['marketing','mi']);
 const ist=courses.find(c=>c.code==='IST306'); assert.deepEqual(ist.assignments.map(a=>a.degree),['de','dp']); assert.equal(ist.semester,'spring'); assert.ok(ist.reviewReasons.length);
 const sta=courses.find(c=>c.code==='STA309'); assert.equal(sta.guideReview.status,'الاسم مطابق بكود مختلف'); assert.ok(sta.guideReview.evidence.some(r=>r.code==='STA305'));
 const clash=courses.find(c=>c.code==='MGT309'&&c.title==='Supply Chain Management'); assert.equal(clash.guideReview.status,'اختلاف مسمى عند نفس الكود'); assert.ok(clash.reviewReasons.length);
 for(const c of courses)assert.ok(c.guideReview && c.guideReview.evidence.every(e=>e.page>=1&&e.page<=48));
});
