// server/routes/orderRoutes.js
const express = require('express');
const { createOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

const router = express.Router();

// ✅ Configuration Nodemailer (utilise les variables d'environnement)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ✅ Route pour envoyer l'email à contact@peptidesweight-loss.com
router.post('/send-order-email', async (req, res) => {
  try {
    const { formData, cart, total, shipping, grandTotal } = req.body;

    // Vérification des données
    if (!formData || !cart) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing order data' 
      });
    }

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
    const mailOptions = {
      from: `"Peptide Weight Loss" <contact@peptidesweight-loss.com>`,
      to: 'contact@peptidesweight-loss.com',
      subject: `🛒 New Order from ${formData.firstName} ${formData.lastName}`,
      text: emailContent,
      replyTo: formData.email,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to contact@peptidesweight-loss.com for order from ${formData.firstName} ${formData.lastName}`);

    res.json({ 
      success: true, 
      message: 'Order sent to contact@peptidesweight-loss.com' 
    });

  } catch (error) {
    console.error('❌ Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send email' 
    });
  }
});

// ✅ Routes existantes
router.post('/', createOrder);
router.get('/', protect, getOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;