import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    // Splash Screen
    splashTitle: 'Prayer Wall',
    splashSubtitle: 'SACRED STILLNESS',
    splashVerse: '"Therefore I tell you, whatever you ask in prayer, believe that you have received it, and it will be yours."',
    splashRef: '— MARK 11:24',
    splashLoading: 'Preparing your sanctuary...',

    // Login Page
    loginTitle: 'Prayer Wall',
    loginSubtitle: 'Join believers worldwide in the ministry of prayer.',
    continueWithGoogle: 'Continue with Google',
    or: 'OR',
    signIn: 'Sign In',
    register: 'Register',
    fullName: 'Full Name',
    emailAddress: 'Email address',
    password: 'Password',
    processing: 'Processing...',
    createAccount: 'Create Account',
    continueAsGuest: 'Continue as Guest →',
    fillAllFields: 'Please fill in all required fields.',

    // Onboarding
    welcomeTitle: 'Welcome',
    welcomeSubtitle: 'Before you join the prayer wall, please tell us where you are joining from.',
    assemblyLabel: 'Assembly location or Village name',
    assemblyPlaceholder: 'e.g. Grace Fellowship, Springfield',
    saving: 'Saving...',
    continueToWall: 'Continue to Wall',

    // Bottom Nav
    navWall: 'Wall',
    navPost: 'Post',
    navCelebrate: 'Celebrate',
    navMyPrayers: 'My Prayers',
    navAdmin: 'Admin',

    // Top Header
    prayerWall: 'Prayer Wall',
    logout: 'Logout',
    menu: 'Menu',
    search: 'Search',

    // Prayer Wall Page
    morningDevotion: 'MORNING DEVOTION',
    heroTitle: 'Find peace in communal prayer today.',
    newest: 'Newest',
    mostPrayed: 'Most Prayed',
    oldest: 'Oldest',
    resultsFor: 'Results for',
    clear: 'Clear',
    loadingPrayers: 'Loading prayers...',
    noPrayersYet: 'No prayers yet',
    noPrayersDesc: 'Be the first to share a prayer request with the community.',
    prev: '← Prev',
    next: 'Next →',

    // Prayer Card
    anonymous: 'Anonymous',
    believersPraying: 'believers praying',
    yourePraying: "🙏 You're Praying",
    imPraying: "🤍 I'm Praying",

    // Search Overlay
    searchPlaceholder: 'Search prayers, names, churches...',
    pressEnterToSearch: 'Press Enter to search for',

    // Post Prayer Page
    shareYourRequest: 'Share your Request',
    signInToPost: 'Sign in to post',
    signInToPostDesc: 'You need to sign in to share a prayer request.',
    prayerShared: 'Prayer Shared',
    prayerSharedDesc: 'Your prayer has been shared with believers. The community is praying with you.',
    shareAnother: 'Share Another Prayer',
    postVerse: '"For where two or three gather in my name, there am I with them."',
    yourName: 'Your Name',
    enterYourName: 'Enter your name',
    shareAsAnonymous: 'Share as Anonymous',
    category: 'Category',
    selectCategory: 'Select a category',
    prayerRequest: 'Prayer Request',
    whatCanWePray: 'What can we pray for today?',
    phoneOptional: 'Phone Number (Optional)',
    phoneDesc: 'For admin follow-up only',
    sharingWith: 'Sharing with',
    yourCommunity: 'your community',
    sharing: 'Sharing...',
    sharePrayerRequest: 'Share Prayer Request',
    selectCategoryError: 'Please select a category.',
    enterPrayerError: 'Please enter your prayer request.',
    prayerLengthError: 'Prayer text must be 500 characters or less.',
    shareAsGuest: 'Share as Guest User',
    guestWarning: 'Note: Since you are not signed in, your prayer history will be saved on this device only. Clearing your browser\'s history or cache will erase it.',
    // Categories
    catHealth: 'Health',
    catMarriage: 'Marriage',
    catFamily: 'Family',
    catFinancial: 'Financial',
    catEducation: 'Education',
    catJob: 'Job',
    catTravel: 'Travel',
    catMinistry: 'Ministry',
    catGeneral: 'General',
    catOther: 'Other',

    // Celebrate Page
    testimonies: 'Testimonies',
    sacredStories: 'Sacred Stories',
    celebrateDesc: "Witness the beauty of God's faithfulness in the lives of our community.",
    loadingTestimonies: 'Loading testimonies...',
    noTestimonies: 'No testimonies yet',
    noTestimoniesDesc: "When prayers are answered and testimonies shared, they'll appear here.",

    // Testimony Card
    godAnswered: '🎉 GOD ANSWERED',
    general: 'General',

    // My Prayers Page
    myPrayers: 'My Prayers',
    signInToView: 'Sign in to view',
    signInToViewDesc: 'Sign in to see your prayer requests.',
    active: 'Active',
    answered: 'Answered',
    loading: 'Loading...',
    noActivePrayers: 'No active prayers',
    noActivePrayersDesc: 'Share a prayer request to get started.',
    added: 'Added',
    peoplePrayed: 'people prayed',
    markAnswered: '✓ Mark Answered',
    noAnsweredPrayers: 'No answered prayers yet',
    noAnsweredPrayersDesc: 'When God answers, mark them here.',
    shareTestimony: 'Share Testimony 🙌',
    yourTestimony: 'Your testimony:',
    status: 'Status',

    // Confirm Modal
    hasGodAnswered: 'Has God answered your prayer?',
    confirmModalText: 'Once marked as answered, it will be removed from the Prayer Wall and moved to your Answered tab.',
    yesAnswered: "Yes, it's Answered",
    notYet: 'Not yet',

    // Undo Toast
    markedAsAnswered: 'Marked as answered.',
    undo: 'Undo',

    // Testimony Modal
    shareYourTestimony: 'Share Your Testimony',
    testimonyModalDesc: 'Encourage others by sharing how God answered your prayer.',
    testimonyPlaceholder: 'Share how God answered your prayer...',
    submitTestimony: 'Submit Testimony',
    skipForNow: 'Skip for now',

    // Admin Dashboard
    adminDashboard: '⛪ Admin Dashboard',
    peaceBeWithYou: 'Peace be with you,',
    adminDesc: 'Here is the current state of the Prayer Wall ecosystem.',
    today: 'today',
    total: 'Total',
    activePrayers: 'Active Prayers',
    answeredPrayers: 'Answered Prayers',
    oldestActiveRequests: '❗ Oldest Active Requests',
    posted: 'Posted',
    viewDetails: 'View Details',
    markAsReachedOut: 'Mark as Reached Out',
    pendingTestimonies: '🕐 Pending Testimonies',
    approve: '✓ Approve',
    reject: '✕ Reject',
    prayerManagement: '📋 Prayer Management Feed',
    prayerManagementDesc: 'Review and manage recent community submissions.',
    contactPersonally: '📞 Contact Personally',
    deletePrayer: '🗑 Delete',
    deleteConfirm: 'Delete this prayer permanently?',

    // Language toggle
    langEnglish: 'EN',
    langTelugu: 'తె',
  },

  te: {
    // Splash Screen
    splashTitle: 'ప్రార్థనా గోడ',
    splashSubtitle: 'పవిత్ర నిశ్శబ్దము',
    splashVerse: '"కావున మీరు ప్రార్థనచేయునప్పుడు అడుగుచున్న వాటినెల్లను పొందియున్నామని నమ్ముడి, అప్పుడు అవి మీకు కలుగును."',
    splashRef: '— మార్కు 11:24',
    splashLoading: 'మీ పవిత్ర స్థలమును సిద్ధపరుచుచున్నాము...',

    // Login Page
    loginTitle: 'ప్రార్థనా గోడ',
    loginSubtitle: 'ప్రార్థనా సేవలో ప్రపంచవ్యాప్తముగా విశ్వాసులతో కలిసి రండి.',
    continueWithGoogle: 'Google తో కొనసాగించుము',
    or: 'లేక',
    signIn: 'ప్రవేశించుము',
    register: 'నమోదు చేయుము',
    fullName: 'పూర్తి పేరు',
    emailAddress: 'ఇ-మెయిల్ చిరునామా',
    password: 'సంకేతపదము',
    processing: 'ప్రక్రియ జరుగుచున్నది...',
    createAccount: 'ఖాతా సృష్టించుము',
    continueAsGuest: 'అతిథిగా కొనసాగించుము →',
    fillAllFields: 'దయచేసి అన్ని ఆవశ్యక విషయములు నింపుము.',

    // Onboarding
    welcomeTitle: 'స్వాగతము',
    welcomeSubtitle: 'ప్రార్థనా గోడలో చేరుటకు ముందుగా మీరు ఎక్కడ నుండి వచ్చుచున్నారో తెలియజేయుము.',
    assemblyLabel: 'సంఘము యొక్క స్థలము లేక గ్రామము పేరు',
    assemblyPlaceholder: 'ఉదా. కృపా సంఘము, హైదరాబాద్',
    saving: 'భద్రపరుచుచున్నది...',
    continueToWall: 'గోడకు కొనసాగించుము',

    // Bottom Nav
    navWall: 'గోడ',
    navPost: 'ప్రకటన',
    navCelebrate: 'స్తుతి',
    navMyPrayers: 'నా ప్రార్థనలు',
    navAdmin: 'నిర్వాహకుడు',

    // Top Header
    prayerWall: 'ప్రార్థనా గోడ',
    logout: 'బయటికి వెళ్ళుము',
    menu: 'పట్టిక',
    search: 'వెతుకుము',

    // Prayer Wall Page
    morningDevotion: 'ఉదయ ధ్యానము',
    heroTitle: 'నేడు సామూహిక ప్రార్థనలో సమాధానమును పొందుము.',
    newest: 'క్రొత్తవి',
    mostPrayed: 'ఎక్కువగా ప్రార్థించినవి',
    oldest: 'పురాతనమైనవి',
    resultsFor: 'ఫలితములు',
    clear: 'తొలగించుము',
    loadingPrayers: 'ప్రార్థనలు వచ్చుచున్నవి...',
    noPrayersYet: 'ఇంకను ప్రార్థనలు లేవు',
    noPrayersDesc: 'సంఘముతో ప్రార్థనా విన్నపమును పంచుకొనుటకు మొదటివారు అగుము.',
    prev: '← వెనుకకు',
    next: 'ముందుకు →',

    // Prayer Card
    anonymous: 'అనామకుడు',
    believersPraying: 'మంది విశ్వాసులు ప్రార్థించుచున్నారు',
    yourePraying: '🙏 మీరు ప్రార్థించుచున్నారు',
    imPraying: '🤍 నేను ప్రార్థించుచున్నాను',

    // Search Overlay
    searchPlaceholder: 'ప్రార్థనలు, పేర్లు, సంఘములు వెతుకుము...',
    pressEnterToSearch: 'వెతుకుటకు Enter నొక్కుము',

    // Post Prayer Page
    shareYourRequest: 'మీ విన్నపమును తెలియజేయుము',
    signInToPost: 'ప్రకటించుటకు ప్రవేశించుము',
    signInToPostDesc: 'ప్రార్థనా విన్నపమును పంచుకొనుటకు ప్రవేశించుము.',
    prayerShared: 'ప్రార్థన పంచబడినది',
    prayerSharedDesc: 'మీ ప్రార్థన విశ్వాసులతో పంచబడినది. సంఘము మీతో కలిసి ప్రార్థించుచున్నది.',
    shareAnother: 'మరొక ప్రార్థన పంచుకొనుము',
    postVerse: '"ఎందుకనగా ఇద్దరు ముగ్గురు నా నామములో ఎక్కడ కూడివున్నారో అక్కడ వారి మధ్యలో నేనుందును."',
    yourName: 'మీ పేరు',
    enterYourName: 'మీ పేరు వ్రాయుము',
    shareAsAnonymous: 'అనామకముగా పంచుకొనుము',
    category: 'వర్గము',
    selectCategory: 'ఒక వర్గమును ఎన్నుకొనుము',
    prayerRequest: 'ప్రార్థనా విన్నపము',
    whatCanWePray: 'నేడు మేము దేనికొరకు ప్రార్థింపగలము?',
    phoneOptional: 'ఫోన్ నంబర్ (ఐచ్ఛికము)',
    phoneDesc: 'నిర్వాహకుని అనుసరణ కొరకు మాత్రమే',
    sharingWith: 'పంచుకొనుచున్నారు',
    yourCommunity: 'మీ సంఘముతో',
    sharing: 'పంచుచున్నది...',
    sharePrayerRequest: 'ప్రార్థనా విన్నపము పంపుము',
    selectCategoryError: 'దయచేసి ఒక వర్గమును ఎన్నుకొనుము.',
    enterPrayerError: 'దయచేసి మీ ప్రార్థనా విన్నపమును వ్రాయుము.',
    prayerLengthError: 'ప్రార్థన 500 అక్షరములు లేక తక్కువగా ఉండవలెను.',
    shareAsGuest: 'అతిథిగా పంచుకొనుము',
    guestWarning: 'గమనిక: మీరు లాగిన్ కానందున, మీ ప్రార్థనల చరిత్ర ఈ పరికరంలో మాత్రమే భద్రపరచబడుతుంది. బ్రౌజర్ చరిత్ర లేదా కాష్‌ను తొలగిస్తే అది తుడిచిపెట్టుకుపోతుంది.',

    // Categories
    catHealth: 'ఆరోగ్యము',
    catMarriage: 'వివాహము',
    catFamily: 'కుటుంబము',
    catFinancial: 'ఆర్థికము',
    catEducation: 'విద్య',
    catJob: 'ఉద్యోగము',
    catTravel: 'ప్రయాణము',
    catMinistry: 'పరిచర్య',
    catGeneral: 'సాధారణము',
    catOther: 'ఇతరము',

    // Celebrate Page
    testimonies: 'సాక్ష్యములు',
    sacredStories: 'పవిత్ర కథలు',
    celebrateDesc: 'మన సంఘము యొక్క జీవితములలో దేవుని నమ్మకత్వపు అందమును చూడుము.',
    loadingTestimonies: 'సాక్ష్యములు వచ్చుచున్నవి...',
    noTestimonies: 'ఇంకను సాక్ష్యములు లేవు',
    noTestimoniesDesc: 'ప్రార్థనలు ఉత్తరమిచ్చి సాక్ష్యములు పంచబడినపుడు ఇక్కడ కనిపించును.',

    // Testimony Card
    godAnswered: '🎉 దేవుడు ఉత్తరమిచ్చెను',
    general: 'సాధారణము',

    // My Prayers Page
    myPrayers: 'నా ప్రార్థనలు',
    signInToView: 'చూచుటకు ప్రవేశించుము',
    signInToViewDesc: 'మీ ప్రార్థనా విన్నపములు చూచుటకు ప్రవేశించుము.',
    active: 'చురుకైనవి',
    answered: 'ఉత్తరమిచ్చినవి',
    loading: 'వచ్చుచున్నది...',
    noActivePrayers: 'చురుకైన ప్రార్థనలు లేవు',
    noActivePrayersDesc: 'ప్రారంభించుటకు ఒక ప్రార్థనా విన్నపమును పంచుకొనుము.',
    added: 'చేర్చినది',
    peoplePrayed: 'మంది ప్రార్థించిరి',
    markAnswered: '✓ ఉత్తరమిచ్చినదిగా గుర్తించుము',
    noAnsweredPrayers: 'ఇంకను ఉత్తరమిచ్చిన ప్రార్థనలు లేవు',
    noAnsweredPrayersDesc: 'దేవుడు ఉత్తరమిచ్చినపుడు ఇక్కడ గుర్తించుము.',
    shareTestimony: 'సాక్ష్యము పంచుకొనుము 🙌',
    yourTestimony: 'మీ సాక్ష్యము:',
    status: 'స్థితి',

    // Confirm Modal
    hasGodAnswered: 'దేవుడు మీ ప్రార్థనకు ఉత్తరమిచ్చెనా?',
    confirmModalText: 'ఉత్తరమిచ్చినదిగా గుర్తించిన తరువాత ప్రార్థనా గోడ నుండి తొలగించబడి మీ ఉత్తరమిచ్చినవి ట్యాబ్ లోనికి తరలించబడును.',
    yesAnswered: 'అవును, ఉత్తరమిచ్చెను',
    notYet: 'ఇంకా కాదు',

    // Undo Toast
    markedAsAnswered: 'ఉత్తరమిచ్చినదిగా గుర్తించబడినది.',
    undo: 'తిరిగి చేయుము',

    // Testimony Modal
    shareYourTestimony: 'మీ సాక్ష్యమును పంచుకొనుము',
    testimonyModalDesc: 'దేవుడు మీ ప్రార్థనకు ఎట్లు ఉత్తరమిచ్చెనో పంచుకొని ఇతరులను ప్రోత్సహించుము.',
    testimonyPlaceholder: 'దేవుడు మీ ప్రార్థనకు ఎట్లు ఉత్తరమిచ్చెనో పంచుకొనుము...',
    submitTestimony: 'సాక్ష్యమును సమర్పించుము',
    skipForNow: 'ప్రస్తుతమునకు దాటవేయుము',

    // Admin Dashboard
    adminDashboard: '⛪ నిర్వాహక ఫలకము',
    peaceBeWithYou: 'మీకు సమాధానము కలుగునుగాక,',
    adminDesc: 'ప్రార్థనా గోడ వ్యవస్థ యొక్క ప్రస్తుత స్థితి ఇక్కడ ఉన్నది.',
    today: 'నేడు',
    total: 'మొత్తము',
    activePrayers: 'చురుకైన ప్రార్థనలు',
    answeredPrayers: 'ఉత్తరమిచ్చిన ప్రార్థనలు',
    oldestActiveRequests: '❗ పురాతన చురుకైన విన్నపములు',
    posted: 'ప్రకటించినది',
    viewDetails: 'వివరములు చూడుము',
    markAsReachedOut: 'సంప్రదించినట్లు గుర్తించుము',
    pendingTestimonies: '🕐 పరిశీలనలో ఉన్న సాక్ష్యములు',
    approve: '✓ ఆమోదించుము',
    reject: '✕ తిరస్కరించుము',
    prayerManagement: '📋 ప్రార్థనల నిర్వహణ',
    prayerManagementDesc: 'సంఘము యొక్క ఇటీవలి విన్నపములను సమీక్షించి నిర్వహించుము.',
    contactPersonally: '📞 వ్యక్తిగతముగా సంప్రదించుము',
    deletePrayer: '🗑 తొలగించుము',
    deleteConfirm: 'ఈ ప్రార్థనను శాశ్వతముగా తొలగించవలెనా?',

    // Language toggle
    langEnglish: 'EN',
    langTelugu: 'తె',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('prayerwall-lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('prayerwall-lang', lang);
    // Set the html lang attribute for accessibility
    document.documentElement.lang = lang === 'te' ? 'te' : 'en';
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  const toggleLang = () => {
    setLang(prev => (prev === 'en' ? 'te' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
}
