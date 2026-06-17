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
    'https://peptidesweight-loss.com'
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
      hero: '/api/hero'  // ✅ AJOUTÉ
    },
    status: 'online'
  });
});

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/hero', require('./routes/heroRoutes'));  // ✅ AJOUTÉ

// ✅ Image upload route avec Cloudinary
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  res.json({ 
    success: true, 
    imageUrl: req.file.path  // ✅ Cloudinary retourne l'URL complète
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});