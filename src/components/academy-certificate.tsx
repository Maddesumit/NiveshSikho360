"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Award, Star } from 'lucide-react';
import { NiveshSikho360Icon } from "./icons";
import { Skeleton } from './ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AcademyCertificate({ courseTitle }: { courseTitle: string }) {
  const { user } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleDownload = async () => {
    const input = certificateRef.current;
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2, backgroundColor: null });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps= pdf.getImageProperties(imgData);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;
    
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 15;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save('NiveshSikho360_Certificate.pdf');
  };

  return (
    <Card className="max-w-4xl mx-auto border-2 border-primary/50 shadow-lg bg-background/80 backdrop-blur-sm">
      <CardContent className="p-8 space-y-6">
        <div ref={certificateRef} className="space-y-6 bg-card p-4 rounded-lg">
          <div className="text-center space-y-4">
            <Award className="w-20 h-20 text-primary mx-auto" />
            <h2 className="text-3xl font-bold font-headline text-primary">Certificate of Achievement</h2>
            <p className="text-muted-foreground text-lg">This certifies that</p>
            <p className="text-4xl font-headline break-words">{user?.email || 'A Valued Trader'}</p>
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
        </div>

        <div className="text-center pt-4">
            <Button onClick={handleDownload}>
                <Download className="mr-2" /> Download Certificate
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
