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
    <div className="absolute inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center">
      <div className="mx-auto text-4xl font-medium px-20 py-5 flex flex-col">
        Help
      </div>
    </div>
    )
}