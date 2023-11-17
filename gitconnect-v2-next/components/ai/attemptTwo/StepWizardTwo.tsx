// File: components/StepWizard.tsx
import React, { ReactElement, useState } from 'react';
import { Stepper, Button, Group } from '@mantine/core';

interface StepProps {
  component: ReactElement;
  step: number;
}

interface StepWizardProps {
  children: ReactElement<StepProps>[]; // Define children as an array of React Elements with StepProps
}

export const StepWizard: React.FC<StepWizardProps> = ({ children }) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = children;

  const nextStep = () => setActiveStep((current) => (current < steps.length - 1 ? current + 1 : current));
  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  const CurrentStepComponent = steps[activeStep].props.component;

  return (
    <>
      <Stepper active={activeStep} onStepClick={setActiveStep} breakpoint="sm">
        {steps.map((step, index) => (
          <Stepper.Step key={index} label={`Step ${index + 1}`} />
        ))}
      </Stepper>

      {CurrentStepComponent}

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prevStep} disabled={activeStep === 0}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={activeStep === steps.length - 1}>
          Next step
        </Button>
      </Group>
    </>
  );
};
