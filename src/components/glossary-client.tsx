"use client";

import { useState, useMemo } from 'react';
import { getGlossaryTerms, getFeaturedTerms } from '@/data/glossary';
import { Input } from '@/components/ui/input';
import { Search, Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function GlossaryClient() {
    const [searchTerm, setSearchTerm] = useState('');
    const allTerms = useMemo(() => getGlossaryTerms(), []);
    const featuredTerms = useMemo(() => getFeaturedTerms(), []);

    const filteredTerms = useMemo(() => {
        if (!searchTerm) return allTerms;
        return allTerms.filter(term => 
            term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            term.definition.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, allTerms]);

    const groupedTerms = useMemo(() => {
        return filteredTerms.reduce((acc, term) => {
            const firstLetter = term.term[0].toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(term);
            return acc;
        }, {} as Record<string, typeof filteredTerms>);
    }, [filteredTerms]);

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <BookOpen className="w-16 h-16 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight font-headline">Stock Market Glossary</h1>
                <p className="text-lg text-muted-foreground max-w-3xl">
                    Your go-to dictionary for all things investing. Search for terms or browse alphabetically.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for a term..."
                        className="pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {!searchTerm && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                           <Star className="text-primary" /> Featured Terms
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {featuredTerms.map(term => (
                                <Card key={term.term}>
                                    <CardHeader>
                                        <CardTitle>{term.term}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{term.definition}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                
                <h2 className="text-2xl font-bold font-headline mb-4">All Terms</h2>
                
                {Object.keys(groupedTerms).length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                        {Object.keys(groupedTerms).sort().map(letter => (
                            <div key={letter} className="mb-4">
                                <h3 className="text-xl font-semibold font-headline text-primary mb-2 pl-2">{letter}</h3>
                                {groupedTerms[letter].map(term => (
                                    <AccordionItem key={term.term} value={term.term}>
                                        <AccordionTrigger className="text-left hover:no-underline">{term.term}</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2">
                                                <p>{term.definition}</p>
                                                <p className="italic text-muted-foreground bg-muted p-2 rounded-md">
                                                    <strong>Example:</strong> {term.example}
                                                </p>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </div>
                        ))}
                    </Accordion>
                ) : (
                     <div className="text-center py-16 text-muted-foreground">
                        <p className="text-lg font-medium">No terms found.</p>
                        <p>Try adjusting your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
