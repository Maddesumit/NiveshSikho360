
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const tutorialSteps = [
    {
        title: 'Welcome to NiveshSikho360!',
        description: "Let's take a quick tour to familiarize you with the platform. This simulator is your risk-free environment to learn and practice investing.",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'welcome screen',
    },
    {
        title: 'The Dashboard',
        description: 'This is your mission control. Here you can search for companies, see their price charts, and get key information all in one place.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'dashboard analytics',
    },
    {
        title: 'Finding Companies',
        description: 'On the left is the watchlist. You can scroll through it or use the search bar to find any stock listed on the simulator.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'stock watchlist',
    },
    {
        title: 'Understanding the Chart',
        description: "The chart shows a stock's price movement over time. You can select different time ranges like 1 Month (1M) or 1 Year (1Y) to see its performance.",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'stock chart',
    },
    {
        title: 'Key Data (Overview)',
        description: "Below the chart, you'll find the stock's vital stats for the day, like its Open, High, and Low price. Hover over any term to learn what it means!",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'data overview',
    },
    {
        title: 'AI Performance Analysis',
        description: 'Our AI provides a Performance Overview, analyzing a stock\'s quality, valuation, and financial trends to give you deeper insights.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'AI analysis',
    },
    {
        title: 'Making a Trade',
        description: 'Ready to invest? Click the "Trade" button to open the trading panel where you can buy or sell shares.',
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'trade button',
    },
    {
        title: 'Your Portfolio',
        description: "After you buy shares, you can track all your investments on the 'Portfolio' page. It shows your holdings, total investment, and overall profit or loss.",
        image: 'https://placehold.co/600x400.png',
        dataAiHint: 'portfolio page',
    },
    {
        title: "You're All Set!",
        description: "That's the basics! You're now ready to explore, learn, and start building your virtual portfolio. Happy investing!",
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
