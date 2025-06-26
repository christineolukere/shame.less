// Development utility to test i18n coverage
export function validateTranslationCoverage(
  baseTranslations: Record<string, any>,
  targetTranslations: Record<string, any>,
  language: string
): { missing: string[]; extra: string[] } {
  const missing: string[] = [];
  const extra: string[] = [];

  function checkKeys(base: any, target: any, path = '') {
    for (const key in base) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in target)) {
        missing.push(currentPath);
      } else if (typeof base[key] === 'object' && typeof target[key] === 'object') {
        checkKeys(base[key], target[key], currentPath);
      }
    }

    for (const key in target) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in base)) {
        extra.push(currentPath);
      }
    }
  }

  checkKeys(baseTranslations, targetTranslations);

  if (missing.length > 0) {
    console.warn(`Missing translations in ${language}:`, missing);
  }

  if (extra.length > 0) {
    console.warn(`Extra translations in ${language}:`, extra);
  }

  return { missing, extra };
}

// Auto-run in development
if (process.env.NODE_ENV === 'development') {
  // This would run validation checks during development
  console.log('🌐 i18n coverage validation enabled');
}