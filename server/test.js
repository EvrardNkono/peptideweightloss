// server/test.js
console.log('Test 1: Démarrage');
require('dotenv').config();
console.log('Test 2: Dotenv chargé, MONGO_URI:', process.env.MONGO_URI);

const mongoose = require('mongoose');
console.log('Test 3: Mongoose chargé');

const connectDB = async () => {
  try {
    console.log('Test 4: Tentative connexion...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

connectDB();