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
      <div className="mx-auto text-5xl font-medium px-20 py-5 flex flex-col">
        Help
      </div>

      <div>
        <div className="px-30 py-2 text-2xl font-semibold">
          <span>
            Manuscript settings:
          </span>
        </div>

        <div className="px-30">
          We reccomend a 5x8 trim size for most cost effectiveness.
        </div>
      </div>

      <div>
        <div className="px-30 py-2 text-2xl font-semibold">
          <span>
            Body Matter:
          </span>
        </div>

        <div className="px-30">
          If you don't need to add headings or page numbering, you don't need to.
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
        </div>
      </div>

      <div>
        <div className="px-30 py-2 text-2xl font-semibold">
          <span>
            Cover:
          </span>
        </div>

        <div className="px-30">
          If you have your own cover file you can use it.
        </div>
      </div>

    </div>
    
    )
}