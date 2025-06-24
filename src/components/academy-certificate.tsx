"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award } from 'lucide-react';
import { TradeVastuIcon } from "./icons";

export default function AcademyCertificate({ topicTitle }: { topicTitle: string }) {
  return (
    <Card className="max-w-4xl mx-auto border-2 border-primary/50 shadow-lg">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <Award className="w-20 h-20 text-primary mx-auto" />
          <h2 className="text-3xl font-bold font-headline text-primary">Certificate of Completion</h2>
          <p className="text-muted-foreground text-lg">This certifies that</p>
          <p className="text-4xl font-headline">A Valued Trader</p>
          <p className="text-muted-foreground text-lg">has successfully completed the course</p>
          <p className="text-2xl font-semibold font-headline">"{topicTitle}"</p>
        </div>
        
        <div className="flex justify-between items-center pt-6 border-t border-dashed">
            <div className="flex items-center gap-2">
                <TradeVastuIcon className="w-8 h-8 text-accent" />
                <span className="font-headline font-semibold text-xl text-accent">
                    TradeVastu Academy
                </span>
            </div>
            <p className="text-sm text-muted-foreground">Issued on: {new Date().toLocaleDateString()}</p>
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
