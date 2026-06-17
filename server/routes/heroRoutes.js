// server/routes/heroRoutes.js
const express = require('express');
const router = express.Router();
const Hero = require('../models/Hero');
const { protect, admin } = require('../middleware/auth');

// GET - Récupérer le hero
router.get('/', async (req, res) => {
  try {
    let hero = await Hero.findOne({ isActive: true });
    if (!hero) {
      hero = await Hero.create({
        images: ['/images/pept.png'],
        title: 'Premium Peptides For Weight Loss',
        subtitle: 'Your fully licensed corporate distributor for premium peptides, SARMs, and clinical-grade research compounds'
      });
    }
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Mettre à jour le hero (admin uniquement)
router.put('/', protect, admin, async (req, res) => {
  try {
    let hero = await Hero.findOne({ isActive: true });
    if (!hero) {
      hero = new Hero();
    }
    
    hero.images = req.body.images || hero.images;
    hero.title = req.body.title || hero.title;
    hero.subtitle = req.body.subtitle || hero.subtitle;
    hero.updatedAt = Date.now();
    
    await hero.save();
    res.json({ success: true, data: hero });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;