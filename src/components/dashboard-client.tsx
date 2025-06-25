
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
} from "./ui/card";
import { Button } from "./ui/button";
import { AreaChart, Area, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltipContent } from "./ui/chart";
import { Skeleton } from "./ui/skeleton";
import TradeDialog from "./trade-dialog";
import { getFinancials, FinancialData } from "@/data/financials";
import { pseudoRandomGenerator } from "@/data/stocks";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";


const MarketIndices = () => {
    const { stocks } = useNiveshStore();
    const nifty = stocks.find(s => s.symbol === '^NSEI');
    const sensex = stocks.find(s => s.symbol === '^BSESN');

    const IndexCard = ({ index }: { index: Stock | undefined }) => {
        if (!index) return <Skeleton className="h-10 w-48" />;
        const isPositive = index.change >= 0;
        return (
            <div className="flex items-center gap-4">
                <span className="font-semibold text-sm">{index.name}</span>
                <div className={cn("font-semibold text-sm", isPositive ? "text-green-500" : "text-red-500")}>
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
        <div className="flex items-center gap-6 p-2 border-b">
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
        <aside className="w-[280px] border-r flex flex-col shrink-0">
            <div className="p-2 border-b">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-8 h-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
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

const OverviewTerm = ({ term, value, explanation }: { term: string, value: string | number, explanation: string }) => (
    <div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 text-muted-foreground text-sm cursor-help">
                    <span>{term}</span>
                    <Info className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p>{explanation}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <p className="font-semibold">{value}</p>
    </div>
);

const RatioTerm = ({ term, value, explanation }: { term: string, value: string, explanation: string }) => (
     <div>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger className="flex items-center gap-1 text-sm text-muted-foreground cursor-help">
                    <span>{term}</span>
                    <Info className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <p>{explanation}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <p className="font-semibold text-lg">{value}</p>
    </div>
)


const StockViewer = ({ stock }: { stock: Stock | null }) => {
    const [isTradeDialogOpen, setTradeDialogOpen] = useState(false);
    const [financials, setFinancials] = useState<FinancialData | null>(null);

    useEffect(() => {
      if (stock) {
        setFinancials(getFinancials(stock.symbol));
      }
    }, [stock]);

    const fundamentalRatios = useMemo(() => {
        if (!stock || !financials) return null;
        const rand = pseudoRandomGenerator(stock.symbol + 'ratios');
        const latestYearly = financials.yearly[0];
        const prevYearly = financials.yearly[1];
        if (!latestYearly) return null;

        const eps = latestYearly.netProfit > 0 ? (latestYearly.netProfit / (rand() * 50 + 50)) * 10 : 0.1; // simplified EPS calc
        const peRatio = eps > 0 ? stock.price / eps : 0;
        const pbRatio = 1.5 + rand() * 8.5; // Mock P/B between 1.5 and 10
        
        let growth = 0;
        if(prevYearly && prevYearly.netProfit > 0) {
            growth = ((latestYearly.netProfit - prevYearly.netProfit) / prevYearly.netProfit) * 100;
        } else {
            growth = (rand() * 20); // Mock growth
        }
        
        const pegRatio = peRatio > 0 && growth > 0 ? peRatio / growth : 0;
        const roe = 5 + rand() * 20; // Mock ROE between 5% and 25%

        return {
            pe: peRatio.toFixed(2),
            pb: pbRatio.toFixed(2),
            peg: pegRatio.toFixed(2),
            roe: `${roe.toFixed(2)}%`
        };
    }, [stock, financials]);


    if (!stock) {
        return (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>Select a stock from the list to view details.</p>
            </div>
        );
    }
    
    const isPositive = stock.change >= 0;
    const chartColor = isPositive ? "hsl(var(--chart-1))" : "hsl(var(--destructive))";
    const chartConfig = { price: { label: "Price", color: chartColor } };
    
    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="p-3 border-b flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold font-headline">{stock.name} ({stock.symbol})</h2>
                    <p className="text-sm text-muted-foreground">{stock.sector}</p>
                </div>
                <Button onClick={() => setTradeDialogOpen(true)}>Trade</Button>
            </div>
            
            <div className="p-3 h-80">
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
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                           <OverviewTerm term="Open" value={stock.open.toFixed(2)} explanation="The price at which the stock first traded when the market opened." />
                           <OverviewTerm term="High" value={stock.high.toFixed(2)} explanation="The highest price the stock reached during the trading day." />
                           <OverviewTerm term="Low" value={stock.low.toFixed(2)} explanation="The lowest price the stock fell to during the trading day." />
                           <OverviewTerm term="Prev. Close" value={stock.close.toFixed(2)} explanation="The stock's closing price on the previous trading day." />
                           {financials && financials.yearly[0] &&
                            <>
                               <OverviewTerm term="Latest Revenue (Cr)" value={financials.yearly[0].revenue.toLocaleString('en-IN')} explanation="The total amount of income a company generates from its primary operations, shown for the last full financial year." />
                               <OverviewTerm term="Latest Profit (Cr)" value={financials.yearly[0].netProfit.toLocaleString('en-IN')} explanation="The company's profit after all expenses, including taxes, have been paid for the last full financial year." />
                            </>
                           }
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Fundamental Ratios</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Tabs defaultValue="valuation" className="w-full">
                            <TabsList>
                                <TabsTrigger value="valuation">Valuation Ratio</TabsTrigger>
                                <TabsTrigger value="growth">Growth</TabsTrigger>
                                <TabsTrigger value="financial">Financial</TabsTrigger>
                                <TabsTrigger value="dividend">Dividend</TabsTrigger>
                            </TabsList>
                            <TabsContent value="valuation" className="pt-4">
                                {fundamentalRatios ? (
                                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                        <RatioTerm term="PE Ratio" value={fundamentalRatios.pe} explanation="Price-to-Earnings ratio. A high P/E can mean a stock's price is high relative to earnings (overvalued), or investors expect high growth." />
                                        <RatioTerm term="Price to Book Value" value={fundamentalRatios.pb} explanation="Compares a company's market value to its book value. A lower P/B ratio could mean the stock is undervalued." />
                                        <RatioTerm term="PEG Ratio" value={fundamentalRatios.peg} explanation="Price/Earnings to Growth ratio. Compares the P/E ratio to earnings growth. A ratio under 1 is often considered good." />
                                        <RatioTerm term="ROE (Latest)" value={fundamentalRatios.roe} explanation="Return on Equity. Measures how effectively a company is using its equity to generate profits. Higher is generally better." />
                                    </div>
                                ) : <Skeleton className="h-24 w-full" />}
                            </TabsContent>
                            <TabsContent value="growth" className="pt-4 text-center text-sm text-muted-foreground h-24 flex items-center justify-center">
                                Growth ratios will be displayed here in a future update.
                            </TabsContent>
                             <TabsContent value="financial" className="pt-4 text-center text-sm text-muted-foreground h-24 flex items-center justify-center">
                                Financial strength ratios will be displayed here in a future update.
                            </TabsContent>
                             <TabsContent value="dividend" className="pt-4 text-center text-sm text-muted-foreground h-24 flex items-center justify-center">
                                Dividend-related ratios will be displayed here in a future update.
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
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
            <div className="flex flex-1 border-t overflow-hidden">
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
