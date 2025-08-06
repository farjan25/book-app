import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"
import { useState } from "react";

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) console.error('Login error:', error.message);
    else console.log('Logged in!'); router.push('dashboard');
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
          //redirectTo: 'https://bookquick.vercel.app/dashboard',
          redirectTo: 'https://localhost:3000/dashboard'
        },
      });
    }
  }

    return(
    <div className="min-h-screen flex flex-col inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center">
      <div className="flex justify-center mt-20">
        <h1 className="text-4xl font-semibold">Log in</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden transform -translate-y-30">
        <div className="flex text-lg">
          <h2>
          If you don't have an account.
        </h2>
        <h2 onClick={() => router.push('/sign-up')} className="text-blue-400 mx-1 cursor-pointer hover:opacity-60">
          sign up here
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

        <div className="mb-4 mt-2 text-xs text-left -translate-x-20">
          <span className="text-gray-500">forgot your password? </span>
          <a onClick={() => router.push("/reset-password")} className="text-blue-400 hover:opacity-60 cursor-pointer">Reset</a>
        </div>

        <button onClick={handleButtonClick} className="w-40 bg-[#FFB2B2] text-black py-2 rounded-md mb-3 flex items-center justify-center gap-2 hover:bg-[#FF8C8E] transition cursor-pointer space-x-1">
          <span className="font-light">use google</span>
          <img src="/googlepng.png" alt="Google" className="w-4 h-4" />
        </button>
        
        <button onClick={handleLogin} className="w-60 mt-10 bg-[#FFB2B2] text-black py-2 rounded-md mb-3 flex items-center justify-center gap-2 hover:bg-[#FF8C8E] transition cursor-pointer">
          <span className="text-xl">log in</span>
        </button>

      </div>
    </div>
    )
}
