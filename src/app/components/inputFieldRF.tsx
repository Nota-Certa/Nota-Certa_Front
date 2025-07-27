import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  classNameInput?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, classNameInput, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-y-2 w-full">
        <Label htmlFor={rest.name}>{label}</Label>
        <Input
          ref={ref}
          className={`bg-white text-black w-full ${classNameInput}`}
          {...rest}
        />
      </div>
    );
  }
);

InputField.displayName = "InputField";
