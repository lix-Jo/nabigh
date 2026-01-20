"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Clock, Brain, AlertTriangle, ChevronLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface Question {
  id: number
  question: string
  options: string[]
  correct: number
  category: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is the past tense of 'go'?",
    options: ["goed", "went", "gone", "going"],
    correct: 1,
    category: "Grammar"
  },
  {
    id: 2,
    question: "Choose the correct word: 'She ___ to school every day.'",
    options: ["go", "goes", "going", "gone"],
    correct: 1,
    category: "Grammar"
  },
  {
    id: 3,
    question: "What is the synonym of 'happy'?",
    options: ["sad", "angry", "joyful", "tired"],
    correct: 2,
    category: "Vocabulary"
  },
  {
    id: 4,
    question: "Which sentence is correct?",
    options: [
      "He don't like coffee",
      "He doesn't likes coffee",
      "He doesn't like coffee",
      "He not like coffee"
    ],
    correct: 2,
    category: "Grammar"
  },
  {
    id: 5,
    question: "What is the opposite of 'difficult'?",
    options: ["hard", "easy", "complex", "tough"],
    correct: 1,
    category: "Vocabulary"
  }
]

export interface TestResults {
  score: number
  totalQuestions: number
  averageTime: number
  distractions: number
  answerChanges: number
  questionTimes: number[]
  correctAnswers: number
}

interface TestScreenProps {
  onComplete: (results: TestResults) => void
}

export function TestScreen({ onComplete }: TestScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [questionTimes, setQuestionTimes] = useState<number[]>([])
  const [currentTime, setCurrentTime] = useState(0)
  const [distractions, setDistractions] = useState(0)
  const [answerChanges, setAnswerChanges] = useState(0)
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const questionStartRef = useRef<number>(Date.now())

  // Timer effect
  useEffect(() => {
    questionStartRef.current = Date.now()
    setCurrentTime(0)
    
    timerRef.current = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - questionStartRef.current) / 1000))
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentQuestion])

  // Focus tracker - detect tab switching
  useEffect(() => {
    const handleBlur = () => {
      setDistractions(prev => prev + 1)
    }

    window.addEventListener("blur", handleBlur)
    return () => window.removeEventListener("blur", handleBlur)
  }, [])

  const handleOptionSelect = useCallback((optionIndex: number) => {
    if (hasAnsweredCurrent && selectedOption !== null) {
      setAnswerChanges(prev => prev + 1)
    }
    setSelectedOption(optionIndex)
    setHasAnsweredCurrent(true)
  }, [hasAnsweredCurrent, selectedOption])

  const handleNext = useCallback(() => {
    if (selectedOption === null) return

    const timeSpent = Math.floor((Date.now() - questionStartRef.current) / 1000)
    
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedOption
    setAnswers(newAnswers)

    const newTimes = [...questionTimes, timeSpent]
    setQuestionTimes(newTimes)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedOption(null)
      setHasAnsweredCurrent(false)
    } else {
      // Test complete
      const correctCount = newAnswers.reduce((count, answer, idx) => {
        return answer === questions[idx].correct ? count + 1 : count
      }, 0)

      const avgTime = newTimes.reduce((a, b) => a + b, 0) / newTimes.length

      onComplete({
        score: Math.round((correctCount / questions.length) * 100),
        totalQuestions: questions.length,
        averageTime: Math.round(avgTime),
        distractions,
        answerChanges,
        questionTimes: newTimes,
        correctAnswers: correctCount
      })
    }
  }, [selectedOption, answers, currentQuestion, questionTimes, distractions, answerChanges, onComplete])

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                
                <h1 className="text-sm text-muted-foreground">تقييم مهارات اللغة الإنجليزية</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono font-semibold text-foreground">{currentTime}s</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              السؤال {currentQuestion + 1} من {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Question Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {question.category}
                  </span>
                </div>
                <CardTitle className="text-xl leading-relaxed" dir="ltr">
                  {question.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={cn(
                      "w-full p-4 text-right rounded-xl border-2 transition-all duration-200 flex items-center gap-4",
                      selectedOption === idx
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50 hover:bg-accent/50 text-foreground"
                    )}
                    dir="ltr"
                  >
                    <span className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-colors",
                      selectedOption === idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-base">{option}</span>
                  </button>
                ))}

                <Button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className="w-full h-12 mt-6 text-base font-semibold"
                >
                  {currentQuestion < questions.length - 1 ? (
                    <>
                      التالي
                      <ChevronLeft className="w-5 h-5 mr-2" />
                    </>
                  ) : (
                    "إنهاء الاختبار"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Tracking Panel */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Brain className="w-5 h-5 text-primary" />
                  نظام التتبع الذكي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">وقت السؤال</span>
                    <span className="font-mono font-bold text-foreground">{currentTime}s</span>
                  </div>
                  <Progress value={Math.min(currentTime * 3.33, 100)} className="h-1.5" />
                </div>

                <div className="bg-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">التركيز</span>
                    <span className={cn(
                      "font-bold",
                      distractions === 0 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"
                    )}>
                      {distractions === 0 ? "ممتاز" : `${distractions} تشتت`}
                    </span>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">تغيير الإجابات</span>
                    <span className="font-bold text-foreground">{answerChanges}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">نصيحة</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      اقرأ السؤال بتمعن قبل اختيار الإجابة. لا تتردد كثيراً في اختيارك.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
