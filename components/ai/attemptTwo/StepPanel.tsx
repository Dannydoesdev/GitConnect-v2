// File: components/StepPanel.js
import {
  ProjectFormProvider,
  useProjectForm,
  useProjectFormContext,
} from '@/context/formContext';
import { Container, Stack, Textarea, TextInput } from '@mantine/core';

interface StepPanelProps {
  step: number;
  title?: string;
}

// Define an interface for step contents with numeric index signatures
interface StepContents {
  [key: number]: JSX.Element;
}

// Each step component is a small functional component that returns a specific form input field.
const TitleAndDescriptionStep = ({ form }: any) => (
  <>
    <TextInput
      label="Project Title"
      placeholder="Enter a title for your project"
      {...form.getInputProps('title')}
    />
    {/* <Textarea
      label="Project Description"
      placeholder="Give a brief description of your project"
      {...form.getInputProps('description')}
    /> */}
     <TextInput
      label="Technologies Used"
      placeholder="Enter the technologies used in your project"
      {...form.getInputProps('technologies')}
    />
    <TextInput
      label="Role"
      placeholder="What was your role in the project?"
      {...form.getInputProps('role')}
    />
  </>
);

// const TechnologiesAndRoleStep = ({ form }: any) => (
//   <>
//     <TextInput
//       label="Technologies Used"
//       placeholder="Enter the technologies used in your project"
//       {...form.getInputProps('technologies')}
//     />
//     <TextInput
//       label="Role"
//       placeholder="Enter your role in the project"
//       {...form.getInputProps('role')}
//     />
//   </>
// );

const PurposeStep = ({ form }: any) => (
  <>
    <Textarea
      label="Purpose"
      placeholder="Provide a brief description of the purpose of the project"
      {...form.getInputProps('purpose')}
    />
  </>
);

const ChallengesStep = ({ form }: any) => (
  <>
    <Textarea
      label="Challenges"
      placeholder="Describe any challenges you faced in the project"
      {...form.getInputProps('challenges')}
    />
  </>
);

const SolutionsStep = ({ form }: any) => (
  <>
    <Textarea
      label="Solutions"
      placeholder="Describe the solutions you implemented"
      {...form.getInputProps('solutions')}
    />
  </>
);

const LearningsStep = ({ form }: any) => (
  <>
    <Textarea
      label="Learnings"
      placeholder="Describe the learnings you gained"
      {...form.getInputProps('learnings')}
    />
  </>
);

const OutcomeStep = ({ form }: any) => (
  <>
    <Textarea
      label="Outcome"
      placeholder="Describe the outcome of the project"
      {...form.getInputProps('outcome')}
    />
  </>
);

export const StepPanel = (props: StepPanelProps) => {
  const form = useProjectFormContext(); // This hook provides form state and functions
  const { step, title } = props; // This is the current step

  const stepContent: StepContents = {
    0: <TitleAndDescriptionStep form={form} />,
    // 1: <TechnologiesAndRoleStep form={form} />,
    1: <PurposeStep form={form} />,
    2: <ChallengesStep form={form} />,
    3: <SolutionsStep form={form} />,
    4: <LearningsStep form={form} />,
    5: <OutcomeStep form={form} />,
  };

  return (
    <Container mt='md'>
      <Stack spacing='md'>
        {stepContent[step]}
        </Stack>
      </Container>
    
  )
};

export default StepPanel;

// export const StepPanel = ({ stepId }: any) => {
//   const  form  = useProjectFormContext();

//   return (
//     <div>
//       {stepId === 1 && (
//         <TextInput
//           label="Project Title"
//           placeholder="Enter your project title"
//           {...form.getInputProps('title')}
//         />
//       )}

//       {stepId === 2 && (
//         <Textarea
//           label="Project Description"
//           placeholder="Describe your project"
//           {...form.getInputProps('description')}
//         />
//       )}

//       {stepId === 3 && (
//         <TextInput
//           label="Technologies Used"
//           placeholder="Enter the technologies used in your project"
//           {...form.getInputProps('technologies')}
//         />
//       )}
//       {stepId === 4 && (
//         <TextInput
//           label="Role"
//           placeholder="Enter your role in the project"
//       {...form.getInputProps('role')}
//         />
//       )}

//       {stepId === 5 && (
//         <TextInput
//           label="Duration"
//           placeholder="Enter the duration of the project"
//           {...form.getInputProps('duration')}
//         />
//       )}

//       {stepId === 6 && (
//         <Textarea
//           label="Purpose"
//           placeholder="Describe the purpose of the project"
//           {...form.getInputProps('purpose')}
//         />
//       )}

//       {stepId === 7 && (
//         <Textarea
//           label="Challenges"
//           placeholder="Describe the challenges you faced"
//           {...form.getInputProps('challenges')}
//         />
//       )}

//       {stepId === 8 && (
//         <Textarea
//           label="Solutions"
//           placeholder="Describe the solutions you implemented"
//           {...form.getInputProps('solutions')}
//         />
//       )}

//       {stepId === 9 && (
//         <Textarea
//           label="Learnings"
//           placeholder="Describe the learnings you gained"
//           {...form.getInputProps('learnings')}
//         />
//       )}

//       {stepId === 10 && (
//         <Textarea
//           label="Outcome"
//           placeholder="Describe the outcome of the project"
//           {...form.getInputProps('outcome')}
//         />
//       )}

//       {/* ...additional fields for other steps */}
//     </div>
//   );
// };
