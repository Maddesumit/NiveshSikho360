"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { getCourse, getModules } from '@/data/academy';
import { useNiveshStore } from '@/hooks/use-trade-store';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, CheckCircle2, Lock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function AcademyClient() {
  const course = getCourse();
  const modules = getModules();
  const { state } = useNiveshStore();
  const { completedModules } = state;

  const progress = (completedModules.length / modules.length) * 100;
  const allModulesCompleted = completedModules.length === modules.length;

  const groupedModules = useMemo(() => {
    return modules.reduce((acc, topic) => {
      const level = topic.level;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(topic);
      return acc;
    }, {} as Record<string, typeof modules>);
  }, [modules]);

  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <GraduationCap className="w-16 h-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight font-headline">{course.title}</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          {course.description}
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            You have completed {completedModules.length} of {modules.length} modules.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      <div className="max-w-4xl mx-auto space-y-8">
        {levels.map(level => (
          groupedModules[level] && (
            <div key={level}>
              <h2 className="text-2xl font-bold font-headline mb-4">{level} Modules</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {groupedModules[level].map(module => (
                  <Link key={module.id} href={`/academy/${module.id}`} className="block hover:scale-[1.02] transition-transform">
                    <Card className="h-full hover:border-primary/50 relative">
                       {completedModules.includes(module.id) && (
                         <CheckCircle2 className="absolute top-4 right-4 text-green-500" />
                       )}
                      <CardHeader>
                          <CardTitle>{module.title}</CardTitle>
                          <CardDescription>A brief introduction to {module.title.toLowerCase()}.</CardDescription>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      
      <div className="text-center mt-8">
        <h2 className="text-2xl font-bold font-headline mb-2">Final Exam</h2>
        <p className="text-muted-foreground mb-4">
          {allModulesCompleted ? "You've completed all modules! You can now take the final exam." : "Complete all modules above to unlock the final exam."}
        </p>
        <Button asChild size="lg" disabled={!allModulesCompleted}>
          <Link href="/academy/final-exam">
            {allModulesCompleted ? 'Take Final Exam' : <Lock className="mr-2" />}
            {allModulesCompleted ? '' : 'Unlock Exam'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
