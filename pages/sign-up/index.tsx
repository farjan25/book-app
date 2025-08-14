import {useRouter} from "next/router"
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignUp() {

  const router = useRouter()


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState("")

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      switch (error.status) {
        case 400: // Bad request
          if (error.message.includes("already registered")) {
            setErrorMessage("*This email is already in use. Try logging in instead.")
          } else if (error.message.includes("Password should be")) {
            setErrorMessage("*Your password is too weak. Please choose a stronger one.")
          } else {
            setErrorMessage("*Invalid signup details. Please check your info.")
          }
          break;

        case 422: // Invalid format
          setErrorMessage("*The entered details are either duplicated or in an invalid format.")
          break;

        case 429: // Rate limited
          setErrorMessage("*Too many signup attempts. Please wait and try again.")
          break;

        default:
          setErrorMessage("*Something went wrong. Please try again.")
      }
    } else {
      setErrorMessage("")
      window.location.href = '/dashboard';
    };
    
  };

  const handleButtonClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      // User already logged in, redirect manually
      window.location.href = '/dashboard';
    } else {
      // Start OAuth login
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://bookquick.vercel.app/dashboard',
        },
      });
    }
  }


    return(
    <div className="min-h-screen flex flex-col absolute inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center">
      <div className="flex justify-center mt-20">
        <span className="text-4xl font-semibold text-black">Welcome to book formatter</span>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden transform -translate-y-30">
        <div className="flex text-lg">
          <span className="text-black">
          If you already have an account, 
        </span>
        <span onClick={() => router.push('/login')} className="text-blue-400 mx-1 cursor-pointer hover:opacity-60">
          log in here
        </span>
        </div>
        
        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-82 mt-5 px-5 text-lg py-2 border border-[#FFB2B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB2B2] text-black"
        />

        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-82 mt-3 px-5 text-lg py-2 border border-[#FFB2B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB2B2] text-black"
        />

        <div className="py-5">
          <span className="text-red-500 text-lg">
            {errorMessage}
          </span>
        </div>

        <button onClick={handleButtonClick} className="w-40 mt-5 bg-[#FFB2B2] text-black py-2 rounded-md mb-3 flex items-center justify-center gap-2 hover:bg-[#FF8C8E] transition cursor-pointer">
          <span className="font-light">use google</span>
          <img src="/googlepng.png" alt="Google" className="w-4 h-4" />
        </button>

        <button onClick={handleSignup} className="w-60 mt-10 bg-[#FFB2B2] text-black py-2 rounded-md mb-3 flex items-center justify-center gap-2 hover:bg-[#FF8C8E] transition cursor-pointer">
          <span className="text-xl">sign up</span>
        </button>

      </div>
    </div>
    )
}