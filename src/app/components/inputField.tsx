import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface InputFieldProps {
  type: string
  label: string,
  placeholder: string,
  classNameInput?: string,
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputField(props: InputFieldProps) {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      <Label htmlFor="email">{props.label}</Label>
      <Input className={`bg-white text-black w-full ${props.classNameInput} `} type={props.type} placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    </div>
  );
}
