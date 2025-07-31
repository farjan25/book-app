import { useState, useRef } from "react"
import ManuscriptSettings from "./project-page/ui/manuscriptSettings"
import Overview from "./project-page/ui/overview"
import BodyMatter from "./project-page/ui/bodyMatter"
import Paging from "./project-page/ui/paging"
import Cover from "./project-page/ui/cover"
import Autogenerate from "./project-page/ui/autogenerate"
import PdfPreviewer from "./project-page/ui/pdfPreviewer"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { sign } from "node:crypto"
import { processPdf } from "@/services/pdfProcessor"
import { Settings } from '@/types'
import { defaultSettings } from "@/defaultSettings"
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { useSessionTimeout } from "@/services/useSessionTimeout";
import { User, X } from 'lucide-react'
import handler from '@/pages/api/log'

export default function ProjectPage() {

  const router = useRouter();
  const { id } = router.query; // this is the projectId from the URL
  const [isLoading, setIsLoading] = useState(true)

  const [project, setProject] = useState(null)
  const [name, setName] = useState("")
  const [projectId, setProjectId] = useState(0)
  const [settings, setSettings] = useState<Settings>(defaultSettings)

  const [pdfLink, setPdfLink] = useState("")
  const [signed_url, setSignedUrl] = useState("")

  const [blobUrl, setPdfBlobUrl] = useState<string | null>(null);

  const [help, setHelp] = useState(false)
  const [deleteTab, setDeleteTab] = useState(false)

  const [token, setToken] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string | null>("")

  const [sessionCheck, setSessionCheck] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setToken(data.session?.access_token || null);
    });
  }, []);

  const helpRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
  (async () => {
    const saved = localStorage.getItem('unsaved_settings')
    console.log(saved)
    if (saved) {
      const session = await supabase.auth.getSession()
      const token = session.data.session?.access_token

      if (!token) {
        console.warn("No Supabase token found")
        return
      }

      await fetch('/api/saveSettings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: saved,
      })

      localStorage.removeItem('unsaved_settings')
    }
  })()
}, [])

  useSessionTimeout(60 * 60 * 1000, () => {
    setSessionCheck(true)
    console.log("timed out")
    // You could also call an API to destroy the session here
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setHelp(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return; // id might be undefined initially

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        router.push('/unauthorized'); // not owner or project doesn't exist
      } else {
        setProject(data)
        setName(data.name)
        setProjectId(data.id)
        setPdfLink(data.pdf_url)
        setSettings(data.settings)
        setIsLoading(false)

        setSettings(prev => ({
          ...prev,
          project_id: data.id,
        }));
      }
    }; 

    fetchProject();

  }, [id]);

  useEffect(() => {
  const getSignedUrl = async () => {

    const { data, error } = await supabase
      .storage
      .from('pdf')
      .createSignedUrl(pdfLink, 60 * 60); // 1 hour

      if (error) {
        console.error('Error getting signed URL:', error);
        return;
      }

    setSignedUrl(data.signedUrl)
    }; 

      
    if (pdfLink) {
      getSignedUrl()
    }

  }, [pdfLink]);

  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(() => {
      const fetchAndProcessPdf = async () => {
        console.log(settings)
        try {
          console.log(signed_url)
          const processedBlob = await processPdf(signed_url, settings, controller.signal);
          const blobUrl = URL.createObjectURL(processedBlob);
          setPdfBlobUrl(blobUrl);
        } catch (e: any) {
          if (e.name === "AbortError") {
            console.log("PDF fetch/process aborted");
          } else {
            console.error("PDF processing failed:", e);
          }
        }
      };

      if (signed_url) fetchAndProcessPdf();
    }, 700); // wait 700ms after last update

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [signed_url, settings]);

const saveSettings = async() => {
  const { data, error } = await supabase
  .from('projects')
  .update({ settings: settings }) // newSettings is your new object or value
  .eq('id', projectId);

  console.log("saving settings,", data)
  console.log("saving settings,", error)
}

useEffect(() => {
  const interval = setInterval(() => {
    saveSettings();
  }, 100000); // save every 100 seconds

  return () => clearInterval(interval);
}, [settings]);

useEffect(() => {
  console.log("settings chnaged")

  const handlePageLeave = () => {
    const payload = JSON.stringify({ token, settings, projectId });

    // Fire-and-forget API call
    navigator.sendBeacon('/api/saveSettings', payload);

    // Optional: save to localStorage for backup
    //localStorage.setItem('unsaved_settings', payload);
  };

  window.addEventListener('pagehide', handlePageLeave);
  router.events.on('routeChangeStart', handlePageLeave)

  return () => {
    window.removeEventListener('pagehide', handlePageLeave);
    router.events.off('routeChangeStart', handlePageLeave)
  };

  // verify user_id and project id first 
  /*
  const handleBeforeUnload = () => {
    const payload = JSON.stringify({ settings, projectId });
    navigator.sendBeacon('/api/saveSettings', payload);
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  */
}, [settings]);


const download = () => {
  saveSettings()
    const a = document.createElement('a');

  if (tab == 'cover') {
    if (imageUrl) {
      a.href = imageUrl;
      a.download = 'cover.pdf'; // NEED TO CHNAGFE THE FINAL DOCUMENT NAME
      a.click();
    }
  } else {
    if (blobUrl) {
      a.href = blobUrl;
      a.download = 'document.pdf'; // NEED TO CHNAGFE THE FINAL DOCUMENT NAME
      a.click();
    }
  }
}

const deleteProject = async () => {
  setDeleteTab(!deleteTab)

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    console.log(pdfLink)

    const { data: storageData, error: storageError } = await supabase
    .storage
    .from('pdf')       // replace with your actual bucket name
    .remove([pdfLink]) // exact path inside the bucket

    const { data: projectData, error: projectError } = await supabase
    .from("projects") // your table name
    .delete()
    .match({ id: projectId, user_id: user.id})

    if (storageError) {
      console.log(storageError)
    }

  }
  router.push('/dashboard')
}

  const handleImageUrlChange = (value: string) => {
    setImageUrl(value)
  }

  const [tab, setTab] = useState("overview")
  
  const renderMainContent = () => {
    switch (tab) {
    case 'overview':
      return <Overview />
    case 'manuscript-settings':
      return <ManuscriptSettings settings={settings} setSettings={setSettings} projectId={projectId} />
    case 'body-matter':
      return <BodyMatter settings={settings} setSettings={setSettings} projectId={projectId} />
    case 'paging':
      return <Paging settings={settings} setSettings={setSettings} projectId={projectId} />
    case 'cover':
      return <Cover settings={settings} setSettings={setSettings} projectId={projectId} pdfUrl={signed_url} onImageChange={handleImageUrlChange}/>
    case 'auto-generate':
      return <Autogenerate settings={settings} setSettings={setSettings} />
    default:
      return <Overview />
    }
  }

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center text-2xl">
        <div>
          loading...
        </div>
      </div>
    )
  }

    return(
        <div className="flex h-screen">
      {/* Sidebar */}
      <div className="relative w-1/6 bg-[#FFE9E9] flex flex-col">
      {
        name && (
          <div className="p-4 text-sm font-medium flex justify-center">{name}</div>
        )
      }
        
          <div className="text-2xl py-4 font-light space-y-1">
            <div onClick={() => setTab("overview")} className="w-full px-4 py-2 font-medium hover:bg-[#FF8C8E]">
              Overview
            </div>
            <div onClick={() => setTab("manuscript-settings")} className="w-full px-4 py-2 font-medium hover:bg-[#FF8C8E]">
              Manuscript
            </div>
            <div onClick={() => setTab("manuscript-settings")} className="w-full px-8 py-1 hover:bg-[#FF8C8E]">
              trim / bleed / margin
            </div>
            <div onClick={() => setTab("body-matter")} className="w-full px-8 py-1 hover:bg-[#FF8C8E]">
              body matter
            </div>
            <div onClick={() => setTab("paging")} className="w-full px-8 py-1 hover:bg-[#FF8C8E]">
              paging (optional)
            </div>
            <div onClick={() => setTab("cover")} className="px-4 py-2 font-medium hover:bg-[#FF8C8E]">
              Cover
            </div>
            <div onClick={() => setTab("auto-generate")} className="px-4 py-2 font-medium hover:bg-[#FF8C8E]">
              <span className="bg-gradient-to-r from-[#CC4B58] to-[#8E44AD] bg-clip-text text-transparent">Auto Generate</span>
            </div>

            <div className="absolute flex justify-between w-full px-5 text-md bottom-3">
              <div onClick={() => router.push('/dashboard')} className="cursor-pointer">
                <span className="text-xl">&larr;</span>
                <span className="text-xl">back</span>
              </div>

              <div ref={helpRef} onClick={() => setHelp(!help)} className="relative inline-block cursor-pointer">
                <span className="text-xl">help</span>
                {
                  help && (
                    <div className="flex flex-col justify-center space-y-2 items-center w-25 h-30 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#FFE9E9] text-black rounded shadow-lg">
                      <div onClick={() => console.log("working")} className="">
                        <a
                          href="/help"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Help
                        </a>
                      </div>

                      <div onClick={() => setDeleteTab(!deleteTab)} className="text-red-600">
                        <span>Delete</span>
                      </div>
                    </div>
                  )
                }
              </div>
            </div>

          </div>

        

      </div>


      <div className="">
        {renderMainContent()}
      </div>

      {
        deleteTab && (
          <motion.div 
          initial ={{ opacity:0, scale: 0.9}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-80 left-1/2 -translate-x-1/2 w-100 h-50 bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 overflow-y-auto overflow-visible"
          >
            <div className="py-3 px-4 text-center text-xl">
              <h1>
                Are you sure you want to delete this project?
              </h1>
            </div>

            <div className="">
              <button onClick={() => setDeleteTab(!deleteTab)} className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200">
                <X size={18}></X>
              </button>
            </div>

            <div className="flex justify-between px-14 mt-8">
              <Button onClick={deleteProject} className="w-20 h-10 text-lg text-black bg-[#FFE9E9] hover:bg-[#FF8C8E] cursor-pointer">Yes</Button>
              <button onClick={() => setDeleteTab(!deleteTab)} className="w-20 h-10 text-lg cursor-pointer">No</button>
            </div>
                            
          </motion.div>
        )
      }
      
      <div className="flex items-center ml-90">
        <div className="flex flex-col items-center space-y-5">
          <PdfPreviewer pdfUrl={blobUrl} tab={tab} projectId={projectId} imageBlobUrl={imageUrl}/>

          <Button onClick={download} className="bg-[#FFE9E9] text-black font-normal hover:bg-[#FF8C8E] cursor-pointer h-10 shadow-md">
            Download
          </Button>
        </div>
      </div>

      {
        sessionCheck && (
          <motion.div 
          initial ={{ opacity:0, scale: 0.9}}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-80 left-1/2 -translate-x-1/2 w-80 h-47 bg-white border-2 border-gray-200 rounded-2xl shadow-lg p-4 overflow-y-auto overflow-visible"
          >
            <div className="py-3 px-4 text-center text-xl">
              <h1>
                You have timed out. Please reload the page.
              </h1>
            </div>

            <div className="">
              <button onClick={() => window.location.reload()} className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-200">
                <X size={18}></X>
              </button>
            </div>

            <div className="flex mt-5 justify-center">
              <Button onClick={() => window.location.reload()} className="w-20 h-10 text-lg font-normal text-black bg-[#FFE9E9] hover:bg-[#FF8C8E] cursor-pointer">Reload</Button>
            </div>
                            
          </motion.div>
        )
      }
      
    </div>
    )
}