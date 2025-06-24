"use client";

import { useState } from "react";
import type { Stock } from "@/data/stocks";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import TradeDialog from "./trade-dialog";

export function StockCard({ stock }: { stock: Stock }) {
  const [isTradeDialogOpen, setTradeDialogOpen] = useState(false);
  const isPositive = stock.change >= 0;

  const chartColor = isPositive
    ? "hsl(var(--chart-2))"
    : "hsl(var(--destructive))";

  const chartConfig = {
    price: {
      label: "Price",
      color: chartColor,
    },
  };

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex justify-between items-center font-headline">
            <span>{stock.symbol}</span>
            <div
              className={cn(
                "flex items-center text-sm font-normal",
                isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {isPositive ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              {stock.changePercent.toFixed(2)}%
            </div>
          </CardTitle>
          <CardDescription>{stock.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
            }).format(stock.price)}
          </div>
          <div className="h-24 w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart
                accessibilityLayer
                data={stock.history}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={`fill-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide={true} />
                <XAxis dataKey="date" hide={true}/>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Area
                  dataKey="price"
                  type="natural"
                  fill={`url(#fill-${stock.symbol})`}
                  stroke={chartColor}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => setTradeDialogOpen(true)}
          >
            Trade
          </Button>
        </CardFooter>
      </Card>
      <TradeDialog
        stock={stock}
        isOpen={isTradeDialogOpen}
        onOpenChange={setTradeDialogOpen}
      />
    </>
  );
}
