import type React from "react";

import { useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	icon?: React.ReactNode;
	onIconClick?: () => void;
}

const FloatingLabelInput = forwardRef<
	HTMLInputElement,
	FloatingLabelInputProps
>(({ label, icon, className, value, ...props }, ref) => {
	const [isFocused, setIsFocused] = useState(false);
	const hasValue = value !== undefined && value !== "";
	const isFloating = isFocused || hasValue;

	return (
		<div className="relative">
			<input
				ref={ref}
				value={value}
				onFocus={(e) => {
					setIsFocused(true);
					props.onFocus?.(e);
				}}
				onBlur={(e) => {
					setIsFocused(false);
					props.onBlur?.(e);
				}}
				className={cn(
					"w-full px-3 py-3 text-base border border-gray-200 rounded-lg bg-white transition-all duration-200 ease-in-out",
					"focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
					icon && "pl-12",
					// This is the key change: apply the blue border and ring based on the internal isFocused state
					isFocused && "border-blue-500 ring-1 ring-blue-500",
					className
				)}
				{...props}
			/>

			<label
				className={cn(
					"absolute bg-white text-typography transition-all duration-200 ease-in-out pointer-events-none px-1",
					isFloating
						? "-top-2 left-3 text-xs text-gray-400"
						: "top-1/2 left-4 -translate-y-1/2 text-base",
					isFocused && "text-blue-500",
					icon && !isFloating && "left-12"
				)}
			>
				{label}
			</label>

			{/* Icon */}
			{icon && (
				<div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#232323]">
					{icon}
				</div>
			)}
		</div>
	);
});

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
