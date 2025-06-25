
"use client";

import { useState, useMemo, useEffect } from "react";
import { useNiveshStore } from "@/hooks/use-trade-store";
import type { Stock } from "@/data/stocks";
import { Input } from "./ui/input";
import { Search, ArrowUp, ArrowDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "./ui/card";
import { Button } from "./ui/button";
import { AreaChart, Area, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "./ui/chart";
import { Skeleton } from "./ui/skeleton";
import TradeDialog from "./trade-dialog";
import { getFinancials, FinancialData } from "@/data/financials";
import { pseudoRandomGenerator } from "@/data/stocks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import Link from "next/link";


const MarketIndices = () => {
    const { stocks } = useNiveshStore();
    const nifty = stocks.find(s => s.symbol === '^NSEI');
    const sensex = stocks.find(s => s.symbol === '^BSESN');

    const IndexCard = ({ index }: { index: Stock | undefined }) => {
        if (!index) return <Skeleton className="h-10 w-48" />;
        const isPositive = index.change >= 0;
        return (
            <div className="flex items-center gap-2 md:gap-4">
                <span className="font-semibold text-xs md:text-sm">{index.name}</span>
                <div className={cn("font-semibold text-xs md:text-sm", isPositive ? "text-green-500" : "text-red-500")}>
                    {index.price.toFixed(2)}
                </div>
                <div className={cn("text-xs flex items-center", isPositive ? "text-green-500" : "text-red-500")}>
                     {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center gap-2 md:gap-6 p-2 border-b flex-wrap">
            <IndexCard index={sensex} />
            <IndexCard index={nifty} />
        </div>
    )
}

const StockWatchlist = ({ stocks, selectedStock, onSelectStock, searchTerm, setSearchTerm }: { stocks: Stock[], selectedStock: Stock | null, onSelectStock: (stock: Stock) => void, searchTerm: string, setSearchTerm: (term: string) => void}) => {
    const filteredStocks = useMemo(() => {
        if (!searchTerm) return stocks;
        return stocks.filter(
          (stock) =>
            stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, stocks]);

    return (
        <aside className="w-full md:w-[280px] h-2/5 md:h-auto border-b md:border-b-0 md:border-r flex flex-col shrink-0">
            <div className="p-2 border-b">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="overflow-y-auto flex-1">
                {filteredStocks.map(stock => {
                    const isPositive = stock.change >= 0;
                    return (
                        <button 
                            key={stock.symbol} 
                            onClick={() => onSelectStock(stock)} 
                            className={cn(
                                "w-full text-left p-2 border-b border-transparent text-sm hover:bg-accent",
                                selectedStock?.symbol === stock.symbol ? "bg-accent/80" : ""
                            )}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">{stock.symbol}</span>
                                <span className={cn("font-semibold", isPositive ? "text-green-500" : "text-red-500")}>{stock.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                                <span>{stock.name}</span>
                                <span className={cn(isPositive ? "text-green-500" : "text-red-500")}>
                                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                                </span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </aside>
    )
}

const OverviewTerm = ({ term, value, explanation, academyId }: { term: string, value: string | number, explanation: string, academyId?: string }) => {
    const TermLabel = (
        <span className="flex items-center gap-1 text-muted-foreground text-sm group-hover:text-foreground">
            <span className={cn(academyId && "underline decoration-dashed underline-offset-2")}>{term}</span>
            <Info className="h-3 w-3" />
        </span>
    );

    return (
        <div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {academyId ? (
                            <Link href={`/academy/${academyId}`} className="cursor-pointer group">
                                {TermLabel}
                            </Link>
                        ) : (
                            <span className="cursor-help">{TermLabel}</span>
                        )}
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                        <p>{explanation}</p>
                        {academyId && <p className="mt-2 text-primary text-xs font-semibold">Click to learn more in the Academy.</p>}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <p className="font-semibold">{value}</p>
        </div>
    );
}

const PerformanceOverview = ({ stock }: { stock: Stock }) => {
    const performanceData = useMemo(() => {
        const rand = pseudoRandomGenerator(stock.symbol + 'performance');
        const qualityScore = Math.floor(rand() * 5) + 1;
        const valuationScore = Math.floor(rand() * 5) + 1;
        const financialScore = Math.floor(rand() * 5) + 1;

        const getScoreConfig = (score: number, type: 'quality' | 'valuation' | 'financial') => {
            if (type === 'valuation') { // Lower is better for valuation
                if (score >= 4) return { label: 'VERY CHEAP', color: 'bg-green-100 text-green-800' };
                if (score === 3) return { label: 'FAIR', color: 'bg-yellow-100 text-yellow-800' };
                if (score === 2) return { label: 'EXPENSIVE', color: 'bg-orange-100 text-orange-800' };
                return { label: 'VERY EXPENSIVE', color: 'bg-red-100 text-red-800' };
            }
            // Higher is better for quality and financial
            if (score >= 4) return { label: 'OUTSTANDING', color: 'bg-green-100 text-green-800' };
            if (score === 3) return { label: 'AVERAGE', color: 'bg-yellow-100 text-yellow-800' };
            if (score === 2) return { label: 'BELOW AVERAGE', color: 'bg-orange-100 text-orange-800' };
            return { label: 'POOR', color: 'bg-red-100 text-red-800' };
        };

        const getStatusConfig = (value: number) => {
            if (value > 2) return { label: 'Excellent', color: 'text-green-600', dot: 'bg-green-500' };
            if (value > 1) return { label: 'Good', color: 'text-green-600', dot: 'bg-green-500' };
            if (value > 0) return { label: 'Average', color: 'text-yellow-600', dot: 'bg-yellow-500' };
            return { label: 'Below Average', color: 'text-red-600', dot: 'bg-red-500' };
        };
        
        return {
            quality: { score: qualityScore, ...getScoreConfig(qualityScore, 'quality') },
            valuation: { score: valuationScore, ...getScoreConfig(valuationScore, 'valuation') },
            financial: { score: financialScore, ...getScoreConfig(financialScore, 'financial') },
            sectorRank: Math.floor(rand() * 10) + 1,
            sectorTotal: Math.floor(rand() * 10) + 15,
            cap: stock.price > 10000 ? 'LARGE CAP' : stock.price > 1000 ? 'MID CAP' : 'SMALL CAP',
            shortTermPositive: rand() > 0.5,
            marketCap: (stock.price * (50000000 + rand() * 1000000000)).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }),
            oneYearReturn: (rand() * 80 - 30),
            sectorReturn: (rand() * 40 - 15),
            marketReturn: (rand() * 20 - 5),
            capitalStructure: getStatusConfig(rand() * 4),
            growth: getStatusConfig(rand() * 4),
            managementRisk: getStatusConfig(rand() * 4),
        };
    }, [stock]);

    const ScorePill = ({ label, score, colorClass }: {label: string, score: number, colorClass: string}) => (
        <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("font-bold border-2", colorClass, colorClass.replace('bg-', 'border-'))}>{label}</Badge>
            <Badge variant="secondary" className="font-mono">{score}/5</Badge>
        </div>
    )

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-headline">Performance Overview</h2>
                <Link href="/academy" className="text-sm text-primary hover:underline">Learn More &rarr;</Link>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle>Sector Trend (#{performanceData.sectorRank})</CardTitle>
                        <Badge variant="outline">{performanceData.cap}</Badge>
                        <Badge variant="outline">{stock.sector}</Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                     <div className="p-3 rounded-lg border bg-card text-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="cursor-help w-full">
                                    <div className="flex items-center gap-2 text-sm justify-center">
                                        <div className={cn("w-2 h-2 rounded-full", performanceData.shortTermPositive ? 'bg-green-500' : 'bg-red-500')}></div>
                                        <span>Short Term</span>
                                        <Info className="h-3 w-3" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>An AI-driven prediction of the stock's likely price direction in the near future, based on technical indicators.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className={cn("font-bold", performanceData.shortTermPositive ? 'text-green-600' : 'text-red-600')}>
                            {performanceData.shortTermPositive ? 'Positive' : 'Negative'}
                        </p>
                    </div>
                     <div className="p-3 rounded-lg border bg-card text-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="cursor-help w-full">
                                    <div className="flex items-center gap-2 text-sm justify-center">
                                        <div className={cn("w-2 h-2 rounded-full", !performanceData.shortTermPositive ? 'bg-green-500' : 'bg-red-500')}></div>
                                        <span>Long Term</span>
                                        <Info className="h-3 w-3" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>An AI-driven prediction of the stock's likely price direction over a longer period, based on fundamental strength.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className={cn("font-bold", !performanceData.shortTermPositive ? 'text-green-600' : 'text-red-600')}>
                             {!performanceData.shortTermPositive ? 'Positive' : 'Negative'}
                        </p>
                    </div>
                    <div className="text-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="cursor-help">
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">Market Cap <Info className="h-3 w-3" /></p>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>The total market value of a company's outstanding shares. Calculated as Share Price × Total Number of Shares.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className="font-semibold">{performanceData.marketCap}</p>
                    </div>
                    <div className="text-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="cursor-help">
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">1 year Return <Info className="h-3 w-3" /></p>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>The percentage change in the stock's price over the last year.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className={cn("font-semibold", performanceData.oneYearReturn > 0 ? 'text-green-600' : 'text-red-600')}>{performanceData.oneYearReturn.toFixed(2)}%</p>
                    </div>
                    <div className="text-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="cursor-help">
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">Sector Return <Info className="h-3 w-3" /></p>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>The average return of all stocks within the same industry sector over the last year.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className={cn("font-semibold", performanceData.sectorReturn > 0 ? 'text-green-600' : 'text-red-600')}>{performanceData.sectorReturn.toFixed(2)}%</p>
                    </div>
                    <div className="text-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="cursor-help">
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">Market Return <Info className="h-3 w-3" /></p>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>The average return of a major market index (like Nifty 50) over the last year.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <p className={cn("font-semibold", performanceData.marketReturn > 0 ? 'text-green-600' : 'text-red-600')}>{performanceData.marketReturn.toFixed(2)}%</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0 flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 p-4 border-b md:border-b-0 md:border-r space-y-4">
                        <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href="/academy/understanding-financials" className="text-sm font-semibold hover:underline text-foreground flex items-center gap-1">Quality <Info className="h-3 w-3" /></Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p>Assesses the company's long-term financial health and business stability. High-quality companies often have strong brands and consistent earnings.</p>
                                        <p className="mt-2 text-primary text-xs font-semibold">Click to learn more in the Academy.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <ScorePill label={performanceData.quality.label} score={performanceData.quality.score} colorClass={performanceData.quality.color} />
                        </div>
                        <div>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href="/academy/valuation-metrics" className="text-sm font-semibold hover:underline text-foreground flex items-center gap-1">Valuation <Info className="h-3 w-3" /></Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p>Compares the stock's current price to its financial performance to determine if it's cheap or expensive relative to its peers and its own history.</p>
                                        <p className="mt-2 text-primary text-xs font-semibold">Click to learn more in the Academy.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                             <ScorePill label={performanceData.valuation.label} score={performanceData.valuation.score} colorClass={performanceData.valuation.color} />
                        </div>
                         <div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link href="/academy/understanding-financials" className="text-sm font-semibold hover:underline text-foreground flex items-center gap-1">Financial Trend <Info className="h-3 w-3" /></Link>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p>Analyzes the recent trend of the company's financials, such as revenue and profit growth. A positive trend is a good sign.</p>
                                        <p className="mt-2 text-primary text-xs font-semibold">Click to learn more in the Academy.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <ScorePill label={performanceData.financial.label} score={performanceData.financial.score} colorClass={performanceData.financial.color} />
                        </div>
                    </div>
                    <div className="w-full md:w-2/3 p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                           <div className="text-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger className="cursor-help">
                                            <div className="flex items-center justify-center gap-2 text-sm">
                                                <div className={cn("w-2 h-2 rounded-full", performanceData.capitalStructure.dot)}></div>
                                                <span>Capital Structure</span>
                                                <Info className="h-3 w-3" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p>An evaluation of how a company finances its operations through a mix of debt and equity. A good structure has manageable debt.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <p className={cn("font-bold", performanceData.capitalStructure.color)}>{performanceData.capitalStructure.label}</p>
                            </div>
                             <div className="text-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger className="cursor-help">
                                            <div className="flex items-center justify-center gap-2 text-sm">
                                                <div className={cn("w-2 h-2 rounded-full", performanceData.growth.dot)}></div>
                                                <span>Growth</span>
                                                <Info className="h-3 w-3" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p>An assessment of the company's revenue and profit growth over time. Strong, consistent growth is a positive sign.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <p className={cn("font-bold", performanceData.growth.color)}>{performanceData.growth.label}</p>
                            </div>
                             <div className="text-center">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger className="cursor-help">
                                            <div className="flex items-center justify-center gap-2 text-sm">
                                                <div className={cn("w-2 h-2 rounded-full", performanceData.managementRisk.dot)}></div>
                                                <span>Management Risk</span>
                                                 <Info className="h-3 w-3" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className="max-w-xs">
                                            <p>An evaluation of potential risks associated with the company's management team, such as high turnover or poor capital allocation decisions.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <p className={cn("font-bold", performanceData.managementRisk.color)}>{performanceData.managementRisk.label}</p>
                            </div>
                        </div>
                        <Separator className="my-4" />
                        <div>
                            <h4 className="font-semibold text-sm">Insights to Look For</h4>
                            <ul className="list-disc list-inside text-xs text-muted-foreground mt-2 space-y-1">
                                <li>Average quality company basis long term financial performance.</li>
                                <li>Size - Ranks {performanceData.sectorRank}th out of {performanceData.sectorTotal} companies in {stock.sector} sector.</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const StockViewer = ({ stock }: { stock: Stock | null }) => {
    const [isTradeDialogOpen, setTradeDialogOpen] = useState(false);
    const [financials, setFinancials] = useState<FinancialData | null>(null);

    useEffect(() => {
      if (stock) {
        setFinancials(getFinancials(stock.symbol));
      }
    }, [stock]);

    if (!stock) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground p-8 text-center">
                <p>Select a stock from the list to view details.</p>
            </div>
        );
    }
    
    const isPositive = stock.change >= 0;
    const chartColor = isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))";
    const chartConfig = { price: { label: "Price", color: chartColor } };
    
    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="p-3 border-b flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-lg md:text-xl font-bold font-headline">{stock.name} ({stock.symbol})</h2>
                    <p className="text-sm text-muted-foreground">{stock.sector}</p>
                </div>
                <Button onClick={() => setTradeDialogOpen(true)}>Trade</Button>
            </div>
            
            <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="p-3 h-60 md:h-80 shrink-0">
                     <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stock.history} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id={`fill-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} tickFormatter={(val) => `₹${val}`} />
                                <RechartsTooltip content={<ChartTooltipContent indicator="line" formatter={(value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value as number)}/>} />
                                <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fill={`url(#fill-${stock.symbol})`} />
                            </AreaChart>
                        </ResponsiveContainer>
                     </ChartContainer>
                </div>

                <div className="p-3 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Overview</CardTitle>
                            <CardDescription>
                                To understand these terms, <Link href="/academy" className="text-primary hover:underline">visit the Academy</Link>.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                               <OverviewTerm term="Open" value={stock.open.toFixed(2)} explanation="The price at which the stock first traded when the market opened." academyId="basic-trading-terms" />
                               <OverviewTerm term="High" value={stock.high.toFixed(2)} explanation="The highest price the stock reached during the trading day." academyId="basic-trading-terms" />
                               <OverviewTerm term="Low" value={stock.low.toFixed(2)} explanation="The lowest price the stock fell to during the trading day." academyId="basic-trading-terms" />
                               <OverviewTerm term="Prev. Close" value={stock.close.toFixed(2)} explanation="The stock's closing price on the previous trading day." academyId="basic-trading-terms" />
                               {financials && financials.yearly[0] &&
                                <>
                                   <OverviewTerm term="Latest Revenue (Cr)" value={financials.yearly[0].revenue.toLocaleString('en-IN')} explanation="The total amount of income a company generates from its primary operations, shown for the last full financial year." academyId="understanding-financials" />
                                   <OverviewTerm term="Latest Profit (Cr)" value={financials.yearly[0].netProfit.toLocaleString('en-IN')} explanation="The company's profit after all expenses, including taxes, have been paid for the last full financial year." academyId="understanding-financials" />
                                </>
                               }
                            </div>
                        </CardContent>
                    </Card>

                    <PerformanceOverview stock={stock} />
                </div>
            </div>
            
            <TradeDialog stock={stock} isOpen={isTradeDialogOpen} onOpenChange={setTradeDialogOpen} />
        </div>
    );
};


export default function DashboardClient() {
    const { stocks } = useNiveshStore();
    const tradableStocks = useMemo(() => stocks.filter(s => !s.symbol.startsWith('^')), [stocks]);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (!selectedStock && tradableStocks.length > 0) {
            // Find a common stock to start with, e.g., RELIANCE
            const defaultStock = tradableStocks.find(s => s.symbol === 'RELIANCE') || tradableStocks[0];
            setSelectedStock(defaultStock);
        }
    }, [tradableStocks, selectedStock]);

    return (
        <div className="flex flex-col h-[calc(100vh-57px)] bg-background text-foreground">
            <MarketIndices />
            <div className="flex flex-col md:flex-row flex-1 border-t overflow-hidden">
                <StockWatchlist 
                    stocks={tradableStocks} 
                    selectedStock={selectedStock}
                    onSelectStock={setSelectedStock}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
                <main className="flex-1 overflow-y-auto">
                    <StockViewer stock={selectedStock} />
                </main>
            </div>
        </div>
    );
}

