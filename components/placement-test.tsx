"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { placementTest, type Question } from "@/lib/questions-data";
import { cn } from "@/lib/utils";

interface Answer {
  questionId: number;
  answer: string;
  correct: boolean;
  timeSpent: number;
}

interface PlacementTestProps {
  onComplete: (answers: Answer[], totalTime: number) => void;
}

export function PlacementTest({ onComplete }: PlacementTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [totalStartTime] = useState(Date.now());
  const [questionTime, setQuestionTime] = useState(0);

  const currentQuestion: Question = placementTest[currentIndex];
  const progress = ((currentIndex + 1) / placementTest.length) * 100;

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setQuestionTime(0);
  }, [currentIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showResult) {
        setQuestionTime(Math.floor((Date.now() - questionStartTime) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [questionStartTime, showResult]);

  const handleSelectAnswer = useCallback((option: string) => {
    if (showResult) return;
    setSelectedAnswer(option);
    setShowResult(true);

    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = option === currentQuestion.correct;

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      answer: option,
      correct: isCorrect,
      timeSpent
    };

    setAnswers(prev => [...prev, newAnswer]);
  }, [showResult, questionStartTime, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < placementTest.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const totalTime = Date.now() - totalStartTime;
      onComplete(answers, totalTime);
    }
  }, [currentIndex, answers, totalStartTime, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      A1: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      A2: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      B1: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      B2: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      C1: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
      C2: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    };
    return colors[level] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            اختبار تحديد المستوى
          </h1>
          <p className="text-muted-foreground">
            أجب على الأسئلة التالية لتحديد مستواك في اللغة الإنجليزية
          </p>
        </div>

        {/* Progress Section */}
        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  السؤال {currentIndex + 1} من {placementTest.length}
                </span>
                <Badge className={getLevelColor(currentQuestion.level)}>
                  {currentQuestion.level}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">{formatTime(questionTime)}</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="mb-6 border-border bg-card shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl leading-relaxed text-card-foreground">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correct;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option)}
                  disabled={showResult}
                  className={cn(
                    "w-full rounded-xl border-2 p-4 text-right transition-all duration-200",
                    "hover:border-primary/50 hover:bg-accent/50",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50",
                    "disabled:cursor-not-allowed",
                    !showResult && isSelected && "border-primary bg-primary/10",
                    !showResult && !isSelected && "border-border bg-background",
                    showResult && isCorrect && "border-green-500 bg-green-500/10",
                    showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-lg font-medium",
                        showResult && isCorrect && "text-green-700 dark:text-green-400",
                        showResult && isSelected && !isCorrect && "text-red-700 dark:text-red-400",
                        !showResult && "text-foreground"
                      )}
                    >
                      {option}
                    </span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Next Button */}
        {showResult && (
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              size="lg"
              className="gap-2 px-8"
            >
              <ArrowLeft className="h-5 w-5" />
              {currentIndex < placementTest.length - 1 ? "السؤال التالي" : "عرض النتائج"}
            </Button>
          </div>
        )}

        {/* Answer Summary */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {placementTest.map((_, idx) => {
            const answer = answers[idx];
            return (
              <div
                key={idx}
                className={cn(
                  "h-3 w-3 rounded-full transition-all",
                  idx === currentIndex && "ring-2 ring-primary ring-offset-2",
                  !answer && "bg-muted",
                  answer?.correct && "bg-green-500",
                  answer && !answer.correct && "bg-red-500"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
