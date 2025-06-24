
"use client";

import { useState } from 'react';
import { getCourse } from '@/data/academy';
import { useNiveshStore } from '@/hooks/use-trade-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, RotateCcw, PartyPopper, Check, X } from 'lucide-react';
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

  const ExamReview = () => (
    <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
            <CardTitle>Your Exam Review</CardTitle>
            <CardDescription>You scored {score.toFixed(0)}%.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[40vh] overflow-y-auto p-4">
          {quiz.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.correctAnswer;
              return (
                  <div key={index} className={`p-3 rounded-md border text-sm ${isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`} >
                      <p className="font-semibold">{q.question}</p>
                      <p className={`mt-2 flex items-center gap-1.5 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                          Your answer: <span className="font-medium">{userAnswer || "Not answered"}</span>
                      </p>
                      {!isCorrect && (
                          <p className="mt-1 flex items-center gap-1.5 text-green-700">
                             <Check className="w-4 h-4 text-green-700" />
                             Correct answer: <span className="font-medium">{q.correctAnswer}</span>
                          </p>
                      )}
                  </div>
              )
          })}
        </CardContent>
    </Card>
  );

  if (courseCompleted || showResults) {
    const isPassed = score >= 70 || courseCompleted;
    if (isPassed) {
      return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          <div className="text-center mb-8">
            <PartyPopper className="w-16 h-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold tracking-tight font-headline">Congratulations!</h1>
            <p className="text-lg text-muted-foreground">
              {showResults ? `You passed the final exam!` : "You have already completed the course."}
            </p>
          </div>
          {showResults && <ExamReview />}
          <AcademyCertificate courseTitle={course.title} />
        </div>
      );
    } else { // Failed and showing results
        return (
          <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 flex items-center justify-center">
              <div className="w-full max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold tracking-tight font-headline">Try Again!</h1>
                    <p className="text-lg text-muted-foreground">You need 70% to pass.</p>
                </div>
                <ExamReview />
                <div className="text-center mt-6">
                    <Button onClick={resetQuiz} size="lg"><RotateCcw className="mr-2" /> Take Exam Again</Button>
                </div>
              </div>
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
