import { useState, forwardRef } from "react";
import { EyeOff, Eye } from "lucide-react";
import { Input } from "../ui/input"; // Assuming this is shadcn/ui Input
import { cn } from "@/lib/utils"; // Utility to combine Tailwind classes

interface OTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode; // This prop is not directly used for Eye/EyeOff but kept for interface consistency
  onIconClick?: () => void; // This prop is not directly used for Eye/EyeOff but kept for interface consistency
}

export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ label, icon, className, value: propValue, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState<string>(propValue?.toString() || ""); // Initialize with propValue or empty string

    const [isFocused, setIsFocused] = useState(false);
    // Determine if the label should float (focused or has value)
    const hasValue = password !== ""; // Use internal password state for value check
    const isFloating = isFocused || hasValue;

    return (
      <div className="relative">
        {/* Floating Label */}
        <label
          htmlFor={props.id} // Associate label with the input using its id
          className={cn(
            "absolute bg-white text-[#232323] transition-all duration-200 ease-in-out pointer-events-none px-1 z-10", // Added z-10 to ensure label is on top
            isFloating
              ? "-top-2 left-3 text-xs text-blue-500" // Floating state
              : "top-1/2 left-4 -translate-y-1/2 text-base text-[#232323]", // Resting state
            isFocused && "text-blue-500" // Text color when focused
          )}
        >
          {label}
        </label>

        <Input
          ref={ref}
          id={props.id} // Ensure input has an ID for label association
          type={showPassword ? "text" : "password"}
          value={password} // Bind to internal password state
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={cn(
            "w-full px-3 py-6 text-base rounded-lg bg-white transition-all duration-200 ease-in-out",
            // Override Shadcn's default focus ring to apply our custom blue one
            "focus-visible:outline-none focus-visible:ring-transparent focus-visible:ring-offset-0",
            // This is the crucial part: Directly apply border and ring based on isFocused state
            // Order is important here; this needs to come after base styling but before other potential overrides.
            isFocused
              ? "border-blue-500 ring-1 ring-blue-500" // Blue border and ring when focused
              : "<border-gray-2></border-gray-2>00", // Gray border when not focused
            // Ensure `border` class is also present, as the ternary only switches colors/rings
            "border",
            // Adjust padding-left based on `icon` prop (if it were used for a left icon)
            icon && "pl-12",
            // Adjust padding-right for the Eye/EyeOff icon
            "pr-10", // Added padding-right to prevent text overlapping the eye icon
            className // User provided classes go last for highest specificity
          )}
          onChange={(e) => {
            setPassword(e.target.value);
            props.onChange?.(e); // Propagate change up if an onChange handler is provided
          }}
          {...props}
        />

        {/* Eye/EyeOff Icon for password visibility toggle */}
        <div
          className={cn(
            "absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 cursor-pointer p-1", // Refined positioning and padding
            "hover:bg-gray-100 rounded-full" // Added hover background
          )}
          onClick={() => setShowPassword((prevShow) => !prevShow)}
        >
          {showPassword ? (
            <Eye className="size-5" /> // Adjusted icon size to 4 for better visual balance with py-3
          ) : (
            <EyeOff className="size-5" /> // Adjusted icon size to 4 for better visual balance with py-3
          )}
        </div>
      </div>
    );
  }
);

OTPInput.displayName = "OTPInput";
