import type { NextApiRequest, NextApiResponse } from 'next'
import { Octokit } from "@octokit/rest";
import { Endpoints } from "@octokit/types";
import DOMPurify from 'dompurify';

type RequestData = {
  repo: string,
  owner: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Handle GET request
    console.log('request received')
    // const { repo, owner }: ResponseData = req.query;
    // const { repo, owner }: RequestData = req.query;

    const repoReq = req.query.repo;
    const ownerReq = req.query.owner;

    // TODO: fix type issues with strict type here
    if (repoReq && ownerReq) {

      const repo = repoReq.toString()
      const owner = ownerReq.toString()
      // rest of the code
      const octokit = new Octokit();
      // const owner = "dannydoesdev"; // change this to your desired owner
      // const repo = "gitconnect"; // change this to your desired repo

      // Get README.md file conten
      type GetReadmeResponse = Endpoints["GET /repos/{owner}/{repo}/readme"]["response"];
    
      // TODO: fix type issues with strict type here

      // let readme: GetReadmeResponse;

      let readme: any;

      // NOTE - removing mediaType will return all url links to the different types, could be useful to store these seperately for later
  
      try {
        readme = await octokit.repos.getReadme({
          owner,
          repo,
          // path: `profiles/${id}.md`, // change this to your desired path
          mediaType: {
            format: "html", // change this to your desired format
          },
        })
          // .then((response) => {
            console.log('\n\n\nfull readme response\n\n\n')
          console.log(readme)
        
          const readmeData = readme.data;
          console.log(`\n\n\nreadme.data\n\n\n`)
          console.log(readmeData)

        
          // const sanitizedHTML = DOMPurify.sanitize(readmeData);
          // console.log('\n\n\nsanitized\n\n\n')
  
          // console.log(sanitizedHTML)
        
        // console.log(readme)
        res.setHeader("Content-Type", "text/html");
        // console.log(readme.data.content)

        res.status(200).send(readmeData);

        // })
        // Send back file content as HTML
     


      } catch (error) {
        res.status(404).json({ message: "File not found" });
        return;
      }
      // res.send({message: 'hi'})
      // console.log(readme)

      // Send back file content as plain text
      // res.setHeader("Content-Type", "text/plain");
      // res.status(200).send(Buffer.from(readme.data.content, "base64").toString());



    } else {
      //   // Return 405 Method Not Allowed
      res.status(405).end();
    }
  }else {
    //   // Return 405 Method Not Allowed
    res.status(404).json({ message: "No owner or repo received" });
  }


}


// import React, { useState, useEffect } from 'react';
// import { Octokit, App } from 'octokit';

// const octokit = new Octokit();

// interface ReadmeProps {
//   owner: string;
//   repo: string;
// }

// const Readme = ({ owner, repo }: ReadmeProps) => {
//   const [readme, setReadme] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchReadme = async () => {
//       const { data } = await octokit.rest.repos.getReadme({ owner, repo });
//       setReadme(atob(data.content));
//     };

//     fetchReadme();
//   }, [owner, repo]);

//   return (
//     <div>
//       {readme ? (
//         <div dangerouslySetInnerHTML={{ __html: readme }} />
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };

// export default Readme;