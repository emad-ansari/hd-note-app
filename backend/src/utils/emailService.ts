import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const USER_EMAIL = process.env.EMAIL_FROM;
    const USER_PASSWORD = process.env.EMAIL_PASS;
    
    if (!USER_EMAIL || !USER_PASSWORD) {
      throw new Error('EMAIL_FROM and EMAIL_PASS must be set in environment variables');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: USER_EMAIL,
        pass: USER_PASSWORD, 
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  async sendOTP(email: string, otp: string, username: string): Promise<boolean> {
    const subject = 'Your OTP from HD Notes';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">Welcome to HD Notes!</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #007bff; margin: 0;">Hello ${username},</h3>
          <p style="margin: 15px 0; color: #555;">
            Your One-Time Password (OTP) for verification is:
          </p>
          <div style="background-color: #007bff; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="margin: 15px 0; color: #666; font-size: 14px;">
            This OTP is valid for 5 minutes. Please do not share it with anyone.
          </p>
        </div>
        <p style="color: #888; text-align: center; font-size: 12px;">
          If you didn't request this OTP, please ignore this email.
        </p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, html });
  }

  async sendWelcomeEmail(email: string, username: string): Promise<boolean> {
    const subject = 'Welcome to HD Notes';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; text-align: center;">🎉 Welcome to HD Assignment!</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #28a745; margin: 0;">Hello ${username},</h3>
          <p style="margin: 15px 0; color: #555;">
            Your account has been successfully created and verified! You can now:
          </p>
          <ul style="color: #555;">
            <li>Create and manage your notes</li>
            <li>Access your personalized dashboard</li>
            <li>Enjoy a seamless user experience</li>
          </ul>
        </div>
        <p style="color: #888; text-align: center; font-size: 12px;">
          Thank you for choosing HD Notes!
        </p>
      </div>
    `;

    return this.sendEmail({ to: email, subject, html });
  }
}

export const emailService = new EmailService();
