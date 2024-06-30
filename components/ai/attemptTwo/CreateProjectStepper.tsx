import { useState } from 'react';
import { Button, createStyles, Group, rem, Stepper } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  root: {
    padding: theme.spacing.md,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
  },

  separator: {
    height: rem(2),
    borderTop: `${rem(2)} dashed ${
      theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4]
    }`,
    borderRadius: theme.radius.xl,
    backgroundColor: 'transparent',
  },

  separatorActive: {
    borderWidth: 0,
    backgroundImage: theme.fn.linearGradient(
      45,
      theme.colors.blue[6],
      theme.colors.cyan[6]
    ),
  },

  stepIcon: {
    borderColor: 'transparent',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.white,
    // borderWidth: 0,

    '&[data-completed]': {
      borderWidth: 0,
      backgroundColor: 'transparent',
      backgroundImage: theme.fn.linearGradient(
        45,
        theme.colors.blue[6],
        theme.colors.cyan[6]
      ),
    },
  },

  step: {
    transition:
      'transform 150ms ease 0s, border-color 150ms ease 0s, border-width 150ms ease 0s',

    '&[data-progress]': {
      transform: 'scale(1.05)',
      borderColor: theme.colors.blue[6],
      borderWidth: rem(2),
      borderRadius: theme.radius.xl,
    },
  },
}));

export const CreateProjectStepper = ({
  totalSteps,
  currentStep,
  setCurrentStep,
  children,
}: any) => {
  const nextStep = () =>
    setCurrentStep((current: number) => Math.min(current + 1, totalSteps));
  const prevStep = () => setCurrentStep((current: number) => Math.max(current - 1, 0));
  const { classes } = useStyles();
  // const [active, setActive] = useState(1);

  const stepContent = children.find(
    (child: { props: { step: any; title: any } }) => child.props.step === currentStep
  );
  // console.log(stepContent.props.title)
  const stepTitles = children.map(
    (child: { props: { title: any } }) => child.props.title
  );

  return (
    <>
      <Stepper
        size="xs"
        classNames={classes}
        active={currentStep}
        onStepClick={setCurrentStep}
        breakpoint="sm"
      >
        {/* Generate Stepper.Steps based on totalSteps */}
        {/* Map all titles of steps to labels */}
        {[...Array(totalSteps)].map((_, index) => (
          <Stepper.Step key={index} label={stepTitles[index]} />
          // label={`Step ${index + 1}`} />
        ))}

        {/* <Stepper.Step label={stepTitle} /> */}
      </Stepper>

      {stepContent}
    </>
  );
};

// return (
//   <Stepper classNames={classes} active={active} onStepClick={setActive} breakpoint="sm">
//     <Stepper.Step label="Step 1" description="Create an account" />
//     <Stepper.Step label="Step 2" description="Verify email" />
//     <Stepper.Step label="Step 3" description="Get full access" />
//   </Stepper>
// );

// console.log(stepTitles)

// const stepTitle = stepTitles[currentStep];
// const stepTitle = stepContent.props.title;

// function Demo() {
//   const { classes } = useStyles();
//   const [active, setActive] = useState(1);
//   return (
//     <Stepper classNames={classes} active={active} onStepClick={setActive} breakpoint="sm">
//       <Stepper.Step label="Step 1" description="Create an account" />
//       <Stepper.Step label="Step 2" description="Verify email" />
//       <Stepper.Step label="Step 3" description="Get full access" />
//     </Stepper>
//   );
// }
// {/* <Group position="center" mt="xl">
//       <Button variant="default" onClick={prevStep} disabled={currentStep === 0}>
//         Back
//       </Button>
//       <Button onClick={nextStep} disabled={currentStep === totalSteps - 1}>
//         Next step
//       </Button>
//     </Group> */}
