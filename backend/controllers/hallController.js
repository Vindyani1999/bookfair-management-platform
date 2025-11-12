const Hall = require('../models/hall');
const Stall = require('../models/stall');
const cloudinary = require('../config/cloudinary');

exports.getAllHalls = async (req, res) => {
  try {
    const halls = await Hall.findAll({
      include: [{
        model: Stall,
        attributes: ['id', 'number', 'status']
      }]
    });
    res.json(halls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching halls', error: error.message });
  }
};


exports.getHallById = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id, {
      include: [{
        model: Stall,
        attributes: ['id', 'number', 'status', 'ownerId']
      }]
    });
    
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    res.json(hall);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hall', error: error.message });
  }
};


exports.createHall = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Hall name is required' });
    }

    const hall = await Hall.create({
      name,
      description
    });

    res.status(201).json({
      message: 'Hall created successfully',
      hall
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Hall name already exists' });
    }
    res.status(500).json({ message: 'Error creating hall', error: error.message });
  }
};


exports.updateHall = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    const { name, description } = req.body;

    const updated = await hall.update({
      name: name ?? hall.name,
      description: description ?? hall.description
    });

    res.json({ 
      message: 'Hall updated successfully', 
      hall: updated 
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Hall name already exists' });
    }
    res.status(500).json({ message: 'Error updating hall', error: error.message });
  }
};


exports.deleteHall = async (req, res) => {
  try {
    const hall = await Hall.findByPk(req.params.id);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Check if hall has any stalls
    const stallCount = await Stall.count({ where: { hallId: req.params.id }});
    if (stallCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete hall with existing stalls. Please remove all stalls first.'
      });
    }

    await hall.destroy();
    res.json({ message: 'Hall deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting hall', error: error.message });
  }
};

exports.uploadHallImage = async (req, res) => {
  try {
    const hallId = req.params.id;
    const hall = await Hall.findByPk(hallId);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });

    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'halls',
      resource_type: 'image'
    });

    hall.imageUrl = uploadResult.secure_url;
    await hall.save();

    res.json({
      message: 'Hall image uploaded successfully',
      imageUrl: hall.imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading hall image', error: error.message });
  }
};

// 🆕 Update hall image (replace existing)
exports.updateHallImage = async (req, res) => {
  try {
    const hallId = req.params.id;
    const hall = await Hall.findByPk(hallId);
    if (!hall) return res.status(404).json({ message: 'Hall not found' });

    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });

    // (Optional) Delete old image from Cloudinary if exists
    // Extract public_id from previous URL (if you want)
    // const publicId = hall.imageUrl?.split('/').pop().split('.')[0];
    // if (publicId) await cloudinary.uploader.destroy(`halls/${publicId}`);

    // Upload new image
    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: 'halls',
      resource_type: 'image'
    });

    hall.imageUrl = uploadResult.secure_url;
    await hall.save();

    res.json({
      message: 'Hall image updated successfully',
      imageUrl: hall.imageUrl
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating hall image', error: error.message });
  }
};