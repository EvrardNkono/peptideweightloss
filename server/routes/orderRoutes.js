// server/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// ✅ Configuration Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bradleymark198@gmail.com',
    pass: process.env.EMAIL_PASS || 'votre-mot-de-passe-app'
  }
});

// ✅ UNIQUEMENT LA ROUTE POUR LES MAILS
router.post('/send-order-email', async (req, res) => {
  try {
    const { formData, cart, total, shipping, grandTotal } = req.body;

    // Construction du message
    const itemsList = cart.map(item => 
      `${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');

    const emailContent = `
🛒 NEW ORDER

--- CUSTOMER ---
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Phone: ${formData.phone}

--- SHIPPING ADDRESS ---
${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}
${formData.city}, ${formData.state} ${formData.zipCode}
${formData.country}

--- ITEMS ---
${itemsList}

--- SUMMARY ---
Subtotal: $${total.toFixed(2)}
Shipping: $${shipping.toFixed(2)}
Total: $${grandTotal.toFixed(2)}

${formData.orderNotes ? `--- NOTES ---\n${formData.orderNotes}` : ''}

---
📌 Send payment request to: ${formData.email}
    `;

    // ✅ Envoi à contact@peptidesweight-loss.com
    await transporter.sendMail({
      from: `"Peptide Weight Loss" <bradleymark198@gmail.com>`,
      to: 'contact@peptidesweight-loss.com',
      subject: `🛒 New Order from ${formData.firstName} ${formData.lastName}`,
      text: emailContent,
      replyTo: formData.email,
    });

    res.json({ success: true, message: 'Order sent to contact@peptidesweight-loss.com' });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;