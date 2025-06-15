interface TitleProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Title({ children, size = "lg", className="" }: TitleProps) {
  const sizeClass = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-5xl",
  }[size];

  return (
    <h1 className={`${sizeClass} font-bold self-center ${className}`}>
      {children}
    </h1>
  );
}
