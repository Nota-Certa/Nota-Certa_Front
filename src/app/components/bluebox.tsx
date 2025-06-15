interface BlueBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function BlueBox({ children, className = "" }: BlueBoxProps) {
  return (
    <div className={`bg-primary-blue text-white w-full flex flex-col items-start py-7 px-20 rounded-lg ${className}`}>
      {children}
    </div>
  );
}
