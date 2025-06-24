import { getAcademyTopicById } from '@/data/academy';
import AcademyTopicClient from '@/components/academy-topic-client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type AcademyTopicPageProps = {
  params: {
    topicId: string;
  };
};

export default function AcademyTopicPage({ params }: AcademyTopicPageProps) {
  const topic = getAcademyTopicById(params.topicId);

  if (!topic) {
    notFound();
  }

  return <AcademyTopicClient topic={topic} />;
}
