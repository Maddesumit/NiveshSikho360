
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Rocket,
  TrendingUp,
  Layers,
  Banknote,
  Award,
  Home,
  Repeat,
  ShieldCheck,
  Bitcoin,
  FileText,
  BarChartHorizontalBig
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

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
    title: "Fixed Deposits (FDs)",
    description: [
      "Simulate FD investments with custom principal amounts and durations.",
      "Show maturity values, comparing simple vs. compounding interest.",
      "Teach about tax implications, premature withdrawals, and bank interest rates.",
    ],
    icon: Banknote,
    tags: ["Fixed Income", "Savings"],
  },
  {
    title: "Gold Investment Simulation",
    description: [
      "Simulate investments in Gold ETFs, Sovereign Gold Bonds (SGBs), and physical gold.",
      "Include a real-time gold price tracker.",
      "Educate on gold's role as an inflation hedge versus its volatility.",
    ],
    icon: Award,
    tags: ["Commodity", "Inflation Hedge"],
  },
  {
    title: "Real Estate Simulated Investment",
    description: [
      "Simulate investments in REITs and fractional ownership.",
      "Track virtual real estate with appreciation trends using mock data for metro cities.",
    ],
    icon: Home,
    tags: ["Real Estate", "REITs"],
  },
  {
    title: "Recurring Deposits (RDs)",
    description: [
      "Set up virtual monthly deposits with different tenures.",
      "Show maturity values and interest earned.",
      "Compare the performance and utility of RDs against SIPs and FDs.",
    ],
    icon: Repeat,
    tags: ["Savings", "Fixed Income"],
  },
  {
    title: "PPF/EPF Simulation",
    description: [
      "Simulate annual investments into Public Provident Fund (PPF).",
      "Illustrate lock-in periods, the power of compounding, and tax benefits.",
      "Position as a long-term wealth creation tool.",
    ],
    icon: ShieldCheck,
    tags: ["Retirement", "Tax-Saving"],
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
  {
    title: "Bonds & Debentures",
    description: [
      "Simulate buying corporate bonds and government securities.",
      "Educate on coupon rates, maturity dates, and understanding credit ratings.",
    ],
    icon: FileText,
    tags: ["Fixed Income", "Debt"],
  },
  {
    title: "Options Trading (Advanced Module)",
    description: [
      "An advanced module featuring a virtual Options Chain for Nifty & BankNifty.",
      "Simulate buying Calls/Puts with virtual premiums.",
      "Include visualizers for payoff charts and option greeks.",
    ],
    icon: BarChartHorizontalBig,
    tags: ["Advanced", "Derivatives", "High-Risk"],
  },
];

export default function FuturePlansPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <Rocket className="w-16 h-16 text-primary" />
        <h1 className="text-4xl font-bold tracking-tight font-headline">Future Plans & Roadmap</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Here's a sneak peek at the exciting new features we're planning to build. Our goal is to make NiveshSikho360 the most comprehensive financial learning and simulation platform in India.
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
  );
}
