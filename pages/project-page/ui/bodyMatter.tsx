import { Settings } from "@/types";
import { useState, useEffect } from "react";
import { HeadingSelect } from "@/components/ui/headingSelect";
import { Button } from "@/components/ui/button";
import { Infobubble } from "@/components/ui/infobubble";

interface props {
  settings: any; // Or use the actual type of your settings object
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
  projectId: number
}

export default function BodyMatter({settings, setSettings, projectId}: props) {

  const maxPageNumber = 550

  const [bodyFont, setBodyFont] = useState("")

  const [name, setName] = useState("")
  const [title, setTitle] = useState("")

  const [leftHeading, setLeftHeading]  = useState("")
  const [rightHeading, setRightHeading]  = useState("")

  const [headingSize, setHeadingSize] = useState("")

  const maxPixelNumber = 300
  const [headingHeight, setHeadingHeight] = useState("")
  const [headingMargin, setHeadingMargin] = useState("")

  const [lineSpacing, setLineSpacing] = useState("")

  const [textAfter, setTextAfter] = useState("")
  const [textBefore, setTextBefore] = useState("")

  const [numberingVertical, setNumberingVertical] = useState("")
  const [numberingHorizontal, setNumberingHorizontal] = useState("")

  const [numberingSize, setNumberingSize] = useState("")

  useEffect(() => {
      setBodyFont(settings.body_font)

      setName(settings.author)
      setTitle(settings.book_title)

      setLeftHeading(settings.left_heading)
      setRightHeading(settings.right_heading)

      setHeadingSize(settings.heading_size)

      setHeadingHeight(settings.heading_height)
      setHeadingMargin(settings.heading_side_margin)

      setTextAfter(settings.extra_text_after)
      setTextBefore(settings.extra_text_preceding)

      setNumberingVertical(settings.numbering_vertical)
      setNumberingHorizontal(settings.numbering_horizontal)

      setNumberingSize(settings.numbering_size)

      console.log("how many times doeds this run")
    }, [])

  const fixNumber = (number: string, type: string) => {
    let int = Number(number)
    if (int < 1) {
      int = 1
    }
    if (type == "pixel") {
      if (int > maxPixelNumber) {
        int = maxPixelNumber
      }
    } else {
      if (int > 10000) {
        int = 10000
      }
    }

    if (!Number.isInteger(int)) {
      int = Math.trunc(int)
    }

    return int.toString()
  }

  const blur = (selection: string, page: string) => {

    if (page == "lineSpacing") {
      const int = fixNumber(selection, "pixel")
      setLineSpacing(int)
      setSettings(prev => ({
        ...prev,
        line_spacing: Number(int),
      }));
    }

    if (page == "textAfter") {
      setTextAfter(selection)
      setSettings(prev => ({
        ...prev,
        extra_text_after: selection,
      }));
    }

    if (page == "textBefore") {
      setTextBefore(selection)
      setSettings(prev => ({
        ...prev,
        extra_text_preceding: selection,
      }));
    }

    if (page == "title") {
      setTitle(selection)
      setSettings(prev => ({
        ...prev,
        book_title: selection,
      }));
    }

    if (page == "name") {
      setName(selection)
      setSettings(prev => ({
        ...prev,
        author: selection,
      }));
    }

  }

  const headingSelector = (value: string, side: string) => {
    if (side == "left") {
      setSettings(prev => ({
        ...prev,
        left_heading: value,
      }));
    }
    if (side == "right") {
      setSettings(prev => ({
        ...prev,
        right_heading: value,
      }));
    }
  }

  const handleBodyFont = (value: string) => {
    setBodyFont(value)
    setSettings(prev => ({
      ...prev,
      body_font: value,
    }));
  }
  const handleHeadingHeight = (value: string) => {
    const int = fixNumber(value, "pixel")
    setHeadingHeight(int)
    setSettings(prev => ({
      ...prev,
      heading_height: Number(int),
    }));
  }
  const handleHeadingMargin = (value: string) => {
    const int = fixNumber(value, "pixel")
    setHeadingMargin(int)
    setSettings(prev => ({
      ...prev,
      heading_side_margin: Number(int),
    }));
  }
  const handleHeadingSize = (value: string) => {
    const int = fixNumber(value, "pixel")
    setHeadingSize(int)
    setSettings(prev => ({
      ...prev,
      heading_size: Number(int),
    }));
  }
  const handleNumberingVertical = (value: string) => {
    const int = fixNumber(value, "pixel")
    setNumberingVertical(int)
    setSettings(prev => ({
      ...prev,
      numbering_vertical: Number(int),
    }));
  }
  const handleNumberingHorizontal = (value: string) => {
    const int = fixNumber(value, "pixel")
    setNumberingHorizontal(int)
    setSettings(prev => ({
      ...prev,
    numbering_horizontal: Number(int),
    }));
  }
  const handleNumberingSize = (value: string) => {
    const int = fixNumber(value, "pixel")
    setNumberingSize(int)
    setSettings(prev => ({
      ...prev,
      numbering_size: Number(int),
    }));
  }

  const setPageLocation = (location: string) => {
    setSettings(prev => ({
      ...prev,
      page_number_location: location,
    }));
  }

  const handleCheckboxes = (value: boolean, boxNumber: number) => {
    if (boxNumber == 1) {
      if (value == false) {
        setSettings(prev => ({
          ...prev,
          front_matter_roman_numerals: false,
        }));
      }
      else if (value == true) {
        setSettings(prev => ({
          ...prev,
          front_matter_roman_numerals: true,
        }));
      }
    }

    if (boxNumber == 2) {
      if (value == false) {
        setSettings(prev => ({
          ...prev,
          front_matter_page_numbers: true,
        }));
      }
      else if (value == true) {
        setSettings(prev => ({
          ...prev,
          front_matter_page_numbers: false,
        }));
      }
    }

    if (boxNumber == 3) {
      if (value == false) {
        setSettings(prev => ({
          ...prev,
          back_matter_page_numbers: true,
        }));
      }
      else if (value == true) {
        setSettings(prev => ({
          ...prev,
          back_matter_page_numbers: false,
        }));
      }
    }

    if (boxNumber == 4) {
      if (value == false) {
        setSettings(prev => ({
          ...prev,
          include_front_matter_in_numbering: false,
        }));
      }
      else if (value == true) {
        setSettings(prev => ({
          ...prev,
          include_front_matter_in_numbering: true,
        }));
      }
    }
  }
    // add a none optioon to headings
    // and be able to have 0 heaidng margin
    return(
      <div className="w-160">
        <div className="flex-1 p-8 space-y-8">

          {/* Bleed */}
          <div className="space-y-3 pt-5">
            <div className="flex items-center space-x-5">
              <span className="whitespace-nowrap">text font:</span>
              <select
              value={bodyFont}
              onChange={(e) => handleBodyFont(e.target.value)}
              className="border rounded px-2 py-1"
              >
                <option value="None">
                  None
                </option>
                {settings.fonts.map((font: string) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
              <Infobubble text="Heading/numbering font."/>

            </div>

            <div className="h-5"></div>

            <label className="block font-medium mb-1 text-lg">Headings:</label>

            <div className="flex items-center space-x-4">
            <span className="">Title:</span>
            <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => blur(title, "title")}     
                  className="outline rounded-2xl pl-4 w-30" /> 

            <span>Name:</span>

            <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => blur(name, "name")}     
                  className="outline rounded-2xl pl-4 w-30" /> 

            </div>

            <div className="flex items-center space-x-2">

              <span className="">Left:</span>
              <HeadingSelect value={leftHeading} onChange={(e) => {
                setLeftHeading(e)
                headingSelector(e, "left")
              }} />

              <div className="w-8"></div>
              
              <span className="">Right:</span>
              <HeadingSelect value={rightHeading} onChange={(e) => {
                setRightHeading(e)
                headingSelector(e, "right")
              }} />
            </div>

            <div className="space-x-2">
               <span>Vertical margin:</span>
              <input 
                type="number"
                min="1"
                max={String(maxPixelNumber)}
                value={headingHeight}
                onChange={(e) => setHeadingHeight(e.target.value)}
                onBlur={(e) => handleHeadingHeight(e.target.value)}     
                className="outline rounded-2xl pl-4" /> 
                <span className="font-extralight">px</span>
            </div>
            <div className="space-x-2">
               <span>Horizontal margin:</span>
              <input 
                type="number"
                min="1"
                max={String(maxPixelNumber)}
                value={headingMargin}
                onChange={(e) => setHeadingMargin(e.target.value)}
                onBlur={(e) => handleHeadingMargin(e.target.value)}     
                className="outline rounded-2xl pl-4" />
                <span className="font-extralight">px</span>
            </div>
              
            <div className="space-x-2">
              <span className="whitespace-nowrap">Heading text size:</span>

              <input 
                type="number"
                min="1"
                max={String(maxPixelNumber)}
                value={headingSize}
                onChange={(e) => setHeadingSize(e.target.value)}
                onBlur={(e) => handleHeadingSize(e.target.value)}     
                className="outline rounded-2xl pl-4 w-15" />
                <span className="font-extralight">px</span>
            </div>

          </div>

          
          <div className="h-8"></div>

          <div>
            <label className="block font-medium mb-2 text-lg">Page Numbering:</label>
            <div className="space-y-3">
              <span className="">location:</span>
              <div className="flex space-x-4 pt-1">
                <Button onClick={() => setPageLocation("top_right")} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-26 h-11">
                  top right
                </Button>
                <Button onClick={() => setPageLocation("top_middle")} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-26 h-11">
                  top middle
                </Button>
                <Button onClick={() => setPageLocation("top_left")} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-26 h-11">
                  top left
                </Button>
                <Button onClick={() => setPageLocation("bottom_right")} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-26 h-11">
                  bottom right
                </Button>
                <Button onClick={() => setPageLocation("bottom_middle")} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-26 h-11">
                  bottom middle
                </Button>
                <Button onClick={() => setPageLocation("bottom_left")} className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal w-26 h-11">
                  bottom left
                </Button>
              </div>

              <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>extra text after:</span>
                <input 
                  type="text"
                  value={textAfter}
                  onChange={(e) => setTextAfter(e.target.value)}
                  onBlur={() => blur(textAfter, "textAfter")}     
                  className="outline rounded-2xl pl-4" /> 
              </div>

              <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>extra text before:</span>
                <input 
                  type="text"
                  value={textBefore}
                  onChange={(e) => setTextBefore(e.target.value)}
                  onBlur={() => blur(textBefore, "textBefore")}     
                  className="outline rounded-2xl pl-4" /> 
              </div>

              <div className="space-x-4">
                <span className="whitespace-nowrap">Vertical margin:</span>

                <input 
                  type="number"
                  min="1"
                  max={String(maxPixelNumber)}
                  value={numberingVertical}
                  onChange={(e) => setNumberingVertical(e.target.value)}
                  onBlur={(e) => handleNumberingVertical(e.target.value)}     
                  className="outline rounded-2xl pl-4 w-15" />
                  <span className="font-extralight">px</span>
              </div>

              <div className="space-x-4">
                <span className="whitespace-nowrap">Horizontal margin:</span>

                <input 
                  type="number"
                  min="1"
                  max={String(maxPixelNumber)}
                  value={numberingHorizontal}
                  onChange={(e) => setNumberingHorizontal(e.target.value)}
                  onBlur={(e) => handleNumberingHorizontal(e.target.value)}     
                  className="outline rounded-2xl pl-4 w-15" />
                  <span className="font-extralight">px</span>
              </div>

              <div className="space-x-4">
                <span className="whitespace-nowrap">text size:</span>

                <input 
                  type="number"
                  min="1"
                  max={String(maxPixelNumber)}
                  value={numberingSize}
                  onChange={(e) => setNumberingSize(e.target.value)}
                  onBlur={(e) => handleNumberingSize(e.target.value)}     
                  className="outline rounded-2xl pl-4 w-15" />
                  <span className="font-extralight">px</span>
              </div>

              
            </div>
          </div>

        </div>
        {/* Preview */}
      </div>
    )
}