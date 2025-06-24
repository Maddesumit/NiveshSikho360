"use client";

import { useState, useMemo } from 'react';
import type { Stock } from '@/data/stocks';
import type { FinancialData } from '@/data/financials';
import type { NewsArticle } from '@/data/news';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from '@/components/ui/separator';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { Lightbulb, Newspaper, Search, Briefcase, AlertTriangle, ArrowUp, ArrowDown, BrainCircuit } from 'lucide-react';
import { getKeyIssues, KeyIssuesOutput } from '@/ai/flows/key-issues-flow';
import { answerStockQuestion, StockQaOutput } from '@/ai/flows/stock-qa-flow';
import { cn } from '@/lib/utils';
import TradeDialog from './trade-dialog';
import { useNiveshStore } from '@/hooks/use-trade-store';

type TimeRange = '1M' | '6M' | '1Y' | '5Y';

const AiQuestion = ({ stock, financials, news }: { stock: Stock, financials: FinancialData, news: NewsArticle[] }) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAsk = async () => {
        if (!question.trim()) return;
        setLoading(true);
        setAnswer(null);
        try {
            const newsHeadlines = news.map(n => n.headline);
            const result = await answerStockQuestion({
                stockName: stock.name,
                question: question,
                financials: financials,
                newsHeadlines: newsHeadlines,
            });
            setAnswer(result.answer);
        } catch (e) {
            console.error(e);
            setAnswer("Sorry, I couldn't process that question right now.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <BrainCircuit className="text-primary" />
                    Ask AI Anything
                </CardTitle>
                 <CardDescription>Ask a question about {stock.name} based on its financials and recent news.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder={`e.g., "What is the recent revenue trend?"`}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    />
                    <Button onClick={handleAsk} disabled={loading}>
                        <Search className="mr-2 h-4 w-4" /> {loading ? 'Thinking...' : 'Ask'}
                    </Button>
                </div>
                {loading && <Skeleton className="h-10 w-full" />}
                {answer && (
                    <div className="p-4 bg-background rounded-md border text-sm">
                        <p className="font-semibold text-primary mb-1">Answer:</p>
                        <p>{answer}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

const KeyIssues = ({ stock, financials, news }: { stock: Stock, financials: FinancialData, news: NewsArticle[] }) => {
    const [issues, setIssues] = useState<KeyIssuesOutput['keyIssues'] | null>(null);
    const [loading, setLoading] = useState(true);

    useMemo(() => {
        const fetchIssues = async () => {
            setLoading(true);
            try {
                const newsHeadlines = news.map(n => n.headline);
                const result = await getKeyIssues({
                    stockSymbol: stock.symbol,
                    stockName: stock.name,
                    financials: financials,
                    newsHeadlines: newsHeadlines
                });
                setIssues(result.keyIssues);
            } catch (e) {
                console.error(e);
                setIssues([]);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, [stock, financials, news]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline"><AlertTriangle className="text-destructive"/> AI-Identified Key Issues</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : issues && issues.length > 0 ? (
                    <ul className="space-y-4">
                        {issues.map((item, index) => (
                            <li key={index} className="p-3 bg-muted/50 rounded-md">
                                <p className="font-semibold">{item.issue}</p>
                                <p className="text-sm text-muted-foreground">{item.impact}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-sm">No significant issues identified by AI.</p>
                )}
            </CardContent>
        </Card>
    );
};


const FinancialsTable = ({ data, type }: { data: any[], type: 'Quarterly' | 'Yearly' }) => {
    if (!data || data.length === 0) return <p className="text-muted-foreground text-center py-8">No {type.toLowerCase()} data available.</p>;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{type === 'Quarterly' ? 'Quarter' : 'Year'}</TableHead>
                    <TableHead>Revenue (Cr)</TableHead>
                    <TableHead>Net Profit (Cr)</TableHead>
                    <TableHead>Debt (Cr)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map(item => (
                    <TableRow key={item.period}>
                        <TableCell className="font-medium">{item.period}</TableCell>
                        <TableCell>{item.revenue.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{item.netProfit.toLocaleString('en-IN')}</TableCell>
                        <TableCell>{item.debt.toLocaleString('en-IN')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default function StockDetailClient({ stock: initialStock, financials, relatedNews }: { stock: Stock, financials: FinancialData, relatedNews: NewsArticle[] }) {
    const { getStockPrice, stocks } = useNiveshStore();
    const [timeRange, setTimeRange] = useState<TimeRange>('1Y');
    const [isTradeDialogOpen, setTradeDialogOpen] = useState(false);

    // Get the live stock data from the store if available, otherwise use initial
    const stock = useMemo(() => {
        const liveStock = stocks.find(s => s.symbol === initialStock.symbol);
        return liveStock ? { ...initialStock, price: liveStock.price, change: liveStock.change, changePercent: liveStock.changePercent } : initialStock;
    }, [initialStock, stocks]);

    const isPositive = stock.change >= 0;

    const chartData = useMemo(() => {
        const history = stock.history;
        switch (timeRange) {
            case '1M':
                return history.slice(-22); // Approx 1 month of trading days
            case '6M':
                return history.slice(-132); // Approx 6 months
            case '1Y':
                return history.slice(-252); // Approx 1 year
            case '5Y':
            default:
                return history;
        }
    }, [stock.history, timeRange]);

    const chartColor = isPositive ? "hsl(var(--chart-2))" : "hsl(var(--destructive))";
    const chartConfig = { price: { label: "Price", color: chartColor } };

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">{stock.name} ({stock.symbol})</h1>
                    <div className="flex items-baseline gap-4 mt-1">
                        <p className="text-3xl font-bold">
                            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(stock.price)}
                        </p>
                        <div className={cn("flex items-center text-xl font-semibold", isPositive ? "text-green-600" : "text-red-600")}>
                            {isPositive ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                            {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </div>
                    </div>
                </div>
                <Button size="lg" onClick={() => setTradeDialogOpen(true)}>Trade</Button>
            </div>

            <Separator />
            
            <AiQuestion stock={stock} financials={financials} news={relatedNews} />

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="font-headline">Price Chart</CardTitle>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                            {['1M', '6M', '1Y', '5Y'].map(range => (
                                <Button key={range} variant={timeRange === range ? 'default' : 'outline'} size="sm" onClick={() => setTimeRange(range as TimeRange)}>
                                    {range}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="h-96 w-full">
                     <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                            <defs>
                                <linearGradient id={`fill-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} tickFormatter={(val) => `₹${val}`} />
                            <RechartsTooltip content={<ChartTooltipContent indicator="line" formatter={(value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value as number)}/>} />
                            <Area type="monotone" dataKey="price" stroke={chartColor} strokeWidth={2} fill={`url(#fill-${stock.symbol})`} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><Briefcase /> Financials</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="yearly">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="yearly">Yearly</TabsTrigger>
                                <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
                            </TabsList>
                            <TabsContent value="yearly">
                                <FinancialsTable data={financials.yearly} type="Yearly" />
                            </TabsContent>
                            <TabsContent value="quarterly">
                                <FinancialsTable data={financials.quarterly} type="Quarterly" />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><Newspaper /> Related News</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {relatedNews.length > 0 ? (
                            <ul className="space-y-4">
                                {relatedNews.map(news => (
                                    <li key={news.id}>
                                        <p className="font-semibold">{news.headline}</p>
                                        <p className="text-sm text-muted-foreground">{news.source} - {news.timestamp}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-sm text-center py-8">No recent news for this stock.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            <KeyIssues stock={stock} financials={financials} news={relatedNews} />
            
             <TradeDialog
                stock={stock}
                isOpen={isTradeDialogOpen}
                onOpenChange={setTradeDialogOpen}
            />
        </div>
    )
}
