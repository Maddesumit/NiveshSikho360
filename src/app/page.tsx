
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button, buttonVariants } from '@/components/ui/button';
import { NiveshSikho360Icon } from '@/components/icons';
import { AreaChart, BrainCircuit, GraduationCap, PieChart, BookOpen, Rocket, ShieldCheck, Newspaper, Github, Linkedin, Mail, Banknote, TrendingUp, Layers, Bitcoin, Hexagon, MoveRight } from 'lucide-react';
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

    useEffect(() => {
        if (!loading && user) {
            router.push('/dashboard');
        }
    }, [user, loading, router]);


  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent -z-10"></div>
      <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <NiveshSikho360Icon className="w-8 h-8 text-primary" />
            <span className="font-headline font-bold text-xl">NiveshSikho360</span>
          </Link>
          <div className="hidden md:flex items-center gap-2">
             <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                Sign In
             </Link>
             <Link href="/signup" className={cn(buttonVariants({ variant: "default" }), 'rounded-full')}>
                Get Started Free
             </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative py-20 md:py-32">
             <div className="container max-w-screen-xl grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 text-center md:text-left">
                    <h1 className="text-4xl lg:text-6xl font-bold font-headline tracking-tighter">
                        Unique solutions & <br/> <span className="text-primary text-glow-primary">Innovative approach</span> to trading
                    </h1>
                    <p className="max-w-md mx-auto md:mx-0 text-lg text-muted-foreground">
                        A hyper-realistic stock market simulator for India. Get started with ₹1,00,000 in virtual cash to practice trading, build your portfolio, and learn the markets without risking a single rupee.
                    </p>
                    <div className="flex justify-center md:justify-start gap-4">
                        <Link href="/signup" className={cn(buttonVariants({ size: "lg", className: "rounded-full" }))}>
                            Open an Account
                        </Link>
                        <Link href="#features" className={cn(buttonVariants({ size: "lg", variant: "outline", className: "rounded-full" }))}>
                            Explore Features
                        </Link>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary to-accent rounded-xl opacity-20 blur-2xl"></div>
                    <Image
                        src="https://placehold.co/1200x800.png"
                        alt="NiveshSikho360 Dashboard"
                        width={1200}
                        height={800}
                        data-ai-hint="trading dashboard dark"
                        className="relative rounded-xl shadow-2xl border border-border"
                    />
                </div>
            </div>
        </section>

        <section id="features" className="py-20 md:py-28 section-glow">
            <div className="container max-w-screen-xl relative">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Take full control of your assets</h2>
                    <p className="mt-4 text-muted-foreground">
                        NiveshSikho360 is more than just a simulator. It's a complete ecosystem designed to accelerate your journey to becoming a confident investor.
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
            <div className="container max-w-screen-xl grid md:grid-cols-2 gap-12 items-center relative">
                <div className="relative order-2 md:order-1">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary to-accent rounded-xl opacity-20 blur-2xl"></div>
                     <Image
                        src="https://placehold.co/1000x1000.png"
                        alt="AI Powered Insights"
                        width={1000}
                        height={1000}
                        data-ai-hint="ai brain interface"
                        className="relative rounded-xl shadow-2xl border border-border"
                    />
                </div>
                <div className="space-y-6 text-center md:text-left order-1 md:order-2">
                    <Badge variant="default" className="bg-primary/10 text-primary border border-primary/20">Made for Everyone</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">AI-Powered Insights for Smarter Decisions</h2>
                    <p className="text-lg text-muted-foreground">
                        Leverage the power of generative AI to get personalized trade recommendations, news sentiment analysis, and answers to your stock questions from our advanced financial engine.
                    </p>
                    <Button asChild className="rounded-full">
                        <Link href="/signup">
                            Get Started <MoveRight className="ml-2"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

        <section className="py-20 md:py-28 section-glow">
            <div className="container max-w-screen-xl grid md:grid-cols-2 gap-12 items-center relative">
                 <div className="space-y-6 text-center md:text-left">
                    <Badge variant="default" className="bg-primary/10 text-primary border border-primary/20">One Platform</Badge>
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">Structured Learning, From Zero to Hero</h2>
                    <p className="text-lg text-muted-foreground">
                       Our structured Academy takes you from the very basics to advanced trading concepts. Learn with interactive modules, test your knowledge with quizzes, and earn a certificate to showcase your skills.
                    </p>
                    <Button asChild className="rounded-full">
                        <Link href="/academy">
                            Start Learning <MoveRight className="ml-2"/>
                        </Link>
                    </Button>
                </div>
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-br from-primary to-accent rounded-xl opacity-20 blur-2xl"></div>
                     <Image
                        src="https://placehold.co/800x1200.png"
                        alt="Learning Academy on Mobile"
                        width={800}
                        height={1200}
                        data-ai-hint="education mobile app dark"
                        className="relative rounded-xl shadow-2xl border border-border"
                    />
                </div>
            </div>
        </section>
        
        <section className="py-20 md:py-28 bg-card/50 section-glow">
            <div className="container max-w-screen-xl relative text-center">
                 <h2 className="text-3xl md:text-4xl font-bold font-headline">Choose the type of assets to trade!</h2>
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
            <div className="container max-w-screen-xl relative">
                <div className="text-center">
                    <h2 className="text-3xl md:text-4xl font-bold font-headline">What Traders are Saying About Us</h2>
                     <p className="mt-4 text-muted-foreground">This is where the developer section is, stylized as a testimonial.</p>
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
                                    I'm a passionate third-year engineering student with a deep interest in both technology and finance. Driven by the desire to build solutions that solve real-world problems, I created NiveshSikho360 to simplify and demystify the stock market for young Indians.
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
            <div className="container max-w-screen-xl">
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
        <div className="container max-w-screen-xl text-sm text-muted-foreground">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <NiveshSikho360Icon className="w-6 h-6" />
                    <span className="font-headline">NiveshSikho360</span>
                </div>
                 <div className="flex items-center gap-4">
                    {/* Add footer links if needed */}
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
