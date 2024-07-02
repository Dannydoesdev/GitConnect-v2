import { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
 
  export default function Weaviate(){
  const [readme, setReadme] = useState('');

  let newProjectObject = {
    name: 'GitConnect',
    description:
      'GitConnect is a platform for developers to showcase their projects and connect with other developers.',
    tags: ['Full Stack', 'NextJs', 'React', 'Typescript'],
    readme: '',
  };

  useEffect(() => {
    const fetchReadme = async () => {
      const userName = 'dannydoesdev';
      const repoName = 'gitconnect';
      const readmeUrl = `/api/weaviate/fetchReadme`;

      await axios
        .get(readmeUrl, {
          params: {
            owner: userName,
            repo: repoName,
          },
        })
        .then((response) => {
          console.log(`fetchReadme response: ${response.data}`)
          console.log(`length of readme response: ${(JSON.stringify(response.data).length)}`)
          // console.log(`response.data: ${response.data}`)
          // setReadme(response.data);

          newProjectObject = {
            ...newProjectObject,
            readme: response.data,
          };
          // uploadProject(newProjectObject);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchReadme();
  }, []);

    
  const uploadToWeaviate = async () => {
    const projectData = {
      name: 'GitConnect',
      description: 'GitConnect is a platform for developers to showcase their projects and connect with other developers.',
      tags: ['Full Stack', 'NextJs', 'React', 'Typescript'],
      readme
    };

    console.log(`Uploading project data to Weaviate: ${projectData}`)

    try {
      const response = await axios.post('/api/weaviate/uploadToWeaviate', projectData);
      console.log('Response from Weaviate:', response.data);
      // setUploadResponse(response.data);
    } catch (error) {
      console.error('Error uploading to Weaviate:', error);
    }
  };

  // if (!readme) {
  //   return <div className="flex h-screen justify-center items-center">Loading...</div>;
  // }

  return (
    <>
      <div className="flex mt-14 justify-center items-center">
        <h1>Weaviate</h1>
        <button onClick={uploadToWeaviate}>Upload to Weaviate</button>
      </div>
    </>
  );
}
