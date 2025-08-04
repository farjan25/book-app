

export default function Overview() {
    return(
      <div className="w-160 flex">
        <div className="p-8 space-y-8  w-110">

          {/* Line Spacing */}
          <div>
            <label className="block font-medium mb-2">
              Welcome to your project, click here for a guide on how to use the editor.
            </label>
              
          </div>

          {/* Bleed */}
          <div className="">
            <label className="block font-medium mb-2">Checklist:</label>
            <div className="flex flex-col space-y-4">

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">file size</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Marks / comments</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Fonts</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Images / objects</span>
              </div>
              
              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Page spread</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Grayscale fill</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Line width</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Bleed</span>
              </div>


              <div className="h-5"></div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Information matches</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Cover Bleed</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Page numbering / no more than 4 blank pages / 10 blank pages at the end</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Text legibility</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Spine text</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Template Text</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Margins</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Bundling</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Binding</span>
              </div>
            </div>

            
          </div>

          
        </div>
        {/* Preview */}
        <div className="w-60">
          <label className="block font-medium mt-22">Cover Checklist:</label>
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
                <span className="pl-1">file size</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">bleed requirement</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">file size</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">Text legibility</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">borders not reccomended</span>
              </div>

              <div>
                <input 
                type="checkbox"
                //onChange={(e) => handleCheckboxes(e.target.checked, 3)}
                /> 
                <span className="pl-1">embedding</span>
              </div>
          </div>
        </div>
      </div>
      
    )
}