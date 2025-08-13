import { useEffect, useState } from 'react';
import { getPdfFile, updateProjectSettings, getProject} from '@/lib/supabaseClient';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';

interface props {
  pdfUrl: string | null
  tab: string
  projectId: number
  imageBlobUrl: string | null
}

export default function PdfPreviewer({pdfUrl, tab, projectId, imageBlobUrl}: props) {
  
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  useEffect(() => {
    const filePath = `${projectId}_composite`

    const getImageUrl = async () => {
        const { data, error } = await supabase
            .storage
            .from('project-images')
            .createSignedUrl(filePath, 60 * 60) // valid for 1 hour

        if (error || !data?.signedUrl) {
            setImageUrl(null) // or other image
        } else {
            setImageUrl(data.signedUrl)
        }
    }

    getImageUrl()
  }, [])

  return (
    <div className="w-120">
      {pdfUrl ? (
        <div className="flex justify-center">
          {
            tab !== "cover" && <iframe
            src={pdfUrl}
            width="150%"
            height="700px"
            style={{ border: 'none' }}
          />
          }
          {
            tab === "cover" && imageBlobUrl &&
            <iframe 
            src={imageBlobUrl}
            width="140%"
            height="450px"
            style={{ border: 'none' }}
            />
          }


        </div>
      ) : (
        <div className='flex justify-center'>
          <p>Loading File...</p>
        </div>
      )}
    </div>
  );
}