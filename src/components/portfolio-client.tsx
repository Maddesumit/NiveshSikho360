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

const COLORS = ["#FFB347", "#468499", "#82ca9d", "#ffc658", "#8884d8"];

const FormattedCurrency = ({ value, className }: { value: number; className?: string }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);
  
  if (!isClient) {
    return <Skeleton className={cn("h-6 w-24", className)} />;
  }
  
  return <p className={className}>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value)}</p>
}

export default function PortfolioClient() {
  const { state, getStockPrice } = useNiveshStore();
  const { holdings, cash } = state;

  const portfolioMetrics = useMemo(() => {
    const totalInvested = holdings.reduce(
      (acc, h) => acc + h.avgPrice * h.quantity,
      0
    );
    const currentValue = holdings.reduce(
      (acc, h) => acc + getStockPrice(h.stock.symbol) * h.quantity,
      0
    );
    const totalPandL = currentValue - totalInvested;
    const totalPandLPercent =
      totalInvested > 0 ? (totalPandL / totalInvested) * 100 : 0;
    const portfolioValue = currentValue + cash;

    return {
      currentValue,
      totalPandL,
      totalPandLPercent,
      portfolioValue,
    };
  }, [holdings, cash, getStockPrice]);

  const allocationData = useMemo(() => {
    return holdings.map((h) => ({
      name: h.stock.symbol,
      value: getStockPrice(h.stock.symbol) * h.quantity,
    }));
  }, [holdings, getStockPrice]);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight font-headline">
        My Portfolio
      </h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <FormattedCurrency value={portfolioMetrics.portfolioValue} className="text-2xl font-bold" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Holdings Value</CardTitle>
          </CardHeader>
          <CardContent>
            <FormattedCurrency value={portfolioMetrics.currentValue} className="text-2xl font-bold" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total P/L</CardTitle>
          </CardHeader>
          <CardContent>
             <p
              className={cn("text-2xl font-bold", {
                "text-green-600": portfolioMetrics.totalPandL >= 0,
                "text-red-600": portfolioMetrics.totalPandL < 0,
              })}
            >
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "INR",
              }).format(portfolioMetrics.totalPandL)}{" "}
              ({portfolioMetrics.totalPandLPercent.toFixed(2)}%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Cash</CardTitle>
          </CardHeader>
          <CardContent>
             <FormattedCurrency value={cash} className="text-2xl font-bold" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <HoldingsTable holdings={holdings} getStockPrice={getStockPrice} />
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
  );
}

function HoldingsTable({ holdings, getStockPrice }: any) {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((h: any) => {
          const currentPrice = getStockPrice(h.stock.symbol);
          const pAndL = (currentPrice - h.avgPrice) * h.quantity;
          const pAndLPercent = (pAndL / (h.avgPrice * h.quantity)) * 100;
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
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
