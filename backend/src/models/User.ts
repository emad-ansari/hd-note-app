import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	username: string;
	email: string;
	dateOfBirth: Date;
	otp?: string | undefined;
	otpExpires?: Date | undefined;
	isEmailVerified: boolean;
	lastLogin?: Date;
}

const userSchema = new Schema<IUser>(
	{
		username: { 
			type: String, 
			required: true,
			trim: true,
			minlength: 2,
			maxlength: 50
		},
		email: { 
			type: String, 
			required: true, 
			unique: true,
			trim: true,
			lowercase: true,
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
		},
		dateOfBirth: { 
			type: Date, 
			required: true,
			validate: {
				validator: function(value: Date) {
					return value < new Date();
				},
				message: 'Date of birth must be in the past'
			}
		},
		otp: { type: String },
		otpExpires: { type: Date },
		isEmailVerified: { type: Boolean, default: false },
		lastLogin: { type: Date }
	},
	{ timestamps: true }
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>("User", userSchema);
