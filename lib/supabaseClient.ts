import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gaqohqmpinyqhymzqtbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhcW9ocW1waW55cWh5bXpxdGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMzUzNjEsImV4cCI6MjA2MzcxMTM2MX0.Ha7j5sagKZob7qj1C9F-SK8KobNWPrp3VaXc1tVHA8E';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProject(userId: string, projectId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Update settings JSON
export async function updateProjectSettings(projectId: string, newSettings: any) {
  const { error } = await supabase
    .from('projects')
    .update({ settings: newSettings })
    .eq('id', projectId);

  if (error) throw error;
}

// Download PDF from storage
export async function getPdfFile(path: string): Promise<Uint8Array> {
  const { data, error } = await supabase.storage
    .from('project-pdfs')
    .download(path);

  if (error) throw error;
  return new Uint8Array(await data.arrayBuffer());
}

// Upload new PDF to storage
export async function uploadPdf(path: string, blob: Blob) {
  const { error } = await supabase.storage
    .from('project-pdfs')
    .upload(path, blob, { upsert: true });

  if (error) throw error;
}