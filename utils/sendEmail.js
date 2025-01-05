const nodemailer = require("nodemailer");
const { senderEmail, emailPassword } = require("../config/keys");

const sendEmail = async ({ emailTo, subject, code, content }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: senderEmail,
      pass: emailPassword,
    },
  });

  const message = {
    to: emailTo,
    subject,
    html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0339d9; color: #333;">
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: black; text-align: center;">Email Verification</h2>
                    <p style="font-size: 16px; line-height: 1.6; text-align: center;">To ${content}, please use the verification code below:</p>
                    <div style="background-color: white; box-shadow: 0 4px 8px rgba(0, 0, 0, 1); padding: 10px; color: black; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p style="text-align: center; font-size: 14px; color: black;">If you did not request this, please ignore this email.</p>
                </div>
            </div>
        `,
  };

  try {
    await transporter.sendMail(message);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendEmail;
