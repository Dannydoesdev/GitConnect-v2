import React, { ReactElement, useState } from 'react';
import { ProjectFormProvider, useProjectFormContext } from '@/context/formContext';
import { Button, Group } from '@mantine/core';

interface StepComponentProps {
  component: ReactElement;
  step: number;
}

interface StepWizardProps {
  children: ReactElement<StepComponentProps>[];
}

export const StepWizard: React.FC<StepWizardProps> = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0);
  const form = useProjectFormContext();
  const steps = React.Children.toArray(children) as ReactElement<StepComponentProps>[];

  const goNext = () => setActiveStep((current) => (current < steps.length - 1 ? current + 1 : current));
  const goBack = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  const CurrentStepComponent = steps[activeStep].props.component;

  return (
    <ProjectFormProvider form={form}>
      <div>
        {CurrentStepComponent}
        <Group position="center" mt="xl">
          <Button onClick={goBack} disabled={activeStep === 0}>Back</Button>
          <Button onClick={goNext} disabled={activeStep === steps.length - 1}>Next</Button>
        </Group>
      </div>
    </ProjectFormProvider>
  );
};
