// Comprehensive translation system for shame.less app
export interface Translations {
  // Common
  skipForNow: string
  next: string
  back: string
  complete: string
  loading: string
  cancel: string
  friend: string
  
  // App branding
  appName: string
  tagline: string
  
  // Authentication
  signIn: string
  signUp: string
  signOut: string
  email: string
  password: string
  name: string
  welcomeBack: string
  joinUs: string
  continueAsGuest: string
  createAccount: string
  dontHaveAccount: string
  alreadyHaveAccount: string
  privacyNote: string
  
  // Onboarding
  onboardingTitle: string
  onboardingSubtitle: string
  languageQuestion: string
  languageSubtitle: string
  healingVisionQuestion: string
  healingVisionSubtitle: string
  healingVisionPlaceholder: string
  affirmationStyleQuestion: string
  affirmationStyleSubtitle: string
  culturalBackgroundQuestion: string
  culturalBackgroundSubtitle: string
  spiritualPreferenceQuestion: string
  spiritualPreferenceSubtitle: string
  
  // Affirmation styles
  spiritualityFaith: string
  culturalWisdom: string
  sciencePsychology: string
  blendOfAll: string
  
  // Spiritual preferences
  christianity: string
  islam: string
  judaism: string
  buddhism: string
  hinduism: string
  indigenousTraditional: string
  natureBased: string
  secularNonReligious: string
  stillExploring: string
  preferNotToSay: string
  
  // Cultural backgrounds
  blackAmerican: string
  afroCaribbean: string
  african: string
  latinaHispanic: string
  indigenous: string
  asian: string
  middleEastern: string
  mixedMultiracial: string
  lgbtqia: string
  firstGeneration: string
  other: string
  
  // Dashboard
  goodMorning: string
  goodAfternoon: string
  goodEvening: string
  beautiful: string
  worthyOfLove: string
  welcomeBackToSafeSpace: string
  todaysReminder: string
  howCanISupport: string
  yourGrowthRings: string
  daysOfSelfCare: string
  
  // Navigation
  home: string
  checkIn: string
  wins: string
  journal: string
  affirm: string
  garden: string
  
  // Check-in
  howAreYouFeeling: string
  gentleCheckIn: string
  checkInDescription: string
  whatEmotionClosest: string
  whatColorEnergy: string
  forYouRightNow: string
  checkInAffirmation: string
  
  // Emotions
  peaceful: string
  content: string
  tender: string
  heavy: string
  frustrated: string
  growing: string
  hopeful: string
  tired: string
  
  // Colors
  softPink: string
  warmSage: string
  gentleLavender: string
  sunsetOrange: string
  goldenCream: string
  oceanBlue: string
  
  // Wins
  yourWins: string
  everyStepCounts: string
  winsDescription: string
  quickWinsTocelebrate: string
  addYourWin: string
  whatDidYouAccomplish: string
  celebrateThisWin: string
  recentCelebrations: string
  
  // Win categories
  selfCare: string
  boundaries: string
  growth: string
  joy: string
  
  // Quick wins
  gotOutOfBed: string
  drankWater: string
  tookShower: string
  ateAMeal: string
  setBoundary: string
  askedForHelp: string
  practicedSayingNo: string
  tookBreak: string
  movedBody: string
  calledSomeone: string
  
  // Journal
  journalTitle: string
  safeSpaceThoughts: string
  journalDescription: string
  howToExpress: string
  needGentleNudge: string
  letThoughtsFlow: string
  saveEntry: string
  write: string
  speak: string
  capture: string
  
  // Journal prompts
  gratefulFor: string
  showedKindness: string
  boundaryHonored: string
  madeSmile: string
  needToRelease: string
  howGrowing: string
  tellYoungerSelf: string
  bringsYouPeace: string
  
  // Affirmations
  dailyAffirmations: string
  wordsOfLove: string
  affirmationsDescription: string
  gentleReflection: string
  reflectionPrompt: string
  nextAffirmation: string
  
  // Resources
  resourceGarden: string
  curatedWithLove: string
  resourcesDescription: string
  stories: string
  healing: string
  community: string
  media: string
  suggestResource: string
  suggestDescription: string
  shareResource: string
  
  // Soft Landing
  softLanding: string
  youAreSafeHere: string
  softLandingDescription: string
  gentleBreathing: string
  grounding: string
  emergencyAffirmation: string
  soothingSounds: string
  breathingDescription: string
  groundingDescription: string
  affirmationDescription: string
  soundsDescription: string
  needMoreSupport: string
  crisisDescription: string
  crisisTextLine: string
  suicidePrevention: string
  emergency: string
  imFeelingBetter: string
  
  // Footer
  importantNotice: string
  notReplacementTherapy: string
  
  // Disclaimer
  aboutShameless: string
  disclaimerDescription: string
  crisisSupport: string
  textHome: string
  callText988: string
  call911: string
  disclaimerAffirmation: string
  notNow: string
  iUnderstand: string
}

// English translations
const englishTranslations: Translations = {
  // Common
  skipForNow: "Skip for now",
  next: "Next",
  back: "Back",
  complete: "Complete",
  loading: "Loading...",
  cancel: "Cancel",
  friend: "friend",
  
  // App branding
  appName: "shame.less",
  tagline: "Your gentle daily companion",
  
  // Authentication
  signIn: "Sign In",
  signUp: "Sign Up",
  signOut: "Sign Out",
  email: "Email",
  password: "Password",
  name: "Name",
  welcomeBack: "Welcome back",
  joinUs: "Join us",
  continueAsGuest: "Continue as guest",
  createAccount: "Create account",
  dontHaveAccount: "Don't have an account?",
  alreadyHaveAccount: "Already have an account?",
  privacyNote: "Your data is private and secure. We never share your personal information.",
  
  // Onboarding
  onboardingTitle: "Let's personalize your healing journey",
  onboardingSubtitle: "Help us create a space that feels right for you",
  languageQuestion: "What language do you feel the most loved in?",
  languageSubtitle: "Choose the language that feels most comfortable for you",
  healingVisionQuestion: "What does healing look like for you?",
  healingVisionSubtitle: "Share your vision in your own words",
  healingVisionPlaceholder: "Describe what healing means to you...",
  affirmationStyleQuestion: "What style of affirmations resonates with you?",
  affirmationStyleSubtitle: "Choose what feels most authentic",
  culturalBackgroundQuestion: "Which communities do you identify with?",
  culturalBackgroundSubtitle: "Select all that apply - this helps us personalize your experience",
  spiritualPreferenceQuestion: "What spiritual or philosophical approach feels right?",
  spiritualPreferenceSubtitle: "This helps us tailor affirmations and content",
  
  // Affirmation styles
  spiritualityFaith: "Spirituality & Faith",
  culturalWisdom: "Cultural Wisdom",
  sciencePsychology: "Science & Psychology",
  blendOfAll: "A blend of all",
  
  // Spiritual preferences
  christianity: "Christianity",
  islam: "Islam",
  judaism: "Judaism",
  buddhism: "Buddhism",
  hinduism: "Hinduism",
  indigenousTraditional: "Indigenous/Traditional",
  natureBased: "Nature-based",
  secularNonReligious: "Secular/Non-religious",
  stillExploring: "Still exploring",
  preferNotToSay: "Prefer not to say",
  
  // Cultural backgrounds
  blackAmerican: "Black American",
  afroCaribbean: "Afro-Caribbean",
  african: "African",
  latinaHispanic: "Latina/Hispanic",
  indigenous: "Indigenous",
  asian: "Asian",
  middleEastern: "Middle Eastern",
  mixedMultiracial: "Mixed/Multiracial",
  lgbtqia: "LGBTQIA+",
  firstGeneration: "First Generation",
  other: "Other",
  
  // Dashboard
  goodMorning: "Good morning",
  goodAfternoon: "Good afternoon",
  goodEvening: "Good evening",
  beautiful: "beautiful",
  worthyOfLove: "You are worthy of love and gentleness.",
  welcomeBackToSafeSpace: "Welcome back to your safe space.",
  todaysReminder: "Today's gentle reminder",
  howCanISupport: "How can I support you today?",
  yourGrowthRings: "Your growth rings",
  daysOfSelfCare: "days of self-care",
  
  // Navigation
  home: "Home",
  checkIn: "Check In",
  wins: "Wins",
  journal: "Journal",
  affirm: "Affirm",
  garden: "Garden",
  
  // Check-in
  howAreYouFeeling: "How are you feeling?",
  gentleCheckIn: "Gentle check-in",
  checkInDescription: "There's no right or wrong way to feel. This is simply a moment to pause and acknowledge where you are.",
  whatEmotionClosest: "What emotion feels closest right now?",
  whatColorEnergy: "What color matches your energy?",
  forYouRightNow: "For you, right now",
  checkInAffirmation: "Your feelings are valid and you deserve compassion, especially from yourself.",
  
  // Emotions
  peaceful: "Peaceful",
  content: "Content",
  tender: "Tender",
  heavy: "Heavy",
  frustrated: "Frustrated",
  growing: "Growing",
  hopeful: "Hopeful",
  tired: "Tired",
  
  // Colors
  softPink: "Soft Pink",
  warmSage: "Warm Sage",
  gentleLavender: "Gentle Lavender",
  sunsetOrange: "Sunset Orange",
  goldenCream: "Golden Cream",
  oceanBlue: "Ocean Blue",
  
  // Wins
  yourWins: "Your wins",
  everyStepCounts: "Every step counts",
  winsDescription: "Celebrating progress, no matter how small. Each win is a testament to your strength and resilience.",
  quickWinsTocelebrate: "Quick wins to celebrate",
  addYourWin: "Add your win",
  whatDidYouAccomplish: "What did you accomplish today?",
  celebrateThisWin: "Celebrate this win",
  recentCelebrations: "Recent celebrations",
  
  // Win categories
  selfCare: "Self-Care",
  boundaries: "Boundaries",
  growth: "Growth",
  joy: "Joy",
  
  // Quick wins
  gotOutOfBed: "Got out of bed",
  drankWater: "Drank water",
  tookShower: "Took a shower",
  ateAMeal: "Ate a meal",
  setBoundary: "Set a boundary",
  askedForHelp: "Asked for help",
  practicedSayingNo: "Practiced saying no",
  tookBreak: "Took a break",
  movedBody: "Moved my body",
  calledSomeone: "Called someone",
  
  // Journal
  journalTitle: "Journal",
  safeSpaceThoughts: "A safe space for your thoughts",
  journalDescription: "Let your thoughts flow freely. This is your private space to process, reflect, and release.",
  howToExpress: "How would you like to express yourself?",
  needGentleNudge: "Need a gentle nudge?",
  letThoughtsFlow: "Let your thoughts flow...",
  saveEntry: "Save entry",
  write: "Write",
  speak: "Speak",
  capture: "Capture",
  
  // Journal prompts
  gratefulFor: "What am I grateful for today?",
  showedKindness: "How did I show myself kindness?",
  boundaryHonored: "What boundary did I honor?",
  madeSmile: "What made me smile?",
  needToRelease: "What do I need to release?",
  howGrowing: "How am I growing?",
  tellYoungerSelf: "What would I tell my younger self?",
  bringsYouPeace: "What brings you peace?",
  
  // Affirmations
  dailyAffirmations: "Daily affirmations",
  wordsOfLove: "Words of love",
  affirmationsDescription: "Gentle reminders of your worth, strength, and beauty. Let these words wrap around you like a warm embrace.",
  gentleReflection: "Gentle reflection",
  reflectionPrompt: "How does this affirmation land with you today? What feelings or thoughts come up?",
  nextAffirmation: "Next affirmation",
  
  // Resources
  resourceGarden: "Resource garden",
  curatedWithLove: "Curated with love",
  resourcesDescription: "A collection of healing resources, stories, and tools created by and for women of color on their wellness journeys.",
  stories: "Stories",
  healing: "Healing",
  community: "Community",
  media: "Media",
  suggestResource: "Suggest a resource",
  suggestDescription: "Know of a resource that would help others? We'd love to hear about it.",
  shareResource: "Share resource",
  
  // Soft Landing
  softLanding: "Soft landing",
  youAreSafeHere: "You are safe here",
  softLandingDescription: "Take a moment to ground yourself. Choose what feels most supportive right now.",
  gentleBreathing: "Gentle breathing",
  grounding: "Grounding",
  emergencyAffirmation: "Emergency affirmation",
  soothingSounds: "Soothing sounds",
  breathingDescription: "Slow, mindful breathing",
  groundingDescription: "Connect with the present moment",
  affirmationDescription: "Words of comfort and safety",
  soundsDescription: "Calming audio to center yourself",
  needMoreSupport: "Need more support?",
  crisisDescription: "If you're in crisis, please reach out for professional help.",
  crisisTextLine: "Crisis Text Line: 741741",
  suicidePrevention: "Suicide Prevention: 988",
  emergency: "Emergency",
  imFeelingBetter: "I'm feeling better",
  
  // Footer
  importantNotice: "Important notice",
  notReplacementTherapy: "This app is not a replacement for professional therapy.",
  
  // Disclaimer
  aboutShameless: "About shame.less",
  disclaimerDescription: "This app provides emotional support and wellness tools.",
  crisisSupport: "Crisis support",
  textHome: "Text HOME to 741741",
  callText988: "Call or text 988",
  call911: "Call 911",
  disclaimerAffirmation: "You deserve support, care, and healing. You are not alone in this journey.",
  notNow: "Not now",
  iUnderstand: "I understand",
}

// Spanish translations
const spanishTranslations: Translations = {
  // Common
  skipForNow: "Omitir por ahora",
  next: "Siguiente",
  back: "Atrás",
  complete: "Completar",
  loading: "Cargando...",
  cancel: "Cancelar",
  friend: "amiga",
  
  // App branding
  appName: "sin.vergüenza",
  tagline: "Tu compañera diaria gentil",
  
  // Authentication
  signIn: "Iniciar Sesión",
  signUp: "Registrarse",
  signOut: "Cerrar Sesión",
  email: "Correo",
  password: "Contraseña",
  name: "Nombre",
  welcomeBack: "Bienvenida de vuelta",
  joinUs: "Únete a nosotras",
  continueAsGuest: "Continuar como invitada",
  createAccount: "Crear cuenta",
  dontHaveAccount: "¿No tienes una cuenta?",
  alreadyHaveAccount: "¿Ya tienes una cuenta?",
  privacyNote: "Tus datos son privados y seguros. Nunca compartimos tu información personal.",
  
  // Onboarding
  onboardingTitle: "Personalicemos tu viaje de sanación",
  onboardingSubtitle: "Ayúdanos a crear un espacio que se sienta adecuado para ti",
  languageQuestion: "¿En qué idioma te sientes más amada?",
  languageSubtitle: "Elige el idioma que te resulte más cómodo",
  healingVisionQuestion: "¿Cómo se ve la sanación para ti?",
  healingVisionSubtitle: "Comparte tu visión con tus propias palabras",
  healingVisionPlaceholder: "Describe lo que significa la sanación para ti...",
  affirmationStyleQuestion: "¿Qué estilo de afirmaciones resuena contigo?",
  affirmationStyleSubtitle: "Elige lo que se sienta más auténtico",
  culturalBackgroundQuestion: "¿Con qué comunidades te identificas?",
  culturalBackgroundSubtitle: "Selecciona todas las que apliquen - esto nos ayuda a personalizar tu experiencia",
  spiritualPreferenceQuestion: "¿Qué enfoque espiritual o filosófico se siente correcto?",
  spiritualPreferenceSubtitle: "Esto nos ayuda a adaptar las afirmaciones y el contenido",
  
  // Affirmation styles
  spiritualityFaith: "Espiritualidad y Fe",
  culturalWisdom: "Sabiduría Cultural",
  sciencePsychology: "Ciencia y Psicología",
  blendOfAll: "Una mezcla de todo",
  
  // Spiritual preferences
  christianity: "Cristianismo",
  islam: "Islam",
  judaism: "Judaísmo",
  buddhism: "Budismo",
  hinduism: "Hinduismo",
  indigenousTraditional: "Indígena/Tradicional",
  natureBased: "Basado en la naturaleza",
  secularNonReligious: "Secular/No religioso",
  stillExploring: "Aún explorando",
  preferNotToSay: "Prefiero no decir",
  
  // Cultural backgrounds
  blackAmerican: "Afroamericana",
  afroCaribbean: "Afrocaribeña",
  african: "Africana",
  latinaHispanic: "Latina/Hispana",
  indigenous: "Indígena",
  asian: "Asiática",
  middleEastern: "Medio Oriente",
  mixedMultiracial: "Mixta/Multirracial",
  lgbtqia: "LGBTQIA+",
  firstGeneration: "Primera Generación",
  other: "Otra",
  
  // Dashboard
  goodMorning: "Buenos días",
  goodAfternoon: "Buenas tardes",
  goodEvening: "Buenas noches",
  beautiful: "hermosa",
  worthyOfLove: "Eres digna de amor y gentileza.",
  welcomeBackToSafeSpace: "Bienvenida de vuelta a tu espacio seguro.",
  todaysReminder: "Recordatorio gentil de hoy",
  howCanISupport: "¿Cómo puedo apoyarte hoy?",
  yourGrowthRings: "Tus anillos de crecimiento",
  daysOfSelfCare: "días de autocuidado",
  
  // Navigation
  home: "Inicio",
  checkIn: "Registro",
  wins: "Logros",
  journal: "Diario",
  affirm: "Afirmar",
  garden: "Jardín",
  
  // Check-in
  howAreYouFeeling: "¿Cómo te sientes?",
  gentleCheckIn: "Registro gentil",
  checkInDescription: "No hay una forma correcta o incorrecta de sentirse. Este es simplemente un momento para pausar y reconocer dónde estás.",
  whatEmotionClosest: "¿Qué emoción se siente más cercana ahora?",
  whatColorEnergy: "¿Qué color coincide con tu energía?",
  forYouRightNow: "Para ti, ahora mismo",
  checkInAffirmation: "Tus sentimientos son válidos y mereces compasión, especialmente de ti misma.",
  
  // Emotions
  peaceful: "Tranquila",
  content: "Contenta",
  tender: "Tierna",
  heavy: "Pesada",
  frustrated: "Frustrada",
  growing: "Creciendo",
  hopeful: "Esperanzada",
  tired: "Cansada",
  
  // Colors
  softPink: "Rosa Suave",
  warmSage: "Salvia Cálida",
  gentleLavender: "Lavanda Gentil",
  sunsetOrange: "Naranja Atardecer",
  goldenCream: "Crema Dorada",
  oceanBlue: "Azul Océano",
  
  // Wins
  yourWins: "Tus logros",
  everyStepCounts: "Cada paso cuenta",
  winsDescription: "Celebrando el progreso, sin importar cuán pequeño. Cada logro es un testimonio de tu fuerza y resistencia.",
  quickWinsTocelebrate: "Logros rápidos para celebrar",
  addYourWin: "Agrega tu logro",
  whatDidYouAccomplish: "¿Qué lograste hoy?",
  celebrateThisWin: "Celebra este logro",
  recentCelebrations: "Celebraciones recientes",
  
  // Win categories
  selfCare: "Autocuidado",
  boundaries: "Límites",
  growth: "Crecimiento",
  joy: "Alegría",
  
  // Quick wins
  gotOutOfBed: "Me levanté de la cama",
  drankWater: "Bebí agua",
  tookShower: "Me duché",
  ateAMeal: "Comí una comida",
  setBoundary: "Establecí un límite",
  askedForHelp: "Pedí ayuda",
  practicedSayingNo: "Practiqué decir no",
  tookBreak: "Tomé un descanso",
  movedBody: "Moví mi cuerpo",
  calledSomeone: "Llamé a alguien",
  
  // Journal
  journalTitle: "Diario",
  safeSpaceThoughts: "Un espacio seguro para tus pensamientos",
  journalDescription: "Deja que tus pensamientos fluyan libremente. Este es tu espacio privado para procesar, reflexionar y liberar.",
  howToExpress: "¿Cómo te gustaría expresarte?",
  needGentleNudge: "¿Necesitas un empujoncito gentil?",
  letThoughtsFlow: "Deja que tus pensamientos fluyan...",
  saveEntry: "Guardar entrada",
  write: "Escribir",
  speak: "Hablar",
  capture: "Capturar",
  
  // Journal prompts
  gratefulFor: "¿Por qué estoy agradecida hoy?",
  showedKindness: "¿Cómo me mostré bondad?",
  boundaryHonored: "¿Qué límite honré?",
  madeSmile: "¿Qué me hizo sonreír?",
  needToRelease: "¿Qué necesito liberar?",
  howGrowing: "¿Cómo estoy creciendo?",
  tellYoungerSelf: "¿Qué le diría a mi yo más joven?",
  bringsYouPeace: "¿Qué te trae paz?",
  
  // Affirmations
  dailyAffirmations: "Afirmaciones diarias",
  wordsOfLove: "Palabras de amor",
  affirmationsDescription: "Recordatorios gentiles de tu valor, fuerza y belleza. Deja que estas palabras te envuelvan como un abrazo cálido.",
  gentleReflection: "Reflexión gentil",
  reflectionPrompt: "¿Cómo resuena esta afirmación contigo hoy? ¿Qué sentimientos o pensamientos surgen?",
  nextAffirmation: "Siguiente afirmación",
  
  // Resources
  resourceGarden: "Jardín de recursos",
  curatedWithLove: "Curado con amor",
  resourcesDescription: "Una colección de recursos de sanación, historias y herramientas creadas por y para mujeres de color en sus viajes de bienestar.",
  stories: "Historias",
  healing: "Sanación",
  community: "Comunidad",
  media: "Medios",
  suggestResource: "Sugerir un recurso",
  suggestDescription: "¿Conoces un recurso que ayudaría a otras? Nos encantaría escuchar sobre él.",
  shareResource: "Compartir recurso",
  
  // Soft Landing
  softLanding: "Aterrizaje suave",
  youAreSafeHere: "Estás segura aquí",
  softLandingDescription: "Tómate un momento para tranquilizarte. Elige lo que se sienta más de apoyo ahora mismo.",
  gentleBreathing: "Respiración gentil",
  grounding: "Conexión a tierra",
  emergencyAffirmation: "Afirmación de emergencia",
  soothingSounds: "Sonidos relajantes",
  breathingDescription: "Respiración lenta y consciente",
  groundingDescription: "Conecta con el momento presente",
  affirmationDescription: "Palabras de consuelo y seguridad",
  soundsDescription: "Audio calmante para centrarte",
  needMoreSupport: "¿Necesitas más apoyo?",
  crisisDescription: "Si estás en crisis, por favor busca ayuda profesional.",
  crisisTextLine: "Línea de Crisis por Texto: 741741",
  suicidePrevention: "Prevención del Suicidio: 988",
  emergency: "Emergencia",
  imFeelingBetter: "Me siento mejor",
  
  // Footer
  importantNotice: "Aviso importante",
  notReplacementTherapy: "Esta aplicación no es un reemplazo para la terapia profesional.",
  
  // Disclaimer
  aboutShameless: "Acerca de sin.vergüenza",
  disclaimerDescription: "Esta aplicación proporciona apoyo emocional y herramientas de bienestar.",
  crisisSupport: "Apoyo en crisis",
  textHome: "Envía HOME al 741741",
  callText988: "Llama o envía texto al 988",
  call911: "Llama al 911",
  disclaimerAffirmation: "Mereces apoyo, cuidado y sanación. No estás sola en este viaje.",
  notNow: "Ahora no",
  iUnderstand: "Entiendo",
}

// French translations
const frenchTranslations: Translations = {
  // Common
  skipForNow: "Passer pour l'instant",
  next: "Suivant",
  back: "Retour",
  complete: "Terminer",
  loading: "Chargement...",
  cancel: "Annuler",
  friend: "amie",
  
  // App branding
  appName: "sans.honte",
  tagline: "Votre compagne quotidienne bienveillante",
  
  // Authentication
  signIn: "Se Connecter",
  signUp: "S'Inscrire",
  signOut: "Se Déconnecter",
  email: "Email",
  password: "Mot de passe",
  name: "Nom",
  welcomeBack: "Bon retour",
  joinUs: "Rejoignez-nous",
  continueAsGuest: "Continuer en tant qu'invitée",
  createAccount: "Créer un compte",
  dontHaveAccount: "Vous n'avez pas de compte ?",
  alreadyHaveAccount: "Vous avez déjà un compte ?",
  privacyNote: "Vos données sont privées et sécurisées. Nous ne partageons jamais vos informations personnelles.",
  
  // Onboarding
  onboardingTitle: "Personnalisons votre parcours de guérison",
  onboardingSubtitle: "Aidez-nous à créer un espace qui vous convient",
  languageQuestion: "Dans quelle langue vous sentez-vous le plus aimée ?",
  languageSubtitle: "Choisissez la langue qui vous semble la plus confortable",
  healingVisionQuestion: "À quoi ressemble la guérison pour vous ?",
  healingVisionSubtitle: "Partagez votre vision avec vos propres mots",
  healingVisionPlaceholder: "Décrivez ce que la guérison signifie pour vous...",
  affirmationStyleQuestion: "Quel style d'affirmations résonne avec vous ?",
  affirmationStyleSubtitle: "Choisissez ce qui vous semble le plus authentique",
  culturalBackgroundQuestion: "À quelles communautés vous identifiez-vous ?",
  culturalBackgroundSubtitle: "Sélectionnez tout ce qui s'applique - cela nous aide à personnaliser votre expérience",
  spiritualPreferenceQuestion: "Quelle approche spirituelle ou philosophique vous convient ?",
  spiritualPreferenceSubtitle: "Cela nous aide à adapter les affirmations et le contenu",
  
  // Affirmation styles
  spiritualityFaith: "Spiritualité et Foi",
  culturalWisdom: "Sagesse Culturelle",
  sciencePsychology: "Science et Psychologie",
  blendOfAll: "Un mélange de tout",
  
  // Spiritual preferences
  christianity: "Christianisme",
  islam: "Islam",
  judaism: "Judaïsme",
  buddhism: "Bouddhisme",
  hinduism: "Hindouisme",
  indigenousTraditional: "Indigène/Traditionnel",
  natureBased: "Basé sur la nature",
  secularNonReligious: "Séculier/Non religieux",
  stillExploring: "Encore en exploration",
  preferNotToSay: "Préfère ne pas dire",
  
  // Cultural backgrounds
  blackAmerican: "Afro-américaine",
  afroCaribbean: "Afro-caribéenne",
  african: "Africaine",
  latinaHispanic: "Latina/Hispanique",
  indigenous: "Indigène",
  asian: "Asiatique",
  middleEastern: "Moyen-Orient",
  mixedMultiracial: "Mixte/Multiraciale",
  lgbtqia: "LGBTQIA+",
  firstGeneration: "Première Génération",
  other: "Autre",
  
  // Dashboard
  goodMorning: "Bonjour",
  goodAfternoon: "Bon après-midi",
  goodEvening: "Bonsoir",
  beautiful: "belle",
  worthyOfLove: "Vous méritez l'amour et la bienveillance.",
  welcomeBackToSafeSpace: "Bon retour dans votre espace sûr.",
  todaysReminder: "Rappel bienveillant d'aujourd'hui",
  howCanISupport: "Comment puis-je vous soutenir aujourd'hui ?",
  yourGrowthRings: "Vos anneaux de croissance",
  daysOfSelfCare: "jours de soins personnels",
  
  // Navigation
  home: "Accueil",
  checkIn: "Enregistrement",
  wins: "Victoires",
  journal: "Journal",
  affirm: "Affirmer",
  garden: "Jardin",
  
  // Check-in
  howAreYouFeeling: "Comment vous sentez-vous ?",
  gentleCheckIn: "Enregistrement bienveillant",
  checkInDescription: "Il n'y a pas de bonne ou de mauvaise façon de se sentir. C'est simplement un moment pour faire une pause et reconnaître où vous en êtes.",
  whatEmotionClosest: "Quelle émotion vous semble la plus proche maintenant ?",
  whatColorEnergy: "Quelle couleur correspond à votre énergie ?",
  forYouRightNow: "Pour vous, maintenant",
  checkInAffirmation: "Vos sentiments sont valides et vous méritez la compassion, surtout de votre part.",
  
  // Emotions
  peaceful: "Paisible",
  content: "Contente",
  tender: "Tendre",
  heavy: "Lourde",
  frustrated: "Frustrée",
  growing: "En croissance",
  hopeful: "Pleine d'espoir",
  tired: "Fatiguée",
  
  // Colors
  softPink: "Rose Doux",
  warmSage: "Sauge Chaude",
  gentleLavender: "Lavande Douce",
  sunsetOrange: "Orange Coucher de Soleil",
  goldenCream: "Crème Dorée",
  oceanBlue: "Bleu Océan",
  
  // Wins
  yourWins: "Vos victoires",
  everyStepCounts: "Chaque pas compte",
  winsDescription: "Célébrer les progrès, peu importe leur taille. Chaque victoire témoigne de votre force et de votre résilience.",
  quickWinsTocelebrate: "Victoires rapides à célébrer",
  addYourWin: "Ajoutez votre victoire",
  whatDidYouAccomplish: "Qu'avez-vous accompli aujourd'hui ?",
  celebrateThisWin: "Célébrez cette victoire",
  recentCelebrations: "Célébrations récentes",
  
  // Win categories
  selfCare: "Soins Personnels",
  boundaries: "Limites",
  growth: "Croissance",
  joy: "Joie",
  
  // Quick wins
  gotOutOfBed: "Je me suis levée du lit",
  drankWater: "J'ai bu de l'eau",
  tookShower: "J'ai pris une douche",
  ateAMeal: "J'ai pris un repas",
  setBoundary: "J'ai établi une limite",
  askedForHelp: "J'ai demandé de l'aide",
  practicedSayingNo: "J'ai pratiqué dire non",
  tookBreak: "J'ai pris une pause",
  movedBody: "J'ai bougé mon corps",
  calledSomeone: "J'ai appelé quelqu'un",
  
  // Journal
  journalTitle: "Journal",
  safeSpaceThoughts: "Un espace sûr pour vos pensées",
  journalDescription: "Laissez vos pensées couler librement. C'est votre espace privé pour traiter, réfléchir et libérer.",
  howToExpress: "Comment aimeriez-vous vous exprimer ?",
  needGentleNudge: "Besoin d'un petit coup de pouce ?",
  letThoughtsFlow: "Laissez vos pensées couler...",
  saveEntry: "Sauvegarder l'entrée",
  write: "Écrire",
  speak: "Parler",
  capture: "Capturer",
  
  // Journal prompts
  gratefulFor: "Pour quoi suis-je reconnaissante aujourd'hui ?",
  showedKindness: "Comment me suis-je montrée bienveillante ?",
  boundaryHonored: "Quelle limite ai-je honorée ?",
  madeSmile: "Qu'est-ce qui m'a fait sourire ?",
  needToRelease: "Qu'est-ce que j'ai besoin de libérer ?",
  howGrowing: "Comment est-ce que je grandis ?",
  tellYoungerSelf: "Que dirais-je à mon moi plus jeune ?",
  bringsYouPeace: "Qu'est-ce qui vous apporte la paix ?",
  
  // Affirmations
  dailyAffirmations: "Affirmations quotidiennes",
  wordsOfLove: "Mots d'amour",
  affirmationsDescription: "Rappels bienveillants de votre valeur, force et beauté. Laissez ces mots vous envelopper comme une étreinte chaleureuse.",
  gentleReflection: "Réflexion bienveillante",
  reflectionPrompt: "Comment cette affirmation résonne-t-elle avec vous aujourd'hui ? Quels sentiments ou pensées émergent ?",
  nextAffirmation: "Affirmation suivante",
  
  // Resources
  resourceGarden: "Jardin de ressources",
  curatedWithLove: "Curé avec amour",
  resourcesDescription: "Une collection de ressources de guérison, d'histoires et d'outils créés par et pour les femmes de couleur dans leurs parcours de bien-être.",
  stories: "Histoires",
  healing: "Guérison",
  community: "Communauté",
  media: "Médias",
  suggestResource: "Suggérer une ressource",
  suggestDescription: "Connaissez-vous une ressource qui aiderait les autres ? Nous aimerions en entendre parler.",
  shareResource: "Partager la ressource",
  
  // Soft Landing
  softLanding: "Atterrissage en douceur",
  youAreSafeHere: "Vous êtes en sécurité ici",
  softLandingDescription: "Prenez un moment pour vous ancrer. Choisissez ce qui vous semble le plus soutenant maintenant.",
  gentleBreathing: "Respiration douce",
  grounding: "Ancrage",
  emergencyAffirmation: "Affirmation d'urgence",
  soothingSounds: "Sons apaisants",
  breathingDescription: "Respiration lente et consciente",
  groundingDescription: "Connectez-vous au moment présent",
  affirmationDescription: "Mots de réconfort et de sécurité",
  soundsDescription: "Audio calmant pour vous centrer",
  needMoreSupport: "Besoin de plus de soutien ?",
  crisisDescription: "Si vous êtes en crise, veuillez chercher une aide professionnelle.",
  crisisTextLine: "Ligne de Crise par Texto : 741741",
  suicidePrevention: "Prévention du Suicide : 988",
  emergency: "Urgence",
  imFeelingBetter: "Je me sens mieux",
  
  // Footer
  importantNotice: "Avis important",
  notReplacementTherapy: "Cette application n'est pas un remplacement pour la thérapie professionnelle.",
  
  // Disclaimer
  aboutShameless: "À propos de sans.honte",
  disclaimerDescription: "Cette application fournit un soutien émotionnel et des outils de bien-être.",
  crisisSupport: "Soutien en crise",
  textHome: "Envoyez HOME au 741741",
  callText988: "Appelez ou envoyez un texto au 988",
  call911: "Appelez le 911",
  disclaimerAffirmation: "Vous méritez le soutien, les soins et la guérison. Vous n'êtes pas seule dans ce voyage.",
  notNow: "Pas maintenant",
  iUnderstand: "Je comprends",
}

// Language mapping
export const translations: Record<string, Translations> = {
  'English': englishTranslations,
  'Español': spanishTranslations,
  'Français': frenchTranslations,
}

export const availableLanguages = ['English', 'Español', 'Français']

export function getTranslation(language: string): Translations {
  return translations[language] || translations['English']
}

export function getAvailableLanguages(): string[] {
  return availableLanguages
}