import { getAllUserProjectsWithUsernameLowercase } from "@/lib/projects";
import { getProfileDataWithUsernameLowercase } from "@/lib/profiles";
import { NextApiRequest, NextApiResponse } from "next";


// export default async function handler(req: any, res: any) {
  // const { username } = req.query;
  export async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
  const username = req.query.username as string;

  try {
    const data = await getAllUserProjectsWithUsernameLowercase(username);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: (error as Error).message });
  }
}

// export async function handler2(req: any, res: any) {
  // const { username } = req.query;
export async function handler2(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const username = req.query.username as string;

  try {
    const data = await getProfileDataWithUsernameLowercase(username);
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: (error as Error).message });
  }
}

// export default async (req, res) => {
//   const { username } = req.query;
//   try {
//     const data = await getAllUserProjectsWithUsernameLowercase(username);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// export default async (req, res) => {
//   const { username } = req.query;
//   try {
//     const data = await getProfileDataWithUsernameLowercase(username);
//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };