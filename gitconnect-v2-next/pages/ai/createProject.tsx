import { useEffect, useState } from 'react';
import { ProjectFormProvider, useProjectForm } from '@/context/formContext';
import {
  Button,
  Container,
  Drawer,
  Group,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { useCompletion } from 'ai/react';
import { useDebouncedCallback } from 'use-debounce';
import { CreateProjectStepper } from '@/components/ai/attemptTwo/CreateProjectStepper';
import { NarrativeEditor } from '@/components/ai/attemptTwo/NarrativeEditor';
import { StepPanel } from '@/components/ai/attemptTwo/StepPanel';

const CreateProjectPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const {
    complete,
    completion,
    input,
    stop,
    isLoading,
    handleInputChange,
    handleSubmit,
  } = useCompletion({
    api: '/api/generateNarrative',
    onResponse: (res) => {
      // trigger something when the response starts streaming in
      // e.g. if the user is rate limited, you can show a toast
      // if (res.status === 429) {
      //   toast.error('You are being rate limited. Please try again later.');
      // }
    },
    onFinish: () => {
      // do something with the completion result
      // toast.success('Successfully generated completion!');
      console.log('Successfully generated completion!');
    },
  });

  // ...inside your CreateProjectPage or similar component
  // const [narrativeContent, setNarrativeContent] = useState(''); // State to hold the content

  //  Can be used for realtime streaming
  // const handleInputChange = useDebouncedCallback(e => {
  //   complete(e.target.value);
  // }, 500);

  // The actual number of steps should be the number of StepPanel components you have
  const totalSteps = 6;

  // const form = useProjectForm({
  //   initialValues: {
  //     title: '',
  //     description: '',
  //     technologies: '',
  //     role: '',
  //     duration: '',
  //     purpose: '',
  //     challenges: '',
  //     solutions: '',
  //     learnings: '',
  //     outcome: '',
  //     images: [],
  //     liveProjectURL: '',
  //   },
  // });

  const form = useProjectForm({
    initialValues: {
      title: 'GitConnect',
      description: '',
      technologies: 'React, typescript, firestore, nextjs, mantine UI',
      role: 'Founder, designer and lead dev',
      duration: '',
      purpose: 'Create a portfolio platform for devs',
      challenges:
        'Learning new technologies, turning it into a startup, launching, finding users',
      solutions:
        'Github API to import public projects, lots of helper functions, project pages for each project, ai generation for project assistance',
      learnings:
        'Heaps - how to start a company, how not to start a company, honestly how to code altogether',
      outcome:
        'Finally launched publicly after 450+ commits, now just trying to find users!',
      images: [],
      liveProjectURL: '',
    },
  });

  function formatPrompt(projectData: any): string {
    return `Project Title: ${projectData.title}\n
  Users Role in Project: ${projectData.role}\n
  Project Technologies: ${projectData.technologies}\n
  Purpose of the project: ${projectData.purpose}\n
  Challenges faced during the project: ${projectData.challenges}\n
  Solutions implemented in the project: ${projectData.solutions}\n
  Learnings from the project: ${projectData.learnings}\n
  Outcome of the project: ${projectData.outcome}`; // Continue with other fields
  }

  function formatPromptTwo(projectData: any): string {
    let prompt = `Project Title: ${projectData.title}\nUsers role in the project: ${projectData.role}\nTechnologies used in the project: ${projectData.technologies}\n`;

    if (projectData.purpose) {
      prompt += `Purpose of the project: ${projectData.purpose}\n`;
    }
    if (projectData.challenges) {
      prompt += `Challenges faced during the project: ${projectData.challenges}\n`;
    }
    if (projectData.solutions) {
      prompt += ` Solutions implemented in the project: ${projectData.solutions}\n`;
    }
    if (projectData.learnings) {
      prompt += `Learnings from the project: ${projectData.learnings}\n`;
    }
    if (projectData.outcome) {
      prompt += `Outcome of the project: ${projectData.outcome}\n`;
    }

    // Include other fields similarly if they are not empty

    return prompt;
  }

  // This function is called when the user proceeds to the next step or requests a narrative
  const handleNextStep = async () => {
    if (currentStep === totalSteps - 1) {
      const prompt = formatPrompt(form.values);
      console.log('prompt:', prompt);
      open();
      try {
        complete(prompt);
        // const narrative: any = await generateNarrative(form.values);
        // setNarrativeContent(completion);
        // console.log('completion:')
        // console.log(completion)
        // setNarrativeContent(completion);

        // Here you might want to navigate to a "Success" page or show the narrative
      } catch (error) {
        // Handle errors, such as updating state to show an error message
        console.log('error:', error);
      }
    } else {
      setCurrentStep((current) => current + 1);
    }
  };

  const handleBackStep = () => {
    setCurrentStep((current) => current - 1);
  };

  // // This function should be called to stream data from GPT-4 and update narrativeContent
  // const streamDataToEditor = async () => {
  //   // Replace with actual streaming logic
  //   const streamedContent = await getStreamedContentFromGPT4();
  //   setNarrativeContent(streamedContent);
  // };

  return (
    <>
      <ProjectFormProvider form={form}>
        <div className="create-project-container mt-20">
          <div className="panel-left">
            {/* The stepper component that manages which step the user is on */}
            <CreateProjectStepper
              totalSteps={totalSteps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            >
              {/* Here you render StepPanel components for each step */}
              <StepPanel step={0} title="Basic Info" />
              {/* <StepPanel step={1} title="Tech & Role" /> */}
              <StepPanel step={1} title="Purpose" />
              <StepPanel step={2} title="Challenges" />
              <StepPanel step={3} title="Solutions" />
              <StepPanel step={4} title="Learnings" />
              <StepPanel step={5} title="Outcome" />
            </CreateProjectStepper>

            <Group position="center" mt="xl">
              <Button
                onClick={handleBackStep}
                variant="default"
                disabled={currentStep === 0}
              >
                Back
              </Button>
              <Button onClick={handleNextStep}>
                {currentStep === totalSteps - 1 ? 'Submit' : 'Next step'}
              </Button>
            </Group>
          </div>
          <div className="panel-right">
            {/* The component that displays the narrative generated by the AI */}
            {/* <NarrativeEditor content={narrativeContent} /> */}
            {/* <NarrativeEditor content={completion} /> */}
          </div>
        </div>
      </ProjectFormProvider>
      <>
        <Drawer opened={opened} onClose={close} title="Project narrative generation">
          <div className="panel-right">
            <NarrativeEditor
              generatedContent={completion} // Directly pass the completion state to the editor
            />
          </div>
          {/* Drawer content */}
          {/* <div dangerouslySetInnerHTML={{ __html: completion }}></div> */}
          {/* <p>{completion}</p> */}
          {/* <NarrativeEditor content={completion} /> */}
        </Drawer>
      </>
    </>
  );
};

export default CreateProjectPage;

// Title:
// GitConnect

// Tech used:
// React, typescript, firestore, nextjs, mantine UI

// Role:
// founder, designer and lead dev

// Purpose:
// Create a portfolio platform for devs

// Challenges:
// learning new technologies, turning it into a startup, launching, finding users

// Solutions:
// Github API to import public projects, lots of helper functions, project pages for each project, ai generation for project assistance

// Learnings:
// heaps - how to start a company, how not to start a company, honestly how to code altogether

// Outcome:
// finally launched publicly after 450+ commits, now just trying to find users!
// const submitProjectData = async (projectData: any) => {
//   // Replace with the actual API endpoint and request logic
//   // Mocked response for illustration
//   const response = await fetch('/api/generateNarrative', {
//     method: 'POST',
//     body: JSON.stringify(projectData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   const narrative = await response.json();
//   return narrative;
// };

// const handleNextStep = async () => {
//   if (currentStep === totalSteps - 1) {
//     await generateNarrative(form.values);
//   } else {
//     setCurrentStep((current) => current + 1);
//   }
// };
//  {/* </Stack> */}
//             {/* </Container> */}
//          {/* <Container mt='md'> */}
//       {/* <Stack spacing='md'> */}
//    {/* <Group position="right">
//         <Button onClick={open}>Open Drawer</Button>
//       </Group> */}
// useEffect(() => {
//   console.log(form.values);
// }, [form.values]);

// This function makes an API call to submit the project data and receives the narrative
// const submitProjectData = async (projectData: any) => {
//   const response = await fetch('/api/generateNarrative', {
//     method: 'POST',
//     body: JSON.stringify(projectData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   if (!response.ok) {
//     // Handle errors here, such as displaying a message to the user
//     throw new Error('Failed to generate narrative');
//   }

//   const narrative = await response.json();
//   return narrative;
// };
// const generateNarrative = async (projectData: any) => {
//   // This function would call your backend API which in turn communicates with OpenAI's GPT
//   // For now, we'll mock this to update the narrative state
//   const generatedNarrative = await submitProjectData(projectData);
//   setNarrativeContent(generatedNarrative);
// };

//   return (
//     <ProjectFormProvider form={form}>
//       <div className="create-project-container mt-20">
//         <div className="panel-left">
//           <CreateProjectStepper
//             totalSteps={totalSteps}
//             currentStep={currentStep}
//             setCurrentStep={setCurrentStep}
//           >
//              {/* Pass StepPanel components as children with form fields */}
//              <StepPanel step={0} title="Title and Description">
//               <TextInput
//                 label="Project Title"
//                 placeholder="Enter your project title"
//                 {...form.getInputProps('title')}
//               />
//               <Textarea
//                 label="Project Description"
//                 placeholder="Describe your project"
//                 {...form.getInputProps('description')}
//               />
//             </StepPanel>
//             <StepPanel step={1} title="Technologies and Role">

//               {/* Include fields for technologies and role here */}
//             </StepPanel>
//             <StepPanel step={2} title="Purpose">
//               {/* Include fields for purpose here */}
//             </StepPanel>
//             <StepPanel step={3} title="Challenges">
//           </CreateProjectStepper>
//           <Group position="center" mt="xl">
//             <Button onClick={handleBackStep} disabled={currentStep === 0}>
//               Back
//             </Button>
//             <Button onClick={handleNextStep}>
//               {currentStep === totalSteps - 1 ? 'Submit' : 'Next step'}
//             </Button>
//           </Group>
//         </div>
//         <div className="panel-right">
//           <NarrativeEditor content={narrativeContent} />
//         </div>
//         {/* Styles and additional logic */}
//       </div>
//     </ProjectFormProvider>
//   );
// };

{
  /* Pass StepPanel components as children */
}
//             <StepPanel step={0} title="Title and Description" />
//             <StepPanel step={1} title="Technologies and Role" />
//             <StepPanel step={2} title="Purpose" />
//             <StepPanel step={3} title="Challenges" />
//             <StepPanel step={4} title="Solutions" />
//             <StepPanel step={5} title="Learnings" />
//             <StepPanel step={6} title="Outcome" />
//             {/* ... additional steps */}
//           </CreateProjectStepper>
//         </div>
//         <div className="panel-right">
//           <NarrativeEditor content={narrativeContent} />
//         </div>

//         {/* Styles and additional logic */}
//       </div>
//     </ProjectFormProvider>
//   );
// };

// export default CreateProjectPage;

// const [projectData, setProjectData] = useState({
//   title: '',
//   description: '',
//   // ... other fields
// });
// const [narrative, setNarrative] = useState('');

// const handleDataChange = (newData) => {
//   setProjectData({ ...projectData, ...newData });
// };

// const handleStepChange = (stepNumber) => {
//   setCurrentStep(stepNumber);
// };

// const handleSubmit = async () => {
//   // This function will be responsible for submitting the final data to the backend
//   // and could also handle the narrative generation
//   await generateNarrative();
//   // Additional submit logic...
// };

// ... onSubmit logic, API calls, etc.
