import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

const CartoriosSearch = ({ value, onChange, placeholder }: Props) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "Buscar por cidade, nome do cartório ou tabelião..."}
        className="pl-12 h-12 rounded-full bg-white text-gray-900 border-0 shadow-sm placeholder:text-gray-500"
      />
    </div>
  );
};

export default CartoriosSearch;
