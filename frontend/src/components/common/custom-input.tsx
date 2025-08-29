import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage: string
  
}

const InputWithLabel = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, placeholder, type, label,errorMessage,  ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type}
          ref={ref}
          placeholder={placeholder}
          className={cn(
            "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm  text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none",
            className
          )}
          {...props}
        />
        <Label
          className="absolute -top-2 left-3 bg-white px-1 text-xs text-[#969696] transition-colors peer-focus:text-blue-500"
        >
          {label}
        </Label>
        <div className="mt-1 text-red-500 text-sm">
            <span>{errorMessage}</span>
        </div>
      </div>
    );
  }
);

InputWithLabel.displayName = "InputWithLabel";

export { InputWithLabel };
