import React, { useContext, useState } from 'react';
import {
  Button,
  Paper,
  TextInput,
  Textarea,
  Space,
  Container,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Configuration, OpenAIApi } from 'openai';
import { doc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { AuthContext } from '../context/AuthContext';

  // I want you to act as a software engineering case study expert. You will come up with entertaining stories that are engaging, imaginative and captivating for the audience. It can be fairy tales, educational stories or any other type of stories which has the potential to capture people's attention and imagination. Depending on the target audience, you may choose specific themes or topics for your storytelling session e.g., if it’s children then you can talk about animals; If it’s adults then history-based tales might engage them better etc. My first request is "I need an interesting story on perseverance."

    // Please create a compelling case study narrative for a software project, using the following information:

    // - Project Title: {projectTitle}
    // - Challenge: {challenge}
    // - Approach: {approach}
    // - Technology: {technology}
    // - Outcomes: {outcomes}
    // - Next Steps: {nextSteps}
    
    // The narrative should be professional, engaging, and catered towards both fellow developers and hiring managers.

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

  //... more states for other fields

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

      //... more fields
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Integration with OpenAI GPT and Firebase will be handled here.

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // const openai = new OpenAI(configuration);
    const openai = new OpenAIApi(configuration);

    // Set custom variables
    let projectTitle = "My Project";
    let challenges = "Performance optimization, building a scalable architecture";
    let outcomes = "Improved application performance by 50%, built a scalable solution";
    let approach = "Adopted microservices architecture, followed agile methodologies";
    let technology = "Python, Flask, PostgreSQL, Docker";
    let nextSteps = "Integrate machine learning for predictive analysis, adopt continuous deployment";
    let readme = "My README content";
    let outputLanguage = "Markdown";
    let style = "Casual";
    let length = "Medium";

const gptRequestPayload = {
  model: 'gpt-3.5-turbo',
  messages: [
    { role: 'system', content: `You are an intelligent assistant that crafts personalized software project case studies. Given the user's preferences for length, style, and formatting, create an engaging narrative from the provided project details. Include sections such as Introduction, Purpose, Approach, Technology Used, Challenges, Outcomes, and Next Steps. Adapt the content and structure as per unique elements in the user's inputs, and introduce new headings when necessary.` },
    {
      role: 'user',
      content: `I want to create a case study for my project. Here are the details:
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
      - Length: ${length}`
    },
  ],
  max_tokens: 600,
};




    try {
      const completion = await openai.createCompletion(gptRequestPayload);
      const generatedStudy = completion.data.choices[0].text?.trim();

      // console.log(generatedStudy);
      // const response = await openai.createCompletion(gptRequestPayload);
      // const generatedCaseStudy = response.choices[0].message.content.trim();

      //    // Saving to Firebase
      // await setDoc(
      //   doc(db, `users/${userId}/repos/${repoId}`),
      //   { caseStudy: generatedStudy },
      //   { merge: true }
      // );

      // Now save this generatedCaseStudy to Firebase. We'll cover this in the next step.
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
        }
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

          {/* <TextInput
          label="Outcomes"
          placeholder="Describe the outcomes"
          value={outcomes}
          onChange={(e) => setOutcomes(e.target.value)}
        /> */}
          <Button variant='filled' fullWidth mt='md' onClick={handleSubmit}>
            Generate Case Study{' '}
          </Button>
          {/* <Button type='submit'></Button> */}
          {/* </form> */}
        </Paper>
      </Container>
    </div>
  );
};

export default AddWithAI;

