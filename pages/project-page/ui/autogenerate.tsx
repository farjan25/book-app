import { useEffect, useState } from "react"
import { Settings } from "@/types";
import { Button } from "@/components/ui/button";

interface props {
  settings: any; // Or use the actual type of your settings object
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

        </div>
      </div>
    )
}