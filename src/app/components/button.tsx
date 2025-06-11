import { Button } from "@/components/ui/button";

interface ButtonProps{
    label: string;
    href?: string;
}

export function ButtonComponent(props: ButtonProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <a href={props.href}><Button className="bg-white text-primary-blue hover:bg-secondary-blue hover:text-white font-bold text-xl" >{props.label}</Button></a>
    </div>
  );
}