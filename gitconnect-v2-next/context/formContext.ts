import { createFormContext } from '@mantine/form';

interface ProjectFormValues {
  title: string;
  description: string;
  technologies?: string[] | string;
  duration?: string;
  role?: string;
  purpose?: string;
  challenges?: string[] | string;
  solutions?: string[] | string;
  learnings?: string[] | string;
  outcome?: string;
  images?: string[] | string;
  repositoryURL?: string;
  liveProjectURL?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


export const [ProjectFormProvider, useProjectFormContext, useProjectForm] =
  createFormContext<ProjectFormValues>();