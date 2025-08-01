import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Container,
  Paper,
  Space,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import DOMPurify from 'dompurify';

import EditableCaseStudy from '@/features/ai-project-create/components/EditableCaseStudy';
import { AuthContext } from '@/context/AuthContext';

type AiCaseStudyProps = {
  repoId?: string;
  repoName?: string;
};

const AddWithAI = ({ repoId }: AiCaseStudyProps) => {
  const [projectTitle, setProjectTitle] = useState('GitConnect');

  const [purpose, setPurpose] = useState(
    'To make a project sharing platform for software developers'
  );

  const [approach, setApproach] = useState(
    'Do some research on alternatives, whip up some wireframes, identify tech and then start putting things together'
  );

  const [technology, setTechnology] = useState(
    'Next.js, React Firebase, Mantine UI, TypeScript, Github API'
  );

  const [challenges, setChallenges] = useState(
    'First time using a lot of the technology, trying to make a scalable platform was challenging as well as integrating with github api - lots of learnings'
  );

  const [outcomes, setOutcomes] = useState(
    'Basically ready with the MVP having made good progress, only took 1000 hours more than expected'
  );

  const [nextSteps, setNextSteps] = useState('Launch the beta and make money');

  const [readme, setReadme] = useState('');

  const [outputLanguage, setOutputLanguage] = useState('HTML');

  const [style, setStyle] = useState(
    'professional, first-person, confident but fun'
  );

  const [length, setLength] = useState('medium');

  const [outPut, setOutPut] = useState<any>('');

  const { userData } = useContext(AuthContext);
  const userId = userData.userId;
  const router = useRouter();
  const { projectName } = router.query;

  const handleSubmit = async () => {
    const {
      projectTitle,
      purpose,
      approach,
      challenges,
      technology,
      outcomes,
      nextSteps,
      style,
      length,
    } = form.values;

    const systemMessage = `You are an intelligent assistant that crafts personalized software project case studies. Given the user's preferences for length, style, and formatting, create an engaging first-person narrative from the provided project details. Include sections such as Introduction, Purpose, Approach, Technology Used, Challenges, Outcomes, and Next Steps. Adapt the content and structure as per unique elements in the user's inputs, and introduce new headings when necessary. Format the output with accurate formatting in the user proivded Output Language`;

    const userMessage = `I want to create a case study for my project. Here are the details:
    - Project Title: ${projectTitle}
    - Purpose: ${purpose}
    - Approach: ${approach}
    - Technology: ${technology}
    - Challenges: ${challenges}
    - Outcomes: ${outcomes}
    - Next Steps: ${nextSteps}
    - README: ${readme}
    - Output Language: ${outputLanguage}
    - Style: ${style}
    - Length: ${length}`;

    try {
      await axios
        .post('/api/ai/generateProject', {
          userMessage: userMessage,
          systemMessage: systemMessage,
          model: 'gpt-4',
        })
        .then((response) => {
          const sanitizedHTML = DOMPurify.sanitize(response.data, {
            ADD_ATTR: ['target'],
          });

          setOutPut(sanitizedHTML as any);
        });
    } catch (error) {
      console.error('Failed to generate case study:', error);
    }
  };

  function handleImportReadme() {
    const readmeUrl = `/api/profiles/projects/edit/readme`;
    axios.get(readmeUrl, {
      params: {
        owner: userData.userName,
        repo: repoId,
      },
    });
    // .then((response) => {
    //   const sanitizedHTML = DOMPurify.sanitize(response.data, {
    //     ADD_ATTR: ['target'],
    //   });
      // console.log(sanitizedHTML)
      // setReadme(sanitizedHTML)
      // setContent(sanitizedHTML)
      // setEditorContent(sanitizedHTML)
      // editor?.commands.setContent(sanitizedHTML);
    // });
  }

  // Adding Mantine form options
  const form = useForm({
    initialValues: {
      projectTitle: `${projectTitle}`,
      purpose: `${purpose}`,
      challenges: `${challenges}`,
      outcomes: `${outcomes}`,
      approach: `${approach}`,
      technology: `${technology}`,
      nextSteps: `${nextSteps}`,
      style: `${style}`,
      length: `${length}`,
    },
  });

  return (
    <div>
      {/* <Space h={70} /> */}
      <Container mt={70}>
        <Paper
          radius='md'
          withBorder
          p='lg'
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
          })}
        >
          <TextInput
            label='Project Title'
            placeholder='The name of your project'
            {...form.getInputProps('projectTitle')}
          />
          <Textarea
            label='Purpose'
            placeholder='Describe the purposes of the project'
            {...form.getInputProps('purpose')}
          />
          <Textarea
            label='Approach'
            placeholder='Describe the approach taken'
            {...form.getInputProps('approach')}
          />
          <TextInput
            label='Technology'
            placeholder='Describe the technology used'
            {...form.getInputProps('technology')}
          />
          <Textarea
            label='Challenges'
            placeholder='Describe the challenges faced'
            {...form.getInputProps('challenges')}
          />
          <Textarea
            label='Outcomes'
            placeholder='Describe the outcomes of the project'
            {...form.getInputProps('outcomes')}
          />

          <Textarea
            label='Next Steps'
            placeholder='Describe the next steps for the project'
            {...form.getInputProps('nextSteps')}
          />
          <Textarea
            label='Length of Output'
            placeholder='How long should the output be? (Short, Medium, Long)'
            {...form.getInputProps('length')}
          />
          <Textarea
            label='Style of Output'
            placeholder='What kind of style should the output be? (Casual, Professional, Academic etc)'
            {...form.getInputProps('style')}
          />

          <Button variant='filled' fullWidth mt='md' onClick={handleSubmit}>
            Generate Case Study{' '}
          </Button>

          <EditableCaseStudy aiGeneratedContent={outPut} />
        </Paper>
      </Container>
    </div>
  );
};

export default AddWithAI;
