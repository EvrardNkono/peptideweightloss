// server/controllers/categoryController.js
const Category = require('../models/Category');

// Helper: generate slug from name
const generateSlug = (name) =>
  name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .trim();

// GET /api/categories — toutes les catégories actives (public)
exports.getCategories = async (req, res) => {
  try {
    const { section } = req.query;
    const query = { isActive: true };
    if (section) query.section = section;

    const categories = await Category.find(query).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories/all — toutes (admin, inclut inactives)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ section: 1, order: 1, createdAt: 1 });
    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    console.error('Error fetching all categories:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories/:id
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/categories — créer (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, icon, color, bgColor, section, description, order } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    const slug = generateSlug(name);

    // Vérifier unicité du slug
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `A category with a similar name already exists (slug: ${slug})`
      });
    }

    const category = await Category.create({
      name,
      slug,
      icon: icon || 'Package',
      color: color || '#2563EB',
      bgColor: bgColor || '#EFF6FF',
      section: section || 'marketplace',
      description: description || '',
      order: order || 0,
      isActive: true
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    console.error('Error creating category:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name already exists' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/:id — modifier (admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name, icon, color, bgColor, section, description, isActive, order } = req.body;

    const existing = await Category.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Recalculer slug si le nom change
    const updatedData = {
      icon: icon ?? existing.icon,
      color: color ?? existing.color,
      bgColor: bgColor ?? existing.bgColor,
      section: section ?? existing.section,
      description: description ?? existing.description,
      isActive: isActive ?? existing.isActive,
      order: order ?? existing.order
    };

    if (name && name !== existing.name) {
      const newSlug = generateSlug(name);
      const conflict = await Category.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
      if (conflict) {
        return res.status(400).json({ success: false, message: 'Category name already exists' });
      }
      updatedData.name = name;
      updatedData.slug = newSlug;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: category });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/categories/:id — supprimer (admin)
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};