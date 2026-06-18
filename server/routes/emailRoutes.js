// server/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/send-order-email
router.post('/send-order-email', async (req, res) => {
  try {
    const { formData, cart, total, shipping, grandTotal } = req.body;

    if (!formData || !cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Missing or invalid order data' });
    }

    const itemsList = cart
      .map(item => `• ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const emailContent = `
🛒 NEW ORDER
${'='.repeat(40)}

--- CUSTOMER ---
Name:  ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone || 'N/A'}

--- SHIPPING ADDRESS ---
${formData.address}${formData.apartment ? ', Apt ' + formData.apartment : ''}
${formData.city}, ${formData.state} ${formData.zipCode}
${formData.country}

--- ITEMS ---
${itemsList}

--- SUMMARY ---
Subtotal:    $${Number(total).toFixed(2)}
Shipping:    $${Number(shipping).toFixed(2)}
Grand Total: $${Number(grandTotal).toFixed(2)}
${formData.orderNotes ? `\n--- NOTES ---\n${formData.orderNotes}` : ''}

${'='.repeat(40)}
📌 Send payment request to: ${formData.email}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: 'Peptide Weight Loss <contact@peptidesweight-loss.com>',
      to: 'contact@peptidesweight-loss.com',
      subject: `🛒 New Order — ${formData.firstName} ${formData.lastName}`,
      text: emailContent,
      reply_to: formData.email,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }

    console.log(`✅ Order email sent — Resend ID: ${data.id}`);
    res.json({ success: true, message: 'Order email sent successfully', id: data.id });

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to send email' });
  }
});

module.exports = router;