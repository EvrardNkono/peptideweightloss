// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const upload = require('./middleware/upload');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://peptideweightloss-pqw6.vercel.app',
    'https://peptidesweight-loss.com',
    'https://www.peptidesweight-loss.com'
  ],
  credentials: true
}));

// ⚠️ PLUS BESOIN DE SERVEUR STATIQUE POUR LES UPLOADS
// Les fichiers sont maintenant sur Cloudinary
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API Peptide Weight Loss',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      users: '/api/users',
      prescriptions: '/api/prescriptions',
      upload: '/api/upload',
      hero: '/api/hero'
    },
    status: 'online'
  });
});

// ✅ ROUTE POUR LES MAILS (sans toucher aux autres routes)
app.post('/api/send-order-email', async (req, res) => {
  try {
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
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

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/hero', require('./routes/heroRoutes'));

// ✅ Image upload route avec Cloudinary
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({ 
    success: true, 
    imageUrl: req.file.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📧 Email route: POST /api/send-order-email`);
});