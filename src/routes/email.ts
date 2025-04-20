import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sendEmail } from '../services/email';

const router = new Hono();

// Email validation schema
const emailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  text: z.string().optional(),

});

// Send email endpoint
router.post(
  '/',
  zValidator('json', emailSchema),
  async (c) => {
    try {
      const { to, subject, text } = c.req.valid('json');

      // Generate a styled HTML template
      const html = `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
            <h2 style="color: #2d7ff9;">Thank you for reaching out!</h2>
            <p style="font-size: 16px; color: #333;">
              We have received your message and our team will get back to you soon.<br>
              <br>
              <strong>Have a wonderful day!</strong>
            </p>
            <hr style="margin: 32px 0;">
            <p style="font-size: 13px; color: #888;">This is an automated response from the Email Service Team.</p>
          </div>
        </div>
      `;

      await sendEmail({
        to,
        subject,
        text: text || '',
        html,
      });

      return c.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      return c.json(
        { success: false, message: 'Failed to send email', error: String(error) },
        500
      );
    }
  }
);

export default router;