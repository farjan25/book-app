interface props {
    text: string
}

export function Infobubble({text}: props) {
  return (
    <div className="relative group inline-block">
        <div className="w-3 h-3 text-[9px] bg-white outline-1 outliine-gray-30 text-gray-500 rounded-full flex items-center justify-center">
            ?
        </div>
        <div className="flex justify-center absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 text-sm font-light text-black bg-[#FFD7D7] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {text}
        </div>
    </div>
  )
}
