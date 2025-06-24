"use client";

import React, { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import type { Stock } from "@/data/stocks";
import { getStocks } from "@/data/stocks";

type Holding = {
  stock: Stock;
  quantity: number;
  avgPrice: number;
};

type NiveshState = {
  cash: number;
  holdings: Holding[];
};

type Action =
  | { type: "BUY"; payload: { stock: Stock; quantity: number } }
  | { type: "SELL"; payload: { stock: Stock; quantity: number } };

const initialState: NiveshState = {
  cash: 100000,
  holdings: [],
};

const niveshReducer = (state: NiveshState, action: Action): NiveshState => {
  switch (action.type) {
    case "BUY": {
      const { stock, quantity } = action.payload;
      const cost = stock.price * quantity;

      if (state.cash < cost) {
        throw new Error("Not enough cash to complete this transaction.");
      }

      const existingHoldingIndex = state.holdings.findIndex(
        (h) => h.stock.symbol === stock.symbol
      );
      const newHoldings = [...state.holdings];

      if (existingHoldingIndex > -1) {
        const existingHolding = newHoldings[existingHoldingIndex];
        const newTotalQuantity = existingHolding.quantity + quantity;
        const newAvgPrice =
          (existingHolding.avgPrice * existingHolding.quantity + cost) /
          newTotalQuantity;

        newHoldings[existingHoldingIndex] = {
          ...existingHolding,
          quantity: newTotalQuantity,
          avgPrice: newAvgPrice,
        };
      } else {
        newHoldings.push({
          stock,
          quantity,
          avgPrice: stock.price,
        });
      }

      return {
        ...state,
        cash: state.cash - cost,
        holdings: newHoldings,
      };
    }
    case "SELL": {
      const { stock, quantity } = action.payload;
      const proceeds = stock.price * quantity;

      const existingHoldingIndex = state.holdings.findIndex(
        (h) => h.stock.symbol === stock.symbol
      );

      if (existingHoldingIndex === -1) {
        throw new Error("You do not own any shares of this stock.");
      }

      const existingHolding = state.holdings[existingHoldingIndex];
      if (existingHolding.quantity < quantity) {
        throw new Error("Not enough shares to sell.");
      }
      
      const newHoldings = [...state.holdings];
      if (existingHolding.quantity === quantity) {
        newHoldings.splice(existingHoldingIndex, 1);
      } else {
        newHoldings[existingHoldingIndex] = {
            ...existingHolding,
            quantity: existingHolding.quantity - quantity,
        };
      }

      return {
        ...state,
        cash: state.cash + proceeds,
        holdings: newHoldings
      };
    }
    default:
      return state;
  }
};

type NiveshContextType = {
  state: NiveshState;
  dispatch: React.Dispatch<Action>;
  getHolding: (symbol: string) => Holding | undefined;
  getStockPrice: (symbol: string) => number;
};

const NiveshContext = createContext<NiveshContextType | undefined>(undefined);

export const NiveshProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(niveshReducer, initialState);

  const getHolding = useCallback((symbol: string) => {
    return state.holdings.find(h => h.stock.symbol === symbol);
  }, [state.holdings]);

  const getStockPrice = useCallback((symbol: string) => {
    // In a real app, this would fetch the latest price. Here we use the mock data.
    const stock = getStocks().find(s => s.symbol === symbol);
    return stock?.price ?? 0;
  }, []);

  return (
    <NiveshContext.Provider value={{ state, dispatch, getHolding, getStockPrice }}>
      {children}
    </NiveshContext.Provider>
  );
};

export const useNiveshStore = () => {
  const context = useContext(NiveshContext);
  if (context === undefined) {
    throw new Error("useNiveshStore must be used within a NiveshProvider");
  }
  return context;
};
