/**
 * Curated Bible Verse Bank — comforting verses organized by prayer category.
 * Includes both English (ESV/NIV) and Telugu (BSI) versions.
 * getVerseForPrayer(category, prayerText) returns the best-matching verse
 * by scoring keyword overlap between the prayer text and verse text.
 */

const VERSE_BANK = {
  Health: [
    { reference: 'Jeremiah 30:17', text: 'For I will restore health to you, and your wounds I will heal, declares the LORD.', referenceTe: 'యిర్మీయా 30:17', textTe: 'నేను నీకు ఆరోగ్యము కలుగజేయుదును, నీ గాయములను మాన్పుదును; ఇదే యెహోవా వాక్కు.' },
    { reference: 'Psalm 103:2-3', text: 'Bless the LORD, O my soul, and forget not all his benefits, who forgives all your iniquity, who heals all your diseases.', referenceTe: 'కీర్తనలు 103:2-3', textTe: 'నా ప్రాణమా, యెహోవాను సన్నుతించుము, ఆయన చేసిన ఉపకారములలో దేనిని మరువకుము. ఆయన నీ దోషములన్నిటిని క్షమించువాడు, నీ సంకటములన్నిటిని కుదుర్చువాడు.' },
    { reference: 'Isaiah 53:5', text: 'But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.', referenceTe: 'యెషయా 53:5', textTe: 'మన అతిక్రమములనుబట్టి అతడు గాయపరచబడెను, మన దోషములనుబట్టి నలుగగొట్టబడెను; మన సమాధానార్థమైన శిక్ష అతనిమీద పడెను, అతడు పొందిన దెబ్బలచేత మనకు స్వస్థత కలుగుచున్నది.' },
    { reference: 'Exodus 15:26', text: 'For I am the LORD, your healer.', referenceTe: 'నిర్గమకాండము 15:26', textTe: 'నిన్ను స్వస్థపరచు యెహోవాను నేనే.' },
    { reference: 'James 5:15', text: 'And the prayer of faith will save the one who is sick, and the Lord will raise him up.', referenceTe: 'యాకోబు 5:15', textTe: 'విశ్వాససహితమైన ప్రార్థన ఆ రోగిని స్వస్థపరచును, ప్రభువు అతన్ని లేపును.' },
    { reference: 'Isaiah 41:10', text: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you.', referenceTe: 'యెషయా 41:10', textTe: 'భయపడకుము, నేను నీకు తోడైయున్నాను; దిగులుపడకుము, నేను నీ దేవుడను; నిన్ను బలపరతును, నీకు సహాయము చేయుదును.' }
  ],
  Marriage: [
    { reference: 'Ecclesiastes 4:12', text: 'A cord of three strands is not quickly broken.', referenceTe: 'ప్రసంగి 4:12', textTe: 'ముప్పేట త్రాడు త్వరగా తెగదు.' },
    { reference: '1 Corinthians 13:4-5', text: 'Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way.', referenceTe: '1 కొరింథీయులకు 13:4-5', textTe: 'ప్రేమ దీర్ఘకాలము సహించును, దయ చూపించును. ప్రేమ మత్సరపడదు; ప్రేమ డంబముగా ప్రవర్తించదు... అమర్యాదగా నడువదు, స్వప్రయోజనమును విచారించుకొనదు.' },
    { reference: 'Ephesians 4:2-3', text: 'With all humility and gentleness, with patience, bearing with one another in love, eager to maintain the unity of the Spirit in the bond of peace.', referenceTe: 'ఎఫెసీయులకు 4:2-3', textTe: 'మిగుల వినయముతోను సాత్వికముతోను దీర్ఘశాంతముతోను ఉండి, ప్రేమచేత ఒకరినొకరు సహించుచు, సమాధానమను బంధముచేత ఆత్మ కలిగించు ఐక్యమును కాపాడుకొనుటయందు ఆసక్తి గలవారై యుండుడి.' },
    { reference: 'Genesis 2:18', text: 'Then the LORD God said, "It is not good that the man should be alone; I will make him a helper fit for him."', referenceTe: 'ఆదికాండము 2:18', textTe: 'దేవుడైన యెహోవా - నరుడు ఒంటరిగా నుండుట మంచిది కాదు; వానికి సాటియైన సహాయమును వానికొరకు చేయుదుననుకొనెను.' },
    { reference: 'Proverbs 18:22', text: 'He who finds a wife finds a good thing and obtains favor from the LORD.', referenceTe: 'సామెతలు 18:22', textTe: 'భార్య దొరికినవానికి మేలు దొరికెను; అట్టివాడు యెహోవావలన అనుగ్రహము పొందినవాడు.' },
    { reference: 'Mark 10:9', text: 'What therefore God has joined together, let not man separate.', referenceTe: 'మార్కు 10:9', textTe: 'కాబట్టి దేవుడు జతపరచినవారిని మనుష్యుడు వేరుపరచకూడదు.' }
  ],
  Family: [
    { reference: 'Psalm 127:3', text: 'Behold, children are a heritage from the LORD, the fruit of the womb a reward.', referenceTe: 'కీర్తనలు 127:3', textTe: 'కుమారులు యెహోవా అనుగ్రహించు స్వాస్థ్యము, గర్భఫలము ఆయన ఇచ్చు బహుమానమే.' },
    { reference: 'Proverbs 22:6', text: 'Train up a child in the way he should go; even when he is old he will not depart from it.', referenceTe: 'సామెతలు 22:6', textTe: 'బాలుడు నడువవలసిన త్రోవను వానికి నేర్పుము; వాడు పెద్దవాడైనప్పుడు దానినుండి తొలగిపోడు.' },
    { reference: 'Joshua 24:15', text: 'But as for me and my house, we will serve the LORD.', referenceTe: 'యెహోషువ 24:15', textTe: 'నేనును నా యింటివారును యెహోవాను సేవించెదము.' },
    { reference: 'Psalm 133:1', text: 'Behold, how good and pleasant it is when brothers dwell in unity!', referenceTe: 'కీర్తనలు 133:1', textTe: 'సహోదరులు ఐక్యత కలిగి నివసించుట ఎంత శుభము ఎంత మనోహరము!' },
    { reference: 'Proverbs 17:6', text: 'Grandchildren are the crown of the aged, and the glory of children is their fathers.', referenceTe: 'సామెతలు 17:6', textTe: 'కుమారుల కుమారులు వృద్ధులకు కిరీటము; కుమారులకు వారి తండ్రులే అలంకారము.' },
    { reference: 'Psalm 128:3', text: 'Your wife will be like a fruitful vine within your house; your children will be like olive shoots around your table.', referenceTe: 'కీర్తనలు 128:3', textTe: 'నీ లోగిట నీ భార్య ఫలించు ద్రాక్షావల్లివలె ఉండును; నీ భోజనపు బల్ల చుట్టు నీ పిల్లలు ఒలీవ మొక్కలవలె ఉందురు.' }
  ],
  Financial: [
    { reference: 'Philippians 4:19', text: 'And my God will supply every need of yours according to his riches in glory in Christ Jesus.', referenceTe: 'ఫిలిప్పీయులకు 4:19', textTe: 'కాగా దేవుడు తన ఐశ్వర్యము చొప్పున క్రీస్తుయేసునందు మహిమలో మీ ప్రతి అవసరమును తీర్చును.' },
    { reference: 'Matthew 6:33', text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.', referenceTe: 'మత్తయి 6:33', textTe: 'కాబట్టి మీరు ఆయన రాజ్యమును నీతిని మొదట వెదకుడి; అప్పుడవన్నియు మీకనుగ్రహింపబడును.' },
    { reference: 'Proverbs 3:9-10', text: 'Honor the LORD with your wealth and with the firstfruits of all your produce; then your barns will be filled with plenty.', referenceTe: 'సామెతలు 3:9-10', textTe: 'నీ రాబడి అంతటిలో ప్రథమఫలమును నీ ఆస్తిలో భాగమును ఇచ్చి యెహోవాను ఘనపరచుము. అప్పుడు నీ కొట్లు సమృద్ధిగా నిండును.' },
    { reference: '2 Corinthians 9:8', text: 'And God is able to make all grace abound to you, so that having all sufficiency in all things at all times, you may abound in every good work.', referenceTe: '2 కొరింథీయులకు 9:8', textTe: 'మరియు అన్నిటియందు ఎల్లప్పుడును మీరే సంపూర్ణత గలవారై ప్రతి సత్కార్యమునకు సమృద్ధిగా ఉండునట్లు దేవుడు మీయెడల సమస్త విధములైన కృపను విస్తరింపజేయగలడు.' },
    { reference: 'Proverbs 10:22', text: 'The blessing of the LORD makes rich, and he adds no sorrow with it.', referenceTe: 'సామెతలు 10:22', textTe: 'యెహోవా ఆశీర్వాదము ఐశ్వర్యమిచ్చును, నరుల కష్టముచేత ఆ ఆశీర్వాదము ఎక్కువకాదు.' }
  ],
  Education: [
    { reference: 'Proverbs 2:6', text: 'For the LORD gives wisdom; from his mouth come knowledge and understanding.', referenceTe: 'సామెతలు 2:6', textTe: 'యెహోవాయే జ్ఞానమిచ్చువాడు, తెలివియు వివేచనయు ఆయన నోటనుండి వచ్చును.' },
    { reference: 'James 1:5', text: 'If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.', referenceTe: 'యాకోబు 1:5', textTe: 'మీలో ఎవనికైనను జ్ఞానము కొదువగా ఉన్నయెడల అతడు దేవుని అడుగవలెను, అప్పుడది అతనికి అనుగ్రహింపబడును. ఆయన ఎవనిని నిందింపక అందరికిని ధారాళముగా దయచేయువాడు.' },
    { reference: 'Psalm 119:105', text: 'Your word is a lamp to my feet and a light to my path.', referenceTe: 'కీర్తనలు 119:105', textTe: 'నీ వాక్యము నా పాదములకు దీపమును నా త్రోవకు వెలుగునై యున్నది.' },
    { reference: 'Proverbs 16:3', text: 'Commit your work to the LORD, and your plans will be established.', referenceTe: 'సామెతలు 16:3', textTe: 'నీ పనుల భారము యెహోవామీద మోపుము, అప్పుడు నీ ఉద్దేశములు సఫలమగును.' },
    { reference: 'Daniel 1:17', text: 'As for these four youths, God gave them learning and skill in all literature and wisdom.', referenceTe: 'దానియేలు 1:17', textTe: 'ఈ నలుగురు బాలురకు దేవుడు సమస్త విద్యాజ్ఞానములయందు తెలివియు వివేకమును దయచేసెను.' }
  ],
  Job: [
    { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.', referenceTe: 'యిర్మీయా 29:11', textTe: 'నేను మిమ్మునుగూర్చి ఉద్దేశించిన సంగతులను నేనెరుగుదును, రాబోవు కాలమందు మీకు నిరీక్షణ కలుగునట్లుగా అవి సమాధానకరమైన ఉద్దేశములే గాని హానికరమైనవి కావు; ఇదే యెహోవా వాక్కు.' },
    { reference: 'Colossians 3:23', text: 'Whatever you do, work heartily, as for the Lord and not for men.', referenceTe: 'కొలొస్సయులకు 3:23', textTe: 'మీరు ఏ పనిచేసినను మనుష్యుల నిమిత్తము కాక ప్రభువు నిమిత్తమే అని మనఃపూర్వకముగా చేయుడి.' },
    { reference: 'Psalm 90:17', text: 'Let the favor of the Lord our God be upon us, and establish the work of our hands upon us; yes, establish the work of our hands!', referenceTe: 'కీర్తనలు 90:17', textTe: 'మా దేవుడైన యెహోవా ప్రసన్నత మామీద నుండును గాక. మా చేతిపనిని మాకు స్థిరపరచుము, మా చేతిపనిని స్థిరపరచుము.' },
    { reference: 'Isaiah 43:19', text: 'Behold, I am doing a new thing; now it springs forth, do you not perceive it? I will make a way in the wilderness and rivers in the desert.', referenceTe: 'యెషయా 43:19', textTe: 'ఇదిగో నేనొక నూతనకార్యము చేయుచున్నాను; ఇప్పుడే అది మొలచుచున్నది, మీరు దానిని గ్రహింపలేరా? అరణ్యములో త్రోవను కలుగజేయుచున్నాను, ఎడారిలో నదులు పారజేయుచున్నాను.' },
    { reference: 'Psalm 37:5', text: 'Commit your way to the LORD; trust in him, and he will act.', referenceTe: 'కీర్తనలు 37:5', textTe: 'నీ మార్గమును యెహోవాకు అప్పగింపుము, నీవు ఆయనను నమ్ముకొనుము ఆయన నీ కార్యము నెరవేర్చును.' }
  ],
  Travel: [
    { reference: 'Psalm 121:8', text: 'The LORD will keep your going out and your coming in from this time forth and forevermore.', referenceTe: 'కీర్తనలు 121:8', textTe: 'ఇది మొదలుకొని నిరంతరము నీ రాకపోకలయందు యెహోవా నిన్ను కాపాడును.' },
    { reference: 'Proverbs 3:23', text: 'Then you will walk on your way securely, and your foot will not stumble.', referenceTe: 'సామెతలు 3:23', textTe: 'అప్పుడు నీవు నీ మార్గమున సురక్షితముగా నడిచెదవు, నీ పాదము ఎన్నడును తూలదు.' },
    { reference: 'Isaiah 43:2', text: 'When you pass through the waters, I will be with you; and through the rivers, they shall not overwhelm you.', referenceTe: 'యెషయా 43:2', textTe: 'నీవు జలములలోబడి దాటునప్పుడు నేను నీకు తోడైయుందును, నదులలోబడి వెళ్లునప్పుడు అవి నీమీద పొర్లిపారవు.' },
    { reference: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be frightened, for the LORD your God is with you wherever you go.', referenceTe: 'యెహోషువ 1:9', textTe: 'నేను నీకాజ్ఞాపించియున్నాను గదా, నిబ్బరముగలిగి ధైర్యముగా నుండుము, దిగులుపడకుము జడియకుము, నీవు నడుచు మార్గమంతటిలో నీ దేవుడైన యెహోవా నీకు తోడైయుండును.' },
    { reference: 'Genesis 28:15', text: 'Behold, I am with you and will keep you wherever you go.', referenceTe: 'ఆదికాండము 28:15', textTe: 'ఇదిగో నేను నీకు తోడైయుండి, నీవు వెళ్లు ప్రతి స్థలమందు నిన్ను కాపాడుచు... నేను నిన్ను విడువను.' }
  ],
  Ministry: [
    { reference: 'Matthew 28:19', text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit.', referenceTe: 'మత్తయి 28:19', textTe: 'కాబట్టి మీరు వెళ్లి, సమస్త జనులను శిష్యులనుగా చేయుడి; తండ్రి యొక్కయు కుమారుని యొక్కయు పరిశుద్ధాత్మ యొక్కయు నామములోనికి వారికి బాప్తిస్మమిచ్చుచు...' },
    { reference: 'Isaiah 6:8', text: 'And I heard the voice of the Lord saying, "Whom shall I send, and who will go for us?" Then I said, "Here I am! Send me."', referenceTe: 'యెషయా 6:8', textTe: 'అప్పుడు - నేను ఎవని పంపుదును? మా నిమిత్తము ఎవడు పోవునని ప్రభువు సెలవియ్యగా వింటిని. అంతట నేను - చిత్తగించుము నేనున్నాను నన్ను పంపుమంటిని.' },
    { reference: '1 Corinthians 15:58', text: 'Therefore, my beloved brothers, be steadfast, immovable, always abounding in the work of the Lord, knowing that in the Lord your labor is not in vain.', referenceTe: '1 కొరింథీయులకు 15:58', textTe: 'కాగా నా ప్రియ సహోదరులారా, మీ ప్రయాసము ప్రభువునందు వ్యర్థముకాదని యెరిగి, స్థిరులును, కదలనివారును, ప్రభువు కార్యాభివృద్ధియందు ఎప్పటికిని ఆసక్తులునై యుండుడి.' },
    { reference: 'Galatians 6:9', text: 'And let us not grow weary of doing good, for in due season we will reap, if we do not give up.', referenceTe: 'గలతీయులకు 6:9', textTe: 'మనము మేలుచేయుటయందు విసుకక యుందము. మనము అలయక మేలు చేసితిమేని తగినకాలమందు పంట కోతుము.' },
    { reference: 'Mark 16:15', text: 'And he said to them, "Go into all the world and proclaim the gospel to the whole creation."', referenceTe: 'మార్కు 16:15', textTe: 'మరియు ఆయన - మీరు సర్వలోకమునకు వెళ్లి సర్వసృష్టికి సువార్తను ప్రకటించుడి.' }
  ],
  General: [
    { reference: 'Romans 8:28', text: 'And we know that for those who love God all things work together for good, for those who are called according to his purpose.', referenceTe: 'రోమా 8:28', textTe: 'దేవుని ప్రేమించువారికి, అనగా ఆయన సంకల్పముచొప్పున పిలువబడినవారికి, మేలుకలుగుటకై సమస్తమును సమకూడి జరుగుచున్నవని యెరుగుదుము.' },
    { reference: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.', referenceTe: 'ఫిలిప్పీయులకు 4:6-7', textTe: 'దేనినిగూర్చియు చింతపడకుడి గాని ప్రతి విషయములోను ప్రార్థన విజ్ఞాపనములచేత కృతజ్ఞతాపూర్వకముగా మీ విన్నపములు దేవునికి తెలియజేయుడి.' },
    { reference: '1 Peter 5:7', text: 'Casting all your anxieties on him, because he cares for you.', referenceTe: '1 పేతురు 5:7', textTe: 'ఆయన మిమ్మునుగూర్చి చింతించుచున్నాడు గనుక మీ చింత యావత్తు ఆయనమీద వేయుడి.' },
    { reference: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.', referenceTe: 'కీర్తనలు 46:1', textTe: 'దేవుడు మనకు ఆశ్రయమును దుర్గమునై యున్నాడు, ఆపత్కాలములో ఆయన నమ్ముకొనదగిన సహాయకుడు.' },
    { reference: 'Matthew 7:7', text: 'Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.', referenceTe: 'మత్తయి 7:7', textTe: 'అడుగుడి మీకియ్యబడును, వెదకుడి మీకు దొరుకును, తట్టుడి మీకు తీయబడును.' }
  ],
  Other: [
    { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all your heart, and do not lean on your own understanding.', referenceTe: 'సామెతలు 3:5-6', textTe: 'నీ స్వబుద్ధిని ఆధారము చేసికొనక నీ పూర్ణహృదయముతో యెహోవాయందు నమ్మికయుంచుము. నీ ప్రవర్తన అంతటియందు ఆయన అధికారమునకు ఒప్పుకొనుము...' },
    { reference: 'Romans 15:13', text: 'May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.', referenceTe: 'రోమా 15:13', textTe: 'మీరు పరిశుద్ధాత్మ శక్తిపొంది నిరీక్షణ పూర్ణులగునట్లు, నిరీక్షణకర్తయగు దేవుడు విశ్వాసముద్వారా సమస్త ఆనందముతోను సమాధానముతోను మిమ్మును నింపును గాక.' },
    { reference: 'Hebrews 11:1', text: 'Now faith is the assurance of things hoped for, the conviction of things not seen.', referenceTe: 'హెబ్రీయులకు 11:1', textTe: 'విశ్వాసమనునది నిరీక్షింపబడువాటియొక్క నిజస్వరూపమును, అదృశ్యమైనవి యున్నవనుటకు రుజువునై యున్నది.' },
    { reference: 'Psalm 27:14', text: 'Wait for the LORD; be strong, and let your heart take courage; wait for the LORD!', referenceTe: 'కీర్తనలు 27:14', textTe: 'యెహోవాకొరకు కనిపెట్టుకొనుము, ధైర్యము తెచ్చుకొని నీ హృదయమును నిబ్బరముగా నుంచుకొనుము, యెహోవాకొరకు కనిపెట్టుకొనుము.' },
    { reference: '2 Corinthians 12:9', text: 'But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness."', referenceTe: '2 కొరింథీయులకు 12:9', textTe: 'అందుకు - నా కృప నీకు చాలును, బలహీనతయందు నా బలము పరిపూర్ణమగుచున్నదని ఆయన నాతో చెప్పెను.' }
  ]
};

/**
 * Get a comforting Bible verse for a prayer request.
 * Matches by category first, then scores keyword overlap with the prayer text.
 * Returns the best-matching verse, or a random verse from the category if no keywords match.
 *
 * @param {string} category — Prayer category (e.g. 'Health', 'Job', 'Family')
 * @param {string} prayerText — The user's prayer text
 * @returns {{ reference: string, text: string, referenceTe: string, textTe: string }}
 */
function getVerseForPrayer(category, prayerText) {
  const pool = VERSE_BANK[category] || VERSE_BANK['General'];

  if (!prayerText || prayerText.trim().length === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  const stopWords = new Set([
    'i', 'me', 'my', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'into', 'through', 'that', 'this',
    'it', 'its', 'not', 'no', 'so', 'if', 'can', 'will', 'do', 'has', 'have',
    'had', 'would', 'could', 'should', 'may', 'might', 'shall', 'about',
    'up', 'out', 'just', 'also', 'very', 'please', 'pray', 'prayer', 'god',
    'lord', 'jesus', 'need', 'help', 'want', 'ask', 'request',
  ]);

  const words = prayerText
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  if (words.length === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  let bestScore = -1;
  let bestVerses = [];

  for (const verse of pool) {
    const verseWords = verse.text.toLowerCase();
    let score = 0;
    for (const word of words) {
      if (verseWords.includes(word)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestVerses = [verse];
    } else if (score === bestScore) {
      bestVerses.push(verse);
    }
  }

  return bestVerses[Math.floor(Math.random() * bestVerses.length)];
}

module.exports = { getVerseForPrayer };
