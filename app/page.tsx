"use client";

import { useState, useCallback } from "react";
import { NabighNavbar } from "@/components/nabigh-navbar";
import { PlacementTest } from "@/components/placement-test";
import { ResultsScreen } from "@/components/results-screen";

interface Answer {
  questionId: number;
  answer: string;
  correct: boolean;
  timeSpent: number;
}

type Screen = "test" | "results";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("test");
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [totalTime, setTotalTime] = useState(0);

  const handleTestComplete = useCallback((testAnswers: Answer[], time: number) => {
    setAnswers(testAnswers);
    setTotalTime(time);
    setScreen("results");
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers([]);
    setTotalTime(0);
    setScreen("test");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NabighNavbar />
      
      {screen === "test" && (
        <PlacementTest onComplete={handleTestComplete} />
      )}
      
      {screen === "results" && (
        <ResultsScreen
          answers={answers}
          totalTime={totalTime}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
