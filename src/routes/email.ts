import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sendEmail } from '../services/email';

const router = new Hono();

// Email validation schema
const emailSchema = z.object({
  email: z.string().email(),
  message: z.string().optional(),
  name: z.string().min(1,"Name is required"),
  phone: z.string().optional(),
  date:z.string().optional(),
  destination:z.string().min(1,"Destination is required"),
});




// Send email endpoint
router.post(
  '/',
  zValidator('json', emailSchema),
  async (c) => {
    try {
      const { message,name,phone,date,email,destination } = c.req.valid('json');

      // Generate a styled HTML template
      const html = `
        <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
          <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
            <h2 style="color: #2d7ff9; margin-bottom: 16px;">Travel Enquiry Received</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">
              Thank you for your interest! We have received your enquiry and our team will reach out to you soon.<br>
              <strong>Here are the details you provided:</strong>
            </p>
            <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
              <tr>
                <td style="padding:8px; font-weight:bold; color:#2d7ff9;">Name:</td>
                <td style="padding:8px; color:#333;">${name || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:bold; color:#2d7ff9;">Email:</td>
                <td style="padding:8px; color:#333;">${email}</td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:bold; color:#2d7ff9;">Phone:</td>
                <td style="padding:8px; color:#333;">${phone || 'N/A'}</td>
              </tr>

                <tr>
                <td style="padding:8px; font-weight:bold; color:#2d7ff9;">Destination/Package:</td>
                <td style="padding:8px; color:#333;">${destination || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding:8px; font-weight:bold; color:#2d7ff9;">Preferred Date:</td>
                <td style="padding:8px; color:#333;">${date ? new Date(date).toLocaleDateString() : 'N/A'}</td>
              </tr>


              <tr>
                <td style="padding:8px; font-weight:bold; color:#2d7ff9;">Message:</td>
                <td style="padding:8px; color:#333;">${message || 'N/A'}</td>
              </tr>
           
            </table>
            <hr style="margin: 32px 0;">
            <p style="font-size: 13px; color: #888;">This is an automated response from the Email Service Team.</p>
          </div>
        </div>
      `;

      await sendEmail({
        to:email,
        subject:"Travel Inquiry Received",
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