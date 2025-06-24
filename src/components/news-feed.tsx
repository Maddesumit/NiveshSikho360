"use client";

import { useState, useEffect } from 'react';
import { getNews, NewsArticle } from '@/data/news';
import { getNewsSentiment, NewsSentimentOutput } from '@/ai/flows/news-sentiment-flow';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Newspaper, TrendingUp, TrendingDown, MinusCircle, BrainCircuit } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

type AnalyzedNews = NewsArticle & { 
  analysis?: NewsSentimentOutput;
  loading?: boolean;
};

export default function NewsFeed() {
  const [news, setNews] = useState<AnalyzedNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const articles = getNews();
    setNews(articles.map(a => ({ ...a, analysis: undefined, loading: false })));
    setLoading(false);
  }, []);

  const handleAnalyzeArticle = async (articleId: number) => {
    setNews(currentNews => 
      currentNews.map(n => n.id === articleId ? { ...n, loading: true } : n)
    );

    const article = news.find(n => n.id === articleId);
    if (!article) return;

    try {
      const analysis = await getNewsSentiment({
        headline: article.headline,
        content: article.summary,
        stockSymbols: article.relatedStocks,
      });
      setNews(currentNews => 
        currentNews.map(n => n.id === articleId ? { ...n, analysis, loading: false } : n)
      );
    } catch (error) {
      console.error(`Failed to analyze sentiment for article ${articleId}:`, error);
      // Add error state to the article if needed
      setNews(currentNews => 
        currentNews.map(n => n.id === articleId ? { ...n, loading: false } : n)
      );
    }
  };


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
                    <Skeleton className="h-10 w-1/3" />
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
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">{item.headline}</CardTitle>
              <div className="text-xs text-muted-foreground">
                {item.source} - {item.timestamp}
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
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
              ) : item.loading ? (
                 <div className="flex items-center justify-center p-4">
                    <Skeleton className="h-6 w-1/2" />
                 </div>
              ) : null}
            </CardContent>
             <CardFooter>
                {!item.analysis && (
                    <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleAnalyzeArticle(item.id)}
                        disabled={item.loading}
                    >
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        {item.loading ? 'Analyzing...' : 'Analyze Sentiment'}
                    </Button>
                )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
