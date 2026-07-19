import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Credentials come exclusively from the environment. Never hardcode them.
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.warn(
    '⚠ EMAIL_USER / EMAIL_PASS are not set — OTP emails will fail until they are configured in .env'
  );
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const otpStore = new Map();


export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Connectify - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Connectify</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your Social Network</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Email Verification</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Thank you for signing up with Connectify! To complete your registration, please use the verification code below:
            </p>
            
            <div style="background: white; border: 2px dashed #667eea; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center;">
              <h1 style="color: #667eea; font-size: 36px; margin: 0; letter-spacing: 5px; font-weight: bold;">${otp}</h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin: 20px 0;">
              This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                © 2024 Connectify. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

// Store OTP with expiration
export const storeOTP = (email, otp) => {
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  otpStore.set(email, { otp, expiresAt });
};

// Verify OTP
export const verifyOTP = (email, inputOTP) => {
  const stored = otpStore.get(email);
  if (!stored) {
    return { valid: false, message: 'OTP not found or expired' };
  }
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: 'OTP expired' };
  }
  
  if (stored.otp !== inputOTP) {
    return { valid: false, message: 'Invalid OTP' };
  }
  
  // Remove OTP after successful verification
  otpStore.delete(email);
  return { valid: true, message: 'OTP verified successfully' };
};

// Clean up expired OTPs
export const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [email, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(email);
    }
  }
};

// Run cleanup every 5 minutes. unref() so this timer never keeps the process
// alive on its own (important for scripts and tests).
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000).unref();
