import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body
  console.log("hello")
  console.log(body)
   res.status(200).json({ success: true });
}