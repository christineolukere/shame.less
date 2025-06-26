export interface Translations {
  // Common
  skipForNow: string
  next: string
  back: string
  complete: string
  loading: string
  
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
  friend: string
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
  cancel: string
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

export const translations: Record<string, Translations> = {
  English: {
    // Common
    skipForNow: "Skip for now",
    next: "Next",
    back: "Back",
    complete: "Complete",
    loading: "Loading your safe space...",
    
    // App branding
    appName: "shame.less",
    tagline: "Your gentle daily companion",
    
    // Authentication
    signIn: "Sign In",
    signUp: "Sign up",
    signOut: "Sign Out",
    email: "Email",
    password: "Password",
    name: "Name (optional)",
    welcomeBack: "Welcome back",
    joinUs: "Join us",
    continueAsGuest: "Continue as guest",
    createAccount: "Create Account",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    privacyNote: "Your privacy is our priority. We'll never share your information.",
    
    // Onboarding
    onboardingTitle: "Let's get to know you",
    onboardingSubtitle: "Help us create a space that truly honors who you are",
    languageQuestion: "What language do you feel the most loved in?",
    languageSubtitle: "Select the language that speaks to your heart",
    healingVisionQuestion: "What does healing look like to you?",
    healingVisionSubtitle: "Share your vision in your own words",
    healingVisionPlaceholder: "Healing to me means...",
    affirmationStyleQuestion: "Do you prefer affirmations rooted in spirituality, culture, or science?",
    affirmationStyleSubtitle: "Choose what resonates most deeply",
    culturalBackgroundQuestion: "Which cultural communities do you connect with?",
    culturalBackgroundSubtitle: "Help us honor your full identity (optional)",
    spiritualPreferenceQuestion: "How do you connect with the sacred?",
    spiritualPreferenceSubtitle: "Your spiritual practice, however you define it",
    
    // Affirmation styles
    spiritualityFaith: "Spirituality & Faith",
    culturalWisdom: "Cultural Wisdom & Ancestry",
    sciencePsychology: "Science & Psychology",
    blendOfAll: "A blend of all three",
    
    // Spiritual preferences
    christianity: "Christianity",
    islam: "Islam",
    judaism: "Judaism",
    buddhism: "Buddhism",
    hinduism: "Hinduism",
    indigenousTraditional: "Indigenous/Traditional practices",
    natureBased: "Nature-based spirituality",
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
    firstGeneration: "First-generation American",
    other: "Other",
    
    // Dashboard
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    beautiful: "beautiful",
    friend: "friend",
    worthyOfLove: "You are worthy of love and gentleness today",
    welcomeBackToSafeSpace: "Welcome back to your safe space",
    todaysReminder: "Today's gentle reminder",
    howCanISupport: "How can I support you today?",
    yourGrowthRings: "Your growth rings",
    daysOfSelfCare: "days of gentle self-care this week",
    
    // Navigation
    home: "Home",
    checkIn: "Check-In",
    wins: "Wins",
    journal: "Journal",
    affirm: "Affirm",
    garden: "Garden",
    
    // Check-in
    howAreYouFeeling: "How are you feeling?",
    gentleCheckIn: "A gentle check-in",
    checkInDescription: "There's no right or wrong way to feel. Whatever you're experiencing right now is valid and worthy of acknowledgment.",
    whatEmotionClosest: "What emotion feels closest?",
    whatColorEnergy: "What color matches your energy?",
    forYouRightNow: "For you, right now",
    checkInAffirmation: "Thank you for taking a moment to check in with yourself. Your feelings are valid, and you deserve compassion exactly as you are in this moment.",
    
    // Emotions
    peaceful: "peaceful",
    content: "content",
    tender: "tender",
    heavy: "heavy",
    frustrated: "frustrated",
    growing: "growing",
    hopeful: "hopeful",
    tired: "tired",
    
    // Colors
    softPink: "Soft Pink",
    warmSage: "Warm Sage",
    gentleLavender: "Gentle Lavender",
    sunsetOrange: "Sunset Orange",
    goldenCream: "Golden Cream",
    oceanBlue: "Ocean Blue",
    
    // Wins
    yourWins: "Your Wins",
    everyStepCounts: "Every step counts",
    winsDescription: "Celebrating your wins, no matter how small they seem, helps rewire your brain for self-compassion. You're doing better than you think.",
    quickWinsTocelebrate: "Quick wins to celebrate",
    addYourWin: "Add your win",
    whatDidYouAccomplish: "What did you accomplish today?",
    celebrateThisWin: "Celebrate This Win",
    cancel: "Cancel",
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
    calledSomeone: "Called someone I love",
    
    // Journal
    journalTitle: "Journal",
    safeSpaceThoughts: "A safe space for your thoughts",
    journalDescription: "Let your thoughts flow freely. There's no judgment here, only space for you to be authentic and gentle with yourself.",
    howToExpress: "How would you like to express yourself?",
    needGentleNudge: "Need a gentle nudge?",
    letThoughtsFlow: "Let your thoughts flow...",
    saveEntry: "Save Entry",
    write: "Write",
    speak: "Speak",
    capture: "Capture",
    
    // Journal prompts
    gratefulFor: "What am I grateful for today?",
    showedKindness: "How did I show myself kindness?",
    boundaryHonored: "What boundary did I honor?",
    madeSmile: "What made me smile today?",
    needToRelease: "What do I need to release?",
    howGrowing: "How am I growing?",
    tellYoungerSelf: "What would I tell my younger self?",
    bringsYouPeace: "What brings me peace?",
    
    // Affirmations
    dailyAffirmations: "Daily Affirmations",
    wordsOfLove: "Words of love for you",
    affirmationsDescription: "These affirmations are crafted with love for young women of color navigating their healing journey. Let these words sink into your heart.",
    gentleReflection: "Gentle reflection",
    reflectionPrompt: "Take a deep breath and let this affirmation settle into your heart. How does it feel to offer yourself these words of kindness?",
    nextAffirmation: "Next Affirmation",
    
    // Resources
    resourceGarden: "Resource Garden",
    curatedWithLove: "Curated with love",
    resourcesDescription: "These resources are carefully selected to honor your intersectional identity and support your healing journey. Each piece is chosen with cultural sensitivity and genuine care.",
    stories: "Stories",
    healing: "Healing",
    community: "Community",
    media: "Media",
    suggestResource: "Suggest a resource",
    suggestDescription: "Know of a resource that would help other young women of color? We'd love to hear about it.",
    shareResource: "Share a Resource",
    
    // Soft Landing
    softLanding: "Soft Landing",
    youAreSafeHere: "You're safe here",
    softLandingDescription: "Choose what feels most comforting right now. There's no rush.",
    gentleBreathing: "Gentle Breathing",
    grounding: "5-4-3-2-1 Grounding",
    emergencyAffirmation: "Emergency Affirmation",
    soothingSounds: "Soothing Sounds",
    breathingDescription: "A simple breathing pattern to help you feel grounded",
    groundingDescription: "Use your senses to feel present and safe",
    affirmationDescription: "Gentle words for when shame feels overwhelming",
    soundsDescription: "Calming audio to help you feel peaceful",
    needMoreSupport: "Need more support?",
    crisisDescription: "If you're in crisis, please reach out for professional help.",
    crisisTextLine: "Crisis Text Line: Text HOME to 741741",
    suicidePrevention: "National Suicide Prevention Lifeline: 988",
    emergency: "Emergency",
    imFeelingBetter: "I'm feeling better",
    
    // Footer
    importantNotice: "Important: Not a replacement for therapy",
    notReplacementTherapy: "shame.less is not a replacement for professional therapy or medical advice.",
    
    // Disclaimer
    aboutShameless: "About shame.less",
    disclaimerDescription: "shame.less is not a replacement for professional therapy or medical advice. If you are in crisis, please seek licensed mental health support. This app is for emotional grounding, reflection, and peer-inspired healing only.",
    crisisSupport: "Crisis Support",
    textHome: "Text HOME to 741741",
    callText988: "Call or text 988",
    call911: "Call 911",
    disclaimerAffirmation: "You deserve support, love, and professional care when you need it. This app is here to complement your healing journey, not replace professional help.",
    notNow: "Not Now",
    iUnderstand: "I Understand",
  },
  
  Spanish: {
    // Common
    skipForNow: "Omitir por ahora",
    next: "Siguiente",
    back: "Atrás",
    complete: "Completar",
    loading: "Cargando tu espacio seguro...",
    
    // App branding
    appName: "shame.less",
    tagline: "Tu compañera diaria gentil",
    
    // Authentication
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    signOut: "Cerrar Sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    name: "Nombre (opcional)",
    welcomeBack: "Bienvenida de vuelta",
    joinUs: "Únete a nosotros",
    continueAsGuest: "Continuar como invitada",
    createAccount: "Crear Cuenta",
    dontHaveAccount: "¿No tienes una cuenta?",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    privacyNote: "Tu privacidad es nuestra prioridad. Nunca compartiremos tu información.",
    
    // Onboarding
    onboardingTitle: "Conozcámonos",
    onboardingSubtitle: "Ayúdanos a crear un espacio que realmente honre quien eres",
    languageQuestion: "¿En qué idioma te sientes más amada?",
    languageSubtitle: "Selecciona el idioma que habla a tu corazón",
    healingVisionQuestion: "¿Cómo se ve la sanación para ti?",
    healingVisionSubtitle: "Comparte tu visión con tus propias palabras",
    healingVisionPlaceholder: "Para mí, sanar significa...",
    affirmationStyleQuestion: "¿Prefieres afirmaciones basadas en espiritualidad, cultura o ciencia?",
    affirmationStyleSubtitle: "Elige lo que resuena más profundamente",
    culturalBackgroundQuestion: "¿Con qué comunidades culturales te conectas?",
    culturalBackgroundSubtitle: "Ayúdanos a honrar tu identidad completa (opcional)",
    spiritualPreferenceQuestion: "¿Cómo te conectas con lo sagrado?",
    spiritualPreferenceSubtitle: "Tu práctica espiritual, como la definas",
    
    // Affirmation styles
    spiritualityFaith: "Espiritualidad y Fe",
    culturalWisdom: "Sabiduría Cultural y Ancestral",
    sciencePsychology: "Ciencia y Psicología",
    blendOfAll: "Una mezcla de las tres",
    
    // Spiritual preferences
    christianity: "Cristianismo",
    islam: "Islam",
    judaism: "Judaísmo",
    buddhism: "Budismo",
    hinduism: "Hinduismo",
    indigenousTraditional: "Prácticas Indígenas/Tradicionales",
    natureBased: "Espiritualidad basada en la naturaleza",
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
    middleEastern: "Medio Oriental",
    mixedMultiracial: "Mixta/Multirracial",
    lgbtqia: "LGBTQIA+",
    firstGeneration: "Primera generación americana",
    other: "Otro",
    
    // Dashboard
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    beautiful: "hermosa",
    friend: "amiga",
    worthyOfLove: "Mereces amor y gentileza hoy",
    welcomeBackToSafeSpace: "Bienvenida de vuelta a tu espacio seguro",
    todaysReminder: "Recordatorio gentil de hoy",
    howCanISupport: "¿Cómo puedo apoyarte hoy?",
    yourGrowthRings: "Tus anillos de crecimiento",
    daysOfSelfCare: "días de autocuidado gentil esta semana",
    
    // Navigation
    home: "Inicio",
    checkIn: "Registro",
    wins: "Logros",
    journal: "Diario",
    affirm: "Afirmar",
    garden: "Jardín",
    
    // Check-in
    howAreYouFeeling: "¿Cómo te sientes?",
    gentleCheckIn: "Un registro gentil",
    checkInDescription: "No hay una forma correcta o incorrecta de sentirse. Lo que estés experimentando ahora es válido y merece reconocimiento.",
    whatEmotionClosest: "¿Qué emoción se siente más cercana?",
    whatColorEnergy: "¿Qué color coincide con tu energía?",
    forYouRightNow: "Para ti, ahora mismo",
    checkInAffirmation: "Gracias por tomarte un momento para registrarte contigo misma. Tus sentimientos son válidos, y mereces compasión exactamente como eres en este momento.",
    
    // Emotions
    peaceful: "en paz",
    content: "contenta",
    tender: "tierna",
    heavy: "pesada",
    frustrated: "frustrada",
    growing: "creciendo",
    hopeful: "esperanzada",
    tired: "cansada",
    
    // Colors
    softPink: "Rosa Suave",
    warmSage: "Salvia Cálida",
    gentleLavender: "Lavanda Gentil",
    sunsetOrange: "Naranja Atardecer",
    goldenCream: "Crema Dorada",
    oceanBlue: "Azul Océano",
    
    // Wins
    yourWins: "Tus Logros",
    everyStepCounts: "Cada paso cuenta",
    winsDescription: "Celebrar tus logros, sin importar cuán pequeños parezcan, ayuda a reconectar tu cerebro para la autocompasión. Lo estás haciendo mejor de lo que piensas.",
    quickWinsTocelebrate: "Logros rápidos para celebrar",
    addYourWin: "Agrega tu logro",
    whatDidYouAccomplish: "¿Qué lograste hoy?",
    celebrateThisWin: "Celebrar Este Logro",
    cancel: "Cancelar",
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
    calledSomeone: "Llamé a alguien que amo",
    
    // Journal
    journalTitle: "Diario",
    safeSpaceThoughts: "Un espacio seguro para tus pensamientos",
    journalDescription: "Deja que tus pensamientos fluyan libremente. No hay juicio aquí, solo espacio para que seas auténtica y gentil contigo misma.",
    howToExpress: "¿Cómo te gustaría expresarte?",
    needGentleNudge: "¿Necesitas un empujoncito gentil?",
    letThoughtsFlow: "Deja que tus pensamientos fluyan...",
    saveEntry: "Guardar Entrada",
    write: "Escribir",
    speak: "Hablar",
    capture: "Capturar",
    
    // Journal prompts
    gratefulFor: "¿Por qué estoy agradecida hoy?",
    showedKindness: "¿Cómo me mostré bondad?",
    boundaryHonored: "¿Qué límite honré?",
    madeSmile: "¿Qué me hizo sonreír hoy?",
    needToRelease: "¿Qué necesito liberar?",
    howGrowing: "¿Cómo estoy creciendo?",
    tellYoungerSelf: "¿Qué le diría a mi yo más joven?",
    bringsYouPeace: "¿Qué me trae paz?",
    
    // Affirmations
    dailyAffirmations: "Afirmaciones Diarias",
    wordsOfLove: "Palabras de amor para ti",
    affirmationsDescription: "Estas afirmaciones están creadas con amor para mujeres jóvenes de color navegando su viaje de sanación. Deja que estas palabras penetren en tu corazón.",
    gentleReflection: "Reflexión gentil",
    reflectionPrompt: "Respira profundo y deja que esta afirmación se asiente en tu corazón. ¿Cómo se siente ofrecerte estas palabras de bondad?",
    nextAffirmation: "Siguiente Afirmación",
    
    // Resources
    resourceGarden: "Jardín de Recursos",
    curatedWithLove: "Curado con amor",
    resourcesDescription: "Estos recursos están cuidadosamente seleccionados para honrar tu identidad interseccional y apoyar tu viaje de sanación. Cada pieza es elegida con sensibilidad cultural y cuidado genuino.",
    stories: "Historias",
    healing: "Sanación",
    community: "Comunidad",
    media: "Medios",
    suggestResource: "Sugerir un recurso",
    suggestDescription: "¿Conoces un recurso que ayudaría a otras mujeres jóvenes de color? Nos encantaría escucharlo.",
    shareResource: "Compartir un Recurso",
    
    // Soft Landing
    softLanding: "Aterrizaje Suave",
    youAreSafeHere: "Estás segura aquí",
    softLandingDescription: "Elige lo que se sienta más consolador ahora mismo. No hay prisa.",
    gentleBreathing: "Respiración Gentil",
    grounding: "Conexión a Tierra 5-4-3-2-1",
    emergencyAffirmation: "Afirmación de Emergencia",
    soothingSounds: "Sonidos Calmantes",
    breathingDescription: "Un patrón de respiración simple para ayudarte a sentirte conectada a tierra",
    groundingDescription: "Usa tus sentidos para sentirte presente y segura",
    affirmationDescription: "Palabras gentiles para cuando la vergüenza se siente abrumadora",
    soundsDescription: "Audio calmante para ayudarte a sentirte en paz",
    needMoreSupport: "¿Necesitas más apoyo?",
    crisisDescription: "Si estás en crisis, por favor busca ayuda profesional.",
    crisisTextLine: "Línea de Texto de Crisis: Envía CASA al 741741",
    suicidePrevention: "Línea Nacional de Prevención del Suicidio: 988",
    emergency: "Emergencia",
    imFeelingBetter: "Me siento mejor",
    
    // Footer
    importantNotice: "Importante: No es un reemplazo para terapia",
    notReplacementTherapy: "shame.less no es un reemplazo para terapia profesional o consejo médico.",
    
    // Disclaimer
    aboutShameless: "Acerca de shame.less",
    disclaimerDescription: "shame.less no es un reemplazo para terapia profesional o consejo médico. Si estás en crisis, por favor busca apoyo de salud mental licenciado. Esta aplicación es solo para conexión emocional, reflexión y sanación inspirada en pares.",
    crisisSupport: "Apoyo en Crisis",
    textHome: "Envía CASA al 741741",
    callText988: "Llama o envía texto al 988",
    call911: "Llama al 911",
    disclaimerAffirmation: "Mereces apoyo, amor y cuidado profesional cuando lo necesites. Esta aplicación está aquí para complementar tu viaje de sanación, no reemplazar la ayuda profesional.",
    notNow: "Ahora No",
    iUnderstand: "Entiendo",
  },
  
  French: {
    // Common
    skipForNow: "Passer pour l'instant",
    next: "Suivant",
    back: "Retour",
    complete: "Terminer",
    loading: "Chargement de votre espace sûr...",
    
    // App branding
    appName: "shame.less",
    tagline: "Votre compagne quotidienne douce",
    
    // Authentication
    signIn: "Se Connecter",
    signUp: "S'inscrire",
    signOut: "Se Déconnecter",
    email: "Email",
    password: "Mot de passe",
    name: "Nom (optionnel)",
    welcomeBack: "Bon retour",
    joinUs: "Rejoignez-nous",
    continueAsGuest: "Continuer en tant qu'invitée",
    createAccount: "Créer un Compte",
    dontHaveAccount: "Vous n'avez pas de compte?",
    alreadyHaveAccount: "Vous avez déjà un compte?",
    privacyNote: "Votre vie privée est notre priorité. Nous ne partagerons jamais vos informations.",
    
    // Onboarding
    onboardingTitle: "Apprenons à nous connaître",
    onboardingSubtitle: "Aidez-nous à créer un espace qui honore vraiment qui vous êtes",
    languageQuestion: "Dans quelle langue vous sentez-vous le plus aimée?",
    languageSubtitle: "Sélectionnez la langue qui parle à votre cœur",
    healingVisionQuestion: "À quoi ressemble la guérison pour vous?",
    healingVisionSubtitle: "Partagez votre vision avec vos propres mots",
    healingVisionPlaceholder: "Pour moi, guérir signifie...",
    affirmationStyleQuestion: "Préférez-vous les affirmations enracinées dans la spiritualité, la culture ou la science?",
    affirmationStyleSubtitle: "Choisissez ce qui résonne le plus profondément",
    culturalBackgroundQuestion: "Avec quelles communautés culturelles vous connectez-vous?",
    culturalBackgroundSubtitle: "Aidez-nous à honorer votre identité complète (optionnel)",
    spiritualPreferenceQuestion: "Comment vous connectez-vous au sacré?",
    spiritualPreferenceSubtitle: "Votre pratique spirituelle, comme vous la définissez",
    
    // Affirmation styles
    spiritualityFaith: "Spiritualité et Foi",
    culturalWisdom: "Sagesse Culturelle et Ancestrale",
    sciencePsychology: "Science et Psychologie",
    blendOfAll: "Un mélange des trois",
    
    // Spiritual preferences
    christianity: "Christianisme",
    islam: "Islam",
    judaism: "Judaïsme",
    buddhism: "Bouddhisme",
    hinduism: "Hindouisme",
    indigenousTraditional: "Pratiques Indigènes/Traditionnelles",
    natureBased: "Spiritualité basée sur la nature",
    secularNonReligious: "Séculier/Non-religieux",
    stillExploring: "Encore en exploration",
    preferNotToSay: "Préfère ne pas dire",
    
    // Cultural backgrounds
    blackAmerican: "Afro-américaine",
    afroCaribbean: "Afro-caribéenne",
    african: "Africaine",
    latinaHispanic: "Latina/Hispanique",
    indigenous: "Indigène",
    asian: "Asiatique",
    middleEastern: "Moyen-orientale",
    mixedMultiracial: "Mixte/Multiraciale",
    lgbtqia: "LGBTQIA+",
    firstGeneration: "Première génération américaine",
    other: "Autre",
    
    // Dashboard
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    beautiful: "belle",
    friend: "amie",
    worthyOfLove: "Vous méritez l'amour et la douceur aujourd'hui",
    welcomeBackToSafeSpace: "Bon retour dans votre espace sûr",
    todaysReminder: "Rappel doux d'aujourd'hui",
    howCanISupport: "Comment puis-je vous soutenir aujourd'hui?",
    yourGrowthRings: "Vos anneaux de croissance",
    daysOfSelfCare: "jours de soins personnels doux cette semaine",
    
    // Navigation
    home: "Accueil",
    checkIn: "Enregistrement",
    wins: "Victoires",
    journal: "Journal",
    affirm: "Affirmer",
    garden: "Jardin",
    
    // Check-in
    howAreYouFeeling: "Comment vous sentez-vous?",
    gentleCheckIn: "Un enregistrement doux",
    checkInDescription: "Il n'y a pas de bonne ou mauvaise façon de se sentir. Ce que vous ressentez maintenant est valide et mérite d'être reconnu.",
    whatEmotionClosest: "Quelle émotion se sent la plus proche?",
    whatColorEnergy: "Quelle couleur correspond à votre énergie?",
    forYouRightNow: "Pour vous, maintenant",
    checkInAffirmation: "Merci de prendre un moment pour vous enregistrer. Vos sentiments sont valides, et vous méritez la compassion exactement comme vous êtes en ce moment.",
    
    // Emotions
    peaceful: "paisible",
    content: "contente",
    tender: "tendre",
    heavy: "lourde",
    frustrated: "frustrée",
    growing: "grandissante",
    hopeful: "pleine d'espoir",
    tired: "fatiguée",
    
    // Colors
    softPink: "Rose Doux",
    warmSage: "Sauge Chaude",
    gentleLavender: "Lavande Douce",
    sunsetOrange: "Orange Coucher de Soleil",
    goldenCream: "Crème Dorée",
    oceanBlue: "Bleu Océan",
    
    // Wins
    yourWins: "Vos Victoires",
    everyStepCounts: "Chaque pas compte",
    winsDescription: "Célébrer vos victoires, peu importe leur taille, aide à recâbler votre cerveau pour l'auto-compassion. Vous faites mieux que vous ne le pensez.",
    quickWinsTocelebrate: "Victoires rapides à célébrer",
    addYourWin: "Ajoutez votre victoire",
    whatDidYouAccomplish: "Qu'avez-vous accompli aujourd'hui?",
    celebrateThisWin: "Célébrer Cette Victoire",
    cancel: "Annuler",
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
    calledSomeone: "J'ai appelé quelqu'un que j'aime",
    
    // Journal
    journalTitle: "Journal",
    safeSpaceThoughts: "Un espace sûr pour vos pensées",
    journalDescription: "Laissez vos pensées couler librement. Il n'y a pas de jugement ici, seulement de l'espace pour être authentique et douce avec vous-même.",
    howToExpress: "Comment aimeriez-vous vous exprimer?",
    needGentleNudge: "Besoin d'un petit coup de pouce doux?",
    letThoughtsFlow: "Laissez vos pensées couler...",
    saveEntry: "Sauvegarder l'Entrée",
    write: "Écrire",
    speak: "Parler",
    capture: "Capturer",
    
    // Journal prompts
    gratefulFor: "Pour quoi suis-je reconnaissante aujourd'hui?",
    showedKindness: "Comment me suis-je montrée de la bonté?",
    boundaryHonored: "Quelle limite ai-je honorée?",
    madeSmile: "Qu'est-ce qui m'a fait sourire aujourd'hui?",
    needToRelease: "Que dois-je libérer?",
    howGrowing: "Comment est-ce que je grandis?",
    tellYoungerSelf: "Que dirais-je à mon moi plus jeune?",
    bringsYouPeace: "Qu'est-ce qui m'apporte la paix?",
    
    // Affirmations
    dailyAffirmations: "Affirmations Quotidiennes",
    wordsOfLove: "Mots d'amour pour vous",
    affirmationsDescription: "Ces affirmations sont créées avec amour pour les jeunes femmes de couleur naviguant leur voyage de guérison. Laissez ces mots pénétrer dans votre cœur.",
    gentleReflection: "Réflexion douce",
    reflectionPrompt: "Respirez profondément et laissez cette affirmation s'installer dans votre cœur. Comment cela fait-il de vous offrir ces mots de bonté?",
    nextAffirmation: "Affirmation Suivante",
    
    // Resources
    resourceGarden: "Jardin de Ressources",
    curatedWithLove: "Curé avec amour",
    resourcesDescription: "Ces ressources sont soigneusement sélectionnées pour honorer votre identité intersectionnelle et soutenir votre voyage de guérison. Chaque pièce est choisie avec sensibilité culturelle et soin authentique.",
    stories: "Histoires",
    healing: "Guérison",
    community: "Communauté",
    media: "Médias",
    suggestResource: "Suggérer une ressource",
    suggestDescription: "Connaissez-vous une ressource qui aiderait d'autres jeunes femmes de couleur? Nous aimerions l'entendre.",
    shareResource: "Partager une Ressource",
    
    // Soft Landing
    softLanding: "Atterrissage Doux",
    youAreSafeHere: "Vous êtes en sécurité ici",
    softLandingDescription: "Choisissez ce qui vous semble le plus réconfortant maintenant. Il n'y a pas d'urgence.",
    gentleBreathing: "Respiration Douce",
    grounding: "Ancrage 5-4-3-2-1",
    emergencyAffirmation: "Affirmation d'Urgence",
    soothingSounds: "Sons Apaisants",
    breathingDescription: "Un modèle de respiration simple pour vous aider à vous sentir ancrée",
    groundingDescription: "Utilisez vos sens pour vous sentir présente et en sécurité",
    affirmationDescription: "Mots doux pour quand la honte se sent écrasante",
    soundsDescription: "Audio apaisant pour vous aider à vous sentir en paix",
    needMoreSupport: "Besoin de plus de soutien?",
    crisisDescription: "Si vous êtes en crise, veuillez chercher de l'aide professionnelle.",
    crisisTextLine: "Ligne de Texte de Crise: Textez MAISON au 741741",
    suicidePrevention: "Ligne Nationale de Prévention du Suicide: 988",
    emergency: "Urgence",
    imFeelingBetter: "Je me sens mieux",
    
    // Footer
    importantNotice: "Important: Pas un remplacement pour la thérapie",
    notReplacementTherapy: "shame.less n'est pas un remplacement pour la thérapie professionnelle ou les conseils médicaux.",
    
    // Disclaimer
    aboutShameless: "À propos de shame.less",
    disclaimerDescription: "shame.less n'est pas un remplacement pour la thérapie professionnelle ou les conseils médicaux. Si vous êtes en crise, veuillez chercher un soutien de santé mentale licencié. Cette application est uniquement pour l'ancrage émotionnel, la réflexion et la guérison inspirée par les pairs.",
    crisisSupport: "Soutien de Crise",
    textHome: "Textez MAISON au 741741",
    callText988: "Appelez ou textez 988",
    call911: "Appelez 911",
    disclaimerAffirmation: "Vous méritez le soutien, l'amour et les soins professionnels quand vous en avez besoin. Cette application est là pour compléter votre voyage de guérison, pas remplacer l'aide professionnelle.",
    notNow: "Pas Maintenant",
    iUnderstand: "Je Comprends",
  }
};

export const getTranslation = (language: string): Translations => {
  return translations[language] || translations.English;
};

export const getAvailableLanguages = (): string[] => {
  return Object.keys(translations);
};