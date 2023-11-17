// File: components/StepWizard.js
import React, { useState } from 'react';
import { ProjectFormProvider, useProjectForm, useProjectFormContext } from '@/context/formContext';
import { Button, Group } from '@mantine/core';

export const StepWizard = ({ children }: any) => {
  const [activeStep, setActiveStep] = useState(0);
  const form  = useProjectFormContext();
  const steps = React.Children.toArray(children);

  const goNext = () => setActiveStep((current) => (current < steps.length - 1 ? current + 1 : current));
  const goBack = () => setActiveStep((current) => (current > 0 ? current - 1 : current));
  
  const CurrentStep = steps[activeStep];

  
  return (
    <ProjectFormProvider form={form}>
      <div>
        <CurrentStep.component {...CurrentStep.props} />
        <Group position="center" mt="xl">
          <Button onClick={goBack} disabled={activeStep === 0}>
            Back
          </Button>
          <Button onClick={goNext} disabled={activeStep === steps.length - 1}>
            Next
          </Button>
        </Group>
      </div>
    </ProjectFormProvider>
  );
};


 // const [activeStep, setActiveStep] = useState(0);

  // const steps = React.Children.toArray(children);
  // const CurrentStep = steps[activeStep];

  // const goNext = () => setActiveStep((current) => (current < steps.length - 1 ? current + 1 : current));
  // const goBack = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  // let CurrentComponent;
  // if (typeof CurrentStep === 'object' && 'component' in CurrentStep && typeof CurrentStep.component === 'function') {
  //   CurrentComponent = CurrentStep.component;
  // } else {
  //   // Handle the case where CurrentStep.component is not a function
  //   CurrentComponent = () => <div>Invalid Step Component</div>;
  // }