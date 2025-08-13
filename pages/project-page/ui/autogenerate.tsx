import { useEffect, useState } from "react"
import { Settings } from "@/types";
import { Button } from "@/components/ui/button";

interface props {
  settings: Settings; // Or use the actual type of your settings object
  setSettings: React.Dispatch<React.SetStateAction<Settings>>
}

export default function Autogenerate({settings, setSettings}: props) {

    return(
      <div className="w-160">
        <div className="flex-1 p-8 space-y-8">

          <div>
            <label className="block font-normal mb-2">Press to automatically generate a pdf that can be uploaded to Amazon KDP:</label>
            <Button className="bg-[#FFD7D7] hover:bg-[#FF8C8E] transition text-black font-normal text-md w-32 h-12">Auto-Generate</Button>
          </div>

          <div className="h-25"/>
          <div className="text-2xl text-red-400">
            *this page currently does nothing and i'm not sure if it should be included.
          </div>
        </div>
      </div>
    )
}