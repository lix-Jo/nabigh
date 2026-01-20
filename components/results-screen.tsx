"use client";

import React from "react"

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Target,
  TrendingUp,
  Lightbulb,
  Timer,
  Repeat,
  Map,
  Zap,
  Calendar,
  Headphones,
  Pencil,
  Mic,
  BookOpen,
  RotateCcw,
  Award,
  AlertTriangle
} from "lucide-react";
import { placementTest, levelInfo, analyzeWeaknesses } from "@/lib/questions-data";
import { cn } from "@/lib/utils";

interface Answer {
  questionId: number;
  answer: string;
  correct: boolean;
  timeSpent: number;
}

interface ResultsScreenProps {
  answers: Answer[];
  totalTime: number;
  onRestart: () => void;
}

export function ResultsScreen({ answers, totalTime, onRestart }: ResultsScreenProps) {
  const analysis = useMemo(() => {
    return analyzeWeaknesses(answers, placementTest);
  }, [answers]);

  const correctCount = answers.filter(a => a.correct).length;
  const accuracy = Math.round((correctCount / answers.length) * 100);
  const avgTimePerQuestion = Math.round(totalTime / answers.length / 1000);
  const level = levelInfo[analysis.level];

  const formatTotalTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      timer: <Timer className="h-6 w-6" />,
      repeat: <Repeat className="h-6 w-6" />,
      map: <Map className="h-6 w-6" />,
      zap: <Zap className="h-6 w-6" />,
      calendar: <Calendar className="h-6 w-6" />,
      headphones: <Headphones className="h-6 w-6" />,
      pencil: <Pencil className="h-6 w-6" />,
      mic: <Mic className="h-6 w-6" />
    };
    return icons[iconName] || <Lightbulb className="h-6 w-6" />;
  };

  const getWeaknessText = (weakness: string) => {
    if (weakness.endsWith("-slow")) {
      const lvl = weakness.replace("-slow", "");
      return `بطء في أسئلة المستوى ${lvl}`;
    }
    return `صعوبة في المستوى ${weakness}`;
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            نتائج اختبار تحديد المستوى
          </h1>
          <p className="text-muted-foreground">
            تم تحليل إجاباتك وتحديد مستواك في اللغة الإنجليزية
          </p>
        </div>

        {/* Level Card */}
        <Card className="relative mb-8 overflow-hidden border-border bg-card">
          <div className={cn("absolute inset-x-0 top-0 h-2 bg-gradient-to-r", level.color)} />
          <CardContent className="p-8">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="text-center md:text-right">
                <Badge className="mb-3 bg-primary/10 text-primary">
                  <Award className="ml-1 h-4 w-4" />
                  مستواك الحالي
                </Badge>
                <h2 className="text-5xl font-bold text-primary">{analysis.level}</h2>
                <p className="mt-1 text-xl font-medium text-foreground">{level.nameAr}</p>
                <p className="mt-2 text-muted-foreground">{level.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <div className="mb-1 flex items-center justify-center text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{correctCount}/{answers.length}</p>
                  <p className="text-xs text-muted-foreground">الإجابات الصحيحة</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <div className="mb-1 flex items-center justify-center text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{accuracy}%</p>
                  <p className="text-xs text-muted-foreground">نسبة الدقة</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <div className="mb-1 flex items-center justify-center text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{formatTotalTime(totalTime)}</p>
                  <p className="text-xs text-muted-foreground">الوقت الكلي</p>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <div className="mb-1 flex items-center justify-center text-primary">
                    <Timer className="h-5 w-5" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{avgTimePerQuestion}ث</p>
                  <p className="text-xs text-muted-foreground">متوسط السؤال</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Level Scale */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              معيار تحديد المستوى
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center md:grid-cols-6">
              {[
                { level: "A1", range: "0-2", label: "مبتدئ" },
                { level: "A2", range: "3-4", label: "أساسي" },
                { level: "B1", range: "5-6", label: "متوسط" },
                { level: "B2", range: "7-8", label: "فوق المتوسط" },
                { level: "C1", range: "9", label: "متقدم" },
                { level: "C2", range: "10-12", label: "متمكن" },
              ].map((item) => (
                <div
                  key={item.level}
                  className={cn(
                    "rounded-lg border-2 p-2 transition-all",
                    analysis.level === item.level
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted/30"
                  )}
                >
                  <p className={cn(
                    "text-lg font-bold",
                    analysis.level === item.level ? "text-primary" : "text-foreground"
                  )}>{item.level}</p>
                  <p className="text-xs text-muted-foreground">{item.range} صحيحة</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {/* Correct/Wrong */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                تفاصيل الإجابات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex justify-between">
                <span className="text-muted-foreground">الإجابات الصحيحة</span>
                <span className="font-bold text-green-600 dark:text-green-400">{correctCount}</span>
              </div>
              <div className="mb-4 flex justify-between">
                <span className="text-muted-foreground">الإجابات الخاطئة</span>
                <span className="font-bold text-red-600 dark:text-red-400">{answers.length - correctCount}</span>
              </div>
              <Progress value={accuracy} className="h-3" />
            </CardContent>
          </Card>

          {/* Weaknesses */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                نقاط تحتاج تحسين
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.weaknesses.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.weaknesses.map((weakness, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      {getWeaknessText(weakness)}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-green-600 dark:text-green-400">
                  أداء ممتاز! لا توجد نقاط ضعف واضحة
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Study Tips */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="h-6 w-6 text-primary" />
              نصائح للمذاكرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-xl border border-border bg-accent/30 p-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getIconComponent(tip.icon)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Techniques */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-6 w-6 text-primary" />
              تقنيات فعالة للمذاكرة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {analysis.techniques.map((technique, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/30 p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      {getIconComponent(technique.icon)}
                    </div>
                    <h4 className="text-lg font-bold text-foreground">{technique.title}</h4>
                  </div>
                  <p className="leading-relaxed text-muted-foreground">{technique.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="mb-8 border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-6 w-6 text-primary" />
              مصادر مقترحة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {analysis.resources.map((resource, idx) => (
                <li key={idx} className="flex items-center gap-3 text-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  {resource}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Restart Button */}
        <div className="flex justify-center">
          <Button onClick={onRestart} size="lg" className="gap-2 px-8">
            <RotateCcw className="h-5 w-5" />
            إعادة الاختبار
          </Button>
        </div>
      </div>
    </div>
  );
}
