
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { NiveshSikho360Icon } from '@/components/icons';
import { AreaChart, BrainCircuit, GraduationCap, PieChart, BookOpen, Rocket, ShieldCheck, Newspaper, Github, Linkedin, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const features: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Hyper-Realistic Trading',
    description: 'Trade stocks on the NSE/BSE with real-time price updates. Use market and limit orders to execute your strategy just like in the real world.',
    icon: AreaChart,
  },
  {
    title: 'AI-Powered Insights',
    description: 'Get personalized trade recommendations, news sentiment analysis, and answers to your stock questions from our advanced AI engine.',
    icon: BrainCircuit,
  },
  {
    title: 'Structured Learning Academy',
    description: 'Go from beginner to advanced with our comprehensive course. Master concepts with quizzes, a final exam, and earn a certificate.',
    icon: GraduationCap,
  },
  {
    title: 'In-Depth Portfolio Analysis',
    description: 'Track your performance with detailed P&L statements, asset allocation charts, and a complete history of your trades.',
    icon: PieChart,
  },
  {
    title: 'Comprehensive Market News',
    description: 'Stay updated with the latest market news and use our AI to analyze its potential impact on your portfolio.',
    icon: Newspaper,
  },
  {
    title: 'Searchable Financial Glossary',
    description: 'Never be confused by jargon again. Our searchable glossary provides simple definitions and examples for key financial terms.',
    icon: BookOpen,
  },
];


const LandingPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);


  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <NiveshSikho360Icon className="w-8 h-8 text-primary" />
            <span className="font-headline font-bold text-xl">NiveshSikho360</span>
          </Link>
          <div className="flex items-center gap-2">
             <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                Sign In
             </Link>
             <Link href="/signup" className={cn(buttonVariants({ variant: "default" }))}>
                Get Started
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32 bg-grid">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent pointer-events-none"></div>
             <div className="container relative text-center">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-glow">
                    Master the Market, Risk-Free
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    A hyper-realistic stock market simulator and learning academy designed for the next generation of Indian investors. Practice, learn, and build confidence without risking a single rupee.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                        Start Learning for Free
                    </Link>
                    <Link href="#features" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
                        Explore Features
                    </Link>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-28">
            <div className="container">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">All The Tools You Need to Succeed</h2>
                    <p className="mt-4 text-muted-foreground">
                        NiveshSikho360 is more than just a simulator. It's a complete ecosystem designed to accelerate your journey to becoming a confident investor.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                         <Card key={feature.title} className="bg-card/50 border-border/50 hover:border-primary/50 hover:-translate-y-2 transition-transform duration-300">
                             <CardHeader>
                                 <div className="bg-primary/10 text-primary p-3 rounded-lg w-fit">
                                    <feature.icon className="w-8 h-8" />
                                 </div>
                                 <CardTitle className="pt-4 font-headline">{feature.title}</CardTitle>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-muted-foreground">{feature.description}</p>
                             </CardContent>
                         </Card>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-20 md:py-28 bg-card/30">
            <div className="container text-center">
                <ShieldCheck className="w-16 h-16 text-primary mx-auto" />
                <h2 className="mt-6 text-3xl md:text-4xl font-bold font-headline">Our Core Objective</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Financial literacy is a superpower. Our mission is to demystify the stock market and empower every Indian with the knowledge and practical experience to make informed financial decisions. We provide a safe and realistic sandbox to learn, experiment, and grow.
                </p>
            </div>
        </section>

        <section className="py-20 md:py-28 bg-background">
            <div className="container max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Meet the Developer</h2>
                    <p className="mt-4 text-muted-foreground">The developer behind the project.</p>
                </div>
                <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8 md:gap-12 bg-card/50 p-8 rounded-lg shadow-lg">
                    <div className="flex-shrink-0">
                        <Image
                            src="/founder.jpg"
                            alt="Sumit Madde, Developer of NiveshSikho360"
                            width={256}
                            height={256}
                            className="rounded-full object-cover border-4 border-primary/50"
                        />
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold font-headline">Sumit Madde</h3>
                        <p className="text-primary font-semibold mt-1">Developer & Idea Seeder</p>
                        <p className="mt-4 text-muted-foreground">
                            Sumit is a passionate 3rd-year engineering student with a deep-seated enthusiasm for technology and finance. Driven by a desire to build innovative solutions that solve real-world problems, he developed NiveshSikho360 to demystify the stock market for young Indians. His excitement for creating new things and his commitment to financial literacy are the cornerstones of this project.
                        </p>
                        <div className="mt-6 flex justify-center md:justify-start gap-4">
                            <a href="https://www.linkedin.com/in/sumit-madde-198743249/" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                <Linkedin className="w-5 h-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a href="https://github.com/Maddesumit" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                <Github className="w-5 h-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="mailto:maddesumit@gmail.com" className={cn(buttonVariants({ variant: "outline", size: "icon" }))}>
                                <Mail className="w-5 h-5" />
                                <span className="sr-only">Email</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>


         <section className="py-20 md:py-28">
            <div className="container text-center">
                <Rocket className="w-16 h-16 text-primary mx-auto" />
                <h2 className="mt-6 text-3xl md:text-4xl font-bold font-headline">Ready to Start Your Journey?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                   Join thousands of aspiring investors. Your path to financial confidence starts here.
                </p>
                 <div className="mt-8">
                     <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                        Create Your Free Account
                    </Link>
                </div>
            </div>
        </section>

      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
            <div className="flex items-center gap-2">
                <NiveshSikho360Icon className="w-6 h-6 text-muted-foreground" />
                <span className="text-muted-foreground">NiveshSikho360</span>
            </div>
            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} NiveshSikho360. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
