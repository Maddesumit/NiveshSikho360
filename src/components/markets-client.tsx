
"use client";

import { useMemo } from 'react';
import Link from 'next/link';
import { useNiveshStore } from '@/hooks/use-trade-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TrendingUp, DollarSign, Building } from 'lucide-react';
import type { Stock } from '@/data/stocks';

const StockTable = ({ stocks }: { stocks: Stock[] }) => {
    if (stocks.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-4">No stocks to display in this category.</p>
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Change (%)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {stocks.map(stock => {
                    const isPositive = stock.change >= 0;
                    return (
                        <TableRow key={stock.symbol}>
                            <TableCell>
                                <Link href={`/stock/${stock.symbol}`} className="font-medium hover:underline">{stock.symbol}</Link>
                            </TableCell>
                            <TableCell>₹{stock.price.toFixed(2)}</TableCell>
                            <TableCell className={cn("text-right", isPositive ? "text-green-500" : "text-red-500")}>
                                {stock.changePercent.toFixed(2)}%
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    );
};

export default function MarketsClient() {
  const { stocks } = useNiveshStore();
  const tradableStocks = useMemo(() => stocks.filter(s => !s.symbol.startsWith('^')), [stocks]);

  const trendingStocks = useMemo(() => {
    return [...tradableStocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 10);
  }, [tradableStocks]);
  
  const pennyStocks = useMemo(() => {
    return tradableStocks.filter(s => s.price < 100).sort((a,b) => b.changePercent - a.changePercent);
  }, [tradableStocks]);

  const bySector = useMemo(() => {
    return tradableStocks.reduce((acc, stock) => {
        const { sector } = stock;
        if (!acc[sector]) {
            acc[sector] = [];
        }
        acc[sector].push(stock);
        return acc;
    }, {} as Record<string, typeof tradableStocks>);
  }, [tradableStocks]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Markets</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Discover stocks by browsing top trends and sectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp /> Top 10 Movers</CardTitle>
            </CardHeader>
            <CardContent>
                <StockTable stocks={trendingStocks} />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><DollarSign /> Penny Stocks (&lt; ₹100)</CardTitle>
            </CardHeader>
            <CardContent>
                <StockTable stocks={pennyStocks} />
            </CardContent>
        </Card>
      </div>

      <div>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building /> Browse by Sector</CardTitle>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {Object.keys(bySector).sort().map(sector => (
                        <AccordionItem key={sector} value={sector}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <span>{sector}</span>
                                    <Badge variant="secondary">{bySector[sector].length}</Badge>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <StockTable stocks={bySector[sector]} />
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
