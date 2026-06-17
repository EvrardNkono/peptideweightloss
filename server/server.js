// server/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const upload = require('./middleware/upload');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS — identique à l'original + www + options preflight
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://peptideweightloss-pqw6.vercel.app',
    'https://peptidesweight-loss.com',
    'https://www.peptidesweight-loss.com'  // ✅ ajout
  ],
  credentials: true
}));
app.options('*', cors());  // ✅ seul vrai ajout nécessaire

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

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/hero', require('./routes/heroRoutes'));

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.json({ success: true, imageUrl: req.file.path });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));