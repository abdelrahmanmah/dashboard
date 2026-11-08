import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const guide=JSON.parse(fs.readFileSync(path.join(root,'data/student-guide-index.json'),'utf8'));
export const codeKey=s=>String(s).toUpperCase().replace(/[^A-Z0-9]/g,'');
const nameKey=s=>String(s).toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]/g,'').replace(/systems/g,'system').replace(/resources/g,'resource').replace(/operations/g,'operation');
export function reviewGuide(code,title){
 const byCode=guide.filter(r=>r.code===codeKey(code)), exact=byCode.filter(r=>nameKey(r.title)===nameKey(title)), byName=guide.filter(r=>nameKey(r.title)===nameKey(title));
 const status=exact.length?'مطابقة الكود والاسم':byCode.length?'اختلاف مسمى عند نفس الكود':byName.length?'الاسم مطابق بكود مختلف':'لم تتأكد المطابقة';
 const evidence=[...new Map([...byCode,...byName].map(r=>[r.page+'|'+r.code+'|'+r.title,r])).values()];
 return {status,evidence, note:status==='مطابقة الكود والاسم'?'تأكيد هوية المقرر؛ لا يثبت فصل طرحه أو مجموعة الطلاب.':status==='لم تتأكد المطابقة'?'لم تثبت مطابقة من الجداول المستخرجة؛ لا يعني أن المقرر غير موجود.':'اختلاف بين الاستبانة والدليل؛ قد يعكس اختلاف لائحة أو إدخالًا يحتاج تأكيدًا.'};
}
export function applyGuide(course){
 const review=reviewGuide(course.code,course.title);
 const reasons=[...course.reviewReasons];
 if(review.status!=='مطابقة الكود والاسم')reasons.push('دليل الطالب: '+review.status);
 if(codeKey(course.code)==='MKT403'&&nameKey(course.title)==='integratedmarketing'){
  course.assignments=[{department:'ba',degree:'ba',specialization:'marketing'},{department:'bt',degree:'bt',specialization:'mi'}];
  reasons.splice(0,reasons.length);
  review.note='المقرر وارد في خطتي التسويق والذكاء التسويقي (PDF 7 و42). الربط يصف عضوية الخطة، ولا يحدد مجموعة المستجيبين.';
 }
 if(codeKey(course.code)==='IST306'&&nameKey(course.title)==='databasesystem2'){
  course.assignments=[{department:'eco',degree:'de',specialization:null},{department:'pol',degree:'dp',specialization:null}];
  reasons.splice(0,reasons.length,'موجود بخطتي الاقتصاد الرقمي والعلوم السياسية الرقمية؛ يلزم تأكيد مجموعة المستجيبين. فصل الاستبانة ربيع، بينما الخطة تعرضه في الفصل الخامس.');
  review.note='تم تصحيح ربط تكنولوجيا الأعمال العام إلى عضوية الخطتين الواردتين في الدليل (PDF 27 و31). فصل التقييم الفعلي محفوظ.';
 }
 if(codeKey(course.code)==='IST205'&&review.status==='مطابقة الكود والاسم'){
  for(let i=reasons.length-1;i>=0;i--)if(reasons[i].includes('الكود مختلف')&&!reasons[i].includes('الفصل مختلف'))reasons.splice(i,1);
  review.note+=' شرطة IST-205 اختلاف تنسيق فقط.';
 }
 return {...course,guideReview:review,reviewReasons:[...new Set(reasons)]};
}
