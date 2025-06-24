import { getModuleById } from '@/data/academy';
import ModuleClient from '@/components/module-client';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

type AcademyModulePageProps = {
  params: {
    topicId: string; // This is now a moduleId
  };
};

export default function AcademyModulePage({ params }: AcademyModulePageProps) {
  const module = getModuleById(params.topicId);

  if (!module) {
    notFound();
  }

  return <ModuleClient module={module} />;
}
