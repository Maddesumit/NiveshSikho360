import { getStockBySymbol, Stock } from '@/data/stocks';
import { getFinancials, FinancialData } from '@/data/financials';
import { getNews, NewsArticle } from '@/data/news';
import StockDetailClient from '@/components/stock-detail-client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type StockDetailPageProps = {
  params: {
    symbol: string;
  };
};

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const symbol = params.symbol.toUpperCase();
  const stock = getStockBySymbol(symbol);

  if (!stock) {
    notFound();
  }

  const financials = getFinancials(symbol);
  const allNews = getNews();
  const relatedNews = allNews.filter(article => article.relatedStocks.includes(symbol));

  return (
    <StockDetailClient 
      stock={stock} 
      financials={financials}
      relatedNews={relatedNews}
    />
  );
}
