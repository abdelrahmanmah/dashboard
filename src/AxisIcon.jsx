import React from 'react';

const icons = {
  'المحاضر': 'M3 4h18v12H3z M8 20h8 M12 16v4 M8 9l3 3 5-5',
  'عضو الهيئة المعاونة': 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M2 20v-2a6 6 0 0 1 12 0v2 M17 11a3 3 0 1 0 0-6 M17 14a5 5 0 0 1 5 5v1',
  'مخرجات التعلم المستهدفة': 'M12 2a10 10 0 1 0 10 10 M12 6a6 6 0 1 0 6 6 M12 10a2 2 0 1 0 2 2 M12 12l9-9 M17 3h4v4',
  'نظام التقويم': 'M7 3h10v3H7z M5 5H4v16h16V5h-1 M8 11h8 M8 15h5 M15 17l2 2 4-4',
  'المعامل / الورش': 'M9 2h6 M10 2v7l-6 10a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L14 9V2 M7 16h10 M10 19h.01 M14 18h.01',
  'المدرجات وقاعات التدريس': 'M3 20V5l9-3 9 3v15 M3 20h18 M7 9h3v3H7z M14 9h3v3h-3z M7 15h3v3H7z M14 15h3v3h-3z',
  'اراء عامة حول المقرر الدراسي': 'M4 4h16v12H9l-5 4V4z M8 9h8 M8 12h5',
  'المحاضرات': 'M12 5C9 3 5 3 2 4v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-3-1-7-1-10 1v15 M6 8h3 M15 8h3',
};

export default function AxisIcon({ axis, size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={icons[axis] || icons['المحاضرات']}/></svg>;
}
