import { useRouter } from 'next/router'
import { Outfit } from 'next/font/google'
import { useState } from 'react'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

import { Playfair_Display, Lato} from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // pick weights you need
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['400'], // body weight
})

export default function Body() {
  const router = useRouter()

  const getStartedClick = () => {
    router.push('/dashboard'); 
  };

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);


    return(
      <div>

        <div className='flex items-center justify-center mt-40 font-medium'>
          <h1 className={`${playfair.className} text-8xl`}>
            Get your book out in <span className='italic'>minutes. </span>
          </h1>
        </div>
        
        <div className='flex items-center justify-center mt-10'>
          <h2 className={`${lato.className} text-2xl font-normal`}>
            Instantly format beautiful books, and get published on Amazon KDP effortlessly.
          </h2>
        </div>

        <div className='flex justify-center mt-15'>
          <button onClick={getStartedClick} className=" w-50 py-4 text-xl bg-gradient-to-r from-[#CC4B58] to-[#FB9A93] text-white rounded-full hover:opacity-70 font-normal cursor-pointer drop-shadow-lg 
          transition-all duration-300 ease-in-out hover:scale-105
          ">
              <span className={`${lato.className}`}>UPLOAD HERE</span>
          </button>
        </div>

        <div className='flex justify-center mt-15'>
          <img src="/bookquick.png" alt="Google" className='w-400 rounded-3xl  shadow-[0_0_20px_rgba(255,201,188,0.8),0_0_40px_rgba(255,201,188,0.5)]'/>
        </div>

        <div className='flex justify-center mt-30'>
          <h3 className={`${playfair.className} text-5xl font-medium`}>
            If you're trying to self-publish on Amazon KDP...
          </h3>
        </div>
        <div className='flex justify-center mt-4'>
          <span className={`${playfair.className} text-4xl font-normal`}>
            Look no further!
          </span>
        </div>

        <div className='flex justify-center mt-15'>
          <img src="/amazonkdp.png" alt="Google" className='w-100'/>
        </div>

        <div className='flex items-center justify-center mt-40 font-medium'>
          <h4 className={`${playfair.className} text-6xl`}>
            What can BookQuick do for you?
          </h4>
        </div>

        <div className='w-4/5 mt-40'>
          <div className='flex justify-center'>
            <span className='text-5xl'>
              Full manuscript customization:
            </span>
          </div>
          <div className='flex justify-center mt-5'>
            <span className='text-3xl text-center'>
              You can edit trim size, margins, <br />
              pagination, headings, fonts, <br />
              and more
            </span>
          </div>
        </div>

        <div className='flex mt-60'>

          <div className='w-1/5'>
            <img></img>
          </div>

          <div className='w-4/5 '>
            <div className='flex justify-center'>
              <span className='text-5xl'>
                Autogenerate
              </span>
            </div>
            <div className='flex justify-center mt-5'>
              <span className='text-3xl text-center'>
                Automatically generate a KDP-ready manuscript
              </span>
            </div>
          </div>
        </div>

        <div className='w-4/5 mt-60'>
          <div className='flex justify-center'>
            <span className='text-5xl'>
              Templates
            </span>
          </div>
          <div className='flex justify-center mt-5'>
            <span className='text-3xl text-center'>
              Effortless plug and play templates
              for book matter
            </span>
          </div>
        </div>

        <div className='flex justify-center mt-60'>
          <span className={`${playfair.className} text-7xl font-medium`}>
            FAQ
          </span>
        </div>

        <div className='mt-20'>
          <div className='flex justify-center mt-10'>
            <button onClick={() => setOpen1(!open1)} className='bg-[#FAC4C4] w-250 h-18 rounded-3xl text-4xl drop-shadow-lg opacity-70 cursor-pointer'>
              <span className=''>How much does this cost?</span>
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              open1 ? "max-h-40 mt-4" : "max-h-0"
            }`}
          >
            <p className="text-2xl text-center">
              It's completely free! I just need people to test out what I made
            </p>
          </div>

          <div className='flex justify-center mt-10'>
            <button onClick={() => setOpen2(!open2)} className='bg-[#FAC4C4] w-250 h-18 rounded-3xl text-4xl drop-shadow-lg opacity-70 cursor-pointer'>
              <span className=''>Is there a guide on how to use BookQuick?</span>
            </button>
          </div>
          
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              open2 ? "max-h-40 mt-4" : "max-h-0"
            }`}
          >
            <p className="text-2xl text-center">
              Yes. You'll find it on the first page of your project. We highly reccomend <br /> using it to help get your formatting KDP-compliant
            </p>
          </div>

          <div className='flex justify-center mt-10'>
            <button onClick={() => setOpen3(!open3)} className='bg-[#FAC4C4] w-250 h-18 rounded-3xl text-4xl drop-shadow-lg opacity-70 cursor-pointer'>
              <span className=''>Is anything done the with manuscript data?</span>
            </button>
          </div>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              open3 ? "max-h-40 mt-4" : "max-h-0"
            }`}
          >
            <p className="text-2xl text-center">
              All manuscript and cover data is stored securely and not used in <br /> anything apart from editing in the app
            </p>
          </div>

          <div className='flex justify-center mt-10'>
            <button onClick={() => setOpen4(!open4)} className='bg-[#FAC4C4] w-250 h-18 rounded-3xl text-4xl drop-shadow-lg opacity-70 cursor-pointer'>
              <span className=''>I'd like to request a feature. Where can I do that?</span>
            </button>
          </div>
        </div>

        <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              open4 ? "max-h-40 mt-4" : "max-h-0"
            }`}
          >
            <p className="text-2xl text-center">
              We'd love to add new features that you might want. Email us at ....
            </p>
        </div>

        {
          /*
          <div className='flex justify-center mt-60'>
            <span className={`${playfair.className} text-7xl font-medium`}>
              Use BookQuick for free now:
            </span>
          </div>
        */
        }
        <div className='flex justify-center mt-40'>
          <button onClick={getStartedClick} className=" w-110 py-6 text-xl bg-gradient-to-r from-[#FAC4C4] to-[#FB9A93] text-white rounded-full hover:opacity-70 font-normal cursor-pointer drop-shadow-lg 
          transition-all duration-300 ease-in-out hover:scale-105
          ">
              <span className={`${lato.className} text-3xl`}>GET STARTED HERE</span>
          </button>
        </div>


        <div className='h-30'/>

      </div>
    )
}