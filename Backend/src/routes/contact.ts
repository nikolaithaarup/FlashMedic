// Backend/src/routes/contact.ts
import { Request, Response, Router } from "express";

const router = Router();

type ContactBody = {
  name: string | null;
  email: string | null;
  message: string;
  appName?: string;
  appVersion?: string;
  platform?: string;
  deviceInfo?: string;
};

router.post(
  "/send",
  async (req: Request<unknown, unknown, ContactBody>, res: Response) => {
    try {
      const {
        name,
        email,
        message,
        appName,
        appVersion,
        platform,
        deviceInfo,
      } = req.body;

      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
      }

      // For now, just log it – later you can add email, DB, Discord webhook etc.
      console.log("==== New contact message from FlashMedic ====");
      console.log("Name:      ", name ?? "(not provided)");
      console.log("Email:     ", email ?? "(not provided)");
      console.log("Message:   ", message);
      console.log("App:       ", appName ?? "unknown", appVersion ?? "");
      console.log("Platform:  ", platform ?? "unknown");
      console.log("Device:    ", deviceInfo ?? "unknown");
      console.log("============================================");

      return res.status(200).json({ ok: true });
    } catch (err) {
      console.error("Error in /contact/send:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
