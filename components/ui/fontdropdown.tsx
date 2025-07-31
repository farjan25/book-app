import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { X } from "lucide-react";
  import { useState } from "react";
  
  export function Fontdropdown({
    selectedValue,
    onSelect,
    onRemove,
  }: {
    selectedValue: string | null;
    onSelect: (value: string) => void;
    onRemove: () => void;
  })  {
  
    const [visible, setVisible] = useState(true);
    
  
    if (!visible) return null
  
    return (
      <div className="relative group w-[150px]">
        <button
        onClick={(e) => {
            e.stopPropagation();
            onRemove()
          }}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center z-10"
          >
            <X size={12} />
        </button>
        <Select onValueChange={(value) => onSelect(value)}>
        
        <SelectTrigger className="w-[150px] bg-white rounded-3xl">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
  
  
        <SelectContent>
  
          <SelectGroup>
            <SelectLabel>Fonts</SelectLabel>
            <SelectItem value="UChicago">UChicago</SelectItem>
            <SelectItem value="Yale">Yale</SelectItem>
            <SelectItem value="USC">USC</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      </div>
      
    )
  }
  