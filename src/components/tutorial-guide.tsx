
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const tutorialSteps = [
    {
        title: 'Welcome to the NiveshSikho360 Tour!',
        description: "This guided walkthrough will introduce you to the core features of the platform. You'll learn how to find stocks, analyze them, and make your first virtual trade.",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'welcome dashboard',
    },
    {
        title: 'The Dashboard',
        description: "This is your main workspace. It's split into two parts: the stock watchlist on the left and the detailed stock viewer on the right. You can search for companies in the watchlist to get started.",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'dashboard analytics',
    },
    {
        title: 'Analyzing Price Charts',
        description: "The main chart shows a stock's historical price. You can use the buttons (1M, 6M, 1Y) to see its performance over different timeframes. This helps you spot trends.",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'stock chart',
    },
    {
        title: 'Key Information (Overview)',
        description: "Below the chart, you'll find key data like the day's open, high, and low prices. Hover over any term with an info icon to learn what it means. Many terms link directly to our Academy!",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'data overview',
    },
    {
        title: 'AI Performance Analysis',
        description: "Our AI provides a 'Performance Overview,' analyzing a stock's quality, valuation, and financial trends. This gives you deeper, at-a-glance insights into its fundamental health.",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'AI analysis',
    },
    {
        title: 'Making a Trade',
        description: 'Ready to invest? Click the main "Trade" button to open the trading panel. Here, you can enter the quantity of shares you want to buy or sell using your virtual cash.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'trade button',
    },
    {
        title: 'Your Portfolio',
        description: "After you buy shares, click on the 'Portfolio' page in the top navigation bar. It shows your holdings, your total invested amount, and your overall profit or loss.",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'portfolio page',
    },
    {
        title: 'Learning in the Academy',
        description: "Visit the 'Academy' to learn everything from basic terms to advanced strategies. Complete quizzes to test your knowledge and earn virtual rewards!",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'learning graduation',
    },
    {
        title: "You're All Set!",
        description: "That's the tour! You can reopen this guide anytime by clicking the help icon in the bottom-right corner. Explore, learn, and happy investing!",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'celebration success',
    },
];

export default function TutorialGuide({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: (open: boolean) => void }) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Reset to the first step whenever the dialog is opened
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleNext = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    const step = tutorialSteps[currentStep];
    const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="font-headline">{step.title}</DialogTitle>
                    <DialogDescription>Step {currentStep + 1} of {tutorialSteps.length}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="w-full aspect-video bg-muted rounded-md overflow-hidden">
                         <Image
                            src={step.image}
                            alt={step.title}
                            width={600}
                            height={400}
                            className="object-cover"
                            data-ai-hint={step.dataAiHint}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    <Progress value={progress} />
                </div>
                <DialogFooter className="flex justify-between w-full">
                    <Button variant="outline" onClick={handleClose}>Skip Tutorial</Button>
                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <Button variant="ghost" onClick={handlePrev}>
                                <ArrowLeft className="mr-2" /> Back
                            </Button>
                        )}
                        <Button onClick={handleNext}>
                            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                            <ArrowRight className="ml-2" />
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
