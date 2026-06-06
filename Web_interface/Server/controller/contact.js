import nodemailer from "nodemailer";

function getEnv(name, fallback = "") {
  const value = process.env[name];
  return value == null ? fallback : String(value).trim();
}

function isValidEmail(email) {
  // Simple validation (good enough for contact forms)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function toBool(value, fallback = false) {
  if (value == null || value === "") return fallback;
  const v = String(value).toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export const getContactConfig = async (req, res) => {
  try {
    // Only return non-sensitive, public display info.
    const publicEmail = getEnv("CONTACT_PUBLIC_EMAIL", getEnv("SUPPORT_TO_EMAIL", ""));
    const publicPhone = getEnv("CONTACT_PUBLIC_PHONE", getEnv("SUPPORT_PHONE", ""));
    const publicLocation = getEnv("CONTACT_PUBLIC_LOCATION", getEnv("SUPPORT_LOCATION", "Pakistan"));
    const responseTime = getEnv(
      "CONTACT_PUBLIC_RESPONSE_TIME",
      getEnv("SUPPORT_RESPONSE_TIME", "This is a final year project — replies depend on availability.")
    );

    return res.status(200).json({
      email: publicEmail,
      phone: publicPhone,
      location: publicLocation,
      responseTime,
    });
  } catch {
    return res.status(200).json({
      email: "",
      phone: "",
      location: "Pakistan",
      responseTime: "This is a final year project — replies depend on availability.",
    });
  }
};

export const sendContactMessage = async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim();
    const subject = String(req.body?.subject || "").trim();
    const message = String(req.body?.message || "").trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    if (name.length > 120 || subject.length > 200 || message.length > 5000) {
      return res.status(400).json({ message: "Message too long" });
    }

    const SMTP_HOST = getEnv("SMTP_HOST", "smtp.gmail.com");
    const SMTP_PORT = Number(getEnv("SMTP_PORT", "465")) || 465;
    const SMTP_SECURE = toBool(getEnv("SMTP_SECURE", "true"), true);
    const SMTP_USER = getEnv("SMTP_USER");
    const SMTP_PASS = getEnv("SMTP_PASS");

    const SUPPORT_TO_EMAIL = getEnv("SUPPORT_TO_EMAIL", SMTP_USER);
    const SUPPORT_FROM_NAME = getEnv("SUPPORT_FROM_NAME", "pakJustice Support");
    const SUPPORT_FROM_EMAIL = getEnv("SUPPORT_FROM_EMAIL", SMTP_USER);

    if (!SMTP_USER || !SMTP_PASS) {
      return res.status(501).json({
        message:
          "Email is not configured. Set SMTP_USER and SMTP_PASS (Gmail App Password) in .env",
      });
    }

    if (!SUPPORT_TO_EMAIL) {
      return res.status(501).json({
        message: "Email is not configured. Set SUPPORT_TO_EMAIL in .env",
      });
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const safeFrom = SUPPORT_FROM_EMAIL || SMTP_USER;

    const mailSubject = `Support: ${subject}`;
    const textBody = [
      `New support message from pakJustice contact form`,
      ``,
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    await transporter.sendMail({
      to: SUPPORT_TO_EMAIL,
      from: `${SUPPORT_FROM_NAME} <${safeFrom}>`,
      replyTo: `${name} <${email}>`,
      subject: mailSubject,
      text: textBody,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2 style="margin:0 0 12px">New support message</h2>
        <p style="margin:0 0 8px"><b>Name:</b> ${escapeHtml(name)}</p>
        <p style="margin:0 0 8px"><b>Email:</b> ${escapeHtml(email)}</p>
        <p style="margin:0 0 8px"><b>Subject:</b> ${escapeHtml(subject)}</p>
        <hr style="border:none;border-top:1px solid #ddd;margin:16px 0"/>
        <pre style="white-space:pre-wrap;margin:0">${escapeHtml(message)}</pre>
      </div>`,
    });

    return res.status(200).json({ message: "Message sent" });
  } catch (err) {
    return res.status(500).json({ message: "Failed to send message" });
  }
};

function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
