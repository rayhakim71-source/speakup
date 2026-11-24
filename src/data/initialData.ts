// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { SessionData, ToolkitCategory, ScheduleSettings, CmsSettings, TopicProposal } from '../types';

export const initialSchedule: ScheduleSettings = {
  day: 'Saturday',
  timeLabel: 'First Break',
  timeStr: '',
  location: 'Language Lab',
  generalDocLink: '',
  proposalFormLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdUhoYhqkHDwRbM9o98iDb_DZPDa5nQAd1uzqs-KMDq8GAedQ/viewform?usp=publish-editor',
  noSessionThisWeek: false,
  noSessionNote: '',
};

export const initialProposals: TopicProposal[] = [
  {
    id: 'prop-1',
    timestamp: '2026-11-23 08:30',
    namaDepan: 'Rizki',
    kelas: '8A',
    usulanTopik: 'Should School Start Later in the Morning?',
    pertanyaanUtama: 'Do teenagers need more sleep or should we follow regular school hours?',
    diskusi1: 'Do you feel sleepy during the first lesson?',
    diskusi2: 'Does sleeping longer help us study better?',
    diskusi3: 'What are the challenges of changing school hours?',
    status: 'Baru',
  },
  {
    id: 'prop-2',
    timestamp: '2026-11-22 14:15',
    namaDepan: 'Alya',
    kelas: '8B',
    usulanTopik: 'Reading Books vs Watching Videos',
    pertanyaanUtama: 'Which one helps our imagination grow stronger?',
    diskusi1: 'How often do you read storybooks?',
    diskusi2: 'Are videos easier to understand than books?',
    diskusi3: 'Can we learn new words from both?',
    status: 'Disetujui',
  }
];

export const initialSessions: SessionData[] = [
  {
    id: 'ses-05',
    number: 'Session 05',
    topik: 'Can AI Replace the Way We Learn?',
    pertanyaanUtama: 'If AI can answer our questions, do we still need to learn by ourselves?',
    tanggal: 'Saturday, 28 November 2026',
    dateMode: 'auto',
    status: 'Mendatang',
    tautanDokumentasi: '',
    pengantar: 'AI can answer many questions in seconds. It can also write, translate, and explain. So why do we still go to school and practice? This week, let\'s talk about what AI can do, what it cannot do, and how we can use it wisely.',
    discussionQuestions: [
      'Do you use AI to help you study?',
      'Is getting an answer the same as understanding something?',
      'Can AI replace the experience of learning?',
      'What can humans do that AI cannot replace?'
    ],
    vocabulary: [
      { word: 'artificial intelligence (AI)', definition: 'computer systems that can do tasks that usually need human thinking', indonesian: 'kecerdasan buatan', example: 'AI can translate a sentence in one second.' },
      { word: 'depend', definition: 'to need someone or something', indonesian: 'bergantung', example: 'Some students depend on AI for every homework.' },
      { word: 'understand', definition: 'to know why or how something works', indonesian: 'memahami', example: 'I can copy the answer, but I want to understand it.' },
      { word: 'effort', definition: 'energy and hard work you use to do something', indonesian: 'usaha', example: 'Learning takes effort.' },
      { word: 'experience', definition: 'knowledge you get from doing things', indonesian: 'pengalaman', example: 'Speaking in front of the class is a good experience.' },
      { word: 'creativity', definition: 'the ability to make new ideas', indonesian: 'kreativitas', example: 'Creativity helps us solve problems.' },
      { word: 'shortcut', definition: 'a faster way that skips some steps', indonesian: 'jalan pintas', example: 'A shortcut is not always the best way to learn.' }
    ],
    expressions: [
      { expression: 'I think...', function: 'Give an opinion', meaningIndonesian: 'Saya pikir...', example: 'I think AI is very helpful for finding information.' },
      { expression: 'In my opinion...', function: 'Give an opinion', meaningIndonesian: 'Menurut pendapat saya...', example: 'In my opinion, we must still think by ourselves.' },
      { expression: 'I believe that...', function: 'Give an opinion', meaningIndonesian: 'Saya percaya bahwa...', example: 'I believe that practice makes us smarter.' }
    ],
    sentenceStarters: [
      'I think...',
      'In my opinion...',
      'I believe that...',
      'I agree because...',
      'I disagree because...',
      'For example...',
      'I think this is important because...'
    ],
    miniChallenge: 'Think of one opinion and two reasons to support it.',
    preparationChallenge: 'Before the session, choose one question and prepare your opinion. You don\'t need perfect English. Just bring an idea.'
  },
  {
    id: 'ses-04',
    number: 'Session 04',
    topik: 'Is Social Media Making Us Smarter or Distracted?',
    pertanyaanUtama: 'Does social media help us learn, or does it take our attention away?',
    tanggal: 'Saturday, 21 November 2026',
    dateMode: 'auto',
    status: 'Arsip',
    ringkasan: 'Students shared how videos and posts can teach new things, but also how notifications make it hard to focus. Many agreed that the way we use social media matters more than the apps themselves.',
    discussionQuestions: [
      'How much time do you spend on social media every day?',
      'Can short videos teach us useful things?'
    ],
    vocabulary: [
      { word: 'distracted', definition: 'not able to focus because something else takes your attention', indonesian: 'terganggu / teralihkan perhatiannya', example: 'I get distracted when my phone rings.' },
      { word: 'information', definition: 'facts or knowledge about something', indonesian: 'informasi', example: 'The internet gives us a lot of information.' },
      { word: 'attention', definition: 'the act of focusing on something', indonesian: 'perhatian', example: 'Please pay attention to the speaker.' },
      { word: 'balance', definition: 'a good mix, not too much of one thing', indonesian: 'keseimbangan', example: 'We need a balance between study and fun.' },
      { word: 'influence', definition: 'the power to change what people think or do', indonesian: 'pengaruh', example: 'Friends can have a strong influence on us.' }
    ],
    expressions: [
      { expression: 'I don\'t completely agree.', function: 'Disagree politely', meaningIndonesian: 'Saya tidak sepenuhnya setuju.', example: 'I don\'t completely agree. Some videos really help me study.' },
      { expression: 'What do you think about...?', function: 'Ask a question', meaningIndonesian: 'Bagaimana pendapatmu tentang...?', example: 'What do you think about studying with short videos?' },
      { expression: 'From my perspective...', function: 'Give an opinion', meaningIndonesian: 'Dari sudut pandang saya...', example: 'From my perspective, balance is the key.' },
      { expression: 'For instance...', function: 'Give an example', meaningIndonesian: 'Sebagai contoh...', example: 'For instance, I learn new words from English channels.' },
      { expression: 'That\'s an interesting point.', function: 'Respond to an idea', meaningIndonesian: 'Itu poin yang menarik.', example: 'That\'s an interesting point. I never thought about that.' }
    ],
    sentenceStarters: ['I think...', 'From my perspective...'],
    miniChallenge: 'Share one example.',
    preparationChallenge: 'Prepare your thoughts.',
    tantanganPertanyaan: 'Do you think students spend too much time on social media? Give one reason or example.',
    tantanganRespons: 'I think students spend too much time because notifications distract us from studying.'
  },
  {
    id: 'ses-03',
    number: 'Session 03',
    topik: 'Why Should We Stop Being Afraid of Making Mistakes?',
    pertanyaanUtama: 'What is the worst thing that can happen when we make a mistake in English?',
    tanggal: 'Saturday, 14 November 2026',
    dateMode: 'auto',
    status: 'Arsip',
    ringkasan: 'Students talked about feeling embarrassed when they speak. The group agreed that mistakes show us what to improve, and that the audience usually cares more about the idea than the grammar.',
    discussionQuestions: [
      'Why do people fear making mistakes?',
      'How do mistakes help us grow?'
    ],
    vocabulary: [
      { word: 'mistake', definition: 'something that is not correct', indonesian: 'kesalahan', example: 'Everyone makes mistakes.' },
      { word: 'afraid', definition: 'feeling fear', indonesian: 'takut', example: 'I was afraid to speak at first.' },
      { word: 'brave', definition: 'ready to do something difficult', indonesian: 'berani', example: 'She was brave to try.' },
      { word: 'embarrassed', definition: 'feeling shy or uncomfortable in front of others', indonesian: 'malu', example: 'I felt embarrassed when I forgot the word.' },
      { word: 'improve', definition: 'to become better', indonesian: 'meningkat / memperbaiki', example: 'We improve when we practice.' }
    ],
    expressions: [
      { expression: 'I have a different opinion.', function: 'Disagree politely', meaningIndonesian: 'Saya punya pendapat berbeda.', example: 'I have a different opinion. I think mistakes are useful.' },
      { expression: 'Why do you think so?', function: 'Ask for a reason', meaningIndonesian: 'Mengapa kamu berpikir begitu?', example: 'Why do you think so? Can you explain?' },
      { expression: 'Could you explain that?', function: 'Ask for clarification', meaningIndonesian: 'Bisakah kamu menjelaskan itu?', example: 'Could you explain that again, please?' },
      { expression: 'This is because...', function: 'Give a reason', meaningIndonesian: 'Hal ini karena...', example: 'This is because we learn from our mistakes.' },
      { expression: 'I think you\'re right because...', function: 'Agree', meaningIndonesian: 'Saya pikir kamu benar karena...', example: 'I think you\'re right because practice makes us braver.' }
    ],
    sentenceStarters: ['I think...', 'This is because...'],
    miniChallenge: 'Share a mistake.',
    preparationChallenge: 'Think of a past experience.',
    tantanganPertanyaan: 'Share a time you made a mistake and what you learned from it.',
    tantanganRespons: 'I made a pronunciation mistake, but the teacher helped me and I learned how to say it right.'
  },
  {
    id: 'ses-02',
    number: 'Session 02',
    topik: 'Why Is Practice More Important Than Memorization?',
    pertanyaanUtama: 'Is it better to remember many words or to use a few words every day?',
    tanggal: 'Saturday, 7 November 2026',
    dateMode: 'auto',
    status: 'Arsip',
    ringkasan: 'Students compared memorizing word lists with using words in real conversations. The group concluded that words we use often stay in our memory longer than words we only copy.',
    discussionQuestions: [
      'Do you memorize vocabulary lists?',
      'How do you remember new English words?'
    ],
    vocabulary: [
      { word: 'practice', definition: 'to do something again and again to get better', indonesian: 'berlatih / latihan', example: 'We practice speaking every Saturday.' },
      { word: 'memorize', definition: 'to learn something so you can remember it exactly', indonesian: 'menghafal', example: 'I memorize ten words, but I forget them.' },
      { word: 'habit', definition: 'something you do regularly', indonesian: 'kebiasaan', example: 'Speaking English can be a good habit.' },
      { word: 'repeat', definition: 'to say or do something again', indonesian: 'mengulang', example: 'Please repeat the question.' },
      { word: 'improve', definition: 'to become better', indonesian: 'meningkat / memperbaiki', example: 'Daily practice helps us improve.' }
    ],
    expressions: [
      { expression: 'What I mean is...', function: 'Clarify', meaningIndonesian: 'Maksud saya adalah...', example: 'What I mean is we should use the words, not only read them.' },
      { expression: 'In other words...', function: 'Restate', meaningIndonesian: 'Dengan kata lain...', example: 'In other words, practice makes it easier.' },
      { expression: 'I agree with you because...', function: 'Agree', meaningIndonesian: 'Saya setuju denganmu karena...', example: 'I agree with you because speaking builds confidence.' },
      { expression: 'Let me give you an example.', function: 'Give an example', meaningIndonesian: 'Izinkan saya memberi contoh.', example: 'Let me give you an example. I learned "proud" when I used it in a sentence.' },
      { expression: 'To sum up...', function: 'Conclude', meaningIndonesian: 'Kesimpulannya...', example: 'To sum up, practice is better than only memorizing.' }
    ],
    sentenceStarters: ['What I mean is...', 'To sum up...'],
    miniChallenge: 'State a daily habit.',
    preparationChallenge: 'Think of one habit.',
    tantanganPertanyaan: 'What is one English habit you can do every day? Explain why.',
    tantanganRespons: 'One habit is listening to one English song every day because it helps me catch new words.'
  },
  {
    id: 'ses-01',
    number: 'Session 01',
    topik: 'Why Is English Important for Our Future?',
    pertanyaanUtama: 'How can English open doors for our future?',
    tanggal: 'Saturday, 31 October 2026',
    dateMode: 'auto',
    status: 'Arsip',
    ringkasan: 'Students shared how English helps with school, technology, travel, and future jobs. They agreed that small daily practice matters more than perfect grammar.',
    discussionQuestions: [
      'Where do you see English used in daily life?',
      'How will English help you in your future career?'
    ],
    vocabulary: [
      { word: 'future', definition: 'the time that will come after now', indonesian: 'masa depan', example: 'English can help my future.' },
      { word: 'opportunity', definition: 'a chance to do something good', indonesian: 'kesempatan', example: 'Speaking club is a good opportunity.' },
      { word: 'communicate', definition: 'to share ideas or information with others', indonesian: 'berkomunikasi', example: 'We communicate with people around the world.' },
      { word: 'global', definition: 'related to the whole world', indonesian: 'global / mendunia', example: 'English is a global language.' },
      { word: 'confident', definition: 'sure about yourself', indonesian: 'percaya diri', example: 'I feel more confident now.' }
    ],
    expressions: [
      { expression: 'In my opinion...', function: 'Give an opinion', meaningIndonesian: 'Menurut pendapat saya...', example: 'In my opinion, English helps us find better jobs.' },
      { expression: 'One reason is...', function: 'Give a reason', meaningIndonesian: 'Salah satu alasannya adalah...', example: 'One reason is that many websites are in English.' },
      { expression: 'For example...', function: 'Give an example', meaningIndonesian: 'Sebagai contoh...', example: 'For example, I watch videos in English to learn.' },
      { expression: 'I see your point, but...', function: 'Disagree politely', meaningIndonesian: 'Saya mengerti maksudmu, tapi...', example: 'I see your point, but we also need our own language.' },
      { expression: 'That\'s why I think...', function: 'Conclude', meaningIndonesian: 'Itulah mengapa saya pikir...', example: 'That\'s why I think English is important.' }
    ],
    sentenceStarters: ['In my opinion...', 'One reason is...'],
    miniChallenge: 'Name one future goal.',
    preparationChallenge: 'Think about ten years from now.',
    tantanganPertanyaan: 'Tell us one way English can help you in ten years.',
    tantanganRespons: 'In ten years, English can help me travel abroad and talk to people from different countries.'
  }
];

export const initialToolkit: ToolkitCategory[] = [
  {
    id: 'cat-1',
    name: 'Giving Opinions',
    expressions: [
      { expression: 'I think...', function: 'Express personal view', meaningIndonesian: 'Saya pikir...', example: 'I think this topic is very interesting.' },
      { expression: 'In my opinion...', function: 'Express perspective', meaningIndonesian: 'Menurut pendapat saya...', example: 'In my opinion, everyone should speak up.' },
      { expression: 'I believe...', function: 'Express conviction', meaningIndonesian: 'Saya percaya...', example: 'I believe practice makes us better.' }
    ]
  },
  {
    id: 'cat-2',
    name: 'Agreeing',
    expressions: [
      { expression: 'I agree with you.', function: 'Express agreement', meaningIndonesian: 'Saya setuju denganmu.', example: 'I agree with your idea about practice.' },
      { expression: 'That\'s true.', function: 'Confirm truth', meaningIndonesian: 'Itu benar.', example: 'That\'s true. Mistakes help us learn.' },
      { expression: 'I think you\'re right because...', function: 'Agree with reason', meaningIndonesian: 'Saya pikir kamu benar karena...', example: 'I think you\'re right because consistency is key.' }
    ]
  },
  {
    id: 'cat-3',
    name: 'Disagreeing Politely',
    expressions: [
      { expression: 'I don\'t completely agree.', function: 'Polite disagreement', meaningIndonesian: 'Saya tidak sepenuhnya setuju.', example: 'I don\'t completely agree. Some rules are necessary.' },
      { expression: 'I see your point, but...', function: 'Acknowledge then differ', meaningIndonesian: 'Saya mengerti maksudmu, tapi...', example: 'I see your point, but memorizing has limits.' },
      { expression: 'I have a different opinion.', function: 'Alternative view', meaningIndonesian: 'Saya punya pendapat berbeda.', example: 'I have a different opinion on this matter.' }
    ]
  },
  {
    id: 'cat-4',
    name: 'Giving Reasons',
    expressions: [
      { expression: 'This is because...', function: 'Explain cause', meaningIndonesian: 'Hal ini karena...', example: 'This is because we need more interaction.' },
      { expression: 'One reason is...', function: 'State factor', meaningIndonesian: 'Salah satu alasannya adalah...', example: 'One reason is that English is global.' },
      { expression: 'The main reason is...', function: 'Primary cause', meaningIndonesian: 'Alasan utamanya adalah...', example: 'The main reason is confidence.' }
    ]
  },
  {
    id: 'cat-5',
    name: 'Giving Examples',
    expressions: [
      { expression: 'For example...', function: 'Provide instance', meaningIndonesian: 'Sebagai contoh...', example: 'For example, I read English books.' },
      { expression: 'For instance...', function: 'Illustrate point', meaningIndonesian: 'Contohnya...', example: 'For instance, watching films without subtitles.' },
      { expression: 'Let me give you an example.', function: 'Introduce example', meaningIndonesian: 'Izinkan saya memberi contoh.', example: 'Let me give you an example from last week.' }
    ]
  },
  {
    id: 'cat-6',
    name: 'Asking Questions',
    expressions: [
      { expression: 'What do you think about...?', function: 'Prompt opinion', meaningIndonesian: 'Bagaimana pendapatmu tentang...?', example: 'What do you think about using AI?' },
      { expression: 'Why do you think so?', function: 'Inquire rationale', meaningIndonesian: 'Mengapa kamu berpikir begitu?', example: 'Why do you think so? Can you explain?' },
      { expression: 'Could you explain that?', function: 'Request clarity', meaningIndonesian: 'Bisakah kamu menjelaskan itu?', example: 'Could you explain that part again?' }
    ]
  },
  {
    id: 'cat-7',
    name: 'Clarifying Ideas',
    expressions: [
      { expression: 'What I mean is...', function: 'Clarify meaning', meaningIndonesian: 'Maksud saya adalah...', example: 'What I mean is we should practice daily.' },
      { expression: 'Let me explain.', function: 'Offer explanation', meaningIndonesian: 'Biar saya jelaskan.', example: 'Let me explain why I chose this answer.' },
      { expression: 'In other words...', function: 'Restate simply', meaningIndonesian: 'Dengan kata lain...', example: 'In other words, action speaks louder.' }
    ]
  },
  {
    id: 'cat-8',
    name: 'Concluding',
    expressions: [
      { expression: 'To sum up...', function: 'Summarize', meaningIndonesian: 'Kesimpulannya...', example: 'To sum up, speaking is learning.' },
      { expression: 'In conclusion...', function: 'Final thought', meaningIndonesian: 'Sebagai kesimpulan...', example: 'In conclusion, do not be afraid.' },
      { expression: 'That\'s why I think...', function: 'Final rationale', meaningIndonesian: 'Itulah mengapa saya pikir...', example: 'That\'s why I think clubs are great.' }
    ]
  }
];

export const initialCms: CmsSettings = {
  programName: 'SPEAK UP!',
  slogan: 'Learn to Speak. Dare to Think. Share Your Ideas.',
  heroTopLabel: 'ENGLISH SPEAKING CLUB / SMP NEGERI 1 BENGKALIS',
  logoSource: 'tautan',
  logoValue: '',
  heroImageSource: 'tautan',
  heroImageValue: '',
  faviconValue: '',
  pageTitle: 'SPEAK UP! | English Speaking Club SMP Negeri 1 Bengkalis',
  pageDescription: 'A space where students speak English, explore ideas, share perspectives, and grow together — one conversation at a time.',
  primaryColor: '#183D35',
  creamColor: '#F2EBDD',
  goldColor: '#D6A64A',
  terracottaColor: '#B96549',
  charcoalColor: '#252623',
  menuItems: [
    { label: 'About', href: '#about', visible: true },
    { label: 'Home', href: '#home', visible: true },
    { label: 'This Week', href: '#this-week', visible: true },
    { label: 'Speaking Toolkit', href: '#toolkit', visible: true },
    { label: 'Session Archive', href: '#archive', visible: true },
    { label: 'Propose a Topic', href: 'proposal', visible: true },
  ],
  buttons: [
    { name: 'Explore Topic', label: 'Explore This Week\'s Topic', href: '#this-week', visible: true },
    { name: 'View Doc', label: 'View Documentation', href: '', visible: true },
    { name: 'Get Ready', label: 'Get Ready to Speak', href: '#get-ready', visible: true },
    { name: 'Propose Topic', label: 'Propose a Topic', href: '', visible: true },
    { name: 'Print', label: 'Print', href: '#print', visible: true },
  ],
  sections: [
    { id: 'home', title: 'SPEAK UP!', subtitle: 'Learn to Speak. Dare to Think. Share Your Ideas.', visible: true },
    { id: 'this-week', title: 'THIS WEEK', subtitle: 'Ideas Worth Talking About.', visible: true },
    { id: 'toolkit', title: 'MY SPEAKING TOOLKIT', subtitle: 'Words to help you join the conversation.', visible: true },
    { id: 'archive', title: 'PAST SESSIONS', subtitle: 'Every Talk Leaves Something Behind.', visible: true },
    { id: 'about', title: 'ABOUT SPEAK UP!', subtitle: 'Our principles and background.', visible: true },
  ],
  features: {
    printEnabled: true,
    archiveSearchEnabled: true,
    toolkitSearchEnabled: true,
    nextSessionEnabled: true,
  },
  footer: {
    address: 'SMP Negeri 1 Bengkalis, Kabupaten Bengkalis, Riau',
    whatsapp: '',
    instagram: '',
    scheduleText: 'Every Saturday · First Break · Language Lab',
    copyright: '© SMP Negeri 1 Bengkalis',
  }
};
