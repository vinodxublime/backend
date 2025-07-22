const nodemailer = require('nodemailer');
const logger = require('../config/logger');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email function
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();

    const message = {
      from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `<p>${options.message}</p>`
    };

    const info = await transporter.sendMail(message);
    
    logger.info(`Email sent successfully to ${options.email}`, {
      messageId: info.messageId,
      response: info.response
    });

    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    logger.error(`Email sending failed: ${error.message}`, {
      email: options.email,
      subject: options.subject
    });
    
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const message = `
    <h2>Welcome to ${process.env.APP_NAME}!</h2>
    <p>Hello ${user.name},</p>
    <p>Thank you for joining our learning platform. We're excited to have you on board!</p>
    <p>You can now access all our resources, programs, and features.</p>
    <p>If you have any questions, feel free to reach out to our support team at ${process.env.SUPPORT_EMAIL}</p>
    <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
  `;

  return await sendEmail({
    email: user.email,
    subject: `Welcome to ${process.env.APP_NAME}!`,
    html: message
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  const message = `
    <h2>Your OTP Code</h2>
    <p>Your OTP code for ${purpose} is: <strong>${otp}</strong></p>
    <p>This code will expire in 10 minutes.</p>
    <p>If you didn't request this code, please ignore this email.</p>
    <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
  `;

  return await sendEmail({
    email,
    subject: `Your OTP Code - ${process.env.APP_NAME}`,
    html: message
  });
};

// Send notification email
const sendNotificationEmail = async (user, notification) => {
  const message = `
    <h2>${notification.title[user.language] || notification.title.en}</h2>
    <p>${notification.message[user.language] || notification.message.en}</p>
    ${notification.content.actionUrl ? `
      <p>
        <a href="${notification.content.actionUrl}" 
           style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          ${notification.content.actionText?.[user.language] || notification.content.actionText?.en || 'View Details'}
        </a>
      </p>
    ` : ''}
    <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
  `;

  return await sendEmail({
    email: user.email,
    subject: notification.title[user.language] || notification.title.en,
    html: message
  });
};

// Send bulk emails
const sendBulkEmails = async (emails) => {
  const results = [];
  
  for (const emailData of emails) {
    try {
      const result = await sendEmail(emailData);
      results.push({ email: emailData.email, success: true, ...result });
    } catch (error) {
      results.push({ 
        email: emailData.email, 
        success: false, 
        error: error.message 
      });
    }
  }
  
  return results;
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOTPEmail,
  sendNotificationEmail,
  sendBulkEmails
};
