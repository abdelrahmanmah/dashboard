// Canonical structure supplied by the college. Stable IDs never depend on source folder names.
export const departments = [
  { id: 'ba', name: 'إدارة الأعمال', short: 'إدارة الأعمال' },
  { id: 'acc', name: 'المحاسبة', short: 'المحاسبة' },
  { id: 'eco', name: 'الاقتصاد', short: 'الاقتصاد' },
  { id: 'pol', name: 'العلوم السياسية', short: 'العلوم السياسية' },
  { id: 'bt', name: 'تكنولوجيا الأعمال', short: 'تكنولوجيا الأعمال' },
];
export const degrees = [
  { id: 'ba', department: 'ba', name: 'بكالوريوس العلوم في إدارة الأعمال', short: 'إدارة الأعمال' },
  { id: 'acc', department: 'acc', name: 'بكالوريوس العلوم في المحاسبة', short: 'المحاسبة' },
  { id: 'eco', department: 'eco', name: 'بكالوريوس العلوم في الاقتصاد', short: 'الاقتصاد' },
  { id: 'pol', department: 'pol', name: 'بكالوريوس العلوم في العلوم السياسية', short: 'العلوم السياسية' },
  { id: 'dp', department: 'pol', name: 'بكالوريوس العلوم السياسية الرقمية', short: 'العلوم السياسية الرقمية' },
  { id: 'de', department: 'eco', name: 'بكالوريوس الاقتصاد الرقمي', short: 'الاقتصاد الرقمي' },
  { id: 'bt', department: 'bt', name: 'بكالوريوس العلوم في تكنولوجيا الأعمال', short: 'تكنولوجيا الأعمال' },
];
export const specializations = [
  { id: 'supply', degree: 'ba', name: 'إدارة سلاسل التوريد' },
  { id: 'marketing', degree: 'ba', name: 'التسويق' },
  { id: 'hr', degree: 'ba', name: 'إدارة الموارد البشرية' },
  { id: 'management', degree: 'ba', name: 'الإدارة' },
  { id: 'finance', degree: 'ba', name: 'التمويل والاستثمار' },
  { id: 'analytics', degree: 'bt', name: 'علم تحليل الأعمال' },
  { id: 'mis', degree: 'bt', name: 'نظم المعلومات الإدارية' },
  { id: 'mi', degree: 'bt', name: 'الذكاء التسويقي' },
  { id: 'dbf', degree: 'bt', name: 'الخدمات المصرفية الرقمية والتكنولوجيا المالية' },
];
const aliases = {
  'accounting': ['acc'], 'المحاسبة': ['acc'],
  'business administration': ['ba'], 'إدارة الأعمال': ['ba'],
  'finance and investment': ['ba', 'finance'], 'finance': ['ba', 'finance'], 'التمويل والاستثمار': ['ba', 'finance'],
  'supply chain management': ['ba', 'supply'], 'إدارة سلاسل التوريد': ['ba', 'supply'],
  'marketing': ['ba', 'marketing'], 'التسويق': ['ba', 'marketing'],
  'human resources management': ['ba', 'hr'], 'إدارة الموارد البشرية': ['ba', 'hr'],
  'management': ['ba', 'management'], 'الإدارة': ['ba', 'management'],
  'economics': ['eco'], 'الاقتصاد': ['eco'], 'digital economics': ['de'], 'الاقتصاد الرقمي': ['de'],
  'political science': ['pol'], 'العلوم السياسية': ['pol'], 'digital political science': ['dp'], 'العلوم السياسية الرقمية': ['dp'],
  'business analytics': ['bt', 'analytics'], 'علم تحليل الأعمال': ['bt', 'analytics'],
  'mis': ['bt', 'mis'], 'management information systems': ['bt', 'mis'], 'نظم المعلومات الإدارية': ['bt', 'mis'],
  'marketing intellgence': ['bt', 'mi'], 'marketing intelligence': ['bt', 'mi'], 'الذكاء التسويقي': ['bt', 'mi'],
  'fintech': ['bt', 'dbf'], 'digital banking and fintech': ['bt', 'dbf'], 'الخدمات المصرفية الرقمية والتكنولوجيا المالية': ['bt', 'dbf'],
  'business technology': ['bt'], 'تكنولوجيا الأعمال': ['bt'],
};
export function resolveAcademicName(value) {
  const ids = aliases[String(value || '').trim().toLowerCase()];
  if (!ids) return null;
  const degree = degrees.find(item => item.id === ids[0]);
  return { department: degree.department, degree: degree.id, specialization: ids[1] || null };
}
export function academicLabel(id, kind) {
  const items = kind === 'department' ? departments : kind === 'degree' ? degrees : specializations;
  return items.find(item => item.id === id)?.name || (kind === 'specialization' ? 'لم يُحدد تخصص فرعي' : 'غير محدد');
}
export function normalizeAssignments(meta) {
  const sourceNames = meta.programs?.length ? meta.programs : [meta.program];
  const matches = sourceNames.map(resolveAcademicName).filter(Boolean);
  if (!matches.length && meta.department === 'Business Technology') matches.push(resolveAcademicName('Business Technology'));
  return [...new Map(matches.map(item => [JSON.stringify(item), item])).values()];
}
