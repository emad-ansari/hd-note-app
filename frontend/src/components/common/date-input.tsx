"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface DatePickerInputProps {
	value: Date | undefined;
	onChange: (date: Date | undefined) => void;
	errorMessage: string;
}

function formatDate(date: Date | undefined) {
	if (!date) {
		return "";
	}

	const day = date.getDate().toString().padStart(2, "0"); // Ensures "01" instead of "1"
	const month = date.toLocaleString("en-US", { month: "long" });
	const year = date.getFullYear();

	// Construct the string in "Day Month Year" format
	return `${day} ${month} ${year}`;
}

function isValidDate(date: Date | undefined) {
	if (!date) {
		return false;
	}
	return !isNaN(date.getTime());
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
	value,
	onChange,
	errorMessage,
}) => {
	const [open, setOpen] = React.useState(false);
	const [month, setMonth] = React.useState<Date | undefined>(value);
	const [isFocused, setIsFocused] = React.useState(false);

	return (
		<div className="flex flex-col gap-1">
			<div className="relative">
				<Label
					htmlFor="date"
					className={cn(
						"absolute -top-2 left-3 px-1 text-xs transition-colors duration-200",
						"bg-background", // so it overlaps the border cleanly
						isFocused ? "text-blue-500" : "text-[#969696]"
					)}
				>
					Date of Birth
				</Label>

				<Input
					id="date"
					value={formatDate(value)}
					placeholder="01 June 2025"
					readOnly
					className={cn(
						"bg-background pl-12 pr-3 py-3 text-base border rounded-lg h-12",
						"transition-colors duration-200",
						isFocused
							? "border-blue-500 ring-1 ring-blue-500"
							: "border-gray-300"
					)}
					onFocus={() => {
						setIsFocused(true);
						setOpen(true);
					}}
					onBlur={() => {
						setTimeout(() => {
							if (!open) setIsFocused(false);
						}, 100);
					}}
				/>

				<Popover
					open={open}
					onOpenChange={(newOpenState) => {
						setOpen(newOpenState);
						if (
							!newOpenState &&
							!document.activeElement?.id.includes("date")
						) {
							setIsFocused(false);
						}
					}}
				>
					<PopoverTrigger asChild>
						<Button
							id="date-picker"
							variant="default"
							// Adjusted 'left-0' to 'left-1' to move the button slightly inward
							className="absolute top-1/2 left-1 size-10 -translate-y-1/2 px-2 py-2 flex items-center justify-center rounded-l-lg bg-transparent hover:bg-transparent cursor-pointer"
						>
							<CalendarIcon className="size-4 text-gray-500" />
							<span className="sr-only">Select date</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent
						className="w-auto overflow-hidden p-0"
						align="end"
						alignOffset={-8}
						sideOffset={10}
					>
						<Calendar
							mode="single"
							selected={value ?? undefined}
							captionLayout="dropdown"
							month={month}
							onMonthChange={setMonth}
							onSelect={(date) => {
								onChange(date ?? undefined);
								setOpen(false);
								setIsFocused(false);
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
			{errorMessage && (
				<p className="text-sm text-red-500">{errorMessage}</p>
			)}
		</div>
	);
};
