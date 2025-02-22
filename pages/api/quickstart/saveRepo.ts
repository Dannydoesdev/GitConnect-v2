import { fetchLanguages } from '@/lib/quickstart/fetchLanguages';
import { saveQuickstartProject } from '@/lib/quickstart/saveQuickstart';
import type { NextApiRequest, NextApiResponse } from 'next';
import fetchReadme from './fetchReadme';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  console.log('save Repo API route called - data received:')
  console.log(req.body)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract project data from request body
  const { projectData, userid, repoid, userName, repoName } = req.body;

  // Run extra server functions for readme and langauges etc
  // NOTE - moved to saveQuickstartProject function

  // const readme = await fetchReadme(userName, repoName);
  // const languages = await fetchLanguages(projectData.languages_url);
  
  // const fullProjectData = {
  //   ...projectData,
  //   readme: readme,
  //   language_breakdown_percent: languages,
  // }


  console.log(`userid: ${userid}, repoid: ${repoid}, userName: ${userName}, repoName: ${repoName}`)

  try { 
    await saveQuickstartProject(userid, repoid, userName, repoName, projectData)
    res.status(200).json({ message: '' });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: `Error uploading with error: ${error}` });
  }

}
