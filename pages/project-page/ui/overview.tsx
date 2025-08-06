import { Infobubble } from "@/components/ui/infobubble"

export default function Overview() {
    return(
      <div>
          <div>
            <label className="block font-medium mb-2 p-7 text-xl">
              Welcome to your project, click <a href="/help" target="_blank" rel="noopener noreferrer" className="underline">here</a> for a guide on how to use the editor.
            </label>
          </div>
      <div className="w-180 flex">
        
        <div className="pl-8 space-y-8 w-110">

          {/* Line Spacing */}

          {/* Bleed */}
          <div className="">
            <label className="block text-xl font-medium mb-2">Manuscript checklist:</label>
            <div className="flex flex-col space-y-4">

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">File size below 600 MB</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">No invisible marks / comments</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">All fonts are embedded</span>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <input 
                  type="checkbox"
                  //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                  /> 
                  <span className="pl-1">Images / objects</span>
                </div>
                <Infobubble text="All images are embedded, atleast 300 DPI, and flattened to one layer"/>
              </div>
              
              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Page spread (1 page per row in the pdf)</span>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <input 
                  type="checkbox"
                  //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                  /> 
                  <span className="pl-1">Grayscale fill</span>
                </div>
                <Infobubble text="If the paper is white or cream, a minimum grayscale fill of 10% is reccomended" />
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Line width is atleast 0.75 points in charts, <br></br>tables and other graphic elements</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Bleed is used if any images reach the border of a page</span>
              </div>


              <div className="h-5"></div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Book details and file information match</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">The images on the cover reach the very edge the cover file (cover bleed)</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Page numbering / no more than 4 blank pages / 10 blank pages at the end</span>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <input 
                  type="checkbox"
                  //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                  /> 
                  <span className="pl-1">There is no ilegible text</span>
                </div>
                <Infobubble text="There is no overlapping text and the text is atleast 7 point font" />
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <input 
                  type="checkbox"
                  //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                  /> 
                  <span className="pl-1">Spine text</span>
                </div>
                <Infobubble text="The spine text has at least 0.0625&quot; on each side, and the book has atleast 79 pages for spine text to be valid" />
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">All template text has been removed</span>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <input 
                  type="checkbox"
                  //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                  /> 
                  <span className="pl-1">margins</span>
                </div>
                <Infobubble text="Content doesn't extend past the margins (you can check with the margin checker) and text on the cover doesn't extend past the cover's edge" />
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">No text implies the book is apart of a bundled set</span>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <input 
                  type="checkbox"
                  //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                  /> 
                  <span className="pl-1">Binding</span>
                </div>
                <Infobubble text="No wording implies other types of binding, like 'spiral', 'hard bound', 'leather bound', or 'calendar'" />
              </div>

            </div>

            
          </div>

          
        </div>
        {/* Preview */}
        <div className="w-60">
          <label className="block text-xl font-medium">Cover Checklist:</label>
          <div className="flex flex-col space-y-3">

            <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">79 page minimum for spine text</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">File size below 650 MB</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Cover extends to meet bleed requirement (outside the pink lines)</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Cover text is legible (no overlap, over 7 point font)</span>
              </div>

              <div className="flex items-center space-x-2">
                <div>
                  <input 
                  type="checkbox"
                  //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                  /> 
                  <span className="pl-1">No borders on the cover</span>
                </div>
                <Infobubble text="The printing system may make small errors in cutting out the covers that can be easily seen on borders in the cover, hence why they are not reccomended" />
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Fonts are embedded if the cover PDF has text</span>
              </div>
          </div>
        </div>
      </div>
    </div>
    )
}