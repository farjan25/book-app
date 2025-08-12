import { useRouter } from 'next/router'
import { Outfit } from 'next/font/google'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export default function Body() {
  const router = useRouter()

  const getStartedClick = () => {
    router.push('/dashboard'); 
  };

    return(
      <main className=" text-gray-800">

        <div className='flex items-center'>
          <section className=" min-h-[80vh] flex flex-col items-start justify-center pl-90">
            <h1 className="text-4xl sm:text-6xl font-semibold mb-4 py-5">
              A KDP formatting tool
            </h1>
            
            <p className="text-2xl mb-6 font-normal">
              I made a small website to fix some common kdp issues.  <br /> <br />
              You can upload your pdf's and edit them <br /> Currently a work in progress.
            </p>
            

            <button onClick={getStartedClick} className="mt-8 px-8 py-4 text-xl bg-gradient-to-r from-[#CC4B58] to-[#a35ddd] text-white rounded-lg hover:opacity-70 transition font-normal cursor-pointer" style={{
              backgroundImage: "linear-gradient(120deg, #CC4B58 20%, #a35ddd 110%)",
            }}>
              UPLOAD HERE
            </button>
          </section>
          <div>

          </div>
          <div className='w-160'>
            <img src="/pdficon.png" alt="Google" className='rotate-12'/>
          </div>
          
        </div>
        
      {/* Hero Section */}
      

      </main>
    )
}