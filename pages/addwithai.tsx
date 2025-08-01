import React, { useContext, useState } from 'react';
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
import OpenAI from 'openai';
import { AuthContext } from '../context/AuthContext';

type AiCaseStudyProps = {
  repoId?: string;
  repoName?: string;
};

const AddWithAI = ({ repoId }: AiCaseStudyProps) => {
  const [projectTitle, setProjectTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [challenges, setChallenges] = useState('');
  const [outcomes, setOutcomes] = useState('');
  const [approach, setApproach] = useState('');
  const [technology, setTechnology] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [readme, setReadme] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('');

  const { userData } = useContext(AuthContext);

  const form = useForm({
    initialValues: {
      projectTitle: `${projectTitle}`,
      purpose: `${purpose}`,
      challenges: `${challenges}`,
      outcomes: `${outcomes}`,
      approach: `${approach}`,
      technology: `${technology}`,
      nextSteps: `${nextSteps}`,
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    let projectTitle = 'My Project';
    let challenges =
      'Performance optimization, building a scalable architecture';
    let outcomes =
      'Improved application performance by 50%, built a scalable solution';
    let approach =
      'Adopted microservices architecture, followed agile methodologies';
    let technology = 'Python, Flask, PostgreSQL, Docker';
    let nextSteps =
      'Integrate machine learning for predictive analysis, adopt continuous deployment';
    let readme = 'My README content';
    let outputLanguage = 'Markdown';
    let style = 'Casual';
    let length = 'Medium';

    const model = 'gpt-3.5-turbo';

    const userMessage = `You are an intelligent assistant that crafts personalized software project case studies. Given the user's preferences for length, style, and formatting, create an engaging narrative from the provided project details. Include sections such as Introduction, Purpose, Approach, Technology Used, Challenges, Outcomes, and Next Steps. Adapt the content and structure as per unique elements in the user's inputs, and introduce new headings when necessary.`;

    const systemMessage = `I want to create a case study for my project. Here are the details:
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
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 800,
      });
      const generatedStudy = completion.choices[0]?.message?.content?.trim();

      console.log(generatedStudy);
    } catch (error) {
      console.error('Failed to generate case study:', error);
    }
  };

  function handleImportReadme() {
    const readmeUrl = `/api/profiles/projects/edit/readme`;
    axios
      .get(readmeUrl, {
        params: {
          owner: userData.userName,
          repo: repoId,
        },
      })
      .then((response) => {
        const sanitizedHTML = DOMPurify.sanitize(response.data, {
          ADD_ATTR: ['target'],
        });
        // console.log(sanitizedHTML)
        // setReadme(sanitizedHTML)
        // setContent(sanitizedHTML)
        // setEditorContent(sanitizedHTML)
        // editor?.commands.setContent(sanitizedHTML);
      });
  }

  return (
    <div>
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
          {/* <form onSubmit={handleSubmit}> */}
          <TextInput
            label='Project Title'
            placeholder='The name of your project'
            {...form.getInputProps('projectTitle')}
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
          <TextInput
            label='Challenges'
            placeholder='Describe the challenges faced'
            {...form.getInputProps('challenges')}
          />
          <TextInput
            label='Outcomes'
            placeholder='Describe the outcomes'
            {...form.getInputProps('outcomes')}
          />

          <TextInput
            label='Next Steps'
            placeholder='Describe the next steps'
            {...form.getInputProps('nextSteps')}
          />

          <Button variant='filled' fullWidth mt='md' onClick={handleSubmit}>
            Generate Case Study{' '}
          </Button>
        </Paper>
      </Container>
    </div>
  );
};

export default AddWithAI;
