"use client";

import { useState, useMemo } from "react";
import { StockCard } from "./stock-card";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useNiveshStore } from "@/hooks/use-trade-store";

export default function DashboardClient() {
  const [searchTerm, setSearchTerm] = useState("");
  const { stocks } = useNiveshStore();

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    return stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, stocks]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search for stocks by name or symbol..."
          className="pl-10 w-full md:w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredStocks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStocks.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      ) : (
         <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium">No stocks found.</p>
            <p>Try adjusting your search term.</p>
        </div>
      )}
    </div>
  );
}
