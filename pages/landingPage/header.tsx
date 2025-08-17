import { useRouter } from "next/router";
import { Playfair_Display, Lato} from 'next/font/google'

const lato = Lato({
  subsets: ['latin'],
  weight: ['400'], // body weight
})

export default function Header() {

  const router = useRouter()

    return(
    <header className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col items-center">
        {/* Logo */}
        <div className="absolute top-6 left-12">
          <span className="text-4xl">BookQuick</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-10 text-lg text-gray-700">
          <a href="#" className="hover:text-black transition-colors">
            
          </a>
          <a href="#" className="hover:text-black transition-colors">
            
          </a>
          <a href="#" className="hover:text-black transition-colors">
            
          </a>
          <a href="#" className="hover:text-black transition-colors">
            
          </a>
        </nav>
        
        {/* Top right button */}
         <div className="absolute top-6 right-12">
          <div className="space-x-6">
            <button onClick={() => router.push('/login')} className="text-2xl cursor-pointer text-black">
              <span className={`${lato.className}`}>log in</span>
            </button>
            <button onClick={() => router.push('/sign-up')} className="text-2xl px-8 py-3 bg-gradient-to-r from-[#FB9A93] to-[#CC4B58] text-white rounded-lg hover:opacity-70 transition cursor-pointer">
              <span className={`${lato.className}`}>Sign up</span>
            </button>
          </div>
        </div>


      </div>
    </header>
    )
}