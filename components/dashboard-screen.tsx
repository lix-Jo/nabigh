"use client"

import { 
  Brain, 
  Clock, 
  AlertTriangle, 
  Target, 
  TrendingUp,
  BookOpen,
  Headphones,
  MessageSquare,
  Trophy,
  Zap,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { TestResults } from "./test-screen"

interface DashboardScreenProps {
  results: TestResults
  onRestart: () => void
}

function CircularProgress({ 
  value, 
  label, 
  sublabel,
  color = "primary"
}: { 
  value: number
  label: string
  sublabel: string
  color?: "primary" | "accent" | "success"
}) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (value / 100) * circumference
  
  const colorClasses = {
    primary: "stroke-primary",
    accent: "stroke-chart-2",
    success: "stroke-green-500"
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r="45"
            className="stroke-muted fill-none"
            strokeWidth="8"
          />
          <circle
            cx="56"
            cy="56"
            r="45"
            className={`${colorClasses[color]} fill-none transition-all duration-1000 ease-out`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{value}%</span>
        </div>
      </div>
      <span className="mt-2 font-semibold text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{sublabel}</span>
    </div>
  )
}

function getLevel(score: number): string {
  if (score >= 90) return "C1"
  if (score >= 75) return "B2"
  if (score >= 60) return "B1"
  if (score >= 45) return "A2"
  return "A1"
}

function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    "C1": "متقدم",
    "B2": "فوق المتوسط",
    "B1": "متوسط",
    "A2": "ما قبل المتوسط",
    "A1": "مبتدئ"
  }
  return labels[level] || "مبتدئ"
}

export function DashboardScreen({ results, onRestart }: DashboardScreenProps) {
  const level = getLevel(results.score)
  const speedScore = Math.max(0, Math.min(100, 100 - (results.averageTime - 5) * 5))
  
  // AI Insights based on behavior
  const insights = []
  
  if (results.averageTime > 15) {
    insights.push({
      icon: Clock,
      title: "استيعاب بطيء",
      description: "لاحظنا أنك تأخذ وقتاً أطول في الإجابة. ننصحك بالتركيز على فهم الأساسيات أولاً.",
      suggestion: "شروحات مبسطة",
      color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
    })
  }
  
  if (results.distractions > 0) {
    insights.push({
      icon: AlertTriangle,
      title: "تشتت الانتباه",
      description: `لاحظنا ${results.distractions} مرة تشتت أثناء الاختبار. حاول التركيز في بيئة هادئة.`,
      suggestion: "تقنية بومودورو",
      color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
    })
  }
  
  if (results.answerChanges > 2) {
    insights.push({
      icon: Target,
      title: "تردد في الإجابة",
      description: `غيرت إجابتك ${results.answerChanges} مرات. ثق بنفسك أكثر وتأنى في قراءة السؤال.`,
      suggestion: "تمارين تعزيز الثقة",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    })
  }

  if (insights.length === 0) {
    insights.push({
      icon: Trophy,
      title: "أداء ممتاز!",
      description: "أظهرت تركيزاً عالياً وثقة في إجاباتك. استمر على هذا النهج!",
      suggestion: "تحديات متقدمة",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
    })
  }

  const recommendedContent = [
    {
      title: "Grammar Basics",
      description: "تعلم أساسيات القواعد الإنجليزية بطريقة مبسطة وممتعة",
      icon: BookOpen,
      duration: "15 دقيقة",
      level: "مناسب لمستواك"
    },
    {
      title: "Listening Practice",
      description: "تمارين استماع تفاعلية لتحسين مهارات الفهم السمعي",
      icon: Headphones,
      duration: "20 دقيقة",
      level: "تحدي جديد"
    },
    {
      title: "Conversation Skills",
      description: "محادثات يومية لتطوير مهارات التواصل",
      icon: MessageSquare,
      duration: "10 دقائق",
      level: "مناسب لمستواك"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">لوحة التحكم الذكية</h1>
                <p className="text-sm text-muted-foreground">نتائج تقييمك الشخصي</p>
              </div>
            </div>
            <Button variant="outline" onClick={onRestart} className="gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              إعادة الاختبار
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Level Card */}
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-right">
                <p className="text-sm opacity-80 mb-1">مستواك الحالي</p>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-4xl font-bold">{level}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{getLevelLabel(level)}</h2>
                    <p className="opacity-80">
                      أجبت على {results.correctAnswers} من {results.totalQuestions} أسئلة بشكل صحيح
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">{results.score}%</div>
                  <div className="text-sm opacity-80">الدرجة الكلية</div>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div className="text-center">
                  <div className="text-4xl font-bold">{results.averageTime}s</div>
                  <div className="text-sm opacity-80">متوسط الوقت</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Performance Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Circles */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  تحليل الأداء
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around items-center py-4">
                  <CircularProgress 
                    value={results.score} 
                    label="الدقة" 
                    sublabel="نسبة الإجابات الصحيحة"
                    color="primary"
                  />
                  <CircularProgress 
                    value={Math.round(speedScore)} 
                    label="السرعة" 
                    sublabel="سرعة الاستجابة"
                    color="accent"
                  />
                  <CircularProgress 
                    value={Math.max(0, 100 - results.distractions * 20)} 
                    label="التركيز" 
                    sublabel="مستوى الانتباه"
                    color="success"
                  />
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  تحليل الذكاء الاصطناعي
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-accent/30 rounded-xl">
                    <div className={`w-12 h-12 rounded-xl ${insight.color} flex items-center justify-center shrink-0`}>
                      <insight.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-foreground mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                        <Zap className="w-3 h-3" />
                        {insight.suggestion}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recommended Content */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              محتوى مقترح لك
            </h3>
            
            {recommendedContent.map((content, idx) => (
              <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <content.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground mb-1" dir="ltr">{content.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{content.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground">
                          {content.duration}
                        </span>
                        <span className="px-2 py-0.5 bg-primary/10 rounded-full text-primary">
                          {content.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-accent/50 to-secondary/50">
              <CardContent className="p-4">
                <h4 className="font-bold text-foreground mb-3">إحصائيات سريعة</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">أسرع إجابة</span>
                    <span className="font-mono font-bold text-foreground">
                      {Math.min(...results.questionTimes)}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">أبطأ إجابة</span>
                    <span className="font-mono font-bold text-foreground">
                      {Math.max(...results.questionTimes)}s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">تغييرات الإجابة</span>
                    <span className="font-bold text-foreground">{results.answerChanges}</span>
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
