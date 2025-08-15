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

  const [filesFetched, setFilesFetched] = useState(false)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverMessage, setCoverMessage] = useState('')

  const spineInputRef = useRef<HTMLInputElement>(null)
  const [spineFile, setSpineFile] = useState<File | null>(null)
  const [spineMessage, setSpineMessage] = useState('')

  const backInputRef = useRef<HTMLInputElement>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [backMessage, setBackMessage] = useState('')

  const [paperType, setPaperType] = useState<string | null>(null)
  const [selected, setSelected] = useState<number | null>(null)

  const [compositeFile, setCompositeFile] = useState<File | null>(null)
  const [signedUrl, setSignedUrl] = useState("")
  

  useEffect(() => {

    setPaperType(settings.paper_type)

    const getImages = async() => {
      const { data: coverData, error: coverError } = await supabase
        .storage
        .from('project-images')
        .download(`${projectId}_cover`)

      if (coverData) {
        const ext = coverData.type.split("/")[1] || "bin";
        const cover_file = new File(
          [coverData], // Blob parts
          `${projectId}_cover.${ext}`, // File name
          { type: coverData.type } // Preserve MIME type
        );
        setCoverFile(cover_file)
      }

      const { data: spineData, error: spineError } = await supabase
        .storage
        .from('project-images')
        .download(`${projectId}_spine`)

      if (spineData) {
        const ext = spineData.type.split("/")[1] || "bin";
        const spine_file = new File(
          [spineData], // Blob parts
          `${projectId}_spine.${ext}`, // File name
          { type: spineData.type } // Preserve MIME type
        );
        setSpineFile(spine_file)
      }

      const { data: backData, error: backError } = await supabase
        .storage
        .from('project-images')
        .download(`${projectId}_back`)

      if (backData) {
        const ext = backData.type.split("/")[1] || "bin";
        const back_file = new File(
          [backData], // Blob parts
          `${projectId}_back.${ext}`, // File name
          { type: backData.type } // Preserve MIME type
        );
        setBackFile(back_file)
      }
      console.log("got images")
      setFilesFetched(true)
    }

    getImages()

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
      getSignedUrl()
    }

    const checkFile = async() => {
      const existingFile = await getSignedUrl()
      if (existingFile === false) {
        makeCompositeFile()
      }
    }
    
    if (signedUrl == null || signedUrl == '') {
      checkFile()
    }

  }, [])

  useEffect(() => {
    const fetchAndProcessPdf = async () => {
      try {
        console.log(coverFile, spineFile, backFile)
        const processedBlob = await processCoverFile(signedUrl, settings, coverFile, spineFile, backFile);
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

    if (signedUrl && filesFetched) fetchAndProcessPdf()

  }, [signedUrl, settings, filesFetched])

  const getSignedUrl = async () => {

    const link = `${projectId}_composite`
    const { data, error } = await supabase
      .storage
      .from('project-images')
      .createSignedUrl(link, 60 * 60); // 1 hour

      if (error) {
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
      .from('project-images')
      .upload(`${projectId}_cover`, file, {
        cacheControl: '0',
        upsert: true,
      })

      if (error) {
        console.error("Upload error:", error)
      } else {
        console.log("File uploaded:", data)
      }

      setSettings(prev => ({
        ...prev,
        cover: true,
      }));
      
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
        cacheControl: '0',
        upsert: true,
      })

      if (error) {
        console.error("Upload error:", error)
      } else {
        console.log("File uploaded:", data)
      }

      setSettings(prev => ({
        ...prev,
        spine: true,
      }));
      
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
        cacheControl: '0',
        upsert: true,
      })

      if (error) {
        console.error("Upload error:", error)
      } else {
        console.log("File uploaded:", data)
      }

      setSettings(prev => ({
        ...prev,
        back: true,
      }));
      
    }
  }

  const cancelFile = async(type: string) => {
    if (type == "cover") {
      setCoverFile(null)
      setSettings(prev => ({
        ...prev,
        cover: false,
      }));
      setCoverMessage("Image successfully deleted.")
    }

    if (type == "spine") {
      setSpineFile(null)
      setSettings(prev => ({
        ...prev,
        spine: false,
      }));
      setSpineMessage("Image successfully deleted.")
    }

    if (type == "back") {
      setBackFile(null)
      setSettings(prev => ({
        ...prev,
        back: false,
      }));
      setBackMessage("Image successfully deleted.")
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
                {["Cream", "White", "Standard color paper", "Premium color paper"].map((i) => (
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