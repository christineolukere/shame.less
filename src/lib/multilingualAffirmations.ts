import affirmationsData from './affirmations_multilang.json';

export interface MultilingualAffirmation {
  text: string;
  category: string;
  color: string;
}

export interface AffirmationLanguageData {
  [language: string]: string[];
}

// Get affirmations for a specific language
export function getAffirmationsForLanguage(language: string): string[] {
  const languageCode = getLanguageCode(language);
  return (affirmationsData as AffirmationLanguageData)[languageCode] || (affirmationsData as AffirmationLanguageData)['en'];
}

// Map language name to language code
function getLanguageCode(language: string): string {
  const languageMap: Record<string, string> = {
    'English': 'en',
    'Spanish': 'es',
    'Español': 'es',
    'French': 'fr',
    'Français': 'fr',
    'Swahili': 'sw',
    'Kiswahili': 'sw'
  };
  
  return languageMap[language] || 'en';
}

// Create multilingual affirmations with consistent categories and colors
export function createMultilingualAffirmations(
  language: string, 
  baseCategories: string[],
  baseColors: string[],
  t?: (key: string) => string
): MultilingualAffirmation[] {
  const texts = getAffirmationsForLanguage(language);
  
  return texts.map((text, index) => ({
    text,
    category: t ? t(`affirmationCategory${index % baseCategories.length}`) : baseCategories[index % baseCategories.length],
    color: baseColors[index % baseColors.length]
  }));
}

// Get language-specific affirmation categories
export function getLocalizedCategories(language: string): string[] {
  const categories = {
    'en': ['Self-Love', 'Emotional Validation', 'Inner Voice', 'Healing', 'Boundaries', 'Self-Care', 'Self-Acceptance'],
    'es': ['Amor Propio', 'Validación Emocional', 'Voz Interior', 'Sanación', 'Límites', 'Autocuidado', 'Autoaceptación'],
    'fr': ['Amour de Soi', 'Validation Émotionnelle', 'Voix Intérieure', 'Guérison', 'Limites', 'Soins Personnels', 'Acceptation de Soi'],
    'sw': ['Kujipenda', 'Kutambua Hisia', 'Sauti ya Ndani', 'Uponyaji', 'Mipaka', 'Kujitunza', 'Kujikubali']
  };
  
  const languageCode = getLanguageCode(language);
  return categories[languageCode as keyof typeof categories] || categories['en'];
}