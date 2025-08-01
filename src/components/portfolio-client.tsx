
"use client";

import { useMemo, useState, useEffect } from "react";
import { useNiveshStore } from "@/hooks/use-trade-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import type { Holding } from "@/hooks/use-trade-store";
import type { Stock } from "@/data/stocks";
import { Button } from "./ui/button";
import TradeDialog from "./trade-dialog";


const COLORS = ['#3B82F6', '#A78BFA', '#2DD4BF', '#FBBF24', '#F87171'];

const FormattedCurrency = ({ value, className }: { value: number; className?: string }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);
  
  if (!isClient) {
    return <Skeleton className={cn("h-6 w-24", className)} />;
  }
  
  return <p className={className}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)}</p>
}

const PnlText = ({ value, percent, className } : { value: number, percent: number, className?: string}) => {
    const isPositive = value >= 0;
    return (
        <p className={cn(
            "text-2xl font-bold",
            isPositive ? "text-green-600" : "text-red-600",
            className
        )}>
            {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)}
            <span className="text-sm ml-2">({percent.toFixed(2)}%)</span>
        </p>
    );
}

export default function PortfolioClient() {
  const { state, getStock } = useNiveshStore();
  const { holdings } = state;
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isTradeDialogOpen, setTradeDialogOpen] = useState(false);

  const handleTradeClick = (stock: Stock) => {
    setSelectedStock(stock);
    setTradeDialogOpen(true);
  };

  const portfolioMetrics = useMemo(() => {
    const totalInvested = holdings.reduce(
      (acc, h) => acc + h.avgPrice * h.quantity,
      0
    );

    const { currentValue, todaysPnl } = holdings.reduce(
      (acc, h) => {
        const liveStock = getStock(h.stock.symbol);
        const price = liveStock?.price ?? h.stock.price;
        const change = liveStock?.change ?? 0;
        acc.currentValue += price * h.quantity;
        acc.todaysPnl += change * h.quantity;
        return acc;
      },
      { currentValue: 0, todaysPnl: 0 }
    );

    const totalPandL = currentValue - totalInvested;
    const totalPandLPercent =
      totalInvested > 0 ? (totalPandL / totalInvested) * 100 : 0;
    
    const openingValue = currentValue - todaysPnl;
    const todaysPnlPercent = openingValue > 0 ? (todaysPnl / openingValue) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      totalPandL,
      totalPandLPercent,
      todaysPnl,
      todaysPnlPercent
    };
  }, [holdings, getStock]);

  const allocationData = useMemo(() => {
    return holdings.map((h) => ({
      name: h.stock.symbol,
      value: (getStock(h.stock.symbol)?.price ?? h.stock.price) * h.quantity,
    }));
  }, [holdings, getStock]);

  return (
    <>
        <div className="flex-1 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
            My Portfolio
        </h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader>
                <CardTitle>Invested Amount</CardTitle>
            </CardHeader>
            <CardContent>
                <FormattedCurrency value={portfolioMetrics.totalInvested} className="text-2xl font-bold" />
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Current Value</CardTitle>
            </CardHeader>
            <CardContent>
                <FormattedCurrency value={portfolioMetrics.currentValue} className="text-2xl font-bold" />
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Overall P/L</CardTitle>
            </CardHeader>
            <CardContent>
                <PnlText value={portfolioMetrics.totalPandL} percent={portfolioMetrics.totalPandLPercent} />
            </CardContent>
            </Card>
            <Card>
            <CardHeader>
                <CardTitle>Today's P/L</CardTitle>
            </CardHeader>
            <CardContent>
                <PnlText value={portfolioMetrics.todaysPnl} percent={portfolioMetrics.todaysPnlPercent} />
            </CardContent>
            </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
            <CardHeader>
                <CardTitle>Holdings</CardTitle>
            </CardHeader>
            <CardContent>
                <HoldingsTable holdings={holdings} getStock={getStock} onTrade={handleTradeClick} />
            </CardContent>
            </Card>
            <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
                {allocationData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                    <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {allocationData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) =>
                        new Intl.NumberFormat("en-IN", {
                            style: "currency",
                            currency: "INR",
                        }).format(value)
                        }
                    />
                    <Legend />
                    </RechartsPieChart>
                </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>No assets to display. Start trading!</p>
                    </div>
                )}
            </CardContent>
            </Card>
        </div>
        </div>
        {selectedStock && (
            <TradeDialog
                stock={selectedStock}
                isOpen={isTradeDialogOpen}
                onOpenChange={setTradeDialogOpen}
            />
        )}
    </>
  );
}

function HoldingsTable({ holdings, getStock, onTrade }: { holdings: Holding[], getStock: (symbol: string) => Stock | undefined, onTrade: (stock: Stock) => void }) {
    if (holdings.length === 0) {
        return <div className="text-center py-8 text-muted-foreground">You don't have any holdings yet.</div>;
    }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Stock</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Avg. Price</TableHead>
          <TableHead>Current Price</TableHead>
          <TableHead className="text-right">P/L</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((h: Holding) => {
          const liveStock = getStock(h.stock.symbol);
          const currentPrice = liveStock?.price ?? h.stock.price;
          const pAndL = (currentPrice - h.avgPrice) * h.quantity;
          const investedValue = h.avgPrice * h.quantity;
          const pAndLPercent = investedValue > 0 ? (pAndL / investedValue) * 100 : 0;
          return (
            <TableRow key={h.stock.symbol}>
              <TableCell>
                <div className="font-medium">{h.stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{h.stock.name}</div>
              </TableCell>
              <TableCell>{h.quantity}</TableCell>
              <TableCell>
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(h.avgPrice)}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(currentPrice)}
              </TableCell>
              <TableCell
                className={cn("text-right", {
                  "text-green-600": pAndL >= 0,
                  "text-red-600": pAndL < 0,
                })}
              >
                <div>
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(pAndL)}
                </div>
                <div className="text-sm">({pAndLPercent.toFixed(2)}%)</div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        const stockToTrade = getStock(h.stock.symbol);
                        if (stockToTrade) onTrade(stockToTrade);
                    }}
                >
                    Trade
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
