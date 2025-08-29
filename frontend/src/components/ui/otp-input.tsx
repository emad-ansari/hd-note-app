import { useState, forwardRef } from "react";
import { EyeOff, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface OTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	value: string;
	errorMessage: string;
}

export const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
	({ label, className, value, errorMessage, ...props }, ref) => {
		const [showOTP, setShowOTP] = useState(false);
		const [isFocused, setIsFocused] = useState(false);

		return (
			<div className="relative w-full">
				{/* Fixed label on border */}
				<Label
					className={cn(
						"absolute -top-2 left-3 bg-white px-1 text-xs transition-colors duration-200",
						isFocused ? "text-blue-500" : "text-[#969696]"
					)}
				>
					{label}
				</Label>

				<input
					ref={ref}
					id={props.id}
					placeholder="Enter OTP"
					type={showOTP ? "text" : "password"}
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
						"w-full px-3 py-3 text-sm rounded-lg bg-white transition-all duration-200 ease-in-out",
						// remove default focus-visible styles
						"focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
						// custom border color
						isFocused
							? "border-blue-500 ring-1 ring-blue-500"
							: "border-gray-300",
						"border pr-10",
						className
					)}
					{...props}
				/>

				{/* Eye/EyeOff toggle */}
				<div
					className={cn(
						"absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 cursor-pointer p-1",
						"hover:bg-gray-100 rounded-full"
					)}
					onClick={() => setShowOTP((prevShow) => !prevShow)}
				>
					{showOTP ? (
						<Eye className="size-5" />
					) : (
						<EyeOff className="size-5" />
					)}
				</div>
				{errorMessage && (
					<p className="text-sm text-red-500">{errorMessage}</p>
				)}
			</div>
		);
	}
);

OTPInput.displayName = "OTPInput";
