// lib/mail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderEmail = async (to: string, orderId: string, status: string, trackingNumber?: string) => {
  let subject = "";
  let message = "";
  console.log("Tracking Number:", trackingNumber);

  switch (status) {
    case "PAID":
      subject = "La Shaz: We've Received Your Order! ✨";
      message = "Your payment was successful. We are now preparing your beauty essentials.";
      break;
    case "SHIPPED":
      subject = "Your Glow is on the Way! 📦";
      const trackingInfo = trackingNumber ? `<div style="margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 10px; border: 1px dashed #D4AF37;">
            <p style="margin: 0; font-size: 12px; color: #999; text-transform: uppercase;">Tracking Number</p>
            <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #000;">${trackingNumber}</p>
        </div>` : "";
      message = `Great news! Your order has been handed to our courier and is now in transit. ${trackingInfo}`;
      break;
    case "DELIVERED":
      subject = "Order Delivered – Enjoy Your Glow! 💄";
      message = "Your La Shaz package has arrived.";
      break;
  }

  return await resend.emails.send({
    from: 'La Shaz <support@shaz.click>', 
    to: to, 
    
    subject,
    html: `
      <div style="background-color: #F3E9DC; padding: 40px; font-family: sans-serif; text-align: center;">
        <h1 style="color: #000; letter-spacing: 0.2em; text-transform: uppercase;">La Shaz</h1>
        <div style="background-color: #fff; padding: 30px; border-radius: 20px; margin-top: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <h2 style="color: #D4AF37;">Order #${orderId.slice(-6).toUpperCase()}</h2>
          <p style="color: #333; font-size: 16px;">${message}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
            Official Communication from La Shaz Beauty Protocol
          </p>
        </div>
      </div>
    `,
  });
};