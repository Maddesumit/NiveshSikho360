import { format, subDays } from 'date-fns';

export type Stock = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePercent: number;
  history: { date: string; price: number }[];
};

// Create a simple deterministic pseudo-random number generator seeded by a string.
// This ensures that for the same stock symbol, we get the same "random" history.
export const pseudoRandomGenerator = (seedStr: string) => {
  let h = 1779033703, i, c;
  for (i = 0; i < seedStr.length; i++) {
    c = seedStr.charCodeAt(i);
    h = (h << 5) + h + c;
    h = h & h; // Convert to 32bit integer
  }
  return () => {
    h = Math.sin(h) * 10000;
    return h - Math.floor(h); // Return a float between 0 and 1
  };
};


// Generates ~5 years of daily stock data deterministically
const generateHistory = (symbol: string, basePrice: number) => {
  const rand = pseudoRandomGenerator(symbol);
  const history = [];
  // Use a fixed end date to avoid hydration issues with new Date()
  const endDate = new Date('2024-07-26T12:00:00Z');
  const daysToGenerate = 5 * 365;

  let price = basePrice;
  // Generate prices backwards from the end date
  for (let i = 0; i < daysToGenerate; i++) {
    const date = subDays(endDate, i);
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue; // Skip weekends
    }
    history.push({
      date: format(date, 'MMM dd, yyyy'),
      price: parseFloat(price.toFixed(2)),
    });
    // Adjust the price for the previous day with some "random" volatility
    // A little upward drift is introduced by using 0.495 instead of 0.5
    const volatility = 1 + (rand() - 0.495) * 0.06;
    price /= volatility; // Go backwards, so divide
  }

  // The history is generated backwards, so we need to reverse it
  return history.reverse();
};

const calculateStats = (price: number, history: { date: string; price: number }[]) => {
  if (history.length < 2) {
    return { open: price, high: price, low: price, close: price, change: 0, changePercent: 0 };
  }
  const open = history[0].price;
  const close = history[history.length - 2]?.price || open;
  const sixtyDayHistory = history.slice(-60);
  const high = Math.max(...sixtyDayHistory.map(p => p.price));
  const low = Math.min(...sixtyDayHistory.map(p => p.price));
  const change = price - close;
  const changePercent = (change / close) * 100;
  return { open, high, low, close, change, changePercent };
};

const stocksData: Omit<Stock, 'open' | 'high' | 'low' | 'close' | 'change' | 'changePercent' | 'history'>[] = [
  // Indices - treated as stocks for state management
  { symbol: "^NSEI", name: "NIFTY 50", sector: "Index", price: 25044.35 },
  { symbol: "^BSESN", name: "SENSEX", sector: "Index", price: 82055.11 },
  // Nifty 50
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", sector: "Energy", price: 2950.75 },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "Information Technology", price: 3850.50 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Financials", price: 1680.30 },
  { symbol: "INFY", name: "Infosys Ltd", sector: "Information Technology", price: 1630.80 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", sector: "Financials", price: 1120.10 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", sector: "Consumer Staples", price: 2450.90 },
  { symbol: "SBIN", name: "State Bank of India", sector: "Financials", price: 830.60 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", sector: "Communication Services", price: 1380.25 },
  { symbol: "LT", name: "Larsen & Toubro Ltd", sector: "Industrials", price: 3590.45 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd", sector: "Financials", price: 1750.00 },
  { symbol: "ITC", name: "ITC Ltd", sector: "Consumer Staples", price: 430.70 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", sector: "Financials", price: 7200.15 },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd", sector: "Automobile", price: 12500.00 },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", sector: "Automobile", price: 980.50 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries", sector: "Healthcare", price: 1590.80 },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd", sector: "Healthcare", price: 6200.20 },
  { symbol: "WIPRO", name: "Wipro Ltd", sector: "Information Technology", price: 480.25 },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd", sector: "Information Technology", price: 1440.70 },
  { symbol: "NESTLEIND", name: "Nestle India Ltd", sector: "Consumer Staples", price: 2550.00 },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd", sector: "Materials", price: 165.80 },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd", sector: "Materials", price: 910.40 },
  { symbol: "NTPC", name: "NTPC Ltd", sector: "Utilities", price: 360.55 },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd", sector: "Conglomerate", price: 3250.00 },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ Ltd", sector: "Industrials", price: 1350.10 },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd", sector: "Materials", price: 10800.00 },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd", sector: "Materials", price: 2890.60 },
  { symbol: "AXISBANK", name: "Axis Bank Ltd", sector: "Financials", price: 1225.00 },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd", sector: "Financials", price: 1580.90 },
  { symbol: "M_M", name: "Mahindra & Mahindra Ltd", sector: "Automobile", price: 2850.40 },
  { symbol: "TITAN", name: "Titan Company Ltd", sector: "Consumer Discretionary", price: 3500.75 },
  { symbol: "POWERGRID", name: "Power Grid Corp of India", sector: "Utilities", price: 325.10 },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp", sector: "Energy", price: 268.50 },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto Ltd", sector: "Automobile", price: 9700.00 },
  { symbol: "INDUSINDBK", name: "IndusInd Bank Ltd", sector: "Financials", price: 1490.80 },
  { symbol: "HINDALCO", name: "Hindalco Industries Ltd", sector: "Materials", price: 650.20 },
  { symbol: "CIPLA", name: "Cipla Ltd", sector: "Healthcare", price: 1480.90 },
  { symbol: "COALINDIA", name: "Coal India Ltd", sector: "Energy", price: 470.60 },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd", sector: "Automobile", price: 4750.30 },
  { symbol: "TATACONSUM", name: "Tata Consumer Products Ltd", sector: "Consumer Staples", price: 1100.00 },
  { symbol: "SBILIFE", name: "SBI Life Insurance Company", sector: "Financials", price: 1450.50 },
  
  // Mid-Cap & Small-Cap Stocks
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals Enterprise", sector: "Healthcare", price: 6150.00 },
  { symbol: "PAYTM", name: "One97 Communications Ltd", sector: "Financials", price: 410.50 },
  { symbol: "DMART", name: "Avenue Supermarts Ltd", sector: "Consumer Staples", price: 4750.00 },
  { symbol: "PIDILITIND", name: "Pidilite Industries Ltd", sector: "Materials", price: 3100.80 },
  { symbol: "HAVELLS", name: "Havells India Ltd", sector: "Industrials", price: 1890.75 },
  { symbol: "ZOMATO", name: "Zomato Ltd", sector: "Consumer Discretionary", price: 190.45 },
  { symbol: "IRCTC", name: "Indian Railway Catering & Tour", sector: "Consumer Discretionary", price: 1015.20 },
  { symbol: "IEX", name: "Indian Energy Exchange Ltd", sector: "Financials", price: 178.60 },
  { symbol: "TRIDENT", name: "Trident Ltd", sector: "Materials", price: 38.20 },
  { symbol: "SUZLON", name: "Suzlon Energy Ltd", sector: "Energy", price: 52.80 },
  { symbol: "RVNL", name: "Rail Vikas Nigam Ltd", sector: "Industrials", price: 390.10 },
  { symbol: "YESBANK", name: "Yes Bank Ltd", sector: "Financials", price: 24.10 },
  { symbol: "IDEA", name: "Vodafone Idea Ltd", sector: "Communication Services", price: 17.05 },
];

let allStocks: Stock[] | null = null;
let stocksBySymbol: Map<string, Stock> | null = null;

const initializeStocks = () => {
  if (!allStocks) {
    const generatedStocks = stocksData.map(stock => {
      const history = generateHistory(stock.symbol, stock.price);
      const stats = calculateStats(stock.price, history);
      return { ...stock, ...stats, history };
    });
    allStocks = generatedStocks;
    stocksBySymbol = new Map(generatedStocks.map(stock => [stock.symbol, stock]));
  }
};

export const getStocks = (): Stock[] => {
  initializeStocks();
  return allStocks!;
};

export const getStockBySymbol = (symbol: string): Stock | undefined => {
  initializeStocks();
  return stocksBySymbol!.get(symbol);
};
