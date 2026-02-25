// lib/mail.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderEmail = async (to: string, orderId: string, status: string, trackingNumber?: string) => {
  let subject = "";
  let message = "";
  
  // Construct the public tracking URL using your verified domain
  const trackingUrl = `https://shaz.click/track/${orderId}`;

  switch (status) {
    case "PAID":
      subject = "La Shaz: We've Received Your Order! ✨";
      message = "Your payment was successful. We are now preparing your beauty essentials.";
      break;
    case "SHIPPED":
      subject = "Your Glow is on the Way! 📦";
      // Enhanced tracking display with professional formatting
      const trackingInfo = trackingNumber ? `
        <div style="margin-top: 20px; padding: 20px; background: #fafafa; border: 1px solid #eee; border-radius: 15px; display: inline-block; min-width: 250px;">
          <p style="margin: 0; font-size: 10px; color: #aaa; text-transform: uppercase; letter-spacing: 1px;">Logistics ID</p>
          <p style="margin: 5px 0 0; font-size: 18px; font-weight: bold; color: #D4AF37; font-family: monospace;">${trackingNumber}</p>
        </div>` : "";
      message = `Great news! Your order has been handed to our courier and is now in transit. ${trackingInfo}`;
      break;
    case "DELIVERED":
      subject = "Order Delivered – Enjoy Your Glow! 💄";
      message = "Your La Shaz package has arrived. We can't wait for you to experience the glow.";
      break;
  }

  return await resend.emails.send({
    from: 'La Shaz <support@shaz.click>', 
    to: to, 
    subject,
    html: `
      <div style="background-color: #FDFBF9; padding: 50px 20px; font-family: 'Helvetica', sans-serif; text-align: center; color: #000;">
        <h1 style="font-size: 24px; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 30px; font-weight: 300;">La Shaz</h1>
        
        <div style="background-color: #fff; padding: 40px; border-radius: 30px; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.02); border: 1px solid #f5f5f5;">
          <h2 style="font-size: 12px; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">Order #${orderId.slice(-6).toUpperCase()}</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 25px;">${message}</p>
          
          <!-- <a href="${trackingUrl}" 
             style="display: inline-block; background-color: #000; color: #fff; padding: 18px 35px; border-radius: 100px; text-decoration: none; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease;">
             Track My Glow
          </a> -->

          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 35px 0;" />
          <p style="font-size: 9px; color: #bbb; text-transform: uppercase; letter-spacing: 1px; line-height: 1.5;">
            This is an automated transmission from the<br/>La Shaz Beauty fulfillment Protocol.
          </p>
        </div>
      </div>
    `,
  });
};