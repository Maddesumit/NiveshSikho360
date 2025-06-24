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

const generateHistory = (basePrice: number) => {
  const history = [];
  let currentPrice = basePrice * (0.9 + Math.random() * 0.1);
  for (let i = 0; i < 30; i++) {
    history.push({
      date: `Day ${i + 1}`,
      price: parseFloat(currentPrice.toFixed(2)),
    });
    currentPrice *= 1 + (Math.random() - 0.48) * 0.1; // Fluctuate price
  }
  // ensure last price in history matches current price
  history[history.length - 1].price = basePrice;
  return history;
};

const calculateStats = (price: number, history: { date: string; price: number }[]) => {
  const open = history[0].price;
  const close = history[history.length - 2]?.price || open;
  const high = Math.max(...history.map(p => p.price));
  const low = Math.min(...history.map(p => p.price));
  const change = price - close;
  const changePercent = (change / close) * 100;
  return { open, high, low, close, change, changePercent };
};

const stocksData: Omit<Stock, 'open' | 'high' | 'low' | 'close' | 'change' | 'changePercent' | 'history'>[] = [
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
];

let stocks: Stock[] | null = null;

export const getStocks = (): Stock[] => {
  if (!stocks) {
    stocks = stocksData.map(stock => {
      const history = generateHistory(stock.price);
      const stats = calculateStats(stock.price, history);
      return { ...stock, ...stats, history };
    });
  }
  return stocks;
};
