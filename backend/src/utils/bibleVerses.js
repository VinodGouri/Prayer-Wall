/**
 * Curated Bible Verse Bank — comforting verses organized by prayer category.
 * Includes 10 verses per category in both English (ESV/NIV) and Telugu (BSI) versions.
 * getVerseForPrayer(category, prayerText) returns the best-matching verse
 * by scoring keyword overlap and emotion analysis between the prayer text and verse text.
 */

const VERSE_BANK = {
  Health: [
    { reference: 'Jeremiah 30:17', text: 'For I will restore health to you, and your wounds I will heal, declares the LORD.', referenceTe: 'యిర్మీయా 30:17', textTe: 'నేను నీకు ఆరోగ్యము కలుగజేయుదును, నీ గాయములను మాన్పుదును; ఇదే యెహోవా వాక్కు.' },
    { reference: 'Psalm 103:2-3', text: 'Bless the LORD, O my soul, and forget not all his benefits, who forgives all your iniquity, who heals all your diseases.', referenceTe: 'కీర్తనలు 103:2-3', textTe: 'నా ప్రాణమా, యెహోవాను సన్నుతించుము, ఆయన చేసిన ఉపకారములలో దేనిని మరువకుము. ఆయన నీ దోషములన్నిటిని క్షమించువాడు, నీ సంకటములన్నిటిని కుదుర్చువాడు.' },
    { reference: 'Isaiah 53:5', text: 'But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.', referenceTe: 'యెషయా 53:5', textTe: 'మన అతిక్రమములనుబట్టి అతడు గాయపరచబడెను, మన దోషములనుబట్టి నలుగగొట్టబడెను; మన సమాధానార్థమైన శిక్ష అతనిమీద పడెను, అతడు పొందిన దెబ్బలచేత మనకు స్వస్థత కలుగుచున్నది.' },
    { reference: 'Exodus 15:26', text: 'For I am the LORD, your healer.', referenceTe: 'నిర్గమకాండము 15:26', textTe: 'నిన్ను స్వస్థపరచు యెహోవాను నేనే.' },
    { reference: 'James 5:15', text: 'And the prayer of faith will save the one who is sick, and the Lord will raise him up.', referenceTe: 'యాకోబు 5:15', textTe: 'విశ్వాససహితమైన ప్రార్థన ఆ రోగిని స్వస్థపరచును, ప్రభువు అతన్ని లేపును.' },
    { reference: 'Isaiah 41:10', text: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you.', referenceTe: 'యెషయా 41:10', textTe: 'భయపడకుము, నేను నీకు తోడైయున్నాను; దిగులుపడకుము, నేను నీ దేవుడను; నిన్ను బలపరతును, నీకు సహాయము చేయుదును.' },
    { reference: 'Psalm 147:3', text: 'He heals the brokenhearted and binds up their wounds.', referenceTe: 'కీర్తనలు 147:3', textTe: 'గుండె చెదరినవారిని ఆయన బాగుచేయువాడు, వారి గాయములు కట్టువాడు.' },
    { reference: '3 John 1:2', text: 'Beloved, I pray that all may go well with you and that you may be in good health, as it goes well with your soul.', referenceTe: '3 యోహాను 1:2', textTe: 'ప్రియుడా, నీ ఆత్మ వర్ధిల్లుచున్న ప్రకారము నీవు అన్ని విషయములలోను వర్ధిల్లుచు ఆరోగ్యముగా ఉండవలెనని ప్రార్థించుచున్నాను.' },
    { reference: 'Psalm 41:3', text: 'The LORD sustains him on his sickbed; in his illness you restore him to full health.', referenceTe: 'కీర్తనలు 41:3', textTe: 'రోగశయ్యమీద యెహోవా అతన్ని ఆదరించును; రోగము కలుగగా నీవే అతన్ని స్వస్థపరచుదువు.' },
    { reference: 'Matthew 11:28', text: 'Come to me, all who labor and are heavy laden, and I will give you rest.', referenceTe: 'మత్తయి 11:28', textTe: 'ప్రయాసపడి భారము మోసికొనుచున్న సమస్త జనులారా, నా యొద్దకు రండి, నేను మీకు విశ్రాంతి కలుగజేతును.' }
  ],
  Marriage: [
    { reference: 'Ecclesiastes 4:12', text: 'A cord of three strands is not quickly broken.', referenceTe: 'ప్రసంగి 4:12', textTe: 'ముప్పేట త్రాడు త్వరగా తెగదు.' },
    { reference: '1 Corinthians 13:4-5', text: 'Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It does not insist on its own way.', referenceTe: '1 కొరింథీయులకు 13:4-5', textTe: 'ప్రేమ దీర్ఘకాలము సహించును, దయ చూపించును. ప్రేమ మత్సరపడదు; ప్రేమ డంబముగా ప్రవర్తించదు... అమర్యాదగా నడువదు, స్వప్రయోజనమును విచారించుకొనదు.' },
    { reference: 'Ephesians 4:2-3', text: 'With all humility and gentleness, with patience, bearing with one another in love, eager to maintain the unity of the Spirit in the bond of peace.', referenceTe: 'ఎఫెసీయులకు 4:2-3', textTe: 'మిగుల వినయముతోను సాత్వికముతోను దీర్ఘశాంతముతోను ఉండి, ప్రేమచేత ఒకరినొకరు సహించుచు, సమాధానమను బంధముచేత ఆత్మ కలిగించు ఐక్యమును కాపాడుకొనుటయందు ఆసక్తి గలవారై యుండుడి.' },
    { reference: 'Genesis 2:18', text: 'Then the LORD God said, "It is not good that the man should be alone; I will make him a helper fit for him."', referenceTe: 'ఆదికాండము 2:18', textTe: 'దేవుడైన యెహోవా - నరుడు ఒంటరిగా నుండుట మంచిది కాదు; వానికి సాటియైన సహాయమును వానికొరకు చేయుదుననుకొనెను.' },
    { reference: 'Proverbs 18:22', text: 'He who finds a wife finds a good thing and obtains favor from the LORD.', referenceTe: 'సామెతలు 18:22', textTe: 'భార్య దొరికినవానికి మేలు దొరికెను; అట్టివాడు యెహోవావలన అనుగ్రహము పొందినవాడు.' },
    { reference: 'Mark 10:9', text: 'What therefore God has joined together, let not man separate.', referenceTe: 'మార్కు 10:9', textTe: 'కాబట్టి దేవుడు జతపరచినవారిని మనుష్యుడు వేరుపరచకూడదు.' },
    { reference: '1 Peter 4:8', text: 'Above all, keep loving one another earnestly, since love covers a multitude of sins.', referenceTe: '1 పేతురు 4:8', textTe: 'ప్రేమ అనేక పాపములను కప్పును గనుక అన్నిటికంటె ముఖ్యముగా ఒకరియెడల ఒకరు మిక్కటమైన ప్రేమ గలవారై యుండుడి.' },
    { reference: 'Ephesians 5:25', text: 'Husbands, love your wives, as Christ loved the church and gave himself up for her.', referenceTe: 'ఎఫెసీయులకు 5:25', textTe: 'పురుషులారా, మీరును మీ భార్యలను ప్రేమించుడి. అటువలె క్రీస్తుకూడ సంఘమును ప్రేమించి... తన్ను తాను అప్పగించుకొనెను.' },
    { reference: 'Colossians 3:14', text: 'And above all these put on love, which binds everything together in perfect harmony.', referenceTe: 'కొలొస్సయులకు 3:14', textTe: 'వీటన్నిటిపైన పరిపూర్ణతకు బంధమైన ప్రేమను ధరించుకొనుడి.' },
    { reference: 'Song of Solomon 8:7', text: 'Many waters cannot quench love, neither can floods drown it.', referenceTe: 'పరమగీతము 8:7', textTe: 'అనేక జలములు ప్రేమను ఆర్పజాలవు, నదులు దానిని ముంచివేయజాలవు.' }
  ],
  Family: [
    { reference: 'Psalm 127:3', text: 'Behold, children are a heritage from the LORD, the fruit of the womb a reward.', referenceTe: 'కీర్తనలు 127:3', textTe: 'కుమారులు యెహోవా అనుగ్రహించు స్వాస్థ్యము, గర్భఫలము ఆయన ఇచ్చు బహుమానమే.' },
    { reference: 'Proverbs 22:6', text: 'Train up a child in the way he should go; even when he is old he will not depart from it.', referenceTe: 'సామెతలు 22:6', textTe: 'బాలుడు నడువవలసిన త్రోవను వానికి నేర్పుము; వాడు పెద్దవాడైనప్పుడు దానినుండి తొలగిపోడు.' },
    { reference: 'Joshua 24:15', text: 'But as for me and my house, we will serve the LORD.', referenceTe: 'యెహోషువ 24:15', textTe: 'నేనును నా యింటివారును యెహోవాను సేవించెదము.' },
    { reference: 'Psalm 133:1', text: 'Behold, how good and pleasant it is when brothers dwell in unity!', referenceTe: 'కీర్తనలు 133:1', textTe: 'సహోదరులు ఐక్యత కలిగి నివసించుట ఎంత శుభము ఎంత మనోహరము!' },
    { reference: 'Proverbs 17:6', text: 'Grandchildren are the crown of the aged, and the glory of children is their fathers.', referenceTe: 'సామెతలు 17:6', textTe: 'కుమారుల కుమారులు వృద్ధులకు కిరీటము; కుమారులకు వారి తండ్రులే అలంకారము.' },
    { reference: 'Psalm 128:3', text: 'Your wife will be like a fruitful vine within your house; your children will be like olive shoots around your table.', referenceTe: 'కీర్తనలు 128:3', textTe: 'నీ లోగిట నీ భార్య ఫలించు ద్రాక్షావల్లివలె ఉండును; నీ భోజనపు బల్ల చుట్టు నీ పిల్లలు ఒలీవ మొక్కలవలె ఉందురు.' },
    { reference: 'Ephesians 6:4', text: 'Fathers, do not provoke your children to anger, but bring them up in the discipline and instruction of the Lord.', referenceTe: 'ఎఫెసీయులకు 6:4', textTe: 'తండ్రులారా, మీ కోపమును మీ పిల్లలమీద రేపక, ప్రభువు శిక్షలోను బోధలోను వారిని పెంచుడి.' },
    { reference: '1 Timothy 5:8', text: 'But if anyone does not provide for his relatives, and especially for members of his household, he has denied the faith.', referenceTe: '1 తిమోతి 5:8', textTe: 'ఎవడైనను స్వకీయులను, విశేషముగా తన యింటివారిని, సంరక్షించనియెడల వాడు విశ్వాసము త్యజించినవాడై అవిశ్వాసికన్న చెడ్డవాడై యుండును.' },
    { reference: 'Proverbs 31:28', text: 'Her children rise up and call her blessed; her husband also, and he praises her.', referenceTe: 'సామెతలు 31:28', textTe: 'ఆమె పిల్లలు లేచి ఆమెను ధన్యురాలందురు; ఆమె పెనిమిటి ఆమెను పొగడును.' },
    { reference: 'Colossians 3:13', text: 'Bearing with one another and, if one has a complaint against another, forgiving each other; as the Lord has forgiven you, so you also must forgive.', referenceTe: 'కొలొస్సయులకు 3:13', textTe: 'ఎవనిమీదనైనను ఎవనికైనను వ్యాజ్యెముండినయెడల ఒకరినొకరు సహించుచు ఒకరినొకరు క్షమించుడి; ప్రభువు మిమ్మును క్షమించినలాగున మీరును క్షమించుడి.' }
  ],
  Financial: [
    { reference: 'Philippians 4:19', text: 'And my God will supply every need of yours according to his riches in glory in Christ Jesus.', referenceTe: 'ఫిలిప్పీయులకు 4:19', textTe: 'కాగా దేవుడు తన ఐశ్వర్యము చొప్పున క్రీస్తుయేసునందు మహిమలో మీ ప్రతి అవసరమును తీర్చును.' },
    { reference: 'Matthew 6:33', text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.', referenceTe: 'మత్తయి 6:33', textTe: 'కాబట్టి మీరు ఆయన రాజ్యమును నీతిని మొదట వెదకుడి; అప్పుడవన్నియు మీకనుగ్రహింపబడును.' },
    { reference: 'Proverbs 3:9-10', text: 'Honor the LORD with your wealth and with the firstfruits of all your produce; then your barns will be filled with plenty.', referenceTe: 'సామెతలు 3:9-10', textTe: 'నీ రాబడి అంతటిలో ప్రథమఫలమును నీ ఆస్తిలో భాగమును ఇచ్చి యెహోవాను ఘనపరచుము. అప్పుడు నీ కొట్లు సమృద్ధిగా నిండును.' },
    { reference: '2 Corinthians 9:8', text: 'And God is able to make all grace abound to you, so that having all sufficiency in all things at all times, you may abound in every good work.', referenceTe: '2 కొరింథీయులకు 9:8', textTe: 'మరియు అన్నిటియందు ఎల్లప్పుడును మీరే సంపూర్ణత గలవారై ప్రతి సత్కార్యమునకు సమృద్ధిగా ఉండునట్లు దేవుడు మీయెడల సమస్త విధములైన కృపను విస్తరింపజేయగలడు.' },
    { reference: 'Proverbs 10:22', text: 'The blessing of the LORD makes rich, and he adds no sorrow with it.', referenceTe: 'సామెతలు 10:22', textTe: 'యెహోవా ఆశీర్వాదము ఐశ్వర్యమిచ్చును, నరుల కష్టముచేత ఆ ఆశీర్వాదము ఎక్కువకాదు.' },
    { reference: 'Deuteronomy 28:12', text: 'The LORD will open to you his good treasury, the heavens, to give the rain to your land in its season and to bless all the work of your hands.', referenceTe: 'ద్వితీయోపదేశకాండము 28:12', textTe: 'యెహోవా నీ దేశమునకు వర్షమును దాని కాలమందు కురిపించుటకును నీవు చేయు పనులన్నిటిని ఆశీర్వదించుటకును, తన మంచి ధననిధియైన ఆకాశమును తెరచును.' },
    { reference: 'Malachi 3:10', text: 'Bring the full tithe into the storehouse, that there may be food in my house. And thereby put me to the test, says the LORD of hosts...', referenceTe: 'మలాకీ 3:10', textTe: 'నా మందిరములో ఆహారముండునట్లు పదియవభాగమంతయు మీరు నా మందిరపు నిధిలోనికి తీసికొనిరండి... నేను ఆకాశపు వాకిండ్లను విప్పి, పట్టజాలనంత విస్తారముగా దీవెనలు కుమ్మరించెదనని సైన్యములకు అధిపతియగు యెహోవా సెలవిచ్చుచున్నాడు.' },
    { reference: 'Luke 6:38', text: 'Give, and it will be given to you. Good measure, pressed down, shaken together, running over, will be put into your lap.', referenceTe: 'లూకా 6:38', textTe: 'ఇయ్యుడి, అప్పుడు మీకియ్యబడును; అణచి కుదిలించి దిగజారునట్లు నిండుకొలతను మనుష్యులు మీ ఒడిలో కొలుతురు.' },
    { reference: 'Psalm 37:25', text: 'I have been young, and now am old, yet I have not seen the righteous forsaken or his children begging for bread.', referenceTe: 'కీర్తనలు 37:25', textTe: 'నేను చిన్నవాడనై యుంటిని ఇప్పుడు ముసలివాడనై యున్నాను, అయినను నీతిమంతులు విడువబడుట గాని వారి సంతానము భిక్షమెత్తుట గాని నేను చూచియుండలేదు.' },
    { reference: 'Psalm 34:10', text: 'The young lions suffer want and hunger; but those who seek the LORD lack no good thing.', referenceTe: 'కీర్తనలు 34:10', textTe: 'సింహపు పిల్లలు లేమిగలవై ఆకలిగొనును, యెహోవాను ఆశ్రయించువారికి ఏ మేలు కొదువయై యుండదు.' }
  ],
  Education: [
    { reference: 'Proverbs 2:6', text: 'For the LORD gives wisdom; from his mouth come knowledge and understanding.', referenceTe: 'సామెతలు 2:6', textTe: 'యెహోవాయే జ్ఞానమిచ్చువాడు, తెలివియు వివేచనయు ఆయన నోటనుండి వచ్చును.' },
    { reference: 'James 1:5', text: 'If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.', referenceTe: 'యాకోబు 1:5', textTe: 'మీలో ఎవనికైనను జ్ఞానము కొదువగా ఉన్నయెడల అతడు దేవుని అడుగవలెను, అప్పుడది అతనికి అనుగ్రహింపబడును. ఆయన ఎవనిని నిందింపక అందరికిని ధారాళముగా దయచేయువాడు.' },
    { reference: 'Psalm 119:105', text: 'Your word is a lamp to my feet and a light to my path.', referenceTe: 'కీర్తనలు 119:105', textTe: 'నీ వాక్యము నా పాదములకు దీపమును నా త్రోవకు వెలుగునై యున్నది.' },
    { reference: 'Proverbs 16:3', text: 'Commit your work to the LORD, and your plans will be established.', referenceTe: 'సామెతలు 16:3', textTe: 'నీ పనుల భారము యెహోవామీద మోపుము, అప్పుడు నీ ఉద్దేశములు సఫలమగును.' },
    { reference: 'Daniel 1:17', text: 'As for these four youths, God gave them learning and skill in all literature and wisdom.', referenceTe: 'దానియేలు 1:17', textTe: 'ఈ నలుగురు బాలురకు దేవుడు సమస్త విద్యాజ్ఞానములయందు తెలివియు వివేకమును దయచేసెను.' },
    { reference: 'Proverbs 1:7', text: 'The fear of the LORD is the beginning of knowledge; fools despise wisdom and instruction.', referenceTe: 'సామెతలు 1:7', textTe: 'యెహోవాయందు భయభక్తులు నిలుపుటయే తెలివికి మూలము.' },
    { reference: 'Isaiah 28:26', text: 'For his God instructs him and teaches him the right way.', referenceTe: 'యెషయా 28:26', textTe: 'వాని దేవుడే వానికి తగిన క్రమము నేర్పి వానికి ఉపదేశము చేయును.' },
    { reference: 'Psalm 32:8', text: 'I will instruct you and teach you in the way you should go; I will counsel you with my eye upon you.', referenceTe: 'కీర్తనలు 32:8', textTe: 'నీవు నడవవలసిన మార్గమును నీకు బోధించెదను, నీమీద దృష్టియుంచి నీకు ఆలోచన చెప్పెదను.' },
    { reference: 'Proverbs 4:7', text: 'The beginning of wisdom is this: Get wisdom, and whatever you get, get insight.', referenceTe: 'సామెతలు 4:7', textTe: 'జ్ఞానము సంపాదించుకొనుటయే జ్ఞానమునకు ముఖ్యము.' },
    { reference: 'Colossians 2:3', text: 'In whom are hidden all the treasures of wisdom and knowledge.', referenceTe: 'కొలొస్సయులకు 2:3', textTe: 'బుద్ధి జ్ఞానముల సర్వసంపదలు ఆయనయందే గుప్తమైయున్నవి.' }
  ],
  Job: [
    { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.', referenceTe: 'యిర్మీయా 29:11', textTe: 'నేను మిమ్మునుగూర్చి ఉద్దేశించిన సంగతులను నేనెరుగుదును, రాబోవు కాలమందు మీకు నిరీక్షణ కలుగునట్లుగా అవి సమాధానకరమైన ఉద్దేశములే గాని హానికరమైనవి కావు; ఇదే యెహోవా వాక్కు.' },
    { reference: 'Colossians 3:23', text: 'Whatever you do, work heartily, as for the Lord and not for men.', referenceTe: 'కొలొస్సయులకు 3:23', textTe: 'మీరు ఏ పనిచేసినను మనుష్యుల నిమిత్తము కాక ప్రభువు నిమిత్తమే అని మనఃపూర్వకముగా చేయుడి.' },
    { reference: 'Psalm 90:17', text: 'Let the favor of the Lord our God be upon us, and establish the work of our hands upon us; yes, establish the work of our hands!', referenceTe: 'కీర్తనలు 90:17', textTe: 'మా దేవుడైన యెహోవా ప్రసన్నత మామీద నుండును గాక. మా చేతిపనిని మాకు స్థిరపరచుము, మా చేతిపనిని స్థిరపరచుము.' },
    { reference: 'Isaiah 43:19', text: 'Behold, I am doing a new thing; now it springs forth, do you not perceive it? I will make a way in the wilderness and rivers in the desert.', referenceTe: 'యెషయా 43:19', textTe: 'ఇదిగో నేనొక నూతనకార్యము చేయుచున్నాను; ఇప్పుడే అది మొలచుచున్నది, మీరు దానిని గ్రహింపలేరా? అరణ్యములో త్రోవను కలుగజేయుచున్నాను, ఎడారిలో నదులు పారజేయుచున్నాను.' },
    { reference: 'Psalm 37:5', text: 'Commit your way to the LORD; trust in him, and he will act.', referenceTe: 'కీర్తనలు 37:5', textTe: 'నీ మార్గమును యెహోవాకు అప్పగింపుము, నీవు ఆయనను నమ్ముకొనుము ఆయన నీ కార్యము నెరవేర్చును.' },
    { reference: 'Deuteronomy 28:8', text: 'The LORD will command the blessing on you in your barns and in all that you undertake.', referenceTe: 'ద్వితీయోపదేశకాండము 28:8', textTe: 'నీ కొట్లలోను నీవు చేయు ప్రయత్నములన్నిటిలోను నీకు దీవెన కలుగునట్లు యెహోవా ఆజ్ఞాపించును.' },
    { reference: 'Philippians 4:13', text: 'I can do all things through him who strengthens me.', referenceTe: 'ఫిలిప్పీయులకు 4:13', textTe: 'నన్ను బలపరచువానియందే నేను సమస్తమును చేయగలను.' },
    { reference: 'Isaiah 40:31', text: 'But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary.', referenceTe: 'యెషయా 40:31', textTe: 'యెహోవాకొరకు ఎదురుచూచువారు నూతన బలము పొందుదురు. వారు పక్షిరాజులవలె రెక్కలు చాపి పైకి ఎగురుదురు, అలయక పరుగెత్తుదురు, సొమ్మసిల్లక నడిచిపోవుదురు.' },
    { reference: 'Psalm 75:6-7', text: 'For not from the east or from the west... but it is God who executes judgment.', referenceTe: 'కీర్తనలు 75:6-7', textTe: 'తూర్పునుండియైనను పడమటినుండియైనను అరణ్యమునుండియైనను హెచ్చు కలుగదు. దేవుడే తీర్పు తీర్చువాడు.' },
    { reference: 'Proverbs 22:29', text: 'Do you see a man skillful in his work? He will stand before kings.', referenceTe: 'సామెతలు 22:29', textTe: 'పనియందు నేర్పుగలవానిని చూచితివా? వాడు రాజుల సముఖముననే నిలుచును గాని అల్పుల సముఖమున నిలువడు.' }
  ],
  Travel: [
    { reference: 'Psalm 121:8', text: 'The LORD will keep your going out and your coming in from this time forth and forevermore.', referenceTe: 'కీర్తనలు 121:8', textTe: 'ఇది మొదలుకొని నిరంతరము నీ రాకపోకలయందు యెహోవా నిన్ను కాపాడును.' },
    { reference: 'Proverbs 3:23', text: 'Then you will walk on your way securely, and your foot will not stumble.', referenceTe: 'సామెతలు 3:23', textTe: 'అప్పుడు నీవు నీ మార్గమున సురక్షితముగా నడిచెదవు, నీ పాదము ఎన్నడును తూలదు.' },
    { reference: 'Isaiah 43:2', text: 'When you pass through the waters, I will be with you; and through the rivers, they shall not overwhelm you.', referenceTe: 'యెషయా 43:2', textTe: 'నీవు జలములలోబడి దాటునప్పుడు నేను నీకు తోడైయుందును, నదులలోబడి వెళ్లునప్పుడు అవి నీమీద పొర్లిపారవు.' },
    { reference: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be frightened, for the LORD your God is with you wherever you go.', referenceTe: 'యెహోషువ 1:9', textTe: 'నేను నీకాజ్ఞాపించియున్నాను గదా, నిబ్బరముగలిగి ధైర్యముగా నుండుము, దిగులుపడకుము జడియకుము, నీవు నడుచు మార్గమంతటిలో నీ దేవుడైన యెహోవా నీకు తోడైయుండును.' },
    { reference: 'Genesis 28:15', text: 'Behold, I am with you and will keep you wherever you go.', referenceTe: 'ఆదికాండము 28:15', textTe: 'ఇదిగో నేను నీకు తోడైయుండి, నీవు వెళ్లు ప్రతి స్థలమందు నిన్ను కాపాడుచు... నేను నిన్ను విడువను.' },
    { reference: 'Psalm 91:11', text: 'For he will command his angels concerning you to guard you in all your ways.', referenceTe: 'కీర్తనలు 91:11', textTe: 'నీ మార్గములన్నిటిలో నిన్ను కాపాడుటకు ఆయన నిన్నుగూర్చి తన దూతలకు ఆజ్ఞాపించును.' },
    { reference: 'Numbers 6:24-26', text: 'The LORD bless you and keep you; the LORD make his face to shine upon you and be gracious to you.', referenceTe: 'సంఖ్యాకాండము 6:24-26', textTe: 'యెహోవా నిన్ను ఆశీర్వదించి నిన్ను కాపాడును గాక; యెహోవా నీకు తన ముఖప్రకాశమును చూపి నిన్ను కరుణించును గాక.' },
    { reference: 'Psalm 23:4', text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me.', referenceTe: 'కీర్తనలు 23:4', textTe: 'గాఢాంధకారపు లోయలో నేను సంచరించినను ఏ అపాయమునకు భయపడను, నీవు నాకు తోడై యుందువు.' },
    { reference: 'Psalm 139:9-10', text: 'If I take the wings of the morning and dwell in the uttermost parts of the sea, even there your hand shall lead me.', referenceTe: 'కీర్తనలు 139:9-10', textTe: 'వేకువ రెక్కలు కట్టుకొని సముద్రదిగంతములలో నేను నివసించినను, అక్కడను నీ చేయి నన్ను నడిపించును.' },
    { reference: 'Deuteronomy 31:8', text: 'It is the LORD who goes before you. He will be with you; he will not leave you or forsake you. Do not fear or be dismayed.', referenceTe: 'ద్వితీయోపదేశకాండము 31:8', textTe: 'యెహోవాయే నీ ముందర నడుచువాడు, ఆయన నీకు తోడైయుండును, ఆయన నిన్ను విడువడు నిన్ను ఎడబాయడు, భయపడకుము విస్మయమొందకుము.' }
  ],
  Ministry: [
    { reference: 'Matthew 28:19-20', text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them...', referenceTe: 'మత్తయి 28:19-20', textTe: 'కాబట్టి మీరు వెళ్లి, సమస్త జనులను శిష్యులనుగా చేయుడి; తండ్రి యొక్కయు కుమారుని యొక్కయు పరిశుద్ధాత్మ యొక్కయు నామములోనికి వారికి బాప్తిస్మమిచ్చుచు...' },
    { reference: 'Isaiah 6:8', text: 'And I heard the voice of the Lord saying, "Whom shall I send, and who will go for us?" Then I said, "Here I am! Send me."', referenceTe: 'యెషయా 6:8', textTe: 'అప్పుడు - నేను ఎవని పంపుదును? మా నిమిత్తము ఎవడు పోవునని ప్రభువు సెలవియ్యగా వింటిని. అంతట నేను - చిత్తగించుము నేనున్నాను నన్ను పంపుమంటిని.' },
    { reference: '1 Corinthians 15:58', text: 'Therefore, my beloved brothers, be steadfast, immovable, always abounding in the work of the Lord, knowing that in the Lord your labor is not in vain.', referenceTe: '1 కొరింథీయులకు 15:58', textTe: 'కాగా నా ప్రియ సహోదరులారా, మీ ప్రయాసము ప్రభువునందు వ్యర్థముకాదని యెరిగి, స్థిరులును, కదలనివారును, ప్రభువు కార్యాభివృద్ధియందు ఎప్పటికిని ఆసక్తులునై యుండుడి.' },
    { reference: 'Galatians 6:9', text: 'And let us not grow weary of doing good, for in due season we will reap, if we do not give up.', referenceTe: 'గలతీయులకు 6:9', textTe: 'మనము మేలుచేయుటయందు విసుకక యుందము. మనము అలయక మేలు చేసితిమేని తగినకాలమందు పంట కోతుము.' },
    { reference: 'Mark 16:15', text: 'And he said to them, "Go into all the world and proclaim the gospel to the whole creation."', referenceTe: 'మార్కు 16:15', textTe: 'మరియు ఆయన - మీరు సర్వలోకమునకు వెళ్లి సర్వసృష్టికి సువార్తను ప్రకటించుడి.' },
    { reference: '1 Peter 4:10', text: 'As each has received a gift, use it to serve one another, as good stewards of God\'s varied grace.', referenceTe: '1 పేతురు 4:10', textTe: 'దేవుని నానావిధమైన కృపవిషయమై మంచి గృహనిర్వాహకులై, మీలో ప్రతివాడును తనకు ఏ కృపావరము లభించెనో దానిచొప్పున ఒకనికొకడు ఉపచారము చేయుడి.' },
    { reference: '2 Timothy 4:2', text: 'Preach the word; be ready in season and out of season; reprove, rebuke, and exhort, with complete patience and teaching.', referenceTe: '2 తిమోతి 4:2', textTe: 'వాక్యమును ప్రకటించుము; సమయమందును అసమయమందును ప్రయాసపడుము.' },
    { reference: 'Acts 1:8', text: 'But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses.', referenceTe: 'అపొస్తలుల కార్యములు 1:8', textTe: 'అయితే పరిశుద్ధాత్మ మీమీదికి వచ్చినప్పుడు మీరు శక్తిపొందెదరు గనుక మీరు... నాకు సాక్షులై యుందురని వారితో చెప్పెను.' },
    { reference: 'Romans 10:15', text: 'How beautiful are the feet of those who preach the good news!', referenceTe: 'రోమా 10:15', textTe: 'ఉత్తమమైనవాటినిగూర్చిన సువార్త ప్రకటించువారి పాదములెంతో అందమైనవి.' },
    { reference: 'Ephesians 2:10', text: 'For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand...', referenceTe: 'ఎఫెసీయులకు 2:10', textTe: 'మరియు వాటియందు మనము నడుచుకొనవలెనని దేవుడు ముందుగా సిద్ధపరచిన సత్క్రియలు చేయుటకై, మనము క్రీస్తుయేసునందు సృజింపబడినవారమై ఆయన చేసిన పనియై యున్నాము.' }
  ],
  General: [
    { reference: 'Romans 8:28', text: 'And we know that for those who love God all things work together for good, for those who are called according to his purpose.', referenceTe: 'రోమా 8:28', textTe: 'దేవుని ప్రేమించువారికి, అనగా ఆయన సంకల్పముచొప్పున పిలువబడినవారికి, మేలుకలుగుటకై సమస్తమును సమకూడి జరుగుచున్నవని యెరుగుదుము.' },
    { reference: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.', referenceTe: 'ఫిలిప్పీయులకు 4:6-7', textTe: 'దేనినిగూర్చియు చింతపడకుడి గాని ప్రతి విషయములోను ప్రార్థన విజ్ఞాపనములచేత కృతజ్ఞతాపూర్వకముగా మీ విన్నపములు దేవునికి తెలియజేయుడి.' },
    { reference: '1 Peter 5:7', text: 'Casting all your anxieties on him, because he cares for you.', referenceTe: '1 పేతురు 5:7', textTe: 'ఆయన మిమ్మునుగూర్చి చింతించుచున్నాడు గనుక మీ చింత యావత్తు ఆయనమీద వేయుడి.' },
    { reference: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.', referenceTe: 'కీర్తనలు 46:1', textTe: 'దేవుడు మనకు ఆశ్రయమును దుర్గమునై యున్నాడు, ఆపత్కాలములో ఆయన నమ్ముకొనదగిన సహాయకుడు.' },
    { reference: 'Matthew 7:7', text: 'Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.', referenceTe: 'మత్తయి 7:7', textTe: 'అడుగుడి మీకియ్యబడును, వెదకుడి మీకు దొరుకును, తట్టుడి మీకు తీయబడును.' },
    { reference: 'Psalm 55:22', text: 'Cast your burden on the LORD, and he will sustain you; he will never permit the righteous to be moved.', referenceTe: 'కీర్తనలు 55:22', textTe: 'నీ భారము యెహోవామీద మోపుము, ఆయనే నిన్ను ఆదుకొనును.' },
    { reference: 'Nahum 1:7', text: 'The LORD is good, a stronghold in the day of trouble; he knows those who take refuge in him.', referenceTe: 'నహూము 1:7', textTe: 'యెహోవా ఉత్తముడు, శ్రమ దినమందు ఆయన ఆశ్రయదుర్గము.' },
    { reference: 'Psalm 34:17-18', text: 'When the righteous cry for help, the LORD hears and delivers them out of all their troubles. The LORD is near to the brokenhearted and saves the crushed in spirit.', referenceTe: 'కీర్తనలు 34:17-18', textTe: 'నీతిమంతులు మొఱ్ఱపెట్టగా యెహోవా ఆలకించును, వారి శ్రమలన్నిటిలోనుండి వారిని విడిపించును. విరిగిన హృదయము గలవారికి యెహోవా ఆసన్నుడు.' },
    { reference: 'Lamentations 3:22-23', text: 'The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.', referenceTe: 'విలాపవాక్యములు 3:22-23', textTe: 'యెహోవా కృపావాత్సల్యములు ఎడతెగక నిలుచుచున్నవి, అవి అనుదినము నూతనముగా పుట్టుచున్నవి, నీ విశ్వాస్యత గొప్పది.' },
    { reference: 'John 16:33', text: 'I have said these things to you, that in me you may have peace. In the world you will have tribulation. But take heart; I have overcome the world.', referenceTe: 'యోహాను 16:33', textTe: 'నాయందు మీకు సమాధానము కలుగునట్లు ఈ మాటలు మీతో చెప్పుచున్నాను. లోకములో మీకు శ్రమ కలుగును; అయినను ధైర్యము తెచ్చుకొనుడి, నేను లోకమును జయించియున్నాననెను.' }
  ],
  Other: [
    { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.', referenceTe: 'సామెతలు 3:5-6', textTe: 'నీ స్వబుద్ధిని ఆధారము చేసికొనక నీ పూర్ణహృదయముతో యెహోవాయందు నమ్మికయుంచుము. నీ ప్రవర్తన అంతటియందు ఆయన అధికారమునకు ఒప్పుకొనుము...' },
    { reference: 'Romans 15:13', text: 'May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.', referenceTe: 'రోమా 15:13', textTe: 'మీరు పరిశుద్ధాత్మ శక్తిపొంది నిరీక్షణ పూర్ణులగునట్లు, నిరీక్షణకర్తయగు దేవుడు విశ్వాసముద్వారా సమస్త ఆనందముతోను సమాధానముతోను మిమ్మును నింపును గాక.' },
    { reference: 'Hebrews 11:1', text: 'Now faith is the assurance of things hoped for, the conviction of things not seen.', referenceTe: 'హెబ్రీయులకు 11:1', textTe: 'విశ్వాసమనునది నిరీక్షింపబడువాటియొక్క నిజస్వరూపమును, అదృశ్యమైనవి యున్నవనుటకు రుజువునై యున్నది.' },
    { reference: 'Psalm 27:14', text: 'Wait for the LORD; be strong, and let your heart take courage; wait for the LORD!', referenceTe: 'కీర్తనలు 27:14', textTe: 'యెహోవాకొరకు కనిపెట్టుకొనుము, ధైర్యము తెచ్చుకొని నీ హృదయమును నిబ్బరముగా నుంచుకొనుము, యెహోవాకొరకు కనిపెట్టుకొనుము.' },
    { reference: '2 Corinthians 12:9', text: 'But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness."', referenceTe: '2 కొరింథీయులకు 12:9', textTe: 'అందుకు - నా కృప నీకు చాలును, బలహీనతయందు నా బలము పరిపూర్ణమగుచున్నదని ఆయన నాతో చెప్పెను.' },
    { reference: 'Psalm 37:4', text: 'Delight yourself in the LORD, and he will give you the desires of your heart.', referenceTe: 'కీర్తనలు 37:4', textTe: 'యెహోవానుబట్టి సంతోషించుము, ఆయన నీ హృదయవాంఛలను తీర్చును.' },
    { reference: '2 Chronicles 7:14', text: 'If my people who are called by my name humble themselves, and pray and seek my face and turn from their wicked ways, then I will hear from heaven and will forgive their sin and heal their land.', referenceTe: '2 దినవృత్తాంతములు 7:14', textTe: 'నా పేరు పెట్టబడిన నా జనులు తమ్ముతాము తగ్గించుకొని ప్రార్థనచేసి నన్ను వెదకి తమ చెడుమార్గములను విడిచినయెడల, ఆకాశమునుండి నేను వారి ప్రార్థనను విని వారి పాపమును క్షమించి వారి దేశమును స్వస్థపరచుదును.' },
    { reference: 'Isaiah 26:3', text: 'You keep him in perfect peace whose mind is stayed on you, because he trusts in you.', referenceTe: 'యెషయా 26:3', textTe: 'ఎవని మనస్సు నీమీద ఆనుకొనునో వానిని నీవు పూర్ణశాంతిగలవానిగా కాపాడుదువు.' },
    { reference: 'Jeremiah 33:3', text: 'Call to me and I will answer you, and will tell you great and hidden things that you have not known.', referenceTe: 'యిర్మీయా 33:3', textTe: 'నాకు మొఱ్ఱపెట్టుము నేను నీకు ఉత్తరమిచ్చెదను, నీవు గ్రహింపలేని గొప్ప సంగతులను గూఢమైన సంగతులను నీకు తెలియజేతును.' },
    { reference: 'Psalm 18:2', text: 'The LORD is my rock and my fortress and my deliverer, my God, my rock, in whom I take refuge.', referenceTe: 'కీర్తనలు 18:2', textTe: 'యెహోవా నా శైలము, నా కోట, నన్ను రక్షించువాడు, నా కేడెము, నా రక్షణ శృంగము, నా ఉన్నత దుర్గము, నా దేవుడు నేను ఆశ్రయించియున్న నా దుర్గము.' }
  ]
};

// Emotion keyword mapping: if the user's prayer contains these words, 
// we inject biblical synonyms into the search words array to match comforting verses.
const EMOTION_MAP = {
  'anxious': ['peace', 'anxieties', 'guard'],
  'anxiety': ['peace', 'anxieties', 'guard'],
  'worry': ['peace', 'cares'],
  'worried': ['peace', 'cares'],
  'sad': ['comfort', 'joy', 'hope', 'brokenhearted'],
  'sorrow': ['comfort', 'joy', 'hope', 'brokenhearted'],
  'depressed': ['hope', 'joy', 'light', 'strength'],
  'afraid': ['fear', 'courage', 'protect', 'refuge'],
  'scared': ['fear', 'courage', 'protect', 'refuge'],
  'fear': ['fear', 'courage', 'protect', 'refuge'],
  'lonely': ['with you', 'presence', 'forsaken'],
  'alone': ['with you', 'presence', 'forsaken'],
  'tired': ['rest', 'strength', 'weary'],
  'exhausted': ['rest', 'strength', 'weary'],
  'weak': ['strength', 'power', 'grace'],
  'stressed': ['peace', 'rest', 'burden'],
  'angry': ['forgive', 'peace', 'gentleness'],
  'anger': ['forgive', 'peace', 'gentleness'],
  'lost': ['path', 'lead', 'guide', 'way'],
  'confused': ['wisdom', 'understanding', 'instruct']
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

  // Extract base words from prayer text
  const baseWords = prayerText
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  // Inject emotion-based keyword synonyms
  let searchWords = [...baseWords];
  for (const word of baseWords) {
    if (EMOTION_MAP[word]) {
      searchWords.push(...EMOTION_MAP[word]);
    }
  }

  if (searchWords.length === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  let bestScore = -1;
  let bestVerses = [];

  for (const verse of pool) {
    const verseWords = verse.text.toLowerCase();
    let score = 0;
    for (const word of searchWords) {
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
