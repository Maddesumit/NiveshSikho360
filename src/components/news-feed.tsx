"use client";

import { useState, useEffect } from 'react';
import { getNews, NewsArticle } from '@/data/news';
import { getNewsSentiment, NewsSentimentOutput } from '@/ai/flows/news-sentiment-flow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Newspaper, TrendingUp, TrendingDown, MinusCircle } from 'lucide-react';
import { Badge } from './ui/badge';

type AnalyzedNews = NewsArticle & { analysis?: NewsSentimentOutput };

export default function NewsFeed() {
  const [news, setNews] = useState<AnalyzedNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndAnalyzeNews = async () => {
      setLoading(true);
      const articles = getNews();
      const analyzedArticles: AnalyzedNews[] = await Promise.all(
        articles.map(async (article) => {
          try {
            const analysis = await getNewsSentiment({
              headline: article.headline,
              content: article.summary,
              stockSymbols: article.relatedStocks,
            });
            return { ...article, analysis };
          } catch (error) {
            console.error(`Failed to analyze sentiment for article ${article.id}:`, error);
            // Return article without analysis if AI call fails
            return article; 
          }
        })
      );
      setNews(analyzedArticles);
      setLoading(false);
    };

    fetchAndAnalyzeNews();
  }, []);

  const SentimentIcon = ({ sentiment }: { sentiment: NewsSentimentOutput['sentiment'] }) => {
    switch (sentiment) {
      case 'Positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <MinusCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const SentimentBadge = ({ sentiment }: { sentiment: NewsSentimentOutput['sentiment'] }) => {
     switch (sentiment) {
      case 'Positive':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Positive</Badge>;
      case 'Negative':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200">Negative</Badge>;
      default:
        return <Badge variant="secondary">Neutral</Badge>;
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-primary" /> Latest Market News & Sentiment
        </h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="pt-2">
                    <Skeleton className="h-6 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight font-headline flex items-center gap-2">
        <Newspaper className="w-6 h-6 text-primary" /> Latest Market News & Sentiment
      </h2>
      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle className="text-lg">{item.headline}</CardTitle>
              <div className="text-xs text-muted-foreground">
                {item.source} - {item.timestamp}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-4">{item.summary}</p>
              {item.analysis ? (
                <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                   <div className="flex items-center gap-2">
                     <SentimentIcon sentiment={item.analysis.sentiment} />
                     <p className="font-semibold">AI Sentiment Analysis:</p>
                     <SentimentBadge sentiment={item.analysis.sentiment} />
                   </div>
                   <p className="text-sm text-muted-foreground italic">"{item.analysis.reasoning}"</p>
                   {item.analysis.impactedStocks.map(stockImpact => (
                     <p key={stockImpact.symbol} className="text-sm">
                       <span className="font-semibold">{stockImpact.symbol}: </span>
                       {stockImpact.impact}
                     </p>
                   ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">AI analysis not available.</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
