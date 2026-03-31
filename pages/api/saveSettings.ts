import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = "https://gaqohqmpinyqhymzqtbt.supabase.co"
const secretApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcW9ocW1waW55cWh5bXpxdGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODEzNTM2MSwiZXhwIjoyMDYzNzExMzYxfQ.mXBYrtaevEyehE-uMLYrmLcIUMK9x3nLEHMzsslMlKo"

const supabase = createClient(supabaseUrl, secretApiKey, {
  auth: {
    persistSession: false
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method !== 'POST') return res.status(405).end();
  
    try {
      
      console.log("before body text")
      const bodyText = await new Promise<string>((resolve, reject) => {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });

      const { token, settings, projectId } = JSON.parse(bodyText);

      if (!token) {
        return res.status(401).json({ error: 'Missing token' });
      }

      // Verify user via Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Optional: verify user owns projectId here
      console.log(user.id)
      const { data: verificationData, error: verificationError } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)        
        .eq('user_id', user.id)     
        .single();                  

      if (verificationError) {
        console.error('DB error:', verificationError);
        return res.status(401).json({ error: 'Invalid token' });
      }

      if (!verificationData) {
        console.log('Project does not belong to this user or does not exist');
      } else {
        console.log('Project verified:', verificationData);
      }
      //save
      const { error: saveError } = await supabase
        .from('projects')
        .update({ settings: settings })
        .eq('id', projectId);

      if (saveError) {
        return res.status(500).json({ error: saveError.message });
      }

      return res.status(200).json({ message: 'Settings saved' });
    } catch (error) {
      console.error('Error in saveSettings:', error);
      return res.status(400).json({ error: 'Bad request' });
    }
}
