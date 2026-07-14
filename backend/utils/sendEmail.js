import axios from "axios";

// Generic email sender (Brevo API se) - purane nodemailer wale sendEmail ki jagah
export const sendEmail = async (email, subject, message) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
        subject,
        htmlContent: `<p>${message}</p>`,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully via Brevo");
  } catch (error) {
    console.log("Email error:", error.response?.data || error.message);
  }
};

// OTP ke liye dedicated function (formatted HTML ke saath)
export const sendOTPEmail = async (toEmail, otp) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: process.env.BREVO_SENDER_NAME, email: process.env.BREVO_SENDER_EMAIL },
        to: [{ email: toEmail }],
        subject: "Your OTP Code",
        htmlContent: `<p>Your OTP is <b>${otp}</b>. It expires in 10 minutes.</p>`,
      },
      { headers: { "api-key": process.env.BREVO_API_KEY, "Content-Type": "application/json" } }
    );
    console.log("OTP email sent successfully via Brevo");
  } catch (error) {
    console.log("OTP email error:", error.response?.data || error.message);
    throw error; // ✅ ab controller ka catch kaam karega
  }
};