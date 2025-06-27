import { Button } from "@/components/ui/button";

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ButtonComponent(props: ButtonProps) {
  if (props.href) {
    return (
      <div className="flex flex-wrap items-center gap-2 md:flex-row">
        <a href={props.href}>
          <Button
            className="bg-white text-primary-blue hover:bg-secondary-blue hover:text-white font-bold text-xl"
            disabled={props.disabled}
          >
            {props.label}
          </Button>
        </a>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button
        className="bg-white text-primary-blue hover:bg-secondary-blue hover:text-white font-bold text-xl"
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.label}
      </Button>
    </div>
  );
}