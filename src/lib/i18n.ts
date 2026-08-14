import { useLanguageStore, AppLanguage } from "@/store/languageStore";

export const translations = {
  BN: {
    nav: {
      home: "হোম",
      exams: "পরীক্ষাসমূহ",
      quizzes: "কুইজ",
      passPro: "পাস প্রো ⚡",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ",
      login: "লগ ইন",
      getStarted: "শুরু করুন",
    },
    hero: {
      badge: "১০০% সিলেবাস অনুযায়ী • ৫০,০০০+ সক্রিয় পশ্চিমবঙ্গ পরীক্ষার্থী ⚡",
      title1: "প্রস্তুতি।",
      title2: "অনুশীলন।",
      title3: "সাফল্য।",
      subtitle:
        "পশ্চিমবঙ্গের সমস্ত সরকারি পরীক্ষা প্রস্তুতির ১ নম্বর ডিজিটাল প্ল্যাটফর্ম।",
      searchPlaceholder:
        "পরীক্ষা খুঁজুন (যেমন: পিএসসি ক্লার্কশিপ, ডাব্লুবি কনস্টেবল, ফুড এসআই)...",
      findExam: "পরীক্ষা খুঁজুন",
      startFree: "বিনামূল্যে মক টেস্ট শুরু করুন",
      browseCategories: "সকল ৭টি ক্যাটাগরি দেখুন",
    },
    stats: {
      candidates: "সক্রিয় পরীক্ষার্থী",
      questions: "অনুশীলন প্রশ্ন",
      series: "মক টেস্ট সিরিজ",
      success: "সফলতার হার",
    },
    trending: {
      title: "সর্বাধিক জনপ্রিয় ও টার্গেটেড মক টেস্ট সিরিজ",
      subtitle:
        "১০০% নতুন সিলেবাস অনুযায়ী রিয়েল TCS টাইমার ও রাজ্যব্যাপী লাইভ র্যাঙ্কিং সহ টেস্ট দিন।",
      viewAll: "সকল টেস্ট দেখুন",
      attempt: "টেস্ট দিন",
    },
    categories: {
      title: "টার্গেটেড পরীক্ষার মডিউল",
      subtitle:
        "আপনার লক্ষ্যভিত্তিক প্রতিযোগিতামূলক পরীক্ষা বেছে নিয়ে মক টেস্ট শুরু করুন।",
      badge: "পরীক্ষার ক্যাটাগরি",
      browse: "মক পেপার দেখুন ➔",
      count: "টি মক পেপার",
    },
    features: {
      badge: "প্ল্যাটফর্মের সুবিধা",
      title: "কেন পশ্চিমবঙ্গ পরীক্ষার্থীরা Exam Ready বেছে নিচ্ছেন",
      subtitle:
        "আমাদের প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ যা আপনাকে পরীক্ষায় এগিয়ে রাখবে।",
      f1Title: "রিয়েল এক্সাম টাইমার",
      f1Desc:
        "আসল পরীক্ষার সময়সীমার অভিজ্ঞতা নিন। আমাদের টাইমার TCS পরীক্ষার প্যাটার্নের সাথে হুবহু মিল রেখে তৈরি।",
      f2Title: "বিস্তারিত ফলাফল বিশ্লেষণ",
      f2Desc:
        "বিষয়ভিত্তিক পারফরম্যান্স চার্ট ও নির্ভুলতার পরিমাপক দেখে আপনার দুর্বলতা চিহ্নিত করুন।",
      f3Title: "বিশাল প্রশ্ন ভাণ্ডার",
      f3Desc:
        "১০,০০০+ নির্বাচিত MCQ ও বিগত বছরের প্রশ্ন সমাধানের সমৃদ্ধ সংগ্রহ।",
      f4Title: "লাইভ লিডারবোর্ড",
      f4Desc:
        "সমগ্র পশ্চিমবঙ্গের পরীক্ষার্থীদের সাথে প্রতিযোগিতা করুন এবং জেলাভিত্তিক র্যাঙ্ক দেখুন।",
      f5Title: "দৈনিক কুইজ সেট",
      f5Desc:
        "প্রতিদিনের ১০-মিনিটের কুইজ যা আপনার প্রস্তুতিকে প্রতিদিন নিয়মিত রাখে।",
      f6Title: "ধাপভিত্তিক সমাধান",
      f6Desc: "প্রতিটি প্রশ্নের সাথে রয়েছে স্পষ্ট ও বিস্তারিত ব্যাখ্যা।",
    },
    rankers: {
      badge: "রাজ্যব্যাপী লাইভ লিডারবোর্ড",
      title: "সপ্তাহের সেরা র্যাঙ্কার্স",
      subtitle:
        "পশ্চিমবঙ্গের জেলাভিত্তিক পরীক্ষার্থীদের রিয়েল-টাইম র্যাঙ্ক ও পার্সেন্টাইল।",
    },
    steps: {
      badge: "সহজ ধাপসমূহ",
      title: "আপনার প্রস্তুতি কীভাবে শুরু করবেন",
      subtitle: "৪টি সহজ ধাপে আপনার সুসংগঠিত পরীক্ষার যাত্রা শুরু করুন।",
      step1Title: "অ্যাকাউন্ট তৈরি করুন",
      step1Desc:
        "বিনামূল্যে রেজিস্টার করুন এবং আপনার টার্গেট পরীক্ষার প্রোফাইল তৈরি করুন।",
      step2Title: "পরীক্ষা বেছে নিন",
      step2Desc: "পশ্চিমবঙ্গের ৭টি প্রধান পরীক্ষার মক টেস্ট সিরিজ ব্রাউজ করুন।",
      step3Title: "অনুশীলন ও টেস্ট দিন",
      step3Desc: "রিয়েল টাইম টাইমার ও নেগেটিভ মার্কিং সহ ফুল মক পরীক্ষা দিন।",
      step4Title: "অগ্রগতি ট্র্যাক করুন",
      step4Desc: "বিষয়ভিত্তিক রেজাল্ট বিশ্লেষণ এবং রাজ্যব্যাপী র্যাঙ্ক দেখুন।",
    },
    cta: {
      badge: "🚀 ৫০,০০০+ সক্রিয় পরীক্ষার্থীর সাথে যুক্ত হন",
      title: "WB Police, Food SI ও PSC Clerkship পরীক্ষায় সফল হতে প্রস্তুত?",
      subtitle:
        "আজই বিনামূল্যে রেজিস্টার করুন এবং লাইভ র্যাঙ্ক ও নেগেটিভ মার্কিং এনালাইসিস সহ মক পরীক্ষা দিন।",
      btn: "বিনামূল্যে মক টেস্ট শুরু করুন ➔",
    },
  },
  EN: {
    nav: {
      home: "Home",
      exams: "Exams",
      quizzes: "Quizzes",
      passPro: "Pass Pro ⚡",
      about: "About",
      contact: "Contact",
      login: "Log in",
      getStarted: "Get Started",
    },
    hero: {
      badge: "100% Syllabus Aligned • Join 50,000+ Active WB Aspirants ⚡",
      title1: "Prepare.",
      title2: "Practice.",
      title3: "Perform.",
      subtitle:
        "West Bengal’s #1 Mock Test & Practice Platform for Government Exam Aspirants.",
      searchPlaceholder:
        "Search exams (e.g. PSC Clerkship, WB Constable, Food SI)...",
      findExam: "Find Exam",
      startFree: "Start Free Mock Test",
      browseCategories: "Browse All 7 Categories",
    },
    stats: {
      candidates: "Active Candidates",
      questions: "Solved MCQs",
      series: "Mock Test Series",
      success: "Success Rate",
    },
    trending: {
      title: "Most Popular & High-Yield Mock Series",
      subtitle:
        "Practice with 100% syllabus-aligned full length tests, real TCS exam timer & statewide live rank.",
      viewAll: "View All Tests",
      attempt: "Attempt Test",
    },
    categories: {
      title: "Targeted Examination Modules",
      subtitle:
        "Select your target competitive examination to start practicing with category-specific mock tests.",
      badge: "Exam Categories",
      browse: "Explore Mocks ➔",
      count: "Mock Papers",
    },
    features: {
      badge: "Platform Highlights",
      title: "Why West Bengal Aspirants Choose Exam Ready",
      subtitle: "Purpose-built tools designed to maximize your final score.",
      f1Title: "Real Exam Timer",
      f1Desc:
        "Practice with authentic time pressure matching actual state exam conditions.",
      f2Title: "Detailed Analytics",
      f2Desc:
        "Track your progress with subject-wise performance charts and instant accuracy metrics.",
      f3Title: "Vast Question Bank",
      f3Desc:
        "10,000+ curated MCQs covering all topics with PYQ solutions for state exams.",
      f4Title: "Live Leaderboard",
      f4Desc:
        "Compete with candidates statewide and track your rank district-wise.",
      f5Title: "Daily Quizzes",
      f5Desc:
        "Sharp 10-minute daily quizzes to keep your preparation consistent every day.",
      f6Title: "Answer Explanations",
      f6Desc:
        "Every question comes with step-by-step solutions to deepen concept clarity.",
    },
    rankers: {
      badge: "Statewide Live Leaderboard Spotlight",
      title: "Top Rankers of the Week",
      subtitle:
        "Real-time percentile rankings of top candidates competing across West Bengal districts.",
    },
    steps: {
      badge: "Simple Steps",
      title: "How To Start Your Preparation",
      subtitle: "Begin your structured examination journey in 4 easy steps.",
      step1Title: "Create Account",
      step1Desc:
        "Register free and set up your candidate profile with your target state exams.",
      step2Title: "Choose Exam",
      step2Desc:
        "Browse mock test series across all 7 specialized West Bengal exam categories.",
      step3Title: "Practice & Perform",
      step3Desc:
        "Attempt full mock exams, experience real timer pressure, and get detailed score cards.",
      step4Title: "Track Progress",
      step4Desc:
        "Monitor improvement with accuracy charts and climb the statewide rank leaderboard.",
    },
    cta: {
      badge: "🚀 Join 50,000+ Candidates Preparing for 2026 State Exams",
      title: "Ready to Crack WB Police, Food SI, PSC Clerkship & Others?",
      subtitle:
        "Register free today and start taking live timed mock tests with instant percentile feedback.",
      btn: "Start Free Mock Test ➔",
    },
  },
  HI: {
    nav: {
      home: "होम",
      exams: "परीक्षाएं",
      quizzes: "क्विज़",
      passPro: "पास प्रो ⚡",
      about: "हमारे बारे में",
      contact: "संपर्क",
      login: "लॉग इन",
      getStarted: "शुरू करें",
    },
    hero: {
      badge: "100% पाठ्यक्रम आधारित • 50,000+ सक्रिय प्रतियोगी छात्र ⚡",
      title1: "तैयारी।",
      title2: "अभ्यास।",
      title3: "सफलता।",
      subtitle:
        "पश्चिम बंगाल की सभी सरकारी परीक्षा तैयारियों का नंबर 1 डिजिटल प्लेटफॉर्म।",
      searchPlaceholder:
        "परीक्षा खोजें (जैसे: PSC क्लर्कशिप, WB कांस्टेबल, फूड SI)...",
      findExam: "परीक्षा खोजें",
      startFree: "मुफ्त मॉक टेस्ट शुरू करें",
      browseCategories: "सभी 7 श्रेणियां देखें",
    },
    stats: {
      candidates: "सक्रिय उम्मीदवार",
      questions: "अभ्यास प्रश्न",
      series: "मॉक टेस्ट सीरीज़",
      success: "सफलता दर",
    },
    trending: {
      title: "सर्वाधिक लोकप्रिय एवं लक्षित मॉक टेस्ट सीरीज़",
      subtitle:
        "100% नवीन पाठ्यक्रम, असली TCS टाइमर और राज्यस्तरीय लाइव रैंक के साथ अभ्यास करें।",
      viewAll: "सभी टेस्ट देखें",
      attempt: "टेस्ट दें",
    },
    categories: {
      title: "लक्षित परीक्षा मॉडल",
      subtitle: "अपनी लक्षित प्रतियोगी परीक्षा चुनें और टेस्ट शुरू करें।",
      badge: "परीक्षा श्रेणियां",
      browse: "मॉक पेपर देखें ➔",
      count: "मॉक पेपर",
    },
    features: {
      badge: "विशेष सुविधाएं",
      title: "परीक्षार्थी Exam Ready क्यों चुनते हैं",
      subtitle:
        "आपकी सफलता सुनिश्चित करने के लिए विशेष रूप से डिज़ाइन किए गए टूल।",
      f1Title: "असली परीक्षा टाइमर",
      f1Desc: "असली परीक्षा समय सीमा का अनुभव करें जो TCS पैटर्न के समान है।",
      f2Title: "विस्तृत परिणाम विश्लेषण",
      f2Desc: "विषयवार प्रदर्शन चार्ट और सटीकता मेट्रिक्स के साथ प्रगति देखें।",
      f3Title: "विशाल प्रश्न बैंक",
      f3Desc: "10,000+ चयनित प्रश्न और पिछले वर्षों के प्रश्नों का हल संग्रह।",
      f4Title: "लाइव लीडरबोर्ड",
      f4Desc:
        "राज्यभर के छात्रों के साथ प्रतिस्पर्धा करें और जिलावार रैंक देखें।",
      f5Title: "दैनिक क्विज़",
      f5Desc: "हर दिन तैयारी बनाए रखने के लिए 10-मिनट का त्वरित क्विज़।",
      f6Title: "चरणात्मक उत्तर व्याख्या",
      f6Desc: "अवधारणाओं को स्पष्ट करने के लिए प्रत्येक प्रश्न का विस्तृत हल।",
    },
    rankers: {
      badge: "राज्यस्तरीय लाइव लीडरबोर्ड",
      title: "इस सप्ताह के टॉप रैंकर्स",
      subtitle:
        "पश्चिम बंगाल के जिलों में प्रतिस्पर्धा करने वाले उम्मीदवारों की वास्तविक समय रैंकिंग।",
    },
    steps: {
      badge: "आसान चरण",
      title: "अपनी तैयारी कैसे शुरू करें",
      subtitle: "4 आसान चरणों में अपनी व्यवस्थित परीक्षा यात्रा शुरू करें।",
      step1Title: "खाता बनाएं",
      step1Desc:
        "मुफ्त पंजीकरण करें और अपनी लक्षित परीक्षाओं का प्रोफाइल बनाएं।",
      step2Title: "परीक्षा चुनें",
      step2Desc: "पश्चिम बंगाल की 7 प्रमुख श्रेणियों की टेस्ट सीरीज देखें।",
      step3Title: "अभ्यास और टेस्ट दें",
      step3Desc: "टाइमर और नेगेटिव मार्किंग के साथ पूरे मॉक टेस्ट दें।",
      step4Title: "प्रगति ट्रैक करें",
      step4Desc: "विषयवार विश्लेषण देखें और राज्यस्तरीय रैंक हासिल करें।",
    },
    cta: {
      badge: "🚀 50,000+ प्रतियोगी छात्रों के साथ जुड़ें",
      title:
        "WB पुलिस, फूड SI और PSC क्लर्कशिप में सफलता पाने के लिए तैयार हैं?",
      subtitle: "आज ही मुफ्त पंजीकरण करें और लाइव टाइमर के साथ मॉक टेस्ट दें।",
      btn: "मुफ्त मॉक टेस्ट शुरू करें ➔",
    },
  },
};

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const t = translations[language] || translations.BN;
  return { t, language };
}
