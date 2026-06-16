// server/create-admin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

// Modèle User simplifié pour la création
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Supprimer l'ancien admin
    await User.deleteOne({ email: 'admin@peptideweightloss.com' });
    console.log('✅ Ancien admin supprimé');
    
    // Hasher le mot de passe manuellement
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('@soa2026', salt);
    
    // Créer le nouvel admin
    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@peptideweightloss.com',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('✅ Admin créé avec succès !');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: @soa2026`);
    console.log(`   Role: ${admin.role}`);
    
    await mongoose.disconnect();
    console.log('✅ Déconnecté');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
};

createAdmin();