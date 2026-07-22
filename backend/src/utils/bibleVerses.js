/**
 * Curated Bible Verse Bank — comforting verses organized by prayer category.
 * getVerseForPrayer(category, prayerText) returns the best-matching verse
 * by scoring keyword overlap between the prayer text and verse text.
 */

const VERSE_BANK = {
  Health: [
    { reference: 'Jeremiah 30:17', text: 'For I will restore health to you, and your wounds I will heal, declares the LORD.' },
    { reference: 'Psalm 103:2-3', text: 'Bless the LORD, O my soul, and forget not all his benefits, who forgives all your iniquity, who heals all your diseases.' },
    { reference: 'Isaiah 53:5', text: 'But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.' },
    { reference: 'Exodus 15:26', text: 'For I am the LORD, your healer.' },
    { reference: 'Psalm 147:3', text: 'He heals the brokenhearted and binds up their wounds.' },
    { reference: '3 John 1:2', text: 'Beloved, I pray that all may go well with you and that you may be in good health, as it goes well with your soul.' },
    { reference: 'James 5:15', text: 'And the prayer of faith will save the one who is sick, and the Lord will raise him up.' },
    { reference: 'Psalm 41:3', text: 'The LORD sustains him on his sickbed; in his illness you restore him to full health.' },
    { reference: 'Isaiah 41:10', text: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you.' },
    { reference: 'Proverbs 4:22', text: 'For they are life to those who find them, and healing to all their flesh.' },
    { reference: 'Matthew 11:28', text: 'Come to me, all who labor and are heavy laden, and I will give you rest.' },
    { reference: 'Psalm 30:2', text: 'O LORD my God, I cried to you for help, and you have healed me.' },
  ],

  Marriage: [
    { reference: 'Ecclesiastes 4:12', text: 'A cord of three strands is not quickly broken.' },
    { reference: '1 Corinthians 13:4-7', text: 'Love is patient and kind; love does not envy or boast; it is not arrogant or rude. It bears all things, believes all things, hopes all things, endures all things.' },
    { reference: 'Ephesians 4:2-3', text: 'With all humility and gentleness, with patience, bearing with one another in love, eager to maintain the unity of the Spirit in the bond of peace.' },
    { reference: 'Colossians 3:14', text: 'And above all these put on love, which binds everything together in perfect harmony.' },
    { reference: 'Genesis 2:18', text: 'Then the LORD God said, "It is not good that the man should be alone; I will make him a helper fit for him."' },
    { reference: 'Proverbs 18:22', text: 'He who finds a wife finds a good thing and obtains favor from the LORD.' },
    { reference: 'Mark 10:9', text: 'What therefore God has joined together, let not man separate.' },
    { reference: '1 Peter 4:8', text: 'Above all, keep loving one another earnestly, since love covers a multitude of sins.' },
    { reference: 'Ephesians 5:25', text: 'Husbands, love your wives, as Christ loved the church and gave himself up for her.' },
    { reference: 'Song of Solomon 8:7', text: 'Many waters cannot quench love, neither can floods drown it.' },
  ],

  Family: [
    { reference: 'Psalm 127:3', text: 'Behold, children are a heritage from the LORD, the fruit of the womb a reward.' },
    { reference: 'Proverbs 22:6', text: 'Train up a child in the way he should go; even when he is old he will not depart from it.' },
    { reference: 'Joshua 24:15', text: 'But as for me and my house, we will serve the LORD.' },
    { reference: 'Colossians 3:13', text: 'Bearing with one another and, if one has a complaint against another, forgiving each other; as the Lord has forgiven you, so you also must forgive.' },
    { reference: 'Psalm 133:1', text: 'Behold, how good and pleasant it is when brothers dwell in unity!' },
    { reference: 'Proverbs 17:6', text: 'Grandchildren are the crown of the aged, and the glory of children is their fathers.' },
    { reference: 'Ephesians 6:4', text: 'Fathers, do not provoke your children to anger, but bring them up in the discipline and instruction of the Lord.' },
    { reference: '1 Timothy 5:8', text: 'But if anyone does not provide for his relatives, and especially for members of his household, he has denied the faith.' },
    { reference: 'Psalm 128:3', text: 'Your wife will be like a fruitful vine within your house; your children will be like olive shoots around your table.' },
    { reference: 'Proverbs 31:28', text: 'Her children rise up and call her blessed; her husband also, and he praises her.' },
  ],

  Financial: [
    { reference: 'Philippians 4:19', text: 'And my God will supply every need of yours according to his riches in glory in Christ Jesus.' },
    { reference: 'Malachi 3:10', text: 'Bring the full tithe into the storehouse, that there may be food in my house. And thereby put me to the test, says the LORD of hosts, if I will not open the windows of heaven for you and pour down for you a blessing until there is no more need.' },
    { reference: 'Proverbs 3:9-10', text: 'Honor the LORD with your wealth and with the firstfruits of all your produce; then your barns will be filled with plenty.' },
    { reference: 'Deuteronomy 28:12', text: 'The LORD will open to you his good treasury, the heavens, to give the rain to your land in its season and to bless all the work of your hands.' },
    { reference: 'Luke 6:38', text: 'Give, and it will be given to you. Good measure, pressed down, shaken together, running over.' },
    { reference: 'Psalm 37:25', text: 'I have been young, and now am old, yet I have not seen the righteous forsaken or his children begging for bread.' },
    { reference: '2 Corinthians 9:8', text: 'And God is able to make all grace abound to you, so that having all sufficiency in all things at all times, you may abound in every good work.' },
    { reference: 'Matthew 6:33', text: 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.' },
    { reference: 'Proverbs 10:22', text: 'The blessing of the LORD makes rich, and he adds no sorrow with it.' },
    { reference: 'Psalm 34:10', text: 'The young lions suffer want and hunger; but those who seek the LORD lack no good thing.' },
  ],

  Education: [
    { reference: 'Proverbs 2:6', text: 'For the LORD gives wisdom; from his mouth come knowledge and understanding.' },
    { reference: 'James 1:5', text: 'If any of you lacks wisdom, let him ask God, who gives generously to all without reproach, and it will be given him.' },
    { reference: 'Proverbs 1:7', text: 'The fear of the LORD is the beginning of knowledge; fools despise wisdom and instruction.' },
    { reference: 'Psalm 119:105', text: 'Your word is a lamp to my feet and a light to my path.' },
    { reference: 'Colossians 3:23', text: 'Whatever you do, work heartily, as for the Lord and not for men.' },
    { reference: 'Proverbs 16:3', text: 'Commit your work to the LORD, and your plans will be established.' },
    { reference: 'Isaiah 28:26', text: 'For his God instructs him and teaches him the right way.' },
    { reference: 'Psalm 32:8', text: 'I will instruct you and teach you in the way you should go; I will counsel you with my eye upon you.' },
    { reference: 'Daniel 1:17', text: 'As for these four youths, God gave them learning and skill in all literature and wisdom.' },
    { reference: 'Proverbs 4:7', text: 'The beginning of wisdom is this: Get wisdom, and whatever you get, get insight.' },
  ],

  Job: [
    { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.' },
    { reference: 'Psalm 90:17', text: 'Let the favor of the Lord our God be upon us, and establish the work of our hands upon us; yes, establish the work of our hands!' },
    { reference: 'Proverbs 16:3', text: 'Commit your work to the LORD, and your plans will be established.' },
    { reference: 'Colossians 3:23-24', text: 'Whatever you do, work heartily, as for the Lord and not for men, knowing that from the Lord you will receive the inheritance as your reward.' },
    { reference: 'Deuteronomy 28:8', text: 'The LORD will command the blessing on you in your barns and in all that you undertake.' },
    { reference: 'Isaiah 43:19', text: 'Behold, I am doing a new thing; now it springs forth, do you not perceive it? I will make a way in the wilderness and rivers in the desert.' },
    { reference: 'Psalm 37:5', text: 'Commit your way to the LORD; trust in him, and he will act.' },
    { reference: 'Philippians 4:13', text: 'I can do all things through him who strengthens me.' },
    { reference: 'Isaiah 40:31', text: 'But they who wait for the LORD shall renew their strength; they shall mount up with wings like eagles; they shall run and not be weary.' },
    { reference: 'Psalm 75:6-7', text: 'For not from the east or from the west and not from the wilderness comes lifting up, but it is God who executes judgment, putting down one and lifting up another.' },
  ],

  Travel: [
    { reference: 'Psalm 121:7-8', text: 'The LORD will keep you from all evil; he will keep your life. The LORD will keep your going out and your coming in from this time forth and forevermore.' },
    { reference: 'Proverbs 3:23-24', text: 'Then you will walk on your way securely, and your foot will not stumble. If you lie down, you will not be afraid; your sleep will be sweet.' },
    { reference: 'Isaiah 43:2', text: 'When you pass through the waters, I will be with you; and through the rivers, they shall not overwhelm you.' },
    { reference: 'Psalm 91:11', text: 'For he will command his angels concerning you to guard you in all your ways.' },
    { reference: 'Deuteronomy 31:8', text: 'It is the LORD who goes before you. He will be with you; he will not leave you or forsake you. Do not fear or be dismayed.' },
    { reference: 'Numbers 6:24-26', text: 'The LORD bless you and keep you; the LORD make his face to shine upon you and be gracious to you; the LORD lift up his countenance upon you and give you peace.' },
    { reference: 'Psalm 23:4', text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me.' },
    { reference: 'Joshua 1:9', text: 'Have I not commanded you? Be strong and courageous. Do not be frightened, for the LORD your God is with you wherever you go.' },
    { reference: 'Genesis 28:15', text: 'Behold, I am with you and will keep you wherever you go.' },
    { reference: 'Psalm 139:9-10', text: 'If I take the wings of the morning and dwell in the uttermost parts of the sea, even there your hand shall lead me.' },
  ],

  Ministry: [
    { reference: 'Matthew 28:19-20', text: 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you.' },
    { reference: 'Isaiah 6:8', text: 'And I heard the voice of the Lord saying, "Whom shall I send, and who will go for us?" Then I said, "Here I am! Send me."' },
    { reference: '1 Peter 4:10', text: 'As each has received a gift, use it to serve one another, as good stewards of God\'s varied grace.' },
    { reference: '2 Timothy 4:2', text: 'Preach the word; be ready in season and out of season; reprove, rebuke, and exhort, with complete patience and teaching.' },
    { reference: 'Acts 1:8', text: 'But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses.' },
    { reference: 'Romans 10:15', text: 'How beautiful are the feet of those who preach the good news!' },
    { reference: '1 Corinthians 15:58', text: 'Therefore, my beloved brothers, be steadfast, immovable, always abounding in the work of the Lord, knowing that in the Lord your labor is not in vain.' },
    { reference: 'Galatians 6:9', text: 'And let us not grow weary of doing good, for in due season we will reap, if we do not give up.' },
    { reference: 'Mark 16:15', text: 'And he said to them, "Go into all the world and proclaim the gospel to the whole creation."' },
    { reference: 'Ephesians 2:10', text: 'For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.' },
  ],

  General: [
    { reference: 'Romans 8:28', text: 'And we know that for those who love God all things work together for good, for those who are called according to his purpose.' },
    { reference: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.' },
    { reference: 'Philippians 4:6-7', text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds.' },
    { reference: 'Isaiah 41:10', text: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.' },
    { reference: 'Psalm 55:22', text: 'Cast your burden on the LORD, and he will sustain you; he will never permit the righteous to be moved.' },
    { reference: '1 Peter 5:7', text: 'Casting all your anxieties on him, because he cares for you.' },
    { reference: 'Nahum 1:7', text: 'The LORD is good, a stronghold in the day of trouble; he knows those who take refuge in him.' },
    { reference: 'Psalm 34:17-18', text: 'When the righteous cry for help, the LORD hears and delivers them out of all their troubles. The LORD is near to the brokenhearted and saves the crushed in spirit.' },
    { reference: 'Lamentations 3:22-23', text: 'The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.' },
    { reference: 'Matthew 7:7', text: 'Ask, and it will be given to you; seek, and you will find; knock, and it will be opened to you.' },
    { reference: 'Psalm 62:8', text: 'Trust in him at all times, O people; pour out your heart before him; God is a refuge for us.' },
    { reference: 'John 16:33', text: 'I have said these things to you, that in me you may have peace. In the world you will have tribulation. But take heart; I have overcome the world.' },
  ],

  Other: [
    { reference: 'Proverbs 3:5-6', text: 'Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.' },
    { reference: 'Romans 15:13', text: 'May the God of hope fill you with all joy and peace in believing, so that by the power of the Holy Spirit you may abound in hope.' },
    { reference: 'Psalm 37:4', text: 'Delight yourself in the LORD, and he will give you the desires of your heart.' },
    { reference: '2 Chronicles 7:14', text: 'If my people who are called by my name humble themselves, and pray and seek my face and turn from their wicked ways, then I will hear from heaven and will forgive their sin and heal their land.' },
    { reference: 'Hebrews 11:1', text: 'Now faith is the assurance of things hoped for, the conviction of things not seen.' },
    { reference: 'Psalm 27:14', text: 'Wait for the LORD; be strong, and let your heart take courage; wait for the LORD!' },
    { reference: 'Isaiah 26:3', text: 'You keep him in perfect peace whose mind is stayed on you, because he trusts in you.' },
    { reference: 'Jeremiah 33:3', text: 'Call to me and I will answer you, and will tell you great and hidden things that you have not known.' },
    { reference: 'Psalm 18:2', text: 'The LORD is my rock and my fortress and my deliverer, my God, my rock, in whom I take refuge.' },
    { reference: '2 Corinthians 12:9', text: 'But he said to me, "My grace is sufficient for you, for my power is made perfect in weakness."' },
  ],
};

/**
 * Get a comforting Bible verse for a prayer request.
 * Matches by category first, then scores keyword overlap with the prayer text.
 * Returns the best-matching verse, or a random verse from the category if no keywords match.
 *
 * @param {string} category — Prayer category (e.g. 'Health', 'Job', 'Family')
 * @param {string} prayerText — The user's prayer text
 * @returns {{ reference: string, text: string }}
 */
function getVerseForPrayer(category, prayerText) {
  const pool = VERSE_BANK[category] || VERSE_BANK['General'];

  if (!prayerText || prayerText.trim().length === 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Extract keywords from prayer text (lowercase, remove short/common words)
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

  // Score each verse by keyword overlap
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

  // Pick randomly among the top-scoring verses
  return bestVerses[Math.floor(Math.random() * bestVerses.length)];
}

module.exports = { getVerseForPrayer };
