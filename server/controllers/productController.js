// server/controllers/productController.js
const Product = require('../models/Product');

// ✅ Champs autorisés pour la création/mise à jour (AJOUT DE likes)
const allowedFields = [
  'name', 
  'type', 
  'dosage', 
  'moreDetails',
  'description',
  'purity', 
  'price', 
  'oldPrice', 
  'category', 
  'stock', 
  'rating', 
  'reviews', 
  'isPopular', 
  'isNew', 
  'isBestSeller', 
  'image', 
  'status',
  'likes'  // ✅ AJOUT
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
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
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
    
    // ✅ Si moreDetails est vide mais dosage existe, utiliser dosage
    if (!productData.moreDetails && productData.dosage) {
      productData.moreDetails = productData.dosage;
    }
    
    // ✅ Si description est vide, générer une description par défaut
    if (!productData.description && productData.name) {
      productData.description = `Premium ${productData.name} peptide. High purity ${productData.purity || '≥99%'} with guaranteed quality.`;
    }
    
    // ✅ Si likes n'est pas défini, mettre 0 par défaut
    if (productData.likes === undefined) {
      productData.likes = 0;
    }
    
    const product = await Product.create(productData);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
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
    
    // ✅ Récupérer le produit existant pour conserver les valeurs si nécessaire
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // ✅ Si moreDetails n'est pas fourni mais dosage l'est, utiliser dosage
    if (req.body.moreDetails === undefined && req.body.dosage !== undefined) {
      productData.moreDetails = req.body.dosage;
    }
    
    // ✅ Si description n'est pas fournie, garder l'ancienne
    if (req.body.description === undefined) {
      productData.description = existingProduct.description;
    }
    
    // ✅ Si likes n'est pas fourni, garder l'ancienne valeur
    if (req.body.likes === undefined) {
      productData.likes = existingProduct.likes;
    }
    
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      productData, 
      { new: true, runValidators: true }
    );
    
    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting product:', error);
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
    console.error('Error fetching best sellers:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ NOUVELLE FONCTION : Toggle Like (1 like par utilisateur)
exports.toggleLike = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id || req.user._id;
    
    // Vérifier si le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // ✅ Vérifier si l'utilisateur a déjà liké
    const hasLiked = product.likedBy && product.likedBy.includes(userId);
    
    let updatedProduct;
    if (hasLiked) {
      // ✅ Retirer le like (toggle)
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $inc: { likes: -1 },
          $pull: { likedBy: userId }
        },
        { new: true }
      );
    } else {
      // ✅ Ajouter le like
      updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $inc: { likes: 1 },
          $push: { likedBy: userId }
        },
        { new: true }
      );
    }
    
    res.json({
      success: true,
      data: {
        likes: updatedProduct.likes,
        hasLiked: !hasLiked
      }
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};