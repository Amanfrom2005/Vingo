import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mainColor = "#ff4d2d";
const secondaryColor = "#fff0ed";
const textColor = "#333333";
const footerColor = "#888888";
const backgroundColor = "#f4f4f7";

// Shared HTML template components
const header = `
  <td align="center" style="padding: 20px 0;">
    <img src="https://res.cloudinary.com/dscuhqpc5/image/upload/v1758892032/vingo-logo_k1mesw.png" alt="vingo Logo" width="150" style="display: block;">
  </td>
`;

const footer = `
  <td align="center" style="padding: 20px 40px; font-family: Arial, sans-serif; font-size: 12px; color: ${footerColor};">
    <p>&copy; ${new Date().getFullYear()} Vingo. All rights reserved.</p>
    <p>We didn't even exist</p>
  </td>
`;

const createStyledTemplate = (content) => `
  <body style="background-color: ${backgroundColor}; margin: 0 !important; padding: 0 !important; font-family: Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; margin-top: 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <tr>${header}</tr>
            <tr>
              <td style="padding: 20px 40px; color: ${textColor}; font-size: 16px; line-height: 1.5;">
                ${content}
              </td>
            </tr>
            <tr>${footer}</tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
`;

// ### Password Reset OTP

export const sendOtpMail = async (to, otp) => {
  const content = `
    <h1 style="color: ${mainColor}; font-size: 24px;">Reset Your Password</h1>
    <p>We received a request to reset the password for your account. Use the One-Time Password (OTP) below to proceed.</p>
    <p style="font-size: 28px; font-weight: bold; color: ${mainColor}; letter-spacing: 4px; margin: 30px 0; padding: 15px; background-color: ${secondaryColor}; border-radius: 5px; text-align: center;">
      ${otp}
    </p>
    <p>This OTP is valid for 5 minutes. If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Password Reset OTP",
    html: createStyledTemplate(content),
  });
};

// ### Delivery Confirmation OTP

export const sendDeliveryOtpMail = async (user, otp) => {
  const content = `
    <h1 style="color: ${mainColor}; font-size: 24px;">Your Delivery Confirmation OTP</h1>
    <p>Hello ${user.fullName},</p>
    <p>Please provide the following One-Time Password (OTP) to your delivery agent to confirm receipt of your order.</p>
    <p style="font-size: 28px; font-weight: bold; color: ${mainColor}; letter-spacing: 4px; margin: 30px 0; padding: 15px; background-color: ${secondaryColor}; border-radius: 5px; text-align: center;">
      ${otp}
    </p>
    <p>This helps us ensure your order is delivered securely. Thank you for choosing us!</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Confirm Your Delivery",
    html: createStyledTemplate(content),
  });
};

// ### New User Welcome

export const userWelcomeEmail = async (user) => {
  const content = `
    <h1 style="color: ${mainColor}; font-size: 24px;">Welcome to Vingo!</h1>
    <p>Hi ${user.fullName},</p>
    <p>We're thrilled to have you join our community! Get ready to discover amazing food and enjoy seamless delivery.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="[Your Website URL]" target="_blank" style="background-color: ${mainColor}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        Start Exploring Now
      </a>
    </p>
    <p>If you have any questions, feel free to contact our support team.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Welcome to Vingo!",
    html: createStyledTemplate(content),
  });
};

// ### Password Reset Success

// In mail.js

export const passwordResetSuccessful = async (user) => { // It receives the 'user' object
  const content = `
    <h1 style="color: ${mainColor}; font-size: 24px;">Your Password Has Been Changed</h1>
    <p>Hello ${user.fullName},</p>
    <p>This email confirms that the password for your account has been successfully updated.</p>
    <p>If you were not the one who made this change, please secure your account immediately by resetting your password again and contact our support team.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="[Your Login URL]" target="_blank" style="background-color: ${mainColor}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        Login to Your Account
      </a>
    </p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email, // This is why we need the whole user object
    subject: "Security Alert: Your Password Was Changed",
    html: createStyledTemplate(content),
  });
};


// ### New Owner Welcome

export const ownerWelcomeEmail = async (owner) => {
  const content = `
    <h1 style="color: ${mainColor}; font-size: 24px;">Welcome Aboard, Partner!</h1>
    <p>Hello ${owner.name},</p>
    <p>We are delighted to welcome you and your business, <b>${owner.businessName}</b>, to the Vingo platform. We look forward to a successful partnership.</p>
    <p>To get started, please log in to your dashboard to set up your menu, hours, and other details.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="[Your Owner Dashboard URL]" target="_blank" style="background-color: ${mainColor}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        Go to Your Dashboard
      </a>
    </p>
    <p>Our team is here to support you every step of the way.</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: owner.email,
    subject: "Welcome to the Vingo Family!",
    html: createStyledTemplate(content),
  });
};

// ### New Delivery Partner Welcome

export const deliveryBoyWelcomeEmail = async (deliveryPartner) => {
  const content = `
    <h1 style="color: ${mainColor}; font-size: 24px;">Welcome to the Team!</h1>
    <p>Hi ${deliveryPartner.name},</p>
    <p>Welcome to the Vingo delivery fleet! We're excited to have you on board as a delivery partner.</p>
    <p>Please complete your profile and training materials in the delivery app to start accepting orders.</p>
    <p style="text-align: center; margin: 30px 0;">
      <a href="[Your Delivery App URL]" target="_blank" style="background-color: ${mainColor}; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
        Open the Delivery App
      </a>
    </p>
    <p>Ride safe, and welcome to the team!</p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: deliveryPartner.email,
    subject: "You're Officially a Vingo Delivery Partner!",
    html: createStyledTemplate(content),
  });
};
