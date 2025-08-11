
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Combobox({
    onSelect,
    onRemove,
    currentValue
  }: {
    onSelect: (value: string) => void;
    onRemove: () => void;
    currentValue: string
  })  {


  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [fonts, setFonts] = React.useState<{ value: string; label: string }[]>([])
  
  const [visibleCount, setVisibleCount] = React.useState(20)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  
  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10
    if (isBottom) {
      console.log("at the bottom")
      setVisibleCount(prev => Math.min(prev + 20, fonts.length))
      console.log(visibleCount)
    }
  }, [fonts.length])

  async function fetchFontsourceFonts() {
    const res = await fetch('https://api.fontsource.org/v1/fonts')
    if (!res.ok) throw new Error('Failed to load fonts')
    return (await res.json()) as Array<{
      id: string
      family: string
      subsets: string[]
      weights: number[]
      styles: string[]
    }>
  }

  React.useEffect(() => {
    fetchFontsourceFonts().then(data => {
      setFonts(data.map(f => ({ value: f.id, label: f.family })))
    })
  }, [])
  
  React.useEffect(() => {
    setValue(currentValue)
  }, [currentValue])
  const [query, setQuery] = React.useState("")

  const filteredFonts = fonts.filter(font =>
    font.label.toLowerCase().includes(query.toLowerCase())
  )






  return (
    <div className="relative group w-[150px]">
          <button
          onClick={onRemove}
            className="absolute -right-10 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center z-10"
            >
              <X size={12} />
          </button>
    <Popover open={open} onOpenChange={setOpen}>
      
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <span className="font-normal">
          {value
            ? fonts.find(font => font.value === value)?.value
            : "Select font..."}
          </span>
          

          <ChevronsUpDown className="opacity-100 group-hover:opacity-0 transition-opacity" />

        </Button>
        
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput 
          placeholder="Search fonts..." 
          className="h-9" 
          onValueChange={(e) => setQuery(e)}
          value={query}
          onBlur={() => setQuery("")}
          />
          <CommandList>
            <CommandEmpty>No font found.</CommandEmpty>
            <CommandGroup
              ref={scrollRef}
              onScroll={handleScroll}
              style={{ maxHeight: 300, overflowY: "auto" }}
            >
              {filteredFonts.slice(0, visibleCount).map(font => (
                <CommandItem
                  key={font.label}
                  value={font.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                    onSelect(currentValue)
                  }}
                >
                  {font.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === font.label ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    </div>
  )
}
