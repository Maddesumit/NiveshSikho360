
"use client";

import { useState } from 'react';
import type { AcademyModule } from '@/data/academy';
import { useNiveshStore } from '@/hooks/use-trade-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, BookText, Brain, RotateCcw, FileText, CheckCircle2, Check, X } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Quiz Component
const Quiz = ({ module, onQuizComplete }: { module: AcademyModule, onQuizComplete: (isPassed: boolean) => void }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [showResults, setShowResults] = useState(false);
  
    const handleAnswerSelect = (answer: string) => {
      setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
    };
  
    const handleNext = () => {
      if (currentQuestionIndex < module.quiz.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setShowResults(true);
        const score = calculateScore();
        const passPercentage = 80;
        onQuizComplete(score >= passPercentage);
      }
    };
  
    const calculateScore = () => {
      let correctAnswers = 0;
      module.quiz.forEach((q, index) => {
        if (selectedAnswers[index] === q.correctAnswer) {
          correctAnswers++;
        }
      });
      return (correctAnswers / module.quiz.length) * 100;
    };
  
    const resetQuiz = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setShowResults(false);
      onQuizComplete(false);
    };
  
    if (showResults) {
      const score = calculateScore();
      const isPassed = score >= 80;
      return (
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold font-headline">Quiz Results</h3>
            <p className={`text-4xl font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
              You scored {score.toFixed(0)}%
            </p>
            {isPassed ? (
              <p className="text-green-600 font-semibold flex items-center justify-center gap-2"><CheckCircle2 /> Module Complete!</p>
            ): (
              <p className="text-muted-foreground">You need 80% to pass. Don't worry, you can try again!</p>
            )}
          </div>
    
          <div className="space-y-3 pt-4 border-t mt-4">
            <h4 className="font-semibold text-center text-lg">Review Your Answers</h4>
            {module.quiz.map((q, index) => {
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
          </div>
          
          <div className="flex justify-center gap-2 pt-4">
            <Button onClick={resetQuiz}><RotateCcw className="mr-2" /> Try Again</Button>
            <Button asChild><Link href="/academy">Back to Course</Link></Button>
          </div>
        </div>
      );
    }
  
    const currentQuestion = module.quiz[currentQuestionIndex];
  
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground">Question {currentQuestionIndex + 1} of {module.quiz.length}</p>
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
          {currentQuestionIndex < module.quiz.length - 1 ? 'Next' : 'Submit'} <ArrowRight className="ml-2" />
        </Button>
      </div>
    );
  };
  
// Flashcards Component
const Flashcards = ({ module }: { module: AcademyModule }) => {
    const [flipped, setFlipped] = useState<Record<number, boolean>>({});

    const handleFlip = (index: number) => {
        setFlipped(prev => ({ ...prev, [index]: !prev[index] }));
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {module.quiz.map((item, index) => (
                <div key={index} className="perspective-1000" onClick={() => handleFlip(index)}>
                    <div className={`relative w-full h-40 transform-style-3d transition-transform duration-500 ${flipped[index] ? 'rotate-y-180' : ''}`}>
                        {/* Front of card */}
                        <div className="absolute w-full h-full backface-hidden border rounded-lg bg-card p-4 flex items-center justify-center text-center">
                            <p className="font-semibold">{item.question}</p>
                        </div>
                        {/* Back of card */}
                        <div className="absolute w-full h-full backface-hidden border rounded-lg bg-primary/20 p-4 flex items-center justify-center text-center rotate-y-180">
                            <p className="font-bold text-primary-foreground">{item.correctAnswer}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};


// Main Component
export default function ModuleClient({ module }: { module: AcademyModule }) {
    const { state, dispatch } = useNiveshStore();

    const handleQuizComplete = (isPassed: boolean) => {
        if (isPassed && !state.completedModules.includes(module.id)) {
            dispatch({ type: 'COMPLETE_MODULE', payload: module.id });
        }
    };

    return (
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <Link href="/academy" className="text-sm text-primary hover:underline">&larr; Back to Course</Link>
        <div className="space-y-2">
            <Badge variant="secondary">{module.level}</Badge>
            <h1 className="text-4xl font-bold tracking-tight font-headline">{module.title}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookText /> Explanation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 prose prose-sm max-w-none">
                    <p>{module.explanation}</p>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText /> Real World Example</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="italic bg-muted p-4 rounded-md">{module.example}</p>
                     <Button asChild>
                        <Link href="/">
                            Try This Now in the Simulator
                        </Link>
                    </Button>
                </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Brain /> Knowledge Check</CardTitle>
                    <CardDescription>Learn with Flashcards or take the Quiz to mark this module as complete.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="quiz">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="quiz">Quiz</TabsTrigger>
                            <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                        </TabsList>
                        <TabsContent value="quiz" className="pt-4">
                            <Quiz module={module} onQuizComplete={handleQuizComplete} />
                        </TabsContent>
                        <TabsContent value="flashcards" className="pt-4">
                            <Flashcards module={module} />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
