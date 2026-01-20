"use client"

import { useState } from "react"
import { ChevronRight, Clock, BookOpen } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const questions = [
  {
    id: 1,
    question: "What is the past tense of 'Go'?",
    options: ["Goed", "Went", "Gone", "Going"],
    correct: 1,
    category: "Grammar",
  },
  {
    id: 2,
    question: "Which word is a synonym for 'Happy'?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correct: 1,
    category: "Vocabulary",
  },
  {
    id: 3,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2,
    category: "Geography",
  },
]

interface ExamCardProps {
  onAnswerSelect?: (questionId: number, answer: number, isCorrect: boolean, timeTaken: number) => void
  onNextQuestion?: () => void
}

export function ExamCard({ onAnswerSelect, onNextQuestion }: ExamCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [startTime] = useState(Date.now())

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const handleOptionClick = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
    setIsAnswered(true)
    
    const timeTaken = (Date.now() - startTime) / 1000
    const isCorrect = index === question.correct
    onAnswerSelect?.(question.id, index, isCorrect, timeTaken)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      onNextQuestion?.()
    }
  }

  return (
    <Card className="h-full border-border bg-card shadow-lg">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold text-foreground">The Exam</CardTitle>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">{question.category}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div 
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question */}
        <div className="rounded-xl bg-secondary/50 p-6">
          <p className="text-lg font-medium leading-relaxed text-foreground">
            {question.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrect = index === question.correct
            const showResult = isAnswered

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={isAnswered}
                className={cn(
                  "w-full rounded-xl border-2 p-4 text-left transition-all duration-200",
                  "hover:border-primary/50 hover:bg-primary/5",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
                  !showResult && isSelected && "border-primary bg-primary/10",
                  !showResult && !isSelected && "border-border bg-card",
                  showResult && isCorrect && "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                  showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                  showResult && !isSelected && !isCorrect && "border-border bg-card opacity-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                    !showResult && "bg-secondary text-foreground",
                    showResult && isCorrect && "bg-green-500 text-white",
                    showResult && isSelected && !isCorrect && "bg-red-500 text-white",
                    showResult && !isSelected && !isCorrect && "bg-secondary text-foreground"
                  )}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <Button 
          onClick={handleNext}
          disabled={!isAnswered || currentQuestion >= questions.length - 1}
          className="w-full gap-2 py-6 text-base font-semibold"
          size="lg"
        >
          Next Question
          <ChevronRight className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  )
}
