import { useEffect } from "react";

export default function Help() {

  useEffect(() => {
    const handleVisibilityChange = () => {
      console.log('Document visibility changed:', document.visibilityState);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

    return(
    <div className="absolute inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center space-y-15">
      <div className="mx-auto text-5xl font-medium px-20 mt-5 flex flex-col">
        Guide
      </div>

      <div>
        <div className="px-30 py-2 text-2xl font-semibold">
          <span>
            Manuscript settings:
          </span>
        </div>

        <div className="px-30">
          <span className="font-semibold">Trim size:</span> The selectable trim sizes are the most common ones on Amazon. 5x8 is most reccomended for fiction and is the most cost effective option. You'll select the trim size on your paperback content options.
          <br />
          <br />
          <span className="font-semibold">Bleed:</span> The bleed box should be checked if you have any images in the manuscript that extend to the edges of the page. Extra space needs to be added at the edges so that the images can be printed without a potential white border.
          <br />
          <br />
          <span className="font-semibold">Margins:</span> Books need atleast 0.25 inches of margin on all sides to be print-ready (0.375 inches with bleed) and potentially more on the gutter. The gutter margin is the one connected to the inside binding, and it's minimum size depends on the page count. You can see the necessary margins with the margin checkbox.
          <br />
          <br />
          <span className="font-semibold">Gutter margin:</span> The gutter margin will alternate depending on if the page is right-facing or left-facing (since the gutter margin is always on the inside of the book). From 24 to 150 pages, the inside gutter should be atleast 0.375". From 151 to 300 pages, it should be atleast 0.5". 301 to 500 pages is 0.625", 501 to 700 pages is 0.75", and 701-828 pages is 0.875".
          <br />
          <br />
          <span className="font-semibold">Fonts:</span> All fonts used need to be embedded. The fonts you add here are automatically embedded and can also be used in the body matter. 
        </div>
      </div>

      <div>
        <div className="px-30 py-2 text-2xl font-semibold">
          <span>
            Body Matter:
          </span>
        </div>

        <div className="px-30">
          <span className="font-semibold">Text font:</span> These come from the manuscript settings page, and decide what font the numbering / headings are written in. Choosing "None" will default to Helvetica.
          <br />
          <br />
          <span className="font-semibold">Headings:</span> What you put in the title and name categories will be put on the right / left heading depending on your selection. Vertical margin will bring the headings downward, horizontal margin brings them closer to the middle. The text size is the font size in points.
          <br />
          <br />
          <span className="font-semibold">Page numbering:</span> Enabling this puts automatic page numbering on your PDF. The "Location" changes where the number is on the page. Extra text before and after adds letters before and after teh number on the page (ex. putting a "[" and "]" will appear as "[1]" on page 1). Vertical margin moves the number closer to the middle, the horizontal margin moves it closer to the middle (depending on the chosen location).
        </div>
      </div>

      <div>
        <div className="px-30 py-2 text-2xl font-semibold">
          <span>
            Paging:
          </span>
        </div>

        <div className="px-30">
          This section is optional. If you want to omit page numbering or headings on these pages, you can.
          <br />
          <br />
          <span className="font-semibold">Extra pages:</span> Any pages added here will also be exempt from numbering and headings
        </div>
      </div>

      <div>
        <div className="px-30 py-2 text-2xl font-semibold">
          <span>
            Cover:
          </span>
        </div>

        <div className="px-30">
          Valid cover files consist of a front cover, spine, and back cover, all laid out in a pdf. Based on book information (page count, trim size, paper type, etc.) a proper template will be automatically made for you. You can download the template as is and edit it yourself, or choose to upload images for each part of it.
          <br />
          <br />
          <span className="font-semibold">Uploads:</span> By uploading a front / spine / back image, the template gets filled out, and images get automatically scaled to fit it. Currently only PNG uploads work, but other image types will be supported in the future.
          <br />
          <br />
          <span className="font-semibold">Paper type:</span> The type of paper you choose affects the cover and spine size. You select the paper type on KDP's paperback content page. You can look there for more information on the differences between each type.
        </div>
      </div>

      <div className="h-7" />

    </div>
    
    )
}