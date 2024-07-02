import axios from 'axios';
import DOMPurify from 'dompurify';
import client from './weaviateInitiateClient';
import { useEffect, useState } from 'react';

const weaviateImportData = async () => {

  // Hardcoding test data temporarily
  const userId = 'bO4o8u9IskNbFk2wXZmjtJhAYkR2';
  const userName = 'dannydoesdev';
  const repoName = 'gitconnect'
  const repoId = '519774186';
  const repoIdTwo = '572895196';
  const repoNameTwo = 'starwars-search-api'

  // Capture readme content in state
  const [readme, setReadme] = useState('');

  useEffect(() => {

    // Get the readme content for public repo from the GitHub API
    const handleImportReadme = async () => {

      const readmeUrl = `/api/profiles/projects/edit/readme`;
      await axios
        .get(readmeUrl, {
          params: {
            owner: userName,
            repo: repoName,
          },
        })
        .then((response) => {
          const sanitizedHTML = DOMPurify.sanitize(response.data);
          console.log(sanitizedHTML);
          // setReadme(sanitizedHTML);
  
        })
        .catch((error) => {
          console.log(error);
        });
    };
  
    handleImportReadme();
  }, []);
  
  // Object to be inserted into Weaviate - this will be replaced with the actual data
  let newProjectObject = [
    {
      name: 'GitConnect',
      description: 'GitConnect is a platform for developers to showcase their projects and connect with other developers.',
      tags: ['Full Stack', 'NextJs', 'React', 'Typescript'],
      readme: readme,
    },
  ];

  if (readme) {
    console.log('Readme content:', readme);
    return { newProjectObject };
  }

  // const weaviateProjectsCollection = client.collections.get('Projects');

  // const response = await weaviateProjectsCollection.data.insertMany(dataObjects);

  // console.log(response);

};

export default weaviateImportData;;
