// server/controllers/productController.js
const Product = require('../models/Product');

// ✅ Champs autorisés pour la création/mise à jour
const allowedFields = [
  'name', 'type', 'dosage', 'purity', 'price', 'oldPrice', 
  'category', 'stock', 'rating', 'reviews', 'isPopular', 'isNew', 
  'isBestSeller', 'image', 'status', 'description'
];

exports.getProducts = async (req, res) => {
  try {
    const { type, category, search, minPrice, maxPrice } = req.query;
    let query = { status: 'active' };
    
    if (type) query.type = type;
    if (category && category !== 'all') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    // ✅ Filtrer uniquement les champs autorisés
    const productData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        productData[field] = req.body[field];
      }
    });
    
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    // ✅ Filtrer uniquement les champs autorisés
    const productData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        productData[field] = req.body[field];
      }
    });
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      productData, 
      { new: true, runValidators: true }
    );
    
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Nouvelle fonction : Récupérer les Best Sellers
exports.getBestSellers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;
    
    // D'abord, récupérer les produits marqués isBestSeller
    let products = await Product.find({ 
      status: 'active', 
      isBestSeller: true 
    }).sort({ rating: -1 });
    
    // Si moins que la limite, compléter avec les produits populaires
    if (products.length < limit) {
      const remaining = limit - products.length;
      const popularProducts = await Product.find({ 
        status: 'active', 
        isPopular: true,
        isBestSeller: { $ne: true }
      }).sort({ rating: -1 }).limit(remaining);
      
      products = [...products, ...popularProducts];
    } else {
      // Si plus que la limite, prendre les 8 premiers
      products = products.slice(0, limit);
    }
    
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};