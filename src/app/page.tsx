
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { NiveshSikho360Icon } from '@/components/icons';
import { AreaChart, BrainCircuit, GraduationCap, PieChart, BookOpen, Rocket, ShieldCheck, Newspaper, Github, Linkedin, Mail, Banknote, TrendingUp, Layers, Bitcoin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

type FuturePlan = {
  title: string;
  description: string[];
  icon: LucideIcon;
  tags: string[];
};

const futurePlans: FuturePlan[] = [
  {
    title: "Mutual Funds (SIP + Lumpsum Simulation)",
    description: [
      "Simulate SIP or lump sum investments in virtual equity, debt, and hybrid funds.",
      "Display historical fund performance and NAV movements.",
      "Educate on risk profiles, fund types (ELSS, Large Cap), and compare returns with stocks.",
    ],
    icon: TrendingUp,
    tags: ["Investment", "SIP", "Education"],
  },
  {
    title: "ETFs (Exchange Traded Funds)",
    description: [
      "Allow virtual trading of popular ETFs like Nifty 50, Gold ETFs, and Bharat Bond ETFs.",
      "Educate users about low-cost, diversified investment strategies.",
    ],
    icon: Layers,
    tags: ["Diversification", "Low-Cost"],
  },
  {
    title: "Crypto Simulation (Optional)",
    description: [
      "A purely educational virtual crypto trading simulator with INR conversion.",
      "Include popular assets like Bitcoin, Ethereum, and Solana.",
      "Display 24h changes, volatility, and include prominent educational warnings.",
    ],
    icon: Bitcoin,
    tags: ["High-Risk", "Crypto", "Educational"],
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
        <section className="relative py-20 md:py-32 bg-grid-hero">
            <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent pointer-events-none"></div>
             <div className="container relative text-center">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-glow">
                    Master the Market, Risk-Free
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    A hyper-realistic stock market simulator for India. Get started with ₹1,00,000 in virtual cash to practice trading, build your portfolio, and learn the markets without risking a single rupee.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                        Get Your Free ₹1,00,000
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
            <div className="container max-w-5xl mx-auto text-center">
                <Banknote className="w-16 h-16 text-primary mx-auto" />
                <h2 className="mt-6 text-3xl md:text-4xl font-bold font-headline">Get ₹1,00,000 Virtual Cash Instantly</h2>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
                    Your journey into the stock market begins with a risk-free starting capital. We provide you with ₹1,00,000 in virtual currency the moment you sign up, so you can start practicing immediately.
                </p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="flex flex-col items-center text-center p-6 border border-border/50 rounded-lg bg-background/30">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary mb-4">
                            <span className="text-2xl font-bold font-headline">1</span>
                        </div>
                        <h3 className="text-xl font-headline font-semibold mb-2">Create Your Account</h3>
                        <p className="text-muted-foreground text-sm">Sign up for free in less than a minute. All you need is an email address.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 border border-border/50 rounded-lg bg-background/30">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary mb-4">
                             <span className="text-2xl font-bold font-headline">2</span>
                        </div>
                        <h3 className="text-xl font-headline font-semibold mb-2">Receive Your Funds</h3>
                        <p className="text-muted-foreground text-sm">Your portfolio is automatically credited with ₹1,00,000 of virtual cash. No strings attached.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6 border border-border/50 rounded-lg bg-background/30">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary mb-4">
                             <span className="text-2xl font-bold font-headline">3</span>
                        </div>
                        <h3 className="text-xl font-headline font-semibold mb-2">Start Trading</h3>
                        <p className="text-muted-foreground text-sm">Use your virtual capital to buy and sell stocks, build your portfolio, and apply what you learn in our Academy.</p>
                    </div>
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
        </section>

        <section className="py-20 md:py-28">
            <div className="container">
                <div className="flex flex-col items-center justify-center space-y-2 text-center mb-12">
                    <Rocket className="w-16 h-16 text-primary" />
                    <h2 className="text-4xl font-bold tracking-tight font-headline">Future Plans & Roadmap</h2>
                    <p className="text-lg text-muted-foreground max-w-3xl">
                    Here's a sneak peek at the exciting new features we're planning to build to make NiveshSikho360 even more comprehensive.
                    </p>
                </div>
                <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {futurePlans.map((plan) => (
                    <Card key={plan.title} className="flex flex-col border-border/50 hover:border-primary/50 transition-colors">
                        <CardHeader>
                        <CardTitle className="flex items-start gap-3">
                            <plan.icon className="w-8 h-8 text-accent flex-shrink-0 mt-1" />
                            <span>{plan.title}</span>
                        </CardTitle>
                        <div className="flex flex-wrap gap-1 pt-2">
                            {plan.tags.map(tag => (
                            <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                        </CardHeader>
                        <CardContent className="flex-grow">
                        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                            {plan.description.map((item, index) => (
                            <li key={index}>{item}</li>
                            ))}
                        </ul>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </section>

         <section className="py-20 md:py-28">
            <div className="container text-center">
                <Rocket className="w-16 h-16 text-primary mx-auto" />
                <h2 className="mt-6 text-3xl md:text-4xl font-bold font-headline">Ready to Start Your Journey?</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                   Join thousands of aspiring investors. Sign up in seconds and get ₹1,00,000 in virtual funds to start your journey.
                </p>
                 <div className="mt-8">
                     <Link href="/signup" className={cn(buttonVariants({ size: "lg" }))}>
                        Create Your Free Account & Claim Funds
                    </Link>
                </div>
            </div>
        </section>

      </main>

      <footer className="border-t border-border/40 py-8">
        <div className="container text-sm text-muted-foreground">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
                <div className="flex items-center gap-2">
                    <NiveshSikho360Icon className="w-6 h-6" />
                    <span>NiveshSikho360</span>
                </div>
                <p>© {new Date().getFullYear()} NiveshSikho360. All rights reserved.</p>
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
