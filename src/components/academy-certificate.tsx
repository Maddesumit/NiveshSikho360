"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Star } from 'lucide-react';
import { NiveshSikho360Icon } from "./icons";
import { Skeleton } from './ui/skeleton';

export default function AcademyCertificate({ courseTitle }: { courseTitle: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card className="max-w-4xl mx-auto border-2 border-primary/50 shadow-lg bg-background/80 backdrop-blur-sm">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <Award className="w-20 h-20 text-primary mx-auto" />
          <h2 className="text-3xl font-bold font-headline text-primary">Certificate of Achievement</h2>
          <p className="text-muted-foreground text-lg">This certifies that</p>
          <p className="text-4xl font-headline">A Valued Trader</p>
          <p className="text-muted-foreground text-lg">has successfully completed the course</p>
          <p className="text-2xl font-semibold font-headline">"{courseTitle}"</p>
        </div>

        <div className="text-center bg-primary/10 p-4 rounded-lg">
            <h3 className="flex items-center justify-center gap-2 font-semibold text-primary"><Star className="w-5 h-5" /> Reward Unlocked!</h3>
            <p className="text-muted-foreground">You have been awarded 10,000 virtual cash for your dedication!</p>
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t border-dashed">
            <div className="flex items-center gap-2">
                <NiveshSikho360Icon className="w-8 h-8 text-accent" />
                <span className="font-headline font-semibold text-xl text-accent">
                    NiveshSikho360 Academy
                </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {isClient ? (
                `Issued on: ${new Date().toLocaleDateString()}`
              ) : (
                <Skeleton className="h-5 w-32" />
              )}
            </div>
        </div>

        <div className="text-center pt-4">
            <Button>
                <Download className="mr-2" /> Download Certificate
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
