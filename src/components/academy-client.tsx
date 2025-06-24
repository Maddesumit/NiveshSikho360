"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { getAcademyTopics } from '@/data/academy';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export default function AcademyClient() {
  const topics = getAcademyTopics();

  const groupedTopics = useMemo(() => {
    return topics.reduce((acc, topic) => {
      const level = topic.level;
      if (!acc[level]) {
        acc[level] = [];
      }
      acc[level].push(topic);
      return acc;
    }, {} as Record<string, typeof topics>);
  }, [topics]);

  const levels: ('Beginner' | 'Intermediate' | 'Advanced')[] = ['Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <GraduationCap className="w-16 h-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight font-headline">NiveshSikho360 Academy</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Your journey to mastering the stock market starts here. Learn at your own pace with our bite-sized lessons, quizzes, and practical examples.
        </p>
      </div>

      <Accordion type="multiple" defaultValue={['Beginner']} className="w-full max-w-4xl mx-auto">
        {levels.map(level => (
          groupedTopics[level] && (
            <AccordionItem key={level} value={level}>
              <AccordionTrigger className="text-2xl font-headline">{level}</AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {groupedTopics[level].map(topic => (
                    <Link key={topic.id} href={`/academy/${topic.id}`} className="block hover:scale-[1.02] transition-transform">
                       <Card className="h-full hover:border-primary/50">
                        <CardHeader>
                            <CardTitle>{topic.title}</CardTitle>
                            <CardDescription>A brief introduction to {topic.title.toLowerCase()}.</CardDescription>
                        </CardHeader>
                       </Card>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        ))}
      </Accordion>
    </div>
  );
}
