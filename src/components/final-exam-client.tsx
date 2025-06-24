"use client";

import { useState } from 'react';
import { getCourse } from '@/data/academy';
import { useNiveshStore } from '@/hooks/use-trade-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, RotateCcw, PartyPopper } from 'lucide-react';
import AcademyCertificate from './academy-certificate';
import Link from 'next/link';

export default function FinalExamClient() {
  const { state, dispatch } = useNiveshStore();
  const { courseCompleted } = state;
  const course = getCourse();
  const quiz = course.finalQuiz;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      calculateAndSubmitScore();
    }
  };

  const calculateAndSubmitScore = () => {
    let correctAnswers = 0;
    quiz.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = (correctAnswers / quiz.length) * 100;
    setScore(finalScore);

    if (finalScore >= 70 && !courseCompleted) {
        dispatch({ type: 'COMPLETE_COURSE' });
    }
    setShowResults(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  if (courseCompleted || showResults) {
    const isPassed = score >= 70 || courseCompleted;
    if (isPassed) {
      return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          <div className="text-center mb-8">
            <PartyPopper className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold tracking-tight font-headline">Congratulations!</h1>
            <p className="text-lg text-muted-foreground">You passed the final exam.</p>
          </div>
          <AcademyCertificate courseTitle={course.title} />
        </div>
      );
    } else { // Failed and showing results
        return (
            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 flex items-center justify-center">
                <Card className="max-w-xl text-center">
                    <CardHeader>
                        <CardTitle>Quiz Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-4xl font-bold text-red-600">
                            You scored {score.toFixed(0)}%
                        </p>
                        <p className="text-muted-foreground">You need 70% to pass. Don't worry, you can try again!</p>
                        <Button onClick={resetQuiz}><RotateCcw className="mr-2" /> Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
  }

  const currentQuestion = quiz[currentQuestionIndex];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
            <Link href="/academy" className="text-sm text-primary hover:underline">&larr; Back to Course</Link>
            <CardTitle className="font-headline">Final Exam</CardTitle>
            <CardDescription>Test your knowledge of all modules.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.length}</p>
            <h3 className="text-lg font-semibold">{currentQuestion.question}</h3>
            <RadioGroup onValueChange={handleAnswerSelect} value={selectedAnswers[currentQuestionIndex]}>
            {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded-md border border-transparent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                <RadioGroupItem value={option} id={`q${currentQuestionIndex}-o${index}`} />
                <Label htmlFor={`q${currentQuestionIndex}-o${index}`} className="flex-1 cursor-pointer">{option}</Label>
                </div>
            ))}
            </RadioGroup>
            <Button onClick={handleNext} disabled={!selectedAnswers[currentQuestionIndex]}>
            {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'Finish & See Results'} <ArrowRight className="ml-2" />
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
