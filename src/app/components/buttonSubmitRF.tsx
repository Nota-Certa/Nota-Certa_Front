import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  azul?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

export function ButtonComponent(props: ButtonProps) {
  const content = props.loading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin" />
      Enviando...
    </div>
  ) : (
    props.label
  );

  const buttonClasses = `${props.azul
    ? "bg-[#2B448E] text-white hover:bg-secondary-blue"
    : "bg-white text-primary-blue"
  } hover:text-white font-bold text-xl`;

  if (props.href) {
    return (
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <a href={props.href}>
          <Button className={buttonClasses} disabled={props.disabled || props.loading}>
            {content}
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button
        type={props.type ?? "button"}
        className={buttonClasses}
        onClick={props.onClick}
        disabled={props.disabled || props.loading}
      >
        {content}
      </Button>
    </div>
  );
}
