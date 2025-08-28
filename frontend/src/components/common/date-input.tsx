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

export function DatePickerInput() {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = React.useState<Date | undefined>(
		new Date("2025-06-01")
	);
	const [month, setMonth] = React.useState<Date | undefined>(date);
	const [value, setValue] = React.useState(formatDate(date));

	// State for floating label logic
	const [isFocused, setIsFocused] = React.useState(false);
	const hasValue = value !== undefined && value !== "";
	const isFloating = isFocused || hasValue;

	return (
		<div className="flex flex-col gap-3">
			{/* The label is now placed outside the relative div to be directly floating */}
			{/* However, for Shadcn's Label and Input, we typically handle the floating effect
          directly on the label that's next to the input. We'll simulate that here. */}
			<div className="relative">
				{/* Floating Label */}
				<Label
					htmlFor="date" // Associate label with the input
					className={cn(
						"absolute bg-background text-gray-500 transition-all duration-200 ease-in-out pointer-events-none px-1",
						isFloating
							? "left-3 -top-2 text-xs text-[#969696]" // Floating state (blue when floating/focused)
							: "left-10 top-1/2 -translate-y-1/2 text-base text-gray-400", // Resting state (aligned with input text)
						isFocused && "text-blue-500" // Ensure text is blue when focused
					)}
				>
					Date of Birth
				</Label>

				<Input
					id="date"
					value={value}
					placeholder={isFloating ? "" : "June 01, 2025"} // Hide placeholder when label is floating
					// Maintain left padding for the icon
					className={cn(
						"bg-background pl-12 pr-3 py-3 text-base border border-gray-200 rounded-lg h-12",
						"transition-all duration-200 ease-in-out",
						"focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
						// Apply blue border/ring when focused
						isFocused && "border-blue-500 ring-1 ring-blue-500"
					)}
					onFocus={(e) => {
						setIsFocused(true);
						// Open popover on focus
						setOpen(true);
					}}
					onBlur={(e) => {
						// Keep focus state true if popover is open
						// This prevents the label from dropping down if the user clicks the calendar
						setTimeout(() => {
							if (!open) {
								setIsFocused(false);
							}
						}, 100);
					}}
					onChange={(e) => {
						const date = new Date(e.target.value);
						setValue(e.target.value);
						if (isValidDate(date)) {
							setDate(date);
							setMonth(date);
						}
					}}
					onKeyDown={(e) => {
						if (e.key === "ArrowDown") {
							e.preventDefault();
							setOpen(true);
						}
					}}
				/>

				<Popover
					open={open}
					onOpenChange={(newOpenState) => {
						setOpen(newOpenState);
						// If popover closes, and input is not focused, reset focus state
						if (
							!newOpenState &&
							!document.activeElement?.id.includes("date")
						) {
							// Check if input itself is not focused
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
							selected={date}
							captionLayout="dropdown"
							month={month}
							onMonthChange={setMonth}
							onSelect={(date) => {
								setDate(date);
								setValue(formatDate(date));
								setOpen(false);
								setIsFocused(false); // Reset focus after selecting date
							}}
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
