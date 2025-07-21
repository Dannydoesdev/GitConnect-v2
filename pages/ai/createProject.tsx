import { useContext, useEffect, useState } from "react";
import { ProjectFormProvider, useProjectForm } from "@/context/formContext";
import { Button, Drawer, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useCompletion } from "ai/react";
import { CreateProjectStepper } from "@/features/ai-project-create/experiments/attemptTwo/CreateProjectStepper";
import { NarrativeEditor } from "@/features/ai-project-create/experiments/attemptTwo/NarrativeEditor";
import { StepPanel } from "@/features/ai-project-create/experiments/attemptTwo/StepPanel";
import { useAtom } from "jotai";
import { aiEditorAtom } from "@/atoms";
import DOMPurify from "dompurify";
import { doc, setDoc } from "firebase/firestore";
import { notifications } from "@mantine/notifications";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase/clientApp";
import { IconCross, IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/router";

const CreateProjectPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [opened, { open, close }] = useDisclosure(false);
  const [textEditorAtom, setTextEditorAtom] = useAtom(aiEditorAtom);
  const router = useRouter();
  const { userData } = useContext(AuthContext);

  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    if (userData?.isPro) {
      setIsPro(true);
    }
  }, [userData]);

  const apiUrl = isPro
    ? "/api/generateProject/narrativeGpt4"
    : "/api/generateProject/narrativeGpt3";

  const { complete, completion, input, stop, isLoading, handleInputChange, handleSubmit } =
    useCompletion({
      api: apiUrl,
      onResponse: (res) => {
        // trigger something when the response starts streaming in
      },
      onFinish: () => {
        console.log("Successfully generated completion!");
      },
    });

  const userid = userData?.uid;
  const repoid = router.query.repoId;
  const projectName = router.query.repoName;

  // The actual number of steps should = the number of StepPanel components
  const totalSteps = 6;

  useEffect(() => {
    setTextEditorAtom(completion);
  }, [completion]);

  const form = useProjectForm({
    initialValues: {
      title: "GitConnect",
      description: "",
      technologies: "React, typescript, firestore, nextjs, mantine UI",
      role: "Founder, designer and lead dev",
      duration: "",
      purpose: "Create a portfolio platform for devs",
      challenges: "Learning new technologies, turning it into a startup, launching, finding users",
      solutions:
        "Github API to import public projects, lots of helper functions, project pages for each project, ai generation for project assistance",
      learnings:
        "Heaps - how to start a company, how not to start a company, honestly how to code altogether",
      outcome: "Finally launched publicly after 450+ commits, now just trying to find users!",
      images: [],
      liveProjectURL: "",
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
  Outcome of the project: ${projectData.outcome}`;
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

    return prompt;
  }

  const handleSaveAndContinue = async (newData: any) => {
    // Store the project data and answers to the questions in firestore
    // if ( realtimeEditorContent !== '' ) {

    if (!textEditorAtom || textEditorAtom == "") {
      return;
    }
    const sanitizedHTML = DOMPurify.sanitize(textEditorAtom, {
      ADD_ATTR: ["target", "align", "dataalign"], // Save custom image alignment attributes
    });

    const docRef = doc(db, `users/${userid}/repos/${repoid}/projectData/mainContent`);
    try {
      notifications.show({
        id: "load-data",
        loading: true,
        title: "Saving updates",
        message: "Updated project is being saved to the database",
        autoClose: false,
        withCloseButton: false,
      });
      await setDoc(docRef, { htmlOutput: sanitizedHTML }, { merge: true });
    } catch (error) {
      console.log(error);
      notifications.update({
        id: "load-data",
        color: "red",
        title: "Something went wrong",
        message: "Something went wrong, please try again",
        icon: <IconCross size="1rem" />,
        autoClose: 2000,
      });
    } finally {
      // setUnsavedChanges(false);
      notifications.update({
        id: "load-data",
        color: "teal",
        title: "Updates were saved",
        message: "Your updates have been saved",
        icon: <IconCheck size="1rem" />,
        autoClose: 1000,
      });
    }

    // TODO: New project view page
    router.push(`/portfolio/edit/${projectName}`);
  };

  // This function is called when the user proceeds to the next step or requests a narrative
  const handleNextStep = async () => {
    if (currentStep === totalSteps - 1) {
      const prompt = formatPrompt(form.values);
      console.log("prompt:", prompt);
      open();
      try {
        complete(prompt);
        // const narrative: any = await generateNarrative(form.values);
        // setNarrativeContent(completion);
        // console.log('completion:')
        // console.log(completion)
        // setNarrativeContent(completion);
      } catch (error) {
        // Handle errors, such as updating state to show an error message
        console.log("error:", error);
      }
    } else {
      setCurrentStep((current) => current + 1);
    }
  };

  const handleBackStep = () => {
    setCurrentStep((current) => current - 1);
  };

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
              {/* render StepPanel components for each step */}
              <StepPanel step={0} title="Basic Info" />
              {/* <StepPanel step={1} title="Tech & Role" /> */}
              <StepPanel step={1} title="Purpose" />
              <StepPanel step={2} title="Challenges" />
              <StepPanel step={3} title="Solutions" />
              <StepPanel step={4} title="Learnings" />
              <StepPanel step={5} title="Outcome" />
            </CreateProjectStepper>

            <Group position="center" mt="xl">
              <Button onClick={handleBackStep} variant="default" disabled={currentStep === 0}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                {currentStep === totalSteps - 1 ? "Submit" : "Next step"}
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
        <Drawer size="xl" opened={opened} onClose={close} title="Project narrative generation">
          <div className="panel-right">
            <NarrativeEditor
            // generatedContent={completion} // Directly pass the completion state to the editor
            />
          </div>
          {/* Drawer content */}
          {/* <div dangerouslySetInnerHTML={{ __html: completion }}></div> */}
          {/* <p>{completion}</p> */}
        </Drawer>
      </>
    </>
  );
};

export default CreateProjectPage;
