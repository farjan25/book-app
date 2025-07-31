import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type MySelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export function HeadingSelect({ value, onChange }: MySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select heading type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="name">Name</SelectItem>
        <SelectItem value="title">Title</SelectItem>
        <SelectItem value="nothing">Nothing</SelectItem>
      </SelectContent>
    </Select>
  );
}