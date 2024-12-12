import { sendEmail } from "../nodeMailer/sendMail.js";
import "dotenv/config.js";

const sendMesssage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email address" });
    }
    await sendEmail(
      email,
      "Thank you for visit my Portfolio",
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px; background-color: #f9f9f9;">
          <h2 style="color: #4caf50; text-align: center;">Thank You for Reaching Out, ${name}!</h2>
          <p style="font-size: 16px; color: #333;">
            I appreciate your time and interest in visiting my portfolio. It means a lot to me! If you have any questions, want to collaborate, or discuss opportunities, feel free to reach out. I'm always happy to connect!
          </p>
          <p style="font-size: 16px; color: #333;">
            Here’s a quick summary of what I do:
            <ul>
              <li>Passionate full-stack developer</li>
              <li>Proficient in modern web technologies</li>
              <li>Committed to delivering top-quality solutions</li>
            </ul>
          </p>
          <p style="font-size: 16px; color: #333;">
            I’ll get back to you shortly. Meanwhile, feel free to check out more of my work or follow me on social media for updates.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://github.com/Pad-coder" style="margin-right: 10px; color: #4caf50; text-decoration: none;">GitHub</a> |
            <a href="https://www.linkedin.com/in/padmanaban2002/" style="margin-left: 10px; color: #4caf50; text-decoration: none;">LinkedIn</a>
          </div>
          <footer style="margin-top: 20px; font-size: 14px; color: #888; text-align: center;">
            <p>Thank you once again, and I hope to hear from you soon!</p>
            <p>&copy; ${new Date().getFullYear()} Pad_coder. All rights reserved.</p>
          </footer>
        </div>`
    );

    await sendEmail(
      process.env.EMAIL,
      "NEW VISIT",
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
  <div style="background-color: #4caf50; padding: 20px; text-align: center; color: white;">
    <h1 style="margin: 0; font-size: 24px;">New Visit Alert!</h1>
  </div>

 
  <div style="padding: 20px; background-color: #f9f9f9;">
    <h2 style="font-size: 20px; color: #333; margin-bottom: 10px;">Visitor Details:</h2>
    <p style="font-size: 16px; margin: 10px 0; color: #555;">
      <strong>Name:</strong> ${name}
    </p>
    <p style="font-size: 16px; margin: 10px 0; color: #555;">
      <strong>Message:</strong>
    </p>
    <blockquote style="border-left: 4px solid #4caf50; padding-left: 10px; color: #666; font-style: italic;">
      ${message}
    </blockquote>
  </div>

  <!-- Footer -->
  <div style="background-color: #4caf50; padding: 10px; text-align: center; color: white;">
    <p style="margin: 0; font-size: 14px;">&copy; ${new Date().getFullYear()} Pad_coder. All rights reserved.</p>
  </div>
</div>
`
    );

    res.status(200).json({ message: `message send succefully` });
  } catch (error) {
    console.log("Error in send message controller", error.message);
    res.status(500).json({
      error: "Intrenal Server Error",
    });
  }
};

export default sendMesssage;
