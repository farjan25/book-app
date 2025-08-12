import { useRouter } from "next/router";


export default function Header() {

  const router = useRouter()

    return(
    <header className="w-full">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-4">

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
            <button onClick={() => router.push('/login')} className="cursor-pointer">
              Log in
            </button>
            <button onClick={() => router.push('/sign-up')} className="px-8 py-3 text-medium bg-[#CC4B58] text-white rounded-lg hover:bg-[#ED6674] transition cursor-pointer">
              Sign up
            </button>
          </div>
        </div>


      </div>
    </header>
    )
}