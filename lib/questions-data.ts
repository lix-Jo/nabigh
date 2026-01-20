export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: string;
  level: string;
}

export const placementTest: Question[] = [
  {
    id: 1,
    question: "I ___ a student.",
    options: ["am", "is", "are", "be"],
    correct: "am",
    level: "A1"
  },
  {
    id: 2,
    question: "She ___ my friend.",
    options: ["am", "is", "are", "be"],
    correct: "is",
    level: "A1"
  },
  {
    id: 3,
    question: "Yesterday, I ___ to the park.",
    options: ["go", "goes", "went", "going"],
    correct: "went",
    level: "A2"
  },
  {
    id: 4,
    question: "___ you see that movie?",
    options: ["Do", "Does", "Did", "Done"],
    correct: "Did",
    level: "A2"
  },
  {
    id: 5,
    question: "I have been here ___ 2010.",
    options: ["for", "since", "at", "in"],
    correct: "since",
    level: "B1"
  },
  {
    id: 6,
    question: "I have lived here ___ five years.",
    options: ["for", "since", "at", "in"],
    correct: "for",
    level: "B1"
  },
  {
    id: 7,
    question: "The book ___ by a famous author.",
    options: ["wrote", "was written", "writes", "is write"],
    correct: "was written",
    level: "B2"
  },
  {
    id: 8,
    question: "By the time he arrived, I ___ my work.",
    options: ["finish", "finished", "had finished", "have finished"],
    correct: "had finished",
    level: "B2"
  },
  {
    id: 9,
    question: "___ you study hard, you will fail.",
    options: ["If", "Unless", "Whether", "Provided"],
    correct: "Unless",
    level: "C1"
  },
  {
    id: 10,
    question: "If I had known, I ___ helped you.",
    options: ["will", "would have", "can", "should"],
    correct: "would have",
    level: "C1"
  },
  {
    id: 11,
    question: "He succeeded ___ the difficulties.",
    options: ["although", "despite", "even though", "but"],
    correct: "despite",
    level: "C2"
  },
  {
    id: 12,
    question: "___ the evidence, the jury found him guilty.",
    options: ["Despite", "Notwithstanding", "However", "But"],
    correct: "Notwithstanding",
    level: "C2"
  }
];

export interface LevelInfo {
  name: string;
  nameAr: string;
  description: string;
  color: string;
}

export const levelInfo: Record<string, LevelInfo> = {
  A1: {
    name: "Beginner",
    nameAr: "مبتدئ",
    description: "يمكنك فهم واستخدام تعبيرات يومية بسيطة",
    color: "from-red-500 to-orange-500"
  },
  A2: {
    name: "Elementary",
    nameAr: "أساسي",
    description: "يمكنك التواصل في مواقف بسيطة ومتكررة",
    color: "from-orange-500 to-amber-500"
  },
  B1: {
    name: "Intermediate",
    nameAr: "متوسط",
    description: "يمكنك التعامل مع معظم المواقف أثناء السفر",
    color: "from-amber-500 to-yellow-500"
  },
  B2: {
    name: "Upper Intermediate",
    nameAr: "فوق المتوسط",
    description: "يمكنك التفاعل بطلاقة مع المتحدثين الأصليين",
    color: "from-yellow-500 to-lime-500"
  },
  C1: {
    name: "Advanced",
    nameAr: "متقدم",
    description: "يمكنك استخدام اللغة بمرونة وفعالية",
    color: "from-lime-500 to-green-500"
  },
  C2: {
    name: "Proficient",
    nameAr: "متمكن",
    description: "يمكنك فهم كل ما تسمعه أو تقرأه بسهولة",
    color: "from-green-500 to-emerald-500"
  }
};

export interface StudyTip {
  title: string;
  description: string;
  icon: string;
}

export interface WeaknessAnalysis {
  level: string;
  weaknesses: string[];
  tips: StudyTip[];
  techniques: StudyTip[];
  resources: string[];
}

export function analyzeWeaknesses(
  answers: { questionId: number; answer: string; correct: boolean; timeSpent: number }[],
  questions: Question[]
): WeaknessAnalysis {
  const levelScores: Record<string, { correct: number; total: number; avgTime: number }> = {};
  
  // Count correct answers
  const correctCount = answers.filter(a => a.correct).length;
  
  // Determine level based on correct answers (every 3 correct = 1 level up)
  // 0-2 = A1, 3-4 = A2, 5-6 = B1, 7-8 = B2, 9 = C1, 10-12 = C2
  let determinedLevel = "A1";
  if (correctCount >= 10) {
    determinedLevel = "C2";
  } else if (correctCount >= 9) {
    determinedLevel = "C1";
  } else if (correctCount >= 7) {
    determinedLevel = "B2";
  } else if (correctCount >= 5) {
    determinedLevel = "B1";
  } else if (correctCount >= 3) {
    determinedLevel = "A2";
  } else {
    determinedLevel = "A1";
  }
  
  // Calculate scores per level for weakness analysis
  answers.forEach((ans, idx) => {
    const q = questions[idx];
    if (!levelScores[q.level]) {
      levelScores[q.level] = { correct: 0, total: 0, avgTime: 0 };
    }
    levelScores[q.level].total++;
    levelScores[q.level].avgTime += ans.timeSpent;
    if (ans.correct) {
      levelScores[q.level].correct++;
    }
  });

  const weaknesses: string[] = [];
  const levelOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];
  
  for (const level of levelOrder) {
    if (levelScores[level]) {
      const score = levelScores[level];
      const percentage = (score.correct / score.total) * 100;
      const avgTime = score.avgTime / score.total;
      
      if (percentage < 70) {
        weaknesses.push(level);
      }
      
      if (avgTime > 20000) {
        weaknesses.push(`${level}-slow`);
      }
    }
  }

  const tips: StudyTip[] = [
    {
      title: "المراجعة اليومية",
      description: "خصص 15-30 دقيقة يومياً لمراجعة القواعد والمفردات الجديدة",
      icon: "calendar"
    },
    {
      title: "الاستماع النشط",
      description: "استمع للبودكاست والأفلام بالإنجليزية مع الترجمة",
      icon: "headphones"
    },
    {
      title: "الكتابة اليومية",
      description: "اكتب يومياً 3-5 جمل عن يومك لتحسين مهارات الكتابة",
      icon: "pencil"
    },
    {
      title: "التحدث بصوت عالٍ",
      description: "تدرب على نطق الجمل بصوت عالٍ لتحسين النطق",
      icon: "mic"
    }
  ];

  const techniques: StudyTip[] = [
    {
      title: "تقنية بومودورو",
      description: "ادرس 25 دقيقة ثم استرح 5 دقائق. كرر 4 مرات ثم خذ استراحة طويلة 15-30 دقيقة",
      icon: "timer"
    },
    {
      title: "التكرار المتباعد",
      description: "راجع المعلومات على فترات متزايدة: بعد يوم، ثم 3 أيام، ثم أسبوع، ثم شهر",
      icon: "repeat"
    },
    {
      title: "الخرائط الذهنية",
      description: "ارسم خرائط ذهنية لربط الكلمات والقواعد ببعضها البعض",
      icon: "map"
    },
    {
      title: "التعلم النشط",
      description: "لا تقرأ فقط، بل حاول تطبيق ما تعلمته في جمل ومحادثات",
      icon: "zap"
    }
  ];

  const resources = [
    "تطبيق Duolingo للتدريب اليومي",
    "قناة BBC Learning English على يوتيوب",
    "موقع British Council للدروس المجانية",
    "تطبيق Anki للبطاقات التعليمية"
  ];

  return {
    level: determinedLevel,
    weaknesses,
    tips,
    techniques,
    resources
  };
}
