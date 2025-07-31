import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"
import { useState } from "react";

export default function ResetPassword() {

  const router = useRouter()

  const [email, setEmail] = useState('');

  const handleReset = async () => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      //redirectTo: 'https://yourdomain.com/update-password' update password
    })
  };

    return(
    <div className="min-h-screen flex flex-col absolute inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center">
      <div className="flex justify-center p-18">
        <h1 className="text-4xl font-semibold">Reset Password</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden transform -translate-y-30">
        <div className="flex text-lg">
          <h2>
          Enter your information to reset your password
        </h2>
        </div>
        
        <input
          type="email"
          placeholder="Email..."
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-82 mt-5 px-5 text-lg py-2 border border-[#FFB2B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB2B2]"
        />
        
        <button onClick={handleReset} className="w-60 mt-10 bg-[#FFB2B2] text-black py-2 rounded-md mb-3 flex items-center justify-center gap-2 hover:bg-[#FF8C8E] transition cursor-pointer">
          <span className="text-xl">request reset</span>
        </button>

        <button onClick={() => router.push('/update-password')} className="w-60 mt-10 bg-[#FFB2B2] text-black py-2 rounded-md mb-3 flex items-center justify-center gap-2 hover:bg-[#FF8C8E] transition cursor-pointer">
          <span className="text-xl">quick update passowrd button</span>
        </button>

      </div>
    </div>
    )
}
