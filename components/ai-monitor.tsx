"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Brain, Activity, Zap, Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CircularProgressProps {
  value: number
  label: string
  icon: React.ReactNode
  color: string
  size?: number
}

function CircularProgress({ value, label, icon, color, size = 120 }: CircularProgressProps) {
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg className="absolute inset-0 -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-secondary"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">{value}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

interface AIMonitorProps {
  accuracy?: number
  speed?: number
}

const aiFeedbackMessages = [
  "Student is hesitating on Grammar questions...",
  "Strong performance in vocabulary section.",
  "Response time improving steadily.",
  "Consider reviewing past tense irregular verbs.",
  "Excellent focus detected. Keep it up!",
  "Analyzing response patterns...",
  "Student shows confidence in current topic.",
  "Recommendation: Take a short break soon.",
]

export function AIMonitor({ accuracy = 78, speed = 65 }: AIMonitorProps) {
  const [currentFeedback, setCurrentFeedback] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  // Typing animation effect
  useEffect(() => {
    const message = aiFeedbackMessages[currentFeedback]
    let charIndex = 0
    setDisplayedText("")
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (charIndex < message.length) {
        setDisplayedText(message.slice(0, charIndex + 1))
        charIndex++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, 40)

    return () => clearInterval(typingInterval)
  }, [currentFeedback])

  // Cycle through feedback messages
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentFeedback((prev) => (prev + 1) % aiFeedbackMessages.length)
    }, 5000)

    return () => clearInterval(messageInterval)
  }, [])

  return (
    <Card className="h-full border-border bg-card shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <Brain className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">Smart Tracking System</CardTitle>
            <p className="text-sm text-muted-foreground">AI-Powered Analysis</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Circular Progress Indicators */}
        <div className="flex items-center justify-around py-4">
          <CircularProgress
            value={accuracy}
            label="Accuracy"
            icon={<Target className="h-4 w-4 text-primary" />}
            color="hsl(var(--primary))"
          />
          <CircularProgress
            value={speed}
            label="Speed"
            icon={<Zap className="h-4 w-4 text-accent" />}
            color="hsl(var(--accent))"
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-secondary/50 p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Avg Response</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-foreground">4.2s</p>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Improvement</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">+12%</p>
          </div>
        </div>

        {/* Live Analysis Panel */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-semibold text-foreground">Live Analysis</span>
          </div>
          
          <div className="min-h-[100px] rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-sm leading-relaxed text-foreground">
              {displayedText}
              {isTyping && (
                <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-primary" />
              )}
            </p>
          </div>

          {/* Feedback indicators */}
          <div className="flex justify-center gap-1.5">
            {aiFeedbackMessages.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === currentFeedback ? "w-4 bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
