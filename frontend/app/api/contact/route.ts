import { NextResponse } from "next/server";
import connectToDatabase from "@/src/lib/mongodb";
import Contact from "@/src/models/Contact";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    // 1. Connect to MongoDB and save message (wrapped in try-catch so it won't crash if offline/local DNS fails)
    let savedInDb = false;
    let newContactId = "N/A";
    try {
      await connectToDatabase();
      const newContact = await Contact.create({
        name,
        email,
        subject: subject || "No Subject",
        message,
      });
      savedInDb = true;
      newContactId = newContact._id.toString();
    } catch (dbErr: any) {
      console.warn("MongoDB contact logging failed (proceeding to email dispatch):", dbErr.message || dbErr);
    }

    const targetEmail = "zevkapilrc@gmail.com";
    let emailSent = false;
    let methodUsed = "";

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #fafafa; color: #1A1819;">
        <div style="padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; margin-bottom: 16px;">
          <h2 style="margin: 0; color: #6D001A; font-size: 1.5rem;">New Contact Us Submission</h2>
          <p style="margin: 4px 0 0; color: #64748b; font-size: 0.85rem;">HIREVIX Platform</p>
        </div>
        <div style="margin-bottom: 16px;">
          <p style="margin: 6px 0;"><strong style="color: #475569;">Name:</strong> ${name}</p>
          <p style="margin: 6px 0;"><strong style="color: #475569;">Email:</strong> <a href="mailto:${email}" style="color: #6D001A; text-decoration: none;">${email}</a></p>
          <p style="margin: 6px 0;"><strong style="color: #475569;">Subject:</strong> ${subject || "No Subject"}</p>
        </div>
        <div style="padding: 16px; background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; color: #334155;">
          ${message}
        </div>
        <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 0.75rem;">
          Message ID: ${newContactId} (Saved to DB: ${savedInDb ? 'Yes' : 'No'})
        </div>
      </div>
    `;

    // 2. Try sending using Resend REST API if configured
    if (process.env.RESEND_API_KEY) {
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "HIREVIX <onboarding@resend.dev>", // Or custom domain once verified
            to: targetEmail,
            reply_to: email,
            subject: `[HIREVIX Contact] ${subject || "Inquiry"}`,
            html: htmlContent,
          }),
        });

        if (resendResponse.ok) {
          emailSent = true;
          methodUsed = "resend";
        } else {
          const errData = await resendResponse.json();
          console.warn("Resend API failed, will fallback to SMTP if available. Error:", errData);
        }
      } catch (resendError) {
        console.warn("Resend email dispatch error, checking SMTP fallback:", resendError);
      }
    }

    // 3. Fallback to SMTP / Nodemailer if Resend was skipped or failed
    if (!emailSent && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      try {
        const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
        const smtpPort = parseInt(process.env.SMTP_PORT || "465");
        const secureConnection = smtpPort === 465;

        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: secureConnection,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"${name}" <${email}>`,
          to: targetEmail,
          replyTo: email,
          subject: `[HIREVIX Contact] ${subject || "Inquiry"}`,
          html: htmlContent,
          text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
        });

        emailSent = true;
        methodUsed = "smtp";
      } catch (smtpError) {
        console.error("Nodemailer SMTP dispatch error:", smtpError);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Message processed successfully.",
      savedInDb,
      emailSent,
      methodUsed: emailSent ? methodUsed : "none",
      warning: emailSent 
        ? (savedInDb ? undefined : "Message emailed, but database logging failed.")
        : "Email delivery not configured on server (requires RESEND_API_KEY or SMTP_USER/SMTP_PASSWORD in env).",
    });
  } catch (error: any) {
    console.error("Contact Form API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error occurred." },
      { status: 500 }
    );
  }
}
