
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { NiveshSikho360Icon } from '@/components/icons';
import { AreaChart, BrainCircuit, GraduationCap, PieChart, BookOpen, Rocket, ShieldCheck, Newspaper, Github, Linkedin, Mail, Banknote, TrendingUp, Layers, Bitcoin, Hexagon, MoveRight, ArrowRight, UserPlus, CandlestickChart } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const features: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: 'Hyper-Realistic Trading',
    description: 'Trade stocks on the NSE/BSE with real-time price updates.',
    icon: AreaChart,
  },
  {
    title: 'AI-Powered Insights',
    description: 'Get personalized trade recommendations and news sentiment analysis.',
    icon: BrainCircuit,
  },
  {
    title: 'Structured Learning Academy',
    description: 'Master concepts with quizzes, a final exam, and earn a certificate.',
    icon: GraduationCap,
  },
  {
    title: 'In-Depth Portfolio Analysis',
    description: 'Track your performance with detailed P&L statements and asset allocation charts.',
    icon: PieChart,
  },
  {
    title: 'Comprehensive Market News',
    description: 'Stay updated with the latest market news and analyze its impact.',
    icon: Newspaper,
  },
  {
    title: 'Searchable Financial Glossary',
    description: 'Never be confused by jargon again with simple definitions and examples.',
    icon: BookOpen,
  },
];

const futurePlans: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Mutual Funds",
    description: "Simulate SIP or lump sum investments in virtual equity, debt, and hybrid funds.",
    icon: TrendingUp,
  },
  {
    title: "ETFs",
    description: "Allow virtual trading of popular ETFs like Nifty 50, Gold ETFs, and more.",
    icon: Layers,
  },
  {
    title: "Crypto",
    description: "A purely educational virtual crypto trading simulator with INR conversion.",
    icon: Bitcoin,
  },
];


const LandingPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [year, setYear] = useState<number>();

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);


  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-50 w-full bg-background border-b border-border/20">
        <div className="container mx-auto px-4 flex h-16 max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <NiveshSikho360Icon className="w-8 h-8 text-primary" />
            <span className="font-headline font-bold text-xl">NiveshSikho360</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
             <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                Sign In
             </Link>
             <Link href="/signup" className={cn(buttonVariants({ variant: "default" }))}>
                Get Started Free
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 md:py-28">
            <div className="container mx-auto px-4 max-w-screen-xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                
                {/* Left Column */}
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="text-4xl lg:text-6xl font-bold font-headline tracking-tight">
                    Stock Market is the Best Way to <span className="text-primary">Invest your Money</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the.
                    </p>
                    <Link href="#features" className={cn(buttonVariants({ variant: "link" }), "text-lg text-primary p-0 h-auto font-semibold")}>
                    Learn More <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>

                {/* Right Column */}
                <div className="relative mt-10 md:mt-0">
                    <Image
                        src="https://placehold.co/800x600.png"
                        alt="Person analyzing stock market chart"
                        width={800}
                        height={600}
                        className="rounded-lg object-cover brightness-50"
                        data-ai-hint="stock trading desk"
                    />
                    <svg
                        className="absolute top-0 left-0 w-full h-full opacity-60"
                        viewBox="0 0 400 250"
                        preserveAspectRatio="none"
                    >
                    <path
                        d="M20 180 L40 120 L60 140 L100 130 L120 100 L140 60 L160 80 L200 70 L220 100 L240 140 L260 120 L300 150 L320 120 L340 80 L360 110 L400 90"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    </svg>
                </div>

                </div>
            </div>
        </section>

        <section className="py-20 md:py-28 section-glow">
            <div className="container max-w-screen-xl mx-auto px-4 relative text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-headline">Get Started in 30 Seconds with ₹1,00,000</h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                  Follow these simple steps to begin your zero-risk trading journey.
                </p>
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 text-primary mb-4">
                      <UserPlus className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-headline font-semibold">1. Create Account</h3>
                    <p className="mt-2 text-muted-foreground">Sign up for a free account in under a minute. No credit card required.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 text-primary mb-4">
                      <Banknote className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-headline font-semibold">2. Receive Virtual Cash</h3>
                    <p className="mt-2 text-muted-foreground">Instantly get ₹1,00,000 in virtual currency credited to your new account.</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 text-primary mb-4">
                      <CandlestickChart className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-headline font-semibold">3. Start Trading</h3>
                    <p className="mt-2 text-muted-foreground">Use your virtual funds to buy and sell stocks in our hyper-realistic simulator.</p>
                  </div>
                </div>
                <div className="mt-12">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/signup">
                      Claim Your Virtual Cash <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-28 section-glow">
            <div className="container max-w-screen-xl mx-auto px-4 relative">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">A Complete Learning Ecosystem</h2>
                    <p className="mt-4 text-muted-foreground">
                        NiveshSikho360 is more than just a simulator. It's a complete platform designed to accelerate your journey to becoming a confident investor.
                    </p>
                </div>

                <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, i) => (
                         <div key={feature.title} className="relative p-8 rounded-xl bg-card border border-border overflow-hidden">
                             <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl opacity-50"></div>
                             <div className="relative z-10">
                                <div className="bg-background border border-border p-3 rounded-lg w-fit mb-4 text-primary">
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                 <h3 className="pt-4 text-xl font-headline font-semibold">{feature.title}</h3>
                                 <p className="mt-2 text-muted-foreground">{feature.description}</p>
                             </div>
                         </div>
                    ))}
                </div>
            </div>
        </section>
        
        <section className="py-20 md:py-28 bg-card/50 section-glow">
            <div className="container max-w-screen-xl mx-auto px-4 relative text-center">
                 <h2 className="text-3xl md:text-4xl font-bold font-headline">Our Ambitious Roadmap</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Here's a sneak peek at the exciting new simulators we're planning to build to make NiveshSikho360 even more comprehensive.
                </p>
                 <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
                    {futurePlans.map((plan) => (
                        <div key={plan.title} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative p-6 bg-card rounded-xl leading-none flex flex-col items-center text-center h-full">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4 border-2 border-primary/50 text-primary">
                                    <plan.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-headline font-semibold">{plan.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground flex-grow">{plan.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section className="py-20 md:py-28 section-glow">
            <div className="container max-w-screen-xl mx-auto px-4 relative">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Meet the Developer</h2>
                     <p className="mt-4 text-muted-foreground">This project is fueled by a passion for finance and technology.</p>
                </div>
                <div className="mt-12 max-w-4xl mx-auto">
                     <div className="relative p-8 rounded-xl bg-card border border-border">
                        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
                            <div className="flex-shrink-0">
                                <Image
                                    src="/founder.jpg"
                                    alt="Sumit Madde, Developer of NiveshSikho360"
                                    width={128}
                                    height={128}
                                    className="rounded-full object-cover border-4 border-primary/50"
                                />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold font-headline">Sumit Madde</h3>
                                <p className="text-primary font-semibold mt-1">Turning Code &amp; Curiosity Into Real-World Solutions</p>
                                <p className="mt-4 text-muted-foreground">
                                    I'm a passionate third-year engineering student with a deep interest in both technology and finance. Driven by the desire to build solutions that solve real-world problems, I created NiveshSikho360 to simplify and demystify the stock market for young Indians. My love for innovation and commitment to financial literacy are at the core of everything I do.
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
                </div>
            </div>
        </section>

         <section className="py-20 md:py-28">
            <div className="container max-w-screen-xl mx-auto px-4">
               <div className="relative rounded-2xl p-12 text-center bg-gradient-to-br from-primary to-accent">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary-foreground">Ready to get started?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-primary-foreground/80">
                      Join thousands of aspiring investors. Sign up in seconds and get ₹1,00,000 in virtual funds to start your journey.
                    </p>
                     <div className="mt-8">
                         <Link href="/signup" className={cn(buttonVariants({ size: "lg", variant: "secondary", className: "bg-white text-primary hover:bg-gray-200 rounded-full" }))}>
                            Open an Account Today
                        </Link>
                    </div>
               </div>
            </div>
        </section>

      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container max-w-screen-xl mx-auto px-4 text-sm text-muted-foreground">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <NiveshSikho360Icon className="w-6 h-6" />
                    <span className="font-headline">NiveshSikho360</span>
                </div>
                 <div className="flex items-center gap-4">
                    {/* Add footer links if needed */}
                 </div>
                <p>© {year} NiveshSikho360. All rights reserved.</p>
            </div>
            <Separator className="my-6" />
            <div className="text-center text-xs space-y-2">
                <p>
                    <strong>Disclaimer:</strong> NiveshSikho360 is a stock market simulation platform for educational purposes only. All data is simulated or delayed and should not be used for real-world trading decisions.
                </p>
                <p>
                    Investing in the stock market involves risk, including the loss of principal. All AI-generated insights, recommendations, and forecasts are for informational purposes only and do not constitute financial advice. Always consult with a qualified financial advisor before making any investment decisions.
                </p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
