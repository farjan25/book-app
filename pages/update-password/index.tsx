import { supabase } from "@/lib/supabaseClient"
import { error } from "console";
import { useRouter } from "next/router"
import { useState } from "react";

export default function updatePassword() {

  const router = useRouter()

  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const [message, setMessage] = useState('')

  const handlePasswordUpdate = async () => {
    if (password == retypePassword) {
      const { data, error } = await supabase.auth.updateUser({
        password,
      })

        if (error) {
            setMessage('Error updating password: ' + error.message )
        } else {
            setMessage('Password updated successfully!')
            router.push("/")
        }
    } else {
        setMessage('Passwords are not the same')
    }
  }

    return(
    <div className="min-h-screen flex flex-col absolute inset-0 z-0 bg-[url('/mainbackground.png')] bg-cover bg-no-repeat bg-center">
      
      <div className="flex justify-center p-18">
        <h1 className="text-4xl font-semibold">Reset Password</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden transform -translate-y-30">
        <div className="flex text-lg translate-y-2">
          <h2>
          Enter your new password:
          </h2>
        </div>
        
        <input
          type="password"
          placeholder="New Password..."
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-82 mt-5 px-5 text-lg py-3 border border-[#FFB2B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB2B2]"
        />

        <div className="flex text-lg translate-y-2">
          <h2>
          Re-type your password:
          </h2>
        </div>
        
        <input
          type="password"
          placeholder="Re-typed Password..."
          value={retypePassword}
          onChange={e => setRetypePassword(e.target.value)}
          className="w-82 mt-5 px-5 text-lg py-2 border border-[#FFB2B2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB2B2]"
        />

        
        
        <button onClick={handlePasswordUpdate} className="w-60 mt-10 bg-[#FFB2B2] text-black py-2 rounded-md mb-3 flex items-center justify-center gap-2 hover:bg-[#FF8C8E] transition cursor-pointer">
          <span className="text-xl">Reset</span>
        </button>
        
        
        <p className="text-lg text-red-400">{message}</p>
        

      </div>
    </div>
    )
}
