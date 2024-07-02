import { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';

export default function Weaviate() {
  const [readme, setReadme] = useState('');

  let newProjectObject = [
    {
      name: 'GitConnect',
      description:
        'GitConnect is a platform for developers to showcase their projects and connect with other developers.',
      tags: ['Full Stack', 'NextJs', 'React', 'Typescript'],
      readme: readme,
    },
  ];

  useEffect(() => {
    const handleImportReadme = async () => {
      const userName = 'dannydoesdev';
      const repoName = 'gitconnect';
      const readmeUrl = `/api/profiles/projects/edit/readme`;
      await axios
        .get(readmeUrl, {
          params: {
            owner: userName,
            repo: repoName,
          },
        })
        .then((response) => {
          console.log(response);
          const sanitizedHTML = DOMPurify.sanitize(response.data);
          console.log(sanitizedHTML);
          setReadme(sanitizedHTML);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    handleImportReadme();
  }, []);

  console.log(newProjectObject);

  if (!readme) {
    return <div className="flex h-screen justify-center items-center">Loading...</div>;
  }

  return (
    <>
      <div className="flex mt-14 justify-center items-center">
        <h1>Weaviate</h1>
      </div>
      <div dangerouslySetInnerHTML={{ __html: readme }} />
    </>
  );
}
