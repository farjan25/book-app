import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!

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

export async function updateProjectSettings(projectId: string, newSettings: any) {
  const { error } = await supabase
    .from('projects')
    .update({ settings: newSettings })
    .eq('id', projectId);

  if (error) throw error;
}

export async function getPdfFile(path: string): Promise<Uint8Array> {
  const { data, error } = await supabase.storage
    .from('project-pdfs')
    .download(path);

  if (error) throw error;
  return new Uint8Array(await data.arrayBuffer());
}

export async function uploadPdf(path: string, blob: Blob) {
  const { error } = await supabase.storage
    .from('project-pdfs')
    .upload(path, blob, { upsert: true });

  if (error) throw error;
}