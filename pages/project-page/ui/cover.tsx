import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Settings } from "@/types"
import { match } from "assert";
import { X } from "lucide-react";
import { Infobubble } from "@/components/ui/infobubble";
import {createNewCoverFile, countPages, processCoverFile} from '@/services/pdfProcessor'

interface props {
  settings: Settings; // Or use the actual type of your settings object
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  projectId: number
  pdfUrl: string
  onImageChange: (value: string) => void
}

export default function Cover({settings, setSettings, projectId, pdfUrl, onImageChange}: props) {

  const coverInputRef = useRef<HTMLInputElement>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverMessage, setCoverMessage] = useState('')

  const spineInputRef = useRef<HTMLInputElement>(null)
  const [spineFile, setSpineFile] = useState<File | null>(null)
  const [spineMessage, setSpineMessage] = useState('')

  const backInputRef = useRef<HTMLInputElement>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [backMessage, setBackMessage] = useState('')

  const existingInputRef = useRef<HTMLInputElement>(null)
  const [existingFile, setExistingFile] = useState<File | null>(null)
  const [existingMessage, setExistingMessage] = useState('')

  const [paperType, setPaperType] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const [compositeFile, setCompositeFile] = useState<File | null>(null)
  const [signedUrl, setSignedUrl] = useState("")

  useEffect(() => {

    setPaperType(settings.paper_type)

    const setPages = async() => {
      const pageCount = await countPages(pdfUrl)
      setSettings(prev => ({
        ...prev,
        page_count: pageCount,
      }));
    }

    const makeCompositeFile = async() => {
      const processedBlob = await createNewCoverFile(settings.trim_Size)
      const blobUrl = URL.createObjectURL(processedBlob)
      onImageChange(blobUrl)

      const name = `${projectId}_composite`

      const { data, error } = await supabase
        .storage
        .from('project-images')
        .upload(name, processedBlob, {
          upsert: true
        })

    }
    const checkFile = async() => {
      const existingFile = await getSignedUrl()
      if (existingFile === false) {
        makeCompositeFile()
      }
    }

    setPages()
    
    if (signedUrl == null || signedUrl == '') {
      checkFile()
    }



  }, [])

  useEffect(() => {
    const fetchAndProcessPdf = async () => {
      try {
        const processedBlob = await processCoverFile(signedUrl, settings);
        const blobUrl = URL.createObjectURL(processedBlob);
        onImageChange(blobUrl);
      } catch (e: any) {
        if (e.name === "AbortError") {
          console.log("PDF fetch/process aborted");
        } else {
          console.error("PDF processing failed:", e);
        }
      }
    };

    if (signedUrl) fetchAndProcessPdf()

  }, [signedUrl, settings])

  const getSignedUrl = async () => {

    const link = `${projectId}_composite`
    const { data, error } = await supabase
      .storage
      .from('project-images')
      .createSignedUrl(link, 60 * 60); // 1 hour

      if (error) {
        console.error('Error getting signed URL:', error);
        // in this case wait for a trim size.
        return false
      }
      if (data) {
        setSignedUrl(data.signedUrl)
        return true
      }
      if (!data) {
        return false
      }
  };


  const handleCoverClick = () => {
    coverInputRef.current?.click()
  }

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setCoverMessage("Please upload an image.")
        return
      }

      console.log(file) // pass file to parent or upload logic
      setCoverMessage(file.name)
      setCoverFile(file)

      const { data, error } = await supabase.storage
      .from('project-images') // replace with your actual bucket
      .upload(`${projectId}_cover`, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (error) {
        console.error("Upload error:", error)
      } else {
        console.log("File uploaded:", data)
      }

      const { data: insertData, error: insertError } = await supabase
      .from("projects")
      .update({ cover: `${projectId}_cover`})
      .match({id: projectId})
      
    }
  }

  const handleSpineClick = () => {
    spineInputRef.current?.click()
  }

  const handleSpineFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setSpineMessage("Please upload an image.")
        return
      }

      console.log(file) // pass file to parent or upload logic
      setSpineMessage(file.name)
      setSpineFile(file)

      const { data, error } = await supabase.storage
      .from('project-images') // replace with your actual bucket
      .upload(`${projectId}_spine`, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (error) {
        console.error("Upload error:", error)
      } else {
        console.log("File uploaded:", data)
      }

      const { data: insertData, error: insertError } = await supabase
      .from("projects")
      .update({ spine: `${projectId}_spine`})
      .match({id: projectId})
      
    }
  }

  const handleBackClick = () => {
    backInputRef.current?.click()
  }

  const handleBackCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setBackMessage("Please upload an image.")
        return
      }

      console.log(file) // pass file to parent or upload logic
      setBackMessage(file.name)
      setBackFile(file)

      const { data, error } = await supabase.storage
      .from('project-images') // replace with your actual bucket
      .upload(`${projectId}_back`, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (error) {
        console.error("Upload error:", error)
      } else {
        console.log("File uploaded:", data)
      }

      const { data: insertData, error: insertError } = await supabase
      .from("projects")
      .update({ back: `${projectId}_back`})
      .match({id: projectId})
      
    }
  }

  const handleExistingClick = () => {
    existingInputRef.current?.click()
  }

  const handleExistingFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setExistingMessage("Please upload an image.")
        return
      }

      console.log(file) // pass file to parent or upload logic
      setExistingMessage(file.name)
      setExistingFile(file)

      const { data, error } = await supabase.storage
      .from('project-images') // replace with your actual bucket
      .upload(`${projectId}_existing`, file, {
        cacheControl: '3600',
        upsert: true,
      })

      if (error) {
        console.error("Upload error:", error)
      } else {
        console.log("File uploaded:", data)
      }

      const { data: insertData, error: insertError } = await supabase
      .from("projects")
      .update({ existing: `${projectId}_existing`})
      .match({id: projectId})
      
    }
  }

  // have to change this stuff

  const cancelFile = async(type: string) => {
    if (type == "cover") {
      const { data, error } = await supabase
        .storage
        .from('project-images')
        .remove([`${projectId}_cover`]);

      setCoverMessage("Image removed successfully")
      if (error) {
        console.error('Failed to delete file:', error.message);
      } else {
        console.log('File deleted successfully');
      }
    }

    if (type == "spine") {
       const { data, error } = await supabase
        .storage
        .from('project-images')
        .remove([`${projectId}_spine`]);

      setSpineMessage("Image removed successfully")
      if (error) {
        console.error('Failed to delete file:', error.message);
      } else {
        console.log('File deleted successfully');
      }
    }

    if (type == "back") {
       const { data, error } = await supabase
        .storage
        .from('project-images')
        .remove([`${projectId}_back`]);

      setBackMessage("Image removed successfully")
      if (error) {
        console.error('Failed to delete file:', error.message);
      } else {
        console.log('File deleted successfully');
      }
    }
  }

  const handlePaperSelect = (type: string) => {
    setPaperType(type)
    setSettings(prev => ({
      ...prev,
      paper_type: type,
    }));
  }

    return(
      <div className="w-160">
        <div className="flex-1 p-8 space-y-8">

          {/* Line Spacing */}
          <div>
            <label className="block font-normal mb-2">Upload an existing cover:</label>
            
            <div className="flex items-center space-x-3 w-130">
              <Button onClick={handleCoverClick} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-20 h-10">Upload</Button>
              <input
                type="file"
                accept="application/image/*"
                className="hidden"
                ref={coverInputRef}
                onChange={handleCoverFileChange}
              />
              <p className="">{coverMessage}</p>
                <button onClick={() => cancelFile("cover")} className="bg-white rounded-full p-2 hover:bg-gray-200">
                  <X size={18}></X>
                </button>
            </div>
          </div>

          {/* Bleed */}
          <div>
            <label className="block font-normal mb-2">Upload an existing spine:</label>
            <div className="flex items-center space-x-3 w-130">
              <Button onClick={handleSpineClick} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-20 h-10">Upload</Button>
              <input
                type="file"
                accept="application/image/*"
                className="hidden"
                ref={spineInputRef}
                onChange={handleSpineFileChange}
              />
              <p className="">{spineMessage}</p>
                <button onClick={() => cancelFile("spine")} className="bg-white rounded-full p-2 hover:bg-gray-200">
                  <X size={18}></X>
                </button>

            </div>
          </div>

          {/* Trim Size */}
          <div>
            <label className="block font-normal mb-2">Upload an existing back cover:</label>
            <div className="flex items-center space-x-3 w-130">
              <Button onClick={handleBackClick} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-20 h-10">Upload</Button>
              <input
                type="file"
                accept="application/image/*"
                className="hidden"
                ref={backInputRef}
                onChange={handleBackCoverChange}
              />
              <p className="">{backMessage}</p>
                <button onClick={() => cancelFile("back")} className="bg-white rounded-full p-2 hover:bg-gray-200">
                  <X size={18}></X>
                </button>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-3">
              <span>type of paper?</span>
              <div className="mb-1">
                <Infobubble text="You'll select this in the KDP book settings. White and Cream will both have black and white images, and premium color paper will have more vibrant colors."/>
              </div>
            </div>
            <div className="pt-4 flex space-x-4">
              <div className="flex space-x-4">
                {["White", "Cream", "Standard color paper", "Premium color paper"].map((i) => (
                  <label key={i} style={{ display: 'block', marginBottom: '8px' }}>
                    <div className="space-x-2">
                    <input
                      type="checkbox"
                      checked={paperType === i}
                      onChange={() => handlePaperSelect(i)}
                    />
                    <span>{i}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Preview */}
      </div>
    )
}