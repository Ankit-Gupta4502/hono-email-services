import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Email interface
export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

// Create transporter
const createTransporter = () => {
  // For production, use actual SMTP settings
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send email using nodemailer
 */
export const sendEmail = async (emailData: EmailData): Promise<void> => {
  const { to, subject, text, html } = emailData;
  
  try {
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject,
      text,
      html: html || text,
    });
    
    console.log('Email sent:', info.messageId);
    
    // Log preview URL in development
    if (process.env.NODE_ENV !== 'production' && nodemailer.getTestMessageUrl(info)) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error}`);
  }
};