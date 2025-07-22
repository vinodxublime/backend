const twilio = require('twilio');
const logger = require('../config/logger');

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS function
const sendSMS = async (options) => {
  try {
    const { phone, message } = options;

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    logger.info(`SMS sent successfully to ${phone}`, {
      sid: result.sid,
      status: result.status
    });

    return {
      success: true,
      sid: result.sid,
      status: result.status
    };
  } catch (error) {
    logger.error(`SMS sending failed: ${error.message}`, {
      phone: options.phone,
      message: options.message
    });
    
    throw new Error(`SMS could not be sent: ${error.message}`);
  }
};

// Send OTP SMS
const sendOTPSMS = async (phone, otp, purpose = 'verification') => {
  const message = `Your OTP code for ${purpose} is: ${otp}. This code will expire in 10 minutes. - ${process.env.APP_NAME}`;

  return await sendSMS({
    phone,
    message
  });
};

// Send notification SMS
const sendNotificationSMS = async (user, notification) => {
  const message = `${notification.title[user.language] || notification.title.en}: ${notification.message[user.language] || notification.message.en} - ${process.env.APP_NAME}`;

  return await sendSMS({
    phone: user.mobile,
    message
  });
};

// Send welcome SMS
const sendWelcomeSMS = async (user) => {
  const message = `Welcome to ${process.env.APP_NAME}, ${user.name}! Thank you for joining our learning platform. Start exploring our resources and programs today!`;

  return await sendSMS({
    phone: user.mobile,
    message
  });
};

// Send bulk SMS
const sendBulkSMS = async (smsData) => {
  const results = [];
  
  for (const sms of smsData) {
    try {
      const result = await sendSMS(sms);
      results.push({ phone: sms.phone, success: true, ...result });
    } catch (error) {
      results.push({ 
        phone: sms.phone, 
        success: false, 
        error: error.message 
      });
    }
  }
  
  return results;
};

// Check SMS delivery status
const checkSMSStatus = async (messageSid) => {
  try {
    const message = await client.messages(messageSid).fetch();
    return {
      sid: message.sid,
      status: message.status,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage
    };
  } catch (error) {
    logger.error(`Failed to check SMS status: ${error.message}`);
    throw new Error(`Could not check SMS status: ${error.message}`);
  }
};

module.exports = {
  sendSMS,
  sendOTPSMS,
  sendNotificationSMS,
  sendWelcomeSMS,
  sendBulkSMS,
  checkSMSStatus
};
