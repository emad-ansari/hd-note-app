import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	dateOfBirth: Date;
	otp?: string | undefined;
	otpExpires?: Date | undefined;
}

const userSchema = new Schema<IUser>(
	{
		username: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		dateOfBirth: { type: Date, required: true },
		otp: { type: String },
		otpExpires: { type: Date },
	},
	{ timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
