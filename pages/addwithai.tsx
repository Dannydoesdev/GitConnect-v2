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
import { AuthContext } from '../context/AuthContext';

type AiCaseStudyProps = {
  repoId?: string;
  repoName?: string;
};

const AddWithAI = ({ repoId }: AiCaseStudyProps) => {
  const { userData } = useContext(AuthContext);

  const form = useForm({
    initialValues: {
      projectTitle: '',
      purpose: '',
      challenges: '',
      outcomes: '',
      approach: '',
      technology: '',
      nextSteps: '',
    },
    validate: {
      projectTitle: (value) =>
        value.length < 2
          ? 'Project title must have at least 2 characters'
          : null,
      // approach: (value) => (value.length < 10 ? 'Please provide a more detailed approach' : null),
      // technology: (value) => (value.length < 5 ? 'Please specify the technologies used' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    // Hardcode values for testing
    // const prompt = `I want to create a case study for my project to add to my portfolio. Here are the details:
    // - Project Title: Sample Project
    // - Approach: Adopted microservices architecture, followed agile methodologies
    // - Technology: Python, Flask, PostgreSQL, Docker
    // - Challenges: Performance optimization, building a scalable architecture
    // - Outcomes: Improved application performance by 50%, built a scalable solution
    // - Next Steps: Integrate machine learning for predictive analysis, adopt continuous deployment

    // Please create a professional case study in Markdown format with a medium length.`;

    const prompt = `I want to create a case study for my project to add to my portfolio. Here are the details:
    - Project Title: ${values.projectTitle || 'My Project'}
    - Approach: ${values.approach || 'Not specified'}
    - Technology: ${values.technology || 'Not specified'}
    - Challenges: ${values.challenges || 'Not specified'}
    - Outcomes: ${values.outcomes || 'Not specified'}
    - Next Steps: ${values.nextSteps || 'Not specified'}
    
    Please create a professional case study in Markdown format with a medium length.`;

    try {
      const response = await axios.post('/api/ai/chatgpt', {
        prompt: prompt,
      });
      const generatedStudy = response.data?.message?.trim();

      console.log('Generated case study:', generatedStudy);

      // Handle the generated content - customise this based on needs
      if (generatedStudy) {
        // Example: Navigate to the project editor with this content
        // router.push(`/portfolio/edit/${repoId}?content=${encodeURIComponent(generatedStudy)}`);
      }
    } catch (error) {
      console.error('Failed to generate case study:', error);
      // alert('Failed to generate case study. Please try again.');
    }
  };

  // Handle dynamically importing README content
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
          <form onSubmit={form.onSubmit(handleSubmit)}>
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

            <Button type='submit' variant='filled' fullWidth mt='md'>
              Generate Case Study
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AddWithAI;
