export const average = values => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
export const percent = value => value == null ? '—' : `${value.toFixed(1)}%`;
export const termName = value => ({ fall: 'الخريف', spring: 'الربيع' }[value] || 'العام كاملًا');
export function matches(course, filters) {
  if (filters.semester && course.semester !== filters.semester) return false;
  const keys = ['department', 'degree', 'specialization'].filter(key => filters[key]);
  const inFamily = item => !filters.family || (filters.family === 'business-tech' ? item.department === 'bt' : item.department !== 'bt');
  return (!keys.length && !filters.family) || course.assignments.some(item => inFamily(item) && keys.every(key => item[key] === filters[key]));
}
export function selectCourses(courses, filters) { return courses.filter(course => matches(course, filters)); }
export function summary(courses, axis = '') {
  return average(courses.map(course => axis ? course.axes[axis] : course.score).filter(Number.isFinite));
}
export function academicGroups(courses, key, definitions, filters = {}) {
  return definitions.map(item => {
    const group = selectCourses(courses, { ...filters, [key]: item.id });
    return { ...item, courses: group, value: summary(group) };
  });
}

export const scoreBands = [{min:0,max:70,label:'0–70',color:'#ebca65'},{min:70,max:80,label:'70–80',color:'#a58ce7'},{min:80,max:90,label:'80–90',color:'#62a9ef'},{min:90,max:101,label:'90–100',color:'#45bfaa'}];
export function scoreDistribution(items){return scoreBands.map(b=>({...b,count:items.filter(c=>Number.isFinite(c.score)&&c.score>=b.min&&c.score<b.max).length}));}
export function heatColor(value,min,max){if(value==null)return '#eef2f7';const t=max===min?.5:Math.max(0,Math.min(1,(value-min)/(max-min)));const a=[235,244,255],b=[34,134,161];return 'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')+')';}
