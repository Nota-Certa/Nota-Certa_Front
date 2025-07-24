import { Input } from "@/components/ui/input";
import { JSX, SVGProps, useState } from "react";

interface BuscaProps {
  onBusca: (termo: string) => void;
}

export default function Busca({ onBusca }: BuscaProps) {
  const [valorBusca, setValorBusca] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setValorBusca(valor);
    onBusca(valor);
  };

  const handleClear = () => {
    setValorBusca("");
    onBusca("");
  };

  return (
    <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5 py-2">
      <SearchIcon className="h-4 w-4" />
      <Input
        type="search"
        placeholder="Buscar notas..."
        className="w-full border-0 h-8 font-semibold"
        value={valorBusca}
        onChange={handleChange}
      />
      {valorBusca && (
        <button
          onClick={handleClear}
          className="h-4 w-4 text-gray-400 hover:text-gray-600"
        >
          <ClearIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ClearIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}