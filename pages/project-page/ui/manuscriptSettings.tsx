import { useEffect, useState } from "react"
import { Settings } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Infobubble } from "@/components/ui/infobubble";
import { X } from "lucide-react";
import { Fontdropdown } from "@/components/ui/fontdropdown";
import { PlusIcon } from "lucide-react";
import { fetchGoogleFonts } from '@/fonts'
import Combobox from '@/components/ui/combobox'
import { supabase } from "@/lib/supabaseClient";

interface props {
  settings: Settings; // Or use the actual type of your settings object
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  projectId: number
}

export default function ManuscriptSettings({settings, setSettings, projectId}: props) {
  
  const [bleed, setBleed] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [fonts, setFonts] = useState<string[]>([]);

  const [topMargin, setTopMargin] = useState("")
  const [outsideMargin, setOutsideMargin] = useState("")
  const [bottomMargin, setBottomMargin] = useState("")
  const [gutterMargin, setGutterMargin] = useState("")

  const [gutterNotify, setGutterNotify] = useState("")
  
  const [marginCheck, setMarginCheck] = useState(false)

  useEffect(() => {
    setBleed(settings.bleed)

    setTopMargin(String(settings.margin[0]))
    setOutsideMargin(String(settings.margin[1]))
    setBottomMargin(String(settings.margin[2]))
    setGutterMargin(String(settings.margin[3]))

    setMarginCheck(settings.margin_check)

    setFonts(settings.fonts)
    checkGutter()
  }, [])

  const checkGutter = () => {
    const pages = settings.page_count

    if (pages < 150) {
      setGutterNotify("0.375")
    }
    if (pages > 150 && pages < 301) {
      setGutterNotify("0.5")
    }
    if (pages > 300 && pages < 501) {
      setGutterNotify("0.625")
    }
    if (pages > 500 && pages < 701) {
      setGutterNotify("0.75")
    }
    if (pages > 700) {
      setGutterNotify("0.875")
    }
  }

  const handleFontsSelect = (index: number, value: string) => {
        setFonts((prev) =>
            prev.map((item, i) => (i === index ? value : item))
        );
        //fontSettingUpdate()
    }
  const removeFont = (index: number) => {
      setFonts((prev) => prev.filter((_, i) => i !== index))
  }

  const handleChange = (newTrimSize: [number, number]) => {
    setSettings(prev => ({
      ...prev,
      trim_Size: newTrimSize,
    }));
  };

  const handleBleed = (e: boolean | string) => {

    if (e == true) {
      setBleed(true)
      setSettings(prev => ({
        ...prev,
        bleed: true,
      }));
    }

    if (e == false) {
      setBleed(false)
      setSettings(prev => ({
        ...prev,
        bleed: false,
      }));
    }
  }


  const handleMargin = (value: string, side: string) => {
    if (side == "top") {
      setTopMargin(value)
      setSettings(prev => ({
        ...prev,
        margin: [Number(value), prev.margin[1], prev.margin[2], prev.margin[3]],
      }));
    }
    if (side == "outside") {
      setOutsideMargin(value)
      setSettings(prev => ({
        ...prev,
        margin: [prev.margin[0], Number(value), prev.margin[2], prev.margin[3]],
      }));
    }
    if (side == "bottom") {
      setBottomMargin(value)
      setSettings(prev => ({
        ...prev,
        margin: [prev.margin[0], prev.margin[1], Number(value), prev.margin[3]],
      }));
    }
    if (side == "gutter") {
      setGutterMargin(value)
      setSettings(prev => ({
        ...prev,
        margin: [prev.margin[0], prev.margin[1], prev.margin[2], Number(value)],
      }));
    }
  }

  const handleMarginCheck = (e: boolean) => {
    if (e == true) {
      setMarginCheck(e)
      setSettings(prev => ({
        ...prev,
        margin_check: e,
      }));
    }
    if (e == false) {
      setMarginCheck(e)
      setSettings(prev => ({
        ...prev,
        margin_check: e,
      }));
    }
  }

  useEffect(() => {
    fontSettingUpdate(fonts)
  }, [fonts])

  const fontSettingUpdate = (newFonts: string[]) => {
    setSettings(prev => ({
      ...prev,
      fonts: newFonts,
    }));
  }

    return(
      <div className="w-160 flex">
        <div className="flex-1 p-8 space-y-8">

          <div>
            <label className="block font-medium mb-2 text-lg">Trim size:</label>
            <div className="flex space-x-4 items-center">
              <button onClick={() => handleChange([5, 8])} className="px-5 py-2 bg-[#FFD7D7] rounded-lg hover:bg-[#FF8C8E] transition">5x8</button>
              <button onClick={() => handleChange([6, 9])} className="px-5 py-2 bg-[#FFD7D7] rounded-lg hover:bg-[#FF8C8E] transition">6x9</button>
              <button onClick={() => handleChange([7, 10])} className="px-5 py-2 bg-[#FFD7D7] rounded-lg hover:bg-[#FF8C8E] transition">7x10</button>
              <button onClick={() => handleChange([8, 10])} className="px-5 py-2 bg-[#FFD7D7] rounded-lg hover:bg-[#FF8C8E] transition">8x10</button>
              <Infobubble text="This is the size in inches of the final paperback."/>
            </div>
          </div>

          <div className="h-2"></div>

          {/* Bleed */}
          <div>
            <label className="block font-medium mb-2 text-lg">Bleed:</label>

            <div className="flex items-center space-x-5">
               <Checkbox
               checked={bleed}
                onCheckedChange={(e) => handleBleed(e)}
                className="w-6 h-6 rounded-md border-[#FFD7D7] border-2 data-[state=checked]:bg-[#FFD7D7] data-[state=checked]:border-[#FFD7D7]"/>
                
                <span className="mx-2 "> use bleed?</span>
                <div className="-translate-y-0.5">
                  <Infobubble text="Use bleed whenever there are images that will extend to the border of a page."/>
                </div>
            </div>
            
          </div>

          <div className="h-2"></div>

          {/* Margin */}
          <div className="flex flex-col space-y-4">
            <label className="block font-medium mb-2 text-lg">Margin:</label>
              <div className="flex gap-2">
                Top:
                <input 
                type="number"
                value={topMargin} 
                onChange={(e) => setTopMargin(e.target.value)}
                onBlur={(e) => handleMargin(e.target.value, "top")}
                className="outline rounded-2xl pl-4 w-17" />
                <span className="font-extralight">In</span>
              </div>
              <div className="flex gap-2">
                Outside:
                <input 
                value={outsideMargin}
                type="number"
                onChange={(e) => setOutsideMargin(e.target.value)}
                onBlur={(e) => handleMargin(e.target.value, "outside")}        
                className="outline rounded-2xl pl-4 w-17" />
                <span className="font-extralight">In</span>
              </div>
              <div className="flex gap-2">
                Bottom:
                <input 
                value={bottomMargin}
                type="number"
                onChange={(e) => setBottomMargin(e.target.value)}
                onBlur={(e) => handleMargin(e.target.value, "bottom")}     
                className="outline rounded-2xl pl-4 w-17" />
                <span className="font-extralight">In</span>
              </div>
              <div className="flex gap-2">
                Gutter:
                <input 
                value={gutterMargin}
                type="number"
                onChange={(e) => setGutterMargin(e.target.value)}
                onBlur={(e) => handleMargin(e.target.value, "gutter")}     
                className="outline rounded-2xl pl-4 w-17" />
                <span className="font-extralight">In</span>
              </div>

              <div>
                <span className="text-blue-400 text-sm">
                  *You should have a gutter margin of atleast {gutterNotify}" for a book of {settings.page_count} pages
                </span>
              </div>
              
              <div className="-translate-y-0.5">
                  <Infobubble text="Margin represents the extra white-space on the edges. The gutter margin is 'inside' where the book is binded."/>
              </div>

              <div className="flex space-x-3 items-center">
                <input 
                checked={marginCheck}
                type="checkbox"
                onChange={(e) => handleMarginCheck(e.target.checked)}
                
                />
                <span>Enable margin check</span>
                <Infobubble text="The red lines indicate the minimum margins necessary for KDP (0.25 inches on sides and a bit more on the gutter)."/>
              </div>
          </div>
          
          <div className="h-2"></div>

          {/* Fonts */}
          <div>
            <div className="flex space-x-3 items-center">
              <label className="block font-medium mb-2 text-lg">Fonts:</label>             
              <div className="mb-3">
                <Infobubble text="All fonts used in the book must be embedded in the PDF. These fonts can also be used in the body matter with headings and paging."/>
              </div>
            </div>
            <div className="flex space-x-15 items-center">
              {fonts.map((font: string, index: number) => (
                
                <Combobox 
                key={index}
                currentValue={font}
                onSelect={(value: string) => handleFontsSelect(index, value)}
                onRemove={() => removeFont(index)}
                />


                
              ))}
              <button onClick={() => setFonts((prev) => [...prev, ''])} className="w-6 h-6 flex-shrink-0 rounded-full border-[#FFD7D7] border-2 flex items-center justify-center hover:bg-[#FFD7D7] transition">
                <PlusIcon className="w-3 h-3"></PlusIcon>
              </button>
            </div>

          </div>



        </div>
        <div className="bg-red-500">

        </div>
        {/* Preview */}
      </div>
    )
}