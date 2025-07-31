import {useRouter} from "next/router"
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function SignUp() {

  const router = useRouter()


  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) console.error('Signup error:', error.message);
    else console.log('Signed up!');
  };

  const handleButtonClick = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://bookquick-5wxaeepxg-farjan25s-projects.vercel.app/dashboard'
      },
    })
  }


    return(
    <div className="min-h-screen flex flex-col absolute inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center">
      <div className="flex justify-center mt-20">
        <h1 className="text-4xl font-semibold">Welcome to book formatter</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden transform -translate-y-30">
        <div className="flex text-lg">
          <h2>
          If you already have an account, 
        </h2>
        <h2 onClick={() => router.push('/login')} className="text-blue-400 mx-1 cursor-pointer hover:opacity-60">
          log in here
        </h2>
        </div>
        
        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-82 mt-5 px-5 text-lg py-2 border border-[#FFB2B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB2B2]"
        />

        <input
          type="password"
          placeholder="Password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-82 mt-3 px-5 text-lg py-2 border border-[#FFB2B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB2B2]"
        />

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