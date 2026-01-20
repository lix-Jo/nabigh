"use client"

import { GraduationCap, BookOpen, Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AuthScreenProps {
  onStart: () => void
}

export function AuthScreen({ onStart }: AuthScreenProps) {
  return (
    <div className="min-h-screen flex">
      {/* Right Side - Decorative (appears on left in RTL) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-primary-foreground">
          <div className="mb-8">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6 mx-auto backdrop-blur-sm">
              <GraduationCap className="w-12 h-12" />
            </div>
            <h1 className="text-4xl font-bold text-center mb-2">VEGA</h1>
            <p className="text-lg opacity-90 text-center">اليوم الدولي للتعليم</p>
          </div>

          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">تحليل ذكي</h3>
                <p className="text-sm opacity-80">نظام AI متقدم لتحليل أدائك</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">محتوى تفاعلي</h3>
                <p className="text-sm opacity-80">دروس مصممة خصيصاً لك</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">نتائج مبهرة</h3>
                <p className="text-sm opacity-80">تقدم ملحوظ في وقت قصير</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Side - Auth Form (appears on right in RTL) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-primary">VEGA</h1>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  مرحبًا بك في منصة التعليم الذكي
                </h2>
                <p className="text-muted-foreground">
                  سجل دخولك للبدء في رحلة التعلم
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    className="h-12 text-base"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">كلمة المرور</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-12 text-base"
                    dir="ltr"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold"
                  onClick={onStart}
                >
                  تسجيل الدخول
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground">أو</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 text-base font-semibold bg-transparent"
                onClick={onStart}
              >
                ابدأ كزائر
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                ليس لديك حساب؟{" "}
                <button className="text-primary font-semibold hover:underline">
                  سجل الآن
                </button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
