import { useState, useEffect } from "react"
import { Settings } from "@/types";
import { PlusIcon } from "lucide-react";

interface props {
  settings: any; // Or use the actual type of your settings object
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  projectId: number
}


export default function Paging({settings, setSettings, projectId}: props) {
    
  const [halfTitle, setHalfTitle] = useState("")
  const [title, setTitle] = useState("")
  const [copyright, setCopyright] = useState("")
  const [dedications, setDedications] = useState("")
  const [toc1, setToc1] = useState("")
  const [toc2, setToc2] = useState("")

  const [chapterPage, setChapterPage] = useState("")

  const [references, setReferences] = useState("")
  const [background, setBackground] = useState("")
  const [index, setIndex] = useState("")

  const [extraPages, setExtraPages] = useState<string[]>([]);

  useEffect(() => {
    setHalfTitle(settings.half_title)
    setTitle(settings.title)
    setCopyright(settings.copyright)
    setDedications(settings.dedications)
    setToc1(settings.table_of_contents[0])
    setToc2(settings.table_of_contents[1])
    
    setChapterPage(settings.chapter_title_page)

    setReferences(settings.bibliography)
    setBackground(settings.author_background)
    setIndex(settings.index)

    setExtraPages(settings.extra_pages)
      
  }, [])

  const handleExtraPages = () => {
    const cleanedPages = extraPages.filter(page => page !== '');

    setExtraPages(cleanedPages);

    setSettings(prev => ({
      ...prev,
      extra_pages: cleanedPages,
    }));
  }
 
      const fixNumber = (number: string) => {
        let int = Number(number)
        if (int < 1) {
          int = 0
        }
        if (int > 10000) {
          int = 10000
        }
        if (!Number.isInteger(int)) {
          int = Math.trunc(int)
        }
    
        return int.toString()
      }
    
      const blur = (number:string, page: string) => {
        if (page == "half_title") {
          const int = fixNumber(number)
          setHalfTitle(int)
          setSettings(prev => ({
            ...prev,
            half_title: Number(halfTitle),
          }));
        }
        if (page == "title") {
          const int = fixNumber(number)
          setTitle(int)
          setSettings(prev => ({
            ...prev,
            title: Number(title),
          }));
        }
        if (page == "copyright") {
          const int = fixNumber(number)
          setCopyright(int)
          setSettings(prev => ({
            ...prev,
            copyright: Number(copyright),
          }));
        }
        if (page == "dedications") {
          const int = fixNumber(number)
          setDedications(int)
          setSettings(prev => ({
            ...prev,
            dedications: Number(dedications),
          }));
        }
        if (page == "toc1") {
          const int = fixNumber(number)
          setToc1(int)
          setSettings(prev => ({
            ...prev,
            table_of_contents: [Number(toc1), prev.table_of_contents[1]],
          }));
        }
        if (page == "toc2") {
          const int = fixNumber(number)
          setToc2(int)
          setSettings(prev => ({
            ...prev,
            table_of_contents: [prev.table_of_contents[0], Number(toc2)],
          }));
        }
        if (page == "chapterPage") {
            const int = fixNumber(number)
            setChapterPage(int)
            setSettings(prev => ({
                ...prev,
                chapter_title_page: Number(int),
            }));
        }
        if (page == "references") {
            const int = fixNumber(number)
            setReferences(int)
            setSettings(prev => ({
                ...prev,
                bibliography: Number(int),
            }));
        }
        if (page == "background") {
            const int = fixNumber(number)
            setBackground(int)
            setSettings(prev => ({
                ...prev,
                author_background: Number(int),
            }));
        }
        if (page == "index") {
            const int = fixNumber(number)
            setIndex(int)
            setSettings(prev => ({
                ...prev,
                index: Number(int),
            }));
        }
      }
  
  const handleAddingPage = () => {
    if (extraPages.length < 59) {
      setExtraPages((prev) => [...prev, ''])
    }
  }


    return(
      <div className="w-160">
        <div className="flex-1 p-8 space-y-4">

            {/* Line Spacing */}
          <div>
            <span className="text-lg">Labelled pages are exempt from headings and optionally page numbering</span>        
          </div>
          <div>
            <label className="block font-medium mb-2">Half title:</label>
            <input 
                type="number"
                min="1"
                max="550"
                value={halfTitle}
                onChange={(e) => setHalfTitle(e.target.value)}
                onBlur={() => blur(halfTitle, "half_title")}     
                className="outline rounded-2xl pl-4 w-16" />
          </div>

          {/* Bleed */}
          <div>
            <label className="block font-medium mb-2">Title:</label>
            <input 
                type="number"
                min="1"
                max="550"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => blur(title, "title")}     
                className="outline rounded-2xl pl-4 w-16" />
          </div>

          {/* Trim Size */}
          <div>
            <label className="block font-medium mb-2">Copyright page:</label>
            <input 
                type="number"
                min="1"
                max="550"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                onBlur={() => blur(copyright, "copyright")}     
                className="outline rounded-2xl pl-4 w-16" />
          </div>

          {/* Fonts */}
          <div>
            <label className="block font-medium mb-2">Dedications:</label>
            <input 
                type="number"
                min="1"
                max="550"
                value={dedications}
                onChange={(e) => setDedications(e.target.value)}
                onBlur={() => blur(dedications, "dedications")}     
                className="outline rounded-2xl pl-4 w-16" />
          </div>

          <div>
            <label className="block font-medium mb-2">Table of Contents:</label>
            <div className="flex items-center space-x-2">
                <input 
                  type="number"
                  min="1"
                  max="550"
                  value={toc1}
                  onChange={(e) => setToc1(e.target.value)}
                  onBlur={() => blur(toc1, "toc1")}     
                  className="outline rounded-2xl pl-4 w-16" />
                  <span>to</span>
                  <input 
                  type="number"
                  min="1"
                  max="550"
                  value={toc2}
                  onChange={(e) => setToc2(e.target.value)}
                  onBlur={() => blur(toc2, "toc2")}     
                  className="outline rounded-2xl pl-4 w-16" />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-2">Chapter Title Page:</label>
            <input 
              type="number"
              min="1"
              max="550"
              value={chapterPage}
              onChange={(e) => setChapterPage(e.target.value)}
              onBlur={() => blur(chapterPage, "chapterPage")}     
              className="outline rounded-2xl pl-4 w-16" />
          </div>

          <div>
            <label className="block font-medium mb-2">Bibliography / References:</label>
            <input 
                type="number"
                min="1"
                max="550"
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                onBlur={() => blur(references, "references")}     
                className="outline rounded-2xl pl-4 w-16" />
          </div>

          {/* Bleed */}
          <div>
            <label className="block font-medium mb-2">Author Background:</label>
            <input 
                type="number"
                min="1"
                max="550"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
                onBlur={() => blur(background, "background")}     
                className="outline rounded-2xl pl-4 w-16" />
          </div>

          {/* Trim Size */}
          <div>
            <label className="block font-medium mb-2">Index:</label>
            <input 
                type="number"
                min="1"
                max="550"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                onBlur={() => blur(index, "index")}     
                className="outline rounded-2xl pl-4 w-16" />
          </div>

          <div>
            <label className="block font-medium mb-2">extra pages:</label>
            <div className="grid grid-cols-12 gap-x-18 gap-y-2">
              {extraPages.map((pageNumber: string, index: number) => (
              
                <div className="">
                  <input 
                  type="number"
                  value={pageNumber}
                  onChange={(e) => {
                      const newPages = [...extraPages];      // Step 1: Copy the array
                      newPages[index] = e.target.value;      // Step 2: Replace at index
                      setExtraPages(newPages);               // Step 3: Update state
                    }}
                  onBlur={() => {handleExtraPages()}}     
                  className="outline rounded-2xl pl-4 w-16 " />

                </div>
                              
              ))}
              <button onClick={handleAddingPage} className="w-6 h-6 flex-shrink-0 rounded-full border-[#FFD7D7] border-2 flex items-center justify-center hover:bg-[#FFD7D7] transition">
                <PlusIcon className="w-3 h-3"></PlusIcon>
              </button>
            </div>
          </div>
         
        </div>
      </div>
    )
}